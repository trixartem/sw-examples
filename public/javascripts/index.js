const result = document.querySelector('.result');
const descMain = document.querySelector('.desc-index');
const playButton = document.querySelector('.button');

function initSW() {
    if (!('serviceWorker' in navigator)) {
        showButton(playButton);
        descMain.innerText = 'Ваш браузер не поддерживает SW :(';
        document.body.classList.add('wrong');
        return;
    }
    navigator
        .serviceWorker
        .register('/sw.js')

    window.addEventListener('offline', _ => location.reload());
}

function showButton(button) {
    button && button.classList.remove('hidden');
}
function hideButton(button) {
    button && button.classList.add('hidden');
}
initSW();


