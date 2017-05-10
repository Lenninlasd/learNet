import SVG from 'svg.js';
import nj from 'numjs';
import * as THREE from 'three';

const matSize = [6,8];
const features = nj.random(matSize);
const styles = {
    size: 40,
    fill: '#000',
    fontFill: 'yellow',
    stroke: 'cyan',
    'stroke-width': 1
}
const draw = SVG('svg').size(matSize[1]*styles.size, matSize[0]*styles.size);

createRow(features, styles);

function rect(val, styles, position = {x: 0,  y: 0}) {
    const s = styles;
    const square = draw.rect(s.size, s.size)
    .attr({
        x: position.x,
        y: position.y,
        fill: s.fill,
        stroke: s.stroke,
        'stroke-width': s['stroke-width']
    });
    const textInfo = draw.text(val.toFixed(3).toString())
    .attr({
        x: position.x + s.size*0.2,
        y: position.y + s.size*0.2
    }).font({
        size: s.size*0.25,
        fill: s.fontFill
    });
    return [square, textInfo];
}

function createRow(features, styles) {
    const shape = features.shape.length === 1 ?
        [features.shape, 1] : features.shape;
    const featuresArray = features.tolist();
    for (let i = 0; i < shape[0]; i++) {
        for (let j = 0; j < shape[1]; j++) {
            let feature = features.get(i,j);
            let x = j*styles.size;
            let y = i*styles.size;
            rect(feature, styles, {x: x,  y: y});
        }
    }
}

/******
******
******
******/
let camera, scene, renderer, mesh;

init();
animate();

function init() {
    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        wireframe: true
    });

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    mesh = new THREE.Mesh(geometry, material);

    camera.position.z = 500;
    scene.add(mesh);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    renderer.render(scene, camera);
}
