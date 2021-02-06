/**
 *  Not in use
 */
function Rows() {

    this.ctx;

    this.lineWidth = 1;
    this.hideBackground = true;

    this.opacity = 0.5;
    // this.centroid; we need center point instead of that,here.

    //for adding the seats.
    this.seatComponent = [];
    this.seatOriginalCordinate = [];

    this.sIndex = 0;
    this.radius = 1;

    this.prevcolor = this.strokeColor;
    this.prevOpacity = this.opacity;

    this.enableOpacity = true;

    //check last coordinates pushed or not
    this.lastCoord = false;

    //store the section object
    this.sectionObject = null;
    this.parentMatrix = null;

    this.tentativePoint = null;
    this.mouse = null;

    //update variable
    this.update = false;
    this.updateSeat = false;

    this.label = false;
    this.category = []; //will contains the category
    this.paint = true;
    this.curve = 0; //Will contain the curve data variable
    this.displayType = "row";
    this.spacing = 0;

    this.firstSeat = null;
    this.lastSeat = null;
    this.counter = false;
    this.increment = 1;

    this.coordinates = [];

    this.strokeColor = "#0000FF";
    this.seatColor = "#B53737";
    this.seatLabelColor = "#000000";
    this.xGridColor = "#ADD8E6";
    this.yGridColor = "#FF0000";
    this.labelColor = "#000000";

    this.newCounter = 0;
    this.rowSpace = 0;

    this.seatLabel = false;

    this.sequence = 'Numeric';
    this.rowSequence = 'Numeric';

    this.startAt = 0;
    this.seatStartAt = 0;
    this.direction = 'L'; // L for Left and R for Right

    this.seatRadius = 0;

    this.distanceArray = [];
    this.directionIndex = 0;

    //Set the row id
    this.rowId = 0;

    this.currentZoom;
    this.midCord = null;
    this.rectCordinates = [];
    this.rotateFirstPoint;
    this.rotate = false;
    this.rotationAngle = 0;
    this.centroid;

    //drag and rotate 
    this.rectangle = false;
    this.dragRow;
    this.dragCenterLeft;
    this.dragCenterRight;

    //uppermost left coordiantes for the two rectangle is here.
    this.leftPoint;
    this.rightPoint;
    this.leftRectDrag;
    this.rightRectDrag;
    this.cornerDrag = false;

    //for dragging of coordinate;
    this.tempFirstSeat;
    this.tempLastSeat;

    //rotation point
    this.rPoint1;
    this.rPoint2;
    this.startRadian;

    //canvas
    this.canvas;
    this.prevCursor;

    //handle rotaion and drag
    this.enableDrag = false;
    this.enableRotation = false;

    this.rowTempCordinates = [];

    //for handling curve
    this.curveMidPoint;

    //for handling point
    this.factor;

    //rectangle cordinate
    this.rectLeftCord;
    this.rectHeight;
    this.rectWidth;

    this.dragObject;

    this.startPoint;
    this.endPoint;

    this.zIndex =1;

    // this.parentSection = null;
    
    /**
     *  main draw function, this function will be called contineou
     */
    this.draw = function (ctx, lineWidth, radius, currentZoomIndex, factor, canvas) {
        this.updateVariable(ctx, lineWidth, radius, factor, canvas);
        // this.updateSeatRadius();
        this.displayTypeOfRow(currentZoomIndex);
    }

    /**
     * Update the variabler
     */
    this.updateVariable = function (ctx, lineWidth, radius, factor) {
        this.ctx = ctx;
        this.lineWidth = lineWidth / 2;
        this.factor = factor;
        this.spacing /= factor;
        this.canvas = canvas;
    }

    /**
     * Handles the display type as row and matrix here.
     */
    this.displayTypeOfRow = function (currentZoomIndex) {

        if (this.displayType == "row") {
            this.displayRow(currentZoomIndex);
        } else if (this.displayType == "matrix") {
            this.displayMatrix(currentZoomIndex);
        }
    }

    /**
     * Displays the row 
     */
    this.displayRow = function (currentZoomIndex) {

        if (this.update && this.startPoint) {

            this.endPoint = this.mouse;
            this.beforeRowCreation();

        } else {

            this.handleZoom(currentZoomIndex);  //TODO

            if (this.firstSeat && this.lastSeat && this.seatComponent.length && this.rectangle) {
                this.handleSelection();
                this.handleRotation();
            }
            this.handleDraggingCriteria();
        }
        if (this.curveMidPoint) {
            this.drawBezierCurve(this.curveMidPoint);
        }
    }

    /**
     * Calls the method which will help in the process of the 
     * creation.
     */
    this.beforeRowCreation = function () {

        this.drawTentativeStraightLine();
        this.drawHorizontalLine(this.firstSeat, this.lastSeat);
        this.updateSeatsCordinates();
        this.drawChildObjects();
    }

    /**
     * It handles the selection of the rows.
     */
    this.handleSelection = function () {

        if (!this.rotate) {
            this.getExtremaOfSeat();
        }
        canvasModule.drawEnclosingRectangle(this.ctx, this.rectCordinates,
            this.rotate, this.rotationAngle, this.centroid,
            this.lineWidth * 2, '#6BBEEE');
    }

    /**
     * It handles the rotation of the rows here. (TODO - Extensively need to check this part )
     */
    this.handleRotation = function () {

        let point = this.getCornerSeatPosition();

        if (this.rotate && this.seatComponent.length) {
            sharedComponent.drawObjectForRotation(this.ctx, this.rPoint1, this.rPoint2, this.lineWidth);
        }
        else {
            sharedComponent.drawRotationHandler(this);
        }
        this.modifySeat(point.first, point.last);
        this.drawStraightLine("#6BBEEE", point.first, point.last, this.lineWidth * 1.5, []);
    }

    /**
     * It handle the dragging criteria for this
     */
    this.handleDraggingCriteria = function () {

        if (this.dragRow) {

            // this.drawHorizontalLine(this.firstSeat, this.lastSeat);
            this.drawBezierCurve(this.curveMidPoint);

            this.drawTentativeStraightLine();
            // let seat = this.getCornerSeatPosition();
            let coordinate = this.getCirclesCordinates(this.firstSeat, this.lastSeat);
            // let coordinate = this.getCirclesCordinates(seat.first, seat.last);

            this.drawCollectionOfSeat(coordinate);
        } else if (this.rotate) {
            let coordinate = this.getCirclesCordinates(this.seatComponent[0].coordinates[0],
                this.seatComponent[this.seatComponent.length - 1].coordinates[0]);
            this.drawCollectionOfSeat(coordinate);
        }
        if (this.cornerDrag) {
            this.handleCornerDrag();
        }
    }

    /**
     * It handle the corner drag
     */
    this.handleCornerDrag = function () {
        let midPoint = lineModule.midPoint(this.firstSeat, this.lastSeat);

        let length = this.seatComponent.length;
        if (length > 3) {
            this.dynamicLabel(midPoint, length);
        }
    }

    /**
     * It draws the dynamic label for the seats
     */
    this.dynamicLabel = function (position, length) {

        this.ctx.fillStyle = "#000000";
        canvasModule.drawRoundRect(this.ctx, position.x - this.radius, position.y - this.radius,
            this.radius * 2.5, this.radius * 2, this.radius / 10, true, true);

        let xPos = this.setXForLabel(length);

        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.strokeStyle = "#FFFFFF";
        this.ctx.fillText(length, position.x - this.radius / xPos, position.y + this.radius / 3);
    }

    /**
     * Set the x position for label
     * Here 3,2, and 1 are the respective 
     * cordiantes to be divided for here.
     */
    this.setXForLabel = function (length) {
        if (length < 10) {
            return 4;
        } else if (length == 11) {
            return 1.9;
        } else if (length < 20) {
            return 1.5;
        }
        else if (length < 100) {
            return 2;
        } else {
            return 1;
        }
    }

    /**
     * It handels the appearance of seats on zoom level
     * TODO - handling of zoom, need to make this code much better.
     */
    this.handleZoom = function (currentZoomIndex) {
        if (currentZoomIndex >= this.currentZoom) {
            this.drawChildObjects();
            if (this.label && this.seatComponent.length) {
                this.showLabel();
            }
        } else {
            if (this.startPoint && this.endPoint) {
                this.drawSeatLine();
            }
        }
    }

    /**
     * It displays the matrix here
     */
    this.displayMatrix = function (currentZoomIndex) {

        if (this.startPoint && this.endPoint) {
            // this.drawChildObjects();
            if (currentZoomIndex >= this.currentZoom) {
                this.drawChildObjects();
                if (this.label && this.seatComponent.length) {
                    this.showLabel();
                    this.chooseDirection(this.parentMatrix.direction);
                }

                if (this.cornerDrag) {
                    this.handleCornerDrag();
                }
            } else {
                this.drawSeatLine();
            }
        }
    }

    /**
     *  Draw the tentative line,
     */
    this.drawTentativeStraightLine = function () {
        let startPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.endPoint, this.startPoint, 1000);
        let endPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, 1000);

        this.drawStraightLine(this.yGridColor, startPoint, endPoint, this.lineWidth / 2, []);
    }

    /**
     * Point lies inside the polygon or not
     */
    this.pointLiesInsideThePolygon = function (point) {

        if (!this.firstSeat && !this.lastSeat) {
            return false;
        }
        this.updateEnclosingRectangleCoordinate(this.firstSeat, this.lastSeat);

        return this.pointLiesInsideRow(point);
    }

    /**
     * check whether the point Lies inside the row or not
     */
    this.pointLiesInsideRow = function (point) {

        //store seat with very less spacing
        let hitCoordinates = [];
        let distance = lineModule.lengthOfALine(this.startPoint, this.endPoint);
        let initialDistance = 0;
        // initialDistance += this.radius;
        while (initialDistance < distance) {
            let point = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, initialDistance);
            hitCoordinates.push(point);
            initialDistance += 2 * this.radius;
        }

        return this.hitTestForPointInRow(hitCoordinates, point);
    }

    /**
     * Hit test for the point in row
     */
    this.hitTestForPointInRow = function (hitCoordinates, point) {
        for (let index = 0; index < hitCoordinates.length; ++index) {
            this.ctx.beginPath();
            this.ctx.arc(hitCoordinates[index].x, hitCoordinates[index].y, this.radius * 1.5, 0, 2 * Math.PI);

            if (this.ctx.isPointInPath(point.x, point.y)) {
                return true;
            }
        }
        return false;
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
     * Update the temp seat Component for displaying dummy seats while dragging the 
     * rows
     */
    this.getCirclesCordinates = function (firstSeat, lastSeat) {
        let seatCount = 10;
        let point1 = lineModule.cordOfPointAlongACertainDistanceFromLine(firstSeat, lastSeat, -seatCount * (2 * this.radius + this.spacing));
        let point2 = lineModule.cordOfPointAlongACertainDistanceFromLine(lastSeat, firstSeat, -seatCount * (2 * this.radius + this.spacing));

        let distance = lineModule.lengthOfALine(point1, point2);
        let initialDistance = 0;

        let tempSeatComponent = [];

        while (initialDistance < distance) {
            let point = lineModule.cordOfPointAlongACertainDistanceFromLine(point1, point2, initialDistance);
            tempSeatComponent.push(point);
            initialDistance += 2 * this.radius;
        }

        return tempSeatComponent;
    }

    /**
     * Draw seat as a straight line or dashed line basead on the 
     * Current zoom level.
     */
    this.drawSeatLine = function () {

        for (let index = 0; index < this.seatComponent.length - 1; ++index) {
            let prev = this.seatComponent[index].coordinates[0];
            let next = this.seatComponent[index + 1].coordinates[0];
            this.drawStraightLine(this.seatColor, prev, next, this.lineWidth * 2, []);
        }
    }

    /**
     * It draws the straight line
     */
    this.drawStraightLine = function (strokeColor, startPoint, endPoint, lineWidth, dashed) {

        this.ctx.strokeStyle = strokeColor;
        this.ctx.beginPath();
        this.ctx.setLineDash(dashed);
        this.ctx.moveTo(startPoint.x, startPoint.y);
        this.ctx.lineTo(endPoint.x, endPoint.y);
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    }

    /**
     * It draws the object for the rotation of the sections.
     */
    this.drawObjectForRotationOfRows = function (lineFirstPoint, lineSecondPoint) {
        this.drawStraightLine("#6BBEEE", lineFirstPoint, lineSecondPoint, this.lineWidth, []);
        this.drawPointForRotation(lineSecondPoint);
    }

    /**
     * It basically draws the point for selection
     */
    this.drawPointForRotation = function (point) {    //TODO -optimised
        this.ctx.save();
        this.ctx.fillStyle = "#6BBEEE";
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, this.lineWidth * 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.restore();
    }

    /**
     * Draw a Simple Curve here
     */

    this.drawCurve = function () {

        this.fillActualCordinates();  //Actual cordinate should not be called every timer 

        this.drawParabolicCurve();
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
    *  Draw the points
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
     * It draws the collection of seat
     * Take coordinates
     */
    this.drawCollectionOfSeat = function (coordinates) {
        for (let index = 0; index < coordinates.length; ++index) {
            this.drawPoints(coordinates[index]);
        }
    }

    /**
     *  Draw the child object for suit
     */
    this.drawChildObjects = function () {
        for (let index = 0; index < this.seatComponent.length; index++) { //TODO seat component.
            this.seatComponent[index].draw(this.ctx, this.radius,this.lineWidth);
        }
    }

    /**
     *  Create the seat objects
     */
    this.createSeatObject = function (pt) {

        const seatObject = new Seat();

        seatObject.setSeatDetails(this.getSeatDetails());
        seatObject.radius = this.radius;

        seatObject.coordinates.push({
            x: pt.x,
            y: pt.y
        });

        this.sIndex++;

        return seatObject;
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
     * It will update the mouse coordinates here.
     */
    this.updateMouseCoordinates = function (point) {

        this.update = true;
        this.mouse = point;
    }

    /**
     *  update the end points for the coordinates, here.
     * 
     */
    this.updateEndPoints = function (point) {

        this.update = false;
        this.endPoint = point;
        this.seatComponent = [];
        this.updateSeatsCordinates();
        // this.midCord = this.seatComponent[(this.seatComponent.length-1)/2].coordinates[0];
    }

    /**
     * Update the seat coordinates here.
     * To draw the seats.
     */
    this.updateSeatsCordinates = function () {
        this.seatComponent = [];   //TODO - Why we need this.

        let distance = Math.sqrt(Math.pow(this.startPoint.x - this.endPoint.x, 2) + Math.pow(this.startPoint.y - this.endPoint.y, 2));

        this.spacing = this.spacing / this.factor;
        let initialDistance = 0;
        let center;
        this.counter = false;
        this.sIndex = 0;
        this.seatOriginalCordinate = [];
        this.distanceArray = [];
        while (initialDistance < distance) {

            this.distanceArray.push(initialDistance);

            center = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, initialDistance);

            const seatObject = this.createSeatObject(center);

            this.seatComponent.push(seatObject);
            initialDistance += 2 * this.radius;

            if (!this.counter) {
                this.firstSeat = center;
                this.counter = true;
            }

            this.seatOriginalCordinate.push({
                x: seatObject.coordinates[0].x,
                y: seatObject.coordinates[0].y
            });
        }
        this.lastSeat = center;
    }

    /**
     * Update the seat spacing here
     * seat original cordinate and distance array were 
     * obtained from updateSeatCordinate method.
     */
    this.seatSpacing = function () {

        //seat spacing should be handle properly 
        //with the fallback case
        let length = this.seatOriginalCordinate.length;
        for (let index = 0; index < length; ++index) {
            let distance = this.distanceArray[index] + this.spacing * index;
            let point = lineModule.cordOfPointAlongACertainDistanceFromLine(this.firstSeat, this.lastSeat, distance);
            this.seatComponent[index].coordinates[0] = {
                x: point.x,
                y: point.y
            }
        }
        this.lastSeat = this.seatComponent[length - 1].coordinates[0];
        // this.endPoint = this.lastSeat = this.seatComponent[length-1].coordinates[0];
    }

    /**
     * Update the seat spacing.
     */
    this.updateSeatSpacing = function () {

        let extraDistance = (this.seatComponent.length - 1) * this.spacing;
        let distance = lineModule.lengthOfALine(this.startPoint, this.endPoint) + extraDistance;

        let newCenter = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, distance);

        let initialDistance = 2 * this.radius + this.spacing;

        let prevFirst = this.firstSeat;

        for (let index = 0; index < this.seatComponent.length; ++index) {

            let center = lineModule.cordOfPointAlongACertainDistanceFromLine(prevFirst, newCenter, initialDistance);
            prevFirst = center;
            this.seatComponent[index].coordinates[0] = {
                x: center.x,
                y: center.y
            }
        }
        this.endPoint = newCenter;
        // this.lastSeat = this.seatComponent[this.seatComponent.length-1].coordinates[0];
    }

    this.getOriginalCoordinate = function () {
        this.seatOriginalCordinate = [];
        for (let index = 0; index < this.seatComponent.length; ++index) {
            let point = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, this.distanceArray[index]);
            this.seatOriginalCordinate.push({
                x: point.x,
                y: point.y
            })
        }
        // this.startPoint = this.firstSeat = this.seatOriginalCordinate[0];
        // this.endPoint = this.lastSeat = this.seatOriginalCordinate[this.seatOriginalCordinate.length-1];
    }

    /**
     * It update the spacing for the seat here
     */
    this.updateSpacing = function () {
        let totalDistance = (this.seatComponent.length - 1) * 2 * this.radius + (this.seatComponent.length - 1) * this.spacing;
        let incDistnace = 2 * this.radius + this.spacing;
        let newEndPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(this.startPoint, this.endPoint, totalDistance);
        let prevFirst = this.firstSeat;
        for (let index = 0; index < this.seatComponent.length; ++index) {
            let center = lineModule.cordOfPointAlongACertainDistanceFromLine(prevFirst, newEndPoint, incDistnace);
            prevFirst = center;
            this.seatComponent[index].coordinates[0] = {
                x: center.x,
                y: center.y
            }
        }
        this.endPoint = newEndPoint;
    }

    /**
     * It update the seat row spacing
     */
    this.updateSeatRowSpacing = function (point) {

        for (let index = 0; index < this.seatComponent.length; ++index) {
            let seat = this.seatComponent[index].coordinates[0];
            this.seatComponent[index].coordinates[0] = {
                x: seat.x + point.x,
                y: seat.y + point.y
            }
        }
    }

    /**
     * It update the seat Radius, contineously
     */
    this.updateSeatRadius = function (value) {
        if (value <= 0) {
            return;
        }
        value = value / this.factor;
        this.spacing += (value - this.radius) > 0 ? value - this.radius : 0;

        this.radius = value;
    }

    /**
     * Draw the line perpendicular to the first seat and the last seat.
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
     * Take the seat coorddinates and draw the seat Grid
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
     * It supports addition and deletion of the seats.
     */
    this.modifySeat = function (firstSeat, lastSeat) {
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
     * check whether the left point has been hit or not.
     */
    this.hitTheLeftPoint = function (point) {
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
        if (this.rightPoint && polyModule.hitTestForRectangle(point, this.rightPoint, this.radius * 2, this.radius * 2)) {
            this.rightRectDrag = true;
            return true;
        }
        return false;
    }

    /**
     * It draw rectangle for modifying the seat.
     */
    this.drawRectangleForSeatModifying = function (leftPoint, rightPoint, size, angle, firstSeat, lastSeat) {

        canvasModule.drawRectangle(this.ctx, firstSeat, angle, leftPoint, this.lineWidth, this.xGridColor, size);
        canvasModule.drawRectangle(this.ctx, lastSeat, angle, rightPoint, this.lineWidth, this.xGridColor, size);
    }

    /**
     * Show the label in the seats.
     */
    this.showLabel = function () {
        this.ctx.font = this.radius * 1.5 + 'px Arial';
        this.ctx.fillStyle = this.labelColor;

        let center = this.labelPosition();
        this.typeOflabel(this.rowSequence, center);
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
     * Show Alphabet labels for the seats.
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
     * Find the label position, here
     */
    this.labelPosition = function () {

        let point = this.getCornerSeatPosition();
        let distance = lineModule.lengthOfALine(point.first, point.last);
        let position = distance + 2 * this.radius;
        let center = lineModule.cordOfPointAlongACertainDistanceFromLine(point.last, point.first, position);

        return center;
    }

    /**
     * Show the numeric label for the rows label
     */
    this.showNumericLabel = function (rowId, center) {
        let xPos = rowId > 9 ? 1 : 2;
        this.ctx.fillText(rowId, center.x - this.radius / xPos, center.y + this.radius / 2);
    }

    /**
    * Choose the direction and assign , direction according to that here
    */
    this.chooseDirection = function (direction) {

        if (direction == 'U') {
            this.directionIndex = 0;
        }
        else {
            let length = this.parentMatrix.rowComponent.length;
            this.directionIndex = length - 2 * this.rowId - 1;
        }
    }

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

    //handle the dragging of the mouse
    this.startDrag = function (mouse, type) {

        this.dragObject = new Drag(this);
        this.dragObject.startDrag(mouse);

        this.getOriginalCoordinate();

        this.firstSeat = this.seatOriginalCordinate[0];
        this.lastSeat = this.seatOriginalCordinate[this.seatOriginalCordinate.length - 1];

        this.leftRectDrag = false;
        this.rightRectDrag = false;
        this.dragRow = true;
    }

    /**
     * Dragging the rows
     */
    this.dragging = function (mouse, type) {

        this.updateCordinatesWhileDragging(mouse);

        // dragObject.dragging(mouse);
        this.dragObject.dragging(mouse);

        this.leftRectDrag = false;
        this.rightRectDrag = false;

    }

    /**
     * Update the coordinates while dragging
     */
    this.updateCordinatesWhileDragging = function (mouse) {

        // this.updateSeatSpacing();
        this.firstSeat.x += mouse.x - this.startX;
        this.firstSeat.y += mouse.y - this.startY;

        this.lastSeat.x += mouse.x - this.startX;
        this.lastSeat.y += mouse.y - this.startY;

        this.startPoint.x += mouse.x - this.startX;
        this.startPoint.y += mouse.y - this.startY;

        this.endPoint.x += mouse.x - this.startX;
        this.endPoint.y += mouse.y - this.startY;

        this.updateCurvePointwhileDragging(mouse);

        this.startX = mouse.x;
        this.startY = mouse.y;

        //TODO - update seat spacing here

        // this.updateSeatsCordinates();
        // this.seatSpacing();
    }

    /**
     * It update the curve points while dragging
     */
    this.updateCurvePointwhileDragging = function (mouse) {
        for (let index = 0; index < this.seatComponent.length; ++index) {
            let cordinate = this.seatComponent[index].coordinates[0];
            let point = {
                x: cordinate.x + mouse.x - this.startX,
                y: cordinate.y + mouse.y - this.startY
            }
            this.seatComponent[index].coordinates[0] = {
                x: point.x,
                y: point.y
            }

            this.seatOriginalCordinate.push({
                x: point.x,
                y: point.y
            });
        }
    }

    /**
     * End the dragging.
     */
    this.endDrag = function (mouse, type) {

        this.getOriginalCoordinate();

        // this.drag = false;
        this.dragObject.endDrag(mouse);
        this.dragRow = false;
    }

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

        if (this.firstSeat.x < this.lastSeat.x) {
            this.dragCenterLeft = this.firstSeat;
            this.dragCenterRight = this.lastSeat;
        } else {
            this.dragCenterLeft = this.lastSeat;
            this.dragCenterRight = this.firstSeat;
        }
    }

    /**
     * Action to perform while dragging seat
     */
    this.draggingRowCorner = function (mouse, type, distance) {

        this.updateEndPointCordinate(mouse, type, distance);

        this.canvas.style.cursor = "col-resize";
        this.startX = mouse.x;
        this.startY = mouse.y;
        this.rectangle = false;

        this.updateSeatsCordinates();
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

        let distance = lineModule.lengthOfALine(this.dragCenterLeft, mouse);

        distance = dist ? dist : distance;
        // let distance = lineModule.lengthOfALine({x:this.startX,y:this.startY}, mouse);

        if (mouse.x < this.dragCenterLeft.x) {
            distance = -distance;
        }

        let point = lineModule.cordOfPointAlongACertainDistanceFromLine(this.dragCenterLeft, this.dragCenterRight, distance);

        this.firstSeat.x = this.startPoint.x = point.x;
        this.startPoint.y = this.firstSeat.y = point.y;
        // this.lastSeat.x = this.endPoint.x = point.x;
        // this.lastSeat.y = this.endPoint.y = point.y;
    }

    /**
     * update the right end point here
     */
    this.updateRightEndPoint = function (mouse, dist) {
        if(!this.dragCenterLeft || !this.dragCenterRight){
            return;
        }

        let length = lineModule.lengthOfALine(this.dragCenterLeft, this.dragCenterRight);
        let distance = lineModule.lengthOfALine(this.dragCenterRight, mouse);
        distance = dist ? dist : distance;

        if (this.dragCenterRight.x > mouse.x) {
            distance = -distance;
        }
        distance += length;

        let point = lineModule.cordOfPointAlongACertainDistanceFromLine(this.dragCenterLeft, this.dragCenterRight, distance);

        this.lastSeat.x = this.endPoint.x = point.x;
        this.lastSeat.y = this.endPoint.y = point.y;
        // this.firstSeat.x = this.startPoint.x = point.x;
        // this.startPoint.y = this.firstSeat.y = point.y;
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

    //handle for the rotation of the coordinates and the enclosing rectangle.

    /**
     * Handles the starting of the rotation of the rows.
     */
    this.rotateStartDrag = function (mouse) {
        let length = lineModule.lengthOfALine(this.firstSeat, this.lastSeat);
        this.centroid = lineModule.cordOfPointAlongACertainDistanceFromLine(this.firstSeat, this.lastSeat, length / 2);

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
        mainModule.updateChart();
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
     * It rotates the seat coordinates/
     */
    this.rotateSeats = function (component, length, center, angle) {
        for (let index = 0; index < length; ++index) {
            component[index].coordinates[0] = pointModule.rotateAroundAnotherPoint(center, angle, this.rowTempCordinates[index]);
        }
        this.firstSeat = this.startPoint = component[0].coordinates[0];
        this.lastSeat = this.endPoint = component[component.length - 1].coordinates[0];
    }

    /**
     * Check whether the rotation handler has been hit or not
     */
    this.hitTest = function (ctx, x, y) {

        return canvasModule.pointHitTest(ctx, { x: x, y: y }, this.rotatePoint, this.lineWidth * 5);
    }

    /**
     * It get the corner seat position 
     */
    this.getCornerSeatPosition = function () {

        let firstSeat = this.seatComponent[0].coordinates[0];
        let lastSeat = this.seatComponent[this.seatComponent.length - 1].coordinates[0];
        return {
            first: firstSeat,
            last: lastSeat
        }
    }

    /**
     * Extrema gets you the largest and the smallest value
     * 
     */
    this.getExtremaOfRows = function () {
        let minima, maxima;
        minima = maxima = this.seatComponent[0].coordinates[0];

        for (let index = 0; index < this.seatComponent.length; ++index) {
            let point = this.seatComponent[index].coordinates[0];

            minima.x = (minima.x > point.x) ? point.x : minima.x;
            minima.y = (minima.y > point.y) ? point.y : minima.y;
            maxima.x = (maxima.x > point.x) ? point.x : maxima.x;
            maxima.y = (maxima.y > point.y) ? point.y : maxima.y;
        }
        return {
            first: minima,
            last: maxima
        }
    }
    
    /**
     * Get the extream of seat for updating the rectangle cordinate
     */
    this.getExtremaOfSeat = function () {

        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.getSeatCordinates());
        this.updateRectCord(this.radius);
        // this.updateRectangleVariable();
    }

    /**
     * Update the rectangle coordinate here
     */
    this.updateRectCord = function (radius) {
        this.rectCordinates = {
            lowestX: this.rectCordinates.lowestX - radius,
            lowestY: this.rectCordinates.lowestY - radius,
            highestX: this.rectCordinates.highestX + radius,
            highestY: this.rectCordinates.highestY + radius,
        }
    }

    /**
     * TODO - Remove this code from here
     */
    this.updateRectangleVariable = function () {
        this.rectLeftCord = {
            x: this.rectCord.lowestX,
            y: this.rectCord.lowestY
        }

        this.rectHeight = this.rectCord.highestY - this.rectCord.lowestY;
        this.rectWidth = this.rectCord.highestX - this.rectCord.lowestX;
    }

    /**
     * Get the seat Cordinates 
     */
    this.getSeatCordinates = function () {

        let temp = [];
        for (let index = 0; index < this.seatComponent.length; ++index) {
            let cord = this.seatComponent[index].coordinates[0];
            temp.push(cord);
        }
        return temp;
    }
}