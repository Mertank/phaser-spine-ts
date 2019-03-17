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
     * Handles the loading of resources for a spine asset (image and atlas) through the Phaser.Loader
     *
     * @param key - The key for the spine asset that should be loaded
     * @param url - The url to load the asset from. If it is undefined or null the url will be assumed to be the key.
     * @param overwrite - If an unloaded file is in the queue, this will override that pending asset load
     *
     * @returns The Phaser.Loader instance to allow for chaining
     */
    private loadSpineAssets(key: string, url?: string, overwrite: boolean = false): Phaser.Loader {
        const atlasKey: string = `${key}Atlas`;
        
        // Since the key is being modified build the URL here to 
        let atlasUrl: string = url;
        if (!url) {
            atlasUrl = `${url ? url : ''}${key}.atlas`;
        }

        this.game.load.addToFileList('text', atlasKey, atlasUrl, undefined, overwrite, '.atlas');
        const loadCallback: (progress: number, key: string, success: boolean) => void = (progress: number, key: string, success: boolean) => {
            // The atlas was loaded. Parse through it to find all the images we need to load on top of this
            if (success && key === atlasKey) {
                this.game.load.onFileComplete.remove(loadCallback);

                // In spine each 'page' is an image. They are seperated by blank lines. This just plucks the image files from there.
                const spineAtlasData: string = this.game.cache.getText(atlasKey);
                const spineAtlasLines: string[] = spineAtlasData.split(/\r\n|\r|\n/);
                const spineAtlasImages: string[] = [];
                // Ignoring the last line because we can't read past it anyway
                for (let i: number = 0; i < spineAtlasLines.length - 1; ++i) {
                    if (spineAtlasLines[i].length === 0) {
                        spineAtlasImages.push(spineAtlasLines[i + 1]);
                    }
                }
            }
        };
        this.game.load.onFileComplete.add(loadCallback);

        return this.game.load;
    }
}