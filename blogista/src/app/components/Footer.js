import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        {/* Footer Links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold text-white">Blogista</h3>
            <p className="text-sm">
              Your go-to source for the latest insights in web development and technology.
            </p>
          </div>
          <ul className="flex space-x-4">
            <li>
              <a href="/about" className="hover:text-accent transition duration-300">About</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-accent transition duration-300">Contact</a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-accent transition duration-300">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms" className="hover:text-accent transition duration-300">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-4 mb-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition duration-300"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition duration-300"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition duration-300"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition duration-300"
          >
            <FaInstagram size={20} />
          </a>
        </div>

        {/* Copyright and Developer Info */}
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Blogista. All rights reserved.</p>
          <p>Designed & Developed by Muhammad Haseeb</p>
        </div>
      </div>
    </footer>
  );
}
