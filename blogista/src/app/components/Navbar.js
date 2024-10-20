'use client'
import { useState, useEffect } from 'react';
import { auth } from '../firbase/firbase.js'; // Adjust your firebase import
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getDoc, doc } from 'firebase/firestore'; // Firestore for fetching user details
import { db } from '../firbase/firbase.js'; // Firestore database import

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ensure `useRouter` is used only on the client-side
  const router = typeof window !== 'undefined' ? useRouter() : null;

  useEffect(() => {
    // Check user auth state
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        // Fetch additional user details from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null);
    if (router) {
      router.push('/'); // Redirect to login page after sign out
    }
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-gray-900">MyBlog</a>

        {/* Search Bar */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Login/Signup or User Dropdown */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <a href="/login" className="text-gray-700 hover:text-gray-900">Login</a>
              <a href="/signup" className="bg-[#38B2AC] text-white px-4 py-2 rounded-lg hover:bg-[#F6AD55] transition">Signup</a>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {/* User avatar with online status dot */}
                <div className="relative">
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white shadow"
                  />
                  {/* Online status dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    {user.email}
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    {userData.name || "User Name"}
                  </div>
                  <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">View Profile</a>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;