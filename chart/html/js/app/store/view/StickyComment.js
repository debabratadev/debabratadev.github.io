
Ext.define('Ham.view.StickyComment', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.stickycomment',
    useArrows: true,
    rootVisible: false,
    border: 0,
    animate: true,
    singleExpand: true,
    initComponent: function() {
        var me = this;
        this.columns = [{
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: languagePack.stickyCommentTabComment,
            flex: 1,
            sortable: true,
            dataIndex: 'task'
        },{
            text: languagePack.stickyCommentTabCreatedBy,
            flex: 1,
            maxWidth: 150,
            dataIndex: 'user',
            sortable: true
        }];

        me.callParent(arguments);
    }
});