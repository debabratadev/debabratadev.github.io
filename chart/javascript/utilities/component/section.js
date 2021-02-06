/**
 * Operation related to section
 */
var sectionCollection = (function () {

    /**
     * Shows the rectangle
     */
    function showRectangle(object, sectionComponent) {

        for (let index = 0; index < sectionComponent.length; ++index) {
            if (object == sectionComponent[index]) {
                object.rectangleCord = polyModule.findEnclosingRectangleCoordinate(object.coordinate);
                object.rectangle = true;
            }
            else {
                object.rectangle = false;
            }
        }
    }

    /**
     * Get the section object
     */
    function getSectionObject(sectionComponent, sectionId) {
        for (let index = 0; index < sectionComponent.length; ++index) {

            if (sectionId == sectionComponent[index].Sections.id) {
                return sectionComponent[index];
            }
        }
        return null;
    }

    //TODO Split might be a better option here

    /**
     * It delets the section component object
     * TODO -- Remove this not required in future version of the code
     *  
     * @param {*} object            is the selected object.
     * @param {*} sectionComponent  is rhe array of the section object.
     */
    function deleteSectionComponent(section, sectionComponent) {
        let temp = [];
        for (let index = 0; index < sectionComponent.length; ++index) {
            if (section != sectionComponent[index]) {
                temp.push(sectionComponent[index]);
            }
        }
        return temp;
    }

    /**
     * Refine the section component here
     * 
     * @param {*} sectionComponent is the section component array
     */
    function refineComponent(component) {
        let temp = [];
        for (let index = 0; index < component.length; ++index) {
            if (!component[index].creation && polyModule.findPolygonArea(component[index].coordinates)) {
                temp.push(component[index]);
            }
        }
        return temp;
    }

    /**
     * It handle the background
     * 
     * @param {*} section is thee section component 
     * @param {*} display is the boolean value 
     */
    function handleBackground(section, display) {
        for (let index = 0; index < section.length; ++index) {
            section[index].hideBackground = display;
        }
    }

    /**
     * Delete Section along with the child component
     * 
     * @param {*} sectionObject is the current section object
     */
    function deleteSection(sectionObject) {

        let collection = mainModule.getComponent();

        collection['rectangle'] = sharedComponent.deleteChildComponent(collection['rectangle'], sectionObject);
        collection['ellipse'] = sharedComponent.deleteChildComponent(collection['ellipse'], sectionObject);
        collection['polygon'] = sharedComponent.deleteChildComponent(collection['polygon'], sectionObject);
        collection['text'] = sharedComponent.deleteChildComponent(collection['text'], sectionObject);
        collection['media'] = sharedComponent.deleteChildComponent(collection['media'], sectionObject);
        collection['row'] = sharedComponent.deleteChildComponent(collection['row'], sectionObject);

        mainModule.setComponent(collection);
    }

    return {
        showRectangle: showRectangle,
        getSectionObject: getSectionObject,
        deleteSectionComponent: deleteSectionComponent,
        refineComponent: refineComponent,
        handleBackground: handleBackground,
        deleteSection
    }
})();