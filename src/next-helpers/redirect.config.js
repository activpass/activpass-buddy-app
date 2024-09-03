/** @type {import('../types').RedirectConfig} */
const redirects = {
  externals: [
    {
      source: '/index.html',
      destination: '/',
    },
    {
      source: '/api.html',
      destination: '/api',
    },
    {
      source: '/',
      destination: '/dashboard',
    },
    {
      source: '/:locale/dashboard.html',
      destination: '/:locale/dashboard',
    },
    { source: '/health', destination: '/api/health' },
    { source: '/ping', destination: '/api/health' },
    { source: '/api/ping', destination: '/api/health' },
    {
      source: '/(static/|)favicon.ico',
      destination: '/favicons/favicon.ico',
    },
    {
      source: '/(static/|)favicon.png',
      destination: '/favicons/favicon.ico',
    },
    {
      source: '/(static/|)apple-touch-icon(.*).png',
      destination: '/favicons/apple-touch-icon.png',
    },
    {
      source: '/(static/)logo.png',
      destination: '/logos/png/activpass-buddy-logo-white-blue.png',
    },
  ],
  internals: [],
  rewrites: {
    beforeFiles: [],
    afterFiles: [],
    fallback: [],
  },
};

export default redirects;
