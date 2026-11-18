/* Funded App fixture only: real keyboard, Rapier movement and economic purchases.
 * No teleport, direct enemy kill or production debug endpoint. */
const {chromium}=require('playwright-core'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const output=process.env.M813_INTERACTION_DIR||'/tmp/m813-interactions';fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:800,height:450}}),errors=[],httpErrors=[],record={};page.setDefaultTimeout(60000);
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)httpErrors.push({path:new URL(r.url()).pathname,status:r.status()});});
 const observe=()=>page.evaluate(()=>window.m81Observe());
 const axis=async(index,target)=>{const positive=target>(await observe()).position[index],key=index===0?(positive?'KeyD':'KeyA'):(positive?'KeyS':'KeyW');await page.keyboard.down(key);try{await page.waitForFunction(({index,target,positive})=>positive?window.m81Observe().position[index]>=target:window.m81Observe().position[index]<=target,{index,target,positive});}finally{await page.keyboard.up(key);}};
 try{
  await page.goto(process.env.M81_URL||'http://localhost:4174/tools/browser-fixtures/perks.html');await page.getByRole('button',{name:'INICIAR OPERAÇÃO',exact:true}).click();
  await page.waitForFunction(()=>window.m81Observe().position[1]<.9);record.initial=await observe();
  const shots=record.initial.weapon.shotsFired;await page.mouse.down();try{await page.waitForFunction(n=>window.m81Observe().weapon.shotsFired>n,shots);}finally{await page.mouse.up();}
  await page.keyboard.press('KeyR');await page.waitForFunction(()=>window.m81Observe().weapon.reserve===89&&!window.m81Observe().weapon.reloading);
  const balance=(await observe()).economy.credits;await page.keyboard.press('KeyE');await page.waitForFunction(()=>window.m81Observe().weapon.reserve===90);
  record.ammo=await observe();if(record.ammo.economy.credits!==balance-6)throw new Error('Ammo station debit mismatch');
  const doorBalance=record.ammo.economy.credits;
  await axis(0,7.35);
  if(!(await observe()).doorOpen)throw Error('Station gantry closed');
  await page.keyboard.press('KeyE');
  await axis(0,9.2);
  if((await observe()).economy.credits!==doorBalance)throw Error('Passage charged credits');
  record.passage=await observe();await page.screenshot({path:path.join(output,'door-open-passage.png')});
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'REINICIAR PARTIDA',exact:true}).click();await page.waitForFunction(()=>window.m81Observe().economy.credits===500&&window.m81Observe().doorOpen);
  record.reset=await observe();
 }catch(e){errors.push(e.message);}finally{fs.writeFileSync(path.join(output,'result.json'),JSON.stringify({record,errors,httpErrors},null,2));console.log(JSON.stringify({errors,httpErrors,stages:Object.keys(record)}));await browser.close();}
 if(errors.length||httpErrors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
