const shakeButton = document.getElementById('shake-button');
const resetButton = document.getElementById('reset');
const readyButton = document.getElementById('ready');
const result = document.querySelector('.result');
const desc = document.querySelector('.desc');
const shakeWrapper = document.querySelector('.shakes');
const shakeLed = document.querySelectorAll('.shakes .shake');

let shakeCounter = 0;

window.addEventListener('online', _ => location.reload());
const shakeEvent = new Shake({threshold: 10});
window.addEventListener('shake', function(){
    shake();
}, false);

function showButton(button) {
    button && button.classList.remove('hidden');
}
function hideButton(button) {
    button && button.classList.add('hidden');
}

function ready() {
    shakeEvent.start();
    if(!("ondevicemotion" in window)) {
        showButton(shakeButton);
    }
    hideButton(readyButton);
    showButton(desc);
    showButton(shakeWrapper);
}

function clearCount() {
    shakeCounter = 0;
    showButton(readyButton);
    hideButton(resetButton);
    hideButton(shakeWrapper);
    shakeLed.forEach(item => {
        item.classList.remove('switch-on')
    })
    result.innerHTML = '';
}

function shake() {
    shakeCounter++;
    switch (shakeCounter) {
        case 1:
            shakeLed[0].classList.add('switch-on');
            break;
        case 2:
            shakeLed[1].classList.add('switch-on');
            break;
        case 3:
            shakeLed[2].classList.add('switch-on');
            break;
    }
    if (shakeCounter >= 3) {
        result.innerHTML = Math.round(Math.random() * 99);
        shakeEvent.stop();
        showButton(resetButton);
        hideButton(shakeButton);
        hideButton(desc);
        return;
    }
    console.log('shake');
}



