/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
          'firebasestorage.googleapis.com', // Existing domain
          'cdni.iconscout.com', // Add this line
          'picsum.photos',                    // Add this line

        ],
      },
};

export default nextConfig;
