import React, { useContext } from "react"
import { graphql, Link } from "gatsby"
import SEO from "../components/Seo"
import { PageData } from "../components/Layout"
import { t, Trans, resources } from "pikku-i18n"

export default function HomePage() {
  const { navigationLinks } = useContext(PageData)

  console.log(resources)

  return (
    <>
      <SEO title={t("title")} />
      <h1>{t("title")}</h1>
      <p>{t("countries", { countryCount: 3 })}</p>
      <p>{t("countries", { countryCount: t("countryCount") })}</p>
      <p>
        <Trans
          i18nKey="countries"
          subs={{ countryCount: <strong key={`countryCountSpanId`}>3</strong> }}
        />
        <Trans
          i18nKey="countries"
          subs={{
            countryCount: (
              <span key={`countryCountSpanId`}>{t("countryCount")}</span>
            )
          }}
        />
      </p>
      <p>Active Node environment: {process.env.NODE_ENV}</p>
      <p>Active Gatsby environment: {process.env.GATSBY_ACTIVE_ENV}</p>
      <Link to={navigationLinks["services"].path}>
        {navigationLinks["services"].title}
      </Link>
      <Link to={navigationLinks["services"].path}>{t("services:title")}</Link>
      <Link to={navigationLinks["design"].path}>
        {navigationLinks["design"].title}
      </Link>
      <Link to={navigationLinks["design"].path}>{t("design:title")}</Link>
    </>
  )
}

export const TranslationsQuery = graphql`
  query($lang: String!, $namespaces: [String!]) {
    i18n: allI18NNamespaces(
      filter: { lang: { eq: $lang }, namespace: { in: $namespaces } }
    ) {
      nodes {
        namespace
        allTranslations
      }
    }
    i18nAdditions: allI18NNamespaces(
      filter: {
        lang: { eq: $lang }
        # Query additional translation strings here
        namespace: { in: ["services", "design"] }
      }
    ) {
      nodes {
        namespace
        singleTranslations {
          title
        }
      }
    }
  }
`
