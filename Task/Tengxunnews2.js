/*
Cookie登录app签到页获取，第一次获取后可以注释掉。

[rewrite_local]
#腾讯新闻app签到，根据红鲤鱼与绿鲤鱼与驴修改

http:\/\/mtrace\.qq\.com\/mkvcollect\?k url script-request-header Tengxunnews.js

[task_local]
# 表示每天1点5分执行一次
5 1 * * * Tengxunnews.js

*/
var note = "";
var tip = "";
const log = true;
const $nobyda = nobyda();
const KEY = $nobyda.read("Cookietxnews2");

if ($nobyda.isRequest) {
  GetCookie()
  $nobyda.end()
} else {
  getsign()
  $nobyda.end()
}

function coinget() {
  const coinUrl = {
    url: `https://r.inews.qq.com/getUserExpConfs?isJailbreak=`,
    headers: {
      Cookie: KEY,
    }
  };
  $nobyda.post(coinUrl, function(error, response, data) {
    if (error) {
         $nobyda.notify("获取金币失败‼️", "", "");
     if (log) console.log("获取金币" + data)
    } else {
     const jb = JSON.parse(data)
console.log(jb)
     
    //$nobyda.notify(note+ "\n" ,notb, str)
        }
      })
    }

function money() {
  const moneyUrl = {
    url: `https://api.inews.qq.com/activity/v1/usercenter/activity/list?isJailbreak`,
    headers: {
      Cookie: KEY,
    }
  };
  $nobyda.post(moneyUrl, function(error,response, data) {
    if (error) {
         $nobyda.notify("获取收益信息失败‼️", "", "");
     if (log) console.log("获取收益信息" + data)
    } else {
     const jb = JSON.parse(data)
     notb = '共计' + jb.data.wealth[0].title +'个金币    '+"现金总计" + jb.data.wealth[1].title+'元';
     console.log(note+","+notb+ "\n" )
    $nobyda.notify(note+ "\n" ,notb, str)
    coinget()
        }
      })
    }

function getsign() {
  const llUrl = {
    url: 'https://api.inews.qq.com/task/v1/user/signin/add?',
    headers: {
      Cookie: KEY,
    }
  };

  $nobyda.post(llUrl, function(error, response, data) {
    if (error) {
         $nobyda.notify("腾讯新闻签到失败‼️", "", "");
       if (log) console.log("腾讯新闻签到失败" + data)
    } else {
    const obj = JSON.parse(data)
    //console.log("原始数据:"+data)
      if (obj.info=="success"){
       console.log("腾讯新闻 签到成功，已连续签到" + obj.data.signin_days+"天"+"\n")
       note = "腾讯新闻"
       next = obj.data.next_points
       tip = obj.data.tip_soup
       author= obj.data.author
       str =  "签到成功，已连续签到" + obj.data.signin_days+"天  "+'明天将获得'+ next +'个金币'+ '\n'+tip.replace(/[\<|\.|\>|br]/g,"")+ author
    money()
} else {
    $nobyda.notify("签到失败，🉐登录腾讯新闻app获取cookie", "", "")
    console.log("签到失败，🉐登录腾讯新闻app获取cookie"+data)
     }
   }
  })
}
                   
function GetCookie() {
  var CookieName = "腾讯新闻";
  if ($request.headers) {
    var CookieKey = "Cookietxnews2";
    var CookieValue = $request.headers['Cookie'];
    if ($nobyda.read(CookieKey) != (undefined || null)) {
      if ($nobyda.read(CookieKey) != CookieValue) {
        var cookie = $nobyda.write(CookieValue, CookieKey);
        if (!cookie) {
          $nobyda.notify("更新" + CookieName + "Cookie失败‼️", "", "");
        } else {
          $nobyda.notify("更新" + CookieName + "Cookie成功 🎉", "", "");
        }
      }
    } else {
      var cookie = $nobyda.write(CookieValue, CookieKey);
      if (!cookie) {
        $nobyda.notify("首次写入" + CookieName + "Cookie失败‼️", "", "");
      } else {
        $nobyda.notify("首次写入" + CookieName + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    $nobyda.notify("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
  }
    console.log("cookie输出成功？" + cookie);
  
}


function nobyda() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};
