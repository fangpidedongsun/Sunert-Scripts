/*
更新时间: 2020-09-04 11:45

> 感谢 [@barry](https://t.me/barrymchen) 编写
> 感谢 [@GideonSenku](https://github.com/GideonSenku) 对代码优化
本脚本仅适用于京东到家签到及获取鲜豆
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.APP登陆账号后，点击首页'签到',即可获取Cookie.

##3月25日10点修改:增加鲜豆信息，cookie、task二合一


by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
京东到家 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js,script-update-interval=0

# 获取京东到家 Cookie.
京东到家 = type=http-request,pattern=https:\/\/daojia\.jd\.com\/client\?_jdrandom=\d{13}&functionId=%2Fsignin,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js,
~~~~~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js, enabled=true, tag=京东到家

http-request https:\/\/daojia\.jd\.com\/client\?_jdrandom=\d{13}&functionId=%2Fsignin script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js

---------------------

QX 1.0.7+ :
[task_local]
0 9 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js

[rewrite_local]
https:\/\/daojia\.jd\.com\/client\?_jdrandom=\d{13}&functionId=%2Fsignin url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jddj.js
~~~~~~~~~~~~~~~~

hostname = daojia.jd.com

~~~~~~~~~~~~~~~~

task
0 0 * * * jddj.js

*/
const CookieName ='京东到家'
const CookieKey = 'sy_cookie_dj'
const $ = new Env(CookieName);
const cookieVal = $.getdata(CookieKey);

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
!(async () => {
  await signinfo()
  if(signresult == false){
     await sign()
   }
   await showmsg()
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
}
function GetCookie() {
  if ($request.headers) {
    var CookieValue = $request.headers['Cookie'];
    if ($.getdata(CookieKey) != (undefined || null)) {
      if ($.getdata(CookieKey) != CookieValue) {
        var cookie = $.setdata(CookieValue, CookieKey);
        if (!cookie) {
          $.msg("更新" + CookieName + "Cookie失败‼️", "", "");
          $.log(`[${CookieName}] 获取Cookie: 失败`);
        } else {
          $.msg("更新" + CookieName + "Cookie成功 🎉", "", "");
          $.log(`[${CookieName}] 获取Cookie: 成功, Cookie: ${CookieValue}`)
        }
      }
    } else {
      var cookie = $.setdata(CookieValue, CookieKey);
      if (!cookie) {
        $.msg("首次写入" + CookieName + "Cookie失败‼️", "", "");
      } else {
        $.msg("首次写入" + CookieName + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    $.msg("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
  }
}

function signinfo() {
return new Promise((resolve) => {
 let url2 = {url: `https://daojia.jd.com/client?functionId=signin%2FshowSignInMsgNew&body=%7B%7D`, headers: { Cookie:cookieVal}}   
      $.get(url2, (error, response, data) => {
      //$.log(`${CookieName}, data: ${data}`)
      let result = JSON.parse(data)
      if (result.code != 0) {
      subTitle = `签到结果: 失败`
      detail = `说明: ${result.msg}`
      $.msg(CookieName, subTitle, detail)
      return
    } 
     else if  (result.code == 0){
         pointsnum = "鲜豆总计:"+ result.result.userInfoResponse.points
         signdays = result.result.sevenDaysRewardResponse.alreadySignInDays
         signresult = result.result.userInfoResponse.hasSign
         tompoint =  result.result.sevenDaysRewardResponse.tomorrowSingInRewardText
       for (let i = 0; i < result.result.sevenDaysRewardResponse.items.length; i++){
    if (result.result.sevenDaysRewardResponse.items[i].day == signdays&&signresult == true){
        gettoday = `今日获取${result.result.sevenDaysRewardResponse.items[i].points}个鲜豆`
     if (result.result.sevenDaysRewardResponse.items[i].couponPrice){
        gettoday += " "+result.result.sevenDaysRewardResponse.items[i].couponPrice+"元优惠券"
             }
           }
    if (result.result.sevenDaysRewardResponse.items[i].day == signdays&&signresult == false){
        gettoday = `今日获取${result.result.sevenDaysRewardResponse.items[i+1].points}个鲜豆`
     if (result.result.sevenDaysRewardResponse.items[i+1].couponPrice){
        gettoday += " "+result.result.sevenDaysRewardResponse.items[i+1].couponPrice+"元优惠券"
             }
           }
        }
     }
     resolve()
    })
  })
}
function sign()  {
let url = {url: 'https://daojia.jd.com/client?functionId=signin%2FuserSigninNew&body=%7B%7D',
    headers: { Cookie:cookieVal}}   
    $.get(url, (error, response, data) => {
     $.log(`${CookieName}, data: ${data}`)
    })
}
async function showmsg() {
  if (signresult==true){
       $.subtitle = "签到重复🔁  " +pointsnum
}
  if (signresult==false){
       await sign()
       $.subtitle = "签到成功🎉  " +pointsnum
}
       $.detail = gettoday+ `\n`+"已签到"+signdays+"天 "+tompoint
$.msg(CookieName,  $.subtitle,  $.detail)
}

function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient}isLoon(){return"undefined"!=typeof $loon}loaddata(){if(!this.isNode)return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch{return{}}}}}writedata(){if(this.isNode){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}catch{const s={};this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}msg(s=t,e="",i="",o){this.isSurge()||this.isLoon()?$notification.post(s,e,i):this.isQuanX()&&$notify(s,e,i),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.message)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t=null){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
