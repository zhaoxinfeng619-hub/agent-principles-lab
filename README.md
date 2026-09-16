# AI Principles Lab

一个面向 AI 初学者的中文互动学习网站，通过可视化实验讲解三个核心主题：

- Agent Loop：上下文、规划、工具调用、反馈与记忆
- Agent 协作：Subagent / Multi-agent 的分工与共识
- RAG：离线建库、在线检索、重排与引用回答

## 在线体验

启用 GitHub Pages 后，可直接从仓库主页的 Pages 链接访问。

## 本地运行

这是一个纯静态网站。为确保 iframe 与脚本正常工作，请在本目录启动本地静态服务器：

```bash
python3 -m http.server 8000
```

然后打开 `http://localhost:8000/`。

## 入口

- `index.html`：站点根入口
- `agent-principles-lab.html`：三个原理实验的主页面
- `agent-flow-lab.html`：Agent Loop 实验
- `agent-collaboration-lab.html`：Agent 协作实验
- `_rag-module.html`：RAG 实验
