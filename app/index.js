import * as THREE from 'three';
import nj from 'numjs';
import TWEEN from 'tween.js';
import { dataSet, getRgbColor } from './dataset';

const DOT_SIZE = 20;
const X_START_POS = -8 * DOT_SIZE;
const Y_START_POS = -8 * DOT_SIZE;
const Z_START_POS = -4.5 * DOT_SIZE;

let container, stats;
let camera, controls, scene, renderer;
let mesh, plane;

var ID = 1;
var list = [];

var targetRotation = 0;
//This needs to be declared separately, currently not sure why but cube does not appear otherwise
var targetRotationOnMouseDown = 0;
var rotationSpeed = 0.05;

var mouseX, mouseY, mouseXOnMouseDown, mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

const ROT_SPEED = 100;
var group_rot = 0;
var group;
var theta = 0;
const L_SIZE = 3;
const M_SIZE = 2;
const S_SIZE = 1;
const SIZE = 20;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    //The smaller the first number is, the closer the cube appears
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1500);
    //The height of the camera in comparison to the scene
    camera.position.x = 0;
    camera.position.y = 0;
    //The zoom level of the camera
    camera.position.z = 1200;

    //Create the scene
    scene = new THREE.Scene();
    group = new THREE.Object3D();
    scene.add(group);

    var i, j;
    var x, y, z;
    var meshArray = [];
    var color;
    var geometry = new THREE.CubeGeometry(DOT_SIZE * 0.8, DOT_SIZE * 0.8, DOT_SIZE * 0.8);
    for (j = 0; j < dataSet.length; j++) {
        for (i = 0; i < dataSet[j].length; i++) {
            x = (i % 16) * DOT_SIZE + X_START_POS;
            y = (16 - Math.floor(i / 16)) * DOT_SIZE + Y_START_POS;
            z = j * DOT_SIZE + Z_START_POS;
            color = getRgbColor(dataSet[j][i]);

            if (dataSet[j][i] != "BK") {
                var material = new THREE.MeshLambertMaterial({
                    color: color
                });
                meshArray[i] = new THREE.Mesh(geometry, material);
                meshArray[i].position.x = x - 0;
                meshArray[i].position.y = y;
                meshArray[i].position.z = z;
                //scene.add(meshArray[i]);
                group.add(meshArray[i]);
                list.push(meshArray[i]);
            }
        }
    }

    var light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    var light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(-1, -1, -1).normalize();
    scene.add(light2);

    // create and start the renderer; choose antialias setting.
    if (isWebgl()) {
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
    }else {
        renderer = new THREE.CanvasRenderer();
    }

    renderer.setSize(window.innerWidth - 5, window.innerHeight - 5);
    container.appendChild(renderer.domElement);

    // document.addEventListener('mousedown', onDocumentMouseDown, false);
    // document.addEventListener('touchstart', onDocumentTouchStart, false);
    // document.addEventListener('touchmove', onDocumentTouchMove, false);

    window.addEventListener('resize', onWindowResize, false);

    for (i = 0; i < list.length; i++) {
        new TWEEN.Tween(list[i].scale).to({
            x: 1,
            y: 1,
            z: 1
        }, 1000)
            .easing(TWEEN.Easing.Back.Out).start();
    }

    setInterval(changeID, 3000);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// function onDocumentMouseDown(event) {
//     event.preventDefault();
//
//     document.addEventListener('mousemove', onDocumentMouseMove, false);
//     document.addEventListener('mouseup', onDocumentMouseUp, false);
//     document.addEventListener('mouseout', onDocumentMouseOut, false);
//
//     mouseXOnMouseDown = event.clientX - windowHalfX;
//     targetRotationOnMouseDown = targetRotation;
// }
//
// function onDocumentMouseMove(event) {
//     mouseX = event.clientX - windowHalfX;
//     mouseY = event.clientY - windowHalfY;
// }
//
// function onDocumentMouseUp(event) {
//     document.removeEventListener('mousemove', onDocumentMouseMove, false);
//     document.removeEventListener('mouseup', onDocumentMouseUp, false);
//     document.removeEventListener('mouseout', onDocumentMouseOut, false);
// }

// function onDocumentMouseOut(event) {
//     //To get rid of redundant code, call function that does same thing above
//     onDocumentMouseUp(event);
// }

// function onDocumentTouchStart(event) {
//     if (event.touches.length === 1) {
//         event.preventDefault();
//
//         mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
//         targetRotationOnMouseDown = targetRotation;
//     }
// }

// function onDocumentTouchMove(event) {
//     if (event.touches.length === 1) {
//         event.preventDefault();
//
//         mouseX = event.touches[0].pageX - windowHalfX;
//         //The rotation of the cube on its' x-axis
//         targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * rotationSpeed;
//     }
// }


/**************THIS BLOCK IS NECESSARY -> DRAWS DEBUG AXES********************/
var debugaxis = function (axisLength) {
    //Shorten the vertex function
    function v(x, y, z) {
        return new THREE.Vector3(x, y, z);
    }

    //Create axis (point1, point2, colour)

    function createAxis(p1, p2, color) {
        var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({
                color: color,
                lineWidth: 1
            });
        lineGeometry.vertices.push(p1, p2);
        line = new THREE.Line(lineGeometry, lineMat);
        scene.add(line);
    }

    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
};

//To use enter the axis length
//debugaxis(400);
/**************************************************************************************/

function isWebgl() {
    try {
        return !!window.WebGLRenderingContext && !! document.createElement('canvas').getContext('experimental-webgl');
    } catch (e) {
        return false;
    }
}

function animate() {
    requestAnimationFrame(animate);
    // controls.update();
    render();
}

function render() {
    TWEEN.update();
    group_rot += 0.0001 * ROT_SPEED;
    group.rotation.x = group_rot;
    group.rotation.y = group_rot;
    group.rotation.z = group_rot;
    renderer.render(scene, camera);
}

function changeID() {

    switch (ID) {
    case 1:
        changeFormation1();
        break;
    case 2:
        changeFormation2();
        break;
    case 3:
        changeFormation3();
        break;
    default:
        changeFormation1();
        break;
    }

    ID++;
    if (ID > 3) {
        ID = 1;
    }
}

//Random
function changeFormation1() {
    for (var i = 0; i < list.length; i++) {
        var rot = 360 / list.length * i;
        var vx = Math.random() * 600 - 300;
        var vy = Math.random() * 600 - 300;
        var vz = Math.random() * 600 - 300;

        new TWEEN.Tween(list[i].position).to({
            x: vx,
            y: vy,
            z: vz
        }, 1000)
            .easing(TWEEN.Easing.Exponential.InOut).start();

        new TWEEN.Tween(list[i].rotation).to({
            x: 0,
            y: rot,
            z: 0
        }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut).start();
    }
}

//Cube
function changeFormation2() {
    var i, j, k;
    var x, y, z;
    k = 0;
    for (j = 0; j < dataSet.length; j++) {
        for (i = 0; i < dataSet[j].length; i++) {
            x = (i % 16) * DOT_SIZE + X_START_POS;
            y = (16 - Math.floor(i / 16)) * DOT_SIZE + Y_START_POS;
            z = j * DOT_SIZE + Z_START_POS;
            if (dataSet[j][i] != "BK") {
                new TWEEN.Tween(list[k].position).to({
                    x: x,
                    y: y,
                    z: z
                }, 1000)
                    .easing(TWEEN.Easing.Exponential.InOut).start();

                new TWEEN.Tween(list[k].rotation).to({
                    x: 0,
                    y: 0,
                    z: 0
                }, 1000)
                    .easing(TWEEN.Easing.Cubic.InOut).start();
                k++;
            }
        }
    }
}

//Spiral
function changeFormation3() {
    for (var i = 0; i < list.length; i++) {
        var rot = 25 * i;
        var vx = 150 * Math.sin(rot * Math.PI / 180);
        var vy = 1 * i - 400;
        var vz = 150 * Math.cos(rot * Math.PI / 180);

        new TWEEN.Tween(list[i].position).to({
            x: vx,
            y: vy,
            z: vz
        }, 1000)
            .easing(TWEEN.Easing.Exponential.InOut).start();

        new TWEEN.Tween(list[i].rotation).to({
            x: 0,
            y: rot,
            z: 0
        }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut).start();
    }
}
