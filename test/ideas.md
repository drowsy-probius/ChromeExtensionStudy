처음 실행(설정)
id/passwd (아니면 session? token?)
코스 별로 공지사항/수업자료 주소 입력
새로고침할 시간 간격
현재 공지사항/수업자료 정보 저장
storage, chrome.local.set

각 수업별로 linked list로 구현.

실행 시
chrome.local.get으로 설정 정보, 이전 공지사항/수업자료 정보 불러오기
각 코스별로 탭 생성
현재 정보 불러오기
chrome.local.get으로 불러온 이전 정보하고 비교
다르면 다른 숫자만큼 배지에 표시 + 각 탭에 표시 + 알림음?
불러온 정보 chrome.local.set으로 저장

로그아웃되면 저장된 id/passwd로 다시 로그인/ 아니면 session refresh?


{
    cId1:{cName: "",
            cmId: { p1: 123, p2: 234},
            cAnnoun: []} 
}


https://developer.chrome.com/extensions/webNavigation

https://ourcstory.tistory.com/158 //js 딕셔너리

https://stackoverflow.com/questions/19054299/how-to-get-elements-from-a-webpage-dom-into-my-background-js

var courseId = JS_RESOURCES['bb.instructorView.lightbox.courseId'];
var contentId = JS_RESOURCES['bb.instructorView.lightbox.contentId'];

https://developers.google.com/web/fundamentals/primers/promises?hl=ko
// promisd하고 xmlhttp

공지사항 불러오기???
https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&context=course_entry&course_id=${courseid}&handle=announcements_entry&mode=view
그냥 여기서 하자


https://developer.blackboard.com/portal/displayApi/Learn?version=3400.0.0 참고.
블랙보드 로그인 후에 내가 얻을 수 있는 정보들은 접근 가능함.

https://kulms.korea.ac.kr/learn/api/public/v1/users?userName=${학번}    으로 접근하면 userid 얻을 수 있음.
{"results":[{"id":"_843184_1","userName":"2018320138","studentId":"k123s456h","educationLevel":"Unknown","gender":"Unknown","systemRoleIds":["User"],"name":{"given":"김석희","family":".","other":"k123s456h"},"contact":{"email":"k123s456h@gmail.com"}}]}
https://kulms.korea.ac.kr/learn/api/public/v1/users/${userid}/courses   으로 접근하면 아래내용 얻음. created하고 availability.available이 yes/disabled해서 courseid 가져오면 될듯
{"results":[{"userId":"_843184_1","courseId":"_115823_1","dataSourceId":"_75_1","created":"2018-03-07T11:07:40.623Z","availability":{"available":"Yes"},],"paging":{"nextPage":"/learn/api/public/v1/users/_843184_1/courses?offset=38"}}

https://kulms.korea.ac.kr/learn/api/public/v1/courses/_138319_1/announcements 으로 접근하면 코스 공지사항

https://kulms.korea.ac.kr/learn/api/public/v1/courses/${courseid} 으로 접근하면 코스 정보
{"id":"_138305_1","courseId":"20191R0136COSE28300","name":"[학부]회로이론(영강)(ENGINEERING CIRCUITS(English))-00분반","organization":false,"ultraStatus":"Classic","readOnly":false,"termId":"_64_1","availability":{"available":"Term","duration":{"type":"Continuous"}},"enrollment":{"type":"InstructorLed"},"locale":{"id":"en_US"},"externalAccessUrl":"https://kulms.korea.ac.kr/webapps/blackboard/execute/courseMain?course_id=_138305_1&sc="}

https://kulms.korea.ac.kr/learn/api/public/v1/courses/${courseid}/gradebook/columns 으로 접근하면 코스 성적 '정보'
{"results":[{"id":"_1140587_1","name":"Total","description":"OutcomeDefinition.Total.description","score":{"possible":19.00000},"grading":{"type":"Calculated"}},{"id":"_1148314_1","name":"HW 1","contentId":"_2338082_1","score":{"possible":3.00000},"grading":{"type":"Attempts","due":"2019-04-04T14:59:00.000Z","attemptsAllowed":3,"scoringModel":"Last"}},{"id":"_1174650_1","name":"HW 2","contentId":"_2357381_1","score":{"possible":3.00000},"grading":{"type":"Attempts","due":"2019-04-11T14:59:00.000Z","attemptsAllowed":3,"scoringModel":"Last"}},{"id":"_1177376_1","name":"HW 3","contentId":"_2367132_1","score":{"possible":3.00000},"grading":{"type":"Attempts","attemptsAllowed":3,"scoringModel":"Last"}},{"id":"_1179097_1","name":"HW 4","contentId":"_2376525_1","score":{"possible":4.00000},"grading":{"type":"Attempts","due":"2019-05-16T14:59:00.000Z","attemptsAllowed":1,"scoringModel":"Last"}},{"id":"_1179786_1","name":"HW 5","contentId":"_2380559_1","score":{"possible":3.00000},"grading":{"type":"Attempts","due":"2019-05-23T14:59:00.000Z","attemptsAllowed":3,"scoringModel":"Last"}},{"id":"_1180862_1","name":"HW 6","contentId":"_2386236_1","score":{"possible":3.00000},"grading":{"type":"Attempts","due":"2019-06-04T14:59:00.000Z","attemptsAllowed":3,"scoringModel":"Last"}}]}

https://kulms.korea.ac.kr/learn/api/public/v1/courses/${courseid}/gradebook/users/${userid} 으로 접근하면 내 코스 성적
{"results":[{"userId":"_843184_1","columnId":"_1140587_1","exempt":false},{"userId":"_843184_1","columnId":"_1148314_1","status":"NeedsGrading","exempt":false},{"userId":"_843184_1","columnId":"_1174650_1","status":"NeedsGrading","exempt":false},{"userId":"_843184_1","columnId":"_1177376_1","status":"NeedsGrading","exempt":false},{"userId":"_843184_1","columnId":"_1179097_1","status":"NeedsGrading","exempt":false},{"userId":"_843184_1","columnId":"_1179786_1","status":"NeedsGrading","exempt":false}]}

https://kulms.korea.ac.kr/learn/api/public/v1/courses/_138305_1/contents 으로 접근하면 assessment id하고 assignment id 얻을 수 있음
{"results":[{"id":"_2308088_1","title":"Course Materials","created":"2017-02-09T07:08:57.493Z","position":3,"hasChildren":true,"availability":{"available":"Yes","allowGuests":false,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-folder"}},{"id":"_2308089_1","title":"Assignments","created":"2017-02-09T07:08:57.707Z","position":5,"hasChildren":true,"availability":{"available":"Yes","allowGuests":false,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-folder"}}]}

https://kulms.korea.ac.kr/learn/api/public/v1/courses/_138305_1/contents/_2308088_1/children 으로 접근하면 코스에 대한 assessment나 assignment 얻을 수 있음
{"results":[{"id":"_2324322_1","parentId":"_2308088_1","title":"Syllabus","created":"2019-03-06T08:36:19.380Z","position":0,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"Syllabus - EC - 2019.pdf"}}},{"id":"_2324323_1","parentId":"_2308088_1","title":"Lecture note for ch. 1","created":"2019-03-06T08:36:34.317Z","position":1,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"ch1.pdf"}}},{"id":"_2329271_1","parentId":"_2308088_1","title":"Lecture note for ch 2","created":"2019-03-12T01:02:10.137Z","position":2,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"EC-ch2.pdf"}}},{"id":"_2360296_1","parentId":"_2308088_1","title":"Lecture note for ch 3","created":"2019-04-01T23:18:44.603Z","position":3,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"EC-ch3.pdf"}}},{"id":"_2365163_1","parentId":"_2308088_1","title":"Lecture note for ch 4","created":"2019-04-08T14:43:48.503Z","position":4,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"EC-ch4.pdf"}}},{"id":"_2371315_1","parentId":"_2308088_1","title":"Solution of hw 2","created":"2019-04-18T08:03:45.210Z","position":5,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"EC-hw-ch2-soln.pdf"}}},{"id":"_2376504_1","parentId":"_2308088_1","title":"Python for complex variables","created":"2019-05-02T01:19:51.620Z","position":6,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"Python for complex values.pdf"}}},{"id":"_2376698_1","parentId":"_2308088_1","title":"Lecture note for ch. 5","created":"2019-05-02T03:16:16.483Z","position":7,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"EC-ch5.pdf"}}},{"id":"_2379972_1","parentId":"_2308088_1","title":"Lecture note for ch. 6","created":"2019-05-08T07:24:13.443Z","position":8,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"EC-ch6.pdf"}}},{"id":"_2382727_1","parentId":"_2308088_1","title":"Lecture note for ch 7","created":"2019-05-14T04:48:02.237Z","position":9,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"EC-ch7.pdf"}}},{"id":"_2382729_1","parentId":"_2308088_1","title":"Solution of midterm","created":"2019-05-14T04:49:01.227Z","position":10,"availability":{"available":"Yes","allowGuests":true,"adaptiveRelease":{}},"contentHandler":{"id":"resource/x-bb-file","file":{"fileName":"EC-2019-Midterm-sol.pdf"}}}]}






