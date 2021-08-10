export class Audio {
    constructor() {
        const FX_VOL = 0.6;
        const DRUM_VOL = 0.3;

        this.foundationLoop = document.createElement('audio');
        this.foundationLoop.src = './content_modular_ebm/DRUMS 1 - A (Freeze) [2021-08-02 130617].m4a'
        this.foundationLoop.volume = DRUM_VOL;
        this.foundationLoop.loop = true;

        this.scoreNoise = document.createElement('audio');
        this.scoreNoise.src = './fx_audio/Points.mp3'
        this.scoreNoise.volume = 0.3;
        this.scoreNoise.loop = false;

        this.jumpOneshot = document.createElement('audio');
        this.jumpOneshot.src = './fx_audio/Ninja Jump.mp3';
        this.jumpOneshot.volume = FX_VOL;
        this.jumpOneshot.loop = false;

        this.gameOverOneshot = document.createElement('audio');
        this.gameOverOneshot.src = './fx_audio/Game Over.mp3';
        this.gameOverOneshot.volume = FX_VOL;
        this.gameOverOneshot.loop = false;
    }

    startLoops = () => {
        this.foundationLoop.play();
    };

    playScore = () => {
        this.scoreNoise.currentTime = 0;
        this.scoreNoise.play();
    }

    triggerPlayerJump = () => {
        this.jumpOneshot.currentTime = 0;
        this.jumpOneshot.play();
    }

    triggerGameOver = () => {
        this.gameOverOneshot.currentTime = 0;
        this.gameOverOneshot.play();
    }

    stopAudio = () => {
        this.jumpOneshot.src = '';
        this.scoreNoise.src = '';
        this.foundationLoop.src = '';
    };
}