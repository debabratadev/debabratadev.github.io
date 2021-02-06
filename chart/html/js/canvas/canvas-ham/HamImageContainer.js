/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function HamImageContainer(currentCanvas, info, components) {
    'use strict';

    //Private vars
    var tempImage,
        fitHamImage = new Image(),
        zoomedHamImage = new Image(),
        me = this;

    var canvas = currentCanvas.canvasProp.canvas;

    //Public vars

    this.rotateAngle = 0;

    //Enable and disable the densitomer functionality
    this.showDensity = false;

    this.finger = true;
    this.toggle = {
        show: false
    };

    //Padding from canvas container
    this.padding = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };

    this.zooming = {
        fit: {
            x: undefined,
            y: undefined,
            width: undefined,
            height: undefined,
            screen: {
                x: undefined,
                y: undefined,
                width: undefined,
                height: undefined
            }
        },
        zoom: {
            show: false,
            x: undefined,
            y: undefined,
            width: undefined,
            height: undefined
        }
    };

    this.setFitImage = function (image) {
        fitHamImage = image;
    }

    this.resetImage = function () {
        this.imageLoaded = false;
        fitHamImage = new Image();
        zoomedHamImage = new Image();
        currentCanvas.canvasProp.canMan.draw();
    }

    this.resetZoomImage = function () {
        zoomedHamImage = new Image();
    }

    //Set dimension of image container
    this.setDimension = function (mode) {
        var image = mode === 'fit' ? fitHamImage : zoomedHamImage; //keep fitImage Intact so that we can reuse

        //If initially set by compare functionality then don't set again
        if (mode === 'fit') {
            me.padding.left = me.x = currentCanvas.canvasProp.screenWidth / 2 - image.width / 2;
            me.padding.top = me.y = currentCanvas.canvasProp.screenHeight / 2 - image.height / 2;
            me.width = image.width;
            me.height = image.height;
        }
        else {
            me.x = me.padding.left;
            me.y = me.padding.top;
            me.width = image.width;
            me.height = image.height;
        }
    };

    this.setToggleImages = function (images) {
        this.toggle.fitImage = images[0];
        this.toggle.zoomImage = images[1];
    }

    this.getToggleImages = function () {
        return [fitHamImage, zoomedHamImage];
    }

    //Set Image on the fly
    this.setImage = function (imageParams, mode, success, extraObj) {
        var image; //keep fitImage Intact so that we can reuse

        if (mode === 'fit' || mode === 'separation') {
            image = fitHamImage;
        }
        else {

            //For zoom use temp image object and then assign to zoomedHamImage variable
            //Because sometimes we need to show zoom image while requesting for a new image
            if (tempImage) {
                tempImage.onload = undefined;
            }

            tempImage = new Image();
            image = tempImage;
        }

        var successFn = function (loadedImage) {
            if (mode !== 'separation') {
                if (mode !== 'fit') {
                    zoomedHamImage = tempImage;
                }
                if (!me.imageLoaded) {
                    me.setDimension(mode);
                    me.imageLoaded = true;
                }

                if (info.baseImageLoad) {
                    info.baseImageParams = imageParams;
                    currentCanvas.get72DpiImageDimension(loadedImage);
                }
                else {
                    info.lastImageParams = imageParams;
                }
                info.baseImageLoad = false;

                currentCanvas.init();
            }
            if (success) {
                success(currentCanvas, extraObj);
            }

            //Wake up compare canvas
            if (currentCanvas.canvasId == 'comparehamCanvas' && currentCanvas.idle) {
                currentCanvas.setIdle(false);
            }
        };

        var failureFn;

        //Sometimes compare version has less number of pages than current version
        //This is to prevent unnecessary error message from showing up
        if (currentCanvas.canvasId == 'comparehamCanvas') {
            failureFn = function () {
                currentCanvas.setIdle(true);
            };
        }

        UTILITY.loadImageWithMask(image, imageParams, 'Loading Image...', successFn, failureFn);
    };

    this.draw = function (ctx) {

        //Fix for firefox as it throws error when image is empty
        // if(Ext.isEmpty(fitHamImage.src) || !fitHamImage.complete) {
        //     return;
        // }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.rotateAngle * Math.PI / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        var fitImage = fitHamImage,
            zoomImage = zoomedHamImage,
            hamImage = this,
            canvasObj = currentCanvas;

        if (this.toggle.show) {
            fitImage = this.toggle.fitImage;
            zoomImage = this.toggle.zoomImage;
            hamImage = MAINCANVAS.components.hamImageContainer;
            canvasObj = MAINCANVAS;
        }

        //Ignore any run time error by wrapping in a try catch statement.
        try {
            if (!hamImage.imageLoaded) {
                var fitObj = hamImage.zooming.fit;
                ctx.drawImage(fitImage, fitObj.x, fitObj.y, fitObj.width, fitObj.height,
                    fitObj.screen.x, fitObj.screen.y, fitObj.screen.width, fitObj.screen.height);

                var zoomObj = hamImage.zooming.zoom;
                if (zoomObj.show) {
                    ctx.drawImage(zoomImage, zoomObj.x, zoomObj.y,
                        zoomObj.width, zoomObj.height);
                }
            }
            else if (hamImage.imageLoaded && !canvasObj.isShowingBaseDpiImage()) {
                info.showingImage = 'zoom';
                ctx.drawImage(zoomImage, hamImage.padding.left, hamImage.padding.top, hamImage.width, hamImage.height);
            }
            else if (!info.baseImageLoad) {
                info.showingImage = 'fit';

                //Show fit image
                ctx.drawImage(fitImage, hamImage.padding.left, hamImage.padding.top, hamImage.width, hamImage.height);
            }
        }
        catch (ex) {
            console.log(ex);
        }
        ctx.restore();
    };

    // This method handle the click event on the image area
    this.contacted = function (canX, canY) {

        // Load the densitomer footer panel
        if (this.showDensity) {
            if (!components.densitometerCrossHair.visible) {
                components.densitometerCrossHair.visible = true;
                components.densitometerCrossHair.setXY(canX, canY);
                this.cursor = 'default';
            }
        }
    };
}

function DensitometerCrossHair(currentCanvas, info, components) {
    'use strict';

    var squareSize = Ext.supports.TouchEvents ? 80 : 44,
        me = this,
        strokeStyle = '#FF0000';

    this.draggable = true;
    this.visible = false;
    this.width = squareSize;
    this.height = squareSize;
    this.finger = true;
    this.cursor = 'pointer';

    this.setXY = function (x, y) {
        this.x = x;
        this.y = y;
    };

    this.contacted = function () {
        currentCanvas.canvasProp.canMan.stopPropagation();
    };

    this.draw = function (ctx) {
        var halfSize = squareSize / 2,
            prevStroke = ctx.strokeStyle,
            centerGap = 3;

        ctx.strokeStyle = strokeStyle;
        ctx.strokeRect(this.x - halfSize, this.y - halfSize, squareSize, squareSize);
        ctx.beginPath();

        //Vertical
        ctx.moveTo(this.x, this.y - halfSize);
        ctx.lineTo(this.x, this.y - centerGap);
        ctx.moveTo(this.x, this.y + centerGap);
        ctx.lineTo(this.x, this.y + halfSize);

        //Horizontal
        ctx.moveTo(this.x - halfSize, this.y);
        ctx.lineTo(this.x - centerGap, this.y);
        ctx.moveTo(this.x + centerGap, this.y);
        ctx.lineTo(this.x + halfSize, this.y);
        ctx.stroke();
        ctx.strokeStyle = prevStroke;
    };

    this.dropEvent = function () {
        var showing = currentCanvas.seven2DpiInfo.showing, //get index of clicked point
            canvasProp = MAINCANVAS.canvasProp,
            hamImageContainer = components.hamImageContainer,
            rotateAngle = hamImageContainer.rotateAngle,
            pressedX,
            pressedY;

        if (rotateAngle < 0) {
            rotateAngle += 360;
        }

        //When angle is 0, 180...
        if (rotateAngle / 90 % 2 === 0) {
            if (rotateAngle / 90 % 4 === 0) {
                pressedX = this.x - hamImageContainer.x;
                pressedY = this.y - hamImageContainer.y;
            }
            else {
                pressedX = hamImageContainer.width - (this.x - hamImageContainer.x);
                pressedY = hamImageContainer.height - (this.y - hamImageContainer.y);
            }
        }
        else {
            var paddingLeft = (canvasProp.screenWidth - hamImageContainer.height) / 2 +
                canvasProp.screenHeight / 2 - (hamImageContainer.y + hamImageContainer.height / 2),
                paddingTop = (canvasProp.screenHeight - hamImageContainer.width) / 2 -
                    (canvasProp.screenWidth / 2 - (hamImageContainer.x + hamImageContainer.width / 2));

            if (rotateAngle / 90 % 4 === 1) {
                pressedY = hamImageContainer.height - (this.x - paddingLeft);
                pressedX = this.y - paddingTop;
            }
            else {
                pressedY = this.x - paddingLeft;
                pressedX = hamImageContainer.width - (this.y - paddingTop);
            }
        }

        Ham.application.getController('HamController').showDensitomerPanel(
            Math.floor(pressedX),
            Math.floor(pressedY),
            showing.x,
            showing.y,
            showing.width,
            showing.height,
            info.currentDpi
        );
    };

    this.hitTest = function (x, y) {
        var actualX = me.x - squareSize / 2,
            actualY = me.y - squareSize / 2;

        return (x > actualX && x < actualX + me.width && y > actualY && y < actualY + me.height);
    }
}