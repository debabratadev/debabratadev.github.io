var MAINCANVAS, NAVIGATORCANVAS;

function loadImage() {
    var canvas = document.getElementById('main-canvas');
    var navCanvas = document.getElementById('nav-canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var canvasWidth = canvas.width,
        canvasHeight = canvas.height;

    var loadedImage = new Image(),
        pdfFile = 'Eden.jpg',
        dpi = Constants.hundredPercentDpi;

    HamImageContainer.prototype = new TemplateObject();
    DensitometerCrossHair.prototype = new TemplateObject();
    AnnotationCircle.prototype = new TemplateObject();
    // FreeHandAnnotation.prototype = new TemplateObject();
    PanningSurface.prototype = new TemplateObject();
    Ruler.prototype = new TemplateObject();
    RulerVerticalResizer.prototype = new TemplateObject();
    RulerHorizontalResizer.prototype = new TemplateObject();
    ZoomRectangle.prototype = new TemplateObject();

    loadedImage.onload = function () {
        var params = {
            filename: pdfFile,
            pageNo: Constants.pageNumber,
            separationColor: Constants.separationColor,
            dir: null,
            x: 0.0,
            y: 0.0,
            width: canvasWidth,
            height: canvasHeight,
            autoResize: true,
            dpi: Constants.hundredPercentDpi,
            type: 'general'
        };

        var imageWidth = loadedImage.width,
            imageHeight = loadedImage.height,
            xDelta = imageWidth / dpi,
            yDelta = imageHeight / dpi;

        Constants.xDelta = xDelta;
        Constants.yDelta = yDelta;

        var navDpi = 0;

        var widthDpi = canvasWidth / xDelta,
            heightDpi = canvasHeight / yDelta;

        if (widthDpi > heightDpi) {
            if (widthDpi * (imageHeight / Constants.hundredPercentDpi) > canvasHeight) {
                navDpi = heightDpi;
            }
            else {
                navDpi = widthDpi;
            }
        }
        else {
            if (heightDpi * (imageWidth / Constants.hundredPercentDpi) > canvasWidth) {
                navDpi = widthDpi;
            }
            else {
                navDpi = heightDpi;
            }
        }

        params.dpi = navDpi;
        params.autoResize = false;

        var scalingFactor = params.dpi / Constants.hundredPercentDpi;
        params.width = canvas.width / scalingFactor;
        params.height = canvas.height / scalingFactor;

        var successFn = function () {

            //If not instantiated yet
            // if (!NAVIGATORCANVAS) {
            //     var params = {
            //         filename: Constants.pdfFile,
            //         pageNo: Constants.pageNumber,
            //         separationColor: Constants.separationColor,
            //         dir: null,
            //         x: 0.0,
            //         y: 0.0,
            //         width: navCanvas.width,
            //         height: navCanvas.height,
            //         autoResize: true,
            //         dpi: 0,
            //         type: 'general'
            //     };
            //     new CanvasNavigator(navCanvas, params);
            // }
            // else {
            //     NAVIGATORCANVAS.reset();
            //     NAVIGATORCANVAS.refresh();
            // }
        };

        MAINCANVAS = new CanvasHam(canvas, params, 'main-canvas', pdfFile, stageId, successFn);
    }

    loadedImage.src = 'resources/images/Eden.jpg';


}

window.onload = function () {
    loadImage();
    document.getElementById('zoom-btn').addEventListener('click', function () {
        MAINCANVAS.activateZoom();
    });
}
