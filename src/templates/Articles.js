import React from "react"
import { graphql, Link } from "gatsby"
import i18n from "pikku-i18n"

export default function Content({ data, path }) {
  const { t } = i18n
  const { pages } = data
  return (
    <>
      <h1>{t("title")}</h1>
      <p>Page metatitle: {t("metaTitle")}</p>
      <ul>
        {pages.nodes.map(page => (
          <li key={page.frontmatter.slug}>
            <Link to={`${path}/${page.frontmatter.slug}`}>
              {page.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
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
    pages: allMdx(
      filter: {
        fields: { lang: { eq: $lang } }
        frontmatter: { privacy_page: { ne: true } }
      }
    ) {
      nodes {
        frontmatter {
          title
          slug
        }
      }
    }
  }
`
