import { Link } from "gatsby"
import React, { useContext } from "react"
import { PageData } from './Layout.js'
import LanguageSwitcher from "./LanguageSwitcher"

// Deconstructed props
const NavigationItem = ({path, title, children}) => {
  return (
    <li>
      <Link to={path}>
        {title}
      </Link>
      {Array.isArray(children) ? (
      <ul>
        {children.map((childItem) => (
          <NavigationItem 
            key={childItem.path}
            {...childItem}
          />
        ))}
      </ul>
      ) : null}
    </li>
  )
}

const Navigation = props => {
  return (
    <ul>
      {props.items.map((navigationItem) => (
        <NavigationItem
          key={navigationItem.path}
          {...navigationItem}
        />
      ))}
    </ul>
  )
}

export default function TopNavigation() {

  const { navigation } = useContext(PageData)
  
  return (
    <nav>
      <Navigation items={navigation} />
      <LanguageSwitcher />
    </nav>
  )
}