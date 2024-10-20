'use client';

import { useState } from 'react';
import { auth, db, googleProvider } from '../firbase/firbase.js'; // Ensure correct firebase path
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';


export default function Signup() {
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details to Firestore with default role "user"
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name,
        fatherName,
        email,
        role: 'user', // Default role as "user"
        createdAt: new Date(),
      });

      // After signup, redirect to home
      router.push('/');
    } catch (error) {
      console.error(error);
      setError('Failed to sign up. Please try again.');
    }
  };

  // Handle Google Signup/Signin
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new record in Firestore
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: 'user', // Default role as "user"
          createdAt: new Date(),
        });
      }

      // Redirect after Google sign-up
      router.push('/');
    } catch (error) {
      console.error(error);
      setError('Failed to sign up with Google. Please try again.');
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
          <h2 className="text-3xl font-bold text-primary mb-4 text-center">Sign Up</h2>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Father's Name</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
              />
            </div>

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
              Sign Up
            </button>
          </form>

          <div className="flex items-center justify-center my-4">
            <span className="text-gray-500">OR</span>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FaGoogle className="mr-2" /> Sign Up with Google
          </button>

          <p className="mt-4 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
