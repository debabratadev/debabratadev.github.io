/*
 * Its a fixed circle annotation
 */

function AnnotationCircle(currentCanvas, info, components) {
    'use strict';

    var radius = 7,
        hitRadius = Ext.supports.touchEvents ? 20 : 6,
        hamImageContainer = components.hamImageContainer,
        canvas = currentCanvas.canvasProp.canvas;

    //this.draggable = true;
    //this.finger = true;
    this.cursor = 'pointer';
    this.panelWidth = undefined; //Half of annotation window width
    this.deflectionX = -200;
    this.deflectionY = 50;
    this.halfPanelX = undefined;
    this.draw = function(ctx) {
        var prevStroke = ctx.strokeStyle,
            prevLine = ctx.lineWidth,
            prevFill = ctx.fillStyle;

        ctx.strokeStyle = '#525252';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#FFFFFF';

        //Line
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.halfPanelX, this.panelY);
        ctx.stroke();

        //Circle
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = prevFill;
        ctx.strokeStyle = prevStroke;
        ctx.lineWidth = prevLine;
    };

    this.dragging = function() {
        var ratio = Constants.hundredPercentDpi / info.currentDpi,
            showing72Dpi = currentCanvas.seven2DpiInfo.showing;

        var pinHeadX = this.x,
            pinHeadY = this.y,
            stickyX = this.panelX,
            stickyY = this.panelY;

        var pinHeadXY = UTILITY.getRotatedPoint(-hamImageContainer.rotateAngle, canvas,
                        pinHeadX, pinHeadY);
        pinHeadX = pinHeadXY[0];
        pinHeadY = pinHeadXY[1];

        var stickyXY = UTILITY.getRotatedPoint(-hamImageContainer.rotateAngle, canvas,
                        stickyX, stickyY);
        stickyX = stickyXY[0];
        stickyY = stickyXY[1];

        this.stickyNote.pinHeadX = (pinHeadX - hamImageContainer.x) * ratio + showing72Dpi.x;
        this.stickyNote.pinHeadY = (pinHeadY - hamImageContainer.y) * ratio + showing72Dpi.y;
        this.stickyNote.stickyX = (stickyX - hamImageContainer.x) * ratio + showing72Dpi.x;
        this.stickyNote.stickyY = (stickyY - hamImageContainer.y) * ratio + showing72Dpi.y;
    };

    this.dropEvent = function() {
        if(this.stickyNote.stickyId) {
            Ham.application.getController('HamController').
                    updateAnnotationPositionRemote(this.stickyNote);
        }
    }

    this.hitTest = function(x, y, ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, hitRadius, 0, 2 * Math.PI);
        return ctx.isPointInPath(x, y);
    };
}