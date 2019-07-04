(async () => {
    chrome.storage.local.get("content", async (result) => {
        if(result.content){
            render(result.content); 
        }else{
            render(await makeElements());
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

    chrome.storage.local.set({ "content": $('.container > .tabs').html() });
};

function makeElements(){
    return new Promise((resolve, reject) => {
        let courseMeta, courseData, updateInfo;
        chrome.storage.local.get("courseMetaData", (result) => { courseMeta = result.courseMetaData; });
        chrome.storage.local.get("courseData", (result) => { courseData = result.courseData; });
        chrome.storage.local.get("updateInfo", (result) => { updateInfo = result.updateInfo; });

        let tmp = $('<div><hr></div>');

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
        })
        if(updateInfo === null){
            $(tmp).find(".content-link").append(`<p class="newContent">  0  </p>`);
        }else{
            updateInfo.forEach( (course)=>{
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