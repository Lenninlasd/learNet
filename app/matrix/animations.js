import TWEEN from 'tween.js';
export { rotate,  transposed, separate, dot, yLineFormation, xLineFormation, plainX };
/*
** Animations
*/
function xLineFormation(params) {
    const tweenSquarsePosition = [];
    for (var i = 0; i < params.list.length; i++) {
        let tweenObj = new TWEEN.Tween(params.list[i].position).to({
            x: - params.style.startPoint[0],
            y: params.style.startPoint[1],
            z: 0
        }, 1000).easing(TWEEN.Easing.Exponential.InOut);
        tweenSquarsePosition.push(tweenObj);
    }
    tweenSquarsePosition.start = function () {
        tweenSquarsePosition.map( (tweenObj) => {
            tweenObj.start();
        });
    }
    return tweenSquarsePosition;
}
function yLineFormation(params) {
    const tweenSquarsePosition = [];
    for (var i = 0; i < params.list.length; i++) {
        let tweenObj = new TWEEN.Tween(params.list[i].position).to({
            x: - params.style.startPoint[0],
            y: params.style.startPoint[1] - i * params.style.size,
            z: 0
        }, 1000).easing(TWEEN.Easing.Exponential.InOut);
        tweenSquarsePosition.push(tweenObj);
    }

    tweenSquarsePosition.start = function () {
        tweenSquarsePosition.map( (tweenObj) => {
            tweenObj.start();
        });
    }
    return tweenSquarsePosition;
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
    const newList = [];
    for (let i = 0; i < params.shape[0]; i++) {
        for (let j = 0; j < params.shape[1]; j++) {
            let index = params.shape[0]*j + i;
            newList[index] = params.list[k];
            k++;
        }
    }
    params.list = newList;
    params.shape = [params.shape[1], params.shape[0]];
}


function separate(params, pad=[0, 0], time=1000) {
    let k = 0;
    const tweenSquarsePosition = [];
    for (let i = 0; i < params.shape[0]; i++) {
        for (let j = 0; j < params.shape[1]; j++) {
            let tweenObj = new TWEEN.Tween(params.list[k].position).to({
                x: j * (params.style.size + pad[0]) - params.style.startPoint[0],
                y: params.style.startPoint[1] - i * (params.style.size + pad[1]),
                z: 0
            }, time).easing(TWEEN.Easing.Exponential.InOut);
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

function plainX(params,  pad = [0, 0]) {
    let k = 0;
    const tweenSquarsePosition = [];
    for (let i = 0; i < params.shape[0]; i++) {
        for (let j = 0; j < params.shape[1]; j++) {
            let tweenObj = new TWEEN.Tween(params.list[k].position).to({
                x: j * (params.style.size + pad[0]) - params.style.startPoint[0],
                y: params.style.startPoint[1],
                z: 0
            }, 1000).easing(TWEEN.Easing.Exponential.InOut);
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

    const cloneMatrix = b.clone(params.shape[1]);
    cloneMatrix.setStartPoint([
            params.style.startPoint[0] - b.params.style.size,
            params.style.startPoint[1]
    ]);

    cloneMatrix.transposed();

    const cloneMatrixSepared = cloneMatrix.separate([b.params.style.size + gap, 0], 3000);
    const cloneMatrixPlainX = cloneMatrix.plainX([b.params.style.size + gap, 0]);
    const MatrixPlained = plainX(params, [b.params.style.size + gap, 0]);


    cloneMatrix.setStartPoint(params.style.startPoint);

    const cloneMatrixPlainXnoGap = cloneMatrix.plainX();
    const MatrixPlainedNoGap = plainX(params);

    tweenArray[0].chain(cloneMatrixSepared);
    cloneMatrixSepared[0].chain(cloneMatrixPlainX, MatrixPlained);
    cloneMatrixPlainX[0].chain(cloneMatrixPlainXnoGap, MatrixPlainedNoGap);
    tweenArray.start();
}
