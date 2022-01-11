import { GameDatabase } from "./secret-formula/game-database";
import { GameMechanicState } from "./game-mechanics/index.js";

export const Speedrun = {
  unlock() {
    if (player.speedrun.isUnlocked) return;
    // TODO Actually change this when the time comes
    Modal.message.show(`You have unlocked Speedrun Mode! This allows you to start a new save file with some slight
      changes which can be helpful if you're trying to complete the game as quickly as possible. The option to
      start a Speedrun Save is now available in the Options tab, under Saving. Choosing to start a Speedrun Save
      will provide you with another modal with more in-depth information.`);
    player.speedrun.isUnlocked = true;
  },
  // Hard-resets the current save and puts it in a state ready to be "unpaused" once resources start being generated
  prepareSave(name) {
    GameStorage.hardReset();
    player.speedrun.isUnlocked = true;
    player.speedrun.isActive = true;
    player.reality.seed = Date.now();

    // We make a few assumptions on settings which are likely to be changed for all speedrunners
    for (const key of Object.keys(player.options.confirmations)) player.options.confirmations[key] = false;
    for (const key of Object.keys(player.options.animations)) player.options.animations[key] = false;

    // If a name isn't given, choose a somewhat-likely-to-be-unique big number instead
    if (name === "") player.speedrun.name = `AD Player #${Math.floor(1e7 * Math.random())}`;
    else player.speedrun.name = name;

    // "Fake News" Achievement, given for free to partially mitigate promoting weird strategies at the beginning of runs
    Achievement(22).unlock();

    // Some time elapses after the reset and before the UI is actually ready, which ends up getting "counted" as offline
    player.speedrun.offlineTimeUsed = 0;
  },
  // Speedruns are initially paused until startTimer is called, which happens as soon as the player purchases a AD or
  // uses the Konami code. Until then, they're free to do whatever they want with the UI
  startTimer() {
    if (player.speedrun.hasStarted) return;
    player.speedrun.hasStarted = true;
    player.speedrun.startDate = Date.now();
    player.lastUpdate = Date.now();
  },
  isPausedAtStart() {
    return player.speedrun.isActive && !player.speedrun.hasStarted;
  },
  // This needs to be here due to JS applying "function scope" to the player object within importing in storage.js
  setImported(state) {
    player.speedrun.isImported = state;
  }
};

class SpeedrunMilestone extends GameMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryComplete(args));
  }

  get name() {
    return this.config.name;
  }

  get isReached() {
    return player.speedrun.records[this.config.key] !== 0;
  }

  tryComplete(args) {
    if (!this.config.checkRequirement(args)) return;
    this.complete();
  }

  complete() {
    if (this.isReached) return;
    player.speedrun.records[this.config.key] = player.records.realTimePlayed;
    player.speedrun.milestones.push(this.config.id);
    GameUI.notify.success(`Speedrun Milestone Reached: ${this.name}`);
  }
}

export const SpeedrunMilestones = SpeedrunMilestone.createAccessor(GameDatabase.speedrunMilestones);
