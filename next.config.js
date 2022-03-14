const removeImports = require('next-remove-imports')()
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack (config) {
    config.module.rules.push({
      test: /\.svg$/,
      oneOf: [
        {
          test: /\.icon\.svg$/,
          use: [{ loader: '@svgr/webpack', options: { icon: true } }]
        },
        {
          use: [{ loader: '@svgr/webpack', options: { icon: false } }]
        }
      ]
    })

    return config
  },
  experimental: {
    outputStandalone: true,
  },
  env: {
    API_URL: process.env.API_URL
  }
}

module.exports = withBundleAnalyzer(removeImports(nextConfig))
