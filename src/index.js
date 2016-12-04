// @flow
import type { Game, Memory, Policy, Episode } from './types';
import { play, train } from './tasks';

export default <A, G, M>() => Object.create({
  game(game: Game<A, G>, gameState: G) {
    this.game = game;
    this.gameState = gameState;
  },
  memory(memory: Memory<A, G, M>, memoryState: M) {
    this.memory = memory;
    this.memoryState = memoryState;
  },
  policies(move: Policy<A>, learn: Policy<A> = move, show: Policy<A> = learn) {
    this.movePolicy = move;
    this.learnPolicy = learn;
    this.playPolicy = show;
  },
  async train(n: number, alpha: number, gamma: number) {
    const trainment = train(
      alpha, gamma,
      this.game, this.gameState,
      this.memory, this.memoryState,
      this.movePolicy,
      this.learnPolicy,
    );

    for await (let memoryState of trainment) { // eslint-disable-line
      this.memoryState = memoryState.value;
    }
  },
  play(): Episode<A, G> {
    return play(
      this.game, this.gameState,
      this.memory, this.memoryState,
      this.playPolicy,
    );
  },
});
