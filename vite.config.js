import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: r("index.html"),
        post1: r("posts/post-1.html"),
        post2: r("posts/post-2.html"),
        post3: r("posts/post-3.html"),
      },
    },
  },
});
