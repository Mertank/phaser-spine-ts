import { PhaserSpineKeys } from './PhaserSpineKeys';

/**
 * Typedef for a Phaser.Loader with the spine plugin initialized on it
 */
export type PhaserSpineLoader = Phaser.Loader & {
    spine(key: string | PhaserSpineKeys, url?: string | PhaserSpineKeys, overwrite?: boolean): Phaser.Loader;
};