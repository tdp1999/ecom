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
        // 'import/no-restricted-paths': [
        //     'error',
        //     {
        //         zones: [
        //             // Category module rules
        //             {
        //                 target: './src/modules/category/domain/**/*',
        //                 from: './src/**/*',
        //                 except: ['./src/modules/category/domain/**/*', './src/shared/**/*'],
        //                 message: 'Category domain can only import from its own domain or shared module',
        //             },
        //             // Brand module rules
        //             {
        //                 target: './src/modules/brand/domain/**/*',
        //                 from: './src/**/*',
        //                 except: ['./src/modules/brand/domain/**/*', './src/shared/**/*'],
        //                 message: 'Brand domain can only import from its own domain or shared module',
        //             },
        //             // Product module rules
        //             {
        //                 target: './src/modules/product/domain/**/*',
        //                 from: './src/**/*',
        //                 except: ['./src/modules/product/domain/**/*', './src/shared/**/*'],
        //                 message: 'Product domain can only import from its own domain or shared module',
        //             },
        //             {
        //                 target: './src/modules/user/domain/**/*',
        //                 from: './src/**/*',
        //                 except: ['./src/modules/user/domain/**/*', './src/shared/**/*', '@shared/**'],
        //                 message: 'User domain can only import from its own domain or shared module',
        //             },
        //             // Prevent adapters/infrastructure imports in domain
        //             {
        //                 target: './src/modules/*/domain/**/*',
        //                 from: './src/modules/*/adapters/**/*',
        //                 message: 'Domain layer cannot import from infrastructure layer',
        //             },
        //             // Prevent application imports in domain
        //             {
        //                 target: './src/modules/*/domain/**/*',
        //                 from: './src/modules/*/application/**/*',
        //                 message: 'Domain layer cannot import from application layer',
        //             },
        //         ],
        //     },
        // ],
        // // Ensure imports are properly resolved
        // 'import/no-unresolved': 'error',
        // // Prevent circular dependencies
        // 'import/no-cycle': 'error',
        // // Ensure imports are ordered
        // 'import/order': [
        //     'error',
        //     {
        //         groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        //         alphabetize: {
        //             order: 'asc',
        //             caseInsensitive: true,
        //         },
        //         pathGroups: [
        //             {
        //                 pattern: '@shared/**',
        //                 group: 'internal',
        //                 position: 'before',
        //             },
        //             {
        //                 pattern: '@category/**',
        //                 group: 'internal',
        //                 position: 'before',
        //             },
        //             {
        //                 pattern: '@brand/**',
        //                 group: 'internal',
        //                 position: 'before',
        //             },
        //             {
        //                 pattern: '@product/**',
        //                 group: 'internal',
        //                 position: 'before',
        //             },
        //             {
        //                 pattern: '@user/**',
        //                 group: 'internal',
        //                 position: 'before',
        //             },
        //         ],
        //     },
        // ],
    },
};
