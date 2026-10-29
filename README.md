<img width="1446" height="864" alt="image" src="https://github.com/user-attachments/assets/ef0e8dc1-5169-4a71-981c-4ae1155b1fb2" />


# The Cyber Crew: Linux Terminal Adventures

Run and deploy your app. This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `META_API_KEY` in [.env.local](.env.local) to your Meta Model API key (from https://dev.meta.ai/)
3. Run the app:
   `npm run dev`
4. Open http://localhost:3000 in your browser (or the port set via `PORT`)

Book generation calls the Meta Model API at `https://api.meta.ai/v1` using
`muse-spark-1.2`. Without a key, the app falls back to its built-in procedural
book generator.
