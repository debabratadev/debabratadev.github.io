var rowConfigInspector = (function () {

    let inputNumber = ['row-seat-config-space', 'row-seat-config-radius'];

    /**
     * Display Row configuration value  
     */
    function displayRowConfig(){
        let configuration = mainModule.getComponentConfig();
        document.getElementById('row-seat-config-space').value = parseInt(configuration['seat-spacing'] * configuration['current-factor']) + ' pt';
        document.getElementById('row-seat-config-radius').value = parseInt(configuration['seat-radius'] * configuration['current-factor']) + ' pt';
        helperModule.cursorResizeType(inputNumber);
    }

    /**
     * Set  seat radius for rows
     * 
     * @param {*} value 
     */
    function setSeatRadiusConfig(){
        
        let value = document.getElementById('row-seat-config-radius').value;
        value = parseInt(value.replace(/\D/g, ''));
        mainModule.setComponentConfig('seat-radius',value,'row');
    }

    /**
     * Set seat spacing for rows
     * 
     * @param {*} value 
     */
    function setSeatSpaceConfig(){
        let value = document.getElementById('row-seat-config-space').value;
        value = parseInt(value.replace(/\D/g, ''));
        mainModule.setComponentConfig('seat-spacing',value,'row');
    }

    return {
        displayRowConfig:displayRowConfig,
        setSeatRadiusConfig:setSeatRadiusConfig,
        setSeatSpaceConfig:setSeatSpaceConfig,
    }

})();
