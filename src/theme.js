var colors = {
//    white: "#ffffff", // borders, font on input background
/**/    themeColor1: "#ffffff", //background white
//    themeColor1Smoke: '#21252b',  // separators
//    whiteSmoke: "#f5f5f5", // background light
/**/    lavenderGrey: "#e3e8ee", // inputs background
//    slateGrey: "#8a929b", // text
//    violetRed: "#b25068",  // used as red in types (bool etc.)
//    aquaMarine: "#90FCF9",  // used as green in types (bool etc.)
//    turquoise: "#14b9d5",
//    yellow: "#F2CD5D",
/**/    androidGreen: "#9BC53D"
}
module.exports = font => ({
  '--font': font,
  menu_minHeight: '90px',
  menu_height: '10%',
  menu_border: '5px solid #d6dbe1',
  menu_backgroundColor: colors.themeColor1,
  container_backgroundColor: '#43409a',
  container_border: '5px solid #d6dbe1',
  arrow_hover_textcolor: colors.lavenderGrey,
  lesson_borderleft: `2px solid ${colors.themeColor1}`,
  lesson_borderright: `2px solid ${colors.themeColor1}`,
  head_textsize: '30px',
  head_textweight: '900',
  button_hover_backgroundColor: '#43409a',
  button_hover_color: 'inherit',
  series_paddingRight: '10px',
  series_paddingLeft: '2%',
  series_textcolor: 'black',
  series_textsize: '30px',
  minimapbutton_border: `1.5px solid ${colors.androidGreen}`,
  minimap_backgroundColor: colors.themeColor1,
  editor_border: '5px solid #d6dbe1',
  lesson_title_textcolor: 'grey',
  lesson_title_textsize: '25px',
  video_border: '5px solid #d6dbe1',
  video_borderTop: '5px solid #d6dbe1',
  bottom_marginTop: '2%',
  switchbutton_fontsize: `calc(10px + 0.3vw)`,
  switchbutton_backgroundColor: '#ffd399',
  switchbutton_color: colors.themeColor1,
  tab_color: 'white',
  tab_fontsize: '20px',
  infobutton_borderright: `invalid`, // doesnt touch it
  chatbutton_borderleft: `invalid`, // doesnt touch it
  tab_border: `5px solid #d6dbe1`,
  tab_backgroundColor: '#ffd399',
  tab_textTransform: 'uppercase',
  tab_hover_backgroundColor: 'white',
  tab_hover_textcolor: '#43409a',
  infobox_backgroundColor: 'white',
  infobox_borderTop: `0`,
  infobox_marginTop: `calc(7px)`,
  chatbox_borderTop: `0`,
  welcome_font_size: 'calc(10px + 0.3vw)',
  welcome_padding_topBottom: '10%',
  welcome_text_color: '#43409a',
})
