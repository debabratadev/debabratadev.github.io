/*
 *
 *Utility Classes
 *
 *1)Canvas Manager
 *A set of classes for hit tests, dragging functions,
 *and other user interface functionality
 *
 */

function CanvasManager() {

    //Use strict creating issues on firefox.
    //'use strict';

    //Private vars


    //public vars
    this.sprites = [];//A list of interactive/or movable objects
    this.statics = [];//A list of static objects. signage, etc.
    this.canvas;
    this.ctx;

    //public functions

    this.draw = function () {
        draw();
    }

    this.startListening = function (newCan, newCtx) {
        newCan && Ext.get(newCan).clearListeners();
        if (newCan != undefined)
            this.canvas = newCan;
        if (newCtx != undefined)
            this.ctx = newCtx;
        this.setCanvasPosition();
        initListeners(this.canvas);
    }

    this.setCanvasPosition = function () {
        var canvasXY = getPosition(this.canvas);
        canvasX = canvasXY.x;
        canvasY = canvasXY.y;
    }

    this.addToSprites = function (obj) {
        this.sprites.push(obj);
    }

    this.addToStatics = function (obj) {
        this.statics.push(obj);
    }

    //Stop propagation of contact event
    this.stopPropagation = function () {
        propagate = false;
    }

    //private vars
    var propagate = true,
        canvasX,
        canvasY,
        self = this,
        canX,
        canY,
        topSprite,
        event;

    //private functions

    function getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;

        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

    function contact() {
        propagate = true;
        for (var i = 0; i < self.sprites.length; i++) {
            var sprite = self.sprites[i];
            if (sprite.visible && !sprite.idle && propagate && hitTest(canX, canY, sprite)) {
                if (sprite.draggable) {
                    if (event != undefined)
                        event.preventDefault();
                    topSprite = sprite;
                    sprite.drag = true;
                    sprite.offsetX = canX - sprite.x;
                    sprite.offsetY = canY - sprite.y;
                }
                sprite.contacted(canX, canY);//Send in mouse loc to set offset for more realistic dragging
            }
        }
    }

    function move() {

        Ext.get(self.canvas).setStyle({ "cursor": "default" });//Control finger over

        for (var i = 0; i < self.sprites.length; i++) {
            var sprite = self.sprites[i];
            if (sprite.visible && !sprite.idle && sprite.finger && hitTest(canX, canY, sprite)) {
                !Ext.supports.TouchEvents && Ext.fly(self.canvas).setStyle({ "cursor": sprite.cursor });
                sprite.sliding();
            } else {
                sprite.mouseOut();
            }
        }

        if (topSprite != undefined && topSprite.drag) {
            if (topSprite.xLimits == undefined) {
                topSprite.x = canX - topSprite.offsetX;
            } else {
                var newX = canX - topSprite.offsetX;
                if (newX < topSprite.xLimits[0])
                    newX = topSprite.xLimits[0];
                else if (newX > topSprite.xLimits[1])
                    newX = topSprite.xLimits[1];
                topSprite.x = newX;
            }

            if (topSprite.yLimits == undefined) {
                topSprite.y = canY - topSprite.offsetY;
            } else {
                var newY = canY - topSprite.offsetY;
                if (newY < topSprite.yLimits[0])
                    newY = topSprite.yLimits[0];
                else if (newY > topSprite.yLimits[1])
                    newY = topSprite.yLimits[1];
                topSprite.y = newY;
            }

            if (topSprite.dragging != undefined)
                topSprite.dragging(canX, canY);
        }
        draw();
    }

    function doubleTap() {
        for (var i = 0; i < self.sprites.length; i++) {
            var sprite = self.sprites[i];
            if (sprite.visible && sprite.doubleTapEvent && hitTest(canX, canY, sprite)) {
                sprite.doubleTapEvent(canX, canY);//Send in mouse loc to set offset for more realistic dragging
            }
        }
    }

    function release() {
        if (topSprite != undefined && topSprite.dropEvent != undefined) {
            topSprite.dropEvent(canX, canY);
        }
        topSprite = undefined;
        for (var i = 0; i < self.sprites.length; i++) {
            var sprite = self.sprites[i];
            if (sprite.draggable) {
                sprite.drag = false;
                sprite.offsetX = 0;
                sprite.offsetY = 0;
                sprite.released();
            }
        }
        draw();
    }

    function getOffsetX(e, canvas) {
        var pageX = e.pageX;
        if (pageX === undefined) {
            pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        }
        var x = pageX - canvasX;
        return x;
    }

    function getOffsetY(e, canvas) {
        var pageY = e.pageY;
        if (pageY === undefined) {
            pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        var y = pageY - canvasY;
        return y;
    }

    function doTouch(e, canvas) {
        event = e;
        var touch = e.touches[0];
        var p = Ext.get(e.target);
        var x = touch.pageX - p.getX();
        var y = touch.pageY - p.getY();
        return [x, y];
    }

    function moveTouch(e, canvas) {
        if (topSprite != undefined)
            e.preventDefault();
        var touch = e.touches[0];
        var p = Ext.get(e.target);
        var x = touch.pageX - p.getX();
        var y = touch.pageY - p.getY();
        return [x, y];
    }

    function hitTest(x, y, obj) {

        if (obj.hitTest) {
            return obj.hitTest(x, y, self.ctx);
        }

        return (x > obj.x && x < obj.x + obj.width && y > obj.y && y < obj.y + obj.height);
    }

    function draw() {
        self.ctx.beginPath();

        //Increase width/height as we are rotating canvas
        var diff = Math.abs((self.canvas.width - self.canvas.height) / 2);
        self.ctx.clearRect(-diff, -diff, self.canvas.width + 2 * diff, self.canvas.height + 2 * diff);
        //Draw all statics.
        for (var i = 0; i < self.statics.length; i++) {
            var statics = self.statics[i];
            if (statics.visible) {
                if (statics.alpha !== undefined)
                    self.ctx.globalAlpha = statics.alpha;
                statics.draw(self.ctx);
                self.ctx.globalAlpha = 1;
            }
        }
        //Draw all sprites except for the topMost sprite.
        for (var i = 0; i < self.sprites.length; i++) {
            var sprite = self.sprites[i];
            if (sprite !== topSprite && sprite.visible) {
                if (sprite.alpha !== undefined)
                    self.ctx.globalAlpha = sprite.alpha;
                sprite.draw(self.ctx);
                self.ctx.globalAlpha = 1;
            }
        }
        //Draw the topmost sprite
        if (topSprite != undefined && topSprite.visible)
            topSprite.draw(self.ctx);
    }

    function initListeners(canvas) {

        if (!Ext.supports.touchEvents) {
            canvas.addEventListener("mousedown", function (e) {
                var x = getOffsetX(e, canvas);
                var y = getOffsetY(e, canvas);
                canX = x;
                canY = y;
                contact();
            });

            document.addEventListener("mousemove", function (e) {
                var x = getOffsetX(e, canvas);
                var y = getOffsetY(e, canvas);
                canX = x;
                canY = y;
                move();
            });

            document.addEventListener("mouseup", function (e) {
                var x = getOffsetX(e, canvas);
                var y = getOffsetY(e, canvas);
                canX = x;
                canY = y;
                release();
            });
        }
        else {
            //Listen for touch and mouse events.
            //Have them filter through the same functions.
            canvas.addEventListener('touchstart', function (e) {
                var coord = doTouch(e, canvas);
                var x = coord[0];
                var y = coord[1];
                canX = x;
                canY = y;
                contact();
            }, false);

            canvas.addEventListener('touchmove', function (e) {
                var coord = moveTouch(e, canvas);
                var x = coord[0];
                var y = coord[1];
                canX = x;
                canY = y;
                move();
            }, false);

            document.addEventListener('touchend', function (e) {
                e.preventDefault();
                release();
            }, false);
        }

        //For now add for main canvas only
        if (canvas.id == 'mainhamCanvas') {
            Ext.get(document).un("doubletap", Ext.doubleTrapCustomerHandler);

            Ext.doubleTrapCustomerHandler = function (e) {
                var x = getOffsetX(e, canvas);
                var y = getOffsetY(e, canvas);
                canX = x;
                canY = y;
                doubleTap();
            }

            Ext.get(document).on("doubletap", Ext.doubleTrapCustomerHandler);
        }
    }
}

//Typical Canvas Object
function TemplateObject(ctx) {
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.offsetX = 0;
    this.offsetY = 0;
    this.cursor = 'default';
    this.finger = false;
    this.draggable = false;
    this.drag = false;
    this.visible = true;
    this.idle = false;
    this.ctx = ctx;
    this.lineWidth = 1;
    this.finger = false;
    this.fill = "rgb(0, 255, 0)";
    this.stroke = "rgb(0, 255, 0)";

    var self = this;

    this.contacted = function () {
    }; //Mouse Down
    this.dragging = function () {
    }; //Mouse drag(mouse down + mouse move)
    this.dropEvent = function () {
    }; //Mouse up (for moving object only)
    this.released = function () {
    }; //Mouse up(for all object)
    this.sliding = function () {
    }; //Mouse move
    this.mouseOut = function () {
    }; //Mouse out

    this.draw = function (ctx) {
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}