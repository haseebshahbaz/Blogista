'use client';

import { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firbase/firbase.js'; // Ensure correct firebase path
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';
import Loader from '../components/Loader'; // Import the Loader component
import Image from 'next/image'; // Import Next.js Image component
import Logo from "../assets/logo.png"; // Ensure the correct path to your logo
import BG from "../assets/login.jpg"

export default function Login() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    showPassword: false,
  });

  const { email, password, error, loading, showPassword } = formState;
  const router = useRouter();

  // Route guarding: if the user is already logged in, redirect to the homepage
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/'); // Redirect to the home page if authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  // Validate form before submission
  const validateForm = () => {
    if (!email.includes('@')) {
      setFormState({ ...formState, error: 'Invalid email format.' });
      return false;
    }
    if (password.length < 6) {
      setFormState({ ...formState, error: 'Password must be at least 6 characters.' });
      return false;
    }
    return true;
  };

  // Handle Email/Password SignIn
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState({ ...formState, error: '', loading: true });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Query Firestore to get the user document based on the UID
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const role = userData.role;

        // Redirect based on the user role
        role === 'admin' ? router.push('/admin/dashboard') : router.push('/');
      } else {
        setFormState({ ...formState, error: 'No user data found in Firestore.' });
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setFormState({ ...formState, error: 'Incorrect password. Please try again.' });
      } else if (error.code === 'auth/user-not-found') {
        setFormState({ ...formState, error: 'No user found with this email.' });
      } else {
        setFormState({ ...formState, error: 'Failed to sign in. Please try again.' });
      }
    } finally {
      setFormState({ ...formState, loading: false });
    }
  };

  // Handle Google Signup/Signin
  const handleGoogleSignIn = async () => {
    setFormState({ ...formState, error: '', loading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const role = userData.role;
        role === 'admin' ? router.push('/admin/dashboard') : router.push('/');
      } else {
        setFormState({ ...formState, error: 'No user data found in Firestore.' });
      }
    } catch (error) {
      setFormState({ ...formState, error: 'Failed to sign in with Google. Please try again.' });
    } finally {
      setFormState({ ...formState, loading: false });
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
        <div className="hidden md:block w-1/2 bg-cover"   style={{ backgroundImage: `url(${BG.src})` }} 
        ></div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <Image src={Logo} alt="Website Logo" className="h-16 mb-4 mx-auto" /> {/* Add your logo */}
          <h2 className="text-2xl font-bold text-[#00b4d8] mb-4 text-center">Login Your Account</h2>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
                />
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, showPassword: !showPassword })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
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
