function setSizePosition(el) {
  let isLandscape = window.innerWidth > window.innerHeight;

  let width;
  let height;

  if (isLandscape) {
    height = window.innerHeight;
    width = window.innerHeight * 1.2;
    el.style.height = height + "px";
    el.style.width = width + "px";
  } else {
    width = window.innerWidth;
    height = window.innerWidth * 0.8;
    el.style.width = width + "px";
    el.style.height = height + "px";
  }

  el.style.position = "absolute";
  el.style.top = (window.innerHeight - height) / 2 + "px";
  el.style.left = (window.innerWidth - width) / 2 + "px";
}

var splashScreen = document.getElementById("SplashScreen");
setSizePosition(splashScreen);

var canvas = document.getElementById("myCanvas");
setSizePosition(canvas);

var ctx = canvas.getContext("2d");

var holeX = new Array(75, 75, 75, 175, 175, 175, 275, 275, 275, 375, 375, 375);
var holeY = new Array(100, 200, 300, 100, 200, 300, 100, 200, 300, 100, 200, 300);

var moles = new Array();
var mousePos = {};
var isMoleHit = false;
var addingMoleTimeElapsed = 0;
var addingMoleTimeLimit = 60;
var hiddingHammerTimeElapsed = 0;
var hiddingHammerTimeLimit = 50;
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

var addMole = function () {
  addingMoleTimeElapsed = 0;
  addingMoleTimeLimit = Math.floor(Math.random() * 120);

  do {
    rand = Math.floor(Math.random() * 12);
    isExists = existsMole(rand);
  } while (isExists);

  moles.push({
    x: holeX[rand],
    y: holeY[rand],
    dismissTime: Math.floor(Math.random() * 120 + 120),
  });
};

var deleteMole = function (moleIndex) {
  moles.splice(moleIndex, 1);
};

var existsMole = function (rand) {
  for (var i = 0; i < moles.length; i++) {
    if (moles[i].x == holeX[rand] && moles[i].y == holeY[rand]) {
      return true;
    }
  }
  return false;
};

var render = function () {
  ctx.drawImage(backImage, 0, 0, canvas.width, canvas.height);

  for (var i = 0; i <= holeX.length; i++) {
    ctx.drawImage(holeImage, holeX[i], holeY[i]);
  }

  for (var i = 0; i < moles.length; i++) {
    ctx.drawImage(moleImage, moles[i].x, moles[i].y);
  }

  if (isMoleHit) {
    ctx.drawImage(hammerImage, 60, 0, 60, 60, mousePos.x - 30, mousePos.y - 30, 60, 60);
    if (hiddingHammerTimeElapsed > hiddingHammerTimeLimit) {
      hiddingHammerTimeElapsed = 0;
      isMoleHit = false;
    } else {
      hiddingHammerTimeElapsed++;
    }
  } else {
    ctx.drawImage(hammerImage, 0, 0, 60, 60, mousePos.x - 30, mousePos.y - 30, 60, 60);
  }

  for (var i = 0; i < moles.length; i++) {
    moles[i].dismissTime--;
    if (moles[i].dismissTime <= 0) {
      deleteMole(i);
    }
  }

  addingMoleTimeElapsed++;
  if (addingMoleTimeElapsed > addingMoleTimeLimit) {
    addMole();
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
};

var isHit = function (x, y, mole) {
  return x <= mole.x + 60 && x >= mole.x && y <= mole.y + 60 && y >= mole.y;
};

$(document).mousedown(function (event) {
  var mouseX = event.clientX - ctx.canvas.offsetLeft;
  var mouseY = event.clientY - ctx.canvas.offsetTop;

  for (var i = 0; i < moles.length; i++) {
    if (isHit(mouseX, mouseY, moles[i])) {
      deleteMole(i);
      isMoleHit = true;
      hitSound.play();
      ++score;
      render();
    }
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
  main();
  $(".sound").css("display", "block");
  $(".myAudio").trigger("play");
});

var main = function () {
  render();
  requestAnimationFrame(main);
};

main();
