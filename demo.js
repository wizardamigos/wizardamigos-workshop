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
