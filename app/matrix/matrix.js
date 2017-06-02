import * as THREE from 'three';
import * as animation from './animations';

export default function MatrixGL(features, group, style) {
    const params = createMatrix(features, group, style);

    return {
        params,
        transposed: () => { return animation.transposed(params) },
        rotate: () => animation.rotate(params),
        dot: b_matrix => animation.dot(params, b_matrix),
        clone: () => { return cloneMatrix(features, group, style) },

        setStartPoint: (arr) => {
            if (arr.length === 2) params.style.startPoint = arr;
        }
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
function setStartPoint(startPoint, arr) {
    if (arr.length === 2) {
        startPoint = arr;
    }
}
