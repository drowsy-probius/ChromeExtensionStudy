chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

    console.log("submit received");
    if(request.act === "reload"){
      refresh()
      .then(function(e){
        chrome.runtime.sendMessage({isSet: "Yes"})
      })
      .catch(console.log.bind(console))
      sendResponse({ farewell: "goodbye" });
    }else{
      let [id, pw, stdId] = request.user;
      init(id, pw, stdId)
      .then(function(e){
        chrome.runtime.sendMessage({isSet: "Yes"})
      })
      .catch(console.log.bind(console))
      sendResponse({ farewell: "goodbye" });
    }

    
  }
);
