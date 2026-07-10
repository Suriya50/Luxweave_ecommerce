import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
} from 'react-icons/fa';
import { SiGooglepay, SiPhonepe, SiPaytm } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-10 md:pt-14 pb-6 mt-12 md:mt-16 border-t border-gold-500/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="text-2xl md:text-3xl font-display gold-text tracking-tight">LuxWeave</h3>
            <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed">
              Elevate your style with premium fashion.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 transition-transform duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 transition-transform duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 transition-transform duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 transition-transform duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-base md:text-lg mb-3 gold-text">Quick Links</h4>
            <ul className="space-y-2.5 text-gray-400 text-xs md:text-sm">
              <li>
                <Link to="/shop" className="hover:text-gold-500 transition duration-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-500 transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-500 transition duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-500 transition duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Address */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-base md:text-lg mb-3 gold-text">Visit Us</h4>
            <address className="not-italic text-gray-400 text-xs md:text-sm leading-relaxed">
              <p>KK Nagar, Chennai</p>
              <p>Tamil Nadu, India – 600078</p>
              <p className="mt-3">📞 +91 7868943703</p>
              <p>✉️ support@luxweave.com</p>
            </address>
          </div>

          {/* Payment Methods - Real Colors */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-base md:text-lg mb-3 gold-text">We Accept</h4>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-2xl md:text-3xl">
              {/* Google Pay - Blue */}
              <SiGooglepay
                className="transition-transform duration-300 hover:scale-110 cursor-pointer"
                title="Google Pay"
                style={{ color: '#4285F4' }}
              />
              {/* PhonePe - Purple */}
              <SiPhonepe
                className="transition-transform duration-300 hover:scale-110 cursor-pointer"
                title="PhonePe"
                style={{ color: '#5F259F' }}
              />
              {/* Paytm - Blue */}
              <SiPaytm
                className="transition-transform duration-300 hover:scale-110 cursor-pointer"
                title="Paytm"
                style={{ color: '#00BAF2' }}
              />
              {/* Visa - Dark Blue */}
              <FaCcVisa
                className="transition-transform duration-300 hover:scale-110 cursor-pointer"
                title="Visa"
                style={{ color: '#1A1F71' }}
              />
              {/* Mastercard - Red & Orange (Red only for icon) */}
              <FaCcMastercard
                className="transition-transform duration-300 hover:scale-110 cursor-pointer"
                title="Mastercard"
                style={{ color: '#EB001B' }}
              />
              {/* American Express - Blue */}
              <FaCcAmex
                className="transition-transform duration-300 hover:scale-110 cursor-pointer"
                title="American Express"
                style={{ color: '#2E77D0' }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-3 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              100% secure payments
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold-500/20 mt-8 md:mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs md:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} LuxWeave. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-xs">
            <span className="hover:text-gold-500 transition cursor-pointer">Privacy Policy</span>
            <span className="w-px h-3 bg-gray-700"></span>
            <span className="hover:text-gold-500 transition cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;