import TWEEN from 'tween.js';
export { rotate,  transposed, separate, dot };
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
    const gap = 10;
    const tweenArray = separate(params, [b.params.style.size + gap, 0]);

    const cloneMatrixArray = [];
    const matrixTransitions = []
    for (let i = 0; i < params.shape[1]; i++) {
        cloneMatrixArray[i] = b.clone();
        cloneMatrixArray[i].setStartPoint([
            params.style.startPoint[0] - b.params.style.size*(2*i + 1) - gap*i,
            params.style.startPoint[1]
        ]);
        matrixTransitions[i] = cloneMatrixArray[i].transposed();
    }

    tweenArray[0].chain(... matrixTransitions);
    tweenArray.start();
}
