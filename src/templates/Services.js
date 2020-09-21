import React from "react"
import { graphql } from "gatsby"
import i18n from "pikku-i18n"

export default function WorkdayServicesPage() {
  const { t } = i18n
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
