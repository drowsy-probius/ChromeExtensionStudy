// _promiseRefresh

let _promiseGetCourseAnnouncements = (courseId, thisurl) => {
    return new Promise( async (resolve) => {

        let data = await _getURL(thisurl);
        let List = $("<div></div>").append($.parseHTML(data)).find('#announcementList');
        let result = [];

        if (List) {
            List.children('li').each( (index, item) => {
                let title = $(item).find('.item').text();
                let content = $(item).find('div.details');
                $(content).find("*").removeAttr("style");
                if (title) {
                    if (!content) content = "";
                    result.push({ "order": index, "title": title, "content": content.html() });
                }
            });
        }
        resolve({ "id": courseId, "contents": result, "url": thisurl });
    });
};

let _promiseGetCourseGrades = (courseId, thisurl) => {
    return new Promise( async (resolve) => {

        let data = await _getURL(thisurl);

        let grades = $("<div></div>").append($.parseHTML(data)).find('#grades_wrapper');
        let result = [];
        // grades = 0  // 업데이트 로직 테스트용
        if (grades) {
            grades.children('div').each( (index, item) => {
                let title = $(item).find('div.cell.gradable').text();
                let grade = $(item).find('div.cell.grade').text();
                if (title) {
                    if (!grade) grade = '';
                    result.push({ "order": index, "title": title, "content": grade });
                }
            })
        }
        resolve({ "id": courseId + "_grade", "contents": result, "url": thisurl });
    });
};

let _promiseGetCourseContents = (contentId, thisurl) => {
    return new Promise( async (resolve) => {

        let data = await _getURL(thisurl);

        let result = [];
        let contents = $("<div></div>").append($.parseHTML(data)).find('#content_listContainer');

        if (contents) {
            contents.children('li').each( (index, elem) => {
                let rawtitle = $(elem).find('div.item');
                let title = $('<div></div>');

                if ($(rawtitle).find('a').length) {    // 하이퍼 링크 작동하도록 링크 수정
                    let link = "https://kulms.korea.ac.kr" + $(rawtitle).find('a').attr("href").replace("chrome-extension://" + /[a-z]+/g, "")
                    $(rawtitle).find('a').attr("href", link);

                    let text = $(rawtitle).find('a').text();
                    $(rawtitle).find('a').removeAttr("onclick");
                    $(rawtitle).find('a').attr("target", "_blank");
                    $(rawtitle).find('a').children().remove();
                    $(rawtitle).find('a').text(text);
                    title.append($(rawtitle).find('a'));
                } else {
                    title.append($(rawtitle).text());
                }


                let rawfile = $(elem).find('ul.attachments');
                let file = $('<div></div>');

                if (rawfile.length) {
                    rawfile.each( (i, e) => {
                        let filelink = $(e).children('li').children('a');
                        filelink.each((i, _e) => {
                            let link = "https://kulms.korea.ac.kr" + $(_e).attr('href').replace("chrome-extension://" + /[a-z]+/g, "")
                            $(_e).attr('href', link);
                            $(_e).find('img').remove();
                            file.append(_e);
                            file.append('<br>')
                        })
                    })
                }


                let content = $(elem).find('div.vtbegenerated');

                if (content.length) {
                    content.find("*").removeAttr("style");
                }

                result.push({ "order": index, "title": title.html(), "content": content.html(), "file": file.html() })
            })
            resolve({ "id": contentId, "contents": result, "url": thisurl });
        }
    });
};

let _promiseUpdateCourseData = () => {
    return new Promise( async (resolve) => {
        let UpdateInfo = [];

        let courseData = await _getLocalStorage("courseData");

        let newData = await Promise.all(courseData.map((elem) => {
            return new Promise(async (resolve) => {
                let _new;
                switch (elem.url.split('?')[0]) {
                    case "https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement":
                        _new = await _promiseGetCourseAnnouncements(elem.id, elem.url);
                        break;

                    case "https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades":
                        _new = await _promiseGetCourseGrades(elem.id, elem.url);
                        break;

                    case "https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp":
                        _new = await _promiseGetCourseContents(elem.id, elem.url);
                        break;
                }

                if (_new.contents.length > elem.contents.length) {
                    UpdateInfo.push([elem.id, _new.contents.length - elem.contents.length])
                    resolve({ "id": elem.id, "contents": _new.contents, "url": elem.url });
                } else {
                    resolve(elem);
                }
            })
        }))

        resolve([UpdateInfo, newData]);
    });
};