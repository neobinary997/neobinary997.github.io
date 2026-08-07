import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(__dirname, '../posts')

// 分类体系（5 大方向 + 其他）
const CATEGORY_ORDER = [
  'Agent 系统构建',
  '业务落地',
  '工程化处理',
  '可观测性',
  'Ops',
  '其他',
]

const SITE_URL = 'https://neobinary997.github.io'

// 解析 frontmatter（YAML 简单解析，够用即可）
function parseFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf-8')
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const fm = {}
  let currentKey = null
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) {
      currentKey = kv[1]
      fm[currentKey] = kv[2].replace(/^["']|["']$/g, '').trim()
    } else if (line.match(/^\s*-\s/)) {
      if (currentKey && Array.isArray(fm[currentKey])) {
        fm[currentKey].push(line.trim().slice(2).replace(/^["']|["']$/g, ''))
      } else if (currentKey && !fm[currentKey]) {
        fm[currentKey] = [line.trim().slice(2).replace(/^["']|["']$/g, '')]
      }
    }
  }
  return fm
}

// 读取全部文章元数据（按日期倒序）
function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .map((f) => {
      const fm = parseFrontmatter(path.join(POSTS_DIR, f))
      const slug = f.replace(/\.md$/, '')
      return {
        title: fm.title || slug,
        date: (fm.date || '').slice(0, 10),
        category: fm.category || '其他',
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        description: fm.description || '',
        link: `/posts/${slug}`,
        rawDate: fm.date ? new Date(fm.date).getTime() : 0,
      }
    })
    .sort((a, b) => b.rawDate - a.rawDate)
}

// 构建动态侧边栏：按分类分组
function buildSidebar() {
  const posts = getAllPosts()
  const groups = {}
  for (const p of posts) {
    if (!groups[p.category]) groups[p.category] = []
    groups[p.category].push({ text: p.title, link: p.link })
  }
  const ordered = CATEGORY_ORDER.filter((c) => groups[c]).map((c) => ({
    text: c,
    items: groups[c],
  }))
  const others = Object.keys(groups)
    .filter((c) => !CATEGORY_ORDER.includes(c))
    .map((c) => ({ text: c, items: groups[c] }))
  return [...ordered, ...others]
}

function generateRss(siteConfig) {
  const posts = getAllPosts()
  const items = posts
    .map((p) => {
      const date = p.rawDate ? new Date(p.rawDate).toUTCString() : ''
      return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}${p.link}</link>
      <guid>${SITE_URL}${p.link}</guid>
      <pubDate>${date}</pubDate>
      <category><![CDATA[${p.category}]]></category>
      <description><![CDATA[${p.description}]]></description>
    </item>`
    })
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>技术文章解读沉淀</title>
    <link>${SITE_URL}</link>
    <description>优质技术文章解读与沉淀的个人技术博客</description>
    <language>zh-cn</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`
  const outDir = siteConfig.outDir
  fs.writeFileSync(path.join(outDir, 'feed.xml'), xml, 'utf-8')
  console.log('[RSS] feed.xml generated')
}

function generateSitemap(siteConfig) {
  const pages = siteConfig.pages.map((p) => {
    const clean = p
      .replace(/\.md$/, '')
      .replace(/index$/, '')
      .replace(/^index$/, '')
    return `${SITE_URL}/${clean === 'index' ? '' : clean}`
  })
  const urls = [...new Set(pages)]
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  fs.writeFileSync(path.join(siteConfig.outDir, 'sitemap.xml'), xml, 'utf-8')
  console.log('[Sitemap] sitemap.xml generated')
}

export default withMermaid(defineConfig({
  title: '技术文章解读沉淀',
  description: '优质技术文章解读与沉淀的个人技术博客，聚焦 AI Agent 系统构建、业务落地、工程化处理、可观测性与 Ops',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,

  // Mermaid 图表（markdown 中的 ```mermaid 代码块）
  // 亮色：base 主题 + 定制配色（蓝/紫/青三色系，与站点 hero 渐变一致）；
  // 暗色：vitepress-plugin-mermaid 会强制切到 dark 主题（Mermaid.vue 行为），CSS 已做白卡片兜底。
  mermaid: {
    theme: 'base',
    themeVariables: {
      fontFamily: 'inherit',
      fontSize: '14px',
      // 通用节点（flowchart 等）三色系
      primaryColor: '#E6F1FB',
      primaryTextColor: '#042C53',
      primaryBorderColor: '#185FA5',
      secondaryColor: '#EEEDFE',
      secondaryTextColor: '#26215C',
      secondaryBorderColor: '#534AB7',
      tertiaryColor: '#E1F5EE',
      tertiaryTextColor: '#04342C',
      tertiaryBorderColor: '#0F6E56',
      lineColor: '#5F5E5A',
      edgeLabelBackground: '#FFFFFF',
      clusterBkg: '#F1EFE8',
      clusterBorder: '#B4B2A9',
      // 时序图
      actorBkg: '#E6F1FB',
      actorBorder: '#185FA5',
      actorTextColor: '#042C53',
      actorLineColor: '#888780',
      signalColor: '#5F5E5A',
      signalTextColor: '#2C2C2A',
      labelBoxBkgColor: '#FFFFFF',
      labelBoxBorderColor: '#888780',
      labelTextColor: '#2C2C2A',
      noteBkgColor: '#FAEEDA',
      noteBorderColor: '#BA7517',
      activationBkgColor: '#B5D4F4',
      activationBorderColor: '#185FA5',
      sequenceNumberColor: '#5F5E5A',
      // 状态图
      stateBkg: '#EEEDFE',
      stateBorder: '#534AB7',
      stateLabelColor: '#26215C',
      stateArrowColor: '#5F5E5A',
      // ER 图
      erFillPrimary: '#E6F1FB',
      erFillSecondary: '#EEEDFE',
      erStroke: '#5F5E5A',
      erLabelBackground: '#FFFFFF',
      // 类图
      classText: '#042C53',
      classBkg: '#E6F1FB',
      classBorder: '#185FA5',
      // 饼图
      pie1: '#185FA5',
      pie2: '#534AB7',
      pie3: '#0F6E56',
      pie4: '#D85A30',
      pie5: '#854F0B',
      pie6: '#993556',
      pie7: '#3B6D11',
      pie8: '#5F5E5A',
      pieSectionTextColor: '#FFFFFF',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#42b883' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '技术文章解读沉淀' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: '技术文章解读沉淀', href: '/feed.xml' }],
  ],

  transformHead: ({ pageData }) => {
    const head = []
    const fm = pageData.frontmatter || {}
    const title = fm.title || '技术文章解读沉淀'
    const desc = fm.description || '优质技术文章解读与沉淀的个人技术博客'
    const url = `${SITE_URL}${pageData.relativePath.replace(/\.md$/, '')}`
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: desc }])
    head.push(['meta', { property: 'og:url', content: url }])
    if (fm.date) head.push(['meta', { property: 'article:published_time', content: fm.date }])
    if (Array.isArray(fm.tags) && fm.tags.length) {
      for (const t of fm.tags.slice(0, 5)) {
        head.push(['meta', { property: 'article:tag', content: t }])
      }
    }
    return head
  },

  buildEnd: (siteConfig) => {
    try {
      generateRss(siteConfig)
      generateSitemap(siteConfig)
    } catch (e) {
      console.error('[BuildEnd] RSS/Sitemap 生成失败:', e.message)
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '订阅 RSS', link: '/feed.xml' },
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/posts/': buildSidebar(),
      '/': [
        {
          text: '文章导航',
          items: buildSidebar().map((g) => ({
            text: g.text,
            link: g.items[0].link,
          })),
        },
      ],
    },

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/neobinary997' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文章',
            buttonAriaLabel: '搜索文章',
          },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '语言',

    footer: {
      message:
        '<a href="/feed.xml" style="text-decoration:underline">RSS 订阅</a> · 以解读沉淀知识，以分享促进成长',
      copyright: 'Copyright © 2026 · Powered by VitePress',
    },
  },
}))
