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
      // The static export only exposes the URL, storage and fetched data
      // after hydration, so setting state from an effect is the norm here.
      "react-hooks/set-state-in-effect": "off",
      // Only meaningful with the React Compiler, which this app doesn't run.
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
];

export default config;
