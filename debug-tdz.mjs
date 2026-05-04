import { createServer } from 'vite';
import fs from 'fs';

async function run() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    build: { minify: false }
  });

  try {
    // We create a temp file to load that will render the App
    const tempFile = `
      import React from 'react';
      import { renderToString } from 'react-dom/server';
      import App from './src/AppRoot.jsx';

      export function render() {
        return renderToString(React.createElement(App));
      }
    `;
    fs.writeFileSync('temp-render.jsx', tempFile);

    const mod = await vite.ssrLoadModule('/temp-render.jsx');
    mod.render();
    console.log("Render successful!");
  } catch (e) {
    console.error("ERROR CAUGHT:");
    console.error(e);
  } finally {
    vite.close();
    if (fs.existsSync('temp-render.jsx')) fs.unlinkSync('temp-render.jsx');
  }
}

run();
