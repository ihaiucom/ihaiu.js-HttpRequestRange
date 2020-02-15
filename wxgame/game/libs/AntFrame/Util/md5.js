"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Md5=function(){function Md5(){this._state=new Int32Array(4),this._buffer=new ArrayBuffer(68),this._buffer8=new Uint8Array(this._buffer,0,68),this._buffer32=new Uint32Array(this._buffer,0,17),this.start()}return Md5.hashStr=function(t,e){return void 0===e&&(e=!1),this.onePassHasher.start().appendStr(t).end(e)},Md5.hashAsciiStr=function(t,e){return void 0===e&&(e=!1),this.onePassHasher.start().appendAsciiStr(t).end(e)},Md5._hex=function(t){var e,r,s,n,h=Md5.hexChars,f=Md5.hexOut;for(n=0;n<4;n+=1)for(r=8*n,e=t[n],s=0;s<8;s+=2)f[r+1+s]=h.charAt(15&e),e>>>=4,f[r+0+s]=h.charAt(15&e),e>>>=4;return f.join("")},Md5._md5cycle=function(t,e){var r=t[0],s=t[1],n=t[2],h=t[3];s=((s+=((n=((n+=((h=((h+=((r=((r+=(s&n|~s&h)+e[0]-680876936|0)<<7|r>>>25)+s|0)&s|~r&n)+e[1]-389564586|0)<<12|h>>>20)+r|0)&r|~h&s)+e[2]+606105819|0)<<17|n>>>15)+h|0)&h|~n&r)+e[3]-1044525330|0)<<22|s>>>10)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s&n|~s&h)+e[4]-176418897|0)<<7|r>>>25)+s|0)&s|~r&n)+e[5]+1200080426|0)<<12|h>>>20)+r|0)&r|~h&s)+e[6]-1473231341|0)<<17|n>>>15)+h|0)&h|~n&r)+e[7]-45705983|0)<<22|s>>>10)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s&n|~s&h)+e[8]+1770035416|0)<<7|r>>>25)+s|0)&s|~r&n)+e[9]-1958414417|0)<<12|h>>>20)+r|0)&r|~h&s)+e[10]-42063|0)<<17|n>>>15)+h|0)&h|~n&r)+e[11]-1990404162|0)<<22|s>>>10)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s&n|~s&h)+e[12]+1804603682|0)<<7|r>>>25)+s|0)&s|~r&n)+e[13]-40341101|0)<<12|h>>>20)+r|0)&r|~h&s)+e[14]-1502002290|0)<<17|n>>>15)+h|0)&h|~n&r)+e[15]+1236535329|0)<<22|s>>>10)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s&h|n&~h)+e[1]-165796510|0)<<5|r>>>27)+s|0)&n|s&~n)+e[6]-1069501632|0)<<9|h>>>23)+r|0)&s|r&~s)+e[11]+643717713|0)<<14|n>>>18)+h|0)&r|h&~r)+e[0]-373897302|0)<<20|s>>>12)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s&h|n&~h)+e[5]-701558691|0)<<5|r>>>27)+s|0)&n|s&~n)+e[10]+38016083|0)<<9|h>>>23)+r|0)&s|r&~s)+e[15]-660478335|0)<<14|n>>>18)+h|0)&r|h&~r)+e[4]-405537848|0)<<20|s>>>12)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s&h|n&~h)+e[9]+568446438|0)<<5|r>>>27)+s|0)&n|s&~n)+e[14]-1019803690|0)<<9|h>>>23)+r|0)&s|r&~s)+e[3]-187363961|0)<<14|n>>>18)+h|0)&r|h&~r)+e[8]+1163531501|0)<<20|s>>>12)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s&h|n&~h)+e[13]-1444681467|0)<<5|r>>>27)+s|0)&n|s&~n)+e[2]-51403784|0)<<9|h>>>23)+r|0)&s|r&~s)+e[7]+1735328473|0)<<14|n>>>18)+h|0)&r|h&~r)+e[12]-1926607734|0)<<20|s>>>12)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s^n^h)+e[5]-378558|0)<<4|r>>>28)+s|0)^s^n)+e[8]-2022574463|0)<<11|h>>>21)+r|0)^r^s)+e[11]+1839030562|0)<<16|n>>>16)+h|0)^h^r)+e[14]-35309556|0)<<23|s>>>9)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s^n^h)+e[1]-1530992060|0)<<4|r>>>28)+s|0)^s^n)+e[4]+1272893353|0)<<11|h>>>21)+r|0)^r^s)+e[7]-155497632|0)<<16|n>>>16)+h|0)^h^r)+e[10]-1094730640|0)<<23|s>>>9)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s^n^h)+e[13]+681279174|0)<<4|r>>>28)+s|0)^s^n)+e[0]-358537222|0)<<11|h>>>21)+r|0)^r^s)+e[3]-722521979|0)<<16|n>>>16)+h|0)^h^r)+e[6]+76029189|0)<<23|s>>>9)+n|0,s=((s+=((n=((n+=((h=((h+=((r=((r+=(s^n^h)+e[9]-640364487|0)<<4|r>>>28)+s|0)^s^n)+e[12]-421815835|0)<<11|h>>>21)+r|0)^r^s)+e[15]+530742520|0)<<16|n>>>16)+h|0)^h^r)+e[2]-995338651|0)<<23|s>>>9)+n|0,s=((s+=((h=((h+=(s^((r=((r+=(n^(s|~h))+e[0]-198630844|0)<<6|r>>>26)+s|0)|~n))+e[7]+1126891415|0)<<10|h>>>22)+r|0)^((n=((n+=(r^(h|~s))+e[14]-1416354905|0)<<15|n>>>17)+h|0)|~r))+e[5]-57434055|0)<<21|s>>>11)+n|0,s=((s+=((h=((h+=(s^((r=((r+=(n^(s|~h))+e[12]+1700485571|0)<<6|r>>>26)+s|0)|~n))+e[3]-1894986606|0)<<10|h>>>22)+r|0)^((n=((n+=(r^(h|~s))+e[10]-1051523|0)<<15|n>>>17)+h|0)|~r))+e[1]-2054922799|0)<<21|s>>>11)+n|0,s=((s+=((h=((h+=(s^((r=((r+=(n^(s|~h))+e[8]+1873313359|0)<<6|r>>>26)+s|0)|~n))+e[15]-30611744|0)<<10|h>>>22)+r|0)^((n=((n+=(r^(h|~s))+e[6]-1560198380|0)<<15|n>>>17)+h|0)|~r))+e[13]+1309151649|0)<<21|s>>>11)+n|0,s=((s+=((h=((h+=(s^((r=((r+=(n^(s|~h))+e[4]-145523070|0)<<6|r>>>26)+s|0)|~n))+e[11]-1120210379|0)<<10|h>>>22)+r|0)^((n=((n+=(r^(h|~s))+e[2]+718787259|0)<<15|n>>>17)+h|0)|~r))+e[9]-343485551|0)<<21|s>>>11)+n|0,t[0]=r+t[0]|0,t[1]=s+t[1]|0,t[2]=n+t[2]|0,t[3]=h+t[3]|0},Md5.prototype.start=function(){return this._dataLength=0,this._bufferLength=0,this._state.set(Md5.stateIdentity),this},Md5.prototype.appendStr=function(t){var e,r,s=this._buffer8,n=this._buffer32,h=this._bufferLength;for(r=0;r<t.length;r+=1){if((e=t.charCodeAt(r))<128)s[h++]=e;else if(e<2048)s[h++]=192+(e>>>6),s[h++]=63&e|128;else if(e<55296||e>56319)s[h++]=224+(e>>>12),s[h++]=e>>>6&63|128,s[h++]=63&e|128;else{if((e=1024*(e-55296)+(t.charCodeAt(++r)-56320)+65536)>1114111)throw new Error("Unicode standard supports code points up to U+10FFFF");s[h++]=240+(e>>>18),s[h++]=e>>>12&63|128,s[h++]=e>>>6&63|128,s[h++]=63&e|128}h>=64&&(this._dataLength+=64,Md5._md5cycle(this._state,n),h-=64,n[0]=n[16])}return this._bufferLength=h,this},Md5.prototype.appendAsciiStr=function(t){for(var e,r=this._buffer8,s=this._buffer32,n=this._bufferLength,h=0;;){for(e=Math.min(t.length-h,64-n);e--;)r[n++]=t.charCodeAt(h++);if(n<64)break;this._dataLength+=64,Md5._md5cycle(this._state,s),n=0}return this._bufferLength=n,this},Md5.prototype.appendByteArray=function(t){for(var e,r=this._buffer8,s=this._buffer32,n=this._bufferLength,h=0;;){for(e=Math.min(t.length-h,64-n);e--;)r[n++]=t[h++];if(n<64)break;this._dataLength+=64,Md5._md5cycle(this._state,s),n=0}return this._bufferLength=n,this},Md5.prototype.getState=function(){var t=this._state;return{buffer:String.fromCharCode.apply(null,this._buffer8),buflen:this._bufferLength,length:this._dataLength,state:[t[0],t[1],t[2],t[3]]}},Md5.prototype.setState=function(t){var e,r=t.buffer,s=t.state,n=this._state;for(this._dataLength=t.length,this._bufferLength=t.buflen,n[0]=s[0],n[1]=s[1],n[2]=s[2],n[3]=s[3],e=0;e<r.length;e+=1)this._buffer8[e]=r.charCodeAt(e)},Md5.prototype.end=function(t){void 0===t&&(t=!1);var e,r=this._bufferLength,s=this._buffer8,n=this._buffer32,h=1+(r>>2);if(this._dataLength+=r,s[r]=128,s[r+1]=s[r+2]=s[r+3]=0,n.set(Md5.buffer32Identity.subarray(h),h),r>55&&(Md5._md5cycle(this._state,n),n.set(Md5.buffer32Identity)),(e=8*this._dataLength)<=4294967295)n[14]=e;else{var f=e.toString(16).match(/(.*?)(.{0,8})$/);if(null===f)return;var i=parseInt(f[2],16),a=parseInt(f[1],16)||0;n[14]=i,n[15]=a}return Md5._md5cycle(this._state,n),t?this._state:Md5._hex(this._state)},Md5.stateIdentity=new Int32Array([1732584193,-271733879,-1732584194,271733878]),Md5.buffer32Identity=new Int32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),Md5.hexChars="0123456789abcdef",Md5.hexOut=[],Md5.onePassHasher=new Md5,Md5}();exports.Md5=Md5,"5d41402abc4b2a76b9719d911017c592"!==Md5.hashStr("hello")&&console.error("Md5 self test failed.");