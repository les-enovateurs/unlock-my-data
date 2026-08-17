import React from "react";
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";

// jsdom ships neither, though every browser has both. Code decoding fetched
// bytes (components/review/policyText.ts) would otherwise fail only under test.
Object.assign(globalThis, {
  TextEncoder: globalThis.TextEncoder ?? TextEncoder,
  TextDecoder: globalThis.TextDecoder ?? TextDecoder,
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement("img", props)
}));
