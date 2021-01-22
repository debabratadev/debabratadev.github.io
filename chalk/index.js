$(document).ready(drawLine);
function chalkboard() {
    // canvas.remove();
    // $('.chalk').remove();
    // $('body').prepend('<canvas id="chalkboard"></canvas>');
    // $('body').prepend('<div class="chalk"></div>');

    var canvas = document.getElementById("chalkboard");
    // canvas.css('width', $(window).width());
    // canvas.css('height', $(window).height());
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    var ctx = canvas.getContext("2d");

    var width = canvas.width;
    var height = canvas.height;
    var mouseX = 0;
    var mouseY = 0;
    var mouseD = false;
    var xLast = 0;
    var yLast = 0;
    var brushDiameter = 7;

    // canvas.css('cursor', 'none');
    document.onselectstart = function () { return false; };
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = brushDiameter;
    ctx.lineCap = 'round';

    document.addEventListener('touchmove', function (evt) {
        var touch = evt.touches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
        if (mouseY < height && mouseX < width) {
            evt.preventDefault();
            // $('.chalk').css('left', mouseX + 'px');
            // $('.chalk').css('top', mouseY + 'px');
            //$('.chalk').css('display', 'none');
            if (mouseD) {
                draw(mouseX, mouseY);
            }
        }
    }, false);
    document.addEventListener('touchstart', function (evt) {
        //evt.preventDefault();
        var touch = evt.touches[0];
        mouseD = true;
        mouseX = touch.pageX;
        mouseY = touch.pageY;
        xLast = mouseX;
        yLast = mouseY;
        draw(mouseX + 1, mouseY + 1);
    }, false);
    document.addEventListener('touchend', function (evt) {
        mouseD = false;
    }, false);
    // canvas.css('cursor', 'none');
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = brushDiameter;
    ctx.lineCap = 'round';

    $(document).mousemove(function (evt) {
        mouseX = evt.pageX;
        mouseY = evt.pageY;
        if (mouseY < height && mouseX < width) {
            // $('.chalk').css('left', (mouseX - 0.5 * brushDiameter) + 'px');
            // $('.chalk').css('top', (mouseY - 0.5 * brushDiameter) + 'px');
            if (mouseD) {
                draw(mouseX, mouseY);
            }
        } else {
            // $('.chalk').css('top', height - 10);
        }
    });
    $(document).mousedown(function (evt) {
        mouseD = true;
        xLast = mouseX;
        yLast = mouseY;
        draw(mouseX + 1, mouseY + 1);
    });
    $(document).mouseup(function (evt) {
        mouseD = false;
    });

    function draw(x, y) {
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.4 + Math.random() * 0.2) + ')';
        ctx.beginPath();
        ctx.moveTo(xLast, yLast);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Chalk Effect
        var length = Math.round(Math.sqrt(Math.pow(x - xLast, 2) + Math.pow(y - yLast, 2)) / (5 / brushDiameter));
        var xUnit = (x - xLast) / length;
        var yUnit = (y - yLast) / length;
        for (var i = 0; i < length; i++) {
            var xCurrent = xLast + (i * xUnit);
            var yCurrent = yLast + (i * yUnit);
            var xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
            var yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
            ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
        }


        xLast = x;
        yLast = y;
    }

    $(window).resize(function () {
        chalkboard();
    });

}

var xLast, yLast, brushDiameter = 7;

function setLast(x, y) {
    xLast = x;
    yLast = y;
}

function moveToxy(ctx) {
    ctx.beginPath();
    ctx.moveTo(xLast, yLast);
}

function drawChalk(ctx, x, y) {
    var length = Math.round(Math.sqrt(Math.pow(x - xLast, 2) + Math.pow(y - yLast, 2)) / (5 / brushDiameter));
    var xUnit = (x - xLast) / length;
    var yUnit = (y - yLast) / length;
    for (var i = 0; i < length; i++) {
        var xCurrent = xLast + (i * xUnit);
        var yCurrent = yLast + (i * yUnit);
        var xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
        var yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
        ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
    }

    xLast = x;
    yLast = y;
}

function drawLine() {
    var canvas = document.getElementById("chalkboard");
    context = canvas.getContext("2d");

    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = canvas.width - margin.left - margin.right,
        height = canvas.height - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xLast, yLast, x, y;

    var line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        })
        .curve(d3.curveStep)
        .context(context);

    context.translate(margin.left, margin.top);

    d3.tsv("data.tsv", function (d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
        return d;
    }).then(function (data) {
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain(d3.extent(data, function (d) { return d.close; }));

        xAxis();
        yAxis();

        context.beginPath();

        context.fillStyle = 'rgba(255,255,255,0.5)';
        context.strokeStyle = 'rgba(255,255,255,0.5)';
        line(data);
        context.lineWidth = 7;
        // context.strokeStyle = "steelblue";

        context.stroke();
    });

    function xAxis() {
        var tickCount = 10,
            tickSize = 6,
            ticks = x.ticks(tickCount),
            tickFormat = x.tickFormat();

        context.beginPath();
        ticks.forEach(function (d) {
            context.moveTo(x(d), height);
            context.lineTo(x(d), height + tickSize);
        });
        context.strokeStyle = "black";
        context.stroke();

        context.textAlign = "center";
        context.textBaseline = "top";
        ticks.forEach(function (d) {
            context.fillText(tickFormat(d), x(d), height + tickSize);
        });
    }

    function yAxis() {
        var tickCount = 10,
            tickSize = 6,
            tickPadding = 3,
            ticks = y.ticks(tickCount),
            tickFormat = y.tickFormat(tickCount);

        context.beginPath();
        ticks.forEach(function (d) {
            context.moveTo(0, y(d));
            context.lineTo(-6, y(d));
        });
        context.strokeStyle = "black";
        context.stroke();

        context.beginPath();
        context.moveTo(-tickSize, 0);
        context.lineTo(0.5, 0);
        context.lineTo(0.5, height);
        context.lineTo(-tickSize, height);
        context.strokeStyle = "black";
        context.stroke();

        context.textAlign = "right";
        context.textBaseline = "middle";
        ticks.forEach(function (d) {
            context.fillText(tickFormat(d), -tickSize - tickPadding, y(d));
        });

        context.save();
        context.rotate(-Math.PI / 2);
        context.textAlign = "right";
        context.textBaseline = "top";
        context.font = "bold 10px sans-serif";
        context.fillText("Price (US$)", -10, 10);
        context.restore();
    }

}

