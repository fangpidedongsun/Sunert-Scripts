/*
本脚本仅适用于马卡龙抠图神器  测试
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.打开马卡龙抠图神器app， 点击右下角”我的“=> 账户名下 ”**蛋壳“， 即可获取Cookie和token,获取成功后请禁用cookie

3.蛋壳明细显示今日获取签到蛋壳，则表明签到正常

4.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

5.仅测试Quantumult X

By Macsuny 制作
感谢 chavyleung
感谢 senku
感谢悟空大大和各位的测试
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
cron ”0 9 * * *“ script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/makal.js
# 马卡龙抠图神器 Cookie.
http-request https:\/\/activity\.versa-ai\.com\/api\/community\/user\/sign\/days script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/makal.js
~~~~~~~~~~~~~~~~
QX 1.0.5+ :
[task_local]
0 9 * * * makal.js

[rewrite_local]
https:\/\/activity\.versa-ai\.com\/api\/community\/user\/sign\/days url script-request-header makal.js
~~~~~~~~~~~~~~~~
[MITM]
hostname = activity.versa-ai.com
~~~~~~~~~~~~~~~~
*/

const cookieName = `马卡龙抠图神器`
const signurlKey = `sy_signurl_mkl`
const signheaderKey = `sy_signheader_mkl`
const tokenKey = `sy_token_mkl`
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)
const tokenVal = sy.getdata(tokenKey)
const token = JSON.parse(tokenVal)
const uid = `${token.uid}`
const bedate = `${token.beginDate}`
const userToken = `${token.userToken}`
const deviceId = `${token.deviceId}`
const myDate = new Date();  

let isGetCookie = typeof $request !== `undefined`
if (isGetCookie) {
   GetCookie()
} else {
   sign()
}

function GetCookie() {
  const requrl = $request.url
if ($request && $request.method != `OPTIONS`) {
  const signurlVal = requrl
  const signheaderVal = JSON.stringify($request.headers)
  const signbodyVal = $request.body
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`signheaderVal:${signheaderVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  sy.msg(`${cookieName}`, `获取cookie: 成功`, ``)
  }
const queryparam = requrl.split(`?`)[1]
if (queryparam) {
  const params = {}
  for (param of requrl.split(`?`)[1].split(`&`)) {
    params[param.split(`=`)[0]] = param.split(`=`)[1]
  }
  const token = JSON.stringify(params)
  if (sy.setdata(token, tokenKey)) {
    sy.msg(`${cookieName}`, `获取Token: 成功`, ``)
    sy.log(`${cookieName} 获取Token: 成功, token: ${token}`)
    }
   }
  } 
function sign() {
return new Promise((resolve, reject) => {
  Y = myDate.getFullYear(); //获取当前年份  
  M = ("0" + (myDate.getMonth()+1)).slice(-2); //获取当前月份
  D = ("0" + (myDate.getDate())).slice(-2); //获取当前日(1-31)  
 var time1= Y+'-'+M+'-'+ D  +' 00:00:00'
    date=new Date(time1.replace(/-/g, '/'))   
    time2=date.getTime()
    time = Y +'/'+M+'/'+ D;
 urlVal = `https://activity.versa-ai.com/api/community/user/sign/days?beginDate=${bedate}&endDate=${time}&uid=${uid}&userToken=${userToken}&deviceId=${deviceId}&imei=&osType=ios&lang=zh-cn&source=app`
	  let signidurl = {
		url: urlVal,
		headers: JSON.parse(signheaderVal)      
	}
    sy.get(signidurl, (error, response, data) =>{
    sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data) 
     for (i=0; i < result.result.length;i++){
     if (time2 == result.result[i].signDate){
      Id = result.result[i].signId
      sy.log(result.result[i].signDate)
      
    sign2url = {
		url: `https://activity.versa-ai.com/api/community/user/sign/get/point`,
		headers: JSON.parse(signheaderVal),      
	     body : `uid=${uid}&userToken=${userToken}&deviceId=${deviceId}&imei=&osType=ios&lang=zh-cn&source=app&signId=${Id}`}
   sy.post(sign2url, (error, response, data) =>{
    sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data) 
     if (result.status == `success`){
            subTitle = `签到结果: 成功 🎉`
           }
     else {
            subTitle = `签到结果: 失败`
            detail = `请检查是否获取cookie\n${result.status}`
           }
         info()
         total()
         resolve()
          })
         }
        }
      })
   })
}

function info(){
return new Promise((resolve, reject) => {  
   n = myDate.getDay();//获取当前星期
   infourl = {
		url: `https://activity.versa-ai.com/api/community/user/sign/rule`,
		headers: JSON.parse(signheaderVal)}
    sy.get(infourl, (error, response, data) =>{
    //sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data)
     if (n <6&&n>0){
        detail = `今日获取金币:${result.result.weeks[n].point}  `
        }
    else if(n==0) {
        subTitle += ` ${result.result.keepSignItemName}`
        detail = `今日获取金币:${result.result.weeks[7].point}`
          }
     resolve()
       })
   })
}

function total() {
return new Promise((resolve, reject) => {
  totalurl = {
		url: `https://activity.versa-ai.com/api/community/user/sign/info?uid=${uid}&userToken=${userToken}&deviceId=${deviceId}&imei=&osType=ios&lang=zh-cn&source=app`,
		headers: JSON.parse(signheaderVal)}
    sy.get(totalurl, (error, response, data) =>{
    sy.log(`${cookieName}, data: ${data}`)
     let result = JSON.parse(data) 
   if (result.status == `success`){
       detail += `金币总计: ${result.result.userPoint}`
       resolve()
            }
     sy.msg(cookieName, subTitle, detail)
          })
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
  msg = (title, subTitle, body) => {
    if (isSurge()) $notification.post(title, subTitle, body)
    if (isQuanX()) $notify(title, subTitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = `GET`
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = `POST`
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
