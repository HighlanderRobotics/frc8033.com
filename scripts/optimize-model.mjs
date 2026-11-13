import { NodeIO, PropertyType } from '@gltf-transform/core';
import { dedup, flatten, join, weld, simplify, prune } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import { gzipSync } from 'node:zlib';
import { readFile, writeFile } from 'node:fs/promises';
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import assert from 'node:assert/strict';

const input = process.argv[2] || '.astro/cad-export/wisp.glb';
const output = process.argv[3] || 'public/models/wisp.glb.gz';
const io = new NodeIO();
const document = await io.read(input);
await MeshoptSimplifier.ready;
await document.transform(
  dedup({propertyTypes:[PropertyType.MATERIAL]}),
  flatten(),
  join({keepNamed:false}),
  weld(),
  simplify({simplifier:MeshoptSimplifier,ratio:0.3,error:0.0008}),
  prune(),
);
const raw = await io.writeBinary(document);
async function dimensions(bytes) {
  const buffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
  const {scene}=await new GLTFLoader().parseAsync(buffer,'');
  return new Box3().setFromObject(scene,true).getSize(new Vector3()).toArray();
}
const originalDimensions=await dimensions(await readFile(input));
const optimizedDimensions=await dimensions(raw);
originalDimensions.forEach((value,i)=>assert.ok(Math.abs(value-optimizedDimensions[i])<0.002,'Optimization changed assembly bounds'));
const packed = gzipSync(raw,{level:9,mtime:0});
await writeFile(output,packed);
const metadataFile=output.replace(/\.glb\.gz$/,'.json');
const metadata=JSON.parse(await readFile(metadataFile,'utf8'));
const primitives=document.getRoot().listMeshes().flatMap(mesh=>mesh.listPrimitives());
metadata.sourceMeshes=metadata.sourceMeshes||metadata.meshes;
metadata.sourceTriangles=metadata.sourceTriangles||metadata.triangles;
metadata.meshes=document.getRoot().listMeshes().length;
metadata.nodes=document.getRoot().listNodes().length;
metadata.drawCalls=primitives.length;
metadata.triangles=primitives.reduce((sum,p)=>sum+(p.getIndices()?.getCount()||p.getAttribute('POSITION').getCount())/3,0);
metadata.outputBytes=raw.length;
metadata.compressedBytes=packed.length;
metadata.optimization={targetRatio:0.3,maxRelativeError:0.0008,joinedByMaterial:true};
metadata.dimensionsMeters=originalDimensions;
await writeFile(metadataFile,JSON.stringify(metadata,null,2)+'\n');
console.log('Optimized assembly:',metadata);
