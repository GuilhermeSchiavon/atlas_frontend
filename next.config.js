/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'api.atlasurodermato.com.br'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.atlasurodermato.com.br',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig