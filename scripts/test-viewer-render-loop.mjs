import assert from 'node:assert/strict';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createViewerRenderLoop } from '../src/lib/viewer-render-loop.mjs';

// Exercise the real control's browser pinch path: ctrl+wheel changes the camera
// inside the event handler, before the next animation frame calls update().
const canvas = new EventTarget();
Object.assign(canvas,{style:{},ownerDocument:new EventTarget(),clientWidth:800,clientHeight:600});
const camera = new PerspectiveCamera(38,800/600,0.01,100);
camera.position.set(2,-2,2);
const controls = new OrbitControls(camera,canvas);
controls.enableDamping=true;
let active=true, frames=0, drawn=[];
const loop=createViewerRenderLoop(controls,()=>{frames++;drawn.push(camera.position.length());},()=>active);
loop.frame();
const initial=frames;
loop.frame();assert.equal(frames,initial,'Idle viewer should not redraw');
function pinch(deltaY) {
  const event=new Event('wheel',{cancelable:true});
  Object.assign(event,{deltaY,deltaMode:0,clientX:400,clientY:300,ctrlKey:true});
  canvas.dispatchEvent(event);
  assert.ok(event.defaultPrevented,'Pinch should zoom the model instead of the page');
}
for(let i=0;i<5;i++) {
  const before=camera.position.length(), previousFrames=frames;
  pinch(-2);
  assert.ok(camera.position.length()<before,'Pinch-in must move the camera immediately');
  assert.equal(controls.update(),false,'Regression setup: the input already consumed the camera change');
  loop.frame();
  assert.equal(frames,previousFrames+1,'Every pinch step must be drawn on the next frame');
  assert.ok(drawn.at(-1)<drawn.at(-2),'Drawn zoom must advance throughout the gesture');
}
active=false;
const beforeHidden=frames;
pinch(2);loop.frame();assert.equal(frames,beforeHidden,'Offscreen viewer should pause');
active=true;loop.frame();assert.equal(frames,beforeHidden+1,'Pending zoom must draw when visible again');
loop.frame();assert.equal(frames,beforeHidden+1,'Viewer should return to idle after drawing');
loop.dispose();controls.dispose();
console.log('Viewer rendering checks passed: live pinch updates, idle rendering, and offscreen/resume behavior.');
