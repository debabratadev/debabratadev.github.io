/**
 * Math module for polygon
 */
var polyModule = (function () {

   /**
   * The handler function to check whether we have hit the polygon or not.
   * 
   * @param {array} polygon is the coordinates of the polygon 
   * @param {number}  n     is the number of the vertices of the polygon
   * @param {*} p           is the point to be checked
   */
    function isInsidePolygon(polygon, n, p) {

        if (n < 3) return false; //if <3 then it can't be a polynomial

        let extreme = { x: 5000, y: p.y };
        let count = 0,
            i = 0;

        do {
            let next = (i + 1) % n;

            // Check if the line segment from 'p' to 'extreme' intersects 
            // with the line segment from 'polygon[i]' to 'polygon[next]' 

            if (doIntersect(polygon[i], polygon[next], p, extreme)) {

                // If the point 'p' is colinear with line segment 'i-next', 
                // then check if it lies on segment. If it lies, return true, 
                // otherwise false 

                if (orientation(polygon[i], p, polygon[next]) == 0)
                    return onSegment(polygon[i], p, polygon[next]);

                count++;
            }
            i = next;
        } while (i != 0);
        return count & 1;
    }


    // The function that returns true if line segment 'p1q1' 
    // and 'p2q2' intersect. 
    function doIntersect(p1, q1, p2, q2) {
        // Find the four orientations needed for general and 
        // special cases 

        let o1 = orientation(p1, q1, p2);
        let o2 = orientation(p1, q1, q2);
        let o3 = orientation(p2, q2, p1);
        let o4 = orientation(p2, q2, q1);
        // General case 
        if (o1 != o2 && o3 != o4)
            return true;

        // Special Cases 
        // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
        if (o1 == 0 && onSegment(p1, p2, q1)) return true;

        // p1, q1 and p2 are colinear and q2 lies on segment p1q1 
        if (o2 == 0 && onSegment(p1, q2, q1)) return true;

        // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
        if (o3 == 0 && onSegment(p2, p1, q2)) return true;

        // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
        if (o4 == 0 && onSegment(p2, q1, q2)) return true;

        return false; // Doesn't fall in any of the above cases 
    }

    // To find orientation of ordered triplet (p, q, r). 
    // The function returns following values 
    // 0 --> p, q and r are colinear 
    // 1 --> Clockwise 
    // 2 --> Counterclockwise 
    function orientation(p, q, r) {

        let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);

        if (val == 0) return 0; // colinear 
        return (val > 0) ? 1 : 2; // clock or counterclock wise 
    }

    // Given three colinear points p, q, r, the function checks if 
    // point q lies on line segment 'pr' 
    function onSegment(p, q, r) {
        if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
            return true;
        return false;
    }

    /**
     * find the centroid of a polygon.
     * 
     * @param  coordinates is the cordinates of the polygon here.
     */
    function centroidOfAPolygon(coordinates) {
        let sumX = 0;
        let sumY = 0;
        for (let index = 0; index < coordinates.length; index++) {
            sumX += coordinates[index].x;
            sumY += coordinates[index].y;
        }
        sumX /= coordinates.length;
        sumY /= coordinates.length;

        return {
            x: sumX,
            y: sumY
        }
    }

    /**
     * It find which polygon this a paraticular point belongs to you.
     */
    function findPolygonForThePoint(component, point) {
        for (let index = 0; index < component.length; ++index) {

            if (component[index].pointLiesInsideThePolygon(point)) {

                return component[index];
            }
        }
        return null;
    }

    /**
     * Search the enclosing rectangle coordinates here
     */
    function findEnclosingRectangleCoordinate(coordinates) {
        // let coordinates = object.coordinates;
        let lowestX, lowestY, highestX, highestY;
        lowestX = lowestY = 1000000;
        highestX = highestY = -1000000;
        for (let index = 0; index < coordinates.length; ++index) {
            lowestX = lowestX > coordinates[index].x ? coordinates[index].x : lowestX;
            lowestY = lowestY > coordinates[index].y ? coordinates[index].y : lowestY;
            highestX = highestX < coordinates[index].x ? coordinates[index].x : highestX;
            highestY = highestY < coordinates[index].y ? coordinates[index].y : highestY;
        }

        return {
            lowestX: lowestX,
            lowestY: lowestY,
            highestY: highestY,
            highestX: highestX
        }
    }

    /**
     * Find all possible coordinates of a rectangle here.
     * 
     */
    function findAllCoordinatesOfARectangle(cordinates) {

        let newCordinates = [];

        newCordinates.push({ x: cordinates.lowestX, y: cordinates.lowestY });
        newCordinates.push({ x: cordinates.lowestX, y: cordinates.highestY });
        newCordinates.push({ x: cordinates.highestX, y: cordinates.highestY });
        newCordinates.push({ x: cordinates.highestX, y: cordinates.lowestY });

        return newCordinates;
    }

    /**
     * check whether the point has hit the rectangle or not.
     */
    function hitTestForRectangle(point, rectPoint,width,height) {
        return point.x > rectPoint.x && point.x < rectPoint.x + width && point.y > rectPoint.y && point.y < rectPoint.y + height;
    }

    /**
     * Find the area of the polygon area
     * 
     * @param {*} coordinates should be in the ordered format 
     * 
     * @return area of the polygon 
     */
    function findPolygonArea(coordinates){
        let length = coordinates.length;

        let j=length-1;
        let area = 0;
        for(let index=0;index<length;++index){ 
            area +=(coordinates[j].x + coordinates[index].x) * (coordinates[j].y - coordinates[index].y);
            j=index;
        }

        return Math.abs(area/2);
    }

    return {
        isInsidePolygon: isInsidePolygon,
        centroidOfAPolygon: centroidOfAPolygon,
        findPolygonForThePoint: findPolygonForThePoint,
        findEnclosingRectangleCoordinate: findEnclosingRectangleCoordinate,
        findAllCoordinatesOfARectangle: findAllCoordinatesOfARectangle,
        hitTestForRectangle: hitTestForRectangle,
        findPolygonArea:findPolygonArea,
    }
})();