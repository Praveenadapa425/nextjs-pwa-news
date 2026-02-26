require("@testing-library/jest-dom");

// Mock Next.js components
jest.mock("next/link", () => {
  const React = require('react');
  return ({ children, href }) => {
    return React.createElement("a", { href }, children);
  };
});