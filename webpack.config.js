const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          'native-base',
          'react-native-svg',
          'react-native-reanimated',
        ],
      },
    },
    argv
  );

  // Prefer web map shim over native react-native-maps
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native-maps': path.resolve(__dirname, 'src/components/AppMapView.web.js'),
  };

  // SPA fallback for client-side navigation refreshes on Railway
  if (config.devServer) {
    config.devServer.historyApiFallback = true;
  }

  return config;
};
