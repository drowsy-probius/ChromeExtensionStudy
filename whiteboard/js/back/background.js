let INTERVAL = 120;

chrome.alarms.onAlarm.addListener(function (alarm) {
  console.log(1);
  refresh()
    .then(function (msg) {
      // console.log(msg);
      return new Promise((resolve, reject) => {
        let BADGE = 0;
        chrome.storage.local.get("updateInfo", (result) => {
          result.updateInfo.forEach(element => {
            BADGE += element[1];
          });
          resolve(BADGE);
        })
      })
    })
    .then(function (BADGE) {
      // console.log(BADGE);
      SetBadge(BADGE);
      chrome.runtime.sendMessage({ isUpdate: "Yes" })
    })
    .catch(console.log.bind(console))
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //               "from a content script:" + sender.tab.url :
    //               "from the extension");

    // console.log("submit received");

    if(request.act === "reload"){
      refresh() // in init.js
      .then(function(msg){
        // console.log(msg);
        return new Promise((resolve, reject)=>{
          let BADGE = 0;
          chrome.storage.local.get("updateInfo", (result)=>{
            result.updateInfo.forEach(element => {
              BADGE += element[1];
            });
            resolve(BADGE);
          })
        })
      })
      .then(function(BADGE){
        // console.log(BADGE);
        SetBadge(BADGE);
        chrome.runtime.sendMessage({isUpdate: "Yes"})
      })
      .catch(console.log.bind(console))
      sendResponse({ farewell: "reloading..." });
    }

    if(request.act === "removeBadge"){
      SetBadge(0);
    }

    if(request.user !== undefined){
      let [stdId, pw] = request.user;
      init(stdId, pw)
      .then(function(e){
        chrome.runtime.sendMessage({isSet: "Yes"})
      })
      .then(function(e){
        chrome.alarms.clearAll()
        chrome.alarms.create({ when: Date.now()+1000, periodInMinutes: INTERVAL*1});
        chrome.storage.local.set({"INTERVAL": INTERVAL});
      })
      .catch(console.log.bind(console))
      sendResponse({ farewell: "init" });
    }

    if(request.interval !== undefined){
      if(request.interval*1 < 1){
        INTERVAL = 1;
      }else{
        INTERVAL = request.interval;
      }
      chrome.alarms.clearAll()
      chrome.alarms.create({ when: Date.now()+1000, periodInMinutes: INTERVAL*1});
      chrome.storage.local.set({"INTERVAL": INTERVAL});

      sendResponse({ farewell: "time interval set" });
    }

    return true;
  }
);