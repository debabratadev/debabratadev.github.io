/**
 * Differet canvas operation
 */
var canvasModule = (function () {

    //Rectangle

    /**
     * Draw rectangle on canvas
     * 
     * @param {*} ctx       is the canvas context
     * @param {*} center    is the center along which to rotate
     * @param {*} angle     is the angle of rotation
     * @param {*} point     is the left-upper coordinate of the rectangle
     * @param {*} linewidth is the linewidth 
     * @param {*} color     is the color 
     * @param {*} size      is the size of the rectangle
    */
    function drawRectangle(ctx, center, angle, point, linewidth, color, size) {

        ctx.save();
        ctx.strokeStyle = color;

        ctx.beginPath();
        ctx.translate(center.x, center.y);
        ctx.rotate(angle);
        ctx.translate(-center.x, -center.y);

        ctx.fillStyle = color;

        ctx.fillRect(point.x, point.y, size, size);
        ctx.lineWidth = linewidth;
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws the enclosing rectangle for row,matrix and section
     * 
     * @param {*} ctx        is the canvas context
     * @param {*} coordinate is the rectangle cordinate 
     * @param {*} rotate     is whether to be roated or not
     * @param {*} angle      is the angle to be rotated
     * @param {*} centroid   is the centroid of the rectangle
     * @param {*} linewidth  is the width of the line
     * @param {*} style      is the style color
     */
    function drawEnclosingRectangle(ctx, coordinate, rotate, angle, centroid, linewidth, style,objectAngle) {

        if (typeof objectAngle != "undefined") {
            angle = objectAngle;
        }
        
        ctx.save();
        ctx.strokeStyle = style;
        ctx.beginPath();
        if (rotate && angle) {
            ctx.translate(centroid.x, centroid.y);
            ctx.rotate(-angle);
            ctx.translate(-centroid.x, -centroid.y);
        }
        ctx.rect(coordinate.lowestX, coordinate.lowestY, coordinate.highestX - coordinate.lowestX, coordinate.highestY - coordinate.lowestY);
        ctx.lineWidth = linewidth;
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws the round rectangle
     * 
     * @param {*} ctx    is the canvas context
     * @param {*} x      is the top left x coordinate
     * @param {*} y      is the top left y coordinate
     * @param {*} width  is the width of the rectangle
     * @param {*} height is the height of the rectangle
     * @param {*} radius is the radius of the rounded corner
     * @param {*} fill   is whether you want to fill or not
     * @param {*} stroke  is the stroke
     */
    function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 2;
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (stroke) {
            ctx.stroke();
        }
        if (fill) {
            ctx.fill();
        }
    }
    //Straight Line

    /**
     * Draw the straight Line
     * 
     * @param {*} ctx          is  the context
     * @param {*} strokeColor  is the color
     * @param {*} startPoint   is the start point
     * @param {*} endPoint     is the end point
     * @param {*} lineWidth    is the linewidth
     * @param {*} dashed       is the dashed line
     */
    function drawStraightLine(ctx, strokeColor, startPoint, endPoint, lineWidth, dashed,stroke) {

        if (typeof stroke == "undefined") {
            stroke = true;
        }

        ctx.beginPath();
        ctx.setLineDash(dashed);
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeColor;
        
        if(stroke){
            ctx.stroke();
        }
    }

    //Points

    /**
     * It draws the point for the rotation
     * 
     * @param {*} ctx   is the context 
     * @param {*} point is the point to draw
     */
    function drawPointForRotation(ctx, point, lineWidth,color) {

        if(typeof color == "undefined"){
            color = "#6BBEEE";
        }
        
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, lineWidth * 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    /**
     * Draw the point 
     */
    function drawPoint(ctx, x, y, radius, width, strokeColor, fillColor) {
        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.lineWidth = width;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.fill();
    }

    /**
     * Hit test for the point
     * 
     * @param {*} point  is the point to check
     * @param {*} center is the center of the circle
     * @param {*} radius is the radius
     */
    function pointHitTest(ctx, point, center, radius) {

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);

        return ctx.isPointInPath(point.x, point.y);
    }

    /**
     * Paint Polygon
     */
    function paintPolygon(ctx, coordinates, fillColor,opacity) {

        ctx.beginPath();
        ctx.moveTo(coordinates[0].x, coordinates[0].y);

        for (let index = 0; index < coordinates.length - 1; index++) {
            ctx.lineTo(coordinates[index].x, coordinates[index].y);
        }

        ctx.closePath();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    // text

    /**
     * Draw the text 
     * 
     * @param {*} ctx    
     * @param {*} object  
     */
    function drawText(ctx,object){
        ctx.save();
        ctx.translate(object.labelX, object.labelY);
        ctx.rotate(object.labelRotation);
        ctx.fillStyle = object.labelColor;
        ctx.textAlign = object.textAlign;
        ctx.font = object.labelSize + "pt "+object.fontType;
        ctx.fillText(object.name, 0, 0);
        ctx.restore();
    }

    /**
     * Draw text with rotation here
     * 
     * @param {*} ctx 
     * @param {*} object 
     */
    function drawTextWithRotation(object){
        let ctx = object.ctx;
        
        ctx.save();
        ctx.translate(object.labelX, object.labelY);
        ctx.rotate(object.labelRotation);
        ctx.translate(-object.labelX, -object.labelY);
        ctx.fillStyle = object.labelColor;
        ctx.textAlign = object.textAlign;
        ctx.font = object.labelSize + "pt " + object.fontType;
        ctx.fillText(object.name, object.labelX, object.labelY);
        ctx.restore();
    }

    return {
        drawRectangle: drawRectangle,
        drawEnclosingRectangle: drawEnclosingRectangle,
        drawRoundRect: drawRoundRect,
        drawStraightLine: drawStraightLine,
        drawPointForRotation: drawPointForRotation,
        drawPoint: drawPoint,
        drawText:drawText,
        drawTextWithRotation:drawTextWithRotation,
        pointHitTest: pointHitTest,
        paintPolygon: paintPolygon
    }

})();