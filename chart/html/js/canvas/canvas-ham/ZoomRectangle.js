/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ZoomRectangle(currentCanvas, info, components) {
    'use strict';

    var me = this,
        strokeStyle = '#0000FF';

    var hamImageContainer = components.hamImageContainer;

    function measureAt0Degree(clipX, clipY, clipWidth, clipHeight) {
        var baseDpi = info.baseDpi,
            currentDpi = info.currentDpi,
            fitObj = hamImageContainer.zooming.fit,
            baseRatio = baseDpi / currentDpi,
            rotateAngle = hamImageContainer.rotateAngle;

        if (rotateAngle < 0) {
            rotateAngle += 360;
        }
        if (rotateAngle / 90 % 4 === 0) {
            //Get actuall x, y points where we will start drawing rectangle
            clipX -= hamImageContainer.x;
            clipY -= hamImageContainer.y;
        }
        else {
            //Get actuall x, y points where we will start drawing rectangle
            clipX = hamImageContainer.width - (clipX + clipWidth - hamImageContainer.x);
            clipY = hamImageContainer.height - (clipY + clipHeight - hamImageContainer.y);
        }

        fitObj.width = clipWidth * baseRatio;
        fitObj.height = clipHeight * baseRatio;

        var widthDpi = currentCanvas.baseDpiInfo.width / fitObj.width * baseDpi,
            heightDpi = currentCanvas.baseDpiInfo.height / fitObj.height * baseDpi,
            dpi = widthDpi > heightDpi ? widthDpi : heightDpi;

        //Left padding
        if (clipX < 0) {
            hamImageContainer.padding.left = -clipX / currentDpi * dpi;
            clipWidth += clipX;
            clipX = 0;
        }
        else {
            hamImageContainer.padding.left = 0;
        }

        //Top padding
        if (clipY < 0) {
            hamImageContainer.padding.top = -clipY / currentDpi * dpi;
            clipHeight += clipY;
            clipY = 0;
        }
        else {
            hamImageContainer.padding.top = 0;
        }

        var baseDpiInfo = currentCanvas.getCurrentbaseDpiImgDimension();
        baseDpiInfo.showing.x += clipX * baseRatio;
        baseDpiInfo.showing.y += clipY * baseRatio;
        fitObj.x = baseDpiInfo.showing.x;
        fitObj.y = baseDpiInfo.showing.y;
        fitObj.width = clipWidth * baseRatio;
        fitObj.height = clipHeight * baseRatio;

        fitObj.screen.x = hamImageContainer.padding.left;
        fitObj.screen.y = hamImageContainer.padding.top;

        return dpi;
    }

    function measureAt90Degree(clipX, clipY, clipWidth, clipHeight) {
        var baseDpi = info.baseDpi,
            currentDpi = info.currentDpi,
            canvasProp = currentCanvas.canvasProp,
            paddingLeft = (canvasProp.screenWidth - hamImageContainer.height) / 2 +
                canvasProp.screenHeight / 2 - (hamImageContainer.y + hamImageContainer.height / 2),
            paddingTop = (canvasProp.screenHeight - hamImageContainer.width) / 2 -
                (canvasProp.screenWidth / 2 - (hamImageContainer.x + hamImageContainer.width / 2)),
            fitObj = hamImageContainer.zooming.fit,
            baseRatio = baseDpi / currentDpi,
            rotateAngle = hamImageContainer.rotateAngle;

        fitObj.width = clipHeight * baseRatio;
        fitObj.height = clipWidth * baseRatio;

        var widthDpi = currentCanvas.baseDpiInfo.height / fitObj.width * baseDpi,
            heightDpi = currentCanvas.baseDpiInfo.width / fitObj.height * baseDpi,
            dpi = widthDpi > heightDpi ? widthDpi : heightDpi;

        if (rotateAngle < 0) {
            rotateAngle += 360;
        }
        if (rotateAngle / 90 % 4 === 1) {
            //Get actuall x, y points where we will start drawing rectangle
            clipX = hamImageContainer.height - (clipX + clipWidth - paddingLeft);
            clipY -= paddingTop;
        }
        else {
            //Get actuall x, y points where we will start drawing rectangle
            clipX -= paddingLeft;
            clipY = hamImageContainer.width - (clipY + clipHeight - paddingTop);
        }
        //When x or y becomes negative
        if (clipX < 0) {
            hamImageContainer.padding.top = -clipX / currentDpi * dpi;
            clipWidth += clipX;
            clipX = 0;
        }
        else {
            hamImageContainer.padding.top = 0;
        }
        if (clipY < 0) {
            hamImageContainer.padding.left = -clipY / currentDpi * dpi;
            clipHeight += clipY;
            clipY = 0;
        }
        else {
            hamImageContainer.padding.left = 0;
        }

        var baseDpiInfo = currentCanvas.getCurrentbaseDpiImgDimension();
        baseDpiInfo.showing.x += clipY * baseRatio;
        baseDpiInfo.showing.y += clipX * baseRatio;
        fitObj.x = baseDpiInfo.showing.x;
        fitObj.y = baseDpiInfo.showing.y;
        fitObj.width = clipHeight * baseRatio;
        fitObj.height = clipWidth * baseRatio;

        var heightWidthDiff = (currentCanvas.canvasProp.screenWidth - currentCanvas.canvasProp.screenHeight) / 2;
        fitObj.screen.x = hamImageContainer.padding.left + heightWidthDiff;
        fitObj.screen.y = hamImageContainer.padding.top - heightWidthDiff;

        return dpi;
    }

    //Draw zoomed image, usually cliped image
    function drawZoomedImage() {
        hamImageContainer.imageLoaded = false;
        hamImageContainer.zooming.zoom.show = false;

        var fullScreenWidth = currentCanvas.canvasProp.screenWidth,
            fullScreenHeight = currentCanvas.canvasProp.screenHeight,
            widthRatio = me.zoomedWidth / fullScreenWidth,
            heightRatio = me.zoomedHeight / fullScreenHeight,
            clipX,
            clipY,
            clipWidth,
            clipHeight,
            dpi,
            zoomPercent,
            baseDpi = info.baseDpi,
            fitObj = hamImageContainer.zooming.fit;

        //Manipulate zoom area depending upon width and height
        if (widthRatio > heightRatio) {

            //Fix the width and manipulate(increase) height as per widthRatio
            var expectedHeight = widthRatio * fullScreenHeight,
                midHeight = me.startY + me.zoomedHeight / 2; //Get the mid position of zoomed height

            clipX = me.startX;
            clipWidth = me.zoomedWidth;
            clipY = midHeight - expectedHeight / 2; //Distribute half of height on each side of midHeight
            clipHeight = expectedHeight;
        }
        else {

            //Fix the height and manipulate(increase) width as per heightRatio
            var expectedWidth = heightRatio * fullScreenWidth,
                midWidth = me.startX + me.zoomedWidth / 2;

            clipX = midWidth - expectedWidth / 2;
            clipWidth = expectedWidth;
            clipY = me.startY;
            clipHeight = me.zoomedHeight;
        }

        //When angle is 0, 180...
        if (hamImageContainer.rotateAngle / 90 % 2 === 0) {
            dpi = measureAt0Degree(clipX, clipY, clipWidth, clipHeight);
        }

        //When angle is 90, 270...
        else {
            dpi = measureAt90Degree(clipX, clipY, clipWidth, clipHeight);
        }

        //If width/height exceeds actual width/height
        if (fitObj.y + fitObj.height > currentCanvas.baseDpiInfo.height) {
            fitObj.height = currentCanvas.baseDpiInfo.height - fitObj.y;
        }
        if (fitObj.x + fitObj.width > currentCanvas.baseDpiInfo.width) {
            fitObj.width = currentCanvas.baseDpiInfo.width - fitObj.x;
        }

        //dpi is more than maximum level then set to max and measure equivalent coordinates
        if (dpi > Constants.maxDpi) {
            var midWidthPoint = fitObj.x + fitObj.width / 2;
            var midHeightPoint = fitObj.y + fitObj.height / 2;
            fitObj.width = fitObj.width * dpi / Constants.maxDpi;
            fitObj.height = fitObj.height * dpi / Constants.maxDpi;
            fitObj.x = midWidthPoint - fitObj.width / 2;
            fitObj.y = midHeightPoint - fitObj.height / 2;
            dpi = Constants.maxDpi;
        }

        //If x/y is greater than maximum then set maximum and set width and height
        //to 1 to avoid error(pdf server)
        if (fitObj.x > currentCanvas.baseDpiInfo.width) {
            fitObj.x = currentCanvas.baseDpiInfo.width;
            fitObj.width = 1;
        }
        if (fitObj.y > currentCanvas.baseDpiInfo.height) {
            fitObj.y = currentCanvas.baseDpiInfo.height;
            fitObj.height = 1;
        }

        fitObj.screen.width = fitObj.width / baseDpi * dpi;
        fitObj.screen.height = fitObj.height / baseDpi * dpi;

        hamImageContainer.x = hamImageContainer.padding.left = fitObj.screen.x;
        hamImageContainer.y = hamImageContainer.padding.top = fitObj.screen.y;
        hamImageContainer.width = fitObj.screen.width;
        hamImageContainer.height = fitObj.screen.height;

        zoomPercent = 100 / Constants.hundredPercentDpi * dpi;
        currentCanvas.update72DpiInfo(fitObj, baseDpi);
        currentCanvas.refresh(dpi);
        info.currentDpi = dpi;

        //Navigatore represents only main canvas image
        if (currentCanvas.canvasId === 'main-canvas') {
            // NAVIGATORCANVAS.refresh();
        }
        // Ham.application.getController('HamController').setSliderValue(zoomPercent);
    }

    this.width = currentCanvas.canvasProp.screenWidth;
    this.height = currentCanvas.canvasProp.screenHeight;
    this.draggable = true;
    this.originalX = this.x;
    this.originalY = this.y;
    this.visible = false;
    this.cursor = 'crosshair';
    this.contacted = function (x, y) {
        if (UTILITY.isCompareActivated()) {
            var otherCanvas = UTILITY.getOtherCanvas(currentCanvas);
            if (!Ext.isEmpty(otherCanvas)) {
                otherCanvas.components.zoomRectangle.contacted(x, y);
            }
        }
        this.startX = x;
        this.startY = y;
    };
    this.dragging = function (x, y) {
        if (UTILITY.isCompareActivated()) {
            var otherCanvas = UTILITY.getOtherCanvas(currentCanvas);
            if (!Ext.isEmpty(otherCanvas)) {
                otherCanvas.components.zoomRectangle.dragging(x, y);
            }
        }
        this.movedToX = x;
        this.movedToY = y;
    };
    this.draw = function (ctx) {
        var prevStroke = ctx.strokeStyle;
        this.zoomedWidth = this.movedToX - this.startX,
            this.zoomedHeight = this.movedToY - this.startY;
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.strokeRect(this.startX, this.startY, this.zoomedWidth, this.zoomedHeight);
        ctx.strokeStyle = prevStroke;
        ctx.closePath();
    };
    this.dropEvent = function () {
        if (this.zoomedWidth < 0) {
            this.startX += this.zoomedWidth;
            this.zoomedWidth = Math.abs(this.zoomedWidth);
        }
        if (this.zoomedHeight < 0) {
            this.startY += this.zoomedHeight;
            this.zoomedHeight = Math.abs(this.zoomedHeight);
        }

        //Draw zoom image only if square px of rectangle is greater than say 25
        if (Math.abs(this.zoomedWidth) * Math.abs(this.zoomedHeight) > 25) {
            // if(this.zoomBtn) {
            //     this.zoomBtn.setPressed(false); //remove pressed class of btn
            // }
            currentCanvas.activateZoom();

            drawZoomedImage();
            this.x = 0;
            this.y = 0;
            this.startX = 0;
            this.startY = 0;
            this.movedToX = 0;
            this.movedToY = 0;
            components.panningSurface.activate();
            currentCanvas.updateStickyPosition();
            if (UTILITY.isCompareActivated()) {
                var otherCanvas = UTILITY.getOtherCanvas(currentCanvas);
                if (!Ext.isEmpty(otherCanvas)) {
                    otherCanvas.components.zoomRectangle.dropEvent();
                }
            }
        }
    };
    this.hitTest = function (x, y, ctx) {
        var obj = this;
        return (x > obj.originalX && x < obj.originalX + obj.width &&
            y > obj.originalY && y < obj.originalY + obj.height);
    };
    this.activate = function () {
        this.visible = true;
        this.finger = true;
    };
    this.deactivate = function () {
        this.visible = false;
        this.finger = false;
    };
}

