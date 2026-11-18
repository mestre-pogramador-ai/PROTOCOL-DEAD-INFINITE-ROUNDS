import {beforeAll,describe,expect,it,vi} from 'vitest';
import RAPIER from '@dimforge/rapier3d-compat';
import {Box3,Vector3,Ray,Mesh,MeshBasicMaterial,Raycaster} from 'three';
import {CONTAINMENT_MODULES,PERK_MACHINES} from '../world/maps/containment';
import {ATLAS_TILES,createEnvironmentLayout,createDoorLayout} from '../presentation/rendering/EnvironmentLayout';
import {buildEnvironmentBatches,createPartGeometry,disposeEnvironmentBatches} from '../presentation/rendering/EnvironmentGeometry';
import {PhysicsWorld} from '../physics/PhysicsWorld';
import {PLAYER} from '../gameplay/player/PlayerController';
import {enemyCanOccupy,enemyCanTraverse,findEnemyPath} from '../gameplay/enemies/Navigation';
import {WAVE_SPAWNS} from '../gameplay/rounds/SpawnDirector';
import {Runtime} from '../app/Runtime';
import type {InputSnapshot} from '../core/input/InputManager';
const idle:InputSnapshot={held:new Set(),pressed:new Set(),moveX:0,moveY:0},dt=1/60;
function tick(w:PhysicsWorld,n:number,input=idle){for(let i=0;i<n;i++)w.step(dt,input,0);}
function teleport(w:PhysicsWorld,x:number,y:number,z:number){w.world.forEachRigidBody(b=>{if(b.isKinematic()){b.setTranslation({x,y,z},true);b.setNextKinematicTranslation({x,y,z});}});w.syncInterpolation();}
const layout=createEnvironmentLayout();
describe('M8.1.3 environment safety and cost',()=>{
 it('uses one 40 m floor with a continuous perimeter and roof',()=>{
  expect(CONTAINMENT_MODULES.filter(m=>m.kind==='floor').map(m=>m.size)).toEqual([[40,.5,40]]);
  expect(CONTAINMENT_MODULES.find(m=>m.kind==='ceiling')?.size).toEqual([40,.2,40]);
  for(const [x,z] of [[-20,0],[20,0],[0,20],[0,-20]])expect(enemyCanOccupy(x,z,true)).toBe(false);
 });
 it('keeps decorative assemblies inside their existing solid envelopes',()=>{
  for(const p of layout){
   const anchor=CONTAINMENT_MODULES.find(m=>m.id===p.anchor)!;expect(anchor,p.id).toBeDefined();
   const half=new Vector3(...anchor.size).multiplyScalar(.5),centre=new Vector3(...anchor.position);
   // Flush lining/signs <= 3.5 cm; roof coffers hang <= 15 cm; floor markings <= 1 cm.
   const min=centre.clone().sub(half),max=centre.clone().add(half);
   const allowance=anchor.kind==='wall'?.036:anchor.kind==='floor'?.01:.006;
   min.addScalar(-allowance);max.addScalar(allowance);if(anchor.kind==='ceiling')min.y-=.16;
   const g=createPartGeometry(p);g.computeBoundingBox();const b=g.boundingBox!;
   expect(b.min.x,p.id).toBeGreaterThanOrEqual(min.x-.00001);expect(b.max.x,p.id).toBeLessThanOrEqual(max.x+.00001);
   expect(b.min.y,p.id).toBeGreaterThanOrEqual(min.y-.00001);expect(b.max.y,p.id).toBeLessThanOrEqual(max.y+.00001);
   expect(b.min.z,p.id).toBeGreaterThanOrEqual(min.z-.00001);expect(b.max.z,p.id).toBeLessThanOrEqual(max.z+.00001);g.dispose();
  }
 });
 it('keeps the inclined console display visible from its normal approach',()=>{
  const material=new MeshBasicMaterial(),pieces=layout.filter(p=>p.anchor==='control-console');
  const meshes=pieces.map(p=>{const m=new Mesh(createPartGeometry(p),material);m.name=p.surface;m.updateMatrixWorld();return m;});
  try{const origin=new Vector3(4,1.55,-2.8),direction=new Vector3(4,.934,-5.47).sub(origin).normalize();expect(new Raycaster(origin,direction).intersectObjects(meshes)[0]?.object.name).toBe('atlas');}
  finally{meshes.forEach(m=>m.geometry.dispose());material.dispose();}
 });
 it('exposes equipment panels rather than hiding them inside opaque casings',()=>{
  const samples=[
   {parts:createDoorLayout(),from:[-3,-1,.8],to:[0,-1,.8],surface:'paint'},
   {parts:layout.filter(p=>p.anchor==='power-cabinet'),from:[-4,1.1,.3],to:[-6,1.1,.3],surface:'metal'},
   {parts:layout.filter(p=>p.anchor==='perk-vitality'),from:[-3,.62,5],to:[-3,.62,7.1],surface:'paint'},
   {parts:layout.filter(p=>p.anchor==='ammo-station'),from:[-2.5,.5,0],to:[-2.5,.5,-1.5],surface:'paint'},
  ];
  const material=new MeshBasicMaterial();
  try{for(const sample of samples){const meshes=sample.parts.map(p=>{const m=new Mesh(createPartGeometry(p),material);m.name=p.surface;m.updateMatrixWorld();return m;});
   try{const from=new Vector3(...sample.from as [number,number,number]),dir=new Vector3(...sample.to as [number,number,number]).sub(from).normalize();expect(new Raycaster(from,dir).intersectObjects(meshes)[0]?.object.name,JSON.stringify(sample.from)).toBe(sample.surface);}
   finally{meshes.forEach(m=>m.geometry.dispose());}
  }}finally{material.dispose();}
 });
 it('shields every intake from head-height fire at the centre',()=>{
  for(const [x,z] of WAVE_SPAWNS){
   const ray=new Ray(new Vector3(0,1.78,0),new Vector3(x,0,z).normalize());
   expect(CONTAINMENT_MODULES.filter(m=>m.id.startsWith('intake-')).some(m=>{
    const hit=ray.intersectBox(new Box3().setFromCenterAndSize(new Vector3(...m.position),new Vector3(...m.size)),new Vector3());
    return hit && hit.distanceTo(ray.origin)<Math.hypot(x,z);
   })).toBe(true);
  }
 });
 it('batches static art into at most thirteen shared batches with bounded geometry and cleanup',()=>{
  const batches=buildEnvironmentBatches(layout),door=buildEnvironmentBatches(createDoorLayout());
  expect(batches.length).toBeLessThanOrEqual(13);expect(door.length).toBeLessThanOrEqual(5);
  const triangles=[...batches,...door].reduce((n,b)=>n+(b.geometry.index?.count??b.geometry.getAttribute('position').count)/3,0);
  expect(triangles).toBeLessThan(24000);
  const disposed=batches.map(b=>{const spy=vi.fn();b.geometry.addEventListener('dispose',spy);return spy;});disposeEnvironmentBatches(batches);disposeEnvironmentBatches(door);disposed.forEach(spy=>expect(spy).toHaveBeenCalledOnce());
  console.info('M813 environment',layout.length,'parts',batches.length,'static batches',door.length,'door batches',triangles,'triangles');
 });
 it('uses non-overlapping padded atlas regions inside one local 1024 texture',()=>{
  const tiles=Object.values(ATLAS_TILES);for(let i=0;i<tiles.length;i++){
   const[x,y,w,h]=tiles[i];expect(x).toBeGreaterThanOrEqual(0);expect(y).toBeGreaterThanOrEqual(0);expect(x+w).toBeLessThanOrEqual(1024);expect(y+h).toBeLessThanOrEqual(1024);
   for(let j=i+1;j<tiles.length;j++){const[a,b,c,d]=tiles[j];expect(x+w<=a||a+c<=x||y+h<=b||b+d<=y).toBe(true);}
  }
 });
});
describe('M8.1.3 actual physics and gameplay regression',()=>{
 beforeAll(async()=>{await RAPIER.init();});
 it('keeps every wave spawn and all purchase approaches reachable',()=>{
  for(const [x,z]of WAVE_SPAWNS){expect(enemyCanOccupy(x,z,false)).toBe(true);expect(findEnemyPath(x,z,0,0,false).length).toBeGreaterThan(0);}
  const approaches=[[-2.5,-.45],[6.3,0],...PERK_MACHINES.map(m=>[m.position[0],5.7])];
  for(const [x,z]of approaches){expect(enemyCanOccupy(x,z,false)).toBe(true);expect(findEnemyPath(0,0,x,z,false).length).toBeGreaterThan(0);}
  expect(enemyCanTraverse(7,0,9,0,false)).toBe(false);expect(enemyCanTraverse(7,0,9,0,true)).toBe(true);
 });
 it('ordinary floor jump stays below the roof and returns without changing its height',()=>{
  const w=new PhysicsWorld();try{
   tick(w,100);const baseline=w.snapshot().current.position[1];w.step(dt,{...idle,pressed:new Set(['jump'])},0);
   let peak=0;for(let i=0;i<150;i++){tick(w,1);peak=Math.max(peak,w.snapshot().current.position[1]+PLAYER.radius+PLAYER.halfHeight);}
   expect(peak).toBeGreaterThan(3);expect(peak).toBeLessThan(3.3);expect(w.snapshot().current.grounded).toBe(true);expect(w.snapshot().current.position[1]).toBeCloseTo(baseline,3);
  }finally{w.dispose();}
 });
 it('jump from a pod stays below the station roof',()=>{
  const w=new PhysicsWorld();try{
   teleport(w,-4,2.28,-4);tick(w,90);expect(w.snapshot().current.grounded).toBe(true);
   const base=w.snapshot().current.position[1];w.step(dt,{...idle,pressed:new Set(['jump'])},0);
   let peak=base;for(let i=0;i<150;i++){tick(w,1);peak=Math.max(peak,w.snapshot().current.position[1]);}
   expect(peak).toBeGreaterThan(base+.1);expect(peak+PLAYER.radius+PLAYER.halfHeight).toBeLessThanOrEqual(5.501);expect(w.snapshot().current.grounded).toBe(true);
  }finally{w.dispose();}
 });
 it('all decorated purchase approaches still invoke real transactions without duplicate charges',async()=>{
  vi.stubGlobal('window',{addEventListener:()=>{},removeEventListener:()=>{}});const r=await Runtime.create();
  try{
   // Test-only placement through the existing Rapier world; no production teleport API.
   const physics=Reflect.get(r,'physics') as PhysicsWorld;
   r.start();for(let i=1;i<=50;i++)r.economy.awardRound(i);
   r.weapon.tick(dt,{fire:true,ads:false,reload:false});r.weapon.tick(dt,{fire:false,ads:false,reload:true});r.weapon.tick(1.5,{fire:false,ads:false,reload:false});
   teleport(physics,-2.5,.88,-.45);expect(r.getInteraction()?.kind).toBe('ammo');const before=r.economy.balance;expect(r.interact()).toBe(true);expect(r.economy.balance).toBe(before-6);expect(r.interact()).toBe(false);
   for(const m of PERK_MACHINES){teleport(physics,m.position[0],.88,5.7);expect(r.getInteraction()).toMatchObject({kind:'perk',id:m.perk});expect(r.interact()).toBe(true);const paid=r.economy.balance;expect(r.interact()).toBe(false);expect(r.economy.balance).toBe(paid);}
   teleport(physics,6.3,.88,0);expect(r.getInteraction()).toBeNull();expect(r.isDoorOpen()).toBe(true);
   tick(physics,75,{...idle,moveX:1});expect(physics.snapshot().current.position[0]).toBeGreaterThan(9);
   r.pause();expect(r.interact()).toBe(false);r.reset();expect(r.economy.balance).toBe(500);expect(r.perks.snapshot()).toEqual([]);expect(r.isDoorOpen()).toBe(true);
  }finally{r.dispose();vi.unstubAllGlobals();}
 });
});
