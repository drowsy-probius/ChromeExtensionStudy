let _MakePromiseArrayBB = (cids) => {
    let ArrayOfPromise = [];
    for(let i = 0; i<cids.length; i++){
        let CAurl = "https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&course_id="+cids[i];
        let CGurl = "https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id="+cids[i]+"&stream_name=mygrades";
        let PromiseTmp = (_promiseURLGETnewRequest(new XMLHttpRequest(), CAurl) // course announcements starts
                            .then(function(responseText){ 
                                return _promiseGetCourseAnnouncements(responseText)  
                            })
                            .then(function(result){
                                return new Promise((resolve, reject) => {
                                    courseData.push({"id":cids[i], "contents":result, "url":CAurl});
                                    resolve(cids[i]);
                                })
                                //return _promiseSetData(cids[i], result, CAurl)
                            })                      // course announcements ends
                            .then(function(id){     // course grades starts
                                return _promiseURLGETnewRequest(new XMLHttpRequest(), CGurl)
                            })
                            .then(function(responseText){
                                return _promiseGetCourseGrades(responseText);
                            })
                            .then(function(result){
                                return new Promise((resolve, reject) => {
                                    courseData.push({"id":cids[i]+"_grade", "contents":result, "url":CGurl});
                                    resolve(cids[i]);
                                })
                            })                     // course grades ends
                            .then(function(id){    // course contents starts
                                return _promiseGetCourseContentIDs(cids[i]);
                            })
                            .then(function(ids){        // content id의 배열 리턴
                                return Promise.all(_MakePromiseArrayBB_CC(cids[i], ids))
                            })
                            .then(function(resultArray){        // [[result1], [result2]] 리턴
                                resultArray.forEach(e => {
                                    courseData.push({"id":e[0], "contents":e[1], "url":e[2]});
                                })
                            })                      // course contents ends
                        );
        
        ArrayOfPromise.push(PromiseTmp);
    }
    return ArrayOfPromise;
}

let _promiseGetCourseAnnouncements = function(responseText){
    return new Promise((resolve, reject) => {
        let tmp = new DOMParser().parseFromString(responseText, "text/html");
        let announcementList = tmp.getElementById('announcementList');
        let result = [];

        if (announcementList) {
            for (let i = 0; i < announcementList.children.length; i++) {

                let title = announcementList.children[i].getElementsByClassName('item')[0].innerText; //innerHTML
                let content = announcementList.children[i].getElementsByClassName('vtbegenerated')[0].innerHTML;
                let author = announcementList.children[i].getElementsByClassName('announcementInfo')[0].innerText;

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
        let PromiseTmp = (_promiseURLGETnewRequest(new XMLHttpRequest(), CCurl)
                        .then(function(responseText){
                            return _promiseGetCourseContents(ids[i], responseText, CCurl);
                        })
                        );
        ArrayOfPromise.push(PromiseTmp);
    }
    return ArrayOfPromise;
}

let _promiseGetCourseContents = function (id, responseText, CCurl){
    return new Promise((resolve, reject) => {
        let tmp = new DOMParser().parseFromString(responseText, "text/html");
        let contents = tmp.getElementById('content_listContainer');
        let result = [];

        if (contents) {
            for (let i = 0; i < contents.children.length; i++) {
                let title = contents.children[i].getElementsByClassName('item')[0].innerText;
                //let file = contents.children[i].getElementsByClassName('attachments')[0] ? contents.children[i].getElementsByClassName('attachments')[0].innerText : "";
                let content = contents.children[i].getElementsByClassName('vtbegenerated')[0] ? contents.children[i].getElementsByClassName('vtbegenerated')[0].innerText : "";

                if (title) {
                    result.push({ "order": i, "title": title, "content": content});
                }
            }
        }
        resolve([id, result, CCurl]);
    })
}

let _promiseGetCourseContents2 = function (responseText){
    return new Promise((resolve, reject) => {
        let tmp = new DOMParser().parseFromString(responseText, "text/html");
        let contents = tmp.getElementById('content_listContainer');
        let result = [];

        if (contents) {
            for (let i = 0; i < contents.children.length; i++) {
                let title = contents.children[i].getElementsByClassName('item')[0].innerText;
                let content = contents.children[i].getElementsByClassName('vtbegenerated')[0] ? contents.children[i].getElementsByClassName('vtbegenerated')[0].innerText : "";

                if (title) {
                    result.push({ "order": i, "title": title, "content": content});
                }
            }
        }
        resolve(result);
    })
}

let _promiseUpdateCourseData = function(_courseData){
    let ArrayOfPromise = [];
    _courseData.forEach(elem => {
        let PromiseTmp = (_promiseGetNewData(elem.url)
                        .then(function(_result){
                            return new Promise((resolve, reject) => {
                                let count = _result.length - elem.contents.length;
                                if(count > 0){
                                    elem.contents = _result;
                                    resolve([elem.id, count]);
                                }else{
                                    resolve([elem.id, 0]);
                                }
                            })
                        }));
        ArrayOfPromise.push(PromiseTmp);
    })
    return ArrayOfPromise;
};

let _promiseGetNewData = function getNewData(url) {
    return new Promise((resolve, reject) => {
        switch (url.split('?')[0]) {
            case "https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement":
                _promiseURLGETnewRequest(new XMLHttpRequest(), url)
                    .then(function (responseText) {
                        return _promiseGetCourseAnnouncements(responseText)
                    })
                    .then(function (result) {
                        resolve(result);
                    })
                break;
            case "https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades":
                _promiseURLGETnewRequest(new XMLHttpRequest(), url)
                    .then(function (responseText) {
                        return _promiseGetCourseGrades(responseText);
                    })
                    .then(function (result) {
                        resolve(result);
                    })
                break;
            case "https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp":
                _promiseURLGETnewRequest(new XMLHttpRequest(), url)
                    .then(function (responseText) {
                        return _promiseGetCourseContents2(responseText)
                    })
                    .then(function (result) {
                        resolve(result);
                    })
                break;
        }
        
    })

}