## Why

初中生需要掌握大量成语，但传统的死记硬背枯燥低效。"成语星图"将成语学习转化为"观星连线"的交互式体验——玩家在星空中根据线索按正确顺序连接汉字星组成成语，在游戏化过程中完成语义检索与字形识别的双重训练。MVP 可在 1-2 天内交付核心玩法。

## What Changes

- 单局核心玩法：星空选星 → 按序连线 → 校验 → 反馈的完整闭环
- 题库系统：20 个成语的 JSON 题库，支持难度分级和双成语模式
- 计时系统：固定 6 题计时速度挑战，每题上限 20-25s，答对加奖励秒
- 音效系统：WebAudio 驱动的点击声、连线音阶、成功/错误反馈
- 计分与排行榜：当日 Top 10 排行榜（localStorage 持久化）
- Canvas 星空背景：粒子系统（星云漂移、流星划过）
- 触摸/鼠标统一交互：Pointer Events 处理所有输入

## Capabilities

### New Capabilities
- `game-core`: 核心游戏循环——状态管理、关卡流转、计时、计分
- `star-field`: Canvas 2D 星空粒子系统渲染（星云、流星、背景）
- `star-interaction`: 星星布局、点击选择、连线拖拽、顺序校验
- `question-bank`: 成语题库 JSON 定义、加载、随机打乱、难度分级
- `audio-engine`: WebAudio 音效管理——点击声、音阶旋律、成功/错误反馈
- `leaderboard`: 当日 Top 10 排行榜（localStorage 存储与展示）
- `result-card`: 答对后的典故学习卡片弹窗

### Modified Capabilities
- 无（全新项目）

## Impact

- 技术栈：TypeScript + React + Vite
- 无后端依赖，纯前端单页应用
- 外部字体：霞鹜文楷（标题）、思源宋体（正文）
- 存储：仅使用 localStorage
- 无新增 API 或第三方服务依赖
