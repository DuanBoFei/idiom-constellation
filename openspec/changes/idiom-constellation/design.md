## Context

"成语星图"是一个纯前端教育游戏，面向初中生群体，将成语学习转化为星空连线的视觉解谜体验。项目使用 TypeScript + React + Vite 技术栈，无后端依赖。游戏核心流程为：星空展示含汉字星的星群 → 显示谜面线索 → 玩家按正确顺序连接四颗星 → 校验结果 → 展示典故卡片 → 下一题。

## Goals / Non-Goals

**Goals:**
- 单局核心玩法完整跑通（选星 → 连线 → 校验 → 反馈）
- Canvas 2D 粒子星空背景（星云漂移 + 流星）
- DOM 层星星交互（Pointer Events 统一触屏/鼠标）
- 严格全对顺序校验
- 固定 6 题计时速度挑战模式
- 双成语模式（高难度关卡：一组解完再解另一组）
- WebAudio 音效系统（点击、音阶、成功/错误反馈）
- 当日 Top 10 排行榜（localStorage）
- 题库 JSON 化，20 个成语起步

**Non-Goals:**
- 服务端排行榜或账号系统
- 多人对战或社交功能
- 复杂动画引擎（使用 CSS Animation + Canvas 2D，非 Three.js/WebGL）
- 题库编辑器或教师后台
- 国际化（i18n）
- 离线 PWA 支持

## Decisions

### 架构模式：混合渲染（Canvas + DOM）
- **选择**：底层 Canvas 渲染粒子星空背景 + 顶层 Canvas（pointer-events: none）绘制连线；DOM 绝对定位 button 渲染星星及其交互
- **理由**：汉字在 Canvas 中的 CJK 字体渲染质量不稳定，DOM 层 `@font-face` 可完美支持霞鹜文楷；DOM button 自带 Pointer Events 命中检测，避免手写触摸命中计算；双 Canvas 分离背景和连线绘制，避免粒子重绘影响连线性能
- **备选**：纯 Canvas 渲染全部（增加字体和触摸处理复杂度，放弃）

### 状态管理：React Context + useReducer
- **选择**：GameState 使用 useReducer 管理，通过 React Context 下发
- **理由**：MVP 阶段状态流确定（INIT → PLAYING → CHECKING → RESULT → NEXT → FINISHED），不存在复杂跨组件同步场景，引入 zustand 或 Redux 过度
- **备选**：zustand（轻量但 MVP 阶段不需要）

### 游戏模式：固定 6 题计时速度挑战
- **选择**：6 道题，每题上限 20s（普通）/ 25s（双成语），答对奖励 +5s
- **理由**：题数固定让游戏体验可预期（~2 分钟一局），时间奖励而非重置让"速度"有价值
- **备选**：生存模式（时间耗尽为止）——适合后续作为扩展模式

### 双成语模式：串行解锁
- **选择**：两组字同时存在于星场，但一次只显示一组线索。解完第一组成语后它转为金色不可交互，再显示第二组线索
- **理由**：避免认知过载，自然复用"搜索"肌肉，布局灵活无需分屏
- **备选**：两组并行显示（易造成混淆，放弃）

### 音效：WebAudio 振荡器 + 程序化生成
- **选择**：不依赖音效文件，使用 WebAudio OscillatorNode 实时生成音高
- **理由**：减少 MVP 构建产物体积；每颗星的音高可动态计算（基于成语绑定的五声音阶）
- **备选**：预录音效文件（增加加载体积和管理复杂度，后续可替换）

### 题库格式：JSON 文件，编译时加载
- **选择**：题库定义为 TypeScript 文件中的 JSON 数组，Vite 编译时打包
- **理由**：MVP 无需运行时加载；TypeScript 类型检查确保题库字段完整
- **备选**：public 目录下的独立 JSON 文件（方便替换但增加请求，适合后续扩展）

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| Canvas 粒子性能在高 DPI 屏幕下降 | 限制粒子数量 (< 200)；使用 `devicePixelRatio` 缩放而非放大画布；rAF 节流 |
| DOM 星星在 Canvas 背景上的坐标对齐 | 使用统一的 `useStarLayout` hook 管理坐标映射；Canvas 与 DOM 共享同一套坐标数据 |
| 触摸屏上手指遮挡星星 | 星星交互区域放大至 64×64px（视觉 40px）；点击后展示 1.5x 放大反馈 |
| WebAudio 在 iOS Safari 上需要用户手势触发 | 首次点击时初始化 AudioContext（resume 策略） |
| 双成语模式下 12-16 星布局拥挤 | 同屏最多 16 星；成语 A/B 的字在星场中分区分布 |
