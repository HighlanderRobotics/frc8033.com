/** Keep input changes pending until they have actually been drawn. */
export function createViewerRenderLoop(controls, render, isActive) {
  let needsRender = true;
  const invalidate = () => { needsRender = true; };
  controls.addEventListener('change', invalidate);
  return {
    frame() {
      if (!isActive()) return;
      controls.update();
      if (needsRender) {
        needsRender = false;
        render();
      }
    },
    dispose() { controls.removeEventListener('change', invalidate); }
  };
}
