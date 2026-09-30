# Recipe Finder
React + TypeScript + React Router, using TheMealDB API (no key needed).

    npm install
    npm run dev      # local
    npm run build    # production build in dist/

Deploy: push to GitHub, import on Vercel/Netlify (build: `npm run build`, output: `dist`).
For Netlify add `public/_redirects` containing `/* /index.html 200` so deep links to /recipe/:id work.
