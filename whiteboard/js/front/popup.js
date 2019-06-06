$('#login').click(function () {
    let id = $('#id').val();
    let stdId = $('#stdId').val();
    let pw = $('#pw').val();

    chrome.runtime.sendMessage({ user: [id, pw, stdId] }, function (response) {
        console.log(response.farewell);
    })

});

$('#reload').click(function () {
    chrome.runtime.sendMessage({ act: "reload" }, function (response) {
        $('.container > .tabs').html('');
        console.log(response.farewell);
    })
})

$('#setinterval').click(function(){
    chrome.runtime.sendMessage({interval: $('#interval').val()}, function(response){
        console.log(response.farewell);
    })
})

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        console.log("submit received");

        if (request.isSet === "Yes") {
            _promiseSetData()
        }

        if(request.updateInfo !== undefined){
            console.log(request.updateInfo);
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
            console.log(courseMetaData);
            console.log(_courseData);
            return _promiseMakeElements(courseMetaData, _courseData)
        })
        .then(function(){
            return new Promise((resolve, reject) => {
                let _content = $('.container > .tabs').html();
                chrome.storage.local.set({"content": _content});
                resolve(_content);    
            })
        })
        .then(function(content) {
            render(content);         
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
    $('.container > .tabs').html(_content);

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

    })

    $('.content-link').click(function () {
        let content_id = $(this).attr('data-content');
        let isCurrent = $(this).attr('class').search("current");

        $('.content-link').removeClass('current');
        $('.content').removeClass('current');

        if(isCurrent === -1){
            $(this).addClass('current');
            $("#" + content_id).addClass('current');
        }
    })
};

let _promiseMakeElements = function (courseMetaData, courseData){
    return new Promise((resolve, reject) => {
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


                let p = $('<p class="text"></p>');
                courseData.forEach(elem => {
                    if (elem.id == contentlists[title]) {
                        elem.contents.forEach(e => {
                            let d = $('<div></div>');
                            let h3 = $('<h3>' + e.title.trim() + '</h3>');
                            let h4 = $('<p>' + e.content.trim() + '</p>');

                            d.append(h3);
                            d.append(h4);
                            p.append(d);
                        })
                    }
                })
                content.append(p);

                content_container.children('ul').append(content_link);
                content_container.append(content);
            }

            $('.container > .tabs').append(course_link);
            course_link.after(content_container);
        })
        resolve("OK");
    });
};

(function(){
    _promiseGetMetaData()
        .then(function(_courseMetaData){
            if(_courseMetaData !== undefined){
                if(!$('.container > .tabs').html().trim()){
                    _promiseGetData()
                    .then(function(courseData){
                        return _promiseMakeElements(_courseMetaData, courseData);
                    })
                    .then(function(){
                        return new Promise((resolve, reject) => {
                            let _content = $('.container > .tabs').html();
                            chrome.storage.local.set({"content": _content});
                            resolve(_content);    
                        })
                    })
                    .then(function(content) {
                        render(content);         
                    })
                    .catch(console.log.bind(console))
                }else{
                    chrome.storage.local.get("content", (result) => {
                        if(result.content !== undefined){
                            render(result.content);
                        }
                    });
                }
            }
        });
})();
