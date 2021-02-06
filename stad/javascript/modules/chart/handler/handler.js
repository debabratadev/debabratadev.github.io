/**
 *   Event handler for function
 */

window.onload = function () {

    document.getElementById('body').onload = mainModule.initialise();

    //Tool - handler
    document.getElementById('close-btn').addEventListener('click', toolModule.closeChart);
    document.getElementById('section-btn').addEventListener('click', toolModule.selectSection);
    document.getElementById('seat-btn').addEventListener('click', toolModule.selectRow);
    document.getElementById('choose-btn').addEventListener('click', toolModule.select);
    document.getElementById('select-seat-btn').addEventListener('click', toolModule.selectSeat);
    document.getElementById('node-btn').addEventListener('click', toolModule.selectNode);

    document.getElementById('matrix-btn').addEventListener('click', toolModule.selectMatrix);
    document.getElementById('delete-btn').addEventListener('click', toolModule.deleteSelection);
    document.getElementById('rect-shape-btn').addEventListener('click',toolModule.selectRectShape);
    document.getElementById('ellipse-shape-btn').addEventListener('click',toolModule.selectEllipseShape);
    document.getElementById('poly-shape-btn').addEventListener('click',toolModule.selectPolyShape);

    document.getElementById('save-json').addEventListener('click', mainModule.saveAsJson);

    // document.getElementById('snap-bg').addEventListener('click', mainModule.snapToGrid);
    // document.getElementById('range').addEventListener('click', mainModule.rangeSlider);

    //zoom handler 
    document.getElementById('zoom-in').addEventListener('click', mainModule.zoomIn);
    document.getElementById('zoom-out').addEventListener('click', mainModule.zoomOut);
    // document.getElementById('fit-screen').addEventListener('click', mainModule.realZoom);

    document.getElementById('bg-icon').addEventListener('click', mainModule.toggleBackground);
    document.getElementById('hide-bg-icon').addEventListener('click', mainModule.toggleBackground);

    // document.getElementById('url-btn').addEventListener('click', mainModule.uploadImage);
    document.getElementById('export-svg').addEventListener('click', mainModule.exportAsSvg);

    // document.getElementById('seat-color').addEventListener('change', seatInspector.setSeatColor);

    navigationHandler.addListener();

    rowHandler.addListener();

    matrixHandler.addListener();

    sectionHandler.addListener();

    chartHandler.addListener();

    textHandler.addListener();

    rectangleHandler.addListener();

    ellipseHandler.addListener();

    polygonHandler.addListener();

    configHandler.addListener();

    //drag and drop listener
    var cols = document.querySelectorAll('#columns .column');
    [].forEach.call(cols, dNDHandler.addEventListener);

    //seat handler

    //TODO - handle in a form of an array

    categoryHandler.addListener();

    //multi inspector
    imageHandler.addListener();

    //handle modal here
    var trigger = document.getElementById('inspector-image');
    var closeButton = document.querySelector(".close-button");
    trigger.addEventListener("click", modalModule.toggleModal);
    closeButton.addEventListener("click", modalModule.toggleModal);
    window.addEventListener("click", modalModule.windowOnClick);

    document.getElementById('image-search').addEventListener('keyup',modalModule.filterImageOnName);
    document.getElementById('upload-media-file').addEventListener('change',modalModule.uploadMedia);
};