// Home.js

'use client';

import { useState, useEffect } from 'react';
import AuthorBio from "./components/AuthorBio";
import CTABanner from "./components/CTABanner";
import FeaturedPosts from "./components/FeaturedPost";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Testimonials from "./components/Testimonials";
import { db } from '../app/firbase/firbase.js'; // Firebase config and Firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loader from './components/Loader'; // Import the Loader component

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [userData, setUserData] = useState(null); // Store logged-in user data

  // Fetch data from 'blogs' and 'users' collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog data from 'blogs' collection
        const blogsSnapshot = await getDocs(collection(db, 'blogs'));
        const blogsData = blogsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Get the current authenticated user's UID (for user data in Navbar)
        const currentUser = JSON.parse(localStorage.getItem('user')); // Assuming user is stored in localStorage
        if (currentUser) {
          const usersQuery = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
          const userSnapshot = await getDocs(usersQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0]; // Assuming there is only one document per user
            setUserData({ id: userDoc.id, ...userDoc.data() });
          }
        }

        // Set blogs data and user data
        setBlogs(blogsData);
        setLoading(false); // Stop loading after fetching
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Stop loading even on error
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

  return (
    <div>
      <Navbar userData={userData} />
      <HeroSection />
      <FeaturedPosts posts={blogs}/>
      <AuthorBio />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
