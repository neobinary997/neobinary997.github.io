---
title: 用 Mermaid 画架构图
date: 2026-08-07
category: 教程
tags:
  - Mermaid
  - 架构
  - 可视化
description: 代码块里标记 mermaid，就能渲染出流程图、时序图等图表。本文用两个例子演示用法。
status: published
---

# 用 Mermaid 画架构图

写技术文章常常需要配图。Mermaid 的好处是图即代码，可以放进 Markdown、进版本库、跟着文章一起审阅。这个博客支持把标记为 `mermaid` 的代码块直接渲染成图。

## 流程图

下面是一个简单的发布流程：

```mermaid
flowchart LR
    A[提交代码] --> B[CI 构建]
    B --> C{测试通过?}
    C -->|是| D[部署到 Pages]
    C -->|否| E[修复问题]
    E --> B
```

## 时序图

多系统协作的调用关系适合用时序图：

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 博客
    participant C as 评论服务
    U->>B: 打开文章
    B->>C: 请求评论列表
    C-->>B: 返回评论
    B-->>U: 渲染页面
```

## 小贴士

- 图尽量简单，一张图只讲一件事；
- 节点文字用中文没问题，但避免太长；
- 复杂的图拆成多张，读者更好消化。
