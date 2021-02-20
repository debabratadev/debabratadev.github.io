"use strict";
// globals: document, window, THREE, navigator, Vector, Event, localStorage, setInterval, setTimeout, ECT

var EC = window.EC || {};
EC.offsetY = 0.11; // document.getElementById('sliders').clientHeight / window.innerHeight
EC.offsetYmultiplier = 1;

EC.prepareScene = function (aOrtographic, aLogarithmicDepthBuffer, aCustomCameraY) {
    EC.scene = new THREE.Scene();
    EC.scene.background = new THREE.Color(0xffffff);
    if (aOrtographic) {
        EC.camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.05, EC.farPlane);
        var a = window.innerWidth / window.innerHeight,
            s = 8;
        EC.camera.left = -a * s / 2;
        EC.camera.right = a * s / 2;
        EC.camera.top = s / 2;
        EC.camera.bottom = -s / 2;
        EC.camera.updateProjectionMatrix();
    } else {
        EC.camera = new THREE.PerspectiveCamera(EC.defaultCameraFov || 45, window.innerWidth / window.innerHeight, 0.0005, EC.farPlane);
    }
    EC.camera.position.y = 0.5;
    if (aCustomCameraY !== undefined) {
        EC.camera.position.y = aCustomCameraY;
    }
    EC.camera.position.z = localStorage.hasOwnProperty('EC.diagram.camera.z') ? parseFloat(localStorage.getItem('EC.diagram.camera.z')) : 5;
    EC.cameraInitial = {
        rotation: EC.camera.rotation.clone(),
        position: EC.camera.position.clone(),
        matrix: EC.camera.matrix.clone()
    };
    EC.renderer = new THREE.WebGLRenderer({ antialias: true });
    EC.renderer.setSize(window.innerWidth, window.innerHeight);

    EC.renderer.setPixelRatio(window.devicePixelRatio);
    EC.renderer.outputEncoding = THREE.sRGBEncoding;
    EC.renderer.setClearColor(0xffffff, 1);
    // EC.renderer.domElement.classList.add('main');
    document.body.appendChild(EC.renderer.domElement);
    EC.controls = new THREE.ManualControls(EC.camera, EC.renderer.domElement);

    EC.sceneResize = function () {
        //EC.camera.aspect = window.innerWidth / window.innerHeight;
        // EC.offsetY = document.getElementById('sliders').clientHeight / window.innerHeight;
        var ofs = EC.offsetYmultiplier * EC.offsetY * window.innerHeight,
            ar = window.innerWidth / (window.innerHeight + ofs),
            //ar = EC.renderer.domElement.clientWidth / EC.renderer.domElement.clientHeight,
            ss = 8;
        EC.offsetYpx = ofs;
        if (aOrtographic) {
            EC.camera.left = -ar * ss / 2;
            EC.camera.right = ar * ss / 2;
            EC.camera.top = ss / 2;
            EC.camera.bottom = -ss / 2;
            /*
            console.log(
                'L',
                EC.camera.left,
                'R',
                EC.camera.right,
                'T',
                EC.camera.top,
                'B',
                EC.camera.bottom
            );
            */
        } else {
            EC.camera.aspect = ar;
        }
        EC.camera.updateProjectionMatrix();
        EC.renderer.domElement.style.top = (-ofs) + 'px';
        EC.renderer.domElement.style.width = window.innerWidth + 'px';
        EC.renderer.domElement.style.height = (window.innerHeight + ofs) + 'px';
        //console.log('renderer', window.innerHeight + ofs);
        //EC.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight + 100);
        EC.renderer.setSize(window.innerWidth, window.innerHeight + ofs);
        if (EC.controls && EC.controls.handleResize) {
            EC.controls.handleResize();
        }
    };
    window.addEventListener('resize', EC.sceneResize);
    EC.sceneResize();

}
EC.texturesCache = {};
EC.textures = function (aTextures, aCallback, aVersion) {
    // Load multiple textures from arguments, e.g. EC.textures(['earth.jpg', 'moon.jpg', 'moon_bump.jpg'], console.log);
    var loader = new THREE.TextureLoader(),
        remaining = aTextures.length,
        r = {},
        i;
    function onLoad(aTexture) {
        var s = aTexture.image.src.split('/').slice(-1)[0].split('?')[0]; // slice is shallow
        //console.log(aTexture.image.src, s);
        r[s] = aTexture;
        EC.texturesCache[s] = aTexture;
        remaining--;
        if (remaining <= 0) {
            aCallback(r);
        }
    }
    for (i = 0; i < aTextures.length; i++) {
        loader.load('texture/' + aTextures[i] + '?version=' + (aVersion || '0'), onLoad);
    }
};

EC.createMoon = function (aSize, aToonGradientMap) {
    // Create moon
    aSize = aSize || 1;
    var scale = 1,
        geometry = new THREE.SphereGeometry(scale * aSize, 30, 30),
        material,
        mesh;
    if (aToonGradientMap) {
        EC.texturesCache[aToonGradientMap].minFilter = THREE.NearestFilter;
        EC.texturesCache[aToonGradientMap].magFilter = THREE.NearestFilter;
        EC.texturesCache[aToonGradientMap].needsUpdate = true;
        material = new THREE.MeshToonMaterial({
            map: EC.texturesCache['moon.jpg'],
            gradientMap: EC.texturesCache[aToonGradientMap]
        });
    } else {
        material = new THREE.MeshPhongMaterial({
            map: EC.texturesCache['moon.jpg']
        });
    }
    material.bumpMap = EC.texturesCache['moon_bump.jpg'];
    if (aToonGradientMap) {
        material.bumpScale = scale * aSize * 0.05;
    } else {
        material.bumpScale = scale * 0.0002;
    }
    material.shininess = 0;
    material.needsUpdate = true;
    mesh = new THREE.Mesh(geometry, material);
    EC.scene.add(mesh);
    return {
        size: scale * aSize,
        geometry: geometry,
        material: material,
        mesh: mesh
    };
};

EC.createSun = function (aSize) {
    // Create sun
    aSize = aSize || 1;
    var scale = 1,
        geometry = new THREE.SphereGeometry(scale * aSize, 30, 30),
        material = new THREE.MeshBasicMaterial({
            color: 0xffff00
        }),
        mesh,
        light;
    //material.emissive.setHex(0xffff00);
    mesh = new THREE.Mesh(geometry, material);
    light = new THREE.PointLight(0xffffff, 1, 1000);
    //light.position
    //light.position = mesh.position;
    mesh.add(light);
    EC.scene.add(mesh);
    return {
        size: scale * aSize,
        geometry: geometry,
        material: material,
        mesh: mesh,
        light: light,
        updateLight: function () {
            light.position.copy(mesh.position);
        }
    };
};

EC.elements = function () {
    // Get multiple elements by id
    var i, o = {};
    for (i = 0; i < arguments.length; i++) {
        o[arguments[i]] = document.getElementById(arguments[i]);
        if (!o[arguments[i]]) {
            console.warn('Element ' + arguments[i] + ' not found!');
        }
    }
    return o;
};

