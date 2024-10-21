'use client';

import { useState } from 'react';
import { auth, db, googleProvider } from '../firbase/firbase.js'; // Ensure correct firebase path
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import Loader from '../components/Loader'; // Import the Loader component
import Logo from "../assets/logo.png"; // Ensure the correct path to your logo

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  // Handle Email/Password SignIn
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Set loading to true
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Query Firestore to get the user document based on the UID
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Fetch the user role from Firestore
        const userData = querySnapshot.docs[0].data();
        const role = userData.role;

        // Redirect based on the user role
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setError('No user data found in Firestore');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle Google Signup/Signin
  const handleGoogleSignIn = async () => {
    setLoading(true); // Set loading to true
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Query Firestore to get the user document based on the UID
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Fetch user role after Google login
        const userData = querySnapshot.docs[0].data();
        const role = userData.role;

        // Redirect based on the role
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setError('No user data found in Firestore');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <Loader /> {/* Full-screen loader */}
        </div>
      )}
      <div className="w-full max-w-5xl flex bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* Image Section */}
        <div className="hidden md:block w-1/2 bg-cover" style={{ backgroundImage: "url('https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1729523258~exp=1729526858~hmac=596741e32fae6e8f2524ebe59a4d991b3d56e286866cf6817f6ecd2d6f503ffa&w=740')" }}></div>
  
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <img src={Logo.src} alt="Website Logo" className="h-16 mb-4 mx-auto" /> {/* Add your logo */}
          <h2 className="text-2xl font-bold text-[#00b4d8] mb-4 text-center">Login Your Account</h2>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-[#00b4d8] text-white py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
            >
              Sign In
            </button>
          </form>
  
          <div className="flex items-center justify-center my-4">
            <span className="text-gray-500">OR</span>
          </div>
  
          <div
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-500 hover:text-white transition cursor-pointer"
          >
            <FaGoogle className="mr-2" /> Sign In with Google
          </div>
  
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
  
  
}
