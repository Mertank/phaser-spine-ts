import { PhaserSpineLoader } from './PhaserSpineLoader';
import { PhaserSpineKeys } from './PhaserSpineKeys';

/**
 * This plugin adds a loading helper to the Phaser.Loader which is assigned to game.load
 * as well as a factory on game.create to allow for the creation of spine objects in the Phaser world
 */
export class PhaserSpinePlugin extends Phaser.Plugin {
    /**
     * Initializes the plugin by adding the spine function to the loader
     */
    public init(): void {
        const loader: PhaserSpineLoader = this.game.load as PhaserSpineLoader;
        if (loader.spine) {
            console.warn('PhaserSpinePlugin.init - Something is already bound to game.load.spine. Loader could not be initialized.');
        } else {
            loader.spine = this.loadSpineAssets.bind(this);
        }
    }

    /**
     * Handles the loading of resources for a spine asset through the Phaser.Loader
     *
     * @param key - The key for the spine asset that should be loaded. Can also be an instance of PhaserSpineKeys for more customized file loading.
     * @param url - The url to load the asset from. If it is undefined or null the url will be assumed to be the key.
     * @param overwrite - If an unloaded file is in the queue, this will override that pending asset load
     *
     * @returns The Phaser.Loader instance to allow for chaining
     */
    private loadSpineAssets(key: string | PhaserSpineKeys, url?: string | PhaserSpineKeys, overwrite: boolean = false): Phaser.Loader {
        // Phaser assets are comprised of 3 files. The .atlas and .png for the spritesheet and the .json file for the animations.
        // This queues all 3 to load.
        let imageKey: string = '';
        let atlasKey: string = '';
        let animationsKey: string = '';

        if (typeof key === 'object') {
            imageKey = (key as PhaserSpineKeys).image;
            atlasKey = (key as PhaserSpineKeys).atlas;
            animationsKey = (key as PhaserSpineKeys).animations;
        } else {
            imageKey = `${key}-image`;
            atlasKey = `${key}-atlas`;
            animationsKey = `${key}-anims`;
        }

        let imageUrl: string = undefined;
        let atlasUrl: string = undefined;
        let animationsUrl: string = undefined;

        // Build custom urls if the ones provided don't have an extension in them
        if (url) {
            if (typeof url === 'object') {
                imageUrl = (url as PhaserSpineKeys).image;
                atlasUrl = (url as PhaserSpineKeys).atlas;
                animationsUrl = (url as PhaserSpineKeys).animations;
            } else {
                if (/\.(json|png|atlas)/.exec(url)) {
                    console.warn('Phaser.Loader.spine - url parameter should not have an extension');
                }

                imageUrl = `${url}.png`;
                atlasUrl = `${url}.json`;
                animationsUrl = `${url}.atlas`;
            }
        }

        this.game.load.addToFileList('json', animationsKey, animationsUrl, undefined, overwrite, '.json');
        this.game.load.addToFileList('image', imageKey, imageUrl, undefined, overwrite, '.png');
        this.game.load.addToFileList('text', atlasKey, atlasUrl, undefined, overwrite, '.atlas');

        return this.game.load;
    }
}