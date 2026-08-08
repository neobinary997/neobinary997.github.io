---
title: Markdown 排版速查
date: 2026-08-06
category: 教程
tags:
  - Markdown
  - 排版
description: 用一篇文章演示标题、列表、表格、引用和代码块的排版效果，方便写文章时对照参考。
status: published
---

# Markdown 排版速查

这篇是排版演示，同时检验渲染器对常见语法的支持。

## 文本与强调

普通段落，**加粗**、*斜体*、~~删除线~~、`行内代码` 都可以直接使用。

## 列表

无序列表：

- 第一项
- 第二项
  - 嵌套子项

有序列表：

1. 先做 A
2. 再做 B
3. 最后检查 C

## 引用

> 好的文章不是把信息堆给读者，而是帮读者省时间。

## 表格

| 语法 | 用途 | 示例 |
| --- | --- | --- |
| `#` | 标题 | `## 小节` |
| `**` | 加粗 | `**重点**` |
| 反引号 | 行内代码 | `` `npm run build` `` |

## 代码块

JavaScript：

```js
function greet(name) {
  return `你好，${name}`
}
```

TypeScript：

```ts
interface Post {
  title: string
  status: "published" | "draft"
}

const posts: Post[] = []
```

## 链接与图片

链接直接写：[GitHub](https://github.com/neobinary997)。图片放在 `public/` 目录后，用标准 Markdown 语法引用。

## 分隔线

---

到这里就演示完了，写文章时可以参考这篇的写法。
