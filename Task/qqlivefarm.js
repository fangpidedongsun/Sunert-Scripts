/*
本脚本仅适用于微博每日签到  
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域下
2.打开微博App，刷微博视频，获取Cookie，获取后请注释或禁用Cookie
3.打开微博钱包点击签到，获取Cookie，
4.钱包签到时获取Cookie,已经签到无法获取
5.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
6.4月23日更新，更换微博签到Cookie,随时能获取，获取后请禁用

仅测试Quantumult x，Surge、Loon自行测试
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
腾讯视频小鹅农场 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/qqlivefarm.js,script-update-interval=0


腾讯视频小鹅农场 = type=https:\/\/farmcgi\.videoyx\.com\/g13-server\/receiveTaskAward,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/qqlivefarm.js


~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=qqlivefarm.js, enabled=true, tag=腾讯视频小鹅农场

http-request https:\/\/farmcgi\.videoyx\.com\/g13-server\/receiveTaskAward script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/qqlivefarm.js
-----------------

QX 1.0.6+ :
[task_local]
0 9 * * * qqlivefarm.js

[rewrite_local]
https:\/\/farmcgi\.videoyx\.com\/g13-server\/receiveTaskAward url script-request-header qqlivefarm.js
~~~~~~~~~~~~~~~~
[MITM]
hostname = farmcgi.videoyx.com
~~~~~~~~~~~~~~~~
*/

const CookieName ='腾讯视频小鹅农场'
//const signurlKey = 'signurl.qqliveyx'
const signheaderKey = `signheader_qqliveyx`
const signbodyKey = `signbody_qqliveyx`
const sy = init()
//const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)
const signbodyVal = sy.getdata(signbodyKey)

let isGetCookie = typeof $request !== `undefined`
if (isGetCookie) {
   GetCookie()
} else {
   sign()
}

function GetCookie() {
if ($request && $request.method != 'OPTIONS' && $request.url.match(/\/g13-server\/receiveTaskAward/)) {
  //const signurlVal = $request.url
     const signheaderVal = JSON.stringify($request.headers)
     const signbodyVal = $request.body
   sy.log(`signbodyVal:${signbodyVal}`)
   sy.log(`signheaderVal:${signheaderVal}`)
  if (signbodyVal) sy.setdata(signbodyVal, signbodyKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  sy.msg(CookieName, `获取腾讯视频小鹅农场Cookie: 成功`, ``)
 } 
}

//签到
function sign() {
   return new Promise((resolve, reject) =>{
   let signurl =  {
      url: `https://farmcgi.videoyx.com/g13-server/receiveTaskAward`,
      headers: signheaderVal，
      body: signbodyVal，
     }
     sy.post(signurl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data)
     if (result.code == 0){
         subTitle = `签到成功`
         //detail = `连续签到${result.data.continuous}天，获得收益: ${result.data.desc}💰`  
         }  
     else if (result.code == 3000002){
         subTitle = `重复签到`
         //detail = `签到说明: `+ result.errmsg
       }
     else {
         subTitle = `签到失败❌`
         //detail = `说明:`
         }
    },resolve)
  })
}

function init() {
  isSurge = () => {
      return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
      return undefined === this.$task ? false : true
    }
    getdata = (key) => {
      if (isSurge()) return $persistentStore.read(key)
      if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
      if (isSurge()) return $persistentStore.write(key, val)
      if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
      if (isSurge()) $notification.post(title, subtitle, body)
      if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
      if (isSurge()) {
        $httpClient.get(url, cb)
      }
      if (isQuanX()) {
        url.method = 'GET'
        $task.fetch(url).then((resp) => cb(null, {}, resp.body))
      }
    }
    post = (url, cb) => {
      if (isSurge()) {
        $httpClient.post(url, cb)
      }
      if (isQuanX()) {
        url.method = 'POST'
        $task.fetch(url).then((resp) => cb(null, {}, resp.body))
      }
    }
    done = (value = {}) => {
      $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
  }

