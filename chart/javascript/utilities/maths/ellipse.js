/**
 * Math module for ellipse
 */
var ellipseModule = (function () {

    /**
     * Find whether a point lies inside the polygon or not
     */
    function isInsideEllipse(center,point,major,minor) {

        let inside = checkPoint(center, point, major, minor)
        if (inside <= 1) {
            return true;
        }

        return false;
    }

    /**
     * check the point
     */
    function checkPoint(center, point, major, minor) {
        let p = (Math.pow((point.x - center.x), 2) / Math.pow(major, 2))
            + (Math.pow((point.y - center.y), 2) / Math.pow(minor, 2));

        return p;
    }

    /**
     * find the ellipse for the point
     */
    function findEllipseForThePoint(component,point){
        for(let index=0;index<component.length;++index){
            if (component[index].pointLiesInsideTheEllipse(point)) {
                return component[index];
            }
        }
    }

    return {
        isInsideEllipse: isInsideEllipse,
        findEllipseForThePoint:findEllipseForThePoint
    }

})();