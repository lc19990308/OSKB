module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue/scss',
    'stylelint-config-recommended-vue/scss'
  ],
  rules: {
    'no-descending-specificity': [
      null,
      {
        severity: 'warning'
      }
    ], // 后期需要修改

    'selector-class-pattern': null,
    'scss/double-slash-comment-whitespace-inside': null,
    'scss/at-extend-no-missing-placeholder': null,
    'scss/at-import-partial-extension': null,
    'scss/operator-no-unspaced': null,
    'function-url-quotes': null,
    'color-hex-case': null,
    'color-hex-length': null,
    'block-opening-brace-space-before': null,
    'rule-empty-line-before': null,
    'function-linear-gradient-no-nonstandard-direction': null,
    'color-function-notation': 'legacy',
    indentation: null,
    'scss/no-global-function-names': null,
    'length-zero-no-unit': null,
    'no-extra-semicolons': null,
    'alpha-value-notation': null,
    'string-quotes': null,
    'block-closing-brace-empty-line-before': null,
    'declaration-colon-space-after': null,
    'no-missing-end-of-source-newline': null
  }
}
