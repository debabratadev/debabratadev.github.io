/**
 * Handles category operation 
 */
var categoryOperation = (function () {

    /**
     * Delte the category
     */
    function deleteCategory(name,color){
        let component = mainModule.getComponent();
        let sectionComponent = component['section'];
        let seatComponent = sharedComponent.updateSeatComponent(component['row'], component['matrix']);
        deleteCategoryOperation(seatComponent,name,color);
        deleteCategoryOperation(sectionComponent,name,color);
        mainModule.updateChart();
    }

    /**
     * Handles delete category operation
     */
    function deleteCategoryOperation(component,name,color){
        for(let index = 0;index<component.length;++index){
            let object = component[index];
            let catg = object.getCategory();
            
            if(!catg[0].name){
                continue;
            }
            if(catg[0].name.toLowerCase() == name.toLowerCase() && catg[0].color.toLowerCase() == color.toLowerCase()){
                object.setCategory(null,'#FFFFFF');
            }
        }
    }

    /**
     * Update category operation
     */
    function updateCategory(name,color,newCatg,newColor){
        let component = mainModule.getComponent();
        let sectionComponent = component['section'];
        let seatComponent = sharedComponent.updateSeatComponent(component['row'], component['matrix']);
        updateCategoryOperation(seatComponent,name,color,newCatg,newColor);
        updateCategoryOperation(sectionComponent,name,color,newCatg,newColor);
        mainModule.updateChart();
    }

    /**
     * Update categoeyz
     */
    function updateCategoryOperation(component,name,color,newCatg,newColor){
        for(let index = 0;index<component.length;++index){
            let object = component[index];
            let catg = object.getCategory();
            if(!catg[0].name || !catg[0].color){
                continue;
            }
            if(catg[0].name.toLowerCase() == name.toLowerCase() && catg[0].color.toLowerCase() == color.toLowerCase()){
                object.setCategory(newCatg,newColor);
            }
        }
    }

    return {
        deleteCategory:deleteCategory,
        updateCategory:updateCategory
    }


})();