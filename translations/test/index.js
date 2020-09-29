const { checkLocaleStringLengths } = require("pikku-i18n/lib/node-utils")

checkLocaleStringLengths("translations/locales", [
  {
    level: "error",
    type: "word",
    key: "title",
    maxCharacters: 20
  },
  {
    level: "warning",
    type: "paragraph",
    key: "metaTitle",
    maxCharacters: 60
  },
  {
    level: "warning",
    type: "paragraph",
    key: "metaDescription",
    maxCharacters: 300
  }
])
