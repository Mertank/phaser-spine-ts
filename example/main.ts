import { SpineGame } from './SpineGame';
import { SpineScene } from './SpineScene';

const game = new SpineGame();

game.state.add('Spine', SpineScene);
game.state.start('Spine');