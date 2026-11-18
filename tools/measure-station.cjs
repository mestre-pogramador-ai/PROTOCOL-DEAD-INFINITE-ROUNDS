// Run against the Vite development server. All four WebGL draw entry points
// are counted so shadows and the separate first-person pass are included.
const { chromium } = require('playwright-core');
const fs = require('node:fs');
async function main() {
  const browser = await chromium.launch({executablePath:'/usr/bin/chromium', args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-precise-memory-info']});
  try {
    const page = await browser.newPage({viewport:{width:640,height:360}});
    await page.addInitScript(() => {
      window.draws = 0;
      for (const method of ['drawElements','drawArrays','drawArraysInstanced','drawElementsInstanced']) {
        const proto = WebGL2RenderingContext.prototype, draw = proto[method];
        proto[method] = function(...args) { window.draws++; return draw.apply(this,args); };
      }
    });
    await page.goto(process.env.STATION_PROFILE_URL||'http://localhost:4175/tools/browser-fixtures/visuals.html');
    await page.waitForFunction(()=>window.visualObserve?.().assets.filter(a=>a.loaded).length>=4,null,{timeout:90000});
    const samples=[];
    for(const count of [6,8,10,10,10,10]) {
      await page.evaluate(n=>window.visualCommand('real-crowd',n),count);
      samples.push(await page.evaluate(async n=>{
        const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
        for(let i=0;i<5;i++) await frame();
        const start=performance.now(),calls=window.draws;
        for(let i=0;i<15;i++) await frame();
        const elapsed=performance.now()-start, drawCalls=(window.draws-calls)/15;
        const s=window.visualObserve();
        return {count:s.count,fps:15000/elapsed,drawCalls,heapBytes:performance.memory.usedJSHeapSize,...s.memory,renderer:s.profile.renderer};
      },count));
    }
    fs.writeFileSync(process.argv[2],JSON.stringify(samples,null,2));
    await page.screenshot({path:process.argv[2].replace('.json','.png')});
    if(process.argv.includes('--station')){
      await page.evaluate(()=>window.visualCommand('environment-view','station'));
      await page.waitForTimeout(1200);
      await page.screenshot({path:'docs/evidence/v02/station.png'});
    }
  } finally { await browser.close(); }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
