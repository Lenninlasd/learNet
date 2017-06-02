import * as THREE from 'three';
import TWEEN from 'tween.js';


export default function MatrixGL(features, group, style) {
    const params = createMatrix(features, group, style);

    return {
        params,
        transposed: () => { return transposed(params) },
        rotate: () => rotate(params),
        dot: b_matrix => dot(params, b_matrix),
        clone: () => { return cloneMatrix(features, group, style) }
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

function cloneMatrix(features, group, style) {
    const newStyle = Object.assign({}, style);
    return MatrixGL(features, group, newStyle);
}

/*
** Setters
*/


/*
** Animations
*/
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
        }, 1000).easing(TWEEN.Easing.Exponential.InOut).start();
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
    const tweenSquarsePosition = [];
    for (let i = 0; i < params.shape[0]; i++) {
        for (let j = 0; j < params.shape[1]; j++) {
            let tweenObj = new TWEEN.Tween(params.list[k].position).to({
                x: i * params.style.size - params.style.startPoint[0],
                y: params.style.startPoint[1] - j * params.style.size,
                z: 0
            }, 4000).easing(TWEEN.Easing.Exponential.InOut);
            tweenSquarsePosition.push(tweenObj);
            k++;
        }
    }
    tweenSquarsePosition.start = function () {
        tweenSquarsePosition.map( (tweenObj) => {
            tweenObj.start();
        });
    }
    return tweenSquarsePosition;
}

function separate(params, pad = [0, 0]) {
    let k = 0;
    const tweenSquarsePosition = [];
    for (let i = 0; i < params.shape[0]; i++) {
        for (let j = 0; j < params.shape[1]; j++) {
            let tweenObj = new TWEEN.Tween(params.list[k].position).to({
                x: j * (params.style.size + pad[0]) - params.style.startPoint[0],
                y: params.style.startPoint[1] - i * (params.style.size + pad[1]),
                z: 0
            }, 2000).easing(TWEEN.Easing.Exponential.InOut);
            tweenSquarsePosition.push(tweenObj);
            k++;
        }
    }
    tweenSquarsePosition.start = function () {
        tweenSquarsePosition.map( (tweenObj) => {
            tweenObj.start();
        });
    }
    return tweenSquarsePosition;
}

function dot(params, b) {
    const tweenArray = separate(params, [b.params.style.size + 10, 0]);

    const B_duplicate = b.clone();
    const C_duplicate = b.clone();
    const D_duplicate = b.clone();

    D_duplicate.params.style.startPoint = [
        params.style.startPoint[0] - b.params.style.size,
        params.style.startPoint[1]
    ];

    B_duplicate.params.style.startPoint = [
        params.style.startPoint[0] - b.params.style.size*3 - 10,
        params.style.startPoint[1]
    ];
    C_duplicate.params.style.startPoint = [
        params.style.startPoint[0] - b.params.style.size*5 - 20,
        params.style.startPoint[1]
    ];
    const B_transposed = B_duplicate.transposed();
    const D_transposed = D_duplicate.transposed();
    const C_transposed = C_duplicate.transposed();

    tweenArray[0].chain(D_transposed, B_transposed, C_transposed);
    tweenArray.start();
}
