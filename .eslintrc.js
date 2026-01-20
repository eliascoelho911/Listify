module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'simple-import-sort', 'eslint-plugin-local-rules'],
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
    // Design System custom rules
    'local-rules/no-hardcoded-values': 'error',
    'local-rules/atomic-design-imports': 'error',
    'local-rules/theme-provider-usage': 'error',
    'local-rules/no-raw-text-import': 'error',
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
                group: ['@presentation/*'],
                message: 'Domain layer cannot depend on presentation layer.',
              },
              {
                group: ['@infra/*'],
                message: 'Domain layer cannot depend on infra layer.',
              },
              {
                group: ['@data/*'],
                message: 'Domain layer cannot depend on data layer.',
              },
              {
                group: ['@app/*'],
                message: 'Domain layer cannot depend on app layer.',
              },
              {
                group: ['@design-system/*'],
                message: 'Domain layer cannot depend on design-system.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/presentation/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['drizzle-orm', 'drizzle-orm/*'],
                message:
                  'Presentation layer cannot import from drizzle-orm. Use hooks from @app/di/AppDependenciesProvider instead.',
              },
              {
                group: ['@drizzle/*', '@infra/drizzle/*'],
                message:
                  'Presentation layer cannot import from Drizzle infrastructure. Use hooks from @app/di/AppDependenciesProvider instead.',
              },
              {
                group: ['@infra/*'],
                message:
                  'Presentation layer cannot import from infra directly. Use DI hooks from @app/di/AppDependenciesProvider instead.',
              },
              {
                group: ['@data/*'],
                message: 'Presentation layer cannot import from data layer directly.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/data/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: 'react', message: 'Data layer cannot depend on React.' },
              { name: 'react-native', message: 'Data layer cannot depend on React Native.' },
            ],
            patterns: [
              {
                group: ['expo*', '@expo/*'],
                message: 'Data layer cannot depend on Expo packages.',
              },
              {
                group: ['@presentation/*'],
                message: 'Data layer cannot depend on presentation layer.',
              },
              {
                group: ['@infra/*'],
                message: 'Data layer cannot depend on infra layer.',
              },
              {
                group: ['@app/*'],
                message: 'Data layer cannot depend on app layer.',
              },
              {
                group: ['@design-system/*'],
                message: 'Data layer cannot depend on design-system.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/infra/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: 'react', message: 'Infra layer cannot depend on React.' },
              { name: 'react-native', message: 'Infra layer cannot depend on React Native.' },
            ],
            patterns: [
              {
                group: ['@presentation/*'],
                message: 'Infra layer cannot depend on presentation layer.',
              },
              {
                group: ['@app/*'],
                message: 'Infra layer cannot depend on app layer.',
              },
              {
                group: ['@design-system/*'],
                message: 'Infra layer cannot depend on design-system.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/design-system/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@domain/*'],
                message: 'Design-system cannot depend on domain layer.',
              },
              {
                group: ['@data/*'],
                message: 'Design-system cannot depend on data layer.',
              },
              {
                group: ['@infra/*'],
                message: 'Design-system cannot depend on infra layer.',
              },
              {
                group: ['@presentation/*'],
                message: 'Design-system cannot depend on presentation layer.',
              },
              {
                group: ['@app/*'],
                message: 'Design-system cannot depend on app layer.',
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
    {
      files: ['**/*.stories.{ts,tsx}', '**/*.styles.ts'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
