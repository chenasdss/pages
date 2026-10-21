# MySite · 纯 HTML / CSS / JS 静态站点

一个零依赖、零构建的静态网站示例，可以直接部署到 GitHub Pages。

## 目录结构

```
gp-demo/
├── index.html          # 页面结构
├── css/
│   └── style.css       # 样式（CSS 变量 + 明暗主题 + 响应式）
├── js/
│   └── main.js         # 交互逻辑（原生 JS，IIFE 封装）
├── .nojekyll           # 告诉 GitHub Pages 不要用 Jekyll 处理
└── README.md
```

## 功能

- 🎨 **明暗主题切换**：跟随系统偏好，手动选择会记住（localStorage）
- ⚡ **点击计数器**：数值持久化，带弹跳动画
- 🌀 **滚动渐入**：卡片进入视口时淡入（IntersectionObserver）
- 📝 **名字列表**：本地增删、去重、上限 12 条
- 📱 **响应式**：560px 断点适配手机
- 🔗 **导航高亮**：滚动时自动高亮当前区块

## 本地预览

直接双击 `index.html` 即可（没有 ajax 请求，无需本地服务器）。

想用服务器方式预览：

```bash
# Python 3
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 部署到 GitHub Pages

### 最简方式（分支部署，推荐）

```bash
git init
git add .
git commit -m "init: my site"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后：

1. 打开仓库 → **Settings** → **Pages**
2. **Source** 选 `Deploy from a branch`
3. Branch 选 `main`，目录选 `/ (root)` → **Save**
4. 等 1～2 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`

### 自定义域名

1. DNS 添加 `CNAME` 记录指向 `<你的用户名>.github.io`（或用 A 记录指向 `185.199.108.153` 等）
2. Settings → Pages → **Custom domain** 填域名 → Save
3. 等 DNS 生效后勾选 **Enforce HTTPS**

## 修改指南

| 想改什么 | 改哪里 |
|---|---|
| 文字内容 | `index.html` |
| 主题色、字体、间距 | `css/style.css` 顶部的 `:root` 变量 |
| 深色模式配色 | `css/style.css` 的 `[data-theme="dark"]` |
| 交互行为 | `js/main.js` |

换主色只需要改这一行：

```css
:root {
  --primary: #4f46e5;   /* 换成你想要的颜色 */
}
```

## 注意事项

- 仓库里要保留 `.nojekyll`，否则以 `_` 开头的文件/目录可能被 Jekyll 忽略。
- 所有资源用**相对路径**（`css/style.css`），不要用 `/css/style.css`，否则部署到子路径会 404。
- 如果之后搬家到自定义域名并放到根路径，相对路径依然可用，无需修改。
