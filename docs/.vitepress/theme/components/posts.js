// 文章数据工具：扫描 docs/posts/*.md，提取 frontmatter 供组件使用
import { useData } from 'vitepress'

const postsModules = import.meta.glob('../../posts/*.md', { eager: true })

const CATEGORY_ORDER = [
  'Agent 系统构建',
  '工程化处理',
  '可观测性',
  '评估体系建设',
  'Ops',
  '其他',
]

export function getAllPosts() {
  const posts = Object.entries(postsModules)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([path, mod]) => {
      const fm = mod.frontmatter || {}
      const fileName = path.split('/').pop().replace(/\.md$/, '')
      return {
        title: fm.title || fileName,
        date: fm.date ? String(fm.date).slice(0, 10) : '',
        category: fm.category || '其他',
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        description: fm.description || '',
        link: `/posts/${fileName}`,
        rawDate: fm.date ? new Date(fm.date).getTime() : 0,
      }
    })
    .sort((a, b) => b.rawDate - a.rawDate)
  return posts
}

export function getCategories() {
  const cats = new Set()
  for (const p of getAllPosts()) cats.add(p.category)
  return CATEGORY_ORDER.filter((c) => cats.has(c)).concat(
    [...cats].filter((c) => !CATEGORY_ORDER.includes(c))
  )
}

export function getCategoryColor(category) {
  const map = {
    'Agent 系统构建': '#185FA5',
    '工程化处理': '#534AB7',
    '可观测性': '#993C1D',
    '评估体系建设': '#0F6E56',
    'Ops': '#854F0B',
  }
  return map[category] || '#5F5E5A'
}
