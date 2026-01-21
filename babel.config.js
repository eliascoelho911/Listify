module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'inline-import',
        {
          extensions: ['.sql'],
        },
      ],
      [
        'module-resolver',
        {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@app': './src/app',
            '@domain': './src/domain',
            '@data': './src/data',
            '@infra': './src/infra',
            '@presentation': './src/presentation',
            '@design-system': './src/design-system',
            '@tests': './tests',
            '@drizzle': './src/infra/drizzle',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
