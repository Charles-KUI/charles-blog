/**
 * Charles Blog - 内容注册表（繁体中文 / 英文 双语）
 * ====================================
 * 新增作业只需两步：
 *   1. 把图片放到 assets/posts/，视频放到 assets/videos/
 *   2. 在对应科目的 assignments 数组里加一条记录（每个文字字段写 en / zh 两份）
 * 页面会自动渲染，无需改任何 HTML。
 *
 * 双语字段写法：{ en: 'English text', zh: '繁體中文' }
 *   - 纯技术字段（id / no / date / image / figLabel / 图片路径）保持单字符串
 *   - 正文区块 body 的 text 同样是 { en, zh }
 *
 * body 区块类型：
 *   { type: 'p',     text: '段落文字' }
 *   { type: 'h2',    text: '章标题（衬线大字 + 左侧边框条）' }
 *   { type: 'h3',    text: '小节标题（圆润无衬线加粗，无前置短横）' }
 *   { type: 'quote', text: '引用金句' }
 *   { type: 'note',  text: '声明 / 脚注段' }
 *   { type: 'figure', src: 'assets/posts/xxx.png', caption: 'FIG.02 — 图注' }
 *     多图共用一个说明时改用 srcs（数组），例：
 *     { type: 'figure', srcs: ['assets/posts/a.png', 'assets/posts/b.png'],
 *       alt: '无障碍短描述', caption: '图下的成句描述', captionStyle: 'note' }
 *     · alt 可省（省则退回用 caption）；captionStyle: 'note' 把说明排成
 *       左对齐正文级文字，用于「这段文字就是在说这张图」的长描述；
 *       缺省是短标签式图注（小字居中）。
 *   { type: 'video', src: 'assets/videos/xxx.mp4', caption: 'VIDEO — 图注' }
 *     （src 留空则显示复古测试卡占位，上传视频后填入路径即可；
 *       captionStyle: 'note' 同上）
 *   { type: 'embed', provider: 'youtube', id: '影片ID',
 *     title: {en,zh}, caption: {en,zh}, captionStyle: 'note' }
 *     （外部影片必须用 iframe 才播得起来；provider 走白名单，id 做正则校验）
 *   { type: 'ref', text: {en,zh}, url: '链接', note: {en,zh} }
 *     （文献条目：书目 → 可见的完整链接 → 左竖线注解）
 *   { type: 'diagram', ... }  内联 SVG 环形流程图
 *   { type: 'table', tag?, title, columns, groups, caption }  剪报风分组表格
 *     （tag 已于第二十五階段撤除，不要再写；分组轴由 groups[].label 提供）
 *   { type: 'matrix', title, xLabel, yLabel, xTicks, yTicks, legendTitle,
 *     legend: [{ key: 'hard'|'medium'|'easy', label, note, desc }],
 *     tableTitle, cols: { id, desc, diff }, hintTag, hint,
 *     risks: [{ no, short, l, s, diff, desc, fix }], fixLabel, caption? }
 *     風險矩陣（·34 定稿）：4×4 落格，座標軸自己講 L×S；顏色只講
 *     「解決難易度」，空白格一律紙色。格內只放「編號 + 2–3 詞」，
 *     完整描述與策略在懸停 / 輕點打開的詳情卡裡，下方配三欄清單。
 *   { type: 'timeline', title, range, items, caption }
 *     時間軸：items 每項 { date, text, milestone? }。≥1100px 橫向 ——
 *     事件小卡全部排在軸線**上方**（等寬欄位，永不重疊），
 *     milestone: true 的卡片填青；窄屏自動轉成左軸縱向時間軸。
 *   { type: 'gallery', title: '簡報標題', file: 'assets/pdfs/xxx.pdf',
 *     hint: '點擊提示', items: [ { src: 'assets/slides/xxx/p1.png', label: '頁面標籤' }, ... ] }
 *     （簡報幻燈片畫廊：每頁一張高清圖，依序由左至右排列、可箭頭翻頁、
 *       點圖全螢幕瀏覽；file 為原始 PDF，供「另開新頁 / 下載」按鈕；
 *       圖檔路徑與語言無關，切換語言時畫廊本身不重建）
 *
 * 媒體目錄約定：
 *   assets/posts/    文章配圖（png/jpg）
 *   assets/videos/   文章视频（mp4）
 *   assets/pdfs/     簡報 / 報告整份 PDF（原始檔，供下載）
 *   assets/slides/   簡報逐頁渲染出的高清圖（畫廊用；由 .workbuddy/render-slides.py 產生）
 */

const SUBJECTS = {
  bcm212: {
    code: 'BCM212',
    name: { en: 'Research Practice', zh: '研究實踐' },
    tagline: {
      en: 'Turning Curiosity into Research',
      zh: '把好奇心變成專業研究',
    },
    desc: {
      en: 'Transforming abstract curiosity into structured methodologies to uncover deeper media insights.',
      zh: '將抽象的好奇心轉化為結構化的研究方法，以此挖掘更深層的媒體洞察。',
    },
    heroImage: 'assets/subjects/bcm212-hero.png',
    heroCaption: {
      en: 'FIG.01 — Insights & Analysis',
      zh: 'FIG.01 — 洞察與分析',
    },
    assignments: [
      {
        id: 'bcm212-a1',
        no: 'No.01',
        studentId: '1723674',
        title: {
          en: 'Cross-Border E-Commerce of Fast Fashion: Gen Z Shoppers’ Acceptance and Trust Towards AI-Generated Imagery',
          zh: '快時尚跨境電商：Z 世代消費者對 AI 生成影像的接受度與信任',
        },
        excerpt: {
          en: 'A research proposal on the trust gap behind AI-generated fashion imagery — why fast fashion gets away with it, and how shoppers across cultures spot the machine, say so, or forgive it.',
          zh: '一份關於 AI 生成時尚影像「信任落差」的研究提案——快時尚為何能全身而退，以及不同文化背景的消費者如何辨識出機器、如何被影響，又如何原諒它。',
        },
        date: '2026-09-29',
        tags: [
          { en: 'BCM212 A1', zh: 'BCM212 A1' },
          { en: 'Research Proposal', zh: '研究提案' },
          { en: 'Experimental Design', zh: '實驗設計' },
        ],
        image: 'assets/posts/bcm212-a1-cover.png',
        figLabel: { en: 'FIG.02 — Fast fashion under the magnifying glass', zh: 'FIG.02 — 放大鏡下的快時尚' },
        body: [
          { type: 'h2', text: { en: '1. Intended Topic', zh: '1. 研究主題' } },
          {
            type: 'p',
            text: {
              en: 'This project looks at how different types of consumers accept and trust AI-generated clothing images in cross-border e-commerce. It focuses on fast fashion, where sellers use AI models to cut photography costs. Research shows that consumers accept AI models much more easily in fast fashion than in luxury fashion, meaning they are less likely to reduce how much they are willing to pay (Srinivas et al., 2026). This makes fast fashion the best area for this study.',
              zh: '本計畫探討不同類型的消費者在跨境電商中，如何接受並信任 AI 生成的服飾影像。研究聚焦於快時尚——賣家在這裡用 AI 模特兒壓低攝影成本。既有研究顯示，消費者對快時尚 AI 模特兒的接受度遠高於精品時尚，也就是說，他們因此削減付費意願的程度較低（Srinivas et al., 2026）。這使快時尚成為本研究最合適的場域。',
            },
          },
          { type: 'h2', text: { en: '2. Timely, Relevant, and Achievable', zh: '2. 時效性、相關性與可行性' } },
          { type: 'h3', text: { en: 'Timely', zh: '時效性' } },
          {
            type: 'p',
            text: {
              en: 'Generative AI is quickly changing the fashion industry and could add $150 billion to $275 billion in profits (Harreis et al., 2023). Sellers now use AI widely to launch products faster and cut design costs (Harreis et al., 2023).',
              zh: '生成式 AI 正快速改寫時尚產業，可能帶來 1,500 億至 2,750 億美元的利潤（Harreis et al., 2023）。賣家如今廣泛使用 AI，以更快推出商品並降低設計成本（Harreis et al., 2023）。',
            },
          },
          { type: 'h3', text: { en: 'Relevant', zh: '相關性' } },
          {
            type: 'p',
            text: {
              en: 'This study looks at the trade-off sellers face: saving money with AI versus losing consumer trust and sales (Srinivas et al., 2026). It also tests if telling buyers upfront that an image is AI-generated helps rebuild that trust (Srinivas et al., 2026).',
              zh: '本研究直視賣家面對的取捨：用 AI 省錢，還是冒著流失消費者信任與銷售額的風險（Srinivas et al., 2026）。研究也測試「事先告知買家影像是 AI 生成」是否有助於重建這份信任（Srinivas et al., 2026）。',
            },
          },
          { type: 'h3', text: { en: 'Achievable', zh: '可行性' } },
          {
            type: 'p',
            text: {
              en: 'We will use an online and in-person campus survey. This gives us quick access to local Hong Kong, Mainland Chinese, and international students. The data will help us investigate how real the images look to them and whether they still want to buy the clothes.',
              zh: '我們將採用線上與校園實地並行的問卷調查，這讓我們能快速接觸本地香港、中國內地與國際學生。這些資料將幫助我們了解：在他們眼中這些影像有多真實，以及他們是否仍願意購買這些衣服。',
            },
          },
          { type: 'h2', text: { en: '3. Research Questions and Epistemological Stance', zh: '3. 研究問題與認識論立場' } },
          { type: 'h3', text: { en: 'Primary Question', zh: '主要研究問題' } },
          {
            type: 'p',
            text: {
              en: 'How do AI-generated images in cross-border e-commerce affect brand trust and buying choices among consumers from different cultures?',
              zh: '跨境電商中的 AI 生成影像，如何影響不同文化背景消費者對品牌的信任與購買選擇？',
            },
          },
          { type: 'h3', text: { en: 'Sub-Questions', zh: '子問題' } },
          {
            type: 'p',
            text: {
              en: 'How well can consumers spot AI models based on visual details like skin texture or face symmetry, and how does the “eerie” feeling they get reduce their trust in the brand and the product’s quality? (Xiong et al., 2026)',
              zh: '消費者能多準確地從肌膚紋理、臉部對稱性等視覺細節辨識出 AI 模特兒？而隨之而來的「詭異感」又如何削弱他們對品牌與產品品質的信任？（Xiong et al., 2026）',
            },
          },
          {
            type: 'p',
            text: {
              en: 'How does clearly stating that an image is AI-generated affect trust and buying intent, and do these reactions differ across cultural groups? (Srinivas et al., 2026)',
              zh: '明確標示影像是 AI 生成，會如何影響信任與購買意願？這些反應在不同文化群體之間是否存在差異？（Srinivas et al., 2026）',
            },
          },
          { type: 'h3', text: { en: 'Epistemological Stance', zh: '認識論立場' } },
          {
            type: 'p',
            text: {
              en: 'This is an epistemological question. It asks how consumers gain knowledge and decide what is real. Specifically, it looks at how fake digital images shape real beliefs about clothing quality, and how trust is built or lost in the mind.',
              zh: '這是一個認識論的問題：它追問消費者如何獲取知識、如何判定什麼是真的。具體來說，它關注虛假的數位影像如何形塑人們對服飾品質的真實信念，以及信任如何在人心裡建立或流失。',
            },
          },
          { type: 'h3', text: { en: 'Experimental Control', zh: '實驗控制' } },
          {
            type: 'p',
            text: {
              en: 'The study isolates the effect of AI by changing the model types and whether AI use is disclosed. We will keep the product types and basic image styles the same to ensure fair testing.',
              zh: '本研究透過操弄模特兒類型與是否揭露 AI 使用，來隔離 AI 的效果。我們會讓產品類型與基本影像風格保持一致，以確保測試公平。',
            },
          },
          {
            type: 'table',
            title: { en: 'Experimental design: variables & controls', zh: '實驗設計：變項與控制變項' },
            columns: [
              { en: 'Factor Type', zh: '因素類型' },
              { en: 'Specific Element', zh: '具體要素' },
              { en: 'Description / Levels', zh: '說明／水準' },
            ],
            groups: [
              {
                label: { en: 'Variables', zh: '變項' },
                rows: [
                  [
                    { en: 'Model Image Type', zh: '模特兒影像類型' },
                    { en: 'AI-generated vs. Human photography', zh: 'AI 生成 vs. 真人攝影' },
                  ],
                  [
                    { en: 'AI Disclosure', zh: 'AI 揭露' },
                    { en: 'Explicitly disclosed vs. Undisclosed', zh: '明確揭露 vs. 未揭露' },
                  ],
                  [
                    { en: 'Demographics', zh: '人口變項' },
                    { en: 'Cultural background, online shopping experience', zh: '文化背景、線上購物經驗' },
                  ],
                  [
                    { en: 'Dependent Variables', zh: '依變項' },
                    { en: 'Perceived eeriness, trustworthiness, purchase intention', zh: '感知詭異感、可信度、購買意願' },
                  ],
                ],
              },
              {
                label: { en: 'Constants (Controls)', zh: '常數（控制變項）' },
                rows: [
                  [
                    { en: 'Product Category', zh: '產品類別' },
                    { en: 'Fast-fashion apparel', zh: '快時尚服飾' },
                  ],
                  [
                    { en: 'Visual Baselines', zh: '視覺基準' },
                    { en: 'Uniform layout, background, lighting, and garment style', zh: '一致的版面、背景、光線與服裝風格' },
                  ],
                  [
                    { en: 'Measurement Tools', zh: '測量工具' },
                    { en: 'Standardized psychological scales', zh: '標準化心理量表' },
                  ],
                ],
              },
            ],
            caption: {
              en: 'FIG.03 — What the study varies, and what it holds still',
              zh: 'FIG.03 — 研究操弄什麼，又固定什麼',
            },
          },
          { type: 'h2', text: { en: '4. Reflexivity Statement', zh: '4. 反身性陳述' } },
          {
            type: 'p',
            text: {
              en: 'As an active online shopper who creates content about cross-border trade, I see why sellers use AI to cut costs. I personally doubt that AI images accurately show how a real piece of clothing fits or feels. I also assume younger people can spot AI images more easily. To avoid letting my personal views affect the research, the survey will use neutral language and standard psychological questions. This ensures the data collected about consumer preferences remains objective.',
              zh: '作為一個長期網購、也持續製作跨境貿易內容的創作者，我理解賣家為什麼要用 AI 來降低成本。但我個人懷疑，AI 影像能否準確呈現一件真實衣服的合身程度與觸感。我也預設年輕人比較容易辨識出 AI 影像。為了不讓個人觀點影響研究，問卷將採用中性的措辭與標準化的心理學題項，以確保所蒐集到的消費者偏好資料保持客觀。',
            },
          },
          { type: 'h2', text: { en: 'References', zh: '參考文獻' } },
          {
            type: 'ref',
            text: {
              en: 'Srinivas, N., Samba, V., & Rupaveni, A. (2026). The AI model premium gap: Schema incongruence, source credibility, and willingness-to-pay penalties across luxury and fast fashion advertising contexts. IOSR Journal of Business and Management, 28(7), 19-31.',
              zh: 'Srinivas, N., Samba, V., & Rupaveni, A. (2026). The AI model premium gap: Schema incongruence, source credibility, and willingness-to-pay penalties across luxury and fast fashion advertising contexts. IOSR Journal of Business and Management, 28(7), 19-31.',
            },
            url: 'https://www.iosrjournals.org/iosr-jbm/papers/Vol28-issue7/Ser-2/B2807021931.pdf',
            note: {
              en: 'Establishes the premise: the same AI model image costs a fast-fashion brand far less trust than a luxury one — which is exactly why this study sits in fast fashion.',
              zh: '確立了本研究的前提：同一張 AI 模特兒影像，對快時尚品牌造成的信任損失遠低於精品品牌——這正是本研究選擇以快時尚為場域的原因。',
            },
          },
          {
            type: 'ref',
            text: {
              en: 'Harreis, H., Koullias, T., Roberts, R., & Te, K. (2023). Generative AI: Unlocking the future of fashion. McKinsey & Company.',
              zh: 'Harreis, H., Koullias, T., Roberts, R., & Te, K. (2023). Generative AI: Unlocking the future of fashion. McKinsey & Company.',
            },
            url: 'https://www.mckinsey.com/industries/retail/our-insights/generative-ai-unlocking-the-future-of-fashion',
            note: {
              en: 'Sizes the commercial stake — the $150–275 billion profit window that makes AI imagery worth studying in the first place.',
              zh: '量出這件事的商業規模——1,500 億至 2,750 億美元的利潤空間，正是 AI 影像值得被研究的理由。',
            },
          },
          {
            type: 'ref',
            text: {
              en: 'Xiong, L., Wei, D., & Long, X. (2026). Real vs. virtual: How the uncanny valley weakens the persuasive power of celebrity AI avatar presenters. Journal of Theoretical and Applied Electronic Commerce Research, 21(5), 141.',
              zh: 'Xiong, L., Wei, D., & Long, X. (2026). Real vs. virtual: How the uncanny valley weakens the persuasive power of celebrity AI avatar presenters. Journal of Theoretical and Applied Electronic Commerce Research, 21(5), 141.',
            },
            url: 'https://www.mdpi.com/0718-1876/21/5/141',
            note: {
              en: 'Supplies the mechanism behind the sub-question: uncanny-valley discomfort is what turns “this looks fake” into “I trust this brand less”.',
              zh: '為子問題提供機制解釋：恐怖谷帶來的不適感，正是把「這看起來很假」轉譯成「我比較不信任這個品牌」的關鍵。',
            },
          },
          {
            type: 'note',
            text: {
              en: 'Generative AI（Google Gemini）was utilized to assist with structuring the research outline, and refining language clarity.',
              zh: '本作業使用生成式 AI（Google Gemini）協助擬定研究大綱的結構，並潤飾語言的清晰度。',
            },
          },
        ],
      },
      {
        id: 'bcm212-a2',
        no: 'No.02',
        studentId: '1723674',
        title: {
          en: "Cross-Border E-Commerce of Fast Fashion: Gen Z Shoppers' Acceptance and Trust Towards AI-Generated Imagery (Project - Project Design and Management Plan)",
          zh: '快時尚跨境電商：Z 世代消費者對 AI 生成影像的接受度與信任（專案設計與管理計畫）',
        },
        excerpt: {
          en: 'The working plan behind the study: a bilingual visual survey, an ethics protocol built on anonymity, a five-risk matrix, and a timeline that lands exactly on submission day.',
          zh: '研究背後的執行計畫：雙語視覺問卷、以匿名為底的倫理程序、五項風險的評估矩陣，以及一路排到繳交日的時間軸。',
        },
        date: '2026-10-18',
        tags: [
          { en: 'BCM212 A2', zh: 'BCM212 A2' },
          { en: 'Project Plan', zh: '專案計畫' },
          { en: 'Risk Matrix', zh: '風險矩陣' },
        ],
        image: 'assets/posts/bcm212-a2-cover.png',
        figLabel: { en: 'FIG.03 — Survey first, then the plan', zh: 'FIG.03 — 先問卷，再談規劃' },
        body: [
          { type: 'h2', text: { en: '1. Aims and Significance', zh: '1. 研究目的與意義' } },
          {
            type: 'p',
            text: {
              en: "This project investigates how Gen Z shoppers in the cross-border e-commerce market accept and trust AI-generated apparel imagery. While fast-fashion brands are rapidly adopting AI-generated models to cut creative costs and speed up product launches, this strategy introduces a major commercial risk: it can severely damage consumer trust and directly lower the willingness to pay. My research aims to measure exactly how consumers react to these artificial images, what visual cues make them feel \"uncanny,\" and whether a brand can successfully rebuild that trust by being transparent and explicitly disclosing their use of AI.",
              zh: '本專案探討跨境電商市場中的 Z 世代消費者，如何接受並信任 AI 生成的服飾影像。快時尚品牌正快速採用 AI 模特兒以壓低創意成本、加快商品上市，但這個策略也帶來一項重大的商業風險：它可能嚴重損害消費者信任，並直接拉低付費意願。我的研究旨在精確測量消費者對這些人工影像的反應、哪些視覺線索讓他們感到「詭異」，以及品牌能否透過透明揭露 AI 的使用，成功重建這份信任。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'This project delivers highly actionable insights. The key stakeholders are cross-border e-commerce merchants, fast-fashion marketing teams, and everyday e-commerce consumers. By identifying the exact balance between visual production costs and consumer purchase intention, this research provides the fashion industry with a concrete roadmap for deploying AI effectively and ethically.',
              zh: '本專案產出的是高度可執行的洞察。關鍵利害關係人包括跨境電商賣家、快時尚行銷團隊，以及日常的電商消費者。透過找出視覺製作成本與消費者購買意願之間的精確平衡點，本研究為時尚產業提供一份具體可行的藍圖，讓 AI 能被有效且合乎倫理地部署。',
            },
          },
          { type: 'h2', text: { en: '2. Method and Justification', zh: '2. 研究方法與其理據' } },
          {
            type: 'p',
            text: {
              en: 'This project uses a quantitative survey built around a visual experiment. Participants will view a series of fast-fashion advertisements—some featuring human models and others featuring AI-generated models—and then answer structured questions about their perceptions.',
              zh: '本專案採用一套以視覺實驗為核心的量化問卷。參與者將觀看一系列快時尚廣告——部分使用真人模特兒，部分使用 AI 生成的模特兒——隨後針對自己的感知回答結構化問題。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'This method is the most effective way to answer the research question. Measuring abstract concepts like "brand trust" and "perceived realism" requires structured psychological tools. By adapting established quantitative scales used in recent fast-fashion research (Bhanver et al., 2023) and AI-perception studies (Veiga & Haslbeck, 2026), this survey ensures highly accurate and reliable data.',
              zh: '這個方法是最能回答研究問題的途徑。要測量「品牌信任」與「感知真實性」這類抽象概念，需要結構化的心理計量工具。本研究沿用近期快時尚研究（Bhanver et al., 2023）與 AI 感知研究（Veiga & Haslbeck, 2026）中既有的量化量表，以確保資料高度準確且可靠。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The project targets a focused sample size of 30 to 50 university students, specifically aiming for a diverse mix of cultural backgrounds, including local Hong Kong, Mainland Chinese, and international students. Participants will be recruited through two primary agile channels: in-person iPad intercepts across the university campus to capture immediate, spontaneous visual reactions, and targeted online survey distribution through established personal and academic networks (to efficiently reach Mainland Chinese students). This convenience sampling approach is highly effective for capturing the exact demographic that drives global fast-fashion sales—digitally native Gen Z shoppers.',
              zh: '本專案的目標樣本量聚焦在 30 至 50 位大學生，並刻意追求文化背景的多元組成，包含本地香港、中國內地與國際學生。參與者將透過兩條機動管道招募：一是在校園各處以 iPad 進行面訪攔截，捕捉立即、自發的視覺反應；二是透過既有的人際與學術網絡定向發放線上問卷（以有效觸及中國內地學生）。這種便利抽樣方式，對於捕捉真正驅動全球快時尚銷售的那個族群——數位原生的 Z 世代消費者——極為有效。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The survey will feature core questions such as:',
              zh: '問卷將包含以下核心問題：',
            },
          },
          {
            type: 'p',
            text: {
              en: '"Can you identify if the model in this image is AI-generated, and what specific visual cues helped you make that decision?"',
              zh: '「你能判斷這張圖裡的模特兒是否為 AI 生成嗎？是哪些具體的視覺線索幫助你做出判斷？」',
            },
          },
          {
            type: 'p',
            text: {
              en: '"If the brand explicitly states this image is AI-generated, how does that affect your trust in the brand?"',
              zh: '「如果品牌明確標示這張圖是 AI 生成，這會如何影響你對該品牌的信任？」',
            },
          },
          {
            type: 'p',
            text: {
              en: "\"Based on your perception of the image and the brand's transparency, how likely are you to purchase this clothing item?\"",
              zh: '「綜合你對這張圖的感知與品牌的透明程度，你購買這件衣服的可能性有多高？」',
            },
          },
          { type: 'h2', text: { en: '3. Ethical Research Practice', zh: '3. 倫理研究實踐' } },
          {
            type: 'p',
            text: {
              en: 'Conducting ethical research is a primary obligation. This project strictly adheres to academic integrity and participant safety guidelines, ensuring that all data collection is transparent, secure, and respectful.',
              zh: '進行合乎倫理的研究是首要義務。本專案嚴格遵守學術誠信與參與者安全規範，確保所有資料蒐集過程透明、安全且尊重參與者。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The primary obligation to the participants is to protect their privacy and ensure they are fully informed. While evaluating fashion advertisements poses no physical or psychological harm, there is a standard data privacy risk associated with online surveys. To completely eliminate this risk, the survey will be 100% anonymous. It will not collect names, student IDs, exact birth dates, or any identifiable personal tracking data.',
              zh: '對參與者的首要義務，是保護其隱私並確保他們充分知情。評估時尚廣告並不會造成生理或心理傷害，但線上問卷本身存在既定的資料隱私風險。為了完全消除這項風險，本問卷將採 100% 匿名：不蒐集姓名、學號、確切出生日期，或任何可辨識身分的個人追蹤資料。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'Before starting the survey, participants will encounter a clear Informed Consent Form. This form will explicitly state the purpose of the project, explain how their anonymous data will be used, and emphasize that their participation is completely voluntary. They can exit the survey at any point without any consequences.',
              zh: '在開始填答前，參與者會先看到一份清楚的知情同意書。這份文件會明確說明專案目的、解釋其匿名資料將如何被使用，並強調參與完全出於自願。他們可以在任何時間點退出，不會有任何後果。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'When approaching participants on campus with an iPad or reaching out via online networks, the communication will be professional, friendly, and non-coercive. Furthermore, when the final results are published or presented in class, the data will only be discussed in broad, aggregated trends. No individual responses will ever be isolated or exposed. This strategy guarantees that the university, the researcher, and most importantly, the participants, remain completely protected.',
              zh: '無論是在校園以 iPad 接觸參與者，或透過線上網絡聯繫，溝通方式都會保持專業、友善且不具強迫性。此外，當最終結果發表或在課堂上呈現時，資料只會以整體的匯總趨勢討論，任何個別作答都不會被單獨挑出或曝光。這套策略確保了學校、研究者，以及最重要的——參與者——都受到完整保護。',
            },
          },
          { type: 'h2', text: { en: '4. Risk and Time Management Planning', zh: '4. 風險與時間管理規劃' } },
          { type: 'h3', text: { en: 'Risk Matrix', zh: '風險矩陣' } },
          {
            type: 'p',
            text: {
              en: 'To ensure the project stays on track, potential risks have been evaluated based on their Likelihood (1-4) and Severity (1-4). Proactive solutions are already in place for high-priority risks.',
              zh: '為確保專案如期推進，潛在風險已依「可能性（1–4）」與「嚴重度（1–4）」逐一評估。針對高優先度的風險，預防性的應對方案均已就位。',
            },
          },
          {
            type: 'matrix',
            title: { en: 'Likelihood × severity', zh: '可能性 × 嚴重度' },
            xLabel: { en: 'Likelihood', zh: '可能性' },
            yLabel: { en: 'Severity', zh: '嚴重度' },
            xTicks: [
              { n: 1, label: { en: 'Rare', zh: '罕見' } },
              { n: 2, label: { en: 'Possible', zh: '可能' } },
              { n: 3, label: { en: 'Likely', zh: '很可能' } },
              { n: 4, label: { en: 'Almost certain', zh: '幾乎必然' } },
            ],
            yTicks: [
              { n: 1, label: { en: 'Minor', zh: '輕微' } },
              { n: 2, label: { en: 'Moderate', zh: '中等' } },
              { n: 3, label: { en: 'Major', zh: '重大' } },
              { n: 4, label: { en: 'Critical', zh: '嚴重' } },
            ],
            /* 顏色不再重複表達「嚴重度」（座標軸已經講了），改講「解決難易度」 */
            legendTitle: { en: 'Mitigation difficulty', zh: '解決難易度' },
            legend: [
              {
                key: 'hard',
                label: { en: 'Hard', zh: '困難' },
                note: { en: 'Ongoing field effort', zh: '持續線下跑動' },
                desc: {
                  en: 'Needs continuous offline outreach and cooperation from external respondents.',
                  zh: '需要持續的線下跑動，以及外部受訪者的配合。',
                },
              },
              {
                key: 'medium',
                label: { en: 'Medium', zh: '中等' },
                note: { en: 'Design & screening', zh: '設計與篩檢' },
                desc: {
                  en: 'Needs questionnaire design and hands-on screening during collection.',
                  zh: '需要問卷機制設計，並在收集期間人工篩檢。',
                },
              },
              {
                key: 'easy',
                label: { en: 'Easy', zh: '容易' },
                note: { en: 'One-off tech setup', zh: '一次性技術設定' },
                desc: {
                  en: 'Solved once with a single technical setup.',
                  zh: '只需一次性的技術設定即可完全規避。',
                },
              },
            ],
            tableTitle: { en: 'Risk register', zh: '風險清單' },
            cols: {
              id: { en: 'ID', zh: '編號' },
              desc: { en: 'Risk Description', zh: '風險描述' },
              diff: { en: 'Difficulty (L×S)', zh: '難易度（L×S）' },
            },
            fixLabel: { en: 'Mitigation strategy', zh: '應對策略' },
            hintTag: { en: 'Hover · Tap', zh: '懸停 · 輕點' },
            hint: {
              en: 'Move the cursor over any tag — or tap it on a phone — to read the full risk and its mitigation strategy.',
              zh: '把游標移到任一標籤上——手機則輕點一下——即可查看該風險的完整說明與應對策略。',
            },
            risks: [
              {
                no: '01',
                short: { en: 'Low Response', zh: '回覆率低' },
                l: 3,
                s: 4,
                diff: 'hard',
                desc: { en: 'Low overall response rate (struggling to reach 30–50 participants)', zh: '整體回覆率偏低（難以觸及 30–50 位參與者）' },
                fix: {
                  en: 'Leverage personal networks for online sharing and conduct campus iPad intercepts during peak lunch hours.',
                  zh: '透過個人網絡協助線上分享，並在午休高峰時段於校園進行 iPad 面訪。',
                },
              },
              {
                no: '02',
                short: { en: 'Rushed Answers', zh: '草率作答' },
                l: 3,
                s: 3,
                diff: 'medium',
                desc: { en: 'Rushed / careless survey answers', zh: '問卷作答草率、不專心' },
                fix: {
                  en: 'Keep survey under 3 minutes and include one "attention-check" question to filter out invalid clicks.',
                  zh: '將問卷控制在 3 分鐘內，並加入一道「注意力檢查」題，過濾無效的亂點。',
                },
              },
              {
                no: '03',
                short: { en: 'Unbalanced Sample', zh: '樣本失衡' },
                l: 2,
                s: 3,
                diff: 'hard',
                desc: { en: 'Unbalanced regional sample (too few international students)', zh: '各地區樣本失衡（國際學生過少）' },
                fix: {
                  en: 'Prioritize approaching international students during campus iPad intercepts once enough local and Mainland responses are collected.',
                  zh: '待本地與內地樣本累積足夠後，於校園 iPad 面訪時優先接觸國際學生。',
                },
              },
              {
                no: '04',
                short: { en: 'Loading Issues', zh: '載入失敗' },
                l: 3,
                s: 2,
                diff: 'easy',
                desc: { en: 'Campus Wi-Fi / iPad loading issues', zh: '校園 Wi-Fi 或 iPad 載入問題' },
                fix: {
                  en: 'Pre-load and cache high-res AI images on the iPad beforehand, keeping a personal mobile hotspot ready as backup.',
                  zh: '事先在 iPad 上預載並快取高解析度 AI 影像，同時準備個人手機熱點作為備援。',
                },
              },
              {
                no: '05',
                short: { en: 'Language Barrier', zh: '語言誤解' },
                l: 2,
                s: 3,
                diff: 'medium',
                desc: { en: 'Survey language misunderstanding', zh: '問卷語言理解落差' },
                fix: {
                  en: 'Provide side-by-side bilingual text (English and Traditional/Simplified Chinese) in the questionnaire.',
                  zh: '問卷提供英文與繁／簡中文並排的雙語文字。',
                },
              },
              {
                no: '06',
                short: { en: 'Data Loss', zh: '資料遺失' },
                l: 1,
                s: 4,
                diff: 'easy',
                desc: { en: 'Data loss or device crash', zh: '資料遺失或裝置當機' },
                fix: {
                  en: 'Use cloud survey platforms with auto-save and back up report drafts to Google Drive daily.',
                  zh: '使用具備自動儲存的雲端問卷平台，並每天將報告草稿備份到 Google Drive。',
                },
              },
            ],
          },
          { type: 'h3', text: { en: 'Gantt Chart', zh: '甘特圖' } },
          {
            type: 'p',
            text: {
              en: 'The following timeline maps out the execution phases leading up to the final submission.',
              zh: '以下時間軸列出通往最終繳交的各個執行階段。',
            },
          },
          {
            type: 'timeline',
            title: { en: 'Execution timeline', zh: '執行時間軸' },
            range: { en: '19 Oct — 18 Nov 2026', zh: '2026.10.19 — 11.18' },
            items: [
              {
                date: { en: '19–21 Oct', zh: '10/19–10/21' },
                text: { en: 'Finalize Project Management Plan & Submit Assessment 2 (21 Oct)', zh: '定稿專案管理計畫，繳交作業二（10/21）' },
              },
              {
                date: { en: '22–25 Oct', zh: '10/22–10/25' },
                text: { en: 'Prepare AI/Human fashion image stimuli & build bilingual online survey', zh: '製作 AI／真人時尚影像素材，建置雙語線上問卷' },
              },
              {
                date: { en: '26–27 Oct', zh: '10/26–10/27' },
                text: { en: 'Pre-test survey on iPad & mobile to check image loading and clarity', zh: '在 iPad 與手機上進行問卷前測，檢查圖片載入與清晰度' },
              },
              {
                date: { en: '28 Oct – 06 Nov', zh: '10/28–11/06' },
                text: { en: 'Milestone (Data Collection): Conduct campus iPad intercepts & share online links to reach 30–50 responses', zh: '里程碑（資料蒐集）：在校園進行 iPad 面訪，並分享線上連結，以取得 30–50 份回覆' },
                milestone: true,
              },
              {
                date: { en: '07–09 Nov', zh: '11/07–11/09' },
                text: { en: 'Milestone: Close survey, clean data, and remove rushed/invalid responses', zh: '里程碑：關閉問卷、清理資料，剔除草率或無效的作答' },
                milestone: true,
              },
              {
                date: { en: '10–13 Nov', zh: '11/10–11/13' },
                text: { en: 'Analyze data (compare detection rates & trust scores across regional groups) & create visual charts', zh: '分析資料（比較各地區組別的辨識率與信任分數），製作視覺化圖表' },
              },
              {
                date: { en: '14–16 Nov', zh: '11/14–11/16' },
                text: { en: 'Draft Assessment 3 Portfolio (Report findings + Personal Reflection)', zh: '撰寫作業三作品集（研究發現報告 + 個人反思）' },
              },
              {
                date: { en: '17–18 Nov', zh: '11/17–11/18' },
                text: { en: 'Final proofreading, formatting check & Submit Assessment 3 (18 Nov by 23:00)', zh: '最終校對、格式檢查，繳交作業三（11/18 23:00 前）' },
              },
            ],
          },
          { type: 'h2', text: { en: '5. Reference List', zh: '5. 參考文獻' } },
          {
            type: 'ref',
            text: {
              en: 'Bhanver, B., Bansal, E., Arya, J., Puri, N., & Pareek, R. (2023). Factors affecting purchase of fast fashion products. International Research Journal of Modernization in Engineering Technology and Science, 5(4), 4226-4232.',
              zh: 'Bhanver, B., Bansal, E., Arya, J., Puri, N., & Pareek, R. (2023). Factors affecting purchase of fast fashion products. International Research Journal of Modernization in Engineering Technology and Science, 5(4), 4226-4232.',
            },
            url: 'https://doi.org/10.56726/IRJMETS36771',
            note: {
              en: 'Supplies the purchase-intention scale the questionnaire is built on — the dependent variable this whole plan is designed to measure.',
              zh: '提供問卷所依據的購買意願量表——整份計畫要測量的，正是這個依變項。',
            },
          },
          {
            type: 'ref',
            text: {
              en: 'Harreis, H., Koullias, T., Roberts, R., & Te, K. (2023). Generative AI: Unlocking the future of fashion. McKinsey & Company.',
              zh: 'Harreis, H., Koullias, T., Roberts, R., & Te, K. (2023). Generative AI: Unlocking the future of fashion. McKinsey & Company.',
            },
            url: 'https://www.mckinsey.com/industries/retail/our-insights/generative-ai-unlocking-the-future-of-fashion',
            note: {
              en: 'Sizes the commercial stake and justifies why the stimuli must be fast-fashion ads rather than any other category.',
              zh: '量出這件事的商業規模，也說明為什麼視覺素材必須是快時尚廣告，而不是其他品類。',
            },
          },
          {
            type: 'ref',
            text: {
              en: 'Srinivas, N., Samba, V., & Rupaveni, A. (2026). The AI model premium gap: Schema incongruence, source credibility, and willingness-to-pay penalties across luxury and fast fashion advertising contexts. IOSR Journal of Business and Management, 28(7), 19-31.',
              zh: 'Srinivas, N., Samba, V., & Rupaveni, A. (2026). The AI model premium gap: Schema incongruence, source credibility, and willingness-to-pay penalties across luxury and fast fashion advertising contexts. IOSR Journal of Business and Management, 28(7), 19-31.',
            },
            url: 'https://www.iosrjournals.org/iosr-jbm/papers/Vol28-issue7/Ser-2/B2807021931.pdf',
            note: {
              en: 'Explains the disclosure variable: telling shoppers an image is AI-generated is a credibility move, and its effect differs by category.',
              zh: '解釋了「揭露」這個變項：告知消費者影像是 AI 生成，是一種可信度操作，而效果會隨品類而異。',
            },
          },
          {
            type: 'ref',
            text: {
              en: "Veiga, F., & Haslbeck, L. (2026). Decoding AI ads: How consumers perceive and make sense of AI-generated advertising [Master's thesis, Lund University]. LUP Student Papers.",
              zh: "Veiga, F., & Haslbeck, L. (2026). Decoding AI ads: How consumers perceive and make sense of AI-generated advertising [Master's thesis, Lund University]. LUP Student Papers.",
            },
            url: 'https://lup.lub.lu.se/student-papers/record/9246322/file/9246323.pdf',
            note: {
              en: 'Provides the perception and sense-making items — the questions that ask shoppers what visual cue gave the machine away.',
              zh: '提供「感知」與「理解」的題項——也就是追問消費者「是哪裡看出破綻」的那組問題。',
            },
          },
          {
            type: 'note',
            text: {
              en: 'Generative AI（Google Gemini）was utilized to assist with structuring the research outline, and refining language clarity.',
              zh: '本作業使用生成式 AI（Google Gemini）協助擬定研究大綱的結構，並潤飾語言的清晰度。',
            },
          },
        ],
      },
      {
        id: 'bcm212-t1',
        no: 'No.03',
        placeholder: true,
        title: { en: 'Test Post: A Hundred Words Is Enough', zh: '測試文章：一百字就好' },
        excerpt: {
          en: 'A short test post to check the layout, video slot and byline. Feel free to delete this record once verified.',
          zh: '一條一百字的測試文章，用來檢查文章頁排版、影片位與日期署名是否正常。看完可以隨時刪掉這條記錄。',
        },
        date: '2026-09-19',
        tags: [{ en: 'TEST', zh: '測試' }],
        image: 'assets/posts/bcm212-a1-survey.png',
        figLabel: { en: 'FIG.TEST — Template self-check', zh: 'FIG.TEST — 模版自檢' },
        body: [
          {
            type: 'p',
            text: {
              en: 'This is a short piece used to test the article template. If you can read this line, the body, divider, byline and hero image below are all working.',
              zh: '這是一篇用來測試文章模版的短文。如果你能看到這一行字，說明正文、分割線、日期署名與配圖都在正常工作。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'The best template is the one you forget about while reading.',
              zh: '最好的模版，是你讀到一半就忘了它存在的那一種。',
            },
          },
        ],
      },
    ],
  },

  bcm241: {
    code: 'BCM241',
    name: { en: 'Media Ethnography', zh: '媒體民族誌' },
    tagline: {
      en: 'Decoding Audience Preferences',
      zh: '讀懂受眾的真實喜好',
    },
    desc: {
      en: 'Building detailed target audience personas to decode user preferences and iteratively tailor products that truly resonate.',
      zh: '深入調查目標受眾的人物畫像，精準捕捉其真實偏好，並以此反向調整與重塑我們的產品。',
    },
    heroImage: 'assets/subjects/bcm241-hero.png',
    heroCaption: {
      en: 'FIG.01 — Audience Personas',
      zh: 'FIG.01 — 受眾輪廓',
    },
    assignments: [
      {
        id: 'bcm241-a1',
        no: 'No.01',
        studentId: '1723674',
        title: {
          en: 'Global E-commerce Knowledge Niche: A Field Map',
          zh: '全球電商知識領域：一張田野地圖',
        },
        excerpt: {
          en: 'Why teach something I have never done? Mapping a media niche for cross-border e-commerce — who is in it, what they need, and how I turn a novice position into an honest "co-learner" voice.',
          zh: '為什麼要教一件我從沒做過的事？為跨境電商描繪一個媒體領域——誰在其中、他們需要什麼，以及我如何把「新手」這個位置，變成一個誠實的「共同學習者」聲音。',
        },
        date: '2026-09-22',
        tags: [
          { en: 'Autoethnography', zh: '自我民族誌' },
          { en: 'E-commerce', zh: '電子商務' },
          { en: 'Audience', zh: '受眾' },
        ],
        noHero: true, // 同 bcm222-a1：文章頁撤掉開場主圖（第三十階段）
        image: 'assets/posts/bcm241-a1-figures.png',
        figLabel: { en: 'FIG.02 — The niche, mapped', zh: 'FIG.02 — 被描繪的領域' },
        body: [
          { type: 'h2', text: { en: 'The niche I chose', zh: '我選擇的領域' } },
          {
            type: 'p',
            text: {
              en: 'My media niche is the global e-commerce community in China — the people teaching and learning how to sell across borders. Two kinds of people sit inside it: knowledge creators like me, sharing plain-language guides to global selling; and sellers or complete beginners who want to learn how to start a business that reaches beyond the domestic market.',
              zh: '我的媒體領域是中國的全球電商社群——那些正在教、也正在學「如何跨境賣東西」的人。領域裡坐著兩種人：像我這樣的知識創作者，分享把全球銷售講成白話的指南；以及想學會做一門能走出內銷市場的生意、賣家或完全的新手。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'What we share falls into two buckets: marketing tips that explain how foreign platforms like TikTok and Shopify actually work, and visual styles — cross-cultural design ideas and the trends currently moving through them.',
              zh: '我們分享的內容分成兩桶：解釋 TikTok、Shopify 這類海外平台實際如何運作的營銷技巧，以及視覺風格——跨文化的設計想法，與此刻正在其中流動的流行趨勢。',
            },
          },
          { type: 'h2', text: { en: 'Why it matters', zh: '為什麼這件事重要' } },
          {
            type: 'p',
            text: {
              en: 'China has enormous manufacturing capacity, but the domestic market is close to saturated. I believe selling globally is where the next decade of opportunity sits — and the small businesses that could take that step usually lack anyone to explain it in plain words.',
              zh: '中國擁有極大的製造能力，但內銷市場已接近飽和。我相信全球銷售就是下一個十年的機會所在——而那些有能力跨出這一步的小商家，往往找不到人用白話把事情講清楚。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'Zero practical experience versus the need to teach — that is the conflict this whole project lives inside.',
              zh: '零實務經驗，對上「必須教人」的需求——這就是整個計畫所身處的衝突。',
            },
          },
          { type: 'h2', text: { en: 'How I resolve it', zh: '我如何解決這個衝突' } },
          {
            type: 'p',
            text: {
              en: 'My answer is not to pretend at expertise. I synthesise successful public cases to build credibility, and I analyse the audience to maximise engagement — but I keep my position honest as a co-learner moving through the same problems, one step ahead at best.',
              zh: '我的答案不是假裝專業。我透過綜整公開的成功案例來建立可信度，也分析受眾以放大互動——但我讓自己的位置保持誠實：一個正在穿過同樣問題的共同學習者，頂多領先一步。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The full deck below sets out the niche definition, the audience demographics, the autoethnographic method I will use to document the journey, the academic sources framing it, and the four-phase project timeline.',
              zh: '下方完整簡報依序說明：領域定義、受眾人口結構、我將用來記錄這段歷程的自我民族誌方法、支撐它的學術來源，以及四階段的專案時間表。',
            },
          },
          {
            type: 'gallery',
            title: {
              en: 'BCM241 A1 — Global E-commerce Knowledge Niche',
              zh: 'BCM241 A1 — 全球電商知識領域',
            },
            file: 'assets/pdfs/bcm241-a1.pdf',
            hint: {
              en: 'Click any slide to read it full screen',
              zh: '點擊任一頁可全螢幕閱讀',
            },
            items: [
              { src: 'assets/slides/bcm241-a1/p1.png', label: { en: 'Media Niche', zh: '媒體領域' } },
              { src: 'assets/slides/bcm241-a1/p2.png', label: { en: 'Industry Novice — Creator & Researcher', zh: '行業新手——創作者與研究者' } },
              { src: 'assets/slides/bcm241-a1/p3.png', label: { en: 'My Autoethnographic Investigation', zh: '我的自我民族誌探究' } },
              { src: 'assets/slides/bcm241-a1/p4.png', label: { en: 'Academic Sources & Framework', zh: '學術來源與框架' } },
              { src: 'assets/slides/bcm241-a1/p5.png', label: { en: 'Project Timeline', zh: '專案時間表' } },
            ],
          },
        ],
      },
      {
        id: 'bcm241-a2',
        no: 'No.02',
        studentId: '1723674',
        title: {
          en: 'Mapping the Cross-Border E-Commerce Niche',
          zh: '描繪跨境電商領域：田野現場與位置性反思',
        },
        excerpt: {
          en: 'A month of lurking across Bilibili, Xiaohongshu and storefronts — and two epiphanies: AI fixed the language but not the taste, and vocabulary is the paywall.',
          zh: '一個月在 Bilibili、小紅書與各店面前的潛水——以及兩個體悟：AI 修好了語言，卻沒修好品味；而詞彙本身，就是那道付費牆。',
        },
        date: '2026-10-29',
        tags: [
          { en: 'BCM241 A2.1', zh: 'BCM241 A2.1' },
          { en: 'Autoethnography', zh: '自我民族誌' },
          { en: 'Field Notes', zh: '田野筆記' },
        ],
        noHero: true,
        // 卡片缩略图 1:1 拼贴（·37）：科目页缩略图位是 1:1 cover，地图是横图会被裁掉两边
        image: 'assets/posts/bcm241-a2-cover.png',
        figLabel: { en: 'COVER — Two worlds, one box', zh: '封面圖 — 兩個世界，一個箱子' },
        body: [
          {
            type: 'p',
            text: {
              en: 'My media niche is China’s cross-border e-commerce community. It connects domestic sellers, complete beginners, and knowledge creators trying to sell globally. In my previous pitch, I noted that China’s manufacturing is massive, yet the domestic market is saturated. Going global is the clear way out. My field site spans two worlds. Sellers learn the ropes on domestic apps like Bilibili, Douyin, and Xiaohongshu, then apply those lessons on overseas platforms like Shopify, Amazon, and TikTok Shop. The field site map below breaks down the platforms, the players, and the two biggest friction points I found while lurking in this community.',
              zh: '我的媒體領域是中國的跨境電商社群：它連結了國內賣家、完全的新手，以及想把東西賣到全球的知識創作者。在上一份提案裡我提過，中國的製造能量龐大，但內銷市場已經飽和，出海是明確的出路。我的田野現場橫跨兩個世界——賣家先在 Bilibili、抖音、小紅書這些國內 App 上摸清門道，再把學到的東西搬到 Shopify、Amazon、TikTok Shop 這些海外平台上。下方的田野現場地圖，拆解了平台、行動者，以及我在這個社群裡潛水時發現的兩大摩擦點。',
            },
          },
          {
            type: 'figure',
            wide: true, // 信息密集的示意图：≥1100 铺满版心，否则 660 宽字号不可读（第三十七階段）
            src: 'assets/posts/bcm241-a2-figmap.png',
            alt: {
              en: 'Field site map of the cross-border e-commerce knowledge niche: platforms (Bilibili, Douyin, Xiaohongshu at home; Shopify, TikTok Shop, Amazon overseas), actors (gurus, newcomers, sellers, co-learners), and two frictions — taste and jargon.',
              zh: '跨境電商知識領域的田野現場地圖：平台（國內的 Bilibili、抖音、小紅書；海外的 Shopify、TikTok Shop、Amazon）、行動者（大師、新手、賣家、共同學習者），以及兩道摩擦——品味與術語。',
            },
            caption: {
              en: 'FIG.01 — The field site, mapped',
              zh: 'FIG.01 — 被描繪的田野現場',
            },
          },
          { type: 'h2', text: { en: 'My Background, Biases, and Online Persona', zh: '我的背景、偏見與網路人格' } },
          {
            type: 'p',
            text: {
              en: 'I entered this niche from two angles. First, I have relatives running cross-border stores. Second, I spend a lot of time following the AI space, which overlaps heavily with e-commerce right now. That background gave me a huge bias. Watching the shift from the internet era to the AI era, I assumed AI tools would easily flatten the barriers to global trade. I thought AI translation and image generation were magic bullets for domestic "involution" (cutthroat competition).',
              zh: '我從兩個角度進入這個領域。第一，我有親戚在經營跨境店鋪。第二，我花很多時間關注 AI 領域，而它現在與電商高度重疊。這個背景給了我一個巨大的偏見：看著網路時代轉向 AI 時代，我假設 AI 工具會輕鬆鏟平全球貿易的門檻。我以為 AI 翻譯與圖像生成，是解決國內「內捲」的萬靈丹。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'At the same time, I am just a university student with zero hands-on selling experience. To handle this ethically, I built my online persona as an honest "co-learner". I do not pretend to be an industry guru. Instead, I document what I learn from public case studies and share it in plain language, staying transparent about what I actually know and what I am still figuring out.',
              zh: '同時，我只是一個毫無實際銷售經驗的大學生。為了在倫理上妥善處理這件事，我把自己的網路人格設定成一個誠實的「共同學習者」。我不假裝自己是產業大師，而是把從公開案例研究裡學到的東西記錄下來，用平白的語言分享，並對我真正知道什麼、還在摸索什麼保持透明。',
            },
          },
          { type: 'h2', text: { en: 'Field Notes and Visual Data', zh: '田野筆記與視覺資料' } },
          {
            type: 'p',
            text: {
              en: 'Over the past month, I lurked across Bilibili, Xiaohongshu, and e-commerce storefronts to see how sellers and creators actually operate. Per ethical guidelines, I only sampled public media posts and store pages, leaving out all audience comments and private user info.',
              zh: '過去一個月，我在 Bilibili、小紅書與各電商店面之間潛水，看賣家與創作者實際怎麼運作。依倫理準則，我只取樣公開的媒體貼文與店面頁面，排除所有觀眾留言與私人使用者資訊。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'First, I compared product listings for a women\'s red hoodie. On Taobao, the image is packed with bright orange "Double 11" banners, countdown timers, and price-slash tags. On an overseas storefront, the exact same style of hoodie sits on a plain white background with zero text.',
              zh: '首先，我比較了一款女性紅色連帽外套的商品頁。在淘寶，圖片塞滿亮橘色的「雙十一」橫幅、倒數計時與劃線價標。在海外店面，完全相同款式的連帽外套擱在純白背景上，一個字都沒有。',
            },
          },
          {
            type: 'figure',
            srcs: [
              'assets/posts/bcm241-a2-taobao.png',
              'assets/posts/bcm241-a2-overseas.png',
            ],
            alt: {
              en: 'Left: the same red hoodie listed on Taobao, buried under orange Double 11 banners, countdown timers and slashed prices. Right: an overseas storefront listing of the same style on a plain white background with no text.',
              zh: '左：同一件紅色連帽外套的淘寶商品頁，被橘色雙十一橫幅、倒數計時與劃線價壓住。右：海外店面的同款商品頁，純白背景、沒有一行字。',
            },
            caption: {
              en: 'FIG.02 — One hoodie, two visual grammars',
              zh: 'FIG.02 — 一件外套，兩套視覺語法',
            },
          },
          {
            type: 'p',
            text: {
              en: 'Second, I tracked creator posts on Xiaohongshu. One viral post from a trademark agency used giant red text and a US certificate to warn sellers about "hijacked listings" (跟卖) and sudden store takedowns.',
              zh: '第二，我追蹤小紅書上的創作者貼文。一則由商標代理機構發布的爆紅貼文，用巨大的紅字與一張美國證書，警告賣家小心「跟賣」與店鋪突然被下架。',
            },
          },
          {
            type: 'figure',
            narrow: true, // 竖长手机截图：不放大到 660（第三十七階段）
            src: 'assets/posts/bcm241-a2-xhs.png',
            alt: {
              en: 'A Xiaohongshu post from a trademark agency: oversized red Chinese type reading "apply through us for a US trademark", layered over an official certificate.',
              zh: '一則小紅書商標代理貼文：巨大的紅字寫著「找我們申請美國商標」，疊在一張官方證書上。',
            },
            caption: {
              en: 'FIG.03 — Anxiety, packaged as a service',
              zh: 'FIG.03 — 把焦慮包裝成服務',
            },
          },
          { type: 'h2', text: { en: 'Two Key Epiphanies', zh: '兩個關鍵體悟' } },
          { type: 'h3', text: { en: '1. AI Fixed the Language, Not the Taste', zh: '1. AI 修好了語言，沒修好品味' } },
          {
            type: 'p',
            text: {
              en: 'Comparing the Taobao and overseas hoodie listings killed my blind faith in AI. I used to think language was the main wall stopping Chinese sellers from going global. Now I see that AI can translate product titles in seconds, but it cannot translate taste. Domestic sellers grow up in a hyper-promotional ecosystem. They rely on visual noise—flashing discounts, urgent timers, and crowded layouts—to drive impulse buys. When they use AI to dump these exact visuals onto Shopify or Amazon, overseas buyers read it as cheap spam. The real barrier is no longer technical or linguistic; it is breaking out of domestic "promo grammar" to match foreign visual expectations.',
              zh: '把淘寶與海外店面的連帽外套商品頁並在一起看，殺死了我對 AI 的盲目信仰。我以前以為語言是擋住中國賣家出海的那道主牆。現在我看到，AI 幾秒鐘就能翻譯商品標題，但它翻譯不了品味。國內賣家成長於一個超促銷的生態系，他們依賴視覺噪音——閃爍的折扣、急迫的倒數、擁擠的版面——來驅動衝動購買。當他們用 AI 把這些一模一樣的視覺倒到 Shopify 或 Amazon 上，海外買家讀到的是廉價的垃圾訊息。真正的障礙不再是技術或語言，而是跳脫國內的「促銷語法」，去對上外國的視覺期待。',
            },
          },
          { type: 'h3', text: { en: '2. Vocabulary is the Paywall', zh: '2. 詞彙就是那道付費牆' } },
          {
            type: 'p',
            text: {
              en: 'My second realization hit while scrolling through "guru" content on Xiaohongshu and Bilibili. I initially worried that having zero store experience made me useless as a creator. Lurking proved the opposite. The niche is flooded with agencies and course-sellers who weaponize industry jargon. They throw around buzzwords like "listing weight" or "hijacking" to trigger Fear Of Missing Out (FOMO) among beginners, pushing them to buy overpriced courses or services. Almost nobody shares basic knowledge for free because everyone is trying to monetize anxiety. My lack of commercial ties is actually my biggest asset. By translating gatekept jargon into plain words, my "co-learner" persona fills a massive trust gap in this community.',
              zh: '第二個體悟，是在小紅書與 Bilibili 上滑「大師」內容時撞上的。我一開始擔心，零店面經驗會讓我作為創作者毫無用處。潛水反而證明了相反的事。這個領域塞滿了代理商與賣課的人，他們把產業術語當武器：丟出「listing 權重」或「跟賣」這類流行詞，在新手身上觸發錯失恐懼（FOMO），把他們推向購買昂貴的課程或服務。幾乎沒有人免費分享基礎知識，因為每個人都在把焦慮變現。我沒有商業牽連，這反而成了我最大的資產。把被守門的術語翻譯成白話，我的「共同學習者」人格，正好填補了這個社群裡巨大的信任缺口。',
            },
          },
          { type: 'h2', text: { en: 'From Personal Experience to Cultural Reality', zh: '從個人經驗到文化現實' } },
          {
            type: 'p',
            text: {
              en: 'My observations point to two broader cultural patterns in digital trade and online communities.',
              zh: '我的觀察，指向數位貿易與網路社群中兩個更廣的文化模式。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'First, the clash between Taobao\'s loud promotions and overseas minimalism shows why tech alone cannot solve cross-cultural marketing. Chen (2026) tested cross-border communication strategies and proved that literal translation fails to convert foreign buyers. Real conversion requires cultural adaptation and stripping away cognitive overload. When Chinese sellers carry domestic price-war visuals overseas, they trigger cultural misunderstandings. Moving products across borders is easy; moving a seller\'s mindset across aesthetic cultures is the actual hard work.',
              zh: '第一，淘寶的高聲量促銷與海外極簡之間的衝撞，說明了為什麼單靠技術解決不了跨文化行銷。Chen（2026）測試了跨境溝通策略，證明直譯無法讓外國買家買單。真正的轉換需要文化調適，並剝除認知超載。當中國賣家把國內價格戰的視覺帶到海外，他們觸發的是文化誤解。把產品搬過邊界很容易；把賣家的心態搬過美學文化的邊界，才是真正困難的功課。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'Second, the jargon paywall I noticed reflects a wider trust crisis in virtual communities. Examining how users share knowledge on platforms like Bilibili, Zhang, Ma, and Lyu (2021) found that community loyalty depends heavily on the quality—specifically the authenticity and readability—of shared information, driven by mutual trust and reciprocity rather than commercial motives. When gurus hide simple concepts behind industry slang to sell courses, they poison interpersonal trust and raise the cost of learning. Stepping in as a transparent novice works because it restores reciprocity. Honest, plain-language sharing builds the exact kind of community satisfaction that commercial gatekeepers destroy.',
              zh: '第二，我注意到的術語付費牆，反映了虛擬社群中更廣泛的信任危機。Zhang、Ma 與 Lyu（2021）在研究 Bilibili 這類平台上的知識分享時發現，社群忠誠度高度取決於所分享資訊的品質——具體來說是真實性與可讀性——並由相互信任與互惠驅動，而非商業動機。當大師把簡單概念藏在產業黑話後面來賣課，他們毒害了人際信任，也抬高了學習成本。以一個透明的生手身分介入之所以有效，是因為它恢復了互惠。誠實、白話的分享，建立的正是商業守門人破壞掉的那種社群滿意度。',
            },
          },
          {
            type: 'ref',
            text: {
              en: 'Chen, J. (2026). Cross-Border E-commerce English Communication Strategies for Silk Products Targeting the Belt and Road Market: Language Style, Cultural Adaptation, and Platform Optimization. Textile & Leather Review, 9, 3680-3699.',
              zh: 'Chen, J.（2026）。針對一帶一路市場的絲綢產品跨境電商英語溝通策略：語言風格、文化調適與平台優化。Textile & Leather Review, 9, 3680-3699。',
            },
            url: 'https://doi.org/10.31881/TLR.2026.3680',
            note: {
              en: 'The theoretical backbone for the first epiphany: literal translation does not convert, cultural adaptation does.',
              zh: '第一個體悟的理論骨架：直譯不會帶來轉換，文化調適才會。',
            },
          },
          {
            type: 'ref',
            text: {
              en: 'Zhang, J., Ma, Y., & Lyu, B. (2021). Relationships Between User Knowledge Sharing in Virtual Community with Community Loyalty and Satisfaction. Psychology Research and Behavior Management, 14, 1509-1523.',
              zh: 'Zhang, J.、Ma, Y.、Lyu, B.（2021）。虛擬社群中使用者知識分享與社群忠誠、滿意度之間的關係。Psychology Research and Behavior Management, 14, 1509-1523。',
            },
            url: 'https://doi.org/10.2147/PRBM.S331132',
            note: {
              en: 'Explains why the jargon paywall damages trust, and why plain-language sharing rebuilds it.',
              zh: '解釋了術語付費牆為何損害信任，以及白話分享為何能把它重建起來。',
            },
          },
        ],
      },
    ],
  },

  bcm206: {
    code: 'BCM206',
    name: { en: 'Future Networks', zh: '未來網絡' },
    tagline: { en: 'Visualizing Networks via Digital Artifacts', zh: '用數位藝術呈現網絡' },
    desc: {
      en: 'Utilizing digital artifacts to present the connection between personal fields of interest and the internet, with a strong focus on the visual execution and continuous refinement of the artwork.',
      zh: '使用數位藝術（Digital Artifact）來呈現個人感興趣領域與互聯網的連結，並專注於數位作品的視覺呈現與持續改善。',
    },
    heroImage: 'assets/subjects/bcm206-hero.png',
    heroCaption: { en: 'FIG.01 — Digital Connections', zh: 'FIG.01 — 數位連結' },
    assignments: [
      {
        id: 'bcm206-a1',
        no: 'No.01',
        studentId: '1723674',
        title: {
          en: 'The E-commerce Co-Learning Network: Demystifying Cross-Border Commerce Through Video Sharing',
          zh: '電商共學網絡：用影片分享拆解跨境電商',
        },
        excerpt: {
          en: 'A solo Digital Artefact across Bilibili, Douyin and Xiaohongshu — turning scattered, paywalled knowledge about going global into free 3-to-5-minute breakdowns, and learning in public while doing it.',
          zh: '一個橫跨 B 站、抖音與小紅書的個人數位作品——把散落、被付費牆鎖住的出海知識，拆成免費的 3 至 5 分鐘影片，並在過程中公開地學習。',
        },
        date: '2026-08-27',
        tags: [
          { en: 'BCM206 A1', zh: 'BCM206 A1' },
          { en: 'Contextual Statement', zh: '情境陳述' },
          { en: 'Video Pitch', zh: '影片提案' },
          { en: 'Digital Artefact', zh: '數位作品' },
        ],
        image: 'assets/posts/bcm206-a1-cover.png',
        figLabel: { en: 'FIG.02 — The co-learning network', zh: 'FIG.02 — 共學網絡' },
        body: [
          { type: 'h2', text: { en: '1. Project Concept', zh: '1. 專案概念' } },
          {
            type: 'p',
            text: {
              en: 'The E-commerce Co-Learning Network is a personal Digital Artefact (DA) where I run individual creator accounts across major Chinese video platforms, including Bilibili, Douyin, and Xiaohongshu. The project specifically focuses on China’s cross-border e-commerce (chu hai), analyzing how domestic brands and sellers expand into international markets, which is why Mainland Chinese media platforms serve as my primary distribution channels. Through accessible 3 to 5-minute educational videos, I research and break down real-world success stories, starting with fast-growing Chinese apparel brands like Cider and Halara that sell overseas through TikTok Shop and Amazon. As a solo creator, I summarize publicly available information online into practical, bite-sized videos to help other beginners learn alongside me.',
              zh: '「電商共學網絡」是一個個人的數位作品（Digital Artefact, DA）：我在 Bilibili、抖音和小紅書等中國主要影音平台上經營個人創作者帳號。專案特別聚焦於中國的跨境電商（出海），分析國內品牌與賣家如何拓展國際市場——這也是為什麼中國大陸的媒體平台是我的主要發布渠道。透過易於理解的 3 至 5 分鐘教學影片，我研究並拆解真實的成功案例，從 Cider、Halara 這些透過 TikTok Shop 與 Amazon 賣向海外、快速成長的中國服飾品牌開始。作為一個單人創作者，我把網路上公開可得的資訊整理成實用、好吸收的短片，幫助其他新手與我一起學習。',
            },
          },
          { type: 'h2', text: { en: '2. Social Utility', zh: '2. 社會效益' } },
          {
            type: 'p',
            text: {
              en: 'The main purpose of this project is to bridge the huge information gap in cross-border e-commerce. The target audience is young people aged 18 to 35—especially university students and beginners who want to explore selling products to overseas markets. Most newcomers find it hard to understand overseas consumer tastes, platform algorithms, and visual branding because the information online is scattered, confusing, or hidden behind expensive paywalls. By researching and organizing real business cases into clear, free video breakdowns, I want to lower this learning curve and make global commerce knowledge accessible and easy to understand for everyone. This bite-sized, video-driven format directly matches the media habits of my target audience—Gen Z and student beginners who favor quick visual breakdowns over dense commercial textbooks.',
              zh: '這個專案的主要目的，是補上跨境電商中巨大的資訊落差。目標受眾是 18 至 35 歲的年輕人——尤其是想探索把產品賣向海外市場的大學生與新手。大多數新手難以理解海外消費者的品味、平台演算法與視覺品牌，因為網路上的資訊零散、混亂，或被藏在昂貴的付費牆之後。透過研究並整理真實的商業案例，做成清楚、免費的影片拆解，我想降低這條學習曲線，讓全球商業知識對每個人都可取得、容易理解。這種輕巧、以影片驅動的形式，正好契合我目標受眾的媒體習慣——偏好快速、視覺化的拆解，而非厚重的商業教科書的 Z 世代與學生新手。',
            },
          },
          { type: 'h2', text: { en: '3. Methodology', zh: '3. 研究方法' } },
          { type: 'h3', text: { en: 'Performance Tracking', zh: '成效追蹤' } },
          {
            type: 'p',
            text: {
              en: 'Before uploading each 3 to 5-minute video, I write down my personal expectations for views, likes, and retention rates. After publishing across platforms, I compare the actual numbers with my guesses to see what worked, what fell flat, and how to improve the pacing of the next video.',
              zh: '在每支 3 至 5 分鐘的影片上傳前，我會先寫下自己對觀看數、按讚數與留存率的預期。跨平台發布之後，我把實際數字與自己的猜測相比，看看什麼奏效、什麼反應平淡，以及下一支影片的節奏該如何改進。',
            },
          },
          { type: 'h3', text: { en: 'Audience Feedback and Community', zh: '受眾回饋與社群' } },
          {
            type: 'p',
            text: {
              en: 'I check viewer comments to see what topics people want me to analyze next. Once my channels build regular viewers, I will personally set up a viewer discussion group where followers can share ideas and talk directly with me.',
              zh: '我會查看觀眾留言，了解大家希望我接下來分析哪些主題。等到頻道累積出固定觀眾，我會親自成立一個觀眾討論群，讓追蹤者可以分享想法、直接與我對話。',
            },
          },
          { type: 'h3', text: { en: 'Public Error-Correction as a Learning Asset', zh: '公開勘誤作為學習資產' } },
          {
            type: 'p',
            text: {
              en: 'Because I am a beginner creator without hands-on store ownership, I rely on secondary research from public internet sources. In this process, I cannot completely avoid making mistakes or sharing outdated information. Instead of hiding my errors, I make public error-correction an essential part of my project. Whenever I discover a mistake through my own learning or viewer comments, I will correct it openly using pinned comments or dedicated follow-up videos. Making mistakes and fixing them is a natural part of my learning journey, and sharing these corrections offers real, honest lessons for my audience.',
              zh: '因為我是一個沒有實際開店經驗的新手創作者，我依賴來自公開網路來源的次級研究。在這個過程中，我無法完全避免犯錯，或分享了過時的資訊。與其隱藏錯誤，我把「公開勘誤」變成專案中不可或缺的一部分。只要我在自己的學習過程或觀眾留言中發現錯誤，我就會用置頂留言或專門的後續影片公開更正。犯錯並修正，是我學習歷程中自然的一部分，而把這些更正分享出來，也為我的觀眾提供了真實、誠實的一課。',
            },
          },
                    {
            type: 'diagram',
            caption: {
              en: 'FIG.03 — The co-learning loop: five stages on repeat',
              zh: 'FIG.03 — 共學循環：五個階段，週而復始',
            },
            items: [
              {
                label: { en: 'Prototype / Plan each video', zh: '原型製作 / 規劃每一支影片' },
              },
              {
                label: { en: 'Publish / Bilibili · Douyin · Xiaohongshu', zh: '發布 / B 站 · 抖音 · 小紅書' },
              },
              {
                label: { en: 'Track / Views, likes, retention', zh: '追蹤 / 觀看、按讚、留存率' },
              },
              {
                label: { en: 'Listen / Comments & community group', zh: '傾聽 / 留言與社群群組' },
              },
              {
                label: { en: 'Correct / Public error-correction', zh: '修正 / 公開勘誤' },
              },
            ],
          },
          { type: 'h2', text: { en: '4. Reference', zh: '4. 參考文獻' } },
          {
            type: 'h3',
            text: { en: 'E-Commerce & Audience Context', zh: '電商與受眾脈絡' },
          },
          {
            type: 'ref',
            text: {
              en: 'Wang, Y., & Lee, S. H. (2017). The effect of cross-border e-commerce on China’s international trade: An empirical study based on transaction cost analysis. Sustainability, 9(11), 2028.',
              zh: 'Wang, Y., & Lee, S. H. (2017). The effect of cross-border e-commerce on China’s international trade: An empirical study based on transaction cost analysis. Sustainability, 9(11), 2028.',
            },
            url: 'https://www.mdpi.com/2071-1050/9/11/2028',
            note: {
              en: 'Proves the cross-border information gap and validates the practical need for my knowledge-sharing videos.',
              zh: '證實了跨境資訊落差的存在，也印證了我的知識分享影片在實務上的必要性。',
            },
          },
          {
            type: 'h3',
            text: { en: 'Content Curation & Digital Literacy', zh: '內容策展與數位素養' },
          },
          {
            type: 'ref',
            text: {
              en: 'Mihailidis, P., & Cohen, J. N. (2013). Exploring curation as a core competency in digital and media literacy education. Journal of Interactive Media in Education, 2013(1), Article 2.',
              zh: 'Mihailidis, P., & Cohen, J. N. (2013). Exploring curation as a core competency in digital and media literacy education. Journal of Interactive Media in Education, 2013(1), Article 2.',
            },
            url: 'https://digitalcommons.molloy.edu/dhnm_fac/4/?',
            note: {
              en: 'Validates content curation as a legitimate research method to turn scattered online data into structured video lessons.',
              zh: '驗證了內容策展作為一種正當研究方法的地位——把散落於線上的資料，轉化為結構化的影片課程。',
            },
          },
          {
            type: 'h3',
            text: { en: 'Platform Logic & Social Media', zh: '平台邏輯與社群媒體' },
          },
          {
            type: 'ref',
            text: {
              en: 'Xu, L., Cheng, Z., Ma, J., & Jiang, B. (2026). Alcohol-related health information on Chinese short-video platforms: a cross-sectional content analysis of Douyin and Bilibili. Scientific Reports, 16(1), Article 56544.',
              zh: 'Xu, L., Cheng, Z., Ma, J., & Jiang, B. (2026). Alcohol-related health information on Chinese short-video platforms: a cross-sectional content analysis of Douyin and Bilibili. Scientific Reports, 16(1), Article 56544.',
            },
            url: 'https://doi.org/10.1038/s41598-026-56544-z',
            note: {
              en: 'Reveals the algorithmic differences between Douyin and Bilibili, showing that high views do not equate to content quality.',
              zh: '揭示了抖音與 Bilibili 之間的演算法差異，說明高觀看數並不等於內容品質。',
            },
          },
          {
            type: 'note',
            text: {
              en: 'Generative AI（Google Gemini）was utilized to assist with structuring the research outline, and refining language clarity.',
              zh: '本作業使用生成式 AI（Google Gemini）協助擬定研究大綱的結構，並潤飾語言的清晰度。',
            },
          },
          {
            type: 'embed',
            provider: 'youtube',
            id: 'hKcgyvl9nxw',
            title: {
              en: 'Watch the contextual statement & video pitch',
              zh: '觀看情境陳述與影片提案',
            },
            caption: {
              en: 'FIG.04 — The pitch: why cross-border e-commerce, and how this co-learning network runs',
              zh: 'FIG.04 — 影片提案：為什麼做跨境電商，以及這個共學網絡如何運作',
            },
          },
        ],
      },
      {
        id: 'bcm206-a2',
        no: 'No.02',
        placeholder: true,
        title: { en: 'Network Topologies of Daily Life', zh: '日常生活的網路拓撲' },
        excerpt: {
          en: 'Your morning is a star topology, your group chat a mesh. Drawing the hidden network diagrams inside one ordinary day.',
          zh: '你的早晨是星狀拓撲，你的群組聊天是網狀。把一個平凡日子裡隱藏的網路圖畫出來。',
        },
        date: '2026-09-15',
        tags: [
          { en: 'Diagram', zh: '圖解' },
          { en: 'Analysis', zh: '分析' },
        ],
        image: 'assets/posts/bcm206-a2-nodes.png',
        figLabel: { en: 'FIG.03 — Nodes & threads', zh: 'FIG.03 — 節點與線' },
        body: [
          {
            type: 'p',
            text: {
              en: 'Network engineers have a precise vocabulary for shapes — star, ring, mesh, bus. I borrowed it for something less precise: one ordinary Tuesday, drawn as topology diagrams.',
              zh: '網路工程師對各種形狀有一套精確的詞彙——星狀、環狀、網狀、匯流排。我把它借來用在沒那麼精確的事情上：一個平凡的星期二，畫成拓撲圖。',
            },
          },
          { type: 'h2', text: { en: 'The day as a diagram', zh: '把一天畫成一張圖' } },
          {
            type: 'p',
            text: {
              en: 'My morning is a star: the phone at the centre, every app a spoke, all messages flowing through one hub. My family group chat is a partial mesh — everyone technically connected to everyone, but three nodes doing 80% of the talking. The university’s learning management system is a bus topology with the policy of a one-way street.',
              zh: '我的早晨是星狀：手機在中央，每個 App 是一根輻條，所有訊息都流經同一個集線器。我的家庭群組是部分網狀——技術上每個人都連著每個人，但三個節點講了 80% 的話。學校的學習管理系統是匯流排拓撲，配上一條單行道的政策。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'Draw your day as a network diagram and the power structure becomes embarrassingly visible.',
              zh: '把你的一天畫成網路圖，權力結構就會明顯到令人尷尬。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The exercise’s real finding: the nodes that feel most “social” are usually the most centralised. The diagram does not lie, even when the marketing does. Full diagram set attached.',
              zh: '這個練習真正的發現是：感覺最「社交」的節點，通常是最中心化的那些。圖不會說謊，即使行銷文案會。完整圖集見附件。',
            },
          },
        ],
      },
    ],
  },

  bcm222: {
    code: 'BCM222',
    name: { en: 'Media Justice', zh: '媒體與社會正義' },
    tagline: { en: 'Critiquing Media and Power', zh: '用批判眼光看透媒體' },
    desc: {
      en: 'Critically examining the power dynamics of global media and its profound impact on social justice.',
      zh: '批判性地審視全球媒體的權力結構，反思其對社會正義與平等的深遠影響。',
    },
    heroImage: 'assets/subjects/bcm222-hero.png',
    heroCaption: { en: 'FIG.01 — Power & Voices', zh: 'FIG.01 — 權力與發聲' },
    assignments: [
      {
        id: 'bcm222-a1',
        no: 'No.01',
        studentId: '1723674',
        title: {
          en: "The Digital Illusion: How Global Streaming Platforms Keep Neo-Orientalism Alive",
          zh: "數位幻象：全球串流平台如何讓新東方主義繼續存活",
        },
        excerpt: {
          en: "Netflix looks global — but who actually gets to tell the story? A critical response on how streaming platforms upgraded Orientalism into an algorithm, and who pays for it.",
          zh: "Netflix 看起來很國際，但誰才有權說故事？一篇批判回應，拆解串流平台如何把東方主義升級成演算法，以及代價由誰承擔。",
        },
        date: '2026-09-30',
        tags: [
          {
            en: "BCM222 A1",
            zh: "BCM222 A1",
          },
          {
            en: "Critical Response",
            zh: "批判回應",
          },
          {
            en: "Film Analysis",
            zh: "影片分析",
          },
        ],
        /* noHero（第三十階段）：文章頁不渲染開場主圖（用戶要求 241/222 撤掉）。
           卡片縮略圖仍用 image 字段，兩者解耦 —— 別刪 image。 */
        noHero: true,
        image: 'assets/posts/bcm222-a1-cover.png',
        figLabel: { en: 'FIG.02 — The streaming machine', zh: 'FIG.02 — 串流機器' },
        body: [
          {
            type: 'quote',
            text: {
              en: "（How have Western global streaming platforms perpetuated Orientalist stereotypes when representing non-Western cultures to general audiences over the past five years?）",
              zh: "（過去五年，西方全球串流平台在向一般觀眾再現非西方文化時，如何延續了東方主義的刻板印象？）",
            },
          },
          {
            type: 'h2',
            text: {
              en: "Introduction",
              zh: "導論",
            },
          },
          {
            type: 'p',
            text: {
              en: "Big Western streaming platforms often talk about \"diversity\" and \"going global\" to look like they treat all cultures equally. If you scroll through their apps, you will see many international shows, which makes them look very inclusive. But having more foreign shows does not mean giving other cultures real power to tell their own stories.",
              zh: "西方大型串流平台經常把「多元」與「走向全球」掛在嘴邊，好讓自己看起來平等對待所有文化。滑一遍它們的 App，你會看到大量國際節目，顯得非常包容。但外國節目變多，並不代表把「說自己故事」的實權交給了其他文化。",
            },
          },
          {
            type: 'p',
            text: {
              en: "To fully understand this problem, we need to look at what \"Orientalism\" means. Orientalism is a way of thinking that separates the \"West\" from the \"East.\" Historically, the West used this idea to control the East and take away its freedom to think and act for itself (Al Hasan, 2025). Westerners built a cultural myth that the East was backward and inferior, which helped them feel superior. Over the past five years, streaming platforms have not ended this problem. Instead, they upgraded it for the digital age, creating \"Neo-Orientalism.\" They use algorithms and Hollywood-style storytelling to change non-Western cultures into safe, exotic entertainment for Western viewers. This keeps the West in charge as the main judge of what is civilized, while still denying the East its own voice (Al Hasan, 2025).",
              zh: "要徹底理解這個問題，得先看「東方主義」是什麼。東方主義是一套把「西方」與「東方」切分開的思維方式。歷史上，西方靠這套觀念控制東方、剝奪它為自己思考和行動的自由（Al Hasan, 2025）。西方人建構出一套文化神話：東方落後而低劣——這讓他們感覺自己優越。過去五年，串流平台並沒有終結這個問題，而是把它升級成數位版本，造出「新東方主義」。它們用演算法與好萊塢式的敘事，把非西方文化改造成對西方觀眾而言安全、帶異國情調的娛樂。西方因此繼續充當「什麼才算文明」的裁判，同時依舊不讓東方擁有自己的聲音（Al Hasan, 2025）。",
            },
          },
          {
            type: 'figure',
            srcs: [
              'assets/posts/bcm222-a1-chart-leads.png',
              'assets/posts/bcm222-a1-chart-directors.png',
            ],
            alt: {
              en: "Two charts from the USC Annenberg Inclusion Initiative: the share of underrepresented leads and co-leads in Netflix content, and the race/ethnicity and gender of Netflix series directors, 2018–23.",
              zh: "兩張 USC Annenberg 包容性倡議的圖表：Netflix 內容中代表性不足族群擔任主角／共同主角的比例，以及 2018–23 年 Netflix 影集導演的族裔與性別構成。",
            },
            caption: {
              en: "This data contrast exposes the diversity illusion on streaming platforms. While underrepresented groups made up 42% of speaking characters in 2023 Netflix content, the actual storytelling power remained overwhelmingly white. In 2023 Netflix films, 80.9% of writers and 83.3% of producers were white. More non-Western faces on screen is a corporate façade; the structural power to define and present non-Western cultures stays firmly in Western hands. (Smith et al., 2025)",
              zh: "這組數據對照揭穿了串流平台的多元假象。2023 年 Netflix 內容中，代表性不足的族群雖佔 42% 的台詞角色，真正的敘事權卻仍壓倒性地掌握在白人手上。2023 年的 Netflix 電影中，80.9% 的編劇與 83.3% 的製片是白人。螢幕上更多非西方臉孔只是企業門面；定義與再現非西方文化的結構性權力，仍牢牢握在西方手裡。（Smith et al., 2025）",
            },
            captionStyle: 'note',
          },
          {
            type: 'h2',
            text: {
              en: "The Myth of \"Diversity\" and Cultural Extraction",
              zh: "「多元」的神話與文化掠奪",
            },
          },
          {
            type: 'p',
            text: {
              en: "People who support these platforms say they break down old movie theater barriers. They believe streaming gives non-Western creators big budgets and global audiences. However, this is more about making money than helping cultures. Since fewer new people are subscribing in North America and Europe, streaming companies are just taking \"cultural resources\" from emerging markets to keep making a profit.",
              zh: "支持這些平台的人說，它們打破了舊電影院的門檻。他們相信串流給了非西方創作者大筆預算與全球觀眾。然而，這更關乎賺錢，而不是幫助文化。由於北美與歐洲的新訂戶成長趨緩，串流公司只是從新興市場拿取「文化資源」來維持獲利。",
            },
          },
          {
            type: 'p',
            text: {
              en: "But there is a hidden rule: non-Western shows only get money and promotion if Western audiences can easily understand them. This acts like a secret filter. Instead of truly accepting other cultures, platforms force these stories to change and fit into a Western point of view. The uniqueness of local cultures gets erased just to make the shows easier to sell globally.",
              zh: "但有一條隱藏的規則：非西方節目只有在西方觀眾能輕鬆看懂時，才拿得到資金與宣傳。這像一道秘密篩網。平台並非真正接納其他文化，而是逼這些故事改變、塞進西方的視角。地方文化的獨特性，就為了讓節目更好賣而被抹去。",
            },
          },
          {
            type: 'h2',
            text: {
              en: "How It Works: A Look at The Swimmers",
              zh: "運作機制：以《The Swimmers》為例",
            },
          },
          {
            type: 'p',
            text: {
              en: "We can see this problem clearly in how movies look and how platform algorithms work. The 2022 Netflix movie The Swimmers is a great example of this.",
              zh: "這個問題在電影的視覺語言與平台演算法的運作方式上看得最清楚。2022 年的 Netflix 電影《The Swimmers》就是很好的例子。",
            },
          },
          {
            type: 'p',
            text: {
              en: "First, the movie makes non-Western places look bad visually. In The Swimmers, countries like Turkey and Syria are shown with cold, dark green colors to make them look scary, dangerous, and backward. In contrast, European places like Greece and Germany are shown with warm, bright colors to make the West look like a sunny, safe paradise. The filmmakers even filmed in beautiful parts of Turkey but pretended it was Greece in the movie. This tricks the audience into feeling that the East is dark and backward while Europe is a perfect savior",
              zh: "第一，這部片在視覺上把非西方地區拍得很糟。在《The Swimmers》裡，土耳其、敘利亞等國家被以冷調的暗綠色呈現，看起來可怕、危險、落後。相對地，希臘、德國等歐洲地點則用溫暖明亮的色調，讓西方看起來像陽光普照、安全的樂園。製片甚至到土耳其風景優美的地方取景，卻在片中假裝那是希臘。這讓觀眾誤以為東方陰暗落後，而歐洲是完美的救世主。",
            },
          },
          {
            type: 'p',
            text: {
              en: "Second, platforms make complex politics look too simple. Algorithms and tags reduce complicated real-world issues into basic, negative ideas like \"strict control\" or \"lack of progress\" (Araujo & de Albuquerque, 2024). The movie's story itself also makes things too black-and-white. In The Swimmers, only Western or Christian characters are shown as modern, moral, and helpful. On the other hand, Muslim characters are only shown as either violent attackers or completely helpless victims who need saving (Çelik, 2024).",
              zh: "第二，平台把複雜的政治變得過於簡單。演算法與標籤把現實世界的複雜議題簡化成「嚴格管控」「缺乏進步」這類基本而負面的概念（Araujo & de Albuquerque, 2024）。電影本身的敘事也把一切說得太黑白分明。在《The Swimmers》裡，只有西方或基督徒角色被刻畫成現代、有道德、樂於助人；穆斯林角色則不是暴力的施暴者，就是完全無助、等著被拯救的受害者（Çelik, 2024）。",
            },
          },
          {
            type: 'embed',
            provider: 'youtube',
            id: "OY4IMBdwH3A",
            title: {
              en: "The Swimmers (Netflix, 2022) — official trailer",
              zh: "《The Swimmers》（Netflix, 2022）— 官方預告",
            },
            caption: {
              en: "In The Swimmers (Netflix, 2022) trailer, the perilous refugee journey is visually coded with cold, dark tones, while European destinations are bathed in warm, heroic light. This contrast reinforces the Neo-Orientalist narrative of the East as a place of despair and the West as the ultimate sanctuary.",
              zh: "在《The Swimmers》（Netflix, 2022）預告中，險惡的難民旅程以冷調、暗色調編碼，而歐洲的目的地則沐浴在溫暖、英雄式的光線裡。這組對比強化了新東方主義的敘事：東方是絕望之地，西方則是最終的庇護所。",
            },
            captionStyle: 'note',
          },
          {
            type: 'h2',
            text: {
              en: "The Real-World Harm",
              zh: "現實中的傷害",
            },
          },
          {
            type: 'p',
            text: {
              en: "This updated form of Orientalism causes real harm to both audiences and creators. For the audience, the algorithms create an \"echo chamber\" of stereotypes. For example, if you search for \"China\" on Netflix, the algorithm often mixes up content from China with content from South Korea or Japan, treating all East Asian cultures as if they are exactly the same (Araujo & de Albuquerque, 2024). It also pushes documentaries that frame the East as a threat. By grouping different Asian cultures together, the recommendation system spreads false ideas and confirms old prejudices instead of breaking them.",
              zh: "這種升級版的東方主義對觀眾與創作者都造成真實傷害。對觀眾而言，演算法製造出充滿刻板印象的「回音室」。例如在 Netflix 搜尋「China」，演算法經常把中國的內容和南韓、日本的內容混在一起，把所有東亞文化當成完全一樣（Araujo & de Albuquerque, 2024）。它也會推送把東方框架成威脅的紀錄片。把不同的亞洲文化歸為一類，讓推薦系統散播錯誤觀念、強化舊偏見，而不是打破它們。",
            },
          },
          {
            type: 'p',
            text: {
              en: "For non-Western creators, this system forces them into a trap of \"self-Orientalization.\" To get Western money and global attention, local filmmakers feel forced to change their true stories to match what the West expects to see—usually exotic suffering. For example, in The Swimmers, the filmmakers added a fake scene about an attempted rape in Hungary just to add the kind of dark drama Western viewers expect from a refugee story (Çelik, 2024). Because of this pressure to please Western bosses, real and complex local stories are pushed aside.",
              zh: "對非西方創作者而言，這套系統把他們逼進「自我東方化」的陷阱。為了拿到西方的資金與全球關注，在地導演覺得必須改掉自己真實的故事，去迎合西方期待看到的東西——通常是異國情調的苦難。例如《The Swimmers》的製片就加入了一場匈牙利強暴未遂的假戲，只為了添上西方觀眾對難民故事所期待的那種陰暗戲劇性（Çelik, 2024）。在這種討好西方老闆的壓力下，真實而複雜的在地故事被推到一旁。",
            },
          },
          {
            type: 'p',
            text: {
              en: "Having many foreign shows on a streaming app does not mean there is cultural justice. Just showing more non-Western faces on a screen is not enough to fix a deeply unfair system. To truly decolonize global media, we must break the monopoly that Western platforms have over algorithms and what gets funded (Araujo & de Albuquerque, 2024). The real goal is not just to be visible on a Western platform, but to give local cultures the power to tell their own stories on their own terms.",
              zh: "一個串流 App 上有大量外國節目，並不代表文化正義已經實現。只是在螢幕上多放幾張非西方的臉孔，並不足以修正一個極度不公平的系統。要真正去殖民化全球媒體，就必須打破西方平台對演算法與資金流向的壟斷（Araujo & de Albuquerque, 2024）。真正的目標不只是在西方平台上被看見，而是讓在地文化有權用自己的方式說自己的故事。",
            },
          },
          {
            type: 'h2',
            text: {
              en: "References",
              zh: "參考文獻",
            },
          },
          {
            type: 'ref',
            text: {
              en: "Al Hasan, H. K. K. (2025). The East - West phobia: Deconstructing Edward Said's Orientalism. TPM, 32(S4), 1643-1648.",
              zh: "Al Hasan, H. K. K. (2025). The East - West phobia: Deconstructing Edward Said's Orientalism. TPM, 32(S4), 1643-1648.",
            },
            url: "https://tpmap.org/submission/index.php/tpm/article/view/1035",
            note: {
              en: "Defines the Orientalism this piece argues has been rebuilt in digital form — and supplies the historical frame for the “the West judges, the East obeys” structure.",
              zh: "界定本文主張已被數位化重建的東方主義，並提供「西方審判、東方聽命」這套結構的歷史框架。",
            },
          },
          {
            type: 'ref',
            text: {
              en: "Çelik, K. (2024). Cinematic orientalism: East-West perception in Netflix's 'Swimmers'. Medya ve Kültür, 4(1), 43-63.",
              zh: "Çelik, K. (2024). Cinematic orientalism: East-West perception in Netflix's 'Swimmers'. Medya ve Kültür, 4(1), 43-63.",
            },
            url: "https://doi.org/10.60077/medkul.1482205",
            note: {
              en: "The close reading of The Swimmers itself: the invented rape scene and the Muslim-as-villain-or-victim binary both come from this source.",
              zh: "對《The Swimmers》的細讀本身就是依據：片中虛構的強暴戲，以及「穆斯林不是惡徒就是受害者」的二元對立，皆出自此文。",
            },
          },
          {
            type: 'ref',
            text: {
              en: "Araujo, M., & de Albuquerque, A. (2024). Algorithmic orientalism? Netflix's representation of China in Brazil. Global Media and China, 9(4), 508-520.",
              zh: "Araujo, M., & de Albuquerque, A. (2024). Algorithmic orientalism? Netflix's representation of China in Brazil. Global Media and China, 9(4), 508-520.",
            },
            url: "https://doi.org/10.1177/20594364241254626",
            note: {
              en: "Documents what the algorithm does, not only what the film does — the China/Brazil mixing and the “threat” documentaries come from here.",
              zh: "記錄的是演算法做了什麼，而不只是電影做了什麼——把中國與巴西的內容混為一談、「威脅」類紀錄片的證據都出自此文。",
            },
          },
          {
            type: 'ref',
            text: {
              en: "Smith, S. L., Pieper, K., Neff, K., & Wheeler, S. (2025, May). Inclusion in Netflix original U.S. scripted films & series: Executive summary. USC Annenberg Inclusion Initiative.",
              zh: "Smith, S. L., Pieper, K., Neff, K., & Wheeler, S. (2025, May). Inclusion in Netflix original U.S. scripted films & series: Executive summary. USC Annenberg Inclusion Initiative.",
            },
            url: "https://assets.uscannenberg.org/docs/aii-2025-netflix-executive-summary.pdf",
            note: {
              en: "Provides the numbers behind the two charts: on-screen inclusion rising while writers and producers stay overwhelmingly white.",
              zh: "兩張圖表背後的數據來源：螢幕上的多元比例在上升，編劇與製片卻仍壓倒性地是白人。",
            },
          },
        ],
      },
      {
        id: 'bcm222-a2',
        no: 'No.02',
        studentId: '1723674',
        title: {
          en: 'Orientalism in Plain Sight: BCM222 A2 Pitch',
          zh: '藏在光天化日下的東方主義：BCM222 A2 提案',
        },
        excerpt: {
          en: 'Streaming platforms no longer sell stereotypes outright — they style them. A visual pitch for a video essay that hands viewers the tools to see through the screen.',
          zh: '串流平台不再直接販賣刻板印象，而是把它做成風格。一份影像論文的視覺提案：把看穿螢幕的工具交到觀眾手上。',
        },
        date: '2026-10-28',
        tags: [
          { en: 'BCM222 A2', zh: 'BCM222 A2' },
          { en: 'Visual Pitch', zh: '視覺提案' },
          { en: 'Video Essay', zh: '影像論文' },
        ],
        /* 同 bcm222-a1：文章頁不渲染開場主圖（第三十階段）。
           image 仍供科目頁卡片縮圖，兩者解耦 —— 別刪。 */
        noHero: true,
        image: 'assets/posts/bcm222-a2-cover.png',
        body: [
          {
            type: 'quote',
            text: {
              en: 'Your pitch is an audio-visual recording where you explain what problem or issue you are focusing on for the final project, your approach, two sources you have found and you give us some images reflecting the kind of images you might use.',
              zh: '你的提案是一段影音錄製：說明你為期末專案聚焦的問題或議題、你的切入方式、你找到的兩份文獻，並提供一些能反映你可能會使用什麼樣影像的畫面。（作業說明 A#2）',
            },
          },
          {
            type: 'h2',
            text: { en: 'The Problem', zh: '問題' },
          },
          {
            type: 'p',
            text: {
              en: 'This final project looks at how global streaming platforms, like Netflix, keep Orientalism alive. Today, Orientalism does not look like old-fashioned racism; it has become a visual style. Streaming platforms hide old Western stereotypes behind big budgets, neon lights, and mysterious Asian streets. Because the shows look so good, global audiences accept a fake, twisted image of Asia without realizing it. Orientalism is now hiding in plain sight.',
              zh: '這份期末專案檢視像 Netflix 這樣的全球串流平台，如何讓東方主義繼續存活。今天的東方主義不再長得像老派的種族歧視，它已經變成一種視覺風格。串流平台用大筆預算、霓虹燈光、神祕的亞洲街景，把老一套的西方刻板印象藏在後面。因為影集看起來太漂亮，全球觀眾就在不知不覺中接受了對亞洲那個虛假、扭曲的形象。東方主義如今就藏在光天化日之下。',
            },
          },
          {
            type: 'h2',
            text: { en: 'The Solution & Core Ideas', zh: '解方與核心概念' },
          },
          {
            type: 'p',
            text: {
              en: 'This project moves past the problem to build a solution: teaching everyday viewers how to question what they watch. Recent media studies show that Orientalism survives today because it adapts and blends directly into modern pop culture (Gencel, 2023). Furthermore, research proves a simple truth: media does not reflect reality; media builds reality (Tharun & John, 2025). When streaming platforms keep showing Asia in the same strange way, they shape how the public sees the real world. Therefore, the best way to break this illusion is critical media literacy, giving audiences the tools to see through the screen.',
              zh: '這份專案要跨過問題本身，去建構一個解方：教會日常觀眾如何質疑自己正在看的東西。近期的媒體研究顯示，東方主義今天之所以還能存活，是因為它會自我調適、直接融進流行文化（Gencel, 2023）。此外，研究也證實了一個簡單的道理：媒體並不反映現實，媒體建構現實（Tharun & John, 2025）。當串流平台不斷用同一種奇異的方式呈現亞洲，它們就在塑造公眾對真實世界的看法。因此，打破這層幻象最好的方法就是批判性媒體識讀——把看穿螢幕的工具交到觀眾手上。',
            },
          },
          {
            type: 'h2',
            text: { en: 'The Execution & Impact', zh: '執行方式與影響' },
          },
          {
            type: 'p',
            text: {
              en: 'To achieve this, the project consists of an educational video essay for the general public. Currently, academic research stays locked in journals that normal audiences do not read because they are too long and complex. This project bridges that gap by turning academic ideas into a clear, visual breakdown of streaming tricks. Ultimately, this video gives the audience a new lens. Viewers will shift from passive fans into active thinkers, knowing exactly how to spot Orientalism on their screens and see through the digital illusion.',
              zh: '為了做到這件事，這份專案的形式是一支面向一般大眾的教學型影像論文。目前學術研究被鎖在期刊裡，一般觀眾不會去讀，因為它們又長又複雜。這份專案要搭起那座橋，把學術概念轉譯成對串流手法清晰、視覺化的拆解。最終，這支影片要給觀眾一副新的鏡片：觀眾會從被動的粉絲變成主動的思考者，清楚知道怎麼在自己的螢幕上辨識東方主義，看穿那層數位幻象。',
            },
          },
          {
            type: 'embed',
            provider: 'youtube',
            id: 'Y56iKzyyK8c',
            title: {
              en: 'The pitch — problem, approach, and the two sources behind it',
              zh: '提案影片——問題、切入方式，與支撐它的兩份文獻',
            },
            caption: {
              en: 'The recorded pitch walks through the issue, the approach, the two sources, and the kind of images the final video essay will use — academic arguments restated in plain language, for people who would never open a journal.',
              zh: '這段錄影依序說明議題、切入方式、兩份文獻，以及最終影像論文會使用什麼樣的畫面——把學術論證用平白的語言重講一遍，講給那些永遠不會去翻期刊的人聽。',
            },
            captionStyle: 'note',
          },
          { type: 'h2', text: { en: 'References', zh: '參考文獻' } },
          {
            type: 'ref',
            text: {
              en: "Gencel, B. (2023). From Orientalism to neo-Orientalism: Medial representations of the 'other'. Textual Practice, 38(3), 464–484.",
              zh: "Gencel, B. (2023). From Orientalism to neo-Orientalism: Medial representations of the 'other'. Textual Practice, 38(3), 464–484.",
            },
            url: 'https://www.tandfonline.com/doi/full/10.1080/0950236X.2023.2288112',
            note: {
              en: 'Establishes the premise the whole pitch rests on: Orientalism did not disappear, it adapted — which is why it now reads as style rather than ideology.',
              zh: '確立整份提案所依據的前提：東方主義沒有消失，而是自我調適了——這正是它如今讀起來像「風格」而不像「意識形態」的原因。',
            },
          },
          {
            type: 'ref',
            text: {
              en: 'Tharun, T., & John, C. (2025). Constructing reality: A critical study of media representation and social perception. International Journal for Research in Applied Science and Engineering Technology, 13(1), 598–601.',
              zh: 'Tharun, T., & John, C. (2025). Constructing reality: A critical study of media representation and social perception. International Journal for Research in Applied Science and Engineering Technology, 13(1), 598–601.',
            },
            url: 'https://www.ijraset.com/research-paper/critical-study-of-media-representation-and-social-perception',
            note: {
              en: 'Supplies the mechanism: representation is not a mirror but a mould — repeated images do not describe the world, they teach audiences how to see it.',
              zh: '提供運作機制：再現不是鏡子，而是模具——反覆出現的影像不是在描述世界，而是在教觀眾怎麼看世界。',
            },
          },
        ],
      },
    ],
  },
};

/* 挂到全局：经典脚本中顶层 const 不会自动挂到 window */
if (typeof window !== 'undefined') {
  window.SUBJECTS = SUBJECTS;
}
