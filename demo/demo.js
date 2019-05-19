const bel = require('bel')
const belmark = require('belmark')

const demo1 = require('./demo1.js')
const demo2 = require('./demo2.js')

document.head.innerHTML = `<style> body, html {
  box-sizing: border-box; display: flex;
  margin: 0; min-height: 100vh; width: 100%;
  padding: 10px;
}</style>`

;(async () => {
  if (location.pathname.endsWith('/demo/')) {
    if (location.search === '?demo1') {
      document.body.style = document.documentElement.style = 'padding: 0px;'
      document.body.innerHTML = ''
      var element = await demo1()
      document.body.appendChild(element)
    } else if (location.search === '?demo2') {
      document.body.style = document.documentElement.style = 'padding: 0px;'
      var element = await demo2()
      document.body.appendChild(element)
    } else {
      document.body.style = document.documentElement.style = ''
      const href = location.href.replace(location.search, '')
      const home = href.replace('/demo/', '/')
      document.body.innerHTML = `<div>
        <h1> see demos </h1>
        <a href="${new URL('demo?demo1', home).href}">demo1</a>
        <a href="${new URL('demo?demo2', home).href}">demo2</a>
        <br>or<br>
        <a href="${home}">back</a>
      </div>`
    }
  } else {
    const href = location.href.replace(location.search, '')
    const href_demo = new URL('demo', location.href).href
    const href_readme = new URL('README.md', location.href).href
    const content = await fetch(href_readme).then(response => response.text())
    const markdown = belmark(content)
    const codes = markdown.querySelectorAll('pre > code')
    codes.forEach(x => x.innerHTML = x.textContent)
    document.body.appendChild(bel`<div>
      <h1> demos </h1>
      <a href="${href_demo}">demos</a>
      ${markdown}
    </div>`)
  }
})()
