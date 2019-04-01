// function htmlToElement(html) {
//     var template = document.createElement('template');
//     html = html.trim(); // Never return a text node of whitespace as the result
//     template.innerHTML = html;
//     return template.content.firstChild;
// }


//const externalLinks = document.getElementsByClassName("wiki-link-external");

var anchors = document.getElementsByTagName("a");
var anchorsLength = anchors.length;
var index = 0;

for( var i = 0; i<anchorsLength; i++){

    if( (anchors[index].href).match("(#.+)$") === null ){
        var data = anchors[index].innerHTML;
        console.log(data);

        data = data.trim();
        anchors[index].insertAdjacentHTML("afterend", data);
        anchors[index].remove();
    }else{ index += 1; }

}


/*

    if( internalLinks[i] !== undefined ){
        var data = internalLinks[i].innerHTML;

        console.log(data);

        if( data !== undefined ){
            data = data.trim();
            internalLinks[i].insertAdjacentHTML("afterend", data);
            internalLinks[i].remove();
            // var tmp = htmlToElement(data);
            // console.log(tmp);
            // (internalLinks[i].parentNode).replaceChild(tmp, internalLinks[i]);
        }
    }

for( i in externalLinks ){
    if( externalLinks[i] !== undefined ){
        var data = externalLinks[i].innerHTML;
        console.log(data);


        if( data !== undefined ){
            data = data.trim();
            externalLinks[i].insertAdjacentHTML("afterend", data);
            externalLinks[i].remove();
            // var tmp = htmlToElement(data);
            // console.log(tmp);
            // (internalLinks[i].parentNode).replaceChild(tmp, internalLinks[i]);
        }
    }
    

}



/*
const ParaElems = document.getElementsByClassName("wiki-paragraph");
const HeadElems = document.getElementsByClassName("wiki-heading");

문단 내의 internal, external링크 제거
for ( i in ParaElems ){
    if(ParaElems[i].hasChildNodes){
        for ( j in ParaElems[i].childNodes){
            if ( ParaElems[i].childNodes[j].className == "wiki-link-internal" || ParaElems[i].childNodes[j].className == "wiki-link-external"){
                // alert(elems[i].childNodes[j]) // href의 값을 출력
                var data = ParaElems[i].childNodes[j].innerHTML;

                console.log(data);

                if ( data.search('<span') != -1){
                    //alert('0 ' + data)
                    //data = document.createElement(data)
                    var d  = String(data)
                    d =  new DOMParser().parseFromString(d, 'text/html');
                    d = d.getElementsByTagName("body")[0].childNodes

                    ParaElems[i].replaceChild(d[0], ParaElems[i].childNodes[j]);
                    //elems[i].removeChild(elems[i].childNodes[j])
                }else{
                    data = document.createTextNode(data);
                    ParaElems[i].replaceChild(data, ParaElems[i].childNodes[j]);
                }               
                   
            }
        }
    }
}

for ( j in HeadElems ){
    if(HeadElems[i].hasChildNodes){
        for ( j in HeadElems[i].childNodes){
            if ( HeadElems[i].childNodes[j].tagName == "a"){
                // alert(elems[i].childNodes[j]) // href의 값을 출력
                var data = HeadElems[i].childNodes[j].innerHTML;

                console.log(data);

                if ( data.search('<span') != -1){
                    //alert('0 ' + data)
                    //data = document.createElement(data)
                    var d  = String(data)
                    d =  new DOMParser().parseFromString(d, 'text/html');
                    d = d.getElementsByTagName("body")[0].childNodes

                    HeadElems[i].replaceChild(d[0], HeadElems[i].childNodes[j]);
                    //elems[i].removeChild(elems[i].childNodes[j])
                }else{
                    data = document.createTextNode(data);
                    HeadElems[i].replaceChild(data, HeadElems[i].childNodes[j]);
                }               
                   
            }
        }
    }
}
*/