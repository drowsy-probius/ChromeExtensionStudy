// _promiseGetMeta

let _promiseGetUserId = (stdId) => {
    return new Promise(async (resolve) => {
        let myid = await _getURL("https://kulms.korea.ac.kr/learn/api/public/v1/users?userName="+stdId);
        let userid = myid.results[0].id;
        resolve(userid);
    });
};

let _promiseGetCourseIds = (userid) => {
    return new Promise( async (resolve, reject) => {

        let mycourse = await _getURL("https://kulms.korea.ac.kr/learn/api/public/v1/users/"+userid+"/courses");

        let cids = [];
        let nowY = new Date().getFullYear();
        let nowM = new Date().getMonth() + 1;
        let week = Math.ceil( new Date().getDate() / 7);
        let createdM = [2, 6, 8, 12];   // 1학기, 여름, 2학기, 겨울
        let term;

        if(nowM < 2){
            term = 3;
        }else if(nowM < 6){
            term = 0;
        }else if(nowM < 7){
            if(week < 4){
                term = 0;
            }else{
                term = 1;
            }
        }else if(nowM < 8){
            term = 1;
        }else if(nowM < 12){
            term = 2;
        }else if(nowM < 13){
            if(week < 4){
                term = 2;
            }else{
                term = 3;
            }
        }

        //term = 0;    // 테스트용 (1학기)

        do{
            mycourse.results.forEach(e => {
                let time = e.created.split('T')[0].split('-');
                // YYYY-MM-DDTHH:MM:SS.XXXA
    
                let YYYY = time[0] * 1;
                let MM = time[1] * 1;
                let avail = e.availability.available;
    
                if (avail == "Yes"){
                    if(term == 3){  // 겨울
                        if(nowM < 2){
                            if(YYYY == nowY-1 && (MM == createdM[term] || MM < createdM[0]))
                                cids.push(e.courseId);
                        }else{
                            if(YYYY == nowY && MM == createdM[term])
                                cids.push(e.courseId);
                        }
                    }else{
                        if(YYYY == nowY && MM >= createdM[term])
                            cids.push(e.courseId);
                    }
                }
            });
        }while(  (mycourse = await _getURL("https://kulms.korea.ac.kr" + mycourse.paging.nextPage)).results.length > 0 )

        if ( cids.length == 0 ) reject(new Error(EMPTY));
        else resolve(cids);
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