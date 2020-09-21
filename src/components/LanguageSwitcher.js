import React, { useContext } from "react"
import { Link } from "gatsby"
import { PageData } from "./Layout.js"

export default function LanguageSwitcher() {
  const { languages, alternateLinks } = useContext(PageData)

  return (
    <ul>
      {alternateLinks
        ? alternateLinks.map((link, i) => (
            <li key={link.path + i}>
              <Link to={link.path}>{link.lang}</Link>
            </li>
          ))
        : languages.map((language, i) => (
            <li key={language + i}>
              <Link to={`/${language}`}>{language}</Link>
            </li>
          ))}
    </ul>
  )
}
