const workshopping = require('workshopping')

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

var font_url = (location.origin.includes('//localhost')
  || location.origin.includes('//127.0.0.1')
  || location.origin.includes('//0.0.0.0')
  || location.origin.includes('//10.0.0')
  || location.origin.includes('//192.168')) ?
    '../src/PIXELADE.ttf'
    : 'https://github.com/wizardamigos/wizardamigos-workshop/blob/master/src/PIXELADE.ttf?raw=true'

module.exports = workshopping.customize({
  theme: require('./theme.js')(font_url)
})
