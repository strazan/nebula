function off() {
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
        let geometry1 = new THREE.TextGeometry( 'Enter', {
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
      
  
  }

  
  
  function animate() {
  
      requestAnimationFrame( animate );
      renderer1.render( scene1, camera1 );
  
  }
  animate();
    

