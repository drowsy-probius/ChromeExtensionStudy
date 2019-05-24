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
                                return _promiseSetData(cids[i], result)
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

let _promiseSetData = function(id, data){
    return ( _promiseSearchID(id)
                .then(function(object){
                    return new Promise((resolve, reject) => {
                        object.contents = data;
                        resolve(id);
                    })
                })
                .catch(function(e){
                    return new Promise((resolve, reject) => {
                        courseData.push({"id":id, "contents":data});
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

                let title = announcementList.children[i].children[0].innerHTML;
                let content = announcementList.children[i].children[1].innerHTML;
                let author = announcementList.children[i].children[2].innerHTML;

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
                let title = grades.children[i].children[0].innerHTML
                let grade = grades.children[i].children[2].innerHTML

                if (title) {
                    if(!grade) grade = '';
                    result.push({"order": i, "title": title, "grade": grade});
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
                let title = contents.children[i].children[1].children[0].innerHTML;
                let file = contents.children[i].children[2].children[0] ? contents.children[i].children[2].children[0].innerHTML : "";
                let content = contents.children[i].children[2].children[1] ? contents.children[i].children[2].children[1].innerHTML : "";

                if (title) {
                    result.push({ "order": i, "title": title, "content": content, "file": file });
                }
            }
        }
        resolve([id, result]);
    })
}
//


// let _promiseGet = function(){
//     return new Promise( (resolve, reject) => {
//         chrome.storage.local.get(['CourseList'], (result) => {
//             console.log("current value is ");
//             console.log(new LinkedList(result.CourseList));

//             resolve(new LinkedList(result.CourseList));
            
//         });  
//     });
// }

// let _promiseMain = function (List){
//     return new Promise( (resolve, reject) => {
//         let curURL = window.location.href;
//         if(curURL == "https://kulms.korea.ac.kr/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1")
//         {
//             console.log("코스 목록 확인");
//             type = 1;
//         }else
//         {
//             cururl = curURL.split('?')[0];
//             switch(cururl)
//             {
//                 case "https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement":
//                     console.log("공지사항 목록 확인");
//                     type = 2;
//                     break;
//                 case "https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp":
//                     console.log("수업 자료 또는 과제 목록 확인");
//                     type = 3;
//                     break;
//                 case "https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades":
//                     console.log("성적 목록 확인");
//                     type = 4;
//                     break;
//                 default:
//                     console.log(curURL);
//                     console.log("어느 것도 아님.");
//                     type = 0;
//             }
//         }
//         if(type) getCourseInfo(type, List);
//         resolve(List);
//     })
    
// }

// let _promiseSet = function(List){
//     return new Promise( (resolve, reject) => {
//         if(!List || List._length===0) reject(Error("The List is empty."));
//         else{
//             List._time = Date.now();
//             chrome.storage.local.set({"CourseList": List}, () => {
//                 console.log('Value is set to ');
//                 console.log(List);
//                 resolve(List);
//             });
//         }
//     });
// }


// window.onload(function(){
//     _promiseGet()
//         .then(function(List){ return _promiseMain(List); })
//         .catch(function(err){console.log(err); })
// });


// let getCourseInfo = function(type, List){
//     // get course information(course title, course id, content id[conditional]) from course list or course page
//     //
//     // https://kulms.korea.ac.kr/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1                                                    // course list              -> 1
//     // https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&course_id=${courseid}      -> 2
//     // https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=${courseid}&content_id=${contentid}          // course materials           -> 3
//     // https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=${courseid}&content_id=${contentid + 1}&mode=reset      // assignments                -> 3
//     // https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id=${courseid}&stream_name=mygrades               // grades                    -> 4
//     //
//     // Node정보     .URL: course의 URL, .courseName: course의 이름, .courseId: 블랙보드에서의 course id, .materialId: course material page 접근할 때의 contentId,
//     //              .assignmentsId: assinments page접근할 때의 contentId, .announcements: [[title, content, author], ], .materials: [[title, file, content]]
//     //              .assignments: [[title, due, instruct], ], .grades: [[title, grade], ], .next: 다음 node
//     //              
//     return new Promise((resolve, reject) => {
//         if (type === 1) // course list page // acutally inital
//         {
//             let isLoaded = 0;
//             document.getElementById('column1').addEventListener("mouseover", function () {
//                 let courses = document.getElementsByClassName('portletList-img courseListing coursefakeclass ')[0];
//                 if ( !isLoaded && courses) {
//                     console.log(courses);
//                     for (let i = 0; i < courses.children.length; i++) {
//                         let coName = courses.children[i].getElementsByTagName('a')[0].innerText;
//                         let [cId] = courses.children[i].getElementsByTagName('a')[0].href.match(/_[0-9]+_[0-9]/g);
    
//                         let newdata = new Data();
//                         newdata.courseName = coName;
//                         newdata.courseId = cId;
    
//                         let isExist = List.cId_indexOf(newdata.courseId);
//                         if (isExist === -1) {
//                             List.append(newdata);
//                         }
//                         else {
//                             List.updateData(isExist, newdata);
//                         }
//                     }

//                     _promiseSet(List)
//                     .catch(function(err){console.log(err); })

//                     isLoaded = 1;
//                 }
//             });
//         } else if (type === 2) // announcements
//         {
//             let announcementList = document.getElementById('announcementList');
    
//             if (announcementList) {
//                 let currentURL = window.location.href;
//                 let [cId] = currentURL.match(/_[0-9]+_[0-9]/g);
    
//                 let newdata = new Data();
//                 newdata.courseId = cId;
    
//                 for (let i = 0; i < announcementList.children.length; i++) {
    
//                     let title = announcementList.children[i].children[0].innerText;
//                     let content = announcementList.children[i].children[1].innerText;
//                     let author = announcementList.children[i].children[2].innerText;
    
//                     if (title) {
//                         // if(!content) content = '게시물 내용을 불러올 수 없습니다. (message by extension)';
//                         // if(!author) author = '작성자 정보를 불러올 수 없습니다. (message by extension)';
//                         newdata.announcements[title] = [i, content, author];
//                     }
//                 }
    
//                 let isExist = List.cId_indexOf(newdata.courseId);
//                 if (isExist === -1) {
//                     List.append(newdata);
//                 } else {
//                     List.updateData(isExist, newdata);
//                 }

//                 _promiseSet(List)
//                 .catch(function(err){console.log(err); })
//             }
    
    
//         } else if (type === 3) // course materials && assignments
//         {
//             let contents = document.getElementById('content_listContainer');
    
//             if (contents) {
//                 let currentURL = window.location.href;
//                 let [cId, Id] = currentURL.match(/_[0-9]+_[0-9]/g);
    
//                 let type;
    
//                 let newdata = new Data();
//                 newdata.courseId = cId;
    
//                 let contenttype = document.getElementById('pageTitleText').innerText;
//                 if (['Assignments', '과제', 'assignments', 'assignment'].includes(contenttype)) // assignments
//                 {
//                     newdata.assignmentsId = Id;
//                     type = newdata.assignments;
//                 } else // course material
//                 {
//                     newdata.materialId = Id;
//                     type = newdata.materials;
//                 }
    
//                 for (let i = 0; i < contents.children.length; i++) {
//                     let title = contents.children[i].children[1].children[0].innerText;
//                     let file = "", content = "";
//                     try {
//                         file = contents.children[i].children[2].children[0].innerText;
//                         content = contents.children[i].children[2].children[1].innerText;
    
//                     } catch (e) {
//                         console.log("No file or content");
//                     }
    
//                     if (title) {
//                         type[title] = [i, content, file]
//                     }
//                 }
    
//                 let isExist = List.cId_indexOf(newdata.courseId);
//                 if (isExist === -1) {
//                     List.append(newdata);
//                 } else {
//                     List.updateData(isExist, newdata);
//                 }

//                 _promiseSet(List)
//                 .catch(function(err){console.log(err); })
//             }
    
    
//         } else if (type === 4) // grades
//         {
//             let grades = document.getElementById('grades_wrapper');
    
//             if (grades) {
//                 let currentURL = window.location.href;
//                 let [cId] = currentURL.match(/_[0-9]+_[0-9]/g);
    
//                 let newdata = new Data();
//                 newdata.courseId = cId;
    
//                 for (let i = 0; i < grades.children.length; i++) {
//                     let title = grades.children[i].children[0].innerText
//                     let grade = grades.children[i].children[2].innerText
    
//                     if (title) {
//                         // if(!grade) grade = '점수를 불러올 수 없습니다. (message by extension)';
//                         newdata.grades[title] = [i, grade];
//                     }
//                     // 만약 content에서 getElementsByTagName('a');하고 존재한다면 태그 그대로 가져와서 하이퍼링크 사용할 수도 있을 듯.
//                 }
    
//                 let isExist = List.cId_indexOf(newdata.courseId);
//                 if (isExist === -1) {
//                     List.append(newdata);
//                 } else {
//                     List.updateData(isExist, newdata);
//                 }

//                 _promiseSet(List)
//                 .catch(function(err){console.log(err); })
//             }
//         }
//     })



// };