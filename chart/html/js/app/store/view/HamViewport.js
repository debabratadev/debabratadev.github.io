/*
Creation date: 7-21-2013
Purpose:  Viewport for ham page is defined here.
Created By : Opal.
*/

Ext.define('Ham.view.HamViewport', {
    extend: 'Ext.container.Container',
    alias: 'widget.hamviewport',
    width: '100%',

    initComponent: function() {
        var me = this,
            toolbarsHeight = Constants.topToolbarHeight + Constants.bottomToolbarHeight;

        me.renderTo = document.body;
        Ext.applyIf(me, {
            items: [{
                xtype: 'panel',
                layout: 'fit',
                height: Constants.screenHeight,
                dockedItems: me.getHamDockedItems(),
                name: 'canvasContainer',
                items: [{
                    layout: 'hbox',
                    border: 0,
                    items: [{
                        xtype: 'panel',
                        name: 'mainhamCanvas',
                        border: 0,
                        layout:'fit',
                        width: '100%',
                        height: Constants.screenHeight - toolbarsHeight,
                        bodyStyle: 'background: #FBFBFB',
                        html: '<canvas id="mainhamCanvas" class="canvas-element" >' +
                            'Your browser does not support the HTML5 canvas tag.' +
                            '</canvas>'
                    }, {
                        xtype: 'box',
                        name: 'divider',
                        id: 'divider',
                        border: 0,
                        height: Constants.screenHeight - toolbarsHeight - 3,
                        width: 3,
                        hidden:true,
                        floating: true,
                        shadow: false,
                        cls: 'ham-divider',
                        style: 'background: #525252'
                    }, {
                        xtype: 'panel',
                        name: 'comparehamCanvas',
                        border: 0,
                        height: Constants.screenHeight - toolbarsHeight,
                        bodyStyle: 'background: #FBFBFB',
                        hidden:true,
                        html: '<canvas id="comparehamCanvas" class="canvas-element" >' +
                            'Your browser does not support the HTML5 canvas tag.' +
                            '</canvas>'
                    }]
                }]
            }]
        });

        me.callParent(arguments);
    },

    /**
    * Functionality : Get the object for docked item
    * @param : none
    * @return: none
    */
    getHamDockedItems: function() {
        var iconPath = Constants.hamServerPath + Constants.imagePath + 'tool-icons/',
            topBtns = [],
            homeBtn = this.getHomeBtn(iconPath),
            annotationBtn = this.getAnnotationBtn(iconPath),
            rotateLeftBtn = this.getRotateLeftBtn(iconPath),
            rotateRightBtn = this.getRotateRightBtn(iconPath),
            printBtn = this.getPrintBtn(iconPath),
            pdfBtn = this.getPdfBtn(iconPath),
            measureBtn = this.getMeasureBtn(iconPath),
            fullScreenBtn = this.getFullScreenBtn(iconPath),
            compareBtn = this.getCompareBtn(iconPath),
            magnifyBtn = this.getMagnifyBtn(iconPath),
            separatorBtn = this.getSeparatorBtn(iconPath),
            densitometerBtn = this.getDensitometerBtn(iconPath),
            circularBtn = this.getCircularBtn(iconPath),
            freeHandBtn = this.getFreeHandBtn(iconPath),
            rejectBtn = this.getRejectBtn(iconPath),
            acceptBtn = this.getAcceptBtn(iconPath);

        topBtns = [homeBtn, annotationBtn, rotateLeftBtn, rotateRightBtn,
                printBtn, pdfBtn, measureBtn, fullScreenBtn, compareBtn,
                magnifyBtn, separatorBtn, densitometerBtn, circularBtn,
                freeHandBtn, rejectBtn, acceptBtn];

        if(this.readOnlyHam === 'true') {
            topBtns = [annotationBtn, rotateLeftBtn, rotateRightBtn,
                printBtn, pdfBtn, measureBtn, fullScreenBtn, compareBtn,
                magnifyBtn, separatorBtn, densitometerBtn];
        }

        return [{
            xtype: 'toolbar',
            dock: 'top',
            name: 'topToolbar',
            floating: true,
            shadow: false,
            height: Constants.topToolbarHeight,
            cls: 'ham-top-toolbar',
            defaults: {
                width: 32,
                height: 32,
                padding: 3,
                iconCls: 'ham-tool-icon-btn'
            },
            items: topBtns
        }, {
            xtype: 'toolbar',
            dock: 'bottom',
            name: 'bottomToolbar',
            floating: true,
            shadow: false,
            cls: 'ham-bottom-toolbar',
            height: Constants.bottomToolbarHeight,
            items: [{
                xtype: 'container',
                name: 'loadingBox',
                margin: '0 0 0 10',
                layout: 'hbox',
                items: [{
                    xtype: 'image',
                    width: 20,
                    height: 20,
                    src: Constants.hamServerPath + 'resources/images/progress-loader.gif'
                }, {
                    xtype: 'box',
                    cls: 'progress-text',
                    name: 'messageBox'
                }]
            }, {
                xtype: 'container',
                name: 'footerContainer',
                width: '100%'
            }]
        }];
    },

    /**
    * Functionality : Get the Home button
    * @param : {String} iconPath
    * @return: none
    */
    getHomeBtn: function(iconPath) {
        return {
            tooltip: languagePack.home,
            name: 'home',
            icon: iconPath + 'home.png',
            handler: function() {
                window.location.href = Constants.soapBaseUrl + Constants.actionUrl.homePageUrl;
            }
        };
    },

    /**
    * Functionality : Get the Show/Hide Annotation button
    * @param : {String} iconPath
    * @return: none
    */
    getAnnotationBtn: function(iconPath) {
        return {
            tooltip: languagePack.hideComments,
            icon: iconPath + 'annotation_on.png',
            name: 'hideAnnotation',
            customPressed: false,
            handler:function(btn) {
                if(Constants.hamReady) {
                    var annotations = Ext.ComponentQuery.query('annotation'),
                        hamController = Ham.application.getController('HamController');
                    if(btn.customPressed) {
                        btn.setPressed(false);
                        btn.customPressed = false;
                        btn.setTooltip(languagePack.hideComments);
                        hamController.updateAnnotationPosition(MAINCANVAS);
                        annotations.forEach(function(annotation) {

                            //Don't show if it is out of visible area
                            var xy = annotation.getXY();
                            if((xy[0] > 0 && xy[0] < Constants.screenWidth) &&
                                (xy[1] > 0 && xy[1] < Constants.screenHeight)) {
                                annotation.el.dom.style.visibility = "visible";
                            }
                        });

                        MAINCANVAS.showAnnotations();
                        if(UTILITY.isCompareActivated()) {
                            COMPARECANVAS.showAnnotations();
                        }
                    }else {
                        btn.setPressed(true);
                        btn.customPressed = true;
                        btn.setTooltip(languagePack.showComments);

                        annotations.forEach(function(annotation) {
                            annotation.el.dom.style.visibility = "hidden";
                        });

                        MAINCANVAS.hideAnnotations();
                        if(UTILITY.isCompareActivated()) {
                            COMPARECANVAS.hideAnnotations();
                        }
                    }
                }
            }
        };
    },

    /**
    * Functionality : Get the Rotation left button
    * @param : {String} iconPath
    * @return: none
    */
    getRotateLeftBtn: function(iconPath) {
        return {
            tooltip: languagePack.rotateLeft,
            icon: iconPath + 'rotate_left.png',
            handler: function() {
                if(Constants.hamReady) {
                    NAVIGATORCANVAS.rotateLeft();
                    MAINCANVAS.rotateLeft();
                    if(UTILITY.isCompareActivated())
                        COMPARECANVAS.rotateLeft();
                }
            }
        };
    },

    /**
    * Functionality : Get the Rotation right button
    * @param : {String} iconPath
    * @return: none
    */
    getRotateRightBtn: function(iconPath) {
        return {
            tooltip: languagePack.rotateRight,
            icon: iconPath + 'rotate_right.png',
            handler: function() {
                if(Constants.hamReady) {
                    NAVIGATORCANVAS.rotateRight();
                    MAINCANVAS.rotateRight();
                    if(UTILITY.isCompareActivated())
                        COMPARECANVAS.rotateRight();
                }
            }
        };
    },

    /**
    * Functionality : Get the Print button
    * @param : {String} iconPath
    * @return: none
    */
    getPrintBtn: function(iconPath) {
        return {
            tooltip: languagePack.print,
            icon: iconPath + 'print.png',
            handler: function() {
               var hamController = Ham.application.getController('HamController');
                hamController.downloadPPR();
            }
        };
    },

    /**
    * Functionality : Get the pdf button
    * @param : {String} iconPath
    * @return: none
    */
    getPdfBtn: function(iconPath) {
        return {
            tooltip: languagePack.download,
            icon: iconPath + 'pdf.png',
            handler: function() {
               var hamController = Ham.application.getController('HamController');
                hamController.downloadPDF();
            }
        };
    },

    /**
    * Functionality : Get the Measure button
    * @param : {String} iconPath
    * @return: none
    */
    getMeasureBtn: function(iconPath) {
        return {
            tooltip: languagePack.ruler,
            icon: iconPath + 'measure.png',
            handler: function(btn) {
                if(Constants.hamReady) {
                    var hamController = Ham.application.getController('HamController');
                    hamController.removeFooterContent();
                    UTILITY.stopAjaxRequest();
                    if(btn.customPressed) {
                        btn.setPressed(false);
                        btn.customPressed = false;
                        MAINCANVAS.deactivateRuler();
                        if(UTILITY.isCompareActivated())
                            COMPARECANVAS.deactivateRuler();
                    }
                    else {
                        hamController.unPressedAllTopToolBtns();
                        btn.setPressed(true);
                        btn.customPressed = true;
                        MAINCANVAS.activateRuler();
                        if(UTILITY.isCompareActivated())
                            COMPARECANVAS.activateRuler();
                    }
                }
            }
        };
    },

    /**
    * Functionality : Get the Full Screen button
    * @param : {String} iconPath
    * @return: none
    */
    getFullScreenBtn: function(iconPath) {
        return {
            tooltip: languagePack.fitToScreen,
            icon: iconPath + 'fullscreen.png',
            name: 'fullScreenBtn'
        };
    },

    /**
    * Functionality : Get the Compare button
    * @param : {String} iconPath
    * @return: none
    */
    getCompareBtn: function(iconPath) {
        return  {
            tooltip: languagePack.compare,
            icon: iconPath + 'compare.png',
            name: 'compareBtn',
            customPressed: false,
            handler: function(btn) {
                var hamController = Ham.application.getController('HamController'),
                    leftDrawer = Ext.ComponentQuery.query('leftdrawer')[0],
                    compareTab = leftDrawer.down('panel[name=compareTab]');

                if(!btn.customPressed) {
                    hamController.unPressedAllTopToolBtns();
                    btn.setPressed(true);
                    btn.customPressed = true;
                    leftDrawer.animCollapsed && leftDrawer.animExpand();
                    leftDrawer.setActiveTab(compareTab);
                    MAINCANVAS.deactivateAllFunctionality();
                }
                else {
                    btn.setPressed(false);
                    btn.customPressed = false;
                    !leftDrawer.animCollapsed && leftDrawer.animCollapse();

                    //Deactivate only if there was selection of record
                    //Otherwise it is just a waste
                    if(UTILITY.isCompareActivated()) {
                        UTILITY.disableToggle();
                        hamController.unPressedAllTopToolBtns();
                        Constants.compare.activated = false;
                        hamController.deactivateCompareMode();
                    }
                }
            }
        };
    },

    /**
    * Functionality : Get the Magnify button
    * @param : {String} iconPath
    * @return: none
    */
    getMagnifyBtn: function(iconPath) {
        return {
            tooltip: languagePack.customZoom,
            icon: iconPath + 'magnify.png',
            handler: function(btn) {
                if(Constants.hamReady) {
                    var hamController = Ham.application.getController('HamController');
                    hamController.unPressedAllTopToolBtns();
                    btn.setPressed(true);
                    MAINCANVAS.activateZoom(btn);
                    if(UTILITY.isCompareActivated())
                        COMPARECANVAS.activateZoom();
                }
            }
        };
    },

    /**
    * Functionality : Get the separator button
    * @param : {String} iconPath
    * @return: none
    */
    getSeparatorBtn: function(iconPath) {
        return {
            tooltip: languagePack.separations,
            icon: iconPath + 'separator.png',
            name: 'sepBtn',
            customPressed: false,
            handler: function(btn) {
                if(Constants.hamReady) {
                    var hamController = Ham.application.getController('HamController'),
                        leftDrawer = Ext.ComponentQuery.query('leftdrawer')[0],
                        separationTab = leftDrawer.down('panel[name=separationTab]');
                    if(!btn.customPressed) {
                        hamController.unPressedAllTopToolBtns();
                        btn.setPressed(true);
                        btn.customPressed = true;
                        leftDrawer.animCollapsed && leftDrawer.animExpand();
                        leftDrawer.setActiveTab(separationTab);
                        MAINCANVAS.deactivateAllFunctionality();
                        COMPARECANVAS && COMPARECANVAS.deactivateAllFunctionality();
                    }
                    else {
                        btn.setPressed(false);
                        btn.customPressed = false;
                        !leftDrawer.animCollapsed && leftDrawer.animCollapse();
                    }
                }
            }
        };
    },

    /**
    * Functionality : Get the densitometer button
    * @param : {String} iconPath
    * @return: none
    */
    getDensitometerBtn: function(iconPath) {
        return {
            tooltip: languagePack.densitometer,
            icon: iconPath + 'densitometer.png',
            name: 'densitometerBtn',
            handler: function(btn) {
                if(Constants.hamReady) {
                    var hamController = Ham.application.getController('HamController'),
                        leftDrawer = Ext.ComponentQuery.query('leftdrawer')[0];

                    UTILITY.stopAjaxRequest();

                    if(!btn.customPressed) {
                        hamController.unPressedAllTopToolBtns();
                        btn.setPressed(true);
                        btn.customPressed = true;

                        //Unpressed separation button
                        var seprationBtn = btn.up('toolbar').down('button[name=sepBtn]');
                        seprationBtn.setPressed(false);
                        seprationBtn.customPressed = false;

                        MAINCANVAS.activateDensitometer();
                        COMPARECANVAS && COMPARECANVAS.deactivateAllFunctionality();
                        !leftDrawer.animCollapsed && leftDrawer.animCollapse();
                    }
                    else {
                        btn.setPressed(false);
                        hamController.hideDensitomerPanel();
                        btn.customPressed = false;
                        MAINCANVAS.deactivateDensitometer();
                    }
                }
            }
        };
    },

    /**
    * Functionality : Get the circular annotation button
    * @param : {String} iconPath
    * @return: none
    */
    getCircularBtn: function(iconPath) {
        return {
            tooltip: languagePack.addComment,
            icon: iconPath + 'add_annotation.png',
            name: 'addCircularAnnotation',
            handler: function(btn) {
                if(Constants.hamReady) {
                    var hamController = Ham.application.getController('HamController');
                    UTILITY.stopAjaxRequest();
                    if(!btn.customPressed) {
                        hamController.unPressedAllTopToolBtns();
                        btn.setPressed(true);
                        btn.customPressed = true;
                        MAINCANVAS.activateCircularAnnotation();
                    }
                    else {
                        btn.setPressed(false);
                        btn.customPressed = false;
                        MAINCANVAS.deactivateCircularAnnotation();
                    }
                }
            }
        };
    },

    /**
    * Functionality : Get the freehand annotation button
    * @param : {String} iconPath
    * @return: none
    */
    getFreeHandBtn: function(iconPath) {
        return {
            tooltip: languagePack.freehand,
            icon: iconPath + 'freehand_annotation.png',
            name: 'addFreeHandAnnotation',
            handler: function(btn) {
                if(Constants.hamReady) {
                    var hamController = Ham.application.getController('HamController');
                    UTILITY.stopAjaxRequest();
                    if(!btn.customPressed) {
                        hamController.unPressedAllTopToolBtns();
                        btn.setPressed(true);
                        btn.customPressed = true;
                        MAINCANVAS.activateFreeHandAnnotation();
                    }
                    else {
                        btn.setPressed(false);
                        btn.customPressed = false;
                        MAINCANVAS.deactivateFreeHandAnnotation();
                    }
                }
            }
        };
    },

    /**
    * Functionality : Get the reject button
    * @param : {String} iconPath
    * @return: none
    */
    getRejectBtn: function(iconPath) {
        return {
            tooltip: languagePack.rejectComments,
            icon: iconPath + 'reject.png',
            name: 'reject',
            handler: function() {

                var dialog = Ext.Msg.show({
                    title : languagePack.rejectComments,
                    msg : languagePack.reqMessage,
                    buttons : Ext.Msg.YESNO,
                    icon: Ext.Msg.QUESTION,
                    closable: false,
                    fn: function(btn) {
                         if(btn === 'yes') {
                            window.location.href = Constants.soapBaseUrl +
                                Constants.actionUrl.requestAmendUrl + "?stagesID=" +
                                Constants.userInfo.stageId + "&userID=" +
                                Constants.userInfo.userId + "&taskId=" +
                                Constants.userInfo.taskId + "&approved=false" +
                                Constants.configs.acceptRejectExtraParams;
                        }
                    }
                });

                //Don't have focus so set to button 3 which doesn't exist
                dialog.defaultButton = 3;
            }
        };
    },

    /**
    * Functionality : Get the Accept button
    * @param : {String} iconPath
    * @return: none
    */
    getAcceptBtn: function(iconPath) {
        return {
            tooltip: languagePack.approveComments,
            icon: iconPath + 'approve.png',
            name: 'approve',
            handler: function() {
                var dialog = Ext.Msg.show({
                    title : languagePack.approveComments,
                    msg : languagePack.appMessage,
                    buttons : Ext.Msg.YESNO,
                    icon: Ext.Msg.QUESTION,
                    closable: false,
                    fn: function(btn) {
                        if(btn === 'yes') {
                            window.location.href = Constants.soapBaseUrl +
                                Constants.actionUrl.approveArtworkUrl + "?stagesID=" +
                                Constants.userInfo.stageId+ "&userID=" +
                                Constants.userInfo.userId + "&taskId=" +
                                Constants.userInfo.taskId + "&approved=true" +
                                Constants.configs.acceptRejectExtraParams;
                        }
                    }
                });

                //Don't have focus so set to button 3 which doesn't exist
                dialog.defaultButton = 3;
            }
        };
    }
});