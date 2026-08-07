---
title: 建立 Agent 评测生命周期：离线、在线与人工复核如何协作
date: 2026-08-14
category: 评估体系建设
tags:
  - 离线评测
  - 在线评测
  - LLM Judge
description: Mock：用分层评测体系发现发布前回归、线上漂移和自动评分失准。
source: https://www.langchain.com/resources/llm-monitoring-observability
source_title: "LLM observability & monitoring: how to evaluate agent behavior · LangChain"
status: mock
---

# 建立 Agent 评测生命周期：离线、在线与人工复核如何协作

> 本文为待完善的解读占位稿。原文：[LLM observability & monitoring](https://www.langchain.com/resources/llm-monitoring-observability)。

## 核心问题

离线评测擅长阻止已知回归，线上评测擅长发现未知用户行为，人工复核负责校准自动评分。三者缺一不可。

## 解读提纲

1. 每次变更运行小而稳定的离线核心集。
2. 线上按风险与流量抽样，监测成功率、安全性、成本与延迟。
3. 定期用人工标签校准 LLM Judge，避免评分器本身漂移。

## 待补充

- 给出评测集版本、阈值和豁免流程。
- 增加“上线后质量下跌”的告警与回滚示例。
