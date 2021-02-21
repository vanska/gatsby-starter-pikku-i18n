import { Link } from "gatsby"
import React, { useContext } from "react"
import { t } from "pikku-i18n"
import { PageData } from "./Layout.js"
import TopNavigation from "./TopNavigation"

export default function Header() {
  const { homePath } = useContext(PageData)

  return (
    <header>
      <Link to={homePath}>{t("common:title")}</Link>
      <TopNavigation />
    </header>
  )
}
