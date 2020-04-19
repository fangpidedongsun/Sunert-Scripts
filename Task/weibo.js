/*
本脚本仅适用于喜马拉雅极速版开启宝箱金币  无签到功能
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域下
2.APP登陆账号后，点击右下角'福利'选项,即可获取Cookie.
3.宝箱y从0点开始，可每隔一小时开启一次，每天最多5次，金币账户与喜马拉雅标准版不同账户
4.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
5.转盘无效，仅开启宝箱
仅测试Quantumult x，Surge、Loon自行测试
by Macsuny

~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
xmspeed.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/xmspeed.js,script-update-interval=0

# 获取喜马拉雅极速版 Cookie.
xmspeed.js = script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/xmspeed.js,type=http-request,pattern=https:\/\/m\.ximalaya\.com\/speed\/task-center\/account\/coin

~~~~~~~~~~~~~~~~
QX 1.0.6+ :
[task_local]
0 9 * * * xmspeed.js

[rewrite_local]
# Get cookie. QX 1.0.5(188+):
https:\/\/m\.ximalaya\.com\/speed\/task-center\/account\/coin url script-request-header xmspeed.js
~~~~~~~~~~~~~~~~
QX or Surge [MITM]
hostname = m.ximalaya.com
~~~~~~~~~~~~~~~~

*/

const CookieName ='微博签到'
const signurlKey = 'sy.signurl.wb'
const cookieKey = `super_cookie2`
const sy = init()
const signurlVal = sy.getdata(signurlKey)
const cookieVal = sy.getdata(cookieKey)

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
   sign()
}

function GetCookie() {
if ($request.headers['Cookie']) {
    var url = $request.url;
    var cookie = $request.headers['Cookie'];
    //$notification.post(”“, super_id, super_cookie)
    var super_cookie = $prefs.setValueForKey(cookie, 'super_cookie2');
    if(!super_cookie)
    {
        $notify('写入微博Cookie失败！', '请重试')
    }
    else {
            $notify('写入微博Cookie成功🎉', '您可以手动禁用此脚本')
    }
    } else {
            $notify('写入微博cookie失败！', '请退出账号, 重复步骤')
        }
    }


function sign() {
   let signurl = {
      url: `https://m.weibo.cn/c/checkin/ug/v2/signin/signin?`,
      headers: {        
            Cookie: `XSRF-TOKEN=e20a58; MLOGIN=1; M_WEIBOCN_PARAMS=from%3D10A3293010%26luicode%3D10000746%26uicode%3D10000746; WEIBOCN_FROM=10A3293010; SCF=AloYuw4w-RTaP_-HiHjQErgKMweV3PnJiV_qJN6icaQ7ziAvVHPpoTPzWpWPu4IusA..; SUB=_2A25zgaVnDeRhGedH7FYR8C_Iyz2IHXVQ3NUvrDV6PUJbitCOLXTckWtNULfMgIp3ZV0v2gRi6_KGfKAhPQxU6Q3T; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFxC9UpwyA4xcgvuFEnCoco5NHD95Qp1KMXeh5pSh5pWs4Dqc_oi--fiKn7i-82i--fiKysi-8Wi--4i-2piK.Ri--4iKL2i-2Ei--ciKLhiKL2i--fi-2Xi-2Ni--ci-zfi-zNi--ciK.Ri-2fi--ciKLWiK.ci--RiKyWi-zpi--4iK.ciKyF; SUHB=0IIUQmm8MnrZFY; thfp=SWpoamRWbG5ObHAxYUVKYWJFeDFXVVk2TXpsa1kyVXhaVGN0TXpRek1DMDBZbUkzTFRoaE1EQXRZMlF4WW1Fd1kyVTBNV000T25kbFlqbzFaR1UzTmpSak5EWTRNemhpWkRkaFpUQmlPVGcwT1dVaS5FTWoyUkEuLWdydVMtS2FqOFhrTXlFTFd2bTlMTk5hdFVZ; aid=01A2rcx7RPMpcbDcchv6ZujDXSfVuxcn6-xd8fWWF0URxrJVA.; x-s3-sid=S1vc0Sab9jVxnz1613lm5ko3i; _T_WM=63814150205`,
            }
     }   
      signurl.headers['User-Agent'] = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Weibo (iPhone8,2__weibo__10.3.2__iphone__os13.4.1)`,
      signurl.headers['X-Requested-With'] = `XMLHttpRequest`
      signurl.headers['Referer'] = `https://m.weibo.cn/c/checkin?ua=iPhone8,2__weibo__10.3.2__iphone__os13.4.1&from=10A3293010`
      signurl.headers['Accept'] = `application/json, text/plain, */*`
     signurl.headers['Connection'] = `keep-alive`
     signurl.headers['Accept-Encoding'] = `gzip, deflate, br`
     signurl.headers['Host'] = `m.weibo.cn`
     //sy.log(signurl)
     sy.get(signurl, (error, response, data) => {
     sy.log(`${CookieName}, data: ${data}`)
     let result = JSON.parse(data)
     if (result.ok == 1){
         subTitle = `签到成功`
         detail = `${result.data.header.card}💰`  
         }  
     else if (result.msg == "\u7cfb\u7edf\u7e41\u5fd9\u3002"){
         subTitle = `签到重复‼️`
         detail = `原因: 您已签到`
     }
     else {
         subTitle = `签到失败❌`
         detail = `原因: ${result.msg}`
         }
    sy.msg(CookieName, subTitle, detail)
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

