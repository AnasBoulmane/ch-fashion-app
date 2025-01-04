import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/asset/frontstage/:path*',
        destination: 'https://www.chanel.com/asset/frontstage/:path*', // Proxy to external URL
      },
    ]
  },
}

export default nextConfig
