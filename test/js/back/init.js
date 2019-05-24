const request = new XMLHttpRequest();

function init(id, pw){ // 매 학기 시작마다 실행(3월, 8월)

    const authURL = "https://auth.korea.ac.kr/directLoginNew.jsp?id=" + id + "&pw=" + pw + "&returnURL=kulms.korea.ac.kr";
    const myinfoURL = "https://kulms.korea.ac.kr/learn/api/public/v1/users?userName=" + id;

    _promiseURLGET(authURL) // 로그인
        .then(function(responseText){    
            return _promiseURLGET(myinfoURL);   // user id 가져올 주소 접근
        })
        .then(function(responseText){    
            return _promiseGetUserId(responseText);         // user id 처리, 가져오기
        })
        .then(function(userid){  // 현재 course id목록 가져올 주소 접근
            console.log(userid);
            const mycoursesURL = "https://kulms.korea.ac.kr/learn/api/public/v1/users/" + userid + "/courses";
            return _promiseURLGET(mycoursesURL);
        })
        .then(function(responseText){
            return _promiseGetCourseIds(responseText);  // course id 불러옴.
        })
        .then(function(cids){ 
            console.log(cids);


//            return _promiseSetCourseNames(cids);
        })
        .then(function(data){
            console.log(data);
            console.log(courseMetaData);
        })
        .catch(console.log.bind(console));
    
}

function refresh(id, pw){   // 평소에 실행

}

let  _promiseURLGET = function get(url){
    return new Promise(function(resolve, reject) {
        request.open("GET", url);
        request.onload = function()
        {
            if (request.status == 200)
            {
                resolve(request.responseText);
            }else
            {
                reject(Error(request.statusText))
            }
        }
        request.onerror = function()
        {
            reject(Error("Network Error"));
        }
        request.send();
    });
}

let _promiseSearchCID = function searchCID(key){
    return new Promise((resolve,reject)=>{
        courseMetaData.forEach(element => {
            if(element.courseId == key) resolve(element);
        });
        reject(Error("No matches"))
    })
}