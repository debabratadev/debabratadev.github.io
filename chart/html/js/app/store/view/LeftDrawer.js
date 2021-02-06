/*
Creation date: 7-21-2013
Purpose:  Left side drawer for ham page is defined here.
Created By : Opal.
*/

Ext.define('Ham.view.LeftDrawer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.leftdrawer',

    width: 200,
    minWidth: 100,
    height: Constants.screenHeight - (Constants.topToolbarHeight + Constants.bottomToolbarHeight + 1), //Two toolbar height + border height
    floating: {
        shadow: false
    },
    x: 0,
    y: Constants.topToolbarHeight,
    layout: 'fit',
    plain: true,
    header: false,
    tabPosition: 'right',
    resizable: 'true',
    resizeHandles: 'e',
    cls: 'left-tab-panel',
    animCollapsed: true,
    animCollapse: function() {
        var minWidth = this.minWidth,
            visibleWidth = 27,
            leftDrawer = this;

        leftDrawer.minWidth = 0;
        leftDrawer.currentWidth = leftDrawer.width;

        //While rendering don't animate
        if(!leftDrawer.animCollapsed) {
            leftDrawer.animate({
                to: {
                    width: visibleWidth
                }
            });
        }
        else {
            leftDrawer.setWidth(visibleWidth);
            leftDrawer.minWidth = minWidth;
        }

        leftDrawer.animCollapsed = true;
        var activeTab = leftDrawer.getActiveTab();
        activeTab.fireEvent('customcollapse', activeTab);
    },
    animExpand: function() {
        var leftDrawer = this;
        var activeTab = leftDrawer.getActiveTab();
        activeTab.fireEvent('customexpand', activeTab);
        leftDrawer.animate({
            to: {
                width: leftDrawer.currentWidth
            },
            dynamic: true
        });
        leftDrawer.animCollapsed = false;
    },
    initComponent: function() {
        var leftDrawer = this;

        Ext.applyIf(leftDrawer, {
            tabBar: {
                cls: 'drawer-tbar'
            },
            items: [
                leftDrawer.getDocumentTab(),
                leftDrawer.getCommentTab(),
                leftDrawer.getCompareTab(),
                leftDrawer.getSeparationsTab()
            ],
            listeners: {
                render: function() {
                    this.items.each(function(panel) {
                        // Added tabclick event for tabpanel
                        panel.tab.on('click', function() {
                            panel.fireEvent('tabclick', panel);
                        });
                    });
                },
                boxready: function() {
                    this.animCollapse();
                }
            }
        });

        leftDrawer.callParent(arguments);
    },

    /**
    * Functionality : Refresh grid after some delay
    * @param : {object} grid
    * @return: none
    */
    refreshGridView: function(grid) {
        Ext.defer(function() {
            grid.getView().refresh();
        }, 30);
    },

    /**
    * Functionality : Get Document Tab config
    * @param : none
    * @return: none
    */
    getDocumentTab: function() {
        return {
            title: languagePack.document,
            layout: 'fit',
            items: [{
                title: languagePack.document,
                bodyCls: 'document-drawer',
                autoScroll: true,
                bodyPadding: 5,
                border: 0,
                name: 'documentViewer',
                tools: [{
                    type:'left',
                    tooltip: languagePack.collapseDrawer,
                    handler: function() {
                        this.up('leftdrawer').animCollapse();
                    }
                }],
                items: [{
                    name: 'documentContaniner',
                    border: false
                }],
                listeners: {
                    boxready: function(panel) {
                        var timer = null,
                            eventName = 'scroll',
                            delay = 500;

                        if(Ext.supports.TouchEvents) {
                            eventName = 'touchmove';
                            delay = 2000;
                        }
                        panel.getTargetEl().on(eventName, function(e, t) {

                            //Don't Load image while scrolling programatically
                            if(panel.programmedScroll) {
                                panel.programmedScroll = false;
                                return;
                            }

                            //Check for scrolling end event
                            if(timer !== null) {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function() {
                                var hamController = Ham.application.getController('HamController');
                                hamController.showLoadingImageInDoc();
                            }, delay);
                        });
                    }
                }
            }],
            listeners: {
                activate: function(panel) {

                    //Fix for horizontal scroll in document tab
                    Ext.defer(function() {
                        panel.down('panel[name=documentViewer]').updateLayout();
                    }, 200);
                }
            }
        };
    },

    /**
    * Functionality : Get Comment Tab config
    * @param : none
    * @return: none
    */
    getCommentTab: function() {
        return {
            title: languagePack.comments,
            name: 'commentTab',
            layout: 'fit',
            items: [{
                title: languagePack.comments,
                border: 0,
                xtype: 'panel',
                layout: 'fit',
                tools: [{
                    type: 'refresh',
                    name: 'commentRefresh',
                    tooltip: languagePack.refreshComments,
                    disabled: true,
                    handler: function() {

                        //Mimic a server call
                        UTILITY.refreshComment = true;
                        UTILITY.showProgress();
                        this.disable();
                    }
                }, {
                    type: 'left',
                    tooltip: languagePack.collapseDrawer,
                    handler: function() {
                        this.up('leftdrawer').animCollapse();
                    }
                }]
            }]
        };
    },

    /**
    * Functionality : Get Compare Tab config
    * @param : none
    * @return: none
    */
    getCompareTab: function() {
        var leftDrawer = this;

        return {
            title: languagePack.compare,
            layout: 'fit',
            name: 'compareTab',
            items: [{
                xtype: 'grid',
                forceFit: 'true',
                name: 'compareGrid',
                tools:[{
                    type:'left',
                    tooltip: languagePack.collapseDrawer,
                    handler: function(){
                        this.up('leftdrawer').animCollapse();
                    }
                }],
                tbar: [{
                    icon: Constants.hamServerPath + Constants.imagePath + 'toggle_on.png',
                    text: languagePack.toggleBtn,
                    name: 'toggleHam',
                    customPressed: false,
                    handler: function(btn) {
                        if(Constants.compare.activated) {
                            var mainHamImage = MAINCANVAS.components.hamImageContainer,
                                compHamImage = COMPARECANVAS.components.hamImageContainer;

                            if(btn.customPressed) {
                                btn.customPressed = false;
                                btn.setPressed(false);
                                clearInterval(btn.intervalId);
                                compHamImage.toggle.show = false;
                            }
                            else {
                                btn.customPressed = true;
                                btn.setPressed(true);

                                //Have a timer to constantly change toggle imgage.
                                var intervalId = setInterval(function() {
                                    var images = mainHamImage.getToggleImages();

                                    compHamImage.setToggleImages(images);
                                    compHamImage.toggle.show = !compHamImage.toggle.show;
                                    COMPARECANVAS.canvasProp.canMan.draw();
                                }, 500);
                                btn.intervalId = intervalId;
                            }
                        }
                    }
                }],
                border: 0,
                cls: 'compare-tab',
                store: Ext.create('Ham.store.Compare'),
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    showHeaderCheckbox: false,
                    mode: 'single',
                    allowDeselect: true,
                    listeners: {
                        beforeselect: function(model, record, index) {
                            model.selections = model.getSelection();
                        },
                        select: function(model, record) {
                            leftDrawer.selectCompareVersion(record);
                        },
                        deselect: function() {
                            COMPARECANVAS.components.hamImageContainer.resetImage();
                            COMPARECANVAS.removeAllAnnotations();

                            //Remove all stickies while switching
                            var annotations = Ext.ComponentQuery.query('annotation');
                            annotations.forEach(function(annotation) {
                                if(annotation.annoType == 'comparehamCanvas') {
                                    annotation.destroy();
                                }
                            });
                        }
                    }
                }),
                columns: [{
                    text: languagePack.fileName,
                    dataIndex: 'assetName'
                }],
                columnLines: true,
                height: 300,
                title: languagePack.compare
            }],
            listeners: {
                boxready:function(grid) {

                    var hamController = Ham.application.getController('HamController');
                    hamController.loadCompareArtworks();
                },
                activate: function(panel) {
                    leftDrawer.refreshGridView(panel.down('grid'));
                    var viewport = Ext.ComponentQuery.query('hamviewport')[0],
                    compareBtn = viewport.down('button[name=compareBtn]');

                    compareBtn.setPressed(true);
                    compareBtn.customPressed = true;
                },
                deactivate: function(panel) {
                    //Don't apply unpressed property if compare is on
                    if(!Constants.compare.activated) {
                        var viewport = Ext.ComponentQuery.query('hamviewport')[0],
                        compareBtn = viewport.down('button[name=compareBtn]');

                        compareBtn.setPressed(false);
                        compareBtn.customPressed = false;
                    }
                },
                customexpand: function(panel) {
                    var viewport = Ext.ComponentQuery.query('hamviewport')[0],
                    compareBtn = viewport.down('button[name=compareBtn]');

                    compareBtn.setPressed(true);
                    compareBtn.customPressed = true;
                }
            }
        };
    },

    /**
    * Functionality : Get Separations Tab config
    * @param : none
    * @return: none
    */
    getSeparationsTab: function() {
        var leftDrawer = this;

        return {
            title: languagePack.separations,
            layout: 'fit',
            name: 'separationTab',
            items: [{
                xtype: 'grid',
                forceFit: 'true',
                tools: [{
                    type:'left',
                    tooltip: languagePack.collapseDrawer,
                    handler: function(){
                        this.up('leftdrawer').animCollapse();
                    }
                }],
                tbar: [{
                    text: languagePack.selectAll,
                    name: 'selectAll',
                    handler: function(btn) {
                        MAINCANVAS.setSeperation('All');
                        if(UTILITY.isCompareActivated())
                            COMPARECANVAS.setSeperation('All');
                    }
                }],
                border: 0,
                store: Ext.create('Ham.store.Separations'),
                selModel: Ext.create('Ext.selection.CheckboxModel', {
                    showHeaderCheckbox: false
                }),
                columns: [{
                    text: languagePack.colorName,
                    dataIndex: 'colourName',
                    renderer: function(value, meta, record) {
                        var colorBox = '<div style="width: 15px; height: 15px; float: left; margin-right: 5px;' +
                        'background-color: rgba(' + record.get('colourCode') + ');"></div>' + value;
                        return colorBox;
                    }
                }],
                columnLines: true,
                height: 300,
                title: languagePack.separations,
                name: 'separationGrid',
                listeners: {
                    boxready: function(grid) {
                        var hamController = Ham.application.getController('HamController');
                        hamController.loadSeparationGrid();
                    },
                    itemclick: function(grid, record) {
                        var  selModel = grid.getSelectionModel();
                        selModel.deselectAll(true);
                        selModel.select(record);
                        MAINCANVAS.setSeperation(record.get('colourName'));
                        if(UTILITY.isCompareActivated()) {
                            COMPARECANVAS.setSeperation(record.get('colourName'));
                        }
                        grid.ownerCt.down('button[name=selectAll]').enable();
                    }
                }
            }],
            listeners: {
                activate: function(panel) {
                    leftDrawer.refreshGridView(panel.down('grid'));

                    var viewport = Ext.ComponentQuery.query('hamviewport')[0],
                        sepBtn = viewport.down('button[name=sepBtn]');
                    sepBtn.setPressed(true);
                    sepBtn.customPressed = true;
                },
                deactivate: function(panel) {
                    var viewport = Ext.ComponentQuery.query('hamviewport')[0],
                        sepBtn = viewport.down('button[name=sepBtn]');
                    sepBtn.setPressed(false);
                    sepBtn.customPressed = false;
                },
                customexpand: function(panel) {
                    var viewport = Ext.ComponentQuery.query('hamviewport')[0],
                        sepBtn = viewport.down('button[name=sepBtn]');
                    sepBtn.setPressed(true);
                    sepBtn.customPressed = true;
                }
            }
        };
    },

    /**
    * Functionality : Select compare version and activate compare
    * @param : {object} record
    * @return: none
    */
    selectCompareVersion: function(record) {
        var hamController = Ham.application.getController('HamController'),
            fileName = record.get('directory') + record.get('filename'),
            stageId = record.get('id');

        //reset
        MAINCANVAS.fitToCanvas();
        Constants.compare.activated = true;

        UTILITY.maskViewportForCompare();

        var callbackFn = function(imageParams, extraObj) {
            COMPARECANVAS.stageId = stageId;
            COMPARECANVAS.pdfFile = fileName;
            Constants.compare.stageId = COMPARECANVAS.stageId;
            Constants.compare.pdfFile = fileName;

            UTILITY.loadCompareFitImage(imageParams, extraObj);
        };

        //Activate only if there was no selection before
        if(!UTILITY.isCompareActivated()) {
            hamController.activateCompareMode(callbackFn, {
                compareActivated: Constants.compare.activated,
                pdfFile: fileName,
                stageId: stageId
            });
        }
        else {
            var compareCanvas = Ext.ComponentQuery.query('hamviewport panel[name=comparehamCanvas]')[0];

            //Load Compare canvas image
            hamController.loadHamImage(compareCanvas, fileName, stageId, true,
                callbackFn, {
                compareActivated: Constants.compare.activated
            });
        }
    }
});