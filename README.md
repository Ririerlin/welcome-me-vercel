# 本地运行与 Vercel 部署说明

这个项目目前是一个基于 `Vite + React + TypeScript` 的前端静态站点。

## 先说结论

- 这个项目当前没有实际调用 Gemini API。
- 这个项目当前没有服务端代码。
- 这个项目当前不需要 `GEMINI_API_KEY` 才能运行。
- 这个项目可以直接部署到 Vercel。

## 本地运行

前提：电脑已安装 Node.js。

1. 安装依赖

```bash
npm install
```

2. 启动开发环境

```bash
npm run dev
```

3. 打开浏览器访问

```text
http://localhost:3000
```

## 本地构建

```bash
npm run build
```

构建完成后，打包文件会生成在 `dist` 目录。

## 部署到 Vercel

Vercel 推荐配置如下：

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 环境变量

当前版本不需要配置任何环境变量。

如果你以后新增真正的后端接口，再把 API Key 放到服务端环境变量里，不要直接放到前端代码里。
