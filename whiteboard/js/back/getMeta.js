// _promiseGetMeta

let _promiseGetUserId = (stdId) => {
    return new Promise(async (resolve, reject) => {

        let myid = await _getURL("https://kulms.korea.ac.kr/learn/api/public/v1/users?userName="+stdId);
        if(myid.results.length === 1){
            let userid = myid.results[0].id;
            resolve(userid);
        } else{
            reject(new Error("Student number is wrong!"))
        }
    });
};

let _promiseGetCourseIds = (userid) => {
    return new Promise( async (resolve, reject) => {

        let mycourse = await _getURL("https://kulms.korea.ac.kr/learn/api/public/v1/users/"+userid+"/courses");

        let cids = [];
        let nowY = new Date().getFullYear();
        let nowM = new Date().getMonth() + 1;
        let term;
        // if(nowM < 7) term = 2;
        // else term = 8;
        term = 2;

        let tmp = mycourse.results;
        tmp.forEach(e => {
            let time = e.created.split('-');
            let YYYY = time[0] * 1;
            let MM = time[1] * 1;
            let avail = e.availability.available;

            // user에게 등록된 course중에서 현재 연도, 현재 학기에 속한 것만 선택함.
            if (avail == "Yes" && YYYY == nowY && MM >= term) {
                cids.push(e.courseId);
            }
        });

        if (!cids) reject(new Error("No courses!"));
        resolve(cids);
    });
};

let _promiseGetCourse = (courseIds) => {
    return new Promise( async (resolve) => {

        let courseMeta = await Promise.all( courseIds.map( (courseId) => {
            return new Promise( async (resolve) => {
                let Obj = {"courseId":"", "name":"", "contents":[]};

                let meta = await _getURL("https://kulms.korea.ac.kr/learn/api/public/v1/courses/"+courseId);
                Obj.courseId = meta.id;
                Obj.name = meta.name;
                let courseContent = await _getURL("https://kulms.korea.ac.kr/learn/api/public/v1/courses/"+courseId+"/contents");
                courseContent.results.forEach( (e) => {
                    Obj.contents.push({"title": e.title, "id": e.id});
                })
                resolve(Obj);
            });
        }));
        resolve(courseMeta);
    });
}