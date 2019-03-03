import * as plugin from '../src';

export class SpineScene extends Phaser.State {
    public preload(): void {
        (this.game.load as plugin.PhaserSpineLoader).spine(
            'demo-spine',
            {
                atlas: 'http://esotericsoftware.com/demos/exports/heroes.atlas',
                image: 'http://esotericsoftware.com/demos/exports/heroes.png',
                animations: 'http://esotericsoftware.com/demos/exports/demos.json'
            }
        );
    }
}