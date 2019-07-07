// 기본 로직 정의
let _promiseLogin = (stdId, pw) => {
    return new Promise(async (resolve) => {
        let step1 = await _getURL("https://kulms.korea.ac.kr/");
        let form = $("<output>").append($.parseHTML(step1)).find('#loginBox2').find('form');

        if (form.attr("action") !== undefined) {
            let stdId = await _getLocalStorage("stdId");
            let encrypted = await _getLocalStorage("pw");
            let pw = CryptoJS.AES.decrypt(encrypted, stdId).toString(CryptoJS.enc.Utf8);

            form.find('#user_id').val(stdId);
            form.find('#password').val(pw);
            let step2 = await _postURL("https://kulms.korea.ac.kr/" + form.attr("action"), form.serialize());
            let check = $("<output>").append($.parseHTML(step2)).find('title').text();
            
            if(check.search("마이페이지") !== -1){
                resolve(step2);
            }else{

                await _setLocalStorage({"stdId": null});
                await _setLocalStorage({"pw": null});
                reject(new Error("Wrong user information."));
            }
        } else {
            resolve("You already have logged in");
        }
    });
};

let _promiseGetMeta = () => {
    return new Promise(async (resolve) => {
        let userid = await _promiseGetUserId( await _getLocalStorage("stdId") );
        let courseMetaData = await _promiseGetCourse( await _promiseGetCourseIds(userid) );

        await _setLocalStorage({ "userid": userid });
        await _setLocalStorage({ "courseMetaData": courseMetaData });

        resolve(courseMetaData);
    });
};

let _promiseGetData = () => {
    return new Promise(async (resolve) => {
        let courseMetaData = await _getLocalStorage("courseMetaData");

        let P_array = [];
        courseMetaData.forEach( (elem) => {
            P_array.push(
                new Promise(async (resolve) => {
                    let announcement = await _promiseGetCourseAnnouncements(elem.courseId,
                        "https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&course_id=" + elem.courseId);
                    resolve(announcement);
                }),
                new Promise(async (resolve) => {
                    let grade = await _promiseGetCourseGrades(elem.courseId,
                        "https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id=" + elem.courseId + "&stream_name=mygrades");
                    resolve(grade);
                })
            )
            elem.contents.forEach((e) => {
                P_array.push(new Promise(async (resolve) => {
                    let content = await _promiseGetCourseContents(e.id,
                        "https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id=" + elem.courseId + "&content_id=" + e.id);
                    resolve(content);
                }));
            });
        })

        let courseData = await Promise.all(P_array);
        await _setLocalStorage({ "courseData": courseData });

        resolve(courseData);
    });
};

let _promiseLogout = () => {
    return new Promise(async (resolve) => {
        let result = await _getURL("https://kulms.korea.ac.kr/webapps/login/?action=logout");
        resolve(result);
    })
}

function SetBadge(newValue) {
    chrome.browserAction.getBadgeText({}, (curValue) => {
        if (newValue != 0) {
            if (curValue == '') {
                chrome.browserAction.setBadgeText({
                    'text': newValue + ''
                });
            } else {
                chrome.browserAction.setBadgeText({
                    'text': ((curValue * 1) + newValue) == 0 ? '' : ((curValue * 1) + newValue) + ''
                });
            }
        }
        chrome.browserAction.setBadgeBackgroundColor({
            'color': '#dd0000'
        });
    })
}

function _setLocalStorage(obj) {
    return new Promise((resolve) => {
        chrome.storage.local.set(obj, () => resolve());
    });
};

function _getLocalStorage(key = null) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (item) => {
            key ? resolve(item[key]) : resolve(item);
        });
    });
};

function _sendMessage(obj) {
    return new Promise((resolve) => {
        let msgport = chrome.runtime.connect();
        msgport.postMessage(obj, () => resolve() );
    });
};

function _getURL(url) {
    return new Promise((resolve) => {
        $.get(url, (data) => resolve(data) );
    });
};

function _postURL(url, obj = null) {
    return new Promise((resolve) => {
        $.post(url, obj, (data) => resolve(data) );
    })
}


// 알람이나 언제 실행되는지 설정
// 메시지 관리
chrome.runtime.onConnect.addListener( (msgport) => {
    msgport.onMessage.addListener( async (msg) => {
        if (msg.user !== undefined) {
    
            let [stdId, pw] = msg.user;
    
            await _setLocalStorage({"stdId": stdId});
            let encrypted = CryptoJS.AES.encrypt(pw, stdId);
            await _setLocalStorage({"pw": encrypted});
    
            init();
    
        }else if (msg.act === "reload") {
    
            refresh();
    
        }else if (msg.act === "forcereload") {
    
            init();
    
        }else if (msg.removeBadge !== undefined) {
    
            SetBadge(-1 * msg.removeBadge);
    
        }else if (msg.interval !== undefined) {
    
            if (msg.interval * 1 < 1) {
                INTERVAL = 1;
            } else {
                INTERVAL = msg.interval;
            }
            chrome.alarms.clearAll()
            chrome.alarms.create({ when: Date.now() + 1000, periodInMinutes: INTERVAL * 1 });
            await _setLocalStorage({ "INTERVAL": INTERVAL });
    
        }
    });
})
