/* Module 9: Daily Learning */
CP_LESSONS("m9", [
  {
    id: "m9-1", title: "What Chitas and Rambam are", minutes: 5, intro: true,
    teach: `
<p><b>Chitas</b> (Chumash, Tehillim, Tanya) is the set of daily shiurim instituted by the Frierdiker Rebbe. The daily divisions are printed in <i>Hayom Yom</i>.</p>
<ul>
<li><b>Chumash with Rashi:</b> each day of the week, one aliyah of the weekly parsha. Sunday is the first aliyah, and Shabbos is the seventh. By Shabbos you've learned the whole parsha.</li>
<li><b>Tehillim:</b> the book is divided by the day of the month, so you finish all 150 chapters every month. In a 29-day month, you add day 30's portion on day 29. Chabad says it after Shacharis.</li>
<li><b>Tanya:</b> a short portion each day, so the whole Tanya is completed every year.</li>
</ul>
<p><b>Why.</b> The Frierdiker Rebbe taught that these daily shiurim protect a person and his household, and connect him to the Rebbe and to all chassidim learning the same portion that day. It's steady, daily, and small: that's the point.</p>
<p><b>Daily Rambam.</b> On Acharon shel Pesach 5744 (1984), the Rebbe called on every Jew to learn the Rambam's Mishneh Torah daily, which covers all of halacha. There are three tracks:</p>
<ul>
<li><b>3 chapters a day:</b> the whole Rambam in about a year.</li>
<li><b>1 chapter a day:</b> about three years.</li>
<li><b>Sefer HaMitzvos:</b> the Rambam's list of the 613 mitzvos, in parallel with the 1-chapter track. Meant for anyone, including those who find a chapter too much.</li>
</ul>
<p>The Rebbe stressed the unity of Jews worldwide learning the same material, and knowing all of Torah's laws.</p>
<p><b>Hayom Yom</b> itself is also read daily. It was compiled by the Rebbe in 1943 at the Frierdiker Rebbe's request: one short teaching or custom per day.</p>`,
    terms: [
      { t: "Chitas", h: "חת״ת", m: "Chumash, Tehillim, Tanya: the daily shiurim" },
      { t: "Shiurim", h: "שיעורים", m: "Set portions of learning" },
      { t: "Mishneh Torah", h: "משנה תורה", m: "The Rambam's code of all halacha (14 books)" },
      { t: "Sefer HaMitzvos", h: "ספר המצוות", m: "The Rambam's list of the 613 mitzvos" },
      { t: "Hayom Yom", h: "היום יום", m: "A daily book of Chabad teachings and customs (1943)" },
      { t: "Siyum", h: "סיום", m: "A celebration of completing a portion of Torah" }
    ],
    source: "Hayom Yom (introduction and daily divisions); the Rebbe's sicha of Acharon shel Pesach 5744 (on daily Rambam)",
    doToday: "Find today's Chitas, Rambam, and Hayom Yom on chabad.org (Daily Study) or a Chitas app. Just open them and look at the length.",
    quiz: [
      { id: "m9-1-q1", t: "recall", q: "What does Chitas stand for?", model: "Chumash (with Rashi), Tehillim, Tanya.", x: "You knew this in the interview." },
      { id: "m9-1-q2", t: "mc", q: "On Wednesday, which aliyah of the parsha do you learn?", o: ["The fourth", "The third", "The whole parsha", "The haftarah"], a: 0, x: "Sunday = 1, Monday = 2, Tuesday = 3, Wednesday = 4." },
      { id: "m9-1-q3", t: "mc", q: "Daily Rambam was instituted by:", o: ["The Rebbe, in 1984", "The Frierdiker Rebbe", "The Alter Rebbe", "The Rambam"], a: 0, x: "Acharon shel Pesach 5744." },
      { id: "m9-1-q4", t: "recall", q: "Name the three Rambam tracks.", model: "3 chapters a day (about a year); 1 chapter a day (about 3 years); Sefer HaMitzvos (parallel to the 1-chapter track).", x: "Pick one and stick with it." },
      { id: "m9-1-q5", t: "mc", q: "How is Tehillim divided in Chitas?", o: ["By the day of the month", "By the day of the week", "By the parsha", "Five chapters a day"], a: 0, x: "The whole book every month." },
      { id: "m9-1-q6", t: "tf", q: "Hayom Yom was compiled by the Rebbe.", a: true, x: "True, in 1943, at the Frierdiker Rebbe's request." }
    ],
    deeper: [
      { id: "m9-1-d1", t: "recall", q: "Why did the Rebbe emphasize everyone learning the same Rambam portion?", model: "It unites Jews worldwide in the same learning each day, and it gives every Jew a complete knowledge of all of Torah's laws, including those not practiced today.", x: "Both unity and completeness." }
    ],
    reflect: "You've heard of Chitas but haven't done it. What stopped you before? Time, not knowing where to find it, or not seeing the point?",
    sayIt: { phrase: "Did you do Chitas today?", h: "", meaning: "Have you learned today's Chumash, Tehillim, and Tanya?", when: "Every day in a Chabad yeshiva. It's an ordinary question." }
  },
  {
    id: "m9-2", title: "Stage 1: Tanya and Tehillim", minutes: 5, intro: false,
    teach: `
<p><b>Your time.</b> You said you have about 10 minutes at night. The app lesson takes 5. That leaves about 5 minutes, and Stage 1 fits into it.</p>
<p><b>Stage 1.</b></p>
<ul>
<li><b>Tanya, today's portion.</b> It's usually a short paragraph, a few minutes. Read it in Hebrew if you can, with a translation or a short explanation (chabad.org has both). Don't try to master it; aim for contact.</li>
<li><b>Tehillim, today's portion.</b> Chabad custom is after Shacharis, and that's the ideal. If your morning schedule doesn't allow it, say it at a steady time. It takes about 5 to 10 minutes; you can split it through the day.</li>
</ul>
<p><b>How to make it stick.</b></p>
<ul>
<li><b>Tie it to something fixed.</b> Tehillim right after Aleinu of Shacharis; Tanya right before or after the app lesson.</li>
<li><b>Log it in the Tracker.</b> Streaks work.</li>
<li><b>Minimum rule:</b> if a day is chaotic, one line of Tanya and one chapter of Tehillim still counts as not skipping. "Lechatchila ariber": never zero.</li>
</ul>
<p><b>When to move to Stage 2.</b> After about three weeks of steady daily Tanya and Tehillim, add Chumash.</p>`,
    terms: [
      { t: "Kvius", h: "קביעות", m: "A fixed, regular commitment to learning" },
      { t: "Shiur Tanya", h: "שיעור תניא", m: "The daily Tanya portion" },
      { t: "Tehillim yomi", h: "תהלים יומי", m: "The daily Tehillim portion" }
    ],
    source: "Hayom Yom (daily Tanya and Tehillim divisions); Shulchan Aruch HaRav, Hilchos Talmud Torah (on fixed times for learning)",
    doToday: "Do today's Tanya and today's Tehillim, and check them off in the Tracker.",
    quiz: [
      { id: "m9-2-q1", t: "mc", q: "Chabad custom for when to say the daily Tehillim:", o: ["After Shacharis", "Before sleep", "Only on Shabbos", "Before Mincha"], a: 0, x: "After Shacharis is the custom." },
      { id: "m9-2-q2", t: "mc", q: "What's the \"minimum rule\" on a chaotic day?", o: ["One line of Tanya and one chapter of Tehillim", "Skip and make it up later", "Double tomorrow", "Only Tehillim"], a: 0, x: "Never zero keeps the habit alive." },
      { id: "m9-2-q3", t: "tf", q: "You should master each Tanya portion before moving on.", a: false, x: "False. The goal is daily contact. Depth comes with time and a shiur." },
      { id: "m9-2-q4", t: "mc", q: "When should you add Chumash?", o: ["After about three weeks of steady Stage 1", "Right away", "Next year", "Never"], a: 0, x: "Build the habit first." },
      { id: "m9-2-q5", t: "recall", q: "What does kvius mean?", model: "A fixed, regular time for learning, kept consistently.", x: "Shulchan Aruch HaRav discusses setting fixed times for learning." }
    ],
    deeper: [
      { id: "m9-2-d1", t: "recall", q: "Why is a small daily portion better than a big weekly one?", model: "Consistency builds a real habit and daily connection. It also keeps Torah in your mind every day, and it's much harder to skip a small commitment.", x: "This is the logic of Chitas itself." }
    ],
    reflect: "Where in your day is the realistic anchor for Tehillim? Be specific: after which part of Shacharis, in which room?",
    sayIt: { phrase: "I'm on Stage 1: Tanya and Tehillim.", h: "", meaning: "Honest about where you're starting.", when: "When a friend asks if you do Chitas. Honesty beats pretending." }
  },
  {
    id: "m9-3", title: "Stage 2: Chumash with Rashi", minutes: 5, intro: false,
    teach: `
<p><b>What it is.</b> The day's aliyah of the parsha, with Rashi's commentary. Rashi (Rabbi Shlomo Yitzchaki, 1040 to 1105) explains the plain meaning of the text, drawing on the Midrash where it helps.</p>
<p><b>Why Rashi.</b> The Rebbe taught that Rashi on Chumash is written so that even a five-year-old can understand the plain meaning, and that it also contains "the wine of Torah", meaning deep secrets. For years the Rebbe gave detailed talks on Rashi's commentary, showing how every word answers a question.</p>
<p><b>How to learn it.</b></p>
<ol>
<li>Read the verse in Hebrew.</li>
<li>Ask yourself what's unclear or surprising about it.</li>
<li>Read Rashi and see what question he's answering.</li>
</ol>
<p>That's the Rebbe's approach. If your Hebrew slows you down, use a translation (chabad.org or a Kehot Chumash) side by side.</p>
<p><b>Time.</b> An aliyah with Rashi takes about 10 to 15 minutes. That's more than your nightly window, so it may need a slot in the day, like right after davening or during a break. Plan it realistically.</p>
<p><b>Shnayim mikra.</b> Separately from Chitas, there's the halacha of reading the parsha twice plus Targum each week (lesson m4-14). Many combine them.</p>`,
    terms: [
      { t: "Rashi", h: "רש״י", m: "Rabbi Shlomo Yitzchaki, the classic commentator" },
      { t: "Aliyah", h: "עלייה", m: "A section of the weekly parsha" },
      { t: "Pshat", h: "פשט", m: "The plain meaning of the text" },
      { t: "Yayin shel Torah", h: "יינה של תורה", m: "\"The wine of Torah\": deeper meanings hidden within Rashi" }
    ],
    source: "Hayom Yom (daily Chumash division); the Rebbe's talks on Rashi (Likkutei Sichos)",
    doToday: "Read today's aliyah with Rashi for just the first three verses. Find the question each Rashi answers.",
    quiz: [
      { id: "m9-3-q1", t: "mc", q: "Rashi's main goal on Chumash:", o: ["The plain meaning (pshat)", "Kabbalah", "Halacha only", "Grammar only"], a: 0, x: "Pshat, with Midrash where it helps." },
      { id: "m9-3-q2", t: "recall", q: "What's the Rebbe's approach to learning a Rashi?", model: "Identify what's difficult in the verse, then see what question Rashi is answering with each word.", x: "Every Rashi is an answer." },
      { id: "m9-3-q3", t: "mc", q: "How long does an aliyah with Rashi take, roughly?", o: ["10 to 15 minutes", "1 minute", "An hour", "A whole day"], a: 0, x: "Plan a real slot for it." },
      { id: "m9-3-q4", t: "tf", q: "Chitas Chumash and shnayim mikra are the same obligation.", a: false, x: "False. They're separate, though many combine them." },
      { id: "m9-3-q5", t: "mc", q: "Rashi lived in:", o: ["The 11th century, France", "The 12th century, Egypt", "The 16th century, Tzfas", "The 18th century, Poland"], a: 0, x: "1040 to 1105, Troyes." }
    ],
    deeper: [
      { id: "m9-3-d1", t: "recall", q: "What does \"the wine of Torah\" in Rashi mean?", model: "Beneath Rashi's plain-meaning explanations are deeper layers (halachic, Chassidic, even mystical) hinted in his exact wording.", x: "The Rebbe often explained these." }
    ],
    reflect: "When during the day could 15 minutes of Chumash happen for you? What would you cut to make room?",
    sayIt: { phrase: "What's bothering Rashi?", h: "", meaning: "The key question when learning a Rashi.", when: "In a chavrusa or shiur on Chumash." }
  },
  {
    id: "m9-4", title: "Stage 3: Rambam or Sefer HaMitzvos", minutes: 5, intro: false,
    teach: `
<p><b>Choosing a track.</b></p>
<ul>
<li><b>Sefer HaMitzvos:</b> a few minutes a day. You'll learn what each of the 613 mitzvos is. It's the most realistic start for you.</li>
<li><b>1 chapter a day:</b> 10 to 15 minutes. A real grasp of halacha across all topics over about three years.</li>
<li><b>3 chapters a day:</b> 30 to 45 minutes. The full cycle in a year, alongside the worldwide siyum.</li>
</ul>
<p><b>Start where you'll finish.</b> The Rebbe offered Sefer HaMitzvos exactly for people who couldn't do a chapter. It's the same cycle, and the same unity.</p>
<p><b>What you get.</b> The Rambam's code covers everything:</p>
<ul>
<li>Beliefs: Hilchos Yesodei HaTorah, the first section.</li>
<li>Character: Hilchos Deos, including his health guidance.</li>
<li>Business: Hilchos Mechirah and others.</li>
<li>The Beis HaMikdash, Moshiach, and more.</li>
</ul>
<p>Over time, you'll have seen every area of Torah law.</p>
<p><b>Your full plan.</b></p>
<ol>
<li><b>Stage 1:</b> Tanya and Tehillim (now).</li>
<li><b>Stage 2:</b> add Chumash (in about three weeks).</li>
<li><b>Stage 3:</b> add Sefer HaMitzvos, and later one chapter.</li>
</ol>
<p>Ask Zalmy which Rambam track Mayanot bochurim usually do, and whether there's a shiur you can join.</p>`,
    terms: [
      { t: "Perek", h: "פרק", m: "A chapter" },
      { t: "Hilchos Yesodei HaTorah", h: "הלכות יסודי התורה", m: "The Rambam's opening section: the foundations of belief" },
      { t: "Hilchos Deos", h: "הלכות דעות", m: "The Rambam's laws of character and health" },
      { t: "Siyum HaRambam", h: "סיום הרמב״ם", m: "The celebration completing the Rambam cycle" }
    ],
    source: "Rambam, Mishneh Torah and Sefer HaMitzvos; the Rebbe's sicha of Acharon shel Pesach 5744",
    doToday: "Read today's Sefer HaMitzvos portion once, just to see what it's like.",
    quiz: [
      { id: "m9-4-q1", t: "mc", q: "Which Rambam track is the Rebbe's option for people who can't do a chapter a day?", o: ["Sefer HaMitzvos", "3 chapters", "Rambam on Shabbos only", "None"], a: 0, x: "Same cycle, shorter daily learning." },
      { id: "m9-4-q2", t: "mc", q: "The Rambam's first section is:", o: ["Hilchos Yesodei HaTorah", "Hilchos Shabbos", "Hilchos Melachim", "Hilchos Deos"], a: 0, x: "The foundations of belief." },
      { id: "m9-4-q3", t: "tf", q: "The 3-chapter track completes the Rambam in about a year.", a: true, x: "True." },
      { id: "m9-4-q4", t: "recall", q: "What's your staged plan?", model: "Stage 1: Tanya and Tehillim. Stage 2: add Chumash with Rashi. Stage 3: add Sefer HaMitzvos, then a chapter of Rambam.", x: "Move up only after the previous stage is steady." },
      { id: "m9-4-q5", t: "mc", q: "Where are the Rambam's health guidelines?", o: ["Hilchos Deos", "Hilchos Shabbos", "Hilchos Tefillah", "Hilchos Melachim"], a: 0, x: "Chapter 4." }
    ],
    deeper: [
      { id: "m9-4-d1", t: "recall", q: "Why does the Rambam's code include laws of the Beis HaMikdash and Moshiach, which don't apply today?", model: "The Rambam codified all of Torah law as eternal. Learning those laws also connects us to the Beis HaMikdash, and the Rebbe taught that learning them is partly in place of, and a preparation for, their fulfillment.", x: "See the Rebbe's emphasis on learning Hilchos Beis HaBechirah during the Three Weeks." }
    ],
    reflect: "Picture yourself at a Siyum HaRambam a year or three from now. Which track can you honestly commit to?",
    sayIt: { phrase: "I'm doing Sefer HaMitzvos.", h: "ספר המצוות", meaning: "You're on the Rebbe's third Rambam track.", when: "When asked about Rambam. It's a respected track, not a lesser one." }
  }
]);
