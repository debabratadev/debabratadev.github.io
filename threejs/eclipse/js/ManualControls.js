THREE.ManualControls = function (object, domElement) {
    this.domElement = domElement;
    this.dragStart = false;
    this.dragging = false;
    this.startX = 0;
    this.startY = 0;
    this.panSpeed = 0.0003;

    this.restrictCameraMove = function (object, cameraX, cameraY) {
        const max = (18 - object.position.z) / 32;

        if (object.position.x >= 0) {

            if (cameraX > max) {
                object.position.x = max;
            } else {
                object.position.x = cameraX;
            }
        } else {
            if (cameraX < -max) {
                object.position.x = -max;
            } else {
                object.position.x = cameraX;
            }
        }

        if (object.position.y >= 0) {
            if (cameraY > max) {
                object.position.y = max;
            } else {
                object.position.y = cameraY;
            }
        } else {
            if (cameraY < -max) {
                object.position.y = -max;
            } else {
                object.position.y = cameraY;
            }
        }
    }

    this.getContainerDimensions = function () {

        if (this.domElement != document) {

            return {
                size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
                offset: [this.domElement.offsetLeft, this.domElement.offsetTop]
            };

        } else {

            return {
                size: [window.innerWidth, window.innerHeight],
                offset: [0, 0]
            };

        }

    };

    var container = this.getContainerDimensions();

    this.mousedown = function (event) {

        if (this.domElement !== document) {

            this.domElement.focus();

        }

        event.preventDefault();
        event.stopPropagation();

        this.dragStart = true;
        this.startX = event.pageX - container.offset[0];
        this.startY = event.pageY - container.offset[1];
    };

    this.mousemove = function (event) {

        if (this.dragStart) {

            const hor = (this.startX - (event.pageX - container.offset[0])) * this.panSpeed;
            const vert = (this.startY - (event.pageY - container.offset[1])) * this.panSpeed;

            const cameraX = object.position.x + hor;
            const cameraY = object.position.y - vert;

            this.restrictCameraMove(object, cameraX, cameraY);
            this.startX = (event.pageX - container.offset[0]);
            this.startY = (event.pageY - container.offset[1]);

            this.dragging = true;
        }

    };

    this.mouseup = function (event) {

        this.dragStart = false;
        this.dragging = false;

        event.preventDefault();
        event.stopPropagation();
        this.dispatchEvent({ type: 'end' });
    };

    this.keydown = function (e) {
        e.preventDefault();
        e.stopPropagation();
        const keySpeed = 0.0002;
        switch (e.which || e.keyCode) {
            case 39: // right arrow key
                cameraX = EC.camera.position.x + keySpeed;
                cameraY = EC.camera.position.y;
                this.restrictCameraMove(object, cameraX, cameraY);
                break;
            case 37: // left arrow key
                cameraX = EC.camera.position.x - keySpeed;
                cameraY = EC.camera.position.y;
                this.restrictCameraMove(object, cameraX, cameraY);
                break;
            case 38: // Top arrow key
                cameraX = EC.camera.position.x;
                cameraY = EC.camera.position.y + keySpeed;
                this.restrictCameraMove(object, cameraX, cameraY);
                break;
            case 40: // Bottom arrow key
                cameraX = EC.camera.position.x;
                cameraY = EC.camera.position.y - keySpeed;
                this.restrictCameraMove(object, cameraX, cameraY);
                break;
        }

        this.dispatchEvent({ type: 'end' });
    }

    function bind(scope, fn) {

        return function () {

            fn.apply(scope, arguments);

        };

    }

    var _mousemove = bind(this, this.mousemove);
    var _mousedown = bind(this, this.mousedown);
    var _mouseup = bind(this, this.mouseup);
    var _keydown = bind(this, this.keydown);

    this.domElement.addEventListener('mousemove', _mousemove, false);
    this.domElement.addEventListener('mousedown', _mousedown, false);
    this.domElement.addEventListener('mouseup', _mouseup, false);
    document.body.addEventListener('keydown', _keydown, false);
}

THREE.ManualControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.ManualControls.prototype.constructor = THREE.ManualControls;