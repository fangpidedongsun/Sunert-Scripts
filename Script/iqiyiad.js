var obj = JSON.parse($response.body);

 obj.base.statistics.ad_str = {};

$done({body: JSON.stringify(obj)}); 
