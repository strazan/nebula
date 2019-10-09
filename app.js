let ws = null;

let cloudParticles = [];
let scene = new THREE.Scene();
let loader = new THREE.TextureLoader();
let nebula;
let osSolarSystemSunPivotPoint, osSolarSystemSun;
let macOsPivotPoint;

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

// ?
let osSolarSystemLight = new THREE.SpotLight(0xffffff, 0.2, 350);
osSolarSystemLight.position.set(-40, 40, 900);
scene.add(osSolarSystemLight);

let osSolarSystemSunLight = new THREE.PointLight(0xffffff, 0.8, 100);
osSolarSystemSunLight.position.set(40, 40, 600);
scene.add(osSolarSystemSunLight);

let osSolarSystemSunLightOn = new THREE.PointLight(0xffffff, 0.2, 55);
osSolarSystemSunLightOn.position.set(40, 40, 619);
scene.add(osSolarSystemSunLightOn);

scene.fog = new THREE.FogExp2(0x000000, 0.001);



let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.z = 1000;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(scene.fog.color);
document.body.appendChild(renderer.domElement);

createNebula();
createOsSolarSystem();

let buffer = 0;
let osMacOs = 0;
let osMacOsMoons = [[100,false],[200,false],[400,false],[800,false],[1600,false],[3200,false]];
let osLinux = 0;
let osWindows = 0;


window.addEventListener('resize', onWindowResize, false);

let onmessage = function (e) {
    if (e.data[0] != '{') return;
    buffer++;
    let data = JSON.parse(e.data);
    let os = data.data.config.os;
    
    if(os === 'linux' || os === 'linux-ppc64le'){
        osLinux++;
    } else  if(os === 'osx'){
        osMacOs++;
    } else if(os === 'windows'){
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
console.log(osMacOs);
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
    const sunGeo = new THREE.SphereGeometry(5, 60, 60);
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
    macMat.map = THREE.ImageUtils.loadTexture('images/uranusmap.jpg')
    let macOsPlanet = new THREE.Mesh(macGeo, macMat);
    macOsPlanet.position.set(20, 2, 20);
    osSolarSystemSunPivotPoint.add(macOsPlanet);

    macOsPivotPoint = new THREE.Object3D();
    macOsPlanet.add(macOsPivotPoint);

    /*
     * MacOS Moons
     */
    // const macMoonGeo = new THREE.SphereGeometry(1, 70, 70);
    // const macMoonMat = new THREE.MeshLambertMaterial();
    // macMoonMat.map = THREE.ImageUtils.loadTexture('images/jupiter.jpg')
    // let macOsMoon2 = new THREE.Mesh(macMoonGeo, macMoonMat);
    // macOsMoon2.position.set(6, -1, 2);
    // macOsPivotPoint.add(macOsMoon2);
    
    /*
     * Linus Planet
     */
    const linGeo = new THREE.SphereGeometry(3, 70, 70);
    const linMat = new THREE.MeshLambertMaterial({color: 0x0000ff});
    // linMat.map = THREE.ImageUtils.loadTexture('images/uranusmap.jpg')
    let linuxPlanet = new THREE.Mesh(linGeo, linMat);
    linuxPlanet.position.set(-20, -2, 10);
    osSolarSystemSunPivotPoint.add(linuxPlanet);

    linuxPivotPoint = new THREE.Object3D();
    linuxPlanet.add(linuxPivotPoint);

    /*
     * Windows Planet
     */
    const winGeo = new THREE.SphereGeometry(3, 70, 70);
    const winMat = new THREE.MeshLambertMaterial();
    winMat.map = THREE.ImageUtils.loadTexture('images/uranusmap.jpg')
    let windowsPlanet = new THREE.Mesh(winGeo, winMat);
    windowsPlanet.position.set(10, 4, -20);
    osSolarSystemSunPivotPoint.add(windowsPlanet);

    windowsPivotPoint = new THREE.Object3D();
    windowsPlanet.add(linuxPivotPoint);


    // let planet2 = new THREE.Mesh(macGeo, macMat);
    // planet2.position.set(-20, 2, -6);

    // sun.rotation.y = -0.5;
    // macOsSolarSystemSunPivotPoint.add(planet2);
    scene.add(osSolarSystemSun);
    // scene.add(pivotPoint);
    // scene.add(macOsSolarSystemSunPivotPoint);

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

function addOsMoon(pivotPoint){
 const macMoonGeo = new THREE.SphereGeometry(1, 70, 70);
        const macMoonMat = new THREE.MeshLambertMaterial();
        macMoonMat.map = THREE.ImageUtils.loadTexture('images/jupiter.jpg')
        let macOsMoon2 = new THREE.Mesh(macMoonGeo, macMoonMat);
        macOsMoon2.position.set(10 - Math.floor(Math.random()*20), 10 - Math.floor(Math.random()*20), 10 - Math.floor(Math.random()*20));
        pivotPoint.add(macOsMoon2);
}

function updateMoons(){
    osMacOsMoons.forEach((moonMap,i) => {
        if(osMacOs >= moonMap[0] && moonMap[1] === false){
            addOsMoon(macOsPivotPoint);
            moonMap[1] = true;
            return;
        }
    });
}

function updateSolarSystems() {
    osSolarSystemSunPivotPoint.rotation.y += 0.018;
    osSolarSystemSun.rotation.y -= 0.003;

    macOsPivotPoint.rotation.y -= 0.07;
    macOsPivotPoint.rotation.x -= 0.0003;

    updateMoons();
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