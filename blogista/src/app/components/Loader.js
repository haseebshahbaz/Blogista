// components/Loader.js

const Loader = () => (
    <div className="flex flex-col items-center justify-center h-screen w-full h-full bg-gray-100">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        <h1 className="text-3xl font-bold text-gray-700 animate-pulse">BLOGISTA</h1>
      </div>
    </div>
  );
  
  export default Loader;
  