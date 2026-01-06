const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');

const WINDOW_SOFT_INPUT_MODE = 'adjustResize|stateHidden';

const withAndroidWindowSoftInputMode = (config) =>
  withAndroidManifest(config, (configWithManifest) => {
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(
      configWithManifest.modResults,
    );

    mainActivity.$['android:windowSoftInputMode'] = WINDOW_SOFT_INPUT_MODE;

    return configWithManifest;
  });

module.exports = withAndroidWindowSoftInputMode;
