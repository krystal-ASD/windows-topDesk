const oshortCut = document.getElementsByClassName('shortCut');
let w, h;

const odatetime1 = document.getElementById('datetime1'),
    odatetime2 = document.getElementById('datetime2');

const otopNav = get('topNav'),
    obg = get('bg');

const bgArr = ['images/bg0.jpg', 'images/bg1.jpg', 'images/bg2.jpg', 'images/bg3.jpg']

function get(className) {
    return document.getElementsByClassName(className)[0];
}


function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}

function insort(width, height) {
    //console.log(h);
    let n = parseInt((h - 50) / height);
    //console.log(n);
    for (let i = 0; i < oshortCut.length; i++) {
        oshortCut[i].style.left = Math.floor(i / n) * width + 15 + 'px';
        //console.log(oshortCut[i].style.left);
        oshortCut[i].style.top = Math.floor(i % n) * height + 15 + 'px';
        //console.log(oshortCut[i].style.top);
    }
}

//刚开始初始化屏幕图标
w = document.documentElement.clientWidth;
h = document.documentElement.clientHeight;
insort(95, 105);

//监测屏幕宽高变化
window.addEventListener("resize", function() {
    w = document.documentElement.clientWidth;
    h = document.documentElement.clientHeight;
    insort(95, 105);
});

/* 获取当前时间 */
setInterval(function() {
    var s = arr = CurentTime().split(" ");
    //console.log(s);
    odatetime1.innerHTML = s[1];
    odatetime2.innerHTML = s[0];

}, 1000);

function CurentTime() {
    var now = new Date();

    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日

    var hh = now.getHours(); //时
    var mm = now.getMinutes(); //分
    var ss = now.getSeconds(); //秒

    var clock = year + "-";

    if (month < 10)
        clock += "0";

    clock += month + "-";

    if (day < 10)
        clock += "0";

    clock += day + " ";

    if (hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";

    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
}

for (let i = 0; i < otopNav.children.length; i++) {
    otopNav.children[i].onclick = function() {
        obg.style.background = 'url(' + bgArr[i] + ')';
    }
}