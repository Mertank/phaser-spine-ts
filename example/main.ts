import { Game } from './Game';
import { SpineScene } from './SpineScene';
import * as plugin from '../src';

const game = new Game();

game.state.add('Spine', SpineScene);
game.state.start('Spine');