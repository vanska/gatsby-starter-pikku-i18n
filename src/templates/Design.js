import React from "react"
import { graphql } from "gatsby"
import { t } from "pikku-i18n"

export default function PreDeploymentPage() {
  return (
    <>
      <h1>{t("title")}</h1>
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
