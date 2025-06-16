import { defineStore } from 'pinia'

const CACHE_KEY = 'crisis-data'
const CACHE_EXPIRY_MINUTES = 10

export const useCrisisStore = defineStore('crisis', {
  state: () => ({
    crises: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCrises() {
      this.loading = true
      this.error = null

      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
      const now = Date.now()
      const isFresh = cached.timestamp && now - cached.timestamp < CACHE_EXPIRY_MINUTES * 60 * 1000

      if (isFresh) {
        this.crises = cached.data
        this.loading = false

        // Revalidate in the background
        setTimeout(() => this.fetchCrises(), 0)
        return
      }

      try {
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events')
        const data = await res.json()
        this.crises = data.events

        // Save to localStorage
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: data.events,
            timestamp: now,
          }),
        )
      } catch (err) {
        this.error = 'Failed to fetch crisis data'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    clearCrisisCache() {
      localStorage.removeItem(CACHE_KEY)
    },
  },
})
