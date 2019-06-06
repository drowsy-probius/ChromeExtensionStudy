let _MakePromiseArrayBB = (cids) => {
    let ArrayOfPromise = [];
    for(let i = 0; i<cids.length; i++){
        let CAurl = "https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&course_id="+cids[i];
        let CGurl = "https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id="+cids[i]+"&stream_name=mygrades";
        let newrequest = new XMLHttpRequest();
        let PromiseTmp = (_promiseURLGETnewRequest(newrequest, CAurl) // course announcements starts
                            .then(function(responseText){ 
                                return _promiseGetCourseAnnouncements(responseText)  
                            })
                            .then(function(result){
                                return new Promise((resolve, reject) => {
                                    courseData.push({"id":id, "contents":data, "url":CAurl});
                                    resolve(id);
                                })
                                //return _promiseSetData(cids[i], result, CAurl)
                            })                      // course announcements ends
                            .then(function(id){     // course grades starts
                                return _promiseURLGETnewRequest(newrequest, CGurl)
                            })
                            .then(function(responseText){
                                return _promiseGetCourseGrades(responseText);
                            })
                            .then(function(result){
                                return _promiseSetData(cids[i]+"_grade", result);
                            })                     // course grades ends
                            .then(function(id){    // course contents starts
                                return _promiseGetCourseContentIDs(cids[i]);
                            })
                            .then(function(ids){        // content id의 배열 리턴
                                return Promise.all(_MakePromiseArrayBB_CC(cids[i], ids))
                            })
                            .then(function([result1, result2]){        // [[result1], [result2]] 리턴
                                return Promise.all([
                                    _promiseSetData(result1[0], result1[1]),
                                    _promiseSetData(result2[0], result2[1])
                                ])
                            })                      // course contents ends
                        );
        
        ArrayOfPromise.push(PromiseTmp);
    }
    return ArrayOfPromise;
}

let _promiseSetData = function(id, data, CAurl){
    return ( _promiseSearchID(id)
                .then(function(object){
                    return new Promise((resolve, reject) => {
                        object.contents = data;
                        object.url = CAurl;
                        resolve(id);
                    })
                })
                .catch(function(e){
                    return new Promise((resolve, reject) => {
                        courseData.push({"id":id, "contents":data, "url":CAurl});
                        resolve(id);
                    })
                })

    )
}

let _promiseGetCourseAnnouncements = function(responseText){
    return new Promise((resolve, reject) => {
        let tmp = new DOMParser().parseFromString(responseText, "text/html");
        let announcementList = tmp.getElementById('announcementList');
        let result = [];

        if (announcementList) {
            for (let i = 0; i < announcementList.children.length; i++) {

                let title = announcementList.children[i].children[0].innerText; //innerHTML
                let content = announcementList.children[i].children[1].innerText;
                let author = announcementList.children[i].children[2].innerText;

                if (title) {
                    if(!content) content = "";
                    if(!author) author = "";
                    result.push({"order":i, "title":title, "content":content, "author":author});
                }
            }

        }
        resolve(result);
    });
}

let _promiseGetCourseGrades = function(responseText){
    return new Promise((resolve, reject) => {
        let tmp = new DOMParser().parseFromString(responseText, "text/html");
        let grades = tmp.getElementById('grades_wrapper');
        let result = [];

        if (grades) {
            for (let i = 0; i < grades.children.length; i++) {
                let title = grades.children[i].children[0].innerText;
                let grade = grades.children[i].children[2].innerText;

                if (title) {
                    if(!grade) grade = '';
                    result.push({"order": i, "title": title, "content": grade});
                }
            }
        }
        resolve(result);
    })
}

let _promiseGetCourseContentIDs = function(cid){
    return ( _promiseSearchCID(cid)
                .then(function(object){
                    return new Promise((resolve, reject) => {
                        let tmpIDs = [];
                        object.contents.forEach(element => {
                            tmpIDs.push(element.id);
                        });
                        resolve(tmpIDs);
                    })
                })
            )
}

let _MakePromiseArrayBB_CC = function(cid, ids){
    let ArrayOfPromise = [];
    for(let i = 0; i<ids.length; i++){
        let CCurl = "https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id="+cid+"&content_id="+ids[i];
        let newrequest = new XMLHttpRequest();
        let PromiseTmp = (_promiseURLGETnewRequest(newrequest, CCurl)
                        .then(function(responseText){
                            return _promiseGetCourseContents(ids[i], responseText);
                        })
                        );
        ArrayOfPromise.push(PromiseTmp);
    }
    return ArrayOfPromise;
}

let _promiseGetCourseContents = function (id, responseText){
    return new Promise((resolve, reject) => {
        let tmp = new DOMParser().parseFromString(responseText, "text/html");
        let contents = tmp.getElementById('content_listContainer');
        let result = [];

        if (contents) {
            for (let i = 0; i < contents.children.length; i++) {
                let title = contents.children[i].children[1].children[0].innerText;
                let file = contents.children[i].children[2].children[0] ? contents.children[i].children[2].children[0].innerText : "";
                let content = contents.children[i].children[2].children[1] ? contents.children[i].children[2].children[1].innerText : "";

                if (title) {
                    result.push({ "order": i, "title": title, "content": content, "file": file });
                }
            }
        }
        resolve([id, result]);
    })
}