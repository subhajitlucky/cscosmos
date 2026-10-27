import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: ['.next/**', 'dist/**', 'out/**', 'node_modules/**', 'scratch/**', 'next-env.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // JSX coverage. The config above matches no `.jsx` file, so `npx eslint <file>.jsx`
    // reported "File ignored because no matching configuration was supplied" and the 70
    // `.jsx` files under src/ — including most of jsviz — were invisible to `npm run lint`.
    // Measured before adding this: 0 errors and 2 warnings across all 70, so the gate gains
    // real coverage for free. The shared rule block below still applies; this only supplies
    // the JSX parser mode and the browser/node globals those files assume.
    files: ['**/*.jsx'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node, React: 'readonly' },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-useless-assignment': 'off',
    },
  },
];
