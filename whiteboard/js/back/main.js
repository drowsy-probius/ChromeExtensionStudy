let init = async () => {
    await _promiseLogin();
    await _promiseGetMeta();
    await _promiseGetData();
    await _sendMessage({isSet: "Yes"});
};

let refresh = async () => {
    let [UpdateInfo, newData] = await _promiseUpdateCourseData();

    if(UpdateInfo.length)
    {   // 새로운 데이터가 있음
        let BADGE = 0;
        UpdateInfo.forEach(elem => {
            BADGE += elem[1];
        });
        SetBadge(BADGE);
        await _setLocalStorage({"courseData":newData});
        await _sendMessage({isSet: "Yes"});
    }
};

