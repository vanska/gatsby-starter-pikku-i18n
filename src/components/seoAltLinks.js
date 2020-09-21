import React, { useContext } from "react"
import { PageData } from "./Layout.js"

export default function() {
  const { alternateLinks } = useContext(PageData)

  return alternateLinks
    ? alternateLinks.map(link => (
        <link
          key={link.path}
          rel="alternate"
          hrefLang={link.lang}
          href={link.path}
        />
      ))
    : null
}
