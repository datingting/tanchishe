//获取屏幕的宽度，也就是游戏场景的尺寸
var cw = $(window).width();
//创建公共的模块，要保存一些公共的东西，以及对自模块之间的连接控制
var com = {
	//子模块中创建子元素的大小
	size:cw/20,
	//把场景分成多少格
	sizeNum:20,
	//保存游戏场景的节点
	gambox:$(".gambox"),
	//存放蛇
	snake:null,
	//存放食物
	food:null,
	//控制游戏的速度
	speed:250,
	//控制游戏中蛇走等功能的时间函数
	dong:null,
	//保存弹出框的节点
	alert:$(".alertbox"),	
}
//蛇的对象
function Snake(){
	//蛇的自由属性
	//蛇头
	this.head = null;
	//蛇头的默认位置 初始为0，0
	this.pos = {
		x:0,
		y:0
	};
	//蛇走的方向  默认为右
	this.dir = "right";
	//存放设身体的数组
	this.tails = [];
	//分数
	 this.count=0;
    //显示分数的盒子
    this.countSpan=$(".count span");
    //显示弹出框身体的盒子
    this.alertB = $(".alert b");
}
//把蛇的方法写到他的原型上
Snake.prototype={
	//创建蛇头的方法
	create:function(){
		//创建蛇头添加到游戏场景中
		this.head=$("<span class='shead'>").css({
			width:com.size,
			height:com.size,
			left:this.pos.x,
			top:this.pos.y
		}).appendTo(com.gambox);
	},
	//创建蛇移动的方法
	move:function(){
        //获取上一次蛇头的位置，为了让肉别覆盖头
		var pos = {	x:this.pos.x,y:this.pos.y};
		//根据他的dir属性而调整方向
		switch (this.dir){
			case "right":
				this.pos.x += com.size;
				this.head.css({
					background:"url('img/tou.jpg') no-repeat center",
					backgroundSize:"cover"
				})
				break;
			case "left":
				this.pos.x -= com.size;
				this.head.css({
					background:"url('img/1_05.jpg') no-repeat center",
					backgroundSize:"cover"
				})
				break;
			case "up":
				this.pos.y -= com.size;
				this.head.css({
					background:"url('img/1_05_01.jpg') no-repeat center",
					backgroundSize:"cover"
				})
				break;
			case "down":
				this.pos.y += com.size;
				this.head.css({
					background:"url('img/down.jpg') no-repeat center",
					backgroundSize:"cover"
				})
				break;
		};
		//加一个开关，让蛇撞墙后不要出去
		if(this.ifelse()){
			return;
		}
		//让蛇头走一下
        this.head.css({
            left:this.pos.x,
            top:this.pos.y
        })
     	// console.log(com.speed);
     	//让蛇身上的每一块肉都动起来
        this.meatMove(pos);
	},
	//判断
	ifelse:function(){
		//判断不要出边界
		var bian = (com.sizeNum-1)*com.size;
		//判断蛇有没有出边界
		//如果出边界 停止计时器  游戏结束
		if(this.pos.x<0||this.pos.x>bian||this.pos.y<0||this.pos.y>bian){
			clearInterval(com.dong);
			this.over();
			return true;
		}
		  //判断蛇有没有吃自己
		  //判断有没有身体
        if(this.tails.length){
            for(var i=0;i<this.tails.length;i++){
            	//console.log(this.tails.length)
                var x,y;
                x=parseInt(this.tails[i].css("left"));
                y=parseInt(this.tails[i].css("top"));
                if(parseInt(this.pos.x)==x&&parseInt(this.pos.y)==y){
                    clearInterval(com.dong);
                    this.over();
                    return true;
                }
            }
        }
        //判断蛇有没有吃到肉 
		if(this.pos.x == com.food.pos.x&&this.pos.y == com.food.pos.y){
			this.eat();
		}
		
	},
	//游戏结束的方法
	over:function(){
		//显示弹出框
		com.alert.show();
		var that = this;
		//弹出框上显示最后的得分
		this.alertB.html("得分："+this.count)
		//点击弹出框上的按钮		
		$(".alert button").click(function(){
			/*window.location.reload();*///重新刷新  下面的方法不刷新重新开始
			//弹出框隐藏
			com.alert.hide();
			//初始化游戏
			com.speed = 250;
			that.count = 0;
			that.countSpan.html(0);
			that.alertB.html("得分：0");
			clearInterval(com.dong);
			com.gambox.find(".sbody").remove();
			com.gambox.find(".shead").remove();
			com.gambox.find(".food").remove();
			//重新创建蛇和食物
			com.snake = new Snake();
			com.snake.create();
			com.food = new Food();
			com.food.create();
			com.dong = setInterval(function(){
				com.snake.move();
			},com.speed);
		})
		clearInterval(com.dong);
	},
	//吃到肉的方法
	eat:function(){
		//食物的位置改变
		com.food.changePosition();
		//讲肉加到身体后面
		this.addAss();
		//每次吃肉加两分
		this.count+=2;
		//显示分数
		if(this.count < 10){
			this.countSpan.html("0"+this.count);
		}else{
			this.countSpan.html(this.count);
		}
		 //判断吃到一定的分数就加快速度
		if(this.count % 5 == 0){
			com.speed -= 50;
			 //让速度保持在一个最低的值
			if(com.speed <= 50){
				com.speed = 50;
			}
		}
		//重置操作
		clearInterval(com.dong);
		com.dong = null;
		com.dong = setInterval(function(){
			com.snake.move();
		},com.speed);

		
	},
	//长肉的时候
	addAss:function(){
		//创建一块蛇肉
		var tail = $("<span class='sbody'>").css({
			width:com.size,
			height:com.size,
			left:this.pos.x,
			top:this.pos.y
		}).appendTo(com.gambox);
		 //把它放到肉的数组里
		this.tails.push(tail);
	},
	//肉跟着动
	meatMove:function(pos){
		//如果有肉的话，把最后一块肉放到最前面
		if(this.tails.length){
			this.tails[this.tails.length-1].css({
				left:pos.x,
				top:pos.y
			})
			//更新数组
			this.tails.unshift(this.tails.pop());
		}
	}
};
//肉模块
function Food(){
	//肉
	this.el;
	//自有属性
    //肉的坐标
    this.pos={x:0,y:0};
}
Food.prototype={
	//创建肉的节点
    create:function(){
        this.createPosition();
        this.el=$("<span class='food'>").css({
            width:com.size,
            height:com.size,
            left:this.pos.x,
            top:this.pos.y
        }).appendTo(com.gambox);
    },
     //为肉生成随机坐标的方法
    createPosition:function(){
        var x,y;
        x=Math.floor(Math.random()*com.sizeNum)*com.size;
        y=Math.floor(Math.random()*com.sizeNum)*com.size;
        this.pos.x=x;
        this.pos.y=y;
    },
    //让肉出现在随机的位置
    changePosition:function(){
        this.createPosition();
        this.el.css({
            left:this.pos.x,
            top:this.pos.y,
        })
    }
}

