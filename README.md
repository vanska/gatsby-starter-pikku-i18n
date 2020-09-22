# gatsby-starter-pikku-i18n

An opinionated Gatsby starter template for multi-lingual workflow.

:fire: [Starter on firebase](https://gatsby-starter-pikku-i18n.web.app)

Acts as an end-to-end test project for these projects aiming to solve the i18n problem for Gatsby:

- `pikku-i18n`
- `vanska/gatsby-plugin-transform-i18n-locales`
- `vanska/gatsby-plugin-i18n-pages-from-json`
- `vanska/gatsby-plugin-transform-site-config-json`
- `vanska/gatsby-plugin-generate-i18n-navigation`
- `vanska/gatsby-plugin-create-i18n-mdx-pages`

## Features

- Generates internationalized pages with `createPages` API, i18n locales and site config with the help of custom Gatsby plugins
- SSR and client-side translations with `pikku-i18n`
- HMR (Hot Module reloading) of translations
- Throw error on missing translations during build
- GatsbyJS plugins for GraphQL node creation for efficient and flexible page queries
- SEO components
- Meta tags from context API
  - Possibility to override on component level
- Meta alternate link generation for each language
- Sitemap.xml generation
- Robots.txt
  - Crawling allowed only for production build
- `noindex, nofollow` for all non-production build pages and for all 404 pages
- MDX pages with slugs from i18n locales

:fire: Firebase hosting support:

- Correct cache settings for GatsbyJS static files
- Generate `firebase.json` based on default settings from `./config/firebase-defaults.json` and site configuration
  - Always redirect URLs without language prefix to the prefixed default language
    - e.g. `site.com/services` => `site.com/en/services`
  - Soft redirects to language specific 404 pages
  - All urls without trailing slash
- Support for custom redirects
  - e.g. `site.com/design` => `site.com/en/services/design`
- Google Cloud build support
- Connect to a GitHub or BitBucket repository for CI/CD
