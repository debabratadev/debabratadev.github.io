/**
 * Holds the overall information about the chart.
 * TODO -- calculation based on bold and italic input
 */
function Text() {

    this.ctx;
    this.caption = "Text";
    this.fontSize = 14;
    this.textColor = "#000000";
    this.fontType = "Arial";
    this.parentDistanceX = 0;
    this.parentDistanceY = 0;

    this.textRotation = 0;
    this.lineWidth;
    this.coordinate;
    this.textCordinate = [];

    //style
    this.bold = false;
    this.italic = false;

    this.normal;

    //rectangle
    this.rectangle = true;
    this.width;
    this.height;
    this.rectStroke = '#6BBEEE';
    this.rectCordinates;
    this.tempRectCordinate;
    this.centroid;
    this.firstPoint;
    this.secondPoint;

    //rotation handle
    this.rotateFirstPoint;
    this.rotatePoint;
    this.rotate = false;
    this.startRadian;
    this.rPoint1;
    this.rPoint2;

    this.rotationAngle;
    this.textAngle = 0;

    //dragging
    this.startX;
    this.startY;
    this.drag = false;

    this.canvas;
    this.creation = true;

    this.dragObject;

    this.zIndex = 3;

    this.currentFactor;

    this.parentSection = null;

    this.availableParent = false; //TODO - remove it

    /**
     * This function will be called 
     * contineously --TODO remove rectangle measurement and update text call
     */
    this.draw = function (ctx, factor, lineWidth, canvas) {
        this.updateVaraible(ctx, factor, lineWidth, canvas);
        this.rectangleMeasurement();
        if (!this.rotate && !this.availableParent) {
            this.updateTextCordinate();
        }
        this.drawText();
        this.handleRectangle();
    }

    /**
     * draw the text here
     */
    this.drawText = function () {

        this.ctx.save();

        // let centroid = this.tempRelation ? this.coordinate:this.centroid;
        let centroid = this.centroid;

        this.ctx.translate(centroid.x, centroid.y);
        this.ctx.rotate(-this.textAngle);
        this.ctx.translate(-centroid.x, -centroid.y);

        // if(this.availableParent){
        //     this.ctx.translate(centroid.x, centroid.y);
        //     this.ctx.rotate(-this.textAngle);
        //     this.ctx.translate(-centroid.x, -centroid.y);
        // } else {
        //     this.ctx.translate(centroid.x+this.parentDistanceX, centroid.y+this.parentDistanceY);
        //     this.ctx.rotate(-this.textAngle);
        //     this.ctx.translate(-centroid.x-this.parentDistanceX, -centroid.y-this.parentDistanceY);
        // }
        this.ctx.fillStyle = this.textColor;
        this.ctx.textAlign = "left";

        this.handleFont();

        this.ctx.textBaseline = "top";
        this.ctx.fillText(this.caption, this.coordinate.x, this.coordinate.y);
        this.ctx.stroke();
        this.ctx.restore();

    }

    /**
     * Handle the text font here
     */
    this.handleFont = function () {

        if (this.italic && this.bold) {
            this.ctx.font = "italic bold " + this.fontSize + "pt " + this.fontType;
        } else if (this.italic) {
            this.ctx.font = "italic " + this.fontSize + "pt " + this.fontType;
        } else if (this.bold) {
            this.ctx.font = "bold " + this.fontSize + "pt " + this.fontType;
        } else {
            this.ctx.font = this.fontSize + "pt " + this.fontType;
        }
    }

    /**
     * Draw the selection here
     */
    this.drawSelection = function () {
        this.drawEnclosingRectangle();
        sharedComponent.handleRotation(this);
    }

    /**
     * Draw the enclosing rectangle
     */
    this.drawEnclosingRectangle = function () {
        canvasModule.drawEnclosingRectangle(this.ctx, this.rectCordinates,
            this.rotate, this.rotationAngle, this.centroid,
            this.lineWidth, '#6BBEEE');
    }

    /**
     * Update the rectangle measurement here
     */
    this.rectangleMeasurement = function () {
        let width = 0;

        for (let index = 0; index < this.caption.length; ++index) {
            width += (this.ctx.measureText(this.caption[index]).width * this.fontSize);
        }

        this.width = width / 7.75;  //will calculate the width of the rectangle here
        this.height = (1.1 * this.fontSize);
    }

    /**
     * Update the variable 
     */
    this.updateVaraible = function (ctx, factor, lineWidth, canvas) {
        this.ctx = ctx;
        this.factor = factor;
        this.lineWidth = lineWidth / 2;
        this.canvas = canvas;
    }

    /**
     * Handle the rectangle formed after selection
     */
    this.handleRectangle = function () {
        if (this.rectangle) {
            this.drawSelection();

            if (this.drag) {
                sharedComponent.drawLineForSelection(this);
            }

            if (this.rotate) {
                sharedComponent.drawLineForRotation(this);
            }
        }
    }

    /**
     * Set the caption.
     */
    this.setCaption = function (name) {
        this.caption = name;
    }

    /**
     * Set the font size.
     */
    this.setFontSize = function (size) {
        this.fontSize = size / this.currentFactor;
    }

    /**
     * Get the font size of an element
     */
    this.getFontSize = function () {

        return parseInt(this.fontSize * this.currentFactor);
    }

    /**
     * Set the font color 
     */
    this.setTextColor = function () {

    }

    /**
     * Set the bold type
     */
    this.setBold = function () {
        this.bold = !this.bold;
    }

    /**
     * set the itaic type
     */
    this.setItalic = function () {
        this.italic = !this.italic;
    }

    /**
     * Set the normal type
     */
    this.setNormal = function () {

    }

    /**
     * set the coordinate here
     */
    this.setCoordinate = function (point) {
        this.coordinate = {
            x: point.x,
            y: point.y
        }
    }

    /**
     * Update the text cordinate here
     */
    this.updateTextCordinate = function () {

        this.textCordinate = [];
        this.textCordinate[0] = this.coordinate;
        this.textCordinate[1] = {
            x: this.coordinate.x + this.width,
            y: this.coordinate.y
        }
        this.textCordinate[2] = {
            x: this.coordinate.x + this.width,
            y: this.coordinate.y + this.height
        }
        this.textCordinate[3] = {
            x: this.coordinate.x,
            y: this.coordinate.y + this.height
        }

        this.centroid = polyModule.centroidOfAPolygon(this.textCordinate);

        if(this.tempCounter==1){
            this.parentDistanceX = this.forcedCentroid.x - this.centroid.x;
            this.parentDistanceY = this.forcedCentroid.y - this.centroid.y;
            this.tempCounter++;
        }

        // let centroid = {x:this.centroid.x + this.parentDistanceX , y:this.centroid.y+ this.parentDistanceY};
        this.centroid = {x:this.centroid.x + this.parentDistanceX,y:this.centroid.y + this.parentDistanceY}
        this.textCordinate = pointModule.rotateArrayPoint(this.textCordinate, this.centroid, this.textAngle);
        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.textCordinate);
    }

    /**
     * Check whether the point lies inside the polygon 
     * 
     */
    this.pointLiesInsideThePolygon = function (point) {

        let coord = polyModule.findAllCoordinatesOfARectangle(this.rectCordinates);
        return polyModule.isInsidePolygon(coord, coord.length, point);
    }


    //handles dragging of the application

    /**
     * Drag the text 
     */
    this.startDrag = function (mouse) {

        this.dragObject = new Drag(this);
        this.dragObject.startDrag(mouse);
    }

    /**
     * Handle dragging of an application
     */
    this.dragging = function (mouse) {

        this.updateCordinatesWhileDragging(mouse);
        this.dragObject.dragging(mouse);
    }

    /**
     * End drag here
     */
    this.endDrag = function (mouse, childElement) {
        this.dragObject.endDrag(mouse, childElement);
    }

    /**
     * Update the cooediantes while dragging
     */
    this.updateCordinatesWhileDragging = function (mouse) {
        this.coordinate.x += mouse.x - this.startX;
        this.coordinate.y += mouse.y - this.startY;
    }

    /**
     * Check whether the rotation handler has been hit or not
     */
    this.hitTest = function (ctx, x, y) {

        return canvasModule.pointHitTest(ctx, { x: x, y: y }, this.rotatePoint, this.lineWidth * 5);
    }

    //rotation

    /**
     * Starts the drag for the rotation here
     */
    this.rotateStartDrag = function (mouse, parent) {
        this.initialAngle = this.textAngle;
        this.tempLabel = { x: this.coordinate.x, y: this.coordinate.y };

        if (!parent) {
            this.rotateObject = new Rotate(this);
            this.rotateObject.startRotate(mouse);
            this.parentDistanceX = 0;
            this.parentDistanceY = 0;
        } else {
            this.availableParent = true;
            this.rotateText(mouse,parent);
        }
    }

    /**
     * Handles the dragging for rotation
     */
    this.rotateDragging = function (mouse, parent) {
        this.rotateText(mouse, parent);
    }

    /**
     * It ends the dragging for the rotation.
     */
    this.rotateEndDrag = function (mouse, parent) {

        if (!parent) {
            this.rotateObject.endRotate(mouse);
            mainModule.updateChart();
        }
        else {
            this.availableParent = false;
            this.tempCounter = 1;
            this.forcedCentroid = this.centroid;
        }
        this.rotate = false;
    }

    /**
     * Rotate text 
     */
    this.rotateText = function (mouse, parent) {
        let centroid, rotationAngle;
        if (!parent) {
            this.rotateObject.rotating(mouse);
            rotationAngle = this.rotationAngle;
            centroid = this.centroid;
            this.textAngle = this.rotationAngle + this.initialAngle;

        } else {
            rotationAngle = parent.rotationAngle;
            centroid = parent.centroid;
            this.coordinate = pointModule.rotateAroundAnotherPoint(centroid, rotationAngle, this.tempLabel);
            this.centroid ={x:this.coordinate.x,y:this.coordinate.y};
            this.textAngle = rotationAngle + this.initialAngle;
        }
    }
}