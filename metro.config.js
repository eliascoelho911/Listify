/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add SQL file support for Drizzle migrations
defaultConfig.resolver.sourceExts.push('sql');

const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
module.exports = withStorybook(defaultConfig);
