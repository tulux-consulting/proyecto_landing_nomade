export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/panel', '/panel/*'],
      },
    ],
    sitemap: 'https://nomade-landing.vercel.app/sitemap.xml',
  };
}
