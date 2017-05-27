import * as THREE from 'three';
import TWEEN from 'tween.js';


export default function init(group) {
    // OrthographicCamera( left, right, top, bottom, near, far )
    const camera = new THREE.OrthographicCamera(
        -window.innerWidth*1.1/2, window.innerWidth/2,
        window.innerHeight*1.1/2, -window.innerHeight/2, 1, 1000 );

    // Scene and Light
    const scene = new THREE.Scene();
    scene.add(group);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    function animate() {
        TWEEN.update();
        requestAnimationFrame(animate);
        camera.position.z = 10;
        renderer.render(scene, camera);
    }

    return { animate };
}
