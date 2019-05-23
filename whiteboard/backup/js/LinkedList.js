// Data Structure
// https://boycoding.tistory.com/33

// Node정보     .URL: course의 URL, .courseName: course의 이름, .courseId: 블랙보드에서의 course id, .materialId: course material page 접근할 때의 contentId,
//              .assignmentsId: assinments page접근할 때의 contentId, .announcements: [[title, content, author], ], .materials: [[title, file, content]]
//              .assignments: [[title, due, instruct], ], .grades: [[title, grade], ], .next: 다음 node

function Data(data){
    if(!data){
        this.courseName = '';
        this.courseId = '';
        this.materialId = '';
        this.assignmentId = '';
        this.announcements = {}; // { title: [content, autho], }
        this.materials = {};     // {title: [content, file]}
        this.assignments = {};
        this.grades = {};
    }else
    {
        this.courseName = data.courseName;
        this.courseId = data.courseId;
        this.materialId = data.materialId;
        this.assignmentId = data.assignmentId;
        this.announcements = data.announcements;
        this.materials = data.materials;
        this.assignments = data.assignments;
        this.grades = data.grades;
    }
}

function Node(data) {
    this.data = data;
    this.next = null;
}

function LinkedList(data){
    if(!data) // initial
    {
        this._length = 0;
        this._time = 0;
        this._head = null;
    }else // data = {length, time, head}
    {
        this._length = data._length;
        this._time = data._time;
        this._head = data._head;
    }

}

LinkedList.prototype.append = function(data) {
    console.log("append start");
    console.log(this);

    var node = new Node(data);
    var curr;

    if( this._head == null ) {

        this._head = node;

    } else {
        curr = this._head;

        while( curr.next ) {
            curr = curr.next;
        }

        curr.next = node;
    }

    this._length += 1;

    console.log("append ends");
    console.log(this);
};

LinkedList.prototype.removeAt = function(pos) {
    if( pos > -1 && pos < this._length ) {
        var curr = this._head;
        var prev, index = 0;

        if( pos === 0 ) {
            this._head = curr.next;
        } else {
            while( index++ < pos ) {
                prev = curr;
                curr = prev.next;
            }

            prev.next = curr.next;
        }

        this._length -= 1;

        curr.next = null;

        return curr.data;
    }

    return null;
};

LinkedList.prototype.updateData = function (pos, newdata){
    console.log("data update start");
    console.log(this);

    if( pos > -1 && pos < this._length)
    {
        var curr = this._head;
        var prev, index = 0;

        if(pos > 0)
        {
            while( index++ < pos)
            {
                prev = curr;
                curr = prev.next;
            }
        }
        console.log(curr);
        console.log(curr.data);
        update(curr.data, newdata);
    }

    console.log("data update ends");
    console.log(this);
}

LinkedList.prototype.cId_indexOf = function(cId) { // data 이름에 맞게 수정
    console.log("search courseid start");
    console.log(this._head);
    console.log("cId is " + cId);

    var curr = this._head,
        index = -1;

    while( curr ) {
        index++;
        console.log(curr.data.courseId);
        if( curr.data.courseId === cId ) {
            console.log("search courseid ends success");
            console.log(index);
            console.log(curr);
            return index;
        }
        curr = curr.next;
    }

    console.log("search courseid ends fail");
    console.log(curr);

    return -1;
};

LinkedList.prototype.remove = function(data) { // data 이름에 맞게 수정
    var index = this.indexOf(data);
    return this.removeAt(index);
};

LinkedList.prototype.insert = function(pos, data) { // data 이름에 맞게 수정
    if( pos >= 0 && pos <= this._length ) {
        var node = new Node(data),
            curr = this._head,
            prev,
            index = 0;

        if( pos === 0 ) {
            node.next = curr;
            this._head = node;
        } else {
            while( index++ < pos ) {
                prev = curr;
                curr = curr.next;
            }

            node.next = curr;
            prev.next = node;
        }

        this._length += 1;

        return true;
    }

    return false;
};

LinkedList.prototype.isEmpty = function() {
    return this._length === 0;
};

LinkedList.prototype.size = function() {
    return this._length;
};

function update (olddata, newdata){
    console.log("update node start");
    console.log(olddata);
    console.log(newdata);

    olddata.courseName = olddata.courseName == newdata.courseName ? olddata.courseName : newdata.courseName ;

    olddata.courseId = olddata.courseId == newdata.courseId ? olddata.courseId : newdata.courseId ;
    olddata.materialId = olddata.materialId == newdata.materialId ? olddata.materialId : newdata.materialId ;
    olddata.assignmentId = olddata.assignmentId == newdata.assignmentId ? olddata.assignmentId : newdata.assignmentId ;

    olddata.announcements = olddata.announcements == newdata.announcements ? olddata.announcements : newdata.announcements ;
    olddata.materials = olddata.materials == newdata.materials ? olddata.materials :  newdata.materials ;
    olddata.assignments = olddata.assignments == newdata.assignments ? olddata.assignments : newdata.assignments ;
    olddata.grades = olddata.grades == newdata.grades ? olddata.grades : newdata.grades ;

    console.log(olddata);
}

function compare(a, b){
    return a === b ? a : b;
}