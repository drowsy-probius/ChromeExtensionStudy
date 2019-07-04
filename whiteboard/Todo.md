업데이트 과정 테스트
chrome.storage.local.get("courseData", (result)=>{console.log(result.courseData);});
에서 나온 것 중 content의 길이가 1 이상인 것을 빈 리스트로 바꿔줌

chrome.storage.local.get("courseData", (result)=>{result.courseData[2].contents=[]; chrome.storage.local.set({"courseData": result.courseData});});



학기가 변하면 자동으로 업데이트하는걸 어떻게하지
지금은 업데이트 과정을 coursedata에 있는 url가지고만 새로고침하는 거라서
수업이 바뀌면 아예 coursemetadata하고 coursedata를 새로 가져와야함. // 일단 해결함. 테스트는 못해봄

크롬 켜질때 자동으로 한번 새로고침 하도록 하자.
id, pw가 저장되었는지 확인하고 저장된 상태면 새로고침하기.
저장되었는지 아닌지 체크하는 것은 전역변수로 하나 해놓으면 백그라운드 꺼질떄 같이 사라질 것 같으니까 그냥 id pw를 chrome.storage로 불러와서 체크하자.

