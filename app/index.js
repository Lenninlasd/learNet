import * as THREE from 'three';
import nj from 'numjs';
import TWEEN from 'tween.js';
import MatrixGL from './matrix';

const t0 = performance.now();
const matSize = [60,30];
const features = nj.random(matSize);

let camera, scene, renderer;
let group, list;

init();
animate();
const t1 = performance.now();
console.log(t1 - t0);

function init() {
    // OrthographicCamera( left, right, top, bottom, near, far )
    camera = new THREE.OrthographicCamera(
        -window.innerWidth*1.1/2, window.innerWidth/2,
        window.innerHeight*1.1/2, -window.innerHeight/2, 1, 1000 );

    // Scene and Light
    scene = new THREE.Scene();
    group = new THREE.Object3D();
    scene.add(group);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    // Create Geometry
    const mtrx = MatrixGL(features, group, {
        size: 9,
        fill: 0xffffff,
        startPoint: [window.innerWidth/2, window.innerHeight/2]
    });

    const mtrx2 = MatrixGL(features, group, {
        size: 5,
        fill: 0xffffff,
        startPoint: [window.innerWidth/2, 0]
    });

    setTimeout(mtrx.transposed, 1500);
    setTimeout(mtrx2.transposed, 2000);
}

function animate() {
    TWEEN.update();
    requestAnimationFrame(animate);
    camera.position.z = 10;
    renderer.render(scene, camera);
}
