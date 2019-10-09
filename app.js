let ws = null;

let cloudParticles = [];
let scene = new THREE.Scene();
let loader = new THREE.TextureLoader();
let nebula = nebulaNew();
let ambient = new THREE.AmbientLight(0xaaaaaa);
let directinalLight = new THREE.DirectionalLight(0xff8c19);
directinalLight.position.set(0,0,1);

let orangeLight = new THREE.PointLight(0xcc6600, 50,450,1.7);
orangeLight.position.set(200,300,100);
scene.add(orangeLight);

let redLight = new THREE.PointLight(0xd8547e, 50,450,1.7);
redLight.position.set(200,300,100);
scene.add(redLight);

let blueLight = new THREE.PointLight(0x3677ac, 50,450,1.7);
blueLight.position.set(300,300,200);
scene.add(blueLight);

scene.fog = new THREE.FogExp2(0x000000, 0.001);
scene.add(ambient);
scene.add(nebula);
scene.add(directinalLight);

let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;

camera.rotation.x = 1.16;
camera.rotation.y = -0.12;
camera.rotation.z = 0.27;



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
    }
}

function render() {
    cloudParticles.forEach(p => {
        p.rotation.z += 0.0022;
    });
    camera.rotation.z += 0.0006;
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
        }
        
        if (nebula.scale.x >= 0.8 + (buffer / 500)) {
            clearInterval(grow);
            console.log(buffer);
            buffer = 0;
        }
    }, 2);
    
    scene.add(nebula);
}

function nebulaNew() {
    let nebula = new THREE.Object3D();
    loader.load("images/nebula/smoke-1.png", function (texture) {
        let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        let cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });

        for (let p = 0; p < 60; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random() * 800 - 400,
                500,
                Math.random() * 500 - 500
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.55;
            cloudParticles.push(cloud);
            nebula.add(cloud);
        }
    });
    return nebula;
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
setInterval(nebulaPulse, 2000);
startWS();

