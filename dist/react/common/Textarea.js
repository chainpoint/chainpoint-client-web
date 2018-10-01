!function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["common/Textarea"]=t():e["common/Textarea"]=t()}(this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=35)}({0:function(e,t){e.exports=require("react")},1:function(e,t,r){"use strict";var n=r(3),a=r.n(n),o=r(4),i=a()({namespace:o.a,glue:"--"});t.a=i},2:function(e,t){e.exports=require("classnames")},3:function(e,t){e.exports=require("css-ns")},35:function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function o(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=r(0),c=r.n(i),u=r(2),l=r.n(u),s=r(36),p=r.n(s),f=r(37),b=r.n(f),d=r(1),x=r(38),g=(r.n(x),function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()),m=function(e){function t(e){n(this,t);var r=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return r.onChange=function(e){var t=e.target.value;r.props.onChange(t)},r.onScroll=function(e){var t=r.textarea.scrollTop,n=r.textarea.getBoundingClientRect().height,a=r.textarea.scrollHeight;a-(t+n)>40?r.setState({bottomOpacity:0}):r.setState({bottomOpacity:1-(a-(t+n))/40}),t>40?r.setState({topOpacity:0}):r.setState({topOpacity:1-t/40})},r.state={topOpacity:1,bottomOpacity:1},r}return o(t,e),g(t,[{key:"render",value:function(){var e=this,t=this.props,r=t.placeholder,n=t.value,a=t.placeholderCentered,o=t.grow,i=t.disabled,u=t.maxHeight,s=n.length,f=l()("textarea",{"textarea--text-large":s<40,"textarea--text-medium":s>=40&&s<200,"textarea--text-small":s>=200,"textarea--placeholderCentered":a,"textarea--grow":o});return c.a.createElement("div",{className:Object(d.a)(f)},c.a.createElement(p.a,null,function(t){t.height;return c.a.createElement(b.a,{inputRef:function(t){return e.textarea=t},className:Object(d.a)("textarea-input"),placeholder:r,value:n,onChange:e.onChange,onScroll:e.onScroll,disabled:i,style:{maxHeight:u,WebkitMask:"linear-gradient(0deg, rgba(255,255,255,"+e.state.bottomOpacity+") 0px, rgba(255,255,255,1) 102px, rgba(255,255,255,1) 109px, rgba(255,255,255,"+e.state.topOpacity+"))",mask:"linear-gradient(0deg, rgba(255,255,255,"+e.state.bottomOpacity+") 0px, rgba(255,255,255,1) 102px, rgba(255,255,255,1) 109px, rgba(255,255,255,"+e.state.topOpacity+"))"}})}),c.a.createElement("div",{className:Object(d.a)("textarea-border")}))}}]),t}(i.Component);m.defaultProps={disabled:!1,maxHeight:200,placeholderCentered:!1,grow:!1},t.default=m},36:function(e,t){e.exports=require("react-container-dimensions")},37:function(e,t){e.exports=require("react-textarea-autosize")},38:function(e,t){},4:function(e,t,r){"use strict";r.d(t,"a",function(){return n});var n="CCW"}})});