var matrixConfigInspector = (function () {

    let inputNumber = ['matrix-seat-config-space', 'matrix-seat-config-radius','matrix-row-config-space'];

    /**
     * Display matrix configuration value  
     */
    function displayMatrixConfig(){
        let configuration = mainModule.getComponentConfig();
        document.getElementById('matrix-seat-config-space').value = parseInt(configuration['seat-spacing']) + ' pt';
        document.getElementById('matrix-seat-config-radius').value = parseInt(configuration['seat-radius']) + ' pt';
        document.getElementById('matrix-row-config-space').value = parseInt(configuration['row-spacing']) + ' pt';
        helperModule.cursorResizeType(inputNumber);
    }

    /** 
     * Set  seat radius for matrixs
     * 
     * @param {*} value 
     */
    function setSeatRadiusConfig(){
        let value = document.getElementById('matrix-seat-config-radius').value;
        value = parseInt(value.replace(/\D/g, ''));
        mainModule.setComponentConfig('seat-radius',value,'matrix');
    }

    /**
     * Set seat spacing for matrixs
     * 
     * @param {*} value 
     */
    function setSeatSpaceConfig(){
        let value = document.getElementById('matrix-seat-config-space').value;
        value = parseInt(value.replace(/\D/g, ''));
        mainModule.setComponentConfig('seat-spacing',value,'matrix');
    }

    /**
     * Set row spacing for matrices
     * 
     * @param {*} value 
     */
    function setRowSpaceConfig(){
        let value = document.getElementById('matrix-row-config-space').value;
        value = parseInt(value.replace(/\D/g, ''));
        mainModule.setComponentConfig('row-spacing',value,'matrix');
    }

    return {
        displayMatrixConfig:displayMatrixConfig,
        setSeatRadiusConfig:setSeatRadiusConfig,
        setSeatSpaceConfig:setSeatSpaceConfig,
        setRowSpaceConfig:setRowSpaceConfig,
    }

})();