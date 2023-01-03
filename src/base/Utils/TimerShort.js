export default class TimerShort{
    constructor(
        timerId,
        callback,
        uiManager
    ){
        this.timerId = timerId;
        this.callback = callback;
        this.uiManager = uiManager;
        this.isPaused = false;
    }
    start(seconds, interval = 1000, restartInterval = 200){

        clearInterval(this.timerId);
        this.timerId = setInterval(() => {

            if(!this.isPaused){
                seconds--;
            }

            if(seconds === 0) {

                clearInterval(this.timerId);
                this.isPaused = true;
                this.uiManager.wrong++;
                this.uiManager.tweens['wrong'].play();
                this.uiManager.tweens['wrong'].restart();
                this.uiManager.sounds['wrong'].play();

                setTimeout(() => {
                    this.callback();
                    this.isPaused = false;
                }, restartInterval);
            }

        }, interval);
    }
}