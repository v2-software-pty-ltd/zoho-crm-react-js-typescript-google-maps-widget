const PLACEHOLDER_FOR_SCRIPTS = /<!-- Add js below -->.*<!-- Add js above -->/s
const PLACEHOLDER_FOR_CSS = /<!-- Insert CSS below -->.*<!-- Insert CSS above -->/s
const SCRIPT_REGEX = /<div id="root"><\/div>(.*)<\/body>/
const CSS_REGEX = /<\/title>(.*)<\/head>/

const builtFilePath = './build/index.html'
const appFilePath = './app/index.html'
const fs = require('fs')

const htmlData = fs.readFileSync(builtFilePath).toString()
const appHTML = fs.readFileSync(appFilePath).toString()

const scriptMatches = htmlData.match(SCRIPT_REGEX)
const processedScript = scriptMatches[1].replace(/\/static/g, 'static')

const cssMatches = htmlData.match(CSS_REGEX)
const processedCSS = cssMatches[1].replace(/\/static/g, 'static')

let processedAppHTML = appHTML.replace(
    PLACEHOLDER_FOR_SCRIPTS,
    `
  <!-- Add js below -->
  ${processedScript}
  <!-- Add js above -->
`
)

processedAppHTML = processedAppHTML.replace(
    PLACEHOLDER_FOR_CSS,
    `
  <!-- Insert CSS below -->
  ${processedCSS}
  <!-- Insert CSS above -->
`
)

// remove empty lines
processedAppHTML = processedAppHTML.replace(/^[\s]+$/gm, '').replace(/[\n]+/g, '\n')

fs.writeFileSync(appFilePath, processedAppHTML)
const filename = `index-v${(Math.random() * 100).toFixed(0)}.html`
const newAppHTMLPath = `./app/${filename}`
fs.writeFileSync(newAppHTMLPath, processedAppHTML)
console.log(`Widget path: /${filename}`)
