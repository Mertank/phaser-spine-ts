/**
 * This plugin adds a loading helper to the Phaser.Loader which is assigned to game.load
 * as well as a factory on game.create to allow for the creation of spine objects in the Phaser world
 */
export class PhaserSpinePlugin extends Phaser.Plugin {
    /**
     * Initializes the plugin by adding the spine function to the loader
     */
    public init(): void {
        if (this.game.load['spine']) {
            console.warn('PhaserSpinePlugin.init - Something is already bound to game.load.spine. Loader could not be initialized.');
        } else {
            this.game.load['spine'] = this.loadSpineAssets.bind(this);
        }
    }

    /**
     * Handles the loading of resources for a spine asset through the Phaser.Loader
     *
     * @param key - The key for the spine asset that should be loaded
     */
    private loadSpineAssets(key: string): void {
        
    }
}