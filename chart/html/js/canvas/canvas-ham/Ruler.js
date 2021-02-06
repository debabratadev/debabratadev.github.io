/*
 *
 *Ruler is one of the functionality. User can select an area and current
 *Dimension will be displayed somewhere
 *
 */

function Ruler(currentCanvas, info, components) {
    'use strict';

    var me = this,
        strokeStyle = '#FF0000',
        startX,
        startY;

    function reset() {
        me.startX = undefined;
        me.startY = undefined;
        me.movedToX = undefined;
        me.movedToY = undefined;
    }

    function setEnableResizers(enable) {
        components.rulerEastResizer.visible = enable;
        components.rulerWestResizer.visible = enable;
        components.rulerNorthResizer.visible = enable;
        components.rulerSouthResizer.visible = enable;
    }

    //Check if edges contacted or not
    function isEdgesContacted(x, y) {
        return components.rulerEastResizer.hitTest(x, y) ||
                components.rulerWestResizer.hitTest(x, y) ||
                components.rulerNorthResizer.hitTest(x, y) ||
                components.rulerSouthResizer.hitTest(x, y);
    }

    this.x = 0;
    this.y = 0;
    this.width = currentCanvas.canvasProp.screenWidth;
    this.height = currentCanvas.canvasProp.screenHeight;
    this.draggable = true;
    this.originalX = this.x;
    this.originalY = this.y;
    this.visible = false;
    this.cursor = 'crosshair';
    this.contacted = function(x, y) {
        if(!isEdgesContacted(x, y)) {
            startX = x;
            startY = y;
            setEnableResizers(false);

            if(Constants.compare.activated) {
                if(currentCanvas.canvasId == 'mainhamCanvas') {
                    COMPARECANVAS.hideRuler();
                    MAINCANVAS.showRuler();
                }
                else {
                    MAINCANVAS.hideRuler();
                    COMPARECANVAS.showRuler();
                }
            }
        }
    };
    this.dragging = function(x, y) {
        this.startX = startX;
        this.startY = startY;
        this.movedToX = x;
        this.movedToY = y;
        this.zoomedWidth = this.movedToX - this.startX,
        this.zoomedHeight = this.movedToY - this.startY;

        //Manipulate points if -ve
        if(this.zoomedWidth < 0 && this.zoomedHeight > 0) {
            this.startX += this.zoomedWidth;
            this.movedToX -= this.zoomedWidth;
        }
        if(this.zoomedWidth > 0 && this.zoomedHeight < 0) {
            this.startY += this.zoomedHeight;
            this.movedToY -= this.zoomedHeight;
        }
        if(this.zoomedWidth < 0 && this.zoomedHeight < 0) {
            this.startX += this.zoomedWidth;
            this.movedToX -= this.zoomedWidth;
            this.startY += this.zoomedHeight;
            this.movedToY -= this.zoomedHeight;
        }

        this.zoomedWidth = this.movedToX - this.startX,
        this.zoomedHeight = this.movedToY - this.startY;
    };
    this.draw = function(ctx) {
        var prevStroke = ctx.strokeStyle;
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.strokeRect(this.startX, this.startY, this.zoomedWidth, this.zoomedHeight);
        ctx.closePath();

        //Diagonal
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.startX + this.zoomedWidth, this.startY + this.zoomedHeight);
        ctx.stroke();
        ctx.strokeStyle = prevStroke;
    };
    this.dropEvent = function() {
        this.setEdgeDimension();
    };
    this.hitTest = function(x, y) {
        return (x > me.originalX && x < me.originalX + me.width &&
            y > me.originalY && y < me.originalY + me.height);
    };
    this.activate = function() {
        this.visible = true;
        this.finger = true;
    };
    this.deactivate = function() {
        this.visible = false;
        this.finger = false;
        reset();
        setEnableResizers(false);
    };
    this.hide = function() {
        setEnableResizers(false);
        reset();
    };
    this.show = function() {
        this.visible = true;
    };
    this.setEdgeDimension = function() {
        var rulerEastResizer = components.rulerEastResizer,
            rulerWestResizer = components.rulerWestResizer,
            rulerNorthResizer = components.rulerNorthResizer,
            rulerSouthResizer = components.rulerSouthResizer;

        setEnableResizers(true);

        rulerEastResizer.setXY(me.startX + me.zoomedWidth, me.startY);
        rulerEastResizer.height = me.zoomedHeight;

        rulerWestResizer.setXY(me.startX, me.startY);
        rulerWestResizer.height = me.zoomedHeight;

        rulerNorthResizer.setXY(me.startX, me.startY);
        rulerNorthResizer.width = me.zoomedWidth;

        rulerSouthResizer.setXY(me.startX, me.startY + me.zoomedHeight);
        rulerSouthResizer.width = me.zoomedWidth;

        Ham.application.getController('HamController').
                updateRulerDimension(this.zoomedWidth, this.zoomedHeight, info.currentDpi);
    };
}

function RulerVerticalResizer(currentCanvas, info, components) {
    'use strict';

    var me = this,
        strokeStyle = '#FF0000',
        ruler = components.ruler,
        touchCircle = 50,
        drawCirle = false;

    this.side = undefined;
    this.draggable = true;
    this.finger = true;
    this.cursor = 'e-resize';
    this.width = Ext.supports.TouchEvents ? 26 : 8;
    this.visible = false;

    this.setXY = function(x, y) {
        this.lastX = this.originalX = this.x = x;
        this.originalY = this.y = y;
    };

    this.contacted = function(x, y) {
        if(Ext.supports.TouchEvents) {
            drawCirle = true;
            this.touchX = x;
            this.touchY = y;
            this.draw(currentCanvas.canvasProp.ctx);
        }
    };

    this.dragging = function(x, y) {
        if(Ext.supports.TouchEvents) {
            this.touchX = x;
            this.touchY = y;
        }
        this.y = this.originalY;
        if(this.side === 'east') {
            ruler.zoomedWidth += (this.x - this.lastX);
        }
        if(this.side === 'west') {
            ruler.startX += (this.x - this.lastX);
            ruler.zoomedWidth -= (this.x - this.lastX);
        }

        this.lastX = this.x;
        ruler.setEdgeDimension();
    };
    this.draw = function(ctx) {
        var prevStroke = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
        ctx.closePath();

        //Draw ring and arrow for iPad
        if(Ext.supports.TouchEvents && drawCirle) {
            var arrowX = this.touchX - 15,
                arrowY = this.touchY - touchCircle - 5,
                arrowLength = 30;

            ctx.strokeStyle = '#0000FF';
            ctx.beginPath();
            ctx.moveTo(arrowX + 5, arrowY + 5);
            ctx.lineTo(arrowX, arrowY);
            ctx.lineTo(arrowX + 5, arrowY - 5);
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX + arrowLength, arrowY);
            ctx.moveTo(arrowX + arrowLength - 5, arrowY + 5);
            ctx.lineTo(arrowX + arrowLength, arrowY);
            ctx.lineTo(arrowX + arrowLength - 5, arrowY - 5);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.touchX, this.touchY, touchCircle, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.strokeStyle = prevStroke;
    };
    this.dropEvent = function() {
        drawCirle = false;
    };

    this.hitTest = function(x, y) {
        var hitArea = this.width / 2;
        return (x > me.x - hitArea && x < me.x + hitArea && y > me.y && y < me.y + me.height);
    };
}

function RulerHorizontalResizer(currentCanvas, info, components) {
    'use strict';

    var me = this,
        strokeStyle = '#FF0000',
        ruler = components.ruler,
        touchCircle = 50,
        drawCirle = false;

    this.side = undefined;
    this.draggable = true;
    this.finger = true;
    this.cursor = 'n-resize';
    this.height = Ext.supports.TouchEvents ? 25 : 8;
    this.visible = false;

    this.setXY = function(x, y) {
        this.originalX = this.x = x;
        this.lastY = this.originalY = this.y = y;
    };

    this.contacted = function(x, y) {
        if(Ext.supports.TouchEvents) {
            drawCirle = true;
            this.touchX = x;
            this.touchY = y;
            this.draw(currentCanvas.canvasProp.ctx);
        }
    };

    this.dragging = function(x, y) {
        if(Ext.supports.TouchEvents) {
            this.touchX = x;
            this.touchY = y;
        }
        this.x = this.originalX;
        if(this.side === 'north') {
            ruler.startY += (this.y - this.lastY);
            ruler.zoomedHeight -= (this.y - this.lastY);
        }
        if(this.side === 'south') {
            ruler.zoomedHeight += (this.y - this.lastY);
        }
        this.lastY = this.y;
        ruler.setEdgeDimension();
    };
    this.draw = function(ctx) {
        var prevStroke = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
        ctx.closePath();

        //Draw ring and arrow for iPad
        if(Ext.supports.TouchEvents && drawCirle) {
            var arrowX = this.touchX,
                arrowY = this.touchY - touchCircle - 40,
                arrowLength = 30;

            ctx.strokeStyle = '#0000FF';
            ctx.beginPath();
            ctx.moveTo(arrowX + 5, arrowY + 5);
            ctx.lineTo(arrowX, arrowY);
            ctx.lineTo(arrowX - 5, arrowY + 5);
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX, arrowY + arrowLength);
            ctx.moveTo(arrowX - 5, arrowY + arrowLength - 5);
            ctx.lineTo(arrowX, arrowY + arrowLength);
            ctx.lineTo(arrowX + 5, arrowY + arrowLength - 5);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(this.touchX, this.touchY, touchCircle, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
        ctx.strokeStyle = prevStroke;
    };
    this.dropEvent = function() {
        drawCirle = false;
    };

    this.hitTest = function(x, y) {
        var hitArea = this.height / 2;
        return (x > me.x && x < me.x + me.width && y > me.y - hitArea && y < me.y + hitArea);
    };
}
