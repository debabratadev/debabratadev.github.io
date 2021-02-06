/**
 * Handles refining of json
 * Loads json to update chart component
 */
let loadJsonModule = (function () {

    const token = window.localStorage.getItem('token');

    /**
     * Have the json fetch request 
     * 
     * @param {*} chartId  is the chart id 
     */
    function jsonFetchRequest(chartId) {

        let url = urlModule.header + urlModule.chartBaseURL+chartId;

        const getMethod = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + token
            },
        }

        fetch(url, getMethod)
            .then(response => response.json())
            .then(data => handleJsonData(data))
            .catch(err => jsonFetchRequest(chartId))
    }

    /**
     * Handle the json data from here.
     */
    function handleJsonData(data) {

        if(!data.data){
            return;
        }
        
        let object = data.data.chart_data;
        object = JSON.parse(object);

        let components = addComponents(object);
        mainModule.updateChartFromJson(components);
    }

    /**
     * Add the components
     * 
     * @param {*} object is the JSON object
     */
    function addComponents(object) {
        let components = [];

        //TODO error handling for other component in list to
        components.push(loadBackgroundFromJSON(object[0]['background']));
        components.push(loadSectionFromJSON(object[1]['section']));
        components.push(loadRowFromJSON(object[2]['row']));
        components.push(loadMatrixFromJSON(object[3]['matrix']));
        components.push(loadTextFromJSON(object[4]['text']));
        components.push(loadRectangleFromJSON(object[5]['rectangle']));
        components.push(loadPolygonFromJSON(object[6]['polygon']));
        components.push(loadEllipseFromJSON(object[7]['ellipse']));
        components.push(loadChartObjectFromJSON(object[8]['chart']));
        components.push(loadCategoryFromJSON(object[9]['category']));

        if(object[10]){
            components.push(loadMediaFromJSON(object[10]['media']));
        }

        return components;
    }

    /**
     * Update the background from JSON
     * TODO - access of gkhead can be done there
     * 
     * @param {*} data 
     */
    function loadBackgroundFromJSON(data) {
        let src = data.img;
        mainModule.gkhead.src = src;
        bgHelper.setChartReference(src);

        return {
            'background': src
        }
    }

    /**
     * Update Section From JSON here
     */
    function loadSectionFromJSON(data) {

        let sectionComponent = [];

        for (let index = 0; index < data.length; ++index) {
            const section = new Section();
            Object.assign(section, data[index]);
            section.rectangle = false;
            sectionComponent.push(section);
        }

        return {
            'section': sectionComponent
        }
    }

    /**
     * update Row from JSON here
     * 
     * @param {*} data 
     */
    function loadRowFromJSON(data) {

        let seatRowComponent = [];

        for (let index = 0; index < data.length; ++index) {
            const row = new Row();
            Object.assign(row, data[index]);

            let seatCount = row.seatComponent.length;

            if(seatCount == 0){
                continue;
            }
            row.seatComponent = loadSeatFromJSON(row,seatCount);
            row.firstSeat = row.seatComponent[0].coordinates[0];
            seatCount = row.seatComponent.length;

            row.lastSeat= row.seatComponent[seatCount-1].coordinates[0];

            for(let index=0;index<seatCount;++index){
                row.seatOriginalCordinate.push(row.seatComponent[index].coordinates[0]);
            }

            row.update = false;
            row.rectangle = false;

            seatRowComponent.push(row);
        }

        return {
            'row': seatRowComponent
        }
    }


    /**
     * Generic function to load seat from JSON
     * 
     * @param {*} object 
     */
    function loadSeatFromJSON(object,seatCount){

        let component = [];

        for (let index = 0; index < seatCount; ++index) {
            const seat = new Seat();
            Object.assign(seat, object.seatComponent[index]);
       
            if(seat.coordinates[0] == null){   //TODO -- refining the seat when it is not loaded
                continue;
            }
            component.push(seat);
            seat.parent = object;
            seat.parent.seatLabel = false;
        }
        
        return component;
    }

    /**
     * update Matrix from here
     * 
     * @param {*} data 
     */
    function loadMatrixFromJSON(data) {

        let matrixRowComponent = [];

        for (let index = 0; index < data.length; ++index) {
            const matrix = new Matrix();
            Object.assign(matrix, data[index]);
            matrix.rectangle = false;
            matrix.enableSelection = false;

            matrixRowComponent.push(matrix);
        }

        return {
            'matrix': matrixRowComponent
        }
    }

    /**
     * update Text from JSON here
     * 
     * @param {*} data 
     */
    function loadTextFromJSON(data) {

        let textComponent = [];

        for (let index = 0; index < data.length; ++index) {
            const text = new Text();
            Object.assign(text, data[index]);
            text.rectangle = false;
            // text.coordinate = text.firstPoint;
            textComponent.push(text);
        }

        return {
            'text': textComponent
        }
    }

    /**
     * update Rectangle from JSON here
     * 
     * @param {*} data 
     */
    function loadRectangleFromJSON(data) {

        let rectShapeComponent = [];

        for (let index = 0; index < data.length; ++index) {
            const rect = new Rectangle();
            Object.assign(rect, data[index]);
            rect.startPoint = rect.coordinates[0];
            rect.rectangle = false;

            rectShapeComponent.push(rect);
        }

        return {
            'rectangle': rectShapeComponent
        }
    }

    /**
     * upadte Polygon from JSON here
     * 
     * @param {*} data 
     */
    function loadPolygonFromJSON(data) {

        let polyShapeComponent = [];

        for (let index = 0; index < data.length; ++index) {
            const poly = new Polygon();
            Object.assign(poly, data[index]);
            poly.rectangle = false;

            polyShapeComponent.push(poly);
        }

        return {
            'polygon': polyShapeComponent
        }
    }

    /**
     * update ellipse from JSON here
     * 
     * @param {*} data 
     */
    function loadEllipseFromJSON(data) {

        let ellipseShapeComponent = [];

        for (let index = 0; index < data.length; ++index) {
            const ellipse = new Ellipse();
            Object.assign(ellipse, data[index]);
            ellipse.rectangle = false;
            
            ellipseShapeComponent.push(ellipse);
        }

        return {
            'ellipse': ellipseShapeComponent
        }
    }

    /**
     * Load the chart object from the json here
     * 
     * @param {*} data is the chart data
     */
    function loadChartObjectFromJSON(data){

        const chart = new Chart();
        Object.assign(chart,data);
        return {
            'chart':chart
        }
    }

    /**
     * Load category from json here
     * 
     * @param {*} data is the category data
     */
    function loadCategoryFromJSON(data){
        return {
            'category':data
        }
    }

    /**
     * Load Media from json
     * 
     * @param {*} data 
     */
    function loadMediaFromJSON(data){

        let mediaComponent =[];
        for(let index=0;index<data.length;++index){            
            let image = new Image;
            image.src = data[index].src;

            // if(!image.src){
            //     continue;
            // }
            const media = new Media(image);
            Object.assign(media,data[index]);
            media.image = image;
            mediaComponent.push(media);
        }

        return {
            'media':mediaComponent
        }
    }

    return {
        jsonFetchRequest: jsonFetchRequest
    }

})();