import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
async function main() {
  const root = path.join(process.env.USERPROFILE, 'Desktop', 'projeto-marcenaria');
  const dirs = await fs.readdir(root, {withFileTypes:true});
  const source = path.join(root, dirs.find(d=>d.isDirectory()&&d.name.startsWith('frames_')).name);
  for(const [variant,width,quality] of [['desktop',1280,78],['mobile',768,68]]){
    const output=path.join(process.cwd(),'public','sequence',variant);
    await fs.mkdir(output,{recursive:true});
    for(let n=1;n<=60;n++){
      const name=`frame_${String(n).padStart(4,'0')}.webp`;
      await sharp(path.join(source,name)).resize({width}).webp({quality,effort:5}).toFile(path.join(output,name));
    }
    const sizes=await Promise.all((await fs.readdir(output)).map(async n=>(await fs.stat(path.join(output,n))).size));
    console.log(`${variant}: 60 frames, ${(sizes.reduce((a,b)=>a+b,0)/1024/1024).toFixed(2)} MB`);
  }
}
main().catch(e=>{console.error(e);process.exitCode=1});

