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
    <footer className="bg-black text-white pt-12 md:pt-16 pb-6 mt-12 md:mt-16 border-t border-gold-500/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand – with premium serif font */}
          <div className="text-center sm:text-left">
            <h3 className="font-display text-3xl md:text-4xl font-bold tracking-wider gold-text">
              LuxWeave
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed max-w-xs mx-auto sm:mx-0">
              Elevate your style with premium fashion.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 mt-4">
              <a
                href="#"
                className="text-gray-500 hover:text-gold-400 transition duration-200 transform hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gold-400 transition duration-200 transform hover:scale-110"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gold-400 transition duration-200 transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gold-400 transition duration-200 transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/shop"
                  className="text-gray-400 hover:text-gold-400 transition duration-200 text-xs md:text-sm"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-gold-400 transition duration-200 text-xs md:text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-gold-400 transition duration-200 text-xs md:text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-gold-400 transition duration-200 text-xs md:text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Address */}
          <div className="text-center sm:text-left">
            <h4 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Visit Us
            </h4>
            <address className="not-italic text-gray-400 text-xs md:text-sm leading-relaxed">
              <p>KK Nagar, Chennai</p>
              <p>Tamil Nadu, India – 600078</p>
              <p className="mt-2">📞 +91 78689 43703</p>
              <p>✉️ support@luxweave.com</p>
            </address>
          </div>

          {/* Payment Methods – with authentic colours and spacing */}
          <div className="text-center sm:text-left">
            <h4 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4">
              We Accept
            </h4>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-2xl md:text-3xl">
              <SiGooglepay
                className="transition-transform duration-200 hover:scale-110 cursor-pointer"
                title="Google Pay"
                style={{ color: '#4285F4' }}
              />
              <SiPhonepe
                className="transition-transform duration-200 hover:scale-110 cursor-pointer"
                title="PhonePe"
                style={{ color: '#5F259F' }}
              />
              <SiPaytm
                className="transition-transform duration-200 hover:scale-110 cursor-pointer"
                title="Paytm"
                style={{ color: '#00BAF2' }}
              />
              <FaCcVisa
                className="transition-transform duration-200 hover:scale-110 cursor-pointer"
                title="Visa"
                style={{ color: '#1A1F71' }}
              />
              <FaCcMastercard
                className="transition-transform duration-200 hover:scale-110 cursor-pointer"
                title="Mastercard"
                style={{ color: '#EB001B' }}
              />
              <FaCcAmex
                className="transition-transform duration-200 hover:scale-110 cursor-pointer"
                title="American Express"
                style={{ color: '#2E77D0' }}
              />
            </div>
            <p className="text-gray-500 text-[10px] md:text-xs mt-3 flex items-center justify-center sm:justify-start gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              100% secure payments
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold-500/20 mt-8 md:mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-[10px] md:text-xs text-center sm:text-left">
            © {new Date().getFullYear()} LuxWeave. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-[10px] md:text-xs">
            <span className="hover:text-gold-400 transition cursor-pointer">Privacy Policy</span>
            <span className="w-px h-3 bg-gray-700"></span>
            <span className="hover:text-gold-400 transition cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;