/*
Creation date: 7-21-2014
Purpose:  Application page for Ham main page is defined here .
Created By : Opal.
*/

//Load everything at once
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});

//Ext.Ajax.disableCaching = false;

//Add Version as get parameter in all Extjs Files
Ext.override(Ext.Loader, {
    getPath: function (className) {
        var Manager = Ext.ClassManager;

        // Paths are an Ext.Inventory thing and ClassManager is an instance of that:
        var file = Manager.getPath(className) + '?version=' + Constants.version;
        return file;
    }
});

Ext.application({
    name: 'Ham',
    controllers: ['HamController'],
    appFolder: 'js/app',
    launch: function () {
        debugger
        Ham.application = this;

        //Hook point for other sites to make any changes on HAM after HAM is built
        if (window.beforeHamBuildCallbackFn) {
            var returnObj = beforeHamBuildCallbackFn();
            if (!returnObj.success) {
                return;
            }
        }

        Ham.application.loadUserData();

        //Check if artwork is not available
        if (Ext.isEmpty(Constants.userInfo.stageId)) {
            UTILITY.showErrMessage(languagePack.errorText, languagePack.artworkError,
                function (btn, text) {
                    if (btn == 'ok') {
                        window.history.back();
                    }
                }
            );
            return;
        }

        this.inheritComponentFromDefault();

        window.scrollTo(0, 0);

        //For button tooltip
        Ext.tip.QuickTipManager.init();

        //Fix for tip clittering issue
        delete Ext.tip.Tip.prototype.minWidth;
        if (Ext.isIE10) {
            Ext.supports.Direct2DBug = true;
        }

        Ext.get('loading-image').destroy();

        Ham.application.getColourData();

        var viewport = Ext.create('Ham.view.HamViewport', {
            readOnlyHam: Constants.userInfo.readOnly
        });
        var leftDrawer = Ext.create('Ham.view.LeftDrawer').show();
        var navigator = Ext.create('Ham.view.Navigator').show();

        navigator.setTitle(languagePack.thumbnailPalette);

        //As toolbars are now floating we need to position them
        var topToolbar = viewport.down('toolbar[name=topToolbar]'),
            bottomToolbar = viewport.down('toolbar[name=bottomToolbar]');
        topToolbar.setPosition(-1, -topToolbar.getHeight() - 1);
        bottomToolbar.setPosition(-1, Constants.screenHeight - bottomToolbar.getHeight() - 39);

        viewport.mask('Loading...');
        topToolbar.mask();
        bottomToolbar.mask();
        navigator.mask();
        leftDrawer.mask();

        //Prevent body scrolling on touch devices
        Ext.getBody().on('touchmove', function (e) {
            if (Ext.supports.TouchEvents) {
                if (Ext.isEmpty(e.getTarget('div.left-tab-panel', document.body))) {
                    e.preventDefault();
                }
                else {

                    //Allow scrolling on left drawer
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, false);

        //Window resize event will take care all
        //        window.addEventListener('orientationchange', function() {
        //            Ham.application.reInitialize();
        //        });

        //On browser resize event update layout
        window.onresize = function () {

            //Check for resize end event
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
                Ham.application.reInitialize();
            }, 500);
        };

        //Hook point for other sites to make any changes on HAM after HAM is built
        window.afterHamBuildCallbackFn && afterHamBuildCallbackFn(viewport);
    },

    //Reinitialize layout to make request for fresh image
    reInitialize: function () {
        var viewport = Ext.ComponentQuery.query('hamviewport')[0],
            leftDrawer = Ext.ComponentQuery.query('leftdrawer')[0],
            topToolbar = viewport.down('toolbar[name=topToolbar]'),
            bottomToolbar = viewport.down('toolbar[name=bottomToolbar]'),
            navigator = Ext.ComponentQuery.query('navigator')[0];

        UTILITY.clearCollaboration();
        COMPARECANVAS = null;
        viewport.destroy();
        leftDrawer.destroy();

        //Destroy all annotations
        var annotations = Ext.ComponentQuery.query('annotation');
        annotations.forEach(function (annotation) {
            annotation.destroy();
        });

        Constants.screenWidth = window.innerWidth;
        Constants.screenHeight = window.innerHeight;

        leftDrawer = Ext.create('Ham.view.LeftDrawer', {
            height: Constants.screenHeight - (Constants.topToolbarHeight + Constants.bottomToolbarHeight + 1),
            x: 0,
            y: Constants.topToolbarHeight
        }).show();

        viewport = Ext.create('Ham.view.HamViewport', {
            dontLoadHam: Constants.compare.activated,
            readOnlyHam: Constants.userInfo.readOnly
        });

        //Reset toolbars
        topToolbar = viewport.down('toolbar[name=topToolbar]'),
            bottomToolbar = viewport.down('toolbar[name=bottomToolbar]');
        topToolbar.setPosition(-1, -topToolbar.getHeight() - 1);
        bottomToolbar.setPosition(-1, Constants.screenHeight - bottomToolbar.getHeight() - 39);
        navigator.setPosition(Constants.screenWidth - 232, Constants.screenHeight - 330);
        window.scrollTo(0, 0);
        NAVIGATORCANVAS.canvasProp.canMan.setCanvasPosition();

        //If compare was activated then then active automatically
        if (Constants.compare.activated) {
            var compareBtn = Ext.ComponentQuery.query('button[name=compareBtn]')[0];
            compareBtn.handler(compareBtn);
            var compareGrid = Ext.ComponentQuery.query('grid[name=compareGrid]')[0],
                compareStore = compareGrid.getStore(),
                CompareModel = compareGrid.getSelectionModel();

            compareGrid.autoSelectRecord = function () {
                var selectedIndex = compareStore.find('id', Constants.compare.stageId);
                CompareModel.select(selectedIndex);
            }
            Ext.ComponentQuery.query('hamviewport')[0].dontLoadHam = false;
        }

        //Hook point for other sites to make any changes on HAM
        window.independentCallbackFn && independentCallbackFn(viewport);
    },

    //Inherit here as we are loading javascripts file dynamically. Here all javascripts
    //files are ready
    inheritComponentFromDefault: function () {
        HamImageContainer.prototype = new TemplateObject();
        DensitometerCrossHair.prototype = new TemplateObject();
        AnnotationCircle.prototype = new TemplateObject();
        FreeHandAnnotation.prototype = new TemplateObject();
        PanningSurface.prototype = new TemplateObject();
        Ruler.prototype = new TemplateObject();
        RulerVerticalResizer.prototype = new TemplateObject();
        RulerHorizontalResizer.prototype = new TemplateObject();
        ZoomRectangle.prototype = new TemplateObject();
    },

    //Remove mask from viewport
    unmaskViewport: function () {
        var viewport = Ext.ComponentQuery.query('hamviewport')[0],
            leftDrawer = Ext.ComponentQuery.query('leftdrawer')[0],
            navigator = Ext.ComponentQuery.query('navigator')[0],
            topToolbar = viewport.down('toolbar[name=topToolbar]'),
            bottomToolbar = viewport.down('toolbar[name=bottomToolbar]');

        viewport.unmask();
        leftDrawer.unmask();
        navigator.unmask();
        topToolbar.unmask();
        bottomToolbar.unmask();

        if (!UTILITY.canvasContainerMasked) {
            Constants.hamReady = true;
        }
    },

    //Get user information
    loadUserData: function () {
        var params = {};
        params.taskId = Constants.userInfo.taskId;
        params.userId = Constants.userInfo.userId;

        UTILITY.makeApiCallWithoutMask(Constants.actionUrl.getUserCommandUrl, false, 'soap', {}, params, 'GET',
            function (jData) {
                Constants.userInfo.annotationInfo = {};
                Constants.userInfo.annotationInfo.userRole = jData.user.group;
                Constants.userInfo.annotationInfo.userName = jData.user.name;
                Constants.userInfo.annotationInfo.email = jData.user.email;
                Constants.userInfo.annotationInfo.filename = jData.user.filename;
                Constants.userInfo.annotationInfo.lang = jData.user.lang;

                if (languagePack == undefined) {
                    UTILITY.makeApiCallWithoutMask('lang/' + jData.user.filename, false, 'soap', {}, {}, 'GET',
                        function (jData) {
                            languagePack = jData.languagePack;
                        }
                    );
                }
            },
            function () {
                UTILITY.makeApiCallWithoutMask('lang/' + Constants.actionUrl.defaultLanguageUrl, false, 'soap', {}, {}, 'GET',
                    function (jData) {
                        languagePack = jData.languagePack;
                    }
                );
            }
        );
    },

    //Get the color info and save in constant so that we can reuse
    getColourData: function () {
        var params = {};
        params.taskId = Constants.userInfo.taskId;
        params.userId = Constants.userInfo.userId;

        UTILITY.makeApiCallWithoutMask(Constants.actionUrl.loadColorUrl, false, 'soap', {}, params, 'Get',
            function (colorData) {
                var annotationInfo = Constants.userInfo.annotationInfo;

                for (var j = 0; j < colorData.colors.length; j++) {
                    if (annotationInfo.userRole === colorData.colors[j].systemRoleName) {
                        annotationInfo.backgroundColor = colorData.colors[j].commentColour;
                    }
                }
                Constants.colorData = colorData;
            }
        );
    }
});