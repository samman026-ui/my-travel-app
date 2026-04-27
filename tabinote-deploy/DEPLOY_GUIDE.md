# たびノート — 部署指南
## 步驟 1：建立 Supabase 資料庫 (免費)

1. 去 https://supabase.com → 點擊 "Start your project"
2. 用 Google 帳號登入
3. 點 "New Project"，填入：
   - Project name: tabinote
   - Database password: 設定一個密碼（記住！）
   - Region: US East (離你最近)
4. 等待 2 分鐘建立完成
5. 去左側 "SQL Editor"，貼入 supabase-schema.sql 的內容，點 "Run"
6. 去 Project Settings → API，複製：
   - Project URL（形如 https://abcde.supabase.co）
   - anon/public key

## 步驟 2：修改 App 設定

打開 src/App.jsx，找到第 10-11 行：
```
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";
```
替換為你剛才複製的值。

## 步驟 3：上傳到 GitHub

1. 去 https://github.com → Sign up（免費）
2. 點 "New repository"，名稱填 "tabinote"，設為 Public，點 Create
3. 在電腦安裝 Git（https://git-scm.com）
4. 打開 Terminal/命令提示符，執行：

```bash
cd tabinote-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用戶名/tabinote.git
git push -u origin main
```

## 步驟 4：用 Vercel 部署

1. 去 https://vercel.com → 用 GitHub 帳號登入
2. 點 "Add New Project" → 選擇 "tabinote" repository
3. Framework Preset 選 "Vite"
4. 點 "Deploy"，等 2-3 分鐘
5. 完成！你會得到一個 URL，例如：
   https://tabinote-sam.vercel.app

## 步驟 5：手機安裝

**iPhone:**
1. 用 Safari 打開你的 URL
2. 點底部 "分享" 按鈕 (□↑)
3. 選 "加入主屏幕"
4. 點 "加入" — App 就出現喺主屏幕！

**Android:**
1. 用 Chrome 打開 URL
2. 點右上角 ⋮ 選單
3. 選 "加到主屏幕"

## 步驟 6：分享俾朋友

直接將 Vercel URL 傳俾朋友就可以了！
所有人都會共享同一個 Supabase 資料庫，任何一個人做的更改大家都能即時看到。

---

## 常見問題

**Q: 同步狀態顯示 "✗ 無法同步"？**
A: 檢查 SUPABASE_URL 和 SUPABASE_ANON_KEY 是否正確填入。

**Q: 朋友睇唔到我的更改？**
A: 確認 Supabase RLS 政策已設定（執行 supabase-schema.sql）。

**Q: 想要私密，唔想朋友改我的資料？**
A: 需要加入用戶登入功能，可以問 Claude 幫你加。

