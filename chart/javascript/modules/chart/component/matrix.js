/**
 * NOT IN USE
 * Draw the matrix containing rowComponent.
 */

function RowMatrix() {

    this.prevX;
    this.prevY;
    this.currX;
    this.currY;
    this.ctx;

    this.lineWidth = 1;
    this.radius;

    this.currentZoomIndex;
    this.zoomIndex;

    this.rowComponent = [];
    this.rIndex = 0;

    //points.
    this.startPoint;
    this.endPoint;

    //update
    this.update = false;

    //mouse point
    this.mouse = null;

    this.seatStartPoint = [];
    this.seatEndPoint = [];

    this.tempStartPoint;
    this.tempEndPoint;

    //other variable for changing the control of the UI , will be here
    this.curve = 0;
    this.rowSpace = 0;
    this.spacing = 0;
    this.radius;
    this.label = true;

    this.rowSequence = 'Numeric';
    this.startAt = 0;

    this.seatLabel = false;
    this.sequence = 'Numeric';
    this.seatStartAt = 0;
    this.direction = 'U';
    this.seatDirection = 'L';

    this.canvas;
    this.factor;

    this.enableSelection;

    this.selectionStartPoint;
    this.selectionEndPoint;
    this.rectWidth;
    this.rectHeight;
    this.tempRowComponent;  //Holds the temporary row component data
    this.holdRow;

    this.rectangle = false;

    //rotaion
    this.rotate = false;
    this.rotationAngle = 0;
    this.rotateFirstPoint;
    this.rotateSecondPoint;
    this.tempSecondPoint;
    this.startRadian;
    this.rPoint1;
    this.rPoint2;

    //cursor
    this.prevCursor;

    //for dragging
    this.startX;
    this.startY;
    this.drag = false;

    //modifying seat
    this.leftRectDrag;
    this.rightRectDrag;
    this.cornerDrag = false;

    this.zIndex = 1;

    this.matrixDrag = false;

    /**
     * Main draw function
     */
    this.draw = function (ctx, lineWidth, radius, currentZoomIndex, factor, canvas) {

        this.updateVariable(ctx, lineWidth, radius, currentZoomIndex, factor, canvas);

        if (this.startPoint) {
            this.drawChildObject();
        } else if (this.enableSelection) {
            this.drawSelectionRectangle();
        }

        if (this.rectangle) {
            this.handleRectangle();

            if(this.drag){
                sharedComponent.drawLineForSelection(this);
            }

            if(this.rotate){
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
     * Draws the child object such as rows
     */
    this.drawChildObject = function () {
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            if(!row){
                continue;
            }
            row.draw(this.ctx, this.lineWidth, this.radius, this.currentZoomIndex, this.factor, this.canvas);
        }
    }

    /**
     * Handles the rectangle method
     */
    this.handleRectangle = function () {

        this.updateRectangleCoordinates();

        if (!this.rectCordinates) {
            return;
        }

        let rCordinate = polyModule.findAllCoordinatesOfARectangle(this.rectCordinates);
        this.centroid = polyModule.centroidOfAPolygon(rCordinate);

        canvasModule.drawEnclosingRectangle(this.ctx, this.rectCordinates,
            this.rotate, this.rotationAngle, this.centroid,
            this.lineWidth * 2, '#6BBEEE');

        this.modifyRowSeat();

        this.rotate ? sharedComponent.drawObjectForRotation(this.ctx,
            this.rPoint1, this.rPoint2, this.lineWidth) : sharedComponent.drawRotationHandler(this);            ;
    }

    /**
     * Update the start point here
     */
    this.updateStartPoint = function (start) {
        this.updateSeatStartPoint(start);
        this.startPoint = start;
    }

    /**
     * Update the end point here
     */
    this.updateEndPoint = function (end) {
        this.endPoint = end;  //final coordinates of the end point.
        this.update = false;
    }

    /**
     * updates the seat start point here.
     */
    this.updateSeatStartPoint = function (startCord, endCord) {
        // let distance = endCord.y - startCord.y;
        distance = 10000;
        this.seatStartPoint = this.updateSeatPoint(startCord, distance, this.radius, 1);
    }

    /**
     * This update the seats end point here.
     * Only for positive x-axis as per now.
     */
    this.updateSeatEndPoint = function (startCord, endCord) {
        let distance = endCord.x - startCord.x;
        startCord.x += distance;
        distance = endCord.y - startCord.y;
        this.seatEndPoint = this.updateSeatPoint(startCord, distance, this.radius, 1); //set of seats end point is here.
    }

    /**
     * It updates the seat point here
     */
    this.updateSeatPoint = function (cord, distance, radius, spacing) {

        spacing /= this.factor;

        let initialDistance = 0;
        let seatPoint = [];
        while (initialDistance <= distance) {
            seatPoint.push({
                x: cord.x,
                y: cord.y + initialDistance
            });

            initialDistance += 2 * radius + spacing;
        }
        return seatPoint;
    }

    /**
     * It will update the mouse coordinates.
     */
    this.updateMouseCoordinates = function (point) {

        this.endPoint = point;
        if (this.startPoint && this.endPoint) {
            this.rowComponent = [];
            this.update = true;  //by default it should be true, no need to do it again and again.
            this.mouse = point;
            this.updateSeatEndPoint(this.startPoint, point);
            let length = this.seatEndPoint.length;
            this.createRow(length);
        }

    }

    /**
     * It creates the Row object according to it.
     */
    this.createRow = function (length) {
        for (let index = 0; index < length; ++index) {

            const row = this.createRowObject();
            row.startPoint = this.seatStartPoint[index];
            row.endPoint = this.seatEndPoint[index];  //problem here
            row.update = false;
            row.displayType = "matrix";
            row.parentMatrix = this;
            row.radius = this.radius;
            row.rowId = index;
            // row.updateSeatsCordinates();
            row.editRows();
        }
    }

    /**
     * It creates the Row object.
     */
    this.createRowObject = function () {
        const seatRow = new Row();
        // seatRow.radius = this.radius;
        this.rowComponent.push(seatRow);
        // seatRow.currentZoom = this.zoomIndex;
        return seatRow;
    }

    /**
     * It updates the row coordinates here.
     */
    this.updateRowCoordinate = function () {

        this.rowSpace /= this.factor;
        // let increment = this.rowSpace / this.seatEndPoint.length;
        let increment = this.rowSpace;
        let count = 0;
        let leftFirstRow = this.seatStartPoint[0];
        let leftLastRow = this.seatStartPoint[this.seatStartPoint.length - 1];

        for (let index = 0; index < this.seatEndPoint.length; ++index) {

            let row = this.rowComponent[index];

            row.seatComponent = [];
            row.updateSeatsCordinates();

            let point1 = lineModule.cordOfPointAlongACertainDistanceFromLine(leftFirstRow, leftLastRow, count);

            let point = {
                x: (point1.x - leftFirstRow.x) / this.factor,
                y: (point1.y - leftFirstRow.y) / this.factor
            }
            row.updateSeatRowSpacing(point);
            count += increment;
        }
    }

    /**
     * Start the selection drag on mouse down
     */
    this.startSelectionDrag = function (mouse, rowComponent) {
        this.selectionStartPoint = this.selectionEndPoint = mouse;
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
        this.selectionEndPoint = mouse;
        this.rectWidth = this.selectionEndPoint.x - this.selectionStartPoint.x;
        this.rectHeight = this.selectionEndPoint.y - this.selectionStartPoint.y;
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

        this.updateDisplayType();

        this.updateRectangleCoordinates();

        if (this.rectCordinates) {
            let rCordinate = polyModule.findAllCoordinatesOfARectangle(this.rectCordinates);
            this.centroid = polyModule.centroidOfAPolygon(rCordinate);
            this.rectangle = true;
        }
    }

    /**
     * Update the rectangle cordinates
     */
    this.updateRectangleCoordinates = function () {

        let coordinates;
        if (this.rotate) {
            coordinates = this.getCornerPointOfRows();
        } else {
            coordinates = this.allSeatCoordinates();
        }

        if (coordinates.length) {
            this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(coordinates);
            this.rectCordinates = {
                lowestX: this.rectCordinates.lowestX - this.radius,
                lowestY: this.rectCordinates.lowestY - this.radius,
                highestX: this.rectCordinates.highestX + this.radius,
                highestY: this.rectCordinates.highestY + this.radius
            }
        }

    }

    /**
     * Update the seat colo
     */
    this.updateSeatColor = function () {
        for (let index = 0; index < this.tempRowComponent.length; ++index) {
            this.tempRowComponent[index].updateSeatColor();
        }
    }

    /**
     * Update the display type
     */
    this.updateDisplayType = function () {
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            row.drawTentativeStraightLine();
            row.displayType = "matrix";
            row.parentMatrix = this;
        }
    }

    /**
     * It get the corner points of rows.
     * in the form of array
     */
    this.getCornerPointOfRows = function () {
        let coordinates = [];
        for (let index = 0; index < this.rowComponent.length; ++index) {
            coordinates.push(this.rowComponent[index].firstSeat);
            coordinates.push(this.rowComponent[index].lastSeat);
        }
        return coordinates;
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
    }

    /**
     * Handles the hit test for the
     * selection here.
     */
    this.hitTestForSelection = function () {

        //TODO - check the circle instead of the point here.
        this.holdRow = [];
        for (let index = 0; index < this.tempRowComponent.length; ++index) {
            let hit = false;
            let tempComp = this.tempRowComponent[index];
            for (let j = 0; j < tempComp.seatComponent.length; ++j) {
                let component = tempComp.seatComponent[j];

                this.ctx.rect(this.selectionStartPoint.x, this.selectionStartPoint.y, this.rectWidth, this.rectHeight);

                if (this.ctx.isPointInPath(component.coordinates[0].x, component.coordinates[0].y)) {

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
    * Check whether the rotation handler has been hit or not
    */
    this.hitTest = function (ctx, x, y) {

        ctx.beginPath();
        ctx.arc(this.rotatePoint.x, this.rotatePoint.y, this.lineWidth * 10, 0, 2 * Math.PI);

        return ctx.isPointInPath(x, y);
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
        this.updateRectangleCoordinates();
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
            this.rotateSeats(component[index].seatComponent, component[index].seatComponent.length, center, angle);
        }
    }

    /**
     * It rotate the seat
     */
    this.rotateSeats = function (component, length, center, angle) {
        for (let index = 0; index < length; ++index) {
            component[index].coordinates[0] = pointModule.rotateAroundAnotherPoint(center, angle, component[index].coordinates[0]);
        }
    }

    /**
     * Modify the row seat
     */
    this.modifyRowSeat = function () {
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let component = this.rowComponent[index];
            let point1 = component.seatComponent[0].coordinates[0];
            let point2 = component.seatComponent[component.seatComponent.length - 1].coordinates[0];
            canvasModule.drawStraightLine(this.ctx,'#6BBEEE', point1, point2, this.lineWidth, []);
            // component.modifySeat(point1, point2);
            component.setCornerRectangleCordinate(point1,point2);
        }
    }

    //Drag the matrices

    /**
     * Drag started
     */
    this.startDrag = function (mouse) {

        if(this.drag){
            this.drag = false;
            return;
        }
        
        this.startX = mouse.x;
        this.startY = mouse.y;
        this.rectangle = true;
        this.drag = true;

        for(let index = 0;index<this.rowComponent.length;++index){
            let row = this.rowComponent[index];
            row.startDrag(mouse);
            row.rectangle = false;
        }
    }

    /**
     * Dragging
     */
    this.dragging = function (mouse) {
        for(let index=0;index<this.rowComponent.length;++index){
            let row = this.rowComponent[index];
            row.rectangle = false;
            row.dragging(mouse);
        }
    }

    /**
     * end the drag
     */
    this.endDrag = function (mouse) {
        this.drag = false;
        for(let index=0;index<this.rowComponent.length;++index){
            let row = this.rowComponent[index];
            row.endDrag(mouse);
        }
    }

    //handle drag for the row corner

    /**
     * start dragging for the matrix corner
     */
    this.dragStartForMatrixCorner = function (mouse, type) {

        if(!this.leftRectDrag  && !this.rightRectDrag){
            return;
        }

        this.rectangle = false;
        this.cornerDrag = true;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].dragStartForRowCorner(mouse, type);
            this.rowComponent[index].cornerDrag = true;
        }
    }

    /**
     * handle dragging for the matrix corner
     */
    this.draggingMatrixCorner = function (mouse, type) {

        if(!this.cornerDrag){
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
            if(!row.dragCenterLeft){
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
            if(!row.dragCenterRight){
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
        this.leftRectDrag = this.rightRectDrag = false;
        for (let index = 0; index < this.rowComponent.length; ++index) {
            this.rowComponent[index].dragEndForRowCorner(mouse, type);
            this.rowComponent[index].cornerDrag = false;
        }
    }

    /**
     * hit the matrix left point 
     */
    this.hitTheLeftPoint = function (point) {
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
        for (let index = 0; index < this.rowComponent.length; ++index) {
            if (this.rowComponent[index].hitTheRightPoint(point)) {
                this.rightRectDrag = true;
                return true;
            }
        }
        return false;
    }
}