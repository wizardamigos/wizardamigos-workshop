const bel = require('bel')
const csjs = require('csjs-inject')

module.exports = workshop
module.exports.prototype = {
  render
}
/******************************************************************************
  INIT
******************************************************************************/
function workshop ({ title = 'workshop', icon, lessons = []} = {}) {
  var self = Object.create(module.exports.prototype)
  // self[_.DOM] = _template(self)
  self[_.STATE] = { title, icon, lessons }
  // self[_.HANDLE] = {}
  // self[_.EVENTS] = {}
  setSVGfavicon(icon)
  return self
}
// module.exports.prototype.handleEvent = handleEvent
/******************************************************************************
  API
******************************************************************************/
function render () {
  return (this[_.DOM] || (this[_.DOM] = _template(this))).view
}
// function log (stamp) { return _log(this, stamp) }
// function write ({ type, key, value }) {
//   _ok[type + key] && _update(this, key, value)
// }
// function onfoobar (listen, last) {
//   this[_.HANDLE].foobar = listen
//   if (last) _on.foobar(self, this[_.EVENTS].foobar)
// }
// function handleEvent (event) { _on[event.target.dataset.call](this, event) }
/******************************************************************************
  HEPLPERS
******************************************************************************/
const _template = self => {
  const view = bel`
    <div class=${css.workshop}>
      <div class=${css.navbar}>
        <div class=${css.arrow}>${'<'}</div>
        <div class=${css.status}>
          <img class=${css.icon} src="${self[_.STATE].icon}">
          <h1 class=${css.title}> ${self[_.STATE].title} </h1>
        </div>
        <div class=${css.arrow}>${'>'}</div>
      </div>
      <div class=${css.lesson}>
        ${JSON.stringify(self[_.STATE].lessons)}
      </div>
    </div>`
  return { view }
}
const setSVGfavicon = url => img.setAttribute('src', url)
// const _on = {
//   foobar (self, event) {
//     self[_.EVENTS].foobar = {
//       type: 'foobar',
//       x: event.x,
//       y: event.y,
//       name: self[_.STATE].name,
//     }
//     if (self[_.HANDLE].foobar) self[_.HANDLE].foobar(self[_.EVENTS].foobar)
//   }
// }
const _ = {
  DOM     : Symbol('dom'),
  STATE   : Symbol('state'),
  // HANDLE  : Symbol('handle'),
  // EVENTS  : Symbol('events'),
}
const canvas = document.createElement('canvas')
const img = document.createElement('img')
const favicon =  (favicon => {
  if (!favicon) {
    favicon = document.createElement('link')
    favicon.setAttribute('rel', 'icon')
    favicon.setAttribute('type', 'image/png')
    document.head.appendChild(favicon)    
  }
  return favicon
})(document.querySelector('link[rel*="icon"]'))
img.onload = event => {
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.globalCompositeOperation = 'destination-over'
  const dim = [0, 0, canvas.width, canvas.height]
  ctx.drawImage(img, ...dim)
  drawTriangles(ctx, dim)
  favicon.setAttribute('href', canvas.toDataURL())
}
const drawTriangles = (ctx, dim) => {
  const [ top, left, right, bottom ] = dim
  const length = 50
  var triangles = [
    [left, top, left, length, length, top, "#FF0000"],
    [left, bottom, left, bottom - length, length, bottom, "#00FF00"],
    [right, top, right, length, right - length, top, "#0000FF"],
    [right, bottom, right, bottom - length, right - length, bottom, "#FF00FF"],
    [0, 0, 0, length, length, 0, "#FF0000"],
    [0, 0, 0, length, length, 0, "#FF0000"],
  ]
  for (var i = 0, tr; i < 4; i++) {
    tr = triangles[i]
    ctx.lineWidth = 10
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = tr[6]
    ctx.beginPath()
    ctx.moveTo(tr[0], tr[1])
    ctx.lineTo(tr[2], tr[3])
    ctx.stroke()
    ctx.lineTo(tr[4], tr[5])
    ctx.stroke()
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }
}
/******************************************************************************
  STYLE
******************************************************************************/
const css = csjs`
  .workshop          {
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
    color            : grey;
  }
  .status            {
    display          : flex;
    justify-content  : center;
    align-items      : center;
    flex-grow        : 1;
  }
  .icon              {
    height           : 50px;
    margin-right     : 10px;
  }
  .title             {
    font-size        : 50px;
    font-family      : arial;
    font-weight      : 900;
  }
  .lesson            {
    display          : flex;
    background-color : yellow;
    flex-grow        : 1;
  }
`
