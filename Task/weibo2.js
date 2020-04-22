/*
本脚本仅适用于微博每日签到  
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域下
2.打开微博主页，点击正文界面的签到,即可获取Cookie.
3.仅限签到时获取Cookie,已经签到无法获取
4.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

仅测试Quantumult x，Surge、Loon自行测试
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
weibo.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js,script-update-interval=0

# 获取微博 Cookie.
weibo.js = script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js,type=http-request,pattern=https:\/\/api\.weibo\.cn\/\d\/checkin\/add\?gsid

~~~~~~~~~~~~~~~~
QX 1.0.6+ :
[task_local]
0 9 * * * weibo.js

[rewrite_local]
# Get cookie. QX 1.0.5(188+):
https:\/\/api\.weibo\.cn\/\d\/checkin\/add\?gsid url script-request-header weibo.js
~~~~~~~~~~~~~~~~
QX or Surge [MITM]
hostname = api.weibo.cn
~~~~~~~~~~~~~~~~

*/

const CookieName ='微博签到2'
const signurlKey = 'sy.signurl.wb2'
const signheaderKey = `sy_signheader_wb2`
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)

let isGetCookie = typeof $request !== `undefined`
if (isGetCookie) {
   GetCookie()
} else {
   sign()
}
function GetCookie() {
if ($request && $request.method != `OPTIONS`) {
  const signurlVal = $request.url
  const signheaderVal = $request.headers
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`signheaderVal:${signheaderVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  sy.msg(CookieName, `获取Cookie: 成功🎉`, ``)
  }
 }
 
function sign() {
   return new Promise((resolve, reject) =>{
   let signurl =  {
      url: signurlVal,
      headers: {"User-Agent": 'Weibo/41997 (iPhone; iOS 13.4.1; Scale/3.00)'}}
     sy.post(signurl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data)
     if (result.status == 10000){
         subTitle = `签到成功🎉`
         detail = `连续签到${result.data.continuous}天，获得收益: ${result.data.desc}💰`  
         }  
     else if (result.errno == 30000){
         subTitle = `结果: 签到重复‼️`
         detail = `说明: `+ result.errmsg
       }
     else {
         subTitle = `签到失败❌`
         detail = `说明: ${result.errmsg}`
         }
       sy.msg(CookieName, subTitle, detail)
    })
  resolve()
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

