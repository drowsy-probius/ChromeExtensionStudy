업데이트 과정 테스트
chrome.storage.local.get("courseData", (result)=>{console.log(result.courseData);});
에서 나온 것 중 content의 길이가 1 이상인 것을 빈 리스트로 바꿔줌

chrome.storage.local.get("courseData", (result)=>{result.courseData[2].contents=[]; chrome.storage.local.set({"courseData": result.courseData});});

학기가 변하면 자동으로 업데이트하는걸 어떻게하지

지금은 업데이트 과정을 coursedata에 있는 url가지고만 새로고침하는 거라서
수업이 바뀌면 아예 coursemetadata하고 coursedata를 새로 가져와야함.

