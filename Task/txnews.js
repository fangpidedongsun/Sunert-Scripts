/*
腾讯新闻签到修改版，可以自动阅读文章获取红包
获取Cookie方法:
 1. 把以下地址复制到响应配置下 
 [task_local]
0 9 * * * txnews.js, tag=腾讯新闻

 [rewrite_local]
https:\/\/api\.inews\.qq\.com\/event\/v1\/user\/event\/report\? url script-request-header txnews.js

 [MITM]
hostname = api.inews.qq.com

3.打开腾讯新闻app，阅读一篇文章，倒计时结束后即可获取Cookie

~~~~~~~~~~~~~~~~

Cookie获取后，请注释掉Cookie地址。

#腾讯新闻app签到，根据红鲤鱼与绿鲤鱼与驴修改

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

const ID =  signurlVal.match(/devid=[a-zA-Z0-9_-]+/g)

//签到
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
       next = obj.data.next_points
       tip = obj.data.tip_soup
       Dictum = tip.replace(/[\<|\.|\>|br]/g,"")+obj.data.author
       str =  '签到成功，已连续签到' + obj.data.signin_days+'天  '+'明天将获得'+ next +'个金币'
    coinget()
} else {
      sy.msg('签到失败，🉐登录腾讯新闻app获取cookie', "", "")
      console.log('签到失败，🉐登录腾讯新闻app获取cookie'+data)
     }
   }
  })
}

//获取收益信息
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
     console.log(cookieName+","+notb+ "\n" )
     cashget()
        }
      })
    }

// 激活红包
function cashget() {
  const cashUrl = {
    url: `https://api.inews.qq.com/activity/v1/user/activity/get?isJailbreak=0&appver=13.4.1_qqnews_6.0.91&${ID}`,
   headers: {
      Cookie: `${JSON.parse(signheaderVal).Cookie}`,
    },
  };
    sy.get(cashUrl, function(error, response, data) {
       //sy.log(`激活红包奖励: ` + data)
        })
      toread()
      }

//阅读阶梯

function toread() {
  const toreadUrl = {
    url: signurlVal,
   headers: {
      Cookie: `${JSON.parse(signheaderVal).Cookie}`,
    },
   body: 'event=article_read&extend={"article_id":"20200420A0KBMB00","channel_id":"1979"}'
  };
    sy.post(toreadUrl, (error, response, data) =>{
       
      if (error){
      sy.msg(cookieName, '阅读:'+ error)
        }else{
    sy.log(`${cookieName}阅读文章 - data: ${data}`)
     read()
     }
    })
  }


//阅读红包到账
function read() {
  const cashUrl = {
    url: `https://api.inews.qq.com/activity/v1/activity/redpack/get?isJailbreak=0&${ID}`,
      headers: {
      Cookie: `${JSON.parse(signheaderVal).Cookie}`,
    },
    body: 'activity_id=stair_redpack_chajian'
  };
    sy.post(cashUrl, (error, response, data) => {
      try {
        sy.log(`${cookieName}阅读红包提取 - data: ${data}`)
        rcash = JSON.parse(data)
        if (rcash.ret == 0){
            str += `  阅读奖励: `+ rcash.data.redpack.amount/100 +`元`
            }
        else if (rcash.ret == 2013){
    //str += `\n阅读红包: ${rcash.info}`+`\n`+Dictum
          }
       StepsTotal()
       }
      catch (e) {
      sy.log(`❌ ${cookieName} read - 阅读奖励: ${e}`)
     }
  })
}
//阅读文章统计
function StepsTotal() {
  const StepsUrl = {
    url: `https://api.inews.qq.com/activity/v1/activity/info/get?activity_id=stair_redpack_chajian&${ID}`,
   headers: {
      Cookie: `${JSON.parse(signheaderVal).Cookie}`,
    },
  };
    sy.get(StepsUrl, (error, response, data) => {
      try {
        sy.log(`${cookieName}阅读统计 - data: ${data}`)
        article = JSON.parse(data)
   
        if (article.ret == 0){
         articletotal = '\n今日共'+article.data.extends.redpack_total+'个阶梯红包，' +'已领取'+article.data.extends.redpack_got+'个，'+`已阅读`+ article.data.extends.article.have_read_num+`篇文章，`+ `再读`+article.data.extends.article.redpack_read_num+'篇，可继续领取红包'          
         str +=  articletotal +`\n`+ Dictum
         sy.msg(cookieName, notb, str)
        }
        else {
     sy.log(cookieName + ` 返回值: ${article.ret}, 返回信息: ${article.info}`) 
        }
       }
      catch (e) {
      sy.msg(`❌ ${cookieName} - 阅读统计: ${e}`)
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

