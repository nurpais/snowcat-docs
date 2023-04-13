const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md'],
  experimental: {
    scrollRestoration: true,
    runtime: 'edge',
  },
  images: {
    unoptimized: true,
  },
}

module.exports = withMarkdoc()(nextConfig)
