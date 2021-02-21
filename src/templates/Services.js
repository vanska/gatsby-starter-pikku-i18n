import React from "react"
import { graphql } from "gatsby"
import { t } from "pikku-i18n"

export default function Services() {
  return (
    <>
      <h1>{t("title")}</h1>
      <p>Page metatitle: {t("metaTitle")}</p>
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
  }
`
