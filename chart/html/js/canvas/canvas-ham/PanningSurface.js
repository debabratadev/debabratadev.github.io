/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function PanningSurface(currentCanvas, info, components) {
    'use strict';

    var self = this;

    //Private properties

    var hamImageContainer = components.hamImageContainer;

    /* Measure currently viewed area of pdf with respect to the base dpi
     * image and measure coordinates
     * @param {Int} canX, {Int} canY
     * @returns none
     */
    function panWithBlurImage(canX, canY) {
        var baseDpi = info.baseDpi,
            currentDpi = info.currentDpi,
            rotateAngle = hamImageContainer.rotateAngle,
            currentHeight = self.startY - canY,
            currentWidth = self.startX - canX,
            midX,
            midY,
            baseDpiInfo = currentCanvas.getCurrentbaseDpiImgDimension(),
            showingBaseDpiInfo = baseDpiInfo.showing,
            canvasProp = currentCanvas.canvasProp,
            baseRatio = baseDpi / currentDpi,
            fitObj = hamImageContainer.zooming.fit;

        if (rotateAngle < 0) {
            rotateAngle += 360;
        }

        //measure mid point keeping padding in mind
        midX = showingBaseDpiInfo.x + (canvasProp.screenWidth / 2
            - hamImageContainer.x) * baseRatio,
            midY = showingBaseDpiInfo.y + (canvasProp.screenHeight / 2
                - hamImageContainer.y) * baseRatio;

        //When angle is 0, 180...
        if (rotateAngle / 90 % 2 === 0) {
            if (rotateAngle / 90 % 4 === 0) {
                midX += currentWidth * baseRatio;
                midY += currentHeight * baseRatio;
            }
            else {
                midX -= currentWidth * baseRatio;
                midY -= currentHeight * baseRatio;
            }
            fitObj.y = midY - canvasProp.screenHeight / 2 * baseRatio;
            fitObj.height = canvasProp.screenHeight * baseRatio;
            fitObj.x = midX - canvasProp.screenWidth / 2 * baseRatio;
            fitObj.width = canvasProp.screenWidth * baseRatio;
        }

        //When angle is 90, 270...
        else {
            //angle 90
            if (rotateAngle / 90 % 4 === 1) {
                midX += currentHeight * baseRatio;
                midY -= currentWidth * baseRatio;
            }
            else {
                midX -= currentHeight * baseRatio;
                midY += currentWidth * baseRatio;
            }
            fitObj.y = midY - canvasProp.screenWidth / 2 * baseRatio;
            fitObj.height = canvasProp.screenWidth * baseRatio;
            fitObj.x = midX - canvasProp.screenHeight / 2 * baseRatio;
            fitObj.width = canvasProp.screenHeight * baseRatio;
        }

        if (fitObj.y < 0) {
            fitObj.height += fitObj.y;
            fitObj.y = 0;
        }
        if (fitObj.y + fitObj.height > baseDpiInfo.height) {
            fitObj.height = baseDpiInfo.height - fitObj.y;
        }

        if (fitObj.x < 0) {
            fitObj.width += fitObj.x;
            fitObj.x = 0;
        }
        if (fitObj.x + fitObj.width > baseDpiInfo.width) {
            fitObj.width = baseDpiInfo.width - fitObj.x;
        }

        //If x/y is greater than maximum then set maximum and set width and height
        //to 1 to avoid error(pdf server)
        if (fitObj.x > baseDpiInfo.width) {
            fitObj.x = baseDpiInfo.width;
            fitObj.width = 1;
        }
        if (fitObj.y > baseDpiInfo.height) {
            fitObj.y = baseDpiInfo.height;
            fitObj.height = 1;
        }

        //Update navigator before manipulating width as we need to show -ve width
        currentCanvas.update72DpiInfo(fitObj, info.baseDpi);

        //Navigatore represents only main canvas image
        if (currentCanvas.canvasId === 'mainhamCanvas') {
            NAVIGATORCANVAS.refresh();
        }

        //If width/height is less than one then set to 1. Just to avoid error(pdf server)
        if (fitObj.width < 1) {
            fitObj.width = 1;
        }
        if (fitObj.height < 1) {
            fitObj.height = 1;
        }

        //Measure difference from midPoint to start point
        var xDiff = (midX - fitObj.x) / baseDpi * currentDpi,
            yDiff = (midY - fitObj.y) / baseDpi * currentDpi;

        fitObj.screen.x = canvasProp.screenWidth / 2 - xDiff;
        fitObj.screen.y = canvasProp.screenHeight / 2 - yDiff;
        fitObj.screen.width = fitObj.width / baseDpi * currentDpi;
        fitObj.screen.height = fitObj.height / baseDpi * currentDpi;

        hamImageContainer.padding.left = hamImageContainer.x = fitObj.screen.x;
        hamImageContainer.padding.top = hamImageContainer.y = fitObj.screen.y;
        hamImageContainer.width = fitObj.screen.width;
        hamImageContainer.height = fitObj.screen.height;

        hamImageContainer.imageLoaded = false;
        self.measureZoomedImageDimension(fitObj);
        currentCanvas.update72DpiInfo(fitObj, info.baseDpi);
    }

    /* Update main canvas on rectangle dragging event */
    this.updateView = function () {
        var baseDpi = info.baseDpi,
            currentDpi = info.currentDpi,
            rotateAngle = hamImageContainer.rotateAngle,
            midX,
            midY,
            baseDpiInfo = currentCanvas.getCurrentbaseDpiImgDimension(),
            showingBaseDpiInfo = baseDpiInfo.showing,
            canvasProp = currentCanvas.canvasProp,
            baseRatio = baseDpi / currentDpi,
            fitObj = hamImageContainer.zooming.fit;

        if (rotateAngle < 0) {
            rotateAngle += 360;
        }

        //measure mid point keeping padding in mind
        midX = showingBaseDpiInfo.x + showingBaseDpiInfo.width / 2,
            midY = showingBaseDpiInfo.y + showingBaseDpiInfo.height / 2;

        //When angle is 0, 180...
        if (rotateAngle / 90 % 2 === 0) {
            fitObj.y = midY - canvasProp.screenHeight / 2 * baseRatio;
            fitObj.height = canvasProp.screenHeight * baseRatio;
            fitObj.x = midX - canvasProp.screenWidth / 2 * baseRatio;
            fitObj.width = canvasProp.screenWidth * baseRatio;
        }

        //When angle is 90, 270...
        else {
            fitObj.y = midY - canvasProp.screenWidth / 2 * baseRatio;
            fitObj.height = canvasProp.screenWidth * baseRatio;
            fitObj.x = midX - canvasProp.screenHeight / 2 * baseRatio;
            fitObj.width = canvasProp.screenHeight * baseRatio;
        }

        if (fitObj.x < 0) {
            fitObj.width += fitObj.x;
            fitObj.x = 0;
        }
        if (fitObj.x + fitObj.width > baseDpiInfo.width) {
            fitObj.width = baseDpiInfo.width - fitObj.x;
        }

        if (fitObj.y < 0) {
            fitObj.height += fitObj.y;
            fitObj.y = 0;
        }
        if (fitObj.y + fitObj.height > baseDpiInfo.height) {
            fitObj.height = baseDpiInfo.height - fitObj.y;
        }

        //If x/y is greater than maximum then set maximum
        if (fitObj.x > baseDpiInfo.width) {
            fitObj.x = baseDpiInfo.width;
        }
        if (fitObj.y > baseDpiInfo.height) {
            fitObj.y = baseDpiInfo.height;
        }

        //If width/height is less than zero then set to 1. Just to avoid error
        if (fitObj.width < 0) {
            fitObj.width = 1;
        }
        if (fitObj.height < 0) {
            fitObj.height = 1;
        }

        //Measure difference from midPoint to start point
        var xDiff = (midX - fitObj.x) / baseDpi * currentDpi,
            yDiff = (midY - fitObj.y) / baseDpi * currentDpi;

        fitObj.screen.x = canvasProp.screenWidth / 2 - xDiff;
        fitObj.screen.y = canvasProp.screenHeight / 2 - yDiff;
        fitObj.screen.width = fitObj.width / baseDpi * currentDpi;
        fitObj.screen.height = fitObj.height / baseDpi * currentDpi;

        hamImageContainer.padding.left = hamImageContainer.x = fitObj.screen.x;
        hamImageContainer.padding.top = hamImageContainer.y = fitObj.screen.y;

        self.measureZoomedImageDimension(fitObj);

        hamImageContainer.imageLoaded = false;
        currentCanvas.update72DpiInfo(fitObj, info.baseDpi);

        //Update compare canvas too
        if (UTILITY.isCompareActivated()) {
            var otherCanvas = UTILITY.getOtherCanvas(currentCanvas);

            //Explicitly set calling to false there is no recursive call
            currentCanvas.calling = false;
            if (!Ext.isEmpty(otherCanvas)) {
                var otherHamCont = otherCanvas.components.hamImageContainer;

                //Have the same padding as main canvas
                otherHamCont.x = otherHamCont.padding.left = hamImageContainer.x;
                otherHamCont.y = otherHamCont.padding.top = hamImageContainer.y;

                var scalingFactor = otherCanvas.info.currentDpi / otherCanvas.info.baseDpi,
                    availableWidth = otherCanvas.canvasProp.screenWidth - otherHamCont.x,
                    availableHeight = otherCanvas.canvasProp.screenHeight - otherHamCont.y;

                //Logic here is to have same x and y coordinate as main canvas and calculate
                //width and height on the basis of currentDpi
                var otherFitObj = otherHamCont.zooming.fit;
                otherFitObj.x = currentCanvas.seven2DpiInfo.showing.x /
                    Constants.hundredPercentDpi * otherCanvas.info.baseDpi;
                otherFitObj.y = currentCanvas.seven2DpiInfo.showing.y /
                    Constants.hundredPercentDpi * otherCanvas.info.baseDpi;
                otherFitObj.width = availableWidth / scalingFactor;
                otherFitObj.height = availableHeight / scalingFactor;
                otherFitObj.screen.x = otherHamCont.x;
                otherFitObj.screen.y = otherHamCont.y;

                if ((otherFitObj.width + otherFitObj.x) > otherCanvas.baseDpiInfo.width) {
                    otherFitObj.width = otherCanvas.baseDpiInfo.width - otherFitObj.x;
                }

                if ((otherFitObj.y + otherFitObj.height) > otherCanvas.baseDpiInfo.height) {
                    otherFitObj.height = otherCanvas.baseDpiInfo.height - otherFitObj.y;
                }

                otherFitObj.screen.width = otherFitObj.width / otherCanvas.info.baseDpi
                    * info.currentDpi;
                otherFitObj.screen.height = otherFitObj.height / otherCanvas.info.baseDpi
                    * info.currentDpi;

                otherCanvas.update72DpiInfo(otherFitObj, otherCanvas.info.baseDpi);

                //Update zoom object
                otherCanvas.components.panningSurface.measureZoomedImageDimension(otherFitObj);

                otherHamCont.imageLoaded = false;

                UTILITY.stopAjaxRequest();
                otherCanvas.updateStickyPosition();
            }
        }
    };

    /* measure position of zoomed image within full image with respect to the
     * curent dpi image
     * @param {object} showingBaseDpiInfo
     * @returns none
     */
    this.measureZoomedImageDimension = function (showingBaseDpiInfo) {

        //If last image param is empty and showing fit image then no need to calculate zoom object
        if (!UTILITY.isObjectEmpty(info.lastImageParams) && !currentCanvas.isShowingFitImage()) {
            var baseDpi = info.baseDpi,
                currentDpi = info.currentDpi;

            var widhtRatio = currentCanvas.baseDpiInfo.width / currentCanvas.seven2DpiInfo.width,
                heightRatio = currentCanvas.baseDpiInfo.height / currentCanvas.seven2DpiInfo.height,
                zoomedImagePropWRTBaseDpi = {},
                zoomObj = hamImageContainer.zooming.zoom;

            //Measure zoomed image position from last loaded image position
            zoomedImagePropWRTBaseDpi.x = info.lastImageParams.x * widhtRatio;
            zoomedImagePropWRTBaseDpi.y = info.lastImageParams.y * heightRatio;

            zoomObj.show = true;
            zoomObj.x = hamImageContainer.padding.left +
                (zoomedImagePropWRTBaseDpi.x - showingBaseDpiInfo.x) /
                baseDpi * currentDpi;
            zoomObj.y = hamImageContainer.padding.top +
                (zoomedImagePropWRTBaseDpi.y - showingBaseDpiInfo.y) /
                baseDpi * currentDpi;

            var zoomBaseWidth = info.lastImageParams.width / 72 * info.baseDpi,
                zoomBaseHeight = info.lastImageParams.height / 72 * info.baseDpi;
            zoomObj.width = showingBaseDpiInfo.screen.width / showingBaseDpiInfo.width * zoomBaseWidth;
            zoomObj.height = showingBaseDpiInfo.screen.height / showingBaseDpiInfo.height * zoomBaseHeight;
        }
        else {
            hamImageContainer.zooming.zoom.show = false;
        }
    };

    //Public properties
    this.x = 0;
    this.y = 0;
    this.draggable = true;
    this.width = currentCanvas.canvasProp.screenWidth;
    this.height = currentCanvas.canvasProp.screenHeight;
    this.draw = function () { };
    this.contacted = function (canX, canY) {

        //If free/circular hand is active then don't do anything
        if (MAINCANVAS.circularAnnoActive) {

            //Draw on main canvas only
            currentCanvas.canvasId === 'mainhamCanvas' && currentCanvas.addNewCircularAnnotation(canX, canY);
            return;
        }

        if (MAINCANVAS.freeHandAnnotationActive) {
            currentCanvas.canvasId === 'mainhamCanvas' && currentCanvas.addNewFreeHandAnnotation(canX, canY);
            return;
        }
        else {
            this.startX = canX;
            this.startY = canY;
            this.draggingDone = false;

            //Have a back up of width and height because that will be needed to show zoomed image
            hamImageContainer.prevWidth = hamImageContainer.width;
            hamImageContainer.prevHeight = hamImageContainer.height;
        }

        //Update compare canvas too
        if (UTILITY.isCompareActivated()) {
            var otherCanvas = UTILITY.getOtherCanvas(currentCanvas);
            if (!Ext.isEmpty(otherCanvas)) {
                otherCanvas.components.panningSurface.contacted(canX, canY);
            }
        }
    };
    this.dragging = function (canX, canY) {
        this.draggingDone = true;

        //If free hand is active then don't pan
        if (MAINCANVAS.freeHandAnnotationActive) {
            currentCanvas.canvasId === 'mainhamCanvas' && currentCanvas.pushPointsToFreeHandAnno(canX, canY);
            return;
        }

        panWithBlurImage(canX, canY);
        hamImageContainer.imageLoaded = false;

        this.startX = canX;
        this.startY = canY;
        UTILITY.stopAjaxRequest();
        currentCanvas.updateStickyPosition();

        //Update compare canvas too
        if (UTILITY.isCompareActivated()) {
            var otherCanvas = UTILITY.getOtherCanvas(currentCanvas);
            if (!Ext.isEmpty(otherCanvas)) {
                otherCanvas.components.panningSurface.dragging(canX, canY);
            }
        }

    };
    this.dropEvent = function () {

        //If free hand is active
        if (MAINCANVAS.freeHandAnnotationActive) {
            currentCanvas.canvasId === 'mainhamCanvas' && currentCanvas.completeFreeHandAnno();
            return;
        }

        var updateDensitometer;

        // if(UTILITY.isDensitometerAcive()) {
        //     updateDensitometer = MAINCANVAS.updateDensitometer;
        // }

        this.x = 0;
        this.y = 0;

        //Don't call api when fit image is showing
        //Check if dragged/pan or just a click. If just click then don't make any call
        if (!currentCanvas.isShowingBaseDpiImage() && this.draggingDone) {
            currentCanvas.refresh(info.currentDpi, updateDensitometer);
        }
        else {
            this.draggingDone && updateDensitometer && updateDensitometer();
        }

        if (UTILITY.isCompareActivated()) {
            var otherCanvas = UTILITY.getOtherCanvas(currentCanvas);
            COMPARECANVAS.calling = false;
            MAINCANVAS.calling = false;
            if (!Ext.isEmpty(otherCanvas)) {
                if (!otherCanvas.isShowingBaseDpiImage() && otherCanvas.components.panningSurface.draggingDone) {
                    otherCanvas.refresh(info.currentDpi);
                }
            }
        }
    };
    this.activate = function () {
        this.visible = true;
    };
    this.deactivate = function () {
        this.visible = false;
    };
}
