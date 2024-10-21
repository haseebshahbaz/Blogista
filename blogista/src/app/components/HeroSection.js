'use client'

import React, { useRef } from 'react';

const HeroSection = () => {
    const recentPostsRef = useRef(null);

    const scrollToRecentPosts = () => {
        if (recentPostsRef.current) {
            recentPostsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between h-screen px-6 md:px-12 bg-white">
            {/* Text Section */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-16 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-[#00b4d8] mb-4 drop-shadow-lg">Welcome to My Blog</h1>
                <p className="mt-4 text-lg md:text-xl text-gray-800 leading-relaxed">
                    Discover insights, tips, and stories that inspire.
                </p>
                <button
                    onClick={scrollToRecentPosts}
                    className="mt-8 px-6 py-3 bg-[#00b4d8] text-white rounded-lg shadow-md hover:bg-[#0091b3] transition duration-300 transform hover:scale-105"
                >
                    Read More
                </button>
            </div>

            {/* Image Section */}
            <div className="flex-1 h-full flex justify-center items-center md:pr-8">
                <img
                    src="/path/to/your/image.jpg" // Replace with your image path
                    alt="Hero"
                    className="w-full h-auto max-w-md rounded-lg shadow-lg object-cover"
                />
            </div>
        </div>
    );
};

export default HeroSection;
