/*
Creation date: 7-21-2013
Purpose:  Navigator(Right bottom) for ham main page is defined here.
Created By : Opal.
*/

Ext.define('Ham.view.Navigator', {
    extend: 'Ext.window.Window',
    alias: 'widget.navigator',
    width: 212,
    height: 280,
    floating: true,
    collapsible: true,
    draggable: true,
    resizable: false,
    closable: false,
    border: 0,
    ghost: false,
    padding: 0,
    x: Constants.screenWidth - 232,
    y: Constants.screenHeight - 330,
    constrainHeader: true,
    bodyStyle: 'background: #e8e8e8',
    cls: 'navigator-win',

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [{
                xtype: 'box',
                height: 202,
                border: '1 1 1 1',
                style: {
                    borderColor: '#bcb1b0',
                    borderStyle: 'solid',
                    background: '#FFFFFF'
                },
                margin: 4,
                width: 202,
                name: 'navContnr',
                html: '<canvas id="hamThumbnail" class="canvas-element" >' +
                'Your browser does not support the HTML5 canvas tag.' +
                '</canvas>'
            }, {
                xtype: 'box',
                border: '0 0 1 0',
                style: {
                    borderColor: '#bcb1b0',
                    borderStyle: 'solid',
                    background: '#e8e8e8'
                }
            }, {
                xtype: 'slider',
                increment: 1,
                width: 170,
                name: 'navSlider',
                cls: 'thumbnail-slider',
                style: {
                    "margin-top": Ext.browser.is.IE ? "3px" : "9px"
                },
                tipText: function(thumb) {
                    return parseInt(thumb.value);
                },
                maxValue: parseInt(Constants.maxDpi * 100 / Constants.hundredPercentDpi)
            }, {
                xtype: 'box',
                margin: 3,
                name: 'zoomPercentageBox',
                style: 'text-align: center'
            }]
        });

        me.callParent(arguments);
    }
});