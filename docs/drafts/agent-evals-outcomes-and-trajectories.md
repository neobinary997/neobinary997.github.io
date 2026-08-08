---
title: Agent 评估该看结果还是过程？构建 Outcome 与 Trajectory 指标
date: 2026-08-13
category: 评估体系建设
tags:
  - Evals
  - Outcome
  - Trajectory
description: Mock：区分最终任务是否完成与中间路径是否合理，为多步 Agent 选择正确的评估粒度。
source: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
source_title: Demystifying evals for AI agents · Anthropic
status: mock
---

# Agent 评估该看结果还是过程？构建 Outcome 与 Trajectory 指标

> 本文为待完善的解读占位稿。原文：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)。

## 核心问题

最终回答看起来正确，不代表 Agent 真正完成了任务；工具路径正确，也不总能保证业务结果。因此评估必须同时定义环境最终状态和关键行为约束。

## 解读提纲

1. Outcome：任务结束时外部系统的真实状态，例如订单是否真正创建。
2. Trajectory：工具选择、调用顺序、权限和成本是否满足约束。
3. 按单步、完整 trace、多轮会话三种粒度设计不同的样本与评分器。

## 待补充

- 为“航班预订 Agent”写一组结果与路径指标。
- 对比规则评分、LLM Judge 和人工评审的适用边界。
