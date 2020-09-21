import React from "react"
import Layout from "./Layout"

const WrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
)

export default WrapPageElement