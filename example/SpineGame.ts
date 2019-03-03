import * as plugin from '../src';
import { SpineScene } from './SpineScene';

/**
 * A Phaser.Game instance that is used for testing the plugin functionality which auto-binds the plugin
 */
export class SpineGame extends Phaser.Game {
    public constructor() {
        super(
            1280, 720,
            Phaser.AUTO,
            'content',
            { 
                create: () => {
                    this.plugins.add(plugin.PhaserSpinePlugin);

                    this.state.add('Spine', SpineScene);
                    this.state.start('Spine');
                }
            }
        );
    }
}
