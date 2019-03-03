export class SpineScene extends Phaser.State {
    public preload(): void {
        this.game.load.json('test');
    }
}