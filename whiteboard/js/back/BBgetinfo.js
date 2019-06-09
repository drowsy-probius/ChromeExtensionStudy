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
        let announcementList = $("<div></div>").append($.parseHTML(responseText)).find('#announcementList');
        let result = [];

        if (announcementList) {
            announcementList.children('li').each(function(index, item){
                let title = $(item).find('.item').text();
                let content = $(item).find('div.details').html();
                if(title){
                    if(!content) content = "";
                    result.push({"order":index, "title":title, "content":content});
                }
            })
            // for (let i = 0; i < announcementList.children('li').length; i++) {

            //     let title = $(announcementList.children('li')[i]).find('item').text();
            //     let content = $(announcementList.children('li')[i]).find('div.details')[0].html();
            //     //let author = $(announcementList.children('li')[i]).find('div.announcementInfo')[0].innerText;

            //     if (title) {
            //         if(!content) content = "";
            //         if(!author) author = "";
            //         //result.push({"order":i, "title":title, "content":content, "author":author});
            //         result.push({"order":i, "title":title, "content":content});
            //     }
            // }

        }
        resolve(result);
    });
}

let _promiseGetCourseGrades = function(responseText){
    return new Promise((resolve, reject) => {
        let grades = $("<div></div>").append($.parseHTML(responseText)).find('#grades_wrapper');
        let result = [];
        //grades=0  // 업데이트 로직 테스트용
        if (grades) {
            grades.children('div').each(function(index, item){
                let title = $(item).find('div.cell.gradable').text();
                let grade = $(item).find('div.cell.grade').text();
                if (title) {
                    if(!grade) grade = '';
                    result.push({"order": index, "title": title, "content": grade});
                }
            })
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
        let contents = $("<div></div>").append($.parseHTML(responseText)).find('#content_listContainer');
        let result = [];

        if (contents) {
            contents.children('li').each(function(i,e){
                let title = $(e).find('div.item').text();
                let rawfile = $(e).find('ul.attachments');
                let file = $('<div></div>');
                let content = $(e).find('div.vtbegenerated').html(); 

                if(rawfile !== undefined){
                    rawfile.each(function(index, item){
                        let _file = $(item).children('li').children('a');

                        _file.each(function(index, _item){
                            let link = "https://kulms.korea.ac.kr" + $(_item).attr('href').replace("chrome-extension://" + /[a-z]+/g, "")
                            $(_item).attr('href', link);
                            $(_item).find('img').remove();
                            file.append(_item);
                            file.append('<br>')
                        })
                    })
                }              

                if (title) {
                    result.push({ "order": i, "title": title, "content": content, "file": file.html()});
                }
            })
        }
        resolve([id, result, CCurl]);
    })
}

let _promiseGetCourseContents2 = function (responseText){
    return new Promise((resolve, reject) => {
        let contents = $("<div></div>").append($.parseHTML(responseText)).find('#content_listContainer');
        let result = [];

        if (contents) {
            contents.children('li').each(function(i,e){
                let title = $(e).find('div.item').text();
                let rawfile = $(e).find('ul.attachments');
                let file = $('<div></div>');
                let content = $(e).find('div.vtbegenerated').html(); 

                if(rawfile !== undefined){
                    rawfile.each(function(index, item){
                        let _file = $(item).children('li').children('a');

                        _file.each(function(index, _item){
                            let link = "https://kulms.korea.ac.kr" + $(_item).attr('href').replace("chrome-extension://" + /[a-z]+/g, "")
                            $(_item).attr('href', link);
                            $(_item).find('img').remove();
                            file.append(_item);
                            file.append('<br>')
                        })
                    })
                }              

                if (title) {
                    result.push({ "order": i, "title": title, "content": content, "file": file.html()});
                }
            })
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