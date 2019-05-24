chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

    console.log("submit received");

    if(request.isSet == "Yes"){
        _promiseGetMetaData()
        .then(function(courseMetaData){
            return new Promise((resolve, reject)=>{
                courseMetaData.forEach(element => {
                    // let tabName = document.getElementsByClassName('tabs')[0];
                    // let tabContent = document.getElementsByClassName('container')[0];
    
                    let li = $('<li></li>'); 
                    let div = $('<div></div>');
    
                    if(courseMetaData[0] == element){
                        li.attr("class", "tab-link current");
                        div.attr("class", "tab-content current");
                    }else{
                        li.attr("class", "tab-link");
                        div.attr("class", "tab-content");
                    }
                    li.attr("data-tab", element.courseId);
                    div.attr("id", element.courseId);
                    li.text(element.name);
                    li.html(element.name);
    
                    $('ul.tabs').append(li);
                    $('ul.tabs').after(div);
                });
                $('#Login').attr("class", "tab-content");
                resolve("OK");
            })
        })
        .then(function(e){
            return _promiseGetData()
        })
        .then(function(courseData){
            return new Promise((resolve, reject) => {
                
            })
        })
        .then(function(e){
            $('ul.tabs li').click(function(){
                let tab_id = $(this).attr('data-tab');
             
                $('ul.tabs li').removeClass('current');
                $('.tab-content').removeClass('current');
             
                $(this).addClass('current');
                $("#"+tab_id).addClass('current');
              })
        })

    }

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

document.getElementById('refresh').addEventListener("click", function(){
    chrome.runtime.sendMessage({ act : "refresh" }, function (response) {
        console.log(response.farewell);
    })
});

let _promiseGetMetaData = function(){
    courseMetaData = [];
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("courseMetaData", (result) => {
            courseMetaData = result.courseMetaData;
            resolve("OK");
        });
    })
}

let _promiseGetData = function(){
    return new Promise((resolve, reject)=>{
        chrome.storage.local.get("courseData", (result) => {
            resolve(result.courseData);
        })
    })
}