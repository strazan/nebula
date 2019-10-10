let ws = null;

let cloudParticles = [];
let scene = new THREE.Scene();
let loader = new THREE.TextureLoader();
let nebula;
createNebula();

let ambient = new THREE.AmbientLight(0x555555);
let directionalLight = new THREE.DirectionalLight(0xff8c19);
directionalLight.position.set(0, 0, 1);

let orangeLight = new THREE.PointLight(0xcc6600, 4, 2050);
orangeLight.position.set(0, 0, 700);
scene.add(orangeLight);

let redLight = new THREE.PointLight(0xd8547e, 4, 2050);
redLight.position.set(100, 100, 800);
scene.add(redLight);

let blueLight = new THREE.PointLight(0x3677ac, 4, 2050);
blueLight.position.set(-50, 100, 800);
scene.add(blueLight);

scene.fog = new THREE.FogExp2(0x000000, 0.001);
scene.add(ambient);
scene.add(nebula);
scene.add(directionalLight);

let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.z = 1000;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(scene.fog.color);
document.body.appendChild(renderer.domElement);
let buffer = 0;

let onmessage = function (e) {
    if (e.data[0] != '{') return;
    buffer++;
};

function loop() {
    requestAnimationFrame(loop);
    update();
    render();
}

function update() {
    nebulaShrink();
    rotateNebulaParts(cloudParticles);
}

function render() {
    renderer.render(scene, camera);
}
let audio = new Audio("/audio/hearbeat.mp3");
function audioPlay () {

    audio.pause();
    audio.currentTime = 0;
    audio.play();

}

function nebulaPulse() {
    nebulaGrow();

    // add sound method here Johan
    audioPlay();
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