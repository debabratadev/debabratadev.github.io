function createCurveTrackerGame(gameConfig) {
  var canvas,
    ctx,
    $header,
    $score,
    $distance,
    $timer,
    miliSecond = 100,
    intervalId,
    miliSecondIntervalId,
    components = [],
    score = 0,
    distance = 0,
    displayDistance = 0,
    totalDistance = 0,
    movePoint = {},
    controlPoints = {},
    lastEndPoint = {},
    curve,
    circle,
    curveSideFlag = true,
    windowWidth,
    startPosition = "bottom", //Track start position of the curve
    isTouch = "ontouchstart" in window || navigator.msMaxTouchPoints > 0,
    ratio = window.devicePixelRatio; // Pixel ratio of the screen

  //Generate random Control points.
  function makeRandomCurve(M, C) {
    var dx = C.x - M.x,
      dy = C.y - M.y,
      angle = Math.atan2(dy, dx),
      handleDistance =
        windowWidth < 400
          ? Math.random() * 30 + windowWidth / 4
          : Math.random() * 100 + 200, //Change distance based on screen size.
      sin = handleDistance * Math.sin(angle),
      cos = handleDistance * Math.cos(angle);

    curveSideFlag = curveSideFlag ? false : true;

    C.x1 = curveSideFlag ? M.x - 1.3 * sin : M.x + 1.3 * sin;
    C.y1 = curveSideFlag ? M.y - cos : M.y + cos;
    C.x2 = curveSideFlag ? C.x - sin : C.x + sin;
    C.y2 = curveSideFlag ? C.y - cos : C.y + cos;
  }

  function Curve() {
    this.points = [];
    this.length = 0;
    this.draw = function () {
      var prevLineWidth = ctx.lineWidth;
      ctx.lineWidth = gameConfig.curveWidth;
      ctx.beginPath();
      ctx.moveTo(movePoint.x, movePoint.y);
      ctx.bezierCurveTo(
        controlPoints.x1,
        controlPoints.y1,
        controlPoints.x2,
        controlPoints.y2,
        controlPoints.x,
        controlPoints.y
      );
      ctx.stroke();
      ctx.lineWidth = prevLineWidth;
    };
  }

  function TravelledPath() {
    this.draw = function () {
      var prevStroke = ctx.strokeStyle;
      var prevLineWidth = ctx.lineWidth;
      ctx.lineWidth = gameConfig.curveWidth;
      ctx.strokeStyle = gameConfig.travelledPathColor;
      ctx.beginPath();
      ctx.moveTo(movePoint.x, movePoint.y);

      //Draw curve points
      for (let index = 0; index < circle.lastCurveIndex; index++) {
        const element = curve.points[index];
        ctx.lineTo(element.x, element.y);
      }
      ctx.stroke();
      ctx.strokeStyle = prevStroke;
      ctx.lineWidth = prevLineWidth;
    };
  }

  function Circle() {
    this.x = 0;
    this.y = 0;
    this.lastCurveIndex = 0;

    this.draw = function () {
      var prevFill = ctx.fillStyle;
      var prevStroke = ctx.strokeStyle;
      ctx.beginPath();
      ctx.fillStyle = gameConfig.circleFillColor;
      ctx.strokeStyle = gameConfig.circleBorderColor;
      ctx.arc(this.x, this.y, gameConfig.circleRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = prevFill;
      ctx.strokeStyle = prevStroke;
    };

    //Check if Mouse hit the target
    this.hitTest = function (mouse) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, gameConfig.circleRadius, 0, 2 * Math.PI);
      if (ctx.isPointInPath(mouse.x * ratio, mouse.y * ratio)) {
        ctx.closePath();
        return true;
      } else {
        return false;
      }
    };
    this.contact = function (mouse) {
      this.startX = mouse.x;
      this.startY = mouse.y;
    };

    this.move = function (mouse) {
      //This moves the circle
      this.x += mouse.x - this.startX;
      this.y += mouse.y - this.startY;
      this.startX = mouse.x;
      this.startY = mouse.y;

      var inside = false,
          curveLength = parseInt(curve.length);

      //Loop through all points and check any point lies in the circle
      for (var index = curve.points.length - 1; index >= 0; index--) {
        const element = curve.points[index];
        ctx.beginPath();
        ctx.arc(this.x, this.y, gameConfig.circleRadius, 0, 2 * Math.PI);

        //If any curve point is inside the circle then capture length and continue game.
        if (ctx.isPointInPath(element.x * ratio, element.y * ratio)) {
          inside = true;
          this.lastCurveIndex = index;

          //Current game distance.
          displayDistance = parseInt(element.l);
          distance = element.l;

          //So total distance.
          $distance.html("Distance: " + (totalDistance + displayDistance) + "px");

          //If it is the last point then game is complete and start another game.
          if (index == curve.points.length - 2 || distance >= curveLength) {
            console.log(index, curve.points.length, distance, curve.length);
            curveTrackerGame.restartGame();
            break;
          }
          break;
        }
      }
      console.log(inside);
      console.log(index, curve.points.length, distance, curve.length);
      if (!inside) {
        //If it is the last point then game is complete and start another game.
        if (index == curve.points.length - 2 || distance >= curveLength) {
          console.log(index, curve.points.length, distance, curve.length);
          curveTrackerGame.restartGame();
        } else {
          totalDistance += displayDistance;
          curveTrackerGame.completeGame();
        }
      }
    };
  }

  //https://gamedev.stackexchange.com/questions/5373/moving-ships-between-two-planets-along-a-bezier-missing-some-equations-for-acce/5427#5427
  function Bezier(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;

    //Returns x and y coordinates of the curve.
    //https://gist.github.com/BonsaiDen/670236
    this.x = function (t) {
      return (
        (1 - t) * (1 - t) * (1 - t) * this.a.x +
        3 * ((1 - t) * (1 - t)) * t * this.b.x +
        3 * (1 - t) * (t * t) * this.c.x +
        t * t * t * this.d.x
      );
    };
    this.y = function (t) {
      return (
        (1 - t) * (1 - t) * (1 - t) * this.a.y +
        3 * ((1 - t) * (1 - t)) * t * this.b.y +
        3 * (1 - t) * (t * t) * this.c.y +
        t * t * t * this.d.y
      );
    };

    this.len = gameConfig.curveLength;
    this.arcPoints = [];

    var ox = this.x(0),
      oy = this.y(0),
      clen = 0;
    this.arcPoints.push({ x: ox, y: oy, l: clen });

    //Find all points in the curve
    for (var i = 1; i <= this.len; i += 1) {
      var x = this.x(i * 0.01),
        y = this.y(i * 0.01);

      //Calculate distance
      var dx = ox - x,
        dy = oy - y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      clen += dist;
      this.arcPoints.push({ x: x, y: y, l: clen });
      (ox = x), (oy = y);

      //Break when reached last point(after next point)
      if (x == d.x && y == d.y) {
        this.len = i + 1;
      }
    }

    return this.arcPoints;
  }

  var curveTrackerGame = {
    setupHtml: function () {
      var $gameContainer = $("<div>")
        .css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "100vh",
        })
        .appendTo(document.body);

      $header = $("<div>")
        .css({
          paddingBottom: "10px",
        })
        .appendTo($gameContainer);

      $score = $("<div>")
        .css({
          float: "left",
        })
        .html("Score: 0")
        .appendTo($header);

      $timerContainer = $("<div>")
        .css({
          textAlign: "right",
          float: "right",
        })
        .html("Time left: ")
        .appendTo($header);

      $timer = $("<div>")
        .css({
          float: "right",
          width: "40px",
        })
        .appendTo($timerContainer);

      var $canvas = $("<canvas>")
        .css({
          height: "100%",
          width: "100%",
          border: "2px solid #ddd",
        })
        .appendTo($gameContainer);
      $distance = $("<div>")
        .css({
          textAlign: "left",
          paddingTop: "10px",
        })
        .html("Distance: 0px")
        .appendTo($gameContainer);

      canvas = $canvas[0];
      ctx = canvas.getContext("2d");

      function updateCanvasWidth() {
        windowWidth = $(window).width();
        if (windowWidth <= 428) {
          $gameContainer.css({ padding: "0 4px" });
          var canvasWidth = windowWidth - 8;
          canvas.width = canvasWidth * ratio;
          canvas.height = canvasWidth * ratio;
          $canvas.css({
            height: canvasWidth + "px",
            width: canvasWidth + "px",
          });
          $header.css({
            width: canvasWidth + "px",
          });
          $distance.css({
            width: canvasWidth + "px",
          });
        } else {
          $gameContainer.css({ padding: 0 });
          canvas.width = 420 * ratio;
          canvas.height = 420 * ratio;
          $canvas.css({ height: "420px", width: "420px" });
          $header.css({
            width: "420px",
          });
          $distance.css({
            width: "420px",
          });
        }
        ctx.scale(ratio, ratio);
      }

      $(window).on("resize", function () {
        updateCanvasWidth();
      });

      updateCanvasWidth();
    },
    bindEvents: function () {
      var offsetLeft = 0,
        offsetTop = 0,
        canvasClone = canvas,
        mouse = {},
        drag = false,
        firstHit = true;

      function updateOffset() {
        //Find the canvas left and top offeset
        do {
          offsetLeft += canvasClone.offsetLeft;
          offsetTop += canvasClone.offsetTop;
        } while ((canvasClone = canvasClone.offsetParent));
        offsetLeft += 2;
        offsetTop -= 4;
      }

      updateOffset();

      //Get relative mouse position of Canvas
      function updateMouseXY(e) {
        mouse.x = e.pageX - offsetLeft;
        mouse.y = e.pageY - offsetTop;
      }

      function onMouseMove() {
        if (circle.hitTest(mouse)) {
          canvas.style.cursor = "pointer";
        } else {
          canvas.style.cursor = "default";
        }

        if (drag) {
          circle.move(mouse);
        }
      }

      function onMouseDown() {
        if (firstHit) {
          curveTrackerGame.initTimers();
          firstHit = false;
        }
        if (circle.hitTest(mouse)) {
          circle.contact(mouse);
          drag = true;
        }
      }

      function onMouseUp() {
        //Game can be continued on Mouse enabled devices
        if (isTouch) {
          drag = false;
        }
      }

      //For Mouse enabled device
      $(canvas).on("mousedown", function (e) {
        updateMouseXY(e);
        onMouseDown();
      });

      $(canvas).on("mousemove", function (e) {
        updateMouseXY(e);
        onMouseMove();
      });

      $(document).on("mouseup", function (e) {
        onMouseUp();
      });

      //For Mobile.
      $(canvas).on("touchstart", function (e) {
        e.originalEvent.preventDefault();
        updateMouseXY(e.originalEvent.touches[0]);
        onMouseDown();
      });

      $(canvas).on("touchmove", function (e) {
        e.originalEvent.preventDefault();
        updateMouseXY(e.originalEvent.touches[0]);
        onMouseMove();
      });

      $(canvas).on("touchend", function (e) {
        e.originalEvent.preventDefault();
        onMouseUp();
      });

      //On screen width change
      $(window).on("resize", function () {
        canvasClone = canvas;
        offsetLeft = 0;
        offsetTop = 0;
        updateOffset();
      });
    },
    removeEventListeners: function () {
      $(canvas).off("mousedown");
      $(canvas).off("mousemove");
      $(canvas).off("touchstart");
      $(canvas).off("touchmove");
      $(canvas).off("touchend");
      $(window).off("resize");
      $(document).off("mouseup");
    },
    completeGame: function () {
      clearInterval(intervalId);
      clearInterval(miliSecondIntervalId);
      $timer.html("0:00");
      gameover(--score, totalDistance, gameConfig.timer);
      curveTrackerGame.removeEventListeners();
    },
    initTimers: function () {
      intervalId = setInterval(() => {
        if (gameConfig.timer == 0) {
          curveTrackerGame.completeGame();
          return;
        }
        gameConfig.timer--;
        $timer.html(gameConfig.timer + ":" + miliSecond);
      }, 1000);

      miliSecondIntervalId = setInterval(() => {
        //Reset timer when it reaches 0.
        if (miliSecond == 0) {
          miliSecond = 100;
          return;
        }
        miliSecond--;
        $timer.html(gameConfig.timer + ":" + miliSecond);
      }, 10);
    },
    restartGame: function () {
      console.log('Create a New Game');
      totalDistance += displayDistance;
      displayDistance = 0;
      distance = 0;
      components = [];
      if (startPosition == "bottom") {
        startPosition = "top";
      } else {
        startPosition = "bottom";
      }
      circle.lastCurveIndex = 0;
      curveTrackerGame.createGame(true);
    },
    createGame: function (restart) {
      let endX, endY, startY, startX;

      //For smaller screen.
      if (window.innerWidth < 400) {
        gameConfig.curveLength = window.innerWidth - gameConfig.circleRadius - 30; //Change curve length for small screen

        //Restart from last point.
        if (restart) {
          startY = lastEndPoint.y;
          startX = lastEndPoint.x;
          endX = window.innerWidth / 2;

          if (startPosition === "bottom") {
            endY = Math.round(Math.random() * 20) + 20;
          } else {
            endY = Math.round(Math.random() * 50) + (window.innerWidth - 80);
          }
        } else {
          endX = window.innerWidth / 2; //Set x to the center to avoid curve going off the screen
          endY = Math.round(Math.random() * 20) + 20;
          startY = Math.round(Math.random() * 50) + (window.innerWidth - 80);
          startX = window.innerWidth / 2;
        }
      }
      //For Larger screen
      else {
        gameConfig.curveLength = 450;

        //Restart from last point.
        if (restart) {
          startY = lastEndPoint.y;
          startX = lastEndPoint.x;

          if (startPosition === "bottom") {
            endX = curveTrackerGame.generateRandomX();
            endY = Math.round(Math.random() * 20) + 20;
          } else {
            endX = curveTrackerGame.generateRandomX();
            endY = Math.round(Math.random() * 30) + 340;
          }
        } else {
          endX = curveTrackerGame.generateRandomX();
          endY = Math.round(Math.random() * 20) + 20;
          startY = Math.round(Math.random() * 30) + 340;
          startX = curveTrackerGame.generateRandomX();
        }
      }

      movePoint = { x: startX, y: startY };
      controlPoints = { x: endX, y: endY };

      //Find fixed length curve
      makeRandomCurve(movePoint, controlPoints);

      curve = new Curve();
      components.push(curve);

      //Create curve
      curve.points = Bezier(
        movePoint,
        { x: controlPoints.x1, y: controlPoints.y1 },
        { x: controlPoints.x2, y: controlPoints.y2 },
        { x: controlPoints.x, y: controlPoints.y }
      );
      curve.length = curve.points[curve.points.length - 1].l;

      //Generate travelled path
      var travelledPath = new TravelledPath();
      components.push(travelledPath);

      //Create circle on init.
      if (!restart) {
        circle = new Circle();
        circle.x = startX;
        circle.y = startY;
      }

      components.push(circle);

      //If validated then save last end point.
      if (curveTrackerGame.validateGame(restart)) {
        lastEndPoint.x = controlPoints.x;
        lastEndPoint.y = controlPoints.y;
        $score.html("Score: " + score++);
      }
    },
    generateRandomX: function () {
      return Math.round(Math.random() * 270) + 80;
    },
    validateGame: function (restart) {
      var canvasWidth = parseInt(canvas.style.width) - gameConfig.circleRadius;

      //Validate if curve points lie off canvas area
      for (let index = 0; index < curve.points.length; index++) {
        const point = curve.points[index];
        if (
          point.x < gameConfig.circleRadius ||
          point.x > canvasWidth ||
          point.y < gameConfig.circleRadius ||
          point.y > canvasWidth
        ) {
          components = [];
          curveTrackerGame.createGame(restart);
          return false;
        }
      }
      return true;
    },
    init: function () {
      curveTrackerGame.setupHtml();
      curveTrackerGame.bindEvents();
      curveTrackerGame.createGame(false);
      $timer.html(gameConfig.timer + ":00");
      --gameConfig.timer;
    },
  };

  curveTrackerGame.init();
  (function drawFrame() {
    window.requestAnimationFrame(drawFrame, canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear canvas

    //Components
    components.forEach(function (component) {
      component.draw();
    });
  })();
}

$(function () {
  var gameConfigObj = {
    circleRadius: 30,
    curveLength: 450,
    curveWidth: 3,
    timer: 60,
    circleBorderColor: "black",
    circleFillColor: "#A8D097",
    travelledPathColor: "#933766",
  };
  createCurveTrackerGame(gameConfigObj);
});

function gameover(score, distance, timer) {
  setTimeout(() => {
    alert(score + ", " + distance + ", " + timer);
  }, 100);
}
