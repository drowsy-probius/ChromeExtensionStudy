    // 유저 코스 https://kulms.korea.ac.kr/learn/api/public/v1/users/_843184_1/courses
    // 코스 정보 https://kulms.korea.ac.kr/learn/api/public/v1/courses/${courseid}
    // 코스에 속한 id's https://kulms.korea.ac.kr/learn/api/public/v1/courses/_138305_1/contents
    // 수업자료 또는 과제 https://kulms.korea.ac.kr/learn/api/public/v1/courses/_138305_1/contents/_2308088_1/children
    // 코스 성적 정보 https://kulms.korea.ac.kr/learn/api/public/v1/courses/${courseid}/gradebook/columns
    // 내 코스 성적
    // 로그인 "https://auth.korea.ac.kr/directLoginNew.jsp?id="+id+"&pw="+pw+"&returnURL=kulms.korea.ac.kr'
    // 유저 정보 https://kulms.korea.ac.kr/learn/api/public/v1/users?userName=${학번}

    // 웹 접근 https://developer.chrome.com/extensions/xhr


let _promiseGetUserId = function getUserId(responseText) {
    return new Promise((resolve, reject) => {
        userid = JSON.parse(responseText).results[0].id;
        resolve(userid);
    });
}

let _promiseGetCourseIds = function getCourses(responseText){ // 현재 course id들의 array 리턴
    return new Promise( (resolve, reject) => {
        let cids = [];
        let nowY = new Date().getFullYear();
        let nowM = new Date().getMonth();
        let term;
        if(nowM < 7) term = 2;
        else term = 8;

        let tmp = JSON.parse(responseText);
        tmp = tmp.results;
        tmp.forEach(e => {
            let time = e.created.split('-');
            let YYYY = time[0] * 1;
            let MM = time[1] * 1;
            let avail = e.availability.available;

            if (avail == "Yes" && YYYY == nowY && MM >= term) {     // user에게 등록된 course중에서 현재 연도, 현재 학기에 속한 것만 선택함.
                cids.push(e.courseId);
            }

        });

        if(!cids) reject(Error("No courses!"));
        resolve(cids);

    });   
}

let _MakePromiseArrayAPI = (cids) => {
    let ArrayOfPromise = [];
    for(let i = 0; i<cids.length; i++){
        let CNurl = "https://kulms.korea.ac.kr/learn/api/public/v1/courses/" + cids[i];
        let CCurl = "https://kulms.korea.ac.kr/learn/api/public/v1/courses/" + cids[i] + "/contents"
        let newrequest = new XMLHttpRequest();
        let PromiseTmp = (_promiseURLGETnewRequest(newrequest, CNurl)
                        .then(function(responseText){
                            return _promiseSetCourseNames(responseText);
                        })
                        .then(function(cid){
                            return _promiseURLGETnewRequest(newrequest, CCurl);
                        })
                        .then(function(responseText){
                            return _promiseSetCourseContents(responseText, cids[i]);
                        })
                        );
        ArrayOfPromise.push(PromiseTmp);
    }
    return ArrayOfPromise;
}

let _promiseSetCourseContents = function getCourseContents(responseText, cid){      // assignment id하고 material id 가져오는 코드
    return (_promiseSearchCID(cid)
            .then(function(object){
                return new Promise((resolve, reject) => {
                    let tmp = JSON.parse(responseText).results;
                    let _contents = [];

                    for (let i = 0; i < tmp.length; i++) {
                        _contents.push({ "title": tmp[i].title, "id": tmp[i].id });
                    }

                    object.contents = _contents;
                    resolve(cid)
                    })
                })
            )
}

let _promiseSetCourseNames = function getCourseNames(responseText){           // course name 가져오는 코드
    return new Promise((resolve, reject) => {
        tmp = JSON.parse(responseText)
        courseMetaData.push({ "courseId": tmp.id, "name": tmp.name });
        resolve(tmp.id);
    })
}