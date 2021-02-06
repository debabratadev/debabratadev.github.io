/*
Creation date: 7-24-2014
Purpose:  Store for Compare tab defined here .
Created By : Opal.
*/

Ext.define('Ham.store.Compare', {
    extend: 'Ext.data.Store',
    model: 'Ham.model.Compare',
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