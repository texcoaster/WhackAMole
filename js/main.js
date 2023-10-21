var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var moleX = new Array(75, 75, 75, 175, 175, 175, 275, 275, 275, 375, 375, 375);
var moleY = new Array(100, 200, 300, 100, 200, 300, 100, 200, 300, 100, 200, 300);

var pos = {};
var rand = 0;
var mousePos = {};
var isMoleHit = false;
var acDelta = 0;
var msPerFrame = 50;
var isTimeOver = false;
var timeElapsed = 0;
var timeLimit = 60;
var intervalTime = 0;
var score = 0;
var times = 0;

var backImage = new Image();
backImage.src = "images/background.png";

var holeImage = new Image();
holeImage.src = "images/hole.png";

var moleImage = new Image();
moleImage.src = "images/mole.png";

var hammerImage = new Image();
hammerImage.src = "images/hammer.png";

var hitSound = new Audio("sounds/hit.mp3");

function getMousePos(event) {
  var mouseX = event.clientX - ctx.canvas.offsetLeft;
  var mouseY = event.clientY - ctx.canvas.offsetTop;

  return {
    x: mouseX,
    y: mouseY,
  };
}

$(document).mousemove(function (event) {
  mousePos = getMousePos(event);
});

var reset = function () {
  timeElapsed = 0;
  timeLimit = Math.floor(Math.random() * 60 + 90);
  intervalTime = 0;
  rand = Math.floor(Math.random() * 12);
  pos.x = moleX[rand];
  pos.y = moleY[rand];
};

var render = function () {
  ctx.drawImage(backImage, 0, 0);
  for (var i = 0; i <= moleX.length; i++) {
    ctx.drawImage(holeImage, moleX[i], moleY[i]);
  }

  if (isMoleHit || isTimeOver) {
    ctx.globalAlpha = 0;
  }
  ctx.drawImage(moleImage, moleX[rand], moleY[rand]);
  ctx.globalAlpha = 1;

  if (isMoleHit) {
    ctx.drawImage(hammerImage, 60, 0, 60, 60, mousePos.x - 30, mousePos.y - 30, 60, 60);
    if (acDelta > msPerFrame) {
      acDelta = 0;
      isMoleHit = false;
    } else {
      acDelta++;
    }
  } else {
    ctx.drawImage(hammerImage, 0, 0, 60, 60, mousePos.x - 30, mousePos.y - 30, 60, 60);
  }

  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "bold 24px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("SCORE: " + score, canvas.width / 2, 10);
  ctx.strokeText("SCORE: " + score, canvas.width / 2, 10);

  times++;
  ctx.fillStyle = "black";
  ctx.textAlign = "right";
  ctx.fillText("TIME: " + Math.round(times / 100), canvas.width - 10, 10);

  timeElapsed++;
  if (timeElapsed > timeLimit) {
    if (!isMoleHit) {
      isTimeOver = true;
      if (intervalTime > 50) {
        isTimeOver = false;
        reset();
      } else {
        intervalTime++;
      }
    }
  }
};

var isHit = function (x, y) {
  return x <= pos.x + 60 && x >= pos.x && y <= pos.y + 60 && y >= pos.y;
};

$(document).mousedown(function (event) {
  var mouseX = event.clientX - ctx.canvas.offsetLeft;
  var mouseY = event.clientY - ctx.canvas.offsetTop;

  if (isHit(mouseX, mouseY) && isMoleHit === false) {
    isMoleHit = true;
    reset();
    render();
    hitSound.play();
    ++score;
  }
});

$(".sound").click(function () {
  var $this = $(this);

  if ($this.hasClass("sound-on")) {
    $this.removeClass("sound-on").addClass("sound-off");
    $(".myAudio").trigger("pause");
  } else {
    $this.removeClass("sound-off").addClass("sound-on");
    $(".myAudio").trigger("play");
  }
});

$("#btnStart").click(function () {
  $("#SplashScreen").hide();
  $("#myCanvas").show();
  reset();
  main();
  $(".sound").css("display", "block");
  $(".myAudio").trigger("play");
});

var main = function () {
  render();
  requestAnimationFrame(main);
};

reset();
main();
