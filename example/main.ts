import { Game } from './Game';
import { SpineScene } from './SpineScene';

const game = new Game();

game.state.add('Spine', SpineScene);
game.state.start('Spine');