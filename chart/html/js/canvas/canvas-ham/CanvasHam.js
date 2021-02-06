function CanvasHam(canvasContainer, imageParams, canvasId, pdfFile, stageId, success) {

    /* Declare private properties */
    var self = this,
        canvas = document.getElementById(canvasId),
        ctx = canvas.getContext('2d'),
        screenWidth = canvasContainer.width,
        screenHeight = canvasContainer.height,
        canMan = new CanvasManager(),
        info = {
            currentDpi: undefined,
            baseDpi: undefined,
            showingImage: 'fit',
            baseImageLoad: true,
            lastImageParams: {},
            baseImageParams: {}
        },
        components = {};

    self.info = info;
    canMan.startListening(canvas, ctx);

    //This will be called before activating any functionality.
    function deactivateAllFunctionality() {
        self.deactivateRuler();
        self.deactivateDensitometer();
        zoomRectangle.deactivate();
        self.deactivateCircularAnnotation();
        self.deactivateFreeHandAnnotation();
    }

    //Fill left/right empty area
    function fillCanvasOnRotate() {
        var baseDpiInfo = self.getCurrentbaseDpiImgDimension().showing,
            baseDpi = info.baseDpi,
            currentDpi = info.currentDpi,
            baseRatio = info.baseDpi / info.currentDpi,
            midX,
            midY,
            canvasProp = self.canvasProp,
            rotateAngle = hamImageContainer.rotateAngle,
            fitObj = hamImageContainer.zooming.fit;

        //measure mid point considering padding in mind
        midX = baseDpiInfo.x + (self.canvasProp.screenWidth / 2
            - hamImageContainer.x) * baseRatio,
            midY = baseDpiInfo.y + (self.canvasProp.screenHeight / 2
                - hamImageContainer.y) * baseRatio;

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

        if (fitObj.y < 0) {
            fitObj.height += fitObj.y;
            fitObj.y = 0;
        }
        if (fitObj.y + fitObj.height > self.baseDpiInfo.height) {
            fitObj.height = self.baseDpiInfo.height - fitObj.y;
        }

        if (fitObj.x < 0) {
            fitObj.width += fitObj.x;
            fitObj.x = 0;
        }
        if (fitObj.x + fitObj.width > self.baseDpiInfo.width) {
            fitObj.width = self.baseDpiInfo.width - fitObj.x;
        }

        //Measure difference from midPoint to start point
        var xDiff = (midX - fitObj.x) / baseDpi * currentDpi,
            yDiff = (midY - fitObj.y) / baseDpi * currentDpi;

        fitObj.screen.x = self.canvasProp.screenWidth / 2 - xDiff;
        fitObj.screen.y = self.canvasProp.screenHeight / 2 - yDiff;
        fitObj.screen.width = fitObj.width / baseDpi * currentDpi;
        fitObj.screen.height = fitObj.height / baseDpi * currentDpi;

        hamImageContainer.x = hamImageContainer.padding.left = fitObj.screen.x;
        hamImageContainer.y = hamImageContainer.padding.top = fitObj.screen.y;
        hamImageContainer.height = fitObj.screen.height;
        hamImageContainer.width = fitObj.screen.width;

        var updateDensitometer;

        if (UTILITY.isDensitometerAcive()) {
            updateDensitometer = MAINCANVAS.updateDensitometer;
        }

        hamImageContainer.imageLoaded = false;
        self.update72DpiInfo(fitObj, info.baseDpi);
        panningSurface.measureZoomedImageDimension(fitObj);
        self.refresh(null, updateDensitometer);

        //Navigatore represents only main canvas image
        if (self.canvasId === 'main-canvas') {
            NAVIGATORCANVAS.refresh(true);
        }
    }

    /* End of Private properties */


    /* Declare public properties */


    this.calling = false; //Will be used in compare functionality.
    this.idle = false; //Will be used while making this canvas idle
    this.canvasId = canvasId;
    this.pdfFile = pdfFile;
    this.stageId = stageId;
    this.components = components;

    //Canvas properties
    this.canvasProp = {
        canMan: canMan,
        canvas: canvas,
        ctx: ctx,
        screenWidth: screenWidth,
        screenHeight: screenHeight
    };

    //72 dpi image information. Here showing object is always updated
    this.seven2DpiInfo = {
        x: 0,
        y: 0,
        width: undefined,
        height: undefined,

        //Portion of 72 dpi image currently we are showing
        showing: {
            width: undefined,
            height: undefined,
            x: 0,
            y: 0
        }
    };

    //Base dpi image information. Here showing object might not be updated.
    //Call getCurrentbaseDpiImgDimension function to get updated dimension
    this.baseDpiInfo = {
        x: 0,
        y: 0,
        width: undefined,
        height: undefined,

        //Portion of base dpi image currently we are showing
        showing: {
            width: undefined,
            height: undefined,
            x: 0,
            y: 0
        }
    };

    //Will be used in PanningSurface contacted function
    this.annotationActive = false;

    //At first it is true
    this.annotationShow = true;

    /**
     * Functionality: Destroy this object. By the way it is not very recommended
     *  if possible reuse this class instead of destroying it.
     * @params:  none
     * @return: none
     */
    this.destroy = function () {
        canMan.sprites = [];
        canMan.statics = [];
        canMan.draw();
    };

    /**
     * Functionality: Idle all components while deactivating compare and vice-versa
     * @params:  {string}colorName
     * @return: none
     */
    this.setIdle = function (bool) {
        this.idle = bool;

        canMan.sprites.forEach(function (sprite) {
            sprite.visible = !bool;
        });
        canMan.statics.forEach(function (statics) {
            statics.visible = !bool;
        });

        //These are idle in nature
        densitometerCrossHair.visible = false;
        rulerEastResizer.visible = false;
        rulerWestResizer.visible = false;
        rulerNorthResizer.visible = false;
        rulerSouthResizer.visible = false;
        zoomRectangle.visible = false;
    };

    /**
    * Functionality: Set separation color for the fit and zoomed image
    * @params:  {string}colorName
    * @return: none
    */
    this.setSeperation = function (colorName) {

        if (Constants.separationColor != colorName) {
            if (colorName == 'All') {
                var hamController = Ham.application.getController('HamController');
                hamController.selectAllSeparationRecord();
            }
            Constants.separationColor = colorName;
            info.baseImageParams.separationColor = colorName;
            hamImageContainer.setImage(info.baseImageParams, 'separation',
                function () {
                    self.refresh();
                }
            );
        }
    };

    //Calculate 72 dpi image width and height
    this.get72DpiImageDimension = function (baseImage) {

        var width = baseImage.width / info.baseImageParams.dpi * Constants.hundredPercentDpi,
            height = baseImage.height / info.baseImageParams.dpi * Constants.hundredPercentDpi,
            me = self;

        me.seven2DpiInfo.width = me.seven2DpiInfo.showing.width = width;
        me.seven2DpiInfo.height = me.seven2DpiInfo.showing.height = height;

        me.baseDpiInfo.width = me.baseDpiInfo.showing.width = baseImage.width;
        me.baseDpiInfo.height = me.baseDpiInfo.showing.height = baseImage.height;
    };

    this.isShowingBaseDpiImage = function () {
        return info.baseDpi === info.currentDpi;
    };

    //Showing fit imaged or zoom image
    this.isShowingFitImage = function () {
        return info.showingImage === 'fit';
    };

    //Measure current shown dimension/portion with respect to full image of base dpi image
    this.getCurrentbaseDpiImgDimension = function () {
        var widhtRatio = self.baseDpiInfo.width / self.seven2DpiInfo.width,
            heightRatio = self.baseDpiInfo.height / self.seven2DpiInfo.height;

        self.baseDpiInfo.showing = {
            x: self.seven2DpiInfo.showing.x * widhtRatio,
            y: self.seven2DpiInfo.showing.y * heightRatio,
            width: self.seven2DpiInfo.showing.width * widhtRatio,
            height: self.seven2DpiInfo.showing.height * heightRatio
        };

        return self.baseDpiInfo;
    };

    //Convert to 72dpi
    this.update72DpiInfo = function (cord, dpi) {
        var showing72Info = self.seven2DpiInfo.showing,
            seven2Ratio = Constants.hundredPercentDpi / dpi;
        showing72Info.x = cord.x * seven2Ratio;
        showing72Info.y = cord.y * seven2Ratio;
        showing72Info.width = cord.width * seven2Ratio;
        showing72Info.height = cord.height * seven2Ratio;
    };

    this.rotateLeft = function () {
        hamImageContainer.rotateAngle -= 90;
        if (info.baseDpi != info.currentDpi) {
            fillCanvasOnRotate();
        }
        else {
            hamImageContainer.zooming.zoom.show = false;
            if (UTILITY.isDensitometerAcive()) {
                MAINCANVAS.updateDensitometer();
            }
        }
        self.updateStickyPosition();
        canMan.draw();
    };

    this.rotateRight = function () {
        hamImageContainer.rotateAngle += 90;

        //Don't call api when showing baseDpi image
        if (info.baseDpi != info.currentDpi) {
            fillCanvasOnRotate();
        }
        else {
            hamImageContainer.zooming.zoom.show = false;
            if (UTILITY.isDensitometerAcive()) {
                MAINCANVAS.updateDensitometer();
            }
        }
        self.updateStickyPosition();
        canMan.draw();
    };

    this.currentRotationAngle = function () {
        return hamImageContainer.rotateAngle;
    };

    /**
     * Functionality: Set image Url on the fly
     * @params: {object}imageParams, {string}mode, {function}success
     * @return: none
     */
    this.setCanvasImage = function (imageParams, mode, success, extraObj) {
        info.currentDpi = imageParams.dpi;
        if (info.baseImageLoad) {
            info.baseDpi = info.currentDpi;
        }
        hamImageContainer.setImage(imageParams, mode, success, extraObj);
    };

    /**
    * Functionality : get Ham image position relative to canvas element
    * @param : none
    * @return: none
    */
    this.getHamImageXY = function () {
        return [hamImageContainer.x, hamImageContainer.y];
    };

    /**
    * Functionality : Do all necessary things on slider drag start
    * @param : none
    * @return: none
    */
    this.setupLocalZoom = function () {

        //Get coordinates of last loaded points with respect to base dpi image
        if (!UTILITY.isObjectEmpty(info.lastImageParams)) {
            var zoomedBase = {
                x: info.lastImageParams.x / 72 * info.baseDpi,
                y: info.lastImageParams.y / 72 * info.baseDpi,
                width: info.lastImageParams.width / 72 * info.baseDpi,
                height: info.lastImageParams.height / 72 * info.baseDpi
            };
            self.zoomedBase = zoomedBase;
        }
        else {
            hamImageContainer.zooming.zoom.show = false;
        }
    };

    /**
    * Functionality : This method is fired when slider value is drag ,
    * and it fetch the image from the remote server
    * @param : {Number}sliderValue
    * @return: none
    */
    this.performLocalZoom = function (sliderValue) {
        UTILITY.stopAjaxRequest();
        var sliderDpi = Constants.hundredPercentDpi / 100 * sliderValue,
            baseDpi = info.baseDpi,
            currentDpi = info.currentDpi,
            rotateAngle = hamImageContainer.rotateAngle,
            midX,
            midY,
            baseDpiInfo = self.getCurrentbaseDpiImgDimension(),
            showingBaseDpiInfo = baseDpiInfo.showing,
            canvasProp = self.canvasProp,
            baseCurrentRatio = baseDpi / currentDpi,
            baseSliderRatio = baseDpi / sliderDpi,
            fitObj = hamImageContainer.zooming.fit;

        if (rotateAngle < 0) {
            rotateAngle += 360;
        }

        //measure mid point keeping padding in mind
        midX = showingBaseDpiInfo.x + (canvasProp.screenWidth / 2
            - hamImageContainer.x) * baseCurrentRatio,
            midY = showingBaseDpiInfo.y + (canvasProp.screenHeight / 2
                - hamImageContainer.y) * baseCurrentRatio;

        //When angle is 0, 180...
        if (rotateAngle / 90 % 2 === 0) {
            fitObj.y = midY - canvasProp.screenHeight / 2 * baseSliderRatio;
            fitObj.height = canvasProp.screenHeight * baseSliderRatio;
            fitObj.x = midX - canvasProp.screenWidth / 2 * baseSliderRatio;
            fitObj.width = canvasProp.screenWidth * baseSliderRatio;
        }

        //When angle is 90, 270...
        else {
            fitObj.y = midY - canvasProp.screenWidth / 2 * baseSliderRatio;
            fitObj.height = canvasProp.screenWidth * baseSliderRatio;
            fitObj.x = midX - canvasProp.screenHeight / 2 * baseSliderRatio;
            fitObj.width = canvasProp.screenHeight * baseSliderRatio;
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

        //If width/height is less than zero then set to 1. Just to avoid error
        if (fitObj.width < 0) {
            fitObj.width = 1;
        }
        if (fitObj.height < 0) {
            fitObj.height = 1;
        }

        //Measure difference from midPoint to start point
        var xDiff = (midX - fitObj.x) / baseDpi * sliderDpi,
            yDiff = (midY - fitObj.y) / baseDpi * sliderDpi;

        fitObj.screen.x = canvasProp.screenWidth / 2 - xDiff;
        fitObj.screen.y = canvasProp.screenHeight / 2 - yDiff;
        fitObj.screen.width = fitObj.width / baseDpi * sliderDpi;
        fitObj.screen.height = fitObj.height / baseDpi * sliderDpi;

        hamImageContainer.padding.left = hamImageContainer.x = fitObj.screen.x;
        hamImageContainer.padding.top = hamImageContainer.y = fitObj.screen.y;
        hamImageContainer.height = fitObj.screen.height;
        hamImageContainer.width = fitObj.screen.width;
        info.currentDpi = sliderDpi;

        //Measure zoom image dimension
        if (self.zoomedBase) {
            var zoomObj = hamImageContainer.zooming.zoom,
                zoomedBase = self.zoomedBase;

            zoomObj.show = true;
            zoomObj.x = fitObj.screen.x + fitObj.screen.width / fitObj.width *
                (zoomedBase.x - fitObj.x),
                zoomObj.y = fitObj.screen.y + fitObj.screen.width / fitObj.width *
                (zoomedBase.y - fitObj.y),
                zoomObj.width = fitObj.screen.width / fitObj.width * zoomedBase.width,
                zoomObj.height = fitObj.screen.height / fitObj.height * zoomedBase.height;
        }

        hamImageContainer.imageLoaded = false;
        self.update72DpiInfo(fitObj, baseDpi);
        self.updateStickyPosition();

        //Navigatore represents only main canvas image
        if (self.canvasId === 'main-canvas') {
            NAVIGATORCANVAS.refresh();
        }
        canMan.draw();
    };

    /**
    * Functionality: Activate zoom functionality
    * @params: none
    * @return: none
    */
    this.activateZoom = function (btn) {
        if (zoomRectangle.visible) {
            zoomRectangle.deactivate();
            // circularAnnotations.forEach(function (circularAnnotation) {
            //     circularAnnotation.idle = false;
            // });
            // freeHandAnnotations.forEach(function (freeHandAnnotation) {
            //     freeHandAnnotation.idle = false;
            // });
        }
        else {
            deactivateAllFunctionality();
            zoomRectangle.activate();
            zoomRectangle.zoomBtn = btn;
            this.deactivateRuler();
            panningSurface.deactivate();
            // circularAnnotations.forEach(function (circularAnnotation) {
            //     circularAnnotation.idle = true;
            // });
            // freeHandAnnotations.forEach(function (freeHandAnnotation) {
            //     freeHandAnnotation.idle = true;
            // });
        }
    };

    this.activateRuler = function () {
        deactivateAllFunctionality();
        panningSurface.deactivate();
        ruler.activate();
        circularAnnotations.forEach(function (circularAnnotation) {
            circularAnnotation.idle = true;
        });
        freeHandAnnotations.forEach(function (freeHandAnnotation) {
            freeHandAnnotation.idle = true;
        });
        self.init();
    };

    this.deactivateRuler = function () {
        ruler.deactivate();
        panningSurface.activate();
        circularAnnotations.forEach(function (circularAnnotation) {
            circularAnnotation.idle = false;
        });
        freeHandAnnotations.forEach(function (freeHandAnnotation) {
            freeHandAnnotation.idle = false;
        });
        self.init();
    };

    this.showRuler = function () {
        ruler.show();
    };

    this.hideRuler = function () {
        ruler.hide();
        self.init();
    };

    this.activateDensitometer = function () {
        deactivateAllFunctionality();
        hamImageContainer.cursor = 'crosshair';
        hamImageContainer.showDensity = true;
    };

    this.deactivateDensitometer = function () {
        hamImageContainer.cursor = 'default';
        hamImageContainer.showDensity = false;
        densitometerCrossHair.visible = false;
        self.init();
    };

    this.showAnnotations = function () {
        this.annotationShow = true;
        circularAnnotations.forEach(function (circularAnnotation) {
            circularAnnotation.visible = true;
        });
        freeHandAnnotations.forEach(function (freeHandAnnotation) {
            freeHandAnnotation.visible = true;
        });
        self.updateStickyPosition();
        self.init();
    }

    this.hideAnnotations = function () {
        this.annotationShow = false;
        circularAnnotations.forEach(function (circularAnnotation) {
            circularAnnotation.visible = false;
        });
        freeHandAnnotations.forEach(function (freeHandAnnotation) {
            freeHandAnnotation.visible = false;
        });
        self.init();
    };

    this.activateCircularAnnotation = function () {
        deactivateAllFunctionality();
        this.circularAnnoActive = true;
        panningSurface.finger = true;
        panningSurface.cursor = 'crosshair';
        circularAnnotations.forEach(function (circularAnnotation) {
            circularAnnotation.idle = true;
        });
        freeHandAnnotations.forEach(function (freeHandAnnotation) {
            freeHandAnnotation.idle = true;
        });
    };

    this.deactivateCircularAnnotation = function () {
        this.circularAnnoActive = false;
        panningSurface.finger = false;
        panningSurface.cursor = 'default';
        circularAnnotations.forEach(function (circularAnnotation) {
            circularAnnotation.idle = false;
        });
        freeHandAnnotations.forEach(function (freeHandAnnotation) {
            freeHandAnnotation.idle = false;
        });
    };

    this.addNewCircularAnnotation = function (x, y) {
        var circularAnnotation = new AnnotationCircle(self, info, components),
            hamImagePosition = self.getHamImageXY(),
            ratio = Constants.hundredPercentDpi / info.currentDpi,
            showing72Dpi = self.seven2DpiInfo.showing,
            annotationHeight = 84, //Approximate
            additionalDeflection = 80; //When screen goes off the screen

        circularAnnotations.push(circularAnnotation);
        circularAnnotation.annotationIndex = circularAnnotations.length - 1;
        canMan.sprites.push(circularAnnotation);
        circularAnnotation.draggable = true;
        circularAnnotation.finger = true;
        circularAnnotation.x = x;
        circularAnnotation.y = y;
        circularAnnotation.panelX = x + circularAnnotation.deflectionX;
        circularAnnotation.panelY = y + circularAnnotation.deflectionY;

        //If position goes off the screen
        if (circularAnnotation.panelX < 0) {
            circularAnnotation.panelX = x - circularAnnotation.deflectionX / 2;
        }
        if (circularAnnotation.panelY > (MAINCANVAS.canvasProp.screenHeight - annotationHeight)) {
            circularAnnotation.panelY = y - (circularAnnotation.deflectionY + additionalDeflection);
        }

        var xy = UTILITY.getRotatedPoint(-hamImageContainer.rotateAngle,
            canvas, circularAnnotation.x, circularAnnotation.y),
            panelXY = UTILITY.getRotatedPoint(-hamImageContainer.rotateAngle,
                canvas, circularAnnotation.panelX, circularAnnotation.panelY);

        var stickyNote = {
            pinHeadX: showing72Dpi.x + (xy[0] - hamImagePosition[0]) * ratio,
            pinHeadY: showing72Dpi.y + (xy[1] - hamImagePosition[1]) * ratio,
            stickyX: showing72Dpi.x + (panelXY[0] - hamImagePosition[0]) * ratio,
            stickyY: showing72Dpi.y + (panelXY[1] - hamImagePosition[1]) * ratio,
            pinheadType: 'CIRCLE_PINHEAD',
            freehandPoints: 'null',
            drawnAtDpi: 'null'
        };

        var annotationPanel = Ham.application.getController('HamController').
            addNewAnnotation(stickyNote, self);
        circularAnnotation.panelWidth = annotationPanel.width / 2;
        circularAnnotation.stickyNote = stickyNote;
        circularAnnotation.halfPanelX = circularAnnotation.panelX + circularAnnotation.panelWidth;
        this.deactivateCircularAnnotation();

        var annoBtn = Ext.ComponentQuery.query('hamviewport button[name=addCircularAnnotation]')[0];
        annoBtn.setPressed(false);
        annoBtn.customPressed = false;

        canMan.draw();
    };

    this.moveAnnotationOnPanelDrag = function (annotationPanel, x, y) {
        var insertPosition = annotationPanel.insertPosition,
            canvasPosition = Ext.fly(self.canvasId).getXY(),
            stickyNote = annotationPanel.stickyInfo.stickyNote,
            rotateAngle = hamImageContainer.rotateAngle,
            panelX = x - canvasPosition[0],
            panelY = y - canvasPosition[1],
            ratio = Constants.hundredPercentDpi / info.currentDpi,
            showing72Dpi = self.seven2DpiInfo.showing;

        if (stickyNote.pinheadType == 'CIRCLE_PINHEAD') {
            var circularAnnotation = circularAnnotations[insertPosition];
            circularAnnotation.panelX = panelX;
            circularAnnotation.panelY = panelY;
            circularAnnotation.halfPanelX = circularAnnotation.panelX + circularAnnotation.panelWidth;
        }
        else {
            var freeHandAnnotation = freeHandAnnotations[insertPosition];
            freeHandAnnotation.panelX = panelX;
            freeHandAnnotation.panelY = panelY;
            freeHandAnnotation.halfPanelX = freeHandAnnotation.panelX + freeHandAnnotation.panelWidth;
        }

        //Update stickyNote object
        var stickyXY = UTILITY.getRotatedPoint(-rotateAngle, canvas, panelX, panelY);
        stickyNote.stickyX = (stickyXY[0] - hamImageContainer.x) * ratio + showing72Dpi.x;
        stickyNote.stickyY = (stickyXY[1] - hamImageContainer.y) * ratio + showing72Dpi.y;

        self.init();
    };

    this.addCircularAnnotation = function (stickyNote, annotationWidth) {
        var hamImagePosition = self.getHamImageXY(),
            ratio = (self.info.currentDpi || self.baseImageParams.dpi) /
                Constants.hundredPercentDpi,
            pinHeadX = Number(stickyNote.pinHeadX) * ratio,
            pinHeadY = Number(stickyNote.pinHeadY) * ratio,
            stickyX = Number(stickyNote.stickyX) * ratio,
            stickyY = Number(stickyNote.stickyY) * ratio;

        var circularAnnotation = new AnnotationCircle(self, info, components);
        canMan.addToSprites(circularAnnotation);

        circularAnnotation.visible = self.annotationShow;
        circularAnnotation.draggable = (stickyNote.createdBy === Constants.userInfo.userId)
            && self.canvasId == 'main-canvas'
            && Constants.userInfo.readOnly != 'true';
        circularAnnotation.finger = circularAnnotation.draggable;
        circularAnnotation.stickyNote = stickyNote;
        circularAnnotation.x = hamImagePosition[0] + pinHeadX;
        circularAnnotation.y = hamImagePosition[1] + pinHeadY;
        circularAnnotation.panelX = hamImagePosition[0] + stickyX;
        circularAnnotation.panelY = hamImagePosition[1] + stickyY;
        circularAnnotation.panelWidth = annotationWidth / 2;
        circularAnnotation.halfPanelX = circularAnnotation.panelX + circularAnnotation.panelWidth;
        circularAnnotations.push(circularAnnotation);
        circularAnnotation.annotationIndex = circularAnnotations.length - 1;
        canMan.draw();
    };

    /**
    * Functionality: Remove annotation circle from anotationCircle and canMan sprites array
    * @params: none
    * @return: none
    */
    this.removeAnnotation = function (annotationPanel) {
        var index = annotationPanel.insertPosition,
            stickyNote = annotationPanel.stickyInfo.stickyNote;

        //Logic is to remove from canMan and leave the circularAnnotations and
        //freeHandAnnotations unchanged

        //Last comment to be deleted, ie no comments left, removes the enclosing
        //sticky container, pin head and connecting line

        //Loop through all objects and find
        for (var i = 0, length = canMan.sprites.length; i < length; i++) {
            if (canMan.sprites[i].stickyNote &&
                //canMan.sprites[i].stickyNote.pinheadType == stickyNote.pinheadType &&
                canMan.sprites[i].stickyNote.stickyId == stickyNote.stickyId) {

                canMan.sprites.splice(i, 1);
                canMan.draw();
                return;
            }
        }
    }

    /**
    * Functionality: Remove all Annotations at once
    * @params: none
    * @return: none
    */
    this.removeAllAnnotations = function () {
        var found = [];

        //Loop through all objects and find
        for (var i = 0, length = canMan.sprites.length; i < length; i++) {
            if (canMan.sprites[i] instanceof FreeHandAnnotation ||
                canMan.sprites[i] instanceof AnnotationCircle) {
                found.push(i);
            }
        }

        //Now start removing from last to avoid length issue
        for (i = found.length - 1; i >= 0; i--) {
            canMan.sprites.splice(found[i], 1);
        }

        circularAnnotations = [];
        freeHandAnnotations = [];
        canMan.draw();
    };

    /**
    * Functionality: Update Annotation circle position
    * @params: {Boolean} dontUpdateCreator, {Boolean} dontUpdateSticky
    * @return: none
    */
    this.updateStickyPosition = function (dontUpdateCreator, dontUpdateSticky) {

        //Don't update when annotation show is false to save some calculation
        if (!this.annotationShow) {
            return;
        }
        var hamImagePosition = self.getHamImageXY(),
            ratio = info.currentDpi / Constants.hundredPercentDpi,
            showing72Dpi = self.seven2DpiInfo.showing,
            rotateAngle = hamImageContainer.rotateAngle;

        for (var i = 0, length = circularAnnotations.length; i < length; i++) {
            var circularAnnotation = circularAnnotations[i],
                stickyNote = circularAnnotation.stickyNote,
                pinHeadX = Number(stickyNote.pinHeadX) * ratio,
                pinHeadY = Number(stickyNote.pinHeadY) * ratio,
                stickyX = Number(stickyNote.stickyX) * ratio,
                stickyY = Number(stickyNote.stickyY) * ratio;

            //In collaboration don't update current user annotations if dontUpdateCreator is true
            if (!(dontUpdateCreator && stickyNote.createdBy == Constants.userInfo.userId)) {

                //Get relative point
                circularAnnotation.x = hamImagePosition[0] + pinHeadX - showing72Dpi.x * ratio;
                circularAnnotation.y = hamImagePosition[1] + pinHeadY - showing72Dpi.y * ratio;
                circularAnnotation.panelX = hamImagePosition[0] + stickyX - showing72Dpi.x * ratio;
                circularAnnotation.panelY = hamImagePosition[1] + stickyY - showing72Dpi.y * ratio;

                //Get rotated point so that it will work at all rotation
                var newPanelXY = UTILITY.getRotatedPoint(rotateAngle,
                    canvas, circularAnnotation.panelX, circularAnnotation.panelY);
                circularAnnotation.panelX = newPanelXY[0];
                circularAnnotation.panelY = newPanelXY[1];

                circularAnnotation.halfPanelX = circularAnnotation.panelX + circularAnnotation.panelWidth;

                var newXY = UTILITY.getRotatedPoint(rotateAngle,
                    canvas, circularAnnotation.x, circularAnnotation.y);
                circularAnnotation.x = newXY[0];
                circularAnnotation.y = newXY[1];
            }
        }

        for (i = 0, length = freeHandAnnotations.length; i < length; i++) {
            var freeHandAnnotation = freeHandAnnotations[i];

            stickyNote = freeHandAnnotation.stickyNote;

            //While drawing a freehand, stickyNote object is empty. So don't update that
            if (!Ext.isEmpty(stickyNote)) {
                var freehandPoints = stickyNote.freehandPoints.split(':'),
                    drawnDpi = stickyNote.drawnAtDpi.split(":")[0],
                    drawnAngle = stickyNote.drawnAtDpi.split(":")[1],
                    drawnRatio = info.currentDpi / drawnDpi;

                //In collaboration don't update current user annotations if dontUpdateCreator is true
                if (!(dontUpdateCreator && stickyNote.createdBy == Constants.userInfo.userId)) {

                    //Relative point
                    pinHeadX = hamImagePosition[0] + Number(stickyNote.pinHeadX) * ratio - showing72Dpi.x * ratio;
                    pinHeadY = hamImagePosition[1] + Number(stickyNote.pinHeadY) * ratio - showing72Dpi.y * ratio;
                    stickyX = hamImagePosition[0] + Number(stickyNote.stickyX) * ratio - showing72Dpi.x * ratio;
                    stickyY = hamImagePosition[1] + Number(stickyNote.stickyY) * ratio - showing72Dpi.y * ratio;

                    freeHandAnnotation.points = [];

                    //First get the actual rotate pin point
                    var actualPinXY = UTILITY.getRotatedPoint(rotateAngle, canvas, pinHeadX, pinHeadY);

                    for (var j = 0; j < freehandPoints.length; j++) {
                        var parts = freehandPoints[j].split(',');

                        //Again rotate from actualPinXY on the basis of drawn angle to get exact drawing
                        var rotatedPoint = UTILITY.getRotatedPoint(rotateAngle - drawnAngle,
                            { width: 2 * actualPinXY[0], height: 2 * actualPinXY[1] },
                            actualPinXY[0] + Number(parts[0]) * drawnRatio,
                            actualPinXY[1] + Number(parts[1]) * drawnRatio);

                        freeHandAnnotation.points.push([rotatedPoint[0], rotatedPoint[1]]);
                    }

                    var actualPanelXY = UTILITY.getRotatedPoint(rotateAngle, canvas, stickyX, stickyY);

                    freeHandAnnotation.panelX = actualPanelXY[0];
                    freeHandAnnotation.panelY = actualPanelXY[1];
                }
                freeHandAnnotation.halfPanelX = freeHandAnnotation.panelX + freeHandAnnotation.panelWidth;
            }
        }

        //Especially in collaboration
        // if (!dontUpdateSticky) {
        //     Ham.application.getController('HamController').updateAnnotationPosition(self);
        // }
    };

    this.activateFreeHandAnnotation = function () {
        deactivateAllFunctionality();
        this.freeHandAnnotationActive = true;
        panningSurface.finger = true;
        panningSurface.cursor = 'crosshair';
    };

    this.deactivateFreeHandAnnotation = function () {
        this.freeHandAnnotationActive = false;
        panningSurface.finger = false;
        panningSurface.cursor = 'default';
    };

    this.addNewFreeHandAnnotation = function (x, y) {
        var freeHandAnnotation = new FreeHandAnnotation(self, info, components);
        canMan.addToSprites(freeHandAnnotation);
        freeHandAnnotations.push(freeHandAnnotation);
        freeHandAnnotation.annotationIndex = freeHandAnnotations.length - 1;  //Needed while removing
        freeHandAnnotation.points.push([x, y]);
    };

    this.pushPointsToFreeHandAnno = function (x, y) {
        var freeHandAnnotation = freeHandAnnotations[freeHandAnnotations.length - 1];
        freeHandAnnotation.points.push([x, y]);
    };

    this.completeFreeHandAnno = function () {
        var freeHandAnnotation = freeHandAnnotations[freeHandAnnotations.length - 1],
            annotationHeight = 84, //Approximate
            additionalDeflection = 80; //When screen goes off the screen

        freeHandAnnotation.draggable = true;
        freeHandAnnotation.finger = true;
        freeHandAnnotation.panelX = freeHandAnnotation.points[0][0] + freeHandAnnotation.deflectionX;
        freeHandAnnotation.panelY = freeHandAnnotation.points[0][1] + freeHandAnnotation.deflectionY;

        //If position goes off the screen
        if (freeHandAnnotation.panelX < 0) {
            freeHandAnnotation.panelX = freeHandAnnotation.points[0][0] -
                freeHandAnnotation.deflectionX / 2;
        }
        if (freeHandAnnotation.panelY > (MAINCANVAS.canvasProp.screenHeight - annotationHeight)) {
            freeHandAnnotation.panelY = freeHandAnnotation.points[0][1] -
                (freeHandAnnotation.deflectionY + additionalDeflection);
        }

        self.deactivateFreeHandAnnotation();

        var hamImagePosition = self.getHamImageXY(),
            showing72Dpi = self.seven2DpiInfo.showing,
            ratio = Constants.hundredPercentDpi / info.currentDpi,
            stickyNote = {
                drawnAtDpi: Number(info.currentDpi).toFixed(4) + ':' + hamImageContainer.rotateAngle,
                pinheadType: "FREEHAND_PINHEAD"
            },
            points = freeHandAnnotation.points,
            freehandPoints = '',
            arrayX = [],
            arrayY = [];

        //Find minimum and then subtract
        for (var i = 0, length = points.length; i < length; i++) {
            var firstPoint = points[i][0],
                secondPoint = points[i][1];
            arrayX.push(firstPoint);
            arrayY.push(secondPoint);
        }

        var minX = Ext.Array.min(arrayX),
            minY = Ext.Array.min(arrayY);

        //Reverse rotate as we need to save at 0 degree and then convert to 72 dpi
        var minXY = UTILITY.getRotatedPoint(-hamImageContainer.rotateAngle,
            canvas, minX, minY),
            panelXY = UTILITY.getRotatedPoint(-hamImageContainer.rotateAngle,
                canvas, freeHandAnnotation.panelX, freeHandAnnotation.panelY);

        //Generate freehandpoints
        for (i = 0, length = points.length; i < length; i++) {
            firstPoint = (points[i][0]) - minX;
            secondPoint = (points[i][1]) - minY;
            freehandPoints += firstPoint.toFixed(0) + ',' + secondPoint.toFixed(0) + ':';
        }

        stickyNote.pinHeadX = showing72Dpi.x + (minXY[0] - hamImagePosition[0]) * ratio;
        stickyNote.pinHeadY = showing72Dpi.y + (minXY[1] - hamImagePosition[1]) * ratio;
        stickyNote.stickyX = showing72Dpi.x + (panelXY[0] - hamImagePosition[0]) * ratio;
        stickyNote.stickyY = showing72Dpi.y + (panelXY[1] - hamImagePosition[1]) * ratio;

        freehandPoints = freehandPoints.slice(0, freehandPoints.length - 1);
        stickyNote.freehandPoints = freehandPoints;
        freeHandAnnotation.stickyNote = stickyNote;

        var annotationPanel = Ham.application.getController('HamController').addNewAnnotation(stickyNote, self);
        freeHandAnnotation.panelWidth = annotationPanel.width / 2;
        freeHandAnnotation.halfPanelX = freeHandAnnotation.panelX + freeHandAnnotation.panelWidth;

        var annoBtn = Ext.ComponentQuery.query('hamviewport button[name=addFreeHandAnnotation]')[0];
        annoBtn.setPressed(false);
        annoBtn.customPressed = false;

        canMan.draw();
    };

    this.addFreeHandAnnotation = function (stickyNote, annotationWidth) {
        var freeHandAnnotation = new FreeHandAnnotation(self, info, components),
            freehandPoints = stickyNote.freehandPoints.split(':'),
            hamImagePosition = self.getHamImageXY(),
            ratio = info.currentDpi / Constants.hundredPercentDpi,
            showing72Dpi = self.seven2DpiInfo.showing,
            pinHeadX = hamImagePosition[0] + Number(stickyNote.pinHeadX) * ratio - showing72Dpi.x * ratio,
            pinHeadY = hamImagePosition[1] + Number(stickyNote.pinHeadY) * ratio - showing72Dpi.y * ratio,
            drawnParts = stickyNote.drawnAtDpi.split(":"),
            drawnDpi = drawnParts[0],
            drawnAngle = drawnParts[1],
            drawnRatio = info.currentDpi / drawnDpi;

        freeHandAnnotation.visible = self.annotationShow;
        freeHandAnnotation.annotationIndex = freeHandAnnotations.length - 1;  //Needed while removing
        freeHandAnnotation.panelWidth = annotationWidth / 2;
        freeHandAnnotation.draggable = (stickyNote.createdBy === Constants.userInfo.userId)
            && self.canvasId == 'main-canvas'
            && Constants.userInfo.readOnly != 'true';
        freeHandAnnotation.finger = freeHandAnnotation.draggable;
        freeHandAnnotation.lineStroke = drawnParts[2] || freeHandAnnotation.lineStroke;

        for (var i = 0, length = freehandPoints.length; i < length; i++) {
            var parts = freehandPoints[i].split(',');

            //Rotate from pinHeadXY on the basis of drawn angle
            var rotatedPoint = UTILITY.getRotatedPoint(-drawnAngle, { width: 2 * pinHeadX, height: 2 * pinHeadY },
                pinHeadX + Number(parts[0]) * drawnRatio, pinHeadY + Number(parts[1]) * drawnRatio);

            freeHandAnnotation.points.push([rotatedPoint[0], rotatedPoint[1]]);
        }
        freeHandAnnotation.stickyNote = stickyNote;
        freeHandAnnotation.panelX = Number(stickyNote.stickyX) * ratio + hamImagePosition[0];
        freeHandAnnotation.panelY = Number(stickyNote.stickyY) * ratio + hamImagePosition[1];
        freeHandAnnotation.halfPanelX = freeHandAnnotation.panelX + freeHandAnnotation.panelWidth;

        canMan.addToSprites(freeHandAnnotation);
        freeHandAnnotations.push(freeHandAnnotation);
        canMan.draw();
    };

    /**
    * Functionality: Call apis to refresh everything on the viewport except navigator
    * @params: {number}dpi
    * @return: none
    */
    this.refresh = function (dpi, successFn) {
        // Ham.application.getController('HamController').getZoomedImage(self.seven2DpiInfo.showing.x,
        //     self.seven2DpiInfo.showing.y, self.seven2DpiInfo.showing.width,
        //     self.seven2DpiInfo.showing.height, dpi || info.currentDpi, self, successFn);
    };

    /**
    * Functionality: Pan main canvas on Navigator's blue rectangle drag event
    * @params: none
    * @return: none
    */
    this.panOnBlueRectDrag = function () {
        hamImageContainer.imageLoaded = false;
        panningSurface.updateView();
        self.updateStickyPosition();
        self.init();
    };

    /**
    * Functionality: Update densitometer by making api call
    * @params: none
    * @return: none
    */
    this.updateDensitometer = function () {
        densitometerCrossHair.dropEvent();
    }

    this.deactivateAllFunctionality = function () {
        deactivateAllFunctionality();
    };

    this.init = function () {
        canMan.draw();
    };

    /**
    * Functionality: Full screen the canvas
    * @params: {Function} successFn, {Object} extraObj
    * @return: none
    */
    this.fitToCanvas = function (successFn, extraObj) {

        info.currentDpi = info.baseDpi;
        hamImageContainer.rotateAngle = 0;

        if (canvasId === 'main-canvas') {
            fitMainCanvas();
        }
        else {
            fitCompareCanvas(successFn, extraObj);
        }

        hamImageContainer.resetZoomImage();
        deactivateAllFunctionality();
        panningSurface.activate();
        info.lastImageParams = {};
        self.updateStickyPosition();
        canMan.draw();

        //Update Navigator for main canvas only
        if (self.canvasId === 'main-canvas') {
            Ham.application.getController('HamController').
                setSliderValue(100 / Constants.hundredPercentDpi * info.baseDpi);
        }
    };

    /**
    * Functionality: Fit Main canvas
    * @params: none
    * @return: none
    */
    function fitMainCanvas() {
        self.seven2DpiInfo.showing = {
            width: self.seven2DpiInfo.width,
            height: self.seven2DpiInfo.height,
            x: 0,
            y: 0
        };
        hamImageContainer.setDimension('fit');
        hamImageContainer.imageLoaded = true;
        UTILITY.stopAjaxRequest();
    }

    /**
    * Functionality: Fit compare canvas
    * @params: {Function} successFn, {Object} extraObj
    * @return: none
    */
    function fitCompareCanvas(successFn, extraObj) {
        hamImageContainer.imageLoaded = false;

        //Set initial padding for the image
        hamImageContainer.x = hamImageContainer.padding.left = MAINCANVAS.components.hamImageContainer.padding.left;
        hamImageContainer.y = hamImageContainer.padding.top = MAINCANVAS.components.hamImageContainer.padding.top;

        var scalingFactor = MAINCANVAS.info.baseDpi / info.baseDpi,
            fitObj = hamImageContainer.zooming.fit,
            availableWidth = self.canvasProp.screenWidth - hamImageContainer.x,
            availableHeight = self.canvasProp.screenHeight - hamImageContainer.y,
            zoomedImageWidth = self.xDelta * MAINCANVAS.info.baseDpi,
            zoomedImageHeight = self.yDelta * MAINCANVAS.info.baseDpi;

        self.info.currentDpi = MAINCANVAS.info.baseDpi;

        //Zoomed image width/height will never exceed available screen size
        if (zoomedImageWidth > availableWidth) {
            zoomedImageWidth = availableWidth;
        }
        if (zoomedImageHeight > availableHeight) {
            zoomedImageHeight = availableHeight;
        }

        //Measure image coordinates that we are going to show
        fitObj.x = 0;
        fitObj.y = 0;
        fitObj.width = availableWidth / scalingFactor;
        fitObj.height = availableHeight / scalingFactor;
        fitObj.screen.x = hamImageContainer.padding.left;
        fitObj.screen.y = hamImageContainer.padding.top;

        if (fitObj.width > self.baseDpiInfo.width) {
            fitObj.width = self.baseDpiInfo.width;
        }

        if (fitObj.y > self.baseDpiInfo.height) {
            fitObj.height = self.baseDpiInfo.height;
        }

        fitObj.screen.width = fitObj.width / self.info.baseDpi * info.currentDpi;
        fitObj.screen.height = fitObj.height / self.info.baseDpi * info.currentDpi;

        self.update72DpiInfo(fitObj, info.baseDpi);

        //Refresh to get zoomed image
        self.refresh(undefined, function () {

            //Set to fix initial panning issue. As this width/height is used in
            //measureZoomedImageDimension function of Panning
            info.lastImageParams.width = zoomedImageWidth / info.currentDpi * Constants.hundredPercentDpi;
            info.lastImageParams.height = zoomedImageHeight / info.currentDpi * Constants.hundredPercentDpi;

            //Load compare stickies initially
            successFn && successFn(extraObj);
        });
    }

    //Components
    var hamImageContainer,
        zoomRectangle,
        panningSurface,
        ruler,
        rulerEastResizer,
        rulerWestResizer,
        rulerNorthResizer,
        rulerSouthResizer,
        densitometerCrossHair,
        circularAnnotations = [],
        freeHandAnnotations = [];

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    hamImageContainer = new HamImageContainer(this, info, components);
    canMan.addToSprites(hamImageContainer);
    components.hamImageContainer = hamImageContainer;

    densitometerCrossHair = new DensitometerCrossHair(this, info, components);
    canMan.addToSprites(densitometerCrossHair);
    components.densitometerCrossHair = densitometerCrossHair;

    zoomRectangle = new ZoomRectangle(this, info, components);
    canMan.addToSprites(zoomRectangle);
    components.zoomRectangle = zoomRectangle;

    ruler = new Ruler(this, info, components);
    canMan.addToSprites(ruler);
    components.ruler = ruler;

    rulerEastResizer = new RulerVerticalResizer(this, info, components);
    rulerEastResizer.side = 'east';
    canMan.addToSprites(rulerEastResizer);
    components.rulerEastResizer = rulerEastResizer;

    rulerWestResizer = new RulerVerticalResizer(this, info, components);
    rulerWestResizer.side = 'west';
    canMan.addToSprites(rulerWestResizer);
    components.rulerWestResizer = rulerWestResizer;

    rulerNorthResizer = new RulerHorizontalResizer(this, info, components);
    rulerNorthResizer.side = 'north';
    canMan.addToSprites(rulerNorthResizer);
    components.rulerNorthResizer = rulerNorthResizer;

    rulerSouthResizer = new RulerHorizontalResizer(this, info, components);
    rulerSouthResizer.side = 'south';
    canMan.addToSprites(rulerSouthResizer);
    components.rulerSouthResizer = rulerSouthResizer;

    panningSurface = new PanningSurface(this, info, components);
    canMan.addToSprites(panningSurface);
    components.panningSurface = panningSurface;

    function init() {
        // var hamController = Ham.application.getController('HamController');
        var successFn = function (currentCanvas, extraObj) {

            //If compare mode has been changed then dont proceed
            // if (extraObj.compareActivated == Constants.compare.activated) {
            //     hamController.loadStickies(currentCanvas, UTILITY.startCollaboration);
            //     if (canvasId == 'main-canvas') {
            //         Ham.application.unmaskViewport();
            //     }
            //     success();
            // }
            success();
        }
        imageParams && self.setCanvasImage(imageParams, 'fit', successFn, {
            compareActivated: Constants.compare.activated
        });
        canMan.draw();
    }

    init();
}