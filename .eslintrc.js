module.exports = {
    "ignorePatterns": ["build/", "node_modules/", "dist/", "cypress/"],
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jest/globals": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "import",
        "jest"
    ],
    "settings": {
        "react": {
            "version": "detect",
        }
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "standard"
    ],
    "rules": {
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-floating-promises": ["error",
            {
                "ignoreVoid": true
            }
        ],
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "never"
        ],
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/unified-signatures": "error",
        "camelcase": 0,
        "comma-dangle": "error",
        "curly": [
            "error",
            "multi-line"
        ],
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "id-blacklist": [
            "error",
            "any",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined"
        ],
        "id-length": [
            "error",
            {
                "min": 3,
                "exceptions": [
                    "id",
                    "i",
                    "_p",
                    "e",
                    "y",
                    "fs",
                    "to"
                ]
            }
        ],
        "id-match": "error",
        "import/no-deprecated": "error",
        "new-parens": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-constant-condition": "error",
        "no-control-regex": "error",
        "no-debugger": "error",
        "no-duplicate-imports": "error",
        "no-empty": "error",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-invalid-regexp": "error",
        "no-multiple-empty-lines": "error",
        "no-redeclare": "error",
        "no-regex-spaces": "error",
        "no-return-await": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-useless-constructor": "off",
        "no-underscore-dangle": "off",
        "no-unused-expressions": [
            "error",
            {
                "allowTaggedTemplates": true,
                "allowShortCircuit": true,
                "allowTernary": true
            }
        ],
        "no-unused-labels": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
            "vars": "all",
            "args": "after-used",
            "ignoreRestSiblings": false
        }],
        "no-var": "error",
        "no-void": "off",
        "one-var": [
            "error",
            "never"
        ],
        "radix": "error",
        "space-before-function-paren": [
            "error",
            "always"
        ],
        "spaced-comment": "error",
        "use-isnan": "error",
        "block-spacing": [
            'error',
            "always"
        ],
        "brace-style": [
            'error',
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        "handle-callback-err": [
            'error',
            "^(err|error)$"
        ],
        "react/display-name": "off",
        "react/jsx-closing-tag-location": 'error',
        "react/jsx-boolean-value": 'error',
        "react/jsx-curly-spacing": [
            'error',
            "never"
        ],
        "react/jsx-equals-spacing": [
            'error',
            "never"
        ],
        "react/jsx-key": 'error',
        "react/jsx-no-bind": ['error',
            {
                'allowArrowFunctions': true
            }
        ],
        "react/no-string-refs": 'error',
        // NB not relevant in nextjs
        // https://spectrum.chat/next-js/general/react-must-be-in-scope-when-using-jsx~6193ef62-4d5e-4681-8f51-8c7bf6b9d56d
        "react/react-in-jsx-scope": 'off',
        "react/self-closing-comp": 'error',
        "no-duplicate-case": 'error',
        "no-empty-character-class": 'error',
        "no-ex-assign": 'error',
        "no-extra-boolean-cast": 'error',
        "no-inner-declarations": [
            'error',
            "functions"
        ],
        "no-multi-spaces": 'error',
        "no-unexpected-multiline": 'error',
        "arrow-spacing": [
            'error'
        ],
        "space-in-parens": ["error", "never"],
        "func-call-spacing": [
            'error',
            "never"
        ],
        "indent": [
            'error',
            4
        ],
        "no-irregular-whitespace": 'error',
        "no-sparse-arrays": 'error',
        "valid-typeof": 'error'
    }
}
