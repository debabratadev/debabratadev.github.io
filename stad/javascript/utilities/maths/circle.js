/**
 * Math module for circle
 */
var circleModule = (function () {

    /**
     * Find whether the point lies inside the polygon or not.
     *  
     * @param {*} radiCord 
     * @param {*} radius 
     * @param {*} point 
     */
    function isPointInsideTheCircle(radiCord, radius, point) {
        if ((point.x - radiCord.x) * (point.x - radiCord.x) + (point.y - radiCord.y) * (point.y - radiCord.y) <= radius * radius) {
            return true;
        }
        return false;
    }

    /**
     * converts the degree to the radian/
     * 
     */
    function convertDegreeToRadian(degree){

        return degree *(Math.PI/180);
    }

    return{
        isPointInsideTheCircle: isPointInsideTheCircle,
        convertDegreeToRadian: convertDegreeToRadian
    }
})();