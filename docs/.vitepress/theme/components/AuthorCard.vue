<template>
  <aside class="author-card">
    <img src="/logo.svg" width="48" height="48" alt="Neo" />
    <div>
      <strong>Neo · Agentic Full-Stack Engineer</strong>
      <p>关注 Agent 系统构建、工程化交付、评测、可观测性与生产运维。</p>
      <a href="https://github.com/neobinary997">访问 GitHub →</a>
    </div>
  </aside>
</template>

<style scoped>
.author-card {
  display: flex;
  gap: 16px;
  margin-top: 40px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.author-card img {
  flex: 0 0 auto;
  border-radius: 10px;
}

.author-card p {
  margin: 4px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.author-card a {
  font-size: 14px;
  font-weight: 600;
}
</style>
