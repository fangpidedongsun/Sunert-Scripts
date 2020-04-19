 
const cookieName = '腾讯新闻二'
const signurlKey = 'sy_signurl_txnews2'
const signheaderKey = 'sy_signheader_txnews2'
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
  //sy.log(`signurlVal:${signurlVal}`)
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
     cashget()
     sy.msg(note, notb, str)
        }
      })
    }
function cashget() {
  const cashUrl = {
    url: signurlVal,
    headers: JSON.parse(signheaderVal),
    body: 'actEname=newsapp_cj'
  };
    sy.post(cashUrl, function(error, response, data) {
    if (error) {
         sy.msg("获取红包失败‼️", "", "");
         if (log) console.log("获取红包" + data)
      } else {
     const obj = JSON.parse(data)
     sy.log(note+`，`+ 'data: '+ obj)
     if (obj.code == -6007){
             str += `${obj.msg}`
            }
     else if (obj.code == -6000){
        str += `\n${obj.msg}`
          }
     else {
       sy.log(`返回信息: ${obj.msg}, 错误代码: ${obj.code}`)
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
sy.done()
