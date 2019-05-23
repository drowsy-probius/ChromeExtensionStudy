// Check whether new version is installed

// chrome.runtime.onInstalled.addListener(function(details){

//     if(details.reason == "install"){
//         console.log("This is a first install!");

//         chrome.storage.sync.set({"CourseList": headNode}, function() {
//             console.log('Value is set to ' + headNode);
//         });  

//     }else{
//         chrome.storage.sync.get(['CourseList'], function(result) {
//             headNode = result.CourseList;
//             console.log('Value currently is ' + result.key);
//          });

//     }
// });

// let headNode;

// chrome.runtime.onInstalled.addListener(function(details){

//     if(details.reason == "install")
//     {
//         headNode = new Object();
//         headNode.count = 0;
//         headNode.next = new Object(null);
//         headNode.currentTime = 0 ;

//         chrome.storage.local.set({"CourseList": headNode}, function() {
//             console.log('Value is set to ' + headNode);
//         });

//     }
// });

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     chrome.tabs.executeScript({
//         file: "js/getinfo.js",
//         runAt: "document_idle"
//     });
// }); 

// chrome.webNavigation.onCompleted.addListener(function(e) {
    

// }, {url: [{urlMatches : 'https://kulms.korea.ac.kr/*'}]});



// 공지사항
// 'https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&context=course_entry&course_id=_' + courseId + '&handle=announcements_entry&mode=view'
// 강의계획서
// 'https://kulms.korea.ac.kr/webapps/bbgs-SyllabusKU__2016-BBLEARN/index?course_id=_' + courseId + '&mode=view'
// 강의자료
// 'https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=_' + courseId + '&content_id=_' + contentId + '&mode=reset'
// 토론실
// 'https://kulms.korea.ac.kr/webapps/discussionboard/do/conference?toggle_mode=read&action=list_forums&course_id=_' + courseId + '&nav=discussion_board_entry&mode=view'
// 과제
// 'https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=_' + courseId + '&content_id=_' + contentId + '&mode=reset'
// 성적
// 'https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id=_' + courseId + '&stream_name=mygrades&is_stream=false'

// 공지사항
// https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&context=course_entry&course_id=_137606_1&handle=announcements_entry&mode=view
// https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&context=course_entry&course_id=_138305_1&handle=announcements_entry&mode=view
// 강의계획서
// https://kulms.korea.ac.kr/webapps/bbgs-SyllabusKU__2016-BBLEARN/index?course_id=_137606_1&mode=view
// https://kulms.korea.ac.kr/webapps/bbgs-SyllabusKU__2016-BBLEARN/index?course_id=_138305_1&mode=view
// 강의자료
// https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=_137606_1&content_id=_2305292_1&mode=reset
// https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=_138305_1&content_id=_2308088_1&mode=reset
// 토론실
// https://kulms.korea.ac.kr/webapps/discussionboard/do/conference?toggle_mode=read&action=list_forums&course_id=_137606_1&nav=discussion_board_entry&mode=view
// https://kulms.korea.ac.kr/webapps/discussionboard/do/conference?toggle_mode=read&action=list_forums&course_id=_138305_1&nav=discussion_board_entry&mode=view
// 과제
// https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=_137606_1&content_id=_2305293_1&mode=reset
// https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=_138305_1&content_id=_2308089_1&mode=reset
// 성적
// https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id=_137606_1&stream_name=mygrades&is_stream=false
// https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id=_138305_1&stream_name=mygrades&is_stream=false
