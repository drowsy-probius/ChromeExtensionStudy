chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

    console.log("submit received");
    let [id, pw] = request.user;

    init(id, pw);
    sendResponse({ farewell: "goodbye" });

  }
);
