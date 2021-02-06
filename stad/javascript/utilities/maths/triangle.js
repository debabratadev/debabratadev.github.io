/**
 * Math module for triangle
 * TODO - remove it 
 */
var triangleModule = (function () {

    /**
     * Find the distance of a perpendicular distance from a triangle.
     * 
     * @param {*} hypotenuse 
     * @param {*} base 
     */
    function perpendicularOfATriangle(hypotenuse, base) {

        return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(base, 2));
    }

    return {
        perpendicularOfATriangle: perpendicularOfATriangle
    }
})();