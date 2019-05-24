chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

    console.log("submit received");

    if(request.isSet == "Yes"){
        chrome.storage.local.get()
    }

    //sendResponse({ farewell: "goodbye" });

  }
);

document.getElementById('submit').addEventListener("click", function(){
    let id = document.getElementById('id').value;
    let pw = document.getElementById('pw').value;
    let msg = document.getElementById('message');

    if(isNaN(id))
    {
        msg.innerText = "Please use your student id(numbers), not portal id.";
    }else
    {
        msg.innerText = "";
        chrome.runtime.sendMessage({user: [id, pw]}, function(response){
            console.log(response.farewell);
        })
    }


});