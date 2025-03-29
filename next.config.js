/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  transpilePackages: ['rc-util', 'antd', '@ant-design', 'rc-pagination', 'rc-picker', 'rc-tree'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Add support for importing without extensions
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.mts', '.mtsx'],
      '.cjs': ['.cjs', '.cts', '.ctsx'],
    };
    
    // Add specific alias for rc-util warning module
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/es/warning': require.resolve('rc-util/es/warning.js')
    };
    
    return config;
  },
}

module.exports = nextConfig