const csjs = require('csjs-inject')
const bel = require('bel')
const belmark = require('belmark')
const workshopping = require('workshopping')

module.exports = workshopping.customize({
  theme: require('./theme.js')
})
// module.exports = workshop

// @TODO: every FIELD can be either an OBJECT or URL to a JSON
//        and it has DEFAULTS

workshop.config = ({ config: co1 = {}, theme: t1 = {}, css: cs1 = {} } = {}) => {
  return async (data, { config: co2 = {}, theme: t2 = {}, css: cs2 = {} } = {}) => {
    const workshop = data
    const css = { ...cs1, ...cs2 }
    const theme = { ...t1, ...t2 }
    const whitelabel = { ...co1, ...co2 }
    return await _workshop({ workshop, theme, css, whitelabel })
  }
}

async function workshop (data, { config = {}, theme = {}, css = {} } = {}) {
  return await _workshop({ workshop: data, theme, css, whitelabel: config })
}
var minimap

async function _workshop ({ workshop, theme = {}, whitelabel } = {}) {
  // var data = workshop ? require(workshop) : await fetch('/workshop.json')
  var data = (typeof workshop === 'string') ?
    await fetch(new URL(workshop || './workshop.json', location.href).href).then(response => response.json())
    : workshop
  var font_url = theme['--font']
  minimap = 'src/skilltree.png'
  var lessons = data.lessons
  var chat = data.chat
  if (!chat) throw new Error('no chat found')
  if (!lessons || lessons.length === 0) throw new Error('no lessons found')
  var css = styles(font_url || 'arial')

  var video = iframe(lessons[0].lesson, css.video)
  var editor = iframe(lessons[0].tool, css.editor)
  var gitter = iframe(chat, css.gitter)
  var title = bel`<div title=${lessons[0].title} class=${css.title}>${lessons[0].title}</div>`
  var logo_url = data.icon

  var home = whitelabel.home_link
  var home_text = whitelabel.home_text
  var intro_prefix_text = whitelabel.intro_prefix_text

  var lesson = 0
  var series = bel`<span class=${css.series}>${data.title}</span>`

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

  var logo = logo_url ? bel`<a href=${home} target="_blank">
    <img class="${css.logo} ${css.img}" title="${home_text}" src="${logo_url}">
  </a>` : ''

  var stats = bel`<span class=${css.stats}>${lesson + 1}/${lessons.length}</span>`
  var infoButton = bel`<div class="${css.infoViewButton} ${css.button}" title='infoButton' onclick=${changeView}>
    Info
  </div>`
  // @TODO: allow `vendor-workshop` to add his logo as a "home" button
  // ${logo}
  var chatButton = bel`<div class="${css.chatViewButton} ${css.button}" title='chatButton' onclick=${changeView}>
    Chat
  </div>`

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
      <div id="unlocks" onclick=${unlocks} class=${css.minimapExtended}></div>
      `
      // var el = bel`
      // <ul id="unlocks" style="position: absolute; top: 75px; right: 0; width:100px; height: 100px; background-color: pink;">
      // ${data.unlocks.map(url => bel`<li><a href="${url}" target="_blank">${url}</a></li>`)}
      // </ul>
      // `
      document.body.appendChild(el)
      unlocksOpen = true
    }
  }
  var app = bel`
    <div class="${css.content}">
      <div class=${css.menu}>
        <div class=${css.minimap} onclick=${unlocks}><input class=${css.minimapButton} title="Skill tree" type="image" src="${data.icon}"></div>
        <span class=${css.head}>
          <span class=${css.banner}>${intro_prefix_text}: ${series}</span>
        </span>
      </div>
      <div class=${css.container}>
        <div class=${css.narrow}>
          <div class=${css.top}>
            <div class=${css.switchButtons}>
              <div class="${css.previous}" title="Previous lesson" onclick=${previous}> ${'<'} </div>
              <div class=${css.lesson}>${title} ${stats}</div>
              <div class="${css.next}" title="Next lesson" onclick=${next}> ${'>'} </div>
            </div>
            ${video}
          </div>
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

  window.addEventListener('keyup', function (event) {
    var left = 37
    var right = 39
    if (event.which === left) previous()
    else if (event.which === right) next()
  })

  return { render() { return app }}
  async function previous (event) {
    if (lesson <= 0) return
    lesson--
    var old = video
    video = iframe(lessons[lesson].lesson, css.video)
    old.parentElement.replaceChild(video, old)
    stats.innerText = `${lesson + 1}/${lessons.length}`
    title.innerText = lessons[lesson].title || ''
    title.title = title.innerText
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
    stats.innerText = `${lesson + 1}/${lessons.length}`
    title.innerText = lessons[lesson].title || ''
    title.title = title.innerText
    if (lessons[lesson].info) {
      info.innerText = ''
      info.appendChild(belmark(lessons[lesson].info))
    } else {
      info.innerText = ''
      info.appendChild(belmark`no description`)
    }
  }

  function iframe (src, classname) {
    return bel`<div class=${css.sandbox}>
      <iframe
        class="${classname} ${css.iframe}"
        src="${src}"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>`
  }

  function changeView (e) {
    // console.log(e.target.title)
    // console.log('view =', view)
    var parent = document.querySelector(`.${css.bottom}`)
    // console.log(parent)
    if (e.target.title === 'infoButton') {
      infoButton.classList.add(css.highlight)
      chatButton.classList.remove(css.highlight)
      if (view != 'info') {
        parent.removeChild(chatBox)
        parent.appendChild(infoBox)
        return view = 'info'
      }
    }
    if (e.target.title === 'chatButton') {
      infoButton.classList.remove(css.highlight)
      chatButton.classList.add(css.highlight)
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

  var others = require('./theme.js')
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
      min-height: ${others.menu_minHeight};
      height: ${others.menu_height};
      justify-content: space-between;
      border: ${others.menu_border};
      background-color: ${others.menu_backgroundColor};
    }
    .container {
      display: flex;
      background-color: ${others.container_backgroundColor};
      border: ${others.container_border};
      border-top: none;
      flex-grow: 1;
    }
    .previous, .next {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 40px;
      height: 40px;
      line-height: 100%;
      font-size: calc(20px + 0.3vw);
    }
    .previous:hover, .next:hover {
      color: ${others.arrow_hover_textcolor};
    }
    .lesson {
      display: flex;
      align-items: center;
      justify-content: center;
      justify-content: space-evenly;
      align-items: center;
      min-width: 50%;
      max-width: 100%;
      height: 40px;
      padding: 0 2%;
      border-left: ${others.lesson_borderleft};
      border-right: ${others.lesson_borderright};
      overflow: hidden;
    }
    .head {
      margin: 0 5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: black;
      font-family: ${FONT};
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: ${others.head_textsize};
      font-weight: ${others.head_textweight};
    }
    .button:hover {
      background-color: ${others.button_hover_backgroundColor};
      color: ${others.button_hover_color};
    }
    .highlight {
      background-color: white;
      color: purple;
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
      display: flex;
      align-items: center;
      height: 100%;
      font-family: ${FONT};
    }
    .stats {
      display: flex;
      align-self: center;
    }
    .series {
      display: flex;
      align-self: center;
      padding-right: ${others.series_paddingRight};
      cursor: default;
      justify-content: center;
      padding-left: ${others.series_paddingLeft};
      color: ${others.series_textcolor};
      font-size: ${others.series_textsize};
      font-weight: 900;
      white-space: nowrap;
      padding-top: 3px;
    }
    .minimapButton {
      border-radius: 50%;
      border: ${others.minimapbutton_border};
      cursor: pointer;
      width: calc(10px + 1.5vmin);
      height: calc(10px + 1.5vmin);
    }
    .minimap {
      background-color: ${others.minimap_backgroundColor};
      width: 30px;
      height: 30px;
      margin-left: 2%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .minimapExtended {
      background-image: url("${minimap}");
      position: absolute;
      top: 49px;
      left: 0px;
      width: 500px;
      height: 500px;
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
      width: 100%;
      height: 100%;
      border: ${others.editor_border};
    }
    .video {
      width: 100%;
      height: 100%;
      border: ${others.video_border};
      border-top: ${others.video_borderTop};
    }
    .title {
      color: ${others.lesson_title_textcolor};
      font-size: ${others.lesson_title_textsize};
      cursor: default;
      margin-right: 2%;
      width: 70%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .top {
      display: flex;
      height: 50%;
      flex-direction: column;
      flex-grow: 1;
    }
    .bottom {
      display: flex;
      height: 50%;
      flex-direction: column;
      margin-top: ${others.bottom_marginTop};
      flex-grow: 1;
    }
    .switchButtons {
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: center;
      font-size: ${others.switchbutton_fontsize};
      background-color: ${others.switchbutton_backgroundColor};
      color: ${others.switchbutton_color};
      border: none;
      font-family: ${FONT};
      font-weight: 900;
      height: 40px;
    }
    .button {
      cursor: pointer;
      width: 100px;
      height: 100%;
      font-size: 75px;
      font-weight: 900;
      font-family: ${FONT};
      border: none;
      color: ${others.tab_color};
    }
    .infoViewButton,
    .chatViewButton {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      font-size: ${others.tab_fontsize};
      border: ${others.tab_border};
      width: 50%;
      height: 40px;
      background-color: ${others.tab_backgroundColor};
      text-transform: ${others.tab_textTransform};
    }
    .infoViewButton {
      border-right: ${others.infobutton_borderright};
    }
    .chatViewButton {
      border-left: ${others.chatbutton_borderleft};
    }
    .infoViewButton:hover,
    .chatViewButton:hover {
      background-color: ${others.tab_hover_backgroundColor};
      color: ${others.tab_hover_textcolor};
    }
    .infoBox {
      background-color: ${others.infobox_backgroundColor};
      border-top: ${others.infobox_borderTop};
      margin-top: ${others.infobox_marginTop},
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
      border-top: ${others.chatbox_borderTop};
    }
    .sandbox {
      overflow: hidden;
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
      font-size: ${others.welcome_font_size};
      padding: 0 ${others.welcome_padding_topBottom};
      color: ${others.welcome_text_color};
    }`
  return css
}
