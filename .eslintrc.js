module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaFeatures: {
            legacyDecorators: true,
        },
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'decorator-position', 'import'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:import/typescript'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json',
            },
            node: true,
        },
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                parser: 'typescript',
            },
        ],
        'import/no-restricted-paths': [
            'error',
            {
                zones: [
                    // Prevent adapters/infrastructure imports in domain
                    {
                        target: './src/modules/*/domain/**/*',
                        from: './src/modules/*/adapters/**/*',
                        message: 'Domain layer cannot import from infrastructure layer',
                    },
                ],
            },
        ],
        // Ensure imports are properly resolved
        'import/no-unresolved': 'error',
        // Prevent circular dependencies
        'import/no-cycle': 'error',
    },
};
