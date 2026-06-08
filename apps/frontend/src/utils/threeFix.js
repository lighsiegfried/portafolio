export function fixNaNPositions(scene) {
  scene.traverse((node) => {
    if (node.isMesh && node.geometry) {
      const pos = node.geometry.attributes.position
      if (pos) {
        const array = pos.array
        let fixed = false
        for (let i = 0; i < array.length; i++) {
          if (!isFinite(array[i])) {
            array[i] = 0
            fixed = true
          }
        }
        if (fixed) {
          pos.needsUpdate = true
          try {
            node.geometry.computeBoundingSphere()
          } catch (_) {}
        }
      }
    }
  })
}
