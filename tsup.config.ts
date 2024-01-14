import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/*.ts"],
  splitting: false,
  clean: true,
});
