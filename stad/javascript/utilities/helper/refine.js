/**
 * Refining/filtering component data
 */
var refineModule = (function () {

    /**
     * 
     * @param {*} component 
     * 
     * @returns refined component 
     */
    function refineComponentForJSON(component) {
        let collection = [];
        for (let index = 0; index < component.length; ++index) {

            let object = component[index];

            let json = {};

            for (let prop in object) {
                if (typeof (object[prop]) == 'function') {
                    continue;
                }
                json[prop] = object[prop];
            }
            collection.push(json);
        }

        return collection;
    }

    /**
     * Refining row component
     * 
     * @param {*} seatRowComponent 
     */
    function refineRowComponent(seatRowComponent){
        let temp = [];
        for(let index=0;index<seatRowComponent.length;++index){
            const row = seatRowComponent[index];
            if( !row || row.creation){
                continue;
            }
            temp.push(row);
        }
        return temp;
    }

    /**
     * Refine the section component here
     * 
     * @param {*} sectionComponent is the section component array
     */
    function refinePolygonComponent(component) {
        let temp = [];
        for (let index = 0; index < component.length; ++index) {
            if (!component[index].creation && polyModule.findPolygonArea(component[index].coordinates)) {
                temp.push(component[index]);
            }
        }
        return temp;
    }

    return {
        refineComponentForJSON:refineComponentForJSON,
        refineRowComponent:refineRowComponent,
        refinePolygonComponent:refinePolygonComponent
    }
}
)();