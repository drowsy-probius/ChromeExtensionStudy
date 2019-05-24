let userid = '';
let courseMetaData = []; // [{course id, course name, material id, assignment id}, ] 저장 
let courseData = []; // [ {id: content}, ] 저장

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
