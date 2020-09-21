const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
  path: `.env.${activeEnv}`
})

const I18N_LOCALES_DIR = `${__dirname}/translations/locales`
const SITE_CONFIG_PATH = `${__dirname}/config/site-config.json`

module.exports = {
  siteMetadata: {
    title: `gatsby-starter-pikku-i18n`,
    description: `Multilingual boilerplate with pikku-i18n and programatic pages`,
    author: `Mikko Vänskä`,
    siteUrl: process.env.SITE_URL
  },
  plugins: [
    {
      resolve: `gatsby-plugin-compile-es6-packages`,
      options: {
        modules: [`pikku-i18n`]
      }
    },
    {
      resolve: `gatsby-plugin-generate-i18n-navigation`,
      options: {
        i18nLocalesDir: I18N_LOCALES_DIR,
        siteConfigPath: SITE_CONFIG_PATH
      }
    },
    {
      resolve: `gatsby-plugin-create-i18n-mdx-pages`,
      options: {
        i18nLocalesDir: I18N_LOCALES_DIR,
        contentPageNamespace: "articles",
        contentTemplate: `${__dirname}/src/templates/Article.js`
      }
    },
    {
      resolve: `gatsby-plugin-i18n-pages-from-json`,
      options: {
        i18nLocalesDir: I18N_LOCALES_DIR,
        siteConfigPath: SITE_CONFIG_PATH,
        createAlternateLinkContext: true,
        createFirebaseRedirectRules: true,
        firebaseConfigDefaultsPath: `${__dirname}/config/firebase-defaults.json`
      }
    },
    `gatsby-plugin-transform-i18n-locales`, // github.com/vanska
    `gatsby-plugin-transform-site-config-json`, // github.com/vanska
    `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `i18n-locales`,
        path: `${__dirname}/translations/locales/`
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`, // https://developer.mozilla.org/en-US/docs/Web/Manifest
      options: {
        name: `Gatsby pikku-i18n`, // String that represents the name of the web application as it is usually displayed to the user.
        background_color: `#FFFFFF`, // Defines a placeholder background color for the application page to display before its stylesheet is loaded.
        theme_color: `#FFFFFF`,
        icon: `src/images/gatsby-icon.png`
        // theme_color_in_head: false, // This will avoid adding theme-color meta tag.
      }
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: process.env.SITE_URL,
        sitemap: `${process.env.SITE_URL}/sitemap.xml`,
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }]
          },
          staging: {
            policy: [{ userAgent: "*", disallow: ["/"] }]
          },
          production: {
            policy: [{ userAgent: "*", allow: "/" }]
          }
        }
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: ["/404", "/*/404"],
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            edges {
              node {
                path
                context {
                  alternateLinks {
                    lang
                    path
                  }
                }
              }
            }
          }
      }`,
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges.map(edge => {
            return {
              url: site.siteMetadata.siteUrl + edge.node.path,
              changefreq: `daily`,
              priority: 0.7,
              links:
                edge.node.context.alternateLinks &&
                edge.node.context.alternateLinks.map(link => ({
                  lang: link.lang,
                  url: site.siteMetadata.siteUrl + link.path
                }))
            }
          })
      }
    }
  ]
}
