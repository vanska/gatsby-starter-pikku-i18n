import React, { useContext } from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { PageData } from "./Layout"
import i18n from "pikku-i18n"
import seoAltLinks from "./seoAltLinks"

const SEO = props => {
  const { t } = i18n

  const {
    namespaces,
    lang,
    metaRobots,
    blogPageTitle,
    isBlogPage
  } = useContext(PageData)

  const metaDescription = isBlogPage
    ? "Blog metadescription"
    : namespaces[0] === "404"
    ? ""
    : props.description || t("metaDescription") || "Default meta title"

  return (
    <Helmet
      htmlAttributes={{ lang: lang }}
      title={blogPageTitle ?? props.title ?? t("metaTitle") ?? "Default title"}
      meta={[
        {
          name: "description",
          content: metaDescription
        },
        {
          name: "robots",
          content: metaRobots ?? metaRobots ?? process.env.META_ROBOTS
        }
      ].concat()}
    >
      {seoAltLinks()}
    </Helmet>
  )
}

SEO.propTypes = {
  props: PropTypes.node
}

export default SEO
