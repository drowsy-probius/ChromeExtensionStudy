let userid = '';
let courseMetaData = []; // [{course id, course name, material id, assignment id}, ] 저장 
let courseData = []; // [ {id: content}, ] 저장

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

    console.log("submit received");
    let [id, pw] = request.user;

      
    _promise1()
    .then(function(response){
      _promise2()
    })



    //init(id, pw);
    sendResponse({ farewell: "goodbye" });

  }
);

let  _promiseURLGET = function get(request, url){
  return new Promise(function(resolve, reject) {
      request.open("GET", url);
      request.onload = function()
      {
          if (request.status == 200)
          {
              resolve(request);
          }else
          {
              reject(Error(request))
          }
      }
      request.onerror = function()
      {
          reject(Error("Network Error"));
      }
      request.send();
  });
}

let _promise1 = ()=>{
  let authURL = "https://auth.korea.ac.kr/directLoginNew.jsp?id=2018320138&pw=(ksh4862)&returnURL=kulms.korea.ac.kr";
  let myinfoURL = "https://kulms.korea.ac.kr/learn/api/public/v1/courses/_138305_1";
  return new Promise((resolve, reject)=>{
    let request1 = new XMLHttpRequest();
    _promiseURLGET(request1, authURL)
    .then(function(request){
      return _promiseURLGET(request, myinfoURL)
    })
    .then(function(request){
      console.log("1");
      console.log(request.responseText);
    })
    .then(function(request){
      resolve(request);
    })
  })
}

let _promise2 = ()=>{
  let myinfoURL = "https://kulms.korea.ac.kr/learn/api/public/v1/courses/_138305_1";
  return new Promise((resolve, reject)=>{
    let request2 = new XMLHttpRequest();
    _promiseURLGET(request2, myinfoURL)
    .then(function(request){
      console.log("2");
      console.log(request.responseText);
    })
    .then(function(request){
      resolve(request);
    })
  })
}