const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Blog</h1>
          <p className="text-lg mb-6">
            Dive into our collection of insightful articles and stories that inspire and educate. Stay updated with the latest trends and tips.
          </p>
          <a href="/blogs" className="bg-white text-purple-600 py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition">
            Read Latest Posts
          </a>
        </div>
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <img
            src="/path-to-your-image.jpg" // Replace with your image path
            alt="Blog Image"
            className="w-full h-80 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
