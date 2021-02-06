/**
 * Math module for line
 */
var lineModule = (function () {

    /**
     * Find the cordinates of a point, at a r distance from a given point
     * 
     * @param {*} startPoint is the starting point.
     * @param {*} endPoint   is the end point.
     * @param {*} radius     is the distance r from the given point.
     */
    function cordOfPointAlongACertainDistanceFromLine(startPoint, endPoint, radius) {
        let distance = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));

        let ratio = radius / distance;
        return {
            x: (((1 - ratio) * startPoint.x) + (ratio * endPoint.x)),
            y: (((1 - ratio) * startPoint.y) + (ratio * endPoint.y))
        }
    }

    /**
     * Find the length of a line
     * 
     * @param {*} startPoint is the starting coordinates of a line
     * @param {*} endPoint   is the end coordiantes of a line
     */
    function lengthOfALine(startPoint, endPoint) {

        return Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));
    }

    /**
     * It returns the cordinates of the midpoint of the given two points
     */
    function midPoint(startPoint, endPoint) {
        return {
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2
        }
    }

    /**
     * Finds the slope of the line
     * @param {*} startPoint is the start point of the line
     * @param {*} endPoint   is the end point of the line
     */
    function slopeOfALine(startPoint, endPoint) {

        return ((endPoint.y - startPoint.y) / (endPoint.x - startPoint.x));
    }

    /**
     * find whether the point lies inside the line or not.
     */
    function pointLiesInLine(coordinates, point, firstPoint, lastPoint) {
        // if(object = polyModule.isInsidePolygon(coordinates,coordinates.length,point){
        //     //Check whether lies in the line or not.

        // }
    }

    /**
     * Find the line position nearest to the line
     * 
     * @param {*} line is the straight line
     * @param {*} x    is the x cordinate of a line
     * @param {*} y    is the y cordinate of a line
     */
    function linePointNearestMouse(line, x, y) {
        
        nearestPoint = function (a, b, x) { return (a + x * (b - a)); };
        let dx = line.x1 - line.x0;
        let dy = line.y1 - line.y0;
        let t = ((x - line.x0) * dx + (y - line.y0) * dy) / (dx * dx + dy * dy);
        let lineX = nearestPoint(line.x0, line.x1, t);
        let lineY = nearestPoint(line.y0, line.y1, t);
        return ({ x: lineX, y: lineY });
    }

    return {
        cordOfPointAlongACertainDistanceFromLine: cordOfPointAlongACertainDistanceFromLine,
        lengthOfALine: lengthOfALine,
        midPoint: midPoint,
        slopeOfALine: slopeOfALine,
        pointLiesInLine: pointLiesInLine,
        linePointNearestMouse: linePointNearestMouse
    }
})();