function CanvasNavigator(canvasContainer, imageParams) {
    'use strict';

    NAVIGATORCANVAS = this; //Set global variable

    //private properties

    var canvas = document.getElementById('nav-canvas'),
        ctx = canvas.getContext('2d'),
        screenWidth = canvasContainer.width,
        screenHeight = canvasContainer.height,
        currentDpi,
        canMan = new CanvasManager();

    //public properties

    this.canvasProp = {
        canvas: canvas,
        ctx: ctx,
        canMan: canMan,
        screenWidth: screenWidth,
        screenHeight: screenHeight
    };
    this.init = function () {
        init();
    };

    /**
    * Functionality: Synchronize zoom rectangle dimension with the 72 dpi image
    * @params: none
    * @return: none
    */
    this.refresh = function (dontUpdatePadding) {
        var widthRatio = thumbnailImageContainer.width / MAINCANVAS.seven2DpiInfo.width,
            heightRatio = thumbnailImageContainer.height / MAINCANVAS.seven2DpiInfo.height;

        zoomRectangle.x = thumbnailImageContainer.x + MAINCANVAS.seven2DpiInfo.showing.x * widthRatio;
        zoomRectangle.y = thumbnailImageContainer.y + MAINCANVAS.seven2DpiInfo.showing.y * heightRatio;
        zoomRectangle.width = MAINCANVAS.seven2DpiInfo.showing.width * widthRatio;
        zoomRectangle.height = MAINCANVAS.seven2DpiInfo.showing.height * heightRatio;

        //if(!dontUpdatePadding) {
        zoomRectangle.updateWithPadding();
        //}

        canMan.draw();
    };

    this.reset = function () {
        thumbnailImageContainer.rotateAngle = 0;
    }

    this.rotateLeft = function () {
        thumbnailImageContainer.rotateAngle -= 90;
        canMan.draw();
    }

    this.rotateRight = function () {
        thumbnailImageContainer.rotateAngle += 90;
        canMan.draw();
    };

    //Components
    var thumbnailImageContainer,
        zoomRectangle,
        panningSurface;

    canvas.width = screenWidth;
    canvas.height = screenHeight;


    /* Define all necessary component classes */
    ZoomRectangle.prototype = new TemplateObject();
    function ZoomRectangle() {
        this.draw = function (ctx) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(thumbnailImageContainer.rotateAngle * Math.PI / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            //Add 1 to y/x and subtract 2 from height/width so that we have a clear rectangle
            var x = this.x + 1,
                y = this.y + 1,
                width = this.width - 2,
                height = this.height - 2;
            var prevStroke = ctx.strokeStyle,
                prevLine = ctx.lineWidth;
            ctx.strokeStyle = '#0000FF';
            ctx.lineWidth = 1.4;

            ctx.strokeRect(x, y, width, height);
            ctx.strokeStyle = prevStroke;
            ctx.lineWidth = prevLine;
            ctx.restore();
        };

        this.setDimensions = function (x, y, width, height) {
            this.visible = true;
            this.x = x;
            this.y = y;

            //Width more than max then set to max
            this.width = width > this.width ? this.width : width;
            this.height = height > this.height ? this.height : height;
        };

        this.updateWithPadding = function () {

            //Measure padding with respect to current Dpi of main image
            var hamImageContainer = MAINCANVAS.components.hamImageContainer,
                widthRatio = thumbnailImageContainer.width / (MAINCANVAS.info.currentDpi * Constants.xDelta),
                heightRatio = thumbnailImageContainer.height / (MAINCANVAS.info.currentDpi * Constants.yDelta),
                left = hamImageContainer.x,
                top = hamImageContainer.y,
                leftPadding,
                rightPadding,
                topPadding,
                bottomPadding,
                rotateAngle = thumbnailImageContainer.rotateAngle;

            //When angle is 0, 180...
            if (rotateAngle / 90 % 2 === 0) {
                leftPadding = left * widthRatio;
                rightPadding = (MAINCANVAS.canvasProp.screenWidth -
                    (left + hamImageContainer.width)) * widthRatio;
                topPadding = top * heightRatio;
                bottomPadding = (MAINCANVAS.canvasProp.screenHeight -
                    (top + hamImageContainer.height)) * heightRatio;
            }

            //When angle is 90, 270...
            else {
                var heightWidthdiff = (MAINCANVAS.canvasProp.screenWidth - MAINCANVAS.canvasProp.screenHeight) / 2;
                left -= heightWidthdiff,
                    top += heightWidthdiff;

                leftPadding = left * widthRatio;
                rightPadding = (MAINCANVAS.canvasProp.screenHeight -
                    (left + hamImageContainer.width)) * widthRatio;
                topPadding = top * heightRatio;
                bottomPadding = (MAINCANVAS.canvasProp.screenWidth -
                    (top + hamImageContainer.height)) * heightRatio;
            }

            zoomRectangle.x -= leftPadding;
            zoomRectangle.width += (leftPadding + rightPadding);
            zoomRectangle.y -= topPadding;
            zoomRectangle.height += (topPadding + bottomPadding);
        }
    }

    ThumbnailImageContainer.prototype = new TemplateObject();
    function ThumbnailImageContainer(imageParams) {
        var thumbnailImage = new Image(),
            me = this;

        currentDpi = imageParams.dpi;

        UTILITY.loadImageWithoutMask(thumbnailImage, imageParams, function (loadedImage) {

            //Set dimension of zoomRectangle and thumbnailImageContainer as per the image
            zoomRectangle.x = me.x = NAVIGATORCANVAS.canvasProp.screenWidth / 2 - loadedImage.width / 2;
            zoomRectangle.y = me.y = NAVIGATORCANVAS.canvasProp.screenHeight / 2 - loadedImage.height / 2;
            zoomRectangle.width = me.width = loadedImage.width;
            zoomRectangle.height = me.height = loadedImage.height;
            zoomRectangle.updateWithPadding();

            NAVIGATORCANVAS.init();
        });

        this.rotateAngle = 0;
        this.draw = function (ctx) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(this.rotateAngle * Math.PI / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            ctx.drawImage(thumbnailImage, this.x, this.y, this.width, this.height);
            ctx.restore();
        };
    }

    PanningSurface.prototype = new TemplateObject();
    function PanningSurface() {

        //Private properties
        var surface = this;

        function rePositionRect(centerX, centerY) {
            var rotateAngle = thumbnailImageContainer.rotateAngle;
            UTILITY.stopAjaxRequest();

            if (rotateAngle < 0) {
                rotateAngle += 360;
            }

            //When angle is 0, 180...
            if (rotateAngle / 90 % 2 === 0) {
                if (rotateAngle / 90 % 4 === 0) {
                    zoomRectangle.x = centerX - zoomRectangle.width / 2;
                    zoomRectangle.y = centerY - zoomRectangle.height / 2;
                }
                else {
                    zoomRectangle.x = canvas.width - (centerX + zoomRectangle.width / 2);
                    zoomRectangle.y = canvas.height - (centerY + zoomRectangle.height / 2);
                }
            }
            else {
                var x1, y1;

                //Here algorithm is to find a point after rotation then calculate
                //x and y coordinate to draw rectangle

                //angle 90
                if (rotateAngle / 90 % 4 === 1) {
                    x1 = centerX + zoomRectangle.height / 2,
                        y1 = centerY - zoomRectangle.width / 2;
                }
                else {
                    x1 = centerX - zoomRectangle.height / 2,
                        y1 = centerY + zoomRectangle.width / 2;
                }
                var cx = x1 - canvas.width / 2,
                    cy = canvas.height / 2 - y1,
                    cosVal = Math.cos(rotateAngle * Math.PI / 180),
                    sinVal = Math.sin(rotateAngle * Math.PI / 180),
                    newX,
                    newY;

                newX = cx * cosVal - cy * sinVal;
                newY = cx * sinVal + cy * cosVal;
                zoomRectangle.x = canvas.width / 2 + newX;
                zoomRectangle.y = canvas.height / 2 - newY;
            }

            updateCanvasImage(MAINCANVAS);
        }

        function updateCanvasImage(canvas) {

            var x = zoomRectangle.x - thumbnailImageContainer.x,
                y = zoomRectangle.y - thumbnailImageContainer.y,
                seven2DpiInfo = canvas.seven2DpiInfo;
            seven2DpiInfo.showing.x = x / thumbnailImageContainer.width * seven2DpiInfo.width;
            seven2DpiInfo.showing.y = y / thumbnailImageContainer.height * seven2DpiInfo.height;
            seven2DpiInfo.showing.width = zoomRectangle.width / thumbnailImageContainer.width
                * seven2DpiInfo.width;
            seven2DpiInfo.showing.height = zoomRectangle.height / thumbnailImageContainer.height
                * seven2DpiInfo.height;

            canvas.panOnBlueRectDrag();
        }
        //Public properties
        this.x = 0;
        this.y = 0;
        this.draggable = true;
        this.width = NAVIGATORCANVAS.canvasProp.screenWidth;
        this.height = NAVIGATORCANVAS.canvasProp.screenHeight;
        this.draw = function () { };
        this.contacted = function (canX, canY) {
            rePositionRect(canX, canY);
        };
        this.dragging = function (canX, canY) {
            rePositionRect(canX, canY);
        };
        this.dropEvent = function () {
            this.x = 0;
            this.y = 0;

            var updateDensitometer;

            if (UTILITY.isDensitometerAcive()) {
                updateDensitometer = MAINCANVAS.updateDensitometer;
            }

            if (!MAINCANVAS.isShowingBaseDpiImage()) {
                MAINCANVAS.refresh(null, updateDensitometer);
            }
            else {
                updateDensitometer && updateDensitometer();
            }
            if (UTILITY.isCompareActivated() && !COMPARECANVAS.isShowingBaseDpiImage()) {
                COMPARECANVAS.refresh();
            }
        };
    }

    /* End of all classes */

    thumbnailImageContainer = new ThumbnailImageContainer(imageParams);
    canMan.addToStatics(thumbnailImageContainer);

    zoomRectangle = new ZoomRectangle();
    canMan.addToStatics(zoomRectangle);

    panningSurface = new PanningSurface();
    canMan.addToSprites(panningSurface);

    function init() {
        canMan.startListening(canvas, ctx);
        canMan.draw();
    }
}