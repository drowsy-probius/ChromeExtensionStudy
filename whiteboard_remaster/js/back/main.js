let init = async (stdId, pw) => {
    await _promiseLogin(stdId, pw);
    await _promiseGetMeta();
    await _promiseGetData();
    await chrome.runtime.sendMessage({isSet: "Yes"});
};

let refresh = async () => {
    let UpdateInfo = await _promiseUpdateCourseData();
    if(UpdateInfo.length)
    {   // 새로운 데이터가 있음
        let BADGE = 0;
        UpdateInfo.forEach(elem => {
            BADGE += elem[1];
        });
        SetBadge(BADGE);
        chrome.runtime.sendMessage({isSet: "Yes"});
    }
};

