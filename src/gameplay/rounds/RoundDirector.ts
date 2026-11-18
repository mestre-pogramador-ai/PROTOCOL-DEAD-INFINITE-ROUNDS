import { ENEMY_ARCHETYPES, enemyKindForSpawn, type EnemyKind } from '../enemies/EnemyArchetypes';
/** M5: ondas determinísticas, sem relógio ou timer adicional ao GameClock. */
export type RoundPhase = 'preparation' | 'active';
export interface RoundDifficulty { round: number; total: number; maxConcurrent: number; infectedHp: number; spawnInterval: number; preparationSeconds: number }
export interface RoundSnapshot extends RoundDifficulty {
  phase: RoundPhase;
  prepRemaining: number;
  spawned: number;
  remainingToSpawn: number;
  eliminated: number;
  alive: number;
  completed: number;
}
export interface RoundTickEvents { started: boolean; completedRound: number | null }
/** Independent arcade balance: total spawns and render load have hard bounds. */
export const INFINITE_ROUNDS = {
  firstPreparationSeconds: 3,
  preparationSeconds: 6,
  baseEnemyHealth: 84,
  maxTotalPerRound: 48,
  maxConcurrent: 10,
  healthCapMultiplier: 1.6,
} as const;
export function preparationSeconds(round: number): number {
  return round === 1 ? INFINITE_ROUNDS.firstPreparationSeconds : INFINITE_ROUNDS.preparationSeconds;
}
export function difficultyForRound(round: number): RoundDifficulty {
  if (!Number.isSafeInteger(round) || round < 1) throw new Error('Rodada inválida');
  const total = Math.min(INFINITE_ROUNDS.maxTotalPerRound, 6 + 3 * (round - 1));
  const maxConcurrent = round <= 3 ? 6 : round <= 9 ? 8 : INFINITE_ROUNDS.maxConcurrent;
  const hpMultiplier = Math.min(INFINITE_ROUNDS.healthCapMultiplier, 1 + .05 * Math.floor((round - 1) / 3));
  const infectedHp = Math.round(INFINITE_ROUNDS.baseEnemyHealth * hpMultiplier);
  const spawnInterval = Math.max(.65, 1.6 - .06 * (round - 1));
  return { round, total, maxConcurrent, infectedHp, spawnInterval, preparationSeconds: preparationSeconds(round) };
}
/**
 * Callback spawn() returns true ONLY when an enemy was added. A failed spawn never
 * consumes the wave quota. The director never owns enemies or gives credits.
 */
export class RoundDirector {
  private round = 1;
  private phase: RoundPhase = 'preparation';
  private prepRemaining = preparationSeconds(1);
  private spawned = 0;
  private eliminated = 0;
  private completed = 0;
  private spawnTimer = 0;
  private alive = 0;

  reset(): void { this.round = 1; this.phase = 'preparation'; this.prepRemaining = preparationSeconds(1);
    this.spawned = 0; this.eliminated = 0; this.completed = 0; this.spawnTimer = 0; this.alive = 0; }
  beginNow(): boolean {
    if (this.phase !== 'preparation') return false;
    this.phase = 'active'; this.prepRemaining = 0; this.spawnTimer = 0;
    return true;
  }
  recordKill(): void { if (this.phase === 'active' && this.eliminated < this.spawned) this.eliminated++; }
  snapshot(): RoundSnapshot {
    const d = difficultyForRound(this.round);
    return { ...d, phase: this.phase, prepRemaining: this.prepRemaining, spawned: this.spawned,
      remainingToSpawn: d.total - this.spawned, eliminated: this.eliminated, alive: this.alive, completed: this.completed };
  }
  tick(dt: number, countAlive: () => number, spawn: (hp: number, kind: EnemyKind) => boolean): RoundTickEvents {
    const events: RoundTickEvents = { started: false, completedRound: null };
    if (!Number.isFinite(dt) || dt <= 0) return events;
    this.alive = countAlive();
    if (this.phase === 'preparation') {
      this.prepRemaining = Math.max(0, this.prepRemaining - dt);
      if (this.prepRemaining <= 0) { events.started = this.beginNow(); }
      return events;
    }
    const diff = difficultyForRound(this.round);
    this.spawnTimer -= dt;
    // one attempted spawn per fixed tick; cap is strictly on living enemies
    if (this.spawned < diff.total && this.alive < diff.maxConcurrent && this.spawnTimer <= 0) {
      const kind=enemyKindForSpawn(this.round,this.spawned);
      if (spawn(Math.max(1,Math.round(diff.infectedHp*ENEMY_ARCHETYPES[kind].hpMultiplier)),kind)) { this.spawned++; this.alive = countAlive(); this.spawnTimer = diff.spawnInterval; }
      else this.spawnTimer = .3;
    }
    if (this.spawned === diff.total && this.alive === 0) {
      const finished = this.round;
      this.completed = finished;
      this.round++;
      this.phase = 'preparation';
      this.prepRemaining = preparationSeconds(this.round);
      this.spawned = 0; this.eliminated = 0; this.spawnTimer = 0;
      events.completedRound = finished;
    }
    return events;
  }
}
