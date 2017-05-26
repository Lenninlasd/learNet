import * as THREE from 'three';
import nj from 'numjs';
import TWEEN from 'tween.js';

const t0 = performance.now();
const matSize = [12,6];
const features = nj.random(matSize);
const style = {
    size: 50,
    fill: 0xffffff
}
debugger;
let camera, scene, renderer;
let group, list;

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
    group = new THREE.Object3D();
    scene.add(group);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);

    // Create Geometry
    list = createMatrix(features, style, group);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    setTimeout(transposed, 3000);
}

function animate() {
    TWEEN.update();
    requestAnimationFrame(animate);
    camera.position.z = 1000;
    renderer.render(scene, camera);
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

function createMatrix(features, style, group) {
    const shape = features.shape.length === 1 ?
        [features.shape, 1] : features.shape;
    const featuresArray = features.tolist();
    const geometry = new THREE.PlaneBufferGeometry(style.size, style.size);
    const list = [];
    for (let i = 0; i < shape[0]; i++) {
        for (let j = 0; j < shape[1]; j++) {
            let feature = featuresArray[i][j];
            let x = j*style.size - window.innerWidth/2;
            let y = window.innerHeight/2 - i*style.size;
            let rectangle = rect(feature, geometry, style, {x: x,  y: y});
            group.add(rectangle);
            list.push(rectangle);
        }
    }
    return list;
}

function xLineFormation() {
    for (var i = 0; i < list.length; i++) {
        new TWEEN.Tween(list[i].position).to({
            x: i * style.size - window.innerWidth/2,
            y: window.innerHeight/2,
            z: 0
        }, 4000).easing(TWEEN.Easing.Exponential.InOut).start();
    }
}
function yLineFormation() {
    for (var i = 0; i < list.length; i++) {
        new TWEEN.Tween(list[i].position).to({
            x: - window.innerWidth/2,
            y: window.innerHeight/2 - i * style.size,
            z: 0
        }, 10000).easing(TWEEN.Easing.Exponential.InOut).start();
    }
}

function transposed() {
    let k = 0;
    for (let i = 0; i < matSize[0]; i++) {
        for (let j = 0; j < matSize[1]; j++) {
            new TWEEN.Tween(list[k].position).to({
                x: i * style.size - window.innerWidth/2,
                y: window.innerHeight/2 - j * style.size,
                z: 0
            }, 2000).easing(TWEEN.Easing.Exponential.InOut).start();
            k++;
        }
    }
}

function rotate() {
    let k = 0;
    for (let i = 0; i < matSize[0]; i++) {
        for (let j = matSize[1]; j > 0; j--) {
            new TWEEN.Tween(list[k].position).to({
                x: i * style.size - window.innerWidth/2,
                y: window.innerHeight/2 - j * style.size,
                z: 0
            }, 3000).easing(TWEEN.Easing.Exponential.InOut).start();
            k++;
        }
    }
}
