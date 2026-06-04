// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import db from "@astrojs/db";
import { loadEnv } from "vite";

const isProductionBuild = process.argv.includes("build");

if (isProductionBuild) {
  const { ASTRO_DB_REMOTE_URL } = loadEnv("production", process.cwd(), "");
  const isRemoteUrl =
    ASTRO_DB_REMOTE_URL?.startsWith("libsql:") ||
    ASTRO_DB_REMOTE_URL?.startsWith("https:") ||
    ASTRO_DB_REMOTE_URL?.startsWith("http:");

  if (!isRemoteUrl) {
    throw new Error(
      "Production builds require ASTRO_DB_REMOTE_URL to point to a remote libSQL database. " +
        "Do not build the Cloudflare Worker with file:./local.db.",
    );
  }
}

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: isProductionBuild ? cloudflare() : undefined,
  integrations: [db({ mode: isProductionBuild ? "web" : "node" })],
});
