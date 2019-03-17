import { PhaserSpineLoader } from './PhaserSpineLoader';

/**
 * Load callback from Phaser
 */
type LoadCallback = (progress: number, key: string, success: boolean) => void;

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

        if (loader.spineAnimations) {
            console.warn('PhaserSpinePlugin.init - Something is already bound to game.load.spineAnimations. Loader could not be initialized.');
        } else {
            loader.spineAnimations = this.loadSpineAnimations.bind(this);
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
        // Path may get changed between the load and complete call. We want it to persist though for the images we load later.
        const loaderPath: string = this.game.load.path;
        
        // Since the key is being modified build the URL here to 
        let atlasUrl: string = url;
        if (!url) {
            atlasUrl = `${url ? url : ''}${key}.atlas`;
        }

        this.game.load.addToFileList('text', atlasKey, atlasUrl, undefined, overwrite, '.atlas');
        const loadCallback: LoadCallback = (progress: number, loadedKey: string, success: boolean) => {
            // The atlas was loaded. Parse through it to find all the images we need to load on top of this
            if (success && loadedKey === atlasKey) {
                this.game.load.onFileComplete.remove(loadCallback);
                this.processAtlasFile(this.game.cache.getText(atlasKey), key, atlasUrl, loaderPath, overwrite);
            }
        };
        this.game.load.onFileComplete.add(loadCallback);

        return this.game.load;
    }

    /**
     * Called when the .atlas file has downloaded successfully.
     *
     * @param spineAtlasData - The atlas data that was just downloaded
     * @param spineKey - The key the spine full spine
     * @param spineUrl - The url for the spine file. Since all the images are relative to the file it's just going to do replacements on this url
     * @param loaderPath - Feeding through the loader path so that we can persist it from the atlas
     * @param overwrite - If an unloaded file is in the queue, this will override that pending asset load
     */
    private processAtlasFile(spineAtlasData: string, spineKey: string, spineUrl: string, loaderPath: string, overwrite: boolean): void {
        // In spine each 'page' is an image. They are seperated by blank lines. This just plucks the image files from there.
        const spineAtlasLines: string[] = spineAtlasData.split(/\r\n|\r|\n/);
        const spineAtlasImages: string[] = [];
        const spineUrlRoot: string = spineUrl.substr(0, spineUrl.lastIndexOf('/'));
        const currentLoaderPath: string = this.game.load.path;
        
        // Ignoring the last line because we can't read past it anyway
        for (let i: number = 0; i < spineAtlasLines.length - 1; ++i) {
            if (spineAtlasLines[i].length === 0) {
                spineAtlasImages.push(spineAtlasLines[i + 1]);
            }
        }

        // Load all the images for this atlas
        const pendingImages: string[] = [];
        const imageLoadedCallback: LoadCallback = (progress: number, key: string, success: boolean) => {
            const imageIndex: number = pendingImages.indexOf(key);
            if (success && imageIndex > -1) {
                pendingImages.splice(imageIndex, 1);

                // All images have been loaded succesfully
                if (pendingImages.length === 0) {
                    // We're going to manually dispatch this signal with the spine key
                    this.game.load.onFileComplete.dispatch(100, spineKey, true, spineAtlasImages.length + 1);
                    this.game.load.onFileComplete.remove(imageLoadedCallback);                    
                }
            }
        };
        this.game.load.onFileComplete.add(imageLoadedCallback);

        this.game.load.path = loaderPath;
        for (let i: number = 0; i < spineAtlasImages.length; ++i) {
            const imageKey: string = `${spineKey}-${spineAtlasImages[i]}`;
            pendingImages.push(imageKey);
            this.game.load.addToFileList('image', imageKey, `${spineUrlRoot}${spineAtlasImages[i]}`, undefined, overwrite);
        }
        this.game.load.path = currentLoaderPath;
    }

    /**
     * Loads a spine animations file
     *
     * @param key - The key to load the spine animations into
     * @param url - The url of the spine animations file
     * @param overwrite - If there is an existing asset at this key should this one overwrite it
     */
    private loadSpineAnimations(key: string, url?: string, overwrite?: boolean): Phaser.Loader {
        this.game.load.addToFileList('json', key, url, undefined, overwrite, '.json');
        return this.game.load;
    }
}