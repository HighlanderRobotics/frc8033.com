import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createViewerRenderLoop } from './viewer-render-loop.mjs';

export async function startViewer(root: HTMLElement) {
  const host = root.querySelector<HTMLElement>('.model-canvas')!;
  const status = root.querySelector<HTMLElement>('.model-status')!;
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0xf3f0f7);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  renderer.domElement.setAttribute('aria-label', 'Wisp full robot assembly in 3D');
  renderer.domElement.setAttribute('role', 'img');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
  camera.up.set(0,0,1);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotateSpeed = 1;
  controls.minPolarAngle = 0.02;
  controls.maxPolarAngle = Math.PI - 0.02;
  const ambient = new THREE.HemisphereLight(0xffffff,0x898096,2.8);
  ambient.up.set(0,0,1); ambient.position.set(0,0,10); scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff,3.5); key.position.set(3,-4,6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xe9ddff,2); fill.position.set(-4,3,2); scene.add(fill);
  try {
    status.textContent = 'Downloading Wisp’s full assembly…';
    const response = await fetch(root.dataset.modelUrl!);
    if (!response.ok || !response.body) throw new Error(`Model request failed: ${response.status}`);
    // Explicit decompression keeps the model small on static hosts, including
    // GitHub Pages, without requiring custom Content-Encoding headers.
    const downloaded = await response.arrayBuffer();
    const magic = new Uint8Array(downloaded,0,Math.min(4,downloaded.byteLength));
    // Astro's dev server sends Content-Encoding:gzip and the browser decodes it
    // automatically. GitHub Pages may send the file as raw gzip. Support both.
    const data = magic[0]===0x1f && magic[1]===0x8b
      ? await new Response(new Blob([downloaded]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
      : downloaded;
    if (new TextDecoder().decode(new Uint8Array(data,0,4)) !== 'glTF') throw new Error('Invalid model response');
    status.textContent = 'Building the 3D assembly…';
    const gltf = await new GLTFLoader().parseAsync(data, '');
    const model = gltf.scene;
    // The supplied assembly is already Z-up. Preserve its orientation.
    const bounds = new THREE.Box3().setFromObject(model, true);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);
    const radius = size.length()/2;
    const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov/2)) * 1.12;
    controls.minDistance = radius * 0.2;
    controls.maxDistance = distance * 5;
    camera.near = Math.max(radius/1000,0.001); camera.far = distance*20;
    let view = 'home';
    const directions: Record<string, THREE.Vector3> = {
      home:new THREE.Vector3(1,-1,0.75).normalize(), front:new THREE.Vector3(0,-1,0.18).normalize(), side:new THREE.Vector3(1,0,0.18).normalize(), top:new THREE.Vector3(0,-0.001,1).normalize()
    };
    function setView(name: string) {
      view = name;
      controls.target.set(0,0,0);
      const aspectFit = Math.max(1,1/camera.aspect);
      camera.position.copy(directions[name]).multiplyScalar(distance*aspectFit);
      camera.lookAt(0,0,0); camera.updateProjectionMatrix(); controls.update(); render();
      root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view === name)));
    }
    function render() { renderer.render(scene,camera); }
    function resize() {
      const width=host.clientWidth, height=host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width,height,false); camera.aspect=width/height; camera.updateProjectionMatrix();
      setView(view);
    }
    host.append(renderer.domElement);
    root.classList.add('is-loaded');
    root.querySelectorAll<HTMLButtonElement>('.model-toolbar button').forEach(button=>button.disabled=false);
    root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view!)));
    const spin = root.querySelector<HTMLButtonElement>('[data-spin]')!;
    spin.addEventListener('click',()=>{ controls.autoRotate=!controls.autoRotate;spin.setAttribute('aria-pressed',String(controls.autoRotate));spin.textContent=controls.autoRotate?'Stop Rotation':'Auto-Rotate'; });
    const fullscreen = root.querySelector<HTMLButtonElement>('[data-fullscreen]')!;
    fullscreen.hidden = !document.fullscreenEnabled;
    fullscreen.addEventListener('click',async()=>{ try { if (document.fullscreenElement) await document.exitFullscreen(); else await root.requestFullscreen(); } catch { fullscreen.textContent='Full Screen Unavailable'; } });
    const updateFullscreen = ()=>{fullscreen.textContent=document.fullscreenElement===root?'Exit Full Screen':'Full Screen';};
    document.addEventListener('fullscreenchange',updateFullscreen);
    const rotate = (axis: THREE.Vector3, radians: number)=>{camera.position.sub(controls.target).applyAxisAngle(axis,radians).add(controls.target);camera.lookAt(controls.target);controls.update();render();};
    host.addEventListener('keydown',event=>{
      const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      if (event.key==='0') return setView('home');
      if (['+','=','-'].includes(event.key)) camera.position.sub(controls.target).multiplyScalar(event.key==='-'?1.12:0.89).clampLength(controls.minDistance,controls.maxDistance).add(controls.target);
      else if (event.key==='ArrowLeft'||event.key==='ArrowRight') rotate(new THREE.Vector3(0,0,1),event.key==='ArrowLeft'?0.12:-0.12);
      else rotate(new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion),event.key==='ArrowUp'?0.12:-0.12);
      controls.update();render();
    });
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    let visible=true;
    const intersection = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});intersection.observe(root);
    // Wheel/pinch handlers call controls.update() synchronously. Track their
    // change events so the following animation frame still draws that camera.
    const renderLoop = createViewerRenderLoop(controls, render, () => visible && !document.hidden);
    renderer.setAnimationLoop(renderLoop.frame);
    renderer.domElement.addEventListener('webglcontextlost',()=>{root.classList.add('model-error');status.textContent='The graphics connection was interrupted. Reload the page to restart the model.';});
    window.addEventListener('pagehide',()=>{
      renderer.setAnimationLoop(null);renderLoop.dispose();observer.disconnect();intersection.disconnect();controls.dispose();
      document.removeEventListener('fullscreenchange',updateFullscreen);
      scene.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>m.dispose());}});
      renderer.dispose();
    },{once:true});
    root.dataset.ready='true';
  } catch(error) {
    controls.dispose();renderer.dispose();throw error;
  }
}
