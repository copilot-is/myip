import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [{ from: path.join('db'), to: 'db' }],
      })
    );

    return config;
  },
};

export default nextConfig;
