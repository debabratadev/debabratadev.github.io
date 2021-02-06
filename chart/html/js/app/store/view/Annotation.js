/*
Creation date: 9-25-2013
Purpose:  Annotation Panel.
Created By : Opal.
*/

Ext.define('Ham.view.Annotation', {
    extend: 'Ext.window.Window',
    alias: 'widget.annotation',

    title: '',
    width: 180,
    maxHeight: Constants.screenHeight - (Constants.topToolbarHeight + Constants.bottomToolbarHeight),
    minWidth: 1,
    collapsible: true,
    overflowY: true,
    shadow: false,
    resizable: {
        handles: 's',
        listeners: {
            beforeresize: function(resizer, width, height) {
                var annotation = resizer.target;
                if(!annotation.isresizeHeightSet) {
                    annotation.maxResizeHeight = height;
                    annotation.isresizeHeightSet = true;
                }
            },
            resize: function(resizer, width, height) {
                var annotation = resizer.target;
                if(height > annotation.maxResizeHeight) {
                    annotation.setHeight(annotation.maxResizeHeight);
                }
                annotation.doLayout();
            }
        }
    },
    draggable: {
        listeners: {
            dragstart: function(dragger) {
                var annotation = dragger.comp;
                annotation.addCls('annotation-drag');
            },
            drag: function(dragger) {
                var annotation = dragger.comp;
                if(annotation.annoType == 'mainhamCanvas') {
                    MAINCANVAS.moveAnnotationOnPanelDrag(annotation,
                        annotation.getX(), annotation.getY());
                }
                else {
                    COMPARECANVAS.moveAnnotationOnPanelDrag(annotation,
                        annotation.getX(), annotation.getY());
                }
                if(UTILITY.isCompareActivated()) {
                    var xPos = UTILITY.imulateAnnotationHiding(annotation, annotation.getX());
                    annotation.setPosition(xPos, annotation.getY());
                }
            },
            dragend: function(dragger) {
                var annotation = dragger.comp;
                annotation.removeCls('annotation-drag');

                //Update sticky position only when creator moves it
                //Don't allow when annotation is in compare canvas
                if(annotation.annoType == 'mainhamCanvas' &&
                    annotation.stickyInfo.stickyNote.createdBy == Constants.userInfo.userId) {
                    Ham.application.getController('HamController').
                        updateAnnotationPositionRemote(annotation.stickyInfo.stickyNote);
                }
            }
        }
    },
    ghost: false,
    closable: false,
    x: 232,
    y: 60,
    tools: [{
        type: 'plus',
        handler: function() {
            var found = false,
                annotation = this.up('annotation'),
                commentContainer = annotation.query('container[name=commentContainer]');

            //Only 1 comment per user per sticky - if clicking + and user
            //already has a comment, it puts their comment in to edit mode (focus)
            for(var i = 0, length = commentContainer.length; i < length; i++) {
                if(commentContainer[i].commentInfo.userId == Constants.userInfo.userId) {
                    found = i;
                }
            }

            if(found !== false) {
                var textareas = annotation.query('textarea'),
                    commentBox = textareas[found].nextSibling('box[name=commentBox]'),
                    value = Ext.String.htmlDecode(commentBox.html || commentBox.config.html);

                commentBox.setVisible(false);
                textareas[found].setVisible(true);
                textareas[found].setValue(value.replace(/<br>/gi, '\n'));
                textareas[found].focus();
            }
            else {
                var commentInfo = {
                    "gate": Constants.userInfo.annotationInfo.userRole,
                    "stickyId": annotation.stickyInfo.stickyNote.stickyId,
                    "userId": Constants.userInfo.userId,
                    "userName": Constants.userInfo.annotationInfo.userName
                };
                annotation.comment = '';
                annotation.addPanel(true, commentInfo);
            }
        }
    }],
    cls: 'annotation-win',

    backgroundColor: '#ADD8E0',
    userName: '',
    comment: '',
    addedPanelsCount: 0,

    /**
    * Functionality: Definition of comment container
    * @params: {Boolean} newAnnotation
    * @return: {Object} commentContainer
    */
    getExtendedPanel: function(newAnnotation, commentInfo) {
        var me = this;
        this.addedPanelsCount++;
        return {
            xtype: 'container',
            style: {
                background: '#' + this.backgroundColor,
                'border-top': this.addedPanelsCount > 1 ? '1px solid #bcb1b0' : '0'
            },
            cls: 'comment-container',
            name: 'commentContainer',
            items: [{
                xtype: 'box',
                name: 'userRole',
                margin: '0 0 5 1',
                html: '<span class="annot-user-role">'+ this.userRole + '</span>'
            }, {
                xtype: 'textarea',
                width: '100%',
                hidden: newAnnotation ? false : true,
                allowBlank: false,
                validateOnBlur: false,
                listeners: {
                    blur: function(comp) {

                        //Don't do anything if not visible
                        if(!comp.isVisible()) {
                            return;
                        }

                        var value = comp.getValue();
                        comp.focus();

                        if(Ext.isEmpty(value)) {
                            comp.checkValidation && comp.validate();
                            comp.checkValidation = true;
                            return false;
                        }

                        var commentBox = comp.nextSibling('box[name=commentBox]'),
                            commentContainer = comp.up('container[name=commentContainer]');
                        commentBox.setCustomValue(commentBox, Ext.String.htmlEncode(comp.getValue()));
                        commentContainer.commentInfo.value = value;
                        if(commentContainer.commentInfo.id) {
                             Ham.application.getController('HamController').
                                updateCommentOfSticky(commentContainer, comp, commentBox);
                        }
                        else {

                            //One user can add one comment in a sticky
                            //This is a fix for fix duplicate comment issue
                            //This happens when user try to focus again and again
                            if(!me.addedComment) {
                                me.addedComment = true;
                                Ham.application.getController('HamController').
                                    addCommentToSticky(me, commentContainer, comp, commentBox);
                            }
                        }
                        window.scrollTo(0, 0);
                    }
                }
            }, {
                xtype: 'box',
                name: 'commentBox',
                margin: '0 1 5 1',
                cls: 'annot-comment-box',
                minHeight: 10,
                hidden: newAnnotation ? true : false,
                html: this.comment.replace(/\n/gi, '<br>'),
                setCustomValue: function(comp, value) {
                    value = value.replace(/\n/gi, '<br>');
                    comp.update(value);
                },
                listeners: {
                    click: {
                        element: 'el',
                        fn: function() {

                            //Allow only for main canvas
                            var  annotation = this.component.up('annotation');
                            if(annotation.annoType !== 'mainhamCanvas' ||
                                    Constants.userInfo.readOnly === 'true') {
                                return;
                            }

                            var commentContainer = this.component.up('container[name=commentContainer]');

                            if(commentContainer.commentInfo.userId == Constants.userInfo.userId) {
                                this.component.setVisible(false);
                                var textField = this.component.previousSibling('textarea');
                                textField.setVisible(true);
                                var value = Ext.String.htmlDecode(this.component.html || this.component.config.html);
                                textField.setValue(value.replace(/<br>/gi, '\n'));
                                textField.focus();
                            }
                        }
                    }
                }
            }, {
                xtype: 'container',
                layout: 'column',
                items: [{
                    xtype: 'box',
                    columnWidth: 0.8,
                    cls: 'user-name-box',
                    html: '<span class="annot-user-name">' + this.userName + '</span>'
                }, {
                    xtype: 'container',
                    columnWidth: 0.2,
                    height: 18,
                    items: [{
                        xtype: 'button',
                        icon: Constants.hamServerPath + Constants.imagePath + 'delete-comment.png',
                        cls: 'annot-delete',
                        style: {
                            display: this.showTrashIcon ? 'visible' : 'none'
                        },
                        handler: function(deleteBtn) {

                            var commentContainer = deleteBtn.up('container[name=commentContainer]');
                            var dialog = Ext.Msg.show({
                                title: languagePack.deleteComment,
                                message: languagePack.delMessage,
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.QUESTION,
                                closable: false,
                                fn: function(btn) {
                                    if (btn === 'yes') {
                                        var successFn,
                                            controller = Ham.application.getController('HamController');

                                        if(me.addedPanelsCount == 1) {

                                            //Last comment to be deleted, ie no comments left, removes the enclosing
                                            //sticky container, pin head and connecting line
                                            successFn = function() {
                                                me.destroy();
                                                MAINCANVAS.removeAnnotation(me);
                                            }
                                            controller.removeAnnotaionRemote(me.stickyInfo.stickyNote, successFn);
                                        }
                                        else {
                                            successFn = function() {
                                                commentContainer.destroy();
                                                me.addedPanelsCount--;
                                            }
                                            controller.removeCommentRemote(commentContainer.commentInfo, successFn);
                                        }
                                    }
                                }
                            });
                            dialog.defaultButton = 2;
                            dialog.focus();
                        }
                    }]
                }]
            }]
        };
    },

    /**
    * Functionality: Add a new comment container to this annotation
    * @params: {Boolean} newAnnotation, {Object} commentInfo
    * @return: none
    */
    addPanel: function(newAnnotation, commentInfo) {
        this.showTrashIcon = (this.annoType == 'mainhamCanvas') &&
                (commentInfo.userId == Constants.userInfo.userId);

        //Hide for read only mode.
        if(Constants.userInfo.readOnly === 'true') {
            this.showTrashIcon = false;
        }

        var commentContainer = this.getExtendedPanel(newAnnotation, commentInfo);
        commentContainer.commentInfo = commentInfo;
        this.add(commentContainer);
        var textfields = this.query('textfield');

        //don't focus programatically for touch devices as blur(loose focus) seems to have problem
        !Ext.supports.TouchEvents && textfields[textfields.length - 1].focus();
    },

    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [],
            listeners: {
                boxready: function(panel) {
                    var header = panel.down('header').el;
                    header.on("click", function() {

                        var annotations = Ext.ComponentQuery.query('annotation');
                        annotations.forEach(function(annotation) {
                            annotation.removeCls('selected-annotation');
                        });

                        //Bring the selected annotation to the front
                        panel.addCls('selected-annotation');
                    });
                }
            }
        });

        me.callParent(arguments);
    }
});
