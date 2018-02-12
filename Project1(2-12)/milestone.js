window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
	canvasApp();
}

var size = 30;
var xIncrement = size * Math.sqrt(3) * 2;
var offX = -10 - 2 * size;
var offY = -10 - 2 * size;
var startX = 10;
var startY = 10;
var context;
var tilesCapacity = 24;
var tilesRemaining = 24;
var isHolding = 0;
var color1 = 0;//color 1 of top triHex
var color2 = 0;//color 2 of top triHex
var lastColor1 = 0; //color1 of holding hex
var lastColor2 = 0; //color2 of holding hex
var flipped = 1; // whether the tile is flipped or not
var theCanvas;
var rows = 15;
var columns = 18;
var volcano = 0; //volcano indicates rotation of current tri-hex
var stagger;
var validPos = 0;
var row;//row and col keep track of hovering tri-hex position on board before placement
var col;
var mouseX;
var mouseY;
var posX = 0;// the position of the hex the volcano is pointing towards
var posY = 0;
var coordinates;
var c = new Array(3);
//var overMap = 0;
var stationary = 0;

var tiles = [   
			[1,6,4,2,2],
			[5,1,2,2,1],
			[4,2,1,2,1],
			[2,2,1,1,1],
			[1,1,1,1,1]
			];

var JUNGLECOLOR  = 'rgba(0, 100, 0, 255)'; 
var GRASSCOLOR   = 'rgba(0, 225, 0, 255)'; 
var DESERTCOLOR  = 'rgba(255, 201, 102, 255)';
var QUARRYCOLOR  = 'rgba(123, 123, 139, 255)';
var LAGOONCOLOR  = 'rgba(0, 191, 255, 255)';
var VOLCANOCOLOR = 'rgba(255, 48, 48, 255)';
var EMPTYCOLOR =  'rgba(133,193,233,255)';   

var colors = [
    			JUNGLECOLOR,
    			GRASSCOLOR,
    			DESERTCOLOR,
    			QUARRYCOLOR,
    			LAGOONCOLOR,
    			VOLCANOCOLOR
    		  ];

var SubtileTypeEnum = {
  	JUNGLE: 0,
  	GRASS:  1,
  	DESERT: 2,
  	QUARRY: 3,
  	LAGOON: 4,
  	VOLCANO: 5,
};