---
title: Harness 工程：让代码仓库对 Agent 可读、可验证、可演进
date: 2026-08-09
category: 工程化处理
tags:
  - Harness
  - 仓库规范
  - Agent Coding
description: Mock：工程效率的关键从“写代码”转向为 Agent 设计可理解的环境、约束和反馈回路。
source: https://openai.com/index/harness-engineering/
source_title: "Harness engineering: leveraging Codex in an agent-first world · OpenAI"
status: mock
---

# Harness 工程：让代码仓库对 Agent 可读、可验证、可演进

> 本文为待完善的解读占位稿。原文：[Harness engineering](https://openai.com/index/harness-engineering/)。

## 核心问题

当 Agent 参与软件开发，仓库本身就是它的工作环境。散落在聊天记录和口头约定中的知识无法稳定复用，必须沉淀成版本化、可检索、可执行的项目资产。

## 解读提纲

1. 将架构原则、领域词汇、运行方式和验收条件放进仓库。
2. 用 lint、结构测试和 CI 编码不变量，而不是依赖每次人工提醒。
3. 将评审意见转化为规则、测试或文档，让团队偏好持续复利。

## 待补充

- 给出 `AGENTS.md`、架构决策记录和任务模板的最小目录。
- 补充“规则过多导致上下文噪声”的反例与取舍。
