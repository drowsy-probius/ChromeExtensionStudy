로그인: 학번로그인
pw 암호화? 해서 저장?


blackboard api를 이용해서 코스 별로
    1. 코스 이름
    2. 코스 아이디
    3. 수업자료 아이디
    4. 과제 아이디
=> CourseMetaData = [{}, {}] 으로 저장
blackboard api 이용 끝

그 다음은 블랙보드 사이트에 직접 접속해서 데이터 긁어오기, 저장(이전에 만든거 활용)
=> CourseData = []에 저장

데이터 저장할때 현재 시간도 저장해서 일정 시간이 지날 때마다
데이터 새로 불러오고 만약 다르면(길이가 다르면?) 새 CourseData 저장.

popup.html에는 탭처럼 구성을 하자
기본 css는 블랙보드 사이트에서 그대로 가져오자

글에 첨부사진이나 첨부파일이 있으면 되도록이면 그대로 가져오자.

popup.html 저장?
https://stackoverflow.com/questions/14888858/chrome-extension-preserve-html-data
암호화?
https://getsatisfaction.com/apperyio/topics/how_to_save_account_password_securely_on_local_storage

div class=container
    ul class=tabs
        li class=course-link data-course=1111
        /li
        div class=content-container data-container=1111
            ul class=tabs
                li class=content-link data-content=1111-1
                /li
            /ul
            div class=content id=1111-1
            /div
        /div
    /ul
/div

