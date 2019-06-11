let INTERVAL = 120;

chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason != "install"){
    refresh(1, 0) // in init.js
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
  }
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  refresh(0, 0)
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

    if(request.user !== undefined){
      let [stdId, pw] = request.user;
      init(stdId, pw)
      .then(function (e) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ isSet: "Yes"}, function(){
                chrome.alarms.clearAll()
                chrome.alarms.create({ when: Date.now() + 1000, periodInMinutes: INTERVAL * 1 });
                chrome.storage.local.set({ "INTERVAL": INTERVAL });
                resolve("OK");
            })
        })
      })
      .catch(console.log.bind(console))
      sendResponse({ farewell: "init" });
    }

    if(request.act === "reload"){
      refresh(0, 0) // in init.js
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

    if(request.act === "forcereload"){
      refresh(0, 1)
      .catch(console.log.bind(console));
      sendResponse({ farewell: "forcereload" });
    }

    if(request.removeBadge !== undefined){
      SetBadge(-1*request.removeBadge);
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