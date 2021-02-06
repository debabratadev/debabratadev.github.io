/**
 * Handle the polygon component
 */
function Polygon() {

    this.coordinates = [];

    //Get from the main
    this.ctx;
    this.lineWidth;
    this.canvas;
    this.factor;

    this.stroke = true;
    this.strokeWidth;

    this.fillColor = '#F5F5F5';
    this.strokeColor = '#000000';

    this.type;

    //label
    this.type = "Entrance";

    this.name = "Entrance";
    this.textAlign = "center";
    this.fontType = "Arial"

    this.labelSize = 10;
    this.labelX = 4;            //text position on x-axis
    this.labelY = 3;            //text position on y-axis
    this.labelPercent;
    this.labelRotation = 0;
    this.labelColor = "#000000";
    this.percentage = { x: 0, y: 0 };
    this.creation = true;

    this.startPoint = null;
    this.endPoint = null;
    this.currentPoint = null;
    this.checkPoint = null;

    this.approx = 15; //TODO problem on handling approximation

    //rotation
    this.rotate = false;
    this.rotationAngle = 0;
    this.centroid;

    this.startRadian;
    this.prevCursor;
    this.rPoint1;
    this.rPoint2;

    this.rotateFirstPoint;
    this.rotatePoint;
    this.rotate = false;
    this.rotationAngle = 0;

    this.dragObject;
    this.rotateObject;
    this.rotatePolygon;

    this.zIndex = 2;

    this.enableNode = false;
    this.showTentativeNode = false;
    this.tentativeNode;
    this.tentativeMousePoint;

    //To find the index for adding nodes
    this.prevNodeIndex = 0;
    this.hitIndex = -1;
    this.currIndex = -1;

    this.nodeDrag = false;
    this.dragNodeIndex = -1;

    this.parentSection = null;

    this.area = 0;

    /**
     * Main draw function 
     */
    this.draw = function (ctx, factor, lineWidth, canvas) {

        this.updateVariable(ctx, factor, lineWidth, canvas);

        if (this.startPoint) {
            this.drawObject();

            this.handleState();

            this.handleRectangle();

            if (this.showTentativeNode) {
                this.nodeObject.drawTentativeNode();
            }
        }
    }

    /**
     * Update the variable 
     */
    this.updateVariable = function (ctx, factor, lineWidth, canvas) {
        this.ctx = ctx;
        this.lineWidth = lineWidth / 2;
        this.canvas = canvas;
        this.factor = factor;
    }

    /**
     * Handle state before creation 
     * After creation
     */
    this.handleState = function () {
        if (this.creation && this.mouse) {
            this.drawTentativeLine();
        } else {
            canvasModule.paintPolygon(this.ctx, this.coordinates, this.fillColor, 1);
            if (this.enableNode) {
                this.nodeObject.drawNodePoint();
            }
            canvasModule.drawTextWithRotation(this);
        }
    }

    /**
     * Enclose the rectangle and create the rotation handler
     */
    this.handleRectangle = function () {

        if (this.rectangle) {
            this.drawEnclosingRectangle();
            sharedComponent.handleRotation(this);

            if (this.drag) {
                sharedComponent.drawLineForSelection(this);
            }

            if (this.rotate) {
                sharedComponent.drawLineForRotation(this);
            }
        }
    }

    /**
     * Draw Object 
     */
    this.drawObject = function () {
        this.drawStraightLine();
    }


    /**
     * Draw polygon straight line here
     */
    this.drawStraightLine = function () {
        let length = this.coordinates.length;
        if (length < 2) {
            return;
        }
        let prev = this.coordinates[0];
        for (let index = 1; index < length; ++index) {
            let current = this.coordinates[index];
            canvasModule.drawStraightLine(this.ctx, '#000000', prev, current, this.lineWidth * 1.5, [], this.stroke);
            prev = current;
        }
    }

    /**
     * draw the enclosing rectangle here
     */
    this.drawEnclosingRectangle = function () {

        if (!this.rotate) {
            this.updateRectCordinate();
        }

        canvasModule.drawEnclosingRectangle(this.ctx, this.rectCordinates,
            this.rotate, this.rotationAngle, this.centroid,
            this.lineWidth, '#6BBEEE');
    }

    /**
     * Draw the tentative line 
     */
    this.drawTentativeLine = function () {
        canvasModule.drawStraightLine(this.ctx, '#FF0000', this.currentPoint, this.mouse, this.lineWidth, [])
    }

    /**
     * Create the polygon 
     */
    this.createPolygon = function (mouse, ctx) {

        this.checkPoint = mouse;

        if (!this.creation || this.checkExtremaPoints(mouse, ctx)) {
            return;
        }

        let pt = this.ctx.transformedPoint(mouse.x, mouse.y);
        this.currentPoint = pt;

        this.coordinates.push({ x: pt.x, y: pt.y });
    }

    /**
     * Handle the movement of the mouse
     * Drawinf of the tentative straight linw
     * 
     */
    this.moveMouse = function (mouse) {
        this.mouse = mouse;
    }

    /**
     * Is the end point found
     */
    this.isEndPoint = function (mouse) {

        return ((this.checkPoint.x >= (this.startPoint.x - this.approx)) && (this.checkPoint.x <= (this.startPoint.x + this.approx))) &&
            (this.checkPoint.y >= (this.startPoint.y - this.approx) && this.checkPoint.y <= (this.startPoint.y + this.approx));
    }

    /**
     * Check the points and
     * assign them to the variable accordoing to that here
     */
    this.checkExtremaPoints = function (mouse, ctx) {
        if (!this.startPoint) {
            this.startPoint = { x: mouse.x, y: mouse.y };
            this.ctx = ctx;
        }
        else if (this.isEndPoint(mouse)) {
            this.creation = false;
            let pt = this.ctx.transformedPoint(this.startPoint.x, this.startPoint.y);
            this.coordinates.push({ x: pt.x, y: pt.y });

            this.handleCordinatesForLabel(0, 0);

            if(!this.componentArea()){
                mainModule.removeLastComponent('polygon');
            }

            mainModule.updateChart();

            return true;
        }

        return false;
    }

    /**
     *  return whether the point is inside or not.
     *  calls to the polyModule.
     */
    this.pointLiesInsideThePolygon = function (point) {
        return polyModule.isInsidePolygon(this.coordinates, this.coordinates.length, point);
    }

    /**
     * update the variable for the rectangle here
     */
    this.updateRectCordinate = function () {
        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.coordinates);
        let cord = polyModule.findAllCoordinatesOfARectangle(this.rectCordinates);
        this.centroid = polyModule.centroidOfAPolygon(cord);
    }

    /**
     * fill color
     */
    this.setColor = function (color) {
        this.fillColor = color;
    }

    /**
     * Set stroke for the rectangle
     */
    this.setStroke = function (value) {
        this.stroke = value;
    }

    /**
     * Set the caption for the canvas 
     */
    this.setCaption = function (caption) {
        this.name = caption;

        this.updateCoordinatesForLabel(this.percentage.x, this.percentage.y);
    }

     /**
     * Set the rotation for the text here
     */
    this.setRotation = function (value) {
        this.labelRotation = circleModule.convertDegreeToRadian(value);
    }

    /**
     * Get the rotation for the text from here
     */
    this.getRotation = function () {
        return parseInt((this.labelRotation) * (180 / Math.PI));
    }

    /**
     * Move the component to back
     */
    this.moveToBack = function () {
        this.zIndex = 0;
        this.backOrder = true;
    }

    /**
     * Move the component to forth
     */
    this.moveToForth = function () {
        this.zIndex = 5;
        this.backOrder = false;
    }

    /**
     * update the label coordiantes.
     */
    this.updateCoordinatesForLabel = function () {
        sharedComponent.updateCoordinatesForLabel(this);
    }

    /**
     * It update the x cordinate of label
     */
    this.updateXCordinateForLabel = function (percentage) {
        this.labelX = this.widthInc * percentage + this.centroid.x;
        this.percentage.x = percentage;
    }

    /**
     * It update the y cordiante of label
     */
    this.updateYCordinateForLabel = function (percentage) {
        this.labelY = this.heightInc * percentage + this.centroid.y;
        this.percentage.y = percentage;
    }

    /**
     * Update the font size
     */
    this.updateFontSize = function (font) {
        this.labelSize = font / this.currentFactor;
    }

    /**
     * Returnt the font size of the element
     */
    this.getFontSize = function () {

        return parseInt(this.labelSize * this.currentFactor);
    }

    /**
     * Gets the cordiante of label in percentage.
     */
    this.getCordinateForLabelInPercentage = function () {
        return {
            x: parseInt((this.labelX - this.centroid.x) / this.widthInc),
            y: parseInt((this.labelY - this.centroid.y) / this.heightInc)
        }
    }

    /**
     * It handles the coordinates for the label
     */
    this.handleCordinatesForLabel = function (xpercent, ypercent) {
        this.updateCoordinatesForLabel();
        this.updateXCordinateForLabel(xpercent);
        this.updateYCordinateForLabel(ypercent);
    }

    //area of the component

    /**
     * Get the component area for the section
     * 
     */
    this.componentArea = function(){
        return polyModule.findPolygonArea(this.coordinates);
    }

    //handle dragging 

    this.startDrag = function (mouse) {

        this.dragObject = new Drag(this);
        this.dragObject.startDrag(mouse);
    }

    /**
     * Handle dragging of an application
     */
    this.dragging = function (mouse) {

        this.updateCordinatesWhileDragging(mouse);
        this.handleCordinatesForLabel(this.percentage.x, this.percentage.y);
        this.dragObject.dragging(mouse);
    }

    /**
     * End drag here
     */
    this.endDrag = function (mouse,childElement) {
        this.dragObject.endDrag(mouse,childElement);
    }

    /**
     * Update the coordinates while dragging
     * 
     */
    this.updateCordinatesWhileDragging = function (mouse) {
        for (let index = 0; index < this.coordinates.length; ++index) {
            let point = this.coordinates[index];
            this.coordinates[index] = {
                x: point.x + mouse.x - this.startX,
                y: point.y + mouse.y - this.startY
            }
        }
    }

    //handle the rotation  here

    /**
     * Check whether the rotation handler has been hit or not
     */
    this.hitTest = function (ctx, x, y) {

        return canvasModule.pointHitTest(ctx, { x: x, y: y }, this.rotatePoint, this.lineWidth * 10);
    }

    /**
     * Starts the drag for the rotation here
     */
    this.rotateStartDrag = function (mouse,parent) {

        if(!parent){
            this.rotateObject = new Rotate(this);
            this.rotateObject.startRotate(mouse);
        }
        this.rotatePolygon = new RotatePolygon(this);
        this.rotatePolygon.storePolygonPoint();

        // this.rotateObject.startRotate(mouse);
        this.initialAngle = this.labelRotation;
        this.tempLabel = { x: this.labelX, y: this.labelY };
    }

    /**
     * Handles the dragging for rotation
     */
    this.rotateDragging = function (mouse,parent) {
        this.rotatePolygonShape(mouse,parent);
    }

    /**
     * It ends the dragging for the rotation.
     */
    this.rotateEndDrag = function (mouse,parent) {
        if(!parent){
            this.rotateObject.endRotate(mouse);
            mainModule.updateChart();
        }
        this.percentage = this.getCordinateForLabelInPercentage();
    }

    /**
     * Rotate the polygon shape here
     */
    this.rotatePolygonShape = function (mouse,parent) {
        this.rotatePolygon.rotatePolygonPoint(parent);

        let centroid,rotationAngle;
        if(!parent){
            this.rotateObject.rotating(mouse);
            rotationAngle = this.rotationAngle;
            centroid = this.centroid;
        } else{
            rotationAngle = parent.rotationAngle;
            centroid = parent.centroid;
        }

        this.labelRotation = this.initialAngle - rotationAngle;

        let point = pointModule.rotateAroundAnotherPoint(centroid,rotationAngle, this.tempLabel);

        this.labelX = point.x;
        this.labelY = point.y;
    }

    /**
     * Set the enable node here
     */
    this.setEnableNode = function(){
        this.enableNode = true;
        this.nodeObject = new Node(this);
    }
}