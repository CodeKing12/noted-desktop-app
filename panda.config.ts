import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.{js,jsx,ts,tsx,astro}"],
  exclude: ["./src/backend"],
  theme: {
    extend: {},
  },
  jsxFramework: "solid",
  outdir: "styled-system",
});
