import * as plugin from '../src';

/**
 * A Phaser.Game instance that is used for testing the plugin functionality which auto-binds the plugin
 */
export class Game extends Phaser.Game {
    public constructor() {
        super(
            1280, 720,
            Phaser.AUTO,
            'content',
            { 
                create: () => {
                    this.plugins.add(plugin.PhaserSpinePlugin);                    
                }
            }
        );
    }
}
