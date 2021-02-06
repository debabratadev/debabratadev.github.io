/*
Creation date: 10-31-2013
Purpose:  Colour palette/picker for freehand sticky.
Created By : Opal.
*/

Ext.define('Ham.view.ColourPalette', {
    extend: 'Ext.picker.Color',
    alias: 'widget.colourpalette',

    title: '',
    closable: false,
    floating: true,
    modal: true,
    value: '993300',  // initial selected color
    listeners: {
        select: function(picker, selColor) {
            picker.freeHandAnno.changeLineStroke(selColor);
            picker.destroy();
        }
    },
    initComponent: function() {
        var me = this;

        me.renderTo = document.body;
        me.callParent(arguments);
    }
});
