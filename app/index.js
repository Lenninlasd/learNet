import * as THREE from 'three';

let container, stats;
let camera, scene, raycaster, renderer;
let mouse = new THREE.Vector2(), INTERSECTED;
let radius = 500, theta = 0;
let frustumSize = 1000;

init();
animate();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild(container);

    let aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(
        frustumSize*aspect/- 2, frustumSize*aspect/2,
        frustumSize/2, frustumSize/-2, 0.1, 10000
    );

    // Scene and Light
	scene = new THREE.Scene();
	let light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(1, 1, 1).normalize();
	scene.add( light );

    // let geometry = new THREE.SphereBufferGeometry(20, 10, 10);
    let geometry = new THREE.PlaneBufferGeometry(10, 10);
	for ( let i = 0; i < 1000; i ++ ) {
		let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
		object.position.x = Math.random() * 800 - 400;
		object.position.y = Math.random() * 800 - 400;
		object.position.z = Math.random() * 800 - 400;
        let scale = Math.random() + 5;
        object.scale.x = scale;
		object.scale.y = scale;
		object.scale.z = scale;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
		scene.add(object);
	}
	raycaster = new THREE.Raycaster();
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	container.appendChild(renderer.domElement);

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	let aspect = window.innerWidth / window.innerHeight;
	camera.left   = - frustumSize * aspect / 2;
	camera.right  =   frustumSize * aspect / 2;
	camera.top    =   frustumSize / 2;
	camera.bottom = - frustumSize / 2;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
//
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
    theta += 0.1;
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
    camera.lookAt( scene.position );
    camera.updateMatrixWorld();
	// find intersections
	raycaster.setFromCamera( mouse, camera );
	let intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                INTERSECTED = intersects[ 0 ].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex( 0xff0000 );
		}
	} else {
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
	}
	renderer.render( scene, camera );
}
