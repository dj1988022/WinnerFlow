# WinnerFlow 落地实战指南 (From MVP to Production)

恭喜！我们的 MVP 前端已经验证了商业逻辑。现在进入**落地阶段**，我们需要打通真实的数据链路。

## 🏗️ 总体架构 (The Big Picture)

我们需要构建三个核心部分：

1.  **SaaS 网页端 (Web Dashboard)**: 也就是我们现在写的 React App。
    *   *职责*: 数据展示、任务编排、用户管理。
2.  **浏览器插件 (Browser Extension)**: 我们的“触手”。
    *   *职责*: 
        *   **采集 (Sensor)**: 抓取 TikTok/Meta 网页版数据。
        *   **增强 (Overlay)**: 在视频上覆盖 AI 分析结果。
        *   **执行 (Effector)**: 模拟人工点赞、评论、发私信。
3.  **后端与数据库 (Backend & DB)**: 我们的“大脑”。
    *   *职责*: 存储数据、调用 AI API、处理支付。

---

## 🔌 第一步：数据接入方案 (Data Ingestion)

这是最难的一步。为了“马上落地”，**不要自建爬虫**（维护成本极高）。

### 推荐方案：混合数据源 (Hybrid Strategy)

#### 1. 主动搜索数据 (API 接入)
当用户在 SaaS 上搜索“猫砂盆”时，我们需要实时去 TikTok 抓数据。
*   **工具推荐**: **Apify** 或 **RapidAPI**。
*   **具体服务**:
    *   *Apify*: `tiktok-scraper` (抓取视频、评论、用户详情)。
    *   *RapidAPI*: `TikTok All-in-One` (便宜，按请求付费)。
*   **成本**: 约 $5-$20 / 月起步。

#### 2. 被动众包数据 (插件采集)
当用户安装插件后，刷 TikTok 时，插件自动抓取他看到的数据。
*   **原理**: 监听浏览器网络请求 (`chrome.webRequest` 或 `PerformanceObserver`)，拦截 TikTok 的 API 响应 JSON。
*   **优势**: **零成本**，且数据最真实（包含个性化推荐算法的结果）。

---

## 🧩 第二步：浏览器插件开发 (Extension Development)

**技术栈推荐**: **Plasmo** (浏览器插件界的 Next.js)。
*   支持 React + TypeScript + Tailwind。
*   一键编译成 Chrome, Firefox, Edge 插件。

### 核心代码逻辑

#### 1. 拦截 TikTok 数据 (Background Script)
这是“众包”的核心。我们不解析 DOM（容易变），我们直接拦截 API 数据包。

```typescript
// background.ts (Plasmo)

// 监听 TikTok 的视频流 API
const TIKTOK_API_PATTERN = "https://www.tiktok.com/api/item_list/*";

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.url.includes("item_list")) {
      // 1. 获取请求头和 Cookie (用于验证)
      // 注意：Chrome Manifest V3 获取 Response Body 比较麻烦，
      // 通常建议用 content script 注入 XHR 拦截器，或者用 debugger API (权限要求高)。
      
      // 简单方案：通知 Content Script 去提取页面上的 __NEXT_DATA__ 或 hydration data
      chrome.tabs.sendMessage(details.tabId, { type: "SCRAPE_CURRENT_PAGE" });
    }
  },
  { urls: [TIKTOK_API_PATTERN] }
);
```

#### 2. 页面注入与增强 (Content Script)
这是“上帝视角”的核心。

```tsx
// content.tsx (Plasmo)
import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://www.tiktok.com/*"]
}

// 注入到视频容器上
const Overlay = () => {
  const [viralScore, setViralScore] = useState(null)

  useEffect(() => {
    // 1. 获取当前视频 ID
    const videoId = window.location.pathname.split('/').pop();
    
    // 2. 调用我们的后端 API 获取预测分
    fetch(`https://api.winnerflow.com/predict/${videoId}`)
      .then(res => res.json())
      .then(data => setViralScore(data.score));
  }, [])

  if (!viralScore) return null;

  return (
    <div className="fixed top-20 right-4 z-50 bg-black/80 text-white p-4 rounded-xl border border-emerald-500">
      <h3 className="font-bold text-emerald-400">WinnerFlow Predict</h3>
      <div className="text-2xl font-bold">{viralScore}</div>
      <button>Analyze This Ad</button>
    </div>
  )
}

export default Overlay
```

---

## 🧠 第三步：后端与数据库 (Backend & DB)

为了快速落地，推荐使用 **Supabase** (开源 Firebase 替代品)。

### 1. 数据库设计 (PostgreSQL)

我们需要几张核心表：

*   `users`: 用户表 (Supabase Auth 自动处理)。
*   `trends`: 爆款库 (存储从 API 或插件抓回来的视频数据)。
    *   `video_id` (PK)
    *   `stats` (JSON: 播放、点赞、评论)
    *   `ai_analysis` (JSON: Gemini 分析结果)
    *   `viral_score` (Float: 我们的算法得分)
*   `workflows`: 用户的自动化任务配置。

### 2. 云函数 (Edge Functions)

我们需要写几个 API (TypeScript)：

*   `analyze-ad`: 接收视频 URL -> 调用 Apify 抓取 -> 调用 Gemini 分析 -> 存入 DB。
*   `predict-viral`: 定时任务 -> 扫描 DB 中的视频 -> 计算加速度 -> 更新 `viral_score`。

---

## 🚀 马上落地的执行清单 (Action Plan)

1.  **注册账号**:
    *   注册 **Supabase** (数据库 + Auth)。
    *   注册 **Apify** (数据源)。
    *   注册 **Google Gemini API** (AI 分析)。

2.  **初始化项目**:
    *   保留当前的 React 项目作为 **Web Dashboard**。
    *   新建一个文件夹 `extension`，使用 `npm create plasmo` 初始化插件项目。

3.  **打通第一条链路**:
    *   在插件里写一个按钮 "Analyze"。
    *   点击后，获取当前 URL。
    *   发给 Supabase Edge Function。
    *   Function 调用 Apify 抓取数据。
    *   Function 调用 Gemini 分析。
    *   返回结果给插件显示。

**这就是最快落地 MVP 的路径。你不需要写复杂的爬虫，只需要写“胶水代码”把这些强大的 API 粘起来。**
