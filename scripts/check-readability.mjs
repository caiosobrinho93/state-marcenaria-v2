import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
await mkdir('reports/readability',{recursive:true});
for(const width of [360,390,768,1024,1864]){
 const page=await browser.newPage({viewport:{width,height:1000}});
 await page.goto('http://localhost:3000/?v=4');
 await page.locator('.journey[data-motion="scroll"]').waitFor();
 const values=await page.evaluate(()=>{
  const css=s=>getComputedStyle(document.querySelector(s));
  const notice=document.querySelector('.contact-form .notice').getBoundingClientRect();
  const label=document.querySelector('.contact-form label').getBoundingClientRect();
  return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,nav:css('.nav a').fontSize,about:css('.about-copy>p:not(.eyebrow)').fontSize,eyebrow:css('#materiais .eyebrow').fontSize,searchRadius:css('.search-field').borderRadius,consent:css('.checkbox').fontSize,input:css('[name=name]').fontSize,inputBorder:css('[name=name]').borderTopWidth,inputRadius:css('[name=name]').borderRadius,noticeGap:Math.round(label.top-notice.bottom),footerButton:css('.footer-top>a:last-child').backgroundColor};
 });console.log(JSON.stringify(values));
 if([390,1864].includes(width))for(const [name,selector] of [['contato','#contato'],['essencia','#essencia'],['materiais','#materiais']]){
  const top=await page.locator(selector).evaluate(e=>e.getBoundingClientRect().top+scrollY-100);
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),top);await page.waitForTimeout(1200);
  await page.screenshot({path:`reports/readability/${name}-${width}.png`});
 }
 await page.close();
}
await browser.close();
