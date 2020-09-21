import { Link } from "gatsby"
import React, { useContext } from "react"
import i18n from "pikku-i18n"
import { PageData } from "./Layout.js"
import TopNavigation from "./TopNavigation"

export default function Header() {
  const { homePath } = useContext(PageData)
  const { t } = i18n

  return (
    <header>
      <Link to={homePath}>{t("common:title")}</Link>
      <TopNavigation />
    </header>
  )
}
