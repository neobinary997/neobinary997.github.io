---
title: 用 OpenTelemetry 观察 Agent：从一次回答还原完整执行轨迹
date: 2026-08-11
category: 可观测性
tags:
  - OpenTelemetry
  - Trace
  - Token
description: Mock：建立模型调用、工具调用、重试和 token 用量的统一语义，避免只能看到“接口成功”。
source: https://opentelemetry.io/blog/2026/genai-observability/
source_title: "Inside the LLM Call: GenAI Observability with OpenTelemetry"
status: mock
---

# 用 OpenTelemetry 观察 Agent：从一次回答还原完整执行轨迹

> 本文为待完善的解读占位稿。原文：[Inside the LLM Call](https://opentelemetry.io/blog/2026/genai-observability/)。

## 核心问题

Agent 的慢、贵或答错，往往发生在模型、检索、工具和重试组成的链路中。仅记录 HTTP 成功率无法定位问题，需要把一次任务串成可查询的 trace。

## 解读提纲

1. 为模型调用、工具调用和检索建立父子 span。
2. 记录模型、token、耗时、重试、结果状态及必要的脱敏内容。
3. 将 trace ID 贯穿用户会话、异步任务和业务事件。

## 待补充

- 定义最小 span 属性与敏感字段脱敏策略。
- 给出“45 秒响应”问题的排障路径。
