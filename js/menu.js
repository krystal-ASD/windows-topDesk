function get(className) {
    return document.getElementsByClassName(className)[0];
}

const MaxWidth = document.documentElement.clientWidth,
    MaxHeight = document.documentElement.clientHeight;

const owhole = get('whole'),
    omenu = get('menu'),
    oxiangxia = document.getElementsByClassName('right');
obtn = document.getElementById('btn');

let flag = true;
let menuflag = true;

function getNextElement(node) {
    if (node.nodeType === 1) {
        return node;
    }
    if (node.nextSibling) {
        return getNextElement(node.nextSibling);
    }
    return null;
}

function stopPropagation(e) {
    var ev = e || window.event;
    if (ev.stopPropagation) {
        ev.stopPropagation();
    } else if (window.event) {
        window.event.cancelBubble = true; //兼容IE
    }
}

window.onload = function() {
    owhole.style.width = MaxWidth + 'px';
    owhole.style.height = MaxHeight + 'px';
    omenu.style.visibility = 'hidden';
    omenu.onclick = function(e) {
        stopPropagation(e);
    }
    obtn.onclick = function(e) {
        console.log(menuflag);
        stopPropagation(e);
        if (menuflag) {
            omenu.style.visibility = 'visible';
            menuflag = !menuflag;
        } else {
            omenu.style.visibility = 'hidden';
            menuflag = !menuflag;
        }
    }
    document.onclick = function() {
        if (omenu.style.visibility === 'visible') {
            menuflag = !menuflag;
            console.log(1);
        }
        omenu.style.visibility = 'hidden';
    }

}


for (let i = 0; i < oxiangxia.length; i++) {
    let node;
    oxiangxia[i].onclick = function(e) {
        node = getNextElement(e.currentTarget.nextSibling);
        node.style.display = flag ? 'block' : 'none';
        node.parentElement.style.height = flag ? 45 * (node.children.length + 1) + 'px' : "45px";
        flag = !flag;
    }


}