chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

    console.log("submit received");
    if(request.act == "refresh"){
      refresh()
      .then(function(e){
        chrome.runtime.sendMessage({isSet: "Yes"});
      })
    }else{
      let [id, pw] = request.user;
      init(id, pw)
      .then(function(e){
        chrome.runtime.sendMessage({isSet: "Yes"});
      })
    }

    sendResponse({ farewell: "goodbye" });
    // return true;
  }
);
