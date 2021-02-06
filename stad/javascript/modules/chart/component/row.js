/**
 * Handle the row component
 */
function Row() {

    //canvas variable
    this.ctx;
    this.lineWidth = 1;
    this.factor = 1;
    this.canvas;
    this.radius = 7;
    this.seatSpacing = 7;

    //represent process of creation
    this.creation = true;
    this.startPoint = { x: 0, y: 0 };
    this.endPoint = { x: 0, y: 0 };
    this.tentativePoint = { x: 0, y: 0 };
    this.pointCounter = 0;

    //color for seat
    this.xGridColor = "#ADD8E6";
    this.yGridColor = "#FF0000";
    this.seatColor = "#000000";
    this.dynamicLabelFillColor = "#000000";

    //seat array 
    this.seatComponent = [];
    this.rowTempCordinates = [] ; //Temporary holder for rows

    //label - row
    this.label = true;
    this.labelColor = "#000000";

    //seat label
    this.seatLabel = true;
    this.seatLabelColor = "#000000";
    
    this.sequence = 'Numeric';
    this.rowSequence = 'Numeric';

    this.startAt = 0;
    this.seatStartAt = 0;
    this.direction = 'L'; // L for Left and R for Right
    this.directionIndex = 0;
    this.sIndex = 0;

    //id 
    this.rowId =0;

    //Corner Rectangle points
    this.leftPoint;
    this.rightPoint;
    this.rectangleColor = "#00008B";

    this.currentFactor = 1;
    //curve
    this.curve = 0; //Will contain the curve data variable
    this.curveMidPoint;
    this.seatOriginalCordinate = [];

    this.selection = false;
    this.parentCorner = false;

    this.dragComponent = false;

    this.parentSection = null;

    this.matrixCorneDrag = false;

    //handles  back and forth

    this.zIndex = 2;

    /**
     * Draw function - will be called contineously
     */
    this.draw = function (ctx, lineWidth, radius, currentZoomIndex, factor, canvas) {
        this.updateVariable(ctx, lineWidth, radius, factor, canvas);
        this.displayTypeOfRow(currentZoomIndex);
    }

    /**
     * Update variable
     */
    this.updateVariable = function (ctx, lineWidth, radius, factor,canvas) {
        this.ctx = ctx;
        this.lineWidth = lineWidth / 2;
        this.factor = factor;
        this.canvas = canvas;
    }

    /**
    * Handles the display type as row and matrix here.
    */
    this.displayTypeOfRow = function (currentZoomIndex) {
        this.displayRow(currentZoomIndex);
    }

    /**
     * Handles current zoom index for Rows
     */
    this.displayRow = function (currentZoomIndex) {

        this.handleZoom(currentZoomIndex);

        if (this.creation) {
            this.drawTentativeStraightLine();
            this.drawHorizontalLine(this.firstSeat, this.lastSeat);
        } else{

            if(this.rectangle){

                if(!this.selection){
                    this.drawEnclosingRectangle();
                    sharedComponent.handleRotation(this);
                }
             
                if (this.curveMidPoint) {
                    this.drawBezierCurve(this.curveMidPoint);
                }    
            }

            if(this.rectangle || this.parentCorner){
                this.handleCornerRectangle();
            }

            this.handleOperations();
        }
    }

    /**
     * It handels the appearance of seats on zoom level
     * TODO - handling of zoom, need to make this code much better.
     */
    this.handleZoom = function (currentZoomIndex) {

        if(this.label && this.seatComponent.length){
            this.showLabel();
        }
        let zoomCheckPoint = this.currentZoom-2;  //TODO - remove zoom checkpoint from here
        if (currentZoomIndex <= zoomCheckPoint) {
            if(this.startPoint && this.endPoint){
                this.drawSeatLine();
            }
        } else {
            this.drawChildObjects();
        }
    }

    /**
     * Identify the operation
     * Whether drag operation / rotate operation
     * TODO
     */
    this.handleOperations = function(){

        if(this.drag || this.rotate){
            if(!this.selection){
                this.drawTentativeStraightLine();
                this.drawTentativeSeats();
            }
        }
    
        // if((this.leftRectDrag || this.rightRectDrag ||this.matrixCorneDrag)&&!this.rectangle){
        //     this.handleCornerOperation();
        // }
        if((this.cornerDrag || this.matrixCorneDrag)&&!this.rectangle){
            this.handleCornerOperation();
        }
    }

    /**
     * Handle the corner operation for rows
     * Drag/- left and right point
     */
    this.handleCornerOperation = function(){
        let midPoint = lineModule.midPoint(this.firstSeat, this.lastSeat);

        let length = this.seatComponent.length;
        if (length > 3) {
            this.dynamicLabel(midPoint, length);
        }
    }

    /**
     *  Draw the child object for suit
     */
    this.drawChildObjects = function () {
        for (let index = 0; index < this.seatComponent.length; index++) { //TODO seat component.
            this.seatComponent[index].draw(this.ctx, this.radius, this.lineWidth);
        }
    }

    /**
     *  Draw the tentative line,
     */
    this.drawTentativeStraightLine = function () {

        let start,end;
        if(this.creation){
            start = this.startPoint;
            end = this.endPoint;
        }
        else{

            let cornerSeat = this.getCornerSeatCoordinate();
            if(!cornerSeat){ //Handle error cases here
                return;
            }
            start = cornerSeat.first;
            end = cornerSeat.last;
        }
        let startPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(end, start, 1000);
        let endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(start, end, 1000);

        canvasModule.drawStraightLine(this.ctx, this.yGridColor, startPoint, endPoint, this.lineWidth / 2, []);
    }

    /**
     * Draw the line perpendicular to the first seat and the last seat   TODO -- Move it to canvas module
     */
    this.drawHorizontalLine = function (point1, point2) {

        if (point1 && point2) {

            let slope = lineModule.slopeOfALine(point1, point2);
            let angle = Math.atan(slope);

            this.drawSeatGrid(point1, -angle);    //TODO - the first seat and last seat points are not transformed here
            this.drawSeatGrid(point2, -angle);
        }
    }

    /**
     * Take the seat coorddinates and draw the seat Grid   //TODO -- move it to canvas module
     */
    this.drawSeatGrid = function (seat, angle) {

        let rStart = pointModule.rotateAroundAnotherPoint(seat, angle, { x: seat.x, y: -10000000 });
        let rEnd = pointModule.rotateAroundAnotherPoint(seat, angle, { x: seat.x, y: 100000000 });

        this.ctx.strokeStyle = this.xGridColor;
        this.ctx.beginPath();
        this.ctx.moveTo(rStart.x, rStart.y);
        this.ctx.lineTo(rEnd.x, rEnd.y);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
    }

    /**
     * Draw seat as a straight line or dashed line basead on the 
     * Current zoom level.
     */
    this.drawSeatLine = function () {

        for (let index = 0; index < this.seatComponent.length - 1; ++index) {
            let prev = this.seatComponent[index].coordinates[0];
            let next = this.seatComponent[index + 1].coordinates[0];
            canvasModule.drawStraightLine(this.ctx,this.seatColor, prev, next, this.lineWidth * 2,[]);
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
     * Draw the dummy seats to represent the process of creation
     */
    this.drawTentativeSeats = function(){
        let coordinates = this.getTentativeCordinateOfSeat();

        if(!coordinates){
            return;
        }
        for (let index = 0; index < coordinates.length; ++index) {
            this.drawPoints(coordinates[index]);
        }
    }

    /**
     * It draw rectangle for modifying the seat.
     */
    this.drawRectangleForSeatModifying = function (leftPoint, rightPoint, size, angle, firstSeat, lastSeat) {

        canvasModule.drawRectangle(this.ctx, firstSeat, angle, leftPoint, this.lineWidth, this.rectangleColor, size);
        canvasModule.drawRectangle(this.ctx, lastSeat, angle, rightPoint, this.lineWidth, this.rectangleColor, size);
    }

    /**
     * Draw the points
     */
    this.drawPoints = function (point) {

        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        this.ctx.arc(point.x, point.y, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = this.radius / 25;
        this.ctx.strokeStyle = '#00000';
        this.ctx.stroke();
        this.ctx.fill();
    }

    /**
     * Draw the corner rectangle
     */
    this.handleCornerRectangle = function(){
        this.setCornerRectangleCordinate();
    }

    /**
     * Creates Rows
     */
    this.createRow = function (point) {

        if (this.creation == false) {
            return;
        }

        this.pointCounter++;

        this.creation = (this.pointCounter == 1) ? true : false;

        if (this.creation) {
            this.startPoint = { x: point.x, y: point.y };
            this.endPoint = { x: point.x, y: point.y };
        }
        else {
            this.endPoint = { x: point.x, y: point.y };
            if(this.seatComponent.length){
                this.seatComponent[0].rowCreate = false;
                this.seatComponent[this.seatComponent.length-1].rowCreate = false;
            }
        }
    }

    /**
     * Handles movement of mouse
     */
    this.moveMouse = function (point) {

        if (!this.pointCounter) {
            return;
        }

        this.endPoint = { x: point.x, y: point.y };
        this.editRows(point);
    }

    /**
     * Edit the seats of the rows
     */
    this.editRows = function (point) {

        let distance = lineModule.lengthOfALine(this.startPoint, this.endPoint);
        let initialDistance = -this.seatSpacing; //start from corner
        this.seatComponent = [];
        this.seatOriginalCordinate = [];
        this.sIndex = 0;
        while ((initialDistance += this.radius + this.seatSpacing) < distance) {
            let point = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, initialDistance);
            this.createSeatObject(point);
            initialDistance += this.radius;
            this.sIndex++;
        }

        let length = this.seatComponent.length;
        if (!length) {
            return;
        }

        //disable extrema color
        this.firstSeat = this.seatComponent[0].coordinates[0];
        this.lastSeat = this.seatComponent[length - 1].coordinates[0];

        this.seatComponent[0].rowCreate = true;
        this.seatComponent[this.seatComponent.length-1].rowCreate = true;

        //enable extrema color

    }

    /**
     * create the seat object here
     */
    this.createSeatObject = function (point) {
        const seatObject = new Seat();
        seatObject.setSeatDetails(this.getSeatDetails());
        seatObject.coordinates[0] = { x: point.x, y: point.y };
        this.seatComponent.push(seatObject);
        this.seatOriginalCordinate.push({x:point.x,y:point.y});
    }

    /**
     * Get the seat details here
     */
    this.getSeatDetails = function () {

        return {
            id: 0 + this.sIndex,
            name: 0 + this.sIndex,
            color: this.seatColor,
            parent: this,
            seatLabelColor: this.seatLabelColor
        }
    }

    /**
     * Set the seat spacing for the rows 
     */
    this.setSeatSpacing = function (spacing) {
        this.seatSpacing = spacing/this.currentFactor;
        this.updateCoordinatesForSeat();
    }

    /**
     * Get the seat spacing from here
     */
    this.getSeatSpacing = function () {
        return parseInt(this.seatSpacing * this.currentFactor);
    }

    /**
     * Set the seat Radius
     */
    this.setSeatRadius = function (radius) {
        this.radius = radius/this.currentFactor;
        this.updateCoordinatesForSeat();
    }

    /**
     * Get the seat Radius 
     */
    this.getSeatRadius = function () {
        return parseInt(this.radius * this.currentFactor);
    }

    /**
     * Update the coordinates for seat TODO for updating seat and row
     */
    this.updateCoordinatesForSeat = function () {

        let length = this.seatComponent.length;
        let initialDistance = 0;
        // initialDistance+=this.radius; //for first seat handles the distance here TODO
        for (let index = 0; index < length; ++index) {

            let seatObject = this.seatComponent[index];
            initialDistance += this.radius;
            initialDistance += this.seatSpacing;

            let point = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, initialDistance);
            seatObject.coordinates[0] = { x: point.x, y: point.y };

            this.seatOriginalCordinate[index]= {x:point.x,y:point.y};

            initialDistance +=this.radius;
        }
        this.endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint,this.endPoint,initialDistance);
    }

    /**
     * Get cordinate for the seat
     */
    this.getCordinateOfSeat = function(){
        let temp = [];
        for (let index = 0; index < this.seatComponent.length; ++index) {
            let cord = this.seatComponent[index].coordinates[0];
            temp.push(cord);
        }
        return temp;
    }

    /**
     * Get the tentative cordinate for seat
     */
    this.getTentativeCordinateOfSeat = function(){
        let seatCount = 10;
        let seatsCorner = this.getCornerSeatCoordinate();
        if(!seatsCorner){
            return;
        }
        let firstSeat = seatsCorner.first;
        let lastSeat = seatsCorner.last;

        let point1 = lineModule.cordOfPointAlongACertainDistanceFromLine(firstSeat, lastSeat, -seatCount * (2 * this.radius + this.seatSpacing));
        let point2 = lineModule.cordOfPointAlongACertainDistanceFromLine(lastSeat, firstSeat, -seatCount * (2 * this.radius + this.seatSpacing));

        let distance = lineModule.lengthOfALine(point1, point2);
        let initialDistance = 0;

        let tempSeatComponent = [];

        while (initialDistance < distance) {
            let point = lineModule.cordOfPointAlongACertainDistanceFromLine(point1, point2, initialDistance);
            tempSeatComponent.push(point);
            initialDistance += 2 * this.radius+this.seatSpacing;
        }

        return tempSeatComponent;
    }

    /**
     * It sets the corner rectangle coordinates for drawing
     */
    this.setCornerRectangleCordinate = function(){

        let cornerSeats = this.getCornerSeatCoordinate();

        if(!cornerSeats){
            return;
        }
        let firstSeat = cornerSeats.first;
        let lastSeat = cornerSeats.last;

        let distance = lineModule.lengthOfALine(firstSeat, lastSeat);

        this.leftPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(lastSeat, firstSeat, distance);
        this.rightPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(firstSeat, lastSeat, distance);

        let size = this.radius / 1.5;

        let hypotenuse = Math.sqrt(2) * size / 2;
        let radian = 45 * Math.PI / 180;

        let slope = lineModule.slopeOfALine(firstSeat, lastSeat);
        let angle = Math.atan(slope);

        this.leftPoint = {
            x: this.leftPoint.x - hypotenuse * Math.cos(angle + radian),
            y: this.leftPoint.y - hypotenuse * Math.sin(angle + radian)
        }

        this.rightPoint = {
            x: this.rightPoint.x - hypotenuse * Math.cos(angle + radian),
            y: this.rightPoint.y - hypotenuse * Math.sin(angle + radian)
        }

        this.drawRectangleForSeatModifying(this.leftPoint, this.rightPoint, size, angle, this.leftPoint, this.rightPoint);
    }

    /**
     * Point lies inside the polygon or not
     */
    this.pointLiesInsideThePolygon = function (point) {

        this.updateRectCordinate();

        return this.pointLiesInsideRow(point);
    }

    /**
     * Find enclosing rectangle coordinates
     */
    this.updateEnclosingRectangleCoordinate = function (point1, point2) {

        this.rectCordinates = {
            lowestX: (point1.x < point2.x ? point1.x : point2.x) - this.radius,
            lowestY: (point1.y < point2.y ? point1.y : point2.y) - this.radius,
            highestX: (point1.x > point2.x ? point1.x : point2.x) + this.radius,
            highestY: (point1.y > point2.y ? point1.y : point2.y) + this.radius,
        }
    }

    /**
     * check whether the point Lies inside the row or not
     * TOOD -hit test with button is more w
     */
    this.pointLiesInsideRow = function (point) {
        let hitCoordinates = [];
        for(let index=0;index<this.seatComponent.length;++index){
            hitCoordinates.push(this.seatComponent[index].coordinates[0]);
        }
        return this.hitTestForPointInRow(hitCoordinates, point);
    }

    /**
     * Check whether the rotation handler has been hit or not
     */
    this.hitTest = function (ctx, x, y) {

        return canvasModule.pointHitTest(ctx, { x: x, y: y }, this.rotatePoint, this.lineWidth * 5);
    }

    /**
     * Hit test for the point in row
     */
    this.hitTestForPointInRow = function (hitCoordinates, point) {

        for (let index = 0; index < hitCoordinates.length; ++index) {
            this.ctx.beginPath();
            this.ctx.arc(hitCoordinates[index].x, hitCoordinates[index].y, this.radius * 2, 0, 2 * Math.PI);

            if (this.ctx.isPointInPath(point.x, point.y)) {
                return true;
            }
        }
        return false;
    }

    /**
     * check whether the left point has been hit or not.
     */
    this.hitTheLeftPoint = function (point) {

        if(this.dragComponent){
            return false;
        }

        if (this.leftPoint && polyModule.hitTestForRectangle(point, this.leftPoint, this.radius * 2, this.radius * 2)) {
            this.leftRectDrag = true;
            return true;
        }
        return false;
    }

    /**
     * check whether the right point has been hit or not.
     */
    this.hitTheRightPoint = function (point) {

        if(this.dragComponent){
            false;
        }

        if (this.rightPoint && polyModule.hitTestForRectangle(point, this.rightPoint, this.radius * 2, this.radius * 2)) {
            this.rightRectDrag = true;
            return true;
        }
        return false;
    }

    //handle drag

    /**
     * Start Drag here
     */
    this.startDrag = function (mouse) {
        this.dragObject = new Drag(this);
        this.dragObject.startDrag(mouse);
        this.dragComponent = true;
        this.rightRectDrag = false;

        //TODO -- handle left Rect Drag and right rect drag case here
    }

    /**
     * Dragging the rows
     */
    this.dragging = function (mouse) {

        if(!this.drag){
            return;
        }
        this.updateCordinatesWhileDragging(mouse);
        this.dragObject.dragging(mouse);

        this.leftRectDrag = false;
        this.rightRectDrag = false;
    }

    /**
     * End the dragging.
     */
    this.endDrag = function (mouse,childElement) {
        this.dragObject.endDrag(mouse,childElement);
        this.drag = false;
        this.dragComponent = false;
    }

     /**
     * Update the coordinates while dragging
     */
    this.updateCordinatesWhileDragging = function (mouse) {
        this.updateSeatPointWhileDragging(mouse);
    }

    /**
     * Updat the seat point while drawing
     */
    this.updateSeatPointWhileDragging = function(mouse){

        for(let index = 0;index < this.seatComponent.length;++index){
            this.seatComponent[index].coordinates[0].x+=mouse.x - this.startX;
            this.seatComponent[index].coordinates[0].y+=mouse.y - this.startY;
            this.seatOriginalCordinate[index].x+=mouse.x - this.startX;
            this.seatOriginalCordinate[index].y+=mouse.y - this.startY;
        }

        this.firstSeat = this.seatComponent[0].coordinates[0];
        this.lastSeat = this.seatComponent[this.seatComponent.length - 1].coordinates[0];   

        length = lineModule.lengthOfALine(this.firstSeat,this.lastSeat);
        this.startPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.lastSeat,this.firstSeat,length+this.radius);
        this.endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.firstSeat,this.lastSeat,length+this.radius);
    }

    /**
     * Update the rectangle coordinate
     */
    this.updateRectCordinate = function () {
        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.getCordinateOfSeat());
        this.rectCordinates = {
            lowestX: this.rectCordinates.lowestX - this.radius,
            lowestY: this.rectCordinates.lowestY - this.radius,
            highestX: this.rectCordinates.highestX + this.radius,
            highestY: this.rectCordinates.highestY + this.radius,
        }
    }

    //rotation

     /**
     * Handles the starting of the rotation of the rows.
     */
    this.rotateStartDrag = function (mouse) {

         //for rotating the rows of the seats handle this point
        let length = lineModule.lengthOfALine(this.startPoint, this.endPoint);
        this.centroid = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, length / 2);

        this.rotateObject = new Rotate(this);
        this.rotateObject.startRotate(mouse);

        this.rowTempCordinates=[];
        for(let index=0;index<this.seatComponent.length;++index){
            this.rowTempCordinates.push(this.seatComponent[index].coordinates[0]);
        }
    }

    /**
     * Handles the dragging of mouse while rotation
     */
    this.rotateDragging = function (mouse) {
        this.rotateRows(mouse);
    }

    /**
     * It ends the dragging for rotation.
     */
    this.rotateEndDrag = function (mouse) {
        this.rotateObject.endRotate(mouse);
    }

    /**
     * It handle the rotation of the rows
     */
    this.rotateRows = function (mouse) {
        this.rotateObject.rotating(mouse);
        let length = this.seatComponent.length;
        this.rotateSeats(this.seatComponent, length, this.centroid, this.rotationAngle);
    }

    /**
     * It rotates the seat coordinates/ --TODO can be moved outside this class
     */
    this.rotateSeats = function (component, length, center, angle) {
        for (let index = 0; index < length; ++index) {
            let point = pointModule.rotateAroundAnotherPoint(center, angle, this.rowTempCordinates[index]);
            component[index].coordinates[0] = {x:point.x,y:point.y};
            this.seatOriginalCordinate[index]={x:point.x,y:point.y};
        }
        this.firstSeat = component[0].coordinates[0];
        this.lastSeat = component[component.length - 1].coordinates[0];   

        length = lineModule.lengthOfALine(this.firstSeat,this.lastSeat);
        this.startPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.lastSeat,this.firstSeat,length+this.radius);
        this.endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.firstSeat,this.lastSeat,length+this.radius);
    }

    //seat operation
    /**
     * It get the corner seat position 
     */
    this.getCornerSeatCoordinate = function () {

        let length = this.seatComponent.length;

        if(!length){
            return;
        }

        let firstSeat = this.seatComponent[0].coordinates[0];
        let lastSeat = this.seatComponent[length - 1].coordinates[0];
        return {
            first: firstSeat,
            last: lastSeat
        }
    }

    //handles label for seat here
    
    /**
     * Show the label in the seats.
     */
    this.showLabel = function () {
        this.ctx.font = this.radius * 1.5 + 'px Arial';
        this.ctx.fillStyle = this.labelColor;

        let center = this.labelPosition();
        this.typeOflabel(this.rowSequence , center);
    }

    /**
     * Find the label position, here  -- TODO - Remove from here to helper module
     */
    this.labelPosition = function () {

        let point = this.getCornerSeatCoordinate();
        let distance = lineModule.lengthOfALine(point.first, point.last);
        let position = distance + 2 * this.radius;
        let center = lineModule.cordOfPointAlongACertainDistanceFromLine(point.last, point.first, position);

        return center;
    }

    /**
     * Determine the type of label.
     */
    this.typeOflabel = function (type, center) {

        if (isNaN(this.startAt)) {
            this.startAt = this.startAt.charCodeAt(0) - 65;
        }

        let rowIndex = this.rowId + parseInt(this.startAt) + this.directionIndex;

        switch (type) {
            case 'Numeric': this.showNumericLabel(rowIndex, center);
                break;
            case 'Alphabet': this.showAlphaLabel(center, rowIndex);
                break;
        }
    }

    /**
     * Show the numeric label for the rows label  TODO -- move to separate file
     */
    this.showNumericLabel = function (rowId, center) {
        let xPos = rowId > 9 ? 1 : 2;
        this.ctx.fillText(rowId, center.x - this.radius / xPos, center.y + this.radius / 2);
    }
    
    /**
     * Show Alphabet labels for the seats. TODO - move to separate file 
     */
    this.showAlphaLabel = function (center, rowIndex) {

        if (rowIndex > 25) {
            this.showNumericLabel(rowIndex - 26, center);
        } else {

            let alphabet = String.fromCharCode(rowIndex + 65);
            this.ctx.fillText(alphabet, center.x - this.radius / 2, center.y + this.radius / 2);
        }
    }

    /**
     * It draws the dynamic label for the seats
     */
    this.dynamicLabel = function (position, length) {

        this.ctx.fillStyle = this.dynamicLabelFillColor;
        canvasModule.drawRoundRect(this.ctx, position.x - this.radius, position.y - this.radius,
            this.radius * 2.5, this.radius * 2, this.radius / 10, true, true);

        let xPos = this.setXForLabel(length);

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.fillText(length, position.x - this.radius/xPos, position.y + this.radius / 3);
    }

    /**
     * Set the x position for label
     * Here 3,2, and 1 are the respective 
     * cordiantes to be divided for here. TODO - separate module
     */
    this.setXForLabel = function (length) {
        if (length < 10) {
            return this.radius;
        } else if (length == 11) {
            return 2.7;
        } else if (length < 20) {
            return 3;
        }
        else if (length < 100) {
            return 2; //TODO -- need to handle this accurately
        } else {
            return 1;
        }
    }

    /**
    * Choose the direction and assign , direction according to that here
    */
   this.chooseDirection = function (direction,length) {

        if (direction == 'U') {
            this.directionIndex = 0;
        }
        else {
            this.directionIndex = length - 2 * this.rowId - 1;
        }
    }

    //draggging for row corner

    /**
     * It starts the drag for modifying the seat.
     */
    this.dragStartForRowCorner = function (mouse, type) {
        this.startX = mouse.x;
        this.startY = mouse.y;
        this.rectangle = false;
        this.cornerDrag = true;

        this.prevCursor = this.canvas.style.cursor;
        this.canvas.style.cursor = "col-resize";

        let cornerSeat = this.getCornerSeatCoordinate();

        if (cornerSeat.first.x < cornerSeat.last.x) {
            this.dragCenterLeft = cornerSeat.first;
            this.dragCenterRight = cornerSeat.last;
        } else {
            this.dragCenterLeft = cornerSeat.last;
            this.dragCenterRight = cornerSeat.first;
        }

        if(type == 'left'){
            this.leftRectDrag = true;
        } else{
            this.rightRectDrag = true;
        }

        this.tempCategory = this.getCategory();
    }

     /**
     * Action to perform while dragging seat
     * TODO - handling left point coordinates
     */
    this.draggingRowCorner = function (mouse, type, distance) {
        this.updateEndPointCordinate(mouse, type, distance);

        this.canvas.style.cursor = "col-resize";
        this.startX = mouse.x;
        this.startY = mouse.y;
        this.rectangle = false;

        this.editRows();

        // this.updateSeats();
        this.updateSeatCategoryForRowEditing();
    }

    /**
     * Update the coordinates while modifying the seat.
     * TODO - update the point according to coordinate not on the basis of left and right
     */
    this.updateEndPointCordinate = function (mouse, type, distance) {
        switch (type) {
            case 'left': this.updateLeftEndPoint(mouse, distance);
                break;
            case 'right': this.updateRightEndPoint(mouse, distance);
                break;
        }
    }

    /**
     * Update the left end point
     */
    this.updateLeftEndPoint = function (mouse, dist) {

        if(!this.dragCenterLeft || !this.dragCenterRight){
            return;
        }

        let line = { x0: this.startPoint.x, y0: this.startPoint.y, x1: this.endPoint.x, y1: this.endPoint.y };
        let linePoint =  lineModule.linePointNearestMouse(line, mouse.x, mouse.y);
        let distance  = lineModule.lengthOfALine(linePoint,this.endPoint);

        //TODO - handle the end cases
        // if(linePoint.x>this.dragCenterRight.x){
        //     return;
        // }
        this.startPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.endPoint,this.startPoint,distance);
    }

    /**
     * update the right end point here
     */
    this.updateRightEndPoint = function (mouse, dist) {
        if(!this.dragCenterLeft || !this.dragCenterRight){
            return;
        }

        let line = { x0: this.startPoint.x, y0: this.startPoint.y, x1: this.endPoint.x, y1: this.endPoint.y };
        let linePoint =  lineModule.linePointNearestMouse(line, mouse.x, mouse.y);
        let distance  = lineModule.lengthOfALine(linePoint,this.startPoint);

        //TODO handle the end cases
        // if(linePoint.x<this.dragCenterLeft.x){
        //     return;
        // }
        this.endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint,this.endPoint,distance);
    }

    /**
     * Action to perform while ending the dragging of the seat.
     */
    this.dragEndForRowCorner = function (mouse, type) {

        this.cornerDrag = false;
        switch (type) {
            case 'left': this.leftRectDrag = false;
                break;
            case 'right': this.rightRectDrag = false;
                break;
        }
    }

    //handle curve

    /**
     * Draw a Simple Curve here
    */
    this.drawCurve = function () {

        this.fillActualCordinates();  //Actual cordinate should not be called every timer 

        this.drawParabolicCurve();
    }

    /**
     * Fill with the actual cordinates here.
     */
    this.fillActualCordinates = function () {

        for (let index = 0; index < this.seatComponent.length; ++index) {
            this.seatComponent[index].coordinates[0].x = this.seatOriginalCordinate[index].x;
            this.seatComponent[index].coordinates[0].y = this.seatOriginalCordinate[index].y;
        }
    }

    /**
     * It draws the parabolic curve
     * totally depend on first seat and last seat here
     */
    this.drawParabolicCurve = function () {

        let midPoint = lineModule.midPoint(this.firstSeat, this.lastSeat);
        let midPointLength = lineModule.lengthOfALine(this.firstSeat, midPoint);
        let startingPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.firstSeat, this.lastSeat, -midPointLength);

        let h = lineModule.midPoint(this.firstSeat, this.lastSeat).x;//this might give wrong anser

        let x0 = this.firstSeat.x;
        let y0 = this.firstSeat.y;

        let tanL = Math.tan(this.curve * Math.PI / 180);

        //finding coefficient for parablic equations
        let a = tanL / (2 * (x0 - h));
        let b = - 2 * a * h;
        let c = y0 - a * Math.pow(x0, 2) - b * x0;

        midPoint.y = a * Math.pow(midPoint.x, 2) + b * midPoint.x + c;
        // pointMid.y =  a * Math.pow(pointMid.x, 2) + b * pointMid.x + c
        this.curveMidPoint = midPoint;
        // this.curveMidPoint = pointMid;

        this.putSeatsIntoCurve(a, b, c, startingPoint);
    }

    /**
     * It put the seats into the curve
     * 
     * a is the a coefficient of parabolic equation
     * b is the b coefficient of parablic equation
     * c is the c coefficient of parabolic equation
     */
    this.putSeatsIntoCurve = function (a, b, c, startingPoint) {

        for (let index = 0; index < this.seatComponent.length; ++index) {

            let x = this.seatComponent[index].coordinates[0].x;
            let y = this.seatComponent[index].coordinates[0].y; //Here y will change according to i

            let diff = {
                x: x - startingPoint.x,
                y: y - startingPoint.y
            };

            // let distance =  this.distanceArray[index] - midPointLength;
            height = a * Math.pow(x, 2) + b * x + c;

            let angle = (Math.atan2(diff.y, diff.x) * (180 / Math.PI)) - 90; // draws a perpendicular line

            let angleRadian = circleModule.convertDegreeToRadian(angle);
            if (angleRadian == 0) {
                angleRadian += Math.PI;
                // height = a * Math.pow(y, 2) + b *y + c;
            } else {
                height = this.curveMidPoint.y - height;
            }

            this.seatComponent[index].coordinates[0] = {
                x: x + ((height * 2) * Math.cos(angleRadian)),
                y: y + ((height * 2) * Math.sin(angleRadian))
            }
        }
    }

    /**
     * Draw a bezier curve here
     */
    this.drawBezierCurve = function () {
        this.ctx.beginPath();

        for (let index = 0; index < this.seatComponent.length - 1; ++index) {
            let prev = this.seatComponent[index].coordinates[0];
            let next = this.seatComponent[index + 1].coordinates[0];
            this.ctx.moveTo(prev.x, prev.y);
            this.ctx.lineTo(next.x, next.y);
        }

        this.ctx.stroke();
    }

    //hadles seat color here

    /**
     * It update the previous seat color
     */
    this.updatePrevSeatColor = function () {
        seatCollection.updatePrevSeatColor(this.seatComponent);
    }

    /**
     * It update the seat Color   //TODO better logic than this.
     */
    this.updateSeatColor = function () {
        seatCollection.updateSeatColor(this.seatComponent);
    }

    /**
     * Update the seat selection color
     */
    this.updateSeatSelectionColor = function (color) {
        seatCollection.updateSeatSelectionColor(this.seatComponent, color);
    }

    /**
     * Set the seat category --TODO
     */
    this.setSeatCategory = function (name,color){
        for(let index = 0;index<this.seatComponent.length;++index){
            this.seatComponent[index].setCategory(name,color);
        }
    }

    /**
     * Update seat category for row editing TODO updat in one variable
     */
    this.updateSeatCategoryForRowEditing = function(){

        if(!this.tempCategory){
            return;
        }
        let length = this.seatComponent.length;
        let catgLength = this.tempCategory.length;

        for(let index = 0;index<length;++index){
            let catgIndex;
            if(index<catgLength){
                catgIndex = index;
            }
            else{
                catgIndex = catgLength-1;
            }
            let catg = this.tempCategory[catgIndex];
            this.seatComponent[index].setCategory(catg.name,catg.color);
        }
    }

    /**
     * Get the category of seats selected
     */
    this.getCategory = function(){
        let holder = [];
        for(let index = 0;index<this.seatComponent.length;++index){
            let seat = this.seatComponent[index];
            let catg = seat.getCategory();
            holder.push(catg[0]);
        }
        return holder;
    }
}