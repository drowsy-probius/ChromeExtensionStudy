// 기본 로직 정의
let _promiseLogin = (stdId, pw) => {
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
            error: (err) => {
                reject(new Error(err));
            },
            complete: () => {
              let encrypted = CryptoJS.AES.encrypt(pw, stdId);
              chrome.storage.local.set({"stdId": stdId});
              chrome.storage.local.set({"pw": encrypted});
            }
        });

        
    });
};

let _promiseGetMeta = () => {
  return new Promise( async (resolve, reject) => {
    let stdId = await _getLocalStorage("stdId");

    let userid = await _promiseGetUserId(stdId);
    let courseIds = await _promiseGetCourseIds(userid);
    let courseMetaData = await _promiseGetCourse(courseIds);

    await _setLocalStorage({ "userid": userid });
    await _setLocalStorage({ "courseMetaData": courseMetaData });

    resolve(courseMetaData);
  });
};

let _promiseGetData = () => {
  return new Promise((resolve, reject) => {
    let courseMetaData = await _getLocalStorage("courseMetaData");
    let courseData = [];
    
    courseMetaData.map(async (elem) => {
      //{courseId, name, contents{title, id} }
      let announcement = await _promiseGetCourseAnnouncements(elem.courseId,
        "https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&course_id=" + elem.courseId);
      courseData.push(announcement);

      let grade = await _promiseGetCourseGrades(elem.courseId,
        "https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id=" + elem.courseId + "&stream_name=mygrades");
      courseData.push(grade);

      elem.contents.map(async (e) => {
        let content = await _promiseGetCourseContents(e.id,
          "https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=" + elem.courseId + "&content_id=" + e.id);
        courseData.push(content);
      });
    });

    await _setLocalStorage({ "courseData": courseData });
  });
};

function SetBadge(num) {
  chrome.browserAction.getBadgeText({}, function(current){
    if(num != 0){
        if(current == ''){
            chrome.browserAction.setBadgeText({
                'text': num+''
            });
        }else{
            chrome.browserAction.setBadgeText({
                'text': ((current*1)+num)==0 ? '' : ((current*1)+num)+'' 
            });
        }
    }
    chrome.browserAction.setBadgeBackgroundColor({
        'color': '#dd0000'
    });
})
}

function _setLocalStorage(obj) {
  return new Promise( (resolve) => {
      chrome.storage.local.set( obj, () => resolve() );
  });
}

function _getLocalStorage(key = null) {
  return new Promise( (resolve) => {
      chrome.storage.local.get(key, (item) => {
          key ? resolve(item[key]) : resolve(item);
      });
  });
}


// 알람이나 언제 실행되는지 설정
// 메시지 관리
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

    if(request.user !== undefined){
      let [stdId, pw] = request.user;
      init(stdId, pw);
    };

    if(request.act === "reload"){
      refresh();
    };

    if(request.act === "forcereload"){
      let stdId = "";
      let pw = "";
      chrome.storage.local.get("stdId", (result) => { 
        stdId = result.stdId;

        chrome.storage.local.get("pw", (result)=>{
          pw = CryptoJS.AES.decrypt(result.pw, stdId).toString(CryptoJS.enc.Utf8);

          init(stdId, pw);
        });
      });
    };

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

    }

    return true;
  }
);