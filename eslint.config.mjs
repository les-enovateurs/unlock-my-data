import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

const config = [
  {
    ignores: [
      // ESLint 9 no longer skips dot-directories (local tooling, untracked).
      ".*/**",
      ".next/**",
      "out/**",
      "ds-bundle/**",
      "build/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
      "doc/**",
      "docs/**",
      "design/**",
      "design-3/**",
      "prez/**",
      "prez-umd/**",
      "reports/**",
      "tmp/**",
    ],
  },
  ...nextCoreWebVitals,
  prettier,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      // React Compiler rules new in react-hooks v7: they flag existing,
      // working code. Warn until the code is migrated, then make them errors.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
];

export default config;
