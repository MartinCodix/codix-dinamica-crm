module.exports = {
  root: true,
  ignorePatterns: ["**/*"],
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: { project: ["tsconfig.json"] },
      extends: ["plugin:@angular-eslint/recommended"],
      rules: { "@angular-eslint/directive-selector": "off", "@angular-eslint/component-selector": "off" }
    }
  ]
};