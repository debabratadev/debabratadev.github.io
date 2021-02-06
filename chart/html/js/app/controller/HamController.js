/*
Creation date: 7-21-2014
Purpose:  Controller for Ham main page is defined here .
Created By : Opal.
*/

Ext.define('Ham.controller.HamController', {
    extend: 'Ext.app.Controller',

    //List of views
    views: [
        'HamViewport',
        'LeftDrawer',
        'Navigator',
        'Annotation',
        'ColourPalette',
        'StickyComment'
    ],

    //List of stores
    stores: [
        'Separations',
        'Compare',
        'Comment'
    ],

    //List of models
    models: [
        'Separation',
        'Compare',
        'Comment'
    ],

    //List of reference
    refs: [],

    // this function called first when page loads
    init: function () {
        debugger
        this.loadOpalV3Url();
        this.control({
            'hamviewport panel[name=main-canvas]': {
                boxready: function (container) {
                    this.createThumbnail();
                    Constants.pdfFile = fileName;
                    this.loadHamImage(container, fileName, Constants.userInfo.stageId, false, null, {
                        compareActivated: Constants.compare.activated
                    });
                }
            },
            'hamviewport toolbar button[name=fullScreenBtn]': {
                click: this.resetHam
            },
            'leftdrawer > panel': {
                tabclick: this.toggleDrawer
            },
            'navigator slider[name=navSlider]': {
                dragstart: this.setupLocalZoom,
                drag: this.performZoomLocal,
                //                dragend:function(slider) {
                //                    this.performRemoteZoom(slider.getValue());
                //                    return false;
                //                },
                changecomplete: function (slider) {
                    this.setupLocalZoom();
                    this.performZoomLocal(slider);
                    this.performRemoteZoom(slider.getValue());
                }
            },
            'button[name=densitometerLeft]': {
                click: this.densitometerLeft
            },
            'button[name=densitometerRight]': {
                click: this.densitometerRight
            }
        });
    },

    //Have different position object for main and compare
    //Insert position of annotations/stickies
    mainCanvasPos: {
        circular: 0,
        freeHand: 0
    },

    compareCanvasPos: {
        circular: 0,
        freeHand: 0
    },

    //Get updated stickyNotes
    stickyNotes: {},

    /**
   * Functionality: Make create Thumbnail Api
   * @params: none
   * @return: none
   */
    createThumbnail: function () {
        var params = {
            filename: fileName,
            pageNo: 0,
            separationColor: Constants.separationColor,
            dir: null,
            x: 0.0,
            y: 0.0,
            width: 128.0,
            height: 128.0,
            autoResize: true,
            dpi: 0
        };
        UTILITY.makeApiCallWithoutMask('CreateThumbnail', true, 'pdf', {}, params, 'Get',
            function () { }, {});
    },

    /**
    * Functionality: Get Info about ham Image and load it
    * @params: {object} canvasContainer, {String} pdfFile, {Int} stageId,
    *           {String} dontLoadDocument, {Function} successFunction, {Object} extraObj,
    *            {function) loadCompareFn
    * @return: none
    */
    loadHamImage: function (canvasContainer, pdfFile, stageId, dontLoadDocument,
        successFunction, extraObj, loadCompareFn) {
        var hamViewport = canvasContainer.up('hamviewport');

        //If compare was activated previously then don't load main canvas
        if (hamViewport.dontLoadHam && !successFunction) {
            this.loadDocuments();
            return;
        }
        var controller = this,
            canvasWidth = canvasContainer.getWidth(),
            canvasHeight = canvasContainer.getHeight(),
            params = {
                filename: pdfFile,
                pageNo: Constants.pageNumber,
                separationColor: Constants.separationColor,
                dir: null,
                x: 0.0,
                y: 0.0,
                width: canvasWidth,
                height: canvasHeight,
                autoResize: true,
                dpi: 0,
                type: 'info'
            };

        UTILITY.makeApiCallWithMask('GetImageInfo', true, 'pdf', {}, params, 'Get',
            '', languagePack.loadingDefaultmsg,
            function (response) {

                if (Ext.isEmpty(response.responseText)) {

                    //Unmask as we don't have right side pdf
                    UTILITY.unmaskViewportForCompare();
                    return;
                }

                //If compare mode has been changed then dont proceed
                if (extraObj.compareActivated != Constants.compare.activated) {
                    return;
                }

                var imgMetaData = response.responseText,
                    parts = imgMetaData.split(':'),
                    dpi = parts[0],
                    img = new Image();

                //As compare also routed through this function. Set only for main
                if (canvasContainer.name === "main-canvas") {
                    Constants.totalPages = parseInt(parts[1]);
                }

                params.dpi = dpi;
                params.type = 'general';

                UTILITY.loadImageWithMask(img, params, languagePack.loadingDefaultmsg,
                    function (loadedImage) {

                        //If compare mode has been changed then dont proceed
                        if (extraObj.compareActivated != Constants.compare.activated) {
                            return;
                        }

                        var imageWidth = loadedImage.width,
                            imageHeight = loadedImage.height,
                            xDelta = imageWidth / dpi,
                            yDelta = imageHeight / dpi;

                        //As compare also routed through this function. Set only for main
                        if (canvasContainer.name === "main-canvas") {
                            Constants.xDelta = xDelta;
                            Constants.yDelta = yDelta;
                        }

                        if (dpi == Constants.hundredPercentDpi) {
                            var navDpi = 0;

                            var widthDpi = canvasWidth / xDelta,
                                heightDpi = canvasHeight / yDelta;

                            if (widthDpi > heightDpi) {
                                if (widthDpi * (imageHeight / Constants.hundredPercentDpi) > canvasHeight) {
                                    navDpi = heightDpi;
                                }
                                else {
                                    navDpi = widthDpi;
                                }
                            }
                            else {
                                if (heightDpi * (imageWidth / Constants.hundredPercentDpi) > canvasWidth) {
                                    navDpi = widthDpi;
                                }
                                else {
                                    navDpi = heightDpi;
                                }
                            }

                            params.dpi = navDpi;
                            params.autoResize = false;
                        }

                        //Compare callback
                        if (successFunction) {
                            successFunction(params, extraObj);
                            return;
                        }

                        canvasContainer.width = canvasContainer.getWidth();
                        canvasContainer.height = canvasContainer.getHeight();

                        //Calculate image width and height
                        var scalingFactor = params.dpi / Constants.hundredPercentDpi;
                        params.width = canvasContainer.width / scalingFactor;
                        params.height = canvasContainer.height / scalingFactor;

                        //As we are calculating width and height autoResize will always be true
                        params.autoResize = false;

                        var successFn = function () {
                            loadCompareFn && loadCompareFn();

                            //If not instantiated yet
                            if (!NAVIGATORCANVAS) {
                                controller.loadNavigationPanel();
                            }
                            else {
                                NAVIGATORCANVAS.reset();
                                NAVIGATORCANVAS.refresh();
                            }

                            //Load documents at the end
                            if (!dontLoadDocument) {
                                controller.loadDocuments();
                            }
                        };

                        MAINCANVAS = new CanvasHam(canvasContainer, params, 'main-canvas', pdfFile, stageId, successFn);

                        //If annotation hide button is pressed then have a reference
                        var hideAnnoBtn = Ext.ComponentQuery.query('button[name=hideAnnotation]')[0];
                        MAINCANVAS.annotationShow = !hideAnnoBtn.customPressed;
                        controller.setInitialZoomPercent(params.dpi);
                    }
                );
            }
        );
    },

    /**
    * Functionality: Call api to get sticky note data
    * @params: {Object} canvas, {Function} success function for main canvas
    * @return: none
    */
    loadStickies: function (canvas, success) {
        var controller = Ham.application.getController('HamController');
        var params = {},
            insertPos = canvas.canvasId == 'main-canvas' ?
                controller.mainCanvasPos : controller.compareCanvasPos;

        params.taskId = Constants.userInfo.taskId;
        params.userId = Constants.userInfo.userId;
        params.pageNumber = Constants.pageNumber;
        params.lineId = Constants.userInfo.lineId;
        params.stageId = canvas.stageId;
        controller.removeOldStickies(canvas);

        UTILITY.makeApiCallWithMask(Constants.actionUrl.loadStickiesUrl, true, 'soap', {}, params, '', '', 'Get',
            function (jData) {
                controller.removeOldStickies(canvas);
                var stickyNotes = jData.stickyNotes,
                    annotationInfo = Constants.userInfo.annotationInfo;

                for (var i = 0; i < stickyNotes.length; i++) {
                    var annotation = controller.addAnnotation(canvas, Constants.colorData.colors, stickyNotes[i]);

                    if (stickyNotes[i].stickyNote.pinheadType == 'CIRCLE_PINHEAD') {
                        canvas.addCircularAnnotation(stickyNotes[i].stickyNote, annotation.width);
                        annotation.insertPosition = insertPos.circular++;
                    }
                    else {
                        canvas.addFreeHandAnnotation(stickyNotes[i].stickyNote, annotation.width);
                        annotation.insertPosition = insertPos.freeHand++;
                    }

                    //Current user Info
                    annotation.userName = annotationInfo.userName;
                    annotation.userRole = annotationInfo.userRole;
                    annotation.backgroundColor = annotationInfo.backgroundColor;
                }
                if (canvas.canvasId == 'main-canvas') {
                    controller.updateCommentTab(stickyNotes);
                }

                var hideAnnoBtn = Ext.ComponentQuery.query('button[name=hideAnnotation]')[0];
                if (hideAnnoBtn.customPressed) {
                    hideAnnoBtn.customPressed = false;
                    hideAnnoBtn.handler(hideAnnoBtn);
                }

                //call collaboration
                success && success();

                //Fix iPad scroll issue when annotation is placed out of the screen area
                window.scrollTo(0, 0);
                setTimeout(function () {
                    window.scrollTo(0, 0);
                }, 200);
            }
        );
    },

    /**
    * Functionality: Remove old stickies
    * @params: {Object} currentCanvas
    * @return: none
    */
    removeOldStickies: function (canvas) {
        var insertPos = canvas.canvasId == 'main-canvas' ?
            this.mainCanvasPos : this.compareCanvasPos;
        insertPos.circular = 0;
        insertPos.freeHand = 0;
        canvas.removeAllAnnotations();
        var annotations = Ext.ComponentQuery.query('annotation');
        annotations.forEach(function (annotation) {
            if (annotation.annoType == canvas.canvasId) {
                annotation.destroy();
            }
        });
    },

    /**
    * Functionality: Add annotaion panels
    * @params: {Object} colorData, {Object} stickyNoteObj
    * @return: none
    */
    addAnnotation: function (canvas, colorData, stickyNoteObj) {
        var stickyNote = stickyNoteObj.stickyNote,
            comments = stickyNoteObj.comments,
            hamImagePosition = canvas.getHamImageXY(),
            canvasPosition = Ext.fly(canvas.canvasId).getXY(),
            ratio = (canvas.info.currentDpi || canvas.baseImageParams.dpi) /
                Constants.hundredPercentDpi,
            relativeStickyX = Number(stickyNote.stickyX) * ratio,
            relativeStickyY = Number(stickyNote.stickyY) * ratio;

        var config = {
            x: canvasPosition[0] + hamImagePosition[0] + relativeStickyX,
            y: canvasPosition[1] + hamImagePosition[1] + relativeStickyY
        };

        if (canvas.canvasId !== 'main-canvas' ||
            Constants.userInfo.readOnly === 'true') {
            config.tools = [];
        }

        var annotation = Ext.create('Ham.view.Annotation', config);

        annotation.annoType = canvas.canvasId;
        annotation.show();
        var color;

        for (var i = 0, length = comments.length; i < length; i++) {
            annotation.userName = comments[i].userName;
            annotation.userRole = comments[i].gate;
            annotation.comment = comments[i].value;
            for (var j = 0; j < colorData.length; j++) {
                if (comments[i].gate === colorData[j].systemRoleName) {
                    color = colorData[j].commentColour;
                }
            }
            annotation.backgroundColor = color;
            annotation.addPanel(false, comments[i]);
        }

        annotation.stickyInfo = stickyNoteObj;
        stickyNote.stageId = Constants.userInfo.stageId;
        stickyNote.lineId = Constants.userInfo.lineId;
        stickyNote.taskId = Constants.userInfo.taskId;
        stickyNote.userId = Constants.userInfo.userId;
        stickyNote.pageNumber = Constants.pageNumber;

        //Hide if it is off from current canvas bounding area
        if (Constants.compare.activated) {
            var xPos = UTILITY.imulateAnnotationHiding(annotation, annotation.getX());
            annotation.setPosition(xPos, annotation.getY());
        }

        return annotation;
    },

    /**
    * Functionality: Update Annotation window position
    * @params: none
    * @return: none
    */
    updateAnnotationPosition: function (canvas) {
        var annotations = Ext.ComponentQuery.query('annotation'),
            hamImagePosition = canvas.getHamImageXY(),
            canvasPosition = Ext.fly(canvas.canvasId).getXY(),
            ratio = canvas.info.currentDpi / Constants.hundredPercentDpi,
            showing72Dpi = canvas.seven2DpiInfo.showing,
            canvasProp = canvas.canvasProp.canvas,
            rotateAngle = canvas.currentRotationAngle();

        for (var i = 0, length = annotations.length; i < length; i++) {
            var annotation = annotations[i],
                stickyNote = annotation.stickyInfo.stickyNote,
                relativeStickyX,
                relativeStickyY;

            if (annotation.annoType == canvas.canvasId) {
                relativeStickyX = Number(stickyNote.stickyX) * ratio - showing72Dpi.x * ratio;
                relativeStickyY = Number(stickyNote.stickyY) * ratio - showing72Dpi.y * ratio;

                var newPoint = UTILITY.getRotatedPoint(rotateAngle, canvasProp,
                    hamImagePosition[0] + relativeStickyX, hamImagePosition[1] + relativeStickyY);

                var xPos = canvasPosition[0] + newPoint[0],
                    yPos = canvasPosition[1] + newPoint[1];

                if (UTILITY.isCompareActivated()) {
                    xPos = UTILITY.imulateAnnotationHiding(annotation, xPos);
                }
                else {
                    var width = annotation.getWidth(),
                        height = annotation.getHeight();

                    if ((xPos + width > 0 && xPos - width < Constants.screenWidth) &&
                        (yPos + height > 0 && yPos < Constants.screenHeight)) {
                        annotation.el.dom.style.visibility = "visible";
                    }
                    else {
                        annotation.el.dom.style.visibility = "hidden";
                    }
                }

                //Use native technique to update position rather than using Extjs's technique
                annotation.el.dom.style.left = xPos + 'px';
                annotation.el.dom.style.top = yPos + 'px';
            }
        }
    },

    /**
    * Functionality: Make api call to update sticky position
    * @params: {Object} stickyInfo
    * @return: none
    */
    updateAnnotationPositionRemote: function (stickyInfo) {

        //Make call only if it is created
        if (stickyInfo.stickyId) {
            UTILITY.makeApiCallWithMask(Constants.actionUrl.updateStickiesUrl, true, 'soap', {},
                stickyInfo, '', '', 'Post',
                function (jData) {

                }
            );
        }
    },

    /**
    * Functionality: Make api to remove annotation
    * @params: {Object} stickyNote, {Function} successFn
    * @return: none
    */
    removeAnnotaionRemote: function (stickyNote, successFn) {
        var controller = this;

        //If stickyId exist otherwise it is newly created. So don't worry just remove
        if (stickyNote.stickyId) {
            var params = {
                stickyId: stickyNote.stickyId,
                taskId: Constants.userInfo.taskId,
                userId: Constants.userInfo.userId
            },
                url = Constants.actionUrl.deleteStickiesUrl + '?' + Ext.Object.toQueryString(params);

            UTILITY.makeApiCallWithMask(url, true, 'soap', {}, {}, '', '', 'Delete',
                function (jData) {
                    successFn();

                    var refreshBtn = Ext.ComponentQuery.query('leftdrawer tool[name=commentRefresh]')[0];
                    refreshBtn && refreshBtn.enable();
                }
            );
        }
        else {
            successFn();
        }
    },

    /**
    * Functionality: Make api to remove annotation
    * @params: {Object} commentInfo, {Function} successFn
    * @return: none
    */
    removeCommentRemote: function (commentInfo, successFn) {

        //New one without any id/value
        if (Ext.isEmpty(commentInfo.id)) {
            successFn();
            return;
        }

        var params = {
            commentId: commentInfo.id,
            taskId: Constants.userInfo.taskId,
            userId: Constants.userInfo.userId
        },
            url = Constants.actionUrl.deleteCommentUrl + '?' + Ext.Object.toQueryString(params);
        UTILITY.makeApiCallWithMask(url, true, 'soap', {}, {}, '', '', 'Delete',
            function (jData) {
                successFn();
                var refreshBtn = Ext.ComponentQuery.query('leftdrawer tool[name=commentRefresh]')[0];
                refreshBtn && refreshBtn.enable();
            }
        );
    },

    /**
    * Functionality: Add a new annotaion panels
    * @params: {Object} stickyInfo
    * @return: none
    */
    addNewAnnotation: function (stickyNote, canvas) {
        var stickyInfo = {
            stickyNote: stickyNote,
            comments: []
        },
            controller = this,
            showing72Dpi = canvas.seven2DpiInfo.showing,
            hamImagePosition = canvas.getHamImageXY(),
            canvasPosition = Ext.fly(canvas.canvasId).getXY(),
            ratio = canvas.info.currentDpi / Constants.hundredPercentDpi,
            canvasPro = canvas.canvasProp.canvas,
            rotateAngle = canvas.currentRotationAngle(),
            insertPos = canvas.canvasId == 'main-canvas' ?
                controller.mainCanvasPos : controller.compareCanvasPos;

        var panelXY = UTILITY.getRotatedPoint(rotateAngle,
            canvasPro, hamImagePosition[0] + (stickyNote.stickyX - showing72Dpi.x) * ratio,
            hamImagePosition[1] + (stickyNote.stickyY - showing72Dpi.y) * ratio);

        var annotation = Ext.create('Ham.view.Annotation', {
            x: canvasPosition[0] + panelXY[0],
            y: canvasPosition[1] + panelXY[1]
        });

        var commentInfo = {
            "gate": Constants.userInfo.annotationInfo.userRole,
            "userId": Constants.userInfo.userId,
            "userName": Constants.userInfo.annotationInfo.userName
        }

        annotation.show();

        //Current user Info
        annotation.userName = Constants.userInfo.annotationInfo.userName;
        annotation.userRole = Constants.userInfo.annotationInfo.userRole;
        annotation.backgroundColor = Constants.userInfo.annotationInfo.backgroundColor;
        annotation.annoType = canvas.canvasId;
        annotation.addPanel(true, commentInfo);

        annotation.stickyInfo = stickyInfo;

        if (stickyNote.pinheadType == 'CIRCLE_PINHEAD') {
            annotation.insertPosition = insertPos.circular++;
        }
        else {
            annotation.insertPosition = insertPos.freeHand++;
        }

        stickyNote.createdBy = Constants.userInfo.userId;
        stickyNote.stageId = Constants.userInfo.stageId;
        stickyNote.lineId = Constants.userInfo.lineId;
        stickyNote.taskId = Constants.userInfo.taskId;
        stickyNote.userId = Constants.userInfo.userId;
        stickyNote.pageNumber = Constants.pageNumber;

        return annotation;
    },

    /**
    * Functionality: Add Comment to Sticky
    * @params: {Object} stickyInfo, {String} value
    * @return: none
    */
    addCommentToSticky: function (annotation, commentContainer, textarea, commentBox) {
        var stickyInfo = annotation.stickyInfo,
            stickyNote = stickyInfo.stickyNote,
            commentInfo = commentContainer.commentInfo;
        if (!stickyNote.stickyId) {
            UTILITY.makeApiCallWithMask(Constants.actionUrl.addStickiesUrl, false, 'soap', {},
                stickyNote, 'Post', '', '',
                function (jData) {
                    if (!Ext.isEmpty(jData)) {
                        stickyNote.stickyId = jData;
                        commentInfo.stickyId = jData;
                    }
                    else {
                        textarea.focus();
                    }
                },
                function () {
                    textarea.focus();
                }
            );
        }

        var data = {
            stickyId: stickyNote.stickyId,
            value: commentInfo.value,
            taskId: Constants.userInfo.taskId,
            userId: Constants.userInfo.userId
        }

        UTILITY.makeApiCallWithMask(Constants.actionUrl.addCommentUrl, true, 'soap', '',
            data, 'Post', '', '',
            function (jData) {
                commentInfo.id = jData;
                stickyInfo.comments.push(data);

                var refreshBtn = Ext.ComponentQuery.query('leftdrawer tool[name=commentRefresh]')[0];
                refreshBtn && refreshBtn.enable();

                textarea.setVisible(false);
                commentBox.setVisible(true);
            },
            function () {
                textarea.focus();
            }
        );
        MAINCANVAS.components.panningSurface.drag = false;
    },

    /**
    * Functionality: Update comment value of a sticky
    * @params: {Object} commentInfo
    * @return: none
    */
    updateCommentOfSticky: function (commentContainer, textarea, commentBox) {
        var commentInfo = commentContainer.commentInfo,
            data = {
                commentId: commentInfo.id,
                value: commentInfo.value,
                taskId: Constants.userInfo.taskId,
                userId: commentInfo.userId
            }

        UTILITY.makeApiCallWithMask(Constants.actionUrl.updateCommentUrl, true, 'soap', '',
            data, 'Post', '', '',
            function (jData) {
                var refreshBtn = Ext.ComponentQuery.query('leftdrawer tool[name=commentRefresh]')[0];
                refreshBtn && refreshBtn.enable();
                textarea.setVisible(false);
                commentBox.setVisible(true);
            },
            function () {
                textarea.focus();
            }
        );
    },

    /**
    * Functionality: Set zoom percent in navigator
    * @params: {Int} dpi
    * @return: none
    */
    setInitialZoomPercent: function (dpi) {
        var zoomPercent = 100 / Constants.hundredPercentDpi * dpi,
            minValue = zoomPercent <= 100 ? zoomPercent : 100;

        var slider = Ext.ComponentQuery.query('navigator')[0].down('slider');
        slider.setMinValue(minValue);
        slider.initialZoomPercent = parseInt(zoomPercent);
        this.setSliderValue(zoomPercent);
    },

    /**
    * Functionality: Reset Everything
    * @params: none
    * @return: none
    */
    resetHam: function (btn) {
        this.unPressedAllTopToolBtns();
        this.removeFooterContent();
        MAINCANVAS.fitToCanvas();
        if (UTILITY.isCompareActivated())
            COMPARECANVAS.fitToCanvas();
        NAVIGATORCANVAS.reset();
        NAVIGATORCANVAS.refresh();
    },

    /**
    * Functionality: Expand/collapse left drawer
    * @params: {object} panel
    * @return: none
    */
    toggleDrawer: function (panel) {
        this.unPressedAllTopToolBtns();
        MAINCANVAS.deactivateAllFunctionality();
        if (Constants.compare.activated) {
            COMPARECANVAS.deactivateAllFunctionality();
        }

        var tabPanel = panel.up('tabpanel');
        if (tabPanel.animCollapsed) {
            tabPanel.animExpand();
            panel.fireEvent('customexpand', panel);
        }
        else if (panel.isVisible() && !tabPanel.animCollapsed) {
            tabPanel.animCollapse();
        }
    },

    /**
    * Functionality: Set slider value with Width percentage
    * @params: {Int} widthPercentage
    * @return: none
    */
    setSliderValue: function (zoomPercentage) {
        var navigatorPanel = Ext.ComponentQuery.query('navigator')[0],
            slider = navigatorPanel.down('slider');
        slider.setValue(parseInt(zoomPercentage));
        navigatorPanel.down('box[name=zoomPercentageBox]').update(parseInt(zoomPercentage) + '%');
    },

    /**
    * Functionality: Load documents in document tab
    * @params: none
    * @return: none
    */
    loadDocuments: function () {
        var documentContaniner = Ext.ComponentQuery.query('panel[name=documentContaniner]')[0];
        documentContaniner.documentImageHeights = [];
        this.loadDocumentsRecursively(documentContaniner);
    },

    /**
    * Functionality: Load documents
    * @params: {Object} documentContaniner
    * @return: none
    */
    loadDocumentsRecursively: function (documentContaniner) {
        var hamController = this,
            totalPages = Constants.totalPages,
            startingPage = documentContaniner.loadedPages || 0,
            length = startingPage + 1;

        //If exceeds maximum
        if (length > totalPages) {
            return;
        }

        hamController.pushPreviewInDocumentTab(startingPage, length, documentContaniner,
            'checkAndRemoveLoadingImage', true, true);
    },

    /**
    * Functionality: Load blank documents which will be loaded on scroll
    * @params: {Object} documentContaniner
    * @return: none
    */
    loadBlankDocuments: function (documentContaniner) {
        var startingPage = documentContaniner.loadedPages || 0,
            length = Constants.totalPages;

        this.pushPreviewInDocumentTab(startingPage, length, documentContaniner,
            'removeLoadingImage', false, false);
    },

    /**
    * Functionality: Load documents
    * @params: {Number} startingPage, {Number} length, {Object} documentContaniner,
    *           {String} onClickFn, {Boolean} showThumbnail, {Boolean} showLoadingImage
    * @return: none
    */
    pushPreviewInDocumentTab: function (startingPage, length, documentContaniner,
        onClickFn, showThumbnail, showLoadingImage) {

        var thumbnailURL = Constants.pdfBaseUrl + 'GetImageInfo?filename=' + Constants.pdfFile +
            '&separationColor=All&dir=&x=0&y=0&width=140&height=140&autoResize=true&dpi=72.0&type=general' +
            '&loginCheckUrl=' + Constants.loginCheckUrl;

        documentContaniner.loadedPages = length;

        //Make an array of items to be pushed in documents tabpanel rather than pushing in for loop
        var items = [],
            hamController = this,
            loadingImage = Constants.hamServerPath + 'resources/images/initial-loading-image.gif',
            thumbnailSrc = '',
            loadingImageSrc = '',
            loadingImageStyle = ' style="visibility: hidden"';

        //Check to add src for image
        if (showThumbnail) {
            thumbnailSrc = ' src="' + thumbnailURL + '&pageNo={1}"';
        }
        if (showLoadingImage) {
            loadingImageSrc = ' src="' + loadingImage + '"';
            loadingImageStyle = '';
        }

        var html = '<img pageNumber={0} onload="UTILITY.' + onClickFn + '(this)"' +
            ' hidden class="x-img  x-img-default"' + thumbnailSrc +
            '"><img' + loadingImageSrc + loadingImageStyle +
            ' class="alt-preview">';

        for (var i = startingPage; i < length; i++) {
            items.push({
                xtype: 'panel',
                html: Ext.String.format(html, i, i),
                src: thumbnailURL + '&pageNo=' + i,
                border: 0,
                bodyStyle: 'background: #FBFBFB',
                cls: 'thumbnail',
                name: 'preview',
                listeners: {
                    boxready: function (comp) {
                        var element = comp.getEl();
                        element.on('click', function (event, img) {
                            hamController.loadHAMOnSelection(documentContaniner, comp, event, img);
                        });
                    }
                }
            });
            items.push({
                xtype: 'box',
                html: i + 1,
                style: 'text-align: center'
            });
        }
        documentContaniner.add(items);

        //Add selected border
        var selectedComp = documentContaniner.query('panel[name=preview]')[Constants.pageNumber];
        if (selectedComp) {
            selectedComp.addCls('img-selected');
            documentContaniner.selectComp = selectedComp;
        }
    },

    /**
    * Functionality: Load documents on scroll
    * @params: none
    * @return: none
    */
    showLoadingImageInDoc: function () {
        var previews = Ext.ComponentQuery.query('panel[name=preview]'),
            loadingImage = Constants.hamServerPath + 'resources/images/initial-loading-image.gif',
            top = Constants.topToolbarHeight + 25,
            documentContaniner = Ext.ComponentQuery.query('panel[name=documentContaniner]')[0],
            documentViewer = Ext.ComponentQuery.query('panel[name=documentViewer]')[0],
            start = documentContaniner.firstLoadedPages,
            found = undefined,
            subsequentLoadlength = start; //Take the number of pages loaded on initial load for subsequent load

        //Find the first image to load
        for (var i = start, length = previews.length; i < length; i++) {
            var preview = previews[i];
            var images = preview.el.query('img');
            if (Ext.isEmpty(images[0].src) && !Ext.isEmpty(images[1])) {
                var boxBottom = preview.getY() + preview.getHeight();
                if (boxBottom > top) {
                    found = i;
                    break;
                }
            }
        }

        //All are loaded so no need check and load
        if (!found) {
            return;
        }

        //Load minimum 10 documents/pages
        if (subsequentLoadlength < 10) {
            subsequentLoadlength = 10;
        }
        length = found + subsequentLoadlength;

        //Check for overflow
        if (length > Constants.totalPages) {
            length = Constants.totalPages;
        }

        //If some portion of preview is hidden then Scroll to the top of the
        //image/document programatically
        if (previews[found].getY() < top) {
            documentViewer.programmedScroll = true;
            documentViewer.scrollTo(0, previews[found].getOffsetsTo(documentContaniner)[1], false);
        }

        var preview,
            images;

        for (var i = found; i < length; i++) {
            preview = previews[i];
            images = preview.el.query('img');

            //Check if it is already loaded or not
            if (Ext.isEmpty(images[0].src) && !Ext.isEmpty(images[1])) {
                images[1].style.visibility = 'visible';
                images[1].src = loadingImage;

                //Show loading image for some time
                (function (image, src) {
                    setTimeout(function () {
                        image.src = src;
                    }, 200);
                })(images[0], preview.src);
            }
        }
    },

    /**
    * Functionality: Load HAM(also compare if it is ON) on selection of document
    * @params: {Object} documentPanel, {Object} comp, {Object} event, {Object} img
    * @return: none
    */
    loadHAMOnSelection: function (documentPanel, comp, event, img) {
        var hamController = this,
            loadCompareFn = UTILITY.unmaskViewportForCompare,
            compareGrid = Ext.ComponentQuery.query('leftdrawer grid[name=compareGrid]')[0],
            selections = compareGrid.getSelectionModel().getSelection();

        UTILITY.maskViewportForCompare();

        //Load compare version only when at least one record in compare is checked
        if (UTILITY.isCompareActivated() && !Ext.isEmpty(selections)) {

            //Turn off toggle if ON
            UTILITY.disableToggle();

            //Remove all stickies while switching
            var annotations = Ext.ComponentQuery.query('annotation');
            annotations.forEach(function (annotation) {
                if (annotation.annoType == 'comparehamCanvas') {
                    annotation.destroy();
                }
            });

            COMPARECANVAS.removeAllAnnotations();
            COMPARECANVAS.components.hamImageContainer.resetImage();
            COMPARECANVAS.setIdle(true);

            loadCompareFn = function () {
                var compareCanvas = Ext.ComponentQuery.query('hamviewport panel[name=comparehamCanvas]')[0];

                //Load Compare canvas image
                hamController.loadHamImage(compareCanvas, COMPARECANVAS.pdfFile, COMPARECANVAS.stageId, true,
                    UTILITY.loadCompareFitImage, {
                    compareActivated: Constants.compare.activated
                });
            };
        }

        var pageNumber = img.getAttribute('pagenumber');
        if (Ext.isEmpty(pageNumber)) {
            pageNumber = Ext.get(event.delegatedTarget).query('img')[0].getAttribute('pagenumber');
        }
        Constants.pageNumber = pageNumber;

        UTILITY.destroyMainCanvasComponents();

        var mainCanvas = Ext.ComponentQuery.query('hamviewport panel[name=main-canvas]')[0];

        hamController.loadHamImage(mainCanvas, Constants.pdfFile,
            Constants.userInfo.stageId, true, '', {
            compareActivated: Constants.compare.activated
        }, loadCompareFn);

        hamController.loadNavigationPanel();

        //Remove last selected css class
        if (documentPanel.selectComp) {
            documentPanel.selectComp.removeCls('img-selected')
        }

        //Select current component
        documentPanel.selectComp = comp;
        comp.addCls('img-selected');
    },

    /**
    * Functionality: Call api with correct coordinates to get zoomed image
    * @params: {Int} x, {Int} x, {Object} zoomProp, {Int} zoomPercent
    * @return: none
    */
    getZoomedImage: function (x, y, width, height, dpi, canvas, successFn) {
        var pdfFile = canvas.pdfFile;

        if (Ext.isEmpty(pdfFile)) {
            return;
        }
        var params = {
            filename: pdfFile,
            pageNo: Constants.pageNumber,

            //On compare separation is not applied
            separationColor: canvas.canvasId == 'main-canvas' ? Constants.separationColor : 'all',
            dir: null,
            x: x,
            y: y,
            width: width,
            height: height,
            autoResize: false,
            dpi: dpi,
            type: 'general'
        };
        canvas.setCanvasImage(params, 'zoom', successFn);
    },

    /**
    * Functionality : This method is fired when slider value is change ,
    * and it fetch the image from the remote server
    * @param : slider
    * @return: none
    */
    performRemoteZoom: function (sliderValue) {
        if (!Ext.isEmpty(MAINCANVAS)) {
            var sliderDPI = .72 * sliderValue,
                mainSeven2Info = MAINCANVAS.seven2DpiInfo.showing,
                updateDensitometer;

            if (UTILITY.isDensitometerAcive()) {
                updateDensitometer = MAINCANVAS.updateDensitometer;
            }

            this.getZoomedImage(mainSeven2Info.x, mainSeven2Info.y, mainSeven2Info.width,
                mainSeven2Info.height, sliderDPI, MAINCANVAS, updateDensitometer);

            if (UTILITY.isCompareActivated()) {
                var compSeven2Info = COMPARECANVAS.seven2DpiInfo.showing;
                this.getZoomedImage(compSeven2Info.x, compSeven2Info.y, compSeven2Info.width,
                    compSeven2Info.height, sliderDPI, COMPARECANVAS);
            }
        }
    },

    /**
    * Functionality : Do all necessary things on slider drag start
    * @param : none
    * @return: none
    */
    setupLocalZoom: function () {
        if (!Ext.isEmpty(MAINCANVAS)) {
            MAINCANVAS.setupLocalZoom();
            if (UTILITY.isCompareActivated()) {
                COMPARECANVAS.setupLocalZoom();
            }
        }
    },

    /**
    * Functionality : This method is fired when slider value is drag ,
    * and it fetch the image from the remote server
    * @param : slider
    * @return: none
    */
    performZoomLocal: function (slider) {
        var zoomPercentageBox = slider.up('navigator').down('box[name=zoomPercentageBox]');
        zoomPercentageBox.update(slider.getValue().toFixed(0) + '%');
        var sliderValue = slider.getValue();
        if (!Ext.isEmpty(MAINCANVAS)) {
            MAINCANVAS.performLocalZoom(sliderValue);
        }
        if (UTILITY.isCompareActivated()) {
            COMPARECANVAS.performLocalZoom(sliderValue);
        }
    },

    /**
    * Functionality : Select all the separation color
    * @param : none
    * @return: none
    */
    selectAllSeparationRecord: function () {
        var grid = Ext.ComponentQuery.query('panel[name=separationGrid]')[0];
        if (grid.getStore().getRange().length != 0) {
            var selModel = grid.getSelectionModel();

            selModel.setSelectionMode('multi');
            selModel.selectAll(true);
            selModel.setSelectionMode('SINGLE');

            grid.down('button[name=selectAll]').disable();
        }
    },
    /**
    * Functionality : load the separation panel grid
    * @param : none
    * @return: none
    */
    loadSeparationGrid: function () {
        var thisInstance = this;
        var params = {
            filename: Constants.pdfFile,
            pageNo: Constants.pageNumber,
            separationColor: 'info',
            dir: null,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            autoResize: true,
            dpi: 0,
            type: 'info'
        };
        UTILITY.makeApiCallWithMask('GetImageInfo', true, 'pdf', {}, params,
            'Get',
            '',
            languagePack.loadingDefaultmsg,
            function (response) {
                var grid = Ext.ComponentQuery.query('panel[name=separationGrid]')[0];
                var separationStore = grid.getStore();
                var responseText = response.responseText;
                var color = responseText.split('&');
                var skipAll = true;

                for (var i = 0; i < color.length; i++) {
                    var colorDetail = color[i];

                    if (colorDetail.split(',').length > 1) {
                        if (skipAll) {
                            skipAll = false;
                            continue;
                        }

                        var colorName = colorDetail.split(',')[1];
                        var colorCode = colorDetail.split(',')[2] + ','
                            + colorDetail.split(',')[3] + ','
                            + colorDetail.split(',')[4] + ','
                            + colorDetail.split(',')[5];

                        separationStore.add({
                            colourCode: colorCode,
                            colourName: colorName
                        });
                    }
                }
                thisInstance.selectAllSeparationRecord();
                grid.getView().refresh();
            });
    },
    /**
    * Functionality : Remove the densitomer panel from the footer
    * @param : none
    * @return: none
    */
    hideDensitomerPanel: function () {
        var densitomerBox = Ext.ComponentQuery.query('container[name=densitomerBox]')[0];
        densitomerBox && densitomerBox.removeAll();
    },

    /**
    * Functionality : Remove all footer container content
    * @param : none
    * @return: none
    */
    removeFooterContent: function () {
        var footerContainer = Ext.ComponentQuery.query('container[name=footerContainer]')[0];
        footerContainer.removeAll();
    },

    /**
    * Functionality : load the densitomer panel with there respective percentation
    * @param : pressedX {View image selected X}, pressedY{View image selected Y},
    *  x {image view x}, y {image view y}, width {image view width}, height{image view height},
    *  dpi{current dpi}
    * @return: none
    */
    showDensitomerPanel: function (pressedX, pressedY, x, y, width, height, dpi, selectedColor) {
        var thisInstance = this;
        thisInstance.hideDensitomerPanel();
        var params = {
            filename: Constants.pdfFile,
            pageNo: Constants.pageNumber,
            separationColor: 'All',
            dir: null,
            x: x ? x : 0,
            y: y ? y : 0,
            width: width ? width : 0,
            height: height ? height : 0,
            autoResize: dpi ? false : true,
            dpi: dpi,
            type: 'loadDensityString',
            pressedX: pressedX ? pressedX : 0,
            pressedY: pressedY ? pressedY : 0
        };
        UTILITY.makeApiCallWithMask('GetImageInfo', true, 'pdf', {}, params,
            'Get',
            '',
            languagePack.loadingDefaultmsg,
            function (response) {
                var hamViewport = Ext.ComponentQuery.query('hamviewport')[0],
                    footerContainer = hamViewport.down('container[name=footerContainer]'),
                    densitomerConainer = footerContainer.down('container[name=densitometerContainer]');

                //Create if not already there
                if (Ext.isEmpty(densitomerConainer)) {
                    footerContainer.removeAll();
                    densitomerConainer = footerContainer.add([{
                        xtype: 'container',
                        layout: 'hbox',
                        name: 'densitometerContainer',
                        width: '100%',
                        style: {
                            'text-align': 'center'
                        },
                        items: [{
                            xtype: 'button',
                            text: '<',
                            name: 'densitometerLeft',
                            hidden: true
                        }, {
                            xtype: 'container',
                            name: 'densitomerBox',
                            layout: 'hbox',
                            cls: 'densitometer-box',
                            height: 22,
                            defaults: {
                                margin: '0 10 0 10',
                                bodyStyle: {
                                    background: 'transparent',
                                    border: 0
                                }
                            }
                        }, {
                            xtype: 'button',
                            text: '>',
                            name: 'densitometerRight',
                            hidden: true
                        }]
                    }])[0];
                }
                var densitomerBox = densitomerConainer.down('container[name=densitomerBox]');
                densitomerBox.removeAll();

                var responseText = response.responseText;
                var color = responseText.split('&');

                for (var i = 0; i < color.length; i++) {

                    var colorDetail = color[i];
                    if (colorDetail.split(',').length > 1) {

                        var colorName = colorDetail.split(',')[1];
                        var colorCode = colorDetail.split(',')[2] + ','
                            + colorDetail.split(',')[3] + ','
                            + colorDetail.split(',')[4];

                        if (i == 0) {

                            densitomerBox.add({
                                html: '<div style="width: 15px; height: 15px; float: left; margin-right: 5px;' +
                                    'background-color: rgb(' + colorCode + ')"></div>Selection'
                            });
                            continue;
                        }

                        densitomerBox.add({
                            html: '<div style="width: 15px; height: 15px; float: left; margin-right: 5px;' +
                                'background-color: rgb(' + colorCode + ')"></div>' +
                                colorName + ' (' + colorDetail.split(',')[5] + '%)'
                        });
                    }
                }

                thisInstance.showDensitomerNavigation();
            }
        );
    },

    /**
    * Functionality : this function display the navigation panel when densitometer
    * colors width are more than screen width
    * @param : none
    * @return: none
    */
    showDensitomerNavigation: function () {
        var densitomerBox = Ext.ComponentQuery.query('container[name=densitomerBox]')[0];
        var innerPanel = densitomerBox.query('panel');
        var densitomerBoxWidth = 0,
            buttonsWidth = 50; //Appr
        for (var index = 0; index < innerPanel.length; index++) {
            densitomerBoxWidth += innerPanel[index].getWidth() + 15; //Add color box div width
        }
        var upperPanelWidth = densitomerBox.up('panel').getWidth();
        if (densitomerBoxWidth > upperPanelWidth) {
            var densitomerLeft = Ext.ComponentQuery.query('button[name=densitometerLeft]')[0];
            var densitomerRight = Ext.ComponentQuery.query('button[name=densitometerRight]')[0];
            densitomerBox.setWidth(upperPanelWidth - buttonsWidth);
            densitomerLeft.setHidden(false);
            densitomerRight.setHidden(false);
        }
    },

    /**
    * Functionality : this functionality navigate the densitomer color to left
    * @param : none
    * @return: none
    */
    densitometerLeft: function () {
        var densitomerBox = Ext.ComponentQuery.query('container[name=densitomerBox]')[0];
        var innerPanel = densitomerBox.query('panel');
        var lastElement;
        for (var index = 0; index < innerPanel.length; index++) {
            if (!innerPanel[index].hidden) {
                lastElement && lastElement.show();
                break;
            }
            lastElement = innerPanel[index];
        }
    },

    /**
    * Functionality : this functionality navigate the densitomer color to right
    * @param : none
    * @return: none
    */
    densitometerRight: function () {
        var densitomerBox = Ext.ComponentQuery.query('container[name=densitomerBox]')[0];
        var densitomerLeft = Ext.ComponentQuery.query('button[name=densitometerLeft]')[0];
        var densitomerRight = Ext.ComponentQuery.query('button[name=densitometerRight]')[0];

        var innerPanel = densitomerBox.query('panel');
        var upperPanelWidth = densitomerBox.up('panel').getWidth();
        var displayArea = upperPanelWidth - (densitomerLeft.getWidth() + densitomerRight.getWidth() + 50);


        //Fetching the element that need to skip
        var lastElementWidth = 0;
        var skipElement = 0;
        for (var index = innerPanel.length - 1; index >= 0; index--) {
            if (!innerPanel[index].hidden) {
                lastElementWidth += innerPanel[index].getWidth() + 15;
                if (lastElementWidth > displayArea) {
                    break;
                }
                skipElement++;
            }
        }
        //innerPanel[index].hide();

        //hide the first element
        for (var index = 0; index < innerPanel.length - skipElement; index++) {
            if (!innerPanel[index].hidden) {
                innerPanel[index].hide();
                break;
            }
        }
    },

    /**
    * Functionality : this functionality download the PDF in new Tab
    * @param : none
    * @return: none
    */
    downloadPDF: function () {
        var url = Constants.pdfBaseUrl + "GetAssetPdf?filename=" + Constants.pdfFile
            + "&assetName=" + Constants.assetName + "&dir=&loginCheckUrl=" + Constants.loginCheckUrl;
        window.open(url, Constants.assetName + ".pdf");
    },

    /**
    * Functionality : Remove pressed property from all buttons
    * @param : none
    * @return: none
    */
    unPressedAllTopToolBtns: function () {
        var hamViewport = Ext.ComponentQuery.query('hamviewport')[0],
            toolBtns = hamViewport.down('toolbar[name=topToolbar]').query('button');

        //Exclude hide annotation and compare button
        var hideAnnotationBtn = hamViewport.down('toolbar[name=topToolbar] button[name=hideAnnotation]'),
            prevAnnoPressed = hideAnnotationBtn.customPressed,
            compareBtn = hamViewport.down('toolbar[name=topToolbar] button[name=compareBtn]'),
            prevCompPressed = compareBtn.customPressed,
            separationBtn = hamViewport.down('toolbar[name=topToolbar] button[name=sepBtn]'),
            prevSepPressed = separationBtn.customPressed;

        for (var i = 0, length = toolBtns.length; i < length; i++) {
            toolBtns[i].setPressed(false);
            toolBtns[i].customPressed = false;
        }

        hideAnnotationBtn.setPressed(prevAnnoPressed);
        hideAnnotationBtn.customPressed = prevAnnoPressed;
        compareBtn.setPressed(prevCompPressed);
        compareBtn.customPressed = prevCompPressed;
        separationBtn.setPressed(prevSepPressed);
        separationBtn.customPressed = prevSepPressed;

        this.removeFooterContent();
    },

    /**
    * Functionality : Update ruler dimension
    * @param : {Number} width, {Number} height, {Number} currentDpi
    * @return: none
    */
    updateRulerDimension: function (width, height, currentDpi) {
        var hamViewport = Ext.ComponentQuery.query('hamviewport')[0],
            footerContainer = hamViewport.down('container[name=footerContainer]'),
            rulerCont = footerContainer.down('container[name=rulerCont]');

        //Create if not already there
        if (Ext.isEmpty(rulerCont)) {
            footerContainer.removeAll();
            rulerCont = footerContainer.add([{
                xtype: 'container',
                name: 'rulerCont'
            }])[0];
        }

        var mm_const = 0.0393700787,
            widthInMM = Math.abs((width * 25.4 / currentDpi)).toFixed(2),
            heightInMM = Math.abs((height * 25.4 / currentDpi)).toFixed(2);

        //Avoid NaN value
        if (isNaN(widthInMM)) {
            widthInMM = 0;
        }
        if (isNaN(heightInMM)) {
            heightInMM = 0;
        }

        var widthInInch = (widthInMM * mm_const).toFixed(2),
            heightInInch = (heightInMM * mm_const).toFixed(2),
            formattedString = Ext.String.format('<b>' + languagePack.width + ':</b>' +
                '{0} mm ({1}") <b>' + languagePack.height + ':</b> {2} mm ({3}")',
                widthInMM, widthInInch, heightInMM, heightInInch);

        rulerCont.update(formattedString);
    },

    /**
   * Functionality : this function indent to generate the PPR pad and  download the PPR in new Tab
   * @param : none
   * @return: none
   */
    downloadPPR: function () {

        var postData = {};
        var params = {};
        params.taskId = Constants.userInfo.taskId;
        params.userId = Constants.userInfo.userId;
        params.lineId = Constants.userInfo.lineId;
        params.stageId = Constants.userInfo.stageId;
        params.type = 'xml';

        // Load all the Stickies used in the artwork
        for (var pageNumber = 0; pageNumber < Constants.totalPages; pageNumber++) {

            params.pageNumber = pageNumber;
            UTILITY.makeApiCallWithMask(Constants.actionUrl.loadStickiesUrl, false, 'soap', {},
                params, 'Get', '', languagePack.loadingDefaultmsg,
                function (response) {
                    postData[pageNumber] = response.trim();
                }
            );
        }

        // Generate Pad number for the PPR download
        postData.totalPage = Constants.totalPages;
        postData.fileName = Constants.pdfFile;
        postData.assetName = Constants.assetName;

        this.openPost(Constants.pdfBaseUrl + "GetPrintProofReport", postData);
    },

    /**
     * Functionality :
     *
     */
    openPost: function (url, variables) {

        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", url);
        form.setAttribute("target", "_blank");
        form.setAttribute("accept-charset", "utf-8");
        for (variable in variables) {

            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", 'hidden');
            hiddenField.setAttribute("name", variable);
            hiddenField.setAttribute("value", variables[variable]);
            form.appendChild(hiddenField);
        }
        document.body.appendChild(form);
        form.submit();
    },

    /**
    * Functionality : this function indent to generate the PPR pad and  download the PPR in new Tab
    * @param : none
    * @return: none
    */
    loadOpalV3Url: function () {
        if (!Constants.actionLoaded) {
            UTILITY.makeApiCallWithoutMask('xml/url.json', true, 'soap', {}, {}, 'GET',
                function (response) {
                    Constants.actionUrl.homePageUrl = response.homePageUrl;
                    Constants.actionUrl.approveArtworkUrl = response.approveArtworkUrl;
                    Constants.actionUrl.requestAmendUrl = response.requestAmendUrl;
                    Constants.actionLoaded = true;
                }
            );
        }
    },

    /**
    * Functionality : this function indent to load the compare left panel grid
    * @param : none
    * @return: none
    */
    loadCompareArtworks: function () {
        var params = {
            stageId: Constants.userInfo.stageId,
            taskId: Constants.userInfo.taskId,
            userId: Constants.userInfo.userId,
            basket: Constants.basket
        };
        UTILITY.makeApiCallWithMask(Constants.actionUrl.loadStagesUrl, true, 'soap', {}, params,
            'Get', '', languagePack.loadingDefaultmsg,
            function (response) {
                var grid = Ext.ComponentQuery.query('panel[name=compareGrid]')[0];
                var compareStore = grid.getStore();
                var stages = response.stages;

                for (var i = 0; i < stages.length; i++) {
                    var stage = stages[i];
                    compareStore.add(stage);
                }
                grid.getView().refresh();
                grid.getSelectionModel().deselectAll(true);

                grid.autoSelectRecord && grid.autoSelectRecord();
            }
        );
    },

    /**
    * Functionality : this function indent to activate compare mode
    * @param : {function} load compare
    * @return: none
    */
    activateCompareMode: function (callbackFn, extraObj) {
        var toolbarsHeight = Constants.topToolbarHeight + Constants.bottomToolbarHeight,
            controller = this;

        var mainCanvas = Ext.ComponentQuery.query('hamviewport panel[name=main-canvas]')[0];
        var compareCanvas = Ext.ComponentQuery.query('hamviewport panel[name=comparehamCanvas]')[0];
        var divider = Ext.ComponentQuery.query('hamviewport box[name=divider]')[0];

        var annotations = Ext.ComponentQuery.query('annotation');
        annotations.forEach(function (annotation) {
            annotation.destroy();
        });

        mainCanvas.setWidth(Constants.screenWidth / 2);
        mainCanvas.setHeight(Constants.screenHeight - toolbarsHeight);
        MAINCANVAS.components.hamImageContainer.resetImage();
        MAINCANVAS.removeAllAnnotations();

        compareCanvas.setWidth(Constants.screenWidth / 2);
        compareCanvas.setHeight(Constants.screenHeight - toolbarsHeight);

        UTILITY.destroyMainCanvasComponents();

        divider.show();
        divider.setPosition(Constants.screenWidth / 2, 0);
        compareCanvas.show();

        if (!COMPARECANVAS) {
            COMPARECANVAS = new CanvasHam(compareCanvas, null, 'comparehamCanvas');
        }

        //Load Compare canvas image after main canvas image load
        var loadCompareFn = function () {
            controller.loadHamImage(compareCanvas, extraObj.pdfFile, extraObj.stageId, true, callbackFn, extraObj);
        };

        //Load Main canvas image
        this.loadHamImage(mainCanvas, Constants.pdfFile, Constants.userInfo.stageId, true, '', extraObj, loadCompareFn);

        //If annotation hide button is pressed then have a reference
        var hideAnnoBtn = Ext.ComponentQuery.query('button[name=hideAnnotation]')[0];
        COMPARECANVAS.annotationShow = !hideAnnoBtn.customPressed;
    },

    /**
    * Functionality : this function indent to deactivate compare mode
    * @param : none
    * @return: none
    */
    deactivateCompareMode: function () {
        var compareGrid = Ext.ComponentQuery.query('leftdrawer grid[name=compareGrid]')[0];

        //This means compare never activated
        if (Ext.isEmpty(COMPARECANVAS) && Ext.isEmpty(compareGrid.getSelectionModel().getSelection())) {
            return;
        }

        var viewport = Ext.ComponentQuery.query('hamviewport')[0],
            compareBtn = viewport.down('button[name=compareBtn]'),
            toolbarsHeight = Constants.topToolbarHeight + Constants.bottomToolbarHeight;

        compareBtn.setPressed(false);
        compareBtn.customPressed = false;

        var mainCanvas = Ext.ComponentQuery.query('hamviewport panel[name=main-canvas]')[0];
        var compareCanvas = Ext.ComponentQuery.query('hamviewport panel[name=comparehamCanvas]')[0];
        var divider = Ext.ComponentQuery.query('hamviewport box[name=divider]')[0];

        var annotations = Ext.ComponentQuery.query('annotation');
        annotations.forEach(function (annotation) {
            annotation.destroy();
        });
        MAINCANVAS.removeAllAnnotations();
        COMPARECANVAS.removeAllAnnotations();
        COMPARECANVAS.setIdle(true);

        mainCanvas.setWidth(Constants.screenWidth);
        mainCanvas.setHeight(Constants.screenHeight - toolbarsHeight);
        MAINCANVAS.components.hamImageContainer.resetImage();

        MAINCANVAS.destroy();
        this.loadHamImage(mainCanvas, Constants.pdfFile, Constants.userInfo.stageId, true, null, {
            compareActivated: Constants.compare.activated
        });
        divider.hide();
        compareCanvas.hide();

        compareGrid.getSelectionModel().deselectAll();

        //Hide densitomete button
        var densitometerBtn = Ext.ComponentQuery.query('hamviewport button[name=densitometerBtn]')[0];
        densitometerBtn.setPressed(false);
        this.hideDensitomerPanel();
        densitometerBtn.customPressed = false;

        //If annotation hide button is pressed then have a reference
        var hideAnnoBtn = Ext.ComponentQuery.query('button[name=hideAnnotation]')[0];
        COMPARECANVAS.annotationShow = !hideAnnoBtn.customPressed;
    },

    /**
     * This function is intend to load the Navigation panel
     *
     */
    loadNavigationPanel: function () {
        var navCanvas = Ext.ComponentQuery.query('navigator box[name=navContnr]')[0];

        var params = {
            filename: Constants.pdfFile,
            pageNo: Constants.pageNumber,
            separationColor: Constants.separationColor,
            dir: null,
            x: 0.0,
            y: 0.0,
            width: navCanvas.getWidth(),
            height: navCanvas.getHeight(),
            autoResize: true,
            dpi: 0,
            type: 'general'
        };
        new CanvasNavigator(navCanvas, params);
    },

    /**
     * This function intend to update the Comment tab panel grid
     * @para, : stickyNotes JSON Array
     */
    updateCommentTab: function (stickyNotes) {

        var json = [];
        for (var i = 0; i < stickyNotes.length; i++) {
            var userName = ''
            var stickyJSON = {}
            stickyJSON.children = [];

            var comments = stickyNotes[i].comments;
            for (var j = 0; j < comments.length; j++) {
                var comment = comments[j];

                if (j == 0) {
                    userName = comment.userName;
                }
                var commentJSON = {
                    task: comment.value,
                    user: comment.userName,
                    leaf: true
                }
                stickyJSON.task = userName;
                stickyJSON.children.push(commentJSON);
            }
            json.push(stickyJSON);
        }

        var commentContainer = Ext.ComponentQuery.query('leftdrawer panel[name=commentTab]')[0].down('panel');
        commentContainer.removeAll();
        var commentTree = Ext.create('Ham.view.StickyComment', {
            maxHeight: commentContainer.height,
            store: Ext.create('Ham.store.Comment', {
                root: {
                    children: json
                }
            })
        });
        commentContainer.add(commentTree);
    }

});