/**
 * Typedef for a Phaser.Loader with the spine plugin initialized on it
 */
export type PhaserSpineLoader = Phaser.Loader & {
    spine(key: string, url?: string, overwrite?: boolean): Phaser.Loader;
};