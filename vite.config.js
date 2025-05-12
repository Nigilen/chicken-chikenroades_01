import { defineConfig } from "vite";
import path from "path";
import fs from 'fs';
import handlebars from 'vite-plugin-handlebars';
import { createHtmlPlugin } from 'vite-plugin-html';
import { SitePages } from "./src/utils/pages";
import { pagesInfo } from "./src/utils/pagesInfo";

function getHtmlFiles(dir) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.html'))
    .reduce((acc, file) => {
      const name = path.basename(file, '.html');
      acc[name] = path.resolve(dir, file);
      return acc;
    }, {});
}

export default defineConfig(({ command }) => {
  const root = path.resolve(__dirname, 'src');
  const publicDir = path.resolve(__dirname, 'public');

  const resolve = {
    alias: {
      "@s": path.resolve(__dirname, "./src/style"),
      "@m": path.resolve(__dirname, "./src/js/module"),
      "@u": path.resolve(__dirname, "./src/utils"),
      "@i": path.resolve(__dirname, "./img"),
      "@f": path.resolve(__dirname, "./fonts"),
    },
  };

  const server = {
    port: 8080,
    open: '/',
    fs: {
      strict: false
    }
  };

  const plugins = [
    handlebars({
      partialDirectory: path.resolve(__dirname, './src/partials'),
      reloadOnPartialChange: true,
      context() {
        const baseContext = pagesInfo.home;
        return baseContext;
      }
    }),
    createHtmlPlugin({
      minify: false,
      pages: SitePages,
    }),
  ];

  if (command === "serve") {
    return {
      root,
      publicDir,
      resolve,
      server,
      plugins
    }
  } else {
    return {
      root,
      publicDir,
      resolve,
      server,
      plugins,
      build: {
        outDir: path.resolve(__dirname, 'dist'),
        minify: "terser",
        rollupOptions: {
          input: {
            ...getHtmlFiles(root),
            main: path.join(root, 'js/main.js')
          },
          output: {
            assetFileNames: 'assets/[name].[hash][extname]',
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js'
          }
        }
      }
    }
  }
});