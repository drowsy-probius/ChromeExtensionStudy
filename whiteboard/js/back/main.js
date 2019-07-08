let init = async () => {
    try{
        await _promiseLogin();
        await _promiseGetMeta();
        await _promiseGetData();
        await _sendMessage({isSet: "Yes"});
    }catch(e){
        if(e.message == WRONGINFO){
            await _sendMessage({Error: e.message});
        }else if(e.message == PASS){
            // todo
            await _promiseGetMeta();
            await _promiseGetData();
            await _sendMessage({isSet: "Yes"});
        }else if(e.message == EMPTY){
            // todo
            await _setLocalStorage({"courseMetaData": []});
            await _setLocalStorage({"courseData": []});
            await _sendMessage({isSet: "Yes"});
            await _sendMessage({Error: e.message});
        }
    }
};

let refresh = async () => {
    await _promiseLogin();

    let [UpdateInfo, newData] = await _promiseUpdateCourseData();

    if(UpdateInfo.length)
    {   // 새로운 데이터가 있음
        let BADGE = 0;
        UpdateInfo.forEach(elem => {
            BADGE += elem[1];
        });
        SetBadge(BADGE);
        await _setLocalStorage({"courseData": newData});
        await _sendMessage({isSet: "Yes"});
    }
};

let logout = async () => {
    await _promiseLogout();
}