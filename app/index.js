import * as THREE from 'three';
import nj from 'numjs';
const t0 = performance.now();
const matSize = [50,100];
const features = nj.random(matSize);
const style = {
    size: 10,
    fill: 0xffffff
}

let camera, scene, renderer;

init();
animate();
const t1 = performance.now();
console.log(t1 - t0);

function init() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 1000;
    camera = new THREE.OrthographicCamera(
        frustumSize*aspect/- 2, frustumSize*aspect/2,
        frustumSize/2, frustumSize/-2, 0.1, 10000
    );

    // Scene and Light
    scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);

    // Create Geometry
    createMatrix(features, style, scene);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);
}

function rect(feature, geometry, style, position = {x: 0, y: 0}) {
    const s = style;
    const object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: s.fill*feature
    }));
    object.position.x = position.x;
    object.position.y = position.y;
    return object;
}

function createMatrix(features, style, scene) {
    const shape = features.shape.length === 1 ?
        [features.shape, 1] : features.shape;
    const featuresArray = features.tolist();
    const geometry = new THREE.PlaneBufferGeometry(style.size, style.size);
    for (let i = 0; i < shape[0]; i++) {
        for (let j = 0; j < shape[1]; j++) {
            let feature = featuresArray[i][j];
            let x = j*style.size - window.innerWidth/2;
            let y = window.innerHeight/2 - i*style.size;
            scene.add(rect(feature, geometry, style, {x: x,  y: y}));
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    camera.position.z = 1000;
    renderer.render(scene, camera);
}
