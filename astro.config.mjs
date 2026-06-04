// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import db from "@astrojs/db";

const isProductionBuild = process.argv.includes("build");

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: isProductionBuild ? cloudflare() : undefined,
  integrations: [db()],
});
