!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.vuec=t():e.vuec=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,n){"use strict";function r(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=function(){function e(){o(this,e),this.$cache=new Map,this.production=Boolean(1)}return i(e,[{key:"register",value:function(e,t){this.$cache.set(e,t)}},{key:"unregister",value:function(e){this.$cache.has(e)&&this.$cache.delete(e)}},{key:"has",value:function(e){return this.$cache.has(e)}},{key:"bindings",value:function(){return this.$cache.entries()}},{key:"resolve",value:function(e){if(this.$cache.has(e))return this.$cache.get(e);if(!this.production)throw new Error('Unknown dependency "'+e+'"')}},{key:"parameters",value:function(e){var t=e.toString().match(/^(function)?\s*[^(]*\(\s*([^)]*)\)?/m);return null===t?(console.warn("Extraction failed for "+e.name),e.bind(self)):("function"===t[1]||void 0===t[1]?t[2]:t[1]).replace(/ /g,"").split(",").filter(function(e){return""!==e}).map(this.resolve.bind(this))}},{key:"prepare",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=this.parameters(e);return e.bind.apply(e,[t].concat(r(n)))}}]),e}();t.default=u},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}Object.defineProperty(t,"__esModule",{value:!0});var i=n(0),u=r(i),a=function(e,t,n){var r=e.$options[t];if(r&&r.length>0){var i=n.parameters(r[r.length-1]),u=r[r.length-1];r[r.length-1]=function(){u.call.apply(u,[this].concat(o(i)))}}},c=function(e,t){void 0!==e.$options.services&&e.$options.services.forEach(function(n){e.$services[n]=t.resolve(n)})},f=new u.default;t.default={production:1,install:function(e){e.prototype.$services=[],e.prototype.$ioc=f,e.$ioc=f,e.mixin({beforeCreate:function(){c(this,f),a(this,"created",f),a(this,"beforeMount",f),a(this,"mounted",f),a(this,"beforeUpdate",f),a(this,"updated",f),a(this,"beforeDestroy",f),a(this,"destroyed",f)}})}}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.Container=void 0;var o=n(0);Object.defineProperty(t,"Container",{enumerable:!0,get:function(){return r(o).default}});var i=n(1),u=r(i);t.default=u.default}])});
//# sourceMappingURL=vuec.js.map