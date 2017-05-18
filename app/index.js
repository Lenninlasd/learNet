import * as THREE from 'three';
import nj from 'numjs';

var container;
var camera, scene, renderer;
var mesh;

init();
animate();
function init() {
    container = document.getElementById( 'container' );
    //
    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    camera.position.z = 50;
    scene = new THREE.Scene();

    //
    scene.add( new THREE.AmbientLight( 0xffffff ) );
    //
    var triangles = 2;
    var geometry = new THREE.BufferGeometry();

    // var vertices = new Float32Array(triangles * 4 * 3 );
    var vertices = new Float32Array( [
    	-1.0, -1.0,  1.0,
    	 1.0, -1.0,  1.0,
    	 1.0,  1.0,  1.0,

    	 1.0,  1.0,  1.0,
    	-1.0,  1.0,  1.0,
    	-1.0, -1.0,  1.0
    ] );

    // for ( var i = 0, l = triangles * 4 * 3; i < l; i += 3 ) {
    //     vertices[ i     ] = Math.random() - 0.5;
    //     vertices[ i + 1 ] = Math.random() - 0.5;
    //     vertices[ i + 2 ] = Math.random() - 0.5;
	// }
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3) );
    let totalcolors = triangles * 3 * 3;
    let totalScuareColor = totalcolors/2
    var colors = new Uint8Array(totalcolors);
    let red, green, blue;
    for ( let i = 0; i < totalcolors; i += 9 ) {
        // debugger;
        if (( totalScuareColor * i ) % 18 === 0) {
            red = Math.random(), green = Math.random(), blue = Math.random();
        }

        colors[ i     ] = red * 255;
        colors[ i + 1 ] = green * 255;
        colors[ i + 2 ] = blue * 255;

        colors[ i + 3 ] = red * 255;
        colors[ i + 4 ] = green * 255;
        colors[ i + 5 ] = blue * 255;

        colors[ i + 6 ] = red * 255;
        colors[ i + 7 ] = green * 255;
        colors[ i + 8 ] = blue * 255;
    }
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3, true ));

    var material = new THREE.MeshPhongMaterial( {
        color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
        side: THREE.DoubleSide, vertexColors: THREE.VertexColors,
        transparent: true
    } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x101010 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    var time = Date.now() * 0.001;
    mesh.rotation.x = time * 0.25;
    mesh.rotation.y = time * 0.5;
    renderer.render( scene, camera );
}
