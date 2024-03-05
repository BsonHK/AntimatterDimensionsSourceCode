import { Currency } from "../../currency";
import { DC } from "../../constants";
import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";
import { SetPurchasableMechanicState } from "../../utils";

const disabledMechanicUnlocks = {
  achievements: () => ({}),
  IPMults: () => ({}),
  EPMults: () => ({}),
  galaxies: () => ({}),
  InfinitiedMults: () => ({}),
  infinitiedGen: () => ({}),
  eternityGain: () => ({}),
  eternityMults: () => ({}),
  studies: () => ({}),
  EPgen: () => ({}),
  autoec: () => ({}),
  replicantiIntervalMult: () => ({}),
  tpMults: () => ({}),
  glyphs: () => !PelleRifts.vacuum.milestones[0].canBeApplied,
  V: () => ({}),
  singularity: () => ({}),
  continuum: () => ({}),
  alchemy: () => ({}),
  achievementMult: () => ({}),
  blackhole: () => ({}),
  effarig: () => ({}),
  imaginaryUpgrades: () => ({}),
  glyphsac: () => ({}),
  timeTheoremAutobuyer: () => ({}),
  rupg10: () => ({}),
  dtMults: () => ({}),
  chargedInfinityUpgrades: () => ({}),
  alteration: () => ({}),
  timeTheorems: () => ({})
};