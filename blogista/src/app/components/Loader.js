const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    {/* Cube Animation */}
    <div className="cube-wrapper relative">
      <div className="cube animate-spin-cube"></div>
      <div className="shadow-cube animate-spin-cube"></div>
    </div>

    {/* Text */}
    <h1 className="text-4xl font-bold text-gray-800 tracking-wide mt-6">
      BLOGISTA
    </h1>
    
  </div>
);

export default Loader;
