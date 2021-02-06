/**
 * Operation related to collection of component
 */
var collection = (function () {

    /**
     * Hide all component rectangle  --TODO can be further optimised
     * 
     * @param {*} section is the section component array
     * @param {*} row     is the row component array
     * @param {*} matrix  is the matrix component array
     */
    function hideSelection() {

        let component = mainModule.getComponent();

        sharedComponent.hideRectangle(component['section']);
        sharedComponent.hideRectangle(component['row']);
        sharedComponent.hideRectangle(component['matrix']);
        sharedComponent.hideRectangle(component['text']);
        sharedComponent.hideRectangle(component['rectangle']);
        sharedComponent.hideRectangle(component['polygon']);
        sharedComponent.hideRectangle(component['ellipse']);
        sharedComponent.hideRectangle(component['media']);
    }

    /**
     * Hide Node
     */
    function hideNode(){
        let component = mainModule.getComponent();
        
        sharedComponent.hideNode(component['polygon']);
        sharedComponent.hideNode(component['section']);
        sharedComponent.hideNode(component['rectangle']);
        sharedComponent.hideNode(component['ellipse']);
    }

    /**
     * Handle all cursor component on hit
     * 
     * @param {*} ctx 
     * @param {*} mouse 
     * @param {*} section 
     * @param {*} row 
     * @param {*} matrix 
     */
    function cursorOnHit(ctx, mouse) {

        let component = mainModule.getComponent();

        sharedComponent.cursorOnHit(ctx,mouse,component['section']);
        sharedComponent.cursorOnHit(ctx,mouse,component['row']);
        sharedComponent.cursorOnHit(ctx,mouse,component['matrix']);
        sharedComponent.cursorOnHit(ctx,mouse,component['text']);
        sharedComponent.cursorOnHit(ctx,mouse,component['polygon']);
        sharedComponent.cursorOnHit(ctx,mouse,component['ellipse']);
        sharedComponent.cursorOnHit(ctx,mouse,component['rectangle']);
        sharedComponent.cursorOnHit(ctx,mouse,component['media']);
    }

    /**
     * Get the component collection here
     */
    function getComponentCollection(background,section,row,matrix,text,rectangle,polygon,ellipse,chart,media){

        let component =[];

        component.push({'background':background});
        
        component.push({'section':refineModule.refineComponentForJSON(section)});
        component.push({'row':refineModule.refineComponentForJSON(row)});
        component.push({'matrix':refineModule.refineComponentForJSON(matrix)});
        component.push({'text':refineModule.refineComponentForJSON(text)});
        component.push({'rectangle':refineModule.refineComponentForJSON(rectangle)});
        component.push({'polygon':refineModule.refineComponentForJSON(polygon)});
        component.push({'ellipse':refineModule.refineComponentForJSON(ellipse)});
        component.push({'chart':chart});

        let catg = listModule.getCategory();
        component.push({'category':catg});
        
        // component.push({'media':refineModule.refineComponentForJSON(media)});

        return component;
    }

    return {
        hideSelection:hideSelection,
        hideNode:hideNode,
        cursorOnHit:cursorOnHit,
        getComponentCollection:getComponentCollection
    }

})();