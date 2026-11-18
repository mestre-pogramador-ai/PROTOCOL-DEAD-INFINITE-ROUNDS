/** Estação Zero. Medidas em metros, eixo Y vertical. */
export type Vec3 = readonly [number, number, number];
export interface SolidModule { id: string; kind: 'floor' | 'wall' | 'ceiling' | 'prop' | 'doorFrame'; position: Vec3; size: Vec3; material: 'floor' | 'wall' | 'trim' | 'hazard' | 'glass'; collision: boolean }
export const PERK_MACHINES=[
 {id:'perk-vitality',perk:'vitality',position:[-3,.9,7.1] as Vec3},
 {id:'perk-quick-hands',perk:'quickHands',position:[0,.9,7.1] as Vec3},
 {id:'perk-impulse',perk:'impulse',position:[3.5,.9,7.1] as Vec3},
 {id:'perk-armor',perk:'reactiveArmor',position:[6,.9,7.1] as Vec3},
] as const;
// Cada anteparo esconde uma entrada e permite sair pelos dois lados.
export const STATION_ENTRIES = [
  {id:'north', x:0, z:-18}, {id:'south', x:0, z:18},
  {id:'west', x:-18, z:0}, {id:'east', x:18, z:0},
] as const;
const wall = (id:string, position:Vec3, size:Vec3):SolidModule => ({
  id, kind:'wall', position, size, material:'wall', collision:true,
});
export const CONTAINMENT_MODULES: readonly SolidModule[] = [
  ...PERK_MACHINES.map(m=>({id:m.id,kind:'prop' as const,position:m.position,size:[.6,1.8,.45] as Vec3,material:'trim' as const,collision:true})),
  {id:'ammo-station',kind:'prop',position:[-2.5,.6,-1.5],size:[.8,1.2,.5],material:'trim',collision:true},
  {id:'ceiling-main',kind:'ceiling',position:[0,5.6,0],size:[40,.2,40],material:'wall',collision:true},
  {id:'floor-main',kind:'floor',position:[0,-.25,0],size:[40,.5,40],material:'floor',collision:true},
  wall('north-wall',[0,2.75,-20],[40,5.5,.35]),
  wall('south-wall',[0,2.75,20],[40,5.5,.35]),
  wall('west-wall',[-20,2.75,0],[.35,5.5,40]),
  wall('east-wall',[20,2.75,0],[.35,5.5,40]),
  ...STATION_ENTRIES.map(({id,x,z}) => wall('intake-'+id,
    [x*0.8,1.5,z*0.8], x===0 ? [7,3,1] : [1,3,7])),
  ...[-11,11].flatMap(x => [-11,11].map(z => wall(
    'pier-'+x+'-'+z,[x,2.75,z],[1.5,5.5,1.5]))),
  {id:'door-frame-left',kind:'doorFrame',position:[8,1.75,-1.7],size:[.6,3.5,.35],material:'trim',collision:true},
  {id:'door-frame-right',kind:'doorFrame',position:[8,1.75,1.7],size:[.6,3.5,.35],material:'trim',collision:true},
  {id:'door-frame-top',kind:'doorFrame',position:[8,3.3,0],size:[.6,.4,3.4],material:'trim',collision:true},
  {id:'containment-pod-a',kind:'prop',position:[-4,.7,-4],size:[1.8,1.4,1.3],material:'glass',collision:true},
  {id:'containment-pod-b',kind:'prop',position:[-4,.7,4],size:[1.8,1.4,1.3],material:'glass',collision:true},
  {id:'control-console',kind:'prop',position:[4,.55,-5.5],size:[2,1.1,.85],material:'trim',collision:true},
  {id:'medical-crate-a',kind:'prop',position:[1,.5,5.6],size:[1,1,1],material:'hazard',collision:true},
  {id:'medical-crate-b',kind:'prop',position:[2.1,.35,5.7],size:[.7,.7,.7],material:'trim',collision:true},
  {id:'power-cabinet',kind:'prop',position:[-6,.95,0],size:[.7,1.9,1.3],material:'trim',collision:true},
  {id:'corridor-crate',kind:'prop',position:[17,.5,1],size:[1,1,1],material:'hazard',collision:true},
];
export const AMMO_STATION={id:'ammo-station',position:[-2.5,1,-1.5] as Vec3,range:2.2};
export const DOOR = { id:'door-containment-security', position:[8,1.5,0] as Vec3, size:[.28,3,2.9] as Vec3 };
// Survey points describe the open ring. Pursuit uses the collision grid.
export const NAV_NODES = [
  {id:'centre',position:[0,0,0] as Vec3,links:['nw','ne','sw','se']},
  {id:'nw',position:[-9,0,-9] as Vec3,links:['centre','ne','sw']},
  {id:'ne',position:[9,0,-9] as Vec3,links:['centre','nw','se']},
  {id:'sw',position:[-9,0,9] as Vec3,links:['centre','nw','se']},
  {id:'se',position:[9,0,9] as Vec3,links:['centre','ne','sw']},
] as const;
export function validateContainmentMap(): string[] {
  const errors: string[]=[];const ids=new Set<string>();
  for(const m of CONTAINMENT_MODULES){if(ids.has(m.id))errors.push(`ID repetido: ${m.id}`);ids.add(m.id);if(m.size.some(n=>!Number.isFinite(n)||n<=0))errors.push(`Dimensão inválida: ${m.id}`);}
  const navIds=new Set<string>(NAV_NODES.map(n=>n.id));
  for(const n of NAV_NODES)for(const link of n.links)if(!navIds.has(link))errors.push(`Nó inexistente: ${link}`);
  return errors;
}
