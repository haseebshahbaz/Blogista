'use client';
import { useState, useEffect, useRef } from 'react';
import { auth } from '../firbase/firbase.js';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getDoc, doc, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../firbase/firbase.js';
import Image from 'next/image'; // Import Image from Next.js
import { HiMenu, HiX } from 'react-icons/hi';
import Logo from '../assets/logo.png'; // Ensure correct path to logo

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);

        try {
          const userDocId = await getUserDocId(user.uid);
          const userDocRef = doc(db, 'users', userDocId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [router]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const getUserDocId = async (uid) => {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0]?.id || null;
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap">
        <div className="flex items-center space-x-2">
          <div
            onClick={toggleMobileMenu}
            className="md:hidden p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00b4d8] rounded-md"
          >
            {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </div>

          <a href="/" className="flex items-center space-x-2  font-bold">
            <Image src={Logo.src} alt="Logo" width={150} height={150} />
          </a>
        </div>

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
                <div className="relative">
                  <Image
                    src={user.photoURL || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-[#00b4d8] shadow-md"
                    width={40}
                    height={40}
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
              </div>

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
