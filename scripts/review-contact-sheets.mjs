import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
const folder='docs/rendering-review';
await mkdir(`${folder}/sheets`, {recursive:true});
const files=(await readdir(`${folder}/screenshots`)).filter(f=>f.startsWith('mobile-')).sort();
for(let i=0;i<files.length;i+=4){
  const tiles=[];
  for(const [j,file] of files.slice(i,i+4).entries()){
    const image=sharp(`${folder}/screenshots/${file}`);
    const {height,width}=await image.metadata();
    const label=file.replace('mobile-','').replace('.png','');
    const heading=Buffer.from(`<svg width="320" height="50"><rect width="320" height="50" fill="#f3edf9"/><text x="12" y="28" font-family="Arial" font-size="14" fill="#321052">${label}</text></svg>`);
    tiles.push({input:heading,left:j*340,top:0});
    // Top, middle and lower-page samples; originals remain available at full resolution.
    for(let part=0;part<3;part++){
      const cropHeight=Math.min(950,height);
      const top=part===0?0:part===1?Math.floor((height-cropHeight)/2):height-cropHeight;
      const bytes=await sharp(`${folder}/screenshots/${file}`).extract({left:0,top,width,height:cropHeight}).resize({width:320}).png().toBuffer();
      tiles.push({input:bytes,left:j*340,top:60+part*800});
    }
  }
  await sharp({create:{width:1360,height:2460,channels:3,background:'#e9e6ed'}}).composite(tiles).png().toFile(`${folder}/sheets/mobile-${Math.floor(i/4)+1}.png`);
}
console.log(`Created ${Math.ceil(files.length/4)} review sheets from ${files.length} mobile captures.`);
