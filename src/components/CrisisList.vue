<!-- CrisisList.vue -->
<template>
  <div v-if="loading">Loading...</div>
  <ul v-else>
    <li v-for="crisis in crises" :key="crisis.id">
      {{ crisis.categories }}
    </li>
  </ul>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCrisisStore } from '@/stores/useCrisisStore'
const store = useCrisisStore()

const { crises, loading } = storeToRefs(store)
</script>
