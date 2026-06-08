/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
  ignoreFiles: ['dist/**', 'node_modules/**', 'coverage/**'],
  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['use', 'forward', 'include'],
      },
    ],
    'no-descending-specificity': null,
    'alpha-value-notation': 'number',
  },
}
