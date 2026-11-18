/* Production UI smoke in system Chromium. Software WebGL is explicit; this is
 * not a hardware performance benchmark or an unscripted survival playthrough. */
const {chromium}=require('playwright-core');
const fs=require('node:fs');
(async()=>{
 const out=process.env.INFINITE_EVIDENCE||'/tmp/protocol-evidence';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:640,height:360}});page.setDefaultTimeout(90000);
 const errors=[],httpErrors=[],record={};
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
 try{
  await page.goto(process.env.INFINITE_URL||'http://localhost:5173');
  await page.getByRole('button',{name:'INICIAR OPERAÇÃO',exact:true}).click();
  record.webgl=await page.evaluate(()=>{const gl=document.querySelector('canvas').getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return {version:gl.getParameter(gl.VERSION),renderer:gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)};});
  await page.waitForFunction(()=>document.querySelector('.m6-wave')?.textContent.includes('PREPARAÇÃO'));
  await page.mouse.click(320,180);
  await page.waitForFunction(()=>document.querySelector('.m6-ammo')?.textContent.includes('14 / 90'));
  await page.keyboard.press('KeyR');
  await page.waitForFunction(()=>document.querySelector('.m6-ammo')?.textContent.includes('15 / 89'));
  await page.keyboard.press('KeyE');
  await page.waitForFunction(()=>document.querySelector('.m6-ammo')?.textContent.includes('15 / 90'));
  record.ammoPurchase=await page.locator('.m6-credits').innerText();
  if(!record.ammoPurchase.includes('494'))throw Error('Expected six-credit ammo debit');
  await page.keyboard.press('KeyT');
  await page.waitForFunction(()=>!document.querySelector('.m6-wave')?.textContent.includes('PREPARAÇÃO'));
  await page.screenshot({path:out+'/active.png'});
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'REINICIAR PARTIDA',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.m6-credits')?.textContent.includes('500')&&document.querySelector('.m6-ammo')?.textContent.includes('15 / 90'));
  record.restart=await page.locator('body').innerText();
  await page.screenshot({path:out+'/restart.png'});
 }catch(e){errors.push(e.stack);}finally{
  fs.writeFileSync(out+'/ui-result.json',JSON.stringify({record,errors,httpErrors},null,2));console.log(JSON.stringify({record,errors,httpErrors}));await browser.close();
 }
 if(errors.length||httpErrors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
