"use client";

import { useState } from "react";
import { auth, db, googleProvider } from "../firbase/firbase.js"; // Ensure correct firebase path
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import Loader from "../components/Loader"; // Import your loader component
import Image from "next/image"; // Import Next.js Image component
import Logo from "../assets/logo.png"; // Adjust the path to your logo
import BackgroundImage from "../assets/register.jpg"; // Import your background image

export default function Signup() {
  const [formState, setFormState] = useState({
    name: "",
    fatherName: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    showPassword: false,
  });

  const { name, fatherName, email, password, error, loading, showPassword } =
    formState;
  const router = useRouter();

  // Basic form validation
  const validateForm = () => {
    if (!name || !fatherName) {
      setFormState({
        ...formState,
        error: "Name and Father's Name are required.",
      });
      return false;
    }
    if (!email.includes("@")) {
      setFormState({ ...formState, error: "Invalid email format." });
      return false;
    }
    if (password.length < 6) {
      setFormState({
        ...formState,
        error: "Password must be at least 6 characters.",
      });
      return false;
    }
    return true;
  };

  // Handle Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState({ ...formState, error: "", loading: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user details to Firestore with default role "user"
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        fatherName,
        email,
        role: "user",
        createdAt: new Date(),
      });

      // After signup, redirect to home
      router.push("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setFormState({
          ...formState,
          error: "Email is already in use. Please try another one.",
        });
      } else if (error.code === "auth/weak-password") {
        setFormState({
          ...formState,
          error: "Password is too weak. Please use a stronger password.",
        });
      } else {
        setFormState({
          ...formState,
          error: "Failed to sign up. Please try again.",
        });
      }
    } finally {
      setFormState({ ...formState, loading: false });
    }
  };

  // Handle Google Signup/Signin
  const handleGoogleSignup = async () => {
    setFormState({ ...formState, error: "", loading: true });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, create a new record in Firestore
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: "user",
          createdAt: new Date(),
        });
      }

      // Redirect after Google sign-up
      router.push("/");
    } catch (error) {
      setFormState({
        ...formState,
        error: "Failed to sign up with Google. Please try again.",
      });
    } finally {
      setFormState({ ...formState, loading: false });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader /> {/* Display loader over the entire page */}
        </div>
      )}
      <div className="w-full max-w-5xl flex bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image Section */}
        <div
          className="hidden md:block w-1/2 bg-cover"
          style={{ backgroundImage: `url(${BackgroundImage.src})` }}
        ></div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-center mb-4">
            <Image src={Logo} alt="Website Logo" className="h-12" />{" "}
            {/* Logo above the form */}
          </div>
          <h2 className="text-2xl font-bold text-[#00b4d8] mb-4 text-center">
            Create Your Account
          </h2>

          {error && (
            <p className="text-red-500 mb-4" aria-live="assertive">
              {error}
            </p>
          )}

          {!loading && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="fatherName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Father&apos;s Name
                </label>
                <input
                  id="fatherName"
                  type="text"
                  value={fatherName}
                  onChange={(e) =>
                    setFormState({ ...formState, fatherName: e.target.value })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setFormState({ ...formState, password: e.target.value })
                    }
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-secondary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormState({
                        ...formState,
                        showPassword: !showPassword,
                      })
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00b4d8] text-white py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
              >
                Sign Up
              </button>
            </form>
          )}

          <div className="flex items-center justify-center my-4">
            <span className="text-gray-500">OR</span>
          </div>
          <div
            onClick={handleGoogleSignup}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-500 hover:text-white transition cursor-pointer"
          >
            <FaGoogle className="mr-2" /> Sign Up with Google
          </div>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
