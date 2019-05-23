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


https://developer.chrome.com/extensions/webNavigation

https://ourcstory.tistory.com/158 //js 딕셔너리

https://stackoverflow.com/questions/19054299/how-to-get-elements-from-a-webpage-dom-into-my-background-js

var courseId = JS_RESOURCES['bb.instructorView.lightbox.courseId'];
var contentId = JS_RESOURCES['bb.instructorView.lightbox.contentId'];
