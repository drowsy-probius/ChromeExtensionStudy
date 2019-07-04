// _promiseRefresh

let _promiseGetCourseAnnouncements = (courseId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://kulms.korea.ac.kr/webapps/blackboard/execute/announcement?method=search&course_id="+cids[i],
            type: "GET",
            success: (data) => {
                let List = $("<div></div>").append($.parseHTML(data)).find('#announcementList');
                let result = [];
        
                if (List)
                {
                    List.children('li').each(function(index, item)
                    {
                        let title = $(item).find('.item').text();
                        let content = $(item).find('div.details');
                        $(content).find("*").removeAttr("style");
                        if(title)
                        {
                            if(!content) content = "";
                            result.push({"order":index, "title":title, "content":content.html()});
                        }
                    });
                }
                resolve(result);
            },
            error: (err) => {

            }
        });
    });
};

let _promiseGetCourseGrades = (courseId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://kulms.korea.ac.kr/webapps/bb-mygrades-BBLEARN/myGrades?course_id="+courseId+"&stream_name=mygrades",
            type: "GET",
            success: (data) => {
                let grades = $("<div></div>").append($.parseHTML(data)).find('#grades_wrapper');
                let result = [];
                //grades=0  // 업데이트 로직 테스트용
                if (grades) {
                    grades.children('div').each(function(index, item){
                        let title = $(item).find('div.cell.gradable').text();
                        let grade = $(item).find('div.cell.grade').text();
                        if (title) {
                            if(!grade) grade = '';
                            result.push({"order": index, "title": title, "content": grade});
                        }
                    })
                }
                resolve(result);
            },
            error: (err) => {
                reject(err);
            }
        });
    });
};

let _promiseGetCourseContents = (courseId, contentId) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://kulms.korea.ac.kr/webapps/blackboard/content/listContent.jsp?course_id="+courseId+"&content_id="+contentId,
            type: "GET",
            success: (data) => {
                // todo
            },
            error: (err) => {
                // todo
            }
        })
    })
}