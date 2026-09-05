# Agent 基層規則

## 開工前：先拆包分工

用戶唔會自己分好「寵物／秘境／潮淵…」區。收到任何改動 list 時：

1. **先拆包**（區、可平行、依賴、建議次序／是否 multitask）
2. **再開工**（用戶話「去／按你推薦」或確認後）

詳見 `.cursor/rules/work-breakdown.mdc`（alwaysApply）。

## 慳 token

- 按區開 focused subagent，prompt 寫死範圍
- 同區微調用同一條 thread follow-up
- 唔好開長駐空轉 agent
