/**
 * Handle the rectangle component
 */
function Rectangle() {

    this.coordinates = [];

    //Get from the main
    this.ctx;
    this.lineWidth;
    this.canvas;
    this.factor;

    //property
    this.width = 0;
    this.height = 0;
    this.rotation = 0;
    this.cornerRadius = 0;
    this.stroke = true;
    this.strokeWidth;

    this.fillColor = '#F5F5F5';
    this.strokeColor = '#000000';

    this.stroke = true;

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

    this.rectCordinates;
    this.rectangle = false;
    this.centroid;

    this.startX;
    this.startY;
    this.drag;

    //rotation
    this.startRadian;
    this.prevCursor;
    this.rPoint1;
    this.rPoint2;
    this.tempRectCordinate;
    this.rotateFirstPoint;
    this.rotatePoint;
    this.rotate = false;
    this.rotationAngle = 0;
    this.shapeAngle =0;

    this.zIndex = 2;

    this.backOrder = false;

    this.enableNode = false;

    this.nodeCordinates = [];
    this.prevIndex = -1;
    this.indexCounter = 0;
    this.selectedIndex = [];

    this.currIndex = -1;
    this.dragNodeIndex = -1;
    this.nodeDrag = false;

    this.currentFactor;

    this.parentSection = null;

    this.availableParent = false; //Decide whether drag and rotation is happening with the parent label or child label

    //parent distance x and y for label
    this.parentDistanceX = 0;
    this.parentDistanceY = 0;

    this.parentRotationCounter = false;
    this.area = 0;

    /**
     * Main draw function 
     */
    this.draw = function (ctx, factor, lineWidth, canvas) {

        this.updateVariable(ctx, factor, lineWidth, canvas);
        if (this.startPoint) {
            this.drawObject();

            if (!this.creation) {
                // canvasModule.drawText(this.ctx, this);
                canvasModule.drawTextWithRotation(this);
                if (this.enableNode) {
                    this.drawNodePoint();
                }

                this.drawTentativeNode();
            }
        }

        if (this.rectangle) {
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
     * It draw the object for the selection  --> Draw Object through the line
     */
    this.drawObject = function () {

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillColor;
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.lineWidth = this.lineWidth * 1.5;

        if(!this.rotate && !this.availableParent){
            this.updateCoordinates();
        }

        let centroid = this.centroid;

        this.ctx.translate(centroid.x, centroid.y);
        this.ctx.rotate(this.shapeAngle);
        this.ctx.translate(-(centroid.x), -(centroid.y));

        this.ctx.rect(this.startPoint.x, this.startPoint.y, this.width, this.height);

        if (this.stroke || this.creation) {
            this.ctx.stroke();
        }

        if (!this.creation) {
            this.ctx.fill();
        }

        // canvasModule.drawPoint(this.ctx, this.startPoint.x, this.startPoint.y,
        //     2, this.lineWidth*3, '#0000000',
        //     '#000000');
            
        // canvasModule.drawPoint(this.ctx, this.centroid.x, this.centroid.y,
        //     2, this.lineWidth*3, '#FF0000',
        //     '#000000');

        this.ctx.restore();
    }

    /**
     * Draw the node points by calculating the coordinates
     */
    this.drawNodePoint = function () {

        for (let index = 0; index < this.nodeCordinates.length; ++index) {

            let color;
            if (this.currIndex == index) {
                color = "#FF0000";
            }
            canvasModule.drawPointForRotation(this.ctx, this.nodeCordinates[index], this.lineWidth, color);
        }
    }

    /**
     * Draw the tentative node for the mouseh here
     */
    this.drawTentativeNode = function () {

        if (this.nodeDrag == false) {
            return;
        }
        canvasModule.drawPointForRotation(this.ctx, this.tentativeNode, this.lineWidth);

        let prev = this.nodeCordinates[0];
        for (let index = 1; index < this.nodeCordinates.length; ++index) {
            let current = this.nodeCordinates[index];
            canvasModule.drawStraightLine(this.ctx, '#000000', prev, current, this.lineWidth * 1.5, [this.lineWidth / 10, this.lineWidth / 10], true);
            prev = current;
        }
        let lastNode = this.nodeCordinates[this.nodeCordinates.length - 1];
        canvasModule.drawStraightLine(this.ctx, '#000000', lastNode, this.nodeCordinates[0], this.lineWidth * 1.5, [this.lineWidth / 10, this.lineWidth / 10], true);
    }

    /**
     * It stores the node points 
     */
    this.storeNodePoints = function () {
        this.nodeCordinates = [];
        this.nodeCordinates.push({ x: this.startPoint.x, y: this.startPoint.y });
        this.nodeCordinates.push({ x: this.startPoint.x + this.width, y: this.startPoint.y });
        this.nodeCordinates.push({ x: this.startPoint.x + this.width, y: this.startPoint.y + this.height });
        this.nodeCordinates.push({ x: this.startPoint.x, y: this.startPoint.y + this.height });

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
     * draw the enclosing rectangle here
     */
    this.drawEnclosingRectangle = function () {

        canvasModule.drawEnclosingRectangle(this.ctx, this.rectCordinates,
            this.rotate, this.rotationAngle, this.centroid,
            this.lineWidth, '#6BBEEE');

        sharedComponent.handleRotation(this, this.rectCordinates);
    }

    /**
     * Handle the rectangle
     */
    this.handleRectangle = function () {

        this.drawEnclosingRectangle();

        if (this.drag) {
            sharedComponent.drawLineForSelection(this);
        }
        if (this.rotate) {
            sharedComponent.drawLineForRotation(this);
        }
    }

    /**
     * Check whether the rotation handler has been hit or not
     */
    this.hitTest = function (ctx, x, y) {

        return canvasModule.pointHitTest(ctx, { x: x, y: y }, this.rotatePoint, this.lineWidth * 5);
    }

    /**
     * Set the width of the rectangle here
     */
    this.setWidth = function (width) {
        this.width = width/this.currentFactor;
        this.updateAndHandleCoordinates();
    }

    /**
     * Get the width of the rectangle here 
     */
    this.getWidth = function () {

        return parseInt(this.width * this.currentFactor);
    }

    /**
     * Set the height of the rec
     */
    this.setHeight = function (height) {
        this.height = height/this.currentFactor;
        this.updateAndHandleCoordinates();
    }

    /**
     * Get the width of the rectangle here
     */
    this.getHeight = function () {

        return parseInt(this.height * this.currentFactor);
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

        this.updateCoordinatesForLabel(this.percentage.x, this.percentage.y);
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

    //Selection drag 

    /**
     * Start the selection drag
     */
    this.startCreation = function (mouse) {
        if (!this.creation) {
            return;
        }

        this.startPoint = { x: mouse.x, y: mouse.y };
        this.endPoint = { x: mouse.x, y: mouse.y };
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
        this.updateCoordinates();

        if(!this.componentArea()){
            mainModule.removeLastComponent('rectangle');
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
    }

    /**
     *  return whether the point is inside or not.
     *  calls to the polyModule.
     */
    this.pointLiesInsideThePolygon = function (point) {

        if (this.rotate) {
            return;
        }
        this.updateCoordinates();
        return polyModule.isInsidePolygon(this.coordinates, this.coordinates.length, point);
    }

    /**
     * Update the coordinates here
     */
    this.updateCoordinates = function () {

        this.coordinates[0] = this.startPoint;
        this.coordinates[1] = {
            x: this.startPoint.x + this.width,
            y: this.startPoint.y
        }
        this.coordinates[2] = {
            x: this.startPoint.x + this.width,
            y: this.startPoint.y + this.height
        }
        this.coordinates[3] = {
            x: this.startPoint.x,
            y: this.startPoint.y + this.height
        }

        this.centroid = polyModule.centroidOfAPolygon(this.coordinates);   //TODO changing centroid might be causing a problem
    
        if(this.parentRotationCounter){
            this.parentDistanceX = this.parentReferCentroid.x - this.centroid.x;
            this.parentDistanceY = this.parentReferCentroid.y - this.centroid.y;

            this.parentRotationCounter = false;
        }
        this.centroid = {x:this.centroid.x + this.parentDistanceX,y:this.centroid.y + this.parentDistanceY}

        this.coordinates = pointModule.rotateArrayPoint(this.coordinates, this.centroid, -this.shapeAngle);
        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.coordinates);
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

    //area for the component

    /**
     * returns area
     */
    this.componentArea = function(){
        return this.width * this.height;
    }

    //handle dragging of rectangle

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

        this.updateAndHandleCoordinates();
        this.dragObject.dragging(mouse);
    }

    /**
    * Update the cooediantes while dragging
    */
    this.updateCordinatesWhileDragging = function (mouse) {
        this.startPoint.x += mouse.x - this.startX;
        this.startPoint.y += mouse.y - this.startY;
    }

    /**
     * End drag here
     */
    this.endDrag = function (mouse,childElement) {
        this.dragObject.endDrag(mouse,childElement);
    }

    //rotation

    /**
     * Starts the drag for the rotation here
     */
    this.rotateStartDrag = function (mouse,parent) {

        this.initialRotationAngle = this.labelRotation;
        this.labelnitialCord = { x: this.labelX, y: this.labelY };
        this.tempStartPoint = {x:this.startPoint.x,y:this.startPoint.y};

        if(!parent){
            this.rotateObject = new Rotate(this);
            this.rotateObject.startRotate(mouse);
            this.parentDistanceX = 0;
            this.parentDistanceY = 0;
        } else{
            this.availableParent = true;
            this.initialCentroidAngle = Math.atan(lineModule.slopeOfALine(parent.centroid,this.centroid));
            this.initialStartPointAngle = Math.atan(lineModule.slopeOfALine(parent.centroid,this.startPoint));
            this.initialDiffAngle = Math.abs(this.initialCentroidAngle,this.initialStartPointAngle);

            // this.rotateRectangleShape(mouse,parent);
        }
    }

    /**
     * Handles the dragging for rotation
     */
    this.rotateDragging = function (mouse,parent) {
        this.rotateRectangleShape(mouse,parent);
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
            this.startPoint = this.parentReferCentroid;
            this.rotationAngle +=this.initialDiffAngle;
        }

        this.rotate = false;
    }

    /**
     * Rotate the rectangle shape 
     */
    this.rotateRectangleShape = function (mouse,parent) {
        let centroid,rotationAngle;
        if(!parent){
            this.rotateObject.rotating(mouse);
            centroid = this.centroid;
            rotationAngle = this.rotationAngle;
        }
        else{
            centroid = parent.centroid; //need to understand things
            rotationAngle = parent.rotationAngle;
            this.startPoint = pointModule.rotateAroundAnotherPoint(centroid,rotationAngle,this.tempStartPoint);
            this.centroid = {x:this.startPoint.x,y:this.startPoint.y};
        }
        this.labelRotation = this.initialRotationAngle - rotationAngle;
        this.shapeAngle = this.labelRotation;

        //Though  it should give the right answer here
        let point = pointModule.rotateAroundAnotherPoint(centroid, rotationAngle, this.labelnitialCord);
        this.labelX = point.x;
        this.labelY = point.y;
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
        }
    }

    /**
     * handles node dragging.
     */
    this.nodeDragging = function (point) {

        if (this.nodeDrag == false) {
            return;
        }

        this.tentativeNode = {
            x: this.tentativeNode.x + point.x - this.startX,
            y: this.tentativeNode.y + point.y - this.startY
        }

        this.nodeCordinates[this.dragNodeIndex] = {
            x: this.tentativeNode.x,
            y: this.tentativeNode.y
        }
        this.startX = point.x;
        this.startY = point.y;
    }

    /**
     * End node drag
     */
    this.endNodeDrag = function () {

        if (this.nodeDrag == false) {
            return;
        }

        this.nodeDrag = false;
        
        let index1 = this.dragNodeIndex;
        let index2 = this.dragNodeIndex ^ 2;

        let point1 = this.tentativeNode;

        let point2 = this.nodeCordinates[index2];

        let distance = lineModule.lengthOfALine(point1, point2);

        let slope = lineModule.slopeOfALine(point1, point2);
        let angle = Math.atan(slope);
        
        if (this.shapeAngle) {
            if (point1.x > point2.x) {
                angle += Math.PI/2;
            }

            // this.width = Math.abs(distance * Math.cos(angle));
            // this.height = Math.abs(distance * Math.sin(angle));  //need to handle more test cases for the following.
            // this.width +=10;
            // this.height +=10;

            // if(this.dragNodeIndex == 2){
            //     this.width = Math.abs(distance * Math.cos(angle));
            //     this.height = Math.abs(distance * Math.sin(angle));
            // }

            // console.log("width",this.width);
            // console.log("height",this.height);
            // console.log("node ",this.tentativeNode);
            // if(this.dragNodeIndex==0){
            //     if(this.tentativeNode.x<this.nodeCordinates[this.dragNodeIndex].x){
            //         this.width+=(10/this.currentFactor);
            //         this.height+=(10/this.currentFactor);
            //     }
            //     else{
            //         this.width-=(10/this.currentFactor);
            //         this.height -= (10/this.currentFactor);
            //     }      
            // }
            this.updateAndHandleCoordinates();
            this.storeNodePoints();

            this.dragNodeIndex = -1;
            return;
        }

        this.nodeDragOnNoRotation(distance,angle,point1,index1);
    }

    /**
     * Handle node drag when no rotation is applied.
     * Later it will be put handled through generic rotation method
     * TODO
     */
    this.nodeDragOnNoRotation = function(distance,angle,nodePoint,index1){
        this.width = Math.abs(distance * Math.cos(angle));
        this.height = Math.abs(distance * Math.sin(angle));

        let center = polyModule.centroidOfAPolygon(this.nodeCordinates);
        let start = pointModule.rotateAroundAnotherPoint(center, this.rotationAngle, this.startPoint);
        let end = nodePoint;

        let xdist = end.x - start.x;
        let ydist = end.y - start.y;

        if (index1 == 0) {
            this.startPoint.x += xdist;;
            this.startPoint.y += ydist;
        } else if (index1 == 1) {
            this.startPoint.y += ydist;
        } else if (index1 == 3) {
            this.startPoint.x += xdist;
        }

        this.updateAndHandleCoordinates();

        this.storeNodePoints();
        this.dragNodeIndex = -1;
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
     * Update and handle coordinates here
     */
    this.updateAndHandleCoordinates = function(){
        this.updateCoordinates();
        this.handleCordinatesForLabel(this.percentage.x, this.percentage.y);
    }
}

