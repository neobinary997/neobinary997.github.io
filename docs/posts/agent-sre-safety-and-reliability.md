---
title: Agent 进入 SRE：把安全、权限与可靠性设计在运行前
date: 2026-08-15
category: Ops
tags:
  - SRE
  - 安全
  - 人工接管
description: Mock：面向生产运维任务的 Agent，需要像人和服务一样接受权限、审计、变更与可靠性治理。
source: https://cloud.google.com/blog/products/devops-sre/how-google-sre-is-using-agentic-ai-to-improve-operations/
source_title: "AI in SRE: Where and how Google is deploying agentic AI to improve operations"
status: mock
---

# Agent 进入 SRE：把安全、权限与可靠性设计在运行前

> 本文为待完善的解读占位稿。原文：[AI in SRE](https://cloud.google.com/blog/products/devops-sre/how-google-sre-is-using-agentic-ai-to-improve-operations/)。

## 核心问题

当 Agent 能读取生产数据甚至执行变更时，它就是生产系统的一部分。权限边界、审批、审计和回滚不能在故障发生后再补。

## 解读提纲

1. 区分只读诊断、建议执行、受审批执行和自动执行四个权限等级。
2. 为变更操作加入最小权限、变更窗口、幂等性和回滚预案。
3. 用演练验证 Agent 在信息不足、工具故障和告警风暴中的降级行为。

## 待补充

- 设计生产排障 Agent 的权限矩阵。
- 定义人工 on-call 与 Agent 的交接条件。
