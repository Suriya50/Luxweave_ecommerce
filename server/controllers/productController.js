const Product = require('../models/Product');
const Category = require('../models/Category');

// ✅ Helper: Extract images and return absolute URLs
const extractUploadedImages = (req) => {
  if (req.files && req.files.length > 0) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return req.files.map(file => {
      // If Cloudinary (starts with http), return as is
      if (file.path && file.path.startsWith('http')) {
        return file.path;
      }
      // Local storage: construct absolute URL
      if (file.filename) {
        return `${baseUrl}/uploads/${file.filename}`;
      }
      return file.path || file.secure_url || file.location;
    });
  }
  return [];
};

// Helper: safely parse JSON fields
const parseJSON = (str) => {
  if (!str) return undefined;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

// @desc    Get all products with filters & pagination
const getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      gender,
      sizes,          // now we use 'sizes' (plural)
      colors,         // now we use 'colors' (plural)
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

    // Category
    if (category) filter.category = category;

    // Brand (partial match)
    if (brand) filter.brand = { $regex: brand, $options: 'i' };

    // Gender
    if (gender) filter.gender = gender;

    // Sizes – support comma‑separated values
    if (sizes) {
      const sizeArray = sizes.split(',').filter(Boolean);
      if (sizeArray.length > 0) {
        filter.sizes = { $in: sizeArray };
      }
    }

    // Colors – support comma‑separated values
    if (colors) {
      const colorArray = colors.split(',').filter(Boolean);
      if (colorArray.length > 0) {
        filter.colors = { $in: colorArray };
      }
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Rating
    if (rating) filter.rating = { $gte: parseFloat(rating) };

    // Featured flag
    if (featured === 'true') filter.isFeatured = true;

    // Search (name, description, brand)
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
    else sortOptions.createdAt = -1; // newest

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
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

// @desc    Get single product
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

// @desc    Create product (admin)
const createProduct = async (req, res) => {
  try {
    let images = extractUploadedImages(req);
    if (images.length === 0 && req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images;
    }

    const productData = { ...req.body };

    // Parse JSON fields: sizes, colors, specifications (they come as strings from FormData)
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
      if (typeof parsed === 'object' && parsed !== null) productData.specifications = parsed;
    }

    if (productData.categoryName) {
      const category = await Category.findOne({ name: productData.categoryName });
      if (category) productData.category = category._id;
      delete productData.categoryName;
    }

    productData.images = images;
    delete productData.existingImages;

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newImages = extractUploadedImages(req);

    let existingImages = [];
    if (req.body.existingImages) {
      const parsed = parseJSON(req.body.existingImages);
      if (Array.isArray(parsed)) existingImages = parsed;
    } else {
      existingImages = product.images || [];
    }

    const finalImages = [...existingImages, ...newImages];

    const updateData = { ...req.body };
    delete updateData.existingImages;
    delete updateData.images;

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
      if (typeof parsed === 'object' && parsed !== null) updateData.specifications = parsed;
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

// @desc    Delete product (admin)
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