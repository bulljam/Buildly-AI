export const DEFAULT_PROJECT_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Untitled Buildly Project</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, Arial, sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #f6f7fb 0%, #eef2ff 100%);
        color: #111827;
      }

      main {
        width: min(720px, calc(100% - 32px));
        border-radius: 24px;
        padding: 48px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
      }

      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 3.5rem);
      }

      p {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.7;
        color: #4b5563;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Your website starts here.</h1>
      <p>Describe the site you want to build and Buildly AI will generate a complete HTML page you can preview, refine, and download.</p>
    </main>
  </body>
</html>`
