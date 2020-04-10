

let obj = JSON.parse($response.body);
          obj.balanceMinutes="2000";
           obj.score="500";
            obj.vipLevel="1";
             obj.totalPayAmount="1";
              obj.hasSuite="1";
　　　$done({body: JSON.stringify(obj)});
