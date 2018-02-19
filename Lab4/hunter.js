window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
	canvasApp();
}

var polySides = [];
var polyX = [];
var polyY = [];
var polySize = [];
var polyFill = [];
var velocityX = [];
var velocityY = [];
var curved = [];
var polygons = 0;
var score = 0;
var lives = 3;
var score = 0;
var radius = [];
var path = [];//1 straight //2 curve up //3 curve down //4 curve right //5 curve left //6 up left //7 down left //8 down right //9 up right
var audioElement;
var loadCount = 0;
var itemsToLoad = 0;
var blastSound = "blast.mp3";
var laserSound = "laser.mp3";
var lostLifeSound = "pain.mp3";
var gameOver = "gameover.mp3"
var sounds = new Array();
var gameON = 1;


window.addEventListener('load',eventWindowLoaded,false);

/*function eventWindowLoaded(){
	blastSound = document.createElement("audio");
	document.body.appendChild(blastSound);;
	audioElement.addEventListener("canplaythrough",itemLoaded,false);
	blastSound.setAttribute("src","blast.mp3");

	laserSound = document.createElement("audio");
	document.body.appendChild(laserSound);
	laserSound.addEventListener("canplaythrough",itemLoaded,false);
	laserSound.setAttribute("src","laser.mp3");

	lostLifeSound = document.createElement("audio");
	document.body.appendChild(lostLifeSound);
	lostLifeSound.addEventListener("canplaythrough",itemLoaded,false);
	lostLifeSound.setAttribute("src","pain.mp3");
}*/

function itemLoaded(event){
	loadCount++;
	if(loadCount >= itemsToLoad){
		laserSound.removeEventListener("canplaythrough",itemLoaded,false);
		blastSound.removeEventListener("canplaythrough",itemLoaded,false);
		lostLifeSound.removeEventListener("canplaythrough",itemLoaded,false);
	}
}

function resetApp()
{
	blastSound.volume = .5;
	laserSound.volume = .5;
	lostLifeSound.volume = .7;
}

function playSound(sound,volume)
{
	var tempSound = document.createElement("audio");
	tempSound.setAttribute("src",sound);
	tempSound.loop = false;
	tempSound.volume = volume;
	tempSound.play();
	//sounds.push(tempSound);
}

function audioLoaded() {
	canvasApp();
}

function initApp()
{
	loadCount = 0;
	itemsToLoad = 3;
}

function canvasApp(){

	var canvas = document.getElementById('canvas');

  	if (!canvas || !canvas.getContext) {
    	return;
  	}
  
  	var context = canvas.getContext('2d');
 	
	if (!context) {
   	 	return;
  	}

  	function canvasSupport () {
		return Modernizr.canvas;
	}

	/*function drawScreen()
  	{
  		context.fillStyle = "#000000";
		context.fillText ("Duration:" + audioElement.duration, 20 ,20);
		context.fillText ("Current time:" + audioElement.currentTime, 20 ,40);
		context.fillText ("Loop: " + audioElement.loop, 20 ,60);
		context.fillText ("Autoplay: " +audioElement.autoplay, 20 ,80);
		context.fillText ("Muted: " + audioElement.muted, 20 ,100);
		context.fillText ("Controls: " + audioElement.controls, 20 ,120);
		context.fillText ("Volume: " + audioElement.volume, 20 ,140);
		context.fillText ("Paused: " + audioElement.paused, 20 ,160);
		context.fillText ("Ended: " + audioElement.ended, 20 ,180);
		context.fillText ("Source: " + audioElement.currentSrc, 20 ,200);
		context.fillText ("Can Play OGG: " + audioElement.canPlayType("audio/ogg"),
		20 ,220);
		context.fillText ("Can Play WAV: " + audioElement.canPlayType("audio/wav"),
		20 ,240);
		context.fillText ("Can Play MP3: " + audioElement.canPlayType("audio/mp3"),
		20 ,260);
  	}*/
	/*
	function updateLoadingStatus() {
		var loadingStatus = document.getElementById("loadingStatus");
		var audioElement = document.getElementById("theAudio");
		var percentLoaded = parseInt(((audioElement.buffered.end(0) /
		audioElement.duration) * 100));
		document.getElementById("loadingStatus").innerHTML = 'loaded '
		+ percentLoaded + '%';
	}


  	var audioElement = document.getElementById("theAudio");
  	audioElement.play();
  	drawScreen();
	
  	*/

	var myVar1 = setInterval(main, 50);
	var myVar2 = setInterval(newPolygon, 1000 * ((50.0 -score)/50.0));
	var myVar3 = setInterval(updateVelocities,300);

	function distance(x1,y1,x2,y2)
	{
		return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
	}

	function checkClicked()
	{
		for(var i = 0; i < polygons;i++)
		{
			e = window.event;
			console.log("mouseX " + e.clientX + " mouseY " + e.clientY);
			console.log("polyX " + polyX[i] + " polyY " + polyY[i]);
			console.log(distance(polyX[i],polyY[i],e.clientX-50,e.clientY-50));			
			if(distance(polyX[i],polyY[i],e.clientX-50,e.clientY-50) < polySize[i])
			{
				score++;
				console.log("removed");
				deletePolygon(i);
				playSound(blastSound,.5);
				return;
			}
		}
		playSound(laserSound,.5);
	}

	function main()
	{
		canvas.onclick = checkClicked;
		context.clearRect(0,0,canvas.width,canvas.height);
		if(lives > 0)
		{
			context.rect(0,0,canvas.width,canvas.height);
			context.font =  "18px Arial";
			context.fillStyle = "black";
			context.fillText("Score: " + score,50,50);
			context.fillText("Lives: " + lives,50,100);
			context.stroke();
			drawPolygons();
		}
		else
		{
			if(gameON == 1)
			{
				gameON = 0;
				playSound(gameOver,.5);
			}
			context.font =  "18px Arial";
			context.fillStyle = "black";
			context.fillText("Game Over",canvas.width/2,canvas.height/2);
			context.font =  "18px Arial";
			context.fillStyle = "black";
			context.fillText("Score: " + score,50,50);
		}
	}

	function drawPolygons()
	{
		for(var i = 0; i < polygons; i++)
		{
			if(polyX[i] < - 50 || polyX[i] > (50 + canvas.width)|| polyY[i] < -50 || polyY[i] > (canvas.height))
			{
				deletePolygon(i);
				lives--;
				playSound(lostLifeSound,.5);
			}
		}
		for(var i = 0; i < polygons; i++)
		{
			polyX[i] += velocityX[i];
			polyY[i] += velocityY[i];
			drawPolygon(polySides[i],polyX[i],polyY[i],polySize[i],polyFill[i]);
		}
		console.log(polySides.length);
	}

	function updateVelocities()
	{
		for(var i = 0; i < polygons; i++)
		{
			if(path[i] == 2)
			{
				velocityY[i] += 1;
			}
			else if(path[i] == 3)
			{
				velocityY[i] -= 1;
			}
			else if(path[i] == 4)
			{
				velocityX[i] += 1;
			}
			else if(path[i] == 5)
			{
				velocityX[i] -= 1;
			}
			else if(path[i] == 6)
			{
				radius[i] += .2;
				velocityX[i] -= 2;
				velocityY[i] = Math.sqrt(Math.pow(radius[i],2)-Math.pow(velocityX[i],2));
				if(velocityX[i] < 0)
					path[i] = 7;
			}
			else if(path[i] == 7)
			{
				radius[i] += .2;
				velocityY[i] -= 2;
				velocityX[i] = -(Math.sqrt(Math.pow(radius[i],2)-Math.pow(velocityY[i],2)));
				if(velocityY[i] < 0)
					path[i] = 8;
			}
			else if(path[i] == 8)
			{
				radius[i] += .2;
				velocityX[i] += 2;
				velocityY[i] = -(Math.sqrt(Math.pow(radius[i],2)-Math.pow(velocityX[i],2)));
				if(velocityX[i] > 0)
					path[i] = 9;
			}
			else if(path[i] == 9)
			{
				radius[i] += .2;
				velocityY[i] += 2;
				velocityX[i] = (Math.sqrt(Math.pow(radius[i],2)-Math.pow(velocityY[i],2)));
				if(velocityY[i] > 0)
					path[i] = 6;
			}
		}
	}

	function deletePolygon(index)
	{
		polyFill.splice(index,1);
		polySides.splice(index,1);
		polyX.splice(index,1);
		polyY.splice(index,1);
		polySize.splice(index,1);
		velocityY.splice(index,1);
		velocityX.splice(index,1);
		path.splice(index,1);
		radius.splice(index,1);
		polygons--;
	}

	function newPolygon()
	{
		polyFill.push('#'+(Math.random()*0xFFFFFF<<0).toString(16));
		polySides.push(Math.floor(Math.random()* ((8 -3) + 1) + 3));
		result = Math.random();
		if(result < .35)
		{
			radius.push(0);
			var x = Math.floor(Math.random() * (canvas.width));
			polyX.push(x);
			velocityX.push(0);
			if(Math.random() < .5)
			{
				path.push(1);
			}
			else
			{
				if(x < canvas.width/2)
				{
					//curve right
					path.push(4);
				}
				else
				{
					//curve left
					path.push(5);
				}
			}
			if(Math.random() < .5)
			{
				polyY.push(0);
				velocityY.push(7);
			}
			else
			{
				polyY.push(canvas.height);
				velocityY.push(-7);
			}
		}
		else if(result < 0.7)
		{
			radius.push(0);
			var y = Math.floor(Math.random() * (canvas.height));
			polyY.push(y);
			velocityY.push(0);
			if(Math.random() < 0.5)
			{
				path.push(1);
			}
			else
			{
				if(y > canvas.height/2)
				{
					//curve down
					path.push(3);
				}
				else
				{
					//curve up
					path.push(2);
				}
			}
			if(Math.random() < .5)
			{
				polyX.push(0);
				velocityX.push(7);
			}
			else
			{
				polyX.push(canvas.width);
				velocityX.push(-7);
			}
		}
		else
		{
			radius.push(Math.sqrt(Math.pow(6,2)+Math.pow(6,2)));
			path.push(6);
			velocityX.push(6);
			velocityY.push(6);
			polyX.push(canvas.width/2);
			polyY.push(canvas.height/3);
		}
		polySize.push(Math.floor(Math.random() * (50 - 35 + 1) + 30));
		polygons++;
	}

	function drawPolygon(sides,x,y,size,fill){
			context.beginPath();
			context.strokeStyle = "white"; 
			context.lineWidth=2;
			context.lineCap = 'square';
			context.beginPath();
			context.moveTo(poly_cornerX(sides,x,y,size,0),poly_cornerY(sides,x,y,size,0));
			for (var i = 1; i <= sides - 1; i++) {
				context.lineTo(poly_cornerX(sides,x,y,size,i),poly_cornerY(sides,x,y,size,i));
			}
			context.closePath();
			context.stroke();
			context.fillStyle = fill;
			context.fill();	
	}

	function poly_cornerX(sides,x,y,size, i){
    	var angle_deg = 360/sides * i;
    	var angle_rad = Math.PI / 180 * angle_deg;
    	return x + size * Math.cos(angle_rad);
	}

	function poly_cornerY(sides,x,y,size, i){
    	var angle_deg = 360/sides * i;
    	var angle_rad = Math.PI / 180 * angle_deg;
    	return y + size * Math.sin(angle_rad);
	}

	/*function drawScreen()
	{
		//console.log(performance.now() / 1000);
		//console.log(performance.now() / 1000);
	}*/
}
