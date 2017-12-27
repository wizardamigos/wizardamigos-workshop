const bel = require('bel')
const csjs = require('csjs-inject')

const iframer = require('_iframer')
const svg2favicon = require('_svg2favicon')
/******************************************************************************
  INTERFACE
******************************************************************************/
module.exports = workshop
module.exports.config
module.exports.prototype = {
  render,
  
  patch,
  write: patch,
  update: patch,

  ondata ({ type, key, value }) { },
}
/******************************************************************************
  CONFIG
******************************************************************************/
function config ({
  theme = {
    '--lessonBGcolor' : '#0000ff',
    '--arrowColor'    : 'magenta',
    '--titleSize'     : '50px',
  },
  data = {
    title: 'workshop',
    iconURL: null,
    lessons: [{ // example item
      "title"    : "Move Bitcoin from Coinbase to Electrum",
      "learn"    : "https://www.youtube.com/watch?v=9fvDp43rShA",
      "practice" : "",
    }],
  },
  css = csjs`
    .workshop          {
      --lessonBGcolor  : ${theme['--lessonBGcolor']};
      --arrowColor     : ${theme['--arrowColor']};
      --titleSize      : ${theme['--titleSize']};
      display          : flex;
      flex-direction   : column;
      width            : 100%;
      height           : 100%;
    }
    .navbar            {
      display          : flex;
      width            : 100%;
      margin           : 0;
    }
    .arrow             {
      background-color : grey;
      font-size        : 150px;
      font-weight      : 900;
      cursor           : pointer;
    }
    .arrow:hover       {
      background-color : black;
      color            : var(--arrowColor);
    }
    .status            {
      display          : flex;
      justify-content  : center;
      align-items      : center;
      flex-grow        : 1;
    }
    .icon              {
      height           : var(--titleSize};
      margin-right     : 10px;
    }
    .title             {
      font-size        : var(--titleSize};
      font-family      : arial;
      font-weight      : 900;
    }
    .lesson            {
      display          : flex;
      background-color : var(--lessonBGcolor);
      flex-grow        : 1;
    }
  `
} = {}) { return workshop.bind({ theme, data, css }) }
/******************************************************************************
  MODULE
******************************************************************************/
function workshop ({
  theme: { ...theme } = {},
  data: { ...data } = {},
  css: { ...css } = {},
} = {}) {
  'use strict'
  if (!workshop.defaults) workshop.defaults = config()
  const config = this || workshop
  const self = Object.create(workshop.prototype)
  // https://jsperf.com/proto-vs-object-create-for-default-arguments/1
  theme.__proto__ = config.theme || workshop.defaults.theme
  data.__proto__ = config.data || workshop.defaults.data
  css.__proto__ = config.css || workshop.defaults.css
  self[_STATE] = { data, css, theme }

  // self[_DOM] = { } // _template(self)
  // self[_HANDLE] = {}
  // self[_EVENTS] = {}

  // @TODO: maybe check here if this component is root and wants/needs a favicon
  svg2favicon.makeSVGicon(data.iconURL, (error, faviconURL) => {
    if (error) return console.error(error)
    // @TODO: emit "SVGfavicon" event to the root, but dont put it in place here
    // @TODO: if no root exists, then do shit here...
    svg2favicon.setFavicon(faviconURL)
  })
  return self
}
// module.exports.prototype.handleEvent = handleEvent
/******************************************************************************
  API
******************************************************************************/
// function handleEvent (event) { _on[event.target.dataset.call](this, event) }
function render () {
  return (this[_DOM] || this[_DOM] = _template(this)).view
}
// function on (listen, last) { // self.log() replacement
//   _on.on = listen
//   if (last) _on.on(this[_EVENTS])
//   // if (last) _on.on(this[_STATE])
//   //
//   // this[_HANDLE].on = listen
//   // if (last) _on.on(self, this[_EVENTS].on)
// }
// const _on = {
//   on(self, data) { self[_HANDLE].on(self[_EVENTS]) }
//   on(self, data) { self[_HANDLE].on(self[_STATE]) }
// }
// function onfoobar (listen, last) {
//   this[_HANDLE].foobar = listen
//   if (last) _on.foobar(self, this[_EVENTS].foobar)
// }
function patch ({ type, key, value }) {
  if (type in self[_STATE] && key in self[_STATE][type]) {
    self[_STATE][type][key] = value
  } else return
  // @TODO: trigger update of instance event
  const view = self[_DOM].view
  if (!view) return  
  _path[`${type}/${key}`](this, value)
  
  // const elements
  // if (type === 'data') {
  //   if (key === 'iconURL') view.children[0].children[1].children[0].setAttribute('src', value)
  //   else if (key === 'title') view.children[0].children[1].children[1].innerText = value
  //   else if (key === 'lessons') view.children[1].innerText = JSON.stringify(value)
  // }
  // else if (type === 'theme') { view.style.setProperty(key, value) }
  // else if (type === 'css') {
  //   if (key === 'workshop') elements = [view]
  //   else if (key === 'navbar') elements = [view.children[0]]
  //   else if (key === 'arrow') elements = [view.children[0].children[0],view.children[0].children[0]]
  //   else if (key === 'status') elements = [view.children[0].children[1]]
  //   else if (key === 'icon') elements = [view.children[0].children[1].children[0]]
  //   else if (key === 'title') elements = [view.children[0].children[1].children[1]]
  //   else if (key === 'lesson') elements = [view.children[1]]
  //   else elements = []
  //   elements.forEach(el => el.className = value)
  // }
}
/******************************************************************************
  HEPLPERS
******************************************************************************/
const _patch = {
  'data/iconURL': (self, value) => {
    self[_DOM].children[0].children[1].children[0].setAttribute('src', value)
  },
  'data/title': (self, value) => {
    self[_DOM].children[0].children[1].children[1].innerText = value
  },
  'data/lessons': (self, value) => {
    self[_DOM].children[1].innerText = JSON.stringify(value)
  },
  'theme/--lessonBGcolor': (self, value) => {
    self[_DOM].style.setProperty('--lessonBGcolor', value)
  },
  'theme/--arrowColor': (self, value) => {
    self[_DOM].style.setProperty('--arrowColor', value)
  },
  'theme/--titleSize': (self, value) => {
    self[_DOM].style.setProperty('--titleSize', value)
  },
  'css/workshop': (self, value) => {
    [self[_DOM]].forEach(el => el.className = value)
  },
  'css/navbar': (self, value) => {
    [self[_DOM].children[0]].forEach(el => el.className = value)
  },
  'css/arrow': (self, value) => {
    [self[_DOM].children[0].children[0],self[_DOM].children[0].children[0]].forEach(el => el.className = value)
  },
  'css/status': (self, value) => {
    [self[_DOM].children[0].children[1]].forEach(el => el.className = value)
  },
  'css/icon': (self, value) => {
    [self[_DOM].children[0].children[1].children[0]].forEach(el => el.className = value)
  },
  'css/title': (self, value) => {
    [self[_DOM].children[0].children[1].children[1]].forEach(el => el.className = value)
  },
  'css/lesson': (self, value) => {
    [self[_DOM].children[1]].forEach(el => el.className = value)
  },
}
const _template = self => {
  const { css, data, theme } = self[_STATE]
  const learn = bel`<div></div>`
  const practice = bel`<div></div>`
  const view = bel`
    <div class=${css.workshop}>
      <div class=${css.navbar}>
        <div class=${css.arrow}>${'<'}</div>
        <div class=${css.status}>
          <img class=${css.icon} src="${data.iconURL}">
          <h1 class=${css.title}> ${data.title} </h1>
        </div>
        <div class=${css.arrow}>${'>'}</div>
      </div>
      <div class=${css.lesson}>
        ${JSON.stringify(data.lessons)}
      </div>
    </div>`
  for (var keys = Object.keys(theme), key, i = 0; key = keys[i]; i++) {
    view.style.setProperty(key, theme[key])
  }
  return { view, learn, practice }
}
// const _on = {
//   foobar (self, event) {
//     self[_EVENTS].foobar = {
//       type: 'foobar',
//       x: event.x,
//       y: event.y,
//       name: self[_STATE].name,
//     }
//     if (self[_HANDLE].foobar) self[_HANDLE].foobar(self[_EVENTS].foobar)
//   }
// }
const _STATE = Symbol('state')
const _DOM = Symbol('dom')
// const _HANDLE = Symbol('handle')
// const _EVENTS = Symbol('events')
