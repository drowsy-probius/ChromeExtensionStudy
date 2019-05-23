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

        let userid = JSON.parse(responseText).results[0].id;

        resolve(userid);
    });
}


let _promiseGetCourses = function getCourses(responseText){ // 현재 course id들의 array 리턴
    return new Promise( (resolve, reject) => {
        
        let courses = [];
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
            let _cid = e.courseId;

            if (avail == "Yes" && YYYY == nowY && MM >= term) {
                courses.push({ "coursdId": _cid });
            }

        });

        if(!courses) reject(Error("No courses!"));
        resolve(courses);

    });   
}

let _promiseGetContents = function getContents(courses){   //courseids는 현재 course의 id들. course의 material id나 assignment id얻을 것임.
    return new Promise( (resolve, reject) => {
        let urls = [];

        courses.forEach(cid => {
            urls.push("https://kulms.korea.ac.kr/learn/api/public/v1/courses/" + cid.courseId + "/contents");
        });

        _promiseURLGET()


        
    });
}

