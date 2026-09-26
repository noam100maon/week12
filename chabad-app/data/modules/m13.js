/* Module 13: Speak Like You Know It */
CP_LESSONS("m13", [
  {
    id: "m13-1", title: "Everyday Chabad phrases", minutes: 5, intro: true,
    teach: `
<p><b>Phrases you'll hear every day, with their meaning and when they're natural.</b></p>
<ul>
<li><b>Baruch Hashem (B"H):</b> "thank G-d". The answer to "how are you?" It's also written at the top of letters and documents.</li>
<li><b>B'ezras Hashem (B"EH) / Im yirtzeh Hashem:</b> "with Hashem's help" / "if Hashem wills". Said about plans: "I'll be there tomorrow, b'ezras Hashem."</li>
<li><b>B'li neder:</b> "without a vow". Said when committing to something, so it isn't a halachic vow: "I'll learn with you tomorrow, b'li neder."</li>
<li><b>Gut Shabbos / Gut voch / Gut chodesh / Gut Yom Tov:</b> the greetings for each occasion.</li>
<li><b>Yasher koach (shkoyach):</b> thanks, well done. Also said after an aliyah.</li>
<li><b>Kol tuv:</b> "all the best". A farewell, including in emails.</li>
<li><b>Moshiach now / We want Moshiach now:</b> a Chabad slogan popularized at the Rebbe's farbrengens; it's also sung.</li>
<li><b>Ad me'ah v'esrim:</b> "until 120". A wish for long life, said on birthdays.</li>
<li><b>Mazal tov:</b> on happy occasions.</li>
<li><b>B'sha'ah tovah:</b> "at a good time". Said about a pregnancy or engagement news, not \"mazal tov\" until the birth.</li>
</ul>
<p><b>B"H on paper.</b> Chabad writes "ב״ה" at the top of every page, even notes and business documents. The Rebbe wrote it on all his letters.</p>
<p><b>Using them.</b> These are normal speech in Chabad circles. Using them naturally isn't showing off; not using them sounds formal. Start with Baruch Hashem, b'ezras Hashem, and b'li neder.</p>`,
    terms: [
      { t: "Baruch Hashem", h: "ברוך השם", m: "Thank G-d" },
      { t: "B'ezras Hashem", h: "בעזרת השם", m: "With Hashem's help" },
      { t: "B'li neder", h: "בלי נדר", m: "Without a vow" },
      { t: "Kol tuv", h: "כל טוב", m: "All the best" },
      { t: "B'sha'ah tovah", h: "בשעה טובה", m: "At a good time" },
      { t: "Ad me'ah v'esrim", h: "עד מאה ועשרים", m: "Until 120" }
    ],
    source: "Common usage; Nedarim (on b'li neder); the Rebbe's practice of writing ב״ה",
    doToday: "Write \"ב״ה\" at the top of your next note or document, including a business one.",
    quiz: [
      { id: "m13-1-q1", t: "mc", q: "Why say \"b'li neder\"?", o: ["So a commitment isn't a halachic vow", "To sound humble", "It's a greeting", "No reason"], a: 0, x: "Vows are serious; this avoids one." },
      { id: "m13-1-q2", t: "mc", q: "\"B'sha'ah tovah\" is said:", o: ["On pregnancy news", "At a funeral", "On Shabbos", "On Rosh Chodesh"], a: 0, x: "Mazal tov comes at the birth." },
      { id: "m13-1-q3", t: "mc", q: "\"Kol tuv\" means:", o: ["All the best", "Thank you", "Good morning", "Congratulations"], a: 0, x: "A farewell." },
      { id: "m13-1-q4", t: "tf", q: "Chabad writes \"ב״ה\" on the top of documents.", a: true, x: "True, as the Rebbe did on every letter." },
      { id: "m13-1-q5", t: "recall", q: "What's the difference between \"b'ezras Hashem\" and \"b'li neder\"?", model: "B'ezras Hashem expresses reliance on Hashem for plans. B'li neder avoids making a promise into a halachic vow.", x: "Often both are said together." }
    ],
    deeper: [
      { id: "m13-1-d1", t: "recall", q: "Why is a vow halachically serious?", model: "A neder is binding by Torah law (Bamidbar 30:3), and breaking it is a serious sin; Chazal discouraged making vows at all.", x: "Hence \"b'li neder\"." }
    ],
    reflect: "Which of these phrases would sound most natural from you, and which least? Why?",
    sayIt: { phrase: "Baruch Hashem.", h: "ברוך השם", meaning: "Thank G-d.", when: "Next time someone asks how you are." }
  },
  {
    id: "m13-2", title: "Farbrengen phrases", minutes: 5, intro: true,
    teach: `
<p><b>At the table.</b></p>
<ul>
<li><b>L'chaim / l'chaim v'livracha:</b> the toast and its response.</li>
<li><b>Nu?</b> "So? Well?" Used to push someone to speak up or act: "Nu, what's your hachlatah?"</li>
<li><b>A gut vort:</b> "a good word", a nice Torah thought.</li>
<li><b>A chassidishe maiseh:</b> a Chassidic story. "Let me tell you a maiseh."</li>
<li><b>Hachlatah tovah:</b> a good resolution. "Nu, a hachlatah tovah!" when someone commits.</li>
<li><b>Mamash:</b> really, literally. "This is mamash the point."</li>
<li><b>Gevaldig:</b> tremendous.</li>
<li><b>Avodah:</b> "It's all about avodah."</li>
<li><b>Pnimiyus / chitzoniyus:</b> inwardness vs. externality. "Is it pnimiyus, or just chitzoniyus?" A classic farbrengen question.</li>
<li><b>Yeshus:</b> ego. "That's yeshus talking."</li>
<li><b>Kabbalas ol:</b> accepting Hashem's will simply, even without feeling.</li>
<li><b>Chayus:</b> vitality. "Daven with chayus."</li>
</ul>
<p><b>Blessings.</b> At the end of l'chaim, someone might say:</p>
<ul>
<li>"L'chaim! May you have hatzlachah in learning."</li>
<li>"...a kesiva v'chasima tova" in Elul.</li>
<li>"...a freilichen Yom Tov".</li>
</ul>
<p>Answer "amen" and give one back.</p>
<p><b>Why these matter.</b> They carry Chassidic ideas in shorthand. Pnimiyus, yeshus, kabbalas ol: each is a whole teaching. Use them when you understand the idea behind them.</p>`,
    terms: [
      { t: "Pnimiyus", h: "פנימיות", m: "Inwardness, sincerity" },
      { t: "Chitzoniyus", h: "חיצוניות", m: "Externality, superficiality" },
      { t: "Maiseh", h: "מעשה", m: "A story" },
      { t: "Hatzlachah", h: "הצלחה", m: "Success" },
      { t: "Yeshus", h: "ישות", m: "Ego" }
    ],
    source: "Common Chabad usage; concepts from Tanya and Chassidus",
    doToday: "At the next farbrengen, listen for three of these phrases and note how they're used.",
    quiz: [
      { id: "m13-2-q1", t: "mc", q: "\"Pnimiyus\" means:", o: ["Inwardness, sincerity", "Outward appearance", "Joy", "Anger"], a: 0, x: "Its opposite is chitzoniyus." },
      { id: "m13-2-q2", t: "mc", q: "\"That's yeshus talking\" means:", o: ["That's ego talking", "That's wisdom", "That's joy", "That's Torah"], a: 0, x: "Yeshus = ego." },
      { id: "m13-2-q3", t: "mc", q: "\"Nu, a hachlatah tovah!\" is said when:", o: ["Someone commits to a resolution", "Someone arrives", "Someone leaves", "Someone sneezes"], a: 0, x: "Encouragement." },
      { id: "m13-2-q4", t: "recall", q: "What does \"kabbalas ol\" mean?", model: "Accepting Hashem's will simply, even without understanding or feeling it.", x: "A core Chabad concept." },
      { id: "m13-2-q5", t: "mc", q: "A \"chassidishe maiseh\" is:", o: ["A Chassidic story", "A melody", "A drink", "A class"], a: 0, x: "Stories are central to farbrengens." }
    ],
    deeper: [
      { id: "m13-2-d1", t: "recall", q: "Why do chassidim value pnimiyus over chitzoniyus?", model: "Because avodah is measured by inner truth, not appearance. Chassidic dress and phrases without inner change are chitzoniyus; Chassidus aims for real transformation.", x: "The core of the Mitteler Rebbe's Kuntres HaHispaalus." }
    ],
    reflect: "Is there any part of your new Chabad life that's more chitzoniyus than pnimiyus right now? Be honest.",
    sayIt: { phrase: "Is it pnimiyus or chitzoniyus?", h: "", meaning: "Is it real, or just on the surface?", when: "At a farbrengen, about yourself first." }
  },
  {
    id: "m13-3", title: "The Rebbeim's famous sayings", minutes: 5, intro: false,
    teach: `
<p><b>Lines every chassid knows.</b> Know the source and the meaning before using them.</p>
<ul>
<li><b>The Alter Rebbe: "Me darf lebn mit der tzeit"</b>, "One must live with the times". Explained by the Frierdiker Rebbe (Hayom Yom): it means living with the weekly parsha, taking daily guidance from it.</li>
<li><b>The Alter Rebbe, in devekus: "Ich vil nit dein Gan Eden, ich vil nit dein Olam Haba... ich vil nor Dich aleyn."</b> "I don't want Your Gan Eden, I don't want Your World to Come... I want only You." The ultimate expression of loving Hashem for Himself.</li>
<li><b>The Tzemach Tzedek: "Tracht gut vet zain gut."</b> Think good and it will be good (lesson m1-5).</li>
<li><b>The Rebbe Maharash: "Lechatchila ariber."</b> Go over from the start (lesson m1-6).</li>
<li><b>The Rebbe Rashab: "Ich gei in himmel, di kesavim loz ich aych."</b> "I'm going to heaven; I leave you the writings" (lesson m1-7).</li>
<li><b>The Frierdiker Rebbe: "America iz nit anders."</b> America is not different (lesson m1-8).</li>
<li><b>The Frierdiker Rebbe: "one G-d and two worlds"</b> (lesson m1-8).</li>
</ul>
<p><b>How to use them.</b> Don't drop them into every conversation. Use one when it genuinely fits the situation, and be ready to explain it if asked. That's what separates someone who knows from someone who sounds like he knows.</p>`,
    terms: [
      { t: "Lebn mit der tzeit", h: "לעבן מיט דער צייט", m: "\"Live with the times\": with the weekly parsha" },
      { t: "Devekus", h: "דביקות", m: "Clinging to Hashem" },
      { t: "Gan Eden", h: "גן עדן", m: "Paradise" },
      { t: "Olam Haba", h: "עולם הבא", m: "The World to Come" }
    ],
    source: "Hayom Yom (on \"living with the times\"); the Rebbeim's sayings as transmitted by the Frierdiker Rebbe and the Rebbe",
    doToday: "Learn one line from this list by heart, with its source and meaning.",
    quiz: [
      { id: "m13-3-q1", t: "mc", q: "\"Live with the times\" means:", o: ["Live with the weekly parsha", "Keep up with news", "Be modern", "Be on time"], a: 0, x: "The Alter Rebbe, as explained in Hayom Yom." },
      { id: "m13-3-q2", t: "mc", q: "\"Lechatchila ariber\" is from:", o: ["The Rebbe Maharash", "The Alter Rebbe", "The Rebbe", "The Tzemach Tzedek"], a: 0, x: "Go over from the start." },
      { id: "m13-3-q3", t: "recall", q: "What did the Alter Rebbe say in devekus about Gan Eden?", model: "\"I don't want Your Gan Eden, I don't want Your World to Come; I want only You.\"", x: "Love of Hashem for His own sake." },
      { id: "m13-3-q4", t: "mc", q: "\"America iz nit anders\" is from:", o: ["The Frierdiker Rebbe", "The Rebbe", "The Rebbe Rashab", "The Alter Rebbe"], a: 0, x: "On arrival in America." },
      { id: "m13-3-q5", t: "mc", q: "\"Tracht gut vet zain gut\" is from:", o: ["The Tzemach Tzedek", "The Rebbe Maharash", "The Mitteler Rebbe", "The Rebbe Rashab"], a: 0, x: "Think good and it will be good." }
    ],
    deeper: [
      { id: "m13-3-d1", t: "recall", q: "How would you use \"live with the times\" practically this week?", model: "Find a lesson in this week's parsha that applies to your life right now (business, friendships, davening), and think about it during the week.", x: "That's the Alter Rebbe's intention." }
    ],
    reflect: "Which of these sayings do you most need right now? Why?",
    sayIt: { phrase: "Me darf lebn mit der tzeit.", h: "מען דארף לעבן מיט דער צייט", meaning: "One must live with the times: with the weekly parsha.", when: "When sharing a lesson from this week's parsha." }
  },
  {
    id: "m13-4", title: "The Rebbe's famous lines", minutes: 5, intro: false,
    teach: `
<p><b>Lines associated with the Rebbe.</b> Some are direct quotes, and some are widely attributed. It's honest to say "the Rebbe said" only when you know the source; otherwise, say "the Rebbe is quoted as saying".</p>
<ul>
<li><b>"A little light dispels a lot of darkness."</b> An idea the Rebbe often repeated, rooted in Chassidic teaching (and Tanya). You don't fight darkness; you add light.</li>
<li><b>"Do all you can to bring Moshiach."</b> From the sicha of 28 Nissan 5751 (1991): the Rebbe said he'd done what he could and handed the mission to his chassidim.</li>
<li><b>"If you know alef, teach alef."</b> Widely attributed to the Rebbe: you don't need to be an expert to share what you know. Everyone is a teacher.</li>
<li><b>"Ufaratzta."</b> "You shall spread out west, east, north, and south" (Bereishis 28:14). A Chabad slogan for shlichus, sung as a niggun.</li>
<li><b>"The world is ready."</b> A theme of the Rebbe's later sichos: the world is prepared for the geulah.</li>
<li><b>"Every Jew is a shliach."</b> The idea (from many sichos) that every Jew is sent to make his environment a home for Hashem.</li>
</ul>
<p><b>A general rule.</b> The Rebbe's teachings are published: Likkutei Sichos, Igros Kodesh, and the talks at chabad.org. When a line matters to you, look up the source. Knowing where it comes from is the difference between a slogan and a teaching.</p>`,
    terms: [
      { t: "Ufaratzta", h: "ופרצת", m: "\"You shall spread out\" (Bereishis 28:14)" },
      { t: "Or docheh choshech", h: "אור דוחה חושך", m: "Light pushes away darkness" },
      { t: "Sicha", h: "שיחה", m: "A talk" },
      { t: "Igros Kodesh", h: "אגרות קודש", m: "The Rebbe's collected letters" }
    ],
    source: "Bereishis 28:14; sicha of 28 Nissan 5751; Likkutei Sichos; Igros Kodesh",
    doToday: "Pick one of these lines and find its source on chabad.org.",
    quiz: [
      { id: "m13-4-q1", t: "mc", q: "\"Ufaratzta\" is from:", o: ["Bereishis 28:14", "Tanya", "Hayom Yom", "Avos"], a: 0, x: "Yaakov's blessing." },
      { id: "m13-4-q2", t: "recall", q: "What's the idea of \"a little light dispels a lot of darkness\"?", model: "You don't fight darkness directly; you add light, and even a little light pushes away much darkness.", x: "Often repeated by the Rebbe." },
      { id: "m13-4-q3", t: "mc", q: "\"If you know alef, teach alef\" means:", o: ["Share what you know, even if it's a little", "Learn the alphabet", "Only experts should teach", "Teach children"], a: 0, x: "Widely attributed to the Rebbe." },
      { id: "m13-4-q4", t: "mc", q: "When should you say \"the Rebbe said\"?", o: ["When you know the source", "Always, for any Chabad line", "Never", "Only in Yiddish"], a: 0, x: "Otherwise say \"is quoted as saying\"." },
      { id: "m13-4-q5", t: "mc", q: "The sicha of 28 Nissan 5751 is known for:", o: ["\"Do all you can to bring Moshiach\"", "Launching mivtza tefillin", "Basi L'Gani", "Education Day"], a: 0, x: "1991." }
    ],
    deeper: [
      { id: "m13-4-d1", t: "recall", q: "Why does source-checking matter for a chassid?", model: "Because attributing words to the Rebbe (or anyone) without basis is a form of falsehood, and slogans without sources get distorted. Knowing the source lets you understand the context and meaning.", x: "Honesty applies to quotes too." }
    ],
    reflect: "What's one \"alef\" you know that you could teach someone this week?",
    sayIt: { phrase: "A little light pushes away a lot of darkness.", h: "", meaning: "Add good rather than fighting bad.", when: "When someone is overwhelmed by what's wrong in the world." }
  },
  {
    id: "m13-5", title: "Hayom Yom lines worth knowing", minutes: 5, intro: false,
    teach: `
<p><b>What Hayom Yom is.</b> A daily calendar compiled by the Rebbe in 1943 at the Frierdiker Rebbe's request. Each day has a short teaching, custom, or saying, mostly from the Frierdiker Rebbe's talks and letters. Chassidim learn it daily and quote it often: "It says in Hayom Yom..."</p>
<p><b>Ideas quoted in Hayom Yom that you'll hear:</b></p>
<ul>
<li><b>Living with the times:</b> the Alter Rebbe's teaching about living with the weekly parsha (lesson m13-3).</li>
<li><b>Learning from everything:</b> the Baal Shem Tov's teaching that from everything a person sees or hears, he should learn a lesson in serving Hashem (lesson m8-11).</li>
<li><b>Customs:</b> much of what you do in Chabad, like Tehillim after davening, Chitas, and the Shabbos Mevarchim Tehillim, is recorded in Hayom Yom.</li>
</ul>
<p><b>How to really know Hayom Yom.</b> Read it daily. It's one paragraph. After a year, you'll have read the whole thing and will recognize the lines when they're quoted. That's worth more than memorizing a list. An honest note: this app gives you only a few lines here on purpose, since quoting exact dates from memory risks errors.</p>
<p><b>Using it.</b> When you share a Hayom Yom line, say what day it's from, or say "Hayom Yom says". Chassidim will know it. If you're not sure of the day, say "somewhere in Hayom Yom". That's honest and normal.</p>`,
    terms: [
      { t: "Hayom Yom", h: "היום יום", m: "The daily Chabad calendar of teachings (1943)" },
      { t: "Minhag", h: "מנהג", m: "A custom" },
      { t: "Pisgam", h: "פתגם", m: "A saying" }
    ],
    source: "Hayom Yom (introduction and daily entries)",
    doToday: "Read today's Hayom Yom (chabad.org or an app). Tell one person what it said.",
    quiz: [
      { id: "m13-5-q1", t: "mc", q: "Hayom Yom was compiled by:", o: ["The Rebbe, in 1943", "The Alter Rebbe", "The Frierdiker Rebbe himself", "Kehot, recently"], a: 0, x: "At the Frierdiker Rebbe's request." },
      { id: "m13-5-q2", t: "mc", q: "Most Hayom Yom entries come from:", o: ["The Frierdiker Rebbe's talks and letters", "The Zohar", "The Rambam", "Newspapers"], a: 0, x: "Plus customs." },
      { id: "m13-5-q3", t: "recall", q: "What's the best way to really know Hayom Yom?", model: "Read it daily; after a year you'll have read it all and will recognize quotes.", x: "One paragraph a day." },
      { id: "m13-5-q4", t: "tf", q: "If you're unsure of the exact date of a Hayom Yom line, it's fine to say \"somewhere in Hayom Yom\".", a: true, x: "Honest and normal." },
      { id: "m13-5-q5", t: "mc", q: "Hayom Yom includes:", o: ["Teachings, customs, and sayings for each day", "Only halacha", "Only stories", "Only niggunim"], a: 0, x: "A mix." }
    ],
    deeper: [
      { id: "m13-5-d1", t: "recall", q: "Why did the Frierdiker Rebbe want a daily book like Hayom Yom?", model: "To give every chassid a daily connection to Chassidus and Chabad customs in small, accessible portions, alongside the daily Chitas divisions it also contains.", x: "Daily, small, steady." }
    ],
    reflect: "Could Hayom Yom fit into your 10-minute nightly window? Where?",
    sayIt: { phrase: "It says in Hayom Yom...", h: "", meaning: "Quoting the daily Chabad calendar.", when: "When today's Hayom Yom fits a conversation." }
  },
  {
    id: "m13-6", title: "Yeshiva vocabulary", minutes: 5, intro: false,
    teach: `
<p><b>The words of yeshiva life.</b></p>
<ul>
<li><b>Seder:</b> a set learning period. Shacharis seder, Chassidus seder, night seder.</li>
<li><b>Chavrusa:</b> a learning partner, and also the learning session itself.</li>
<li><b>Shiur:</b> a class given by a teacher.</li>
<li><b>Sugya:</b> a topic in the Gemara.</li>
<li><b>Iyun / bekius:</b> learning in depth / learning for breadth.</li>
<li><b>Chazara:</b> review.</li>
<li><b>Maamar:</b> a formal Chassidic discourse, said or written by a Rebbe.</li>
<li><b>Sicha:</b> a talk by the Rebbe.</li>
<li><b>Hanhala:</b> the yeshiva's administration.</li>
<li><b>Mashgiach:</b> a supervisor of the bochurim's conduct.</li>
<li><b>Rosh yeshiva:</b> the head of the yeshiva.</li>
<li><b>Zal:</b> the beis midrash, the main study hall.</li>
<li><b>Chassidus seder:</b> the morning period for learning Chassidus before davening, a Chabad yeshiva staple.</li>
<li><b>Mivtzoyim:</b> outreach outings.</li>
<li><b>Shabbos Mevarchim:</b> Tehillim and a farbrengen.</li>
<li><b>Kinus:</b> a gathering or conference, like the Kinus HaShluchim.</li>
<li><b>Kvutza:</b> the year at 770 after yeshiva.</li>
<li><b>Smicha:</b> rabbinic ordination.</li>
</ul>
<p><b>Your schedule.</b> Knowing the vocabulary lets you follow what's happening. You said you have free time after night seder. That's the classic time chassidim use for chazara or Chitas.</p>`,
    terms: [
      { t: "Sugya", h: "סוגיא", m: "A Gemara topic" },
      { t: "Iyun / bekius", h: "עיון / בקיאות", m: "Depth / breadth" },
      { t: "Chazara", h: "חזרה", m: "Review" },
      { t: "Hanhala", h: "הנהלה", m: "Administration" },
      { t: "Kinus", h: "כינוס", m: "Gathering, conference" },
      { t: "Smicha", h: "סמיכה", m: "Rabbinic ordination" }
    ],
    source: "Common yeshiva usage",
    doToday: "Write down the names of each seder in your Mayanot day, using the right terms.",
    quiz: [
      { id: "m13-6-q1", t: "mc", q: "\"Iyun\" means:", o: ["In-depth learning", "Breadth", "Review", "Class"], a: 0, x: "Bekius is breadth." },
      { id: "m13-6-q2", t: "mc", q: "A \"maamar\" is:", o: ["A formal Chassidic discourse", "A story", "A song", "A letter"], a: 0, x: "Said or written by a Rebbe." },
      { id: "m13-6-q3", t: "mc", q: "\"Chazara\" means:", o: ["Review", "Prayer", "Food", "Travel"], a: 0, x: "Learning it again." },
      { id: "m13-6-q4", t: "mc", q: "The \"zal\" is:", o: ["The beis midrash", "The dining room", "The dorm", "The office"], a: 0, x: "The study hall." },
      { id: "m13-6-q5", t: "recall", q: "What's the difference between a maamar and a sicha?", model: "A maamar is a formal Chassidic discourse (with a set structure, often chanted); a sicha is a talk, often explaining Torah, events, or giving directives.", x: "Both are the Rebbe's Torah." }
    ],
    deeper: [
      { id: "m13-6-d1", t: "recall", q: "Why do Chabad yeshivos have a Chassidus seder before davening?", model: "So that davening can be informed by contemplation: learn Chassidus, then daven with hisbonenus on what you learned.", x: "The Rebbe Rashab's model." }
    ],
    reflect: "Which seder in your day do you give the least attention to? What would change it?",
    sayIt: { phrase: "I'll see you after seder.", h: "", meaning: "After the learning session.", when: "Any day in yeshiva." }
  },
  {
    id: "m13-7", title: "References and in-jokes", minutes: 5, intro: false,
    teach: `
<p><b>Things chassidim refer to without explaining.</b></p>
<ul>
<li><b>770:</b> 770 Eastern Parkway, Chabad headquarters in Crown Heights. The gematria of <i>paratzta</i> (פרצת) is 770, connecting the building to "ufaratzta". Chassidim love this.</li>
<li><b>Crown Heights:</b> the Brooklyn neighborhood, center of Chabad life.</li>
<li><b>The Ohel:</b> the Rebbe's resting place.</li>
<li><b>Kfar Chabad:</b> the Chabad village near Lod in Israel, founded in 1949.</li>
<li><b>The Kinus:</b> the annual Kinus HaShluchim, the international conference of shluchim, with a famous group photo.</li>
<li><b>"Where's your shlichus?"</b> A question often asked of young married couples.</li>
<li><b>Tzivos Hashem:</b> the Rebbe's children's organization: "the army of Hashem".</li>
<li><b>Tanya's page numbers:</b> chassidim sometimes refer to a Tanya passage by page number (daf) in the standard edition.</li>
<li><b>"Lechatchila ariber!":</b> said jokingly when someone climbs over something.</li>
<li><b>"Nu, Moshiach?":</b> a friendly nudge.</li>
</ul>
<p><b>Mayanot specifics.</b> Every yeshiva has its own culture and in-jokes: teachers' sayings, local traditions. Pick them up by listening. Ask when you don't understand; bochurim like explaining.</p>
<p><b>Careful.</b> Some slogans and references carry political or ideological weight within Chabad. Don't adopt them before you understand them. Ask Zalmy.</p>`,
    terms: [
      { t: "770", h: "", m: "Chabad headquarters in Crown Heights" },
      { t: "Paratzta", h: "פרצת", m: "\"You shall spread out\": gematria 770" },
      { t: "Kfar Chabad", h: "כפר חב״ד", m: "The Chabad village in Israel" },
      { t: "Kinus HaShluchim", h: "כינוס השלוחים", m: "The international conference of shluchim" },
      { t: "Gematria", h: "גימטריא", m: "The numerical value of Hebrew letters" }
    ],
    source: "Common Chabad usage; Bereishis 28:14",
    doToday: "Calculate the gematria of פרצת yourself: פ=80, ר=200, צ=90, ת=400.",
    quiz: [
      { id: "m13-7-q1", t: "mc", q: "The gematria of \"paratzta\" (פרצת) is:", o: ["770", "613", "26", "18"], a: 0, x: "80 + 200 + 90 + 400 = 770." },
      { id: "m13-7-q2", t: "mc", q: "Kfar Chabad is:", o: ["A Chabad village in Israel", "A neighborhood in Brooklyn", "A yeshiva", "A camp"], a: 0, x: "Near Lod, founded 1949." },
      { id: "m13-7-q3", t: "mc", q: "The Kinus HaShluchim is:", o: ["The international conference of shluchim", "A farbrengen", "A niggun", "A holiday"], a: 0, x: "Annual." },
      { id: "m13-7-q4", t: "mc", q: "Tzivos Hashem is:", o: ["The Rebbe's children's organization", "An army unit", "A yeshiva", "A book"], a: 0, x: "\"The army of Hashem\"." },
      { id: "m13-7-q5", t: "tf", q: "You should adopt every Chabad slogan you hear immediately.", a: false, x: "False. Understand it first; ask Zalmy." }
    ],
    deeper: [
      { id: "m13-7-d1", t: "recall", q: "Why is the 770 gematria meaningful to chassidim?", model: "It links the Rebbe's headquarters to \"ufaratzta\", the verse of spreading out in every direction, which describes the Rebbe's mission of shlichus from 770 to the whole world.", x: "A playful but meaningful connection." }
    ],
    reflect: "Which references have you heard at Mayanot that you didn't understand? Ask about one this week.",
    sayIt: { phrase: "Paratzta is 770.", h: "פרצת", meaning: "The gematria link between 770 and spreading out.", when: "When someone asks why 770 is special." }
  },
  {
    id: "m13-8", title: "When not to use them", minutes: 5, intro: false,
    teach: `
<p><b>The point of this module</b> was that you actually understand what you're saying. This last lesson is about using that knowledge well.</p>
<p><b>Don't use it as a costume.</b> Dropping Yiddishisms and quotes to seem more Chabad than you are is chitzoniyus. Chassidim can tell, and it doesn't help you grow. Use phrases when they come naturally and when you understand them.</p>
<p><b>Know your audience.</b></p>
<ul>
<li><b>With friends from home or non-religious family:</b> translate. "Baruch Hashem" is fine; "I'm working on my iskafya" needs explaining, or other words.</li>
<li><b>With customers and business contacts:</b> keep it professional. "B'ezras Hashem" in a business email may or may not fit. Judge each case.</li>
<li><b>With other Orthodox Jews who aren't Chabad:</b> some terms, like "the Rebbe" alone, mean something different to them. Be clear.</li>
</ul>
<p><b>Don't correct people publicly.</b> If someone mispronounces or misuses a term, it's rarely worth correcting unless they ask. Ahavas Yisrael beats being right.</p>
<p><b>Humility.</b> You're 18, a few months into this. Speak with confidence about what you know, and say "I'm not sure" about what you don't. That's exactly what the Rebbe modeled: "If you know alef, teach alef", and not more.</p>
<p><b>The real test.</b> Not how you talk at a farbrengen, but how you act on Sunday: in business, with friends, in davening. Speech follows.</p>`,
    terms: [
      { t: "Chitzoniyus", h: "חיצוניות", m: "Externality" },
      { t: "Anavah", h: "ענוה", m: "Humility" },
      { t: "Derech eretz", h: "דרך ארץ", m: "Proper conduct, manners" },
      { t: "Kavod habriyos", h: "כבוד הבריות", m: "Respect for people" }
    ],
    source: "Avos 1:17 (\"not the study but the deed is the main thing\"); the general Chassidic emphasis on pnimiyus",
    doToday: "Notice one moment today where a Chabad phrase came to mind, and ask yourself whether it would have helped or just sounded good.",
    quiz: [
      { id: "m13-8-q1", t: "mc", q: "Using Chabad phrases to seem more Chassidish than you are is:", o: ["Chitzoniyus", "Pnimiyus", "Ahavas Yisrael", "Required"], a: 0, x: "Surface without substance." },
      { id: "m13-8-q2", t: "mc", q: "Someone misuses a Chabad term. Best response:", o: ["Usually let it go, unless asked", "Correct them publicly", "Laugh", "Ignore them afterward"], a: 0, x: "Ahavas Yisrael beats being right." },
      { id: "m13-8-q3", t: "recall", q: "What's the real test of this module?", model: "How you act (in business, with friends, in davening), not how you talk at a farbrengen.", x: "\"The deed is the main thing\" (Avos 1:17)." },
      { id: "m13-8-q4", t: "tf", q: "With non-religious friends, it's better to translate Chassidic terms.", a: true, x: "Know your audience." },
      { id: "m13-8-q5", t: "mc", q: "\"Not the study but the deed is the main thing\" is from:", o: ["Avos 1:17", "Tanya", "Hayom Yom", "Shabbos 31a"], a: 0, x: "Avos 1:17." }
    ],
    deeper: [
      { id: "m13-8-d1", t: "recall", q: "When is it appropriate to say \"I'm not sure\"?", model: "Whenever you don't actually know, especially about halacha or sources. It's honest, and it shows the humility the Rebbe modeled.", x: "And then ask Zalmy." }
    ],
    reflect: "After everything in this course, what's changed in how you live, not just how you talk?",
    sayIt: { phrase: "I'm not sure. Let me ask.", h: "", meaning: "Honesty about what you don't know.", when: "Any time it's true." }
  }
]);
