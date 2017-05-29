import * as THREE from 'three';
import nj from 'numjs';
import MatrixGL from './matrix';
import init from './3Denv';

const group = new THREE.Object3D();
init(group).animate();


const features = nj.random([1, 4]);

const weights = nj.random([4, 3]);
// Create Geometry
const mtrx = MatrixGL(features, group, {
    size: 50,
    fill: 0xffffff,
    startPoint: [window.innerWidth/2, window.innerHeight/2 - 250]
});

const mtrx2 = MatrixGL(weights, group, {
    size: 50,
    fill: 0xffffff,
    startPoint: [window.innerWidth/2 - 250, window.innerHeight/2]
});

mtrx2.dot(mtrx);
// setTimeout(mtrx2.transposed, 2000);
