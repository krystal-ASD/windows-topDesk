function get(className) {
    return document.getElementsByClassName(className)[0];
}
const omove = get('move'),
    onav = get('nav'),
    odelete = get('delete'),
    omax = get('max'),
    omin = get('min'),
    odiv = get('content');

//owhole = get('whole'),
oIframe = get('frameweb_bottom').children[0];

let maxDrag = false,
    large = true;

let topAxis, leftAxis, WidthLen, HeightLen;
let coordinateX, coordinateY;
let xDiff, yDiff;

//let MaxHeight = document.documentElement.clientHeight;
//let MaxWidth = document.documentElement.clientWidth;

let curWidth = omove.offsetWidth;
let curHeight = omove.offsetHeight;

omove.style.display = 'none';
odiv.style.display = 'none';

//owhole.style.height = MaxHeight + 'px';
//owhole.style.width = MaxWidth + 'px';

for (let i = 0; i < oshortCut.length; i++) {
    oshortCut[i].onclick = function() {

        omove.style.display = 'block';
        oIframe.src = this.getAttribute("data-src");
        //console.log(oIframe.src);
    }
}

omove.onmousedown = function(e) {
    xDiff = e.clientX - omove.offsetLeft;
    yDiff = e.clientY - omove.offsetTop;

    maxDrag = true;
    omove.style.cursor = 'move';
}
document.onmousemove = function(e) {
    //如果已经是最大全屏  就不能拖动
    if (omove.offsetwidth === window.innerWidth) {
        maxDrag = false;
    }
    if (maxDrag) { //不加=会反复横跳
        coordinateX = Math.min(Math.max(curWidth / 2, e.clientX - xDiff), MaxWidth - curWidth / 2 - 1); //如果是340会出现7px的导航条
        coordinateY = Math.min(Math.max(curHeight / 2, e.clientY - yDiff), MaxHeight - curHeight / 2 - 50);
        omove.style.left = coordinateX + 'px';
        omove.style.top = coordinateY + 'px';

        leftAxis = omove.offsetLeft;
        topAxis = omove.offsetTop;
    }

}
document.onmouseup = function() {
        maxDrag = false;
        omove.style.cursor = 'default';
    }
    /*onav.dblclick(function() {
        omax.onclick();
    })*/
omax.onclick = function() {
    if (large) {
        Move(omove, {
            left: Math.ceil((MaxWidth - 2) / 2),
            top: Math.ceil((MaxHeight - 24) / 2),
            width: Math.ceil(MaxWidth - 2),
            height: Math.ceil(MaxHeight - 24)
        });

        large = false;

    } else {
        Move(omove, {
            left: Math.ceil(leftAxis),
            top: Math.ceil(topAxis),
            width: Math.ceil(curWidth),
            height: Math.ceil(curHeight)
        });

        large = true;
    }
}
odelete.onclick = function() {
    omove.style.display = 'none';
}
omin.onclick = function() {
    omove.style.display = 'none';
    odiv.style.display = 'block';
}
odiv.onclick = function() {
    omove.style.display = 'block';
    odiv.style.display = 'none';
}