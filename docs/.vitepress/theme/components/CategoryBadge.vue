<script setup>
import { getCategoryColor } from './posts.js'

defineProps({
  category: { type: String, required: true },
})
</script>

<template>
  <span class="cat-badge" :style="{ color: getCategoryColor(category), borderColor: getCategoryColor(category) }">
    {{ category }}
  </span>
</template>

<style scoped>
.cat-badge {
  display: inline-block;
  font-size: 12px;
  padding: 1px 10px;
  border-radius: 999px;
  border: 1px solid;
  background: transparent;
  line-height: 1.6;
}
</style>
