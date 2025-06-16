<script setup>
import { ref, watch } from 'vue'
import { useCrisisStore } from '@/stores/useCrisisStore'
import { storeToRefs } from 'pinia'

import { Viewer, Ion, CesiumTerrainProvider, Cartesian3, Color, Math } from 'cesium'

const cesiumViewer = ref(null)
const store = useCrisisStore()
const { loading, crises } = storeToRefs(store)

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN

watch(loading, async (isLoading) => {
  if (!isLoading && cesiumViewer.value === null) {
    // Ensure DOM element exists
    await new Promise((resolve) => setTimeout(resolve, 0)) // wait 1 tick

    const terrain = await CesiumTerrainProvider.fromIonAssetId(1)

    const viewer = new Viewer('cesiumContainer', {
      terrainProvider: terrain,
      baseLayerPicker: false,
    })

    crises.value.forEach((event) => {
      const geometry = event.geometry?.[0]
      if (!geometry || !geometry.coordinates) return

      const [lon, lat] = geometry.coordinates
      const isWildfire = event.categories.some((c) => c.title.toLowerCase() === 'wildfires')

      viewer.entities.add({
        name: event.title,
        position: Cartesian3.fromDegrees(lon, lat),
        ...(isWildfire
          ? {
              billboard: {
                image: '/icons/fire.png',
                width: 32,
                height: 32,
              },
            }
          : {
              point: {
                pixelSize: 10,
                color: Color.ORANGE,
              },
            }),
        description: event.description || 'No description',
      })
    })

    crises.value.forEach((event) => {
      const geometry = event.geometry?.[0]
      if (!geometry || !geometry.coordinates) return

      const [lon, lat] = geometry.coordinates

      viewer.entities.add({
        name: event.title,
        position: Cartesian3.fromDegrees(lon, lat),
        description: event.description || 'No description',
      })
    })

    // ✅ Only call flyTo ONCE after all entities are added
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(-74.006, 40.7128, 1500000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-30),
        roll: 0,
      },
    })

    viewer.zoomTo(viewer.entities)
    cesiumViewer.value = viewer
  }
})
</script>

<template>
  <div v-if="loading" class="loading-state">Loading crisis data...</div>

  <div v-else class="map-or-list">
    <div id="cesiumContainer" class="map-container"></div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
  color: #888;
}
</style>
