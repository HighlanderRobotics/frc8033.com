import { afterEach, describe, expect, it, vi } from 'vitest';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createViewerRenderLoop } from '../../src/lib/viewer-render-loop.mjs';

const cleanups: Array<() => void> = [];
afterEach(() => cleanups.splice(0).forEach(dispose => dispose()));

function setup() {
  const controls = new EventTarget();
  Object.assign(controls, { update: vi.fn() });
  const render = vi.fn();
  let active = true;
  const loop = createViewerRenderLoop(controls, render, () => active);
  cleanups.push(() => loop.dispose());
  return { controls: controls as EventTarget & { update: ReturnType<typeof vi.fn> }, render, loop, activate: (value: boolean) => { active = value; } };
}

describe('on-demand rendering', () => {
  it('draws initially, then updates controls without drawing idle frames', () => {
    const { controls, render, loop } = setup();
    loop.frame(); loop.frame();
    expect(render).toHaveBeenCalledTimes(1);
    expect(controls.update).toHaveBeenCalledTimes(2);
  });
  it('coalesces input events and draws changes raised during controls.update', () => {
    const { controls, render, loop } = setup();
    loop.frame();
    controls.dispatchEvent(new Event('change'));
    controls.dispatchEvent(new Event('change'));
    loop.frame();
    expect(render).toHaveBeenCalledTimes(2);
    controls.update.mockImplementationOnce(() => controls.dispatchEvent(new Event('change')));
    loop.frame();
    expect(render).toHaveBeenCalledTimes(3);
    loop.frame();
    expect(render).toHaveBeenCalledTimes(3);
  });
  it('does no offscreen work and preserves pending changes until visible', () => {
    const { controls, render, loop, activate } = setup();
    activate(false); loop.frame();
    expect(render).not.toHaveBeenCalled();
    expect(controls.update).not.toHaveBeenCalled();
    activate(true); loop.frame();
    activate(false); controls.dispatchEvent(new Event('change')); loop.frame();
    expect(render).toHaveBeenCalledTimes(1);
    activate(true); loop.frame(); loop.frame();
    expect(render).toHaveBeenCalledTimes(2);
  });
  it('removes the change listener when disposed', () => {
    const { controls, render, loop } = setup();
    loop.frame(); loop.dispose();
    controls.dispatchEvent(new Event('change')); loop.frame();
    expect(render).toHaveBeenCalledTimes(1);
  });
  it('retains changes invalidated inside the render callback', () => {
    const { controls, render, loop } = setup();
    render.mockImplementationOnce(() => controls.dispatchEvent(new Event('change')));
    loop.frame(); loop.frame(); loop.frame();
    expect(render).toHaveBeenCalledTimes(2);
  });
});

it('draws every real OrbitControls pinch even when update already consumed it', () => {
  const canvas = new EventTarget();
  Object.assign(canvas, { style: {}, ownerDocument: new EventTarget(), clientWidth: 800, clientHeight: 600 });
  const camera = new PerspectiveCamera(38, 800 / 600, 0.01, 100);
  camera.position.set(2, -2, 2);
  const controls = new OrbitControls(camera, canvas as unknown as HTMLElement);
  controls.enableDamping = true;
  const drawn: number[] = [];
  const loop = createViewerRenderLoop(controls, () => drawn.push(camera.position.length()), () => true);
  cleanups.push(() => { loop.dispose(); controls.dispose(); });
  loop.frame();
  for (let i = 0; i < 5; i++) {
    const before = camera.position.length();
    const event = new Event('wheel', { cancelable: true });
    Object.assign(event, { deltaY: -2, deltaMode: 0, clientX: 400, clientY: 300, ctrlKey: true });
    canvas.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(camera.position.length()).toBeLessThan(before);
    expect(controls.update()).toBe(false);
    loop.frame();
    expect(drawn).toHaveLength(i + 2);
    expect(drawn.at(-1)).toBeLessThan(drawn.at(-2)!);
  }
});
