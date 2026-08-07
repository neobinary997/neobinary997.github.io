<script setup>
import { getAllPosts, getCategories } from './posts.js'

const posts = getAllPosts()
const categories = getCategories()
</script>

<template>
  <div class="latest">
    <PostList :limit="3" />
    <div v-if="categories.length" class="cat-section">
      <h3 class="cat-title">按分类浏览</h3>
      <div class="cat-grid">
        <a
          v-for="c in categories"
          :key="c"
          class="cat-item"
          :href="`/posts/?category=${encodeURIComponent(c)}`"
        >
          <span class="cat-name">{{ c }}</span>
          <span class="cat-count">{{ posts.filter((p) => p.category === c).length }} 篇</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cat-section {
  margin-top: 2.5rem;
}
.cat-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 12px;
  color: var(--color-text-primary);
}
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
.cat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: border-color 0.2s;
}
.cat-item:hover {
  border-color: var(--color-border-primary);
}
.cat-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}
.cat-count {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
</style>
