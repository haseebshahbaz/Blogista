import React from 'react';

const Hero = () => {
  return (
    <section className="bg-white text-gray-900 py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <span className="text-sm text-gray-500 mb-2 inline-block">Technologo - Master the Art of Coding</span>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Dive into the world of <span className="text-[#00b4d8]">development</span> and code your future.
          </h1>
          <p className="text-lg mb-8 text-gray-600">
            Explore expert tutorials, coding tips, and the latest in web technologies, all in one place.
          </p>
        </div>

        {/* Right section with image and ribbon-like design */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          {/* Add a background ribbon */}

          {/* Coding illustration image */}
          <img 
            src="https://cdni.iconscout.com/illustration/premium/thumb/blog-writer-working-on-article-illustration-download-in-svg-png-gif-file-formats--blogger-logo-female-content-typing-writing-news-pack-design-development-illustrations-4759515.png" 
            alt="Coding Illustration" 
            className="relative z-10 w-72 md:w-96 rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
