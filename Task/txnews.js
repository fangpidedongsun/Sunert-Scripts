/*
腾讯新闻签到修改版
获取Cookie方法:
 1. 把以下地址复制到响应配置下 
 [task_local]
0 9 * * * txnews.js, tag=腾讯新闻

 [rewrite_local]
https:\/\/api\.prize\.qq\.com\/v1\/newsapp\/rp\/common\?isJailbreak url script-request-header txnews.js

 [MITM]
hostname = api.prize.qq.com

2.复制链接: https://news.qq.com/FERD/cjRedDown.htm?app=newslite
到浏览器，然后跳转志腾讯新闻客户端(客户端关闭状态下)，即可获取Cookie，并获取每日红包

~~~~~~~~~~~~~~~~

Cookie获取后，请注释掉Cookie地址。

#腾讯新闻app签到，根据红鲤鱼与绿鲤鱼与驴修改

现无法自动领取红包，每日手动领取红包地址: https://news.qq.com/FERD/cjRedDown.htm?app=newslite

*/
const cookieName = '腾讯新闻'
const signurlKey = 'sy_signurl_txnews'
const signheaderKey = 'sy_signheader_txnews'
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const signheaderVal = sy.getdata(signheaderKey)

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   getsign()
}

function GetCookie() {
const requrl = $request.url
if ($request && $request.method != 'OPTIONS') {
  const signurlVal = requrl
  const signheaderVal = JSON.stringify($request.headers)
  sy.log(`signurlVal:${signurlVal}`)
  sy.log(`signheaderVal:${signheaderVal}`)
  if (signurlVal) sy.setdata(signurlVal, signurlKey)
  if (signheaderVal) sy.setdata(signheaderVal, signheaderKey)
  sy.msg(cookieName, `获取Cookie: 成功🎉`, ``)
  }
 }

function getsign() {
  const llUrl = {
    url: `https://api.inews.qq.com/task/v1/user/signin/add?`,
    headers: {
      Cookie: `${JSON.parse(signheaderVal).Cookie}`,
    }
  };
   sy.post(llUrl, function(error, response, data) {
    if (error) {
        sy.msg("腾讯新闻签到失败‼️", "", "");
       if (log) console.log("腾讯新闻签到失败" + data)
    } else {
    const obj = JSON.parse(data)
    //console.log(”原始数据:“+data)
      if (obj.info=="success"){
       console.log('腾讯新闻 签到成功，已连续签到' + obj.data.signin_days+"天"+"\n")
       note = '腾讯新闻'
       next = obj.data.next_points
       tip = obj.data.tip_soup
       author= obj.data.author
       str =  '签到成功，已连续签到' + obj.data.signin_days+'天  '+'明天将获得'+ next +'个金币'+ '\n'+tip.replace(/[\<|\.|\>|br]/g,"")+ author
    coinget()
} else {
      sy.msg('签到失败，🉐登录腾讯新闻app获取cookie', "", "")
      console.log('签到失败，🉐登录腾讯新闻app获取cookie'+data)
     }
   }
  })
}

function coinget() {
  const coinUrl = {
    url: `https://api.inews.qq.com/activity/v1/usercenter/activity/list?isJailbreak`,
    headers: {
      Cookie: `${JSON.parse(signheaderVal).Cookie}`,
    }
  };
    sy.post(coinUrl, function(error,response, data) {
    if (error) {
        sy.msg("获取收益信息失败‼️", "", "");
     if (log) console.log("获取收益信息" + data)
    } else {
     const jb = JSON.parse(data)
     notb = '共计' + jb.data.wealth[0].title +'个金币    '+"现金总计" + jb.data.wealth[1].title+'元';
     console.log(note+","+notb+ "\n" )
   sy.msg(note, notb, str)
     cashget()
        }
      })
    }
function cashget() {
  const cashUrl = {
    url: `https://api.prize.qq.com/v1/newsapp/answer/other/config?`,
    headers: JSON.parse(signheaderVal),
    body: 'actname=news-wxplugin-carousel'
  };
    sy.post(cashUrl, function(error, response, data) {
    if (error) {
         sy.msg("获取红包失败‼️", "", "");
         if (log) console.log("获取红包" + data)
      } else {
     const obj = JSON.parse(data)
     sy.log(note+`，`+ 'data: '+ `${data}`)
     if (obj.code == '-6007'){
             str += `\n${obj.message}`
            }
     else if (obj.code == -6006){
        str += `\n${obj.message}`
         }
     else {
       sy.log(`返回信息: ${obj.message}, 错误代码: ${obj.code}`)
          }
       //sy.msg(note, notb, str)
        }
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

