/*
 * Its a free hand annotation
 */

function FreeHandAnnotation(canvasHam,info, components) {
    'use strict';

    var hamImageContainer = components.hamImageContainer,
        hitArea = Ext.supports.touchEvents ? 20 : 6,
        canvas = canvasHam.canvasProp.canvas;

    this.draggable = false;
    this.finger = false;
    this.cursor = 'pointer';
    this.panelWidth = undefined; //Half of annotation window width
    this.points = [];
    this.deflectionX = -200;
    this.deflectionY = 50;
    this.halfPanelX = undefined; //Connecting line joins the panel
    this.lineStroke = '#525252';
    this.draw = function(ctx) {
        var prevStroke = ctx.strokeStyle,
            prevLine = ctx.lineWidth;

        ctx.strokeStyle = this.lineStroke;
        ctx.lineWidth = 1;

        //Line
        ctx.beginPath();
        ctx.moveTo(this.points[0][0], this.points[0][1]);
        for(var i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        ctx.stroke();

        //Connecting Line
        ctx.beginPath();
        ctx.moveTo(this.points[0][0], this.points[0][1]);
        ctx.lineTo(this.halfPanelX, this.panelY);
        ctx.stroke();

        ctx.strokeStyle = prevStroke;
        ctx.lineWidth = prevLine;
    };

    this.contacted = function(x, y) {
        this.startX = x;
        this.startY = y;
    };

    this.dragging = function(x, y) {
        var draggedX = x - this.startX;
        var draggedY = y - this.startY;

        for(var i = 0; i < this.points.length; i++) {
            this.points[i][0] += draggedX;
            this.points[i][1] += draggedY;
        }

        this.startX = x;
        this.startY = y;
    };

    this.doubleTapEvent = function() {
        var colourPalete = Ext.create('Ham.view.ColourPalette');
        colourPalete.show();
        colourPalete.freeHandAnno = this;
    }

    this.changeLineStroke = function(color) {
        var stickyNote = this.stickyNote,
            drawnAtDpi = stickyNote.drawnAtDpi,
            parts = drawnAtDpi.split(':');

        this.lineStroke = '#' + color;
        stickyNote.drawnAtDpi = parts[0] + ":" + parts[1] + ':' + this.lineStroke;
        canvasHam.canvasProp.canMan.draw();

        if(this.stickyNote.createdBy == Constants.userInfo.userId) {
            Ham.application.getController('HamController').
                updateAnnotationPositionRemote(stickyNote);
        }
    }

    this.dropEvent = function() {

        //Logic here is it is same as drawing ie we are going to do same
        //calculation as creating
        var points = this.points,
            showing72Dpi = canvasHam.seven2DpiInfo.showing,
            ratio = Constants.hundredPercentDpi / info.currentDpi,
            freehandPoints = '',
            arrayX = [],
            arrayY = [],
            stickyNote = this.stickyNote;

        //Find minimum and then subtract
        for(var i = 0, length = points.length; i < length; i++) {
            var firstPoint = points[i][0],
                secondPoint = points[i][1];
            arrayX.push(firstPoint);
            arrayY.push(secondPoint);
        }

        var minX = Ext.Array.min(arrayX),
            minY = Ext.Array.min(arrayY);

        //Reverse rotate as we need to save at 0 degree and then convert to 72 dpi
        var minXY = UTILITY.getRotatedPoint(-hamImageContainer.rotateAngle, canvas, minX, minY);

        //Generate freehandpoints
        for(i = 0, length = points.length; i < length; i++) {
            firstPoint = (points[i][0]) - minX;
            secondPoint = (points[i][1]) - minY;
            freehandPoints += firstPoint.toFixed(0) + ',' +  secondPoint.toFixed(0) + ':';
        }

        stickyNote.pinHeadX = showing72Dpi.x + (minXY[0] - hamImageContainer.x) * ratio;
        stickyNote.pinHeadY = showing72Dpi.y + (minXY[1] - hamImageContainer.y) * ratio;
        freehandPoints = freehandPoints.slice(0, freehandPoints.length - 1);
        stickyNote.freehandPoints = freehandPoints;
        stickyNote.drawnAtDpi = Number(info.currentDpi).toFixed(4) + ':' + hamImageContainer.rotateAngle;

        if(stickyNote.stickyId) {
            Ham.application.getController('HamController').
                    updateAnnotationPositionRemote(stickyNote);
        }
    };

    this.hitTest = function(x, y, ctx) {
        for(var i = 0; i < this.points.length; i++) {
            var cx = this.points[i][0],
                cy = this.points[i][1];
            if(x >= cx - hitArea && x <= cx + hitArea && y >= cy - hitArea && y <= cy + hitArea ) {
                return true;
            }
        }
        return false;
    };
}
