(async () => {
    let content = await _getLocalStorage("content");

    if(content){
        render(content); 
    }else{
        let courseMeta = await _getLocalStorage("courseMetaData");
        let courseData = await _getLocalStorage("courseData");
        if(courseMeta && courseData){
            render(await makeElements());
        }
    }

    let interval = await _getLocalStorage("INTERVAL");
    if(interval === undefined){
        $('#interval').attr("placeholder", "새로고침 간격(현재: 120분)");
    }else{
        $('#interval').attr("placeholder", "새로고침 간격(현재: "+interval+"분)");
    }

})();

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

        _setLocalStorage({ "content": $('.container > .tabs').html() });
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

        _setLocalStorage({ "content": $('.container > .tabs').html() });
        _sendMessage({ "removeBadge": count*1 });
    })

    _setLocalStorage({ "content": $('.container > .tabs').html() });
};

function makeElements(){
    return new Promise( async (resolve, reject) => {
        let courseMeta = await _getLocalStorage("courseMetaData");
        let courseData = await _getLocalStorage("courseData");
        let updateInfo = await _getLocalStorage("updateInfo");

        let tmp = $('<div></div>');

        courseMeta.forEach(course => {
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
        });

        if(updateInfo){
            updateInfo.forEach( (course)=>{
                $(tmp).find("[data-content=" + course[0] + "]").append(`<p class="newContent">  ${course[1]}  </p>`);
                if (course[1] > 0) {
                    $(tmp).find("[data-content=" + course[0] + "]").addClass("new");

                    let selector = $(tmp).find("[data-content=" + course[0] + "]").closest("div.content-container").attr("data-container");
                    $(tmp).find("[data-course=" + selector + "]").addClass("new");
                }
            })
            _setLocalStorage({ "updateInfo": 0 });
        }else{
            $(tmp).find(".content-link").append(`<p class="newContent">  0  </p>`);
        }
        
        resolve(tmp.html());
    });
};

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
    let msgport = chrome.runtime.connect();
    msgport.postMessage(obj);
};

chrome.runtime.onConnect.addListener( (msgport) => {
    msgport.onMessage.addListener( async (msg) => {
        if(msg.Error !== undefined){
            $('#message').text(msg.Error);
        }else if (msg.isSet === "Yes") {
            $('.container > .tabs').html('');
            render( await makeElements() );
        }
    });
});
