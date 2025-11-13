/** @type {import('next').NextConfig} */
const nextConfig = {
  srcDir: 'src',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'khannabooks.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'media.springernature.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'booksdelivery.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'www.tbooks.solutions', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'chemistry.com.pk', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'media.wiley.com', port: '', pathname: '/**' }, 
      { protocol: 'https', hostname: 'images-cdn.ubuy.co.in', port: '', pathname: '/**' },
    ],
  },
};

export default nextConfig;
