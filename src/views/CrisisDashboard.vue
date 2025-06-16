<script setup>
import { onMounted } from 'vue'
import { useCrisisStore } from '@/stores/useCrisisStore'

import CrisisMap from '@/components/CrisisMap.vue'
import CrisisList from '@/components/CrisisList.vue'

const store = useCrisisStore()

onMounted(() => {
  store.fetchCrises()
})
</script>

<template>
  <div class="dashboard">
    <CrisisMap />
    <CrisisList />
  </div>
</template>
