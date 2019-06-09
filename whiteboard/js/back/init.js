let request = new XMLHttpRequest();
let userid;
let courseMetaData; // [{course id, course name, material id, assignment id}, ] 저장 
let courseData; // [ {id: content}, ] 저장

function init(stdId, pw){ // 매 학기 시작마다 실행(3월, 8월)

    userid='';
    courseMetaData=[];
    courseData=[];

    return _promiseLogin(stdId, pw)
        .then(function(responseText){    // user id 가져올 주소 접근
            //console.log(responseText);
            return _promiseURLGET("https://kulms.korea.ac.kr/learn/api/public/v1/users?userName=" + stdId);
        })
        .then(function(responseText){    
            return _promiseGetUserId(responseText);         // user id 처리, 가져오기
        })
        .then(function(_userid){  // 현재 course id목록 가져올 주소 접근
            userid = _userid;
            return _promiseURLGET("https://kulms.korea.ac.kr/learn/api/public/v1/users/" + userid + "/courses");
        })
        .catch(function(loginerror){
            return new Promise((resolve, reject)=>{
                console.log(loginerror);
                chrome.runtime.sendMessage({Error: "로그인에 실패했습니다. 사용자 정보를 다시 확인해주세요."})
                reject("LoginFailed");
            })
        })

        .then(function(responseText){
            return _promiseGetCourseIds(responseText);  // course id 불러옴.
        })
        .then(function(cids){   // SetCourseName && SetCourseContents
            return Promise.all(_MakePromiseArrayAPI(cids));    // [{courseId, name, contents:[{}]}]
        })
        .then(function(cids){   // SetCourseContents
            return Promise.all(_MakePromiseArrayBB(cids));
        })
        .catch(function(loginerror){
            return new Promise((resolve, reject)=>{
                console.log(loginerror);
                chrome.runtime.sendMessage({Error: "정보를 불러오지 못했습니다. 다시 로그인해주세요."})
                reject("LoginFailed");
            })
        })

        .then(function(cids){   // course content's ids
            //console.log(courseData);
            //console.log(courseMetaData);
            let encrypted = CryptoJS.AES.encrypt(pw, stdId+userid);
            return Promise.all([
                new Promise((resolve, reject) => {chrome.storage.local.set({"stdId": stdId}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"pw": encrypted}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"userid": userid}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"courseMetaData": courseMetaData}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"courseData": courseData}); resolve("OK"); })
            ])
        })
}

function refresh(){   // 평소에 실행
    let stdId = '', pw = '', userid = '', encrypted = '';
    courseData = [];

    return Promise.all([
        new Promise((resolve, reject)=>{chrome.storage.local.get("stdId", (result)=>{stdId=result.stdId; resolve("OK");});}),
        new Promise((resolve, reject)=>{chrome.storage.local.get("pw", (result)=>{encrypted=result.pw; resolve("OK");});}),
        new Promise((resolve, reject)=>{chrome.storage.local.get("userid", (result)=>{userid=result.userid; resolve("OK");});}),
        new Promise((resolve, reject)=>{chrome.storage.local.get("courseData", (result)=>{courseData=result.courseData; resolve("OK");});})
        ])
        .then(function(msg){
            pw = CryptoJS.AES.decrypt(encrypted, stdId+userid).toString(CryptoJS.enc.Utf8);
            return _promiseLogin(stdId, pw)
        })
        .then(function(msg){
            return Promise.all(_promiseUpdateCourseData(courseData))
        })
        .then(function(_updateArray){
            return new Promise((resolve, reject)=>{
                let check = 0;
                for(let i = 0; i<_updateArray.length; i++){
                    if(_updateArray[i][1] > 0){
                        check = 1;
                        break;
                    }
                }
                if(check == 1){
                    chrome.storage.local.set({ "courseData": courseData }, function () {
                        chrome.storage.local.set({ "updateInfo": _updateArray }, function () {
                            chrome.runtime.sendMessage({ isUpdate: "Yes" });
                            resolve("We have new data");
                        });
                    })
                }else{
                    reject("We have no new data");
                }
            })
        })

}

let _promiseLogin = function(stdId, pw){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://kulms.korea.ac.kr/",
            type: "GET",
            success: function(data) {
                let form = $("<div></div>").append($.parseHTML(data)).find('#loginBox2').find('form');
                if (form.attr("action") !== undefined) {
                    form.find('#user_id').val(stdId);
                    form.find('#password').val(pw);
                    $.post("https://kulms.korea.ac.kr/" + form.attr("action"), form.serialize(), function (data) {
                        resolve(data);
                    });
                }else{
                    resolve("OK")
                }
            }
        });
    })
}

let _promiseURLGET = function get(url) {
    return new Promise(function (resolve, reject) {
        request.open("GET", url);
        request.onload = function () {
            if (request.status == 200) {
                resolve(request.responseText);
            } else {
                reject(Error(request.statusText))
            }
        }
        request.onerror = function () {
            reject(Error("Network Error"));
        }
        request.send();
    });
}

let _promiseURLGETnewRequest = function get(request, url) {
    return new Promise(function (resolve, reject) {
        request.open("GET", url);
        request.onload = function () {
            if (request.status == 200) {
                resolve(request.responseText);
            } else {
                reject(Error(request.statusText))
            }
        }
        request.onerror = function () {
            reject(Error("Network Error"));
        }
        request.send();
    });
}

let _promiseSearchCID = function searchCID(key) {
    return new Promise((resolve, reject) => {
        courseMetaData.forEach(element => {
            if (element.courseId == key) resolve(element);
        });
        reject(Error("No matches"))
    })
}

let _promiseSearchID = function searchID(key){
    return new Promise((resolve, reject) => {
        courseData.forEach(element => {
            if(element.id == key) resolve(element);
        });
        reject(Error("No matches"));
    })
}

function SetBadge(value){
    chrome.browserAction.getBadgeText({}, function(current){
        if(value != 0){
            if(current == ''){
                chrome.browserAction.setBadgeText({
                    'text': value+''
                });
            }else{
                chrome.browserAction.setBadgeText({
                    'text': ((current*1)+value)==0 ? '' : ((current*1)+value)+'' 
                });
            }
        }
        chrome.browserAction.setBadgeBackgroundColor({
            'color': '#dd0000'
        });
    })   
}