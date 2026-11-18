import {useEffect, useMemo} from 'react';
import {CanvasTexture, SRGBColorSpace} from 'three';

/** Stencilled identifier on the north intake's concrete face. */
export function StationSign() {
 const texture=useMemo(()=>{
  const canvas=document.createElement('canvas');
  canvas.width=1024; canvas.height=256;
  const ctx=canvas.getContext('2d')!;
  ctx.fillStyle='#16272b';ctx.fillRect(0,0,1024,256);
  ctx.fillStyle='#eda950';ctx.fillRect(0,0,18,256);
  ctx.font='bold 31px sans-serif';ctx.fillText('PLATAFORMA SUBTERRÂNEA     /     N',52,68);
  ctx.fillStyle='#e3e9df';ctx.font='bold 96px sans-serif';ctx.fillText('ESTAÇÃO ZERO',48,188);
  const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;return map;
 },[]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <mesh position={[0,1.8,-13.885]}>
   <planeGeometry args={[5.6,1.4]}/><meshBasicMaterial map={texture}/>
 </mesh>;
}
