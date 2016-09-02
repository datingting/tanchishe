com.snake = new Snake();
com.snake.create();
com.food = new Food();
com.food.create();

com.dong = setInterval(function(){
	com.snake.move();
},com.speed);

touch.on("body","swipeup",function(){
	if( com.snake.dir!="down"){
		 com.snake.dir="up";
	}   
})
touch.on("body","swipedown",function(){
	if( com.snake.dir!="up"){
		 com.snake.dir="down";
	} 
})
touch.on("body","swipeleft",function(){
	if( com.snake.dir!="right"){
  	  com.snake.dir="left";
  	 }
})
touch.on("body","swiperight",function(){
	if( com.snake.dir!="left"){
    	com.snake.dir="right";
    }
})
