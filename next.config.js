const removeImports = require('next-remove-imports')()
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

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
    outputStandalone: true
  },
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
  },
  pwa: {
    dest: 'public',
    runtimeCaching
  },
  async rewrites() {
    return [
      {
        source: '/:date(\\d+-(?:1[012]|0[1-9])-(?:3[01]|[12][0-9]|0[1-9]))',
        destination: '/'
      }
    ]
  }
}

module.exports = withBundleAnalyzer(removeImports(withPWA(nextConfig)))
