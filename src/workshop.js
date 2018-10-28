var csjs = require('csjs-inject')
var bel = require('bel')
var belmark = require('belmark')

module.exports = workshop

async function workshop ({ workshop, theme = {} } = {}) {
  // var data = workshop ? require(workshop) : await fetch('/workshop.json')
  var data = await fetch(new URL('./workshop.json', location.href).href).then(response => response.json())
  var font_url = theme['--font']
  var lessons = data.lessons
  var chat = data.chat
  if (!chat) throw new Error('no chat found')
  if (!lessons || lessons.length === 0) throw new Error('no lessons found')
  var css = styles(font_url || 'arial')

  var video = iframe(lessons[0].lesson, css.video)
  var editor = iframe(lessons[0].tool, css.editor)
  var gitter = iframe(chat, css.gitter)
  var title = bel`<div class=${css.title}>${lessons[0].title}</div>`
  var logo_url = data.icon

  var logo = logo_url ? bel`
    <img class="${css.logo} ${css.img}" onclick=${home} title="made with love by Wizard Amigos" src="${logo_url}">
  ` : ''

  var lesson = 0
  var series = bel`<span class=${css.series}>${data.title + ': ' || ''}</span>`

  var chatBox = bel`<div class=${css.chatBox}>
    <div style="width: 100%; height: 100%; flex-grow: 1; display: flex; justify-content: center; align-items: center">
      ... loading support chat ..."
    </div>
    ${gitter}
  </div>`

  async function getMarkdown (lessonInfo) {
    if (typeof lessonInfo !== 'string') var info = belmark(lessonInfo.join('\n'))
    else {
      var infoMarkdown = await fetch(lessonInfo).then(response => response.text())
      var info = belmark(infoMarkdown)
    }
    return info
  }

  if (lessons[0].info) {
    var info = await getMarkdown(lessons[0].info)
  } else {
    var info = belmark`no description`
  }
  info.className = ` ${css.welcome}`
  var infoBox = bel`<div class=${css.infoBox}>${info || xxx}</div></div>`
  var view = 'info'

  var stats = bel`<span class=${css.stats}>Lesson ${lesson + 1}/${lessons.length}</span>`
  var infoButton = bel`<button class="${css.infoViewButton} ${css.button}" title='infoButton' onclick=${changeView}>Info</button>`
  var chatButton = bel`<button class="${css.chatViewButton} ${css.button}" title='chatButton' onclick=${changeView}>Chat</button>`

  var needsOpen = false
  var unlocksOpen = false
  function needs () {
    if (needsOpen) {
      var dropdown = document.querySelector('#needs')
      dropdown.parentElement.removeChild(dropdown)
      needsOpen = false
    } else {
      var el = bel`
      <ul id="needs" style="position: absolute; top: 75px; left: 0; width:100px; height: 100px; background-color: pink;">
      ${data.needs.map(url => bel`<li><a href="${url}" target="_blank">${url}</a></li>`)}
      </ul>
      `
      document.body.appendChild(el)
      needsOpen = true
    }
  }
  function unlocks () {
    if (unlocksOpen) {
      var dropdown = document.querySelector('#unlocks')
      dropdown.parentElement.removeChild(dropdown)
      unlocksOpen = false
    } else {
      var el = bel`
      <ul id="unlocks" style="position: absolute; top: 75px; right: 0; width:100px; height: 100px; background-color: pink;">
      ${data.unlocks.map(url => bel`<li><a href="${url}" target="_blank">${url}</a></li>`)}
      </ul>
      `
      document.body.appendChild(el)
      unlocksOpen = true
    }
  }
  var app = bel`
    <div class="${css.content}">
      <div class=${css.menu}>
        <button class=${css.button} onclick=${needs}> ${'▼'} </button>
        <button class=${css.button} onclick=${previous}> ${'<'} </button>
        <span class=${css.head}>
          <span class=${css.banner}>${logo} ${series} ${stats}</span>
          ${title}
        </span>
        <button class=${css.button} onclick=${next}> ${'>'} </button>
        <button class=${css.button} onclick=${unlocks}> ${'▼'} </button>
      </div>
      <div class=${css.container}>
        <div class=${css.narrow}>
          ${video}
          <div class=${css.bottom}>
            <div class=${css.switchButtons}>
              ${infoButton}
              ${chatButton}
            </div>
            ${infoBox}
          </div>
        </div>
        <div class=${css.wide}>
          ${editor}
        </div>
      </div>
    </div>
  `
  document.body.appendChild(app)

  window.addEventListener('keyup', function (event) {
    var left = 37
    var right = 39
    if (event.which === left) previous()
    else if (event.which === right) next()
  })
  async function previous (event) {
    if (lesson <= 0) return
    lesson--
    var old = video
    video = iframe(lessons[lesson].lesson, css.video)
    old.parentElement.replaceChild(video, old)
    stats.innerText = `Lesson ${lesson + 1}/${lessons.length}`
    title.innerText = lessons[lesson].title || ''
    if (lessons[lesson].info) {
      info.innerText = ''
      info.appendChild(await getMarkdown(lessons[0].info))
    } else {
      info.innerText = ''
      info.appendChild(belmark`no description`)
    }
  }

  async function next (event) {
    if (lesson >= lessons.length - 1) return
    lesson++
    var old = video
    video = iframe(lessons[lesson].lesson, css.video)
    old.parentElement.replaceChild(video, old)
    stats.innerText = `Lesson ${lesson + 1}/${lessons.length}`
    title.innerText = lessons[lesson].title || ''
    if (lessons[lesson].info) {
      info.innerText = ''
      info.appendChild(belmark(lessons[lesson].info))
    } else {
      info.innerText = ''
      info.appendChild(belmark`no description`)
    }
  }

  function iframe (src, classname) {
    return bel`
      <iframe
        class="${classname} ${css.iframe}"
        src="${src}"
        frameborder="0"
        allowfullscreen
      ></iframe>
    `
  }

  function changeView (e) {
    // console.log(e.target.title)
    // console.log('view =', view)
    var parent = document.querySelector(`.${css.bottom}`)
    // console.log(parent)
    if (e.target.title === 'infoButton') {
      infoButton.style = `background-color: white; color: purple;`
      chatButton.style = ''
      if (view != 'info') {
        parent.removeChild(chatBox)
        parent.appendChild(infoBox)
        return view = 'info'
      }
    }
    if (e.target.title === 'chatButton') {
      chatButton.style = `background-color: white; color: purple;`
      infoButton.style  = ''
      if (view != 'chat') {
        parent.removeChild(infoBox)
        parent.appendChild(chatBox)
        return view = 'chat'
      }
    }
  }

  function showChat () {
    var parent = document.querySelector(`.${css.narrow}`)
    parent.removeChild(infoBox)
    parent.appendChild(chatBox)
  }

  function home () {
    window.open('http://wizardamigos.com/', '_blank');
  }
}

function styles (font_url) {
  var FONT = font_url.split('/').join('-').split('.').join('_')
  var font = bel`
    <style>
    @font-face {
      font-family: ${FONT};
      src: url('${font_url}');
    }
    </style>`
  document.head.appendChild(font)

  var css = csjs`
    *, *:before, *:after { box-sizing: inherit; }
    .img { box-sizing: content-box; }
    .iframe { border: 0; height: 100%; }
    .content {
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      height: 100%;
      overflow: hidden;
    }
    .menu {
      display: flex;
      align-items: center;
      min-height: 90px;
      height: 10%;
      justify-content: space-between;
      border: 5px solid #d6dbe1;
    }
    .container {
      display: flex;
      background-color: #43409a;
      border: 5px solid #d6dbe1;
      border-top: none;
      flex-grow: 1;
    }
    .button {
      cursor: pointer;
      width: 100px;
      height: 100%;
      font-size: 75px;
      font-weight: 900;
      font-family: ${FONT};
      border: none;
      background-color: #ffd399;
      color: white;
    }
    .head {
      margin: 0 5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 75%;
      color: black;
      font-size:30px;
      font-family: ${FONT};
      font-weight: 900;
    }
    .button:hover {
      background-color: #43409a;
    }
    .logo {
      margin-right: 20px;
      width: 50px;
      height: 50px;
    }
    .logo:hover {
      opacity: 0.9;
      cursor: pointer;
    }
    .banner {
      margin: 0 5%;
      display: flex;
      color: black;
      font-size:30px;
      font-family: ${FONT};
      font-weight: 900;
    }
    .stats {
      display: flex;
      align-self: center;
    }
    .series {
      display: flex;
      align-self: center;
      padding-right: 10px;
    }
    .wide {
      margin: 1%;
      display: flex;
      flex-direction: column;
      width: 70%;
    }
    .narrow {
      margin: 1%;
      width: 27%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .editor {
      border: 5px solid #d6dbe1;
      width: 100%;
      height: 100%;
    }
    .video {
      border: 5px solid #d6dbe1;
      width: 100%;
      height: 50%;
      margin-bottom: 2%;
    }
    .title {
      color: grey;
      font-size: 25px;
    }
    .bottom {
      display: flex;
      height: 50%;
      flex-direction: column;
      margin-top: 2%;
      flex-grow: 1;
    }
    .switchButtons {
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: center;
    }
    .infoViewButton,
    .chatViewButton {
      border: 5px solid #d6dbe1;
      font-size: 20px;
      width: 50%;
      height: 40px;
      background-color: parent;
      font-style: capitalize;
    }
    .infoViewButton:hover,
    .chatViewButton:hover {
      background-color: white;
      color: #43409a;
    }
    .infoBox {
      background-color: white;
      margin-top: calc(7px);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-start;
      font-family: ${FONT};
      overflow-y: auto;
      flex-grow: 1;
    }
    .chatBox {
      position: relative;
      background-color: white;
      width: 100%;
      display: flex;
      align-items: center;
      font-family: ${FONT};
      overflow-y: auto;
      flex-grow: 1;
    }
    .gitter {
      position: absolute;
      align-self: flex-start;
      width: 166.4%;
      height: 176.5%;
      transform: translate(-19.95%, -23.35%) scale(0.6);
    }
    .welcome code {
      white-space: pre-wrap;
      font-family: ${FONT};
    }
    .welcome {
      font-size: 20px;
      padding: 0 10%;
      color: #43409a;
    }`
  return css
}
