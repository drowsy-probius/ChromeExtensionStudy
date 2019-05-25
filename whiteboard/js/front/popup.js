$('#login').click(function(){
    let id = $('#id').attr('value');
    let pw = $('#pw').attr('value');

    if(isNaN(id))
    {
        $('#message').text = "포탈 아이디 말고 학번 로그인을 해주세요.";
    }else
    {
        $('#message').text = "";
        chrome.runtime.sendMessage({user: [id, pw]}, function(response){
            console.log(response.farewell);
        })
    }
});

$('reload').click(function () {
    chrome.runtime.sendMessage({ act: "reload" }, function (response) {
        console.log(response.farewell);
    })
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");

    console.log("submit received");

    if(request.isSet == "Yes"){
        _promiseSetData()
    }

  }
);

let _promiseSetData = function () {

    let _courseData = [];
    let count = 0;

    return _promiseGetData()
        .then(function (courseData) {
            _courseData = courseData;
            return _promiseGetMetaData()
        })
        .then(function (courseMetaData) {
            console.log(courseMetaData);
            console.log(_courseData);
            return new Promise((resolve, reject) => {
                courseMetaData.forEach(course => {
                    let course_link = $('<li></li>');
                    let content_container = $('<div></div>');

                    if (!count) {
                        course_link.attr("class", "tab-link current");
                        content_container.attr("class", "tab-container current");
                    } else {
                        course_link.attr("class", "tab-link");
                        content_container.attr("class", "tab-container");
                    }
                    course_link.attr("data-tab", course.courseId);
                    course_link.text(course.name);

                    content_container.attr("data-container", course.courseId);
                    content_container.append($('<ul class="tabs"></ul>'));

                    let contentlists = {"Announcements":course.courseId, "Grades":course.courseId+'_grade'};
                    course.contents.forEach(e => {
                        contentlists[e.title] = e.id;
                    })

                    for(let title in contentlists){
                        let content_link = $('<li></li>');
                        let content = $('<div></div>');
                        if (!count) {
                            content_link.attr("class", "content-link current");
                            content.attr("class", "content current");
                            count = 1;
                        } else {
                            content_link.attr("class", "content-link");
                            content.attr("class", "content")
                        }
                        content_link.attr("data-tab", contentlists[title]);
                        content_link.text(title);

                        content.attr("id", contentlists[title]);

                        let p = $('<p class="text"></p>');
                        _courseData.forEach(elem => {
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
                    $('.container').append(content_container);


                })
                resolve("OK");
            })
            .then(function(){
                $('#message').addClass('hide');
                $('#loginform').addClass('hide');
                $('#login').addClass('hide');
                $('#submit').addClass('hide');
                $('#logout').removeClass('hide');

                $('.container > .tabs li').click(function () {
                    var tab_id = $(this).attr('data-tab');
            
                    $('li').removeClass('current');
                    $('.container > .tab-container').removeClass('current');
            
                    $(this).addClass('current');
                    $("[data-container=" + tab_id + "]").addClass('current');
                    $("[data-container=" + tab_id + "]").children('.tabs').children(':first-child').addClass('current');
                    $("[data-container=" + tab_id + "]").children(':nth-child(2)').addClass('current');

                })
            
                $('.tab-container > .tabs li').click(function () {
                    var content_id = $(this).attr('data-tab');
            
                    $('.tab-container > .tabs li').removeClass('current');
                    $('.tab-container > .content').removeClass('current');
            
                    $(this).addClass('current');
                    $("#" + content_id).addClass('current');
                })
            })
        })

}

let _promiseGetMetaData = function(){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("courseMetaData", (result) => {
            resolve(result.courseMetaData);
        });
    })
}

let _promiseGetData = function(){
    return new Promise((resolve, reject)=>{
        chrome.storage.local.get("courseData", (result) => {
            resolve(result.courseData);
        })
    })
}