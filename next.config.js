/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  transpilePackages: ['rc-util', 'antd', '@ant-design', 'rc-pagination', 'rc-picker', 'rc-tree', 'rc-table'],
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
    
    // Add specific aliases for rc-util modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/es/warning': require.resolve('rc-util/es/warning.js'),
      'rc-util/es/Children/toArray': require.resolve('rc-util/es/Children/toArray.js')
    };
    
    return config;
  },
}

module.exports = nextConfig