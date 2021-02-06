/**
 * Handles the selection matrix 
 */
function selectionMatrix() {

    //basic property 
    this.ctx;
    this.lineWidth;
    this.radius;
    this.currentZoomIndex;
    this.factor;
    this.canvas;

    //rectangle 
    this.rectangle = false;
    this.curve = 0;

    //drag
    this.drag;

    //rotate
    this.rotate = false;

    //selection 
    this.selectionStartPoint = { x: 0, y: 0 };
    this.rectWidth = 0;
    this.rectHeight = 0;

    //component holder
    this.tempRowComponent = [];
    this.rowComponent = [];

    this.rowSpacing = 4;
    this.seatSpacing = 10;
    this.seatRadius = 1;

    this.rowSequence = 'Numeric';
    this.label = false;
    this.startAt = 0;
    this.direction = 'U';

    this.seatLabel = true;
    this.seatSequence = 'Numeric';
    this.seatStartAt = 0;
    this.seatDirection = 'L';
    this.rowStartPointCordinates = [];
    this.rowEndPointCordinates = [];

    this.currentFactor;

    this.dragComponent = false; //TODO remove for testing

    /**
     * Main draw function
     */
    this.draw = function (ctx, lineWidth, radius, currentZoomIndex, factor, canvas) {

        this.updateVariable(ctx, lineWidth, radius, currentZoomIndex, factor, canvas);

        if (this.enableSelection) {
            this.drawSelectionRectangle();
        }

        if (this.rectangle) {
            this.handleRectangle();

            if (this.drag) {
                sharedComponent.drawLineForSelection(this);
            }

            if (this.rotate) {
                sharedComponent.drawLineForRotation(this);
            }
        }
    }

    /**
     * Update the variable 
     */
    this.updateVariable = function (ctx, lineWidth, radius, currentZoomIndex, factor, canvas) {
        this.ctx = ctx;
        this.lineWidth = lineWidth / 2;
        this.radius = radius;
        this.currentZoomIndex = currentZoomIndex;
        this.canvas = canvas;
        this.factor = factor;
    }

    /**
     * Draws the rectangle for the selection.
     */
    this.drawSelectionRectangle = function () {
        this.ctx.globalAlpha = 0.1;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#6BBEEE";
        this.ctx.fillStyle = "#808080";
        this.ctx.fillRect(this.selectionStartPoint.x, this.selectionStartPoint.y, this.rectWidth, this.rectHeight);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
        this.hitTestForSelection();
        this.ctx.globalAlpha = 1;
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
     * Hit test for selection
     */
    this.hitTestForSelection = function(){

        this.holdRow = [];
        let rectCord = [];
        rectCord.push({ x: this.selectionStartPoint.x, y: this.selectionStartPoint.y });
        rectCord.push({ x: this.selectionStartPoint.x + this.rectWidth, y: this.selectionStartPoint.y });
        rectCord.push({ x: this.selectionStartPoint.x + this.rectWidth, y: this.selectionStartPoint.y + this.rectHeight });
        rectCord.push({ x: this.selectionStartPoint.x, y: this.selectionStartPoint.y + this.rectHeight });
        for(let index=0;index<this.tempRowComponent.length;++index){
            let hit = false;
            let tempComp = this.tempRowComponent[index];

            for (let j = 0; j < tempComp.seatComponent.length; ++j) {
                let component = tempComp.seatComponent[j];
                let coordinate = component.coordinates[0];
                if (polyModule.isInsidePolygon(rectCord, rectCord.length, coordinate)) {
                    hit = true;
                    break;
                }
            }
            if (!hit) {
                tempComp.updateSeatColor();
            }
            else {
                tempComp.updateSeatSelectionColor('#ADD8E6');
                this.holdRow.push(tempComp);
            }
        }
    }


    /**
     * Handles the rectangle method
     */
    this.handleRectangle = function () {

        this.drawEnclosingRectangle();
        sharedComponent.handleRotation(this);
    }

    /**
     * Update the reectangle cordinates
     */
    this.updateRectCordinate = function () {

        let coordinates = this.allSeatCoordinates();
        if (coordinates.length) {
            // this.centroid = polyModule.centroidOfAPolygon(coordinates);
            let radius = this.getRadiusMaxima();
            this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(coordinates);
            this.rectCordinates = {
                lowestX: this.rectCordinates.lowestX - radius,
                lowestY: this.rectCordinates.lowestY - radius,
                highestX: this.rectCordinates.highestX + radius,
                highestY: this.rectCordinates.highestY + radius
            }

            let polygonCordinate = polyModule.findAllCoordinatesOfARectangle(this.rectCordinates);
            this.centroid = polyModule.centroidOfAPolygon(polygonCordinate);
        }
    }

    /**
     * Update start and end cordinaate 
     */
    this.storeStartEndCordinateOfRows = function () {
        this.rowStartPointCordinates = [];
        this.rowEndPointCordinates = [];
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            row.parentCorner = true;
            this.rowStartPointCordinates.push({ x: row.startPoint.x, y: row.startPoint.y });
            this.rowEndPointCordinates.push({ x: row.endPoint.x, y: row.endPoint.y });
        }
    }

    /**
     * Get all seat coordinates here
     */
    this.allSeatCoordinates = function () {
        let coordinate = [];
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            for (let y = 0; y < row.seatComponent.length; ++y) {
                coordinate.push(row.seatComponent[y].coordinates[0]);
            }
        }
        return coordinate;
    }

    //selection process

    /**
     * Start the selection drag on mouse down
     */
    this.startSelectionDrag = function (mouse, rowComponent) {
        this.updateSeatColor();
        this.startTempPoint = mouse;
        let point= this.ctx.transformedPoint(mouse.x, mouse.y);
        this.selectionStartPoint = this.selectionEndPoint = { x: point.x, y: point.y };
        this.enableSelection = true;
        this.rectWidth = 0;
        this.rectHeight = 0;
        this.tempRowComponent = rowComponent;
        for (let index = 0; index < this.tempRowComponent.length; ++index) {
            this.tempRowComponent[index].updatePrevSeatColor();
        }
    }

    /**
     * handles the dragging event on mouse move
     */
    this.selectionDragging = function (mouse) {
        this.endTempPoint = mouse;
        let point = this.ctx.transformedPoint(mouse.x, mouse.y);
        this.selectionEndPoint = { x: point.x, y: point.y };

        this.rectWidth = this.selectionEndPoint.x - this.selectionStartPoint.x;
        this.rectHeight = this.selectionEndPoint.y - this.selectionStartPoint.y;
        this.tempRectWidth = this.endTempPoint.x - this.startTempPoint.x;
        this.tempRectHeight = this.endTempPoint.y - this.startTempPoint.y;
    }

    /**
     * End the selection drag on mouse up  --TODO
     */
    this.endSelectionDrag = function (mouse) {
        this.enableSelection = false;
        this.rowComponent = this.holdRow;  //hold it into the matrix component . delete from the seatRowComponent

        this.updateSeatColor();

        if (!this.rowComponent || !this.rowComponent.length) {
            return;
        }

        this.storeStartEndCordinateOfRows();
        this.updateRectCordinate();
        this.sortRowComponent();
    }

    /**
     * Update the seat colo
     */
    this.updateSeatColor = function () {

        if (!this.tempRowComponent.length) {
            return;
        }
        for (let index = 0; index < this.tempRowComponent.length; ++index) {
            this.tempRowComponent[index].updateSeatColor();
        }
    }

    //hit cases

    /**
     * hit the matrix left point 
     */
    this.hitTheLeftPoint = function (point) {

        if(this.dragComponent){
            return false;
        }

        for (let index = 0; index < this.rowComponent.length; ++index) {
            if (this.rowComponent[index].hitTheLeftPoint(point)) {
                this.leftRectDrag = true;
                return true;
            }
        }
        return false;
    }

    /**
     * hit the matrix left point
     */
    this.hitTheRightPoint = function (point) {

        if(this.dragComponent){
            return false;
        }
        
        for (let index = 0; index < this.rowComponent.length; ++index) {
            if (this.rowComponent[index].hitTheRightPoint(point)) {
                this.rightRectDrag = true;
                return true;
            }
        }
        return false;
    }

    /**
     * Hit test for the rectangle handler
     */
    this.hitTest = function (ctx, x, y) {

        ctx.beginPath();
        ctx.arc(this.rotatePoint.x, this.rotatePoint.y, this.lineWidth * 10, 0, 2 * Math.PI);

        return ctx.isPointInPath(x, y);
    }

    //handle drag
    this.startDrag = function (mouse) {

        this.dragObject = new Drag(this);
        this.dragObject.startDrag(mouse);
        this.dragComponent = true;

        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            row.startDrag(mouse);
            row.rectangle = false;
            row.selection = true;
        }
    }

    /**
     * Dragging
     */
    this.dragging = function (mouse) {

        if (this.drag == false) {
            return;
        }
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            row.rectangle = false;
            row.selection = true;
            row.dragging(mouse);
        }

        this.leftRectDrag = false;
        this.rightRectDrag = false;
    }

    /**
     * end the drag
     */
    this.endDrag = function (mouse) {
        this.dragObject.endDrag(mouse);
        this.drag = false;
        this.dragComponent = false;
        let childElement= true;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            row.selection = false;
            row.endDrag(mouse,childElement);
        }
        this.storeStartEndCordinateOfRows();
    }


    /**
     * Handles the starting of the rotation of the rows.
     */
    this.rotateStartDrag = function (mouse) {

        this.startRadian = Math.atan(lineModule.slopeOfALine(this.centroid, mouse));

        this.rPoint1 = this.rotateFirstPoint;
        this.rPoint2 = this.rotatePoint;

        this.rotateMatrix(mouse);

        this.prevCursor = this.canvas.style.cursor;
        this.rectangle = true;
    }

    /**
    * Handle the drag of an element
    */
    this.rotateDragging = function (mouse) {

        if (this.rotate == false) {
            return;
        }
        this.rotateMatrix(mouse);
        this.canvas.style.cursor = "grabbing";
    }

    /**
    * Handle the end of the drag
    */
    this.rotateEndDrag = function (mouse) {
        this.canvas.style.cursor = this.prevCursor;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let component = this.rowComponent[index];
            component.firstSeat = component.startPoint = component.seatComponent[0].coordinates[0];
            component.lastSeat = component.endPoint = component.seatComponent[component.seatComponent.length - 1].coordinates[0];
        }
        this.storeStartEndCordinateOfRows();
        // this.updateRectangleCoordinates();
    }

    /**
    * It handle the rotation of the matrix
    * 
    */
    this.rotateMatrix = function (mouse) {

        let initialRadian = Math.PI / 2;
        let slope = lineModule.slopeOfALine(this.centroid, mouse);
        let finalRadian = Math.atan(slope);

        if (mouse.x > this.centroid.x) {
            finalRadian += Math.PI;
        }

        let diffRadian = this.startRadian - finalRadian;
        let length = this.rowComponent.length;

        this.rotationAngle = initialRadian - finalRadian;

        this.rotateRows(this.rowComponent, length, this.centroid, diffRadian);

        this.startRadian = finalRadian;

        this.rPoint1 = pointModule.rotateAroundAnotherPoint(this.centroid, this.rotationAngle, this.rotateFirstPoint);
        this.rPoint2 = pointModule.rotateAroundAnotherPoint(this.centroid, this.rotationAngle, this.rotatePoint);
    }

    /**
     * It rotate the rows
     */
    this.rotateRows = function (component, length, center, angle) {
        for (let index = 0; index < length; ++index) {
            this.rotateSeats(component[index], component[index].seatComponent, component[index].seatComponent.length, center, angle);
        }
    }

    /**
    * It rotate the seat
    */
    this.rotateSeats = function (row, component, length, center, angle) {
        for (let index = 0; index < length; ++index) {
            component[index].coordinates[0] = pointModule.rotateAroundAnotherPoint(center, angle, component[index].coordinates[0]);
        }
        row.firstSeat = component[0].coordinates[0];
        row.lastSeat = component[component.length - 1].coordinates[0];

        length = lineModule.lengthOfALine(row.firstSeat, row.lastSeat);
        row.startPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(row.lastSeat, row.firstSeat, length + row.radius);
        row.endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(row.firstSeat, row.lastSeat, length + row.radius);
    }

    //Dragging of rows

    /**
     * start dragging for the matrix corner
     */
    this.dragStartForMatrixCorner = function (mouse, type) {

        if (!this.leftRectDrag && !this.rightRectDrag) {
            return;
        }

        this.rectangle = false;
        this.cornerDrag = true;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].dragStartForRowCorner(mouse, type);
            this.rowComponent[index].matrixCornerDrag = true;
        }
    }

    /**
     * handle dragging for the matrix corner
     */
    this.draggingMatrixCorner = function (mouse, type) {

        if (this.cornerDrag == false) {
            this.rectangle = true;
            return;
        }

        this.rectangle = false;
        let distance;
        switch (type) {
            case 'left': distance = this.updateMatrixLeftCorner(mouse);
                break;
            case 'right': distance = this.updateMatrixRightCorner(mouse);
                break;
        }
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].draggingRowCorner(mouse, type, distance);
        }
    }

    /**
    * Update the matrix left corner
    */
    this.updateMatrixLeftCorner = function (mouse) {

        let min = 1000000;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            if (!row.dragCenterLeft) {
                return;
            }
            let distance = lineModule.lengthOfALine(row.dragCenterLeft, mouse);
            min = min > distance ? distance : min;
        }
        return min;
    }

    /**
    * Update the matix right corner
    */
    this.updateMatrixRightCorner = function (mouse) {
        let min = 1000000;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            if (!row.dragCenterRight) {
                return;
            }
            let distance = lineModule.lengthOfALine(row.dragCenterRight, mouse);
            min = min > distance ? distance : min;
        }
        return min;
    }

    /**
     * Drag end for the matrix corner
     */
    this.dragEndForMatrixCorner = function (mouse, type) {
        this.rectangle = true;
        this.cornerDrag = false;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].dragEndForRowCorner(mouse, type);
            this.rowComponent[index].matrixCornerDrag = false;
        }
        this.storeStartEndCordinateOfRows();
    }

    //properties for seats and rows

    /**
     * Set Curve
     */
    this.setCurve = function (curve) {
        this.curve = curve;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].curve = curve;
            this.rowComponent[index].drawCurve();
        }
    }

    /**
     * Get curve
     */
    this.getCurve = function () {

        return this.curve;
    }

    /**
     * Set the row spacing 
     */
    this.setRowSpacing = function (spacing) {

        if(this.rowComponent.length<=1){
            return;
        }
        this.rowSpacing = spacing / this.currentFactor;

        let extremaLength = this.rowStartPointCordinates.length;
        let firstStartExtrema = this.rowStartPointCordinates[0];
        let firstEndExtrema = this.rowEndPointCordinates[0];
        let lastStartExtrema = this.rowStartPointCordinates[extremaLength - 1];
        let lastEndExtrema = this.rowEndPointCordinates[extremaLength - 1];

        let seatSpacing = 0;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            // row.startpoint = lineModule.cordOfPointAlongACertainDistanceFromLine(firstStartpoint,secondStartpoint,);
            if (index) {
                seatSpacing = this.seatRadius * 2;
            }
            distance = (this.rowSpacing + seatSpacing) * index;
            // row.startPoint.y =  this.rowStartPointCordinates[index].y + distance;
            // row.endPoint.y = this.rowEndPointCordinates[index].y + distance;

            row.startPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(firstStartExtrema, lastStartExtrema, distance);
            row.endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(firstEndExtrema, lastEndExtrema, distance);
            row.updateCoordinatesForSeat();
        }
    }

    /**
     * Get the row spacing
     */
    this.getRowSpacing = function () {
        return parseInt(this.rowSpacing * this.currentFactor);
    }

    /**
     * set the seat spacing 
     */
    this.setSeatSpacing = function (spacing) {
        this.seatSpacing = spacing / this.currentFactor;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].setSeatSpacing(this.seatSpacing);
        }
    }

    /**
     * Get the seat spacing 
     */
    this.getSeatSpacing = function () {
        return parseInt(this.seatSpacing * this.currentFactor);
    }

    /**
     * Set the seat radius
     */
    this.setSeatRadius = function (radius) {
        this.seatRadius = radius / this.currentFactor;
        if (!this.seatRadius) {
            return;
        }
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].setSeatRadius(this.seatRadius);
        }
        //TODO  need to call row spacing to handle this things
        this.setRowSpacing(this.rowSpacing * this.currentFactor);
    }

    /**
     * Get the seat radius
     */
    this.getSeatRadius = function () {
        return parseInt(this.seatRadius * this.currentFactor);
    }

    /**
     * Set the row sequence
     */
    this.setRowSequence = function (value) {
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].rowSequence = value;
        }
    }

    /**
     * Get the row sequence
     */
    this.getRowSequence = function () {
        return this.rowSequence;
    }

    /**
     * Display the row label
     */
    this.displayRowLabel = function (value) {
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].label = value;
            this.rowComponent[index].rowId = index;
        }
    }

    /**
     * Sets start at for matrices
     */
    this.setStarAt = function (startAt) {
        this.startAt = startAt;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].startAt = this.startAt;
        }
    }

    /**
     * Set direction for labelling for rows
     */
    this.setDirection = function (direction) {
        let length = this.rowComponent.length;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].chooseDirection(direction, length);
        }
    }

    /**
     * Set the category
     */
    this.setCategory = function (name, color) {
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].setSeatCategory(name, color);
        }
    }
    //seat labelling to be handled

    /**
     * Get seat category
     */
    this.getCategory = function () {
        let catgHolder = [];
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            let catg = row.getCategory();
            catgHolder.push(...catg);
        }

        return catgHolder;
    }

    /**
     * Sort row component
     * on basis of start point
     */
    this.sortRowComponent = function () {
        this.rowComponent.sort(function (a, b) {
            if (a.startPoint.y < b.startPoint.y) {
                return -1;
            }
            return 1;
        });
    }

    /**
     * Get the radius maxima for the circle
     * TODO - remove to separate module
     */
    this.getRadiusMaxima = function(){
        
        if(!this.rowComponent.length && !this.rowComponent.seatComponent.length){
            return;
        }

        let radius = this.rowComponent[0].seatComponent[0].radius;
        for(let index = 0;index<this.rowComponent.length;++index){
            const row = this.rowComponent[index];
            for(let y =0; y<row.seatComponent.length;++y){
                const seat = row.seatComponent[y];
                let seatRadius = seat.radius;
                radius = radius >seatRadius?radius:seatRadius;
            }
        }

        return radius;
    }
}