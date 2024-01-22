import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: "cjs",
  splitting: false,
  clean: true,
  config: true,
});
