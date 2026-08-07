<script setup>
defineProps({
  post: { type: Object, required: true },
})
</script>

<template>
  <a :href="post.link" class="post-card">
    <div class="post-meta">
      <span v-if="post.date" class="post-date">{{ post.date }}</span>
      <span class="post-cat">{{ post.category }}</span>
    </div>
    <h3 class="post-title">{{ post.title }}</h3>
    <p v-if="post.description" class="post-desc">{{ post.description }}</p>
    <div v-if="post.tags && post.tags.length" class="post-tags">
      <span v-for="t in post.tags.slice(0, 4)" :key="t" class="post-tag">{{ t }}</span>
    </div>
  </a>
</template>

<style scoped>
.post-card {
  display: block;
  padding: 1rem 1.25rem;
  border: 0.5px solid var(--color-border-tertiary);
  border-radius: var(--border-radius-lg);
  background: var(--color-background-primary);
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}
.post-card:hover {
  border-color: var(--color-border-primary);
  transform: translateY(-2px);
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.post-date {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
.post-cat {
  font-size: 12px;
  color: var(--color-text-info);
  background: var(--color-background-info);
  padding: 1px 8px;
  border-radius: 999px;
}
.post-title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--color-text-primary);
}
.post-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.post-tag {
  font-size: 12px;
  color: var(--color-text-secondary);
  background: var(--color-background-secondary);
  padding: 1px 8px;
  border-radius: 999px;
}
</style>
