// 文章数据工具：扫描 docs/posts/*.md，提取 frontmatter 供组件使用
import { useData } from 'vitepress'

const postsModules = import.meta.glob('../../../posts/*.md', { eager: true })

const CATEGORY_ORDER = [
  'Agent 系统构建',
  '工程化处理',
  '可观测性',
  '评估体系建设',
  'Ops',
  '其他',
]

const TODAY = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
}).format(new Date())

function normalizeDate(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const text = String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10)
  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10)
}

export function getAllPosts() {
  const posts = Object.entries(postsModules)
    .filter(([path]) => !path.endsWith('/index.md'))
    .map(([path, mod]) => {
      const fm = mod.frontmatter || mod.__pageData?.frontmatter || {}
      const fileName = path.split('/').pop().replace(/\.md$/, '')
      const date = normalizeDate(fm.date)
      return {
        title: fm.title || fileName,
        date,
        category: fm.category || '其他',
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        description: fm.description || '',
        link: `/posts/${fileName}`,
        rawDate: date ? new Date(date).getTime() : 0,
        status: fm.status || 'draft',
      }
    })
    .filter((p) => p.status === 'published' && (!p.date || p.date <= TODAY))
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
