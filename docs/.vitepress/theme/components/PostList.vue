<script setup>
import { ref } from 'vue'
import { getAllPosts, getCategories } from './posts.js'
import PostCard from './PostCard.vue'

const props = defineProps({
  limit: { type: Number, default: 0 },
  showFilter: { type: Boolean, default: false },
})

const all = getAllPosts()
const categories = getCategories()
const active = ref('全部')

const filtered = () =>
  active.value === '全部'
    ? props.limit > 0 ? all.slice(0, props.limit) : all
    : all.filter((p) => p.category === active.value)
</script>

<template>
  <div class="post-list">
    <div v-if="showFilter" class="filter-bar">
      <button
        v-for="c in ['全部', ...categories]"
        :key="c"
        class="filter-btn"
        :class="{ active: active === c }"
        @click="active = c"
      >
        {{ c }}
      </button>
    </div>
    <div class="grid">
      <PostCard v-for="p in filtered()" :key="p.link" :post="p" />
    </div>
    <p v-if="filtered().length === 0" class="empty">该分类下暂无文章</p>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1.5rem;
}
.filter-btn {
  font-size: 13px;
  padding: 4px 14px;
  border-radius: 999px;
  border: 0.5px solid var(--color-border-secondary);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover {
  border-color: var(--color-border-primary);
  color: var(--color-text-primary);
}
.filter-btn.active {
  background: var(--color-background-info);
  border-color: var(--color-border-info);
  color: var(--color-text-info);
  font-weight: 500;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.empty {
  color: var(--color-text-tertiary);
  font-size: 13px;
}
</style>
