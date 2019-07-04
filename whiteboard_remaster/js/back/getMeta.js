// _promiseGetMeta

let _promiseGetUserId = (stdId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://kulms.korea.ac.kr/learn/api/public/v1/users?userName="+stdId,
            type: "GET",
            success: (data) => {
                userid = data.results[0].id;
                resolve(userid);
            },
            error: (err) => {
                reject(new Error(err));
            }
        });
    });
};

let _promiseGetCourseIds = (userid) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://kulms.korea.ac.kr/learn/api/public/v1/users/" + userid + "/courses",
            type: "GET",
            success: (data) => {
                let cids = [];
                let nowY = new Date().getFullYear();
                let nowM = new Date().getMonth() + 1;
                let term;
                // if(nowM < 7) term = 2;
                // else term = 8;
                term = 2;
        
                let tmp = data.results;
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
        
                if(!cids) reject(new Error("No courses!"));
                resolve(cids);
            },
            error: (err) => {
                reject(new Error(err));
            }
        });
    });
};

let _promiseGetCourse = (courseIds) => {
    return new Promise( async (resolve, reject) => {

        let courseMeta = await Promise.all( courseIds.map( (courseId) => {
            return new Promise((resolve, reject) => {
                let Obj = {"courseId":"", "name":"", "contents":[]};

                $.ajax({
                    url: "https://kulms.korea.ac.kr/learn/api/public/v1/courses/"+courseId,
                    type: "GET",
                    success: (data) => {
                        Obj.courseId = data.id;
                        Obj.name = data.name;
                        $.ajax({
                            url: "https://kulms.korea.ac.kr/learn/api/public/v1/courses/"+courseId+"/contents",
                            type: "GET",
                            success: (_data) => {
                                _data.results.forEach( (e) => {
                                    Obj.contents.push({"title": e.title, "id": e.id});
                                })
                                resolve(Obj);
                            },
                            error: (err) => {
                                reject(new Error(err));
                            }
                        });
                    },
                    error: (err) => {
                        reject(new Error(err));
                    }
                });
            });
        }));
        resolve(courseMeta);
    });
}