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
 *   { type: 'h2',    text: '小标题' }
 *   { type: 'quote', text: '引用金句' }
 *   { type: 'figure', src: 'assets/posts/xxx.png', caption: 'FIG.02 — 图注' }
 *   { type: 'video', src: 'assets/videos/xxx.mp4', caption: 'VIDEO — 图注' }
 *     （src 留空则显示复古测试卡占位，上传视频后填入路径即可）
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
        title: {
          en: 'The Curiosity Project: Research Proposal',
          zh: '好奇心計畫：研究提案',
        },
        excerpt: {
          en: 'What keeps international students up at night? A survey-driven proposal on first-year belonging, sampling 40 peers across three faculties.',
          zh: '是什麼讓國際學生徹夜難眠？一份以問卷驅動的一年級歸屬感研究提案，橫跨三個學院、取樣 40 位同儕。',
        },
        date: '2026-09-04',
        tags: [
          { en: 'Survey', zh: '問卷' },
          { en: 'Proposal', zh: '提案' },
        ],
        image: 'assets/posts/bcm212-a1-survey.png',
        figLabel: { en: 'FIG.02 — Survey stack', zh: 'FIG.02 — 問卷堆疊' },
        body: [
          {
            type: 'p',
            text: {
              en: 'Every research project starts with an itch you cannot scratch. Mine was a conversation overheard in the library: two first-years comparing how lonely their first month had been — and how nobody had ever asked them about it. So I asked.',
              zh: '每個研究都始於一個搔不到的癢處。我的來自圖書館裡偶然聽見的一段對話：兩個一年級學生比較著彼此第一個月有多孤單——以及從來沒有人問過他們這件事。於是我問了。',
            },
          },
          { type: 'h2', text: { en: 'Why belonging?', zh: '為什麼談歸屬感？' } },
          {
            type: 'p',
            text: {
              en: 'Belonging is the quiet variable behind every retention statistic. The university measures grades and attendance, but almost nobody measures whether students feel like they are allowed to be here. My proposal puts that question at the centre.',
              zh: '歸屬感是藏在每一個續讀率數字背後的沉默變項。學校衡量成績與出席，卻幾乎沒有人衡量學生是否覺得自己「被允許在這裡」。我的提案把這個問題放在正中央。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'A good research question is a door left deliberately ajar.',
              zh: '好的研究問題，是一道刻意留了縫的門。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The survey walks respondents through their first six weeks: where they ate, who they sat with, which Discord server they lurked in. Mixed with eight semi-structured interviews, the design triangulates the numbers with the stories behind them.',
              zh: '問卷帶著受訪者回顧最初的六週：在哪裡吃飯、和誰同桌、潛伏在哪個 Discord 群組。搭配八場半結構式訪談，這個設計用故事為數字做三角驗證。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The full proposal — literature map, sampling frame, pilot questionnaire — is attached in the submission PDF. Next update: pilot results and the messy art of cleaning survey data.',
              zh: '完整提案——文獻地圖、抽樣架構、前測問卷——附在繳交的 PDF 中。下次更新：前測結果，以及清理問卷數據這門混亂的藝術。',
            },
          },
        ],
      },
      {
        id: 'bcm212-a2',
        no: 'No.02',
        title: { en: 'Ethics in Focus: Interviewing Peers', zh: '倫理聚焦：訪談同儕' },
        excerpt: {
          en: 'A camera, a heart, and everything in between — what my pilot interviews taught me about consent, power and the weight of being quoted.',
          zh: '一台相機、一顆心，以及其間的一切——前測訪談教會我關於知情同意、權力，以及「被引用」的重量。',
        },
        date: '2026-09-16',
        tags: [
          { en: 'Ethics', zh: '倫理' },
          { en: 'Interview', zh: '訪談' },
        ],
        image: 'assets/posts/bcm212-a2-ethics.png',
        figLabel: { en: 'FIG.03 — Consent on the scale', zh: 'FIG.03 — 天平上的同意' },
        body: [
          {
            type: 'p',
            text: {
              en: 'The ethics form looked like paperwork until my first interviewee paused mid-sentence and asked: “If I say this, will my tutor read it?” Suddenly every checkbox on that form had a face.',
              zh: '那張倫理審查表原本看起來只是紙上作業，直到第一位受訪者在句子中途停下來問：「如果我說出這個，我的導師會讀到嗎？」突然間，表上每一個欄位都有了一張臉。',
            },
          },
          { type: 'h2', text: { en: 'Consent is a process, not a signature', zh: '同意是一個過程，不是一個簽名' } },
          {
            type: 'p',
            text: {
              en: 'I rebuilt my consent script around three honest sentences: what I am writing, who will read it, and how you take it back. Two of my four pilot interviewees used that right — one withdrew a quote about family pressure a day after recording. The article survived. The trust mattered more.',
              zh: '我把知情同意腳本重寫成三句誠實的話：我在寫什麼、誰會讀到、以及你如何收回。四位前測受訪者中有兩位行使了這個權利——其中一位在錄音隔天撤回了關於家庭壓力的一段引述。文章還是完成了。但信任更重要。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'Interviewing peers means they can read your final draft. Write like they will.',
              zh: '訪談同儕意味著他們會讀到你的定稿。就照著「他們會讀」的方式寫。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'Anonymisation turned out to be a design problem, not a legal one. Pseudonyms were easy; stripping identifying detail from stories made them feel less true. The compromise: aggregate the risky specifics, keep the emotional texture.',
              zh: '匿名化最後證明是個設計問題，而不是法律問題。化名很容易；把辨識性細節從故事裡剝掉，卻讓它們顯得不那麼真實。折衷做法是：把有風險的具體資訊聚合起來，保留情感的質地。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'Next step: transcribing the remaining interviews and coding themes with a highlighter and zero digital tools. Old school on purpose.',
              zh: '下一步：謄寫剩下的訪談，用螢光筆、零數位工具來編碼主題。刻意老派。',
            },
          },
        ],
      },
      {
        id: 'bcm212-t1',
        no: 'No.03',
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
        title: { en: 'Field Notes: A Week Without Algorithms', zh: '田野筆記：沒有演算法的一週' },
        excerpt: {
          en: 'Seven days of chronological feeds only. My circle of friends, observed from the inside — who noticed, who cared, and what crept back in.',
          zh: '七天只看時間序動態。從內部觀察我的朋友圈——誰注意到了、誰在乎，以及什麼悄悄爬了回來。',
        },
        date: '2026-08-21',
        tags: [
          { en: 'Fieldwork', zh: '田野工作' },
          { en: 'Autoethnography', zh: '自我民族誌' },
        ],
        image: 'assets/posts/bcm241-a1-figures.png',
        figLabel: { en: 'FIG.02 — The observed circle', zh: 'FIG.02 — 被觀察的圈子' },
        body: [
          {
            type: 'p',
            text: {
              en: 'The rules were simple: for one week, every feed I touch must run in chronological order. No recommended videos, no “for you” pages, no algorithmic anything. I recruited four friends to try it with me and kept a shared log of every slip.',
              zh: '規則很簡單：一整週，我碰到的每一條動態都必須按時間序排列。沒有推薦影片、沒有「為你推薦」頁、沒有任何演算法介入。我找了四個朋友一起試，並共用一份紀錄記下每一次失守。',
            },
          },
          { type: 'h2', text: { en: 'Day two: the hand knows the way', zh: '第二天：手比腦子更熟悉路' } },
          {
            type: 'p',
            text: {
              en: 'The most striking finding was muscular, not mental. My thumb kept performing the ritual of opening apps I had silently muted. Muscle memory outlived intention by about three days. By day five, two friends reported “boredom returning to rooms it had left years ago.”',
              zh: '最驚人的發現是肌肉層面的，不是心理層面的。我的拇指依然反覆執行打開那些被我靜音的 App 的儀式。肌肉記憶比意圖多活了大概三天。到了第五天，兩位朋友回報「無聊回到了它幾年前離開的那些房間」。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'The algorithm is not a feed. It is a habit wearing a feed’s clothes.',
              zh: '演算法不是一條動態。它是一個穿著動態外衣的習慣。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'Nobody lasted the full seven days cleanly. The average clean streak was 4.2 days, and every relapse traced back to the same trigger: needing one specific fact, now. Convenience is the payload; everything else is delivery mechanism.',
              zh: '沒有人完整乾淨地撐過七天。平均連續達成 4.2 天，而每一次破功都指向同一個觸發點：現在、立刻、需要某個特定的事實。便利是真正的貨物，其餘一切都只是運送機制。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'Full field notes, including the shared log and my ethics reflection, are in the attached workbook.',
              zh: '完整的田野筆記，包含共用紀錄與我的倫理反思，都在附件的工作簿裡。',
            },
          },
        ],
      },
      {
        id: 'bcm241-a2',
        no: 'No.02',
        title: { en: 'Autoethnography: My Phone, My Mirror', zh: '自我民族誌：我的手機，我的鏡子' },
        excerpt: {
          en: 'Turning the ethnographic lens on myself — a screen-time diary, three generations of family photos, and what my home screen says about who I am becoming.',
          zh: '把民族誌的鏡頭轉向自己——螢幕使用日記、三個世代的家庭照片，以及我的主畫面透露了我正在成為誰。',
        },
        date: '2026-09-08',
        tags: [
          { en: 'Autoethnography', zh: '自我民族誌' },
          { en: 'Diary', zh: '日記' },
        ],
        image: 'assets/posts/bcm241-a2-phone.png',
        figLabel: { en: 'FIG.03 — Layers of the screen', zh: 'FIG.03 — 螢幕的層次' },
        body: [
          {
            type: 'p',
            text: {
              en: 'Autoethnography asks you to treat your own life as a valid field site. Mine was the 6.1 inches of glass I touch 96 times a day, on average, according to the week I spent logging every unlock.',
              zh: '自我民族誌要求你把自己的生活當成一個有效的田野現場。我的田野是我每天平均觸碰 96 次的那 6.1 吋玻璃——這個數字來自我記錄每一次解鎖的那一週。',
            },
          },
          { type: 'h2', text: { en: 'Three layers of a home screen', zh: '主畫面的三個層次' } },
          {
            type: 'p',
            text: {
              en: 'Page one is performance: the tidy apps I show when someone glances over. Page two is function: banking, maps, the boring machinery of life. Page three — buried in a folder — is truth: the pinyin keyboard I keep for texting my grandmother, the sketching app from a hobby I abandoned, the audio Bible my mother sent me in June.',
              zh: '第一頁是表演：當有人瞄過來時我展示的那些整齊的 App。第二頁是功能：銀行、地圖，生活裡無聊的機械裝置。第三頁——埋在一個資料夾裡——是真相：我為了傳訊息給奶奶而保留的拼音鍵盤、來自我放棄的某個興趣的繪圖 App、我媽六月傳給我的有聲聖經。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'Your home screen is an autobiography you did not know you were writing.',
              zh: '你的主畫面是一部你不知道自己正在寫的自傳。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'Cross-referencing the unlock log with my family photo archive revealed the quiet centre of it all: 41 of 96 daily touches ended in a conversation with someone I love. The phone is not the opposite of connection. It is connection’s smallest room.',
              zh: '把解鎖紀錄與家庭相簿交叉比對之後，整件事安靜的核心浮現出來：每天 96 次觸碰中，有 41 次最後結束於和我愛的人的一段對話。手機不是連結的對立面，它是連結最小的那個房間。',
            },
          },
        ],
      },
      {
        id: 'bcm241-a3',
        no: 'No.03',
        title: { en: 'Listening Party: Family Media Rituals', zh: '聆聽派對：家庭媒體儀式' },
        excerpt: {
          en: 'An audio ethnography of three generations in one living room — grandfather’s radio, mum’s short videos, and the strange silence of shared screens.',
          zh: '一個客廳、三個世代的聲音民族誌——爺爺的收音機、媽媽的短影片，以及共享螢幕之間那種奇特的沉默。',
        },
        date: '2026-09-17',
        tags: [
          { en: 'Audio', zh: '聲音' },
          { en: 'Family', zh: '家庭' },
        ],
        image: 'assets/posts/bcm241-a3-ear.png',
        figLabel: { en: 'FIG.04 — Listening, in rings', zh: 'FIG.04 — 一圈一圈的聆聽' },
        video: {
          src: '',
          caption: {
            en: 'VIDEO — Living room field recording (05:42)',
            zh: 'VIDEO — 客廳田野錄音（05:42）',
          },
        },
        body: [
          {
            type: 'p',
            text: {
              en: 'I recorded 40 minutes of my family’s Sunday evening and then listened to it twice: once for the voices, once for everything else. The second listen was the ethnography.',
              zh: '我錄下家裡週日晚上的 40 分鐘，然後聽了兩次：一次聽人聲，一次聽其他所有東西。第二次聆聽才是民族誌。',
            },
          },
          { type: 'h2', text: { en: 'Three medias, one room', zh: '三種媒體，一個房間' } },
          {
            type: 'p',
            text: {
              en: 'Grandfather’s Cantonese opera radio fills the space at exactly conversational volume — loud enough to claim the room, soft enough to yield it. Mum’s short-video app is the opposite: earbuds in, shoulder-shaking laughter, a private theatre in public space. I sat between both with a laptop, performing my own solitude.',
              zh: '爺爺的粵劇收音機以正好是對話音量的聲音填滿空間——大到足以佔據這個房間，又輕到足以讓出它。媽媽的短影片 App 恰好相反：戴著耳機、笑得肩膀發抖，在公共空間裡經營一座私人劇院。我抱著筆電坐在兩者之間，演出我自己的孤獨。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'A family does not share one media diet. It shares a room where three diets negotiate.',
              zh: '一個家庭並不共享同一份媒體菜單。它共享的是一個房間，讓三份菜單在此協商。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The audio file attached below is edited to five minutes with everyone’s consent — including grandfather’s conditions: “no cutting my opera mid-phrase.” Fair.',
              zh: '下方附上的音檔在徵得所有人同意後剪成五分鐘——包括爺爺的條件：「不准把我的戲曲在一句中間剪掉。」合理。',
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
        title: { en: 'From CRT to Cloud: A Media Timeline', zh: '從映像管到雲端：一部媒體時間軸' },
        excerpt: {
          en: 'Six screens, seventy years — tracing how the centre of household media moved from the living room wall to a wrist, and guessing where it goes next.',
          zh: '六個螢幕、七十年——追蹤家庭媒體的中心如何從客廳的牆面移动到手腕上，並猜測它接下來會去哪裡。',
        },
        date: '2026-08-28',
        tags: [
          { en: 'Timeline', zh: '時間軸' },
          { en: 'Essay', zh: '隨筆' },
        ],
        image: 'assets/posts/bcm206-a1-crt.png',
        figLabel: { en: 'FIG.02 — The family CRT', zh: 'FIG.02 — 家中的映像管電視' },
        body: [
          {
            type: 'p',
            text: {
              en: 'Every era of media has a furniture problem: where does the machine sit, and who faces it? The CRT television answered with a ritual — the whole family arranged around a single glowing rectangle, programming arrived on its schedule, not yours.',
              zh: '每一個媒體時代都有一個家具問題：機器放在哪裡，而誰面對著它？映像管電視用一套儀式回答了這個問題——全家人圍著一個發光的長方形，節目按它的時刻表到來，而不是你的。',
            },
          },
          { type: 'h2', text: { en: 'Centrifugal media', zh: '離心式的媒體' } },
          {
            type: 'p',
            text: {
              en: 'From broadcast to cable to broadband, each generation spun the screen further outward: one per house, one per person, one per eyeball. The cloud era inverts the question — the “screen” is now just the nearest pane of glass to whatever you are doing.',
              zh: '從無線廣播到有線電視再到寬頻，每一個世代都把螢幕甩得更外圍：一戶一個、一人一個、一隻眼球一個。雲端時代把問題倒轉了過來——「螢幕」現在只是距離你手邊那件事最近的一片玻璃。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'Media history is the story of a glow migrating: from the wall, to the palm, to the retinas.',
              zh: '媒體史就是一則關於光暈遷徙的故事：從牆面，到掌心，再到視網膜。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'My speculative timeline ends in 2041 with “ambient consensus layers” — network surfaces that exist only when two or more people occupy the same physical space. A provocation, not a prediction. The full annotated timeline is in the attached PDF.',
              zh: '我的推測時間軸結束在 2041 年的「環境共識層」——只有在兩個以上的人佔據同一物理空間時才存在的網路表面。這是一個挑釁，不是預測。完整註解的時序圖在附件的 PDF 裡。',
            },
          },
        ],
      },
      {
        id: 'bcm206-a2',
        no: 'No.02',
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
        title: { en: 'The Gaze Economy: Surveillance on Social Media', zh: '凝視經濟：社群媒體上的監控' },
        excerpt: {
          en: 'We watch the feed; the feed watches back. A case study on how attention became the currency — and who prints it.',
          zh: '我們看著動態，動態也回看著我們。一份關於注意力如何成為貨幣——以及由誰印鈔——的個案研究。',
        },
        date: '2026-09-05',
        tags: [
          { en: 'Surveillance', zh: '監控' },
          { en: 'Case Study', zh: '個案研究' },
        ],
        image: 'assets/posts/bcm222-a1-eye.png',
        figLabel: { en: 'FIG.02 — The watching eye', zh: 'FIG.02 — 觀看的眼睛' },
        body: [
          {
            type: 'p',
            text: {
              en: 'Every social platform sells the same product twice: to us, the feeling of being seen; to advertisers, the certainty of seeing us. The eye in my collage is double-sided on purpose — it is both audience and lens.',
              zh: '每一個社群平台都把同一個產品賣兩次：賣給我們「被看見」的感覺；賣給廣告主「看見我們」的確定性。我拼貼裡的那隻眼睛是刻意做成雙面的——它既是觀眾，也是鏡頭。',
            },
          },
          { type: 'h2', text: { en: 'Consent at scale', zh: '規模化的同意' } },
          {
            type: 'p',
            text: {
              en: 'Individual privacy choices are real but asymmetrical: I can close my curtains, but I cannot close the street’s. Data protection frameworks treat surveillance as a series of private transactions, when its effects are entirely collective — the algorithmic neighbourhood is shaped by everyone’s data, governed by no one’s consent.',
              zh: '個人的隱私選擇是真實的，但並不對稱：我可以拉上自己的窗簾，卻拉不上整條街的。資料保護框架把監控當成一連串私人交易，但它的效果完全是集體的——演算法社區由所有人的資料塑造，卻不由任何人的同意所治理。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'Surveillance is the only economy where the product watches you back.',
              zh: '監控是唯一一種產品會回看著你的經濟。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'The case study closes with three design fictions for “consent-preserving feeds” — timelines that could personalise without retaining. Naive? Possibly. The point of the exercise was discovering how much of surveillance is a default, not a necessity.',
              zh: '這份個案研究以三個「保留同意的動態牆」設計虛構作結——能在不保留資料的前提下個人化的時間軸。太天真？也許。但這個練習的重點是發現：監控之中有多少只是預設值，而不是必需品。',
            },
          },
        ],
      },
      {
        id: 'bcm222-a2',
        no: 'No.02',
        title: { en: 'Voice & Visibility: Who Gets the Mic?', zh: '發聲與可見性：誰拿到麥克風？' },
        excerpt: {
          en: 'Amplification is power. Comparing two student protests covered by the same campus paper — one front-page, one buried, and the structural reason why.',
          zh: '放大就是權力。比較同一份校園報紙報導的兩場學生抗議——一則上了頭版，一則被埋掉，以及背後結構性的原因。',
        },
        date: '2026-09-18',
        tags: [
          { en: 'Representation', zh: '再現' },
          { en: 'Analysis', zh: '分析' },
        ],
        image: 'assets/posts/bcm222-a2-megaphone.png',
        figLabel: { en: 'FIG.03 — Voice, amplified', zh: 'FIG.03 — 被放大的聲音' },
        body: [
          {
            type: 'p',
            text: {
              en: 'Two student protests, one campus paper, same academic year. The first ran on the front page above the fold; the second was a 90-word brief on page seven. The difference was not newsworthiness. It was proximity — to the paper’s routines, its sources, its idea of its audience.',
              zh: '兩場學生抗議、一份校園報紙、同一個學年。第一場上了頭版摺線以上；第二場是第七頁一則 90 字的短訊。差別不在新聞價值，而在親近程度——與報紙的日常流程、它的消息來源、它對讀者的想像之間的親近程度。',
            },
          },
          { type: 'h2', text: { en: 'The megaphone supply chain', zh: '麥克風的供應鏈' } },
          {
            type: 'p',
            text: {
              en: 'Voice is not distributed by need; it is distributed by access. The groups already inside a newsroom’s source network get amplified by default, while unfamiliar organisers must first become legible to the paper before they can become visible through it.',
              zh: '聲音不是按需求分配的，而是按門路分配的。已經在編輯部消息網絡裡的那些團體，預設就會被放大；而陌生的組織者必須先變得讓報紙「讀得懂」，才能透過報紙變得可見。',
            },
          },
          {
            type: 'quote',
            text: {
              en: 'A megaphone does not make your voice stronger. It makes you audible to whoever owns the megaphone supply.',
              zh: '麥克風不會讓你的聲音變強。它只是讓你被「擁有麥克風供應鏈的人」聽見。',
            },
          },
          {
            type: 'p',
            text: {
              en: 'My analysis proposes a “source diversity audit” — a repeatable checklist any student paper could run quarterly. Modest intervention, but audits are how defaults get noticed.',
              zh: '我的分析提出一份「消息來源多樣性稽核」——任何校園報紙都能按季執行的可複製清單。干預幅度不大，但稽核正是讓預設值被看見的方式。',
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
