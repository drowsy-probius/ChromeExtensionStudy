let request = new XMLHttpRequest();
let userid;
let courseMetaData; // [{course id, course name, material id, assignment id}, ] 저장 
let courseData; // [ {id: content}, ] 저장

function init(id, pw, stdId){ // 매 학기 시작마다 실행(3월, 8월)

    userid='';
    courseMetaData=[];
    courseData=[];

    return _promiseLogin(id, pw)
        .then(function(responseText){    // user id 가져올 주소 접근
            // console.log(responseText);
            return _promiseURLGET("https://kulms.korea.ac.kr/learn/api/public/v1/users?userName=" + stdId);
        })
        .then(function(responseText){    
            return _promiseGetUserId(responseText);         // user id 처리, 가져오기
        })
        .then(function(_userid){  // 현재 course id목록 가져올 주소 접근
            userid = _userid;
            return _promiseURLGET("https://kulms.korea.ac.kr/learn/api/public/v1/users/" + userid + "/courses");
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
        .then(function(cids){   // course content's ids
             console.log(courseData);
             console.log(courseMetaData);
            return Promise.all([
                new Promise((resolve, reject) => {chrome.storage.local.set({"id": id}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"pw": pw}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"stdId": stdId}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"userid": userid}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"courseMetaData": courseMetaData}); resolve("OK"); }),
                new Promise((resolve, reject) => {chrome.storage.local.set({"courseData": courseData}); resolve("OK"); })
            ])
        })
        .catch(console.log.bind(console));
    
}

function refresh(){   // 평소에 실행
    let id='', pw = '', stdId='';
    userid = '';
    courseMetaData = [];
    courseData = [];

    return Promise.all([
        new Promise((resolve, reject)=>{chrome.storage.local.get("id", (result)=>{id=result.id; resolve("OK");});}),
        new Promise((resolve, reject)=>{chrome.storage.local.get("pw", (result)=>{pw=result.pw; resolve("OK");});}),
        new Promise((resolve, reject)=>{chrome.storage.local.get("stdId", (result)=>{stdId=result.stdId; resolve("OK");});}),
        new Promise((resolve, reject)=>{chrome.storage.local.get("userid", (result)=>{userid=result.userid; resolve("OK");});}),
        new Promise((resolve, reject)=>{chrome.storage.local.get("courseMetaData", (result)=>{courseMetaData=result.courseMetaData; resolve("OK");});}),
        new Promise((resolve, reject)=>{chrome.storage.local.get("courseData", (result)=>{courseData=result.courseData; resolve("OK");});})
        ])
        .then(function(msg){
            return _promiseLogin(id, pw)
        })
        .then(function(cids){   // SetCourseName && SetCourseContents
            return Promise.all(_MakePromiseArrayAPI(cids));    // [{courseId, name, contents:[{}]}]
        })
        .then(function(cids){   // SetCourseContents
            return Promise.all(_MakePromiseArrayBB(cids));
        })
        .catch(console.log.bind(console));

}

let _promiseLogin = function(id, pw){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://auth.korea.ac.kr/directLoginNew.jsp",
            type: "POST",
            data: {
                    "id": id,
                    "pw": pw,
                    "returnURL": "kulms.korea.ac.kr"
            },
            dataType: "html",
            success: function(data) {
                let midForm = $("<div></div>").append($.parseHTML(data)).find("form");
                $.post(midForm.attr("action"), midForm.serialize(), function(data){
                    resolve(data);
                });
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