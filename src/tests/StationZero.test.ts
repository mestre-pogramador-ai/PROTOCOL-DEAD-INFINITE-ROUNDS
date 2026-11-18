import {expect,it,vi} from 'vitest';
import {Runtime} from '../app/Runtime';
import type {Action} from '../core/input/InputManager';
import {EnemyManager} from '../gameplay/enemies/EnemyManager';
import {ENEMY_KINDS} from '../gameplay/enemies/EnemyArchetypes';
import {enemyCanOccupy, enemyCanTraverse, findEnemyPath} from '../gameplay/enemies/Navigation';
import {STATION_ENTRIES} from '../world/maps/containment';

for(const entry of STATION_ENTRIES) {
  it('routes every archetype from the '+entry.id+' intake to attack',()=>{
    for(const kind of ENEMY_KINDS){
      const enemies=new EnemyManager();
      enemies.clear();
      enemies.spawn(entry.x,entry.z,100,kind);
      let hit=false;
      for(let tick=0;tick<3600&&!hit;tick++){
        hit=enemies.tick(1/60,-1,0,true).length>0;
        const [enemy]=enemies.snapshots();
        expect(enemyCanOccupy(enemy.x,enemy.z,true)).toBe(true);
      }
      expect(hit,kind).toBe(true);
    }
  },20000);
}

it('connects both sides of each intake to the service loop and the far corners',()=>{
  const goals=[[-18,-18],[18,-18],[-18,18],[18,18],[0,5.7],[-2.5,-.45]];
  for(const {x,z} of STATION_ENTRIES){
    for(const [tx,tz] of goals){
      const path=findEnemyPath(x,z,tx,tz,true);
      expect(path.length).toBeGreaterThan(0);
      let previous:number[]=[x,z];
      for(const waypoint of [...path,[tx,tz]]){
        expect(enemyCanTraverse(previous[0],previous[1],waypoint[0],waypoint[1],true)).toBe(true);
        previous=waypoint;
      }
    }
  }
});

it('survives three successive waves with natural spawns, M9 shots and station ammunition',async()=>{
  const runtime=await Runtime.create();
  vi.stubGlobal('window',{addEventListener:()=>{},removeEventListener:()=>{}});
  try{
    runtime.start();
    runtime.setPointerLocked(true);
    const controls=vi.spyOn(runtime.input,'snapshot');
    for(let tick=0;tick<60*360&&runtime.getRoundState().completed<3;tick++){
      const [x,y,z]=runtime.getSnapshot().current.position;
      const target=runtime.enemies.snapshots()
        .filter(e=>e.state!=='dead'&&enemyCanTraverse(x,z,e.x,e.z,true))
        .sort((a,b)=>Math.hypot(a.x-x,a.z-z)-Math.hypot(b.x-x,b.z-z))[0];
      const keys=new Set<Action>();
      if(target){
        const dx=target.x-x,dz=target.z-z;
        const look=runtime.getLook();
        runtime.look((look.yaw-Math.atan2(-dx,-dz))/.0022,
          (look.pitch-Math.atan2(1.78-y-.65,Math.hypot(dx,dz)))/.0022);
        keys.add('fire');
      }
      const weapon=runtime.getWeaponState();
      if(!weapon.ammo)keys.add('reload');
      if(weapon.reserve<90)keys.add('interact');
      controls.mockReturnValue({moveX:0,moveY:0,held:new Set(),pressed:keys});
      runtime.frame(1/60);
      if(runtime.getCombatState().gameOver)break;
    }
    console.info("Station Zero three-wave run",runtime.getResults());
    expect(runtime.getRoundState()).toMatchObject({round:4,completed:3});
    expect(runtime.getResults()).toMatchObject({kills:27,doorPurchased:false});
    expect(runtime.getResults().creditsSpent).toBeGreaterThan(0);
  }finally{runtime.dispose();vi.restoreAllMocks();vi.unstubAllGlobals();}
},20000);
