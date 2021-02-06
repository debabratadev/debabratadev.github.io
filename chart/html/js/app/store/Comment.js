Ext.define('Ham.store.Comment', {
    extend:'Ext.data.TreeStore',
    model: 'Ham.model.Comment',
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json'
        }
    }
});