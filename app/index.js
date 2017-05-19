import * as THREE from 'three';
import nj from 'numjs';

const t0 = performance.now();
const matSize = [200,350];
const features = nj.random(matSize);
const size = 4;

var container;
var camera, scene, renderer;
var mesh;


init();
animate();

const t1 = performance.now();
console.log(t1 - t0, 'milliseconds');

function init() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 1000;
    camera = new THREE.OrthographicCamera(
        frustumSize*aspect/- 2, frustumSize*aspect/2,
        frustumSize/2, frustumSize/-2, 0.1, 10000
    );

    // Scene and Light
    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0xffffff ) );

    // geometry and material
    const geometry = createBufferMatrixGeometry(features, size);
    const material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;

    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}


function rect(position = {x: 0, y: 0}, size) {
    const p = position;
    const vertices = [
        p.x,        p.y,        1.0,
        p.x + size, p.y,        1.0,
        p.x + size, p.y + size, 1.0,

        p.x + size, p.y + size, 1.0,
        p.x,        p.y + size, 1.0,
        p.x,        p.y,        1.0
    ];
    // 2 triangles, 3 vertices, 3 color channels
    const totalcolors = 2 * 3 * 3;
    const colors = new Array(totalcolors);
    const red = Math.random(), green = Math.random(), blue = Math.random();

    for ( let i = 0; i < totalcolors; i += 3 ) {
        colors[ i     ] = red * 255;
        colors[ i + 1 ] = green * 255;
        colors[ i + 2 ] = blue * 255;
    }

    return {vertices, colors};
}


function createBufferMatrixGeometry(features, size) {
    const shape = features.shape.length === 1 ?
        [features.shape, 1] : features.shape;

    let vertices = [];
    let colors = [];
    for (let i = 0; i < shape[0]; i++) {
        for (let j = 0; j < shape[1]; j++) {
            let x = j*size - window.innerWidth/2;
            let y = window.innerHeight/2 - i*size;
            let square = rect( {x: x, y: y}, size );
            vertices.push(...square.vertices);
            colors.push(...square.colors);
        }
    }
    vertices = new Float32Array(vertices);
    colors = new Uint8Array(colors);

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3, true ));
    return geometry;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    camera.position.z = 1000;
    renderer.render( scene, camera );
}
