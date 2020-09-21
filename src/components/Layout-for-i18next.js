import React, { createContext, useState, useEffect, Suspense } from "react"
import i18next from "i18next"
import { initReactI18next, I18nextProvider } from "react-i18next"
import XHR from "i18next-xhr-backend"
import PropTypes from "prop-types"
import SEO from "./Seo"
import Header from "./Header"
import Footer from "./Footer"
import "./layout.css"

export const PageData = createContext()

const createI18nResources = (data, pageContext) => {
  let i18nResourcesObj = {}
  if (data.i18n) {
    let transformedNodes = {}
    // Add i18n resources from pageContext
    data.i18n.nodes.forEach(node => {
      transformedNodes[node.namespace] = JSON.parse(node.allTranslations)
    })
    i18nResourcesObj[pageContext.lang] = transformedNodes
    // Add i18nAdditions to the object
    if (data.i18nAdditions) {
      data.i18nAdditions.nodes.forEach(node => {
        transformedNodes[node.namespace] = node.singleTranslations
      })
      i18nResourcesObj[pageContext.lang] = transformedNodes
    }
  }
  return i18nResourcesObj
}

/**
 * Takes in a node array and returns an object to access
 * navigation links trough namespaces with dot notation
 */
const combineNavigationLinkNodes = nodes =>
  nodes
    .map(item => ({
      [item.namespace]: {
        ...item,
      },
    }))
    .reduce((a, c) => ({ ...a, ...c }))

const combineNamespaces = (ns, data) => {
  let arr = [...ns]
  data.i18nAdditions &&
    data.i18nAdditions.nodes.forEach(n => arr.push(n.namespace))
  return arr
}

// Leaving this code here for when Suspense will support SSR
// Otherwise page will flash if using two separate components
// Todo: Try Suspense SSR workaround with another library
export function LayoutBrowser({ children, data, pageContext }) {
  const i18nResources = createI18nResources(data, pageContext)
  const defaultNSResources =
    i18nResources[pageContext.lang][pageContext.namespaces[0]]
  const navigationLinks =
    data.allNavigationLinks &&
    combineNavigationLinkNodes(data.allNavigationLinks.nodes)
  const pageData = {
    ...pageContext, // No HMR
    navigation: JSON.parse(data.navigation.all), // HMR
    navigationLinks, // HMR
    homePath: pageContext && `/${pageContext.lang}`,
    seo: {
      metaTitle: defaultNSResources.metaTitle,
      metaDescription: defaultNSResources.metaDescription,
    },
  }
  const combinedNamespaces = combineNamespaces(pageContext.namespaces, data)

  const [i18nextInitialized, setII8nextInitialized] = useState(false)

  useEffect(() => {
    if (!i18nextInitialized) {
      i18next
        .use(XHR)
        .use(initReactI18next)
        .init({
          lng: pageContext.lang,
          ns: "runtime",
          partialBundledLanguages: true,
          interpolation: { escapeValue: false },
          initImmediate: false,
          resources: i18nResources,
          debug: process.env.GATSBY_ENV !== "production" ? true : false,
        })

      i18next.setDefaultNamespace(pageContext.namespaces[0])

      i18next.loadNamespaces(combinedNamespaces)

      setII8nextInitialized(true)
    }
  }, [
    i18nextInitialized,
    combinedNamespaces,
    pageContext.lang,
    pageContext.namespaces,
    i18nResources,
  ])

  useEffect(() => {
    if (i18nextInitialized) {
      Object.keys(i18nResources[pageContext.lang]).forEach(namespace => {
        i18next.addResourceBundle(
          pageContext.lang,
          namespace,
          i18nResources[pageContext.lang][namespace],
          true,
          false
        )
      })

      i18next.setDefaultNamespace(pageContext.namespaces[0])

      // Will force i18next to rerender
      i18next.changeLanguage(pageContext.lang)
    }
  }, [
    i18nextInitialized,
    i18nResources,
    pageContext.lang,
    pageContext.namespaces,
  ])

  return (
    <Suspense fallback="">
      <I18nextProvider i18n={i18next}>
        <PageData.Provider value={pageData}>
          <SEO />
          <Header />
          <main>{children}</main>
          <Footer />
        </PageData.Provider>
      </I18nextProvider>
    </Suspense>
  )
}

export function LayoutSSR({ children, data, pageContext }) {
  const i18nResources = createI18nResources(data, pageContext)
  const defaultNSResources =
    i18nResources[pageContext.lang][pageContext.namespaces[0]]
  const navigationLinks =
    data.allNavigationLinks &&
    combineNavigationLinkNodes(data.allNavigationLinks.nodes)
  const pageData = {
    ...pageContext, // No HMR
    navigation: JSON.parse(data.navigation.all), // HMR
    navigationLinks, // HMR
    homePath: pageContext && `/${pageContext.lang}`,
    seo: {
      metaTitle: defaultNSResources.metaTitle,
      metaDescription: defaultNSResources.metaDescription,
    },
  }

  i18n.use(data, pageContext)

  i18next.use(initReactI18next).init({
    lng: pageContext.lang,
    ns: combineNamespaces(pageContext.namespaces, data),
    defaultNS: pageContext.namespaces[0],
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    saveMissing: true,
    saveMissingTo: "current", // missing keys reported in current language
    missingKeyHandler:
      process.env.GATSBY_ACTIVE_ENV !== "production"
        ? null
        : (lng, ns, key, _) => {
            throw new Error(`Missing translation key: ${lng}.${ns}.${key}`) // Check all strings exist at build time
          },
    resources: i18nResources,
    debug: process.env.GATSBY_ACTIVE_ENV !== "production" ? true : false,
    react: {
      useSuspense: false, // SSR not supported by Suspense yet. Only sync resource loading.
    },
  })

  return (
    <I18nextProvider i18n={i18next}>
      <PageData.Provider value={pageData}>
        <SEO />
        <Header />
        <main>{children}</main>
        <Footer />
      </PageData.Provider>
    </I18nextProvider>
  )
}

LayoutBrowser.propTypes = {
  children: PropTypes.node.isRequired,
}

LayoutSSR.propTypes = {
  children: PropTypes.node.isRequired,
}
