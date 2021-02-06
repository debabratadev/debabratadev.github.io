/**
 * Math module for point
 */
var pointModule = (function () {

    /**
     * It rotates the point
     * 
     * @param {*} origin 
     * @param {*} angle 
     * @param {*} point 
     */
    function rotatePoint(origin, angle, point) {

        s = Math.sin(angle);
        c = Math.cos(angle);

        //translate point back to the origin.
        point.x -= origin.x;
        point.y -= origin.y;

        //rotate points here
        xnew = point.x * c - point.y * s;
        ynew = point.x * s + point.y * c;

        //translate point back
        point.x = xnew + origin.x;
        point.y = ynew + origin.y;

        return point;
    }

    /**
     * Rotate a point around another point  --> Send angle here
     */
    function rotateAroundAnotherPoint(origin, angle, point) {

        let s = Math.sin(angle);
        let c = Math.cos(angle);

        let xnew = point.x - origin.x;
        let ynew = origin.y - point.y;

        return {
            x: origin.x + xnew * c - ynew * s,
            y: origin.y - (ynew * c + xnew * s)
        }
    }

    /**
     * The two point for the rotational handler
     * 
     * @param {*} coordinate is the cordinate of enclosing rectangle
     * @param {*} linewidth is the linewidth 
     */
    function getRotationHandlerPoint(rectangleCord, linewidth) {

        let leftCordinate = {
            x: rectangleCord.lowestX,
            y: rectangleCord.lowestY
        };

        let rightCordinate = {
            x: rectangleCord.highestX,
            y: rectangleCord.lowestY
        };

        let lineFirstPoint = lineModule.midPoint(leftCordinate, rightCordinate);
        let lineSecondPoint = {
            x: lineFirstPoint.x,
            y: lineFirstPoint.y - linewidth * 30
        };

        return {
            lineFirstPoint: lineFirstPoint,
            lineSecondPoint: lineSecondPoint
        }
    }

    /**
     * Rotate the points in an array
     * 
     * @param {*} array     is the array of points to be rotated
     * @param {*} centroid  is the origin
     * @param {*} angle     is the rotation angle
     * 
     * @return array containing rotated points
     */
    function rotateArrayPoint(array, centroid, angle) {
        for (let index = 0; index < array.length; ++index) {
            array[index] = pointModule.rotateAroundAnotherPoint(centroid,
                angle, array[index]);
        }
        return array;
    }

    return {
        rotatePoint: rotatePoint,
        rotateAroundAnotherPoint: rotateAroundAnotherPoint,
        getRotationHandlerPoint: getRotationHandlerPoint,
        rotateArrayPoint: rotateArrayPoint
    }
})();