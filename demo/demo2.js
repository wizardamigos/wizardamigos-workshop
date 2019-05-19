const workshop = require('../')

// use: `document.body.appendChild(await demo())`
module.exports = async function demo () {
  const config = {
    home_link: 'http://github.com/ethereum/play',
    home_text: 'decentralized e-learning made by play.ethereum.org',
    intro_prefix_text: 'Learn with Play',
  }
  const theme = {
    menu_and_minimap_and_wide_backgroundColor: 'yellow',
  }
  const css = { }
  return await workshop({ config, theme, css })
}
