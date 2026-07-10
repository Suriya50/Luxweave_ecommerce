const Product = require('../models/Product');
const Category = require('../models/Category');

// ✅ Helper: Extract uploaded image URLs (Cloudinary gives full URLs)
const extractUploadedImages = (req) => {
  if (req.files && req.files.length > 0) {
    return req.files.map(file => file.path || file.secure_url || file.location);
  }
  if (req.body.images && Array.isArray(req.body.images)) {
    return req.body.images;
  }
  return [];
};

// Helper: safely parse JSON fields (sizes, colors, specs)
const parseJSON = (str) => {
  if (!str) return undefined;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

// ─── GET /api/products (with filters, pagination, search) ───
const getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      gender,
      sizes,      // comma-separated string
      colors,     // comma-separated string
      minPrice,
      maxPrice,
      rating,
      sort,
      page = 1,
      limit = 12,
      featured,
      search,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (gender) filter.gender = gender;
    if (sizes) {
      const sizeArray = sizes.split(',').filter(Boolean);
      if (sizeArray.length) filter.sizes = { $in: sizeArray };
    }
    if (colors) {
      const colorArray = colors.split(',').filter(Boolean);
      if (colorArray.length) filter.colors = { $in: colorArray };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (featured === 'true') filter.isFeatured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    const sortOptions = {};
    if (sort === 'priceAsc') sortOptions.price = 1;
    else if (sort === 'priceDesc') sortOptions.price = -1;
    else if (sort === 'popular') sortOptions.rating = -1;
    else sortOptions.createdAt = -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/products/:id ───
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('reviews.user', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/products (admin) ───
const createProduct = async (req, res) => {
  try {
    let images = extractUploadedImages(req);
    if (images.length === 0 && req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images;
    }

    const productData = { ...req.body };

    // Parse JSON fields (sent as strings from FormData)
    if (typeof productData.sizes === 'string') {
      const parsed = parseJSON(productData.sizes);
      if (Array.isArray(parsed)) productData.sizes = parsed;
    }
    if (typeof productData.colors === 'string') {
      const parsed = parseJSON(productData.colors);
      if (Array.isArray(parsed)) productData.colors = parsed;
    }
    if (typeof productData.specifications === 'string') {
      const parsed = parseJSON(productData.specifications);
      if (typeof parsed === 'object' && parsed !== null) {
        productData.specifications = parsed;
      }
    }

    // If categoryName is sent instead of category ID
    if (productData.categoryName) {
      const category = await Category.findOne({ name: productData.categoryName });
      if (category) productData.category = category._id;
      delete productData.categoryName;
    }

    productData.images = images;
    delete productData.existingImages; // not needed for creation

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/products/:id (admin) ───
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 1. Newly uploaded images (Cloudinary URLs)
    const newImages = extractUploadedImages(req);

    // 2. Existing images from request (if user removed some)
    let existingImages = [];
    if (req.body.existingImages) {
      const parsed = parseJSON(req.body.existingImages);
      if (Array.isArray(parsed)) existingImages = parsed;
    } else {
      existingImages = product.images || [];
    }

    // 3. Merge: keep existing + new
    const finalImages = [...existingImages, ...newImages];

    const updateData = { ...req.body };
    delete updateData.existingImages;
    delete updateData.images; // we'll set it from finalImages

    // Parse JSON fields
    if (typeof updateData.sizes === 'string') {
      const parsed = parseJSON(updateData.sizes);
      if (Array.isArray(parsed)) updateData.sizes = parsed;
    }
    if (typeof updateData.colors === 'string') {
      const parsed = parseJSON(updateData.colors);
      if (Array.isArray(parsed)) updateData.colors = parsed;
    }
    if (typeof updateData.specifications === 'string') {
      const parsed = parseJSON(updateData.specifications);
      if (typeof parsed === 'object' && parsed !== null) {
        updateData.specifications = parsed;
      }
    }

    updateData.images = finalImages;

    Object.assign(product, updateData);
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/products/:id (admin) ───
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};