!function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["common/Input"]=t():e["common/Input"]=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=30)}({0:function(e,t){e.exports=require("react")},1:function(e,t,n){"use strict";var r=n(3),o=n.n(r),a=n(4),u=o()({namespace:a.a,glue:"--"});t.a=u},2:function(e,t){e.exports=require("classnames")},3:function(e,t){e.exports=require("css-ns")},30:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function a(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=n(0),c=n.n(u),i=n(2),p=n.n(i),l=n(1),s=n(31),f=(n.n(s),function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()),d=function(e){function t(){var e,n,a,u;r(this,t);for(var c=arguments.length,i=Array(c),p=0;p<c;p++)i[p]=arguments[p];return n=a=o(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(i))),a.onChange=function(e){var t=e.target.value;a.props.onChange(t)},u=n,o(a,u)}return a(t,e),f(t,[{key:"render",value:function(){var e=this.props,t=e.value,n=e.placeholder,r=e.placeholderCentered,o=e.isValid,a=e.errorMessage,u=p()("input",{"input--isInvalid":!o,"input--placeholderCentered":r});return c.a.createElement("div",{className:Object(l.a)(u)},c.a.createElement("input",{type:"text",className:Object(l.a)("input-input"),placeholder:n,value:t,onChange:this.onChange}),c.a.createElement("div",{className:Object(l.a)("input-border")}),a&&c.a.createElement("div",{className:Object(l.a)("input-error")},a))}}]),t}(u.Component);d.defaultProps={isValid:!0,placeholderCentered:!1},t.default=d},31:function(e,t){},4:function(e,t,n){"use strict";n.d(t,"a",function(){return r});var r="PAC"}})});