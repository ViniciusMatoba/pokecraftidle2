import{g as mm}from"./vendor-react-6FVds0BD.js";var Nl={exports:{}},Ol={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(r){function e(j,W){var J=j.length;j.push(W);e:for(;0<J;){var me=J-1>>>1,ie=j[me];if(0<s(ie,W))j[me]=W,j[J]=ie,J=me;else break e}}function t(j){return j.length===0?null:j[0]}function n(j){if(j.length===0)return null;var W=j[0],J=j.pop();if(J!==W){j[0]=J;e:for(var me=0,ie=j.length,Ie=ie>>>1;me<Ie;){var it=2*(me+1)-1,ot=j[it],at=it+1,ut=j[at];if(0>s(ot,J))at<ie&&0>s(ut,ot)?(j[me]=ut,j[at]=J,me=at):(j[me]=ot,j[it]=J,me=it);else if(at<ie&&0>s(ut,J))j[me]=ut,j[at]=J,me=at;else break e}}return W}function s(j,W){var J=j.sortIndex-W.sortIndex;return J!==0?J:j.id-W.id}if(typeof performance=="object"&&typeof performance.now=="function"){var i=performance;r.unstable_now=function(){return i.now()}}else{var o=Date,u=o.now();r.unstable_now=function(){return o.now()-u}}var c=[],h=[],f=1,m=null,g=3,E=!1,V=!1,C=!1,D=typeof setTimeout=="function"?setTimeout:null,M=typeof clearTimeout=="function"?clearTimeout:null,U=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function O(j){for(var W=t(h);W!==null;){if(W.callback===null)n(h);else if(W.startTime<=j)n(h),W.sortIndex=W.expirationTime,e(c,W);else break;W=t(h)}}function q(j){if(C=!1,O(j),!V)if(t(c)!==null)V=!0,fr($);else{var W=t(h);W!==null&&st(q,W.startTime-j)}}function $(j,W){V=!1,C&&(C=!1,M(_),_=-1),E=!0;var J=g;try{for(O(W),m=t(c);m!==null&&(!(m.expirationTime>W)||j&&!v());){var me=m.callback;if(typeof me=="function"){m.callback=null,g=m.priorityLevel;var ie=me(m.expirationTime<=W);W=r.unstable_now(),typeof ie=="function"?m.callback=ie:m===t(c)&&n(c),O(W)}else n(c);m=t(c)}if(m!==null)var Ie=!0;else{var it=t(h);it!==null&&st(q,it.startTime-W),Ie=!1}return Ie}finally{m=null,g=J,E=!1}}var x=!1,y=null,_=-1,T=5,w=-1;function v(){return!(r.unstable_now()-w<T)}function R(){if(y!==null){var j=r.unstable_now();w=j;var W=!0;try{W=y(!0,j)}finally{W?I():(x=!1,y=null)}}else x=!1}var I;if(typeof U=="function")I=function(){U(R)};else if(typeof MessageChannel<"u"){var He=new MessageChannel,Qt=He.port2;He.port1.onmessage=R,I=function(){Qt.postMessage(null)}}else I=function(){D(R,0)};function fr(j){y=j,x||(x=!0,I())}function st(j,W){_=D(function(){j(r.unstable_now())},W)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(j){j.callback=null},r.unstable_continueExecution=function(){V||E||(V=!0,fr($))},r.unstable_forceFrameRate=function(j){0>j||125<j?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<j?Math.floor(1e3/j):5},r.unstable_getCurrentPriorityLevel=function(){return g},r.unstable_getFirstCallbackNode=function(){return t(c)},r.unstable_next=function(j){switch(g){case 1:case 2:case 3:var W=3;break;default:W=g}var J=g;g=W;try{return j()}finally{g=J}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(j,W){switch(j){case 1:case 2:case 3:case 4:case 5:break;default:j=3}var J=g;g=j;try{return W()}finally{g=J}},r.unstable_scheduleCallback=function(j,W,J){var me=r.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?me+J:me):J=me,j){case 1:var ie=-1;break;case 2:ie=250;break;case 5:ie=1073741823;break;case 4:ie=1e4;break;default:ie=5e3}return ie=J+ie,j={id:f++,callback:W,priorityLevel:j,startTime:J,expirationTime:ie,sortIndex:-1},J>me?(j.sortIndex=J,e(h,j),t(c)===null&&j===t(h)&&(C?(M(_),_=-1):C=!0,st(q,J-me))):(j.sortIndex=ie,e(c,j),V||E||(V=!0,fr($))),j},r.unstable_shouldYield=v,r.unstable_wrapCallback=function(j){var W=g;return function(){var J=g;g=W;try{return j.apply(this,arguments)}finally{g=J}}}})(Ol);Nl.exports=Ol;var KT=Nl.exports,nc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},pm=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],u=r[t++],c=((s&7)<<18|(i&63)<<12|(o&63)<<6|u&63)-65536;e[n++]=String.fromCharCode(55296+(c>>10)),e[n++]=String.fromCharCode(56320+(c&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},Fl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,u=o?r[s+1]:0,c=s+2<r.length,h=c?r[s+2]:0,f=i>>2,m=(i&3)<<4|u>>4;let g=(u&15)<<2|h>>6,E=h&63;c||(E=64,o||(g=64)),n.push(t[f],t[m],t[g],t[E])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(Ml(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):pm(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],u=s<r.length?t[r.charAt(s)]:0;++s;const h=s<r.length?t[r.charAt(s)]:64;++s;const m=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||u==null||h==null||m==null)throw new gm;const g=i<<2|u>>4;if(n.push(g),h!==64){const E=u<<4&240|h>>2;if(n.push(E),m!==64){const V=h<<6&192|m;n.push(V)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class gm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const _m=function(r){const e=Ml(r);return Fl.encodeByteArray(e,!0)},Ws=function(r){return _m(r).replace(/\./g,"")},ym=function(r){try{return Fl.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Im(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tm=()=>Im().__FIREBASE_DEFAULTS__,Em=()=>{if(typeof process>"u"||typeof nc>"u")return;const r=nc.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},wm=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&ym(r[1]);return e&&JSON.parse(e)},di=()=>{try{return Tm()||Em()||wm()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},vm=r=>{var e,t;return(t=(e=di())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},Am=r=>{const e=vm(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},Ll=()=>{var r;return(r=di())===null||r===void 0?void 0:r.config},QT=r=>{var e;return(e=di())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rm(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},r);return[Ws(JSON.stringify(t)),Ws(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Un(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function WT(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Un())}function Sm(){var r;const e=(r=di())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function HT(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Pm(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function JT(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function YT(){const r=Un();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Bl(){return!Sm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Jo(){try{return typeof indexedDB=="object"}catch{return!1}}function Ul(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)===null||i===void 0?void 0:i.message)||"")}}catch(t){e(t)}})}function Vm(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cm="FirebaseError";class qt extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=Cm,Object.setPrototypeOf(this,qt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,fi.prototype.create)}}class fi{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?Dm(i,n):"Error",u=`${this.serviceName}: ${o} (${s}).`;return new qt(s,u,n)}}function Dm(r,e){return r.replace(xm,(t,n)=>{const s=e[n];return s!=null?String(s):`<${n}?>`})}const xm=/\{\$([^}]+)}/g;function XT(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function xt(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(rc(i)&&rc(o)){if(!xt(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function rc(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ZT(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function eE(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function tE(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function nE(r,e){const t=new km(r,e);return t.subscribe.bind(t)}class km{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");Nm(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=co),s.error===void 0&&(s.error=co),s.complete===void 0&&(s.complete=co);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Nm(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function co(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Om=1e3,Mm=2,Fm=4*60*60*1e3,Lm=.5;function sc(r,e=Om,t=Mm){const n=e*Math.pow(t,r),s=Math.round(Lm*n*(Math.random()-.5)*2);return Math.min(Fm,n+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae(r){return r&&r._delegate?r._delegate:r}class ft{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new bm;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(qm(e))try{this.getOrInitializeService({instanceIdentifier:Zt})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=Zt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Zt){return this.instances.has(e)}getOptions(e=Zt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(i);n===u&&o.resolve(s)}return s}onInit(e,t){var n;const s=this.normalizeInstanceIdentifier(t),i=(n=this.onInitCallbacks.get(s))!==null&&n!==void 0?n:new Set;i.add(e),this.onInitCallbacks.set(s,i);const o=this.instances.get(s);return o&&e(o,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Um(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Zt){return this.component?this.component.multipleInstances?e:Zt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Um(r){return r===Zt?void 0:r}function qm(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jm{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Bm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var te;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(te||(te={}));const zm={debug:te.DEBUG,verbose:te.VERBOSE,info:te.INFO,warn:te.WARN,error:te.ERROR,silent:te.SILENT},Gm=te.INFO,$m={[te.DEBUG]:"log",[te.VERBOSE]:"log",[te.INFO]:"info",[te.WARN]:"warn",[te.ERROR]:"error"},Km=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=$m[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Yo{constructor(e){this.name=e,this._logLevel=Gm,this._logHandler=Km,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in te))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?zm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,te.DEBUG,...e),this._logHandler(this,te.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,te.VERBOSE,...e),this._logHandler(this,te.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,te.INFO,...e),this._logHandler(this,te.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,te.WARN,...e),this._logHandler(this,te.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,te.ERROR,...e),this._logHandler(this,te.ERROR,...e)}}const Qm=(r,e)=>e.some(t=>r instanceof t);let ic,oc;function Wm(){return ic||(ic=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Hm(){return oc||(oc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ql=new WeakMap,Ao=new WeakMap,jl=new WeakMap,lo=new WeakMap,Xo=new WeakMap;function Jm(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(Ct(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&ql.set(t,r)}).catch(()=>{}),Xo.set(e,r),e}function Ym(r){if(Ao.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});Ao.set(r,e)}let bo={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Ao.get(r);if(e==="objectStoreNames")return r.objectStoreNames||jl.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Ct(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function Xm(r){bo=r(bo)}function Zm(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(ho(this),e,...t);return jl.set(n,e.sort?e.sort():[e]),Ct(n)}:Hm().includes(r)?function(...e){return r.apply(ho(this),e),Ct(ql.get(this))}:function(...e){return Ct(r.apply(ho(this),e))}}function ep(r){return typeof r=="function"?Zm(r):(r instanceof IDBTransaction&&Ym(r),Qm(r,Wm())?new Proxy(r,bo):r)}function Ct(r){if(r instanceof IDBRequest)return Jm(r);if(lo.has(r))return lo.get(r);const e=ep(r);return e!==r&&(lo.set(r,e),Xo.set(e,r)),e}const ho=r=>Xo.get(r);function zl(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),u=Ct(o);return n&&o.addEventListener("upgradeneeded",c=>{n(Ct(o.result),c.oldVersion,c.newVersion,Ct(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),u.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),u}const tp=["get","getKey","getAll","getAllKeys","count"],np=["put","add","delete","clear"],fo=new Map;function ac(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(fo.get(e))return fo.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=np.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||tp.includes(t)))return;const i=async function(o,...u){const c=this.transaction(o,s?"readwrite":"readonly");let h=c.store;return n&&(h=h.index(u.shift())),(await Promise.all([h[t](...u),s&&c.done]))[0]};return fo.set(e,i),i}Xm(r=>({...r,get:(e,t,n)=>ac(e,t)||r.get(e,t,n),has:(e,t)=>!!ac(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rp{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(sp(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function sp(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Ro="@firebase/app",uc="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mt=new Yo("@firebase/app"),ip="@firebase/app-compat",op="@firebase/analytics-compat",ap="@firebase/analytics",up="@firebase/app-check-compat",cp="@firebase/app-check",lp="@firebase/auth",hp="@firebase/auth-compat",dp="@firebase/database",fp="@firebase/data-connect",mp="@firebase/database-compat",pp="@firebase/functions",gp="@firebase/functions-compat",_p="@firebase/installations",yp="@firebase/installations-compat",Ip="@firebase/messaging",Tp="@firebase/messaging-compat",Ep="@firebase/performance",wp="@firebase/performance-compat",vp="@firebase/remote-config",Ap="@firebase/remote-config-compat",bp="@firebase/storage",Rp="@firebase/storage-compat",Sp="@firebase/firestore",Pp="@firebase/vertexai-preview",Vp="@firebase/firestore-compat",Cp="firebase",Dp="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hs="[DEFAULT]",xp={[Ro]:"fire-core",[ip]:"fire-core-compat",[ap]:"fire-analytics",[op]:"fire-analytics-compat",[cp]:"fire-app-check",[up]:"fire-app-check-compat",[lp]:"fire-auth",[hp]:"fire-auth-compat",[dp]:"fire-rtdb",[fp]:"fire-data-connect",[mp]:"fire-rtdb-compat",[pp]:"fire-fn",[gp]:"fire-fn-compat",[_p]:"fire-iid",[yp]:"fire-iid-compat",[Ip]:"fire-fcm",[Tp]:"fire-fcm-compat",[Ep]:"fire-perf",[wp]:"fire-perf-compat",[vp]:"fire-rc",[Ap]:"fire-rc-compat",[bp]:"fire-gcs",[Rp]:"fire-gcs-compat",[Sp]:"fire-fst",[Vp]:"fire-fst-compat",[Pp]:"fire-vertex","fire-js":"fire-js",[Cp]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Js=new Map,kp=new Map,So=new Map;function cc(r,e){try{r.container.addComponent(e)}catch(t){mt.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function kt(r){const e=r.name;if(So.has(e))return mt.debug(`There were multiple attempts to register component ${e}.`),!1;So.set(e,r);for(const t of Js.values())cc(t,r);for(const t of kp.values())cc(t,r);return!0}function En(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Np(r,e,t=Hs){En(r,e).clearInstance(t)}function rE(r){return r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Op={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Dt=new fi("app","Firebase",Op);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mp{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new ft("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Dt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fp=Dp;function Lp(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n=Object.assign({name:Hs,automaticDataCollectionEnabled:!1},e),s=n.name;if(typeof s!="string"||!s)throw Dt.create("bad-app-name",{appName:String(s)});if(t||(t=Ll()),!t)throw Dt.create("no-options");const i=Js.get(s);if(i){if(xt(t,i.options)&&xt(n,i.config))return i;throw Dt.create("duplicate-app",{appName:s})}const o=new jm(s);for(const c of So.values())o.addComponent(c);const u=new Mp(t,n,o);return Js.set(s,u),u}function Gl(r=Hs){const e=Js.get(r);if(!e&&r===Hs&&Ll())return Lp();if(!e)throw Dt.create("no-app",{appName:r});return e}function dt(r,e,t){var n;let s=(n=xp[r])!==null&&n!==void 0?n:r;t&&(s+=`-${t}`);const i=s.match(/\s|\//),o=e.match(/\s|\//);if(i||o){const u=[`Unable to register library "${s}" with version "${e}":`];i&&u.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&u.push("and"),o&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),mt.warn(u.join(" "));return}kt(new ft(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bp="firebase-heartbeat-database",Up=1,jr="firebase-heartbeat-store";let mo=null;function $l(){return mo||(mo=zl(Bp,Up,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(jr)}catch(t){console.warn(t)}}}}).catch(r=>{throw Dt.create("idb-open",{originalErrorMessage:r.message})})),mo}async function qp(r){try{const t=(await $l()).transaction(jr),n=await t.objectStore(jr).get(Kl(r));return await t.done,n}catch(e){if(e instanceof qt)mt.warn(e.message);else{const t=Dt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});mt.warn(t.message)}}}async function lc(r,e){try{const n=(await $l()).transaction(jr,"readwrite");await n.objectStore(jr).put(e,Kl(r)),await n.done}catch(t){if(t instanceof qt)mt.warn(t.message);else{const n=Dt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});mt.warn(n.message)}}}function Kl(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jp=1024,zp=30*24*60*60*1e3;class Gp{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Kp(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=hc();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const u=new Date(o.date).valueOf();return Date.now()-u<=zp}),this._storage.overwrite(this._heartbeatsCache))}catch(n){mt.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=hc(),{heartbeatsToSend:n,unsentEntries:s}=$p(this._heartbeatsCache.heartbeats),i=Ws(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return mt.warn(t),""}}}function hc(){return new Date().toISOString().substring(0,10)}function $p(r,e=jp){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),dc(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),dc(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class Kp{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Jo()?Ul().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await qp(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return lc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return lc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function dc(r){return Ws(JSON.stringify({version:2,heartbeats:r})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qp(r){kt(new ft("platform-logger",e=>new rp(e),"PRIVATE")),kt(new ft("heartbeat",e=>new Gp(e),"PRIVATE")),dt(Ro,uc,r),dt(Ro,uc,"esm2017"),dt("fire-js","")}Qp("");const Ql="@firebase/installations",Zo="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wl=1e4,Hl=`w:${Zo}`,Jl="FIS_v2",Wp="https://firebaseinstallations.googleapis.com/v1",Hp=60*60*1e3,Jp="installations",Yp="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xp={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},ln=new fi(Jp,Yp,Xp);function Yl(r){return r instanceof qt&&r.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xl({projectId:r}){return`${Wp}/projects/${r}/installations`}function Zl(r){return{token:r.token,requestStatus:2,expiresIn:eg(r.expiresIn),creationTime:Date.now()}}async function eh(r,e){const n=(await e.json()).error;return ln.create("request-failed",{requestName:r,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function th({apiKey:r}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r})}function Zp(r,{refreshToken:e}){const t=th(r);return t.append("Authorization",tg(e)),t}async function nh(r){const e=await r();return e.status>=500&&e.status<600?r():e}function eg(r){return Number(r.replace("s","000"))}function tg(r){return`${Jl} ${r}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ng({appConfig:r,heartbeatServiceProvider:e},{fid:t}){const n=Xl(r),s=th(r),i=e.getImmediate({optional:!0});if(i){const h=await i.getHeartbeatsHeader();h&&s.append("x-firebase-client",h)}const o={fid:t,authVersion:Jl,appId:r.appId,sdkVersion:Hl},u={method:"POST",headers:s,body:JSON.stringify(o)},c=await nh(()=>fetch(n,u));if(c.ok){const h=await c.json();return{fid:h.fid||t,registrationStatus:2,refreshToken:h.refreshToken,authToken:Zl(h.authToken)}}else throw await eh("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rh(r){return new Promise(e=>{setTimeout(e,r)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rg(r){return btoa(String.fromCharCode(...r)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sg=/^[cdef][\w-]{21}$/,Po="";function ig(){try{const r=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(r),r[0]=112+r[0]%16;const t=og(r);return sg.test(t)?t:Po}catch{return Po}}function og(r){return rg(r).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mi(r){return`${r.appName}!${r.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sh=new Map;function ih(r,e){const t=mi(r);oh(t,e),ag(t,e)}function oh(r,e){const t=sh.get(r);if(t)for(const n of t)n(e)}function ag(r,e){const t=ug();t&&t.postMessage({key:r,fid:e}),cg()}let on=null;function ug(){return!on&&"BroadcastChannel"in self&&(on=new BroadcastChannel("[Firebase] FID Change"),on.onmessage=r=>{oh(r.data.key,r.data.fid)}),on}function cg(){sh.size===0&&on&&(on.close(),on=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lg="firebase-installations-database",hg=1,hn="firebase-installations-store";let po=null;function ea(){return po||(po=zl(lg,hg,{upgrade:(r,e)=>{switch(e){case 0:r.createObjectStore(hn)}}})),po}async function Ys(r,e){const t=mi(r),s=(await ea()).transaction(hn,"readwrite"),i=s.objectStore(hn),o=await i.get(t);return await i.put(e,t),await s.done,(!o||o.fid!==e.fid)&&ih(r,e.fid),e}async function ah(r){const e=mi(r),n=(await ea()).transaction(hn,"readwrite");await n.objectStore(hn).delete(e),await n.done}async function pi(r,e){const t=mi(r),s=(await ea()).transaction(hn,"readwrite"),i=s.objectStore(hn),o=await i.get(t),u=e(o);return u===void 0?await i.delete(t):await i.put(u,t),await s.done,u&&(!o||o.fid!==u.fid)&&ih(r,u.fid),u}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ta(r){let e;const t=await pi(r.appConfig,n=>{const s=dg(n),i=fg(r,s);return e=i.registrationPromise,i.installationEntry});return t.fid===Po?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function dg(r){const e=r||{fid:ig(),registrationStatus:0};return uh(e)}function fg(r,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(ln.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},n=mg(r,t);return{installationEntry:t,registrationPromise:n}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:pg(r)}:{installationEntry:e}}async function mg(r,e){try{const t=await ng(r,e);return Ys(r.appConfig,t)}catch(t){throw Yl(t)&&t.customData.serverCode===409?await ah(r.appConfig):await Ys(r.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function pg(r){let e=await fc(r.appConfig);for(;e.registrationStatus===1;)await rh(100),e=await fc(r.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:n}=await ta(r);return n||t}return e}function fc(r){return pi(r,e=>{if(!e)throw ln.create("installation-not-found");return uh(e)})}function uh(r){return gg(r)?{fid:r.fid,registrationStatus:0}:r}function gg(r){return r.registrationStatus===1&&r.registrationTime+Wl<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _g({appConfig:r,heartbeatServiceProvider:e},t){const n=yg(r,t),s=Zp(r,t),i=e.getImmediate({optional:!0});if(i){const h=await i.getHeartbeatsHeader();h&&s.append("x-firebase-client",h)}const o={installation:{sdkVersion:Hl,appId:r.appId}},u={method:"POST",headers:s,body:JSON.stringify(o)},c=await nh(()=>fetch(n,u));if(c.ok){const h=await c.json();return Zl(h)}else throw await eh("Generate Auth Token",c)}function yg(r,{fid:e}){return`${Xl(r)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function na(r,e=!1){let t;const n=await pi(r.appConfig,i=>{if(!ch(i))throw ln.create("not-registered");const o=i.authToken;if(!e&&Eg(o))return i;if(o.requestStatus===1)return t=Ig(r,e),i;{if(!navigator.onLine)throw ln.create("app-offline");const u=vg(i);return t=Tg(r,u),u}});return t?await t:n.authToken}async function Ig(r,e){let t=await mc(r.appConfig);for(;t.authToken.requestStatus===1;)await rh(100),t=await mc(r.appConfig);const n=t.authToken;return n.requestStatus===0?na(r,e):n}function mc(r){return pi(r,e=>{if(!ch(e))throw ln.create("not-registered");const t=e.authToken;return Ag(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function Tg(r,e){try{const t=await _g(r,e),n=Object.assign(Object.assign({},e),{authToken:t});return await Ys(r.appConfig,n),t}catch(t){if(Yl(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await ah(r.appConfig);else{const n=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Ys(r.appConfig,n)}throw t}}function ch(r){return r!==void 0&&r.registrationStatus===2}function Eg(r){return r.requestStatus===2&&!wg(r)}function wg(r){const e=Date.now();return e<r.creationTime||r.creationTime+r.expiresIn<e+Hp}function vg(r){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},r),{authToken:e})}function Ag(r){return r.requestStatus===1&&r.requestTime+Wl<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bg(r){const e=r,{installationEntry:t,registrationPromise:n}=await ta(e);return n?n.catch(console.error):na(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rg(r,e=!1){const t=r;return await Sg(t),(await na(t,e)).token}async function Sg(r){const{registrationPromise:e}=await ta(r);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pg(r){if(!r||!r.options)throw go("App Configuration");if(!r.name)throw go("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!r.options[t])throw go(t);return{appName:r.name,projectId:r.options.projectId,apiKey:r.options.apiKey,appId:r.options.appId}}function go(r){return ln.create("missing-app-config-values",{valueName:r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lh="installations",Vg="installations-internal",Cg=r=>{const e=r.getProvider("app").getImmediate(),t=Pg(e),n=En(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:n,_delete:()=>Promise.resolve()}},Dg=r=>{const e=r.getProvider("app").getImmediate(),t=En(e,lh).getImmediate();return{getId:()=>bg(t),getToken:s=>Rg(t,s)}};function xg(){kt(new ft(lh,Cg,"PUBLIC")),kt(new ft(Vg,Dg,"PRIVATE"))}xg();dt(Ql,Zo);dt(Ql,Zo,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xs="analytics",kg="firebase_id",Ng="origin",Og=60*1e3,Mg="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",ra="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $e=new Yo("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fg={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Qe=new fi("analytics","Analytics",Fg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lg(r){if(!r.startsWith(ra)){const e=Qe.create("invalid-gtag-resource",{gtagURL:r});return $e.warn(e.message),""}return r}function hh(r){return Promise.all(r.map(e=>e.catch(t=>t)))}function Bg(r,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(r,e)),t}function Ug(r,e){const t=Bg("firebase-js-sdk-policy",{createScriptURL:Lg}),n=document.createElement("script"),s=`${ra}?l=${r}&id=${e}`;n.src=t?t==null?void 0:t.createScriptURL(s):s,n.async=!0,document.head.appendChild(n)}function qg(r){let e=[];return Array.isArray(window[r])?e=window[r]:window[r]=e,e}async function jg(r,e,t,n,s,i){const o=n[s];try{if(o)await e[o];else{const c=(await hh(t)).find(h=>h.measurementId===s);c&&await e[c.appId]}}catch(u){$e.error(u)}r("config",s,i)}async function zg(r,e,t,n,s){try{let i=[];if(s&&s.send_to){let o=s.send_to;Array.isArray(o)||(o=[o]);const u=await hh(t);for(const c of o){const h=u.find(m=>m.measurementId===c),f=h&&e[h.appId];if(f)i.push(f);else{i=[];break}}}i.length===0&&(i=Object.values(e)),await Promise.all(i),r("event",n,s||{})}catch(i){$e.error(i)}}function Gg(r,e,t,n){async function s(i,...o){try{if(i==="event"){const[u,c]=o;await zg(r,e,t,u,c)}else if(i==="config"){const[u,c]=o;await jg(r,e,t,n,u,c)}else if(i==="consent"){const[u,c]=o;r("consent",u,c)}else if(i==="get"){const[u,c,h]=o;r("get",u,c,h)}else if(i==="set"){const[u]=o;r("set",u)}else r(i,...o)}catch(u){$e.error(u)}}return s}function $g(r,e,t,n,s){let i=function(...o){window[n].push(arguments)};return window[s]&&typeof window[s]=="function"&&(i=window[s]),window[s]=Gg(i,r,e,t),{gtagCore:i,wrappedGtag:window[s]}}function Kg(r){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(ra)&&t.src.includes(r))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qg=30,Wg=1e3;class Hg{constructor(e={},t=Wg){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const dh=new Hg;function Jg(r){return new Headers({Accept:"application/json","x-goog-api-key":r})}async function Yg(r){var e;const{appId:t,apiKey:n}=r,s={method:"GET",headers:Jg(n)},i=Mg.replace("{app-id}",t),o=await fetch(i,s);if(o.status!==200&&o.status!==304){let u="";try{const c=await o.json();!((e=c.error)===null||e===void 0)&&e.message&&(u=c.error.message)}catch{}throw Qe.create("config-fetch-failed",{httpStatus:o.status,responseMessage:u})}return o.json()}async function Xg(r,e=dh,t){const{appId:n,apiKey:s,measurementId:i}=r.options;if(!n)throw Qe.create("no-app-id");if(!s){if(i)return{measurementId:i,appId:n};throw Qe.create("no-api-key")}const o=e.getThrottleMetadata(n)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new t_;return setTimeout(async()=>{u.abort()},Og),fh({appId:n,apiKey:s,measurementId:i},o,u,e)}async function fh(r,{throttleEndTimeMillis:e,backoffCount:t},n,s=dh){var i;const{appId:o,measurementId:u}=r;try{await Zg(n,e)}catch(c){if(u)return $e.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${u} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:o,measurementId:u};throw c}try{const c=await Yg(r);return s.deleteThrottleMetadata(o),c}catch(c){const h=c;if(!e_(h)){if(s.deleteThrottleMetadata(o),u)return $e.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${u} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:o,measurementId:u};throw c}const f=Number((i=h==null?void 0:h.customData)===null||i===void 0?void 0:i.httpStatus)===503?sc(t,s.intervalMillis,Qg):sc(t,s.intervalMillis),m={throttleEndTimeMillis:Date.now()+f,backoffCount:t+1};return s.setThrottleMetadata(o,m),$e.debug(`Calling attemptFetch again in ${f} millis`),fh(r,m,n,s)}}function Zg(r,e){return new Promise((t,n)=>{const s=Math.max(e-Date.now(),0),i=setTimeout(t,s);r.addEventListener(()=>{clearTimeout(i),n(Qe.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function e_(r){if(!(r instanceof qt)||!r.customData)return!1;const e=Number(r.customData.httpStatus);return e===429||e===500||e===503||e===504}class t_{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function n_(r,e,t,n,s){if(s&&s.global){r("event",t,n);return}else{const i=await e,o=Object.assign(Object.assign({},n),{send_to:i});r("event",t,o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function r_(){if(Jo())try{await Ul()}catch(r){return $e.warn(Qe.create("indexeddb-unavailable",{errorInfo:r==null?void 0:r.toString()}).message),!1}else return $e.warn(Qe.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function s_(r,e,t,n,s,i,o){var u;const c=Xg(r);c.then(E=>{t[E.measurementId]=E.appId,r.options.measurementId&&E.measurementId!==r.options.measurementId&&$e.warn(`The measurement ID in the local Firebase config (${r.options.measurementId}) does not match the measurement ID fetched from the server (${E.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(E=>$e.error(E)),e.push(c);const h=r_().then(E=>{if(E)return n.getId()}),[f,m]=await Promise.all([c,h]);Kg(i)||Ug(i,f.measurementId),s("js",new Date);const g=(u=o==null?void 0:o.config)!==null&&u!==void 0?u:{};return g[Ng]="firebase",g.update=!0,m!=null&&(g[kg]=m),s("config",f.measurementId,g),f.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i_{constructor(e){this.app=e}_delete(){return delete Mr[this.app.options.appId],Promise.resolve()}}let Mr={},pc=[];const gc={};let _o="dataLayer",o_="gtag",_c,mh,yc=!1;function a_(){const r=[];if(Pm()&&r.push("This is a browser extension environment."),Vm()||r.push("Cookies are not available."),r.length>0){const e=r.map((n,s)=>`(${s+1}) ${n}`).join(" "),t=Qe.create("invalid-analytics-context",{errorInfo:e});$e.warn(t.message)}}function u_(r,e,t){a_();const n=r.options.appId;if(!n)throw Qe.create("no-app-id");if(!r.options.apiKey)if(r.options.measurementId)$e.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${r.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Qe.create("no-api-key");if(Mr[n]!=null)throw Qe.create("already-exists",{id:n});if(!yc){qg(_o);const{wrappedGtag:i,gtagCore:o}=$g(Mr,pc,gc,_o,o_);mh=i,_c=o,yc=!0}return Mr[n]=s_(r,pc,gc,e,_c,_o,t),new i_(r)}function sE(r=Gl()){r=Ae(r);const e=En(r,Xs);return e.isInitialized()?e.getImmediate():c_(r)}function c_(r,e={}){const t=En(r,Xs);if(t.isInitialized()){const s=t.getImmediate();if(xt(e,t.getOptions()))return s;throw Qe.create("already-initialized")}return t.initialize({options:e})}function l_(r,e,t,n){r=Ae(r),n_(mh,Mr[r.app.options.appId],e,t,n).catch(s=>$e.error(s))}const Ic="@firebase/analytics",Tc="0.10.8";function h_(){kt(new ft(Xs,(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return u_(n,s,t)},"PUBLIC")),kt(new ft("analytics-internal",r,"PRIVATE")),dt(Ic,Tc),dt(Ic,Tc,"esm2017");function r(e){try{const t=e.getProvider(Xs).getImmediate();return{logEvent:(n,s,i)=>l_(t,n,s,i)}}catch(t){throw Qe.create("interop-component-reg-failed",{reason:t})}}}h_();var Ec=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var un,ph;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(y,_){function T(){}T.prototype=_.prototype,y.D=_.prototype,y.prototype=new T,y.prototype.constructor=y,y.C=function(w,v,R){for(var I=Array(arguments.length-2),He=2;He<arguments.length;He++)I[He-2]=arguments[He];return _.prototype[v].apply(w,I)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(y,_,T){T||(T=0);var w=Array(16);if(typeof _=="string")for(var v=0;16>v;++v)w[v]=_.charCodeAt(T++)|_.charCodeAt(T++)<<8|_.charCodeAt(T++)<<16|_.charCodeAt(T++)<<24;else for(v=0;16>v;++v)w[v]=_[T++]|_[T++]<<8|_[T++]<<16|_[T++]<<24;_=y.g[0],T=y.g[1],v=y.g[2];var R=y.g[3],I=_+(R^T&(v^R))+w[0]+3614090360&4294967295;_=T+(I<<7&4294967295|I>>>25),I=R+(v^_&(T^v))+w[1]+3905402710&4294967295,R=_+(I<<12&4294967295|I>>>20),I=v+(T^R&(_^T))+w[2]+606105819&4294967295,v=R+(I<<17&4294967295|I>>>15),I=T+(_^v&(R^_))+w[3]+3250441966&4294967295,T=v+(I<<22&4294967295|I>>>10),I=_+(R^T&(v^R))+w[4]+4118548399&4294967295,_=T+(I<<7&4294967295|I>>>25),I=R+(v^_&(T^v))+w[5]+1200080426&4294967295,R=_+(I<<12&4294967295|I>>>20),I=v+(T^R&(_^T))+w[6]+2821735955&4294967295,v=R+(I<<17&4294967295|I>>>15),I=T+(_^v&(R^_))+w[7]+4249261313&4294967295,T=v+(I<<22&4294967295|I>>>10),I=_+(R^T&(v^R))+w[8]+1770035416&4294967295,_=T+(I<<7&4294967295|I>>>25),I=R+(v^_&(T^v))+w[9]+2336552879&4294967295,R=_+(I<<12&4294967295|I>>>20),I=v+(T^R&(_^T))+w[10]+4294925233&4294967295,v=R+(I<<17&4294967295|I>>>15),I=T+(_^v&(R^_))+w[11]+2304563134&4294967295,T=v+(I<<22&4294967295|I>>>10),I=_+(R^T&(v^R))+w[12]+1804603682&4294967295,_=T+(I<<7&4294967295|I>>>25),I=R+(v^_&(T^v))+w[13]+4254626195&4294967295,R=_+(I<<12&4294967295|I>>>20),I=v+(T^R&(_^T))+w[14]+2792965006&4294967295,v=R+(I<<17&4294967295|I>>>15),I=T+(_^v&(R^_))+w[15]+1236535329&4294967295,T=v+(I<<22&4294967295|I>>>10),I=_+(v^R&(T^v))+w[1]+4129170786&4294967295,_=T+(I<<5&4294967295|I>>>27),I=R+(T^v&(_^T))+w[6]+3225465664&4294967295,R=_+(I<<9&4294967295|I>>>23),I=v+(_^T&(R^_))+w[11]+643717713&4294967295,v=R+(I<<14&4294967295|I>>>18),I=T+(R^_&(v^R))+w[0]+3921069994&4294967295,T=v+(I<<20&4294967295|I>>>12),I=_+(v^R&(T^v))+w[5]+3593408605&4294967295,_=T+(I<<5&4294967295|I>>>27),I=R+(T^v&(_^T))+w[10]+38016083&4294967295,R=_+(I<<9&4294967295|I>>>23),I=v+(_^T&(R^_))+w[15]+3634488961&4294967295,v=R+(I<<14&4294967295|I>>>18),I=T+(R^_&(v^R))+w[4]+3889429448&4294967295,T=v+(I<<20&4294967295|I>>>12),I=_+(v^R&(T^v))+w[9]+568446438&4294967295,_=T+(I<<5&4294967295|I>>>27),I=R+(T^v&(_^T))+w[14]+3275163606&4294967295,R=_+(I<<9&4294967295|I>>>23),I=v+(_^T&(R^_))+w[3]+4107603335&4294967295,v=R+(I<<14&4294967295|I>>>18),I=T+(R^_&(v^R))+w[8]+1163531501&4294967295,T=v+(I<<20&4294967295|I>>>12),I=_+(v^R&(T^v))+w[13]+2850285829&4294967295,_=T+(I<<5&4294967295|I>>>27),I=R+(T^v&(_^T))+w[2]+4243563512&4294967295,R=_+(I<<9&4294967295|I>>>23),I=v+(_^T&(R^_))+w[7]+1735328473&4294967295,v=R+(I<<14&4294967295|I>>>18),I=T+(R^_&(v^R))+w[12]+2368359562&4294967295,T=v+(I<<20&4294967295|I>>>12),I=_+(T^v^R)+w[5]+4294588738&4294967295,_=T+(I<<4&4294967295|I>>>28),I=R+(_^T^v)+w[8]+2272392833&4294967295,R=_+(I<<11&4294967295|I>>>21),I=v+(R^_^T)+w[11]+1839030562&4294967295,v=R+(I<<16&4294967295|I>>>16),I=T+(v^R^_)+w[14]+4259657740&4294967295,T=v+(I<<23&4294967295|I>>>9),I=_+(T^v^R)+w[1]+2763975236&4294967295,_=T+(I<<4&4294967295|I>>>28),I=R+(_^T^v)+w[4]+1272893353&4294967295,R=_+(I<<11&4294967295|I>>>21),I=v+(R^_^T)+w[7]+4139469664&4294967295,v=R+(I<<16&4294967295|I>>>16),I=T+(v^R^_)+w[10]+3200236656&4294967295,T=v+(I<<23&4294967295|I>>>9),I=_+(T^v^R)+w[13]+681279174&4294967295,_=T+(I<<4&4294967295|I>>>28),I=R+(_^T^v)+w[0]+3936430074&4294967295,R=_+(I<<11&4294967295|I>>>21),I=v+(R^_^T)+w[3]+3572445317&4294967295,v=R+(I<<16&4294967295|I>>>16),I=T+(v^R^_)+w[6]+76029189&4294967295,T=v+(I<<23&4294967295|I>>>9),I=_+(T^v^R)+w[9]+3654602809&4294967295,_=T+(I<<4&4294967295|I>>>28),I=R+(_^T^v)+w[12]+3873151461&4294967295,R=_+(I<<11&4294967295|I>>>21),I=v+(R^_^T)+w[15]+530742520&4294967295,v=R+(I<<16&4294967295|I>>>16),I=T+(v^R^_)+w[2]+3299628645&4294967295,T=v+(I<<23&4294967295|I>>>9),I=_+(v^(T|~R))+w[0]+4096336452&4294967295,_=T+(I<<6&4294967295|I>>>26),I=R+(T^(_|~v))+w[7]+1126891415&4294967295,R=_+(I<<10&4294967295|I>>>22),I=v+(_^(R|~T))+w[14]+2878612391&4294967295,v=R+(I<<15&4294967295|I>>>17),I=T+(R^(v|~_))+w[5]+4237533241&4294967295,T=v+(I<<21&4294967295|I>>>11),I=_+(v^(T|~R))+w[12]+1700485571&4294967295,_=T+(I<<6&4294967295|I>>>26),I=R+(T^(_|~v))+w[3]+2399980690&4294967295,R=_+(I<<10&4294967295|I>>>22),I=v+(_^(R|~T))+w[10]+4293915773&4294967295,v=R+(I<<15&4294967295|I>>>17),I=T+(R^(v|~_))+w[1]+2240044497&4294967295,T=v+(I<<21&4294967295|I>>>11),I=_+(v^(T|~R))+w[8]+1873313359&4294967295,_=T+(I<<6&4294967295|I>>>26),I=R+(T^(_|~v))+w[15]+4264355552&4294967295,R=_+(I<<10&4294967295|I>>>22),I=v+(_^(R|~T))+w[6]+2734768916&4294967295,v=R+(I<<15&4294967295|I>>>17),I=T+(R^(v|~_))+w[13]+1309151649&4294967295,T=v+(I<<21&4294967295|I>>>11),I=_+(v^(T|~R))+w[4]+4149444226&4294967295,_=T+(I<<6&4294967295|I>>>26),I=R+(T^(_|~v))+w[11]+3174756917&4294967295,R=_+(I<<10&4294967295|I>>>22),I=v+(_^(R|~T))+w[2]+718787259&4294967295,v=R+(I<<15&4294967295|I>>>17),I=T+(R^(v|~_))+w[9]+3951481745&4294967295,y.g[0]=y.g[0]+_&4294967295,y.g[1]=y.g[1]+(v+(I<<21&4294967295|I>>>11))&4294967295,y.g[2]=y.g[2]+v&4294967295,y.g[3]=y.g[3]+R&4294967295}n.prototype.u=function(y,_){_===void 0&&(_=y.length);for(var T=_-this.blockSize,w=this.B,v=this.h,R=0;R<_;){if(v==0)for(;R<=T;)s(this,y,R),R+=this.blockSize;if(typeof y=="string"){for(;R<_;)if(w[v++]=y.charCodeAt(R++),v==this.blockSize){s(this,w),v=0;break}}else for(;R<_;)if(w[v++]=y[R++],v==this.blockSize){s(this,w),v=0;break}}this.h=v,this.o+=_},n.prototype.v=function(){var y=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);y[0]=128;for(var _=1;_<y.length-8;++_)y[_]=0;var T=8*this.o;for(_=y.length-8;_<y.length;++_)y[_]=T&255,T/=256;for(this.u(y),y=Array(16),_=T=0;4>_;++_)for(var w=0;32>w;w+=8)y[T++]=this.g[_]>>>w&255;return y};function i(y,_){var T=u;return Object.prototype.hasOwnProperty.call(T,y)?T[y]:T[y]=_(y)}function o(y,_){this.h=_;for(var T=[],w=!0,v=y.length-1;0<=v;v--){var R=y[v]|0;w&&R==_||(T[v]=R,w=!1)}this.g=T}var u={};function c(y){return-128<=y&&128>y?i(y,function(_){return new o([_|0],0>_?-1:0)}):new o([y|0],0>y?-1:0)}function h(y){if(isNaN(y)||!isFinite(y))return m;if(0>y)return D(h(-y));for(var _=[],T=1,w=0;y>=T;w++)_[w]=y/T|0,T*=4294967296;return new o(_,0)}function f(y,_){if(y.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(y.charAt(0)=="-")return D(f(y.substring(1),_));if(0<=y.indexOf("-"))throw Error('number format error: interior "-" character');for(var T=h(Math.pow(_,8)),w=m,v=0;v<y.length;v+=8){var R=Math.min(8,y.length-v),I=parseInt(y.substring(v,v+R),_);8>R?(R=h(Math.pow(_,R)),w=w.j(R).add(h(I))):(w=w.j(T),w=w.add(h(I)))}return w}var m=c(0),g=c(1),E=c(16777216);r=o.prototype,r.m=function(){if(C(this))return-D(this).m();for(var y=0,_=1,T=0;T<this.g.length;T++){var w=this.i(T);y+=(0<=w?w:4294967296+w)*_,_*=4294967296}return y},r.toString=function(y){if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(V(this))return"0";if(C(this))return"-"+D(this).toString(y);for(var _=h(Math.pow(y,6)),T=this,w="";;){var v=q(T,_).g;T=M(T,v.j(_));var R=((0<T.g.length?T.g[0]:T.h)>>>0).toString(y);if(T=v,V(T))return R+w;for(;6>R.length;)R="0"+R;w=R+w}},r.i=function(y){return 0>y?0:y<this.g.length?this.g[y]:this.h};function V(y){if(y.h!=0)return!1;for(var _=0;_<y.g.length;_++)if(y.g[_]!=0)return!1;return!0}function C(y){return y.h==-1}r.l=function(y){return y=M(this,y),C(y)?-1:V(y)?0:1};function D(y){for(var _=y.g.length,T=[],w=0;w<_;w++)T[w]=~y.g[w];return new o(T,~y.h).add(g)}r.abs=function(){return C(this)?D(this):this},r.add=function(y){for(var _=Math.max(this.g.length,y.g.length),T=[],w=0,v=0;v<=_;v++){var R=w+(this.i(v)&65535)+(y.i(v)&65535),I=(R>>>16)+(this.i(v)>>>16)+(y.i(v)>>>16);w=I>>>16,R&=65535,I&=65535,T[v]=I<<16|R}return new o(T,T[T.length-1]&-2147483648?-1:0)};function M(y,_){return y.add(D(_))}r.j=function(y){if(V(this)||V(y))return m;if(C(this))return C(y)?D(this).j(D(y)):D(D(this).j(y));if(C(y))return D(this.j(D(y)));if(0>this.l(E)&&0>y.l(E))return h(this.m()*y.m());for(var _=this.g.length+y.g.length,T=[],w=0;w<2*_;w++)T[w]=0;for(w=0;w<this.g.length;w++)for(var v=0;v<y.g.length;v++){var R=this.i(w)>>>16,I=this.i(w)&65535,He=y.i(v)>>>16,Qt=y.i(v)&65535;T[2*w+2*v]+=I*Qt,U(T,2*w+2*v),T[2*w+2*v+1]+=R*Qt,U(T,2*w+2*v+1),T[2*w+2*v+1]+=I*He,U(T,2*w+2*v+1),T[2*w+2*v+2]+=R*He,U(T,2*w+2*v+2)}for(w=0;w<_;w++)T[w]=T[2*w+1]<<16|T[2*w];for(w=_;w<2*_;w++)T[w]=0;return new o(T,0)};function U(y,_){for(;(y[_]&65535)!=y[_];)y[_+1]+=y[_]>>>16,y[_]&=65535,_++}function O(y,_){this.g=y,this.h=_}function q(y,_){if(V(_))throw Error("division by zero");if(V(y))return new O(m,m);if(C(y))return _=q(D(y),_),new O(D(_.g),D(_.h));if(C(_))return _=q(y,D(_)),new O(D(_.g),_.h);if(30<y.g.length){if(C(y)||C(_))throw Error("slowDivide_ only works with positive integers.");for(var T=g,w=_;0>=w.l(y);)T=$(T),w=$(w);var v=x(T,1),R=x(w,1);for(w=x(w,2),T=x(T,2);!V(w);){var I=R.add(w);0>=I.l(y)&&(v=v.add(T),R=I),w=x(w,1),T=x(T,1)}return _=M(y,v.j(_)),new O(v,_)}for(v=m;0<=y.l(_);){for(T=Math.max(1,Math.floor(y.m()/_.m())),w=Math.ceil(Math.log(T)/Math.LN2),w=48>=w?1:Math.pow(2,w-48),R=h(T),I=R.j(_);C(I)||0<I.l(y);)T-=w,R=h(T),I=R.j(_);V(R)&&(R=g),v=v.add(R),y=M(y,I)}return new O(v,y)}r.A=function(y){return q(this,y).h},r.and=function(y){for(var _=Math.max(this.g.length,y.g.length),T=[],w=0;w<_;w++)T[w]=this.i(w)&y.i(w);return new o(T,this.h&y.h)},r.or=function(y){for(var _=Math.max(this.g.length,y.g.length),T=[],w=0;w<_;w++)T[w]=this.i(w)|y.i(w);return new o(T,this.h|y.h)},r.xor=function(y){for(var _=Math.max(this.g.length,y.g.length),T=[],w=0;w<_;w++)T[w]=this.i(w)^y.i(w);return new o(T,this.h^y.h)};function $(y){for(var _=y.g.length+1,T=[],w=0;w<_;w++)T[w]=y.i(w)<<1|y.i(w-1)>>>31;return new o(T,y.h)}function x(y,_){var T=_>>5;_%=32;for(var w=y.g.length-T,v=[],R=0;R<w;R++)v[R]=0<_?y.i(R+T)>>>_|y.i(R+T+1)<<32-_:y.i(R+T);return new o(v,y.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,ph=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,un=o}).apply(typeof Ec<"u"?Ec:typeof self<"u"?self:typeof window<"u"?window:{});var xs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var gh,xr,_h,Bs,Vo,yh,Ih,Th;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,l,d){return a==Array.prototype||a==Object.prototype||(a[l]=d.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof xs=="object"&&xs];for(var l=0;l<a.length;++l){var d=a[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=t(this);function s(a,l){if(l)e:{var d=n;a=a.split(".");for(var p=0;p<a.length-1;p++){var b=a[p];if(!(b in d))break e;d=d[b]}a=a[a.length-1],p=d[a],l=l(p),l!=p&&l!=null&&e(d,a,{configurable:!0,writable:!0,value:l})}}function i(a,l){a instanceof String&&(a+="");var d=0,p=!1,b={next:function(){if(!p&&d<a.length){var P=d++;return{value:l(P,a[P]),done:!1}}return p=!0,{done:!0,value:void 0}}};return b[Symbol.iterator]=function(){return b},b}s("Array.prototype.values",function(a){return a||function(){return i(this,function(l,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},u=this||self;function c(a){var l=typeof a;return l=l!="object"?l:a?Array.isArray(a)?"array":l:"null",l=="array"||l=="object"&&typeof a.length=="number"}function h(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function f(a,l,d){return a.call.apply(a.bind,arguments)}function m(a,l,d){if(!a)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var b=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(b,p),a.apply(l,b)}}return function(){return a.apply(l,arguments)}}function g(a,l,d){return g=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,g.apply(null,arguments)}function E(a,l){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function V(a,l){function d(){}d.prototype=l.prototype,a.aa=l.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(p,b,P){for(var L=Array(arguments.length-2),oe=2;oe<arguments.length;oe++)L[oe-2]=arguments[oe];return l.prototype[b].apply(p,L)}}function C(a){const l=a.length;if(0<l){const d=Array(l);for(let p=0;p<l;p++)d[p]=a[p];return d}return[]}function D(a,l){for(let d=1;d<arguments.length;d++){const p=arguments[d];if(c(p)){const b=a.length||0,P=p.length||0;a.length=b+P;for(let L=0;L<P;L++)a[b+L]=p[L]}else a.push(p)}}class M{constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function U(a){return/^[\s\xa0]*$/.test(a)}function O(){var a=u.navigator;return a&&(a=a.userAgent)?a:""}function q(a){return q[" "](a),a}q[" "]=function(){};var $=O().indexOf("Gecko")!=-1&&!(O().toLowerCase().indexOf("webkit")!=-1&&O().indexOf("Edge")==-1)&&!(O().indexOf("Trident")!=-1||O().indexOf("MSIE")!=-1)&&O().indexOf("Edge")==-1;function x(a,l,d){for(const p in a)l.call(d,a[p],p,a)}function y(a,l){for(const d in a)l.call(void 0,a[d],d,a)}function _(a){const l={};for(const d in a)l[d]=a[d];return l}const T="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function w(a,l){let d,p;for(let b=1;b<arguments.length;b++){p=arguments[b];for(d in p)a[d]=p[d];for(let P=0;P<T.length;P++)d=T[P],Object.prototype.hasOwnProperty.call(p,d)&&(a[d]=p[d])}}function v(a){var l=1;a=a.split(":");const d=[];for(;0<l&&a.length;)d.push(a.shift()),l--;return a.length&&d.push(a.join(":")),d}function R(a){u.setTimeout(()=>{throw a},0)}function I(){var a=W;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class He{constructor(){this.h=this.g=null}add(l,d){const p=Qt.get();p.set(l,d),this.h?this.h.next=p:this.g=p,this.h=p}}var Qt=new M(()=>new fr,a=>a.reset());class fr{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let st,j=!1,W=new He,J=()=>{const a=u.Promise.resolve(void 0);st=()=>{a.then(me)}};var me=()=>{for(var a;a=I();){try{a.h.call(a.g)}catch(d){R(d)}var l=Qt;l.j(a),100>l.h&&(l.h++,a.next=l.g,l.g=a)}j=!1};function ie(){this.s=this.s,this.C=this.C}ie.prototype.s=!1,ie.prototype.ma=function(){this.s||(this.s=!0,this.N())},ie.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Ie(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}Ie.prototype.h=function(){this.defaultPrevented=!0};var it=function(){if(!u.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};u.addEventListener("test",d,l),u.removeEventListener("test",d,l)}catch{}return a}();function ot(a,l){if(Ie.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget){if($){e:{try{q(l.nodeName);var b=!0;break e}catch{}b=!1}b||(l=null)}}else d=="mouseover"?l=a.fromElement:d=="mouseout"&&(l=a.toElement);this.relatedTarget=l,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:at[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&ot.aa.h.call(this)}}V(ot,Ie);var at={2:"touch",3:"pen",4:"mouse"};ot.prototype.h=function(){ot.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ut="closure_listenable_"+(1e6*Math.random()|0),Ff=0;function Lf(a,l,d,p,b){this.listener=a,this.proxy=null,this.src=l,this.type=d,this.capture=!!p,this.ha=b,this.key=++Ff,this.da=this.fa=!1}function ms(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function ps(a){this.src=a,this.g={},this.h=0}ps.prototype.add=function(a,l,d,p,b){var P=a.toString();a=this.g[P],a||(a=this.g[P]=[],this.h++);var L=qi(a,l,p,b);return-1<L?(l=a[L],d||(l.fa=!1)):(l=new Lf(l,this.src,P,!!p,b),l.fa=d,a.push(l)),l};function Ui(a,l){var d=l.type;if(d in a.g){var p=a.g[d],b=Array.prototype.indexOf.call(p,l,void 0),P;(P=0<=b)&&Array.prototype.splice.call(p,b,1),P&&(ms(l),a.g[d].length==0&&(delete a.g[d],a.h--))}}function qi(a,l,d,p){for(var b=0;b<a.length;++b){var P=a[b];if(!P.da&&P.listener==l&&P.capture==!!d&&P.ha==p)return b}return-1}var ji="closure_lm_"+(1e6*Math.random()|0),zi={};function ru(a,l,d,p,b){if(Array.isArray(l)){for(var P=0;P<l.length;P++)ru(a,l[P],d,p,b);return null}return d=ou(d),a&&a[ut]?a.K(l,d,h(p)?!!p.capture:!1,b):Bf(a,l,d,!1,p,b)}function Bf(a,l,d,p,b,P){if(!l)throw Error("Invalid event type");var L=h(b)?!!b.capture:!!b,oe=$i(a);if(oe||(a[ji]=oe=new ps(a)),d=oe.add(l,d,p,L,P),d.proxy)return d;if(p=Uf(),d.proxy=p,p.src=a,p.listener=d,a.addEventListener)it||(b=L),b===void 0&&(b=!1),a.addEventListener(l.toString(),p,b);else if(a.attachEvent)a.attachEvent(iu(l.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Uf(){function a(d){return l.call(a.src,a.listener,d)}const l=qf;return a}function su(a,l,d,p,b){if(Array.isArray(l))for(var P=0;P<l.length;P++)su(a,l[P],d,p,b);else p=h(p)?!!p.capture:!!p,d=ou(d),a&&a[ut]?(a=a.i,l=String(l).toString(),l in a.g&&(P=a.g[l],d=qi(P,d,p,b),-1<d&&(ms(P[d]),Array.prototype.splice.call(P,d,1),P.length==0&&(delete a.g[l],a.h--)))):a&&(a=$i(a))&&(l=a.g[l.toString()],a=-1,l&&(a=qi(l,d,p,b)),(d=-1<a?l[a]:null)&&Gi(d))}function Gi(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[ut])Ui(l.i,a);else{var d=a.type,p=a.proxy;l.removeEventListener?l.removeEventListener(d,p,a.capture):l.detachEvent?l.detachEvent(iu(d),p):l.addListener&&l.removeListener&&l.removeListener(p),(d=$i(l))?(Ui(d,a),d.h==0&&(d.src=null,l[ji]=null)):ms(a)}}}function iu(a){return a in zi?zi[a]:zi[a]="on"+a}function qf(a,l){if(a.da)a=!0;else{l=new ot(l,this);var d=a.listener,p=a.ha||a.src;a.fa&&Gi(a),a=d.call(p,l)}return a}function $i(a){return a=a[ji],a instanceof ps?a:null}var Ki="__closure_events_fn_"+(1e9*Math.random()>>>0);function ou(a){return typeof a=="function"?a:(a[Ki]||(a[Ki]=function(l){return a.handleEvent(l)}),a[Ki])}function ke(){ie.call(this),this.i=new ps(this),this.M=this,this.F=null}V(ke,ie),ke.prototype[ut]=!0,ke.prototype.removeEventListener=function(a,l,d,p){su(this,a,l,d,p)};function Ue(a,l){var d,p=a.F;if(p)for(d=[];p;p=p.F)d.push(p);if(a=a.M,p=l.type||l,typeof l=="string")l=new Ie(l,a);else if(l instanceof Ie)l.target=l.target||a;else{var b=l;l=new Ie(p,a),w(l,b)}if(b=!0,d)for(var P=d.length-1;0<=P;P--){var L=l.g=d[P];b=gs(L,p,!0,l)&&b}if(L=l.g=a,b=gs(L,p,!0,l)&&b,b=gs(L,p,!1,l)&&b,d)for(P=0;P<d.length;P++)L=l.g=d[P],b=gs(L,p,!1,l)&&b}ke.prototype.N=function(){if(ke.aa.N.call(this),this.i){var a=this.i,l;for(l in a.g){for(var d=a.g[l],p=0;p<d.length;p++)ms(d[p]);delete a.g[l],a.h--}}this.F=null},ke.prototype.K=function(a,l,d,p){return this.i.add(String(a),l,!1,d,p)},ke.prototype.L=function(a,l,d,p){return this.i.add(String(a),l,!0,d,p)};function gs(a,l,d,p){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();for(var b=!0,P=0;P<l.length;++P){var L=l[P];if(L&&!L.da&&L.capture==d){var oe=L.listener,Ve=L.ha||L.src;L.fa&&Ui(a.i,L),b=oe.call(Ve,p)!==!1&&b}}return b&&!p.defaultPrevented}function au(a,l,d){if(typeof a=="function")d&&(a=g(a,d));else if(a&&typeof a.handleEvent=="function")a=g(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:u.setTimeout(a,l||0)}function uu(a){a.g=au(()=>{a.g=null,a.i&&(a.i=!1,uu(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class jf extends ie{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:uu(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function mr(a){ie.call(this),this.h=a,this.g={}}V(mr,ie);var cu=[];function lu(a){x(a.g,function(l,d){this.g.hasOwnProperty(d)&&Gi(l)},a),a.g={}}mr.prototype.N=function(){mr.aa.N.call(this),lu(this)},mr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Qi=u.JSON.stringify,zf=u.JSON.parse,Gf=class{stringify(a){return u.JSON.stringify(a,void 0)}parse(a){return u.JSON.parse(a,void 0)}};function Wi(){}Wi.prototype.h=null;function hu(a){return a.h||(a.h=a.i())}function du(){}var pr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Hi(){Ie.call(this,"d")}V(Hi,Ie);function Ji(){Ie.call(this,"c")}V(Ji,Ie);var Wt={},fu=null;function _s(){return fu=fu||new ke}Wt.La="serverreachability";function mu(a){Ie.call(this,Wt.La,a)}V(mu,Ie);function gr(a){const l=_s();Ue(l,new mu(l))}Wt.STAT_EVENT="statevent";function pu(a,l){Ie.call(this,Wt.STAT_EVENT,a),this.stat=l}V(pu,Ie);function qe(a){const l=_s();Ue(l,new pu(l,a))}Wt.Ma="timingevent";function gu(a,l){Ie.call(this,Wt.Ma,a),this.size=l}V(gu,Ie);function _r(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){a()},l)}function yr(){this.g=!0}yr.prototype.xa=function(){this.g=!1};function $f(a,l,d,p,b,P){a.info(function(){if(a.g)if(P)for(var L="",oe=P.split("&"),Ve=0;Ve<oe.length;Ve++){var ne=oe[Ve].split("=");if(1<ne.length){var Ne=ne[0];ne=ne[1];var Oe=Ne.split("_");L=2<=Oe.length&&Oe[1]=="type"?L+(Ne+"="+ne+"&"):L+(Ne+"=redacted&")}}else L=null;else L=P;return"XMLHTTP REQ ("+p+") [attempt "+b+"]: "+l+`
`+d+`
`+L})}function Kf(a,l,d,p,b,P,L){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+b+"]: "+l+`
`+d+`
`+P+" "+L})}function Rn(a,l,d,p){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+Wf(a,d)+(p?" "+p:"")})}function Qf(a,l){a.info(function(){return"TIMEOUT: "+l})}yr.prototype.info=function(){};function Wf(a,l){if(!a.g)return l;if(!l)return null;try{var d=JSON.parse(l);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var p=d[a];if(!(2>p.length)){var b=p[1];if(Array.isArray(b)&&!(1>b.length)){var P=b[0];if(P!="noop"&&P!="stop"&&P!="close")for(var L=1;L<b.length;L++)b[L]=""}}}}return Qi(d)}catch{return l}}var ys={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},_u={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Yi;function Is(){}V(Is,Wi),Is.prototype.g=function(){return new XMLHttpRequest},Is.prototype.i=function(){return{}},Yi=new Is;function Et(a,l,d,p){this.j=a,this.i=l,this.l=d,this.R=p||1,this.U=new mr(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new yu}function yu(){this.i=null,this.g="",this.h=!1}var Iu={},Xi={};function Zi(a,l,d){a.L=1,a.v=vs(ct(l)),a.m=d,a.P=!0,Tu(a,null)}function Tu(a,l){a.F=Date.now(),Ts(a),a.A=ct(a.v);var d=a.A,p=a.R;Array.isArray(p)||(p=[String(p)]),Nu(d.i,"t",p),a.C=0,d=a.j.J,a.h=new yu,a.g=Xu(a.j,d?l:null,!a.m),0<a.O&&(a.M=new jf(g(a.Y,a,a.g),a.O)),l=a.U,d=a.g,p=a.ca;var b="readystatechange";Array.isArray(b)||(b&&(cu[0]=b.toString()),b=cu);for(var P=0;P<b.length;P++){var L=ru(d,b[P],p||l.handleEvent,!1,l.h||l);if(!L)break;l.g[L.key]=L}l=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,l)):(a.u="GET",a.g.ea(a.A,a.u,null,l)),gr(),$f(a.i,a.u,a.A,a.l,a.R,a.m)}Et.prototype.ca=function(a){a=a.target;const l=this.M;l&&lt(a)==3?l.j():this.Y(a)},Et.prototype.Y=function(a){try{if(a==this.g)e:{const Oe=lt(this.g);var l=this.g.Ba();const Vn=this.g.Z();if(!(3>Oe)&&(Oe!=3||this.g&&(this.h.h||this.g.oa()||qu(this.g)))){this.J||Oe!=4||l==7||(l==8||0>=Vn?gr(3):gr(2)),eo(this);var d=this.g.Z();this.X=d;t:if(Eu(this)){var p=qu(this.g);a="";var b=p.length,P=lt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Ht(this),Ir(this);var L="";break t}this.h.i=new u.TextDecoder}for(l=0;l<b;l++)this.h.h=!0,a+=this.h.i.decode(p[l],{stream:!(P&&l==b-1)});p.length=0,this.h.g+=a,this.C=0,L=this.h.g}else L=this.g.oa();if(this.o=d==200,Kf(this.i,this.u,this.A,this.l,this.R,Oe,d),this.o){if(this.T&&!this.K){t:{if(this.g){var oe,Ve=this.g;if((oe=Ve.g?Ve.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!U(oe)){var ne=oe;break t}}ne=null}if(d=ne)Rn(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,to(this,d);else{this.o=!1,this.s=3,qe(12),Ht(this),Ir(this);break e}}if(this.P){d=!0;let Ye;for(;!this.J&&this.C<L.length;)if(Ye=Hf(this,L),Ye==Xi){Oe==4&&(this.s=4,qe(14),d=!1),Rn(this.i,this.l,null,"[Incomplete Response]");break}else if(Ye==Iu){this.s=4,qe(15),Rn(this.i,this.l,L,"[Invalid Chunk]"),d=!1;break}else Rn(this.i,this.l,Ye,null),to(this,Ye);if(Eu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Oe!=4||L.length!=0||this.h.h||(this.s=1,qe(16),d=!1),this.o=this.o&&d,!d)Rn(this.i,this.l,L,"[Invalid Chunked Response]"),Ht(this),Ir(this);else if(0<L.length&&!this.W){this.W=!0;var Ne=this.j;Ne.g==this&&Ne.ba&&!Ne.M&&(Ne.j.info("Great, no buffering proxy detected. Bytes received: "+L.length),ao(Ne),Ne.M=!0,qe(11))}}else Rn(this.i,this.l,L,null),to(this,L);Oe==4&&Ht(this),this.o&&!this.J&&(Oe==4?Wu(this.j,this):(this.o=!1,Ts(this)))}else dm(this.g),d==400&&0<L.indexOf("Unknown SID")?(this.s=3,qe(12)):(this.s=0,qe(13)),Ht(this),Ir(this)}}}catch{}finally{}};function Eu(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Hf(a,l){var d=a.C,p=l.indexOf(`
`,d);return p==-1?Xi:(d=Number(l.substring(d,p)),isNaN(d)?Iu:(p+=1,p+d>l.length?Xi:(l=l.slice(p,p+d),a.C=p+d,l)))}Et.prototype.cancel=function(){this.J=!0,Ht(this)};function Ts(a){a.S=Date.now()+a.I,wu(a,a.I)}function wu(a,l){if(a.B!=null)throw Error("WatchDog timer not null");a.B=_r(g(a.ba,a),l)}function eo(a){a.B&&(u.clearTimeout(a.B),a.B=null)}Et.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(Qf(this.i,this.A),this.L!=2&&(gr(),qe(17)),Ht(this),this.s=2,Ir(this)):wu(this,this.S-a)};function Ir(a){a.j.G==0||a.J||Wu(a.j,a)}function Ht(a){eo(a);var l=a.M;l&&typeof l.ma=="function"&&l.ma(),a.M=null,lu(a.U),a.g&&(l=a.g,a.g=null,l.abort(),l.ma())}function to(a,l){try{var d=a.j;if(d.G!=0&&(d.g==a||no(d.h,a))){if(!a.K&&no(d.h,a)&&d.G==3){try{var p=d.Da.g.parse(l)}catch{p=null}if(Array.isArray(p)&&p.length==3){var b=p;if(b[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)Vs(d),Ss(d);else break e;oo(d),qe(18)}}else d.za=b[1],0<d.za-d.T&&37500>b[2]&&d.F&&d.v==0&&!d.C&&(d.C=_r(g(d.Za,d),6e3));if(1>=bu(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else Yt(d,11)}else if((a.K||d.g==a)&&Vs(d),!U(l))for(b=d.Da.g.parse(l),l=0;l<b.length;l++){let ne=b[l];if(d.T=ne[0],ne=ne[1],d.G==2)if(ne[0]=="c"){d.K=ne[1],d.ia=ne[2];const Ne=ne[3];Ne!=null&&(d.la=Ne,d.j.info("VER="+d.la));const Oe=ne[4];Oe!=null&&(d.Aa=Oe,d.j.info("SVER="+d.Aa));const Vn=ne[5];Vn!=null&&typeof Vn=="number"&&0<Vn&&(p=1.5*Vn,d.L=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const Ye=a.g;if(Ye){const Ds=Ye.g?Ye.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ds){var P=p.h;P.g||Ds.indexOf("spdy")==-1&&Ds.indexOf("quic")==-1&&Ds.indexOf("h2")==-1||(P.j=P.l,P.g=new Set,P.h&&(ro(P,P.h),P.h=null))}if(p.D){const uo=Ye.g?Ye.g.getResponseHeader("X-HTTP-Session-Id"):null;uo&&(p.ya=uo,ce(p.I,p.D,uo))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),p=d;var L=a;if(p.qa=Yu(p,p.J?p.ia:null,p.W),L.K){Ru(p.h,L);var oe=L,Ve=p.L;Ve&&(oe.I=Ve),oe.B&&(eo(oe),Ts(oe)),p.g=L}else Ku(p);0<d.i.length&&Ps(d)}else ne[0]!="stop"&&ne[0]!="close"||Yt(d,7);else d.G==3&&(ne[0]=="stop"||ne[0]=="close"?ne[0]=="stop"?Yt(d,7):io(d):ne[0]!="noop"&&d.l&&d.l.ta(ne),d.v=0)}}gr(4)}catch{}}var Jf=class{constructor(a,l){this.g=a,this.map=l}};function vu(a){this.l=a||10,u.PerformanceNavigationTiming?(a=u.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Au(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function bu(a){return a.h?1:a.g?a.g.size:0}function no(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function ro(a,l){a.g?a.g.add(l):a.h=l}function Ru(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}vu.prototype.cancel=function(){if(this.i=Su(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Su(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const d of a.g.values())l=l.concat(d.D);return l}return C(a.i)}function Yf(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var l=[],d=a.length,p=0;p<d;p++)l.push(a[p]);return l}l=[],d=0;for(p in a)l[d++]=a[p];return l}function Xf(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var l=[];a=a.length;for(var d=0;d<a;d++)l.push(d);return l}l=[],d=0;for(const p in a)l[d++]=p;return l}}}function Pu(a,l){if(a.forEach&&typeof a.forEach=="function")a.forEach(l,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,l,void 0);else for(var d=Xf(a),p=Yf(a),b=p.length,P=0;P<b;P++)l.call(void 0,p[P],d&&d[P],a)}var Vu=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Zf(a,l){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var p=a[d].indexOf("="),b=null;if(0<=p){var P=a[d].substring(0,p);b=a[d].substring(p+1)}else P=a[d];l(P,b?decodeURIComponent(b.replace(/\+/g," ")):"")}}}function Jt(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof Jt){this.h=a.h,Es(this,a.j),this.o=a.o,this.g=a.g,ws(this,a.s),this.l=a.l;var l=a.i,d=new wr;d.i=l.i,l.g&&(d.g=new Map(l.g),d.h=l.h),Cu(this,d),this.m=a.m}else a&&(l=String(a).match(Vu))?(this.h=!1,Es(this,l[1]||"",!0),this.o=Tr(l[2]||""),this.g=Tr(l[3]||"",!0),ws(this,l[4]),this.l=Tr(l[5]||"",!0),Cu(this,l[6]||"",!0),this.m=Tr(l[7]||"")):(this.h=!1,this.i=new wr(null,this.h))}Jt.prototype.toString=function(){var a=[],l=this.j;l&&a.push(Er(l,Du,!0),":");var d=this.g;return(d||l=="file")&&(a.push("//"),(l=this.o)&&a.push(Er(l,Du,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(Er(d,d.charAt(0)=="/"?nm:tm,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",Er(d,sm)),a.join("")};function ct(a){return new Jt(a)}function Es(a,l,d){a.j=d?Tr(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function ws(a,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);a.s=l}else a.s=null}function Cu(a,l,d){l instanceof wr?(a.i=l,im(a.i,a.h)):(d||(l=Er(l,rm)),a.i=new wr(l,a.h))}function ce(a,l,d){a.i.set(l,d)}function vs(a){return ce(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function Tr(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Er(a,l,d){return typeof a=="string"?(a=encodeURI(a).replace(l,em),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function em(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Du=/[#\/\?@]/g,tm=/[#\?:]/g,nm=/[#\?]/g,rm=/[#\?@]/g,sm=/#/g;function wr(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function wt(a){a.g||(a.g=new Map,a.h=0,a.i&&Zf(a.i,function(l,d){a.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=wr.prototype,r.add=function(a,l){wt(this),this.i=null,a=Sn(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(l),this.h+=1,this};function xu(a,l){wt(a),l=Sn(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function ku(a,l){return wt(a),l=Sn(a,l),a.g.has(l)}r.forEach=function(a,l){wt(this),this.g.forEach(function(d,p){d.forEach(function(b){a.call(l,b,p,this)},this)},this)},r.na=function(){wt(this);const a=Array.from(this.g.values()),l=Array.from(this.g.keys()),d=[];for(let p=0;p<l.length;p++){const b=a[p];for(let P=0;P<b.length;P++)d.push(l[p])}return d},r.V=function(a){wt(this);let l=[];if(typeof a=="string")ku(this,a)&&(l=l.concat(this.g.get(Sn(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)l=l.concat(a[d])}return l},r.set=function(a,l){return wt(this),this.i=null,a=Sn(this,a),ku(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=this.V(a),0<a.length?String(a[0]):l):l};function Nu(a,l,d){xu(a,l),0<d.length&&(a.i=null,a.g.set(Sn(a,l),C(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(var d=0;d<l.length;d++){var p=l[d];const P=encodeURIComponent(String(p)),L=this.V(p);for(p=0;p<L.length;p++){var b=P;L[p]!==""&&(b+="="+encodeURIComponent(String(L[p]))),a.push(b)}}return this.i=a.join("&")};function Sn(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function im(a,l){l&&!a.j&&(wt(a),a.i=null,a.g.forEach(function(d,p){var b=p.toLowerCase();p!=b&&(xu(this,p),Nu(this,b,d))},a)),a.j=l}function om(a,l){const d=new yr;if(u.Image){const p=new Image;p.onload=E(vt,d,"TestLoadImage: loaded",!0,l,p),p.onerror=E(vt,d,"TestLoadImage: error",!1,l,p),p.onabort=E(vt,d,"TestLoadImage: abort",!1,l,p),p.ontimeout=E(vt,d,"TestLoadImage: timeout",!1,l,p),u.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else l(!1)}function am(a,l){const d=new yr,p=new AbortController,b=setTimeout(()=>{p.abort(),vt(d,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:p.signal}).then(P=>{clearTimeout(b),P.ok?vt(d,"TestPingServer: ok",!0,l):vt(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(b),vt(d,"TestPingServer: error",!1,l)})}function vt(a,l,d,p,b){try{b&&(b.onload=null,b.onerror=null,b.onabort=null,b.ontimeout=null),p(d)}catch{}}function um(){this.g=new Gf}function cm(a,l,d){const p=d||"";try{Pu(a,function(b,P){let L=b;h(b)&&(L=Qi(b)),l.push(p+P+"="+encodeURIComponent(L))})}catch(b){throw l.push(p+"type="+encodeURIComponent("_badmap")),b}}function As(a){this.l=a.Ub||null,this.j=a.eb||!1}V(As,Wi),As.prototype.g=function(){return new bs(this.l,this.j)},As.prototype.i=function(a){return function(){return a}}({});function bs(a,l){ke.call(this),this.D=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}V(bs,ke),r=bs.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=l,this.readyState=1,Ar(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(l.body=a),(this.D||u).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,vr(this)),this.readyState=0},r.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Ar(this)),this.g&&(this.readyState=3,Ar(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ou(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ou(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}r.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?vr(this):Ar(this),this.readyState==3&&Ou(this)}},r.Ra=function(a){this.g&&(this.response=this.responseText=a,vr(this))},r.Qa=function(a){this.g&&(this.response=a,vr(this))},r.ga=function(){this.g&&vr(this)};function vr(a){a.readyState=4,a.l=null,a.j=null,a.v=null,Ar(a)}r.setRequestHeader=function(a,l){this.u.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=l.next();return a.join(`\r
`)};function Ar(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(bs.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Mu(a){let l="";return x(a,function(d,p){l+=p,l+=":",l+=d,l+=`\r
`}),l}function so(a,l,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=Mu(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):ce(a,l,d))}function _e(a){ke.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}V(_e,ke);var lm=/^https?$/i,hm=["POST","PUT"];r=_e.prototype,r.Ha=function(a){this.J=a},r.ea=function(a,l,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Yi.g(),this.v=this.o?hu(this.o):hu(Yi),this.g.onreadystatechange=g(this.Ea,this);try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(P){Fu(this,P);return}if(a=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var b in p)d.set(b,p[b]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const P of p.keys())d.set(P,p.get(P));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(P=>P.toLowerCase()=="content-type"),b=u.FormData&&a instanceof u.FormData,!(0<=Array.prototype.indexOf.call(hm,l,void 0))||p||b||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[P,L]of d)this.g.setRequestHeader(P,L);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Uu(this),this.u=!0,this.g.send(a),this.u=!1}catch(P){Fu(this,P)}};function Fu(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.m=5,Lu(a),Rs(a)}function Lu(a){a.A||(a.A=!0,Ue(a,"complete"),Ue(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,Ue(this,"complete"),Ue(this,"abort"),Rs(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Rs(this,!0)),_e.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?Bu(this):this.bb())},r.bb=function(){Bu(this)};function Bu(a){if(a.h&&typeof o<"u"&&(!a.v[1]||lt(a)!=4||a.Z()!=2)){if(a.u&&lt(a)==4)au(a.Ea,0,a);else if(Ue(a,"readystatechange"),lt(a)==4){a.h=!1;try{const L=a.Z();e:switch(L){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var d;if(!(d=l)){var p;if(p=L===0){var b=String(a.D).match(Vu)[1]||null;!b&&u.self&&u.self.location&&(b=u.self.location.protocol.slice(0,-1)),p=!lm.test(b?b.toLowerCase():"")}d=p}if(d)Ue(a,"complete"),Ue(a,"success");else{a.m=6;try{var P=2<lt(a)?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.Z()+"]",Lu(a)}}finally{Rs(a)}}}}function Rs(a,l){if(a.g){Uu(a);const d=a.g,p=a.v[0]?()=>{}:null;a.g=null,a.v=null,l||Ue(a,"ready");try{d.onreadystatechange=p}catch{}}}function Uu(a){a.I&&(u.clearTimeout(a.I),a.I=null)}r.isActive=function(){return!!this.g};function lt(a){return a.g?a.g.readyState:0}r.Z=function(){try{return 2<lt(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),zf(l)}};function qu(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function dm(a){const l={};a=(a.g&&2<=lt(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(U(a[p]))continue;var d=v(a[p]);const b=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const P=l[b]||[];l[b]=P,P.push(d)}y(l,function(p){return p.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function br(a,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||l}function ju(a){this.Aa=0,this.i=[],this.j=new yr,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=br("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=br("baseRetryDelayMs",5e3,a),this.cb=br("retryDelaySeedMs",1e4,a),this.Wa=br("forwardChannelMaxRetries",2,a),this.wa=br("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new vu(a&&a.concurrentRequestLimit),this.Da=new um,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=ju.prototype,r.la=8,r.G=1,r.connect=function(a,l,d,p){qe(0),this.W=a,this.H=l||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.I=Yu(this,null,this.W),Ps(this)};function io(a){if(zu(a),a.G==3){var l=a.U++,d=ct(a.I);if(ce(d,"SID",a.K),ce(d,"RID",l),ce(d,"TYPE","terminate"),Rr(a,d),l=new Et(a,a.j,l),l.L=2,l.v=vs(ct(d)),d=!1,u.navigator&&u.navigator.sendBeacon)try{d=u.navigator.sendBeacon(l.v.toString(),"")}catch{}!d&&u.Image&&(new Image().src=l.v,d=!0),d||(l.g=Xu(l.j,null),l.g.ea(l.v)),l.F=Date.now(),Ts(l)}Ju(a)}function Ss(a){a.g&&(ao(a),a.g.cancel(),a.g=null)}function zu(a){Ss(a),a.u&&(u.clearTimeout(a.u),a.u=null),Vs(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&u.clearTimeout(a.s),a.s=null)}function Ps(a){if(!Au(a.h)&&!a.s){a.s=!0;var l=a.Ga;st||J(),j||(st(),j=!0),W.add(l,a),a.B=0}}function fm(a,l){return bu(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=l.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=_r(g(a.Ga,a,l),Hu(a,a.B)),a.B++,!0)}r.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const b=new Et(this,this.j,a);let P=this.o;if(this.S&&(P?(P=_(P),w(P,this.S)):P=this.S),this.m!==null||this.O||(b.H=P,P=null),this.P)e:{for(var l=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(l+=p,4096<l){l=d;break e}if(l===4096||d===this.i.length-1){l=d+1;break e}}l=1e3}else l=1e3;l=$u(this,b,l),d=ct(this.I),ce(d,"RID",a),ce(d,"CVER",22),this.D&&ce(d,"X-HTTP-Session-Id",this.D),Rr(this,d),P&&(this.O?l="headers="+encodeURIComponent(String(Mu(P)))+"&"+l:this.m&&so(d,this.m,P)),ro(this.h,b),this.Ua&&ce(d,"TYPE","init"),this.P?(ce(d,"$req",l),ce(d,"SID","null"),b.T=!0,Zi(b,d,null)):Zi(b,d,l),this.G=2}}else this.G==3&&(a?Gu(this,a):this.i.length==0||Au(this.h)||Gu(this))};function Gu(a,l){var d;l?d=l.l:d=a.U++;const p=ct(a.I);ce(p,"SID",a.K),ce(p,"RID",d),ce(p,"AID",a.T),Rr(a,p),a.m&&a.o&&so(p,a.m,a.o),d=new Et(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),l&&(a.i=l.D.concat(a.i)),l=$u(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),ro(a.h,d),Zi(d,p,l)}function Rr(a,l){a.H&&x(a.H,function(d,p){ce(l,p,d)}),a.l&&Pu({},function(d,p){ce(l,p,d)})}function $u(a,l,d){d=Math.min(a.i.length,d);var p=a.l?g(a.l.Na,a.l,a):null;e:{var b=a.i;let P=-1;for(;;){const L=["count="+d];P==-1?0<d?(P=b[0].g,L.push("ofs="+P)):P=0:L.push("ofs="+P);let oe=!0;for(let Ve=0;Ve<d;Ve++){let ne=b[Ve].g;const Ne=b[Ve].map;if(ne-=P,0>ne)P=Math.max(0,b[Ve].g-100),oe=!1;else try{cm(Ne,L,"req"+ne+"_")}catch{p&&p(Ne)}}if(oe){p=L.join("&");break e}}}return a=a.i.splice(0,d),l.D=a,p}function Ku(a){if(!a.g&&!a.u){a.Y=1;var l=a.Fa;st||J(),j||(st(),j=!0),W.add(l,a),a.v=0}}function oo(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=_r(g(a.Fa,a),Hu(a,a.v)),a.v++,!0)}r.Fa=function(){if(this.u=null,Qu(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=_r(g(this.ab,this),a)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,qe(10),Ss(this),Qu(this))};function ao(a){a.A!=null&&(u.clearTimeout(a.A),a.A=null)}function Qu(a){a.g=new Et(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var l=ct(a.qa);ce(l,"RID","rpc"),ce(l,"SID",a.K),ce(l,"AID",a.T),ce(l,"CI",a.F?"0":"1"),!a.F&&a.ja&&ce(l,"TO",a.ja),ce(l,"TYPE","xmlhttp"),Rr(a,l),a.m&&a.o&&so(l,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=vs(ct(l)),d.m=null,d.P=!0,Tu(d,a)}r.Za=function(){this.C!=null&&(this.C=null,Ss(this),oo(this),qe(19))};function Vs(a){a.C!=null&&(u.clearTimeout(a.C),a.C=null)}function Wu(a,l){var d=null;if(a.g==l){Vs(a),ao(a),a.g=null;var p=2}else if(no(a.h,l))d=l.D,Ru(a.h,l),p=1;else return;if(a.G!=0){if(l.o)if(p==1){d=l.m?l.m.length:0,l=Date.now()-l.F;var b=a.B;p=_s(),Ue(p,new gu(p,d)),Ps(a)}else Ku(a);else if(b=l.s,b==3||b==0&&0<l.X||!(p==1&&fm(a,l)||p==2&&oo(a)))switch(d&&0<d.length&&(l=a.h,l.i=l.i.concat(d)),b){case 1:Yt(a,5);break;case 4:Yt(a,10);break;case 3:Yt(a,6);break;default:Yt(a,2)}}}function Hu(a,l){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*l}function Yt(a,l){if(a.j.info("Error code "+l),l==2){var d=g(a.fb,a),p=a.Xa;const b=!p;p=new Jt(p||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||Es(p,"https"),vs(p),b?om(p.toString(),d):am(p.toString(),d)}else qe(2);a.G=0,a.l&&a.l.sa(l),Ju(a),zu(a)}r.fb=function(a){a?(this.j.info("Successfully pinged google.com"),qe(2)):(this.j.info("Failed to ping google.com"),qe(1))};function Ju(a){if(a.G=0,a.ka=[],a.l){const l=Su(a.h);(l.length!=0||a.i.length!=0)&&(D(a.ka,l),D(a.ka,a.i),a.h.i.length=0,C(a.i),a.i.length=0),a.l.ra()}}function Yu(a,l,d){var p=d instanceof Jt?ct(d):new Jt(d);if(p.g!="")l&&(p.g=l+"."+p.g),ws(p,p.s);else{var b=u.location;p=b.protocol,l=l?l+"."+b.hostname:b.hostname,b=+b.port;var P=new Jt(null);p&&Es(P,p),l&&(P.g=l),b&&ws(P,b),d&&(P.l=d),p=P}return d=a.D,l=a.ya,d&&l&&ce(p,d,l),ce(p,"VER",a.la),Rr(a,p),p}function Xu(a,l,d){if(l&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Ca&&!a.pa?new _e(new As({eb:d})):new _e(a.pa),l.Ha(a.J),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Zu(){}r=Zu.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function Cs(){}Cs.prototype.g=function(a,l){return new Ke(a,l)};function Ke(a,l){ke.call(this),this.g=new ju(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(a?a["X-WebChannel-Client-Profile"]=l.va:a={"X-WebChannel-Client-Profile":l.va}),this.g.S=a,(a=l&&l.Sb)&&!U(a)&&(this.g.m=a),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!U(l)&&(this.g.D=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new Pn(this)}V(Ke,ke),Ke.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ke.prototype.close=function(){io(this.g)},Ke.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=Qi(a),a=d);l.i.push(new Jf(l.Ya++,a)),l.G==3&&Ps(l)},Ke.prototype.N=function(){this.g.l=null,delete this.j,io(this.g),delete this.g,Ke.aa.N.call(this)};function ec(a){Hi.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){e:{for(const d in l){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}V(ec,Hi);function tc(){Ji.call(this),this.status=1}V(tc,Ji);function Pn(a){this.g=a}V(Pn,Zu),Pn.prototype.ua=function(){Ue(this.g,"a")},Pn.prototype.ta=function(a){Ue(this.g,new ec(a))},Pn.prototype.sa=function(a){Ue(this.g,new tc)},Pn.prototype.ra=function(){Ue(this.g,"b")},Cs.prototype.createWebChannel=Cs.prototype.g,Ke.prototype.send=Ke.prototype.o,Ke.prototype.open=Ke.prototype.m,Ke.prototype.close=Ke.prototype.close,Th=function(){return new Cs},Ih=function(){return _s()},yh=Wt,Vo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},ys.NO_ERROR=0,ys.TIMEOUT=8,ys.HTTP_ERROR=6,Bs=ys,_u.COMPLETE="complete",_h=_u,du.EventType=pr,pr.OPEN="a",pr.CLOSE="b",pr.ERROR="c",pr.MESSAGE="d",ke.prototype.listen=ke.prototype.K,xr=du,_e.prototype.listenOnce=_e.prototype.L,_e.prototype.getLastError=_e.prototype.Ka,_e.prototype.getLastErrorCode=_e.prototype.Ba,_e.prototype.getStatus=_e.prototype.Z,_e.prototype.getResponseJson=_e.prototype.Oa,_e.prototype.getResponseText=_e.prototype.oa,_e.prototype.send=_e.prototype.ea,_e.prototype.setWithCredentials=_e.prototype.Ha,gh=_e}).apply(typeof xs<"u"?xs:typeof self<"u"?self:typeof window<"u"?window:{});const wc="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Se.UNAUTHENTICATED=new Se(null),Se.GOOGLE_CREDENTIALS=new Se("google-credentials-uid"),Se.FIRST_PARTY=new Se("first-party-uid"),Se.MOCK_USER=new Se("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rr="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt=new Yo("@firebase/firestore");function Nn(){return Nt.logLevel}function iE(r){Nt.setLogLevel(r)}function k(r,...e){if(Nt.logLevel<=te.DEBUG){const t=e.map(sa);Nt.debug(`Firestore (${rr}): ${r}`,...t)}}function Te(r,...e){if(Nt.logLevel<=te.ERROR){const t=e.map(sa);Nt.error(`Firestore (${rr}): ${r}`,...t)}}function Je(r,...e){if(Nt.logLevel<=te.WARN){const t=e.map(sa);Nt.warn(`Firestore (${rr}): ${r}`,...t)}}function sa(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(r="Unexpected state"){const e=`FIRESTORE (${rr}) INTERNAL ASSERTION FAILED: `+r;throw Te(e),new Error(e)}function G(r,e){r||z()}function oE(r,e){r||z()}function F(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends qt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class d_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Se.UNAUTHENTICATED))}shutdown(){}}class f_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class m_{constructor(e){this.t=e,this.currentUser=Se.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){G(this.o===void 0);let n=this.i;const s=c=>this.i!==n?(n=this.i,t(c)):Promise.resolve();let i=new Pe;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Pe,e.enqueueRetryable(()=>s(this.currentUser))};const o=()=>{const c=i;e.enqueueRetryable(async()=>{await c.promise,await s(this.currentUser)})},u=c=>{k("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(c=>u(c)),setTimeout(()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?u(c):(k("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Pe)}},0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(n=>this.i!==e?(k("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(G(typeof n.accessToken=="string"),new Eh(n.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return G(e===null||typeof e=="string"),new Se(e)}}class p_{constructor(e,t,n){this.l=e,this.h=t,this.P=n,this.type="FirstParty",this.user=Se.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class g_{constructor(e,t,n){this.l=e,this.h=t,this.P=n}getToken(){return Promise.resolve(new p_(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Se.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class wh{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class __{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){G(this.o===void 0);const n=i=>{i.error!=null&&k("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.R;return this.R=i.token,k("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable(()=>n(i))};const s=i=>{k("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(i=>s(i)),setTimeout(()=>{if(!this.appCheck){const i=this.A.getImmediate({optional:!0});i?s(i):k("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(G(typeof t.token=="string"),this.R=t.token,new wh(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}class aE{getToken(){return Promise.resolve(new wh(""))}invalidateToken(){}start(e,t){}shutdown(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function y_(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vh{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let n="";for(;n.length<20;){const s=y_(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%e.length))}return n}}function Q(r,e){return r<e?-1:r>e?1:0}function qn(r,e,t){return r.length===e.length&&r.every((n,s)=>t(n,e[s]))}function Ah(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return pe.fromMillis(Date.now())}static fromDate(e){return pe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor(1e6*(e-1e3*t));return new pe(t,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?Q(this.nanoseconds,e.nanoseconds):Q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e){this.timestamp=e}static fromTimestamp(e){return new K(e)}static min(){return new K(new pe(0,0))}static max(){return new K(new pe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zr{constructor(e,t,n){t===void 0?t=0:t>e.length&&z(),n===void 0?n=e.length-t:n>e.length-t&&z(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return zr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof zr?e.forEach(n=>{t.push(n)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=e.get(s),o=t.get(s);if(i<o)return-1;if(i>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class X extends zr{construct(e,t,n){return new X(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new N(S.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(s=>s.length>0))}return new X(t)}static emptyPath(){return new X([])}}const I_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class de extends zr{construct(e,t,n){return new de(e,t,n)}static isValidIdentifier(e){return I_.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),de.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new de(["__name__"])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new N(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new N(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=c,s+=2}else u==="`"?(o=!o,s++):u!=="."||o?(n+=u,s++):(i(),s++)}if(i(),o)throw new N(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new de(t)}static emptyPath(){return new de([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e){this.path=e}static fromPath(e){return new B(X.fromString(e))}static fromName(e){return new B(X.fromString(e).popFirst(5))}static empty(){return new B(X.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&X.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return X.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new B(new X(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function Co(r){return r.fields.find(e=>e.kind===2)}function en(r){return r.fields.filter(e=>e.kind!==2)}function T_(r,e){let t=Q(r.collectionGroup,e.collectionGroup);if(t!==0)return t;for(let n=0;n<Math.min(r.fields.length,e.fields.length);++n)if(t=E_(r.fields[n],e.fields[n]),t!==0)return t;return Q(r.fields.length,e.fields.length)}jn.UNKNOWN_ID=-1;class cn{constructor(e,t){this.fieldPath=e,this.kind=t}}function E_(r,e){const t=de.comparator(r.fieldPath,e.fieldPath);return t!==0?t:Q(r.kind,e.kind)}class zn{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new zn(0,We.min())}}function bh(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=K.fromTimestamp(n===1e9?new pe(t+1,0):new pe(t,n));return new We(s,B.empty(),e)}function Rh(r){return new We(r.readTime,r.key,-1)}class We{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new We(K.min(),B.empty(),-1)}static max(){return new We(K.max(),B.empty(),-1)}}function ia(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=B.comparator(r.documentKey,e.documentKey),t!==0?t:Q(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sh="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Ph{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jt(r){if(r.code!==S.FAILED_PRECONDITION||r.message!==Sh)throw r;k("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&z(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new A((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof A?t:A.resolve(t)}catch(t){return A.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):A.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):A.reject(t)}static resolve(e){return new A((t,n)=>{t(e)})}static reject(e){return new A((t,n)=>{n(e)})}static waitFor(e){return new A((t,n)=>{let s=0,i=0,o=!1;e.forEach(u=>{++s,u.next(()=>{++i,o&&i===s&&t()},c=>n(c))}),o=!0,i===s&&t()})}static or(e){let t=A.resolve(!1);for(const n of e)t=t.next(s=>s?A.resolve(s):n());return t}static forEach(e,t){const n=[];return e.forEach((s,i)=>{n.push(t.call(this,s,i))}),this.waitFor(n)}static mapArray(e,t){return new A((n,s)=>{const i=e.length,o=new Array(i);let u=0;for(let c=0;c<i;c++){const h=c;t(e[h]).next(f=>{o[h]=f,++u,u===i&&n(o)},f=>s(f))}})}static doWhile(e,t){return new A((n,s)=>{const i=()=>{e()===!0?t().next(()=>{i()},s):n()};i()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gi{constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.V=new Pe,this.transaction.oncomplete=()=>{this.V.resolve()},this.transaction.onabort=()=>{t.error?this.V.reject(new Fr(e,t.error)):this.V.resolve()},this.transaction.onerror=n=>{const s=oa(n.target.error);this.V.reject(new Fr(e,s))}}static open(e,t,n,s){try{return new gi(t,e.transaction(s,n))}catch(i){throw new Fr(t,i)}}get m(){return this.V.promise}abort(e){e&&this.V.reject(e),this.aborted||(k("SimpleDb","Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}g(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new v_(t)}}class et{constructor(e,t,n){this.name=e,this.version=t,this.p=n,et.S(Un())===12.2&&Te("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(e){return k("SimpleDb","Removing database:",e),tn(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!Jo())return!1;if(et.v())return!0;const e=Un(),t=et.S(e),n=0<t&&t<10,s=Vh(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static v(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.C)==="YES"}static F(e,t){return e.store(t)}static S(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}async M(e){return this.db||(k("SimpleDb","Opening database:",this.name),this.db=await new Promise((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new Fr(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new N(S.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new N(S.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new Fr(e,o))},s.onupgradeneeded=i=>{k("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.p.O(o,s.transaction,i.oldVersion,this.version).next(()=>{k("SimpleDb","Database upgrade to version "+this.version+" complete")})}})),this.N&&(this.db.onversionchange=t=>this.N(t)),this.db}L(e){this.N=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.M(e);const u=gi.open(this.db,e,i?"readonly":"readwrite",n),c=s(u).next(h=>(u.g(),h)).catch(h=>(u.abort(h),A.reject(h))).toPromise();return c.catch(()=>{}),await u.m,c}catch(u){const c=u,h=c.name!=="FirebaseError"&&o<3;if(k("SimpleDb","Transaction failed with error:",c.message,"Retrying:",h),this.close(),!h)return Promise.reject(c)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Vh(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class w_{constructor(e){this.B=e,this.k=!1,this.q=null}get isDone(){return this.k}get K(){return this.q}set cursor(e){this.B=e}done(){this.k=!0}$(e){this.q=e}delete(){return tn(this.B.delete())}}class Fr extends N{constructor(e,t){super(S.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function zt(r){return r.name==="IndexedDbTransactionError"}class v_{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(k("SimpleDb","PUT",this.store.name,e,t),n=this.store.put(t,e)):(k("SimpleDb","PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),tn(n)}add(e){return k("SimpleDb","ADD",this.store.name,e,e),tn(this.store.add(e))}get(e){return tn(this.store.get(e)).next(t=>(t===void 0&&(t=null),k("SimpleDb","GET",this.store.name,e,t),t))}delete(e){return k("SimpleDb","DELETE",this.store.name,e),tn(this.store.delete(e))}count(){return k("SimpleDb","COUNT",this.store.name),tn(this.store.count())}U(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new A((o,u)=>{i.onerror=c=>{u(c.target.error)},i.onsuccess=c=>{o(c.target.result)}})}{const i=this.cursor(n),o=[];return this.W(i,(u,c)=>{o.push(c)}).next(()=>o)}}G(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new A((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}})}j(e,t){k("SimpleDb","DELETE ALL",this.store.name);const n=this.options(e,t);n.H=!1;const s=this.cursor(n);return this.W(s,(i,o,u)=>u.delete())}J(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.W(s,t)}Y(e){const t=this.cursor({});return new A((n,s)=>{t.onerror=i=>{const o=oa(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next(u=>{u?o.continue():n()}):n()}})}W(e,t){const n=[];return new A((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const u=o.target.result;if(!u)return void s();const c=new w_(u),h=t(u.primaryKey,u.value,c);if(h instanceof A){const f=h.catch(m=>(c.done(),A.reject(m)));n.push(f)}c.isDone?s():c.K===null?u.continue():u.continue(c.K)}}).next(()=>A.waitFor(n))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.H?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function tn(r){return new A((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=oa(n.target.error);t(s)}})}let vc=!1;function oa(r){const e=et.S(Un());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new N("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return vc||(vc=!0,setTimeout(()=>{throw n},0)),n}}return r}class A_{constructor(e,t){this.asyncQueue=e,this.Z=t,this.task=null}start(){this.X(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}X(e){k("IndexBackfiller",`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{k("IndexBackfiller",`Documents written: ${await this.Z.ee()}`)}catch(t){zt(t)?k("IndexBackfiller","Ignoring IndexedDB error during index backfill: ",t):await jt(t)}await this.X(6e4)})}}class b_{constructor(e,t){this.localStore=e,this.persistence=t}async ee(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.te(t,e))}te(e,t){const n=new Set;let s=t,i=!0;return A.doWhile(()=>i===!0&&s>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(o=>{if(o!==null&&!n.has(o))return k("IndexBackfiller",`Processing collection: ${o}`),this.ne(e,o,s).next(u=>{s-=u,n.add(o)});i=!1})).next(()=>t-s)}ne(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next(i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next(()=>this.re(s,i)).next(u=>(k("IndexBackfiller",`Updating offset: ${u}`),this.localStore.indexManager.updateCollectionGroup(e,t,u))).next(()=>o.size)}))}re(e,t){let n=e;return t.changes.forEach((s,i)=>{const o=Rh(i);ia(o,n)>0&&(n=o)}),new We(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ie(n),this.se=n=>t.writeSequenceNumber(n))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}je.oe=-1;function es(r){return r==null}function Gr(r){return r===0&&1/r==-1/0}function Ch(r){return typeof r=="number"&&Number.isInteger(r)&&!Gr(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Le(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=Ac(e)),e=R_(r.get(t),e);return Ac(e)}function R_(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case"":t+="";break;default:t+=i}}return t}function Ac(r){return r+""}function Xe(r){const e=r.length;if(G(e>=2),e===2)return G(r.charAt(0)===""&&r.charAt(1)===""),X.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf("",i);switch((o<0||o>t)&&z(),r.charAt(o+1)){case"":const u=r.substring(i,o);let c;s.length===0?c=u:(s+=u,c=s,s=""),n.push(c);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:z()}i=o+2}return new X(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bc=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Us(r,e){return[r,Le(e)]}function Dh(r,e,t){return[r,Le(e),t]}const S_={},P_=["prefixPath","collectionGroup","readTime","documentId"],V_=["prefixPath","collectionGroup","documentId"],C_=["collectionGroup","readTime","prefixPath","documentId"],D_=["canonicalId","targetId"],x_=["targetId","path"],k_=["path","targetId"],N_=["collectionId","parent"],O_=["indexId","uid"],M_=["uid","sequenceNumber"],F_=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],L_=["indexId","uid","orderedDocumentKey"],B_=["userId","collectionPath","documentId"],U_=["userId","collectionPath","largestBatchId"],q_=["userId","collectionGroup","largestBatchId"],xh=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],j_=[...xh,"documentOverlays"],kh=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],Nh=kh,aa=[...Nh,"indexConfiguration","indexState","indexEntries"],z_=aa,G_=[...aa,"globals"];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Do extends Ph{constructor(e,t){super(),this._e=e,this.currentSequenceNumber=t}}function be(r,e){const t=F(r);return et.F(t._e,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rc(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Gt(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function Oh(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function Mh(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(e,t){this.comparator=e,this.root=t||Ce.EMPTY}insert(e,t){return new ue(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ce.BLACK,null,null))}remove(e){return new ue(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ce.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ks(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ks(this.root,e,this.comparator,!1)}getReverseIterator(){return new ks(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ks(this.root,e,this.comparator,!0)}}class ks{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ce{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??Ce.RED,this.left=s??Ce.EMPTY,this.right=i??Ce.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new Ce(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Ce.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Ce.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ce.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ce.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw z();const e=this.left.check();if(e!==this.right.check())throw z();return e+(this.isRed()?0:1)}}Ce.EMPTY=null,Ce.RED=!0,Ce.BLACK=!1;Ce.EMPTY=new class{constructor(){this.size=0}get key(){throw z()}get value(){throw z()}get color(){throw z()}get left(){throw z()}get right(){throw z()}copy(e,t,n,s,i){return this}insert(e,t,n){return new Ce(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e){this.comparator=e,this.data=new ue(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Sc(this.data.getIterator())}getIteratorFrom(e){return new Sc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(n=>{t=t.add(n)}),t}isEqual(e){if(!(e instanceof se)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new se(this.comparator);return t.data=e,t}}class Sc{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Cn(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e){this.fields=e,e.sort(de.comparator)}static empty(){return new ze([])}unionWith(e){let t=new se(de.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new ze(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return qn(this.fields,e.fields,(t,n)=>t.isEqual(n))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cE(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Fh("Invalid base64 string: "+i):i}}(e);return new ye(t)}static fromUint8Array(e){const t=function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i}(e);return new ye(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ye.EMPTY_BYTE_STRING=new ye("");const $_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function pt(r){if(G(!!r),typeof r=="string"){let e=0;const t=$_.exec(r);if(G(!!t),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:he(r.seconds),nanos:he(r.nanos)}}function he(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function gt(r){return typeof r=="string"?ye.fromBase64String(r):ye.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _i(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function yi(r){const e=r.mapValue.fields.__previous_value__;return _i(e)?yi(e):e}function $r(r){const e=pt(r.mapValue.fields.__local_write_time__.timestampValue);return new pe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K_{constructor(e,t,n,s,i,o,u,c,h){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=u,this.longPollingOptions=c,this.useFetchStreams=h}}class dn{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new dn("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof dn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vt={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},qs={nullValue:"NULL_VALUE"};function Ot(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?_i(r)?4:Lh(r)?9007199254740991:Ii(r)?10:11:z()}function rt(r,e){if(r===e)return!0;const t=Ot(r);if(t!==Ot(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return $r(r).isEqual($r(e));case 3:return function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=pt(s.timestampValue),u=pt(i.timestampValue);return o.seconds===u.seconds&&o.nanos===u.nanos}(r,e);case 5:return r.stringValue===e.stringValue;case 6:return function(s,i){return gt(s.bytesValue).isEqual(gt(i.bytesValue))}(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return function(s,i){return he(s.geoPointValue.latitude)===he(i.geoPointValue.latitude)&&he(s.geoPointValue.longitude)===he(i.geoPointValue.longitude)}(r,e);case 2:return function(s,i){if("integerValue"in s&&"integerValue"in i)return he(s.integerValue)===he(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=he(s.doubleValue),u=he(i.doubleValue);return o===u?Gr(o)===Gr(u):isNaN(o)&&isNaN(u)}return!1}(r,e);case 9:return qn(r.arrayValue.values||[],e.arrayValue.values||[],rt);case 10:case 11:return function(s,i){const o=s.mapValue.fields||{},u=i.mapValue.fields||{};if(Rc(o)!==Rc(u))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(u[c]===void 0||!rt(o[c],u[c])))return!1;return!0}(r,e);default:return z()}}function Kr(r,e){return(r.values||[]).find(t=>rt(t,e))!==void 0}function Mt(r,e){if(r===e)return 0;const t=Ot(r),n=Ot(e);if(t!==n)return Q(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return Q(r.booleanValue,e.booleanValue);case 2:return function(i,o){const u=he(i.integerValue||i.doubleValue),c=he(o.integerValue||o.doubleValue);return u<c?-1:u>c?1:u===c?0:isNaN(u)?isNaN(c)?0:-1:1}(r,e);case 3:return Pc(r.timestampValue,e.timestampValue);case 4:return Pc($r(r),$r(e));case 5:return Q(r.stringValue,e.stringValue);case 6:return function(i,o){const u=gt(i),c=gt(o);return u.compareTo(c)}(r.bytesValue,e.bytesValue);case 7:return function(i,o){const u=i.split("/"),c=o.split("/");for(let h=0;h<u.length&&h<c.length;h++){const f=Q(u[h],c[h]);if(f!==0)return f}return Q(u.length,c.length)}(r.referenceValue,e.referenceValue);case 8:return function(i,o){const u=Q(he(i.latitude),he(o.latitude));return u!==0?u:Q(he(i.longitude),he(o.longitude))}(r.geoPointValue,e.geoPointValue);case 9:return Vc(r.arrayValue,e.arrayValue);case 10:return function(i,o){var u,c,h,f;const m=i.fields||{},g=o.fields||{},E=(u=m.value)===null||u===void 0?void 0:u.arrayValue,V=(c=g.value)===null||c===void 0?void 0:c.arrayValue,C=Q(((h=E==null?void 0:E.values)===null||h===void 0?void 0:h.length)||0,((f=V==null?void 0:V.values)===null||f===void 0?void 0:f.length)||0);return C!==0?C:Vc(E,V)}(r.mapValue,e.mapValue);case 11:return function(i,o){if(i===Vt.mapValue&&o===Vt.mapValue)return 0;if(i===Vt.mapValue)return 1;if(o===Vt.mapValue)return-1;const u=i.fields||{},c=Object.keys(u),h=o.fields||{},f=Object.keys(h);c.sort(),f.sort();for(let m=0;m<c.length&&m<f.length;++m){const g=Q(c[m],f[m]);if(g!==0)return g;const E=Mt(u[c[m]],h[f[m]]);if(E!==0)return E}return Q(c.length,f.length)}(r.mapValue,e.mapValue);default:throw z()}}function Pc(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return Q(r,e);const t=pt(r),n=pt(e),s=Q(t.seconds,n.seconds);return s!==0?s:Q(t.nanos,n.nanos)}function Vc(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=Mt(t[s],n[s]);if(i)return i}return Q(t.length,n.length)}function Gn(r){return xo(r)}function xo(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?function(t){const n=pt(t);return`time(${n.seconds},${n.nanos})`}(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?function(t){return gt(t).toBase64()}(r.bytesValue):"referenceValue"in r?function(t){return B.fromName(t).toString()}(r.referenceValue):"geoPointValue"in r?function(t){return`geo(${t.latitude},${t.longitude})`}(r.geoPointValue):"arrayValue"in r?function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=xo(i);return n+"]"}(r.arrayValue):"mapValue"in r?function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${xo(t.fields[o])}`;return s+"}"}(r.mapValue):z()}function js(r){switch(Ot(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=yi(r);return e?16+js(e):16;case 5:return 2*r.stringValue.length;case 6:return gt(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return function(n){return(n.values||[]).reduce((s,i)=>s+js(i),0)}(r.arrayValue);case 10:case 11:return function(n){let s=0;return Gt(n.fields,(i,o)=>{s+=i.length+js(o)}),s}(r.mapValue);default:throw z()}}function fn(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function ko(r){return!!r&&"integerValue"in r}function Qr(r){return!!r&&"arrayValue"in r}function Cc(r){return!!r&&"nullValue"in r}function Dc(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function zs(r){return!!r&&"mapValue"in r}function Ii(r){var e,t;return((t=(((e=r==null?void 0:r.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function Lr(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return Gt(r.mapValue.fields,(t,n)=>e.mapValue.fields[t]=Lr(n)),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Lr(r.arrayValue.values[t]);return e}return Object.assign({},r)}function Lh(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}const Bh={mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{}}}}};function Q_(r){return"nullValue"in r?qs:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?fn(dn.empty(),B.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Ii(r)?Bh:{mapValue:{}}:z()}function W_(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?fn(dn.empty(),B.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?Bh:"mapValue"in r?Ii(r)?{mapValue:{}}:Vt:z()}function xc(r,e){const t=Mt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function kc(r,e){const t=Mt(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e){this.value=e}static empty(){return new De({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!zs(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Lr(t)}setAll(e){let t=de.emptyPath(),n={},s=[];e.forEach((o,u)=>{if(!t.isImmediateParentOf(u)){const c=this.getFieldsMap(t);this.applyChanges(c,n,s),n={},s=[],t=u.popLast()}o?n[u.lastSegment()]=Lr(o):s.push(u.lastSegment())});const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());zs(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return rt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];zs(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){Gt(t,(s,i)=>e[s]=i);for(const s of n)delete e[s]}clone(){return new De(Lr(this.value))}}function Uh(r){const e=[];return Gt(r.fields,(t,n)=>{const s=new de([t]);if(zs(n)){const i=Uh(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)}),new ze(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(e,t,n,s,i,o,u){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=u}static newInvalidDocument(e){return new le(e,0,K.min(),K.min(),K.min(),De.empty(),0)}static newFoundDocument(e,t,n,s){return new le(e,1,t,K.min(),n,s,0)}static newNoDocument(e,t){return new le(e,2,t,K.min(),K.min(),De.empty(),0)}static newUnknownDocument(e,t){return new le(e,3,t,K.min(),K.min(),De.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(K.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=De.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=De.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=K.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof le&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new le(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e,t){this.position=e,this.inclusive=t}}function Nc(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=B.comparator(B.fromName(o.referenceValue),t.key):n=Mt(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function Oc(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!rt(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wr{constructor(e,t="asc"){this.field=e,this.dir=t}}function H_(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qh{}class Z extends qh{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new J_(e,t,n):t==="array-contains"?new Z_(e,n):t==="in"?new Qh(e,n):t==="not-in"?new ey(e,n):t==="array-contains-any"?new ty(e,n):new Z(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Y_(e,n):new X_(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(Mt(t,this.value)):t!==null&&Ot(this.value)===Ot(t)&&this.matchesComparison(Mt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return z()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class re extends qh{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new re(e,t)}matches(e){return $n(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function $n(r){return r.op==="and"}function No(r){return r.op==="or"}function ua(r){return jh(r)&&$n(r)}function jh(r){for(const e of r.filters)if(e instanceof re)return!1;return!0}function Oo(r){if(r instanceof Z)return r.field.canonicalString()+r.op.toString()+Gn(r.value);if(ua(r))return r.filters.map(e=>Oo(e)).join(",");{const e=r.filters.map(t=>Oo(t)).join(",");return`${r.op}(${e})`}}function zh(r,e){return r instanceof Z?function(n,s){return s instanceof Z&&n.op===s.op&&n.field.isEqual(s.field)&&rt(n.value,s.value)}(r,e):r instanceof re?function(n,s){return s instanceof re&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce((i,o,u)=>i&&zh(o,s.filters[u]),!0):!1}(r,e):void z()}function Gh(r,e){const t=r.filters.concat(e);return re.create(t,r.op)}function $h(r){return r instanceof Z?function(t){return`${t.field.canonicalString()} ${t.op} ${Gn(t.value)}`}(r):r instanceof re?function(t){return t.op.toString()+" {"+t.getFilters().map($h).join(" ,")+"}"}(r):"Filter"}class J_ extends Z{constructor(e,t,n){super(e,t,n),this.key=B.fromName(n.referenceValue)}matches(e){const t=B.comparator(e.key,this.key);return this.matchesComparison(t)}}class Y_ extends Z{constructor(e,t){super(e,"in",t),this.keys=Kh("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class X_ extends Z{constructor(e,t){super(e,"not-in",t),this.keys=Kh("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function Kh(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(n=>B.fromName(n.referenceValue))}class Z_ extends Z{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Qr(t)&&Kr(t.arrayValue,this.value)}}class Qh extends Z{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Kr(this.value.arrayValue,t)}}class ey extends Z{constructor(e,t){super(e,"not-in",t)}matches(e){if(Kr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Kr(this.value.arrayValue,t)}}class ty extends Z{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Qr(t)||!t.arrayValue.values)&&t.arrayValue.values.some(n=>Kr(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ny{constructor(e,t=null,n=[],s=[],i=null,o=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=u,this.ue=null}}function Mo(r,e=null,t=[],n=[],s=null,i=null,o=null){return new ny(r,e,t,n,s,i,o)}function mn(r){const e=F(r);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(n=>Oo(n)).join(","),t+="|ob:",t+=e.orderBy.map(n=>function(i){return i.field.canonicalString()+i.dir}(n)).join(","),es(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(n=>Gn(n)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(n=>Gn(n)).join(",")),e.ue=t}return e.ue}function ts(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!H_(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!zh(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!Oc(r.startAt,e.startAt)&&Oc(r.endAt,e.endAt)}function Zs(r){return B.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function ei(r,e){return r.filters.filter(t=>t instanceof Z&&t.field.isEqual(e))}function Mc(r,e,t){let n=qs,s=!0;for(const i of ei(r,e)){let o=qs,u=!0;switch(i.op){case"<":case"<=":o=Q_(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,u=!1;break;case"!=":case"not-in":o=qs}xc({value:n,inclusive:s},{value:o,inclusive:u})<0&&(n=o,s=u)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];xc({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function Fc(r,e,t){let n=Vt,s=!0;for(const i of ei(r,e)){let o=Vt,u=!0;switch(i.op){case">=":case">":o=W_(i.value),u=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,u=!1;break;case"!=":case"not-in":o=Vt}kc({value:n,inclusive:s},{value:o,inclusive:u})>0&&(n=o,s=u)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];kc({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(e,t=null,n=[],s=[],i=null,o="F",u=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=u,this.endAt=c,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Wh(r,e,t,n,s,i,o,u){return new _t(r,e,t,n,s,i,o,u)}function sr(r){return new _t(r)}function Lc(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function ca(r){return r.collectionGroup!==null}function Ln(r){const e=F(r);if(e.ce===null){e.ce=[];const t=new Set;for(const i of e.explicitOrderBy)e.ce.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let u=new se(de.comparator);return o.filters.forEach(c=>{c.getFlattenedFilters().forEach(h=>{h.isInequality()&&(u=u.add(h.field))})}),u})(e).forEach(i=>{t.has(i.canonicalString())||i.isKeyField()||e.ce.push(new Wr(i,n))}),t.has(de.keyField().canonicalString())||e.ce.push(new Wr(de.keyField(),n))}return e.ce}function Be(r){const e=F(r);return e.le||(e.le=Jh(e,Ln(r))),e.le}function Hh(r){const e=F(r);return e.he||(e.he=Jh(e,r.explicitOrderBy)),e.he}function Jh(r,e){if(r.limitType==="F")return Mo(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map(s=>{const i=s.dir==="desc"?"asc":"desc";return new Wr(s.field,i)});const t=r.endAt?new Ft(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Ft(r.startAt.position,r.startAt.inclusive):null;return Mo(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Fo(r,e){const t=r.filters.concat([e]);return new _t(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function ti(r,e,t){return new _t(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function ns(r,e){return ts(Be(r),Be(e))&&r.limitType===e.limitType}function Yh(r){return`${mn(Be(r))}|lt:${r.limitType}`}function On(r){return`Query(target=${function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(s=>$h(s)).join(", ")}]`),es(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(s=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(s)).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map(s=>Gn(s)).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map(s=>Gn(s)).join(",")),`Target(${n})`}(Be(r))}; limitType=${r.limitType})`}function rs(r,e){return e.isFoundDocument()&&function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):B.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)}(r,e)&&function(n,s){for(const i of Ln(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0}(r,e)&&function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0}(r,e)&&function(n,s){return!(n.startAt&&!function(o,u,c){const h=Nc(o,u,c);return o.inclusive?h<=0:h<0}(n.startAt,Ln(n),s)||n.endAt&&!function(o,u,c){const h=Nc(o,u,c);return o.inclusive?h>=0:h>0}(n.endAt,Ln(n),s))}(r,e)}function Xh(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Zh(r){return(e,t)=>{let n=!1;for(const s of Ln(r)){const i=ry(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function ry(r,e,t){const n=r.field.isKeyField()?B.comparator(e.key,t.key):function(i,o,u){const c=o.data.field(i),h=u.data.field(i);return c!==null&&h!==null?Mt(c,h):z()}(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return z()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Gt(this.inner,(t,n)=>{for(const[s,i]of n)e(s,i)})}isEmpty(){return Mh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sy=new ue(B.comparator);function Ge(){return sy}const ed=new ue(B.comparator);function kr(...r){let e=ed;for(const t of r)e=e.insert(t.key,t);return e}function td(r){let e=ed;return r.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function Ze(){return Br()}function nd(){return Br()}function Br(){return new yt(r=>r.toString(),(r,e)=>r.isEqual(e))}const iy=new ue(B.comparator),oy=new se(B.comparator);function H(...r){let e=oy;for(const t of r)e=e.add(t);return e}const ay=new se(Q);function la(){return ay}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ha(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Gr(e)?"-0":e}}function rd(r){return{integerValue:""+r}}function sd(r,e){return Ch(e)?rd(e):ha(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ti{constructor(){this._=void 0}}function uy(r,e,t){return r instanceof Kn?function(s,i){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&_i(i)&&(i=yi(i)),i&&(o.fields.__previous_value__=i),{mapValue:o}}(t,e):r instanceof pn?od(r,e):r instanceof gn?ad(r,e):function(s,i){const o=id(s,i),u=Bc(o)+Bc(s.Pe);return ko(o)&&ko(s.Pe)?rd(u):ha(s.serializer,u)}(r,e)}function cy(r,e,t){return r instanceof pn?od(r,e):r instanceof gn?ad(r,e):t}function id(r,e){return r instanceof Qn?function(n){return ko(n)||function(i){return!!i&&"doubleValue"in i}(n)}(e)?e:{integerValue:0}:null}class Kn extends Ti{}class pn extends Ti{constructor(e){super(),this.elements=e}}function od(r,e){const t=ud(e);for(const n of r.elements)t.some(s=>rt(s,n))||t.push(n);return{arrayValue:{values:t}}}class gn extends Ti{constructor(e){super(),this.elements=e}}function ad(r,e){let t=ud(e);for(const n of r.elements)t=t.filter(s=>!rt(s,n));return{arrayValue:{values:t}}}class Qn extends Ti{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Bc(r){return he(r.integerValue||r.doubleValue)}function ud(r){return Qr(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,t){this.field=e,this.transform=t}}function ly(r,e){return r.field.isEqual(e.field)&&function(n,s){return n instanceof pn&&s instanceof pn||n instanceof gn&&s instanceof gn?qn(n.elements,s.elements,rt):n instanceof Qn&&s instanceof Qn?rt(n.Pe,s.Pe):n instanceof Kn&&s instanceof Kn}(r.transform,e.transform)}class hy{constructor(e,t){this.version=e,this.transformResults=t}}class fe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new fe}static exists(e){return new fe(void 0,e)}static updateTime(e){return new fe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Gs(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Ei{}function cd(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new or(r.key,fe.none()):new ir(r.key,r.data,fe.none());{const t=r.data,n=De.empty();let s=new se(de.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new It(r.key,n,new ze(s.toArray()),fe.none())}}function dy(r,e,t){r instanceof ir?function(s,i,o){const u=s.value.clone(),c=qc(s.fieldTransforms,i,o.transformResults);u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(r,e,t):r instanceof It?function(s,i,o){if(!Gs(s.precondition,i))return void i.convertToUnknownDocument(o.version);const u=qc(s.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(ld(s)),c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()}(r,e,t):function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,t)}function Ur(r,e,t,n){return r instanceof ir?function(i,o,u,c){if(!Gs(i.precondition,o))return u;const h=i.value.clone(),f=jc(i.fieldTransforms,c,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(r,e,t,n):r instanceof It?function(i,o,u,c){if(!Gs(i.precondition,o))return u;const h=jc(i.fieldTransforms,c,o),f=o.data;return f.setAll(ld(i)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),u===null?null:u.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(m=>m.field))}(r,e,t,n):function(i,o,u){return Gs(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):u}(r,e,t)}function fy(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=id(n.transform,s||null);i!=null&&(t===null&&(t=De.empty()),t.set(n.field,i))}return t||null}function Uc(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&qn(n,s,(i,o)=>ly(i,o))}(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class ir extends Ei{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class It extends Ei{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function ld(r){const e=new Map;return r.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}}),e}function qc(r,e,t){const n=new Map;G(r.length===t.length);for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,u=e.data.field(i.field);n.set(i.field,cy(o,u,t[s]))}return n}function jc(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,uy(i,o,e))}return n}class or extends Ei{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class da extends Ei{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fa{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&dy(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Ur(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Ur(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=nd();return this.mutations.forEach(s=>{const i=e.get(s.key),o=i.overlayedDocument;let u=this.applyToLocalView(o,i.mutatedFields);u=t.has(s.key)?null:u;const c=cd(o,u);c!==null&&n.set(s.key,c),o.isValidDocument()||o.convertToNoDocument(K.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),H())}isEqual(e){return this.batchId===e.batchId&&qn(this.mutations,e.mutations,(t,n)=>Uc(t,n))&&qn(this.baseMutations,e.baseMutations,(t,n)=>Uc(t,n))}}class ma{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){G(e.mutations.length===n.length);let s=function(){return iy}();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new ma(e,t,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pa{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class my{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ve,ee;function dd(r){switch(r){default:return z();case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0}}function fd(r){if(r===void 0)return Te("GRPC error has no .code"),S.UNKNOWN;switch(r){case ve.OK:return S.OK;case ve.CANCELLED:return S.CANCELLED;case ve.UNKNOWN:return S.UNKNOWN;case ve.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case ve.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case ve.INTERNAL:return S.INTERNAL;case ve.UNAVAILABLE:return S.UNAVAILABLE;case ve.UNAUTHENTICATED:return S.UNAUTHENTICATED;case ve.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case ve.NOT_FOUND:return S.NOT_FOUND;case ve.ALREADY_EXISTS:return S.ALREADY_EXISTS;case ve.PERMISSION_DENIED:return S.PERMISSION_DENIED;case ve.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case ve.ABORTED:return S.ABORTED;case ve.OUT_OF_RANGE:return S.OUT_OF_RANGE;case ve.UNIMPLEMENTED:return S.UNIMPLEMENTED;case ve.DATA_LOSS:return S.DATA_LOSS;default:return z()}}(ee=ve||(ve={}))[ee.OK=0]="OK",ee[ee.CANCELLED=1]="CANCELLED",ee[ee.UNKNOWN=2]="UNKNOWN",ee[ee.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ee[ee.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ee[ee.NOT_FOUND=5]="NOT_FOUND",ee[ee.ALREADY_EXISTS=6]="ALREADY_EXISTS",ee[ee.PERMISSION_DENIED=7]="PERMISSION_DENIED",ee[ee.UNAUTHENTICATED=16]="UNAUTHENTICATED",ee[ee.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ee[ee.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ee[ee.ABORTED=10]="ABORTED",ee[ee.OUT_OF_RANGE=11]="OUT_OF_RANGE",ee[ee.UNIMPLEMENTED=12]="UNIMPLEMENTED",ee[ee.INTERNAL=13]="INTERNAL",ee[ee.UNAVAILABLE=14]="UNAVAILABLE",ee[ee.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ni=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function md(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const py=new un([4294967295,4294967295],0);function zc(r){const e=md().encode(r),t=new ph;return t.update(e),new Uint8Array(t.digest())}function Gc(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new un([t,n],0),new un([s,i],0)]}class ga{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Nr(`Invalid padding: ${t}`);if(n<0)throw new Nr(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Nr(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Nr(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=un.fromNumber(this.Ie)}Ee(e,t,n){let s=e.add(t.multiply(un.fromNumber(n)));return s.compare(py)===1&&(s=new un([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=zc(e),[n,s]=Gc(t);for(let i=0;i<this.hashCount;i++){const o=this.Ee(n,s,i);if(!this.de(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new ga(i,s,t);return n.forEach(u=>o.insert(u)),o}insert(e){if(this.Ie===0)return;const t=zc(e),[n,s]=Gc(t);for(let i=0;i<this.hashCount;i++){const o=this.Ee(n,s,i);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Nr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(e,t,n,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,os.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new is(K.min(),s,new ue(Q),Ge(),H())}}class os{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new os(n,t,H(),H(),H())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s{constructor(e,t,n,s){this.Re=e,this.removedTargetIds=t,this.key=n,this.Ve=s}}class pd{constructor(e,t){this.targetId=e,this.me=t}}class gd{constructor(e,t,n=ye.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class $c{constructor(){this.fe=0,this.ge=Qc(),this.pe=ye.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=H(),t=H(),n=H();return this.ge.forEach((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:z()}}),new os(this.pe,this.ye,e,t,n)}Ce(){this.we=!1,this.ge=Qc()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,G(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class gy{constructor(e){this.Le=e,this.Be=new Map,this.ke=Ge(),this.qe=Kc(),this.Qe=new ue(Q)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{const n=this.Ge(t);switch(e.state){case 0:this.ze(t)&&n.De(e.resumeToken);break;case 1:n.Oe(),n.Se||n.Ce(),n.De(e.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(n.Ne(),n.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),n.De(e.resumeToken));break;default:z()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((n,s)=>{this.ze(s)&&t(s)})}He(e){const t=e.targetId,n=e.me.count,s=this.Je(t);if(s){const i=s.target;if(Zs(i))if(n===0){const o=new B(i.path);this.Ue(t,o,le.newNoDocument(o,K.min()))}else G(n===1);else{const o=this.Ye(t);if(o!==n){const u=this.Ze(e),c=u?this.Xe(u,e,o):1;if(c!==0){this.je(t);const h=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}ni==null||ni.et(function(f,m,g,E,V){var C,D,M,U,O,q;const $={localCacheCount:f,existenceFilterCount:m.count,databaseId:g.database,projectId:g.projectId},x=m.unchangedNames;return x&&($.bloomFilter={applied:V===0,hashCount:(C=x==null?void 0:x.hashCount)!==null&&C!==void 0?C:0,bitmapLength:(U=(M=(D=x==null?void 0:x.bits)===null||D===void 0?void 0:D.bitmap)===null||M===void 0?void 0:M.length)!==null&&U!==void 0?U:0,padding:(q=(O=x==null?void 0:x.bits)===null||O===void 0?void 0:O.padding)!==null&&q!==void 0?q:0,mightContain:y=>{var _;return(_=E==null?void 0:E.mightContain(y))!==null&&_!==void 0&&_}}),$}(o,e.me,this.Le.tt(),u,c))}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,u;try{o=gt(n).toUint8Array()}catch(c){if(c instanceof Fh)return Je("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{u=new ga(o,s,i)}catch(c){return Je(c instanceof Nr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return u.Ie===0?null:u}Xe(e,t,n){return t.me.count===n-this.nt(e,t.targetId)?0:2}nt(e,t){const n=this.Le.getRemoteKeysForTarget(t);let s=0;return n.forEach(i=>{const o=this.Le.tt(),u=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(u)||(this.Ue(t,i,null),s++)}),s}rt(e){const t=new Map;this.Be.forEach((i,o)=>{const u=this.Je(o);if(u){if(i.current&&Zs(u.target)){const c=new B(u.target.path);this.ke.get(c)!==null||this.it(o,c)||this.Ue(o,c,le.newNoDocument(c,e))}i.be&&(t.set(o,i.ve()),i.Ce())}});let n=H();this.qe.forEach((i,o)=>{let u=!0;o.forEachWhile(c=>{const h=this.Je(c);return!h||h.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)}),u&&(n=n.add(i))}),this.ke.forEach((i,o)=>o.setReadTime(e));const s=new is(e,t,this.Qe,this.ke,n);return this.ke=Ge(),this.qe=Kc(),this.Qe=new ue(Q),s}$e(e,t){if(!this.ze(e))return;const n=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,n),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,n){if(!this.ze(e))return;const s=this.Ge(e);this.it(e,t)?s.Fe(t,1):s.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),n&&(this.ke=this.ke.insert(t,n))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new $c,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new se(Q),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||k("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new $c),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Kc(){return new ue(B.comparator)}function Qc(){return new ue(B.comparator)}const _y={asc:"ASCENDING",desc:"DESCENDING"},yy={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Iy={and:"AND",or:"OR"};class Ty{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Lo(r,e){return r.useProto3Json||es(e)?e:{value:e}}function Wn(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function _d(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function Ey(r,e){return Wn(r,e.toTimestamp())}function Ee(r){return G(!!r),K.fromTimestamp(function(t){const n=pt(t);return new pe(n.seconds,n.nanos)}(r))}function _a(r,e){return Bo(r,e).canonicalString()}function Bo(r,e){const t=function(s){return new X(["projects",s.projectId,"databases",s.database])}(r).child("documents");return e===void 0?t:t.child(e)}function yd(r){const e=X.fromString(r);return G(Pd(e)),e}function Hr(r,e){return _a(r.databaseId,e.path)}function tt(r,e){const t=yd(e);if(t.get(1)!==r.databaseId.projectId)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new B(Ed(t))}function Id(r,e){return _a(r.databaseId,e)}function Td(r){const e=yd(r);return e.length===4?X.emptyPath():Ed(e)}function Uo(r){return new X(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function Ed(r){return G(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}function Wc(r,e,t){return{name:Hr(r,e),fields:t.value.mapValue.fields}}function wd(r,e,t){const n=tt(r,e.name),s=Ee(e.updateTime),i=e.createTime?Ee(e.createTime):K.min(),o=new De({mapValue:{fields:e.fields}}),u=le.newFoundDocument(n,s,i,o);return t&&u.setHasCommittedMutations(),t?u.setHasCommittedMutations():u}function wy(r,e){return"found"in e?function(n,s){G(!!s.found),s.found.name,s.found.updateTime;const i=tt(n,s.found.name),o=Ee(s.found.updateTime),u=s.found.createTime?Ee(s.found.createTime):K.min(),c=new De({mapValue:{fields:s.found.fields}});return le.newFoundDocument(i,o,u,c)}(r,e):"missing"in e?function(n,s){G(!!s.missing),G(!!s.readTime);const i=tt(n,s.missing),o=Ee(s.readTime);return le.newNoDocument(i,o)}(r,e):z()}function vy(r,e){let t;if("targetChange"in e){e.targetChange;const n=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:z()}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=function(h,f){return h.useProto3Json?(G(f===void 0||typeof f=="string"),ye.fromBase64String(f||"")):(G(f===void 0||f instanceof Buffer||f instanceof Uint8Array),ye.fromUint8Array(f||new Uint8Array))}(r,e.targetChange.resumeToken),o=e.targetChange.cause,u=o&&function(h){const f=h.code===void 0?S.UNKNOWN:fd(h.code);return new N(f,h.message||"")}(o);t=new gd(n,s,i,u||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=tt(r,n.document.name),i=Ee(n.document.updateTime),o=n.document.createTime?Ee(n.document.createTime):K.min(),u=new De({mapValue:{fields:n.document.fields}}),c=le.newFoundDocument(s,i,o,u),h=n.targetIds||[],f=n.removedTargetIds||[];t=new $s(h,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=tt(r,n.document),i=n.readTime?Ee(n.readTime):K.min(),o=le.newNoDocument(s,i),u=n.removedTargetIds||[];t=new $s([],u,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=tt(r,n.document),i=n.removedTargetIds||[];t=new $s([],i,s,null)}else{if(!("filter"in e))return z();{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new my(s,i),u=n.targetId;t=new pd(u,o)}}return t}function Jr(r,e){let t;if(e instanceof ir)t={update:Wc(r,e.key,e.value)};else if(e instanceof or)t={delete:Hr(r,e.key)};else if(e instanceof It)t={update:Wc(r,e.key,e.data),updateMask:Vy(e.fieldMask)};else{if(!(e instanceof da))return z();t={verify:Hr(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(n=>function(i,o){const u=o.transform;if(u instanceof Kn)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof pn)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof gn)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof Qn)return{fieldPath:o.field.canonicalString(),increment:u.Pe};throw z()}(0,n))),e.precondition.isNone||(t.currentDocument=function(s,i){return i.updateTime!==void 0?{updateTime:Ey(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:z()}(r,e.precondition)),t}function qo(r,e){const t=e.currentDocument?function(i){return i.updateTime!==void 0?fe.updateTime(Ee(i.updateTime)):i.exists!==void 0?fe.exists(i.exists):fe.none()}(e.currentDocument):fe.none(),n=e.updateTransforms?e.updateTransforms.map(s=>function(o,u){let c=null;if("setToServerValue"in u)G(u.setToServerValue==="REQUEST_TIME"),c=new Kn;else if("appendMissingElements"in u){const f=u.appendMissingElements.values||[];c=new pn(f)}else if("removeAllFromArray"in u){const f=u.removeAllFromArray.values||[];c=new gn(f)}else"increment"in u?c=new Qn(o,u.increment):z();const h=de.fromServerFormat(u.fieldPath);return new ss(h,c)}(r,s)):[];if(e.update){e.update.name;const s=tt(r,e.update.name),i=new De({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=function(c){const h=c.fieldPaths||[];return new ze(h.map(f=>de.fromServerFormat(f)))}(e.updateMask);return new It(s,i,o,t,n)}return new ir(s,i,t,n)}if(e.delete){const s=tt(r,e.delete);return new or(s,t)}if(e.verify){const s=tt(r,e.verify);return new da(s,t)}return z()}function Ay(r,e){return r&&r.length>0?(G(e!==void 0),r.map(t=>function(s,i){let o=s.updateTime?Ee(s.updateTime):Ee(i);return o.isEqual(K.min())&&(o=Ee(i)),new hy(o,s.transformResults||[])}(t,e))):[]}function vd(r,e){return{documents:[Id(r,e.path)]}}function wi(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Id(r,s);const i=function(h){if(h.length!==0)return Sd(re.create(h,"and"))}(e.filters);i&&(t.structuredQuery.where=i);const o=function(h){if(h.length!==0)return h.map(f=>function(g){return{field:Rt(g.field),direction:Ry(g.dir)}}(f))}(e.orderBy);o&&(t.structuredQuery.orderBy=o);const u=Lo(r,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{_t:t,parent:s}}function Ad(r,e,t,n){const{_t:s,parent:i}=wi(r,e),o={},u=[];let c=0;return t.forEach(h=>{const f=n?h.alias:"aggregate_"+c++;o[f]=h.alias,h.aggregateType==="count"?u.push({alias:f,count:{}}):h.aggregateType==="avg"?u.push({alias:f,avg:{field:Rt(h.fieldPath)}}):h.aggregateType==="sum"&&u.push({alias:f,sum:{field:Rt(h.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:u,structuredQuery:s.structuredQuery},parent:s.parent},ut:o,parent:i}}function bd(r){let e=Td(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){G(n===1);const f=t.from[0];f.allDescendants?s=f.collectionId:e=e.child(f.collectionId)}let i=[];t.where&&(i=function(m){const g=Rd(m);return g instanceof re&&ua(g)?g.getFilters():[g]}(t.where));let o=[];t.orderBy&&(o=function(m){return m.map(g=>function(V){return new Wr(Mn(V.field),function(D){switch(D){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(V.direction))}(g))}(t.orderBy));let u=null;t.limit&&(u=function(m){let g;return g=typeof m=="object"?m.value:m,es(g)?null:g}(t.limit));let c=null;t.startAt&&(c=function(m){const g=!!m.before,E=m.values||[];return new Ft(E,g)}(t.startAt));let h=null;return t.endAt&&(h=function(m){const g=!m.before,E=m.values||[];return new Ft(E,g)}(t.endAt)),Wh(e,s,o,i,u,"F",c,h)}function by(r,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return z()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Rd(r){return r.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Mn(t.unaryFilter.field);return Z.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Mn(t.unaryFilter.field);return Z.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Mn(t.unaryFilter.field);return Z.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Mn(t.unaryFilter.field);return Z.create(o,"!=",{nullValue:"NULL_VALUE"});default:return z()}}(r):r.fieldFilter!==void 0?function(t){return Z.create(Mn(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return z()}}(t.fieldFilter.op),t.fieldFilter.value)}(r):r.compositeFilter!==void 0?function(t){return re.create(t.compositeFilter.filters.map(n=>Rd(n)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return z()}}(t.compositeFilter.op))}(r):z()}function Ry(r){return _y[r]}function Sy(r){return yy[r]}function Py(r){return Iy[r]}function Rt(r){return{fieldPath:r.canonicalString()}}function Mn(r){return de.fromServerFormat(r.fieldPath)}function Sd(r){return r instanceof Z?function(t){if(t.op==="=="){if(Dc(t.value))return{unaryFilter:{field:Rt(t.field),op:"IS_NAN"}};if(Cc(t.value))return{unaryFilter:{field:Rt(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Dc(t.value))return{unaryFilter:{field:Rt(t.field),op:"IS_NOT_NAN"}};if(Cc(t.value))return{unaryFilter:{field:Rt(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Rt(t.field),op:Sy(t.op),value:t.value}}}(r):r instanceof re?function(t){const n=t.getFilters().map(s=>Sd(s));return n.length===1?n[0]:{compositeFilter:{op:Py(t.op),filters:n}}}(r):z()}function Vy(r){const e=[];return r.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Pd(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(e,t,n,s,i=K.min(),o=K.min(),u=ye.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=u,this.expectedCount=c}withSequenceNumber(e){return new ht(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new ht(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new ht(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new ht(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vd{constructor(e){this.ct=e}}function Cy(r,e){let t;if(e.document)t=wd(r.ct,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=B.fromSegments(e.noDocument.path),s=yn(e.noDocument.readTime);t=le.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return z();{const n=B.fromSegments(e.unknownDocument.path),s=yn(e.unknownDocument.version);t=le.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime(function(s){const i=new pe(s[0],s[1]);return K.fromTimestamp(i)}(e.readTime)),t}function Hc(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:ri(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=function(i,o){return{name:Hr(i,o.key),fields:o.data.value.mapValue.fields,updateTime:Wn(i,o.version.toTimestamp()),createTime:Wn(i,o.createTime.toTimestamp())}}(r.ct,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:_n(e.version)};else{if(!e.isUnknownDocument())return z();n.unknownDocument={path:t.path.toArray(),version:_n(e.version)}}return n}function ri(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function _n(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function yn(r){const e=new pe(r.seconds,r.nanoseconds);return K.fromTimestamp(e)}function nn(r,e){const t=(e.baseMutations||[]).map(i=>qo(r.ct,i));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const u=e.mutations[i+1];o.updateTransforms=u.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map(i=>qo(r.ct,i)),s=pe.fromMillis(e.localWriteTimeMs);return new fa(e.batchId,s,t,n)}function Or(r){const e=yn(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?yn(r.lastLimboFreeSnapshotVersion):K.min();let n;return n=function(i){return i.documents!==void 0}(r.query)?function(i){return G(i.documents.length===1),Be(sr(Td(i.documents[0])))}(r.query):function(i){return Be(bd(i))}(r.query),new ht(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,ye.fromBase64String(r.resumeToken))}function Cd(r,e){const t=_n(e.snapshotVersion),n=_n(e.lastLimboFreeSnapshotVersion);let s;s=Zs(e.target)?vd(r.ct,e.target):wi(r.ct,e.target)._t;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:mn(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function ya(r){const e=bd({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?ti(e,e.limit,"L"):e}function yo(r,e){return new pa(e.largestBatchId,qo(r.ct,e.overlayMutation))}function Jc(r,e){const t=e.path.lastSegment();return[r,Le(e.path.popLast()),t]}function Yc(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:_n(n.readTime),documentKey:Le(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{getBundleMetadata(e,t){return Xc(e).get(t).next(n=>{if(n)return function(i){return{id:i.bundleId,createTime:yn(i.createTime),version:i.version}}(n)})}saveBundleMetadata(e,t){return Xc(e).put(function(s){return{bundleId:s.id,createTime:_n(Ee(s.createTime)),version:s.version}}(t))}getNamedQuery(e,t){return Zc(e).get(t).next(n=>{if(n)return function(i){return{name:i.name,query:ya(i.bundledQuery),readTime:yn(i.readTime)}}(n)})}saveNamedQuery(e,t){return Zc(e).put(function(s){return{name:s.name,readTime:_n(Ee(s.readTime)),bundledQuery:s.bundledQuery}}(t))}}function Xc(r){return be(r,"bundles")}function Zc(r){return be(r,"namedQueries")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi{constructor(e,t){this.serializer=e,this.userId=t}static lt(e,t){const n=t.uid||"";return new vi(e,n)}getOverlay(e,t){return Sr(e).get(Jc(this.userId,t)).next(n=>n?yo(this.serializer,n):null)}getOverlays(e,t){const n=Ze();return A.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(e,t,n){const s=[];return n.forEach((i,o)=>{const u=new pa(t,o);s.push(this.ht(e,u))}),A.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach(o=>s.add(Le(o.getCollectionPath())));const i=[];return s.forEach(o=>{const u=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(Sr(e).j("collectionPathOverlayIndex",u))}),A.waitFor(i)}getOverlaysForCollection(e,t,n){const s=Ze(),i=Le(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Sr(e).U("collectionPathOverlayIndex",o).next(u=>{for(const c of u){const h=yo(this.serializer,c);s.set(h.getKey(),h)}return s})}getOverlaysForCollectionGroup(e,t,n,s){const i=Ze();let o;const u=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Sr(e).J({index:"collectionGroupOverlayIndex",range:u},(c,h,f)=>{const m=yo(this.serializer,h);i.size()<s||m.largestBatchId===o?(i.set(m.getKey(),m),o=m.largestBatchId):f.done()}).next(()=>i)}ht(e,t){return Sr(e).put(function(s,i,o){const[u,c,h]=Jc(i,o.mutation.key);return{userId:i,collectionPath:c,documentId:h,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:Jr(s.ct,o.mutation)}}(this.serializer,this.userId,t))}}function Sr(r){return be(r,"documentOverlays")}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xy{Pt(e){return be(e,"globals")}getSessionToken(e){return this.Pt(e).get("sessionToken").next(t=>{const n=t==null?void 0:t.value;return n?ye.fromUint8Array(n):ye.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.Pt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(){}It(e,t){this.Tt(e,t),t.Et()}Tt(e,t){if("nullValue"in e)this.dt(t,5);else if("booleanValue"in e)this.dt(t,10),t.At(e.booleanValue?1:0);else if("integerValue"in e)this.dt(t,15),t.At(he(e.integerValue));else if("doubleValue"in e){const n=he(e.doubleValue);isNaN(n)?this.dt(t,13):(this.dt(t,15),Gr(n)?t.At(0):t.At(n))}else if("timestampValue"in e){let n=e.timestampValue;this.dt(t,20),typeof n=="string"&&(n=pt(n)),t.Rt(`${n.seconds||""}`),t.At(n.nanos||0)}else if("stringValue"in e)this.Vt(e.stringValue,t),this.ft(t);else if("bytesValue"in e)this.dt(t,30),t.gt(gt(e.bytesValue)),this.ft(t);else if("referenceValue"in e)this.yt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.dt(t,45),t.At(n.latitude||0),t.At(n.longitude||0)}else"mapValue"in e?Lh(e)?this.dt(t,Number.MAX_SAFE_INTEGER):Ii(e)?this.wt(e.mapValue,t):(this.St(e.mapValue,t),this.ft(t)):"arrayValue"in e?(this.bt(e.arrayValue,t),this.ft(t)):z()}Vt(e,t){this.dt(t,25),this.Dt(e,t)}Dt(e,t){t.Rt(e)}St(e,t){const n=e.fields||{};this.dt(t,55);for(const s of Object.keys(n))this.Vt(s,t),this.Tt(n[s],t)}wt(e,t){var n,s;const i=e.fields||{};this.dt(t,53);const o="value",u=((s=(n=i[o].arrayValue)===null||n===void 0?void 0:n.values)===null||s===void 0?void 0:s.length)||0;this.dt(t,15),t.At(he(u)),this.Vt(o,t),this.Tt(i[o],t)}bt(e,t){const n=e.values||[];this.dt(t,50);for(const s of n)this.Tt(s,t)}yt(e,t){this.dt(t,37),B.fromName(e).path.forEach(n=>{this.dt(t,60),this.Dt(n,t)})}dt(e,t){e.At(t)}ft(e){e.At(2)}}rn.vt=new rn;function ky(r){if(r===0)return 8;let e=0;return!(r>>4)&&(e+=4,r<<=4),!(r>>6)&&(e+=2,r<<=2),!(r>>7)&&(e+=1),e}function el(r){const e=64-function(n){let s=0;for(let i=0;i<8;++i){const o=ky(255&n[i]);if(s+=o,o!==8)break}return s}(r);return Math.ceil(e/8)}class Ny{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ct(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ft(n.value),n=t.next();this.Mt()}xt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Ot(n.value),n=t.next();this.Nt()}Lt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ft(n);else if(n<2048)this.Ft(960|n>>>6),this.Ft(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ft(480|n>>>12),this.Ft(128|63&n>>>6),this.Ft(128|63&n);else{const s=t.codePointAt(0);this.Ft(240|s>>>18),this.Ft(128|63&s>>>12),this.Ft(128|63&s>>>6),this.Ft(128|63&s)}}this.Mt()}Bt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Ot(n);else if(n<2048)this.Ot(960|n>>>6),this.Ot(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Ot(480|n>>>12),this.Ot(128|63&n>>>6),this.Ot(128|63&n);else{const s=t.codePointAt(0);this.Ot(240|s>>>18),this.Ot(128|63&s>>>12),this.Ot(128|63&s>>>6),this.Ot(128|63&s)}}this.Nt()}kt(e){const t=this.qt(e),n=el(t);this.Qt(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}Kt(e){const t=this.qt(e),n=el(t);this.Qt(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}$t(){this.Ut(255),this.Ut(255)}Wt(){this.Gt(255),this.Gt(255)}reset(){this.position=0}seed(e){this.Qt(e.length),this.buffer.set(e,this.position),this.position+=e.length}zt(){return this.buffer.slice(0,this.position)}qt(e){const t=function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)}(e),n=(128&t[0])!=0;t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Ft(e){const t=255&e;t===0?(this.Ut(0),this.Ut(255)):t===255?(this.Ut(255),this.Ut(0)):this.Ut(t)}Ot(e){const t=255&e;t===0?(this.Gt(0),this.Gt(255)):t===255?(this.Gt(255),this.Gt(0)):this.Gt(e)}Mt(){this.Ut(0),this.Ut(1)}Nt(){this.Gt(0),this.Gt(1)}Ut(e){this.Qt(1),this.buffer[this.position++]=e}Gt(e){this.Qt(1),this.buffer[this.position++]=~e}Qt(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class Oy{constructor(e){this.jt=e}gt(e){this.jt.Ct(e)}Rt(e){this.jt.Lt(e)}At(e){this.jt.kt(e)}Et(){this.jt.$t()}}class My{constructor(e){this.jt=e}gt(e){this.jt.xt(e)}Rt(e){this.jt.Bt(e)}At(e){this.jt.Kt(e)}Et(){this.jt.Wt()}}class Pr{constructor(){this.jt=new Ny,this.Ht=new Oy(this.jt),this.Jt=new My(this.jt)}seed(e){this.jt.seed(e)}Yt(e){return e===0?this.Ht:this.Jt}zt(){return this.jt.zt()}reset(){this.jt.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(e,t,n,s){this.indexId=e,this.documentKey=t,this.arrayValue=n,this.directionalValue=s}Zt(){const e=this.directionalValue.length,t=e===0||this.directionalValue[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.directionalValue,0),t!==e?n.set([0],this.directionalValue.length):++n[n.length-1],new sn(this.indexId,this.documentKey,this.arrayValue,n)}}function At(r,e){let t=r.indexId-e.indexId;return t!==0?t:(t=tl(r.arrayValue,e.arrayValue),t!==0?t:(t=tl(r.directionalValue,e.directionalValue),t!==0?t:B.comparator(r.documentKey,e.documentKey)))}function tl(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nl{constructor(e){this.Xt=new se((t,n)=>de.comparator(t.field,n.field)),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.en=e.orderBy,this.tn=[];for(const t of e.filters){const n=t;n.isInequality()?this.Xt=this.Xt.add(n):this.tn.push(n)}}get nn(){return this.Xt.size>1}rn(e){if(G(e.collectionGroup===this.collectionId),this.nn)return!1;const t=Co(e);if(t!==void 0&&!this.sn(t))return!1;const n=en(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.sn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Xt.size>0){const u=this.Xt.getIterator().getNext();if(!s.has(u.field.canonicalString())){const c=n[i];if(!this.on(u,c)||!this._n(this.en[o++],c))return!1}++i}for(;i<n.length;++i){const u=n[i];if(o>=this.en.length||!this._n(this.en[o++],u))return!1}return!0}an(){if(this.nn)return null;let e=new se(de.comparator);const t=[];for(const n of this.tn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new cn(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new cn(n.field,0))}for(const n of this.en)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new cn(n.field,n.dir==="asc"?0:1)));return new jn(jn.UNKNOWN_ID,this.collectionId,t,zn.empty())}sn(e){for(const t of this.tn)if(this.on(t,e))return!0;return!1}on(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}_n(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dd(r){var e,t;if(G(r instanceof Z||r instanceof re),r instanceof Z){if(r instanceof Qh){const s=((t=(e=r.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map(i=>Z.create(r.field,"==",i)))||[];return re.create(s,"or")}return r}const n=r.filters.map(s=>Dd(s));return re.create(n,r.op)}function Fy(r){if(r.getFilters().length===0)return[];const e=Go(Dd(r));return G(xd(e)),jo(e)||zo(e)?[e]:e.getFilters()}function jo(r){return r instanceof Z}function zo(r){return r instanceof re&&ua(r)}function xd(r){return jo(r)||zo(r)||function(t){if(t instanceof re&&No(t)){for(const n of t.getFilters())if(!jo(n)&&!zo(n))return!1;return!0}return!1}(r)}function Go(r){if(G(r instanceof Z||r instanceof re),r instanceof Z)return r;if(r.filters.length===1)return Go(r.filters[0]);const e=r.filters.map(n=>Go(n));let t=re.create(e,r.op);return t=si(t),xd(t)?t:(G(t instanceof re),G($n(t)),G(t.filters.length>1),t.filters.reduce((n,s)=>Ia(n,s)))}function Ia(r,e){let t;return G(r instanceof Z||r instanceof re),G(e instanceof Z||e instanceof re),t=r instanceof Z?e instanceof Z?function(s,i){return re.create([s,i],"and")}(r,e):rl(r,e):e instanceof Z?rl(e,r):function(s,i){if(G(s.filters.length>0&&i.filters.length>0),$n(s)&&$n(i))return Gh(s,i.getFilters());const o=No(s)?s:i,u=No(s)?i:s,c=o.filters.map(h=>Ia(h,u));return re.create(c,"or")}(r,e),si(t)}function rl(r,e){if($n(e))return Gh(e,r.getFilters());{const t=e.filters.map(n=>Ia(r,n));return re.create(t,"or")}}function si(r){if(G(r instanceof Z||r instanceof re),r instanceof Z)return r;const e=r.getFilters();if(e.length===1)return si(e[0]);if(jh(r))return r;const t=e.map(s=>si(s)),n=[];return t.forEach(s=>{s instanceof Z?n.push(s):s instanceof re&&(s.op===r.op?n.push(...s.filters):n.push(s))}),n.length===1?n[0]:re.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ly{constructor(){this.un=new Ta}addToCollectionParentIndex(e,t){return this.un.add(t),A.resolve()}getCollectionParents(e,t){return A.resolve(this.un.getEntries(t))}addFieldIndex(e,t){return A.resolve()}deleteFieldIndex(e,t){return A.resolve()}deleteAllFieldIndexes(e){return A.resolve()}createTargetIndexes(e,t){return A.resolve()}getDocumentsMatchingTarget(e,t){return A.resolve(null)}getIndexType(e,t){return A.resolve(0)}getFieldIndexes(e,t){return A.resolve([])}getNextCollectionGroupToUpdate(e){return A.resolve(null)}getMinOffset(e,t){return A.resolve(We.min())}getMinOffsetFromCollectionGroup(e,t){return A.resolve(We.min())}updateCollectionGroup(e,t,n){return A.resolve()}updateIndexEntries(e,t){return A.resolve()}}class Ta{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new se(X.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new se(X.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ns=new Uint8Array(0);class By{constructor(e,t){this.databaseId=t,this.cn=new Ta,this.ln=new yt(n=>mn(n),(n,s)=>ts(n,s)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.cn.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener(()=>{this.cn.add(t)});const i={collectionId:n,parent:Le(s)};return sl(e).put(i)}return A.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[Ah(t),""],!1,!0);return sl(e).U(s).next(i=>{for(const o of i){if(o.collectionId!==t)break;n.push(Xe(o.parent))}return n})}addFieldIndex(e,t){const n=Vr(e),s=function(u){return{indexId:u.indexId,collectionGroup:u.collectionGroup,fields:u.fields.map(c=>[c.fieldPath.canonicalString(),c.kind])}}(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=xn(e);return i.next(u=>{o.put(Yc(u,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return i.next()}deleteFieldIndex(e,t){const n=Vr(e),s=xn(e),i=Dn(e);return n.delete(t.indexId).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=Vr(e),n=Dn(e),s=xn(e);return t.j().next(()=>n.j()).next(()=>s.j())}createTargetIndexes(e,t){return A.forEach(this.hn(t),n=>this.getIndexType(e,n).next(s=>{if(s===0||s===1){const i=new nl(n).an();if(i!=null)return this.addFieldIndex(e,i)}}))}getDocumentsMatchingTarget(e,t){const n=Dn(e);let s=!0;const i=new Map;return A.forEach(this.hn(t),o=>this.Pn(e,o).next(u=>{s&&(s=!!u),i.set(o,u)})).next(()=>{if(s){let o=H();const u=[];return A.forEach(i,(c,h)=>{k("IndexedDbIndexManager",`Using index ${function(O){return`id=${O.indexId}|cg=${O.collectionGroup}|f=${O.fields.map(q=>`${q.fieldPath}:${q.kind}`).join(",")}`}(c)} to execute ${mn(t)}`);const f=function(O,q){const $=Co(q);if($===void 0)return null;for(const x of ei(O,$.fieldPath))switch(x.op){case"array-contains-any":return x.value.arrayValue.values||[];case"array-contains":return[x.value]}return null}(h,c),m=function(O,q){const $=new Map;for(const x of en(q))for(const y of ei(O,x.fieldPath))switch(y.op){case"==":case"in":$.set(x.fieldPath.canonicalString(),y.value);break;case"not-in":case"!=":return $.set(x.fieldPath.canonicalString(),y.value),Array.from($.values())}return null}(h,c),g=function(O,q){const $=[];let x=!0;for(const y of en(q)){const _=y.kind===0?Mc(O,y.fieldPath,O.startAt):Fc(O,y.fieldPath,O.startAt);$.push(_.value),x&&(x=_.inclusive)}return new Ft($,x)}(h,c),E=function(O,q){const $=[];let x=!0;for(const y of en(q)){const _=y.kind===0?Fc(O,y.fieldPath,O.endAt):Mc(O,y.fieldPath,O.endAt);$.push(_.value),x&&(x=_.inclusive)}return new Ft($,x)}(h,c),V=this.In(c,h,g),C=this.In(c,h,E),D=this.Tn(c,h,m),M=this.En(c.indexId,f,V,g.inclusive,C,E.inclusive,D);return A.forEach(M,U=>n.G(U,t.limit).next(O=>{O.forEach(q=>{const $=B.fromSegments(q.documentKey);o.has($)||(o=o.add($),u.push($))})}))}).next(()=>u)}return A.resolve(null)})}hn(e){let t=this.ln.get(e);return t||(e.filters.length===0?t=[e]:t=Fy(re.create(e.filters,"and")).map(n=>Mo(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt)),this.ln.set(e,t),t)}En(e,t,n,s,i,o,u){const c=(t!=null?t.length:1)*Math.max(n.length,i.length),h=c/(t!=null?t.length:1),f=[];for(let m=0;m<c;++m){const g=t?this.dn(t[m/h]):Ns,E=this.An(e,g,n[m%h],s),V=this.Rn(e,g,i[m%h],o),C=u.map(D=>this.An(e,g,D,!0));f.push(...this.createRange(E,V,C))}return f}An(e,t,n,s){const i=new sn(e,B.empty(),t,n);return s?i:i.Zt()}Rn(e,t,n,s){const i=new sn(e,B.empty(),t,n);return s?i.Zt():i}Pn(e,t){const n=new nl(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next(i=>{let o=null;for(const u of i)n.rn(u)&&(!o||u.fields.length>o.fields.length)&&(o=u);return o})}getIndexType(e,t){let n=2;const s=this.hn(t);return A.forEach(s,i=>this.Pn(e,i).next(o=>{o?n!==0&&o.fields.length<function(c){let h=new se(de.comparator),f=!1;for(const m of c.filters)for(const g of m.getFlattenedFilters())g.field.isKeyField()||(g.op==="array-contains"||g.op==="array-contains-any"?f=!0:h=h.add(g.field));for(const m of c.orderBy)m.field.isKeyField()||(h=h.add(m.field));return h.size+(f?1:0)}(i)&&(n=1):n=0})).next(()=>function(o){return o.limit!==null}(t)&&s.length>1&&n===2?1:n)}Vn(e,t){const n=new Pr;for(const s of en(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.Yt(s.kind);rn.vt.It(i,o)}return n.zt()}dn(e){const t=new Pr;return rn.vt.It(e,t.Yt(0)),t.zt()}mn(e,t){const n=new Pr;return rn.vt.It(fn(this.databaseId,t),n.Yt(function(i){const o=en(i);return o.length===0?0:o[o.length-1].kind}(e))),n.zt()}Tn(e,t,n){if(n===null)return[];let s=[];s.push(new Pr);let i=0;for(const o of en(e)){const u=n[i++];for(const c of s)if(this.fn(t,o.fieldPath)&&Qr(u))s=this.gn(s,o,u);else{const h=c.Yt(o.kind);rn.vt.It(u,h)}}return this.pn(s)}In(e,t,n){return this.Tn(e,t,n.position)}pn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].zt();return t}gn(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const u of s){const c=new Pr;c.seed(u.zt()),rn.vt.It(o,c.Yt(t.kind)),i.push(c)}return i}fn(e,t){return!!e.filters.find(n=>n instanceof Z&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in"))}getFieldIndexes(e,t){const n=Vr(e),s=xn(e);return(t?n.U("collectionGroupIndex",IDBKeyRange.bound(t,t)):n.U()).next(i=>{const o=[];return A.forEach(i,u=>s.get([u.indexId,this.uid]).next(c=>{o.push(function(f,m){const g=m?new zn(m.sequenceNumber,new We(yn(m.readTime),new B(Xe(m.documentKey)),m.largestBatchId)):zn.empty(),E=f.fields.map(([V,C])=>new cn(de.fromServerFormat(V),C));return new jn(f.indexId,f.collectionGroup,E,g)}(u,c))})).next(()=>o)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(t=>t.length===0?null:(t.sort((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:Q(n.collectionGroup,s.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(e,t,n){const s=Vr(e),i=xn(e);return this.yn(e).next(o=>s.U("collectionGroupIndex",IDBKeyRange.bound(t,t)).next(u=>A.forEach(u,c=>i.put(Yc(c.indexId,this.uid,o,n)))))}updateIndexEntries(e,t){const n=new Map;return A.forEach(t,(s,i)=>{const o=n.get(s.collectionGroup);return(o?A.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next(u=>(n.set(s.collectionGroup,u),A.forEach(u,c=>this.wn(e,s,c).next(h=>{const f=this.Sn(i,c);return h.isEqual(f)?A.resolve():this.bn(e,i,c,h,f)}))))})}Dn(e,t,n,s){return Dn(e).put({indexId:s.indexId,uid:this.uid,arrayValue:s.arrayValue,directionalValue:s.directionalValue,orderedDocumentKey:this.mn(n,t.key),documentKey:t.key.path.toArray()})}vn(e,t,n,s){return Dn(e).delete([s.indexId,this.uid,s.arrayValue,s.directionalValue,this.mn(n,t.key),t.key.path.toArray()])}wn(e,t,n){const s=Dn(e);let i=new se(At);return s.J({index:"documentKeyIndex",range:IDBKeyRange.only([n.indexId,this.uid,this.mn(n,t)])},(o,u)=>{i=i.add(new sn(n.indexId,t,u.arrayValue,u.directionalValue))}).next(()=>i)}Sn(e,t){let n=new se(At);const s=this.Vn(t,e);if(s==null)return n;const i=Co(t);if(i!=null){const o=e.data.field(i.fieldPath);if(Qr(o))for(const u of o.arrayValue.values||[])n=n.add(new sn(t.indexId,e.key,this.dn(u),s))}else n=n.add(new sn(t.indexId,e.key,Ns,s));return n}bn(e,t,n,s,i){k("IndexedDbIndexManager","Updating index entries for document '%s'",t.key);const o=[];return function(c,h,f,m,g){const E=c.getIterator(),V=h.getIterator();let C=Cn(E),D=Cn(V);for(;C||D;){let M=!1,U=!1;if(C&&D){const O=f(C,D);O<0?U=!0:O>0&&(M=!0)}else C!=null?U=!0:M=!0;M?(m(D),D=Cn(V)):U?(g(C),C=Cn(E)):(C=Cn(E),D=Cn(V))}}(s,i,At,u=>{o.push(this.Dn(e,t,n,u))},u=>{o.push(this.vn(e,t,n,u))}),A.waitFor(o)}yn(e){let t=1;return xn(e).J({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(n,s,i)=>{i.done(),t=s.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((o,u)=>At(o,u)).filter((o,u,c)=>!u||At(o,c[u-1])!==0);const s=[];s.push(e);for(const o of n){const u=At(o,e),c=At(o,t);if(u===0)s[0]=e.Zt();else if(u>0&&c<0)s.push(o),s.push(o.Zt());else if(c>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.Cn(s[o],s[o+1]))return[];const u=[s[o].indexId,this.uid,s[o].arrayValue,s[o].directionalValue,Ns,[]],c=[s[o+1].indexId,this.uid,s[o+1].arrayValue,s[o+1].directionalValue,Ns,[]];i.push(IDBKeyRange.bound(u,c))}return i}Cn(e,t){return At(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(il)}getMinOffset(e,t){return A.mapArray(this.hn(t),n=>this.Pn(e,n).next(s=>s||z())).next(il)}}function sl(r){return be(r,"collectionParents")}function Dn(r){return be(r,"indexEntries")}function Vr(r){return be(r,"indexConfiguration")}function xn(r){return be(r,"indexState")}function il(r){G(r.length!==0);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;ia(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new We(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ol={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class Fe{constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}static withCacheSize(e){return new Fe(e,Fe.DEFAULT_COLLECTION_PERCENTILE,Fe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kd(r,e,t){const n=r.store("mutations"),s=r.store("documentMutations"),i=[],o=IDBKeyRange.only(t.batchId);let u=0;const c=n.J({range:o},(f,m,g)=>(u++,g.delete()));i.push(c.next(()=>{G(u===1)}));const h=[];for(const f of t.mutations){const m=Dh(e,f.key.path,t.batchId);i.push(s.delete(m)),h.push(f.key)}return A.waitFor(i).next(()=>h)}function ii(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw z();e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Fe.DEFAULT_COLLECTION_PERCENTILE=10,Fe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Fe.DEFAULT=new Fe(41943040,Fe.DEFAULT_COLLECTION_PERCENTILE,Fe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Fe.DISABLED=new Fe(-1,0,0);class Ai{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.Fn={}}static lt(e,t,n,s){G(e.uid!=="");const i=e.isAuthenticated()?e.uid:"";return new Ai(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return bt(e).J({index:"userMutationsIndex",range:n},(s,i,o)=>{t=!1,o.done()}).next(()=>t)}addMutationBatch(e,t,n,s){const i=Fn(e),o=bt(e);return o.add({}).next(u=>{G(typeof u=="number");const c=new fa(u,t,n,s),h=function(E,V,C){const D=C.baseMutations.map(U=>Jr(E.ct,U)),M=C.mutations.map(U=>Jr(E.ct,U));return{userId:V,batchId:C.batchId,localWriteTimeMs:C.localWriteTime.toMillis(),baseMutations:D,mutations:M}}(this.serializer,this.userId,c),f=[];let m=new se((g,E)=>Q(g.canonicalString(),E.canonicalString()));for(const g of s){const E=Dh(this.userId,g.key.path,u);m=m.add(g.key.path.popLast()),f.push(o.put(h)),f.push(i.put(E,S_))}return m.forEach(g=>{f.push(this.indexManager.addToCollectionParentIndex(e,g))}),e.addOnCommittedListener(()=>{this.Fn[u]=c.keys()}),A.waitFor(f).next(()=>c)})}lookupMutationBatch(e,t){return bt(e).get(t).next(n=>n?(G(n.userId===this.userId),nn(this.serializer,n)):null)}Mn(e,t){return this.Fn[t]?A.resolve(this.Fn[t]):this.lookupMutationBatch(e,t).next(n=>{if(n){const s=n.keys();return this.Fn[t]=s,s}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return bt(e).J({index:"userMutationsIndex",range:s},(o,u,c)=>{u.userId===this.userId&&(G(u.batchId>=n),i=nn(this.serializer,u)),c.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=-1;return bt(e).J({index:"userMutationsIndex",range:t,reverse:!0},(s,i,o)=>{n=i.batchId,o.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return bt(e).U("userMutationsIndex",t).next(n=>n.map(s=>nn(this.serializer,s)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=Us(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return Fn(e).J({range:s},(o,u,c)=>{const[h,f,m]=o,g=Xe(f);if(h===this.userId&&t.path.isEqual(g))return bt(e).get(m).next(E=>{if(!E)throw z();G(E.userId===this.userId),i.push(nn(this.serializer,E))});c.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new se(Q);const s=[];return t.forEach(i=>{const o=Us(this.userId,i.path),u=IDBKeyRange.lowerBound(o),c=Fn(e).J({range:u},(h,f,m)=>{const[g,E,V]=h,C=Xe(E);g===this.userId&&i.path.isEqual(C)?n=n.add(V):m.done()});s.push(c)}),A.waitFor(s).next(()=>this.xn(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=Us(this.userId,n),o=IDBKeyRange.lowerBound(i);let u=new se(Q);return Fn(e).J({range:o},(c,h,f)=>{const[m,g,E]=c,V=Xe(g);m===this.userId&&n.isPrefixOf(V)?V.length===s&&(u=u.add(E)):f.done()}).next(()=>this.xn(e,u))}xn(e,t){const n=[],s=[];return t.forEach(i=>{s.push(bt(e).get(i).next(o=>{if(o===null)throw z();G(o.userId===this.userId),n.push(nn(this.serializer,o))}))}),A.waitFor(s).next(()=>n)}removeMutationBatch(e,t){return kd(e._e,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.On(t.batchId)}),A.forEach(n,s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))}On(e){delete this.Fn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return A.resolve();const n=IDBKeyRange.lowerBound(function(o){return[o]}(this.userId)),s=[];return Fn(e).J({range:n},(i,o,u)=>{if(i[0]===this.userId){const c=Xe(i[1]);s.push(c)}else u.done()}).next(()=>{G(s.length===0)})})}containsKey(e,t){return Nd(e,this.userId,t)}Nn(e){return Od(e).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function Nd(r,e,t){const n=Us(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Fn(r).J({range:i,H:!0},(u,c,h)=>{const[f,m,g]=u;f===e&&m===s&&(o=!0),h.done()}).next(()=>o)}function bt(r){return be(r,"mutations")}function Fn(r){return be(r,"documentMutations")}function Od(r){return be(r,"mutationQueues")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e){this.Ln=e}next(){return this.Ln+=2,this.Ln}static Bn(){return new In(0)}static kn(){return new In(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uy{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.qn(e).next(t=>{const n=new In(t.highestTargetId);return t.highestTargetId=n.next(),this.Qn(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.qn(e).next(t=>K.fromTimestamp(new pe(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.qn(e).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.qn(e).next(s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.Qn(e,s)))}addTargetData(e,t){return this.Kn(e,t).next(()=>this.qn(e).next(n=>(n.targetCount+=1,this.$n(t,n),this.Qn(e,n))))}updateTargetData(e,t){return this.Kn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>kn(e).delete(t.targetId)).next(()=>this.qn(e)).next(n=>(G(n.targetCount>0),n.targetCount-=1,this.Qn(e,n)))}removeTargets(e,t,n){let s=0;const i=[];return kn(e).J((o,u)=>{const c=Or(u);c.sequenceNumber<=t&&n.get(c.targetId)===null&&(s++,i.push(this.removeTargetData(e,c)))}).next(()=>A.waitFor(i)).next(()=>s)}forEachTarget(e,t){return kn(e).J((n,s)=>{const i=Or(s);t(i)})}qn(e){return al(e).get("targetGlobalKey").next(t=>(G(t!==null),t))}Qn(e,t){return al(e).put("targetGlobalKey",t)}Kn(e,t){return kn(e).put(Cd(this.serializer,t))}$n(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.qn(e).next(t=>t.targetCount)}getTargetData(e,t){const n=mn(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return kn(e).J({range:s,index:"queryTargetsIndex"},(o,u,c)=>{const h=Or(u);ts(t,h.target)&&(i=h,c.done())}).next(()=>i)}addMatchingKeys(e,t,n){const s=[],i=St(e);return t.forEach(o=>{const u=Le(o.path);s.push(i.put({targetId:n,path:u})),s.push(this.referenceDelegate.addReference(e,n,o))}),A.waitFor(s)}removeMatchingKeys(e,t,n){const s=St(e);return A.forEach(t,i=>{const o=Le(i.path);return A.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])})}removeMatchingKeysForTargetId(e,t){const n=St(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=St(e);let i=H();return s.J({range:n,H:!0},(o,u,c)=>{const h=Xe(o[1]),f=new B(h);i=i.add(f)}).next(()=>i)}containsKey(e,t){const n=Le(t.path),s=IDBKeyRange.bound([n],[Ah(n)],!1,!0);let i=0;return St(e).J({index:"documentTargetsIndex",H:!0,range:s},([o,u],c,h)=>{o!==0&&(i++,h.done())}).next(()=>i>0)}ot(e,t){return kn(e).get(t).next(n=>n?Or(n):null)}}function kn(r){return be(r,"targets")}function al(r){return be(r,"targetGlobal")}function St(r){return be(r,"targetDocuments")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ul([r,e],[t,n]){const s=Q(r,t);return s===0?Q(e,n):s}class qy{constructor(e){this.Un=e,this.buffer=new se(ul),this.Wn=0}Gn(){return++this.Wn}zn(e){const t=[e,this.Gn()];if(this.buffer.size<this.Un)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();ul(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Md{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.jn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Hn(6e4)}stop(){this.jn&&(this.jn.cancel(),this.jn=null)}get started(){return this.jn!==null}Hn(e){k("LruGarbageCollector",`Garbage collection scheduled in ${e}ms`),this.jn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.jn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){zt(t)?k("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",t):await jt(t)}await this.Hn(3e5)})}}class jy{constructor(e,t){this.Jn=e,this.params=t}calculateTargetCount(e,t){return this.Jn.Yn(e).next(n=>Math.floor(t/100*n))}nthSequenceNumber(e,t){if(t===0)return A.resolve(je.oe);const n=new qy(t);return this.Jn.forEachTarget(e,s=>n.zn(s.sequenceNumber)).next(()=>this.Jn.Zn(e,s=>n.zn(s))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.Jn.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Jn.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(k("LruGarbageCollector","Garbage collection skipped; disabled"),A.resolve(ol)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(k("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),ol):this.Xn(e,t))}getCacheSize(e){return this.Jn.getCacheSize(e)}Xn(e,t){let n,s,i,o,u,c,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?(k("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),s=this.params.maximumSequenceNumbersToCollect):s=m,o=Date.now(),this.nthSequenceNumber(e,s))).next(m=>(n=m,u=Date.now(),this.removeTargets(e,n,t))).next(m=>(i=m,c=Date.now(),this.removeOrphanedDocuments(e,n))).next(m=>(h=Date.now(),Nn()<=te.DEBUG&&k("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${s} in `+(u-o)+`ms
	Removed ${i} targets in `+(c-u)+`ms
	Removed ${m} documents in `+(h-c)+`ms
Total Duration: ${h-f}ms`),A.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:m})))}}function Fd(r,e){return new jy(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zy{constructor(e,t){this.db=e,this.garbageCollector=Fd(this,t)}Yn(e){const t=this.er(e);return this.db.getTargetCache().getTargetCount(e).next(n=>t.next(s=>n+s))}er(e){let t=0;return this.Zn(e,n=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Zn(e,t){return this.tr(e,(n,s)=>t(s))}addReference(e,t,n){return Os(e,n)}removeReference(e,t,n){return Os(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Os(e,t)}nr(e,t){return function(s,i){let o=!1;return Od(s).Y(u=>Nd(s,u,i).next(c=>(c&&(o=!0),A.resolve(!c)))).next(()=>o)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.tr(e,(o,u)=>{if(u<=t){const c=this.nr(e,o).next(h=>{if(!h)return i++,n.getEntry(e,o).next(()=>(n.removeEntry(o,K.min()),St(e).delete(function(m){return[0,Le(m.path)]}(o))))});s.push(c)}}).next(()=>A.waitFor(s)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Os(e,t)}tr(e,t){const n=St(e);let s,i=je.oe;return n.J({index:"documentTargetsIndex"},([o,u],{path:c,sequenceNumber:h})=>{o===0?(i!==je.oe&&t(new B(Xe(s)),i),i=h,s=c):i=je.oe}).next(()=>{i!==je.oe&&t(new B(Xe(s)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Os(r,e){return St(r).put(function(n,s){return{targetId:0,path:Le(n.path),sequenceNumber:s}}(e,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ld{constructor(){this.changes=new yt(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,le.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?A.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gy{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Xt(e).put(n)}removeEntry(e,t,n){return Xt(e).delete(function(i,o){const u=i.path.toArray();return[u.slice(0,u.length-2),u[u.length-2],ri(o),u[u.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.rr(e,n)))}getEntry(e,t){let n=le.newInvalidDocument(t);return Xt(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(Cr(t))},(s,i)=>{n=this.ir(t,i)}).next(()=>n)}sr(e,t){let n={size:0,document:le.newInvalidDocument(t)};return Xt(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(Cr(t))},(s,i)=>{n={document:this.ir(t,i),size:ii(i)}}).next(()=>n)}getEntries(e,t){let n=Ge();return this._r(e,t,(s,i)=>{const o=this.ir(s,i);n=n.insert(s,o)}).next(()=>n)}ar(e,t){let n=Ge(),s=new ue(B.comparator);return this._r(e,t,(i,o)=>{const u=this.ir(i,o);n=n.insert(i,u),s=s.insert(i,ii(o))}).next(()=>({documents:n,ur:s}))}_r(e,t,n){if(t.isEmpty())return A.resolve();let s=new se(hl);t.forEach(c=>s=s.add(c));const i=IDBKeyRange.bound(Cr(s.first()),Cr(s.last())),o=s.getIterator();let u=o.getNext();return Xt(e).J({index:"documentKeyIndex",range:i},(c,h,f)=>{const m=B.fromSegments([...h.prefixPath,h.collectionGroup,h.documentId]);for(;u&&hl(u,m)<0;)n(u,null),u=o.getNext();u&&u.isEqual(m)&&(n(u,h),u=o.hasNext()?o.getNext():null),u?f.$(Cr(u)):f.done()}).next(()=>{for(;u;)n(u,null),u=o.hasNext()?o.getNext():null})}getDocumentsMatchingQuery(e,t,n,s,i){const o=t.path,u=[o.popLast().toArray(),o.lastSegment(),ri(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],c=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Xt(e).U(IDBKeyRange.bound(u,c,!0)).next(h=>{i==null||i.incrementDocumentReadCount(h.length);let f=Ge();for(const m of h){const g=this.ir(B.fromSegments(m.prefixPath.concat(m.collectionGroup,m.documentId)),m);g.isFoundDocument()&&(rs(t,g)||s.has(g.key))&&(f=f.insert(g.key,g))}return f})}getAllFromCollectionGroup(e,t,n,s){let i=Ge();const o=ll(t,n),u=ll(t,We.max());return Xt(e).J({index:"collectionGroupIndex",range:IDBKeyRange.bound(o,u,!0)},(c,h,f)=>{const m=this.ir(B.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);i=i.insert(m.key,m),i.size===s&&f.done()}).next(()=>i)}newChangeBuffer(e){return new $y(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(t=>t.byteSize)}getMetadata(e){return cl(e).get("remoteDocumentGlobalKey").next(t=>(G(!!t),t))}rr(e,t){return cl(e).put("remoteDocumentGlobalKey",t)}ir(e,t){if(t){const n=Cy(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(K.min())))return n}return le.newInvalidDocument(e)}}function Bd(r){return new Gy(r)}class $y extends Ld{constructor(e,t){super(),this.cr=e,this.trackRemovals=t,this.lr=new yt(n=>n.toString(),(n,s)=>n.isEqual(s))}applyChanges(e){const t=[];let n=0,s=new se((i,o)=>Q(i.canonicalString(),o.canonicalString()));return this.changes.forEach((i,o)=>{const u=this.lr.get(i);if(t.push(this.cr.removeEntry(e,i,u.readTime)),o.isValidDocument()){const c=Hc(this.cr.serializer,o);s=s.add(i.path.popLast());const h=ii(c);n+=h-u.size,t.push(this.cr.addEntry(e,i,c))}else if(n-=u.size,this.trackRemovals){const c=Hc(this.cr.serializer,o.convertToNoDocument(K.min()));t.push(this.cr.addEntry(e,i,c))}}),s.forEach(i=>{t.push(this.cr.indexManager.addToCollectionParentIndex(e,i))}),t.push(this.cr.updateMetadata(e,n)),A.waitFor(t)}getFromCache(e,t){return this.cr.sr(e,t).next(n=>(this.lr.set(t,{size:n.size,readTime:n.document.readTime}),n.document))}getAllFromCache(e,t){return this.cr.ar(e,t).next(({documents:n,ur:s})=>(s.forEach((i,o)=>{this.lr.set(i,{size:o,readTime:n.get(i).readTime})}),n))}}function cl(r){return be(r,"remoteDocumentGlobal")}function Xt(r){return be(r,"remoteDocumentsV14")}function Cr(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function ll(r,e){const t=e.documentKey.path.toArray();return[r,ri(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function hl(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=Q(t[i],n[i]),s)return s;return s=Q(t.length,n.length),s||(s=Q(t[t.length-2],n[n.length-2]),s||Q(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(n=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(n!==null&&Ur(n.mutation,s,ze.empty(),pe.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.getLocalViewOfDocuments(e,n,H()).next(()=>n))}getLocalViewOfDocuments(e,t,n=H()){const s=Ze();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,n).next(i=>{let o=kr();return i.forEach((u,c)=>{o=o.insert(u,c.overlayedDocument)}),o}))}getOverlayedDocuments(e,t){const n=Ze();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,H()))}populateOverlays(e,t,n){const s=[];return n.forEach(i=>{t.has(i)||s.push(i)}),this.documentOverlayCache.getOverlays(e,s).next(i=>{i.forEach((o,u)=>{t.set(o,u)})})}computeViews(e,t,n,s){let i=Ge();const o=Br(),u=function(){return Br()}();return t.forEach((c,h)=>{const f=n.get(h.key);s.has(h.key)&&(f===void 0||f.mutation instanceof It)?i=i.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),Ur(f.mutation,h,f.mutation.getFieldMask(),pe.now())):o.set(h.key,ze.empty())}),this.recalculateAndSaveOverlays(e,i).next(c=>(c.forEach((h,f)=>o.set(h,f)),t.forEach((h,f)=>{var m;return u.set(h,new Ky(f,(m=o.get(h))!==null&&m!==void 0?m:null))}),u))}recalculateAndSaveOverlays(e,t){const n=Br();let s=new ue((o,u)=>o-u),i=H();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(o=>{for(const u of o)u.keys().forEach(c=>{const h=t.get(c);if(h===null)return;let f=n.get(c)||ze.empty();f=u.applyToLocalView(h,f),n.set(c,f);const m=(s.get(u.batchId)||H()).add(c);s=s.insert(u.batchId,m)})}).next(()=>{const o=[],u=s.getReverseIterator();for(;u.hasNext();){const c=u.getNext(),h=c.key,f=c.value,m=nd();f.forEach(g=>{if(!i.has(g)){const E=cd(t.get(g),n.get(g));E!==null&&m.set(g,E),i=i.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,m))}return A.waitFor(o)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(n=>this.recalculateAndSaveOverlays(e,n))}getDocumentsMatchingQuery(e,t,n,s){return function(o){return B.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):ca(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next(i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):A.resolve(Ze());let u=-1,c=i;return o.next(h=>A.forEach(h,(f,m)=>(u<m.largestBatchId&&(u=m.largestBatchId),i.get(f)?A.resolve():this.remoteDocumentCache.getEntry(e,f).next(g=>{c=c.insert(f,g)}))).next(()=>this.populateOverlays(e,h,i)).next(()=>this.computeViews(e,c,h,H())).next(f=>({batchId:u,changes:td(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new B(t)).next(n=>{let s=kr();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=kr();return this.indexManager.getCollectionParents(e,i).next(u=>A.forEach(u,c=>{const h=function(m,g){return new _t(g,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,h,n,s).next(f=>{f.forEach((m,g)=>{o=o.insert(m,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s))).next(o=>{i.forEach((c,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,le.newInvalidDocument(f)))});let u=kr();return o.forEach((c,h)=>{const f=i.get(c);f!==void 0&&Ur(f.mutation,h,ze.empty(),pe.now()),rs(t,h)&&(u=u.insert(c,h))}),u})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(e){this.serializer=e,this.hr=new Map,this.Pr=new Map}getBundleMetadata(e,t){return A.resolve(this.hr.get(t))}saveBundleMetadata(e,t){return this.hr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:Ee(s.createTime)}}(t)),A.resolve()}getNamedQuery(e,t){return A.resolve(this.Pr.get(t))}saveNamedQuery(e,t){return this.Pr.set(t.name,function(s){return{name:s.name,query:ya(s.bundledQuery),readTime:Ee(s.readTime)}}(t)),A.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(){this.overlays=new ue(B.comparator),this.Ir=new Map}getOverlay(e,t){return A.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Ze();return A.forEach(t,s=>this.getOverlay(e,s).next(i=>{i!==null&&n.set(s,i)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((s,i)=>{this.ht(e,t,i)}),A.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Ir.get(n);return s!==void 0&&(s.forEach(i=>this.overlays=this.overlays.remove(i)),this.Ir.delete(n)),A.resolve()}getOverlaysForCollection(e,t,n){const s=Ze(),i=t.length+1,o=new B(t.child("")),u=this.overlays.getIteratorFrom(o);for(;u.hasNext();){const c=u.getNext().value,h=c.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===i&&c.largestBatchId>n&&s.set(c.getKey(),c)}return A.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new ue((h,f)=>h-f);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>n){let f=i.get(h.largestBatchId);f===null&&(f=Ze(),i=i.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const u=Ze(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach((h,f)=>u.set(h,f)),!(u.size()>=s)););return A.resolve(u)}ht(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Ir.get(s.largestBatchId).delete(n.key);this.Ir.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new pa(t,n));let i=this.Ir.get(t);i===void 0&&(i=H(),this.Ir.set(t,i)),this.Ir.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(){this.sessionToken=ye.EMPTY_BYTE_STRING}getSessionToken(e){return A.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,A.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ea{constructor(){this.Tr=new se(Re.Er),this.dr=new se(Re.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(e,t){const n=new Re(e,t);this.Tr=this.Tr.add(n),this.dr=this.dr.add(n)}Rr(e,t){e.forEach(n=>this.addReference(n,t))}removeReference(e,t){this.Vr(new Re(e,t))}mr(e,t){e.forEach(n=>this.removeReference(n,t))}gr(e){const t=new B(new X([])),n=new Re(t,e),s=new Re(t,e+1),i=[];return this.dr.forEachInRange([n,s],o=>{this.Vr(o),i.push(o.key)}),i}pr(){this.Tr.forEach(e=>this.Vr(e))}Vr(e){this.Tr=this.Tr.delete(e),this.dr=this.dr.delete(e)}yr(e){const t=new B(new X([])),n=new Re(t,e),s=new Re(t,e+1);let i=H();return this.dr.forEachInRange([n,s],o=>{i=i.add(o.key)}),i}containsKey(e){const t=new Re(e,0),n=this.Tr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class Re{constructor(e,t){this.key=e,this.wr=t}static Er(e,t){return B.comparator(e.key,t.key)||Q(e.wr,t.wr)}static Ar(e,t){return Q(e.wr,t.wr)||B.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Sr=1,this.br=new se(Re.Er)}checkEmpty(e){return A.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new fa(i,t,n,s);this.mutationQueue.push(o);for(const u of s)this.br=this.br.add(new Re(u.key,i)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return A.resolve(o)}lookupMutationBatch(e,t){return A.resolve(this.Dr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.vr(n),i=s<0?0:s;return A.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return A.resolve(this.mutationQueue.length===0?-1:this.Sr-1)}getAllMutationBatches(e){return A.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Re(t,0),s=new Re(t,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([n,s],o=>{const u=this.Dr(o.wr);i.push(u)}),A.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new se(Q);return t.forEach(s=>{const i=new Re(s,0),o=new Re(s,Number.POSITIVE_INFINITY);this.br.forEachInRange([i,o],u=>{n=n.add(u.wr)})}),A.resolve(this.Cr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;B.isDocumentKey(i)||(i=i.child(""));const o=new Re(new B(i),0);let u=new se(Q);return this.br.forEachWhile(c=>{const h=c.key.path;return!!n.isPrefixOf(h)&&(h.length===s&&(u=u.add(c.wr)),!0)},o),A.resolve(this.Cr(u))}Cr(e){const t=[];return e.forEach(n=>{const s=this.Dr(n);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){G(this.Fr(t.batchId,"removed")===0),this.mutationQueue.shift();let n=this.br;return A.forEach(t.mutations,s=>{const i=new Re(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.br=n})}On(e){}containsKey(e,t){const n=new Re(t,0),s=this.br.firstAfterOrEqual(n);return A.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,A.resolve()}Fr(e,t){return this.vr(e)}vr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Dr(e){const t=this.vr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yy{constructor(e){this.Mr=e,this.docs=function(){return new ue(B.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.Mr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return A.resolve(n?n.document.mutableCopy():le.newInvalidDocument(t))}getEntries(e,t){let n=Ge();return t.forEach(s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():le.newInvalidDocument(s))}),A.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let i=Ge();const o=t.path,u=new B(o.child("")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:h,value:{document:f}}=c.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||ia(Rh(f),n)<=0||(s.has(f.key)||rs(t,f))&&(i=i.insert(f.key,f.mutableCopy()))}return A.resolve(i)}getAllFromCollectionGroup(e,t,n,s){z()}Or(e,t){return A.forEach(this.docs,n=>t(n))}newChangeBuffer(e){return new Xy(this)}getSize(e){return A.resolve(this.size)}}class Xy extends Ld{constructor(e){super(),this.cr=e}applyChanges(e){const t=[];return this.changes.forEach((n,s)=>{s.isValidDocument()?t.push(this.cr.addEntry(e,s)):this.cr.removeEntry(n)}),A.waitFor(t)}getFromCache(e,t){return this.cr.getEntry(e,t)}getAllFromCache(e,t){return this.cr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zy{constructor(e){this.persistence=e,this.Nr=new yt(t=>mn(t),ts),this.lastRemoteSnapshotVersion=K.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Ea,this.targetCount=0,this.kr=In.Bn()}forEachTarget(e,t){return this.Nr.forEach((n,s)=>t(s)),A.resolve()}getLastRemoteSnapshotVersion(e){return A.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return A.resolve(this.Lr)}allocateTargetId(e){return this.highestTargetId=this.kr.next(),A.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.Lr&&(this.Lr=t),A.resolve()}Kn(e){this.Nr.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.kr=new In(t),this.highestTargetId=t),e.sequenceNumber>this.Lr&&(this.Lr=e.sequenceNumber)}addTargetData(e,t){return this.Kn(t),this.targetCount+=1,A.resolve()}updateTargetData(e,t){return this.Kn(t),A.resolve()}removeTargetData(e,t){return this.Nr.delete(t.target),this.Br.gr(t.targetId),this.targetCount-=1,A.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.Nr.forEach((o,u)=>{u.sequenceNumber<=t&&n.get(u.targetId)===null&&(this.Nr.delete(o),i.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)}),A.waitFor(i).next(()=>s)}getTargetCount(e){return A.resolve(this.targetCount)}getTargetData(e,t){const n=this.Nr.get(t)||null;return A.resolve(n)}addMatchingKeys(e,t,n){return this.Br.Rr(t,n),A.resolve()}removeMatchingKeys(e,t,n){this.Br.mr(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach(o=>{i.push(s.markPotentiallyOrphaned(e,o))}),A.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Br.gr(t),A.resolve()}getMatchingKeysForTargetId(e,t){const n=this.Br.yr(t);return A.resolve(n)}containsKey(e,t){return A.resolve(this.Br.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa{constructor(e,t){this.qr={},this.overlays={},this.Qr=new je(0),this.Kr=!1,this.Kr=!0,this.$r=new Hy,this.referenceDelegate=e(this),this.Ur=new Zy(this),this.indexManager=new Ly,this.remoteDocumentCache=function(s){return new Yy(s)}(n=>this.referenceDelegate.Wr(n)),this.serializer=new Vd(t),this.Gr=new Qy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Wy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.qr[e.toKey()];return n||(n=new Jy(t,this.referenceDelegate),this.qr[e.toKey()]=n),n}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(e,t,n){k("MemoryPersistence","Starting transaction:",e);const s=new eI(this.Qr.next());return this.referenceDelegate.zr(),n(s).next(i=>this.referenceDelegate.jr(s).next(()=>i)).toPromise().then(i=>(s.raiseOnCommittedEvent(),i))}Hr(e,t){return A.or(Object.values(this.qr).map(n=>()=>n.containsKey(e,t)))}}class eI extends Ph{constructor(e){super(),this.currentSequenceNumber=e}}class bi{constructor(e){this.persistence=e,this.Jr=new Ea,this.Yr=null}static Zr(e){return new bi(e)}get Xr(){if(this.Yr)return this.Yr;throw z()}addReference(e,t,n){return this.Jr.addReference(n,t),this.Xr.delete(n.toString()),A.resolve()}removeReference(e,t,n){return this.Jr.removeReference(n,t),this.Xr.add(n.toString()),A.resolve()}markPotentiallyOrphaned(e,t){return this.Xr.add(t.toString()),A.resolve()}removeTarget(e,t){this.Jr.gr(t.targetId).forEach(s=>this.Xr.add(s.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(i=>this.Xr.add(i.toString()))}).next(()=>n.removeTargetData(e,t))}zr(){this.Yr=new Set}jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return A.forEach(this.Xr,n=>{const s=B.fromPath(n);return this.ei(e,s).next(i=>{i||t.removeEntry(s,K.min())})}).next(()=>(this.Yr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ei(e,t).next(n=>{n?this.Xr.delete(t.toString()):this.Xr.add(t.toString())})}Wr(e){return 0}ei(e,t){return A.or([()=>A.resolve(this.Jr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Hr(e,t)])}}class oi{constructor(e,t){this.persistence=e,this.ti=new yt(n=>Le(n.path),(n,s)=>n.isEqual(s)),this.garbageCollector=Fd(this,t)}static Zr(e,t){return new oi(e,t)}zr(){}jr(e){return A.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Yn(e){const t=this.er(e);return this.persistence.getTargetCache().getTargetCount(e).next(n=>t.next(s=>n+s))}er(e){let t=0;return this.Zn(e,n=>{t++}).next(()=>t)}Zn(e,t){return A.forEach(this.ti,(n,s)=>this.nr(e,n,s).next(i=>i?A.resolve():t(s)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.Or(e,o=>this.nr(e,o,t).next(u=>{u||(n++,i.removeEntry(o,K.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.ti.set(t,e.currentSequenceNumber),A.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.ti.set(n,e.currentSequenceNumber),A.resolve()}removeReference(e,t,n){return this.ti.set(n,e.currentSequenceNumber),A.resolve()}updateLimboDocument(e,t){return this.ti.set(t,e.currentSequenceNumber),A.resolve()}Wr(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=js(e.data.value)),t}nr(e,t,n){return A.or([()=>this.persistence.Hr(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.ti.get(t);return A.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tI{constructor(e){this.serializer=e}O(e,t,n,s){const i=new gi("createOrUpgrade",t);n<1&&s>=1&&(function(c){c.createObjectStore("owner")}(e),function(c){c.createObjectStore("mutationQueues",{keyPath:"userId"}),c.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",bc,{unique:!0}),c.createObjectStore("documentMutations")}(e),dl(e),function(c){c.createObjectStore("remoteDocuments")}(e));let o=A.resolve();return n<3&&s>=3&&(n!==0&&(function(c){c.deleteObjectStore("targetDocuments"),c.deleteObjectStore("targets"),c.deleteObjectStore("targetGlobal")}(e),dl(e)),o=o.next(()=>function(c){const h=c.store("targetGlobal"),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:K.min().toTimestamp(),targetCount:0};return h.put("targetGlobalKey",f)}(i))),n<4&&s>=4&&(n!==0&&(o=o.next(()=>function(c,h){return h.store("mutations").U().next(f=>{c.deleteObjectStore("mutations"),c.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",bc,{unique:!0});const m=h.store("mutations"),g=f.map(E=>m.put(E));return A.waitFor(g)})}(e,i))),o=o.next(()=>{(function(c){c.createObjectStore("clientMetadata",{keyPath:"clientId"})})(e)})),n<5&&s>=5&&(o=o.next(()=>this.ni(i))),n<6&&s>=6&&(o=o.next(()=>(function(c){c.createObjectStore("remoteDocumentGlobal")}(e),this.ri(i)))),n<7&&s>=7&&(o=o.next(()=>this.ii(i))),n<8&&s>=8&&(o=o.next(()=>this.si(e,i))),n<9&&s>=9&&(o=o.next(()=>{(function(c){c.objectStoreNames.contains("remoteDocumentChanges")&&c.deleteObjectStore("remoteDocumentChanges")})(e)})),n<10&&s>=10&&(o=o.next(()=>this.oi(i))),n<11&&s>=11&&(o=o.next(()=>{(function(c){c.createObjectStore("bundles",{keyPath:"bundleId"})})(e),function(c){c.createObjectStore("namedQueries",{keyPath:"name"})}(e)})),n<12&&s>=12&&(o=o.next(()=>{(function(c){const h=c.createObjectStore("documentOverlays",{keyPath:B_});h.createIndex("collectionPathOverlayIndex",U_,{unique:!1}),h.createIndex("collectionGroupOverlayIndex",q_,{unique:!1})})(e)})),n<13&&s>=13&&(o=o.next(()=>function(c){const h=c.createObjectStore("remoteDocumentsV14",{keyPath:P_});h.createIndex("documentKeyIndex",V_),h.createIndex("collectionGroupIndex",C_)}(e)).next(()=>this._i(e,i)).next(()=>e.deleteObjectStore("remoteDocuments"))),n<14&&s>=14&&(o=o.next(()=>this.ai(e,i))),n<15&&s>=15&&(o=o.next(()=>function(c){c.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),c.createObjectStore("indexState",{keyPath:O_}).createIndex("sequenceNumberIndex",M_,{unique:!1}),c.createObjectStore("indexEntries",{keyPath:F_}).createIndex("documentKeyIndex",L_,{unique:!1})}(e))),n<16&&s>=16&&(o=o.next(()=>{t.objectStore("indexState").clear()}).next(()=>{t.objectStore("indexEntries").clear()})),n<17&&s>=17&&(o=o.next(()=>{(function(c){c.createObjectStore("globals",{keyPath:"name"})})(e)})),o}ri(e){let t=0;return e.store("remoteDocuments").J((n,s)=>{t+=ii(s)}).next(()=>{const n={byteSize:t};return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",n)})}ni(e){const t=e.store("mutationQueues"),n=e.store("mutations");return t.U().next(s=>A.forEach(s,i=>{const o=IDBKeyRange.bound([i.userId,-1],[i.userId,i.lastAcknowledgedBatchId]);return n.U("userMutationsIndex",o).next(u=>A.forEach(u,c=>{G(c.userId===i.userId);const h=nn(this.serializer,c);return kd(e,i.userId,h).next(()=>{})}))}))}ii(e){const t=e.store("targetDocuments"),n=e.store("remoteDocuments");return e.store("targetGlobal").get("targetGlobalKey").next(s=>{const i=[];return n.J((o,u)=>{const c=new X(o),h=function(m){return[0,Le(m)]}(c);i.push(t.get(h).next(f=>f?A.resolve():(m=>t.put({targetId:0,path:Le(m),sequenceNumber:s.highestListenSequenceNumber}))(c)))}).next(()=>A.waitFor(i))})}si(e,t){e.createObjectStore("collectionParents",{keyPath:N_});const n=t.store("collectionParents"),s=new Ta,i=o=>{if(s.add(o)){const u=o.lastSegment(),c=o.popLast();return n.put({collectionId:u,parent:Le(c)})}};return t.store("remoteDocuments").J({H:!0},(o,u)=>{const c=new X(o);return i(c.popLast())}).next(()=>t.store("documentMutations").J({H:!0},([o,u,c],h)=>{const f=Xe(u);return i(f.popLast())}))}oi(e){const t=e.store("targets");return t.J((n,s)=>{const i=Or(s),o=Cd(this.serializer,i);return t.put(o)})}_i(e,t){const n=t.store("remoteDocuments"),s=[];return n.J((i,o)=>{const u=t.store("remoteDocumentsV14"),c=function(m){return m.document?new B(X.fromString(m.document.name).popFirst(5)):m.noDocument?B.fromSegments(m.noDocument.path):m.unknownDocument?B.fromSegments(m.unknownDocument.path):z()}(o).path.toArray(),h={prefixPath:c.slice(0,c.length-2),collectionGroup:c[c.length-2],documentId:c[c.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(u.put(h))}).next(()=>A.waitFor(s))}ai(e,t){const n=t.store("mutations"),s=Bd(this.serializer),i=new wa(bi.Zr,this.serializer.ct);return n.U().next(o=>{const u=new Map;return o.forEach(c=>{var h;let f=(h=u.get(c.userId))!==null&&h!==void 0?h:H();nn(this.serializer,c).keys().forEach(m=>f=f.add(m)),u.set(c.userId,f)}),A.forEach(u,(c,h)=>{const f=new Se(h),m=vi.lt(this.serializer,f),g=i.getIndexManager(f),E=Ai.lt(f,this.serializer,g,i.referenceDelegate);return new Ud(s,E,m,g).recalculateAndSaveOverlaysForDocumentKeys(new Do(t,je.oe),c).next()})})}}function dl(r){r.createObjectStore("targetDocuments",{keyPath:x_}).createIndex("documentTargetsIndex",k_,{unique:!0}),r.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",D_,{unique:!0}),r.createObjectStore("targetGlobal")}const Io="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class va{constructor(e,t,n,s,i,o,u,c,h,f,m=17){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.ui=i,this.window=o,this.document=u,this.ci=h,this.li=f,this.hi=m,this.Qr=null,this.Kr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Pi=null,this.inForeground=!1,this.Ii=null,this.Ti=null,this.Ei=Number.NEGATIVE_INFINITY,this.di=g=>Promise.resolve(),!va.D())throw new N(S.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new zy(this,s),this.Ai=t+"main",this.serializer=new Vd(c),this.Ri=new et(this.Ai,this.hi,new tI(this.serializer)),this.$r=new xy,this.Ur=new Uy(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Bd(this.serializer),this.Gr=new Dy,this.window&&this.window.localStorage?this.Vi=this.window.localStorage:(this.Vi=null,f===!1&&Te("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.mi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new N(S.FAILED_PRECONDITION,Io);return this.fi(),this.gi(),this.pi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Ur.getHighestSequenceNumber(e))}).then(e=>{this.Qr=new je(e,this.ci)}).then(()=>{this.Kr=!0}).catch(e=>(this.Ri&&this.Ri.close(),Promise.reject(e)))}yi(e){return this.di=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ri.L(async t=>{t.newVersion===null&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.ui.enqueueAndForget(async()=>{this.started&&await this.mi()}))}mi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>Ms(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.wi(e).next(t=>{t||(this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)))})}).next(()=>this.Si(e)).next(t=>this.isPrimary&&!t?this.bi(e).next(()=>!1):!!t&&this.Di(e).next(()=>!0))).catch(e=>{if(zt(e))return k("IndexedDbPersistence","Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return k("IndexedDbPersistence","Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.ui.enqueueRetryable(()=>this.di(e)),this.isPrimary=e})}wi(e){return Dr(e).get("owner").next(t=>A.resolve(this.vi(t)))}Ci(e){return Ms(e).delete(this.clientId)}async Fi(){if(this.isPrimary&&!this.Mi(this.Ei,18e5)){this.Ei=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const n=be(t,"clientMetadata");return n.U().next(s=>{const i=this.xi(s,18e5),o=s.filter(u=>i.indexOf(u)===-1);return A.forEach(o,u=>n.delete(u.clientId)).next(()=>o)})}).catch(()=>[]);if(this.Vi)for(const t of e)this.Vi.removeItem(this.Oi(t.clientId))}}pi(){this.Ti=this.ui.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.mi().then(()=>this.Fi()).then(()=>this.pi()))}vi(e){return!!e&&e.ownerId===this.clientId}Si(e){return this.li?A.resolve(!0):Dr(e).get("owner").next(t=>{if(t!==null&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)){if(this.vi(t)&&this.networkEnabled)return!0;if(!this.vi(t)){if(!t.allowTabSynchronization)throw new N(S.FAILED_PRECONDITION,Io);return!1}}return!(!this.networkEnabled||!this.inForeground)||Ms(e).U().next(n=>this.xi(n,5e3).find(s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,u=this.networkEnabled===s.networkEnabled;if(i||o&&u)return!0}return!1})===void 0)}).next(t=>(this.isPrimary!==t&&k("IndexedDbPersistence",`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.Kr=!1,this.Li(),this.Ti&&(this.Ti.cancel(),this.Ti=null),this.Bi(),this.ki(),await this.Ri.runTransaction("shutdown","readwrite",["owner","clientMetadata"],e=>{const t=new Do(e,je.oe);return this.bi(t).next(()=>this.Ci(t))}),this.Ri.close(),this.qi()}xi(e,t){return e.filter(n=>this.Mi(n.updateTimeMs,t)&&!this.Ni(n.clientId))}Qi(){return this.runTransaction("getActiveClients","readonly",e=>Ms(e).U().next(t=>this.xi(t,18e5).map(n=>n.clientId)))}get started(){return this.Kr}getGlobalsCache(){return this.$r}getMutationQueue(e,t){return Ai.lt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new By(e,this.serializer.ct.databaseId)}getDocumentOverlayCache(e){return vi.lt(this.serializer,e)}getBundleCache(){return this.Gr}runTransaction(e,t,n){k("IndexedDbPersistence","Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=function(c){return c===17?G_:c===16?z_:c===15?aa:c===14?Nh:c===13?kh:c===12?j_:c===11?xh:void z()}(this.hi);let o;return this.Ri.runTransaction(e,s,i,u=>(o=new Do(u,this.Qr?this.Qr.next():je.oe),t==="readwrite-primary"?this.wi(o).next(c=>!!c||this.Si(o)).next(c=>{if(!c)throw Te(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)),new N(S.FAILED_PRECONDITION,Sh);return n(o)}).next(c=>this.Di(o).next(()=>c)):this.Ki(o).next(()=>n(o)))).then(u=>(o.raiseOnCommittedEvent(),u))}Ki(e){return Dr(e).get("owner").next(t=>{if(t!==null&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)&&!this.vi(t)&&!(this.li||this.allowTabSynchronization&&t.allowTabSynchronization))throw new N(S.FAILED_PRECONDITION,Io)})}Di(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Dr(e).put("owner",t)}static D(){return et.D()}bi(e){const t=Dr(e);return t.get("owner").next(n=>this.vi(n)?(k("IndexedDbPersistence","Releasing primary lease."),t.delete("owner")):A.resolve())}Mi(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(Te(`Detected an update time that is in the future: ${e} > ${n}`),!1))}fi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Ii=()=>{this.ui.enqueueAndForget(()=>(this.inForeground=this.document.visibilityState==="visible",this.mi()))},this.document.addEventListener("visibilitychange",this.Ii),this.inForeground=this.document.visibilityState==="visible")}Bi(){this.Ii&&(this.document.removeEventListener("visibilitychange",this.Ii),this.Ii=null)}gi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.Pi=()=>{this.Li();const t=/(?:Version|Mobile)\/1[456]/;Bl()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.ui.enterRestrictedMode(!0),this.ui.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Pi))}ki(){this.Pi&&(this.window.removeEventListener("pagehide",this.Pi),this.Pi=null)}Ni(e){var t;try{const n=((t=this.Vi)===null||t===void 0?void 0:t.getItem(this.Oi(e)))!==null;return k("IndexedDbPersistence",`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Te("IndexedDbPersistence","Failed to get zombied client id.",n),!1}}Li(){if(this.Vi)try{this.Vi.setItem(this.Oi(this.clientId),String(Date.now()))}catch(e){Te("Failed to set zombie client id.",e)}}qi(){if(this.Vi)try{this.Vi.removeItem(this.Oi(this.clientId))}catch{}}Oi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Dr(r){return be(r,"owner")}function Ms(r){return be(r,"clientMetadata")}function Aa(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ba{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.$i=n,this.Ui=s}static Wi(e,t){let n=H(),s=H();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new ba(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nI{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=function(){return Bl()?8:Vh(Un())>0?6:4}()}initialize(e,t){this.Ji=e,this.indexManager=t,this.Gi=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.Yi(e,t).next(o=>{i.result=o}).next(()=>{if(!i.result)return this.Zi(e,t,s,n).next(o=>{i.result=o})}).next(()=>{if(i.result)return;const o=new nI;return this.Xi(e,t,o).next(u=>{if(i.result=u,this.zi)return this.es(e,t,o,u.size)})}).next(()=>i.result)}es(e,t,n,s){return n.documentReadCount<this.ji?(Nn()<=te.DEBUG&&k("QueryEngine","SDK will not create cache indexes for query:",On(t),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),A.resolve()):(Nn()<=te.DEBUG&&k("QueryEngine","Query:",On(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.Hi*s?(Nn()<=te.DEBUG&&k("QueryEngine","The SDK decides to create cache indexes for query:",On(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Be(t))):A.resolve())}Yi(e,t){if(Lc(t))return A.resolve(null);let n=Be(t);return this.indexManager.getIndexType(e,n).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=ti(t,null,"F"),n=Be(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(i=>{const o=H(...i);return this.Ji.getDocuments(e,o).next(u=>this.indexManager.getMinOffset(e,n).next(c=>{const h=this.ts(t,u);return this.ns(t,h,o,c.readTime)?this.Yi(e,ti(t,null,"F")):this.rs(e,h,t,c)}))})))}Zi(e,t,n,s){return Lc(t)||s.isEqual(K.min())?A.resolve(null):this.Ji.getDocuments(e,n).next(i=>{const o=this.ts(t,i);return this.ns(t,o,n,s)?A.resolve(null):(Nn()<=te.DEBUG&&k("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),On(t)),this.rs(e,o,t,bh(s,-1)).next(u=>u))})}ts(e,t){let n=new se(Zh(e));return t.forEach((s,i)=>{rs(e,i)&&(n=n.add(i))}),n}ns(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Xi(e,t,n){return Nn()<=te.DEBUG&&k("QueryEngine","Using full collection scan to execute query:",On(t)),this.Ji.getDocumentsMatchingQuery(e,t,We.min(),n)}rs(e,t,n,s){return this.Ji.getDocumentsMatchingQuery(e,n,s).next(i=>(t.forEach(o=>{i=i.insert(o.key,o)}),i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rI{constructor(e,t,n,s){this.persistence=e,this.ss=t,this.serializer=s,this.os=new ue(Q),this._s=new yt(i=>mn(i),ts),this.us=new Map,this.cs=e.getRemoteDocumentCache(),this.Ur=e.getTargetCache(),this.Gr=e.getBundleCache(),this.ls(n)}ls(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Ud(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.os))}}function jd(r,e,t,n){return new rI(r,e,t,n)}async function zd(r,e){const t=F(r);return await t.persistence.runTransaction("Handle user change","readonly",n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next(i=>(s=i,t.ls(e),t.mutationQueue.getAllMutationBatches(n))).next(i=>{const o=[],u=[];let c=H();for(const h of s){o.push(h.batchId);for(const f of h.mutations)c=c.add(f.key)}for(const h of i){u.push(h.batchId);for(const f of h.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(n,c).next(h=>({hs:h,removedBatchIds:o,addedBatchIds:u}))})})}function sI(r,e){const t=F(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",n=>{const s=e.batch.keys(),i=t.cs.newChangeBuffer({trackRemovals:!0});return function(u,c,h,f){const m=h.batch,g=m.keys();let E=A.resolve();return g.forEach(V=>{E=E.next(()=>f.getEntry(c,V)).next(C=>{const D=h.docVersions.get(V);G(D!==null),C.version.compareTo(D)<0&&(m.applyToRemoteDocument(C,h),C.isValidDocument()&&(C.setReadTime(h.commitVersion),f.addEntry(C)))})}),E.next(()=>u.mutationQueue.removeMutationBatch(c,m))}(t,n,e,i).next(()=>i.apply(n)).next(()=>t.mutationQueue.performConsistencyCheck(n)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,function(u){let c=H();for(let h=0;h<u.mutationResults.length;++h)u.mutationResults[h].transformResults.length>0&&(c=c.add(u.batch.mutations[h].key));return c}(e))).next(()=>t.localDocuments.getDocuments(n,s))})}function Gd(r){const e=F(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function iI(r,e){const t=F(r),n=e.snapshotVersion;let s=t.os;return t.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{const o=t.cs.newChangeBuffer({trackRemovals:!0});s=t.os;const u=[];e.targetChanges.forEach((f,m)=>{const g=s.get(m);if(!g)return;u.push(t.Ur.removeMatchingKeys(i,f.removedDocuments,m).next(()=>t.Ur.addMatchingKeys(i,f.addedDocuments,m)));let E=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(m)!==null?E=E.withResumeToken(ye.EMPTY_BYTE_STRING,K.min()).withLastLimboFreeSnapshotVersion(K.min()):f.resumeToken.approximateByteSize()>0&&(E=E.withResumeToken(f.resumeToken,n)),s=s.insert(m,E),function(C,D,M){return C.resumeToken.approximateByteSize()===0||D.snapshotVersion.toMicroseconds()-C.snapshotVersion.toMicroseconds()>=3e8?!0:M.addedDocuments.size+M.modifiedDocuments.size+M.removedDocuments.size>0}(g,E,f)&&u.push(t.Ur.updateTargetData(i,E))});let c=Ge(),h=H();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(i,f))}),u.push($d(i,o,e.documentUpdates).next(f=>{c=f.Ps,h=f.Is})),!n.isEqual(K.min())){const f=t.Ur.getLastRemoteSnapshotVersion(i).next(m=>t.Ur.setTargetsMetadata(i,i.currentSequenceNumber,n));u.push(f)}return A.waitFor(u).next(()=>o.apply(i)).next(()=>t.localDocuments.getLocalViewOfDocuments(i,c,h)).next(()=>c)}).then(i=>(t.os=s,i))}function $d(r,e,t){let n=H(),s=H();return t.forEach(i=>n=n.add(i)),e.getEntries(r,n).next(i=>{let o=Ge();return t.forEach((u,c)=>{const h=i.get(u);c.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(u)),c.isNoDocument()&&c.version.isEqual(K.min())?(e.removeEntry(u,c.readTime),o=o.insert(u,c)):!h.isValidDocument()||c.version.compareTo(h.version)>0||c.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(c),o=o.insert(u,c)):k("LocalStore","Ignoring outdated watch update for ",u,". Current version:",h.version," Watch version:",c.version)}),{Ps:o,Is:s}})}function oI(r,e){const t=F(r);return t.persistence.runTransaction("Get next mutation batch","readonly",n=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e)))}function Hn(r,e){const t=F(r);return t.persistence.runTransaction("Allocate target","readwrite",n=>{let s;return t.Ur.getTargetData(n,e).next(i=>i?(s=i,A.resolve(s)):t.Ur.allocateTargetId(n).next(o=>(s=new ht(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.Ur.addTargetData(n,s).next(()=>s))))}).then(n=>{const s=t.os.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.os=t.os.insert(n.targetId,n),t._s.set(e,n.targetId)),n})}async function Jn(r,e,t){const n=F(r),s=n.os.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,o=>n.persistence.referenceDelegate.removeTarget(o,s))}catch(o){if(!zt(o))throw o;k("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}n.os=n.os.remove(e),n._s.delete(s.target)}function ai(r,e,t){const n=F(r);let s=K.min(),i=H();return n.persistence.runTransaction("Execute query","readwrite",o=>function(c,h,f){const m=F(c),g=m._s.get(f);return g!==void 0?A.resolve(m.os.get(g)):m.Ur.getTargetData(h,f)}(n,o,Be(e)).next(u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,n.Ur.getMatchingKeysForTargetId(o,u.targetId).next(c=>{i=c})}).next(()=>n.ss.getDocumentsMatchingQuery(o,e,t?s:K.min(),t?i:H())).next(u=>(Wd(n,Xh(e),u),{documents:u,Ts:i})))}function Kd(r,e){const t=F(r),n=F(t.Ur),s=t.os.get(e);return s?Promise.resolve(s.target):t.persistence.runTransaction("Get target data","readonly",i=>n.ot(i,e).next(o=>o?o.target:null))}function Qd(r,e){const t=F(r),n=t.us.get(e)||K.min();return t.persistence.runTransaction("Get new document changes","readonly",s=>t.cs.getAllFromCollectionGroup(s,e,bh(n,-1),Number.MAX_SAFE_INTEGER)).then(s=>(Wd(t,e,s),s))}function Wd(r,e,t){let n=r.us.get(e)||K.min();t.forEach((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)}),r.us.set(e,n)}async function aI(r,e,t,n){const s=F(r);let i=H(),o=Ge();for(const h of t){const f=e.Es(h.metadata.name);h.document&&(i=i.add(f));const m=e.ds(h);m.setReadTime(e.As(h.metadata.readTime)),o=o.insert(f,m)}const u=s.cs.newChangeBuffer({trackRemovals:!0}),c=await Hn(s,function(f){return Be(sr(X.fromString(`__bundle__/docs/${f}`)))}(n));return s.persistence.runTransaction("Apply bundle documents","readwrite",h=>$d(h,u,o).next(f=>(u.apply(h),f)).next(f=>s.Ur.removeMatchingKeysForTargetId(h,c.targetId).next(()=>s.Ur.addMatchingKeys(h,i,c.targetId)).next(()=>s.localDocuments.getLocalViewOfDocuments(h,f.Ps,f.Is)).next(()=>f.Ps)))}async function uI(r,e,t=H()){const n=await Hn(r,Be(ya(e.bundledQuery))),s=F(r);return s.persistence.runTransaction("Save named query","readwrite",i=>{const o=Ee(e.readTime);if(n.snapshotVersion.compareTo(o)>=0)return s.Gr.saveNamedQuery(i,e);const u=n.withResumeToken(ye.EMPTY_BYTE_STRING,o);return s.os=s.os.insert(u.targetId,u),s.Ur.updateTargetData(i,u).next(()=>s.Ur.removeMatchingKeysForTargetId(i,n.targetId)).next(()=>s.Ur.addMatchingKeys(i,t,n.targetId)).next(()=>s.Gr.saveNamedQuery(i,e))})}function fl(r,e){return`firestore_clients_${r}_${e}`}function ml(r,e,t){let n=`firestore_mutations_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}function To(r,e){return`firestore_targets_${r}_${e}`}class ui{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static Rs(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new N(s.error.code,s.error.message))),o?new ui(e,t,s.state,i):(Te("SharedClientState",`Failed to parse mutation state for ID '${t}': ${n}`),null)}Vs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class qr{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Rs(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new N(n.error.code,n.error.message))),i?new qr(e,n.state,s):(Te("SharedClientState",`Failed to parse target state for ID '${e}': ${t}`),null)}Vs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class ci{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Rs(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=la();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=Ch(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new ci(e,i):(Te("SharedClientState",`Failed to parse client data for instance '${e}': ${t}`),null)}}class Ra{constructor(e,t){this.clientId=e,this.onlineState=t}static Rs(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new Ra(t.clientId,t.onlineState):(Te("SharedClientState",`Failed to parse online state: ${e}`),null)}}class $o{constructor(){this.activeTargetIds=la()}fs(e){this.activeTargetIds=this.activeTargetIds.add(e)}gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Vs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Eo{constructor(e,t,n,s,i){this.window=e,this.ui=t,this.persistenceKey=n,this.ps=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.ys=this.ws.bind(this),this.Ss=new ue(Q),this.started=!1,this.bs=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Ds=fl(this.persistenceKey,this.ps),this.vs=function(c){return`firestore_sequence_number_${c}`}(this.persistenceKey),this.Ss=this.Ss.insert(this.ps,new $o),this.Cs=new RegExp(`^firestore_clients_${o}_([^_]*)$`),this.Fs=new RegExp(`^firestore_mutations_${o}_(\\d+)(?:_(.*))?$`),this.Ms=new RegExp(`^firestore_targets_${o}_(\\d+)$`),this.xs=function(c){return`firestore_online_state_${c}`}(this.persistenceKey),this.Os=function(c){return`firestore_bundle_loaded_v2_${c}`}(this.persistenceKey),this.window.addEventListener("storage",this.ys)}static D(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Qi();for(const n of e){if(n===this.ps)continue;const s=this.getItem(fl(this.persistenceKey,n));if(s){const i=ci.Rs(n,s);i&&(this.Ss=this.Ss.insert(i.clientId,i))}}this.Ns();const t=this.storage.getItem(this.xs);if(t){const n=this.Ls(t);n&&this.Bs(n)}for(const n of this.bs)this.ws(n);this.bs=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.vs,JSON.stringify(e))}getAllActiveQueryTargets(){return this.ks(this.Ss)}isActiveQueryTarget(e){let t=!1;return this.Ss.forEach((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.qs(e,"pending")}updateMutationState(e,t,n){this.qs(e,t,n),this.Qs(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(To(this.persistenceKey,e));if(s){const i=qr.Rs(e,s);i&&(n=i.state)}}return t&&this.Ks.fs(e),this.Ns(),n}removeLocalQueryTarget(e){this.Ks.gs(e),this.Ns()}isLocalQueryTarget(e){return this.Ks.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(To(this.persistenceKey,e))}updateQueryState(e,t,n){this.$s(e,t,n)}handleUserChange(e,t,n){t.forEach(s=>{this.Qs(s)}),this.currentUser=e,n.forEach(s=>{this.addPendingMutation(s)})}setOnlineState(e){this.Us(e)}notifyBundleLoaded(e){this.Ws(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.ys),this.removeItem(this.Ds),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return k("SharedClientState","READ",e,t),t}setItem(e,t){k("SharedClientState","SET",e,t),this.storage.setItem(e,t)}removeItem(e){k("SharedClientState","REMOVE",e),this.storage.removeItem(e)}ws(e){const t=e;if(t.storageArea===this.storage){if(k("SharedClientState","EVENT",t.key,t.newValue),t.key===this.Ds)return void Te("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.ui.enqueueRetryable(async()=>{if(this.started){if(t.key!==null){if(this.Cs.test(t.key)){if(t.newValue==null){const n=this.Gs(t.key);return this.zs(n,null)}{const n=this.js(t.key,t.newValue);if(n)return this.zs(n.clientId,n)}}else if(this.Fs.test(t.key)){if(t.newValue!==null){const n=this.Hs(t.key,t.newValue);if(n)return this.Js(n)}}else if(this.Ms.test(t.key)){if(t.newValue!==null){const n=this.Ys(t.key,t.newValue);if(n)return this.Zs(n)}}else if(t.key===this.xs){if(t.newValue!==null){const n=this.Ls(t.newValue);if(n)return this.Bs(n)}}else if(t.key===this.vs){const n=function(i){let o=je.oe;if(i!=null)try{const u=JSON.parse(i);G(typeof u=="number"),o=u}catch(u){Te("SharedClientState","Failed to read sequence number from WebStorage",u)}return o}(t.newValue);n!==je.oe&&this.sequenceNumberHandler(n)}else if(t.key===this.Os){const n=this.Xs(t.newValue);await Promise.all(n.map(s=>this.syncEngine.eo(s)))}}}else this.bs.push(t)})}}get Ks(){return this.Ss.get(this.ps)}Ns(){this.setItem(this.Ds,this.Ks.Vs())}qs(e,t,n){const s=new ui(this.currentUser,e,t,n),i=ml(this.persistenceKey,this.currentUser,e);this.setItem(i,s.Vs())}Qs(e){const t=ml(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Us(e){const t={clientId:this.ps,onlineState:e};this.storage.setItem(this.xs,JSON.stringify(t))}$s(e,t,n){const s=To(this.persistenceKey,e),i=new qr(e,t,n);this.setItem(s,i.Vs())}Ws(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Os,t)}Gs(e){const t=this.Cs.exec(e);return t?t[1]:null}js(e,t){const n=this.Gs(e);return ci.Rs(n,t)}Hs(e,t){const n=this.Fs.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return ui.Rs(new Se(i),s,t)}Ys(e,t){const n=this.Ms.exec(e),s=Number(n[1]);return qr.Rs(s,t)}Ls(e){return Ra.Rs(e)}Xs(e){return JSON.parse(e)}async Js(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.no(e.batchId,e.state,e.error);k("SharedClientState",`Ignoring mutation for non-active user ${e.user.uid}`)}Zs(e){return this.syncEngine.ro(e.targetId,e.state,e.error)}zs(e,t){const n=t?this.Ss.insert(e,t):this.Ss.remove(e),s=this.ks(this.Ss),i=this.ks(n),o=[],u=[];return i.forEach(c=>{s.has(c)||o.push(c)}),s.forEach(c=>{i.has(c)||u.push(c)}),this.syncEngine.io(o,u).then(()=>{this.Ss=n})}Bs(e){this.Ss.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}ks(e){let t=la();return e.forEach((n,s)=>{t=t.unionWith(s.activeTargetIds)}),t}}class Hd{constructor(){this.so=new $o,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.so.fs(e),this.oo[e]||"not-current"}updateQueryState(e,t,n){this.oo[e]=t}removeLocalQueryTarget(e){this.so.gs(e)}isLocalQueryTarget(e){return this.so.activeTargetIds.has(e)}clearQueryState(e){delete this.oo[e]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(e){return this.so.activeTargetIds.has(e)}start(){return this.so=new $o,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cI{_o(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(e){this.ho.push(e)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){k("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.ho)e(0)}lo(){k("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.ho)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Fs=null;function wo(){return Fs===null?Fs=function(){return 268435456+Math.round(2147483648*Math.random())}():Fs++,"0x"+Fs.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hI{constructor(e){this.Io=e.Io,this.To=e.To}Eo(e){this.Ao=e}Ro(e){this.Vo=e}mo(e){this.fo=e}onMessage(e){this.po=e}close(){this.To()}send(e){this.Io(e)}yo(){this.Ao()}wo(){this.Vo()}So(e){this.fo(e)}bo(e){this.po(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me="WebChannelConnection";class dI extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const n=t.ssl?"https":"http",s=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Do=n+"://"+t.host,this.vo=`projects/${s}/databases/${i}`,this.Co=this.databaseId.database==="(default)"?`project_id=${s}`:`project_id=${s}&database_id=${i}`}get Fo(){return!1}Mo(t,n,s,i,o){const u=wo(),c=this.xo(t,n.toUriEncodedString());k("RestConnection",`Sending RPC '${t}' ${u}:`,c,s);const h={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(h,i,o),this.No(t,c,h,s).then(f=>(k("RestConnection",`Received RPC '${t}' ${u}: `,f),f),f=>{throw Je("RestConnection",`RPC '${t}' ${u} failed with error: `,f,"url: ",c,"request:",s),f})}Lo(t,n,s,i,o,u){return this.Mo(t,n,s,i,o)}Oo(t,n,s){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+rr}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,o)=>t[o]=i),s&&s.headers.forEach((i,o)=>t[o]=i)}xo(t,n){const s=lI[t];return`${this.Do}/v1/${n}:${s}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}No(e,t,n,s){const i=wo();return new Promise((o,u)=>{const c=new gh;c.setWithCredentials(!0),c.listenOnce(_h.COMPLETE,()=>{try{switch(c.getLastErrorCode()){case Bs.NO_ERROR:const f=c.getResponseJson();k(Me,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(f)),o(f);break;case Bs.TIMEOUT:k(Me,`RPC '${e}' ${i} timed out`),u(new N(S.DEADLINE_EXCEEDED,"Request time out"));break;case Bs.HTTP_ERROR:const m=c.getStatus();if(k(Me,`RPC '${e}' ${i} failed with status:`,m,"response text:",c.getResponseText()),m>0){let g=c.getResponseJson();Array.isArray(g)&&(g=g[0]);const E=g==null?void 0:g.error;if(E&&E.status&&E.message){const V=function(D){const M=D.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(M)>=0?M:S.UNKNOWN}(E.status);u(new N(V,E.message))}else u(new N(S.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new N(S.UNAVAILABLE,"Connection failed."));break;default:z()}}finally{k(Me,`RPC '${e}' ${i} completed.`)}});const h=JSON.stringify(s);k(Me,`RPC '${e}' ${i} sending request:`,s),c.send(t,"POST",h,n,15)})}Bo(e,t,n){const s=wo(),i=[this.Do,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=Th(),u=Ih(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(c.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(c.useFetchStreams=!0),this.Oo(c.initMessageHeaders,t,n),c.encodeInitMessageHeaders=!0;const f=i.join("");k(Me,`Creating RPC '${e}' stream ${s}: ${f}`,c);const m=o.createWebChannel(f,c);let g=!1,E=!1;const V=new hI({Io:D=>{E?k(Me,`Not sending because RPC '${e}' stream ${s} is closed:`,D):(g||(k(Me,`Opening RPC '${e}' stream ${s} transport.`),m.open(),g=!0),k(Me,`RPC '${e}' stream ${s} sending:`,D),m.send(D))},To:()=>m.close()}),C=(D,M,U)=>{D.listen(M,O=>{try{U(O)}catch(q){setTimeout(()=>{throw q},0)}})};return C(m,xr.EventType.OPEN,()=>{E||(k(Me,`RPC '${e}' stream ${s} transport opened.`),V.yo())}),C(m,xr.EventType.CLOSE,()=>{E||(E=!0,k(Me,`RPC '${e}' stream ${s} transport closed`),V.So())}),C(m,xr.EventType.ERROR,D=>{E||(E=!0,Je(Me,`RPC '${e}' stream ${s} transport errored:`,D),V.So(new N(S.UNAVAILABLE,"The operation could not be completed")))}),C(m,xr.EventType.MESSAGE,D=>{var M;if(!E){const U=D.data[0];G(!!U);const O=U,q=O.error||((M=O[0])===null||M===void 0?void 0:M.error);if(q){k(Me,`RPC '${e}' stream ${s} received error:`,q);const $=q.status;let x=function(T){const w=ve[T];if(w!==void 0)return fd(w)}($),y=q.message;x===void 0&&(x=S.INTERNAL,y="Unknown error status: "+$+" with message "+q.message),E=!0,V.So(new N(x,y)),m.close()}else k(Me,`RPC '${e}' stream ${s} received:`,U),V.bo(U)}}),C(u,yh.STAT_EVENT,D=>{D.stat===Vo.PROXY?k(Me,`RPC '${e}' stream ${s} detected buffering proxy`):D.stat===Vo.NOPROXY&&k(Me,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{V.wo()},0),V}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jd(){return typeof window<"u"?window:null}function Ks(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function as(r){return new Ty(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sa{constructor(e,t,n=1e3,s=1.5,i=6e4){this.ui=e,this.timerId=t,this.ko=n,this.qo=s,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const t=Math.floor(this.Ko+this.zo()),n=Math.max(0,Date.now()-this.Uo),s=Math.max(0,t-n);s>0&&k("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Ko} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,s,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yd{constructor(e,t,n,s,i,o,u,c){this.ui=e,this.Ho=n,this.Jo=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=u,this.listener=c,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Sa(e,t)}n_(){return this.state===1||this.state===5||this.r_()}r_(){return this.state===2||this.state===3}start(){this.e_=0,this.state!==4?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&this.Zo===null&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(e){this.u_(),this.stream.send(e)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(e,t){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,e!==4?this.t_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(Te(t.toString()),Te("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.l_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.mo(t)}l_(){}auth(){this.state=1;const e=this.h_(this.Yo),t=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([n,s])=>{this.Yo===t&&this.P_(n,s)},n=>{e(()=>{const s=new N(S.UNKNOWN,"Fetching auth token failed: "+n.message);return this.I_(s)})})}P_(e,t){const n=this.h_(this.Yo);this.stream=this.T_(e,t),this.stream.Eo(()=>{n(()=>this.listener.Eo())}),this.stream.Ro(()=>{n(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(s=>{n(()=>this.I_(s))}),this.stream.onMessage(s=>{n(()=>++this.e_==1?this.E_(s):this.onNext(s))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(e){return k("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}h_(e){return t=>{this.ui.enqueueAndForget(()=>this.Yo===e?t():(k("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class fI extends Yd{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}T_(e,t){return this.connection.Bo("Listen",e,t)}E_(e){return this.onNext(e)}onNext(e){this.t_.reset();const t=vy(this.serializer,e),n=function(i){if(!("targetChange"in i))return K.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?K.min():o.readTime?Ee(o.readTime):K.min()}(e);return this.listener.d_(t,n)}A_(e){const t={};t.database=Uo(this.serializer),t.addTarget=function(i,o){let u;const c=o.target;if(u=Zs(c)?{documents:vd(i,c)}:{query:wi(i,c)._t},u.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){u.resumeToken=_d(i,o.resumeToken);const h=Lo(i,o.expectedCount);h!==null&&(u.expectedCount=h)}else if(o.snapshotVersion.compareTo(K.min())>0){u.readTime=Wn(i,o.snapshotVersion.toTimestamp());const h=Lo(i,o.expectedCount);h!==null&&(u.expectedCount=h)}return u}(this.serializer,e);const n=by(this.serializer,e);n&&(t.labels=n),this.a_(t)}R_(e){const t={};t.database=Uo(this.serializer),t.removeTarget=e,this.a_(t)}}class mI extends Yd{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(e,t){return this.connection.Bo("Write",e,t)}E_(e){return G(!!e.streamToken),this.lastStreamToken=e.streamToken,G(!e.writeResults||e.writeResults.length===0),this.listener.f_()}onNext(e){G(!!e.streamToken),this.lastStreamToken=e.streamToken,this.t_.reset();const t=Ay(e.writeResults,e.commitTime),n=Ee(e.commitTime);return this.listener.g_(n,t)}p_(){const e={};e.database=Uo(this.serializer),this.a_(e)}m_(e){const t={streamToken:this.lastStreamToken,writes:e.map(n=>Jr(this.serializer,n))};this.a_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pI extends class{}{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.y_=!1}w_(){if(this.y_)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(e,t,n,s){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Mo(e,Bo(t,n),s,i,o)).catch(i=>{throw i.name==="FirebaseError"?(i.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new N(S.UNKNOWN,i.toString())})}Lo(e,t,n,s,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,u])=>this.connection.Lo(e,Bo(t,n),s,o,u,i)).catch(o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(S.UNKNOWN,o.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class gI{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){this.S_===0&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(e){this.state==="Online"?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.x_(),this.S_=0,e==="Online"&&(this.D_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}F_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(Te(t),this.D_=!1):k("OnlineStateTracker",t)}x_(){this.b_!==null&&(this.b_.cancel(),this.b_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _I{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(o=>{n.enqueueAndForget(async()=>{$t(this)&&(k("RemoteStore","Restarting streams for network reachability change."),await async function(c){const h=F(c);h.L_.add(4),await ar(h),h.q_.set("Unknown"),h.L_.delete(4),await us(h)}(this))})}),this.q_=new gI(n,s)}}async function us(r){if($t(r))for(const e of r.B_)await e(!0)}async function ar(r){for(const e of r.B_)await e(!1)}function Ri(r,e){const t=F(r);t.N_.has(e.targetId)||(t.N_.set(e.targetId,e),Ca(t)?Va(t):cr(t).r_()&&Pa(t,e))}function Yn(r,e){const t=F(r),n=cr(t);t.N_.delete(e),n.r_()&&Xd(t,e),t.N_.size===0&&(n.r_()?n.o_():$t(t)&&t.q_.set("Unknown"))}function Pa(r,e){if(r.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(K.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}cr(r).A_(e)}function Xd(r,e){r.Q_.xe(e),cr(r).R_(e)}function Va(r){r.Q_=new gy({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>r.N_.get(e)||null,tt:()=>r.datastore.serializer.databaseId}),cr(r).start(),r.q_.v_()}function Ca(r){return $t(r)&&!cr(r).n_()&&r.N_.size>0}function $t(r){return F(r).L_.size===0}function Zd(r){r.Q_=void 0}async function yI(r){r.q_.set("Online")}async function II(r){r.N_.forEach((e,t)=>{Pa(r,e)})}async function TI(r,e){Zd(r),Ca(r)?(r.q_.M_(e),Va(r)):r.q_.set("Unknown")}async function EI(r,e,t){if(r.q_.set("Online"),e instanceof gd&&e.state===2&&e.cause)try{await async function(s,i){const o=i.cause;for(const u of i.targetIds)s.N_.has(u)&&(await s.remoteSyncer.rejectListen(u,o),s.N_.delete(u),s.Q_.removeTarget(u))}(r,e)}catch(n){k("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),n),await li(r,n)}else if(e instanceof $s?r.Q_.Ke(e):e instanceof pd?r.Q_.He(e):r.Q_.We(e),!t.isEqual(K.min()))try{const n=await Gd(r.localStore);t.compareTo(n)>=0&&await function(i,o){const u=i.Q_.rt(o);return u.targetChanges.forEach((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const f=i.N_.get(h);f&&i.N_.set(h,f.withResumeToken(c.resumeToken,o))}}),u.targetMismatches.forEach((c,h)=>{const f=i.N_.get(c);if(!f)return;i.N_.set(c,f.withResumeToken(ye.EMPTY_BYTE_STRING,f.snapshotVersion)),Xd(i,c);const m=new ht(f.target,c,h,f.sequenceNumber);Pa(i,m)}),i.remoteSyncer.applyRemoteEvent(u)}(r,t)}catch(n){k("RemoteStore","Failed to raise snapshot:",n),await li(r,n)}}async function li(r,e,t){if(!zt(e))throw e;r.L_.add(1),await ar(r),r.q_.set("Offline"),t||(t=()=>Gd(r.localStore)),r.asyncQueue.enqueueRetryable(async()=>{k("RemoteStore","Retrying IndexedDB access"),await t(),r.L_.delete(1),await us(r)})}function ef(r,e){return e().catch(t=>li(r,t,e))}async function ur(r){const e=F(r),t=Lt(e);let n=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;wI(e);)try{const s=await oI(e.localStore,n);if(s===null){e.O_.length===0&&t.o_();break}n=s.batchId,vI(e,s)}catch(s){await li(e,s)}tf(e)&&nf(e)}function wI(r){return $t(r)&&r.O_.length<10}function vI(r,e){r.O_.push(e);const t=Lt(r);t.r_()&&t.V_&&t.m_(e.mutations)}function tf(r){return $t(r)&&!Lt(r).n_()&&r.O_.length>0}function nf(r){Lt(r).start()}async function AI(r){Lt(r).p_()}async function bI(r){const e=Lt(r);for(const t of r.O_)e.m_(t.mutations)}async function RI(r,e,t){const n=r.O_.shift(),s=ma.from(n,e,t);await ef(r,()=>r.remoteSyncer.applySuccessfulWrite(s)),await ur(r)}async function SI(r,e){e&&Lt(r).V_&&await async function(n,s){if(function(o){return dd(o)&&o!==S.ABORTED}(s.code)){const i=n.O_.shift();Lt(n).s_(),await ef(n,()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s)),await ur(n)}}(r,e),tf(r)&&nf(r)}async function gl(r,e){const t=F(r);t.asyncQueue.verifyOperationInProgress(),k("RemoteStore","RemoteStore received new credentials");const n=$t(t);t.L_.add(3),await ar(t),n&&t.q_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.L_.delete(3),await us(t)}async function Ko(r,e){const t=F(r);e?(t.L_.delete(2),await us(t)):e||(t.L_.add(2),await ar(t),t.q_.set("Unknown"))}function cr(r){return r.K_||(r.K_=function(t,n,s){const i=F(t);return i.w_(),new fI(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{Eo:yI.bind(null,r),Ro:II.bind(null,r),mo:TI.bind(null,r),d_:EI.bind(null,r)}),r.B_.push(async e=>{e?(r.K_.s_(),Ca(r)?Va(r):r.q_.set("Unknown")):(await r.K_.stop(),Zd(r))})),r.K_}function Lt(r){return r.U_||(r.U_=function(t,n,s){const i=F(t);return i.w_(),new mI(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)}(r.datastore,r.asyncQueue,{Eo:()=>Promise.resolve(),Ro:AI.bind(null,r),mo:SI.bind(null,r),f_:bI.bind(null,r),g_:RI.bind(null,r)}),r.B_.push(async e=>{e?(r.U_.s_(),await ur(r)):(await r.U_.stop(),r.O_.length>0&&(k("RemoteStore",`Stopping write stream with ${r.O_.length} pending writes`),r.O_=[]))})),r.U_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Da{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new Pe,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,u=new Da(e,t,o,s,i);return u.start(n),u}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function lr(r,e){if(Te("AsyncQueue",`${e}: ${r}`),zt(r))return new N(S.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bn{constructor(e){this.comparator=e?(t,n)=>e(t,n)||B.comparator(t.key,n.key):(t,n)=>B.comparator(t.key,n.key),this.keyedMap=kr(),this.sortedSet=new ue(this.comparator)}static emptySet(e){return new Bn(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Bn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Bn;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(){this.W_=new ue(B.comparator)}track(e){const t=e.doc.key,n=this.W_.get(t);n?e.type!==0&&n.type===3?this.W_=this.W_.insert(t,e):e.type===3&&n.type!==1?this.W_=this.W_.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.W_=this.W_.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.W_=this.W_.remove(t):e.type===1&&n.type===2?this.W_=this.W_.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.W_=this.W_.insert(t,{type:2,doc:e.doc}):z():this.W_=this.W_.insert(t,e)}G_(){const e=[];return this.W_.inorderTraversal((t,n)=>{e.push(n)}),e}}class Xn{constructor(e,t,n,s,i,o,u,c,h){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=u,this.excludesMetadataChanges=c,this.hasCachedResults=h}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach(u=>{o.push({type:0,doc:u})}),new Xn(e,t,Bn.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&ns(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PI{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(e=>e.J_())}}class VI{constructor(){this.queries=yl(),this.onlineState="Unknown",this.Y_=new Set}terminate(){(function(t,n){const s=F(t),i=s.queries;s.queries=yl(),i.forEach((o,u)=>{for(const c of u.j_)c.onError(n)})})(this,new N(S.ABORTED,"Firestore shutting down"))}}function yl(){return new yt(r=>Yh(r),ns)}async function xa(r,e){const t=F(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.H_()&&e.J_()&&(n=2):(i=new PI,n=e.J_()?0:1);try{switch(n){case 0:i.z_=await t.onListen(s,!0);break;case 1:i.z_=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const u=lr(o,`Initialization of query '${On(e.query)}' failed`);return void e.onError(u)}t.queries.set(s,i),i.j_.push(e),e.Z_(t.onlineState),i.z_&&e.X_(i.z_)&&Na(t)}async function ka(r,e){const t=F(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.j_.indexOf(e);o>=0&&(i.j_.splice(o,1),i.j_.length===0?s=e.J_()?0:1:!i.H_()&&e.J_()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function CI(r,e){const t=F(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const u of o.j_)u.X_(s)&&(n=!0);o.z_=s}}n&&Na(t)}function DI(r,e,t){const n=F(r),s=n.queries.get(e);if(s)for(const i of s.j_)i.onError(t);n.queries.delete(e)}function Na(r){r.Y_.forEach(e=>{e.next()})}var Qo,Il;(Il=Qo||(Qo={})).ea="default",Il.Cache="cache";class Oa{constructor(e,t,n){this.query=e,this.ta=t,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=n||{}}X_(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new Xn(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.na?this.ia(e)&&(this.ta.next(e),t=!0):this.sa(e,this.onlineState)&&(this.oa(e),t=!0),this.ra=e,t}onError(e){this.ta.error(e)}Z_(e){this.onlineState=e;let t=!1;return this.ra&&!this.na&&this.sa(this.ra,e)&&(this.oa(this.ra),t=!0),t}sa(e,t){if(!e.fromCache||!this.J_())return!0;const n=t!=="Offline";return(!this.options._a||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ia(e){if(e.docChanges.length>0)return!0;const t=this.ra&&this.ra.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}oa(e){e=Xn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.na=!0,this.ta.next(e)}J_(){return this.options.source!==Qo.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xI{constructor(e,t){this.aa=e,this.byteLength=t}ua(){return"metadata"in this.aa}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(e){this.serializer=e}Es(e){return tt(this.serializer,e)}ds(e){return e.metadata.exists?wd(this.serializer,e.document,!1):le.newNoDocument(this.Es(e.metadata.name),this.As(e.metadata.readTime))}As(e){return Ee(e)}}class kI{constructor(e,t,n){this.ca=e,this.localStore=t,this.serializer=n,this.queries=[],this.documents=[],this.collectionGroups=new Set,this.progress=rf(e)}la(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.aa.namedQuery)this.queries.push(e.aa.namedQuery);else if(e.aa.documentMetadata){this.documents.push({metadata:e.aa.documentMetadata}),e.aa.documentMetadata.exists||++t;const n=X.fromString(e.aa.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.aa.document&&(this.documents[this.documents.length-1].document=e.aa.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,Object.assign({},this.progress)):null}ha(e){const t=new Map,n=new Tl(this.serializer);for(const s of e)if(s.metadata.queries){const i=n.Es(s.metadata.name);for(const o of s.metadata.queries){const u=(t.get(o)||H()).add(i);t.set(o,u)}}return t}async complete(){const e=await aI(this.localStore,new Tl(this.serializer),this.documents,this.ca.id),t=this.ha(this.documents);for(const n of this.queries)await uI(this.localStore,n,t.get(n.name));return this.progress.taskState="Success",{progress:this.progress,Pa:this.collectionGroups,Ia:e}}}function rf(r){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sf{constructor(e){this.key=e}}class of{constructor(e){this.key=e}}class af{constructor(e,t){this.query=e,this.Ta=t,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=H(),this.mutatedKeys=H(),this.Aa=Zh(e),this.Ra=new Bn(this.Aa)}get Va(){return this.Ta}ma(e,t){const n=t?t.fa:new _l,s=t?t.Ra:this.Ra;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,u=!1;const c=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((f,m)=>{const g=s.get(f),E=rs(this.query,m)?m:null,V=!!g&&this.mutatedKeys.has(g.key),C=!!E&&(E.hasLocalMutations||this.mutatedKeys.has(E.key)&&E.hasCommittedMutations);let D=!1;g&&E?g.data.isEqual(E.data)?V!==C&&(n.track({type:3,doc:E}),D=!0):this.ga(g,E)||(n.track({type:2,doc:E}),D=!0,(c&&this.Aa(E,c)>0||h&&this.Aa(E,h)<0)&&(u=!0)):!g&&E?(n.track({type:0,doc:E}),D=!0):g&&!E&&(n.track({type:1,doc:g}),D=!0,(c||h)&&(u=!0)),D&&(E?(o=o.add(E),i=C?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),i=i.delete(f.key),n.track({type:1,doc:f})}return{Ra:o,fa:n,ns:u,mutatedKeys:i}}ga(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.Ra;this.Ra=e.Ra,this.mutatedKeys=e.mutatedKeys;const o=e.fa.G_();o.sort((f,m)=>function(E,V){const C=D=>{switch(D){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return z()}};return C(E)-C(V)}(f.type,m.type)||this.Aa(f.doc,m.doc)),this.pa(n),s=s!=null&&s;const u=t&&!s?this.ya():[],c=this.da.size===0&&this.current&&!s?1:0,h=c!==this.Ea;return this.Ea=c,o.length!==0||h?{snapshot:new Xn(this.query,e.Ra,i,o,e.mutatedKeys,c===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),wa:u}:{wa:u}}Z_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new _l,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(e){return!this.Ta.has(e)&&!!this.Ra.has(e)&&!this.Ra.get(e).hasLocalMutations}pa(e){e&&(e.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=e.current)}ya(){if(!this.current)return[];const e=this.da;this.da=H(),this.Ra.forEach(n=>{this.Sa(n.key)&&(this.da=this.da.add(n.key))});const t=[];return e.forEach(n=>{this.da.has(n)||t.push(new of(n))}),this.da.forEach(n=>{e.has(n)||t.push(new sf(n))}),t}ba(e){this.Ta=e.Ts,this.da=H();const t=this.ma(e.documents);return this.applyChanges(t,!0)}Da(){return Xn.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,this.Ea===0,this.hasCachedResults)}}class NI{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class OI{constructor(e){this.key=e,this.va=!1}}class MI{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ca={},this.Fa=new yt(u=>Yh(u),ns),this.Ma=new Map,this.xa=new Set,this.Oa=new ue(B.comparator),this.Na=new Map,this.La=new Ea,this.Ba={},this.ka=new Map,this.qa=In.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return this.Qa===!0}}async function FI(r,e,t=!0){const n=Si(r);let s;const i=n.Fa.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Da()):s=await uf(n,e,t,!0),s}async function LI(r,e){const t=Si(r);await uf(t,e,!0,!1)}async function uf(r,e,t,n){const s=await Hn(r.localStore,Be(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let u;return n&&(u=await Ma(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&Ri(r.remoteStore,s),u}async function Ma(r,e,t,n,s){r.Ka=(m,g,E)=>async function(C,D,M,U){let O=D.view.ma(M);O.ns&&(O=await ai(C.localStore,D.query,!1).then(({documents:y})=>D.view.ma(y,O)));const q=U&&U.targetChanges.get(D.targetId),$=U&&U.targetMismatches.get(D.targetId)!=null,x=D.view.applyChanges(O,C.isPrimaryClient,q,$);return Wo(C,D.targetId,x.wa),x.snapshot}(r,m,g,E);const i=await ai(r.localStore,e,!0),o=new af(e,i.Ts),u=o.ma(i.documents),c=os.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),h=o.applyChanges(u,r.isPrimaryClient,c);Wo(r,t,h.wa);const f=new NI(e,t,o);return r.Fa.set(e,f),r.Ma.has(t)?r.Ma.get(t).push(e):r.Ma.set(t,[e]),h.snapshot}async function BI(r,e,t){const n=F(r),s=n.Fa.get(e),i=n.Ma.get(s.targetId);if(i.length>1)return n.Ma.set(s.targetId,i.filter(o=>!ns(o,e))),void n.Fa.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await Jn(n.localStore,s.targetId,!1).then(()=>{n.sharedClientState.clearQueryState(s.targetId),t&&Yn(n.remoteStore,s.targetId),Zn(n,s.targetId)}).catch(jt)):(Zn(n,s.targetId),await Jn(n.localStore,s.targetId,!0))}async function UI(r,e){const t=F(r),n=t.Fa.get(e),s=t.Ma.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Yn(t.remoteStore,n.targetId))}async function qI(r,e,t){const n=Ua(r);try{const s=await function(o,u){const c=F(o),h=pe.now(),f=u.reduce((E,V)=>E.add(V.key),H());let m,g;return c.persistence.runTransaction("Locally write mutations","readwrite",E=>{let V=Ge(),C=H();return c.cs.getEntries(E,f).next(D=>{V=D,V.forEach((M,U)=>{U.isValidDocument()||(C=C.add(M))})}).next(()=>c.localDocuments.getOverlayedDocuments(E,V)).next(D=>{m=D;const M=[];for(const U of u){const O=fy(U,m.get(U.key).overlayedDocument);O!=null&&M.push(new It(U.key,O,Uh(O.value.mapValue),fe.exists(!0)))}return c.mutationQueue.addMutationBatch(E,h,M,u)}).next(D=>{g=D;const M=D.applyToLocalDocumentSet(m,C);return c.documentOverlayCache.saveOverlays(E,D.batchId,M)})}).then(()=>({batchId:g.batchId,changes:td(m)}))}(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),function(o,u,c){let h=o.Ba[o.currentUser.toKey()];h||(h=new ue(Q)),h=h.insert(u,c),o.Ba[o.currentUser.toKey()]=h}(n,s.batchId,t),await Tt(n,s.changes),await ur(n.remoteStore)}catch(s){const i=lr(s,"Failed to persist write");t.reject(i)}}async function cf(r,e){const t=F(r);try{const n=await iI(t.localStore,e);e.targetChanges.forEach((s,i)=>{const o=t.Na.get(i);o&&(G(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1),s.addedDocuments.size>0?o.va=!0:s.modifiedDocuments.size>0?G(o.va):s.removedDocuments.size>0&&(G(o.va),o.va=!1))}),await Tt(t,n,e)}catch(n){await jt(n)}}function El(r,e,t){const n=F(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Fa.forEach((i,o)=>{const u=o.view.Z_(e);u.snapshot&&s.push(u.snapshot)}),function(o,u){const c=F(o);c.onlineState=u;let h=!1;c.queries.forEach((f,m)=>{for(const g of m.j_)g.Z_(u)&&(h=!0)}),h&&Na(c)}(n.eventManager,e),s.length&&n.Ca.d_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function jI(r,e,t){const n=F(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Na.get(e),i=s&&s.key;if(i){let o=new ue(B.comparator);o=o.insert(i,le.newNoDocument(i,K.min()));const u=H().add(i),c=new is(K.min(),new Map,new ue(Q),o,u);await cf(n,c),n.Oa=n.Oa.remove(i),n.Na.delete(e),Ba(n)}else await Jn(n.localStore,e,!1).then(()=>Zn(n,e,t)).catch(jt)}async function zI(r,e){const t=F(r),n=e.batch.batchId;try{const s=await sI(t.localStore,e);La(t,n,null),Fa(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Tt(t,s)}catch(s){await jt(s)}}async function GI(r,e,t){const n=F(r);try{const s=await function(o,u){const c=F(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return c.mutationQueue.lookupMutationBatch(h,u).next(m=>(G(m!==null),f=m.keys(),c.mutationQueue.removeMutationBatch(h,m))).next(()=>c.mutationQueue.performConsistencyCheck(h)).next(()=>c.documentOverlayCache.removeOverlaysForBatchId(h,f,u)).next(()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>c.localDocuments.getDocuments(h,f))})}(n.localStore,e);La(n,e,t),Fa(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Tt(n,s)}catch(s){await jt(s)}}async function $I(r,e){const t=F(r);$t(t.remoteStore)||k("SyncEngine","The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const n=await function(o){const u=F(o);return u.persistence.runTransaction("Get highest unacknowledged batch id","readonly",c=>u.mutationQueue.getHighestUnacknowledgedBatchId(c))}(t.localStore);if(n===-1)return void e.resolve();const s=t.ka.get(n)||[];s.push(e),t.ka.set(n,s)}catch(n){const s=lr(n,"Initialization of waitForPendingWrites() operation failed");e.reject(s)}}function Fa(r,e){(r.ka.get(e)||[]).forEach(t=>{t.resolve()}),r.ka.delete(e)}function La(r,e,t){const n=F(r);let s=n.Ba[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.Ba[n.currentUser.toKey()]=s}}function Zn(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Ma.get(e))r.Fa.delete(n),t&&r.Ca.$a(n,t);r.Ma.delete(e),r.isPrimaryClient&&r.La.gr(e).forEach(n=>{r.La.containsKey(n)||lf(r,n)})}function lf(r,e){r.xa.delete(e.path.canonicalString());const t=r.Oa.get(e);t!==null&&(Yn(r.remoteStore,t),r.Oa=r.Oa.remove(e),r.Na.delete(t),Ba(r))}function Wo(r,e,t){for(const n of t)n instanceof sf?(r.La.addReference(n.key,e),KI(r,n)):n instanceof of?(k("SyncEngine","Document no longer in limbo: "+n.key),r.La.removeReference(n.key,e),r.La.containsKey(n.key)||lf(r,n.key)):z()}function KI(r,e){const t=e.key,n=t.path.canonicalString();r.Oa.get(t)||r.xa.has(n)||(k("SyncEngine","New document in limbo: "+t),r.xa.add(n),Ba(r))}function Ba(r){for(;r.xa.size>0&&r.Oa.size<r.maxConcurrentLimboResolutions;){const e=r.xa.values().next().value;r.xa.delete(e);const t=new B(X.fromString(e)),n=r.qa.next();r.Na.set(n,new OI(t)),r.Oa=r.Oa.insert(t,n),Ri(r.remoteStore,new ht(Be(sr(t.path)),n,"TargetPurposeLimboResolution",je.oe))}}async function Tt(r,e,t){const n=F(r),s=[],i=[],o=[];n.Fa.isEmpty()||(n.Fa.forEach((u,c)=>{o.push(n.Ka(c,e,t).then(h=>{var f;if((h||t)&&n.isPrimaryClient){const m=h?!h.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;n.sharedClientState.updateQueryState(c.targetId,m?"current":"not-current")}if(h){s.push(h);const m=ba.Wi(c.targetId,h);i.push(m)}}))}),await Promise.all(o),n.Ca.d_(s),await async function(c,h){const f=F(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>A.forEach(h,g=>A.forEach(g.$i,E=>f.persistence.referenceDelegate.addReference(m,g.targetId,E)).next(()=>A.forEach(g.Ui,E=>f.persistence.referenceDelegate.removeReference(m,g.targetId,E)))))}catch(m){if(!zt(m))throw m;k("LocalStore","Failed to update sequence numbers: "+m)}for(const m of h){const g=m.targetId;if(!m.fromCache){const E=f.os.get(g),V=E.snapshotVersion,C=E.withLastLimboFreeSnapshotVersion(V);f.os=f.os.insert(g,C)}}}(n.localStore,i))}async function QI(r,e){const t=F(r);if(!t.currentUser.isEqual(e)){k("SyncEngine","User change. New user:",e.toKey());const n=await zd(t.localStore,e);t.currentUser=e,function(i,o){i.ka.forEach(u=>{u.forEach(c=>{c.reject(new N(S.CANCELLED,o))})}),i.ka.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Tt(t,n.hs)}}function WI(r,e){const t=F(r),n=t.Na.get(e);if(n&&n.va)return H().add(n.key);{let s=H();const i=t.Ma.get(e);if(!i)return s;for(const o of i){const u=t.Fa.get(o);s=s.unionWith(u.view.Va)}return s}}async function HI(r,e){const t=F(r),n=await ai(t.localStore,e.query,!0),s=e.view.ba(n);return t.isPrimaryClient&&Wo(t,e.targetId,s.wa),s}async function JI(r,e){const t=F(r);return Qd(t.localStore,e).then(n=>Tt(t,n))}async function YI(r,e,t,n){const s=F(r),i=await function(u,c){const h=F(u),f=F(h.mutationQueue);return h.persistence.runTransaction("Lookup mutation documents","readonly",m=>f.Mn(m,c).next(g=>g?h.localDocuments.getDocuments(m,g):A.resolve(null)))}(s.localStore,e);i!==null?(t==="pending"?await ur(s.remoteStore):t==="acknowledged"||t==="rejected"?(La(s,e,n||null),Fa(s,e),function(u,c){F(F(u).mutationQueue).On(c)}(s.localStore,e)):z(),await Tt(s,i)):k("SyncEngine","Cannot apply mutation batch with id: "+e)}async function XI(r,e){const t=F(r);if(Si(t),Ua(t),e===!0&&t.Qa!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await wl(t,n.toArray());t.Qa=!0,await Ko(t.remoteStore,!0);for(const i of s)Ri(t.remoteStore,i)}else if(e===!1&&t.Qa!==!1){const n=[];let s=Promise.resolve();t.Ma.forEach((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then(()=>(Zn(t,o),Jn(t.localStore,o,!0))),Yn(t.remoteStore,o)}),await s,await wl(t,n),function(o){const u=F(o);u.Na.forEach((c,h)=>{Yn(u.remoteStore,h)}),u.La.pr(),u.Na=new Map,u.Oa=new ue(B.comparator)}(t),t.Qa=!1,await Ko(t.remoteStore,!1)}}async function wl(r,e,t){const n=F(r),s=[],i=[];for(const o of e){let u;const c=n.Ma.get(o);if(c&&c.length!==0){u=await Hn(n.localStore,Be(c[0]));for(const h of c){const f=n.Fa.get(h),m=await HI(n,f);m.snapshot&&i.push(m.snapshot)}}else{const h=await Kd(n.localStore,o);u=await Hn(n.localStore,h),await Ma(n,hf(h),o,!1,u.resumeToken)}s.push(u)}return n.Ca.d_(i),s}function hf(r){return Wh(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function ZI(r){return function(t){return F(F(t).persistence).Qi()}(F(r).localStore)}async function eT(r,e,t,n){const s=F(r);if(s.Qa)return void k("SyncEngine","Ignoring unexpected query state notification.");const i=s.Ma.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{const o=await Qd(s.localStore,Xh(i[0])),u=is.createSynthesizedRemoteEventForCurrentChange(e,t==="current",ye.EMPTY_BYTE_STRING);await Tt(s,o,u);break}case"rejected":await Jn(s.localStore,e,!0),Zn(s,e,n);break;default:z()}}async function tT(r,e,t){const n=Si(r);if(n.Qa){for(const s of e){if(n.Ma.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){k("SyncEngine","Adding an already active target "+s);continue}const i=await Kd(n.localStore,s),o=await Hn(n.localStore,i);await Ma(n,hf(i),o.targetId,!1,o.resumeToken),Ri(n.remoteStore,o)}for(const s of t)n.Ma.has(s)&&await Jn(n.localStore,s,!1).then(()=>{Yn(n.remoteStore,s),Zn(n,s)}).catch(jt)}}function Si(r){const e=F(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=cf.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=WI.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=jI.bind(null,e),e.Ca.d_=CI.bind(null,e.eventManager),e.Ca.$a=DI.bind(null,e.eventManager),e}function Ua(r){const e=F(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=zI.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=GI.bind(null,e),e}function nT(r,e,t){const n=F(r);(async function(i,o,u){try{const c=await o.getMetadata();if(await function(E,V){const C=F(E),D=Ee(V.createTime);return C.persistence.runTransaction("hasNewerBundle","readonly",M=>C.Gr.getBundleMetadata(M,V.id)).then(M=>!!M&&M.createTime.compareTo(D)>=0)}(i.localStore,c))return await o.close(),u._completeWith(function(E){return{taskState:"Success",documentsLoaded:E.totalDocuments,bytesLoaded:E.totalBytes,totalDocuments:E.totalDocuments,totalBytes:E.totalBytes}}(c)),Promise.resolve(new Set);u._updateProgress(rf(c));const h=new kI(c,i.localStore,o.serializer);let f=await o.Ua();for(;f;){const g=await h.la(f);g&&u._updateProgress(g),f=await o.Ua()}const m=await h.complete();return await Tt(i,m.Ia,void 0),await function(E,V){const C=F(E);return C.persistence.runTransaction("Save bundle","readwrite",D=>C.Gr.saveBundleMetadata(D,V))}(i.localStore,c),u._completeWith(m.progress),Promise.resolve(m.Pa)}catch(c){return Je("SyncEngine",`Loading bundle failed with ${c}`),u._failWith(c),Promise.resolve(new Set)}})(n,e,t).then(s=>{n.sharedClientState.notifyBundleLoaded(s)})}class Bt{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=as(e.databaseInfo.databaseId),this.sharedClientState=this.Wa(e),this.persistence=this.Ga(e),await this.persistence.start(),this.localStore=this.za(e),this.gcScheduler=this.ja(e,this.localStore),this.indexBackfillerScheduler=this.Ha(e,this.localStore)}ja(e,t){return null}Ha(e,t){return null}za(e){return jd(this.persistence,new qd,e.initialUser,this.serializer)}Ga(e){return new wa(bi.Zr,this.serializer)}Wa(e){return new Hd}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Bt.provider={build:()=>new Bt};class rT extends Bt{constructor(e){super(),this.cacheSizeBytes=e}ja(e,t){G(this.persistence.referenceDelegate instanceof oi);const n=this.persistence.referenceDelegate.garbageCollector;return new Md(n,e.asyncQueue,t)}Ga(e){const t=this.cacheSizeBytes!==void 0?Fe.withCacheSize(this.cacheSizeBytes):Fe.DEFAULT;return new wa(n=>oi.Zr(n,t),this.serializer)}}class qa extends Bt{constructor(e,t,n){super(),this.Ja=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Ja.initialize(this,e),await Ua(this.Ja.syncEngine),await ur(this.Ja.remoteStore),await this.persistence.yi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}za(e){return jd(this.persistence,new qd,e.initialUser,this.serializer)}ja(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Md(n,e.asyncQueue,t)}Ha(e,t){const n=new b_(t,this.persistence);return new A_(e.asyncQueue,n)}Ga(e){const t=Aa(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Fe.withCacheSize(this.cacheSizeBytes):Fe.DEFAULT;return new va(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,Jd(),Ks(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Wa(e){return new Hd}}class df extends qa{constructor(e,t){super(e,t,!1),this.Ja=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Ja.syncEngine;this.sharedClientState instanceof Eo&&(this.sharedClientState.syncEngine={no:YI.bind(null,t),ro:eT.bind(null,t),io:tT.bind(null,t),Qi:ZI.bind(null,t),eo:JI.bind(null,t)},await this.sharedClientState.start()),await this.persistence.yi(async n=>{await XI(this.Ja.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())})}Wa(e){const t=Jd();if(!Eo.D(t))throw new N(S.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Aa(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Eo(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class Ut{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>El(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=QI.bind(null,this.syncEngine),await Ko(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new VI}()}createDatastore(e){const t=as(e.databaseInfo.databaseId),n=function(i){return new dI(i)}(e.databaseInfo);return function(i,o,u,c){return new pI(i,o,u,c)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(n,s,i,o,u){return new _I(n,s,i,o,u)}(this.localStore,this.datastore,e.asyncQueue,t=>El(this.syncEngine,t,0),function(){return pl.D()?new pl:new cI}())}createSyncEngine(e,t){return function(s,i,o,u,c,h,f){const m=new MI(s,i,o,u,c,h);return f&&(m.Qa=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(s){const i=F(s);k("RemoteStore","RemoteStore shutting down."),i.L_.add(5),await ar(i),i.k_.shutdown(),i.q_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Ut.provider={build:()=>new Ut};function vl(r,e=10240){let t=0;return{async read(){if(t<r.byteLength){const n={value:r.slice(t,t+e),done:!1};return t+=e,n}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ya(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ya(this.observer.error,e):Te("Uncaught Error in snapshot listener:",e.toString()))}Za(){this.muted=!0}Ya(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT{constructor(e,t){this.Xa=e,this.serializer=t,this.metadata=new Pe,this.buffer=new Uint8Array,this.eu=function(){return new TextDecoder("utf-8")}(),this.tu().then(n=>{n&&n.ua()?this.metadata.resolve(n.aa.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(n==null?void 0:n.aa)}`))},n=>this.metadata.reject(n))}close(){return this.Xa.cancel()}async getMetadata(){return this.metadata.promise}async Ua(){return await this.getMetadata(),this.tu()}async tu(){const e=await this.nu();if(e===null)return null;const t=this.eu.decode(e),n=Number(t);isNaN(n)&&this.ru(`length string (${t}) is not valid number`);const s=await this.iu(n);return new xI(JSON.parse(s),e.length+n)}su(){return this.buffer.findIndex(e=>e===123)}async nu(){for(;this.su()<0&&!await this.ou(););if(this.buffer.length===0)return null;const e=this.su();e<0&&this.ru("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async iu(e){for(;this.buffer.length<e;)await this.ou()&&this.ru("Reached the end of bundle when more is expected.");const t=this.eu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}ru(e){throw this.Xa.cancel(),new Error(`Invalid bundle format: ${e}`)}async ou(){const e=await this.Xa.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iT{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new N(S.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(s,i){const o=F(s),u={documents:i.map(m=>Hr(o.serializer,m))},c=await o.Lo("BatchGetDocuments",o.serializer.databaseId,X.emptyPath(),u,i.length),h=new Map;c.forEach(m=>{const g=wy(o.serializer,m);h.set(g.key.toString(),g)});const f=[];return i.forEach(m=>{const g=h.get(m.toString());G(!!g),f.push(g)}),f}(this.datastore,e);return t.forEach(n=>this.recordVersion(n)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new or(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((t,n)=>{const s=B.fromPath(n);this.mutations.push(new da(s,this.precondition(s)))}),await async function(n,s){const i=F(n),o={writes:s.map(u=>Jr(i.serializer,u))};await i.Mo("Commit",i.serializer.databaseId,X.emptyPath(),o)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw z();t=K.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new N(S.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(K.min())?fe.exists(!1):fe.updateTime(t):fe.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(K.min()))throw new N(S.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return fe.updateTime(t)}return fe.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oT{constructor(e,t,n,s,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=s,this.deferred=i,this._u=n.maxAttempts,this.t_=new Sa(this.asyncQueue,"transaction_retry")}au(){this._u-=1,this.uu()}uu(){this.t_.Go(async()=>{const e=new iT(this.datastore),t=this.cu(e);t&&t.then(n=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(n)}).catch(s=>{this.lu(s)}))}).catch(n=>{this.lu(n)})})}cu(e){try{const t=this.updateFunction(e);return!es(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}lu(e){this._u>0&&this.hu(e)?(this._u-=1,this.asyncQueue.enqueueAndForget(()=>(this.uu(),Promise.resolve()))):this.deferred.reject(e)}hu(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!dd(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aT{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=s,this.user=Se.UNAUTHENTICATED,this.clientId=vh.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async o=>{k("FirestoreClient","Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(n,o=>(k("FirestoreClient","Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Pe;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=lr(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function vo(r,e){r.asyncQueue.verifyOperationInProgress(),k("FirestoreClient","Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener(async s=>{n.isEqual(s)||(await zd(e.localStore,s),n=s)}),e.persistence.setDatabaseDeletedListener(()=>r.terminate()),r._offlineComponents=e}async function Al(r,e){r.asyncQueue.verifyOperationInProgress();const t=await ja(r);k("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener(n=>gl(e.remoteStore,n)),r.setAppCheckTokenChangeListener((n,s)=>gl(e.remoteStore,s)),r._onlineComponents=e}async function ja(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){k("FirestoreClient","Using user provided OfflineComponentProvider");try{await vo(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;Je("Error using user provided cache. Falling back to memory cache: "+t),await vo(r,new Bt)}}else k("FirestoreClient","Using default OfflineComponentProvider"),await vo(r,new Bt);return r._offlineComponents}async function Vi(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(k("FirestoreClient","Using user provided OnlineComponentProvider"),await Al(r,r._uninitializedComponentsProvider._online)):(k("FirestoreClient","Using default OnlineComponentProvider"),await Al(r,new Ut))),r._onlineComponents}function ff(r){return ja(r).then(e=>e.persistence)}function hr(r){return ja(r).then(e=>e.localStore)}function mf(r){return Vi(r).then(e=>e.remoteStore)}function za(r){return Vi(r).then(e=>e.syncEngine)}function pf(r){return Vi(r).then(e=>e.datastore)}async function er(r){const e=await Vi(r),t=e.eventManager;return t.onListen=FI.bind(null,e.syncEngine),t.onUnlisten=BI.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=LI.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=UI.bind(null,e.syncEngine),t}function uT(r){return r.asyncQueue.enqueue(async()=>{const e=await ff(r),t=await mf(r);return e.setNetworkEnabled(!0),function(s){const i=F(s);return i.L_.delete(0),us(i)}(t)})}function cT(r){return r.asyncQueue.enqueue(async()=>{const e=await ff(r),t=await mf(r);return e.setNetworkEnabled(!1),async function(s){const i=F(s);i.L_.add(0),await ar(i),i.q_.set("Offline")}(t)})}function lT(r,e){const t=new Pe;return r.asyncQueue.enqueueAndForget(async()=>async function(s,i,o){try{const u=await function(h,f){const m=F(h);return m.persistence.runTransaction("read document","readonly",g=>m.localDocuments.getDocument(g,f))}(s,i);u.isFoundDocument()?o.resolve(u):u.isNoDocument()?o.resolve(null):o.reject(new N(S.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(u){const c=lr(u,`Failed to get document '${i} from cache`);o.reject(c)}}(await hr(r),e,t)),t.promise}function gf(r,e,t={}){const n=new Pe;return r.asyncQueue.enqueueAndForget(async()=>function(i,o,u,c,h){const f=new Pi({next:g=>{f.Za(),o.enqueueAndForget(()=>ka(i,m));const E=g.docs.has(u);!E&&g.fromCache?h.reject(new N(S.UNAVAILABLE,"Failed to get document because the client is offline.")):E&&g.fromCache&&c&&c.source==="server"?h.reject(new N(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(g)},error:g=>h.reject(g)}),m=new Oa(sr(u.path),f,{includeMetadataChanges:!0,_a:!0});return xa(i,m)}(await er(r),r.asyncQueue,e,t,n)),n.promise}function hT(r,e){const t=new Pe;return r.asyncQueue.enqueueAndForget(async()=>async function(s,i,o){try{const u=await ai(s,i,!0),c=new af(i,u.Ts),h=c.ma(u.documents),f=c.applyChanges(h,!1);o.resolve(f.snapshot)}catch(u){const c=lr(u,`Failed to execute query '${i} against cache`);o.reject(c)}}(await hr(r),e,t)),t.promise}function _f(r,e,t={}){const n=new Pe;return r.asyncQueue.enqueueAndForget(async()=>function(i,o,u,c,h){const f=new Pi({next:g=>{f.Za(),o.enqueueAndForget(()=>ka(i,m)),g.fromCache&&c.source==="server"?h.reject(new N(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(g)},error:g=>h.reject(g)}),m=new Oa(u,f,{includeMetadataChanges:!0,_a:!0});return xa(i,m)}(await er(r),r.asyncQueue,e,t,n)),n.promise}function dT(r,e,t){const n=new Pe;return r.asyncQueue.enqueueAndForget(async()=>{try{const s=await pf(r);n.resolve(async function(o,u,c){var h;const f=F(o),{request:m,ut:g,parent:E}=Ad(f.serializer,Hh(u),c);f.connection.Fo||delete m.parent;const V=(await f.Lo("RunAggregationQuery",f.serializer.databaseId,E,m,1)).filter(D=>!!D.result);G(V.length===1);const C=(h=V[0].result)===null||h===void 0?void 0:h.aggregateFields;return Object.keys(C).reduce((D,M)=>(D[g[M]]=C[M],D),{})}(s,e,t))}catch(s){n.reject(s)}}),n.promise}function fT(r,e){const t=new Pi(e);return r.asyncQueue.enqueueAndForget(async()=>function(s,i){F(s).Y_.add(i),i.next()}(await er(r),t)),()=>{t.Za(),r.asyncQueue.enqueueAndForget(async()=>function(s,i){F(s).Y_.delete(i)}(await er(r),t))}}function mT(r,e,t,n){const s=function(o,u){let c;return c=typeof o=="string"?md().encode(o):o,function(f,m){return new sT(f,m)}(function(f,m){if(f instanceof Uint8Array)return vl(f,m);if(f instanceof ArrayBuffer)return vl(new Uint8Array(f),m);if(f instanceof ReadableStream)return f.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(c),u)}(t,as(e));r.asyncQueue.enqueueAndForget(async()=>{nT(await za(r),s,n)})}function pT(r,e){return r.asyncQueue.enqueue(async()=>function(n,s){const i=F(n);return i.persistence.runTransaction("Get named query","readonly",o=>i.Gr.getNamedQuery(o,s))}(await hr(r),e))}function gT(r,e){return r.asyncQueue.enqueue(async()=>async function(n,s){const i=F(n),o=i.indexManager,u=[];return i.persistence.runTransaction("Configure indexes","readwrite",c=>o.getFieldIndexes(c).next(h=>function(m,g,E,V,C){m=[...m],g=[...g],m.sort(E),g.sort(E);const D=m.length,M=g.length;let U=0,O=0;for(;U<M&&O<D;){const q=E(m[O],g[U]);q<0?C(m[O++]):q>0?V(g[U++]):(U++,O++)}for(;U<M;)V(g[U++]);for(;O<D;)C(m[O++])}(h,s,T_,f=>{u.push(o.addFieldIndex(c,f))},f=>{u.push(o.deleteFieldIndex(c,f))})).next(()=>A.waitFor(u)))}(await hr(r),e))}function _T(r,e){return r.asyncQueue.enqueue(async()=>function(n,s){F(n).ss.zi=s}(await hr(r),e))}function yT(r){return r.asyncQueue.enqueue(async()=>function(t){const n=F(t),s=n.indexManager;return n.persistence.runTransaction("Delete All Indexes","readwrite",i=>s.deleteAllFieldIndexes(i))}(await hr(r)))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yf(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ga(r,e,t){if(!t)throw new N(S.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function IT(r,e,t,n){if(e===!0&&n===!0)throw new N(S.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Rl(r){if(!B.isDocumentKey(r))throw new N(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Sl(r){if(B.isDocumentKey(r))throw new N(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Ci(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=function(n){return n.constructor?n.constructor.name:null}(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":z()}function Y(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new N(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ci(r);throw new N(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function If(r,e){if(e<=0)throw new N(S.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new N(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new N(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}IT("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=yf((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(i){if(i.timeoutSeconds!==void 0){if(isNaN(i.timeoutSeconds))throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);if(i.timeoutSeconds<5)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);if(i.timeoutSeconds>30)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(n,s){return n.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class cs{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Pl({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Pl(e),e.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new d_;switch(n.type){case"firstParty":return new g_(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new N(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const n=bl.get(t);n&&(k("ComponentProvider","Removing Datastore"),bl.delete(t),n.terminate())}(this),Promise.resolve()}}function TT(r,e,t,n={}){var s;const i=(r=Y(r,cs))._getSettings(),o=`${e}:${t}`;if(i.host!=="firestore.googleapis.com"&&i.host!==o&&Je("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),r._setSettings(Object.assign(Object.assign({},i),{host:o,ssl:!1})),n.mockUserToken){let u,c;if(typeof n.mockUserToken=="string")u=n.mockUserToken,c=Se.MOCK_USER;else{u=Rm(n.mockUserToken,(s=r._app)===null||s===void 0?void 0:s.options.projectId);const h=n.mockUserToken.sub||n.mockUserToken.user_id;if(!h)throw new N(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");c=new Se(h)}r._authCredentials=new f_(new Eh(u,c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new xe(this.firestore,e,this._query)}}class we{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new nt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new we(this.firestore,e,this._key)}}class nt extends xe{constructor(e,t,n){super(e,t,sr(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new we(this.firestore,null,new B(e))}withConverter(e){return new nt(this.firestore,e,this._path)}}function dE(r,e,...t){if(r=Ae(r),Ga("collection","path",e),r instanceof cs){const n=X.fromString(e,...t);return Sl(n),new nt(r,null,n)}{if(!(r instanceof we||r instanceof nt))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(X.fromString(e,...t));return Sl(n),new nt(r.firestore,null,n)}}function fE(r,e){if(r=Y(r,cs),Ga("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new N(S.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new xe(r,null,function(n){return new _t(X.emptyPath(),n)}(e))}function ET(r,e,...t){if(r=Ae(r),arguments.length===1&&(e=vh.newId()),Ga("doc","path",e),r instanceof cs){const n=X.fromString(e,...t);return Rl(n),new we(r,null,new B(n))}{if(!(r instanceof we||r instanceof nt))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(X.fromString(e,...t));return Rl(n),new we(r.firestore,r instanceof nt?r.converter:null,new B(n))}}function mE(r,e){return r=Ae(r),e=Ae(e),(r instanceof we||r instanceof nt)&&(e instanceof we||e instanceof nt)&&r.firestore===e.firestore&&r.path===e.path&&r.converter===e.converter}function Tf(r,e){return r=Ae(r),e=Ae(e),r instanceof xe&&e instanceof xe&&r.firestore===e.firestore&&ns(r._query,e._query)&&r.converter===e.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Sa(this,"async_queue_retry"),this.Vu=()=>{const n=Ks();n&&k("AsyncQueue","Visibility state changed to "+n.visibilityState),this.t_.jo()},this.mu=e;const t=Ks();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const t=Ks();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const t=new Pe;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!zt(e))throw e;k("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const t=this.mu.then(()=>(this.du=!0,e().catch(n=>{this.Eu=n,this.du=!1;const s=function(o){let u=o.message||"";return o.stack&&(u=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),u}(n);throw Te("INTERNAL UNHANDLED ERROR: ",s),n}).then(n=>(this.du=!1,n))));return this.mu=t,t}enqueueAfterDelay(e,t,n){this.fu(),this.Ru.indexOf(e)>-1&&(t=0);const s=Da.createAndSchedule(this,e,t,n,i=>this.yu(i));return this.Tu.push(s),s}fu(){this.Eu&&z()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const t of this.Tu)if(t.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((t,n)=>t.targetTimeMs-n.targetTimeMs);for(const t of this.Tu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const t=this.Tu.indexOf(e);this.Tu.splice(t,1)}}function Ho(r){return function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1}(r,["next","error","complete"])}class wT{constructor(){this._progressObserver={},this._taskCompletionResolver=new Pe,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pE=-1;class ae extends cs{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Vl,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Vl(e),this._firestoreClient=void 0,await e}}}function gE(r,e,t){t||(t="(default)");const n=En(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(xt(i,e))return s;throw new N(S.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new N(S.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new N(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return n.initialize({options:e,instanceIdentifier:t})}function _E(r,e){const t=typeof r=="object"?r:Gl(),n=typeof r=="string"?r:e||"(default)",s=En(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=Am("firestore");i&&TT(s,...i)}return s}function ge(r){if(r._terminated)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||Ef(r),r._firestoreClient}function Ef(r){var e,t,n;const s=r._freezeSettings(),i=function(u,c,h,f){return new K_(u,c,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,yf(f.experimentalLongPollingOptions),f.useFetchStreams)}(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,s);r._componentsProvider||!((t=s.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=s.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),r._firestoreClient=new aT(r._authCredentials,r._appCheckCredentials,r._queue,i,r._componentsProvider&&function(u){const c=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(c),_online:c}}(r._componentsProvider))}function yE(r,e){Je("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=r._freezeSettings();return wf(r,Ut.provider,{build:n=>new qa(n,t.cacheSizeBytes,e==null?void 0:e.forceOwnership)}),Promise.resolve()}async function IE(r){Je("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=r._freezeSettings();wf(r,Ut.provider,{build:t=>new df(t,e.cacheSizeBytes)})}function wf(r,e,t){if((r=Y(r,ae))._firestoreClient||r._terminated)throw new N(S.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(r._componentsProvider||r._getSettings().localCache)throw new N(S.FAILED_PRECONDITION,"SDK cache is already specified.");r._componentsProvider={_online:e,_offline:t},Ef(r)}function TE(r){if(r._initialized&&!r._terminated)throw new N(S.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new Pe;return r._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(n){if(!et.D())return Promise.resolve();const s=n+"main";await et.delete(s)}(Aa(r._databaseId,r._persistenceKey)),e.resolve()}catch(t){e.reject(t)}}),e.promise}function EE(r){return function(t){const n=new Pe;return t.asyncQueue.enqueueAndForget(async()=>$I(await za(t),n)),n.promise}(ge(r=Y(r,ae)))}function wE(r){return uT(ge(r=Y(r,ae)))}function vE(r){return cT(ge(r=Y(r,ae)))}function AE(r){return Np(r.app,"firestore",r._databaseId.database),r._delete()}function bE(r,e){const t=ge(r=Y(r,ae)),n=new wT;return mT(t,r._databaseId,e,n),n}function RE(r,e){return pT(ge(r=Y(r,ae)),e).then(t=>t?new xe(r,null,t.query):null)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yr{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class vT{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Tn(ye.fromBase64String(e))}catch(t){throw new N(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Tn(ye.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new de(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function SE(){return new wn("__name__")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return Q(this._lat,e._lat)||Q(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AT=/^__.*__$/;class bT{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new It(e,this.data,this.fieldMask,t,this.fieldTransforms):new ir(e,this.data,t,this.fieldTransforms)}}class vf{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new It(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Af(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw z()}}class xi{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(e){return new xi(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:n,xu:!1});return s.Ou(e),s}Nu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),s=this.Fu({path:n,xu:!1});return s.vu(),s}Lu(e){return this.Fu({path:void 0,xu:!0})}Bu(e){return hi(e,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}vu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Ou(this.path.get(e))}Ou(e){if(e.length===0)throw this.Bu("Document fields must not be empty");if(Af(this.Cu)&&AT.test(e))throw this.Bu('Document fields cannot begin and end with "__"')}}class RT{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||as(e)}Qu(e,t,n,s=!1){return new xi({Cu:e,methodName:t,qu:n,path:de.emptyPath(),xu:!1,ku:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function An(r){const e=r._freezeSettings(),t=as(r._databaseId);return new RT(r._databaseId,!!e.ignoreUndefinedProperties,t)}function ki(r,e,t,n,s,i={}){const o=r.Qu(i.merge||i.mergeFields?2:0,e,t,s);Xa("Data must be an object, but it was:",o,n);const u=Sf(n,o);let c,h;if(i.merge)c=new ze(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const f=[];for(const m of i.mergeFields){const g=Xr(e,m,t);if(!o.contains(g))throw new N(S.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);Vf(f,g)||f.push(g)}c=new ze(f),h=o.fieldTransforms.filter(m=>c.covers(m.field))}else c=null,h=o.fieldTransforms;return new bT(new De(u),c,h)}class ls extends vn{_toFieldTransform(e){if(e.Cu!==2)throw e.Cu===1?e.Bu(`${this._methodName}() can only appear at the top level of your update data`):e.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ls}}function bf(r,e,t){return new xi({Cu:3,qu:e.settings.qu,methodName:r._methodName,xu:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Ka extends vn{_toFieldTransform(e){return new ss(e.path,new Kn)}isEqual(e){return e instanceof Ka}}class Qa extends vn{constructor(e,t){super(e),this.Ku=t}_toFieldTransform(e){const t=bf(this,e,!0),n=this.Ku.map(i=>bn(i,t)),s=new pn(n);return new ss(e.path,s)}isEqual(e){return e instanceof Qa&&xt(this.Ku,e.Ku)}}class Wa extends vn{constructor(e,t){super(e),this.Ku=t}_toFieldTransform(e){const t=bf(this,e,!0),n=this.Ku.map(i=>bn(i,t)),s=new gn(n);return new ss(e.path,s)}isEqual(e){return e instanceof Wa&&xt(this.Ku,e.Ku)}}class Ha extends vn{constructor(e,t){super(e),this.$u=t}_toFieldTransform(e){const t=new Qn(e.serializer,sd(e.serializer,this.$u));return new ss(e.path,t)}isEqual(e){return e instanceof Ha&&this.$u===e.$u}}function Ja(r,e,t,n){const s=r.Qu(1,e,t);Xa("Data must be an object, but it was:",s,n);const i=[],o=De.empty();Gt(n,(c,h)=>{const f=Ni(e,c,t);h=Ae(h);const m=s.Nu(f);if(h instanceof ls)i.push(f);else{const g=bn(h,m);g!=null&&(i.push(f),o.set(f,g))}});const u=new ze(i);return new vf(o,u,s.fieldTransforms)}function Ya(r,e,t,n,s,i){const o=r.Qu(1,e,t),u=[Xr(e,n,t)],c=[s];if(i.length%2!=0)throw new N(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)u.push(Xr(e,i[g])),c.push(i[g+1]);const h=[],f=De.empty();for(let g=u.length-1;g>=0;--g)if(!Vf(h,u[g])){const E=u[g];let V=c[g];V=Ae(V);const C=o.Nu(E);if(V instanceof ls)h.push(E);else{const D=bn(V,C);D!=null&&(h.push(E),f.set(E,D))}}const m=new ze(h);return new vf(f,m,o.fieldTransforms)}function Rf(r,e,t,n=!1){return bn(t,r.Qu(n?4:3,e))}function bn(r,e){if(Pf(r=Ae(r)))return Xa("Unsupported field value:",e,r),Sf(r,e);if(r instanceof vn)return function(n,s){if(!Af(s.Cu))throw s.Bu(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Bu(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)}(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.xu&&e.Cu!==4)throw e.Bu("Nested arrays are not supported");return function(n,s){const i=[];let o=0;for(const u of n){let c=bn(u,s.Lu(o));c==null&&(c={nullValue:"NULL_VALUE"}),i.push(c),o++}return{arrayValue:{values:i}}}(r,e)}return function(n,s){if((n=Ae(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return sd(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=pe.fromDate(n);return{timestampValue:Wn(s.serializer,i)}}if(n instanceof pe){const i=new pe(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Wn(s.serializer,i)}}if(n instanceof $a)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Tn)return{bytesValue:_d(s.serializer,n._byteString)};if(n instanceof we){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.Bu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:_a(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof Di)return function(o,u){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:o.toArray().map(c=>{if(typeof c!="number")throw u.Bu("VectorValues must only contain numeric values.");return ha(u.serializer,c)})}}}}}}(n,s);throw s.Bu(`Unsupported field value: ${Ci(n)}`)}(r,e)}function Sf(r,e){const t={};return Mh(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Gt(r,(n,s)=>{const i=bn(s,e.Mu(n));i!=null&&(t[n]=i)}),{mapValue:{fields:t}}}function Pf(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof pe||r instanceof $a||r instanceof Tn||r instanceof we||r instanceof vn||r instanceof Di)}function Xa(r,e,t){if(!Pf(t)||!function(s){return typeof s=="object"&&s!==null&&(Object.getPrototypeOf(s)===Object.prototype||Object.getPrototypeOf(s)===null)}(t)){const n=Ci(t);throw n==="an object"?e.Bu(r+" a custom object"):e.Bu(r+" "+n)}}function Xr(r,e,t){if((e=Ae(e))instanceof wn)return e._internalPath;if(typeof e=="string")return Ni(r,e);throw hi("Field path arguments must be of type string or ",r,!1,void 0,t)}const ST=new RegExp("[~\\*/\\[\\]]");function Ni(r,e,t){if(e.search(ST)>=0)throw hi(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new wn(...e.split("."))._internalPath}catch{throw hi(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function hi(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${n}`),o&&(c+=` in document ${s}`),c+=")"),new N(S.INVALID_ARGUMENT,u+r+c)}function Vf(r,e){return r.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zr{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new we(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new PT(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Oi("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class PT extends Zr{data(){return super.data()}}function Oi(r,e){return typeof e=="string"?Ni(r,e):e instanceof wn?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cf(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new N(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Za{}class hs extends Za{}function PE(r,e,...t){let n=[];e instanceof Za&&n.push(e),n=n.concat(t),function(i){const o=i.filter(c=>c instanceof dr).length,u=i.filter(c=>c instanceof ds).length;if(o>1||o>0&&u>0)throw new N(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const s of n)r=s._apply(r);return r}class ds extends hs{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new ds(e,t,n)}_apply(e){const t=this._parse(e);return xf(e._query,t),new xe(e.firestore,e.converter,Fo(e._query,t))}_parse(e){const t=An(e.firestore);return function(i,o,u,c,h,f,m){let g;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new N(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Dl(m,f);const E=[];for(const V of m)E.push(Cl(c,i,V));g={arrayValue:{values:E}}}else g=Cl(c,i,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Dl(m,f),g=Rf(u,o,m,f==="in"||f==="not-in");return Z.create(h,f,g)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function VE(r,e,t){const n=e,s=Oi("where",r);return ds._create(s,n,t)}class dr extends Za{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new dr(e,t)}_parse(e){const t=this._queryConstraints.map(n=>n._parse(e)).filter(n=>n.getFilters().length>0);return t.length===1?t[0]:re.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(s,i){let o=s;const u=i.getFlattenedFilters();for(const c of u)xf(o,c),o=Fo(o,c)}(e._query,t),new xe(e.firestore,e.converter,Fo(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function CE(...r){return r.forEach(e=>kf("or",e)),dr._create("or",r)}function DE(...r){return r.forEach(e=>kf("and",e)),dr._create("and",r)}class eu extends hs{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new eu(e,t)}_apply(e){const t=function(s,i,o){if(s.startAt!==null)throw new N(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new N(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Wr(i,o)}(e._query,this._field,this._direction);return new xe(e.firestore,e.converter,function(s,i){const o=s.explicitOrderBy.concat([i]);return new _t(s.path,s.collectionGroup,o,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)}(e._query,t))}}function xE(r,e="asc"){const t=e,n=Oi("orderBy",r);return eu._create(n,t)}class Mi extends hs{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Mi(e,t,n)}_apply(e){return new xe(e.firestore,e.converter,ti(e._query,this._limit,this._limitType))}}function kE(r){return If("limit",r),Mi._create("limit",r,"F")}function NE(r){return If("limitToLast",r),Mi._create("limitToLast",r,"L")}class Fi extends hs{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Fi(e,t,n)}_apply(e){const t=Df(e,this.type,this._docOrFields,this._inclusive);return new xe(e.firestore,e.converter,function(s,i){return new _t(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,i,s.endAt)}(e._query,t))}}function OE(...r){return Fi._create("startAt",r,!0)}function ME(...r){return Fi._create("startAfter",r,!1)}class Li extends hs{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Li(e,t,n)}_apply(e){const t=Df(e,this.type,this._docOrFields,this._inclusive);return new xe(e.firestore,e.converter,function(s,i){return new _t(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,s.startAt,i)}(e._query,t))}}function FE(...r){return Li._create("endBefore",r,!1)}function LE(...r){return Li._create("endAt",r,!0)}function Df(r,e,t,n){if(t[0]=Ae(t[0]),t[0]instanceof Zr)return function(i,o,u,c,h){if(!c)throw new N(S.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${u}().`);const f=[];for(const m of Ln(i))if(m.field.isKeyField())f.push(fn(o,c.key));else{const g=c.data.field(m.field);if(_i(g))throw new N(S.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+m.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(g===null){const E=m.field.canonicalString();throw new N(S.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${E}' (used as the orderBy) does not exist.`)}f.push(g)}return new Ft(f,h)}(r._query,r.firestore._databaseId,e,t[0]._document,n);{const s=An(r.firestore);return function(o,u,c,h,f,m){const g=o.explicitOrderBy;if(f.length>g.length)throw new N(S.INVALID_ARGUMENT,`Too many arguments provided to ${h}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const E=[];for(let V=0;V<f.length;V++){const C=f[V];if(g[V].field.isKeyField()){if(typeof C!="string")throw new N(S.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${h}(), but got a ${typeof C}`);if(!ca(o)&&C.indexOf("/")!==-1)throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${h}() must be a plain document ID, but '${C}' contains a slash.`);const D=o.path.child(X.fromString(C));if(!B.isDocumentKey(D))throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${h}() must result in a valid document path, but '${D}' is not because it contains an odd number of segments.`);const M=new B(D);E.push(fn(u,M))}else{const D=Rf(c,h,C);E.push(D)}}return new Ft(E,m)}(r._query,r.firestore._databaseId,s,e,t,n)}}function Cl(r,e,t){if(typeof(t=Ae(t))=="string"){if(t==="")throw new N(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!ca(e)&&t.indexOf("/")!==-1)throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(X.fromString(t));if(!B.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return fn(r,new B(n))}if(t instanceof we)return fn(r,t._key);throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ci(t)}.`)}function Dl(r,e){if(!Array.isArray(r)||r.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function xf(r,e){const t=function(s,i){for(const o of s)for(const u of o.getFlattenedFilters())if(i.indexOf(u.op)>=0)return u.op;return null}(r.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function kf(r,e){if(!(e instanceof ds||e instanceof dr))throw new N(S.INVALID_ARGUMENT,`Function ${r}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class Nf{convertValue(e,t="none"){switch(Ot(e)){case 0:return null;case 1:return e.booleanValue;case 2:return he(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(gt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw z()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Gt(e,(s,i)=>{n[s]=this.convertValue(i,t)}),n}convertVectorValue(e){var t,n,s;const i=(s=(n=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||n===void 0?void 0:n.values)===null||s===void 0?void 0:s.map(o=>he(o.doubleValue));return new Di(i)}convertGeoPoint(e){return new $a(he(e.latitude),he(e.longitude))}convertArray(e,t){return(e.values||[]).map(n=>this.convertValue(n,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=yi(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp($r(e));default:return null}}convertTimestamp(e){const t=pt(e);return new pe(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=X.fromString(e);G(Pd(n));const s=new dn(n.get(1),n.get(3)),i=new B(n.popFirst(5));return s.isEqual(t)||Te(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bi(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class VT extends Nf{constructor(e){super(),this.firestore=e}convertBytes(e){return new Tn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new we(this.firestore,null,t)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BE(r){return new Yr("sum",Xr("sum",r))}function UE(r){return new Yr("avg",Xr("average",r))}function CT(){return new Yr("count")}function qE(r,e){var t,n;return r instanceof Yr&&e instanceof Yr&&r.aggregateType===e.aggregateType&&((t=r._internalFieldPath)===null||t===void 0?void 0:t.canonicalString())===((n=e._internalFieldPath)===null||n===void 0?void 0:n.canonicalString())}function jE(r,e){return Tf(r.query,e.query)&&xt(r.data(),e.data())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class an{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class tr extends Zr{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Qs(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Oi("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}}class Qs extends tr{data(e={}){return super.data(e)}}class nr{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new an(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new Qs(this._firestore,this._userDataWriter,n.key,n,new an(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map(u=>{const c=new Qs(s._firestore,s._userDataWriter,u.doc.key,u.doc,new an(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}})}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(u=>i||u.type!==3).map(u=>{const c=new Qs(s._firestore,s._userDataWriter,u.doc.key,u.doc,new an(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,f=-1;return u.type!==0&&(h=o.indexOf(u.doc.key),o=o.delete(u.doc.key)),u.type!==1&&(o=o.add(u.doc),f=o.indexOf(u.doc.key)),{type:DT(u.type),doc:c,oldIndex:h,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function DT(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return z()}}function zE(r,e){return r instanceof tr&&e instanceof tr?r._firestore===e._firestore&&r._key.isEqual(e._key)&&(r._document===null?e._document===null:r._document.isEqual(e._document))&&r._converter===e._converter:r instanceof nr&&e instanceof nr&&r._firestore===e._firestore&&Tf(r.query,e.query)&&r.metadata.isEqual(e.metadata)&&r._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function GE(r){r=Y(r,we);const e=Y(r.firestore,ae);return gf(ge(e),r._key).then(t=>tu(e,r,t))}class Kt extends Nf{constructor(e){super(),this.firestore=e}convertBytes(e){return new Tn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new we(this.firestore,null,t)}}function $E(r){r=Y(r,we);const e=Y(r.firestore,ae),t=ge(e),n=new Kt(e);return lT(t,r._key).then(s=>new tr(e,n,r._key,s,new an(s!==null&&s.hasLocalMutations,!0),r.converter))}function KE(r){r=Y(r,we);const e=Y(r.firestore,ae);return gf(ge(e),r._key,{source:"server"}).then(t=>tu(e,r,t))}function QE(r){r=Y(r,xe);const e=Y(r.firestore,ae),t=ge(e),n=new Kt(e);return Cf(r._query),_f(t,r._query).then(s=>new nr(e,n,r,s))}function WE(r){r=Y(r,xe);const e=Y(r.firestore,ae),t=ge(e),n=new Kt(e);return hT(t,r._query).then(s=>new nr(e,n,r,s))}function HE(r){r=Y(r,xe);const e=Y(r.firestore,ae),t=ge(e),n=new Kt(e);return _f(t,r._query,{source:"server"}).then(s=>new nr(e,n,r,s))}function JE(r,e,t){r=Y(r,we);const n=Y(r.firestore,ae),s=Bi(r.converter,e,t);return fs(n,[ki(An(n),"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,fe.none())])}function YE(r,e,t,...n){r=Y(r,we);const s=Y(r.firestore,ae),i=An(s);let o;return o=typeof(e=Ae(e))=="string"||e instanceof wn?Ya(i,"updateDoc",r._key,e,t,n):Ja(i,"updateDoc",r._key,e),fs(s,[o.toMutation(r._key,fe.exists(!0))])}function XE(r){return fs(Y(r.firestore,ae),[new or(r._key,fe.none())])}function ZE(r,e){const t=Y(r.firestore,ae),n=ET(r),s=Bi(r.converter,e);return fs(t,[ki(An(r.firestore),"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,fe.exists(!1))]).then(()=>n)}function ew(r,...e){var t,n,s;r=Ae(r);let i={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||Ho(e[o])||(i=e[o],o++);const u={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(Ho(e[o])){const m=e[o];e[o]=(t=m.next)===null||t===void 0?void 0:t.bind(m),e[o+1]=(n=m.error)===null||n===void 0?void 0:n.bind(m),e[o+2]=(s=m.complete)===null||s===void 0?void 0:s.bind(m)}let c,h,f;if(r instanceof we)h=Y(r.firestore,ae),f=sr(r._key.path),c={next:m=>{e[o]&&e[o](tu(h,r,m))},error:e[o+1],complete:e[o+2]};else{const m=Y(r,xe);h=Y(m.firestore,ae),f=m._query;const g=new Kt(h);c={next:E=>{e[o]&&e[o](new nr(h,g,m,E))},error:e[o+1],complete:e[o+2]},Cf(r._query)}return function(g,E,V,C){const D=new Pi(C),M=new Oa(E,D,V);return g.asyncQueue.enqueueAndForget(async()=>xa(await er(g),M)),()=>{D.Za(),g.asyncQueue.enqueueAndForget(async()=>ka(await er(g),M))}}(ge(h),f,u,c)}function tw(r,e){return fT(ge(r=Y(r,ae)),Ho(e)?e:{next:e})}function fs(r,e){return function(n,s){const i=new Pe;return n.asyncQueue.enqueueAndForget(async()=>qI(await za(n),s,i)),i.promise}(ge(r),e)}function tu(r,e,t){const n=t.docs.get(e._key),s=new Kt(r);return new tr(r,s,e._key,n,new an(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nw(r){return xT(r,{count:CT()})}function xT(r,e){const t=Y(r.firestore,ae),n=ge(t),s=Oh(e,(i,o)=>new hd(o,i.aggregateType,i._internalFieldPath));return dT(n,r._query,s).then(i=>function(u,c,h){const f=new Kt(u);return new vT(c,f,h)}(t,r,i))}class kT{constructor(e){this.kind="memory",this._onlineComponentProvider=Ut.provider,e!=null&&e.garbageCollector?this._offlineComponentProvider=e.garbageCollector._offlineComponentProvider:this._offlineComponentProvider=Bt.provider}toJSON(){return{kind:this.kind}}}class NT{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=BT(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class OT{constructor(){this.kind="memoryEager",this._offlineComponentProvider=Bt.provider}toJSON(){return{kind:this.kind}}}class MT{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new rT(e)}}toJSON(){return{kind:this.kind}}}function rw(){return new OT}function sw(r){return new MT(r==null?void 0:r.cacheSizeBytes)}function iw(r){return new kT(r)}function ow(r){return new NT(r)}class FT{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Ut.provider,this._offlineComponentProvider={build:t=>new qa(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class LT{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Ut.provider,this._offlineComponentProvider={build:t=>new df(t,e==null?void 0:e.cacheSizeBytes)}}}function BT(r){return new FT(r==null?void 0:r.forceOwnership)}function aw(){return new LT}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UT={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qT{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=An(e)}set(e,t,n){this._verifyNotCommitted();const s=Pt(e,this._firestore),i=Bi(s.converter,t,n),o=ki(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,fe.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=Pt(e,this._firestore);let o;return o=typeof(t=Ae(t))=="string"||t instanceof wn?Ya(this._dataReader,"WriteBatch.update",i._key,t,n,s):Ja(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,fe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Pt(e,this._firestore);return this._mutations=this._mutations.concat(new or(t._key,fe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new N(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Pt(r,e){if((r=Ae(r)).firestore!==e)throw new N(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jT extends class{constructor(t,n){this._firestore=t,this._transaction=n,this._dataReader=An(t)}get(t){const n=Pt(t,this._firestore),s=new VT(this._firestore);return this._transaction.lookup([n._key]).then(i=>{if(!i||i.length!==1)return z();const o=i[0];if(o.isFoundDocument())return new Zr(this._firestore,s,o.key,o,n.converter);if(o.isNoDocument())return new Zr(this._firestore,s,n._key,null,n.converter);throw z()})}set(t,n,s){const i=Pt(t,this._firestore),o=Bi(i.converter,n,s),u=ki(this._dataReader,"Transaction.set",i._key,o,i.converter!==null,s);return this._transaction.set(i._key,u),this}update(t,n,s,...i){const o=Pt(t,this._firestore);let u;return u=typeof(n=Ae(n))=="string"||n instanceof wn?Ya(this._dataReader,"Transaction.update",o._key,n,s,i):Ja(this._dataReader,"Transaction.update",o._key,n),this._transaction.update(o._key,u),this}delete(t){const n=Pt(t,this._firestore);return this._transaction.delete(n._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Pt(e,this._firestore),n=new Kt(this._firestore);return super.get(e).then(s=>new tr(this._firestore,n,t._key,s._document,new an(!1,!1),t.converter))}}function cw(r,e,t){r=Y(r,ae);const n=Object.assign(Object.assign({},UT),t);return function(i){if(i.maxAttempts<1)throw new N(S.INVALID_ARGUMENT,"Max attempts must be at least 1")}(n),function(i,o,u){const c=new Pe;return i.asyncQueue.enqueueAndForget(async()=>{const h=await pf(i);new oT(i.asyncQueue,h,u,o,c).au()}),c.promise}(ge(r),s=>e(new jT(r,s)),n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lw(){return new ls("deleteField")}function hw(){return new Ka("serverTimestamp")}function dw(...r){return new Qa("arrayUnion",r)}function fw(...r){return new Wa("arrayRemove",r)}function mw(r){return new Ha("increment",r)}function pw(r){return new Di(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gw(r){return ge(r=Y(r,ae)),new qT(r,e=>fs(r,e))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _w(r,e){const t=ge(r=Y(r,ae));if(!t._uninitializedComponentsProvider||t._uninitializedComponentsProvider._offline.kind==="memory")return Je("Cannot enable indexes when persistence is disabled"),Promise.resolve();const n=function(i){const o=typeof i=="string"?function(h){try{return JSON.parse(h)}catch(f){throw new N(S.INVALID_ARGUMENT,"Failed to parse JSON: "+(f==null?void 0:f.message))}}(i):i,u=[];if(Array.isArray(o.indexes))for(const c of o.indexes){const h=xl(c,"collectionGroup"),f=[];if(Array.isArray(c.fields))for(const m of c.fields){const g=Ni("setIndexConfiguration",xl(m,"fieldPath"));m.arrayConfig==="CONTAINS"?f.push(new cn(g,2)):m.order==="ASCENDING"?f.push(new cn(g,0)):m.order==="DESCENDING"&&f.push(new cn(g,1))}u.push(new jn(jn.UNKNOWN_ID,h,f,zn.empty()))}return u}(e);return gT(t,n)}function xl(r,e){if(typeof r[e]!="string")throw new N(S.INVALID_ARGUMENT,"Missing string value for: "+e);return r[e]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zT{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function yw(r){var e;r=Y(r,ae);const t=kl.get(r);if(t)return t;if(((e=ge(r)._uninitializedComponentsProvider)===null||e===void 0?void 0:e._offline.kind)!=="persistent")return null;const n=new zT(r);return kl.set(r,n),n}function Iw(r){Of(r,!0)}function Tw(r){Of(r,!1)}function Ew(r){yT(ge(r._firestore)).then(e=>k("deleting all persistent cache indexes succeeded")).catch(e=>Je("deleting all persistent cache indexes failed",e))}function Of(r,e){_T(ge(r._firestore),e).then(t=>k(`setting persistent cache index auto creation isEnabled=${e} succeeded`)).catch(t=>Je(`setting persistent cache index auto creation isEnabled=${e} failed`,t))}const kl=new WeakMap;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ww(r){var e;const t=(e=ge(Y(r.firestore,ae))._onlineComponents)===null||e===void 0?void 0:e.datastore.serializer;return t===void 0?null:wi(t,Be(r._query))._t}function vw(r,e){var t;const n=Oh(e,(i,o)=>new hd(o,i.aggregateType,i._internalFieldPath)),s=(t=ge(Y(r.firestore,ae))._onlineComponents)===null||t===void 0?void 0:t.datastore.serializer;return s===void 0?null:Ad(s,Hh(r._query),n,!0).request}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aw{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return nu.instance.onExistenceFilterMismatch(e)}}class nu{constructor(){this.Uu=new Map}static get instance(){return Ls||(Ls=new nu,function(t){if(ni)throw new Error("a TestingHooksSpi instance is already set");ni=t}(Ls)),Ls}et(e){this.Uu.forEach(t=>t(e))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.Uu;return n.set(t,e),()=>n.delete(t)}}let Ls=null;(function(e,t=!0){(function(s){rr=s})(Fp),kt(new ft("firestore",(n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),u=new ae(new m_(n.getProvider("auth-internal")),new __(n.getProvider("app-check-internal")),function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new N(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new dn(h.options.projectId,f)}(o,s),o);return i=Object.assign({useFetchStreams:t},i),u._setSettings(i),u},"PUBLIC").setMultipleInstances(!0)),dt(wc,"4.7.3",e),dt(wc,"4.7.3","esm2017")})();function bw(r,e){var t={};for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(r);s<n.length;s++)e.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(r,n[s])&&(t[n[s]]=r[n[s]]);return t}var Mf={exports:{}};(function(r){var e=function(){var t=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",i={};function o(c,h){if(!i[c]){i[c]={};for(var f=0;f<c.length;f++)i[c][c.charAt(f)]=f}return i[c][h]}var u={compressToBase64:function(c){if(c==null)return"";var h=u._compress(c,6,function(f){return n.charAt(f)});switch(h.length%4){default:case 0:return h;case 1:return h+"===";case 2:return h+"==";case 3:return h+"="}},decompressFromBase64:function(c){return c==null?"":c==""?null:u._decompress(c.length,32,function(h){return o(n,c.charAt(h))})},compressToUTF16:function(c){return c==null?"":u._compress(c,15,function(h){return t(h+32)})+" "},decompressFromUTF16:function(c){return c==null?"":c==""?null:u._decompress(c.length,16384,function(h){return c.charCodeAt(h)-32})},compressToUint8Array:function(c){for(var h=u.compress(c),f=new Uint8Array(h.length*2),m=0,g=h.length;m<g;m++){var E=h.charCodeAt(m);f[m*2]=E>>>8,f[m*2+1]=E%256}return f},decompressFromUint8Array:function(c){if(c==null)return u.decompress(c);for(var h=new Array(c.length/2),f=0,m=h.length;f<m;f++)h[f]=c[f*2]*256+c[f*2+1];var g=[];return h.forEach(function(E){g.push(t(E))}),u.decompress(g.join(""))},compressToEncodedURIComponent:function(c){return c==null?"":u._compress(c,6,function(h){return s.charAt(h)})},decompressFromEncodedURIComponent:function(c){return c==null?"":c==""?null:(c=c.replace(/ /g,"+"),u._decompress(c.length,32,function(h){return o(s,c.charAt(h))}))},compress:function(c){return u._compress(c,16,function(h){return t(h)})},_compress:function(c,h,f){if(c==null)return"";var m,g,E={},V={},C="",D="",M="",U=2,O=3,q=2,$=[],x=0,y=0,_;for(_=0;_<c.length;_+=1)if(C=c.charAt(_),Object.prototype.hasOwnProperty.call(E,C)||(E[C]=O++,V[C]=!0),D=M+C,Object.prototype.hasOwnProperty.call(E,D))M=D;else{if(Object.prototype.hasOwnProperty.call(V,M)){if(M.charCodeAt(0)<256){for(m=0;m<q;m++)x=x<<1,y==h-1?(y=0,$.push(f(x)),x=0):y++;for(g=M.charCodeAt(0),m=0;m<8;m++)x=x<<1|g&1,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=g>>1}else{for(g=1,m=0;m<q;m++)x=x<<1|g,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=0;for(g=M.charCodeAt(0),m=0;m<16;m++)x=x<<1|g&1,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=g>>1}U--,U==0&&(U=Math.pow(2,q),q++),delete V[M]}else for(g=E[M],m=0;m<q;m++)x=x<<1|g&1,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=g>>1;U--,U==0&&(U=Math.pow(2,q),q++),E[D]=O++,M=String(C)}if(M!==""){if(Object.prototype.hasOwnProperty.call(V,M)){if(M.charCodeAt(0)<256){for(m=0;m<q;m++)x=x<<1,y==h-1?(y=0,$.push(f(x)),x=0):y++;for(g=M.charCodeAt(0),m=0;m<8;m++)x=x<<1|g&1,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=g>>1}else{for(g=1,m=0;m<q;m++)x=x<<1|g,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=0;for(g=M.charCodeAt(0),m=0;m<16;m++)x=x<<1|g&1,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=g>>1}U--,U==0&&(U=Math.pow(2,q),q++),delete V[M]}else for(g=E[M],m=0;m<q;m++)x=x<<1|g&1,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=g>>1;U--,U==0&&(U=Math.pow(2,q),q++)}for(g=2,m=0;m<q;m++)x=x<<1|g&1,y==h-1?(y=0,$.push(f(x)),x=0):y++,g=g>>1;for(;;)if(x=x<<1,y==h-1){$.push(f(x));break}else y++;return $.join("")},decompress:function(c){return c==null?"":c==""?null:u._decompress(c.length,32768,function(h){return c.charCodeAt(h)})},_decompress:function(c,h,f){var m=[],g=4,E=4,V=3,C="",D=[],M,U,O,q,$,x,y,_={val:f(0),position:h,index:1};for(M=0;M<3;M+=1)m[M]=M;for(O=0,$=Math.pow(2,2),x=1;x!=$;)q=_.val&_.position,_.position>>=1,_.position==0&&(_.position=h,_.val=f(_.index++)),O|=(q>0?1:0)*x,x<<=1;switch(O){case 0:for(O=0,$=Math.pow(2,8),x=1;x!=$;)q=_.val&_.position,_.position>>=1,_.position==0&&(_.position=h,_.val=f(_.index++)),O|=(q>0?1:0)*x,x<<=1;y=t(O);break;case 1:for(O=0,$=Math.pow(2,16),x=1;x!=$;)q=_.val&_.position,_.position>>=1,_.position==0&&(_.position=h,_.val=f(_.index++)),O|=(q>0?1:0)*x,x<<=1;y=t(O);break;case 2:return""}for(m[3]=y,U=y,D.push(y);;){if(_.index>c)return"";for(O=0,$=Math.pow(2,V),x=1;x!=$;)q=_.val&_.position,_.position>>=1,_.position==0&&(_.position=h,_.val=f(_.index++)),O|=(q>0?1:0)*x,x<<=1;switch(y=O){case 0:for(O=0,$=Math.pow(2,8),x=1;x!=$;)q=_.val&_.position,_.position>>=1,_.position==0&&(_.position=h,_.val=f(_.index++)),O|=(q>0?1:0)*x,x<<=1;m[E++]=t(O),y=E-1,g--;break;case 1:for(O=0,$=Math.pow(2,16),x=1;x!=$;)q=_.val&_.position,_.position>>=1,_.position==0&&(_.position=h,_.val=f(_.index++)),O|=(q>0?1:0)*x,x<<=1;m[E++]=t(O),y=E-1,g--;break;case 2:return D.join("")}if(g==0&&(g=Math.pow(2,V),V++),m[y])C=m[y];else if(y===E)C=U+U.charAt(0);else return null;D.push(C),m[E++]=U+C.charAt(0),g--,U=C,g==0&&(g=Math.pow(2,V),V++)}}};return u}();r!=null?r.exports=e:typeof angular<"u"&&angular!=null&&angular.module("LZString",[]).factory("LZString",function(){return e})})(Mf);var GT=Mf.exports;const Rw=mm(GT);export{fw as $,Nf as A,Tn as B,nt as C,we as D,de as E,wn as F,$a as G,Aw as H,Y as I,oE as J,vw as K,wT as L,ww as M,cE as N,Je as O,zT as P,xe as Q,IT as R,pE as S,pe as T,ZE as U,Di as V,qT as W,qE as X,jE as Y,DE as Z,vh as _,Yr as a,gw as a$,dw as a0,UE as a1,TE as a2,dE as a3,fE as a4,TT as a5,CT as a6,Ew as a7,XE as a8,lw as a9,rw as aA,iw as aB,sw as aC,RE as aD,ew as aE,tw as aF,CE as aG,ow as aH,aw as aI,BT as aJ,PE as aK,Tf as aL,mE as aM,cw as aN,hw as aO,JE as aP,_w as aQ,iE as aR,zE as aS,ME as aT,OE as aU,BE as aV,AE as aW,YE as aX,pw as aY,EE as aZ,VE as a_,vE as aa,Tw as ab,ET as ac,SE as ad,yE as ae,IE as af,wE as ag,Iw as ah,LE as ai,FE as aj,ge as ak,fs as al,xT as am,nw as an,GE as ao,$E as ap,KE as aq,QE as ar,WE as as,HE as at,_E as au,yw as av,mw as aw,gE as ax,NE as ay,bE as az,vT as b,Yo as b0,QT as b1,WT as b2,JT as b3,kt as b4,ft as b5,Pm as b6,Fp as b7,fi as b8,rE as b9,Ae as ba,nE as bb,bw as bc,te as bd,Un as be,qt as bf,ym as bg,ZT as bh,En as bi,vm as bj,Gl as bk,xt as bl,YT as bm,XT as bn,eE as bo,tE as bp,HT as bq,Lp as br,sE as bs,l_ as bt,Rw as bu,tr as c,vn as d,ae as e,N as f,dr as g,hs as h,Qs as i,Li as j,ds as k,kE as l,Mi as m,eu as n,xE as o,nr as p,Fi as q,dt as r,KT as s,an as t,jT as u,ye as v,dn as w,B as x,aE as y,d_ as z};
