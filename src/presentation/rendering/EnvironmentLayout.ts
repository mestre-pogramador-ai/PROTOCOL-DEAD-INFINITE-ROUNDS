import {CONTAINMENT_MODULES,DOOR,STATION_ENTRIES} from '../../world/maps/containment';
import {createIndustrialProp,createStructuralParts,createSecurityDoorParts,partBuilder,type IndustrialPropKind} from './EnvironmentModuleKit';
export {ATLAS_TILES} from './EnvironmentTypes';
export type {EnvironmentPart,Surface} from './EnvironmentTypes';
/** Map adapter only: the reusable presentation kit has no containment dependency. */
export function createEnvironmentLayout(){
 const {parts,add,plane}=partBuilder('containment');
 for(const m of CONTAINMENT_MODULES){
  if(m.id.startsWith('pier-')){
   const [x,,z]=m.position;
   add(m.id,'metal',m.position,m.size);
   for(const y of [.22,.62,3.9,4.2])add(m.id,'hazard',[x,y,z],[1.53,.16,1.53]);
   add(m.id,'red',[x,4.8,z],[1.53,.1,1.53]);
   continue;
  }
  if(m.kind!=='prop'){parts.push(...createStructuralParts({...m,kind:m.kind}));continue;}
  const kind:IndustrialPropKind=m.id.startsWith('containment-pod')?'pod':m.id==='control-console'?'console':m.id==='power-cabinet'?'cabinet':m.id==='ammo-station'?'ammo':m.id.startsWith('perk-')?'perk':'crate';
  parts.push(...createIndustrialProp(m.id,kind,m.size,m.position));
 }
 // Status lamps and recessed intake shutters face the fighting floor.
 for(const {id,x,z} of STATION_ENTRIES){
  const alongX=x===0, sign=Math.sign(x||z);
  const panel=(offset:number,y:number,depth:number):[number,number,number] =>
    alongX ? [offset,y,sign*depth] : [sign*depth,y,offset];
  const size=(w:number,h:number,d:number):[number,number,number] => alongX?[w,h,d]:[d,h,w];
  const anchor=id+'-wall';
  add(anchor,'rubber',panel(0,2,19.80),size(5,4,.02));
  for(let i=0;i<10;i++)add(anchor,'metal',panel(0,.25+i*.36,19.799),size(4.8,.20,.015));
  for(const side of [-1,1]){
   add(anchor,'hazard',panel(side*2.65,2,19.8),size(.21,4,.02));
   add('intake-'+id,'red',panel(side*2.6,2.68,13.89),size(.94,.16,.02));
  }
 }
 for(const offset of [-9,9])for(let step=-17;step<=17;step+=3){
  add('floor-main','hazard',[offset,.004,step],[.075,.004,1.6]);
  add('floor-main','hazard',[step,.004,offset],[1.6,.004,.075]);
 }
 plane('north-wall','banner',[7,3.4,-19.79],[5,.94,1]);
 plane('south-wall','bio',[-7,2.8,19.79],[1.2,1.2,1],[0,Math.PI,0]);
 return parts;
}
export function createDoorLayout(){return createSecurityDoorParts(DOOR.id,DOOR.size);}
