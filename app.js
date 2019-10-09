let ws = null;

let cloudParticles = [];
let scene = new THREE.Scene();
let loader = new THREE.TextureLoader();
let nebula;

let ambient = new THREE.AmbientLight(0x555555);
scene.add(ambient);

let directionalLight = new THREE.DirectionalLight(0xffffaa, 0.9, 500);
directionalLight.position.set(80, 80, 1200);
scene.add(directionalLight);

let orangeLight = new THREE.SpotLight(0xcc6600, 4, 2050);
orangeLight.position.set(0, 100, 400);
scene.add(orangeLight);

let redLight = new THREE.SpotLight(0xd8547e, 4, 2050);
redLight.position.set(100, 100, 400);
scene.add(redLight);

let blueLight = new THREE.SpotLight(0x3677ac, 4, 2050);
blueLight.position.set(-50, 100, 400);
scene.add(blueLight);

let osSolarSystemSunPivotPoint, osSolarSystemSun;
let macOsPivotPoint;
let macOsPlanet, linuxPlanet, windowsPlanet;

// ?
// let osSolarSystemLight = new THREE.SpotLight(0xffffff, 0.2, 350);
// osSolarSystemLight.position.set(-40, 40, 900);
// scene.add(osSolarSystemLight);

let osSolarSystemSunLight = new THREE.PointLight(0xffffff, 3, 300);
osSolarSystemSunLight.position.set(25, 38, 560);
scene.add(osSolarSystemSunLight);

let osSolarSystemSunLightOn = new THREE.PointLight(0xffffff, 0.2, 55);
osSolarSystemSunLightOn.position.set(40, 40, 619);
scene.add(osSolarSystemSunLightOn);

let languageSolarSystemSunPivotPoint, languageSolarSystemSun;
// let langPlanetJS;

scene.fog = new THREE.FogExp2(0x000000, 0.001);

let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.z = 1000;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(scene.fog.color);
document.body.appendChild(renderer.domElement);

createNebula();
createOsSolarSystem();
createLanguageSolarSystem();

let buffer = 0;

let osMacOs = 0;
let osLinux = 0;
let osWindows = 0;

let osMacOsMoons = [],
    osLinuxMoons = [],
    osWindowsMoons = [];
for (i = 0; i < 10; i++) {
    console.log(i);
    osMacOsMoons.push([1 * (Math.pow(2, i)) * 100, false]);
    osLinuxMoons.push([1 * (Math.pow(2, i)) * 100, false]);
    osWindowsMoons.push([1 * (Math.pow(2, i)) * 100, false]);
}

let linusPivotPoints = [];
let macOsPivotPoints = [];
let windowsPivotPoints = [];


window.addEventListener('resize', onWindowResize, false);

let onmessage = function (e) {
    if (e.data[0] != '{') return;
    buffer++;
    let data = JSON.parse(e.data);
    let os = data.data.config.os;

    if (os === 'linux' || os === 'linux-ppc64le') {
        osLinux++;
    } else if (os === 'osx') {
        osMacOs++;
    } else if (os === 'windows') {
        osWindows++;
    }
};

function loop() {
    requestAnimationFrame(loop);
    update();
    render();
}

function update() {
    nebulaShrink();
    rotateNebulaParts(cloudParticles);
    updateSolarSystems();
}

function render() {
    renderer.render(scene, camera);
}

function nebulaPulse() {
    nebulaGrow();

    // add sound method here Johan
}

function nebulaGrow() {
    console.log('mac: ' + osMacOs);
    console.log('linux: ' + osLinux);
    let grow = setInterval(function () {
        if (nebula.scale.x < 2) {
            nebula.scale.x += 0.002;
            nebula.scale.z += 0.002;
            nebula.scale.y += 0.002;
        }

        if (nebula.scale.x >= 0.8 + (buffer / 500)) {
            clearInterval(grow);
            buffer = 0;
        }
    }, 2);
}

function nebulaShrink() {
    if (nebula.scale.x > 0.3) {
        nebula.scale.x -= 0.001;
        nebula.scale.z -= 0.001;
        nebula.scale.y -= 0.001;
    }
    nebula.rotation.z -= 0.0006;
}

function createNebula() {
    nebula = new THREE.Object3D();
    loader.load("images/nebula/smoke-1.png", function (texture) {
        let cloudGeo = new THREE.PlaneBufferGeometry(200, 200);
        let cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });

        for (let p = 0; p < 60; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random() * 150 - 75,
                10 - Math.random() * 20,
                300 - Math.random() * 1200);

            cloud.rotation.y = 0.002;
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.35;
            cloudParticles.push(cloud);
            nebula.add(cloud);
        }
    });
    scene.add(nebula);
}

function createOsSolarSystem() {

    /*
     * SUN
     */
    const sunGeo = new THREE.SphereGeometry(2, 60, 60);
    const sunMat = new THREE.MeshLambertMaterial();
    sunMat.map = THREE.ImageUtils.loadTexture('images/plutomap2k.jpg')
    osSolarSystemSun = new THREE.Mesh(sunGeo, sunMat);

    osSolarSystemSun.position.x = 40;
    osSolarSystemSun.position.y = 40;
    osSolarSystemSun.position.z = 600;

    osSolarSystemSunPivotPoint = new THREE.Object3D();
    osSolarSystemSun.add(osSolarSystemSunPivotPoint);

    /*
     * MacOS Planet
     */
    const macGeo = new THREE.SphereGeometry(3, 70, 70);
    const macMat = new THREE.MeshLambertMaterial();
    macMat.map = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg')
    macOsPlanet = new THREE.Mesh(macGeo, macMat);
    macOsPlanet.position.set(Math.sin(360/4)*20, -3, Math.cos(360/4)*20);
    macOsPlanet.rotation.x = 0.15;
    osSolarSystemSunPivotPoint.add(macOsPlanet);

    /*
     * Linus Planet
     */
    const linGeo = new THREE.SphereGeometry(3, 70, 70);
    const linMat = new THREE.MeshLambertMaterial();
    linMat.map = THREE.ImageUtils.loadTexture('images/jupiter.jpg')
    linuxPlanet = new THREE.Mesh(linGeo, linMat);
    linuxPlanet.position.set(Math.sin((360/4)*2)*20, -3, Math.cos((360/4)*2)*20);
    linuxPlanet.rotation.x = 0.15;
    osSolarSystemSunPivotPoint.add(linuxPlanet);

    /*
     * Windows Planet
     */
    const winGeo = new THREE.SphereGeometry(3, 70, 70);
    const winMat = new THREE.MeshLambertMaterial();
    winMat.map = THREE.ImageUtils.loadTexture('images/uranusmap.jpg')
    windowsPlanet = new THREE.Mesh(winGeo, winMat);
    // langPlanetJS.position.set(Math.sin((360/14)*i)*20, -3, Math.cos((360/14)*i)*20);
    windowsPlanet.position.set(Math.sin((360/4)*3)*20, -3, Math.cos((360/4)*3)*20);
    windowsPlanet.rotation.x = 0.15;
    osSolarSystemSunPivotPoint.add(windowsPlanet);

    scene.add(osSolarSystemSun);

}

function createLanguageSolarSystem() {
    const sunGeo = new THREE.SphereGeometry(2, 60, 60);
    const sunMat = new THREE.MeshLambertMaterial();
    sunMat.map = THREE.ImageUtils.loadTexture('images/plutomap2k.jpg')
    languageSolarSystemSun = new THREE.Mesh(sunGeo, sunMat);

    languageSolarSystemSun.position.x = -40;
    languageSolarSystemSun.position.y = -40;
    languageSolarSystemSun.position.z = 600;

    languageSolarSystemSunPivotPoint = new THREE.Object3D();
    languageSolarSystemSun.add(languageSolarSystemSunPivotPoint);

    /*
     * Planets <3
     */

    for (i = 0; i < 3; i++) {
        const langPlanetGeo = new THREE.SphereGeometry(3, 70, 70);
        const langPlanetMat = new THREE.MeshLambertMaterial();
        langPlanetMat.map = THREE.ImageUtils.loadTexture('images/uranusmap.jpg')
        let langPlanetJS = new THREE.Mesh(langPlanetGeo, langPlanetMat);
        langPlanetJS.position.set(Math.sin((360/4)*i)*20, -3, Math.cos((360/4)*i)*20);
        //    windowsPlanet.rotation.x = 0.15;
        languageSolarSystemSunPivotPoint.add(langPlanetJS);
    }
    //    const langPlanetGeo = new THREE.SphereGeometry(3, 70, 70);
    //    const langPlanetMat = new THREE.MeshLambertMaterial();
    //    langPlanetMat.map = THREE.ImageUtils.loadTexture('images/uranusmap.jpg')
    //    langPlanetJS = new THREE.Mesh(langPlanetGeo, langPlanetMat);
    //    langPlanetJS.position.set(10, -3, -20);
    // //    windowsPlanet.rotation.x = 0.15;
    // languageSolarSystemSunPivotPoint.add(langPlanetJS);

    scene.add(languageSolarSystemSun);
}

/*
 * Rotates att the nebula parts, in different speed for sick effect.
 */
function rotateNebulaParts(nebula) {
    if (Math.floor(Math.random() * 100) === 3) {
        shuffleArray(nebula);


    }
    nebula.forEach((neb, i) => {
        if (i % 3 === 0) {
            neb.rotation.z += 0.0016;
        } else if (i % 5 === 0) {
            neb.rotation.z += 0.0022;
        } else {
            neb.rotation.z += 0.001;
        }
    });
}

function addOsMoon(pivotPoint) {
    const moonGeo = new THREE.SphereGeometry(1, 70, 70);
    const moonMat = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    // moonMat.map = THREE.ImageUtils.loadTexture('images/jupiter.jpg')
    let moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(4, 0, 4);
    pivotPoint.add(moon);
}

function updateMoons() {
    osMacOsMoons.forEach((moonMap, i) => {
        if (osMacOs >= moonMap[0] && moonMap[1] === false) {
            let pivPoint = new THREE.Object3D();
            let rotationSpeed = Math.random() * 5 / 200 + 0.01;
            if (i % 2 === 0) {
                rotationSpeed = -rotationSpeed;
            }
            pivPoint.rotation.x = +Math.random() * 2;
            macOsPlanet.add(pivPoint);
            macOsPivotPoints.push([pivPoint, rotationSpeed]);
            addOsMoon(pivPoint);
            moonMap[1] = true;

        }
    });

    osLinuxMoons.forEach((moonMap, i) => {
        if (osLinux >= moonMap[0] && moonMap[1] === false) {
            let pivPoint = new THREE.Object3D();
            let rotationSpeed = Math.random() * 5 / 200 + 0.01;
            if (i % 2 === 0) {
                rotationSpeed = -rotationSpeed;
            }
            pivPoint.rotation.x = +Math.random() * 2;
            linuxPlanet.add(pivPoint);
            linusPivotPoints.push([pivPoint, rotationSpeed]);
            addOsMoon(pivPoint);
            moonMap[1] = true;

        }
    });
    osWindowsMoons.forEach((moonMap, i) => {
        if (osWindows >= moonMap[0] && moonMap[1] === false) {
            let pivPoint = new THREE.Object3D();
            let rotationSpeed = Math.random() * 5 / 200 + 0.01;
            if (i % 2 === 0) {
                rotationSpeed = -rotationSpeed;
            }
            pivPoint.rotation.x = +Math.random() * 2;
            windowsPlanet.add(pivPoint);
            windowsPivotPoints.push([pivPoint, rotationSpeed]);
            addOsMoon(pivPoint);
            moonMap[1] = true;

        }
    });

}

function updateSolarSystems() {

    var time = Date.now() * 0.0001;
    osSolarSystemSun.position.x = osSolarSystemSun.position.x + Math.cos(time * 10) * 0.01;
    osSolarSystemSun.position.y = osSolarSystemSun.position.y + Math.cos(time * 70) * 0.015;
    // osSolarSystemSun.position.z = Math.cos( time * 8 ) * 4;

    osSolarSystemSunPivotPoint.rotation.y += 0.018;
    osSolarSystemSun.rotation.y -= 0.003;

    languageSolarSystemSunPivotPoint.rotation.y -= 0.012;

    macOsPlanet.rotation.y -= 0.02;
    linuxPlanet.rotation.y -= 0.02;
    windowsPlanet.rotation.y -= 0.02;

    updateMoons();
    rotateMoons();
}

function rotateMoons() {
    linusPivotPoints.forEach((pp) => {
        pp[0].rotation.y += pp[1];
        // pp[0].rotation.y -= pp[1] / 400;
    });
    macOsPivotPoints.forEach((pp) => {
        pp[0].rotation.y += pp[1];
        // pp[0].rotation.y -= pp[1] / 400;
    });
    windowsPivotPoints.forEach((pp) => {
        pp[0].rotation.y += pp[1];
        // pp[0].rotation.y -= pp[1] / 400;
    });
}

/*
 * Using Fisher–Yates shuffle. Read more about it here 
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function shuffleArray(array) {
    var currentIndex = array.length,
        tempValue, randomIndex;
    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        tempValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempValue;
    }
    return array;
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function startWS() {
    ws = new WebSocket('wss://travis.durieux.me/');
    if (onmessage != null) {
        ws.onmessage = onmessage;
    }
    ws.onclose = function () {
        setTimeout(function () {
            startWS()
        }, 5000);
    };
}

loop();
setInterval(nebulaPulse, 3000);
startWS();