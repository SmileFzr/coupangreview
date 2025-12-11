**用千问写的一个介绍😂**

🛒 Coupang 评论记录助手（Coupang Review Exporter）
一款专为跨境电商从业者、市场调研人员和消费者打造的 Chrome 浏览器插件，可自动抓取并导出韩国最大电商平台 Coupang（쿠팡）商品详情页的用户评论，支持结构化 CSV 导出。
<img width="390" height="322" alt="image" src="https://github.com/user-attachments/assets/76737100-24cd-4c69-8b8c-14b0bed87bcd" />
<img width="1912" height="922" alt="image" src="https://github.com/user-attachments/assets/1f2fb624-0457-440e-89bd-ab56e961d3bb" />


✨ 核心功能
✅ 自动监听评论加载：在 Coupang 商品页滚动翻页时，自动捕获新出现的评论（基于 MutationObserver）。
📥 一键导出 CSV：将所有已抓取评论导出为标准 CSV 文件，包含日期、评分、选项、评论内容等字段。
🔍 灵活筛选导出：支持按评分范围（1~5星）和关键词过滤后再导出，精准获取目标数据。
📊 实时统计面板：显示已捕获评论总数、各星级分布等关键指标。
💾 本地持久化存储：即使关闭页面，已抓取的评论也会保存在浏览器中，下次打开继续使用。
🌐 兼容 Coupang 最新页面结构（截至 2025 年）。

📦 安装方式
开发者模式手动加载（推荐测试）
1. 下载本仓库源码（git clone 或下载 ZIP）。
2. 打开 Chrome 浏览器，访问 chrome://extensions/。
3. 开启右上角 “开发者模式”。
4. 点击 “加载已解压的扩展程序”，选择本项目根目录。
5. 插件即安装成功！访问任意 Coupang 商品页即可使用。

🚀 使用方法
1. 打开 Coupang 商品详情页（如 https://www.coupang.com/vp/products/...）。
2. 点击浏览器工具栏中的插件图标。
3. 点击 “开始记录”，插件将自动监听并收集评论。
4. 滚动页面加载更多评论，插件会持续捕获。
5. 点击 “导出 CSV” 即可下载结构化数据。
🔒 隐私与安全
本插件 仅在 Coupang 商品页运行，不收集任何用户隐私数据。
所有评论数据 仅保存在你的本地浏览器（chrome.storage.local），不会上传至任何服务器。
开源透明，代码可审计。
📄 许可证
本项目采用 [MIT License](LICENSE) 开源协议，欢迎自由使用、修改与分发。
🙌 贡献与反馈
也欢迎提交 Pull Request 帮助改进插件！

📅 初始版本：v1.6.0
