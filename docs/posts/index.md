---
title: 文章列表
---

<PostList show-filter />

<script setup>
// 读取 URL 参数 ?category= 用于首页分类跳转
import { onMounted } from 'vue'
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const cat = params.get('category')
  if (cat) {
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      if (btn.textContent.trim() === cat) btn.click()
    })
  }
})
</script>
