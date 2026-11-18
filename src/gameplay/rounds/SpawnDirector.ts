import {STATION_ENTRIES} from '../../world/maps/containment';
import { enemyCanOccupy, hasEnemyLineOfSight } from '../enemies/Navigation';
import type { InfectedSnapshot } from '../enemies/Infected';
/** Nós de spawn desenhados à mão; deslocamentos locais não geram novas salas. */
export const WAVE_SPAWNS: readonly (readonly [number, number])[] = STATION_ENTRIES.map(({x,z})=>[x,z]);
export interface SpawnContext { x: number; z: number; doorOpen: boolean; sequence: number; enemies: readonly InfectedSnapshot[]; yaw?: number }
/** Prefere entradas distantes e rejeita pontos visíveis à frente do jogador. */
export function chooseSpawn(c: SpawnContext): readonly [number, number] | null {
  const offsets:readonly (readonly [number,number])[] = [[0,0],[1.1,0],[-1.1,0],[0,1.1],[0,-1.1],[1.1,1.1],[-1.1,-1.1]];
  const options:{p:readonly [number,number];score:number}[]=[];
  for(let i=0;i<WAVE_SPAWNS.length;i++){
    const base=WAVE_SPAWNS[i];
    for(let j=0;j<offsets.length;j++){
      const p:readonly [number,number]=[base[0]+offsets[j][0],base[1]+offsets[j][1]];
      const dx=p[0]-c.x,dz=p[1]-c.z,dist=Math.hypot(dx,dz);
      if (!enemyCanOccupy(p[0],p[1],c.doorOpen) || dist < 6.5) continue;
      if (!c.enemies.every(e=>e.state==='dead'||Math.hypot(e.x-p[0],e.z-p[1])>=.95)) continue;
      const behindCover=!hasEnemyLineOfSight(p[0],p[1],c.x,c.z,c.doorOpen);
      const inView=c.yaw===undefined?false:(dx*-Math.sin(c.yaw)+dz*-Math.cos(c.yaw))/dist>.7;
      if(inView && !behindCover) continue;
      const score=dist + (behindCover?3.5:0) + (dist>=12?2:0)
        + (((i*7+j*13+c.sequence*11)%37)/37)*2.2 - j*.1;
      options.push({p,score});
    }
  }
  options.sort((a,b)=>b.score-a.score);
  return options[0]?.p??null;
}
