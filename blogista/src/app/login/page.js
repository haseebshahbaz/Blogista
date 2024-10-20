'use client';

import { useState } from 'react';
import { auth, db, googleProvider } from '../firbase/firbase.js'; // Ensure correct firebase path
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { query, where, getDocs, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle Email/Password SignIn
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
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
    }
  };

  // Handle Google Signup/Signin
  const handleGoogleSignIn = async () => {
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl flex bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* Image Section */}
        <div className="hidden md:block w-1/2 bg-cover" style={{ backgroundImage: "url('https://source.unsplash.com/random')" }}>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-primary mb-4 text-center">Sign In</h2>
          
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
              className="w-full bg-secondary text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center justify-center my-4">
            <span className="text-gray-500">OR</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FaGoogle className="mr-2" /> Sign In with Google
          </button>

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
