/*
*
*Utility Function
*
*
*/

function Utility() {

    //Private properties
    var loadingBox,
        collaborationActivated = true, //Collaboration activation varible
        colIntervalId = '',
        utility = this;

    //Public properties

    //stop current ajax/image request
    this.stopRequest = false;

    //Will be used when we press refresh button of comment tab
    this.refreshComment = false;

    /**
    * Functionality: Call an api with mask of parent
    * @params: {string} url, {object} postParams, {object} getParams, {string} method, {object} maskParent,
    * {string} maskMsg, {function} success, {function} failure, {object} extrObj
    * @return: none
    */
    this.makeApiCallWithMask = function (url, async, serverType, postParams, getParams, method,
        maskParent, maskMsg, success, failure, extrObj) {

        utility.showProgress(maskMsg);
        utility.stopRequest = false;
        this.makeAjaxRequest(url, async, serverType, postParams, getParams, method,
            function (responseObject) {
                utility.hideProgress();
                if (responseObject.responseText == 'Session has Expired') {
                    utility.redirectOnSessionOut();
                }
                else if (!Ext.isEmpty(success) && !utility.stopRequest) {

                    if (serverType == 'pdf') {
                        success(responseObject, extrObj);
                    }
                    else if (getParams.type == 'xml') {
                        success(responseObject.responseText);
                    }
                    else {
                        var JData = Ext.decode(responseObject.responseText);
                        success(JData);
                    }
                }
            },
            function (responseObject) {
                utility.hideProgress();

                if (!Ext.isEmpty(failure)) {
                    failure(responseObject, extrObj);
                }
                else {
                    utility.showErrMsgBox(responseObject);
                }
            }
        );
    };

    /**
    * Functionality: Call an api without mask of parent
    * @params: {string} url, {object} postParams, {object} getParams, {string} method, {function} success,
    * {function} failure, {object} extrObj
    * @return: none
    */
    this.makeApiCallWithoutMask = function (url, async, serverType, postParams, getParams,
        method, success, failure, extrObj) {

        utility.stopRequest = false;
        this.makeAjaxRequest(url, async, serverType, postParams, getParams, method,
            function (responseObject) {

                if (responseObject.responseText == 'Session has Expired') {
                    utility.redirectOnSessionOut();
                }
                else if (!Ext.isEmpty(success) && !utility.stopRequest) {
                    if (serverType === 'pdf') {
                        success(responseObject, extrObj);
                    }
                    else if (getParams.type == 'xml') {
                        success(JData);
                    }
                    else {
                        var JData = Ext.decode(responseObject.responseText);
                        success(JData);
                    }
                }

                //Alaways allow special requests like collaboration
                if (!Ext.isEmpty(success) && utility.stopRequest && extrObj && extrObj.allowSuccess) {
                    var JData = Ext.decode(responseObject.responseText);
                    success(JData);
                }
            },
            function (responseObject) {
                if (!Ext.isEmpty(failure)) {
                    failure(responseObject, extrObj);
                }
                else {
                    utility.showErrMsgBox(responseObject);
                }
            }
        );
    };

    /**
    * Functionality: Make ajax request
    * @params: {string} url, {object} postParams, {object} getParams, {string} method, {function} success, {function} failure
    * @return: none
    */
    this.makeAjaxRequest = function (url, async, serverType, postParams, getParams, method, success, failure) {

        //Remove below code in production
        Ext.Ajax.setUseDefaultXhrHeader(false);

        if (serverType === 'pdf') {
            url = Constants.pdfBaseUrl + url;
            getParams.loginCheckUrl = Constants.loginCheckUrl;
            getParams.register = Constants.skipAuthentication;
        }
        else {
            url = Constants.soapBaseUrl + url;
            getParams.type = getParams.type == undefined ? 'json' : getParams.type;

            //If other sites wants to send some extra parameters then add it.
            Ext.Object.merge(getParams, Constants.configs.soapExtraParams);
        }

        Ext.Ajax.request({
            async: async,
            url: url,
            method: method,
            timeout: 300000,
            params: getParams,
            success: success,
            failure: failure
        });
    };

    /**
    * Functionality: show error message when request don't reach server / network error
    * @params: none
    * @return: none
    */
    this.showErrMsgBox = function () {
        Ext.Msg.show({
            title: languagePack.failureTitle,
            msg: "<br/>" + languagePack.failureMessage + "<br/><br/>",
            width: 300,
            icon: Ext.Msg.WARNING,
            buttons: Ext.Msg.OK
        });
    };

    /**
    * Functionality: Load image with progress bar
    * @params: {object} image, {object} imageParams, {String} message, {function} success, {function} error,
    * @return: none
    */
    this.loadImageWithMask = function (image, imageParams, message, success, error) {
        imageParams.loginCheckUrl = Constants.loginCheckUrl;
        imageParams.register = Constants.skipAuthentication;

        var utility = this,
            url = Constants.pdfBaseUrl + 'GetImageInfo?' + Ext.Object.toQueryString(imageParams);

        message = Ext.isEmpty(message) || '';
        utility.stopRequest = false;

        //Success function
        image.onload = function () {
            // UTILITY.hideProgress();
            if (!Ext.isEmpty(success) && !utility.stopRequest) {
                success(image);
            }
        };

        //Error function
        image.onerror = function () {
            UTILITY.hideProgress();
            if (!Ext.isEmpty(error)) {
                error(image);
            }
            else {
                utility.showErrMsgBox();
            }
        };

        image.src = 'resources/images/Eden.jpg';
        // UTILITY.showProgress(message);
    };

    /**
    * Functionality: Load image without progress bar
    * @params: {object} image, {object} imageParams, {function} success, {function} error,
    * @return: none
    */
    this.loadImageWithoutMask = function (image, imageParams, success, error) {
        imageParams.loginCheckUrl = Constants.loginCheckUrl;
        imageParams.register = Constants.skipAuthentication;

        var utility = this,
            url = Constants.pdfBaseUrl + 'GetImageInfo?' + Ext.Object.toQueryString(imageParams);

        //Success function
        image.onload = function () {
            if (!Ext.isEmpty(success)) {
                success(image);
            }
        };

        //Error/failure function
        image.onerror = function () {
            if (!Ext.isEmpty(error)) {
                error(image);
            }
            else {
                utility.showErrMsgBox();
            }
        };
        image.src = 'resources/images/Eden.jpg';
    };

    /**
    * Functionality: Show progress bar
    * @params: {string} message
    * @return: none
    */
    this.showProgress = function (message) {
        // loadingBox = Ext.ComponentQuery.query('hamviewport container[name=loadingBox]')[0];
        //loadingBox.down('box[name=messageBox]').update(message || 'Updating...');
        // loadingBox.show();
    };

    /**
    * Functionality: Hide progress bar
    * @params: {string} url, {object} postParams, {object} getParams, {string} method, {function} success, {function} failure
    * @return: none
    */
    this.hideProgress = function () {
        // loadingBox.hide();
    };

    this.stopAjaxRequest = function () {
        utility.stopRequest = true;
        utility.hideProgress();
    };

    this.redirectOnSessionOut = function () {
        window.location.replace(Constants.soapBaseUrl + Constants.actionUrl.homePageUrl);
    }

    /**
    * Functionality: Check if an object is empty
    * @params: {Object} obj
    * @return: Boolean
    */
    this.isObjectEmpty = function (obj) {
        return Object.keys(obj).length === 0;
    };

    /**
    * Functionality: Show error message
    * @params: {String} title, {String} message
    * @return: none
    */
    this.showErrMessage = function (title, message, callback) {
        Ext.Msg.alert(title, message, callback);
    };

    /**
    * Functionality: Get new points after rotation
    * @params: {Number} angle, {Object} canvas, {Number} x, {Number} y
    * @return: {array} point xy
    */
    this.getRotatedPoint = function (angle, canvas, x, y) {
        var cx = x - canvas.width / 2,
            cy = y - canvas.height / 2,
            cosVal = Math.cos(angle * Math.PI / 180),
            sinVal = Math.sin(angle * Math.PI / 180),
            newX = cx * cosVal - cy * sinVal,
            newY = cy * cosVal + cx * sinVal;

        return [canvas.width / 2 + newX, canvas.height / 2 + newY];
    };

    /**
    * Functionality: return boolean if compare functionality is activated
    * @params: none
    * @return: {Boolean}
    */
    this.isCompareActivated = function () {
        // var compareContainer = Ext.ComponentQuery.query('hamviewport panel[name=mainhamCanvas]')[0];
        // return compareContainer.getWidth() < 0.75 * Constants.screenWidth;
        return false;
    };

    /**
    * Functionality: return boolean if Densitometer is active
    * @params: none
    * @return: {Boolean}
    */
    this.isDensitometerAcive = function () {
        // return Ext.ComponentQuery.query('button[name=densitometerBtn]')[0].customPressed;
        return false;
    };

    /**
    * Functionality: It will return the other canvas depending upon current canvas passed
    *                Otherwise return null
    * @params: {Object} currentCanvas
    * @return: {Object/NULL}
    */
    this.getOtherCanvas = function (currentCanvas) {
        var otherCanvas = MAINCANVAS;

        if (currentCanvas.canvasId == 'mainhamCanvas') {

            //If comapre canvas is not ready yet
            if (Ext.isEmpty(COMPARECANVAS)) {
                return null;
            }
            otherCanvas = COMPARECANVAS;
        }

        //Avoid recursive calls
        if (otherCanvas.calling) {
            otherCanvas.calling = false;
            return null;
        }
        else {
            currentCanvas.calling = true;
            return otherCanvas;
        }
    };

    /**
    * Functionality: Make an illusion of sticky moving under other canvas component
    * @params: {Object} annotation, {Number} xPos
    * @return: {Number} xPos
    */
    this.imulateAnnotationHiding = function (annotation, xPos) {
        var annoWidth = 180,
            halfScreenWidth = Constants.screenWidth / 2 + 2;

        if (annotation.annoType == 'mainhamCanvas') {
            if (xPos > halfScreenWidth) {
                annotation.el.setOpacity(0);
                annotation.needsCheck = true;
            }
            else if (xPos + annoWidth > halfScreenWidth) {
                annotation.el.setWidth(annoWidth - (xPos + annoWidth - halfScreenWidth));
                annotation.el.setOpacity(1);
                annotation.needsCheck = true;
            }
            else if (annotation.needsCheck) {
                annotation.el.setWidth(annoWidth);
                annotation.el.setOpacity(1);
                annotation.needsCheck = false;
            }
        }
        else {
            var commentContainers = annotation.query('container[name=commentContainer]');
            if (xPos + annoWidth < halfScreenWidth) {
                annotation.el.setOpacity(0);
                annotation.needsCheck = true;
            }
            else if (xPos < halfScreenWidth) {
                var extraWidth = halfScreenWidth - xPos,
                    remainingWidth = annoWidth - extraWidth;
                annotation.setWidth(remainingWidth);
                commentContainers.forEach(function (commentContainer) {
                    commentContainer.setLocalX(-extraWidth);
                    commentContainer.setWidth(annoWidth - 7);
                });
                annotation.el.setOpacity(1);
                xPos = halfScreenWidth;
                annotation.needsCheck = true;
            }
            else if (annotation.needsCheck) {
                annotation.setWidth(annoWidth);
                commentContainers.forEach(function (commentContainer) {
                    commentContainer.setLocalX(0);
                });
                annotation.el.setOpacity(1);
                annotation.needsCheck = false;
            }
        }

        if (annotation.el.dom.style.visibility == "hidden") {
            annotation.el.dom.style.visibility = "visible";
        }

        return xPos;
    };

    /**
   * Functionality: Clear collaboration request
   * @params: none
   * @return: none
   */
    this.clearCollaboration = function () {
        collaborationActivated = false;
        clearInterval(colIntervalId);
    };

    this.startCollaboration = function () {
        collaborationActivated = true;
        utility.makeCollaborationRequest();
    };

    /**
    * Functionality: Make request for collaboration and update annotations
    * @params: {Canvas} hamCanvas
    * @return: none
    */
    this.makeCollaborationRequest = function () {
        var hamCanvas = MAINCANVAS,
            waitingTime = 2000;

        //Just in case if it is getting called after clear collaboration
        if (!collaborationActivated) {
            return;
        }

        //Don't make api request for stickies when "Hide Annotation" is ON.
        if (!MAINCANVAS.annotationShow) {
            colIntervalId = setTimeout(function () {
                UTILITY.makeCollaborationRequest(hamCanvas);
            }, waitingTime);
            return;
        }

        var hamController = Ham.application.getController('HamController'),
            leftDrawer = Ext.ComponentQuery.query('leftdrawer')[0],
            refreshBtn,
            params = {},
            insertPos = hamController.mainCanvasPos;

        params.taskId = Constants.userInfo.taskId;
        params.userId = Constants.userInfo.userId;
        params.pageNumber = Constants.pageNumber;
        params.lineId = Constants.userInfo.lineId;
        params.stageId = hamCanvas.stageId;

        //hamController.loadStickies(hamCanvas, sucessFn);
        UTILITY.makeApiCallWithoutMask(Constants.actionUrl.loadStickiesUrl, true, 'soap', {}, params, 'Get',
            function (jData) {

                //Just in case if it is getting called after clear collaboration
                if (!collaborationActivated) {
                    return;
                }

                var stickyNotes = jData.stickyNotes,
                    annotations = Ext.ComponentQuery.query('annotation'),
                    annotationInfo = Constants.userInfo.annotationInfo,
                    found,
                    mainAnnotations = [],
                    dirty = false;

                //Pick only main canvas's annotation not compare
                annotations.forEach(function (annotation) {
                    if (annotation.annoType == 'mainhamCanvas')
                        mainAnnotations.push(annotation);
                });

                //Keep it updated
                hamController.stickyNotes = stickyNotes;

                mainAnnotations.forEach(function (annotation) {
                    annotation.isMatched = false;
                });
                for (var i = 0, length = stickyNotes.length; i < length; i++) {
                    var stickyNote = stickyNotes[i].stickyNote;
                    found = false;
                    for (var j = 0, annoLength = mainAnnotations.length; j < annoLength; j++) {
                        var annotation = mainAnnotations[j],
                            annoStickyNote = annotation.stickyInfo.stickyNote;

                        if (stickyNote.stickyId == annoStickyNote.stickyId) {
                            found = true;
                            mainAnnotations.splice(j, 1);
                            j--;
                            annotation.isMatched = true;

                            //Logic to update comment
                            annoStickyNote.pinHeadX = stickyNote.pinHeadX;
                            annoStickyNote.pinHeadY = stickyNote.pinHeadY;

                            //Don't set dirty to false if it is already true
                            dirty = utility.updateComments(stickyNotes[i], annotation) || dirty;

                            //If found don't search further, exit from loop
                            break;
                        }
                    }
                    if (!found && stickyNote.createdBy != Constants.userInfo.userId) {
                        dirty = true;

                        //ADD if not found in above loop
                        var newAnnotation = hamController.addAnnotation(hamCanvas,
                            Constants.colorData.colors, stickyNotes[i]);

                        if (stickyNote.pinheadType == 'CIRCLE_PINHEAD') {
                            hamCanvas.addCircularAnnotation(stickyNote, newAnnotation.width);
                            newAnnotation.insertPosition = insertPos.circular++;
                        }
                        else {
                            hamCanvas.addFreeHandAnnotation(stickyNote, newAnnotation.width);
                            newAnnotation.insertPosition = insertPos.freeHand++;
                        }

                        //Current user Info
                        newAnnotation.userName = annotationInfo.userName;
                        newAnnotation.userRole = annotationInfo.userRole;
                        newAnnotation.backgroundColor = annotationInfo.backgroundColor;
                    }
                }

                mainAnnotations.forEach(function (annotation) {
                    //Remove if it is not a new one and did not match in above loop
                    if (!annotation.isMatched && annotation.stickyInfo.stickyNote.stickyId &&
                        annotation.stickyInfo.stickyNote.createdBy != Constants.userInfo.userId) {
                        dirty = true;

                        annotation.destroy();
                        MAINCANVAS.removeAnnotation(annotation);
                    }
                });
                MAINCANVAS.updateStickyPosition(true, true);
                MAINCANVAS.init();

                if (utility.refreshComment) {
                    refreshBtn = Ext.ComponentQuery.query('leftdrawer tool[name=commentRefresh]')[0];
                    utility.refreshComment = false;
                    utility.hideProgress();
                    hamController.updateCommentTab(stickyNotes);
                }

                //Update when something is changed
                if (dirty) {
                    refreshBtn = Ext.ComponentQuery.query('leftdrawer tool[name=commentRefresh]')[0];
                    refreshBtn && refreshBtn.enable();

                    //Update only when drawer is collapsed
                    if (leftDrawer.animCollapsed) {
                        hamController.updateCommentTab(stickyNotes);
                    }
                }

                colIntervalId = setTimeout(function () {
                    UTILITY.makeCollaborationRequest(hamCanvas);
                }, waitingTime);
            },
            function () {
                //null failure function to prevent message box from showing
            },
            {
                allowSuccess: true
            }
        );
    };

    /**
    * Functionality: Update comments of an annotation
    * @params: {Object} stickyNotes, {Object} stickyNotes
    * @return: {Boolean} dirty
    */
    this.updateComments = function (stickyNotes, annotation) {
        var comments = stickyNotes.comments,
            annoComments = annotation.query('container[name=commentContainer]'),
            colorData = Constants.colorData.colors,
            color,
            dirty = false;

        for (var i = 0, length = comments.length; i < length; i++) {

            if (Ext.isEmpty(annoComments[i])) {
                dirty = true;

                //Add new
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
            else if (comments[i].id == annoComments[i].commentInfo.id) {

                //Check for update
                if (comments[i].value != annoComments[i].commentInfo.value) {
                    dirty = true;

                    annoComments[i].commentInfo.value = comments[i].value;
                    var commentBox = annoComments[i].down('box[name=commentBox]');
                    commentBox.setCustomValue(commentBox, comments[i].value);
                }
            }
            else {
                dirty = true;

                //It is deleted
                annoComments[i].destroy();
                annoComments.splice(i, 1);
                annotation.addedPanelsCount--;
                i--;
            }

            //Remove remaining deleted comments
            if ((i == length - 1) && (i != annoComments.length - 1)) {
                for (var k = i + 1; k < annoComments.length; k++) {

                    //Make sure new comments don't get deleted because that is being created
                    if (annoComments[k].commentInfo.userId != Constants.userInfo.userId) {
                        dirty = true;
                        annoComments[k].destroy();
                        annotation.addedPanelsCount--;
                    }
                }
            }
        }

        return dirty;
    };

    /**
    * Functionality: Destroy main canvas and remove annotations
    * @params: none
    * @return: none
    */
    this.destroyMainCanvasComponents = function () {
        var hamController = Ham.application.getController('HamController');

        UTILITY.clearCollaboration();
        MAINCANVAS && MAINCANVAS.destroy();

        //Reset when we try to load again
        hamController.mainCanvasPos = {
            circular: 0,
            freeHand: 0
        };

        var annotations = Ext.ComponentQuery.query('annotation');
        annotations.forEach(function (annotation) {
            if (annotation.annoType === 'mainhamCanvas') {
                annotation.destroy();
            }
        });
    };

    /**
    * Functionality: Loat fit image of compare canvas
    * @params: {Object} imageParams, {Object} extraObj
    * @return: none
    */
    this.loadCompareFitImage = function (imageParams, extraObj) {
        var hamController = Ham.application.getController('HamController');

        //If compare mode has been changed then dont proceed
        if (extraObj.compareActivated != Constants.compare.activated) {
            return;
        }

        UTILITY.loadImageWithMask(new Image(), imageParams, languagePack.loadingDefaultmsg,
            function (loadedImage) {

                var compareImage = loadedImage,
                    width = compareImage.width,
                    height = compareImage.height,
                    compHamImage = COMPARECANVAS.components.hamImageContainer;

                hamController.compareCanvasPos = {
                    circular: 0,
                    freeHand: 0
                };

                COMPARECANVAS.removeAllAnnotations();

                compHamImage.resetImage();
                compHamImage.setFitImage(compareImage);
                compHamImage.imageLoaded = false;

                COMPARECANVAS.xDelta = width / imageParams.dpi;
                COMPARECANVAS.yDelta = height / imageParams.dpi;
                COMPARECANVAS.info.baseImageLoad = false;
                COMPARECANVAS.info.baseImageParams = imageParams;
                COMPARECANVAS.info.baseDpi = imageParams.dpi;
                COMPARECANVAS.get72DpiImageDimension(compareImage);
                COMPARECANVAS.setIdle(false);

                //Prepare a success/callback function that will be executed after image gets loaded
                var successFn = function (extraObj) {

                    //If compare mode has been changed then dont proceed
                    if (extraObj.compareActivated == Constants.compare.activated) {
                        hamController.loadStickies(extraObj.canvas);
                    }

                    //Unmask viewport
                    UTILITY.unmaskViewportForCompare();
                };
                extraObj.canvas = COMPARECANVAS;

                COMPARECANVAS.fitToCanvas(successFn, extraObj);
            }
        );
    };

    /**
    * Functionality: Disable compare-toggle button and toggle functionality
    * @params: none
    * @return: none
    */
    this.disableToggle = function () {
        var toggleHamBtn = Ext.ComponentQuery.query('button[name=toggleHam]')[0];
        toggleHamBtn.customPressed && toggleHamBtn.handler(toggleHamBtn);
    };

    /**
    * Functionality: Mask viewport for compare to freeze panning and zooming operation
    * @params: none
    * @return: none
    */
    this.maskViewportForCompare = function () {
        Ext.ComponentQuery.query('hamviewport')[0].
            down('panel[name=canvasContainer]').setLoading({
                cls: ['x-mask-msg', 'ham-loading-mask']
            });

        Constants.hamReady = false;
        Ext.ComponentQuery.query('slider[name=navSlider]')[0].setDisabled(true);
        this.canvasContainerMasked = true;
    };

    /**
    * Functionality: UnMask viewport for compare
    * @params: none
    * @return: none
    */
    this.unmaskViewportForCompare = function () {
        Ext.ComponentQuery.query('hamviewport')[0].
            down('panel[name=canvasContainer]').setLoading(false);

        Constants.hamReady = true;
        Ext.ComponentQuery.query('slider[name=navSlider]')[0].setDisabled(false);
        this.canvasContainerMasked = false;
    };

    /**
    * Functionality: Update comments of an annotation
    * @params: {Object} stickyNotes, {Object} stickyNotes
    * @return: {Boolean} dirty
    */
    this.removeLoadingImage = function (img) {
        img.parentElement.removeChild(img.parentElement.children[1]);
        img.removeAttribute('hidden');
        Ext.ComponentQuery.query('panel[name=documentContaniner]')[0].doLayout();
    };

    /**
    * Functionality: Check Height and remove loading image
    * @params: {Object} Image
    * @return: none
    */
    this.checkAndRemoveLoadingImage = function (img) {
        this.removeLoadingImage(img);

        var documentPanel = Ext.ComponentQuery.query('panel[name=documentViewer]')[0],
            documentContaniner = documentPanel.down('panel[name=documentContaniner]'),
            outerHeight = documentPanel.body.getHeight(),
            padAndNumberHeight = 25, //Padding between image and number + Number height
            paddingAndBorder = 12, //document padding and Border
            innerHeight = 0;

        var hamController = Ham.application.getController('HamController');

        //Push image height in an array
        documentContaniner.documentImageHeights.push(img.height);

        for (var i = 0; i < documentContaniner.documentImageHeights.length; i++) {
            innerHeight += documentContaniner.documentImageHeights[i] + paddingAndBorder;
            innerHeight += padAndNumberHeight;
        }

        //To force a scroll bar innerHeight need to be greater then outerHeight
        if (innerHeight <= outerHeight) {
            hamController.loadDocumentsRecursively(documentContaniner);
        }
        else {
            documentContaniner.firstLoadedPages = documentContaniner.loadedPages;
            hamController.loadBlankDocuments(documentContaniner);
        }
    };
}

UTILITY = new Utility();