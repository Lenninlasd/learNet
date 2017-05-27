import * as THREE from 'three';
import TWEEN from 'tween.js';


export default function MatrixGL(features, group, style) {
    const params = createMatrix(features, group, style);

    return {
        transposed: () => { transposed(params) },
        rotate: () => { rotate(params) }
    };
}

function createMatrix(features, group, style) {
    const shape = features.shape.length === 1 ? [features.shape, 1] : features.shape;
    const featuresArray = features.tolist();
    const geometry = new THREE.PlaneBufferGeometry(style.size, style.size);
    const list = [];
    for (let i = 0; i < shape[0]; i++) {
        for (let j = 0; j < shape[1]; j++) {
            let feature = featuresArray[i][j];
            let x = j*style.size - style.startPoint[0];
            let y = style.startPoint[1] - i*style.size;
            let rectangle = rect(feature, geometry, style, {x: x,  y: y});
            group.add(rectangle);
            list.push(rectangle);
        }
    }
    return { list, shape, style };
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

function rotate(params) {
    let k = 0;
    for (let i = 0; i < params.shape[0]; i++) {
        for (let j = params.shape[1]; j > 0; j--) {
            new TWEEN.Tween(params.list[k].position).to({
                x: i * params.style.size - params.style.startPoint[0],
                y: params.style.startPoint[1] - j * params.style.size,
                z: 0
            }, 3000).easing(TWEEN.Easing.Exponential.InOut).start();
            k++;
        }
    }
}

function transposed(params) {
    let k = 0;
    for (let i = 0; i < params.shape[0]; i++) {
        for (let j = 0; j < params.shape[1]; j++) {
            new TWEEN.Tween(params.list[k].position).to({
                x: i * params.style.size - params.style.startPoint[0],
                y: params.style.startPoint[1] - j * params.style.size,
                z: 0
            }, 2000).easing(TWEEN.Easing.Exponential.InOut).start();
            k++;
        }
    }
}
