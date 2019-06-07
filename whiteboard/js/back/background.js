let INTERVAL = 120;
let autoreload = null;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

    console.log("submit received");

    if(request.act === "reload"){
      refresh()
      .catch(console.log.bind(console))
      sendResponse({ farewell: "reloading..." });
    }

    if(request.user !== undefined){
      let [id, pw, stdId] = request.user;
      init(id, pw, stdId)
      .then(function(e){
        chrome.runtime.sendMessage({isSet: "Yes"})
      })
      .then(function(e){
        autoreload = setInterval(refresh, INTERVAL * 60 * 1000)
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
      clearInterval(autoreload);
      autoreload = setInterval(refresh, INTERVAL * 60 * 1000);
      chrome.storage.local.set({"INTERVAL": INTERVAL});

      sendResponse({ farewell: "time interval set" });
    }

    return true;
  }
);