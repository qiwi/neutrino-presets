const lint = require('@neutrinojs/eslint')
const { merge: eslintMerge } = require('eslint/lib/config/config-ops')
const { rules: standardRules } = require('eslint-config-standard')

module.exports = (neutrino, { eslint = {}, ...opts } = {}) => {
  neutrino.use(lint, {
    ...opts,
    eslint: {
      ...eslint,
      baseConfig: eslintMerge(
        {
          extends: [
            require.resolve('eslint-config-standard')
            // require.resolve('eslint-config-prettier'),
            // require.resolve('eslint-config-prettier/standard')
          ],
          // Unfortunately we can't `require.resolve('eslint-plugin-standard')` due to:
          // https://github.com/eslint/eslint/issues/6237
          // ...so we have no choice but to rely on it being hoisted.
          plugins: ['prettier', 'standard', 'security'],
          rules: {
            // Disable rules for which there are eslint-plugin-babel replacements:
            // https://github.com/babel/eslint-plugin-babel#rules
            'new-cap': 'off',
            'no-invalid-this': 'off',
            'object-curly-spacing': 'off',
            semi: 'off',
            'no-unused-expressions': 'off',
            // Ensure the replacement rules use the options set by eslint-config-standard rather than ESLint defaults.
            'babel/new-cap': standardRules['new-cap'],
            // eslint-config-standard doesn't currently have an explicit value for these two rules, so
            // they default to off. The fallbacks are not added to the other rules, so changes in the
            // preset configuration layout doesn't silently cause rules to be disabled.
            'babel/no-invalid-this': standardRules['no-invalid-this'] || 'off',
            'babel/object-curly-spacing': standardRules['object-curly-spacing'] || 'off',
            'babel/semi': standardRules.semi,
            'babel/no-unused-expressions': standardRules['no-unused-expressions'],
            // Add prettier
            'prettier/prettier': ['error', { printWidth: 95, semi: false, singleQuote: true }],
            // Node plugin
            'node/no-unpublished-require': 'error',
            'node/no-extraneous-require': 'error',
            'node/no-missing-require': 'error',
            // Secure plugin
            'security/detect-possible-timing-attacks': 'error',
            'security/detect-eval-with-expression': 'error',
            'security/detect-non-literal-require': 'error',
            'security/detect-non-literal-regexp': 'error',
            'security/detect-pseudoRandomBytes': 'error',
            'security/detect-buffer-noassert': 'error',
            'security/detect-unsafe-regex': 'error',
            'security/detect-new-buffer': 'error'
          }
        },
        eslint.baseConfig || {}
      )
    }
  })
}
