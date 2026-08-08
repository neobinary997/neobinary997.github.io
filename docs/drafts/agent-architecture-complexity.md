---
title: 从工作流到 Agent：如何按任务复杂度选择架构
date: 2026-08-07
category: Agent 系统构建
tags:
  - 架构
  - 工作流
  - 多 Agent
description: Mock：用任务的不确定性、工具数量和风险边界判断何时需要 Agent，而不是默认追求自治。
source: https://www.anthropic.com/engineering/building-effective-agents
source_title: Building effective agents · Anthropic
status: mock
---

# 从工作流到 Agent：如何按任务复杂度选择架构

> 本文为待完善的解读占位稿。原文：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)。

## 核心问题

并非每个 LLM 应用都应当是 Agent。确定路径、固定输入输出的任务优先用工作流；只有在需要模型根据中间结果动态决定下一步时，再引入 Agent。

## 解读提纲

1. 用“任务不确定性、工具调用自由度、失败代价”三个维度划分架构复杂度。
2. 从提示词链、路由、并行、编排器到自治 Agent，逐级增加能力与成本。
3. 多 Agent 不是默认答案：先让单 Agent 加工具和上下文，再证明拆分的必要性。

## 待补充

- 为客服、数据分析、代码修复各补一个架构选择案例。
- 给出延迟、成本、可测试性三项决策清单。
