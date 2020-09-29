import { Link } from "gatsby"
import React, { useContext } from "react"
import { PageData } from "./Layout.js"
import LanguageSwitcher from "./LanguageSwitcher"
import i18n from "pikku-i18n"

// Deconstructed props
const FooterNavigationItem = ({ path, title, children }) => {
  return (
    <li>
      <Link to={path}>{title}</Link>
      {Array.isArray(children) ? (
        <ul>
          {children.map(childItem => (
            <FooterNavigationItem key={childItem.path} {...childItem} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

const FooterNavigation = props => {
  return (
    <nav>
      <ul>
        {props.items.map(navigationItem => (
          <FooterNavigationItem key={navigationItem.path} {...navigationItem} />
        ))}
      </ul>
    </nav>
  )
}

export default function Footer() {
  const { navigation } = useContext(PageData)

  const { t } = i18n

  return (
    <footer>
      <FooterNavigation items={navigation} />
      <LanguageSwitcher />
      <Link to={`/en/privacy-notice`}>{t("privacy-notice:title")}</Link>
      <p>
        <a
          rel="noreferrer"
          href="https://github.com/vanska/gatsby-starter-pikku-i18n"
          target="_blank"
        >
          gatsby-starter-pikku-i18n#v1.0.1
        </a>
      </p>
    </footer>
  )
}
