import { describe, expect, it, vi } from 'vitest';
import { INFINITE_ROUNDS, RoundDirector, difficultyForRound, preparationSeconds } from '../gameplay/rounds/RoundDirector';
import { PlayerDamage } from '../gameplay/combat/PlayerDamage';
import { Runtime } from '../app/Runtime';
import { BEST_KEY } from '../infrastructure/persistence/LocalBest';
import { SETTINGS_KEY } from '../infrastructure/persistence/Settings';

describe('INFINITE ROUNDS — regras independentes', () => {
  it('inicia em 3 segundos e reinicia cada nova onda em 6 segundos', () => {
    const r = new RoundDirector();
    expect(preparationSeconds(1)).toBe(3);
    expect(preparationSeconds(2)).toBe(6);
    expect(r.snapshot().phase).toBe('preparation');
    expect(r.tick(2, () => 0, () => false).started).toBe(false);
    expect(r.tick(1, () => 0, () => false).started).toBe(true);
    expect(r.snapshot()).toMatchObject({ round: 1, phase: 'active' });
    let alive = 0;
    for (let i = 0; i < 6; i++) {
      const state = r.snapshot();
      if (state.spawned === 6) break;
      r.tick(2, () => alive, () => { alive++; return true; });
    }
    expect(r.snapshot().spawned).toBe(6);
    const completed = r.tick(.016, () => 0, () => false);
    expect(completed.completedRound).toBe(1);
    expect(r.snapshot()).toMatchObject({ round: 2, phase: 'preparation', prepRemaining: 6 });
  });
  it('mantém limite absoluto de 10 infectados simultâneos e 48 por rodada', () => {
    for (let round = 1; round <= 200; round++) {
      const d = difficultyForRound(round);
      expect(d.total).toBeLessThanOrEqual(INFINITE_ROUNDS.maxTotalPerRound);
      expect(d.maxConcurrent).toBeLessThanOrEqual(INFINITE_ROUNDS.maxConcurrent);
      expect(d.infectedHp).toBeGreaterThan(0);
      expect(d.infectedHp).toBeLessThanOrEqual(Math.round(84 * 1.6));
      expect(d.spawnInterval).toBeGreaterThanOrEqual(.65);
    }
    expect(difficultyForRound(1)).toMatchObject({ total: 6, maxConcurrent: 6, infectedHp: 84 });
    expect(difficultyForRound(20).total).toBe(48);
    expect(() => difficultyForRound(Infinity)).toThrow();
  });
  it('recupera somente vida perdida e nunca ressuscita um jogador morto', () => {
    const health = new PlayerDamage();
    expect(health.apply(25)).toBe(true);
    expect(health.heal(20)).toBe(20);
    expect(health.health).toBe(95);
    expect(health.heal(20)).toBe(5);
    expect(health.apply(1000)).toBe(false); // ainda existe janela de imunidade
    health.tick(1);
    expect(health.apply(1000)).toBe(true);
    expect(health.heal(20)).toBe(0);
    expect(health.health).toBe(0);
  });
  it('grava preferências e recordes em chaves distintas do DEAD ZONE', () => {
    expect(BEST_KEY).toContain('infinite-rounds');
    expect(SETTINGS_KEY).toContain('infinite-rounds');
    expect(BEST_KEY).not.toContain('dead-zone');
  });
  it('abre o corredor sem compra desde o início e após reiniciar', async () => {
    vi.stubGlobal('window', {addEventListener:()=>{},removeEventListener:()=>{}});
    const runtime = await Runtime.create();
    try {
      expect(runtime.isDoorOpen()).toBe(true);
      runtime.start();runtime.reset();
      expect(runtime.isDoorOpen()).toBe(true);
      expect(runtime.getEconomyState().doorPurchased).toBe(false);
    } finally {runtime.dispose();vi.unstubAllGlobals();}
  });
});

describe('INFINITE ROUNDS — progressão longa', () => {
  it('executa 20 rodadas, respeita o teto real de vivos e introduz os quatro arquétipos', () => {
    const director = new RoundDirector();
    let alive = 0;
    const kinds = new Set<string>();
    const totals: number[] = [];
    for (let round = 1; round <= 20; round++) {
      const expectedTotal = Math.min(48, 6 + 3 * (round - 1));
      expect(director.snapshot().prepRemaining).toBe(round === 1 ? 3 : 6);
      expect(director.tick((round === 1 ? 3 : 6) - .01, () => alive, () => false).started).toBe(false);
      expect(director.tick(.02, () => alive, () => false).started).toBe(true);
      let spawned = 0;
      const spawn = (_hp: number, kind: string) => { alive++; spawned++; kinds.add(kind); return true; };
      const cap = round <= 3 ? 6 : round <= 9 ? 8 : 10;
      for (let tick = 0; tick < cap + 5; tick++) director.tick(2, () => alive, spawn);
      expect(alive).toBe(cap);
      expect(spawned).toBe(cap);
      // Clear each batch and allow the actual director to schedule the rest.
      for (let tick = 0; tick < 200 && director.snapshot().completed < round; tick++) {
        alive = 0;
        director.tick(2, () => alive, spawn);
        expect(alive).toBeLessThanOrEqual(cap);
      }
      expect(director.snapshot().completed).toBe(round);
      expect(spawned).toBe(expectedTotal);
      totals.push(spawned);
    }
    expect(totals.slice(14)).toEqual([48,48,48,48,48,48]);
    expect([...kinds].sort()).toEqual(['brute','common','predator','runner']);
  });
});
