업데이트 과정 테스트
chrome.storage.local.get("courseData", (result)=>{console.log(result.courseData);});
에서 나온 것 중 content의 길이가 1 이상인 것을 빈 리스트로 바꿔줌

chrome.storage.local.get("courseData", (result)=>{result.courseData[2].contents=[]; chrome.storage.local.set({"courseData": result.courseData});});