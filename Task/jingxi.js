/*
本脚本为京东旗下京喜app签到脚本
获取Cookie方法:
打开app首页，点击"任务赚金币",再点击"我的金币"即可
[rewrite_local]
https:\/\/wq\.jd\.com\/pgcenter\/sign\/QueryPGDetail\?sceneval=2&pageSize=20 url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jingxi.js
[task_local]
0 9 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jingxi.js

~~~~~~~~~~~~~~~~
[MITM]
hostname = wq.jd.com
~~~~~~~~~~~~~~~~
*/

const $ = new Env('京喜')
const headersVal = $.getdata('signheaders_jx')

if (isGetCookie = typeof $request != 'undefined') {
   if ($request.headers && $request.method != 'OPTIONS') 
  {
   const headersVal = JSON.stringify($request.headers)
   coinurl = $request.url
   $.log(` ${$.name}`,`coinurl: ${coinurl}`)
   $.log(` ${$.name}`,`headers: ${headersVal}`)
   $.setdata(headersVal, 'signheaders_jx')
   $.setdata(coinurl, 'coinurl_jx')
   if(coinurl&&headersVal) $.msg($.name, `获取Cookie: 成功🎉`, ``)
  }
} else {
!(async() => {
    await getsign(),
    await coininfo(),
    await doublesign(),
    await showmsg()
  })()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
}

function getsign() {
  return new Promise((resolve) =>{
	const signurl = {
	  url: 'https://wq.jd.com/pgcenter/sign/UserSignOpr?sceneval=2&source=&_=1599366344614&sceneval=2&g_login_type=1&callback=jsonpCBKJ&g_ty=ls',
       headers: JSON.parse(headersVal)
  }
    $.get(signurl, (err, resp, data) => {
      nick = data.split(':')[6].split(',')[0].replace(/[\"]+/g,"")
      totalpoints = data.match(/[0-9]+/g)[3]
      signdays = "已签"+data.match(/[0-9]+/g)[6]+"天"
    if (data.match(/[0-9]+/g)[9] == 0){
      signresult = "签到成功"
      signdays += " 今日获得"+data.match(/[0-9]+/g)[4]+"积分"
      }
    else if (data.match(/[0-9]+/g)[9] == 1){
      signresult = "签到重复"
      }
    else{
      signresult = "签到失败"
      }
      resolve()
     })
  })
}

function coininfo() {
return new Promise((resolve) =>{
	const coinurl = {
	  url: $.getdata('coinurl_jx'),
       headers: JSON.parse(headersVal)
  }
    $.get(coinurl, (err, resp, data) => {
   let time =data.match(/[\d{11}$][^\"|\{|\}]+/g)
       totime = new Date(new Date().toLocaleDateString()).getTime()/1000
       today = Number()
   for (i=0; i<time.length;i++){
    if (time[i] >= totime){
       account = Number(time[i-5].replace(",",""))
       today += account
    if (time[i-4]==10000){
        toaccount = Number(time[i-5].replace(",",""))
     coin = " 今日签到得"+ toaccount+ "个金币 共计"+today+ "个金币"
        }
       }
     }
  resolve()
  })
 })
}

function doublesign() {
return new Promise((resolve) =>{
	const doubleurl = {
	  url: 'https://m.jingxi.com/double_sign/IssueReward?sceneval=2&g_login_type=1&g_ty=ajax',
       headers: JSON.parse(headersVal)
  }
    $.get(doubleurl, (err, resp, data) => {
    doubleresult = JSON.parse(data)
   if (doubleresult.data.double_sign_status ==0){
    doubleres = "双签成功 🧧+ "+doubleresult.data.jd_amount/100+"元"
    $.log($.name+ ""+ doubleres)
   }
  resolve()
  })
 })
}

function showmsg() {
   $.sub = signresult+" 积分总计:"+totalpoints
   $.desc = signdays + coin
$.msg($.name, $.sub, $.desc)
}

function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient}isLoon(){return"undefined"!=typeof $loon}loaddata(){if(!this.isNode)return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch{return{}}}}}writedata(){if(this.isNode){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}catch{const s={};this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}msg(s=t,e="",i="",o){this.isSurge()||this.isLoon()?$notification.post(s,e,i):this.isQuanX()&&$notify(s,e,i),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.message)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t=null){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
