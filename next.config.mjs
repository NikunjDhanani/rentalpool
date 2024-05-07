// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output:"export"
    // Your existing configuration options here
    // For example:
    // target: 'serverless',
  };

  // Merge the existing configuration with the image domain configuration
  const mergedConfig = {
    ...nextConfig,
    images: {
      domains: ['rentalspoolbucket.s3.amazonaws.com'],
    },
  };
  
  export default mergedConfig;
  