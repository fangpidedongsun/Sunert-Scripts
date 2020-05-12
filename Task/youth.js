/*

赞赏:中青邀请码`46308484`,农妇山泉 -> 有点咸，万分感谢

本脚本仅适用于中青看点极速版领取青豆

获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，
2.进入app，签到一次,即可获取Cookie. 阅读一篇文章，获取阅读请求body，激励视频还未找到入口，如找到入口，可私信我

3.当日签过到需次日获取Cookie.

5.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

仅测试Quantumult X
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
中青看点 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js,script-update-interval=0

中青看点 = type=http-request,pattern=https:\/\/kd\.youth\.cn\/TaskCenter\/sign,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js

中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/Game\/GameVideoReward,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true

中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/article\/complete,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true

~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=youth.js, enabled=true, tag=中青看点

http-request https:\/\/ios\.baertt\.com\/v5\/Game\/GameVideoReward script-path=youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/article\/complete script-path=youth.js, requires-body=true
http-request https:\/\/kd\.youth\.cn\/TaskCenter\/sign script-path=youth.js
-----------------
QX 1.0. 7+ :
[task_local]
0 9 * * * youth.js

[rewrite_local]
https:\/\/kd\.youth\.cn\/TaskCenter\/sign url script-request-header youth.js

https?:\/\/ios\.baertt\.com\/v5\/article\/complete url script-request-body youth.js

https?:\/\/ios\.baertt\.com\/v5\/Game\/GameVideoReward url script-request-body youth.js

~~~~~~~~~~~~~~~~
[MITM]
hostname = kd.youth.cn, ios.baertt.com
~~~~~~~~~~~~~~~~

*/

const CookieName = "中青看点"
const signurlKey ='youthurl_zq'
const signheaderKey = 'youthheader_zq'
const gamebodyKey = 'youthgame_zq'
const articlebodyKey = 'read_zq'
const sy = init()
const signheaderVal = sy.getdata(signheaderKey)
const gamebodyVal = sy.getdata(gamebodyKey)
const articlebodyVal = sy.getdata(articlebodyKey)

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   all()
}

function GetCookie() {
   if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/TaskCenter\/sign/)) {
   const signheaderVal = JSON.stringify($request.headers);
    if (signheaderVal)        sy.setdata(signheaderVal,signheaderKey)
    sy.log(`[${CookieName}] 获取Cookie: 成功,signheaderVal: ${signheaderVal}`)
    sy.msg(CookieName, `获取Cookie: 成功🎉`, ``)
  }
else if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/v5\/article/)) {
   const articlebodyVal = $request.body
    if (articlebodyVal)        sy.setdata(articlebodyVal,articlebodyKey)
    sy.log(`[${CookieName}] 获取阅读: 成功,articlebodyVal: ${articlebodyVal}`)
    sy.msg(CookieName, `获取阅读请求: 成功🎉`, ``)
  }
  else if ($request && $request.method != `OPTIONS`&& $request.url.match(/\/v5\/Game/)) {
   const gamebodyVal = $request.body
    if (gamebodyVal)        sy.setdata(gamebodyVal,gamebodyKey)
    sy.log(`[${CookieName}] 获取激励视频: 成功,gamebodyVal: ${gamebodyVal}`)
    sy.msg(CookieName, `获取激励视频请求: 成功🎉`, ``)
  }
 }
 
async function all() 
{ 
  await sign();
  await signInfo();
  await Invitant();
  await getAdVideo();
  await gameVideo();
  await readArticle();
  await Articlered();
  await rotary();
}

function sign() {      
  return new Promise((resolve, reject) =>
   {
    const signurl = { 
      url: 'https://kd.youth.cn/TaskCenter/sign', 
      headers: JSON.parse(signheaderVal),
}
     sy.get(signurl, (error, response, data) =>
 {
      sy.log(`${CookieName}, data: ${data}`)
       signresult =JSON.parse(data)
       if (signresult.status == 1){
          subTitle = `签到成功🎉`
          detail= `获取金币: ${signresult.score}，明日金币:${signresult.nextScore}\n`
           }
       else if(signresult.status == 0){
          subTitle = `重复签到`
          detail= ``
         }
       })
resolve()
     })
  }
      
function signInfo() {      
 return new Promise((resolve, reject) => {
    const infourl = { 
      url: 'https://kd.youth.cn/TaskCenter/getSign', 
      headers: JSON.parse(signheaderVal),
}
   sy.post(infourl, (error, response, data) =>
 {
     sy.log(`${CookieName}, data: ${data}`)
      signinfo =JSON.parse(data)
      if (signinfo.status == 1){

         subTitle += ` 总计: ${signinfo.data.user.score}个青豆`
         detail = `账户昵称: ${signinfo.data.user.nickname}  已签到: ${signinfo.data.total_day}天，签到获得${signinfo.data.sign_score}个青豆`
           }
       else {
          subTitle += `${signinfo.msg}`
          detail= ``
         }
    resolve()
       })
     })
  }

function Invitant() {      
  const time = new Date().getTime()
    const url = { 
      url: `https://kandian.youth.cn/user/share10?jsonpcallback=jQuery20308283175368764079_${time+4}&uid=46308484&_=${time}0`, 
      headers: JSON.parse(signheaderVal),
}
  url.headers['Host']='kandian.youth.cn'
   sy.get(url, (error, response, data) =>
 {
   //sy.log(`Invitdata:${data}`)
 })
 
}

//看视频奖励
function getAdVideo() {      
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://kd.youth.cn/taskCenter/getAdVideoReward`, 
      headers: JSON.parse(signheaderVal),
      body: 'type=taskCenter'
}
  url.headers['Host']='kd.youth.cn'
   sy.post(url, (error, response, data) =>{
   sy.log(`advideodata:${data}`)
   adVideores = JSON.parse(data)
   if (adVideores.status==1){
  detail += `\n看视频获得${adVideores.score}个青豆 ` }
  })
resolve()
 })
}
// 点我激励视频奖励
function gameVideo() {      
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://ios.baertt.com/v5/Game/GameVideoReward.json`, 
      body: gamebodyVal,
}
   sy.post(url, (error, response, data) =>
 {
   sy.log(`gamedata:${data}`)
   gameres = JSON.parse(data)
   if (gameres.success==true){
     detail += `\n点我激励视频奖励获得${gameres.items.score}`}
    })
  resolve()
  })
}

//阅读奖励
function readArticle() {      
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://ios.baertt.com/v5/article/complete.json`, 
      body: articlebodyVal,
}
   sy.post(url, (error, response, data) =>
 {
   sy.log(`readdata:${data}`)
   readres = JSON.parse(data)
   if (readres.items.read_score!=undefined){
     detail += ` 阅读奖励${readres.items.read_score}个青豆`
     }
   })
resolve()
 })
}
//文章阅读
function Articlered() {      
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://ios.baertt.com/v5/article/red_packet.json`, 
      body: articlebodyVal,
}
  sy.post(url, (error, response, data) =>{
   sy.log(`reddata:${data}`)
   redres = JSON.parse(data)
   if (redres.success==true){
     detail += ` 阅读奖励${redres.items.read_score}个青豆`  
     }
   })
  resolve()
 })
}

//转盘奖励
function rotary() {      
 const time = new Date().getTime()
 const rotarbody = signheaderVal.split("&")[15]+'&'+signheaderVal.split("&")[8]
 return new Promise((resolve, reject) => {
    const url = { 
      url: `https://kd.youth.cn/WebApi/RotaryTable/turnRotary?_=${time}`, 
      headers: JSON.parse(signheaderVal),
      body: rotarbody
}
  sy.post(url, (error, response, data) =>{
   sy.log(`reddata:${data}`)
   rotaryres = JSON.parse(data)
   if (rotaryres.status==1){
    sy.log(rotaryres.data.score)
     detail += `\n转盘奖励${rotaryres.data.score}个青豆，剩余${rotaryres.data.remainTurn}次`  
     }
   sy.msg(CookieName,subTitle,detail)
   })
  resolve()
 })
sy.done()
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
        url.method = `GET`
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

