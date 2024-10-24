'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '../firbase/firbase.js'; // Ensure correct import path
import Link from 'next/link';
import Loader from '../components/Loader';
import Image from 'next/image'; // Import Image component

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogCollection = collection(db, 'blogs');
      const blogSnapshot = await getDocs(blogCollection);
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogList);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const truncateContent = (content, maxLength) => {
    const strippedContent = stripHtml(content);
    return strippedContent.length > maxLength ? `${strippedContent.substring(0, maxLength)}...` : strippedContent;
  };

  const handleBlogClick = (id) => {
    router.push(`/blog/${id}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#00b4d8] text-center mb-10">Recent Blogs</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <Link href={`/blog/${blog.id}`}>
              <Image 
                src={blog.imageUrl} 
                alt={blog.title} 
                width={400} // Set appropriate width
                height={240} // Set appropriate height
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-700 mb-4">{truncateContent(blog.content, 100)}</p>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Read More
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
