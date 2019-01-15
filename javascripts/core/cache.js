class Lazy {
  constructor(getValue) {
    this._getValue = getValue;
  }

  get value() {
    if (this._value === undefined) {
      this._value = this._getValue();
    }
    return this._value;
  }

  invalidate() {
    this._value = undefined;
  }
}

const GameCache = {
  worstChallengeTime: new Lazy(() => Math.max(player.challengeTimes.max(), 100)),

  bestRunIPPM: new Lazy(() => {
    const bestRunIppm = player.lastTenRuns
      .map(run => ratePerMinute(run[1], run[0]))
      .reduce(Decimal.maxReducer);

    if (bestRunIppm.gte(1e8)) giveAchievement("Oh hey, you're still here");
    if (bestRunIppm.gte(1e300)) giveAchievement("MAXIMUM OVERDRIVE");
    return bestRunIppm;
  }),

  averageEPPerRun: new Lazy(() => {
    return player.lastTenEternities
      .map(run => run[1])
      .reduce(Decimal.sumReducer)
      .dividedBy(player.lastTenEternities.length);
  }),

  tickSpeedMultDecrease: new Lazy(() => {
    return 10 - Effects.sum(
      BreakInfinityUpgrade.tickspeedCostMult,
      EternityChallenge(11).reward
    );
  }),

  dimensionMultDecrease: new Lazy(() => {
    return 10 - Effects.sum(
      BreakInfinityUpgrade.dimCostMult,
      EternityChallenge(6).reward
    );
  }),

  invalidate() {
    for (let key in this) {
      if (!this.hasOwnProperty(key)) continue;
      const property = this[key];
      if (property instanceof Lazy) {
        property.invalidate();
      }
    }
  }
};