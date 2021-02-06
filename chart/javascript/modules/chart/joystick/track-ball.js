/**
 * Inner circle movement for joystick
 */
var trackBall = (function () {

    let canvas = document.getElementById('canvas');
    let outerRadius;
    let interval = 1;
    let innerCentroid = divCalci.getCenterCord('circle');
    let outerCentroid = innerCentroid;
    let pos3 = pos4 = 0;

    let rectCord;

    /**
     * It drags the element.
     */
    function dragElement(element) {

        element.onmousedown = dragMouseDown;

        let circle = document.getElementById('circle');
        rectCord = circle.getBoundingClientRect();
        outerRadius = rectCord.width / 2;     
        
        backToOriginalPosition();

        /**
         * It drags the mouse down
         */
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            element.style.cursor = "grabbing";

            pos3 = e.clientX;
            pos4 = e.clientY;

            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
        }

        /**
         * When dragging the element
         */
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            pos3 = e.clientX;
            pos4 = e.clientY;

            draggingCondition(e, element);

            // clearInterval(interval);
        
            prevCursor = canvas.style.cursor;
            canvas.style.cursor = "grabbing";
        }

        /**
         * It closes the drag Element
         */
        function closeDragElement(e) {

            element.style.top = (0) + "px";
            element.style.left = (0) + "px";

            element.style.cursor = "grab";

            clearInterval(interval);

            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
        }
    }

    /**
     * Checks the draggingg condition.
     */
    function draggingCondition(e, element) {

        let distance = lineModule.lengthOfALine(innerCentroid, { x: e.clientX, y: e.clientY });
        let mousePoint = {
            x: e.clientX,
            y: e.clientY
        }
        let point;
        if (distance <= outerRadius) {
            point = lineModule.cordOfPointAlongACertainDistanceFromLine(innerCentroid, mousePoint, distance);
        }
        else {
            point = lineModule.cordOfPointAlongACertainDistanceFromLine(innerCentroid, mousePoint, outerRadius);
        }

        element.style.top = (point.y - rectCord.y - outerRadius) + "px";
        element.style.left = (point.x - rectCord.x - outerRadius) + "px";

        clearInterval(interval);

        interval = setInterval(function () {
            navModule.navMove(point,outerCentroid);
        }, 1/100);
    }

    /**
     * Back to original position
     */
    function backToOriginalPosition() {
        document.getElementById('small-circle').addEventListener('dblclick', navModule.navOriginal);
    }

    return {
        dragElement: dragElement,
        backToOriginalPosition: backToOriginalPosition
    }
})();