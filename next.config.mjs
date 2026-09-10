/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/school-uniforms',
        destination: '/shop/school-uniforms',
        permanent: true,
      },
      {
        source: '/school-uniforms/:path*',
        destination: '/shop/school-uniforms/:path*',
        permanent: true,
      },
      {
        source: '/thermals',
        destination: '/shop/thermals',
        permanent: true,
      },
      {
        source: '/thermals/:path*',
        destination: '/shop/thermals/:path*',
        permanent: true,
      },
      {
        source: '/school-shoes',
        destination: '/shop/school-shoes',
        permanent: true,
      },
      {
        source: '/school-shoes/:path*',
        destination: '/shop/school-shoes/:path*',
        permanent: true,
      },
      {
        source: '/school-bags',
        destination: '/shop/school-bags',
        permanent: true,
      },
      {
        source: '/school-bags/:path*',
        destination: '/shop/school-bags/:path*',
        permanent: true,
      },
      {
        source: '/school-items',
        destination: '/shop/school-items',
        permanent: true,
      },
      {
        source: '/school-items/:path*',
        destination: '/shop/school-items/:path*',
        permanent: true,
      },
      {
        source: '/category',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/category/:path*',
        destination: '/shop/:path*',
        permanent: true,
      },
      {
        source: '/categories/:path+',
        destination: '/shop/:path+',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

