/*
Creation date: 7-23-2014
Purpose:  Store for Separaion tab defined here .
Created By : Opal.
*/

Ext.define('Ham.store.Separations', {
    extend: 'Ext.data.Store',
    model: 'Ham.model.Separation',
	constructor: function(cfg) { // constructor function which contains all config options.
		var me = this;
		cfg = cfg || {};
		me.callParent([Ext.apply({
			proxy: {
				type: 'ajax',
				reader: {
					type: 'json'
				}
			}
		}, cfg)]);
	}
});