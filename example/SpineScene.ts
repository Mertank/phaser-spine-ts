import * as plugin from '../src';

export class SpineScene extends Phaser.State {
    public preload(): void {
        this.game.load.path = 'http://esotericsoftware.com/demos/exports/';
        (this.game.load as plugin.PhaserSpineLoader).spine('heroes');

        this.game.load.path = null;
    }
}