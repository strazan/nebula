let ws = null;

let cloudParticles = [];
let scene = new THREE.Scene();
let loader = new THREE.TextureLoader();
// let nebula = nebulaNew();
let planet1;
let pivotPoint;
let solarSystem = createOSSolarSystem();
let ambient = new THREE.AmbientLight(0xaaaaaa);
let directinalLight = new THREE.DirectionalLight(0xffffff);
directinalLight.position.set(0, 100, 200);

// let orangeLight = new THREE.PointLight(0xcc6600, 50,450,1.7);
// orangeLight.position.set(200,300,100);
// scene.add(orangeLight);

// let redLight = new THREE.PointLight(0xd8547e, 50,450,1.7);
// redLight.position.set(200,300,100);
// scene.add(redLight);

// let blueLight = new THREE.PointLight(0x3677ac, 50,450,1.7);
// blueLight.position.set(300,300,100);
// scene.add(blueLight);

// let eathLight = new THREE.PointLight(0x3677ac, 50,4350,90);
// eathLight.position.set(600,600,700);
// scene.add(eathLight);

scene.fog = new THREE.FogExp2(0x000000, 0.001);
scene.add(ambient);
// scene.add(nebula);
scene.add(solarSystem);
// scene.add(planet1);

scene.add(directinalLight);

let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.z = 900;

// camera.rotation.x = 1.16;
// camera.rotation.y = -0.12;
// camera.rotation.z = 0.27;

let planetMaterial = new THREE.MeshPhongMaterial();
planetMaterial.bumpMap = THREE.ImageUtils.loadTexture('images/earthbump1k.jpg');
planetMaterial.bumpScale = 0.05;
planetMaterial.map = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg')
// let sphere = new THREE.Mesh(new THREE.SphereGeometry(100,90,90), planetMaterial);
// sphere.position.set(600,800,100);

// sphere.rotation.x = -1.2;
// sphere.rotation.z = -1.2;
// sphere.rotation.y = 0.8;

// scene.add(sphere);


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(scene.fog.color);
document.body.appendChild(renderer.domElement);

let buffer = 0;

 window.addEventListener( 'resize', onWindowResize, false );


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
    // if (nebula.scale.x > 0.3) {
    //     nebula.scale.x -= 0.001;
    //     nebula.scale.z -= 0.001;
    //     nebula.scale.y -= 0.001;
    //     nebula.rotation.y += 0.003;
     
    //     // sphere.rotation.z += 0.008;
    //     // sphere.rotation.x += 0.008;
    // }
    solarSystem.rotation.y -= 0.02;
    // planet1.rotation.y += 0.02;
    pivotPoint.rotation.y += 0.005;
   
}

function render() {
    cloudParticles.forEach(p => {
        p.rotation.z += 0.0022;
    });
    // camera.rotation.z += 0.0006;
    renderer.render(scene, camera);
}

function nebulaPulse() {

    nebulaGrow();

    // add sound method here Johan
}

function nebulaGrow() {

    let grow = setInterval(function () {
        // if (nebula.scale.x < 2) {
        //     nebula.scale.x += 0.002;
        //     nebula.scale.z += 0.002;
        //     nebula.scale.y += 0.002;
        // }

        // if (nebula.scale.x >= 0.8 + (buffer / 500)) {
        //     clearInterval(grow);
        //     console.log(buffer);
        //     buffer = 0;
        // }
    }, 2);

    // scene.add(nebula);
}

function createOSSolarSystem() {

    const sunGeo  = new THREE.SphereGeometry(50, 200, 200);
    const sunMat = new THREE.MeshPhongMaterial({
       color: 0xffffff
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    
    sun.position.x = 0;
    sun.position.y = 0;

    const macGeo  = new THREE.SphereGeometry(10, 100, 100);
    const macMat = new THREE.MeshPhongMaterial({
       color: 0xffa0f0
    });
   let planet1 = new THREE.Mesh(macGeo, macMat);
    planet1.position.set(100, 4, 6);

    pivotPoint = new THREE.Object3D();
    // sun.rotation.y = -0.5;
    sun.add(pivotPoint);
    pivotPoint.add(planet1);
    return sun;

}


function nebulaNew() {
    // let nebula = new THREE.Object3D();
    // loader.load("images/nebula/smoke-1.png", function (texture) {
    //     let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
    //     let cloudMaterial = new THREE.MeshLambertMaterial({
    //         map: texture,
    //         transparent: true
    //     });

    //     for (let p = 0; p < 60; p++) {
    //         let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
    //         cloud.position.set(
    //             Math.random() * 800 - 400,
    //             500,
    //             Math.random() * 500 - 500
    //         );
    //         cloud.rotation.x = 1.16;
    //         cloud.rotation.y = -0.12;
    //         cloud.rotation.z = Math.random() * 2 * Math.PI;
    //         cloud.material.opacity = 0.55;
    //         cloudParticles.push(cloud);
    //         nebula.add(cloud);
    //     }
    // });
    let planetMaterial = new THREE.MeshPhongMaterial();
    planetMaterial.bumpMap = THREE.ImageUtils.loadTexture('images/earthbump1k.jpg');
    planetMaterial.bumpScale = 0.05;
    planetMaterial.map = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg')
    let nebula = new THREE.Mesh(new THREE.SphereGeometry(100, 90, 90), planetMaterial);
    // return nebula;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
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