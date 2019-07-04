// 기본 로직 정의

let _promiseLogin = function(stdId, pw) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://kulms.korea.ac.kr/",
            type: "GET",
            success: (data) => {
                let form = $("<div></div>").append($.parseHTML(data)).find('#loginBox2').find('form');
                if (form.attr("action") !== undefined) {
                    form.find('#user_id').val(stdId);
                    form.find('#password').val(pw);
                    $.post("https://kulms.korea.ac.kr/" + form.attr("action"), form.serialize(), function (data) {
                        resolve(data);
                    });
                }else{
                    resolve("You already have logged in");
                }
            },
            error: (error) => {
                reject(error);
            }
        });

        let encrypted = CryptoJS.AES.encrypt(pw, stdId);
        chrome.storage.local.set({"stdId": stdId});
        chrome.storage.local.set({"pw": encrypted});
    });

}

let _promiseGetMeta = async () => {
    let stdId = "";
    chrome.storage.local.get("stdId", (result) => { stdId = result.stdId;});

    let courseMetaData = [];

    let userid = await _promiseGetUserId(stdId);
    let courseIds = await _promiseGetCourseIds(userid);
    courseIds.map(async (cid) => {
        let obj = await _promiseGetCourse(cid);
        courseMetaData.push(obj);
    });


    chrome.storage.local.set({"userid": userid});
    chrome.storage.local.set({"courseMetaData": courseMetaData});
}

// bb에서 직접 가져오는 것은 로그인하고
// 새로고침하고 공통된 부분
let _promiseRefresh = async () => {
    let courseMetaData = [];
    chrome.storage.local.get("courseMetaData", (result) => { courseMetaData = result.courseMetaData;});
    
}


//
//

// 알람이나 언제 실행되는지 설정
// 메시지 관리
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

    if(request.user !== undefined){
      let [stdId, pw] = request.user;
      _promiseLogin(stdId, pw);

    }

    if(request.act === "reload"){
      
    }

    if(request.act === "forcereload"){
      
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