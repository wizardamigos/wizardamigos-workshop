# wizardamigos workshop
Module for creating workshops for teaching coding. Workshops can be standalone or combined into a curriculum with one or many topics and used in [codecamps](https://github.com/wizardamigos/wizardamigos-codecamp).


## module
```javascript
// [workshop.js]
const bel = require('bel')
module.exports = function workshop (workshopJson) {
  return bel`<div>${workshopJson}</div>`
}
```

## examples

### 1. js_variables
```javascript
// [workshop.json]
{
  "title": "Javascript Variables",
  "icon": "./workshop.svg",
  "version": "1.0.0",
  "lessons": [{
    "title": "",
    "learn": "http://youtube.com/?v=q3qfefqewe",
    "practice": "http://codesandbox.io/302iw0iw0",
  },{
    "title": "",
    "learn": "http://youtube.com/?v=q3qfefqewe",
    "practice": "http://codesandbox.io/302iw0iw0",
  },{
    "title": "",
    "learn": "http://youtube.com/?v=q3qfefqewe",
    "practice": "http://codesandbox.io/302iw0iw0",
  },{
    "title": "",
    "learn": "http://youtube.com/?v=q3qfefqewe",
    "practice": "http://codesandbox.io/302iw0iw0",
  },
  ]
}
```
```javascript
// github page: (index.html + index.js)
var app = require('workshop')
var workshop = require('./workshop.json')
var el = app(workshop)
document.body.appendChild(el)
```

### 2. css_flexbox
* ...

### 3. js_web3_object
* ...
