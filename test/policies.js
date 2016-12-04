import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import { describe, it } from 'mocha'; // eslint-disable-line import/no-extraneous-dependencies
import * as policies from '../src/policies';

describe('policies', () => {
  const actions = ['A', 'B', 'C'];
  const rater = rs => a => rs[a];
  const rates1 = { A: 1, B: 2, C: 3 };
  const rates2 = { A: 3, B: 2, C: 1 };

  const distribution = async (n, policy, rates) => {
    const keys = [...Array(n).keys()]
    return await keys.reduce(
      async (prev) => {
        prev = await prev;
        const choice = await policy(actions, rater(rates));
        return { ...prev, [choice]: prev[choice] + 1 };
      }, { A: 0, B: 0, C: 0 }
    );
  };

  it('should be uniform (random)', async () => {
    const n = 1000;
    const choices = await distribution(n, policies.random, rates1);

    const range = [n / 4, n / 2];
    expect(choices.A).to.be.within(...range);
    expect(choices.B).to.be.within(...range);
    expect(choices.C).to.be.within(...range);
  });

  it('should choose the highest rated action (greedy)', async () => {
    const n = 100;
    const choices1 = await distribution(n, policies.greedy, rates1);
    const choices2 = await distribution(n, policies.greedy, rates2);

    expect(choices1.C).to.equal(n);
    expect(choices2.A).to.equal(n);
  });

  it('should be epsilon random and 1 - epsilon greedy (egreedy)', async () => {
    const n = 1000;
    const epsilon = 0.5;
    const choices = await distribution(n, policies.egreedy(epsilon), rates1);

    expect(choices.A).to.be.within(n / 8, n / 4);
    expect(choices.B).to.be.within(n / 8, n / 4);
    expect(choices.C).to.be.within(n / 2, n);
  });
});
