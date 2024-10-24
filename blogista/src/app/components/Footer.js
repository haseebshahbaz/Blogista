import { FaFacebookF, FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import Image from "next/image"; // Import Image component
import Logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-8">
      <div className="container mx-auto px-10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Description */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <Image
              className="w-44 h-auto mb-3" // Adjusted size of the logo
              src={Logo}
              alt="Blogista Logo"
              width={176} // Set appropriate width (44 * 4)
              height={176} // Set appropriate height if needed
            />
            <p className="text-sm text-gray-900">
              Your go-to source for the latest insights in web development and technology.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-6">
            <a
              href="https://web.facebook.com/profile.php?id=100013907506597"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00b4d8] transition duration-300"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://github.com/haseebshahbaz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00b4d8] transition duration-300"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/mdhaseeb07/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00b4d8] transition duration-300"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="https://www.instagram.com/ch.haseebshahbaz/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00b4d8] transition duration-300"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Copyright and Developer Info */}
        <div className="text-center text-sm mt-8">
          <p className="text-gray-900">&copy; {new Date().getFullYear()} Blogista. All rights reserved.</p>
          <p className="text-gray-900">Designed & Developed by Muhammad Haseeb</p>
        </div>
      </div>
    </footer>
  );
}
