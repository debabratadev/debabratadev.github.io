// Various functions
"use strict";
// globals: document, window, THREE, navigator, Vector, Event, localStorage, setInterval, setTimeout, ECT

var EC = window.EC || {};

/*
// Check translations
(function () {
    var l, g, k;
    for (l in ECT.translations) {
        if (ECT.translations.hasOwnProperty(l)) {
            for (g in ECT.translations[l]) {
                if (ECT.translations[l].hasOwnProperty(g)) {
                    for (k in ECT.translations[l][g]) {
                        if (ECT.translations[l][g].hasOwnProperty(k)) {
                            ECT.translations[l][g][k] = l.toUpperCase() + '_' + ECT.translations[l][g][k];
                        }
                    }
                }
            }
        }
    }
}());
*/

if (window.THREE) {
    EC.origin = new THREE.Vector3(0, 0, 0);
}

EC.farPlane = 1000;
EC.offsetY = 0.11; // document.getElementById('sliders').clientHeight / window.innerHeight
EC.offsetYmultiplier = 1;

EC.lerp = function (aValue, aShape) {
    // Linear interpolation
    var i, x1, y1, x2, y2;
    if (aValue < aShape[0][0]) {
        return aShape[0][1];
    }
    for (i = 0; i < aShape.length - 1; i++) {
        if (aValue >= aShape[i][0] && aValue < aShape[i + 1][0]) {
            x1 = aShape[i][0];
            y1 = aShape[i][1];
            x2 = aShape[i + 1][0];
            y2 = aShape[i + 1][1];
            return ((aValue - x1) / (x2 - x1)) * (y2 - y1) + y1;
        }
    }
    return aShape.slice(-1)[0][1]; // slice is shallow, contains value
};

EC.lerpInverse = function (aResult, aShape) {
    // Find inverse value for lerp, works only for monotonous lerps
    var i, transpose = [];
    for (i = 0; i < aShape.length; i++) {
        transpose.push([aShape[i][1], aShape[i][0]]);
    }
    return EC.lerp(aResult, transpose);
};

EC.strToLerp = function (aLerp) {
    // convert string to lerp
    var points = aLerp.trim().split(' '), xy, i, ret = [];
    if (aLerp.trim().charAt(0) === '[') {
        return JSON.parse(aLerp);
    }
    for (i = 0; i < points.length; i++) {
        xy = points[i].trim().split('=');
        if (xy.length !== 2) {
            return 'LERP point #' + (i + 1) + ' point needs 2 items but has ' + xy.length;
        }
        ret.push([parseFloat(xy[0].trim()), parseFloat(xy[1].trim())]);
    }
    ret = ret.sort(function (a, b) {
        return a[0] - b[0];
    });
    return ret;
};

EC.lerpToStr = function (aLerp) {
    var i, a = [], x, s, y;
    for (i = 0; i < aLerp.length; i++) {
        x = aLerp[i][0].toString();
        s = aLerp[i][0].toFixed(6);
        if (s.length < x.length) {
            x = s;
        }
        y = aLerp[i][1].toString();
        s = aLerp[i][1].toFixed(6);
        if (s.length < y.length) {
            y = s;
        }
        a.push(x + '=' + y);
    }
    return a.join(' ');
};

EC.getAbsolutePosition = function (aElement, aEvent) {
    var x = 0, y = 0, sx, sy;
    while (aElement) {
        if (aElement.tagName === "BODY") {
            sx = aElement.scrollLeft || document.documentElement.scrollLeft;
            sy = aElement.scrollTop || document.documentElement.scrollTop;
            x += (aElement.offsetLeft - sx + aElement.clientLeft);
            y += (aElement.offsetTop - sy + aElement.clientTop);
        } else {
            x += (aElement.offsetLeft - aElement.scrollLeft + aElement.clientLeft);
            y += (aElement.offsetTop - aElement.scrollTop + aElement.clientTop);
        }
        aElement = aElement.offsetParent;
    }
    if (aEvent) {
        //console.log(aEvent, x, y);
        return { x: aEvent.offsetX, y: aEvent.offsetY }; //{x: aEvent.clientX - x, y: aEvent.clientY - y};
    }
    return { x: x, y: y };
};

EC.createRing = function (aDeclinationDeg, aLatitudeDeg, aColor, aLineWidth, aResolution, aRadius) {
    // Make ring for red orbital torus
    //console.log('createRing', aDeclinationDeg, 'lat', aLatitudeDeg);
    var self = {},
        d = THREE.Math.degToRad(aDeclinationDeg || 0),
        l = THREE.Math.degToRad((90 - aLatitudeDeg) || 0);
    self.geometry = new THREE.TorusGeometry((aRadius || 2) * Math.cos(d), aLineWidth || 0.01, aResolution || 3, 64);
    self.material = new THREE.MeshBasicMaterial({ color: aColor });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    self.mesh.rotateX(Math.PI / 2);
    self.mesh.rotateY(l);
    self.mesh.translateZ(-2 * Math.sin(d));
    EC.scene.add(self.mesh);
    return self;
};

EC.createLineRing = function (aRadius, aLineWidth, aColor, aSegments) {
    // Make ring from line
    var self = {}, i, x, y, step = 2 * Math.PI / aSegments;
    self.geometry = new THREE.Geometry();
    for (i = 0; i < 2 * Math.PI; i += step) {
        x = aRadius * Math.cos(i);
        y = aRadius * Math.sin(i);
        self.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }
    self.geometry.vertices.push(new THREE.Vector3(aRadius, 0, 0));
    self.material = new THREE.LineBasicMaterial({ color: aColor || 0x000000, opacity: 1, linewidth: aLineWidth || 0.01 });
    self.line = new THREE.Line(self.geometry, self.material);
    EC.scene.add(self.line);
    return self;
};

EC.pad = function (aValue) {
    return aValue < 10 ? '0' + aValue : aValue;
};

EC.hhmm = function (aTime) {
    var h = Math.floor(Math.abs(aTime)),
        m = Math.floor((Math.abs(aTime) - h) * 60),
        sign = aTime >= 0 ? ' ' : '-';
    return sign + EC.pad(Math.abs(h)) + ':' + EC.pad(m);
};

EC.hhmm15 = function (aTime) {
    // hh:mm but round minutes to 15
    var h = Math.floor(Math.abs(aTime)),
        m = Math.floor((Math.abs(aTime) - h) * 60),
        sign = aTime >= 0 ? ' ' : '-';
    m = 15 * Math.round(m / 15);
    if (m >= 60) {
        h += 1;
        m = 0;
    }
    return sign + EC.pad(Math.abs(h)) + ':' + EC.pad(m);
};

EC.hhmmRa = function (aTime) {
    var h = Math.floor(aTime),
        m = Math.floor((aTime - h) * 60);
    return EC.pad(h) + 'h' + EC.pad(m) + 'm';
};

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

EC.prepareControls = function () {
    // Prepare controls
    EC.controls = new THREE.TrackballControls(EC.camera, EC.renderer.domElement);
    EC.controls.rotateSpeed = 2.0;
    EC.controls.zoomSpeed = 1.2;
    EC.controls.panSpeed = 0.8;
    EC.controls.keys = [65, 83, 68];
    EC.controls.dynamicDampingFactor = 1;
};

EC.prepareOrbitControls = function () {
    // Prepare controls
    EC.controls = new THREE.OrbitControls(EC.camera, EC.renderer.domElement);
    EC.controls.dynamicDampingFactor = 1;
};

EC.draggable = function (aActiveElementOrId, aMovedElementOrId) {
    // Make element draggable
    var moving = false, x0 = 0, y0 = 0, r, x, y,
        a = typeof aActiveElementOrId === 'string' ? document.getElementById(aActiveElementOrId) : aActiveElementOrId,
        m = typeof aMovedElementOrId === 'string' ? document.getElementById(aMovedElementOrId) : aMovedElementOrId;
    window.addEventListener('mousedown', function (event) {
        var p = event.target;
        while (p && (p !== a)) {
            p = p.parentElement;
        }
        if ((event.which === 1) && (p === a)) {
            moving = true;
            r = m.getBoundingClientRect();
            x = r.left;
            y = r.top;
            x0 = event.pageX;
            y0 = event.pageY;
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);
    window.addEventListener('mousemove', function (event) {
        if (moving) {
            //console.log('m', event.offsetX - x0);
            x += event.pageX - x0;
            y += event.pageY - y0;
            m.style.left = x + 'px';
            m.style.top = y + 'px';
            x0 = event.pageX;
            y0 = event.pageY;
            //x0 = event.offsetX;
            //y0 = event.offsetY;
        }
    }, true);
    window.addEventListener('mouseup', function () {
        moving = false;
    });
};

EC.prepareScene = function (aOrtographic, aLogarithmicDepthBuffer, aCustomCameraY) {
    // Create scene
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
        EC.camera = new THREE.PerspectiveCamera(EC.defaultCameraFov || 45, window.innerWidth / window.innerHeight, 0.00005, EC.farPlane);
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
    EC.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: aLogarithmicDepthBuffer || false });
    EC.renderer.setSize(window.innerWidth, window.innerHeight);
    EC.renderer.setClearColor(0xffffff, 1);
    EC.renderer.domElement.classList.add('main');
    document.body.appendChild(EC.renderer.domElement);
    EC.controls = new THREE.ManualControls(EC.camera, EC.renderer.domElement);
    EC.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    EC.scene.add(EC.ambientLight);
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
    // EC.labels = EC.labels('labels');
};

EC.cameraReset = function () {
    // Reset camera
    EC.controls.dispose();
    EC.camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight + EC.offsetYmultiplier * EC.offsetY * window.innerHeight), 0.1, EC.farPlane);
    EC.camera.position.y = 0.5;
    EC.camera.position.z = 5;
};

EC.cameraResetRoll = function () {
    // Reset camera roll
    var old = EC.camera.position.clone();
    EC.controls.dispose();
    EC.camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight + EC.offsetYmultiplier * EC.offsetY * window.innerHeight), 0.1, EC.farPlane);
    EC.camera.position.x = old.x;
    EC.camera.position.y = old.y;
    EC.camera.position.z = old.z;
    //EC.camera.quaternion.copy(EC.earth.mesh.quaternion);
    EC.prepareControls();
    EC.labels.scale = 0.55;
};

EC.createObserver = function (aY, aHeadRotateCallback) {
    // Two tiny balls
    var self = {}, x0, y0, moving;
    self.dot = EC.createDot(0.03, 0xa5fa64);
    self.dot2 = EC.createDot(0.03, 0xa5fa64);
    self.dot2.mesh.position.y = 0.06;
    self.head = self.dot2;
    self.dot.mesh.add(self.dot2.mesh);
    self.dot.mesh.position.y = aY || 0;

    /*
    self.nose = EC.createDot(0.01, 0xff0000);
    self.nose.mesh.position.z = -0.03;
    self.head.mesh.add(self.nose.mesh);
    */

    self.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    self.cameraTop = new THREE.Object3D();
    self.cameraTop.position.y = 1;
    self.camera.add(self.cameraTop);

    self.getUpVector = function () {
        // get camera's up vector
        //var a = EC.worldPosition(self.camera),
        //    b = EC.worldPosition(self.cameraTop),
        return EC.worldVectorSub(self.cameraTop, self.camera);
    };

    window.addEventListener('resize', function () {
        self.camera.aspect = window.innerWidth / window.innerHeight;
    });
    if (aHeadRotateCallback) {
        window.addEventListener('mousedown', function (event) {
            if (event.target === EC.renderer.domElement && event.which === 1) {
                moving = true;
                x0 = event.pageX;
                y0 = event.pageY;
            }
        }, true);
        window.addEventListener('mousemove', function (event) {
            if (moving) {
                aHeadRotateCallback(event.pageX - x0, event.pageY - y0);
                x0 = event.pageX;
                y0 = event.pageY;
            }
        }, true);
        window.addEventListener('mouseup', function () {
            moving = false;
        }, true);
    }
    self.head.mesh.add(self.camera);
    return self;
};

EC.createSun = function (aSize) {
    // Create sun
    aSize = aSize || 1;
    var scale = EC.param.sunsize,
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

EC.createEarth = function (aSize, aLongitudes, aLatitudes) {
    // Create earth
    aSize = aSize || 1;
    var scale = EC.param.earthsize,
        geometry = new THREE.SphereGeometry(scale * aSize, aLongitudes || 30, aLatitudes || 30),
        material,
        mesh;
    if (EC.texturesCache['earth2048.jpg'] || EC.texturesCache['earth.jpg']) {
        material = new THREE.MeshPhongMaterial({
            map: EC.texturesCache['earth2048.jpg'] || EC.texturesCache['earth.jpg']
        });
        material.normalMap = EC.texturesCache['earth_normal2048.jpg'] || EC.texturesCache['earth_normal.jpg'];
        material.normalScale.x = 450 * scale * aSize * 0.05;
        material.normalScale.y = 450 * scale * aSize * 0.05;
        //material.bumpMap = EC.texturesCache['earth_bump.jpg'];
        //material.bumpScale = scale * aSize * 0.05;
        material.specularMap = EC.texturesCache['earth_specular.jpg'];
        material.specular = new THREE.Color('#ffffff');
        material.specular.setRGB(0.06, 0.06, 0.06);
        material.needsUpdate = true;
        material.shininess = 100;
    } else {
        material = new THREE.MeshBasicMaterial();
    }
    mesh = new THREE.Mesh(geometry, material);
    EC.scene.add(mesh);
    return {
        size: scale * aSize,
        geometry: geometry,
        material: material,
        mesh: mesh
    };
};

EC.createEarthBlurred = function (aSize) {
    // Create earth blurred
    aSize = aSize || 1;
    var scale = EC.param.earthsize,
        geometry = new THREE.SphereGeometry(scale * (aSize + 0.003), 30, 30),
        material = new THREE.MeshPhongMaterial({
            map: EC.texturesCache['earth_blur.jpg'],
            transparent: true,
            opacity: 0
        }),
        mesh;
    material.shininess = 100;
    mesh = new THREE.Mesh(geometry, material);
    material.depthWrite = false;
    mesh.renderOrder = -1;
    EC.scene.add(mesh);
    return {
        size: scale * aSize,
        geometry: geometry,
        material: material,
        mesh: mesh
    };
};

EC.createGraySphere = function (aSize) {
    // Create colored dot
    var self = {};
    self.geometry = new THREE.SphereGeometry(aSize || 1, 30, 30);
    self.material = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        opacity: 1,
        transparent: false,
        side: THREE.BackSide
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createGraySphere9 = function (aSize) {
    // Create colored dot
    var self = {};
    self.geometry = new THREE.SphereGeometry(aSize || 1, 30, 30);
    self.material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.3,
        transparent: true,
        side: THREE.BackSide
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createDot = function (aSize, aColor, aSegments) {
    // Create colored dot
    var self = {};
    self.size = aSize || 1;
    self.geometry = new THREE.SphereGeometry(aSize || 1, aSegments || 6, aSegments || 6);
    //self.material = new THREE.ShadowMaterial({opacity: 0.2});
    self.material = new THREE.MeshBasicMaterial({
        color: aColor
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createDotPhong = function (aSize, aColor, aSegments) {
    // Create colored dot
    var self = {};
    self.size = aSize || 1;
    self.geometry = new THREE.SphereGeometry(aSize || 1, aSegments || 6, aSegments || 6);
    //self.material = new THREE.ShadowMaterial({opacity: 0.2});
    self.material = new THREE.MeshPhongMaterial({
        color: aColor
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createCircle = function (aSize, aColor, aSegments, aSide) {
    // Create circle
    var self = {};
    self.size = aSize || 1;
    self.geometry = new THREE.CircleGeometry(aSize || 1, aSegments || 12);
    self.material = new THREE.MeshBasicMaterial({ color: aColor || 0x000000, side: aSide || THREE.DoubleSide });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createColoredPlane = function (aSize, aColor) {
    // Create plane
    var self = {};
    self.geometry = new THREE.PlaneGeometry(aSize, aSize, 1);
    self.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    self.material = new THREE.MeshBasicMaterial({ color: aColor || 0x000000, side: THREE.DoubleSide });
    self.plane = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.plane);
    return self;
};

EC.createLabel = function (aText, aColor, aPosition, aUseObj) {
    // Create label
    var self = {};
    //self.geometry = new THREE.BufferGeometry();
    //self.material = new THREE.MeshBasicMaterial({color: aColor});
    self.mesh = {
        position: aPosition
    };
    //new THREE.Mesh(self.geometry, self.material);
    //self.mesh.position.set(aPosition);
    //EC.scene.add(self.mesh);
    self.labelIndex = EC.labels.add(aText, aColor, self.mesh.position, undefined, undefined, undefined, aUseObj) - 1;
    return self;
};

EC.createEarthAxis = function (aSize, aWithoutPoles, aWidth) {
    // Create black Earth axis
    var self = {};
    self.geometry = new THREE.CylinderGeometry(aWidth || 0.02, aWidth || 0.02, aSize, 8);
    self.material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    // north pole
    if (!aWithoutPoles) {
        self.poleN = EC.createDot(0.05, 0x000000);
        self.poleN.mesh.translateX(0);
        self.poleN.mesh.translateY(2 - 0.05);
        self.poleN.material.side = THREE.BackSide;
        // south pole
        self.poleS = EC.createDot(0.05, 0x000000);
        self.poleS.mesh.translateX(0);
        self.poleS.mesh.translateY(-2);
        // extra poles for billboards
        self.poleN2 = new THREE.Object3D();
        self.poleN2.translateX(0);
        self.poleN2.translateY(2.3);
        EC.scene.add(self.poleN2);
        self.poleS2 = new THREE.Object3D();
        self.poleS2.translateX(0);
        self.poleS2.translateY(-2.3);
        EC.scene.add(self.poleS2);
    }
    // south pole
    return self;
};

EC.createMoon = function (aSize, aToonGradientMap) {
    // Create moon
    aSize = aSize || 1;
    var scale = EC.param.moonsize,
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

EC.createCloud = function (aSize, aCount) {
    // Create magelanic cloud
    var self = {}, vertices = [], i, x, y, z, a, r;
    for (i = 0; i < aCount; i++) {
        a = 2 * Math.PI * Math.random();
        r = (aSize / 2) * Math.random();
        x = r * Math.cos(a);
        y = r * Math.sin(a);
        z = 0; //THREE.MathUtils.randFloatSpread(aSize / 2);
        vertices.push(x, y, z);
    }
    self.geometry = new THREE.BufferGeometry();
    self.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    self.material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.005 });
    self.mesh = new THREE.Points(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createPlane = function (aSize, aDoubleSide, aTexture, aColor) {
    // Textured planes (for LMC)
    var self = {}; //, s = aSize / 2;
    aDoubleSide = true;
    self.geometry = new THREE.PlaneGeometry(aSize, aSize, 1, 1);
    self.material = new THREE.MeshBasicMaterial({
        color: aColor || 0xff0000,
        side: aDoubleSide ? THREE.DoubleSide : THREE.BackSide,
        map: aTexture,
        transparent: true
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    window.pl = self;
    return self;
};

EC.createPlaneOpacity = function (aSize, aSide, aTexture, aColor, aOpacity) {
    // Textured planes with opacity
    var self = {}; //, s = aSize / 2;
    self.geometry = new THREE.PlaneGeometry(aSize, aSize, 1, 1);
    self.material = new THREE.MeshBasicMaterial({
        color: aColor || 0xff0000,
        side: aSide,
        map: aTexture,
        transparent: aOpacity < 1,
        opacity: aOpacity
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.V = function (aVector3) {
    // Create sylvester vector from THREE.Vector3
    return Vector.create([aVector3.x, aVector3.y, aVector3.z]);
};
//var a = EC.V();

EC.createLine = function (aObjectA, aObjectB, aWidth) {
    // Create line (thin rectangle) between two objects
    var self = {}, vertices = [], a, b, bxa, s, s1, s9,
        v0, v1, v2, v3, w = aWidth || 0.002;
    // doc/sketch/line_between_two_stars.png
    a = EC.V(aObjectA.getWorldPosition(EC.origin));
    b = EC.V(aObjectB.getWorldPosition(EC.origin));
    bxa = b.cross(a).toUnitVector();
    s = b.subtract(a);
    s1 = a.add(s.multiply(0.1));
    s9 = a.add(s.multiply(0.9));
    v0 = s1.add(bxa.multiply(w));
    v1 = s1.add(bxa.multiply(-w));
    v2 = s9.add(bxa.multiply(-w));
    v3 = s9.add(bxa.multiply(w));

    // triangle 0 2 1
    vertices.push(v0.elements[0]);
    vertices.push(v0.elements[1]);
    vertices.push(v0.elements[2]);
    vertices.push(v1.elements[0]);
    vertices.push(v1.elements[1]);
    vertices.push(v1.elements[2]);
    vertices.push(v2.elements[0]);
    vertices.push(v2.elements[1]);
    vertices.push(v2.elements[2]);
    // triangle 0 2 3
    vertices.push(v0.elements[0]);
    vertices.push(v0.elements[1]);
    vertices.push(v0.elements[2]);
    vertices.push(v2.elements[0]);
    vertices.push(v2.elements[1]);
    vertices.push(v2.elements[2]);
    vertices.push(v3.elements[0]);
    vertices.push(v3.elements[1]);
    vertices.push(v3.elements[2]);

    self.geometry = new THREE.BufferGeometry();
    self.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    self.material = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        side: THREE.FrontSide
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;

    /*
    var self = {}; //, s = aSize / 2;
    self.geometry = new THREE.PlaneGeometry(aSize, aSize, 1, 1);
    */
};

EC.createTriangle = function (aPoints, aColor) {
    var self = {};
    self.geometry = new THREE.Geometry();
    self.a = new THREE.Vector3(aPoints[0], aPoints[1], aPoints[2]);
    self.b = new THREE.Vector3(aPoints[3], aPoints[4], aPoints[5]);
    self.c = new THREE.Vector3(aPoints[6], aPoints[7], aPoints[8]);
    self.geometry.vertices.push(self.a);
    self.geometry.vertices.push(self.b);
    self.geometry.vertices.push(self.c);
    self.geometry.faces.push(new THREE.Face3(0, 1, 2));
    self.geometry.computeFaceNormals();
    self.material = new THREE.MeshBasicMaterial({ color: aColor || 0xff0000 });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    self.update = function (aPoints) {
        if (aPoints) {
            self.a.x = aPoints[0];
            self.a.y = aPoints[1];
            self.a.z = aPoints[2];
            self.b.x = aPoints[3];
            self.b.y = aPoints[4];
            self.b.z = aPoints[5];
            self.c.x = aPoints[6];
            self.c.y = aPoints[7];
            self.c.z = aPoints[8];
        }
        self.geometry.verticesNeedUpdate = true;
    };
    return self;
};

EC.createTriangle2 = function (aMesh1, aMesh2, aMesh3, aColor, aWorldCoords) {
    var self = {};
    self.geometry = new THREE.Geometry();
    self.a = new THREE.Vector3();
    self.b = new THREE.Vector3();
    self.c = new THREE.Vector3();
    self.geometry.vertices.push(self.a);
    self.geometry.vertices.push(self.b);
    self.geometry.vertices.push(self.c);
    self.geometry.faces.push(new THREE.Face3(0, 1, 2));
    self.geometry.computeFaceNormals();
    self.material = new THREE.MeshBasicMaterial({ color: aColor || 0x00ff00, side: THREE.DoubleSide });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    self.update = function () {
        var w;
        w = aWorldCoords ? EC.worldPosition(aMesh1) : aMesh1.position;
        self.a.set(w.x, w.y, w.z);
        w = aWorldCoords ? EC.worldPosition(aMesh2) : aMesh2.position; //;
        self.b.set(w.x, w.y, w.z);
        w = aWorldCoords ? EC.worldPosition(aMesh3) : aMesh3.position; //;
        self.c.set(w.x, w.y, w.z);
        self.geometry.computeFaceNormals();
        self.geometry.verticesNeedUpdate = true;
    };
    self.update();
    return self;
};

EC.createStar = function (aSize, aDoubleSide) { // , aColor
    // 5-pointed star
    var self = {}, i, a, s = aSize, x, y;
    self.geometry = new THREE.Geometry();
    for (i = 0; i < 10; i++) {
        a = 2 * Math.PI * i / 10;
        s = i % 2 === 0 ? aSize : 0.5 * aSize;
        x = s * Math.sin(a);
        y = s * Math.cos(a);
        self.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }
    // points
    self.geometry.faces.push(new THREE.Face3(1, 2, 3));
    self.geometry.faces.push(new THREE.Face3(3, 4, 5));
    self.geometry.faces.push(new THREE.Face3(5, 6, 7));
    self.geometry.faces.push(new THREE.Face3(7, 8, 9));
    self.geometry.faces.push(new THREE.Face3(9, 0, 1));
    // mesh
    self.geometry.faces.push(new THREE.Face3(9, 1, 3));
    self.geometry.faces.push(new THREE.Face3(9, 3, 5));
    self.geometry.faces.push(new THREE.Face3(9, 5, 7));
    self.geometry.computeFaceNormals();
    self.material = new THREE.MeshBasicMaterial({
        color: 0xffff00, //aColor || 0xffff00,
        side: aDoubleSide ? THREE.DoubleSide : THREE.BackSide
    });
    self.size = s;
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createStar2 = function (aSize, aSide, aColor) {
    // 5-pointed star
    var self = {}, i, a, s = aSize, x, y;
    self.geometry = new THREE.Geometry();
    for (i = 0; i < 10; i++) {
        a = -2 * Math.PI * i / 10;
        s = i % 2 === 0 ? aSize : 0.5 * aSize;
        x = s * Math.sin(a);
        y = s * Math.cos(a);
        self.geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }
    // points
    self.geometry.faces.push(new THREE.Face3(1, 2, 3));
    self.geometry.faces.push(new THREE.Face3(3, 4, 5));
    self.geometry.faces.push(new THREE.Face3(5, 6, 7));
    self.geometry.faces.push(new THREE.Face3(7, 8, 9));
    self.geometry.faces.push(new THREE.Face3(9, 0, 1));
    // mesh
    self.geometry.faces.push(new THREE.Face3(9, 1, 3));
    self.geometry.faces.push(new THREE.Face3(9, 3, 5));
    self.geometry.faces.push(new THREE.Face3(9, 5, 7));
    self.geometry.computeFaceNormals();
    self.material = new THREE.MeshBasicMaterial({
        color: aColor || 0xff0000,
        side: aSide
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createHorizon = function (aTransparent, aRadius) {
    // gray horizon disk
    aRadius = aRadius || 2;
    var self = {};
    self.geometry = new THREE.CylinderGeometry(aRadius, aRadius, 0.01 * aRadius / 2, 64);
    self.material = new THREE.MeshBasicMaterial({
        color: 0x777777,
        opacity: aTransparent ? 0.7 : 1,
        transparent: aTransparent
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    return self;
};

EC.createConeArrow = function (aColor, aTailColor, aShaded) {
    // Create cone arrow (for rings)
    var self = {};
    self.geometry = new THREE.ConeGeometry(0.05, 0.2, 24);
    if (aShaded) {
        self.material = new THREE.MeshPhongMaterial({ color: aColor });
    } else {
        self.material = new THREE.MeshBasicMaterial({ color: aColor });
    }
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    EC.scene.add(self.mesh);
    // arrow tail
    if (aTailColor) {
        self.geometry2 = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
        if (aShaded) {
            self.material2 = new THREE.MeshPhongMaterial({ color: aTailColor });
        } else {
            self.material2 = new THREE.MeshBasicMaterial({ color: aTailColor });
        }
        self.mesh2 = new THREE.Mesh(self.geometry2, self.material2);
        self.mesh2.position.set(0, -0.1, 0);
        self.mesh2.rotateY(Math.PI / 2);
        self.mesh.add(self.mesh2);
    }
    return self;
};

EC.toScreenXY = function (pos3D) {
    // Screen coords of position vector, e.g. EC.toScreenXY(mesh.position)
    var v, percX, percY, left, top;
    v = pos3D.clone().project(EC.camera);
    percX = (v.x + 1) / 2;
    percY = (-v.y + 1) / 2;
    left = percX * window.innerWidth;
    top = percY * (window.innerHeight + EC.offsetYmultiplier * EC.offsetY * window.innerHeight);
    return new THREE.Vector3(left, top, v.z);
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

EC.rad = function (aDegrees) {
    // Radians
    return Math.PI * aDegrees / 180;
};

EC.deg = function (aRadians) {
    // Degrees
    return 180 * aRadians / Math.PI;
};

EC.createGraySphereWithGrid = function (aSize, aTextureSrc) {
    // Gray textured sphere with cell being texture with thin grid outline
    aSize = aSize || 1;
    var geometry = new THREE.SphereGeometry(aSize, 24, 12), // 30
        material = new THREE.MeshPhongMaterial({
            map: EC.texturesCache[aTextureSrc || 'grid2.png'],
            transparent: true,
            side: THREE.BackSide
        }),
        mesh,
        i,
        p,
        min,
        max;
    material.needsUpdate = true;
    mesh = new THREE.Mesh(geometry, material);
    EC.scene.add(mesh);
    // fix sphere's uv
    for (i = 0; i < geometry.faceVertexUvs[0].length; i++) {
        geometry.faceVertexUvs[0][i][0].x = 0;
        geometry.faceVertexUvs[0][i][0].y = 0;
        geometry.faceVertexUvs[0][i][1].x = 0;
        geometry.faceVertexUvs[0][i][1].y = 0;
        geometry.faceVertexUvs[0][i][2].x = 1;
        geometry.faceVertexUvs[0][i][2].y = 1;
    }
    for (i = 504; i < geometry.faceVertexUvs[0].length; i++) {
        geometry.faceVertexUvs[0][i][0].x = 0;
        geometry.faceVertexUvs[0][i][0].y = 1;
        geometry.faceVertexUvs[0][i][1].x = 0;
        geometry.faceVertexUvs[0][i][1].y = 1;
        geometry.faceVertexUvs[0][i][2].x = 0;
        geometry.faceVertexUvs[0][i][2].y = 1;
    }
    p = [-0.0, -0.0, -0.01, -0.01, 1.0, 1.0];
    // 1 ring away from south pole
    min = 488;
    max = 504;
    for (i = min; i < max; i++) {
        geometry.faceVertexUvs[0][i][0].x = p[0];
        geometry.faceVertexUvs[0][i][0].y = p[1];
        geometry.faceVertexUvs[0][i][1].x = p[2];
        geometry.faceVertexUvs[0][i][1].y = p[3];
        geometry.faceVertexUvs[0][i][2].x = p[4];
        geometry.faceVertexUvs[0][i][2].y = p[5];
    }
    // south pole
    p = [-0.01, -0.01, 0, 1.03, 1.03, 1.03];
    min = 504; // 504
    max = 528; // geometry.faceVertexUvs[0].length
    for (i = min; i < max; i++) {
        geometry.faceVertexUvs[0][i][0].x = p[0];
        geometry.faceVertexUvs[0][i][0].y = p[1];
        geometry.faceVertexUvs[0][i][1].x = p[2];
        geometry.faceVertexUvs[0][i][1].y = p[3];
        geometry.faceVertexUvs[0][i][2].x = p[4];
        geometry.faceVertexUvs[0][i][2].y = p[5];
    }
    geometry.uvsNeedUpdate = true;
    return {
        geometry: geometry,
        material: material,
        mesh: mesh
    };
};

EC.createBillboard = function (aText, aSize, aNoFaceCamera) {
    var self = {}, cs = 128;
    self.size = aSize;
    self.canvas = document.createElement('canvas');
    self.context = self.canvas.getContext('2d');
    self.canvas.width = cs;
    self.canvas.height = cs;
    self.context.font = Math.round(cs / aText.length) + 'px sans-serif';
    self.context.fillStyle = 'rgba(255,0,0,0)';
    self.context.fillRect(0, 0, cs, cs);
    self.context.fillStyle = '#0077ff';
    self.context.textBaseline = 'middle';
    self.context.textAlign = 'center';
    self.context.fillText(aText, cs / 2, cs / 2, cs);
    self.texture = new THREE.Texture(self.canvas);
    self.texture.needsUpdate = true;
    self.material = new THREE.MeshBasicMaterial({ map: self.texture, transparent: true });
    self.geometry = new THREE.PlaneGeometry(aSize, aSize, 1, 1);
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    if (!aNoFaceCamera) {
        self.mesh.onBeforeRender = function () {
            //self.mesh.lookAt(EC.camera.position.x, EC.camera.position.y, EC.camera.position.z);
            self.mesh.quaternion.copy(EC.camera.quaternion);
        };
    }
    EC.scene.add(self.mesh);
    return self;
};

EC.billboards = {};

EC.loadFont = function (aCallback) {
    var loader = new THREE.FontLoader();
    loader.load('font/helvetiker_regular.typeface.json', function (font) {
        EC.font = font;
        aCallback(font);
    });
};

EC.createBillboard3d = function (aId, aText, aSize, aX, aY, aZ, aStickToObject, aRenderOrder) { // , aStickToMesh
    // Create 3D label
    var loader = new THREE.FontLoader();
    loader.load('font/helvetiker_regular.typeface.json', function (font) {
        var geometry = new THREE.TextGeometry(aText, {
            font: font,
            size: aSize,
            height: 0,
            curveSegments: 2,
            bevelEnabled: false,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0
        }), material = new THREE.MeshBasicMaterial({
            color: 0x0077ff,
            transparent: true
        }), mesh = new THREE.Mesh(geometry, material);
        EC.scene.add(mesh);
        EC.billboards[aId] = {
            text: aText,
            mesh: mesh,
            material: material
        };
        mesh.onBeforeRender = function () {
            var v = new THREE.Vector3();
            if (aStickToObject) {
                aStickToObject.getWorldPosition(v);
                mesh.position.copy(v);
                mesh.position.x += aX;
                mesh.position.y += aY;
                mesh.position.z += aZ;
            }
            /*
            if (aStickToMesh) {
                mesh.position.copy(aStickToMesh.position);
            }
            */
            v.set(0, 0, 0);
            //EC.camera.updateWorldMatrix(true, true);
            EC.camera.getWorldPosition(v);
            mesh.lookAt(v.x, v.y, v.z);
            //mesh.quaternion.copy(EC.camera.quaternion);
        };
        if (aRenderOrder) {
            mesh.renderOrder = aRenderOrder;
        }
        // label
        mesh.position.x = aX;
        mesh.position.y = aY;
        mesh.position.z = aZ;
        if (EC.ready) {
            EC.update();
        }
    });
};

EC.opacity = function (obj, opacity) {
    obj.traverse(function (child) {
        if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
            child.material.opacity = opacity;
        }
    });
};

EC.distancePointLineSegment = function (x, y, x1, y1, x2, y2) {
    // Return distance from point to line segment, taken from CA library, MIT licence
    var A, B, C, D, dot, len_sq, param, xx, yy, dx, dy;
    A = x - x1;
    B = y - y1;
    C = x2 - x1;
    D = y2 - y1;
    dot = A * C + B * D;
    len_sq = C * C + D * D;
    param = -1;
    if (len_sq !== 0) {
        param = dot / len_sq;
    }
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    dx = x - xx;
    dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
};

EC.createBillboard3dF = function (aId, aText, aSize, aX, aY, aZ, aStickToObject, aRenderOrder, aStatic, aCenterX) {
    // Create 3D label (with EC.font already loaded)
    var geometry = new THREE.TextGeometry(aText, {
        font: EC.font,
        size: aSize,
        height: 0,
        curveSegments: 2,
        bevelEnabled: false,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0
    }), material = new THREE.MeshBasicMaterial({
        color: 0x0077ff,
        transparent: true
    }), mesh = new THREE.Mesh(geometry, material);
    EC.scene.add(mesh);
    EC.billboards[aId] = {
        text: aText,
        mesh: mesh,
        material: material
    };
    if (aStatic) {
        EC.unused = true;
    } else {
        mesh.onBeforeRender = function () {
            var v = new THREE.Vector3();
            if (aStickToObject) {
                aStickToObject.getWorldPosition(v);
                mesh.position.copy(v);
                mesh.position.x += aX;
                mesh.position.y += aY;
                mesh.position.z += aZ;
            }
            /*
            if (aStickToMesh) {
                mesh.position.copy(aStickToMesh.position);
            }
            */
            v.set(0, 0, 0);
            //EC.camera.updateWorldMatrix(true, true);
            EC.camera.getWorldPosition(v);
            mesh.lookAt(v.x, v.y, v.z);
            //mesh.quaternion.copy(EC.camera.quaternion);
        };
    }
    if (aRenderOrder) {
        mesh.renderOrder = aRenderOrder;
    }
    // label
    mesh.position.x = aX;
    mesh.position.y = aY;
    mesh.position.z = aZ;
    // center
    if (aCenterX) {
        mesh.position.x -= EC.boundingBox(mesh).x / 2;
    }
    /*
    if (EC.ready) {
        EC.update();
    }
    */
    return {
        text: aText,
        mesh: mesh,
        material: material
    };
};

EC.isPointInView = function (aPosition) {
    // Return true if point is in front of camera (in frustum)
    //EC.camera.updateMatrix();
    //EC.camera.updateMatrixWorld(true);
    var frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(EC.camera.projectionMatrix, EC.camera.matrixWorldInverse));
    return frustum.containsPoint(aPosition);
};

EC.getUrlParam = function (aName, aDefault, aAllowedValues) {
    // get url parameter value from current document location, e.g. ?foo=bar&zzz=123
    var i, s = document.location.search.substr(1).split(/[\&\=]/), r;
    for (i = 0; i < s.length - 1; i += 2) {
        if (s[i] === aName) {
            r = decodeURIComponent(s[i + 1]);
            if (aAllowedValues && (aAllowedValues.indexOf(r) < 0)) {
                r = aDefault;
            }
            return r;
        }
    }
    return aDefault;
};

EC.language = function () {
    // Detect user language from browser or lang param
    if (EC.languageCached) {
        return EC.languageCached;
    }
    var browser = (navigator.languages && navigator.languages[0].substr(0, 2)) || (navigator.language && navigator.language.substr(2)),
        param = EC.getUrlParam('lang', '');
    if (typeof window.EC_LANG === 'string') {
        param = window.EC_LANG;
    }
    if (param === 'sp') {
        param = 'es';
    }
    if (param === 'en' || (window.ECT.translations && window.ECT.translations.hasOwnProperty(param))) {
        EC.languageCached = param;
        return param;
    }
    if (window.ECT.translations && window.ECT.translations.hasOwnProperty(browser)) {
        EC.languageCached = browser;
        return browser;
    }
    EC.languageCached = 'en';
    return 'en';
};

EC.translationsMissing = {};
EC.translationsUsed = {};

EC.translateOne = function (aGroup, aValue) {
    // Translate one value, e.g. ('poles', 'NCT')
    EC.translationsUsed[aGroup] = EC.translationsUsed[aGroup] || {};
    EC.translationsUsed[aGroup][aValue] = true;
    var debug = EC.getUrlParam('langdebug', 'false') === 'true',
        lang = EC.language(),
        ECT = window.ECT,
        a,
        tr = ECT && ECT.translations && ECT.translations[lang] && ECT.translations[lang][aGroup];
    if (!tr) {
        EC.translationsMissing[aGroup + ' ' + aValue] = true;
        console.warn('no translation ' + aGroup + ' ' + aValue);
        return (debug ? '__missing__' : '') + aValue;
    }
    if (!tr[aValue]) {
        EC.translationsMissing[aGroup + ' ' + aValue] = true;
    }
    if (Array.isArray(tr[aValue])) {
        a = tr[aValue].slice(); // slice is shallow
        a[0] = (debug ? lang + '_' : '') + a[0];
        return a;
    }
    return (debug ? lang + '_' : '') + (tr[aValue] || aValue);
};

EC.translateElements = function () {
    // Translate all elements by id
    var debug = EC.getUrlParam('langdebug', 'false') === 'true',
        e,
        i,
        lang = EC.language(),
        id,
        ECT = window.ECT,
        tr = ECT && ECT.translations && ECT.translations[lang] && ECT.translations[lang].elements,
        texts = ECT && ECT.translations && ECT.translations[lang] && ECT.translations[lang].texts;
    if (!tr) {
        return;
    }
    tr.instructions_title = tr.instructions;
    tr.time_speed2_name = tr.time_speed_name;
    tr.local_speed2_name = tr.local_speed_name;
    tr.day_speed2_name = tr.day_speed_name;
    for (id in tr) {
        if (tr.hasOwnProperty(id)) {
            e = document.getElementById(id);
            if (e) {
                EC.translationsUsed.elements = EC.translationsUsed.elements || {};
                EC.translationsUsed.elements[id] = true;
                e.innerHTML = (debug ? lang + '_' : '') + (Array.isArray(tr[id]) ? tr[id].join('\n') : tr[id]);
            }
        }
    }
    // class="translate"
    e = document.getElementsByClassName('translate');
    for (i = 0; i < e.length; i++) {
        id = e[i].textContent.trim();
        if (texts.hasOwnProperty(id)) {
            EC.translationsUsed.texts = EC.translationsUsed.texts || {};
            EC.translationsUsed.texts[id] = true;
            e[i].textContent = (debug ? lang + '_' : '') + texts[id];
        }
    }
};

EC.compass = function (aCardinal) {
    // Convert North to Nord
    var lang = EC.language();
    if (window.ECT && window.ECT.translations && window.ECT.translations.hasOwnProperty(lang) && window.ECT.translations[lang].hasOwnProperty('compass')) {
        return window.ECT.translations[lang].compass[aCardinal] || aCardinal;
    }
    return aCardinal;
};

EC.objectUp = function (aMesh) {
    // get up vector of object in world coordinates
    var p1 = aMesh.getWorldPosition(new THREE.Vector3(0, 0, 0)),
        p2;
    aMesh.translateY(1);
    p2 = aMesh.getWorldPosition(new THREE.Vector3(0, 0, 0));
    aMesh.translateY(-1);
    p2.sub(p1);
    return p2;
};

EC.worldPosition = function (aMesh) {
    // Get mesh's world position
    var v = new THREE.Vector3();
    aMesh.updateWorldMatrix(true, true);
    aMesh.getWorldPosition(v);
    return v;
};

EC.worldDirection = function (aMesh) {
    // Get mesh's world direction
    var v = new THREE.Vector3();
    aMesh.updateWorldMatrix(true, true);
    aMesh.getWorldDirection(v);
    return v;
};

EC.worldVectorSub = function (aMesh1, aMesh2) {
    // subtract 2 world positions
    var a = new THREE.Vector3(),
        b = new THREE.Vector3(),
        c = new THREE.Vector3();
    aMesh1.updateWorldMatrix(true, true);
    aMesh1.updateWorldMatrix(true, true);
    aMesh1.getWorldPosition(a);
    aMesh2.getWorldPosition(b);
    c.x = b.x - a.x;
    c.y = b.y - a.y;
    c.z = b.z - a.z;
    return c;
};

EC.objectForward = function (aMesh) {
    // Get object's forward vector
    var position = new THREE.Vector3(),
        scale = new THREE.Vector3(),
        quaternion = new THREE.Quaternion(),
        vector = new THREE.Vector3(0, 0, 1);
    aMesh.updateMatrixWorld(); // the renderer does this for you each render loop, so you may not have to
    aMesh.matrixWorld.decompose(position, quaternion, scale);
    vector.applyQuaternion(quaternion);
    return vector;
};

EC.isMeshFacingCamera = function (aMesh, aCamera, aThreshold) {
    // Return true if mesh is facing camera
    var f = EC.objectForward(aMesh),
        cf = EC.objectForward(aCamera);
    //cf2 = new THREE.Vector3();
    //aCamera.getWorldDirection(cf2);
    //console.log(f.dot(cf));
    //console.log(f.dot(cf2));
    return f.dot(cf) > (aThreshold || -0.5);
};

EC.hideStar = function (aName) {
    // Hide star
    var i;
    for (i = 0; i < EC.constellations.stars.length; i++) {
        if (EC.constellations.stars[i].label === aName) {
            EC.constellations.stars[i].inside.mesh.visible = false;
            EC.constellations.stars[i].outside.mesh.visible = false;
        }
    }
};

EC.hideLabel = function (aName) {
    // Hide label
    var i;
    for (i = 0; i < EC.labels.items.length; i++) {
        if (EC.labels.items[i].text === aName) {
            EC.labels.items[i].text = '';
        }
    }
};

EC.humanDay = function (aDay) {
    // convert 152 to "6 Jun"
    aDay = aDay + 79;
    if (aDay > 365) {
        aDay -= 365;
    }
    var month, month_str, day;
    month = aDay < 32 ? 1 : Math.floor(0.98 + 9 / 275 * (2 + aDay));
    month_str = EC.translateOne('month', month);
    day = aDay - Math.floor(275 * month / 9) + 2 * Math.floor((month + 9) / 12) + 30;
    return day + ' ' + month_str;
};

EC.findRadius2D = function (aPoint, aRadius) {
    // Find 2D radius of 3D sphere
    var angle = 2 * Math.PI / 12,
        c,
        p,
        s,
        d,
        m = 0;
    // center point
    p = aPoint.clone();
    c = EC.toScreenXY(p);
    // around
    for (angle = 0; angle <= 2 * Math.PI; angle += Math.PI / 4) {
        p = aPoint.clone();
        p.x += aRadius * Math.sin(angle);
        p.y += aRadius * Math.cos(angle);
        s = EC.toScreenXY(p);
        d = s.distanceTo(c);
        if (d > m) {
            m = d;
        }
    }
    return {
        x: c.x,
        y: c.y,
        r: m
    };
};

EC.repeatButton = function (aId, aIntervalMs, aDelayMs) {
    // Keep pressing button if down
    var b = document.getElementById(aId),
        down = false,
        t1;
    aDelayMs = aDelayMs || 100;
    aIntervalMs = aIntervalMs || 100;
    function start() {
        //console.log('start', aId);
        down = true;
        t1 = Date.now();
    }
    function end() {
        //console.log('end', aId);
        down = false;
    }
    setInterval(function () {
        if (down && (Date.now() > t1 + aDelayMs) && b && b.parentElement) {
            //console.log('still down');
            b.click();
            //aCallback({target: b});
        }
    }, aIntervalMs);
    b.addEventListener('mousedown', start);
    //b.addEventListener('blur', end);
    window.addEventListener('mouseup', end);
    b.addEventListener('touchstart', start);
    b.addEventListener('touchend', end);
};

EC.sliderArrows = function (aSliderId, aButtonLeftId, aButtonRightId, aUpFocus, aDownFocus, aStepMultiplier, aDownToInt, aRepeatInterval, aRepeatDelay, aAlwaysActive, aCustomUpdateFunction) {
    // Handle arrow buttons next to slider
    //console.log('aCustomUpdateFunction', aCustomUpdateFunction);
    var k = aStepMultiplier || 5,
        slider = document.getElementById(aSliderId),
        button_left = document.getElementById(aButtonLeftId),
        button_right = document.getElementById(aButtonRightId);

    function keyDown(event) {
        if (EC.keydownFix) {
            EC.keydownFix(event, 'sliderArrows');
        }
        button_left.classList.remove('active');
        button_right.classList.remove('active');
        if (!slider.dataFloatValue) {
            slider.dataFloatValue = parseFloat(slider.value);
        }
        if (aDownFocus && (event.key === 'ArrowDown')) {
            event.preventDefault();
            document.getElementById(aDownFocus).focus();
        }
        if (aUpFocus && (event.key === 'ArrowUp')) {
            event.preventDefault();
            document.getElementById(aUpFocus).focus();
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            button_left.classList.add('active');
            if (slider.dataCallback) {
                //console.warn('asdf');
                if (aDownToInt && !Number.isInteger(slider.dataFloatValue)) {
                    slider.dataFloatValue = Math.ceil(slider.dataFloatValue);
                    //console.warn('special1', slider.dataFloatValue);
                }
                slider.dataFloatValue -= k * parseFloat(slider.step);
                slider.value = slider.dataFloatValue;
                slider.dataCallback(slider.dataFloatValue, 0, true, true);
            }
            if (slider.oninput) {
                //console.warn('asdf2', slider.dataFloatValue);
                if (aDownToInt && !Number.isInteger(slider.dataFloatValue)) {
                    slider.dataFloatValue = Math.ceil(slider.dataFloatValue);
                }
                slider.dataFloatValue -= k * parseFloat(slider.step);
                slider.value = slider.dataFloatValue;

                slider.oninput({ target: { value: slider.dataFloatValue, min: slider.min, max: slider.max } });
            }
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            button_right.classList.add('active');
            if (slider.dataCallback) {
                slider.dataFloatValue += k * parseFloat(slider.step);
                slider.value = slider.dataFloatValue;
                slider.dataCallback(slider.dataFloatValue, 0, true, true);
            }
            if (slider.oninput) {
                if (aDownToInt && !Number.isInteger(slider.dataFloatValue)) {
                    slider.dataFloatValue = Math.floor(slider.dataFloatValue);
                }
                slider.dataFloatValue += k * parseFloat(slider.step);
                slider.value = slider.dataFloatValue;
                //console.warn('a', slider.dataFloatValue);
                slider.oninput({ target: { value: slider.dataFloatValue, min: slider.min, max: slider.max } });
            }
        }
    }
    function keyUp() {
        //event.preventDefault();
        button_left.classList.remove('active');
        button_right.classList.remove('active');
    }
    function green(aBtn) {
        aBtn.style.filter = 'grayscale(0)';
        setTimeout(function () {
            aBtn.style.filter = '';
        }, 500);
    }
    function click(event) {
        //console.log('click', event);
        var ev = new Event('input');
        if (event.target.classList.contains('left')) {
            green(event.target);
            if (slider.dataCallback) {
                slider.dataFloatValue += k * parseFloat(slider.step);
                slider.value = slider.dataFloatValue;
                slider.dataCallback(slider.dataFloatValue, 0, true, true);
            } else {
                console.log('asdf');
                if (aCustomUpdateFunction) {
                    slider.dataFloatValue = aCustomUpdateFunction(slider.dataFloatValue, true);
                    slider.value = slider.dataFloatValue;
                } else {
                    if (aDownToInt) {
                        if (!Number.isInteger(slider.dataFloatValue)) {
                            slider.value = Math.floor(slider.dataFloatValue);
                        } else {
                            slider.value = slider.dataFloatValue - 1;
                        }
                    } else {
                        slider.value = parseFloat(slider.value) - k * parseFloat(slider.step);
                    }
                }
                slider.dispatchEvent(ev);
            }
        }
        if (event.target.classList.contains('right')) {
            green(event.target);
            if (slider.dataCallback) {
                slider.dataFloatValue += k * parseFloat(slider.step);
                slider.value = slider.dataFloatValue;
                slider.dataCallback(slider.dataFloatValue, 0, true, true);
            } else {
                if (aCustomUpdateFunction) {
                    slider.dataFloatValue = aCustomUpdateFunction(slider.dataFloatValue, false);
                    slider.value = slider.dataFloatValue;
                } else {
                    if (aDownToInt) {
                        if (!Number.isInteger(slider.dataFloatValue)) {
                            slider.value = Math.ceil(slider.dataFloatValue);
                        } else {
                            slider.value = slider.dataFloatValue + 1;
                        }
                    } else {
                        slider.value = parseFloat(slider.value) + k * parseFloat(slider.step);
                    }
                }
                slider.dispatchEvent(ev);
            }
        }
        slider.focus();
    }
    function onFocus() {
        button_left.style.opacity = 1;
        button_right.style.opacity = 1;
    }
    function onBlur() {
        if (!aAlwaysActive) {
            button_left.style.opacity = 0.2;
            button_right.style.opacity = 0.2;
        }
    }

    // slider.addEventListener('keydown', keyDown, true);
    // slider.addEventListener('keyup', keyUp, true);
    slider.addEventListener('focus', onFocus, true);
    slider.addEventListener('blur', onBlur, true);
    button_left.addEventListener('click', click, true);
    button_right.addEventListener('click', click, true);

    // click,
    EC.repeatButton(aButtonLeftId, aRepeatInterval, aRepeatDelay);
    EC.repeatButton(aButtonRightId, aRepeatInterval, aRepeatDelay);
};

EC.snapBackSlider = function (aSliderId, aSpeedSliderId, aSpeed2SliderId, aCallback, aLerp, aSpeedCallback) {
    // Connect one slider with two speed sliders (desktop, mobile) and call callback with slider value
    var slider = document.getElementById(aSliderId),
        speed = document.getElementById(aSpeedSliderId),
        speed2 = document.getElementById(aSpeed2SliderId),
        s = 0;

    slider.dataFloatValue = parseFloat(slider.value);
    slider.dataCallback = aCallback;
    slider.dataSpeedCallback = aSpeedCallback;
    speed.value = 0;
    speed2.value = 0;
    speed.dataFloatValue = 0;
    speed2.dataFloatValue = 0;

    slider.oninput = function () {
        var o = slider.dataFloatValue;
        slider.dataFloatValue = parseFloat(slider.value);
        aCallback(slider.dataFloatValue, slider.dataFloatValue - o, true);
    };

    if (speed) {
        speed.oninput = function (event) {
            var v = parseFloat(event.target.value), o = v;
            if (aLerp) {
                s = EC.lerp(v, aLerp);
                v = s;
            } else {
                s = v;
            }
            speed2.value = event.target.value;
            if (aSpeedCallback) {
                aSpeedCallback(v, o);
            }
        };
    }
    speed2.oninput = function (event) {
        var v = parseFloat(event.target.value), o = v;
        if (aLerp) {
            s = EC.lerp(v, aLerp);
            v = s;
        } else {
            s = v;
        }
        if (speed) {
            speed.value = event.target.value;
        }
        if (aSpeedCallback) {
            aSpeedCallback(v, o);
        }
    };

    window.setInterval(function () {
        var m = parseFloat(slider.max);
        if (s > 0) {
            slider.dataFloatValue += s;
            if (slider.dataFloatValue > m) {
                slider.dataFloatValue = parseFloat(slider.min) + (slider.dataFloatValue - m);
            }
            slider.value = slider.dataFloatValue;
            aCallback(slider.dataFloatValue, s, false);
        }
    }, 50);

    function snapBack(event) {
        if (speed) {
            speed.value = 0;
        }
        speed2.value = 0;
        s = 0;
        event.preventDefault();
        event.cancelBubble = true;
        if (aSpeedCallback) {
            aSpeedCallback(0, 0);
        }
    }

    function endOfInput() {
        aCallback(slider.dataFloatValue, 0, true);
    }

    slider.addEventListener('mouseup', endOfInput, true);
    slider.addEventListener('touchend', endOfInput, true);
    if (speed) {
        speed.addEventListener('mouseup', snapBack, true);
        speed.addEventListener('touchend', snapBack, true);
    }
    speed2.addEventListener('mouseup', snapBack, true);
    speed2.addEventListener('touchend', snapBack, true);
};

EC.snapBackSliderSingle = function (aSliderId, aSpeedSliderId, aCallback, aLerp, aSpeedCallback) {
    // Connect one slider with two speed sliders (desktop, mobile) and call callback with slider value
    var slider = document.getElementById(aSliderId),
        speed = document.getElementById(aSpeedSliderId),
        s = 0;

    if (!slider) {
        throw "Slider not found: " + aSliderId;
    }

    slider.dataFloatValue = parseFloat(slider.value);
    speed.dataFloatValue = 0;

    slider.oninput = function () {
        var o = slider.dataFloatValue;
        slider.dataFloatValue = parseFloat(slider.value);
        aCallback(slider.dataFloatValue, slider.dataFloatValue - o, true);
    };

    speed.oninput = function (event) {
        var v = parseFloat(event.target.value), o = v;
        //console.log('v', v);
        if (aLerp) {
            s = EC.lerp(v, aLerp);
            v = s;
        } else {
            s = v;
        }
        if (aSpeedCallback) {
            aSpeedCallback(v, o);
        }
    };

    window.setInterval(function () {
        var max = parseFloat(slider.max), min = parseFloat(slider.min);
        if (s !== 0) {
            slider.dataFloatValue += s;
            if (slider.dataFloatValue > max) {
                //var q = slider.dataFloatValue;
                slider.dataFloatValue = min + (slider.dataFloatValue - max);
                //console.warn(slider.dataFloatValue, slider.min, slider.max, 'q', q, 'm', m);
            }
            if (slider.dataFloatValue < min) {
                slider.dataFloatValue = max + (slider.dataFloatValue - min);
            }
            slider.value = slider.dataFloatValue;
            aCallback(slider.dataFloatValue, s, false);
        }
    }, 50);

    function snapBack(event) {
        speed.value = 0;
        s = 0;
        event.preventDefault();
        event.cancelBubble = true;
        if (aSpeedCallback) {
            aSpeedCallback(0, 0);
        }
    }

    function endOfInput() {
        aCallback(slider.dataFloatValue, 0, true);
    }

    slider.addEventListener('mouseup', endOfInput, true);
    /*
    window.addEventListener('mouseup', function (event) {
        console.warn(event.target);
        //endOfInput
    }, true);
    */
    slider.addEventListener('touchend', endOfInput, true);
    speed.addEventListener('mouseup', snapBack, true);
    speed.addEventListener('touchend', snapBack, true);
};

EC.createDirectionalLight = function (aWithoutArrow) {
    // Create directional light and arrow that visualize it
    var self = {};
    // center
    self.center = new THREE.Object3D();
    EC.scene.add(self.center);
    // light
    self.light = new THREE.DirectionalLight(0xffffff, 1);
    self.light.position.set(100, 0, 0);
    self.light.intensity = 1;
    //EC.scene.add(self.light);
    //self.light.target.set(0, 0, 0);
    self.center.add(self.light);
    if (!aWithoutArrow) {
        // arrow cone
        self.geometry = new THREE.ConeGeometry(0.05, 0.2, 24);
        self.material = new THREE.MeshBasicMaterial({ color: 0xaaaa00 });
        //self.material.depthTest = false;
        self.mesh = new THREE.Mesh(self.geometry, self.material);
        self.mesh.position.set(2.8, 0, 0);
        self.mesh.rotateZ(-Math.PI / 2);
        self.center.add(self.mesh);
        //EC.scene.add(self.mesh);
        // arrow tail
        self.geometry2 = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
        self.material2 = new THREE.MeshBasicMaterial({ color: 0xaaaa00 });
        self.mesh2 = new THREE.Mesh(self.geometry2, self.material2);
        self.mesh2.position.set(2.6, 0, 0);
        self.mesh2.rotateZ(Math.PI / 2);
        self.center.add(self.mesh2);
    }
    //EC.scene.add(self.mesh2);
    return self;
};

EC.param = {
    moonsize: parseFloat(EC.getUrlParam('moonsize', '1')),
    earthsize: parseFloat(EC.getUrlParam('earthsize', '1')),
    earthshadowsize: parseFloat(EC.getUrlParam('earthshadowsize', '1')),
    sunsize: parseFloat(EC.getUrlParam('sunsize', '1')),
    correction: parseFloat(EC.getUrlParam('correction', '1')),
    size: parseFloat(EC.getUrlParam('size', '1'))
};
EC.param.minsize = Math.min(EC.param.moonsize, EC.param.earthsize, EC.param.sunsize);

EC.createMoonRingShadow = function () {
    // moon ring shadow (more than 5.1deg to loose shadow faster)
    EC.moonShadowSpeed = parseFloat(EC.getUrlParam('moonshadowspeed', '2'));
    EC.moonRingShadow = new THREE.Object3D(); //EC.createRing(0, 0, 0x777700, 0.01 * EC.scale);
    EC.scene.add(EC.moonRingShadow);
    EC.moonShadow = EC.createDot(EC.sizeMoon * EC.param.moonsize, 0xffffff);
    EC.scene.remove(EC.moonShadow.mesh);
    EC.moonRingShadow.add(EC.moonShadow.mesh);
    EC.controls.maxDistance = 5;
    //EC.moonShadow.mesh.position.x = 5;
    EC.moonShadow.mesh.position.x = 18;
    EC.moonShadow.mesh.castShadow = true;
};

EC.createSunPhase = function () {
    EC.texturesCache[EC.sunPhaseTexture].anisotropy = EC.renderer.capabilities.getMaxAnisotropy();
    EC.texturesCache[EC.sunPhaseTexture].needsUpdate = true;
    EC.sunPhase = EC.createPlaneOpacity(1.5, true, EC.texturesCache[EC.sunPhaseTexture], 0xff0000, 0.99);
    //EC.sunPhase.material.depthTest = false;
    EC.sunPhase.material.side = THREE.FrontSide;
    EC.sunPhase.material.needsUpdate = true;
    EC.sunPhase.mesh.rotateX(-Math.PI / 2);
    EC.sunPhase.mesh.rotateZ(Math.PI / 2);
    EC.sunPhase.mesh.position.y = 0.035;
    EC.sunPhase.material.depthWrite = false;
    //EC.sunPhase.mesh.rotate(0.5)
};

EC.createTestTable = function (aParent, aTexture, aSize) {
    // Create test table
    var self = {};
    self.size = aSize || 1;
    self.geometry = new THREE.PlaneGeometry(self.size, self.size, 1, 1);
    self.material = new THREE.MeshBasicMaterial({
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
        map: EC.texturesCache[aTexture]
    });
    self.mesh = new THREE.Mesh(self.geometry, self.material);
    //self.mesh.rotateX(EC.rad(-90));
    self.center = new THREE.Object3D();
    //self.center.position.set(-self.size / 2, -self.size / 2, -self.size / 2);
    self.mesh.add(self.center);
    self.dot = EC.createDot(0.05, 0x000000);
    self.center.add(self.dot.mesh);
    aParent.add(self.mesh);
    return self;
};

EC.move = function (aMesh, aWhere) {
    // move mesh to other mesh
    // remove from current
    if (aMesh.mesh) {
        aMesh.mesh.parent.remove(aMesh.mesh || aMesh);
    } else {
        aMesh.parent.remove(aMesh.mesh || aMesh);
    }
    // add to new
    if (aWhere.mesh) {
        aWhere.mesh.add(aMesh.mesh || aMesh);
    } else {
        aWhere.add(aMesh.mesh || aMesh);
    }
};

EC.rotateObjectAroundPole = function (aObject, aPole, aAngleRad) {
    // Rotate object around pole
    var o = EC.worldPosition(aObject),
        p = EC.worldPosition(aPole),
        axis = new THREE.Vector3();
    axis.x = p.x - o.x;
    axis.y = p.y - o.y;
    axis.z = p.z - o.z;
    axis.normalize();
    aObject.rotateOnWorldAxis(axis, aAngleRad);
};

EC.cameraLookAtMesh = function (aMesh) {
    // Make camera look at mesh
    var m = aMesh.mesh || aMesh,
        v = new THREE.Vector3();
    m.updateWorldMatrix(true, true);
    m.getWorldPosition(v);
    EC.camera.lookAt(v.x, v.y, v.z);
};

EC.getObjectGlobalPFU = function (aObject) {
    // Get Position, Forward, Up vectors of object
    aObject.updateWorldMatrix(true, true);
    var o = aObject.position.clone(),
        p = new THREE.Vector3(),
        f = new THREE.Vector3(),
        u = new THREE.Vector3();
    aObject.getWorldPosition(p);
    aObject.translateZ(-1);
    aObject.getWorldPosition(f);
    aObject.translateZ(1);
    aObject.translateY(-1);
    aObject.getWorldPosition(u);
    aObject.translateY(1);
    aObject.position.copy(o);
    f.sub(p);
    u.sub(p);
    return {
        p: p,
        f: f,
        u: u
    };
};

EC.tooltipHide = function () {
    // Hide tooltip
    if (EC.tooltipOld && EC.tooltipOld.parentElement) {
        EC.tooltipOld.parentElement.removeChild(EC.tooltipOld);
    }
};

EC.tooltip = function (aX, aY, aMessage, aDurationSeconds) {
    // Show tooltip at given position
    EC.tooltipHide();
    if (aMessage === 'undefined') {
        //console.warn(aX, aY, aMessage, aDurationSeconds);
        return;
    }
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.left = aX + 'px';
    div.style.top = aY + 'px';
    div.style.zIndex = 999;
    div.style.userSelect = 'none';
    div.style.pointerEvents = 'none';
    div.style.backgroundColor = 'rgba(0,0,0,0.7)';
    div.style.color = 'white';
    div.style.padding = '0.5ex';
    div.style.borderRadius = '0.5ex';
    div.textContent = aMessage;
    EC.tooltipOld = div;
    document.body.appendChild(div);
    setTimeout(function () {
        EC.tooltipHide();
    }, aDurationSeconds * 99000);
    return div;
};

window.addEventListener('mousedown', EC.tooltipHide, true);
window.addEventListener('wheel', EC.tooltipHide, true);
window.addEventListener('touchstart', EC.tooltipHide, true);

EC.showStarsTooltipOnClick = function (aElement, aCustomCallback) {
    // Show tooltip on nearest star when element is clicked
    var sx, sy;
    aElement.addEventListener('mousedown', function (event) {
        sx = event.clientX;
        sy = event.clientY;
    });
    aElement.addEventListener('touchstart', function (event) {
        sx = 0;
        sy = 0;
        if (event.targetTouches.length === 1) {
            sx = event.targetTouches[0].clientX;
            sy = event.targetTouches[0].clientY;
        }
    });
    aElement.addEventListener('click', function (event) {
        var star, s, line,
            d = Math.abs(event.clientX - sx) / window.innerWidth + Math.abs(event.clientY - sy) / (window.innerHeight);
        if (d <= 0.01) {
            star = EC.constellations.nearestStar2D(event.clientX, event.clientY + EC.offsetYmultiplier * EC.offsetY * window.innerHeight);
            EC.clickedStar = star;

            // click on line?
            try {
                line = EC.constellations.nearestLine2D(event.clientX, event.clientY + EC.offsetYmultiplier * EC.offsetY * window.innerHeight);
                //console.log('line', line);
            } catch (e) {
                console.error(e);
            }

            if (aCustomCallback) {
                return aCustomCallback(star, line, event.clientX, event.clientY);
            }

            // d12 click on line will show constellation instead of star
            if (EC.lineClickShowsConstelation) {
                // if star within 5px show star even when line is closer
                if (star && line && line.d < star.distance2D && star.distance2D > 5) {
                    //console.warn('zzz', star, line, 'f', line.star1.star.con || (line && line.star && star.star.clicklabel));
                    //console.log('line is closer');
                    //console.log('line', line);
                    s = '';
                    if (line.d < 0.02 * window.innerWidth || star.distance2D < 0.02 * window.innerWidth) {
                        s = line.star1.star.con || line.star1.star.clicklabel || (star && star.star && star.star.clicklabel);
                    }
                    /*
                    console.log('line', line);
                    console.log('line.star1', line.star1);
                    console.log('star', star);
                    */
                    if (s) {
                        //console.log('ddd');
                        EC.tooltip(event.clientX, event.clientY, EC.translateOne('stars', s), 3);
                        return;
                    }
                }
            }

            //console.log(star);
            if (star && star.star && (star.star.clicklabel || EC.lineClickShowsConstelation)) {
                if (star.distance2D < 0.02 * window.innerWidth) {
                    //console.log('star', star);
                    if (EC.lineClickShowsConstelation) {
                        EC.tooltip(event.clientX, event.clientY, EC.translateOne('stars', star.star.clicklabel || star.star.label || (star.star.name + ' ' + star.star.con)), 3);
                    } else {
                        EC.tooltip(event.clientX, event.clientY, EC.translateOne('stars', star.star.clicklabel), 3);
                    }
                    /*
                    if (star.label && (!star.star || !star.star.name)) {
                        EC.tooltip(event.clientX, event.clientY, star.label, 3);
                    } else {
                        if (star.star) {
                            EC.tooltip(event.clientX, event.clientY, star.star.con + ' ' + star.star.name, 3);
                        }
                    }
                    */
                }
            } else {
                // click on zodiac symbol
                if (star && EC.showZodiacsOnClick && star.zodiac) {
                    if (star.distance2D < 0.02 * window.innerWidth) {
                        s = star.zodiac.replace('.png', '');
                        s = s.charAt(0).toUpperCase() + s.substr(1);
                        EC.tooltip(event.clientX, event.clientY, EC.translateOne('stars', s), 3);
                    }
                }
            }
        }
    }, true);
};

EC.lines = [];

EC.linesUpdate = function () {
    var i;
    for (i = 0; i < EC.lines.length; i++) {
        EC.lines[i].update();
    }
};

EC.line = function (source, target, aFixed, aLocalCoords) {
    var geometry = new THREE.Geometry(),
        material,
        line,
        o = {};
    geometry.dynamic = true;
    function update() {
        if (EC.lineNoUpdate || aFixed) {
            return;
        }
        geometry.vertices[0] = aLocalCoords ? source.position : EC.worldPosition(source);
        geometry.vertices[1] = aLocalCoords ? target.position : EC.worldPosition(target);
        geometry.verticesNeedUpdate = true;
    }
    geometry.vertices.push(EC.worldPosition(source));
    geometry.vertices.push(EC.worldPosition(target));
    geometry.verticesNeedUpdate = true;
    material = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 1 });
    line = new THREE.Line(geometry, material);
    //line.onBeforeRender = update;
    o = {
        geometry: geometry,
        material: material,
        line: line,
        update: update
    };
    EC.lines.push(o);
    EC.scene.add(line);
    return o;
};

EC.dashedLine = function (aSource, aTarget) {
    // Automatic dashed line between 2 meshes
    var geometry = new THREE.Geometry(),
        material,
        line;
    geometry.dynamic = true;

    function update() {
        geometry.vertices[0] = EC.worldPosition(aSource);
        geometry.vertices[1] = EC.worldPosition(aTarget);
        var d = geometry.vertices[0].distanceTo(geometry.vertices[1]);
        geometry.verticesNeedUpdate = true;
        material.dashSize = 0.05 / d;
        material.gapSize = 0.05 / d;
        line.computeLineDistances();
    }
    geometry.vertices.push(EC.worldPosition(aSource));
    geometry.vertices.push(EC.worldPosition(aTarget));
    geometry.verticesNeedUpdate = true;
    material = new THREE.LineDashedMaterial({ color: 0x777777, dashSize: 0.05, gapSize: 0.05 });
    line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    //line.onBeforeRender = update;
    EC.scene.add(line);
    return {
        geometry: geometry,
        material: material,
        line: line,
        update: update
    };
};

EC.handleZoomSlider = function () {
    EC.zoomZ = 0;
    EC.zoomZold = 0;
    var zs = document.getElementById('zoom_slider'),
        plus = document.getElementById('zoom_plus'),
        minus = document.getElementById('zoom_minus');
    if (!zs) {
        return;
    }
    if (zs.min === undefined) {
        zs.min = -40;
    }
    zs.oninput = function (event) {
        EC.userChangedZoom = true;
        var d = -(parseFloat(event.target.value)) / 25,
            v = parseFloat(event.target.value);
        if (EC.cameraZoomLerp) {
            EC.camera.zoom = EC.lerp(v, EC.cameraZoomLerp);
            EC.camera.updateProjectionMatrix();
        } else {
            if (EC.controls.moveForward) {
                EC.controls.moveForward(EC.zoomZold - d);
            } else {
                EC.camera.translateZ(-EC.zoomZold);
                EC.camera.translateZ(d);
            }
        }
        EC.zoomZold = d;
        if (EC.afterZoomCallback) {
            EC.afterZoomCallback(v);
        }
    };
    function kd(event) {
        if (event.key === '-') {
            zs.value = parseFloat(zs.value) + 10;
            zs.oninput({ target: zs });
        }
        if (event.key === '+') {
            zs.value = parseFloat(zs.value) - 10;
            zs.oninput({ target: zs });
        }
    }
    plus.onclick = function () {
        zs.value = parseFloat(zs.value) + 10;
        zs.oninput({ target: zs });
    };
    minus.onclick = function () {
        zs.value = parseFloat(zs.value) - 10;
        zs.oninput({ target: zs });
    };
    EC.keydownFix = kd;
    // window.addEventListener('keydown', kd, true);
};
//EC.handleZoomSlider();

EC.nonJumpingRangeThumb = function (aElement, aThumbWidth) {
    var el = aElement, tx, min, max, moving = false;
    min = parseFloat(el.min);
    max = parseFloat(el.max);
    el.dataFloatValue = parseFloat(el.value);
    // mouse
    el.addEventListener('mousedown', function (event) {
        //cur = event.target;
        if (el.dataFloatValue > max) {
            el.dataFloatValue = max;
        }
        if (el.dataFloatValue < min) {
            el.dataFloatValue = min;
        }
        event.target.focus();
        event.preventDefault();
        tx = event.clientX;
        moving = true;
    }, true);
    window.addEventListener('mousemove', function (event) {
        if (moving) { //event.target === cur) {
            event.preventDefault();
            el.dataFloatValue += (max - min) * (event.clientX - tx) / (el.clientWidth - aThumbWidth);
            /*
            if (el.dataFloatValue > max) {
                el.dataFloatValue = max;
            }
            if (el.dataFloatValue < min) {
                el.dataFloatValue = min;
            }
            */
            el.value = el.dataFloatValue;
            tx = event.clientX;
            el.oninput({ target: el });
        }
    }, true);
    window.addEventListener('mouseup', function () {
        moving = false;
        //cur = null;
    }, true);
    // touch
    el.addEventListener('touchstart', function (event) {
        if (el.dataFloatValue > max) {
            el.dataFloatValue = max;
        }
        if (el.dataFloatValue < min) {
            el.dataFloatValue = min;
        }
        event.target.focus();
        event.preventDefault();
        tx = event.targetTouches[0].clientX;
        el.oninput({ target: el });
    }, true);
    el.addEventListener('touchmove', function (event) {
        event.preventDefault();
        el.dataFloatValue += (max - min) * (event.targetTouches[0].clientX - tx) / (el.clientWidth - aThumbWidth);
        el.value = el.dataFloatValue;
        tx = event.targetTouches[0].clientX;
        el.oninput({ target: el });
    }, true);
};

EC.ticks = function (aInputElement, aLabels, aColors) {
    // Show ticks under slider
    var self = {}, extra_height = 20;
    self.input = typeof aInputElement === 'string' ? document.getElementById(aInputElement) : aInputElement;
    self.canvas = document.createElement('canvas');
    self.context = self.canvas.getContext('2d');
    self.canvas.style.outline = '0px dashed cyan';
    self.canvas.style.position = 'fixed';
    self.canvas.style.pointerEvents = 'none';
    document.body.appendChild(self.canvas);

    self.render = function () {
        var r = self.input.getBoundingClientRect(), x0 = 5, v, x, min, max, step, l, lw, i,
            w = Math.ceil(r.width),
            h = Math.ceil(r.height) + extra_height;
        self.canvas.width = w;
        self.canvas.height = h;
        self.canvas.style.left = Math.floor(r.left) + 'px';
        self.canvas.style.top = (Math.floor(r.top) - extra_height) + 'px';
        self.canvas.style.width = w + 'px';
        self.canvas.style.height = h + 'px';
        self.context.strokeStyle = 'gray';
        self.context.lineWidth = 1;
        // ticks
        self.context.clearRect(0, 0, w, h);
        min = parseFloat(self.input.min);
        max = parseFloat(self.input.max);
        step = parseFloat(self.input.step);
        for (v = min; v <= max; v += step) {
            x = x0 + (w - 2 * x0) * (v - min) / (max - min);
            self.context.beginPath();
            self.context.moveTo(x, extra_height);
            self.context.lineTo(x, h);
            self.context.stroke();
        }
        // label over current tick
        self.context.textBaseline = 'top';
        self.context.font = Math.round(0.618 * r.height) + 'px sans-serif';
        v = parseFloat(self.input.value);
        x = x0 + (w - 2 * x0) * (v - min) / (max - min);
        i = Math.round((aLabels.length - 1) * (v - min) / (max - min));
        self.context.fillStyle = (aColors && aColors[i]) || 'black';
        l = aLabels[i];
        lw = self.context.measureText(l).width;
        x = x - lw / 2;
        if (x < 0) {
            x = 0;
        }
        if (x + lw > w) {
            x = w - lw;
        }
        self.context.fillText(l, x, 2);
    };

    window.addEventListener('resize', self.render);
    self.input.addEventListener('input', self.render);
    self.input.addEventListener('change', self.render);
    self.render();

    return self;
};

if (!Math.sign) {
    Math.sign = function (x) {
        // If x is NaN, the result is NaN.
        // If x is -0, the result is -0.
        // If x is +0, the result is +0.
        // If x is negative and not -0, the result is -1.
        // If x is positive and not +0, the result is +1.
        return ((x > 0) - (x < 0)) || +x;
        // A more aesthetic pseudo-representation:
        //
        // ( (x > 0) ? 1 : 0 )  // if x is positive, then positive one
        //          +           // else (because you can't be both - and +)
        // ( (x < 0) ? -1 : 0 ) // if x is negative, then negative one
        //         ||           // if x is 0, -0, or NaN, or not a number,
        //         +x           // then the result will be x, (or) if x is
        //                      // not a number, then x converts to number
    };
}

EC.ticksNonLinear = function (aInputElement, aValuesAndLabels, aTooltips) {
    // Show non-linear ticks under slider
    var self = {}, extra_height = 20;
    self.input = typeof aInputElement === 'string' ? document.getElementById(aInputElement) : aInputElement;
    self.canvas = document.createElement('canvas');
    self.context = self.canvas.getContext('2d');
    self.canvas.style.outline = '0px dashed cyan';
    self.canvas.style.position = 'fixed';
    self.canvas.style.pointerEvents = 'none';
    document.body.appendChild(self.canvas);

    self.tooltipRectangles = [];

    self.render = function () {
        var r = self.input.getBoundingClientRect(), x0 = 5, x, min, max, lw, k, cr,
            w = Math.ceil(r.width),
            h = Math.ceil(r.height) + extra_height;
        self.canvas.width = w;
        self.canvas.height = h;
        self.canvas.style.left = Math.floor(r.left) + 'px';
        self.canvas.style.top = (Math.floor(r.top) - extra_height) + 'px';
        self.canvas.style.width = w + 'px';
        self.canvas.style.height = h + 'px';
        //aInputElement.parentElement.title = 'asdf';
        self.context.strokeStyle = 'gray';
        self.context.lineWidth = 1;
        cr = self.canvas.getBoundingClientRect(),
            // ticks
            self.context.clearRect(0, 0, w, h);
        min = parseFloat(self.input.min);
        max = parseFloat(self.input.max);
        self.tooltipRectangles = [];
        for (k in aValuesAndLabels) {
            if (aValuesAndLabels.hasOwnProperty(k)) {
                x = x0 + (w - 2 * x0) * (aValuesAndLabels[k] - min) / (max - min);
                self.context.beginPath();
                self.context.moveTo(x, extra_height);
                self.context.lineTo(x, h);
                self.context.stroke();
                // label
                self.context.textAlign = 'left';
                self.context.textBaseline = 'top';
                self.context.font = Math.round(0.618 * r.height) + 'px sans-serif';
                lw = self.context.measureText(k).width;
                x = x - lw / 2;
                if (x < 0) {
                    x = 0;
                }
                if (x + lw > w) {
                    x = w - lw;
                }
                self.context.fillText(k, x, 2);
                // extra element for tooltip
                //self.context.strokeRect(x, 2, lw, Math.round(0.618 * r.height));
                //if (self.tooltipRectangles.hasOwnProperty(k)) =
                self.tooltipRectangles.push({ k: k, x: cr.x + x, y: cr.y + 2, w: lw, h: Math.round(0.618 * r.height) });

            }
        }
    };

    window.addEventListener('mousemove', function (event) {
        // show tooltips above labels
        if (!aTooltips) {
            return;
        }
        var i, r, x = event.pageX, y = event.pageY, b = false;
        for (i = 0; i < self.tooltipRectangles.length; i++) {
            r = self.tooltipRectangles[i];
            //console.log(x, y, r);
            if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
                self.input.parentElement.title = aTooltips[r.k];
                b = true;
                //console.warn('ano', r.k);
            }
        }
        if (!b) {
            self.input.parentElement.title = '';
        }
    });
    window.addEventListener('resize', self.render);
    self.input.addEventListener('input', self.render);
    self.input.addEventListener('change', self.render);
    self.render();

    return self;
};

EC.boundingBox = function (aMesh) {
    // Return bounding box of a mesh
    var box = new THREE.Box3().setFromObject(aMesh),
        v = new THREE.Vector3();
    box.getSize(v);
    return v;
};

EC.vectorSub = function (a, b) {
    // Return subtraction fo 2 vectors
    return new THREE.Vector3(b.x - a.x, b.y - a.y, a.z - a.z);
};

EC.floatToStr = function (aNumber, aDigits) {
    // Convert float to string while respecting language
    aNumber = aNumber || 0;
    var lang = EC.language();
    aDigits = aDigits === undefined ? 1 : aDigits;
    if (lang === 'fr' || lang === 'pt') {
        return aNumber.toFixed(aDigits).replace(/\./g, ',').replace('-', '–');
    }
    return aNumber.toFixed(aDigits).replace('-', '–');
    //return aNumber.toLocaleString(EC.language() || 'en', {minimumFractionDigits: aDigits, maximumFractionDigits: aDigits});
};

EC.floatToStrStr = function (aStringWithNumber) {
    // Replace dot with comma in numbers
    return aStringWithNumber.replace(/\./g, ',');
};

EC.zoomOut = function (aAmount) {
    // Zoom out
    if (EC.camera.type === 'OrthographicCamera') {
        EC.camera.zoom -= 0.5 * aAmount;
        EC.camera.updateProjectionMatrix();
        return;
    }
    if (EC.controls.moveForward) {
        EC.controls.moveForward(-aAmount);
    } else {
        EC.camera.translateZ(aAmount);
    }
};

EC.extremesFit = function () {
    // Return true if extremes fit screen
    var i, s, r = EC.renderer.domElement.getBoundingClientRect(), inside, all_inside = true;
    for (i = 0; i < EC.extremes.length; i++) {
        s = EC.toScreenXY(EC.worldPosition(EC.extremes[i].mesh));
        inside = (s.x >= r.x) && (s.x <= r.x + r.width) && (s.y + r.y >= 0) && (s.y + r.y <= window.innerHeight);
        if (!inside) {
            all_inside = false;
            break;
        }
    }
    return all_inside;
};

EC.extremesRestart = function () {
    // Force extremes finding on (after resize)
    EC.extremesOk = false;
    EC.extremesStarted = false;
};
window.addEventListener('resize', EC.extremesRestart);

EC.extremesUpdate = function () {
    // Zoom in/out unil extremes fit screen perfectly
    if (!EC.extremes) {
        return;
    }
    if (EC.extremesOk) {
        return;
    }
    if (EC.userChangedZoom) {
        return;
    }
    if (!EC.extremesStarted) {
        EC.labels.canvas.style.opacity = 0;
        EC.extremesStarted = true;
        EC.extremesTarget = !EC.extremesFit();
        if (EC.extremesTarget) {
            EC.extremesDir = 0.2;
        } else {
            EC.extremesDir = -0.2;
        }
        return;
    }
    if (EC.extremesFit() === EC.extremesTarget) {
        setTimeout(function () {
            EC.labels.canvas.style.opacity = 1;
        }, 300);
        EC.extremesOk = true;
    } else {
        EC.zoomOut(EC.extremesDir);
    }
};

EC.createExtremes = function () {
    // Place extreme points
    var i, d, k = document.location.pathname.split('/').slice(-1)[0].replace('.src', ''), ex = ECT.extremes[k], show = EC.getUrlParam('extremes') === 'true'; // slice is shallow, values are strings
    if (!ex) {
        return;
    }
    EC.extremes = [];
    for (i = 0; i < ex.length; i++) {
        d = EC.createDot(0.1, 0x00ff00, 1);
        d.mesh.position.set(ex[i][0], ex[i][1], ex[i][2]);
        d.mesh.visible = show;
        EC.extremes.push(d);
    }
    return k;
};

EC.createAnchor = function () {
    // Create new object and make it new scene
    var o = new THREE.Object3D();
    EC.scene.add(o);
    EC.scene = o;
    return o;
};

window.addEventListener('DOMContentLoaded', function () {
    // var e = EC.elements('instructions'), lang, id;
    // if (e.instructions) {
    //     e.instructions.onclick = EC.instructionsPopup;
    // }
    // e = document.getElementById('sliders');
    // if (e) {
    //     e = e.getElementsByTagName('input');
    //     if (e && e[0]) {
    //         e[0].focus();
    //     }
    // }
    // EC.handleZoomSlider();

    // // tooltips
    // lang = EC.language();
    // if (ECT.tooltips && ECT.tooltips[lang]) {
    //     for (id in ECT.tooltips[lang]) {
    //         if (ECT.tooltips[lang].hasOwnProperty(id)) {
    //             e = document.getElementById(id);
    //             if (e) {
    //                 e.setAttribute('title', ECT.tooltips[lang][id]);
    //             }
    //         }
    //     }
    // }

});

EC.pinchZoom = function (aCallbackDelta) {
    // Pinch zoom on mobile
    var pinchDistance = 0,
        pinchDistanceOld = 0,
        pinchDiff;

    window.addEventListener('touchstart', function (event) {
        if (event.touches.length === 2) {
            var dx = event.touches[0].clientX - event.touches[1].clientX,
                dy = event.touches[0].clientY - event.touches[1].clientY;
            pinchDistanceOld = pinchDistance;
            pinchDistance = Math.sqrt(dx * dx + dy * dy);
            pinchDiff = pinchDistance - pinchDistanceOld;
        }
    });

    window.addEventListener('touchmove', function (event) {
        if (event.touches.length === 2) {
            var dx = event.touches[0].clientX - event.touches[1].clientX,
                dy = event.touches[0].clientY - event.touches[1].clientY;
            pinchDistanceOld = pinchDistance;
            pinchDistance = Math.sqrt(dx * dx + dy * dy);
            pinchDiff = pinchDistance - pinchDistanceOld;
            aCallbackDelta(-pinchDiff);
            //event.preventDefault();
            event.cancelBubble = true;
        }
    }, true);
};

EC.manualZoom = function (aCanvas, aDefault, aMin, aMax, aStep, aCallbackValue) {
    // Handle zoom slider, +, - manually
    var zoom_slider = document.getElementById('zoom_slider'),
        zoom_plus = document.getElementById('zoom_plus'),
        zoom_minus = document.getElementById('zoom_minus');
    EC.zoom = aDefault;
    zoom_slider.value = EC.zoom;
    zoom_slider.oninput = function (event) {
        EC.zoom = parseFloat(event.target.value);
        aCallbackValue(EC.zoom);
    };
    function extremes() {
        if (EC.zoom > aMax) {
            EC.zoom = aMax;
        }
        if (EC.zoom < aMin) {
            EC.zoom = aMin;
        }
    }
    zoom_plus.onclick = function () {
        EC.zoom += 4 * aStep;
        extremes();
        zoom_slider.value = EC.zoom;
        zoom_slider.dataFloatValue = EC.zoom;
        aCallbackValue(EC.zoom);
    };
    zoom_minus.onclick = function () {
        EC.zoom -= 4 * aStep;
        extremes();
        zoom_slider.value = EC.zoom;
        zoom_slider.dataFloatValue = EC.zoom;
        aCallbackValue(EC.zoom);
    };
    aCanvas.addEventListener('wheel', function (event) {
        if (event.ctrlKey === false) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        EC.zoom += event.deltaY > 0 ? -4 * aStep : 4 * aStep;
        extremes();
        zoom_slider.value = EC.zoom;
        zoom_slider.dataFloatValue = EC.zoom;
        aCallbackValue(EC.zoom);
    }, true);
    EC.pinchZoom(function (aDelta) {
        EC.zoom += aDelta > 0 ? -4 * aStep : 4 * aStep;
        extremes();
        zoom_slider.value = EC.zoom;
        zoom_slider.dataFloatValue = EC.zoom;
        aCallbackValue(EC.zoom);
    });
};

EC.globalsSnapshot = function () {
    delete EC.texturesCache;
    delete EC.translationsUsed;
    delete EC.scene;
    delete EC.sceneOld;
    delete EC.sun;
    delete EC.sunSphere;
    delete EC.sunRing;
    delete EC.earthSphere;
    delete EC.earthSphereNorth;
    delete EC.earthSphereSouth;
    delete EC.equator;
    delete EC.earthAxis;
    delete EC.earthFlat;
    delete EC.earthFlatPlane;
    delete EC.sunRingFlat;
    delete EC.earthFlatAxis;
    delete EC.focusDot;
    delete EC.ruDot;
    delete EC.earthShadow;
    delete EC.earthSphereParent;
    delete EC.penumbraCone;
    delete EC.shadowCone;
    delete EC.shadowCone2;
    delete EC.shadow;
    delete EC.earth;
    delete EC.labels;
    delete EC.camera;
    delete EC.cameraInitial;
    delete EC.renderer;
    delete EC.controls;
    delete EC.ambientLight;
    delete EC.e;
    delete EC.cameraZoomLerp;
    return JSON.stringify(EC, undefined, 4);
};

/*
window.addEventListener('click', function () {
    if (window.parent) {
        window.parent.postMessage("diagram_ready");
    }
});
window.addEventListener('touchstart', function () {
    if (window.parent) {
        window.parent.postMessage("diagram_ready");
    }
});
*/

window.addEventListener('error', function (e) {
    var i = document.getElementById('instructions');
    if (i) {
        i.style.backgroundColor = 'red';
        i.onclick = function () {
            alert(e.message + '\n' + e.filename + '\nLine:' + e.lineno + '\nColumn:' + e.colno);
        };
    }
});


EC.canvasSamplingBroken = function () {
    // Return true if canvas has broken downsampling (ragged edges when resizing down image with sharp edges)
    if (EC.firefoxBrokenSamplingCache !== undefined) {
        return EC.firefoxBrokenSamplingCache;
    }
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    EC.firefoxBrokenSamplingCache = typeof context.mozImageSmoothingEnabled === 'boolean';
    return EC.firefoxBrokenSamplingCache;
};

EC.selectOnSameValueClick = function (aElement, aCallback) {
    // Call aCallback even when select was not changed and user chose same value
    var i, options = aElement.getElementsByTagName('option'), t, old,
        //select_time, option_time,
        change_time,
        isFirefox = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    // measure time when option was clicked
    function measureTime() {
        console.log('click on option');
        t = Date.now();
    }
    if (window.navigator.maxTouchPoints) {
        // on mobile it cannot be detected but at least it wont be broken
        return;
    }
    if (isFirefox) {
        // firefox
        for (i = 0; i < options.length; i++) {
            options[i].addEventListener('click', measureTime);
        }
        window.setInterval(function () {
            if (aElement.value === old && (Date.now() - t < 300)) {
                console.log('ff same option click');
                aCallback({ target: aElement });
            }
            old = aElement.value;
        }, 300);
    } else {
        // chrome and others
        aElement.addEventListener('change', function (event) {
            console.log('change', event.target.nodeName, event);
            change_time = Date.now();
        });
        aElement.addEventListener('click', function (event) {
            console.log('click', event.target.nodeName, event);
            if (event.x === 0 && event.y === 0) {
                console.log('option click', event.target.nodeName, event);
                if (Date.now() - change_time < 300) {
                    console.log('ignored option click');
                    return;
                }
                aCallback({ target: aElement });
            }
        });
    }
};

EC.shuffle = function (aArray) {
    // Return randomized shallow copy, from CA library, MIT license
    var i, j, temp, r = aArray.slice(); // slice is shallow
    for (i = r.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = r[i];
        r[i] = r[j];
        r[j] = temp;
    }
    return r;
};

EC.buttonDropdown = function (aButton, aValues, aCallback) {
    // Custom dropdown, can detect click on already selected item
    var self = {}, k, div;
    self.button = typeof aButton === 'string' ? document.getElementById(aButton) : aButton;
    self.button.classList.add('buttonDropdown');

    self.dropdown = document.createElement('div');
    self.dropdown.style.position = 'fixed';
    self.dropdown.style.backgroundColor = 'white';
    self.dropdown.style.color = 'black';
    self.dropdown.style.border = '1px solid #767676';
    self.dropdown.style.boxShadow = '0.3ex 0.3ex 0.3ex rgba(0,0,0,0.15)';
    self.dropdown.style.fontSize = 'small';
    self.dropdown.style.userSelect = 'none';
    self.dropdown.style.display = 'none';
    self.dropdown.style.boxSizing = 'border-box';
    document.body.appendChild(self.dropdown);

    self.style = document.createElement("style");
    self.style.type = "text/css";
    self.style.textContent = '.buttonDropdown:after { content: "▾"; padding-left: 1ex; }';
    document.head.appendChild(self.style);

    function hide() {
        self.dropdown.style.display = 'none';
    }

    function mouseover(event) {
        event.target.style.backgroundColor = 'skyblue';
    }

    function mouseout(event) {
        event.target.style.backgroundColor = '';
    }

    function click(event) {
        self.button.textContent = event.target.dataValue;
        aCallback(event.target.dataKey);
        hide();
    }

    for (k in aValues) {
        if (aValues.hasOwnProperty(k)) {
            div = document.createElement('div');
            div.dataKey = k;
            div.dataValue = aValues[k];
            div.textContent = aValues[k];
            div.style.padding = '0.2ex';
            div.addEventListener('mouseover', mouseover);
            div.addEventListener('mouseout', mouseout);
            div.addEventListener('click', click);
            self.dropdown.appendChild(div);
        }
    }

    self.button.addEventListener('click', function () {
        var r = self.button.getBoundingClientRect();
        self.dropdown.style.left = r.left + 'px';
        self.dropdown.style.top = (r.top + r.height) + 'px';
        self.dropdown.style.minWidth = r.width + 'px';
        if (self.dropdown.style.display === 'block') {
            hide();
        } else {
            self.dropdown.style.display = 'block';
        }
    });

    window.addEventListener('click', function (event) {
        var e = event.target;
        while (e) {
            if (e === self.dropdown || e === self.button) {
                return;
            }
            e = e.parentElement;
        }
        hide();
    });

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            hide();
        }
    });

    return self;
};

EC.canvas = function (aId) {
    // Handle canvas
    var self = {}, w, h;
    self.canvas = document.getElementById(aId);
    self.context = self.canvas.getContext('2d');
    self.canvas.context = self.context;
    self.shrinkBeforeResize = false;

    self.clear = function () {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
    };

    self.lineAcross = function () {
        self.context.globalCompositeOperation = 'source-over';
        self.context.globalAlpha = 1;
        self.context.strokeStyle = 'black';
        self.context.lineWidth = 1;
        self.context.beginPath();
        self.context.moveTo(0, 0);
        self.context.lineTo(self.canvas.width, self.canvas.height);
        self.context.stroke();
    };

    self.resize = function () {
        if (self.shrinkBeforeResize) {
            self.canvas.width = 1;
            self.canvas.height = 1;
        }
        w = self.canvas.clientWidth;
        h = self.canvas.clientHeight;
        self.canvas.width = w;
        self.canvas.height = h;
        self.context.clearRect(0, 0, w, h);
        if (self.render) {
            self.render();
        }
    };

    window.addEventListener('resize', self.resize);
    self.resize();

    return self;
};

EC.star2d = function (aContext, aX, aY, aSize, aColor) {
    // draw 5-pointed star
    var i, a, s, x, y;
    aContext.strokeStyle = 'black';
    aContext.lineWidth = 1;
    aContext.fillStyle = aColor || 'yellow';
    aContext.beginPath();
    for (i = 0; i < 10; i++) {
        a = 2 * Math.PI * i / 10;
        s = i % 2 === 1 ? aSize : 0.5 * aSize;
        x = aX + s * Math.sin(a);
        y = aY + s * Math.cos(a);
        if (i === 0) {
            aContext.moveTo(x, y);
        } else {
            aContext.lineTo(x, y);
        }
    }
    aContext.closePath();
    aContext.fill();
    //aContext.stroke();
};

EC.fitTooltipOnScreen = function (aElement) {
    // Fit tooltip element on screen
    var cur = aElement.getBoundingClientRect();
    // keep inside canvas
    if (cur.x < 0) {
        cur.x = 0;
    }
    if (cur.y < 0) {
        cur.y = 0;
    }
    if (cur.x + cur.width > window.innerWidth) {
        cur.x = window.innerWidth - cur.width;
    }
    if (cur.y + cur.height > window.innerHeight) {
        cur.y = window.innerHeight - cur.height;
    }
    aElement.style.left = cur.x + 'px';
    aElement.style.top = cur.y + 'px';
};

EC.clickWithoutDrag = function (aElementOrId, aCallback) {
    // detect click on element without draging path being too long
    var e = typeof aElementOrId === 'string' ? document.getElementById(aElementOrId) : aElementOrId,
        moving,
        distance = 0,
        x,
        y;
    e.addEventListener('mousedown', function (event) {
        if (event.which === 1) {
            distance = 0;
            x = event.clientX;
            y = event.clientY;
            moving = true;
        }
    });
    e.addEventListener('mousemove', function (event) {
        if (moving) {
            distance += Math.abs(event.clientX - x) + Math.abs(event.clientY - y);
            x = event.clientX;
            y = event.clientY;
        }
    });
    e.addEventListener('click', function (event) {
        //console.log('distance', distance);
        if (distance < 0.05 * Math.min(window.innerWidth, window.innerHeight)) {
            aCallback(event);
        }
    });
};

EC.polygon = function (aCanvas, aPoints, aStrokeStyle, aFillStyle) {
    // Draw polygon
    if (!aPoints) {
        return;
    }
    var i, x, y;
    aCanvas.context.globalCompositeOperation = "source-over";
    aCanvas.context.strokeStyle = aStrokeStyle || 'lime';
    aCanvas.context.fillStyle = aFillStyle || 'white';
    aCanvas.context.lineWidth = 1;
    aCanvas.context.beginPath();
    for (i = 0; i < aPoints.length; i++) {
        x = aPoints[i][0];
        y = aPoints[i][1];
        if (i === 0) {
            aCanvas.context.moveTo(x, y);
        } else {
            aCanvas.context.lineTo(x, y);
        }
    }
    aCanvas.context.closePath();
    if (aStrokeStyle) {
        aCanvas.context.stroke();
    }
    if (aFillStyle) {
        aCanvas.context.fill();
    }
};

