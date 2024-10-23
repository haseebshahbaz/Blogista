'use client';
import { useState, useEffect, useRef } from 'react';
import { auth } from '../firbase/firbase.js';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getDoc, doc, query, where, getDocs, collection } from 'firebase/firestore'; // Firestore functions
import { db } from '../firbase/firbase.js'; // Firestore database import
import Logo from "../assets/logo.png"; // Ensure the correct path to your logo
import { HiMenu } from 'react-icons/hi'; // Hamburger icon
import { HiX } from 'react-icons/hi'; // Close icon

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = typeof window !== 'undefined' ? useRouter() : null;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);

        try {
          const userDocId = await getUserDocId(user.uid); // Fetch the document ID for the user
          const userDocRef = doc(db, 'users', userDocId); // Use the fetched document ID
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.error("No such document in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null);
    if (router) {
      router.push('/'); // Redirect to login page after sign out
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Function to get the correct document ID based on the user's UID
  const getUserDocId = async (uid) => {
    const q = query(collection(db, 'users'), where('uid', '==', uid)); // Adjust to match your structure
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id; // Return the document ID of the first matching document
    } else {
      throw new Error('No matching document found!');
    }
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap">
        {/* Left Side: Hamburger Menu and Logo */}
        <div className="flex items-center space-x-2">
          {/* Hamburger Menu Icon */}
          <div
            onClick={toggleMobileMenu}
            className="md:hidden p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00b4d8] rounded-md"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6 text-gray-900" />
            ) : (
              <HiMenu className="w-6 h-6 text-gray-900" />
            )}
          </div>

          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
            <img src={Logo.src} alt="Logo" className="h-12" />
          </a>
        </div>

        {/* Centered Search Bar Container */}
<div className="flex flex-grow justify-center mt-2 md:mt-0">
  <div className="flex space-x-2 w-full max-w-md"> {/* Set max width here */}
    <input
      type="text"
      placeholder="Search"
      className="flex-grow px-4 py-3 border border-[#00b4d8] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] transition-all duration-300 search-input" // Added a custom class
    />
    <button className="bg-[#00b4d8] text-white px-4 py-1 rounded-r-md hover:bg-[#0096c7] transition-all duration-300 search-button"> {/* Added a custom class */}
      Search
    </button>
  </div>
</div>


        {/* Right Side: User Profile Dropdown */}
        <div className="relative">
          {!isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-4 mt-2 md:mt-0">
              <a href="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                Login
              </a>
              <a
                href="/signup"
                className="bg-[#00b4d8] text-white px-4 py-2 rounded-lg hover:bg-[#0096c7] transition-all duration-300"
              >
                Signup
              </a>
            </div>
          ) : (
            <div>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 cursor-pointer"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                {/* User Avatar with Online Indicator */}
                <div className="relative">
                  <img
                    src={user.photoURL || "/default-avatar.png"} // Fallback to default avatar
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-[#00b4d8] shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                  aria-labelledby="user-menu"
                >
                  <div className="p-4 border-b text-gray-700">
                    <div className="text-sm font-semibold">{userData.name || "User Name"}</div>
                    <div className="text-xs text-gray-500">{user.email || "user@example.com"}</div>
                  </div>

                  <div className="py-1">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    >
                      View Profile
                    </a>
                    <div
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      Sign Out
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-2">
          <a href="/" className="block p-2 text-gray-900 hover:bg-gray-100">Home</a>
          <a href="/about" className="block p-2 text-gray-900 hover:bg-gray-100">About</a>
          <a href="/contact" className="block p-2 text-gray-900 hover:bg-gray-100">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
