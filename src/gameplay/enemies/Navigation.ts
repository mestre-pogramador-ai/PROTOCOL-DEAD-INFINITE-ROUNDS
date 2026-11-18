import { CONTAINMENT_MODULES, DOOR } from '../../world/maps/containment';
export const ENEMY_RADIUS=.38;
// Inflate each solid once by the infected capsule radius. A segment test costs
// the same for a one-step movement and a sightline across the entire station.
function footprint(m: Pick<typeof DOOR,'position'|'size'>) {
 const [x,,z]=m.position, halfX=m.size[0]/2+ENEMY_RADIUS, halfZ=m.size[2]/2+ENEMY_RADIUS;
 return {minX:x-halfX,maxX:x+halfX,minZ:z-halfZ,maxZ:z+halfZ};
}
const solids=CONTAINMENT_MODULES.filter(m=>m.collision&&m.kind!=='floor'&&m.position[1]-m.size[1]/2<=1.25).map(footprint);
const withDoor=[...solids,footprint(DOOR)];
function insideStation(x:number,z:number) {
 return Math.abs(x)<=19.45 && Math.abs(z)<=19.45;
}
export function enemyCanOccupy(x:number,z:number,doorOpen:boolean):boolean {
 return insideStation(x,z) && !(doorOpen?solids:withDoor).some(b=>
  x>b.minX && x<b.maxX && z>b.minZ && z<b.maxZ);
}
export function enemyCanTraverse(x:number,z:number,tx:number,tz:number,doorOpen:boolean):boolean {
 if(!insideStation(x,z)||!insideStation(tx,tz))return false;
 const dx=tx-x,dz=tz-z;
 for(const b of doorOpen?solids:withDoor){
  if(Math.max(x,tx)<=b.minX||Math.min(x,tx)>=b.maxX||Math.max(z,tz)<=b.minZ||Math.min(z,tz)>=b.maxZ)continue;
  const x1=dx?(b.minX-x)/dx:-Infinity,x2=dx?(b.maxX-x)/dx:Infinity;
  const z1=dz?(b.minZ-z)/dz:-Infinity,z2=dz?(b.maxZ-z)/dz:Infinity;
  if(Math.max(0,Math.min(x1,x2),Math.min(z1,z2))<Math.min(1,Math.max(x1,x2),Math.max(z1,z2)))return false;
 }
 return true;
}
// Only the debug door can change. Cache static grid edge clearance by door state.
const edgeCaches = [new Map<number,boolean>(),new Map<number,boolean>()];
/** Grid-based BFS. Recalculated sparingly by the enemy manager; no physics or UI side effects. */
export function findEnemyPath(sx:number,sz:number,tx:number,tz:number,doorOpen:boolean):[number,number][] {
 const cell=.65,minX=-19.5,minZ=-19.5,nx=61,nz=61;
 const key=(x:number,z:number)=>z*nx+x;
 const toGrid=(x:number,z:number):[number,number]=>[Math.max(0,Math.min(nx-1,Math.round((x-minX)/cell))),Math.max(0,Math.min(nz-1,Math.round((z-minZ)/cell)))];
 const toWorld=(x:number,z:number):[number,number]=>[minX+x*cell,minZ+z*cell];
 const [startX,startZ]=toGrid(sx,sz),[endX,endZ]=toGrid(tx,tz);
 // Near a wall the nearest grid centre can be inside the collider. Aim
 // for the closest adjacent cell with a clear approach to the actual target.
 let goal=key(endX,endZ), nearest=Infinity;
 for(let z=Math.max(0,endZ-1);z<=Math.min(nz-1,endZ+1);z++){
  for(let x=Math.max(0,endX-1);x<=Math.min(nx-1,endX+1);x++){
   const [wx,wz]=toWorld(x,z),distance=Math.hypot(wx-tx,wz-tz);
   if(distance<nearest&&enemyCanOccupy(wx,wz,doorOpen)&&enemyCanTraverse(wx,wz,tx,tz,doorOpen)){
    nearest=distance;goal=key(x,z);
   }
  }
 }
 const start=key(startX,startZ),prev=new Int32Array(nx*nz).fill(-1),queue=new Int32Array(nx*nz);let head=0,tail=0;queue[tail++]=start;prev[start]=start;
 const directions=[[1,0],[-1,0],[0,1],[0,-1]];
 while(head<tail){const cur=queue[head++];if(cur===goal)break;const x=cur%nx,z=Math.floor(cur/nx);
  for(const [dx,dz] of directions){const xx=x+dx,zz=z+dz;if(xx<0||zz<0||xx>=nx||zz>=nz)continue;const k=key(xx,zz);if(prev[k]!==-1)continue;const [wx,wz]=toWorld(xx,zz);const [cx,cz]=cur===start?[sx,sz]:toWorld(x,z);const cache=edgeCaches[Number(doorOpen)];
   const edge=Math.min(cur,k)*nx*nz+Math.max(cur,k);
   let clear=cur===start?undefined:cache.get(edge);
   if(clear===undefined){clear=enemyCanTraverse(cx,cz,wx,wz,doorOpen);if(cur!==start)cache.set(edge,clear);}
   if(!clear)continue;prev[k]=cur;queue[tail++]=k;}
 }
 if(prev[goal]===-1)return [];
 const path:[number,number][]=[];let cur=goal;while(cur!==start&&path.length<nx*nz){path.push(toWorld(cur%nx,Math.floor(cur/nx)));cur=prev[cur];}path.reverse();return path;
}
export function hasEnemyLineOfSight(x:number,z:number,tx:number,tz:number,doorOpen:boolean):boolean {
 return enemyCanTraverse(x,z,tx,tz,doorOpen);
}
