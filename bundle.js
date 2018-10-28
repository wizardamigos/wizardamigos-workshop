(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var usage = require('./usage.js')

var el = usage({
  repo: 'https://github.com/wizardamigos/workshop',
  script: `
    document.body.style = \`margin: 0; height: 100vh\`
    require.RELOAD = true
    require.VERBOSE = true

    // USAGE
    const workshop = require('./src/workshop.js') // no default theme initialised
    console.log('workshop', workshop)

    // var workshop1 = workshop.customize(workshop.defaults) // default theme initialised
    // console.log(workshop === workshop1) // true
    // /* or */ var workshop2 = workshop.customize({})
    // console.log(workshop1 === workshop2) // false
    // var el = workshop({}) // inits and uses default theme

    const app = await workshop({ workshop: './test/workshop.json' })
    const el = app.render()
    el.style = 'border: 1px dotted green;'
    console.log(el)
    document.body.appendChild(el)
  `
}, (err, el) => {
  document.body.style = `
    margin: 0;
    height: 100vh;
    width: 100vw;
  `
  document.body.appendChild(el)
})

//   /******************************************************************************
//     USAGE (example)
//   ******************************************************************************/
//   const config = {
//     theme: {
//       '--lessonBGcolor' : '#0000ff',
//       '--arrowColor'    : 'magenta',
//       '--titleSize'     : '50px',
//     },
//     data: {
//       title: 'workshop',
//       iconURL: null,
//       lessons: [{ // example item
//         "title"    : "Move Bitcoin from Coinbase to Electrum",
//         "learn"    : "https://www.youtube.com/watch?v=9fvDp43rShA",
//         "practice" : "",
//       }],
//     },
//     css: csjs`
//       .workshop          {
//         --lessonBGcolor  : ${theme['--lessonBGcolor']};
//         --arrowColor     : ${theme['--arrowColor']};
//         --titleSize      : ${theme['--titleSize']};
//         display          : flex;
//         flex-direction   : column;
//         width            : 100%;
//         height           : 100%;
//       }
//       .navbar            {
//         display          : flex;
//         width            : 100%;
//         margin           : 0;
//       }
//       .arrow             {
//         background-color : grey;
//         font-size        : 150px;
//         font-weight      : 900;
//         cursor           : pointer;
//       }
//       .arrow:hover       {
//         background-color : black;
//         color            : var(--arrowColor);
//       }
//       .status            {
//         display          : flex;
//         justify-content  : center;
//         align-items      : center;
//         flex-grow        : 1;
//       }
//       .icon              {
//         height           : var(--titleSize};
//         margin-right     : 10px;
//       }
//       .title             {
//         font-size        : var(--titleSize};
//         font-family      : arial;
//         font-weight      : 900;
//       }
//       .lesson            {
//         display          : flex;
//         background-color : var(--lessonBGcolor);
//         flex-grow        : 1;
//       }
//     `
//   }
//   const workshop2 = workshop.config(config)
//
//   // @TODO: .... what about this ???
//   var customCSS = {
//     learn: css.video,
//     practice: css.codesandbox,
//     support: css.gitter,
//   }
//
//   const ws = workshop2({
//     data: {
//       title: 'workshop',
//       iconURL: null,
//       lessons: [{ // example item
//         "title": "Move Bitcoin from Coinbase to Electrum",
//         "learn": "https://www.youtube.com/watch?v=9fvDp43rShA",
//         "practice": "",
//       }],
//     },
//     theme: {
//       '--lessonBGcolor' : '#0000ff',
//       '--arrowColor'    : 'magenta',
//       '--titleSize'     : '50px',
//     },
//     css: csjs`
//       .workshop {}
//       .navbar {}
//       .arrow {}
//       .status {}
//       .icon {}
//       .title {}
//       .lesson {}
//     `, /* {
//       workshop : 'workshop_4r5ty6',
//       navbar   : 'navbar_4r5ty6',
//       arrow    : 'arrow_4r5t6y',
//       status   : 'status_4r5t6y',
//       icon     : 'ic on_4r5t6y',
//       title    : 'title_4r5t6y',
//       lesson   : 'lesson_4r5t6y',
//     }, */
//   })
//   const element = ws.render()
//   document.body.appendChild(element)
// })

},{"./usage.js":2}],2:[function(require,module,exports){
// @TODO: put `usage.js` content into a special "usage module"
// to simplify making usage pages

function makeDemoPage (script) {
  var iframe = document.createElement('iframe')
  iframe.style = `
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: grey;
    border: 2px dashed black;
  `
  iframe.srcdoc = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <script src="https://unpkg.com/npm-require#${location.origin}"></script>
      </head>
      <body>
        <template>(async function () { ${script} })()</template>
        <script>
          ;(() => {
            function loadScript ({ src, script }, next) {
              const loader = document.createElement('script')
              if (src) loader.src = src
              else loader.textContent = script || ''
              document.head.appendChild(loader)
              document.head.removeChild(loader)
              if (next) loader.onload = () => next(null, true)
            }
            var template = document.querySelector('template')
            var script = template.innerHTML
            document.body.innerHTML = ''
            console.log('referrer', window.document.referrer)
            console.log('name', window.name)
            console.log('origin', window.location.origin)
            loadScript({ script })
          })()
        </script>
      </body>
    </html>`
  return iframe
}

module.exports = usage

function usage (opts = {}, done) {
  const { repo = '#', script = '' } = opts
  var html = repolink(repo)
  parseHTML({ html }, (err, elLink) => {
    parseHTML({
      html:`<pre style="border: 2px dashed blue; padding: 10px; background-color: #fff;">${script}</pre>`,
    },(err, elCode) => {
      var container = document.createElement('div')
      container.style = `
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        background-color: lightgrey;
      `
      container.appendChild(elCode)
      container.appendChild(elLink)
      container.appendChild(makeDemoPage(script))
      done(null, container)
    })
  })
}

function parseHTML ({ html }, next) {
  var el
  const HTMLparser = document.createElement('div')
  HTMLparser.innerHTML = html
  var len = HTMLparser.children.length
  if (len > 1) {
    el = document.createDocumentFragment()
    for (var i = 0; i < len; i++) el.appendChild(HTMLparser.children[i])
  } else {
    el = HTMLparser.children[0]
  }
  next(null, el)
}

const repolink = url => `<a href="${url}" target="_blank" class="github-corner" aria-label="View source on Github">
  <svg width="250" height="250" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
    <defs></defs>
    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
    <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7
             120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3
             C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9
             134.4,103.2"
            fill="currentColor" style="transform-origin: 130px 106px;"
            class="octo-arm" />
    <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4
             L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0
             127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0
             C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5
             178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0
             197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9
             C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8
             198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1
             C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5
             C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor" class="octo-body" />
  </svg>
  <style>
    .github-corner { position: absolute; top: 0; right: 0; transform: scale(0.4); }
    @keyframes octocat-wave { 0%,100% { transform:rotate(0) } 20%,60% { transform:rotate(-25deg) } 40%,80% { transform:rotate(10deg) } }
    .github-corner:hover .octo-arm { animation:octocat-wave 560ms ease-in-out }
  </style>
</a>`

},{}]},{},[1]);
