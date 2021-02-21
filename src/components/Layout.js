import React, { createContext } from "react"
import PropTypes from "prop-types"
import { init } from "pikku-i18n"
import SEO from "./Seo"
import { useStaticQuery, graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
// import MdxLink from "./mdxLink"
import Header from "./Header"
import Footer from "./Footer"
import "./layout.css"

export const PageData = createContext()

const createNavigation = (lang, nodes) =>
  nodes.filter(node => node.lang === lang).map(node => JSON.parse(node.all))[0]

// Create navigation links for dot notation access
const combineNavigationLinkNodes = (lang, nodes) =>
  nodes
    .filter(node => node.lang === lang)
    .map(item => ({
      [item.namespace]: {
        ...item
      }
    }))
    .reduce((a, c) => ({ ...a, ...c }))

export function Layout({ children, data, pageContext }) {
  // console.log("data", data)
  // console.log("pageContext", pageContext)

  const {
    allNavigation,
    allNavigationLinks,
    i18nStatic,
    siteConfig
  } = useStaticQuery(
    graphql`
      query {
        siteConfig {
          languages
        }
        allNavigation {
          nodes {
            all
            lang
          }
        }
        allNavigationLinks {
          nodes {
            namespace
            path
            lang
            title
          }
        }
        i18nStatic: allI18NNamespaces(
          filter: { namespace: { in: ["common", "privacy-notice"] } }
        ) {
          nodes {
            lang
            namespace
            allTranslations
          }
        }
      }
    `
  )

  const pageData = {
    alternateLinks: pageContext.alternateLinks,
    languages: siteConfig.languages,
    ...pageContext, // No HMR
    navigation: createNavigation(pageContext.lang, allNavigation.nodes),
    isBlogPage: !data.i18n ? true : false,
    blogPageTitle: pageContext.title && pageContext.title,
    navigationLinks: combineNavigationLinkNodes(
      pageContext.lang,
      allNavigationLinks.nodes
    ),
    homePath: pageContext && `/${pageContext.lang}`
  }

  function transformGatsbyNodeData(d) {
    let { i18nStatic, i18nPage, i18nAdditions } = d
    let r = {}
    if (i18nStatic) {
      i18nStatic.nodes.forEach(n => {
        if (n.lang !== pageContext.lang) return
        r[n.namespace] = JSON.parse(n.allTranslations)
      })
    }
    if (i18nPage) {
      i18nPage.nodes.forEach(n => {
        r[n.namespace] = JSON.parse(n.allTranslations)
      })
    }
    if (i18nAdditions) {
      i18nAdditions.nodes.forEach(n => {
        r[n.namespace] = n.singleTranslations
      })
    }
    return r
  }

  const localesData = transformGatsbyNodeData({
    i18nStatic,
    i18nPage: data.i18n && data.i18n,
    i18nAdditions: data.i18nAdditions && data.i18nAdditions
  })

  init(
    pageContext.lang,
    pageContext.namespaces ? pageContext.namespaces[0] : "common",
    localesData
  )

  return (
    <PageData.Provider value={pageData}>
      <SEO />
      <Header />
      <MDXProvider>
        <main>{children}</main>
      </MDXProvider>
      <Footer />
    </PageData.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}
