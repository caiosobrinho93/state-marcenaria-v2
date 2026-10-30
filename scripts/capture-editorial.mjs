import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
await mkdir('reports/revision-3',{recursive:true});
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:1000}});
 await page.goto('http://localhost:3000/?v=3');
 await page.locator('.journey[data-motion="scroll"]').waitFor();
 for(const [name,selector] of [['ambientes','#ambientes'],['diferenciais','.signature-section'],['depoimentos','#depoimentos']]){
  const el=page.locator(selector);await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await el.screenshot({path:`reports/revision-3/${name}-${width}.png`});
 }
 await page.close();
}
await browser.close();
