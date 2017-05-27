import * as THREE from 'three';
import nj from 'numjs';
import MatrixGL from './matrix';
import init from './3Denv';

const group = new THREE.Object3D();
init(group).animate();


const matSize = [60,30];
const features = nj.random(matSize);
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
setTimeout(mtrx2.rotate, 2000);
