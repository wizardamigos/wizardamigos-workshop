(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
  const data = './demo/workshop.json'
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

},{"../":37}],2:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var VERBATIM_TAGS = [
  'code', 'pre', 'textarea'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (VERBATIM_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],3:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":2,"hyperx":29}],4:[function(require,module,exports){
var document = require('global/document')
var hyperx = require('hyperx')
var onload = require('on-load')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = {
  autofocus: 1,
  checked: 1,
  defaultchecked: 1,
  disabled: 1,
  formnovalidate: 1,
  indeterminate: 1,
  readonly: 1,
  required: 1,
  selected: 1,
  willvalidate: 1
}
var COMMENT_TAG = '!--'
var SVG_TAGS = [
  'svg',
  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // If adding onload events
  if (props.onload || props.onunload) {
    var load = props.onload || function () {}
    var unload = props.onunload || function () {}
    onload(el, function belOnload () {
      load(el)
    }, function belOnunload () {
      unload(el)
    },
    // We have to use non-standard `caller` to find who invokes `belCreateElement`
    belCreateElement.caller.caller.caller)
    delete props.onload
    delete props.onunload
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS[key]) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  function appendChild (childs) {
    if (!Array.isArray(childs)) return
    for (var i = 0; i < childs.length; i++) {
      var node = childs[i]
      if (Array.isArray(node)) {
        appendChild(node)
        continue
      }

      if (typeof node === 'number' ||
        typeof node === 'boolean' ||
        typeof node === 'function' ||
        node instanceof Date ||
        node instanceof RegExp) {
        node = node.toString()
      }

      if (typeof node === 'string') {
        if (el.lastChild && el.lastChild.nodeName === '#text') {
          el.lastChild.nodeValue += node
          continue
        }
        node = document.createTextNode(node)
      }

      if (node && node.nodeType) {
        el.appendChild(node)
      }
    }
  }
  appendChild(children)

  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"global/document":26,"hyperx":29,"on-load":33}],5:[function(require,module,exports){
var bel = require('bel')
var marked = require('marked')

module.exports = belmark

function belmark (source = '', ...values) {
  source = [].concat(source)
  var opts = this || {}

  marked.setOptions(opts)
  var _class = opts.classname || 'markdown'
  var _id = '{{'+Math.random()+'}}'
  var _source = marked(source.join(_id)).split(_id)
  var _values = values.map((v,i) => 'values['+i+']').concat()

  var fbody = 'return bel`<div class="'+_class+'">'
  _source.forEach((s,i)=>{
    var v = _values[i]!==undefined?'${'+_values[i]+'}':''
    fbody+=s+v
  })
  fbody += '</div>`'

  var render = new Function('bel', 'values', fbody)

  return render(bel, values)
}

},{"bel":4,"marked":31}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
(function (global){
'use strict';

var csjs = require('csjs');
var insertCss = require('insert-css');

function csjsInserter() {
  var args = Array.prototype.slice.call(arguments);
  var result = csjs.apply(null, args);
  if (global.document) {
    insertCss(csjs.getCss(result));
  }
  return result;
}

module.exports = csjsInserter;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"csjs":12,"insert-css":30}],8:[function(require,module,exports){
'use strict';

module.exports = require('csjs/get-css');

},{"csjs/get-css":11}],9:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs;
module.exports.csjs = csjs;
module.exports.getCss = require('./get-css');

},{"./csjs":7,"./get-css":8}],10:[function(require,module,exports){
'use strict';

module.exports = require('./lib/csjs');

},{"./lib/csjs":16}],11:[function(require,module,exports){
'use strict';

module.exports = require('./lib/get-css');

},{"./lib/get-css":20}],12:[function(require,module,exports){
'use strict';

var csjs = require('./csjs');

module.exports = csjs();
module.exports.csjs = csjs;
module.exports.noScope = csjs({ noscope: true });
module.exports.getCss = require('./get-css');

},{"./csjs":10,"./get-css":11}],13:[function(require,module,exports){
'use strict';

/**
 * base62 encode implementation based on base62 module:
 * https://github.com/andrew/base62.js
 */

var CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

module.exports = function encode(integer) {
  if (integer === 0) {
    return '0';
  }
  var str = '';
  while (integer > 0) {
    str = CHARS[integer % 62] + str;
    integer = Math.floor(integer / 62);
  }
  return str;
};

},{}],14:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

module.exports = function createExports(classes, keyframes, compositions) {
  var keyframesObj = Object.keys(keyframes).reduce(function(acc, key) {
    var val = keyframes[key];
    acc[val] = makeComposition([key], [val], true);
    return acc;
  }, {});

  var exports = Object.keys(classes).reduce(function(acc, key) {
    var val = classes[key];
    var composition = compositions[key];
    var extended = composition ? getClassChain(composition) : [];
    var allClasses = [key].concat(extended);
    var unscoped = allClasses.map(function(name) {
      return classes[name] ? classes[name] : name;
    });
    acc[val] = makeComposition(allClasses, unscoped);
    return acc;
  }, keyframesObj);

  return exports;
}

function getClassChain(obj) {
  var visited = {}, acc = [];

  function traverse(obj) {
    return Object.keys(obj).forEach(function(key) {
      if (!visited[key]) {
        visited[key] = true;
        acc.push(key);
        traverse(obj[key]);
      }
    });
  }

  traverse(obj);
  return acc;
}

},{"./composition":15}],15:[function(require,module,exports){
'use strict';

module.exports = {
  makeComposition: makeComposition,
  isComposition: isComposition,
  ignoreComposition: ignoreComposition
};

/**
 * Returns an immutable composition object containing the given class names
 * @param  {array} classNames - The input array of class names
 * @return {Composition}      - An immutable object that holds multiple
 *                              representations of the class composition
 */
function makeComposition(classNames, unscoped, isAnimation) {
  var classString = classNames.join(' ');
  return Object.create(Composition.prototype, {
    classNames: { // the original array of class names
      value: Object.freeze(classNames),
      configurable: false,
      writable: false,
      enumerable: true
    },
    unscoped: { // the original array of class names
      value: Object.freeze(unscoped),
      configurable: false,
      writable: false,
      enumerable: true
    },
    className: { // space-separated class string for use in HTML
      value: classString,
      configurable: false,
      writable: false,
      enumerable: true
    },
    selector: { // comma-separated, period-prefixed string for use in CSS
      value: classNames.map(function(name) {
        return isAnimation ? name : '.' + name;
      }).join(', '),
      configurable: false,
      writable: false,
      enumerable: true
    },
    toString: { // toString() method, returns class string for use in HTML
      value: function() {
        return classString;
      },
      configurable: false,
      writeable: false,
      enumerable: false
    }
  });
}

/**
 * Returns whether the input value is a Composition
 * @param value      - value to check
 * @return {boolean} - whether value is a Composition or not
 */
function isComposition(value) {
  return value instanceof Composition;
}

function ignoreComposition(values) {
  return values.reduce(function(acc, val) {
    if (isComposition(val)) {
      val.classNames.forEach(function(name, i) {
        acc[name] = val.unscoped[i];
      });
    }
    return acc;
  }, {});
}

/**
 * Private constructor for use in `instanceof` checks
 */
function Composition() {}

},{}],16:[function(require,module,exports){
'use strict';

var extractExtends = require('./css-extract-extends');
var composition = require('./composition');
var isComposition = composition.isComposition;
var ignoreComposition = composition.ignoreComposition;
var buildExports = require('./build-exports');
var scopify = require('./scopeify');
var cssKey = require('./css-key');
var extractExports = require('./extract-exports');

module.exports = function csjsTemplate(opts) {
  opts = (typeof opts === 'undefined') ? {} : opts;
  var noscope = (typeof opts.noscope === 'undefined') ? false : opts.noscope;

  return function csjsHandler(strings, values) {
    // Fast path to prevent arguments deopt
    var values = Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }
    var css = joiner(strings, values.map(selectorize));
    var ignores = ignoreComposition(values);

    var scope = noscope ? extractExports(css) : scopify(css, ignores);
    var extracted = extractExtends(scope.css);
    var localClasses = without(scope.classes, ignores);
    var localKeyframes = without(scope.keyframes, ignores);
    var compositions = extracted.compositions;

    var exports = buildExports(localClasses, localKeyframes, compositions);

    return Object.defineProperty(exports, cssKey, {
      enumerable: false,
      configurable: false,
      writeable: false,
      value: extracted.css
    });
  }
}

/**
 * Replaces class compositions with comma seperated class selectors
 * @param  value - the potential class composition
 * @return       - the original value or the selectorized class composition
 */
function selectorize(value) {
  return isComposition(value) ? value.selector : value;
}

/**
 * Joins template string literals and values
 * @param  {array} strings - array of strings
 * @param  {array} values  - array of values
 * @return {string}        - strings and values joined
 */
function joiner(strings, values) {
  return strings.map(function(str, i) {
    return (i !== values.length) ? str + values[i] : str;
  }).join('');
}

/**
 * Returns first object without keys of second
 * @param  {object} obj      - source object
 * @param  {object} unwanted - object with unwanted keys
 * @return {object}          - first object without unwanted keys
 */
function without(obj, unwanted) {
  return Object.keys(obj).reduce(function(acc, key) {
    if (!unwanted[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

},{"./build-exports":14,"./composition":15,"./css-extract-extends":17,"./css-key":18,"./extract-exports":19,"./scopeify":25}],17:[function(require,module,exports){
'use strict';

var makeComposition = require('./composition').makeComposition;

var regex = /\.([^\s]+)(\s+)(extends\s+)(\.[^{]+)/g;

module.exports = function extractExtends(css) {
  var found, matches = [];
  while (found = regex.exec(css)) {
    matches.unshift(found);
  }

  function extractCompositions(acc, match) {
    var extendee = getClassName(match[1]);
    var keyword = match[3];
    var extended = match[4];

    // remove from output css
    var index = match.index + match[1].length + match[2].length;
    var len = keyword.length + extended.length;
    acc.css = acc.css.slice(0, index) + " " + acc.css.slice(index + len + 1);

    var extendedClasses = splitter(extended);

    extendedClasses.forEach(function(className) {
      if (!acc.compositions[extendee]) {
        acc.compositions[extendee] = {};
      }
      if (!acc.compositions[className]) {
        acc.compositions[className] = {};
      }
      acc.compositions[extendee][className] = acc.compositions[className];
    });
    return acc;
  }

  return matches.reduce(extractCompositions, {
    css: css,
    compositions: {}
  });

};

function splitter(match) {
  return match.split(',').map(getClassName);
}

function getClassName(str) {
  var trimmed = str.trim();
  return trimmed[0] === '.' ? trimmed.substr(1) : trimmed;
}

},{"./composition":15}],18:[function(require,module,exports){
'use strict';

/**
 * CSS identifiers with whitespace are invalid
 * Hence this key will not cause a collision
 */

module.exports = ' css ';

},{}],19:[function(require,module,exports){
'use strict';

var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = extractExports;

function extractExports(css) {
  return {
    css: css,
    keyframes: getExport(css, keyframesRegex),
    classes: getExport(css, classRegex)
  };
}

function getExport(css, regex) {
  var prop = {};
  var match;
  while((match = regex.exec(css)) !== null) {
    var name = match[2];
    prop[name] = name;
  }
  return prop;
}

},{"./regex":22}],20:[function(require,module,exports){
'use strict';

var cssKey = require('./css-key');

module.exports = function getCss(csjs) {
  return csjs[cssKey];
};

},{"./css-key":18}],21:[function(require,module,exports){
'use strict';

/**
 * djb2 string hash implementation based on string-hash module:
 * https://github.com/darkskyapp/string-hash
 */

module.exports = function hashStr(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return hash >>> 0;
};

},{}],22:[function(require,module,exports){
'use strict';

var findClasses = /(\.)(?!\d)([^\s\.,{\[>+~#:)]*)(?![^{]*})/.source;
var findKeyframes = /(@\S*keyframes\s*)([^{\s]*)/.source;
var ignoreComments = /(?!(?:[^*/]|\*[^/]|\/[^*])*\*+\/)/.source;

var classRegex = new RegExp(findClasses + ignoreComments, 'g');
var keyframesRegex = new RegExp(findKeyframes + ignoreComments, 'g');

module.exports = {
  classRegex: classRegex,
  keyframesRegex: keyframesRegex,
  ignoreComments: ignoreComments,
};

},{}],23:[function(require,module,exports){
var ignoreComments = require('./regex').ignoreComments;

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    var regexStr = '((?:animation|animation-name)\\s*:[^};]*)('
      + unscoped.join('|') + ')([;\\s])' + ignoreComments;
    var regex = new RegExp(regexStr, 'g');

    var replaced = result.css.replace(regex, function(match, preamble, name, ending) {
      return preamble + animations[name] + ending;
    });

    return {
      css: replaced,
      keyframes: result.keyframes,
      classes: result.classes
    }
  }

  return result;
}

},{"./regex":22}],24:[function(require,module,exports){
'use strict';

var encode = require('./base62-encode');
var hash = require('./hash-string');

module.exports = function fileScoper(fileSrc) {
  var suffix = encode(hash(fileSrc));

  return function scopedName(name) {
    return name + '_' + suffix;
  }
};

},{"./base62-encode":13,"./hash-string":21}],25:[function(require,module,exports){
'use strict';

var fileScoper = require('./scoped-name');
var replaceAnimations = require('./replace-animations');
var regex = require('./regex');
var classRegex = regex.classRegex;
var keyframesRegex = regex.keyframesRegex;

module.exports = scopify;

function scopify(css, ignores) {
  var makeScopedName = fileScoper(css);
  var replacers = {
    classes: classRegex,
    keyframes: keyframesRegex
  };

  function scopeCss(result, key) {
    var replacer = replacers[key];
    function replaceFn(fullMatch, prefix, name) {
      var scopedName = ignores[name] ? name : makeScopedName(name);
      result[key][scopedName] = name;
      return prefix + scopedName;
    }
    return {
      css: result.css.replace(replacer, replaceFn),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  var result = Object.keys(replacers).reduce(scopeCss, {
    css: css,
    keyframes: {},
    classes: {}
  });

  return replaceAnimations(result);
}

},{"./regex":22,"./replace-animations":23,"./scoped-name":24}],26:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":6}],27:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],29:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":28}],30:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],31:[function(require,module,exports){
(function (global){
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

;(function(root) {
'use strict';

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  table: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  paragraph: /^([^\n]+(?:\n?(?!hr|heading|lheading| {0,3}>|tag)[^\n]+)+)/,
  text: /^[^\n]+/
};

block._label = /(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"|[^"]|"[^"\n]*")*"|'\n?(?:[^'\n]+\n?)*'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = edit(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex();

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b';

block.html = edit(block.html)
  .replace('comment', /<!--[\s\S]*?-->/)
  .replace('closed', /<(tag)[\s\S]+?<\/\1>/)
  .replace('closing', /<tag(?:"[^"]*"|'[^']*'|\s[^'"\/>\s]*)*?\/?>/)
  .replace(/tag/g, block._tag)
  .getRegex();

block.paragraph = edit(block.paragraph)
  .replace('hr', block.hr)
  .replace('heading', block.heading)
  .replace('lheading', block.lheading)
  .replace('tag', '<' + block._tag)
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = edit(block.paragraph)
  .replace('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  .getRegex();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  src = src.replace(/^ +$/gm, '');
  var next,
      loose,
      cap,
      bull,
      b,
      item,
      space,
      i,
      tag,
      l,
      isordered;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];
      isordered = bull.length > 1;

      this.tokens.push({
        type: 'list_start',
        ordered: isordered,
        start: isordered ? +bull : ''
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
      tag = cap[1].toLowerCase();
      if (!this.tokens.links[tag]) {
        this.tokens.links[tag] = {
          href: cap[2],
          title: cap[3]
        };
      }
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?[a-zA-Z0-9\-]+(?:"[^"]*"|'[^']*'|\s[^<'">\/\s]*)*?\/?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^_([^\s_](?:[^_]|__)+?[^\s_])_\b|^\*((?:\*\*|[^*])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
};

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;

inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex()

inline._inside = /(?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = edit(inline.link)
  .replace('inside', inline._inside)
  .replace('href', inline._href)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('inside', inline._inside)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)
    .replace('email', inline._email)
    .getRegex(),
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: edit(inline.text)
    .replace(']|', '~]|')
    .replace('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|')
    .getRegex()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;

  if (!this.links) {
    throw new Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = '',
      link,
      text,
      href,
      cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(this.mangle(cap[1]));
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      cap[0] = this.rules._backpedal.exec(cap[0])[0];
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(cap[0]);
        href = 'mailto:' + text;
      } else {
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + text;
        } else {
          href = text;
        }
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href),
      title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = '',
      l = text.length,
      i = 0,
      ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
  return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return text;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return text;
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * TextRenderer
 * returns only the textual part of the token
 */

function TextRenderer() {}

// no need for block level renderers

TextRenderer.prototype.strong =
TextRenderer.prototype.em =
TextRenderer.prototype.codespan =
TextRenderer.prototype.del =
TextRenderer.prototype.text = function (text) {
  return text;
}

TextRenderer.prototype.link =
TextRenderer.prototype.image = function(href, title, text) {
  return '' + text;
}

TextRenderer.prototype.br = function() {
  return '';
}

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer();
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  // use an InlineLexer with a TextRenderer to extract pure text
  this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, {renderer: new TextRenderer()})
  );
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        unescape(this.inlineText.output(this.token.text)));
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
          body = '',
          i,
          row,
          cell,
          j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      body = '';
      var ordered = this.token.ordered,
          start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function edit(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return {
    replace: function(name, val) {
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return this;
    },
    getRegex: function() {
      return new RegExp(regex, opt);
    }
  };
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1,
      target,
      key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer(),
  xhtml: false,
  baseUrl: null
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  root.marked = marked;
}
})(this || (typeof window !== 'undefined' ? window : global));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],32:[function(require,module,exports){
assert.notEqual = notEqual
assert.notOk = notOk
assert.equal = equal
assert.ok = assert

module.exports = assert

function equal (a, b, m) {
  assert(a == b, m) // eslint-disable-line eqeqeq
}

function notEqual (a, b, m) {
  assert(a != b, m) // eslint-disable-line eqeqeq
}

function notOk (t, m) {
  assert(!t, m)
}

function assert (t, m) {
  if (!t) throw new Error(m || 'AssertionError')
}

},{}],33:[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var assert = require('assert')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, turnoff)
      eachMutation(mutations[i].addedNodes, turnon)
    }
  })
  if (document.body) {
    beginObserve(observer)
  } else {
    document.addEventListener('DOMContentLoaded', function (event) {
      beginObserve(observer)
    })
  }
}

function beginObserve (observer) {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  assert(document.body, 'on-load: will not work prior to DOMContentLoaded')
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

module.exports.KEY_ATTR = KEY_ATTR
module.exports.KEY_ID = KEY_ID

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"assert":32,"global/document":26,"global/window":27}],34:[function(require,module,exports){
var colors = {
//    white: "#ffffff", // borders, font on input background
/**/    themeColor1: "#ff0000", //background white
//    themeColor1Smoke: '#21252b',  // separators
//    whiteSmoke: "#f5f5f5", // background light
/**/    lavenderGrey: "#00ffff", // inputs background
//    slateGrey: "#8a929b", // text
//    violetRed: "#b25068",  // used as red in types (bool etc.)
//    aquaMarine: "#90FCF9",  // used as green in types (bool etc.)
//    turquoise: "#14b9d5",
//    yellow: "#F2CD5D",
/**/    androidGreen: "#ff00ff"
}
module.exports = {
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
}

},{}],35:[function(require,module,exports){
const csjs = require('csjs-inject')
const bel = require('bel') // @TODO: replace with `elb`
const belmark = require('belmark') // @TODO: replace with `elbmark`

// module.exports = workshopping

// workshopping.config = async ({ theme: t = {}, data: d = {}, css: c = {} } = {}) => {
//   return async ({ theme = {}, data = {}, css = {} } = {}) => {
//     return await _workshopping({
//       theme: { ...t, ...theme },
//       data: { ...d, ...data },
//       css: {...c, ...css }
//     })
//   }
// }
// async function workshopping ({ theme = {}, data = {}, css = {} } = {}) {
//   return await _workshopping({
//     theme: { ...THEME, ...theme },
//     data: { ...DATA, ...data },
//     css: { ...CSS, ...css }
//   })
// }
// async function _workshopping ({ theme, data, css }) {
//   console.log({theme})
//   console.log({data})
//   console.log({css})
//   console.log('@TODO: implement workshopping')
//   return await make (theme, data, css)
// }
// const THEME = {}
// const DATA = {}
// const CSS = {}
/******************************************************************************
  @TODO
******************************************************************************/
async function make (theme, data, css) {
  return {
    async render () {
      return await workshop2({ workshop: data.workshop, theme, css, whitelabel: data })
    }
  }
}

module.exports = workshop

// @TODO: every FIELD can be either an OBJECT or URL to a JSON
//        and it has DEFAULTS

workshop.customize = ({ config: co1 = {}, theme: t1 = {}, css: cs1 = {} } = {}) => {
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
  var data = (typeof workshop === 'object') ? workshop
    : await fetch(new URL(workshop || './workshop.json', location.href).href).then(response => response.json())
  var font_url = theme['--font']
  minimap = 'src/skilltree.png'
  var lessons = data.lessons
  var chat = data.chat
  if (!chat) throw new Error('no chat found')
  if (!lessons || lessons.length === 0) throw new Error('no lessons found')

  var css = styles(font_url || 'arial', theme)

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

function styles (font_url, theme) {
  var FONT = font_url.split('/').join('-').split('.').join('_')
  var font = bel`
    <style>
    @font-face {
      font-family: ${FONT};
      src: url('${font_url}');
    }
    </style>`
  document.head.appendChild(font)

  var defaulttheme = require('./defaulttheme.js')
  // console.log(theme)
  var others = { ...defaulttheme, ...theme }
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
      height: 100%;
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

},{"./defaulttheme.js":34,"bel":3,"belmark":5,"csjs-inject":9}],36:[function(require,module,exports){
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
module.exports = {
  '--font': 'src/PIXELADE.ttf',
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
}

},{}],37:[function(require,module,exports){
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

},{"./theme.js":36,"bel":3,"belmark":5,"csjs-inject":9,"workshopping":35}]},{},[1]);
