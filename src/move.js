// @flow
import type { Game, Memory, Policy, Transition } from './types';

export default async function<A, G, M> (
  game: Game<A, G>,
  gameState: G,
  memory: Memory<A, G, M>,
  memoryState: M,
  policy: Policy<A>,
): Promise<Transition<A, G>> {
  const actions = game.actions(gameState);
  const rater = memory.rater(memoryState, gameState);
  const action = policy(actions, rater);
  const nextGameState = await game.act(gameState, action);
  const reward = await game.reward(nextGameState, gameState);
  return { gameState, nextGameState, action, reward };
}
