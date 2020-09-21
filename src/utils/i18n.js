import React from "react"

const i18n = (function() {
  let m = {}
  // _defaultNS,
  // _resources

  m.defaultNS = null
  m.resources = null
  m.lang = null
  m.subsRegEx = new RegExp(/\{{([^{]+)}}/g)

  function createI18nResources(d) {
    let { i18nStatic, i18nPage, i18nAdditions } = d
    let r = {}
    if (i18nStatic) {
      i18nStatic.nodes.forEach(n => {
        if (n.lang !== m.lang) return
        r[n.namespace] = JSON.parse(n.allTranslations)
      })
    }
    if (i18nPage) {
      i18nPage.nodes.forEach(n => {
        r[n.namespace] = JSON.parse(n.allTranslations)
      })
    }
    if (i18nAdditions) {
      i18nAdditions.nodes.forEach(n => {
        r[n.namespace] = n.singleTranslations
      })
    }
    return r
  }

  m.use = function(lang, dns, data) {
    m.lang = lang
    m.defaultNS = dns
    m.resources = createI18nResources(data)
  }

  m.t = function(str, subs, trans) {
    let strSplit = str.split(":")
    let key = strSplit.length > 1 ? strSplit[1] : strSplit[0]
    let ns =
      strSplit.length > 1 && strSplit[0].length > 0 ? strSplit[0] : m.defaultNS
    let val = m.resources[ns][key]
    if (trans) {
      return val
    }
    // console.log(`${ns}:${s}`)

    // Check for namespace
    if (!m.resources[ns]) {
      throw new Error(`Namespace not found: ${ns}`)
    }
    // Check string exists
    if (!val) {
      throw new Error(`No string found! ${ns}.${key}`)
    }

    // let subsRegEx = /\{{([^{]+)}}/g
    let strSubs = val.match(m.subsRegEx)
    if (!strSubs) return val

    let passedSubsCount = subs ? Object.keys(subs).length : 0

    if (passedSubsCount !== strSubs.length) {
      throw new Error(
        `Mismatch between string(${strSubs.length}) and passed substitutions (${passedSubsCount}) in ${ns}.${key}`
      )
    }

    return val.replace(m.subsRegEx, function(_, subsKey) {
      if (!subs[subsKey]) {
        throw new Error(
          `Missing substitution variable {{${key}}} in ${ns}.${key}`
        )
      }
      return subs[subsKey] && subs[subsKey]
    })
  }

  return m
})()

export default i18n

export const Trans = ({ i18nKey, ...rest }) => (
  <>
    {i18n
      .t(i18nKey, "", true)
      .split(i18n.subsRegEx)
      .reduce((prev, current, i) => {
        if (!i) return [current]
        return prev.concat(
          Object.keys(rest).includes(current) ? rest[current] : current
        )
      }, [])}
  </>
)
