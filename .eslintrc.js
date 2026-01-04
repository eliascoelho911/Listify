module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.expo/',
    '.expo-shared/',
    'web-build/',
  ],
  env: {
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^\\u0000'],
          ['^react', '^expo', '^@?\\w'],
          [
            '^@app',
            '^@domain',
            '^@data',
            '^@infra',
            '^@presentation',
            '^@design-system',
            '^@tests',
          ],
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    'import/order': 'off',
  },
  overrides: [
    {
      files: ['src/domain/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: 'react', message: 'Domain layer cannot depend on React.' },
              { name: 'react-native', message: 'Domain layer cannot depend on React Native.' },
            ],
            patterns: [
              {
                group: ['expo*', '@expo/*'],
                message: 'Domain layer cannot depend on Expo packages.',
              },
              {
                group: ['@presentation/*', '@infra/*'],
                message: 'Domain layer cannot depend on presentation/infra.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['tests/**/*.{ts,tsx}'],
      env: {
        jest: true,
        node: true,
      },
    },
  ],
};
