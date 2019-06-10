$('#login').click(function () {
    let stdId = $('#stdId').val();
    let pw = $('#pw').val();
    stdId = stdId.replace(/\s/gi, "");

    if(isNaN(stdId) || pw==""){
        $('#message').text('올바른 정보를 입력해 주세요.')
        if(isNaN(stdId)){
            $('#stdId').val('');
        }else{
            $('#pw').val('');
        }
    }else{
        $('#message').text('정보를 가져오는 중입니다.')
        chrome.runtime.sendMessage({ user: [stdId, pw] }, function (response) {
            //console.log(response.farewell);
        })
    }
});

$('#reload').click(function () {
    chrome.runtime.sendMessage({ act: "reload" }, function (response) {
        //console.log(response.farewell);
    })
})

$('#setinterval').click(function(){
    let time = $('#interval').val();
    if(isNaN(time)){
        $('#interval').val('');
        $('#interval').attr("placeholder", "숫자만 입력해 주세요. (현재 간격: "+time+"분)");
    }else{
        chrome.runtime.sendMessage({interval: time}, function(response){
            $('#interval').val('');
            $('#interval').attr("placeholder", "새로고침 간격(현재: "+time+"분)");
        })
    }
})

$(this).keydown(function(key){
    if (key.which == 13) {
        $('#login').click();
    }
});


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // console.log(sender.tab ?
        //     "from a content script:" + sender.tab.url :
        //     "from the extension");

        // console.log("submit received");

        if(request.Error !== undefined){
            $('#message').text(request.Error);
        }

        if (request.isSet === "Yes") {
            _promiseSetData()
        }

        if(request.isUpdate === "Yes"){
            let _courseMetaData = [];
            let _updateInfo = [];
            return new Promise((resolve, reject) => {
                chrome.storage.local.get("updateInfo", (result)=>{
                    _updateInfo = result.updateInfo;
                    resolve("OK");
                })
            })
            .then(function(){
                return _promiseGetMetaData()
            })
            .then(function(courseMetaData){
                _courseMetaData = courseMetaData;
                return _promiseGetData()
            })
            .then(function(_courseData){
                return _promiseMakeElements(_courseMetaData, _courseData, _updateInfo);
            })
            .then(function(tmp){
                $('.container > .tabs').html('');
                chrome.storage.local.set({ "content": tmp.html() });
                render(tmp.html());
            })
            .catch(console.log.bind(console))
        }
        return true;
    }
);

let _promiseSetData = function () {
    let _courseData = [];

    return _promiseGetData()
        .then(function (courseData) {
            _courseData = courseData;
            return _promiseGetMetaData()
        })
        .then(function (courseMetaData) {
            // console.log(courseMetaData);
            // console.log(_courseData);
            return _promiseMakeElements(courseMetaData, _courseData, null)
        })
        .then(function(tmp){
            chrome.storage.local.set({ "content": tmp.html() });
            render(tmp.html())
        })
        .catch(console.log.bind(console))

};

let _promiseGetMetaData = function () {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("courseMetaData", (result) => {
            resolve(result.courseMetaData);
        });
    })
};

let _promiseGetData = function () {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("courseData", (result) => {
            resolve(result.courseData);
        })
    })
};

function render(_content){
    $('.container > .tabs').append(_content);

    $('#message').addClass('hide');
    $('#loginform').addClass('hide');
    $('#login').addClass('hide');
    $('#submit').addClass('hide');

    $('.course-link').click(function () {
        let tab_id = $(this).attr('data-course');  // 선택한 탭의 id(course id)
        let isCurrent = $(this).attr('class').search("current");

        $('.course-link').removeClass('current');
        $('.content-container').removeClass('current');
        $('.content-link').removeClass('current');
        $('.content').removeClass('current');

        if (isCurrent === -1) {
            $(this).addClass('current');
            $("[data-container=" + tab_id + "]").addClass('current');
        }

        chrome.storage.local.set({ "content": $('.container > .tabs').html() });
    })

    $('.content-link').click(function () {
        let content_id = $(this).attr('data-content');
        let isCurrent = $(this).attr('class').search("current");
        let count = $(this).find('.newContent').text();

        $(this).find('.newContent').text('  0  ');
        $(this).removeClass('new');
        $('.content-link').removeClass('current');
        $('.content').removeClass('current');
        
        if(!$(this).siblings('.new').length){
            let selector = $(this).closest("div.content-container").attr("data-container");
            $("[data-course="+selector+"]").removeClass('new');
        }

        if(isCurrent === -1){
            $(this).addClass('current');
            $("#" + content_id).addClass('current');
        }
        chrome.storage.local.set({ "content": $('.container > .tabs').html() });
        chrome.runtime.sendMessage({ removeBadge: count*1 });
    })
};

let _promiseMakeElements = function (courseMetaData, courseData, updateInfo){
    return new Promise((resolve, reject) => {
        let tmp = $('<div><hr></div>');
        courseMetaData.forEach(course => {
            let course_link = $('<li></li>');
            let content_container = $('<div></div>');

            course_link.attr("class", "course-link");
            course_link.attr("data-course", course.courseId);
            course_link.text(course.name);

            content_container.attr("class", "content-container");
            content_container.attr("data-container", course.courseId);
            content_container.append($('<ul class="tabs"></ul>'));

            let contentlists = { "Announcements": course.courseId, "Grades": course.courseId + '_grade' };
            course.contents.forEach(e => {
                contentlists[e.title] = e.id;
            })

            for (let title in contentlists) {
                let content_link = $('<li></li>');
                let content = $('<div></div>');

                content_link.attr("class", "content-link");
                content_link.attr("data-content", contentlists[title]);
                content_link.text(title);

                content.attr("class", "content")
                content.attr("id", contentlists[title]);


                courseData.forEach(elem => {
                    if (elem.id == contentlists[title]) {
                        elem.contents.forEach(e => {
                            let d = $('<div></div>');
                            let _title = $('<h3></h3>');
                            _title.html(e.title);
                            
                            let _content = $('<p></p>');
                            _content.html(e.content);

                            let _file = $('<p></p>');
                            _file.html(e.file);

                            d.append(_title);
                            d.append(_file);
                            d.append(_content);
                            d.append($('<hr>'));
                            content.append(d);
                        })
                    }
                })

                content_container.children('ul').append(content_link);
                content_container.append(content);
            }

            tmp.append(course_link);
            course_link.after(content_container);
            content_container.after('<hr>');
        })
        if(updateInfo === null){
            $(tmp).find(".content-link").append(`<p class="newContent">  0  </p>`);
        }else{
            updateInfo.forEach((course)=>{
                $(tmp).find("[data-content=" + course[0] + "]").append(`<p class="newContent">  ${course[1]}  </p>`);
                if (course[1] > 0) {
                    $(tmp).find("[data-content=" + course[0] + "]").addClass("new");

                    let selector = $(tmp).find("[data-content=" + course[0] + "]").closest("div.content-container").attr("data-container");
                    $(tmp).find("[data-course=" + selector + "]").addClass("new");
                }
            })
            chrome.storage.local.set({ "updateInfo": 0 });
        }
        
        resolve(tmp);
    });
};

(function(){
    chrome.storage.local.get("updateInfo", (updateResult) => {
        if (updateResult.updateInfo === undefined) {  // 업데이트를 한번도 안한 상태
            _promiseGetMetaData()
            .then(function (_courseMetaData) {
                if (_courseMetaData !== undefined) {
                    _promiseGetData()
                        .then(function (courseData) {
                            return _promiseMakeElements(_courseMetaData, courseData, null);
                        })
                        .then(function (tmp) {
                            render(tmp.html())
                        })
                        .catch(console.log.bind(console));

                }
            })
        } else if (updateResult.updateInfo == 0) {   // 이미 한번 구현된 상태
            chrome.storage.local.get("content", (contentResult) => {
                if (contentResult.content !== undefined) {
                    render(contentResult.content);
                } else {
                    _promiseGetMetaData()
                    .then(function (_courseMetaData) {
                        if (_courseMetaData !== undefined) {
                            _promiseGetData()
                                .then(function (courseData) {
                                    return _promiseMakeElements(_courseMetaData, courseData, null);
                                })
                                .then(function (tmp) {
                                    render(tmp.html())
                                })
                                .catch(console.log.bind(console));
        
                        }
                    })
                }
            })
        } else { // 업데이트는 했으나 구현은 안된 상태
            _promiseGetMetaData()
            .then(function (_courseMetaData) {
                if (_courseMetaData !== undefined) {
                    _promiseGetData()
                        .then(function (courseData) {
                            return _promiseMakeElements(_courseMetaData, courseData, updateResult.updateInfo);
                        })
                        .then(function (tmp) {
                            render(tmp.html())
                        })
                        .catch(console.log.bind(console));

                }
            })
        }
    })
   
    chrome.storage.local.get("INTERVAL", (result) => {
        if(result.INTERVAL === undefined){
            $('#interval').attr("placeholder", "새로고침 간격(현재: 120분)");
        }else{
            $('#interval').attr("placeholder", "새로고침 간격(현재: "+result.INTERVAL+"분)");
        }
        
    });
})();
