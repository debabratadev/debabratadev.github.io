// Main code
"use strict";
// globals: document, window, THREE, setInterval, clearInterval, setTimeout

var EC = window.EC || {};

EC.sizeMoon = 0.1 / 2;
EC.var = {
    a: (2 * 17) / (300 * 300),
    z: 15.05,
    t: 0,
    xp: 0,
    yp: 0
}
const clock = new THREE.Clock();

EC.loop = function () {
    // Main rendering loop
    EC.renderer.render(EC.scene, EC.camera);
    window.requestAnimationFrame(EC.loop);
};

EC.drawConeShadow = function () {
    const geometry = new THREE.ConeGeometry(0.3, 13, 50);
    const material = new THREE.MeshBasicMaterial({ color: '#5b5959', transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const cone = new THREE.Mesh(geometry, material);

    cone.position.z = 8.5;
    cone.rotation.x = Math.PI / 2;

    EC.scene.add(cone);
}

EC.drawDisk = function (size, zPosition, height) {
    // const geometry = new THREE.CylinderGeometry(size, size, height, 40);
    const geometry = new THREE.CircleGeometry(size, 10000);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const disk = new THREE.Mesh(geometry, material);

    disk.position.x = 0;
    disk.position.y = 0;
    disk.position.z = zPosition;

    EC.scene.add(disk);
}

EC.moveCamera = function (zoomValue) {
    const partDistance = 1 / 320;
    const distance = partDistance * (19 + zoomValue);
    const zPos = 0.5 * EC.var.a * zoomValue * zoomValue;

    const z = EC.var.z - distance;

    EC.var.t = distance;

    EC.camera.position.z = 18 - 16 * EC.var.t;
    EC.camera.position.x = EC.var.xp * EC.var.t;
    EC.camera.position.y = EC.var.yp * EC.var.t;

    EC.showXYZ();
}

EC.onControlChange = function () {
    EC.var.t = (-1 / 16) * EC.camera.position.z + 9 / 8;
    if (EC.var.t != 0) {
        EC.var.xp = EC.camera.position.x / EC.var.t;
        EC.var.yp = EC.camera.position.y / EC.var.t;
    }
    EC.showXYZ();

}

EC.resetPosition = function () {
    // EC.controls.reset();
    EC.camera.position.x = 0;
    EC.camera.position.y = 0;
    EC.camera.position.z = EC.var.z;
    EC.e.zoom_slider_in.value = 0;
    EC.showXYZ();
}

EC.showXYZ = function () {
    const k = 500;

    document.getElementById('xaxis').innerHTML = (EC.camera.position.x * k).toFixed(2);
    document.getElementById('yaxis').innerHTML = (EC.camera.position.y * k).toFixed(2);
    document.getElementById('zaxis').innerHTML = (EC.camera.position.z).toFixed(2);
}

EC.addDisks = function () {
    const diskDistance = 0.1;
    let diskHeight = 0.06;
    // const dishtHeights = [0.06, 0.055, 0.05, 0.045, 0.04, 0.035, 0.03, 0.023, 0.021, 0.019, 0.017, 0.015];
    // const dishDistances = [2.4, 2.52, 2.63, 2.73, 2.81, 2.89, 2.96, 3.02, 3.07, 3.12, 3.165, 3.21];
    // const dishSizes = [0.23, 0.20, 0.17, 0.143, 0.121, 0.101, 0.086, 0.071, 0.056, 0.0455, 0.032, 0.022];

    // const dishDistances = [3.5, 4.7, 5.75, 6.7, 7.5, 8.2, 8.8, 9.4, 9.9, 10.3, 10.65, 11, 11.3];
    // const dishSizes = [0.29, 0.27, 0.245, 0.22, 0.21, 0.19, 0.17, 0.16, 0.15, 0.14, 0.137, 0.127, 0.122];


    // const dishSizes = [0.27, 0.245, 0.22, 0.1945, 0.1745, 0.1451, 0.1247, 0.095, 0.071, 0.05, 0.032, 0.02, 0.01, 0.004];
    // const dishDistances = [3.5, 4.7, 5.9, 7.1, 8.3, 9.5, 10.7, 11.9, 13.5, 14.5, 15.4, 16, 16.5, 16.8];
    // const dishSizes = [0.2406, 0.192, 0.154, 0.125, 0.1018, 0.08404, 0.0693, 0.0555, 0.0437, 0.03405, 0.0262, 0.0197, 0.0148, 0.0106, 0.00708, 0.004];
    // const dishDistances = [5, 7.4, 9.3, 10.7, 11.9, 12.8, 13.5, 14.2, 14.8, 15.3, 15.68, 16, 16.255, 16.47, 16.65, 16.8];
    const dishSizes = [0.2406, 0.192, 0.154, 0.125, 0.1018, 0.08404, 0.0693, 0.0555, 0.0437];
    const dishDistances = [5, 7.4, 9.3, 10.7, 11.9, 12.8, 13.5, 14.2, 14.8];
    let initDist = 2.9;

    for (let index = 0; index < 21; index++) {
        const distSize = ((45 - 3 * initDist) / 130);
        console.log(dishDistances[index], distSize);
        EC.drawDisk(distSize, initDist, 0.0001);
        initDist += 0.6;
    }
}

window.addEventListener('DOMContentLoaded', function () {
    EC.prepareScene(false, false, 0);
    EC.camera.position.z = EC.var.z;
    EC.camera.lookAt(0, 0, -50);

    EC.sun = EC.createSun(1.5);
    EC.sun.mesh.position.x = 0;
    EC.sun.mesh.position.y = 0;
    EC.sun.mesh.position.z = -50;
    EC.sun.updateLight();

    EC.drawConeShadow();
    EC.addDisks();

    EC.moonToneTexture = "moon_tone.png"; // two_tone.png

    EC.textures([EC.moonToneTexture, 'moon.jpg', 'moon_bump.jpg'], function () {

        EC.moon = EC.createMoon(0.3, EC.moonToneTexture);
        EC.moon.mesh.position.x = 0;
        EC.moon.mesh.position.y = 0;
        EC.moon.mesh.position.z = 2;
        EC.moon.material.bumpScale = 0.0002;
        EC.moon.material.shininess = 5;
        EC.moon.material.side = THREE.DoubleSide;

        EC.moon.mesh.castShadow = true;

        // initial update
        EC.ready = true;
        EC.loop();
        EC.showXYZ();
    });

    EC.e = EC.elements('zoom_slider_in', 'reset_btn', 'test');
    // EC.sliderArrows('zoom_slider_in', 'number_left', 'number_right', null, '', 1, false, 1, 1000, false);
    EC.e.zoom_slider_in.oninput = function (event) {
        EC.moveCamera(Number(event.target.value));
        // document.getElementById('slider-value').innerHTML = event.target.value;
    };

    EC.controls.addEventListener('end', EC.onControlChange);

    EC.e.reset_btn.onclick = EC.resetPosition;
    // EC.e.test.oninput = function () {
    //     EC.controls.panSpeed = Number(this.value);
    // }
});