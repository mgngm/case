/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // NB: This only applies when running on gitlab CI, since we have run tsc as a separate job before the build
    ignoreBuildErrors: process.env.GITLAB_CI ? true : false,
  },
  trailingSlash: true,
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === '1'
        ? { source: '/((?!maintenance)(?!_next)(?!static).*)', destination: '/maintenance.html', permanent: false }
        : null,
    ].filter(Boolean);
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (!process.env.NEXT_PUBLIC_AMPLIFY_MOCK) {
      config.module.rules.push({
        test: /\.ts$/,
        enforce: 'pre',
        exclude: /(node_modules|\.test\.ts)/,
        use: [
          {
            loader: 'webpack-strip-block',
          },
        ],
      });
    } else {
      // running a mock, so setup amplify files if necessary
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { setupAmplifyMockFiles } = require(`${process.env.INIT_CWD}/mock/amplify.js`);
      setupAmplifyMockFiles();
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            ext: 'tsx',
          },
        },
      ],
    });

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
