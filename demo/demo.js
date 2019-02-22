// USAGE
const workshop = require('../') // no default theme initialised

// var workshop1 = workshop.customize(workshop.defaults) // default theme initialised
// console.log(workshop === workshop1) // true
// /* or */ var workshop2 = workshop.customize({})
// console.log(workshop1 === workshop2) // false
// var el = workshop({}) // inits and uses default theme

setTimeout(async () => {
  // @TODO: every FIELD can be either an OBJECT or URL to a JSON
  //        and it has DEFAULTS
  const data = '/demo/workshop.json'
  const opts = {
    config: {
      home_link: 'http://wizardamigos.com/',
      home_text: 'made with love by Wizard Amigos',
      intro_prefix_text: 'Learn with Play',
    },
    theme: {
      menu_backgroundColor: 'green',
    },
    css: { },
  }
  var app
  app = await workshop(data, opts)

  const el = await app.render()
  document.body.appendChild(el)
}, 0)

var height = '100vh'
// var height = 'auto'
var st = document.createElement('style')
st.innerHTML = `
  html {
    box-sizing: border-box;
    display: table;
    min-width: 100%;
    margin: 0;
  }
  body {
    box-sizing: border-box;
    margin: 0;
    display: flex;
    flex-flow: column;
    height: ${height};
  }`
document.head.appendChild(st)
