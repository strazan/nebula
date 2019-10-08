let ws = null;

let cloudParticles = [];
let scene = new THREE.Scene();
let loader = new THREE.TextureLoader();
let nebula = createNebula();
let planet1;
let pivotPoint;
let solarSystem = createOSSolarSystem();
let ambient = new THREE.AmbientLight(0x555555);
let directinalLight = new THREE.DirectionalLight(0xff8c19);
directinalLight.position.set(0,0,1);

let orangeLight = new THREE.PointLight(0xcc6600, 5, 1250);
orangeLight.position.set(0, 0, 400);
scene.add(orangeLight);

let redLight = new THREE.PointLight(0xd8547e, 7, 1250);
redLight.position.set(200, 100, 800);
scene.add(redLight);

let blueLight = new THREE.PointLight(0x3677ac, 4, 1450);
blueLight.position.set(100, 300, 400);
scene.add(blueLight);

scene.fog = new THREE.FogExp2(0x000000, 0.001);
scene.add(ambient);
scene.add(nebula);
scene.add(directinalLight);
scene.add(solarSystem);

let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.z = 1000;


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(scene.fog.color);
document.body.appendChild(renderer.domElement);
let buffer = 0;

let onmessage = function (e) {

    if (e.data[0] != '{') return;
    let data = JSON.parse(e.data)

    buffer++;
};

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

function update() {
    if (nebula.scale.x > 0.3) {
        nebula.scale.x -= 0.001;
        nebula.scale.z -= 0.001;
        nebula.scale.y -= 0.001;
    }
    solarSystem.rotation.y -= 0.02;
    // planet1.rotation.y += 0.02;
    pivotPoint.rotation.y += 0.005;
}

function render() {
    rotateNebulaParts(cloudParticles);
  
    // nebula.rotation.z += 0.0006;
    renderer.render(scene, camera);
}

function nebulaPulse() {

    nebulaGrow();

    // add sound method here Johan
}

function nebulaGrow() {

    let grow = setInterval(function () {
        if (nebula.scale.x < 2) {
            nebula.scale.x += 0.002;
            nebula.scale.z += 0.002;
            nebula.scale.y += 0.002;
        }

        if (nebula.scale.x >= 0.8 + (buffer / 500)) {
            clearInterval(grow);
            console.log(buffer);
            buffer = 0;
        }
    }, 2);

    // scene.add(nebula);
}

function createNebula() {
    let nebula = new THREE.Object3D();
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
               300 -  Math.random() * 1200);
            cloud.rotation.x = 0.1 - (Math.random() * 0.01);
            cloud.rotation.y = 0.02;
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.35;
            cloudParticles.push(cloud);
            nebula.add(cloud);
        }
    });
    return nebula;
}

function createOSSolarSystem() {

    const sunGeo = new THREE.SphereGeometry(10, 60, 60);
    const sunMat = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);

    sun.position.x = 100;
    sun.position.y = 100;

    const macGeo = new THREE.SphereGeometry(15, 70, 70);
    const macMat = new THREE.MeshPhongMaterial({
        color: 0xffa0f0
    });
    let planet1 = new THREE.Mesh(macGeo, macMat);
    planet1.position.set(60, 4, 6);

    pivotPoint = new THREE.Object3D();
    // sun.rotation.y = -0.5;
    sun.add(pivotPoint);
    pivotPoint.add(planet1);
    return sun;

}

function rotateNebulaParts(nebula) {
    nebula.forEach((neb, i) => {

    }); 
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