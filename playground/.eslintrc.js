module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"        
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: { jsx: true },
        sourceType: "module"
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        quotes: ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
        semi: ["error", "always"]
    },
    overrides: [
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/explicit-function-return-type": "off"
            }
        }
    ]
};