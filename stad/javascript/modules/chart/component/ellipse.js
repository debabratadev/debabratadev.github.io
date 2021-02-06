/**
 * Handle the ellipse component 
 */
function Ellipse() {

    this.origin;   //It contains the ellipse origin here

    this.coordinates = [];

    //Get from the main
    this.ctx;
    this.lineWidth;
    this.canvas;
    this.factor;

    //property
    this.width = 0;
    this.height = 0;
    this.radiusX = 0;
    this.radiusY = 0;

    this.stroke = true;

    this.rotation = 0;
    this.cornerRadius = 0;
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

    this.startPoint;
    this.endPoint;

    this.rectCordinates;

    //drag
    this.startX;
    this.startY;
    this.drag;
    this.rectangle;

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

    this.zIndex = 2;

    this.backOrder = false;
    this.shapeAngle = 0;
    this.enableNode = false;

    this.nodeCordinates = [];
    this.prevIndex = -1;
    this.indexCounter = 0;
    this.selectedIndex = [];

    this.currIndex = -1;
    this.dragNodeIndex = -1;
    this.nodeDrag = false;

    this.currentFactor;

    this.parentRotationCounter = false;
    this.parentDistanceX = 0;
    this.parentDistanceY = 0;
    this.availableParent = false;
    this.area  = 0;

    /**
     * Main draw function 
     */
    this.draw = function (ctx, factor, lineWidth, canvas) {

        this.updateVariable(ctx, factor, lineWidth, canvas);
        if (this.startPoint) {
            this.drawObject();
            if (!this.creation) {
                canvasModule.drawTextWithRotation(this);
                if (this.enableNode) {
                    this.storeNodePoints();
                    this.drawNodePoint();
                }
                this.drawTentativeNode();

            }
            this.handleRectangle();
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
     * Draw the enclosing rectangle here.
     * TODO - The entire structure can be changed here
     */
    this.drawEnclosingRectangle = function () {
        canvasModule.drawEnclosingRectangle(this.ctx, this.rectCordinates,
            this.rotate, this.rotationAngle, this.centroid,
            this.lineWidth, '#6BBEEE');
    }

    this.drawNodePoint = function () {
        for (let index = 0; index < this.nodeCordinates.length; ++index) {

            let color;
            if (this.currIndex == index) {
                color = "#FF0000";
            }
            canvasModule.drawPointForRotation(this.ctx, this.nodeCordinates[index], this.lineWidth,color);
        }
    }

    /**
     * Handle the rectangle of an object
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

        if (!this.rotate || !this.availableParent) {
            this.updateCoordinates();
        }

        this.ctx.fillStyle = this.fillColor;
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = this.lineWidth;
        
        this.ctx.save();
        this.ctx.beginPath();

        this.ctx.translate(this.centroid.x, this.centroid.y);
        this.ctx.rotate(this.shapeAngle);
        this.ctx.translate(-this.centroid.x, -this.centroid.y);

        this.ctx.ellipse(this.origin.x, this.origin.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);

        if (this.stroke || this.creation) {
            this.ctx.stroke();
        }

        if (!this.creation) {
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    /**
     * Start the selection drag
     */
    this.startCreation = function (mouse) {
        if (!this.creation) {
            return;
        }

        let pt = {
            x: mouse.x,
            y: mouse.y
        }

        this.startPoint = this.endPoint = this.origin = pt;
    }

    /**
     * In a process of creation
     */
    this.creating = function (mouse) {
        if (!this.creation) {
            return;
        }
        this.updateEndPoint(mouse);
    }

    /**
     * Stop the creation.
     */
    this.stopCreation = function (mouse) {
        this.creation = false;

        if(!this.componentArea()){
            mainModule.removeLastComponent('ellipse');
        }

        this.handleCordinatesForLabel(0, 0);
    }

    /**
     * Update the end point for the mouse
     */
    this.updateEndPoint = function (mouse) {
        this.endPoint = mouse;
        this.width = this.endPoint.x - this.startPoint.x;
        this.height = this.endPoint.y - this.startPoint.y;
        this.radiusX = Math.abs(this.width / 2);
        this.radiusY = Math.abs(this.height / 2);

        //let origin distance 
        let odistance = Math.sqrt(Math.pow(this.radiusX, 2) + Math.pow(this.radiusY, 2));
        this.origin = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, odistance);
    }

    /**
     *  return whether the point is inside or not.
     *  calls to the polyModule.
     */
    this.pointLiesInsideTheEllipse = function (point) {
        return ellipseModule.isInsideEllipse(this.origin, point, this.radiusX, this.radiusY);
    }

    /**
    * Update the coordinates here
    */
    this.updateCoordinates = function () {

        this.coordinates[0] = {
            x: this.origin.x,
            y: this.origin.y - this.radiusY * 1.2
        }

        this.coordinates[1] = {
            x: this.origin.x + this.radiusX * 1.2,
            y: this.origin.y
        }

        this.coordinates[2] = {
            x: this.origin.x,
            y: this.origin.y + this.radiusY * 1.2
        }

        this.coordinates[3] = {
            x: this.origin.x - this.radiusX * 1.2,
            y: this.origin.y
        }
        this.centroid = polyModule.centroidOfAPolygon(this.coordinates);

        if(this.parentRotationCounter){
            this.parentDistanceX = this.parentReferCentroid.x - this.centroid.x;
            this.parentDistanceY = this.parentReferCentroid.y - this.centroid.y;

            this.parentRotationCounter = false;
        }
        this.centroid = {x:this.centroid.x + this.parentDistanceX,y:this.centroid.y + this.parentDistanceY}

        // this.coordinates = pointModule.rotateArrayPoint(this.coordinates, this.centroid, -this.shapeAngle);
        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.coordinates);
    }

    /**
     * Set the stroke for the ellipse 
     */
    this.setStroke = function (stroke) {
        this.stroke = stroke;
    }

    /**
     * fill color
     */
    this.setColor = function (color) {
        this.fillColor = color;
    }

    /**
     * Set the type for the rectangle
     */
    this.setType = function (type) {
        this.type = type;
    }

    /**
     * Set the caption for the canvas 
     */
    this.setCaption = function (caption) {
        this.name = caption;
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
     * Set width 
     */
    this.setWidth = function (width) {

        this.width = width/this.currentFactor;
        this.radiusX = this.width / 2;

        this.handleCordinatesForLabel(this.percentage.x, this.percentage.y);
    }

    /**
     * Get Width
     */
    this.getWidth = function () {

        return parseInt(this.width * this.currentFactor);
    }

    /**
     * Set Height
     */
    this.setHeight = function (height) {
        this.height = height/this.currentFactor;
        this.radiusY = this.height / 2;
        this.handleCordinatesForLabel(this.percentage.x, this.percentage.y);
    }

    /**
     * Get Height
     */
    this.getHeight = function () {

        return parseInt(this.height * this.currentFactor);
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

    // Text label - need to be handle here

    /**
     * update the label coordiantes.
     */
    this.updateCoordinatesForLabel = function () {

        let rectanglePoints = polyModule.findEnclosingRectangleCoordinate(this.coordinates);

        this.centroid = polyModule.centroidOfAPolygon(this.coordinates);

        let width = rectanglePoints.highestX - rectanglePoints.lowestX;
        let height = rectanglePoints.highestY - rectanglePoints.lowestY;

        this.widthInc = width / 100;
        this.heightInc = height / 100;
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
     * Update the coordinates while dragging here
     */
    this.updateCordinatesWhileDragging = function (mouse) {
        this.origin.x += mouse.x - this.startX;
        this.origin.y += mouse.y - this.startY;
    }

    //rotation

    /**
     * Check whether the rotation handler has been hit or not
     */
    this.hitTest = function (ctx, x, y) {

        return canvasModule.pointHitTest(ctx, { x: x, y: y }, this.rotatePoint, this.lineWidth * 5);
    }

    /**
     * Get the component area for the section
     * 
     */
    this.componentArea = function(){
        return Math.PI * this.width * this.height;
    }


    /**
     * Starts the drag for the rotation here
     */
    this.rotateStartDrag = function (mouse,parent) {

        this.tempAngle = this.labelRotation;  //Will look for the shape andgle,text angle
        this.tempLabel = { x: this.labelX, y: this.labelY };
        this.tempStartPoint = this.origin;

        if(!parent){
            this.rotateObject = new Rotate(this);
            this.rotateObject.startRotate(mouse);
            this.parentDistanceX = 0;
            this.parentDistanceY = 0;
        } else{
            this.availableParent = true;
        }
    }

    /**
     * Handles the dragging for rotation
     */
    this.rotateDragging = function (mouse,parent) {
        this.rotateEllipseShape(mouse,parent);
        this.canvas.style.cursor = "grabbing";
    }

    /**
     * It ends the dragging for the rotation.
     */
    this.rotateEndDrag = function (mouse,parent) {
        if(!parent){
            this.rotateObject.endRotate(mouse);
            mainModule.updateChart();
    } else{
            this.availableParent = false;
            this.parentRotationCounter = true;
            this.parentReferCentroid = this.centroid;
        }

        this.rotate = false;    }

    /**
     * Rotate the ellipse shape
     */
    this.rotateEllipseShape = function (mouse,parent) {
        let centroid,rotationAngle;
        if(!parent){
            this.rotateObject.rotating(mouse);
            centroid = this.centroid;
            rotationAngle = this.rotationAngle;
        }
        else{
            centroid = parent.centroid; //need to understand things
            rotationAngle = parent.rotationAngle;
            this.origin = pointModule.rotateAroundAnotherPoint(centroid,rotationAngle,this.tempStartPoint);
            this.centroid = {x:this.origin.x,y:this.origin.y};
        }

        this.labelRotation = (this.tempAngle - rotationAngle);
        this.shapeAngle = this.labelRotation;
        let point = pointModule.rotateAroundAnotherPoint(centroid, rotationAngle, this.tempLabel);
        this.labelX = point.x;
        this.labelY = point.y;
    }

    /**
     * Set the enable ndoe 
     * update the coordinates point
     */
    this.setEnableNode = function () {
        this.storeNodePoints();
        this.enableNode = true;
    }

    /**
     * It stores the node points 
     */
    this.storeNodePoints = function () {
        this.nodeCordinates = [];
        this.nodeCordinates.push({ x: this.origin.x, y: this.origin.y - this.radiusY });
        this.nodeCordinates.push({ x: this.origin.x + this.radiusX, y: this.origin.y });
        this.nodeCordinates.push({ x: this.origin.x, y: this.origin.y + this.radiusY });
        this.nodeCordinates.push({ x: this.origin.x - this.radiusX, y: this.origin.y });

        this.nodeCordinates = pointModule.rotateArrayPoint(this.nodeCordinates, this.centroid, -this.shapeAngle);
    }

    /**
     * Handles node hit test
     */
    this.nodeHitTest = function (point) {
        let length = this.nodeCordinates.length;
        for (let index = 0; index < length; ++index) {
            let center = this.nodeCordinates[index];
            if (canvasModule.pointHitTest(this.ctx, point, center, this.lineWidth * 20)) {
                return index;
            }
        }
        return -1;
    }

    /**
     * Handles the call to the selected node point
     */
    this.selectNodePoint = function (point) {
        this.currIndex = this.nodeHitTest(point);
        if (this.currIndex != -1) {
            console.log("curent index", this.currIndex);
        }
    }

    /**
     * Start the node drag 
     */
    this.startNodeDrag = function (point) {
        this.dragNodeIndex = this.nodeHitTest(point);
        this.nodeDrag = (this.dragNodeIndex != -1) ? true : false;
        let pt = this.ctx.transformedPoint(point.x, point.y);
        this.startX = pt.x;
        this.startY = pt.y;

        if (this.dragNodeIndex != -1) {
            this.tentativeNode = this.nodeCordinates[this.dragNodeIndex];
            this.prevRotation = this.rotationAngle;
            this.setExtremaForNode();
        }
    }

    /**
     * handles node dragging.
     */
    this.nodeDragging = function (point) {

        if (this.nodeDrag == false) {
            return;
        }

        this.setExtremaForNode();

        this.tentativeNode = {
            x: this.tentativeNode.x + point.x - this.startX,
            y: this.tentativeNode.y + point.y - this.startY
        }

        let prev = this.leftExtrema;
        let next = this.rightExtrema;
        let mousePoint = point;

        let tolerance = this.canvas.height;
        let line = { x0: prev.x, y0: prev.y, x1: next.x, y1: next.y };
        let linePoint = lineModule.linePointNearestMouse(line, mousePoint.x, mousePoint.y);
        let dx = mousePoint.x - linePoint.x;
        let dy = mousePoint.y - linePoint.y;
        let distance = Math.abs(Math.sqrt(dx * dx + dy * dy));  //Get the distance between two points

        if (distance < tolerance) {
            this.tentativeNode = linePoint;
            this.showTentativeNode = true;
            // this.currIndex = this.nodeHitTest(this.object.tentativeMousePoint);    //TODO - handle this point here
            // this.prevNodeIndex = index + 1;
            return;
        }

        this.startX = point.x;
        this.startY = point.y;
    }

    /**
     * End node drag
     */
    this.endNodeDrag = function (mouse) {

        if (this.nodeDrag == false) {
            return;
        }
     
        let distance = lineModule.lengthOfALine(this.origin,this.tentativeNode);
        if(this.dragNodeIndex == 1 || this.dragNodeIndex ==3){
            this.radiusX =distance;
        } else{
            this.radiusY =distance;
        }

        this.nodeDrag = false;
    }

    /**
   * Draw the tentative node for the mouseh here
   */
    this.drawTentativeNode = function () {

        if (this.nodeDrag == false) {
            return;
        }
        let color = "#FF0000";
        canvasModule.drawPointForRotation(this.ctx, this.tentativeNode, this.lineWidth,color);
        canvasModule.drawStraightLine(this.ctx, '#6BBEEE', this.leftExtrema, this.rightExtrema, this.lineWidth * 1.5, [], true);
    }

    /**
    * Update and handle coordinates here
    */
    this.updateAndHandleCoordinates = function () {
        this.updateCoordinates();
        this.handleCordinatesForLabel(this.percentage.x, this.percentage.y);
    } 

    /**
     * Set the extrema for node
     */
    this.setExtremaForNode = function(){
        if(this.dragNodeIndex ==1 || this.dragNodeIndex ==3){
            this.leftExtrema = lineModule.cordOfPointAlongACertainDistanceFromLine(this.nodeCordinates[1],this.nodeCordinates[3],-1000 *this.canvas.width);
            this.rightExtrema = lineModule.cordOfPointAlongACertainDistanceFromLine(this.nodeCordinates[1],this.nodeCordinates[3],1000 * this.canvas.width);
        } else{
            this.leftExtrema = lineModule.cordOfPointAlongACertainDistanceFromLine(this.nodeCordinates[0],this.nodeCordinates[2],-1000 * this.canvas.width);
            this.rightExtrema = lineModule.cordOfPointAlongACertainDistanceFromLine(this.nodeCordinates[0],this.nodeCordinates[2],1000 * this.canvas.width);
        }
    }
}