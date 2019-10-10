function off() {
<<<<<<< Updated upstream
    document.getElementById("overlay").style.display = "none";
  }
  //creates scene for overlay
  let camera1, scene1, renderer1;
  init();
  animate();
  
  function init() { 
  
      camera1 = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 50 );
      camera1.position.z = 3.5;
      camera1.position.y = 0.3;
  
      scene1 = new THREE.Scene(); 
   
      
      let loader1 = new THREE.FontLoader(); //loader for font
      loader1.load( 'https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json', function ( font ) {
        let geometry1 = new THREE.TextGeometry( 'Enter.', {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 4,
        } );
        geometry1.center();

        let material1 = new THREE.MeshBasicMaterial({ //material for font
          color: 0xE5A774,
          opacity: 0.5
        });

        material1.transparent = true; //this is for opacity to work

        let mesh1 = new THREE.Mesh( geometry1, material1);
        scene1.add( mesh1 );
      } );

  
      renderer1 = new THREE.WebGLRenderer( { antialias: true } );
      renderer1.setSize( window.innerWidth, window.innerHeight );
      document.getElementById('overlay').appendChild( renderer1.domElement );
      
  
=======
  document.getElementById("overlay").style.display = "none";
}
//creates scene for overlay
let camera1, scene1, renderer1;
init();
animate();

function init() {

  camera1 = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 50);
  camera1.position.z = 10;
  camera1.position.y = 0.3;
  camera1.position.x = 0;

  scene1 = new THREE.Scene();


  let loader1 = new THREE.FontLoader(); //loader for font
  loader1.load('https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json', function (font) {
    let geometry1 = new THREE.TextGeometry('Enter', {
      font: font,
      size: 0.9,
      height: 0.1,
      curveSegments: 4,
    });
    geometry1.center();


    let material1 = new THREE.MeshBasicMaterial({ //material for font
      color: 0xebe5da,
      opacity: 0.3
    });
    // material1.map = THREE.ImageUtils.loadTexture('images/skystar.png');

    material1.transparent = true; //this is for opacity to work

    let mesh1 = new THREE.Mesh(geometry1, material1);
    
    

    scene1.add(mesh1);
  });


  renderer1 = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer1.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('overlay').appendChild(renderer1.domElement);

}
let createSphere = function() {

  let geometry2 = new THREE.SphereGeometry(1.6, 60, 60);

  let materialSphere = new THREE.MeshPhysicalMaterial({color:0xebe5da, opacity: 0.55});
  materialSphere.transparent = true;
  materialSphere.map = THREE.ImageUtils.loadTexture('images/plutomap2k.jpg');

  let mesh2 = new THREE.Mesh(geometry2, materialSphere);
  mesh2.position.x = 1.2;
  mesh2.position.y = 1.2;
  mesh2.position.z = 1.2;

 
  scene1.add(mesh2);

  let light2 = new THREE.SpotLight(0xebe5da, 0.4, 500)
  light2.position.set(12, 0, 25);
  scene1.add(light2);

  let ambientLight = new THREE.AmbientLight(0xffffff);
  scene1.add(ambientLight)

  let render = function() {
      requestAnimationFrame(render);

      mesh2.rotation.x += 0.001;
      // mesh2.rotation.y += 0.001;
      // mesh2.rotation.z += 0.001;
      renderer1.render(scene1,camera1);
  }
  
  
  render();
  
};
createSphere();

// legend animation

let isLegendShowing = false;

function animation() {

  let legend = document.getElementById('legend');
  if (isLegendShowing) {
    hideLegend();
  } else {
    showLegend();
>>>>>>> Stashed changes
  }

  
  
  function animate() {
  
      requestAnimationFrame( animate );
      renderer1.render( scene1, camera1 );
  
  }
  animate();
    

