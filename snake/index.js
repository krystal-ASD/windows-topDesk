var sw = 20,
    sh = 20,
    tr = 26,
    td = 26;

var snake = null,
    food = null,
    game = null;

var posCur = [0, 0], //记录掉头时离蛇头最近的节点的坐标    避免把掉头误判为首尾相接
    obj = null,
    second = 200,
    flagBorder = false;


function Square(x, y, classname) {
    this.x = x * sw;
    this.y = y * sh;
    this.class = classname;
    this.viewContent = document.createElement('div'); //方块对应的DOM元素
    this.viewContent.className = this.class;
    this.parent = document.getElementById('snakeWrap'); //小方块添给父级的孩子
}
Square.prototype.create = function() {
    this.viewContent.style.position = 'absolute';
    this.viewContent.style.width = sw + 'px';
    this.viewContent.style.height = sh + 'px';
    this.viewContent.style.left = this.x + 'px';
    this.viewContent.style.top = this.y + 'px';
    this.parent.appendChild(this.viewContent);
}
Square.prototype.remove = function() {
    this.parent.removeChild(this.viewContent);
}

function Snake() {
    this.head = null; //存储蛇头的信息
    this.tail = null;
    this.pos = []; //蛇每个方块位置

    this.directionNum = {
        left: {
            x: -1,
            y: 0,
            rotate: 180 //蛇头图片变化
        },
        right: {
            x: 1,
            y: 0
        },
        up: {
            x: 0,
            y: -1,
            rotate: -90
        },
        down: {
            x: 0,
            y: 1,
            rotate: 90
        }
    }; //存储蛇走的方向
}
Snake.prototype.init = function() {
    var snakeHead = new Square(2, 0, 'snakeHead');
    snakeHead.create();
    this.head = snakeHead;
    this.pos.push([2, 0]);

    var snakeBody1 = new Square(1, 0, 'snakeBody');
    snakeBody1.create();
    this.pos.push([1, 0]);

    var snakeBody2 = new Square(0, 0, 'snakeBody');
    snakeBody2.create();
    this.pos.push([0, 0]);
    this.tail = snakeBody2;

    snakeHead.last = null;
    snakeHead.next = snakeBody1;

    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;

    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;

    this.direction = this.directionNum.right; //蛇刚开始默认右转

};
Snake.prototype.getNextPos = function() {

    var nextPos = [
        this.head.x / sw + this.direction.x,
        this.head.y / sh + this.direction.y
    ];
    //console.log(nextPos);
    //碰到自己结束
    var selfCollied = false;
    obj = this;
    //console.log(posCur);
    //console.log(this.pos[0]);
    //console.log(this.pos[0]); //蛇头的坐标
    //console.log(this.pos[this.pos.length - 2]); //蛇头后面挨着的一个节点的坐标
    if (this.pos[0][0] !== posCur[0] && this.pos[0][1] !== posCur[1]) {
        //蛇头没有和其后面的节点重合   确定不是掉头   在考虑是否首尾相接（蛇头撞到自身）
        this.pos.forEach(function(value) { //这个新位置不能和之前蛇的任何节点位置相同  
            if (value[0] == nextPos[0] && value[1] == nextPos[1]) {
                selfCollied = true;
            }
        });
    }

    if (selfCollied) {
        console.log('撞到自己了');
        this.strategies.die.call(this);
    }
    if (nextPos[0] < 0 || nextPos[1] < 0 || nextPos[0] > td - 1 || nextPos[1] > tr - 1) {
        console.log('撞墙了');
        this.strategies.die.call(this);
    }
    //吃食物
    if (food && food.pos[0] == nextPos[0] && food.pos[1] == nextPos[1]) {
        this.strategies.eat.call(this);
    }
    //什么都不满足  接着走
    this.strategies.move.call(this);
}
Snake.prototype.strategies = {
    move: function(format) { //新建一个头后的身体，删除头后占据头的位置，再新建一个头加在新身体前面 

        var newBody = new Square(this.head.x / sw, this.head.y / sh, 'snakeBody');

        newBody.next = this.head.next;
        newBody.next.last = newBody;
        newBody.last = null;

        this.head.remove();

        newBody.create();

        //创建一个蛇头
        var newHead = new Square(this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y, 'snakeHead');
        newHead.last = null;
        newHead.next = newBody;
        newBody.last = newHead;
        newHead.viewContent.style.transform = 'rotate(' + this.direction.rotate + 'deg)';

        newHead.create();
        this.pos.splice(0, 0, [this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y]);
        this.head = newHead;

        //根据是否吃食物看是否删除尾部节点
        if (!format) { //如果没有format传入 为undefined  取反为true
            this.tail.remove();
            this.tail = this.tail.last;
            this.tail.next = null;

            this.pos.pop();
        }

    },
    eat: function() {
        this.strategies.move.call(this, true); //传过去    true表示吃到了食物   末尾的节点不删除
        createFood();
        game.score++;
    },
    die: function() {

        game.over();
    }
}
snake = new Snake();

function createFood() {
    var x = null;
    var y = null;

    var include = true;
    while (include) { //确保新建食物的位置不在蛇身上
        x = Math.round(Math.random() * (td - 1));
        y = Math.round(Math.random() * (tr - 1));

        snake.pos.forEach(function(value) {
            if (value[0] != x && value[1] != y) {
                include = false;
            }
        });
    }

    food = new Square(x, y, 'food');
    food.pos = [x, y];

    var foodDom = document.querySelector('.food');
    //console.log(foodDom);    初始化还没有吃到时为null  
    if (foodDom) { //有食物改变它的位置
        foodDom.style.left = x * sw + 'px';
        foodDom.style.top = y * sh + 'px';
    } else {
        food.create();
    }

}
var snakeWrap = document.getElementById('snakeWrap');
var startBtn = document.querySelector('.startBtn');
var pauseBtn = document.querySelector('.pauseBtn');

function Game() {
    this.timer = null;
    this.score = 0;
}

function reserveSnake() {
    let tmp = this.head;
    this.head = this.tail;
    this.tail = tmp;
    posCur = obj.pos[1];
    //console.log(posCur);
}

function changeMove() {
    if (food.pos[0] == 0 || food.pos[0] == td || food.pos[1] == 0 || food.pos[1] == tr) {
        flagBorder = true;
    }
    if (flagBorder && (obj.pos[0][0] < 3 || obj.pos[0][0] > td - 4 || obj.pos[0][1] < 3 || obj.pos[0][1] > tr - 4)) {
        flagBorder = false;
        return 3600;
    } else {
        return 200;
    }
}
Game.prototype.init = function() {
    snake.init();
    createFood();

    document.onkeydown = function(ev) {
        if (ev.which == 37) {
            if (snake.direction == snake.directionNum.right) {
                reserveSnake();

            }
            snake.direction = snake.directionNum.left;
        } else if (ev.which == 38) {
            if (snake.direction == snake.directionNum.down) {
                reserveSnake();

            }
            snake.direction = snake.directionNum.up;
        } else if (ev.which == 39) {
            if (snake.direction == snake.directionNum.left) {
                reserveSnake();
            }
            snake.direction = snake.directionNum.right;
        } else if (ev.which == 40) {
            if (snake.direction == snake.directionNum.up) {
                reserveSnake();
            }
            snake.direction = snake.directionNum.down;
        }
    }
    this.start();
    /*if (food.pos[0] == 0 || food.pos[0] == td || food.pos[1] == 0 || food.pos[1] == tr) {
        flagBorder = true;
    }
    if (flagBorder && (obj.pos[0][0] < 3 || obj.pos[0][0] > td - 4 || obj.pos[0][1] < 3 || obj.pos[0][1] > tr - 4)) {
        this.start(800);
    }else {
        
    }  */
}
Game.prototype.start = function() {

    this.timer = setInterval(function() {
        snake.getNextPos();
        second = changeMove();
    }, second);
}
Game.prototype.pause = function() {
    clearInterval(this.timer);
}
Game.prototype.over = function() {

    clearInterval(this.timer);
    alert('你的得分为:' + this.score + '分');

    snakeWrap.innerHTML = '';
    snake = new Snake();
    game = new Game();

    startBtn.style.display = 'block';
}


game = new Game();

startBtn.onclick = function() {
    startBtn.style.display = 'none';
    game.init();
}
pauseBtn.onclick = function() {
    game.start();
    pauseBtn.style.display = 'none';
}
snakeWrap.onclick = function() {
    game.pause();
    pauseBtn.style.display = 'block';
}