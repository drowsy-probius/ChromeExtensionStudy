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


body{
  margin-top: 100px;
  font-family: 'Trebuchet MS', serif;
  line-height: 1.6
}
.container{
  width: 500px;
  margin: 0 auto;
}
 
 
 
ul.tabs{
  margin: 0px;
  padding: 0px;
  list-style: none;
}
ul.tabs li{
  background: none;
  color: #222;
  display: inline-block;
  padding: 10px 15px;
  cursor: pointer;
}
 
ul.tabs li.current{
  background: #ededed;
  color: #222;
}
 
.tab-content{
  display: none;
  background: #ededed;
  padding: 15px;
}
 
.tab-content.current{
  display: inherit;
}

<div class="container">
 
  <ul class="tabs">
    <li class="tab-link current" data-tab="tab-1">메뉴_하나</li>
    <li class="tab-link" data-tab="tab-2">메뉴_둘</li>
    <li class="tab-link" data-tab="tab-3">메뉴_셋</li>
  </ul>
 
  <div id="tab-1" class="tab-content current">
---- ---- -------- ---- ---- ---- ---- ---- ---- -------- ---- ---- ---- ---- ---- ---- -------- ---- ---- ---- ---- ---- ---- -------- ---- ---- ---- ---- ---- ---- -------- ---- ---- ---- ---- ---- ---- -------- ---- ---- ---- ----
  </div>
  <div id="tab-2" class="tab-content">
---- ---- ★------ ---- ---- ---- ---- ---- ---- -------- ---- ---- ---- ---- ---- ---- -------- ---- ---- ---- ★-- ---- ---- ------★ ---- ---- ---- ---- ---- ---- -------- ---- ---- ---- ---- ---- ---- ★------ ---- ---- ---- ----
  </div>
  <div id="tab-3" class="tab-content">
---- ★-- -------- ---- ---- ---- -★- ---- ---- -------- ---- -★- ---- ---- ---- ---- -------- ---- ---- ---- ---- ---- --★ -------- ★-- ---- ---- ---- ---- ---- -------- ---- ---- --★ ---- ---- ---- -------- ---- ---- ---- --★
  </div>
 
</div>


$(document).ready(function(){
   
  $('ul.tabs li').click(function(){
    var tab_id = $(this).attr('data-tab');
 
    $('ul.tabs li').removeClass('current');
    $('.tab-content').removeClass('current');
 
    $(this).addClass('current');
    $("#"+tab_id).addClass('current');
  })
 
})