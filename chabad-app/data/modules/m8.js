/* Module 8: Tanya and Chassidus */
CP_LESSONS("m8", [
  {
    id: "m8-1", title: "Tanya ch. 1: tzaddik, rasha, beinoni", minutes: 5, intro: false,
    teach: `
<p><b>The opening.</b> Tanya begins with a teaching from the Gemara (Niddah 30b): before a soul is born, it's made to swear: "Be a tzaddik and don't be a rasha. Even if the whole world tells you that you're a tzaddik, consider yourself a rasha."</p>
<p><b>The problems.</b> The Alter Rebbe asks two questions:</p>
<ul>
<li>The Mishnah (Avos 2:13) says "don't be wicked in your own eyes". So how can you be told to consider yourself a rasha?</li>
<li>If a person considers himself a rasha, he'll become depressed and won't serve Hashem with joy.</li>
</ul>
<p>He also cites the Gemara (Berachos 61b): "Beinonim are judged by both" (both inclinations). Rabbah said of himself, "I am a beinoni." Abaye answered, "then the master leaves no life for anyone". If Rabbah, a great sage, was "only" a beinoni, the category clearly doesn't mean half good deeds and half bad.</p>
<p><b>So what is a beinoni?</b> Not someone with half mitzvos and half aveiros. That's a common misunderstanding, and you gave it in the interview. The Alter Rebbe will define the terms carefully by chapter 12. That's why Tanya's formal name is <i>Sefer shel Beinonim</i>, "the book of the intermediates": it's written for the beinoni.</p>
<p><b>The key to everything: two souls.</b> Quoting Rabbi Chaim Vital, the Alter Rebbe explains that every Jew has two souls:</p>
<ul>
<li><b>The animal soul</b> (nefesh habehamis): from kelipas noga, the source of natural drives and traits. It lives in the blood and gives life to the body.</li>
<li><b>The G-dly soul</b> (nefesh Elokis), explained in chapter 2.</li>
</ul>
<p>The animal soul isn't evil in itself. It's natural energy, which can go either way.</p>`,
    terms: [
      { t: "Tzaddik", h: "צדיק", m: "A righteous person, precisely defined in Tanya ch. 10" },
      { t: "Rasha", h: "רשע", m: "A wicked person, precisely defined in ch. 11" },
      { t: "Beinoni", h: "בינוני", m: "\"Intermediate\", precisely defined in ch. 12" },
      { t: "Sefer shel Beinonim", h: "ספר של בינונים", m: "\"The book of intermediates\": a name for Tanya" },
      { t: "Nefesh habehamis", h: "נפש הבהמית", m: "The animal soul" },
      { t: "Kelipas noga", h: "קליפת נוגה", m: "\"The glowing shell\": a neutral realm that can be elevated" }
    ],
    source: "Tanya ch. 1; Niddah 30b; Avos 2:13; Berachos 61b",
    doToday: "Read Tanya ch. 1 (in English on chabad.org if needed). It takes about 10 minutes.",
    quiz: [
      { id: "m8-1-q1", t: "mc", q: "What oath does Tanya open with?", o: ["Be a tzaddik, not a rasha; even if everyone calls you a tzaddik, see yourself as a rasha", "Keep Shabbos", "Learn Torah day and night", "Love every Jew"], a: 0, x: "Niddah 30b." },
      { id: "m8-1-q2", t: "tf", q: "A beinoni is someone with half mitzvos and half aveiros.", a: false, x: "False. Tanya rejects that definition. Rabbah called himself a beinoni." },
      { id: "m8-1-q3", t: "mc", q: "Tanya's formal name, \"Sefer shel Beinonim\", means it's written for:", o: ["The intermediate person", "Tzaddikim", "Resha'im", "Rabbis"], a: 0, x: "A practical book for the rest of us." },
      { id: "m8-1-q4", t: "recall", q: "Which two souls does every Jew have?", model: "The animal soul (nefesh habehamis) and the G-dly soul (nefesh Elokis).", x: "Tanya ch. 1 to 2, quoting Rabbi Chaim Vital." },
      { id: "m8-1-q5", t: "mc", q: "The animal soul comes from:", o: ["Kelipas noga", "The three impure kelipos", "Chochmah", "The angels"], a: 0, x: "For Jews, the animal soul is from noga." },
      { id: "m8-1-q6", t: "mc", q: "Why is Rabbah's claim \"I am a beinoni\" significant?", o: ["A great sage wouldn't have half aveiros, so beinoni must mean something else", "He was humble", "He was a tzaddik", "It isn't significant"], a: 0, x: "The question that launches Tanya." }
    ],
    deeper: [
      { id: "m8-1-d1", t: "recall", q: "How does the Alter Rebbe resolve the contradiction between \"consider yourself a rasha\" and \"don't be wicked in your own eyes\"?", model: "(Answered later, in ch. 13 and ch. 29.) The beinoni's evil remains fully alive in him; he should realize his heart isn't pure, and that the evil in him could act. This is humility about his inner state, not a verdict that he is wicked. It doesn't cause depression, because it's paired with joy in his G-dly soul.", x: "Look ahead to ch. 13 and ch. 29." }
    ],
    reflect: "In the interview you thought a beinoni sins and repents. Knowing now that the bar is higher, how does that land?",
    sayIt: { phrase: "Tanya is the Sefer shel Beinonim.", h: "ספר של בינונים", meaning: "It's written for the intermediate person, not the tzaddik.", when: "When someone assumes Tanya is only for spiritual giants." }
  },
  {
    id: "m8-2", title: "Tanya ch. 2: the G-dly soul", minutes: 5, intro: false,
    teach: `
<p><b>"A part of G-d above, literally."</b> Chapter 2 opens: the second soul of a Jew is "chelek Eloka mimaal mamash", a part of G-d above, literally (based on Iyov 31:2). The Alter Rebbe adds "mamash", literally, to make clear it isn't a metaphor.</p>
<p><b>The analogy.</b> A child comes from the father's brain (as understood in the Alter Rebbe's time). The child is a separate person, yet his essence is drawn from the father's mind. So too, the soul is drawn from Hashem's "Chochmah": it remains connected to its source even after descending into a body.</p>
<p><b>Every Jew.</b> Even the soul of the simplest Jew is rooted in Hashem's Chochmah. Souls differ in their level and in the "garment" through which they come down, but the root is the same. Chassidus sees every Jew this way, which is the basis of Chabad ahavas Yisrael and of mivtzoyim. The man on the street you offer tefillin to has a soul that is literally part of G-d.</p>
<p><b>Connecting to tzaddikim.</b> The chapter also explains that simpler souls receive life through their connection to the souls of great Torah scholars and tzaddikim, their "head". That's one source of the Chassidic idea of connection to a Rebbe.</p>`,
    terms: [
      { t: "Nefesh Elokis", h: "נפש אלקית", m: "The G-dly soul" },
      { t: "Chelek Eloka mimaal mamash", h: "חלק אלוה ממעל ממש", m: "\"A part of G-d above, literally\"" },
      { t: "Mamash", h: "ממש", m: "Literally, actually" },
      { t: "Shoresh", h: "שורש", m: "Root, source" }
    ],
    source: "Tanya ch. 2; Iyov 31:2",
    doToday: "Say to yourself once before Shacharis: \"My soul is literally a part of G-d.\" Then say it about the person you find hardest to like.",
    quiz: [
      { id: "m8-2-q1", t: "recall", q: "How does Tanya ch. 2 describe the G-dly soul?", model: "\"Chelek Eloka mimaal mamash\": a part of G-d above, literally.", x: "Based on Iyov 31:2." },
      { id: "m8-2-q2", t: "mc", q: "Why does the Alter Rebbe add the word \"mamash\"?", o: ["To show it's literal, not a metaphor", "For rhythm", "It's in the verse", "To mean \"very\""], a: 0, x: "The soul's essence is truly G-dly." },
      { id: "m8-2-q3", t: "mc", q: "The analogy in ch. 2 is:", o: ["A child drawn from the father's mind", "A candle from a flame", "A king and servant", "Water from a spring"], a: 0, x: "Separate, yet rooted in the source." },
      { id: "m8-2-q4", t: "tf", q: "Only scholars' souls are rooted in Hashem's Chochmah.", a: false, x: "False. Even the simplest Jew's soul is rooted there." },
      { id: "m8-2-q5", t: "mc", q: "How does ch. 2 relate to mivtzoyim?", o: ["Every Jew's soul is part of G-d, so every Jew matters", "It doesn't", "Only observant Jews matter", "It's about Moshiach"], a: 0, x: "The basis for reaching every Jew." }
    ],
    deeper: [
      { id: "m8-2-d1", t: "recall", q: "If the soul is part of G-d, how can a Jew sin?", model: "The G-dly soul itself doesn't want to sin, but it's clothed in a body alongside the animal soul, which has its own drives. The person chooses which to follow. (Tanya ch. 9 to 12 develop this.)", x: "The battle is between the two souls." }
    ],
    reflect: "If every friend back home has a soul that is literally part of G-d, what changes in how you talk to them about Yiddishkeit?",
    sayIt: { phrase: "Chelek Eloka mimaal mamash.", h: "חלק אלוה ממעל ממש", meaning: "A part of G-d above, literally: the G-dly soul.", when: "At a farbrengen, or when explaining why every Jew matters." }
  },
  {
    id: "m8-3", title: "Tanya ch. 3 to 5: the soul's powers and garments", minutes: 5, intro: false,
    teach: `
<p><b>Ch. 3: ten powers.</b> Each soul has ten powers, like the ten sefiros:</p>
<ul>
<li><b>Three intellectual:</b> Chochmah, Binah, Daas.</li>
<li><b>Seven emotional:</b> love (Chesed), fear (Gevurah), compassion (Tiferes), and the rest.</li>
</ul>
<p>Love and fear of Hashem are "born" from the intellect: contemplating Hashem's greatness produces them, and Daas holds the contemplation firmly enough to generate real emotion. (Module 1 covered this.)</p>
<p><b>Ch. 4: three garments.</b> The soul expresses itself through three "garments":</p>
<ul>
<li><b>Thought:</b> thinking and learning Torah.</li>
<li><b>Speech:</b> speaking Torah and davening.</li>
<li><b>Action:</b> doing mitzvos.</li>
</ul>
<p>When these garments are "dressed" in Torah and mitzvos, which are Hashem's will and wisdom, the soul is united with Hashem. The Alter Rebbe's analogy: embracing a king, even through his clothing, is embracing the king.</p>
<p><b>Ch. 5: the wondrous union.</b> When you understand a halacha, your mind grasps it and is also encompassed by it. Since the halacha is Hashem's wisdom, knowing it creates a unique unity: "a wondrous union, like none other". This is why Torah study is so central.</p>
<p><b>For you.</b> Learning a Rambam or a halacha about brachos is literally a union with Hashem's wisdom, not "just information".</p>`,
    terms: [
      { t: "Levushim", h: "לבושים", m: "Garments: thought, speech, action" },
      { t: "Machshavah, dibbur, maaseh", h: "מחשבה, דבור, מעשה", m: "Thought, speech, action" },
      { t: "Yichud nifla", h: "יחוד נפלא", m: "\"A wondrous union\" of mind and Torah" },
      { t: "Ratzon", h: "רצון", m: "Will" }
    ],
    source: "Tanya ch. 3 to 5",
    doToday: "Learn one halacha today and think while learning it: this is Hashem's wisdom, and I'm uniting with it.",
    quiz: [
      { id: "m8-3-q1", t: "recall", q: "Name the soul's three garments.", model: "Thought, speech, action.", x: "Tanya ch. 4." },
      { id: "m8-3-q2", t: "mc", q: "What's the analogy for uniting with Hashem through mitzvos?", o: ["Embracing a king even through his garments", "Drinking water", "A father and son", "A ladder"], a: 0, x: "Ch. 4." },
      { id: "m8-3-q3", t: "mc", q: "Why is knowing Torah a unique union?", o: ["The mind grasps Hashem's wisdom and is encompassed by it", "It's hard", "It's written in Hebrew", "It takes time"], a: 0, x: "Ch. 5: \"a wondrous union\"." },
      { id: "m8-3-q4", t: "mc", q: "How are love and fear of Hashem produced, per ch. 3?", o: ["By contemplating Hashem's greatness", "They're innate only", "Through fasting", "By singing"], a: 0, x: "Intellect produces emotion." },
      { id: "m8-3-q5", t: "tf", q: "The soul has ten powers: three intellectual and seven emotional.", a: true, x: "Ch. 3." }
    ],
    deeper: [
      { id: "m8-3-d1", t: "recall", q: "Why are the three garments called \"garments\" and not the soul itself?", model: "Like clothes, they can be put on and taken off and changed: a person can think, speak, or act on anything. They express the soul outwardly, while the ten powers are the soul's inner essence.", x: "Ch. 4." }
    ],
    reflect: "How much of your thought, speech, and action each day is \"dressed\" in Torah? Rough percentage?",
    sayIt: { phrase: "It's a yichud nifla.", h: "יחוד נפלא", meaning: "The wondrous union of mind and Torah.", when: "When explaining why learning halacha isn't \"just information\"." }
  },
  {
    id: "m8-4", title: "Tanya ch. 6 to 8: kelipah and the animal soul", minutes: 5, intro: false,
    teach: `
<p><b>Ch. 6: the other side.</b> Just as holiness has ten powers and three garments, so does the "other side", the <i>sitra achra</i>, or <i>kelipah</i> ("shell"). Kelipah is anything that feels itself as separate from Hashem. It's called a shell because it conceals the G-dly energy inside.</p>
<p><b>Two kinds of kelipah.</b></p>
<ul>
<li><b>The three completely impure kelipos:</b> the source of forbidden things. They can't be elevated directly.</li>
<li><b>Kelipas noga:</b> the "glowing shell". It's neutral, the source of permitted things, and of the animal soul of a Jew.</li>
</ul>
<p><b>Ch. 7: elevating the permitted.</b> When you eat permitted food (kelipas noga) with the intention of serving Hashem, with the energy used for Torah, davening, or mitzvos, that energy is elevated to holiness. If you eat for pure indulgence, it stays in noga, and becomes a "dirt" that needs cleansing (until teshuvah). The same food, two outcomes, depending on why you eat.</p>
<p><b>Ch. 8: forbidden things.</b> Forbidden foods are called <i>asurim</i>, "bound", because the energy in them is bound and can't be elevated through eating them. That's why aveiros damage the soul more deeply.</p>
<p><b>For you.</b> The gym, eating clean, sleeping well, and running a business are all kelipas noga. Done for their own sake, they stay neutral. Done so you have strength, clarity, and resources to serve Hashem, they're elevated. Same squat, different spiritual result.</p>`,
    terms: [
      { t: "Kelipah", h: "קליפה", m: "\"Shell\": what conceals G-dliness" },
      { t: "Sitra achra", h: "סטרא אחרא", m: "\"The other side\": the opposite of holiness" },
      { t: "Kelipas noga", h: "קליפת נוגה", m: "The neutral, elevatable shell" },
      { t: "Asurim", h: "אסורים", m: "Forbidden, literally \"bound\"" },
      { t: "L'shem shamayim", h: "לשם שמים", m: "For the sake of Heaven" }
    ],
    source: "Tanya ch. 6 to 8",
    doToday: "Before your next workout, say (in your head) why you're training: strength and health to serve Hashem. Do the same before one meal.",
    quiz: [
      { id: "m8-4-q1", t: "mc", q: "Permitted things come from:", o: ["Kelipas noga", "The three impure kelipos", "Holiness directly", "Nowhere"], a: 0, x: "Ch. 7." },
      { id: "m8-4-q2", t: "mc", q: "Eating permitted food purely for indulgence:", o: ["Keeps the energy in noga", "Elevates it", "Is forbidden", "Is a mitzvah"], a: 0, x: "Intention determines the result." },
      { id: "m8-4-q3", t: "recall", q: "Why are forbidden things called \"asurim\"?", model: "It literally means \"bound\": the G-dly energy in them is bound by the impure kelipos and can't be elevated through use.", x: "Ch. 7 and 8." },
      { id: "m8-4-q4", t: "mc", q: "Why is it called a \"shell\"?", o: ["It conceals the G-dly energy inside", "It's hard", "It's outside the body", "It protects holiness"], a: 0, x: "Like a peel covering fruit." },
      { id: "m8-4-q5", t: "scenario", q: "Training in the gym so you have energy to learn and daven well:", o: ["Elevates the activity to holiness", "Stays neutral", "Is kelipah", "Is forbidden"], a: 0, x: "Kelipas noga used for Hashem is elevated." }
    ],
    deeper: [
      { id: "m8-4-d1", t: "recall", q: "Explain how the same meal can be elevated or not.", model: "Permitted food is from kelipas noga. If eaten with the intent that its energy will serve Hashem, and it does, the energy rises to holiness. If eaten for mere craving, it remains in noga.", x: "Tanya ch. 7." }
    ],
    reflect: "Where in your life is kelipas noga not yet elevated: training, business, social life? What single intention could change that?",
    sayIt: { phrase: "It's all kelipas noga: it depends what you do with it.", h: "קליפת נוגה", meaning: "Permitted things are neutral; intention elevates them.", when: "When someone asks whether Chassidim think the gym, food, or business are unspiritual." }
  },
  {
    id: "m8-5", title: "Tanya ch. 9: the battle for the body", minutes: 5, intro: false,
    teach: `
<p><b>Where each soul "lives".</b></p>
<ul>
<li><b>The animal soul:</b> in the left chamber of the heart, which is full of blood. It's the seat of natural desire.</li>
<li><b>The G-dly soul:</b> primarily in the brain, spreading to the right chamber of the heart, the seat of holy love and fear.</li>
</ul>
<p>Tanya uses the heart's anatomy as a map of the inner life.</p>
<p><b>A small city.</b> The Alter Rebbe cites Koheles 9:14: "a small city... and a great king came upon it". The body is the small city. Two kings, the G-dly soul and the animal soul, each want to rule it. Each wants its thoughts, speech, and actions to fill the body. Every moment, the question is who's in charge.</p>
<p><b>What each soul wants.</b></p>
<ul>
<li><b>The G-dly soul</b> wants to rule alone, so that the three garments are only for Hashem.</li>
<li><b>The animal soul</b> wants the opposite: that the body be driven by its desires.</li>
</ul>
<p><b>Why this matters.</b> Tanya reframes inner conflict. Feeling pulled in two directions isn't a sign that something's wrong with you. It's the normal situation of every Jew. What matters is who wins in action, speech, and thought.</p>
<p><b>For you.</b> The pull to check your phone during seder, or to skip Mincha for a customer, isn't weakness in you. It's the battle. You don't need to win every feeling. You need to win the decision.</p>`,
    terms: [
      { t: "Ir ketanah", h: "עיר קטנה", m: "\"A small city\": the body (Koheles 9:14)" },
      { t: "Chalal hasmali / hayemani", h: "חלל השמאלי / הימני", m: "The left / right chamber of the heart" },
      { t: "Milchamah", h: "מלחמה", m: "War, battle" }
    ],
    source: "Tanya ch. 9; Koheles 9:14",
    doToday: "Next time you feel a pull (phone, skipping something), name it: \"animal soul\". Then decide.",
    quiz: [
      { id: "m8-5-q1", t: "mc", q: "According to Tanya ch. 9, the animal soul resides in:", o: ["The left chamber of the heart", "The brain", "The right chamber", "The liver"], a: 0, x: "The chamber full of blood." },
      { id: "m8-5-q2", t: "mc", q: "The G-dly soul resides primarily in:", o: ["The brain, spreading to the right chamber of the heart", "The left chamber", "The hands", "Everywhere equally"], a: 0, x: "Ch. 9." },
      { id: "m8-5-q3", t: "recall", q: "What's the \"small city\" analogy?", model: "The body is a small city fought over by two kings, the G-dly soul and the animal soul, each wanting to control its thought, speech, and action.", x: "Koheles 9:14." },
      { id: "m8-5-q4", t: "tf", q: "Feeling pulled in two directions means something is wrong with you spiritually.", a: false, x: "False. It's the normal state; what matters is who wins in practice." },
      { id: "m8-5-q5", t: "mc", q: "What does each soul want?", o: ["To control the body's thoughts, speech, and action", "To leave the body", "To sleep", "Nothing"], a: 0, x: "Each wants to rule." }
    ],
    deeper: [
      { id: "m8-5-d1", t: "recall", q: "Why does Tanya say \"the G-dly soul wants to rule alone\"?", model: "Its goal is that all three garments be devoted only to Hashem, so that the animal soul itself is transformed and has no independent desire. (That's the tzaddik's level.)", x: "Ch. 9, leading into ch. 10." }
    ],
    reflect: "When is the animal soul strongest for you: late night, when stressed about business, or when tired after training?",
    sayIt: { phrase: "That's just the animal soul talking.", h: "", meaning: "Naming the pull without being ruled by it.", when: "Half-joking with a friend who's tempted to skip seder." }
  },
  {
    id: "m8-6", title: "Tanya ch. 10: the tzaddik", minutes: 5, intro: false,
    teach: `
<p><b>The definition.</b> A tzaddik is someone whose G-dly soul has won so completely that the evil in his animal soul has been transformed into good or expelled. He doesn't just control his desires. He doesn't have the negative desires anymore.</p>
<p><b>Two levels.</b></p>
<ul>
<li><b>Tzaddik gamur</b> (a complete tzaddik, "tzaddik v'tov lo"): all the evil has been transformed into good. He loves Hashem with an intense love that leaves no room for anything else.</li>
<li><b>Tzaddik she'eino gamur</b> (an incomplete tzaddik, "tzaddik v'ra lo"): a small trace of evil remains, nullified within the good, but not fully gone.</li>
</ul>
<p><b>Rare.</b> Tanya says complete tzaddikim are few. The Gemara says they are "few" (Sukkah 45b). The level isn't attainable by choice alone. It's partly a gift from Above.</p>
<p><b>Why this matters for you.</b> If being a tzaddik means having no inner struggle, then you're not one, and you're not supposed to be yet. That's freeing. Struggle isn't failure. It means you're in the category Tanya was written for.</p>
<p><b>Is'hapcha.</b> The tzaddik's avodah is transformation: turning darkness into light. That's lesson m8-12.</p>`,
    terms: [
      { t: "Tzaddik gamur", h: "צדיק גמור", m: "A complete tzaddik" },
      { t: "Tzaddik v'tov lo", h: "צדיק וטוב לו", m: "\"A tzaddik who has good\": the complete tzaddik" },
      { t: "Tzaddik v'ra lo", h: "צדיק ורע לו", m: "\"A tzaddik who has (some) evil\": the incomplete tzaddik" },
      { t: "Is'hapcha", h: "אתהפכא", m: "Transformation of evil to good" }
    ],
    source: "Tanya ch. 10; Berachos 7a; Sukkah 45b",
    doToday: "Write one sentence: \"I'm not a tzaddik, and that's the category Tanya expects. My job is ________.\"",
    quiz: [
      { id: "m8-6-q1", t: "mc", q: "A tzaddik, per Tanya ch. 10, is:", o: ["Someone whose evil inclination has been transformed or expelled", "Anyone who does many mitzvos", "Anyone who learns a lot", "A rabbi"], a: 0, x: "He doesn't want evil anymore." },
      { id: "m8-6-q2", t: "recall", q: "Distinguish tzaddik v'tov lo from tzaddik v'ra lo.", model: "Tzaddik v'tov lo: complete, with all evil transformed. Tzaddik v'ra lo: incomplete, with a trace of evil nullified but not fully gone.", x: "Tanya ch. 10." },
      { id: "m8-6-q3", t: "tf", q: "Anyone can become a complete tzaddik by deciding to.", a: false, x: "False. Tanya says it's rare and partly a gift." },
      { id: "m8-6-q4", t: "mc", q: "The tzaddik's avodah is:", o: ["Is'hapcha: transformation", "Iskafya: subduing", "Teshuvah only", "Silence"], a: 0, x: "Turning darkness into light." },
      { id: "m8-6-q5", t: "mc", q: "If you still struggle with desires, Tanya says you are:", o: ["Not a tzaddik, which is normal", "A rasha", "Failing", "Not Jewish enough"], a: 0, x: "Struggle is the beinoni's normal condition." }
    ],
    deeper: [
      { id: "m8-6-d1", t: "recall", q: "Why does Tanya define categories by inner state and not by deeds?", model: "Because the aim is to describe the soul's condition: whether evil still desires. Deeds alone can't distinguish a tzaddik from a beinoni, since neither sins.", x: "The core innovation of Tanya's definitions." }
    ],
    reflect: "Does it relieve you or frustrate you that the tzaddik level isn't simply reachable by effort?",
    sayIt: { phrase: "I'm not a tzaddik, and I'm not supposed to be yet.", h: "", meaning: "Tanya's realism about the tzaddik level.", when: "When a friend is beating himself up over still having desires." }
  },
  {
    id: "m8-7", title: "Tanya ch. 11: the rasha", minutes: 5, intro: false,
    teach: `
<p><b>The definition.</b> In Tanya's terms, a rasha is someone in whom the animal soul sometimes wins in action, speech, or thought: he actually sins.</p>
<p><b>Two levels.</b></p>
<ul>
<li><b>Rasha v'tov lo</b> ("a rasha who has good"): he sins, but the G-dly soul still has a voice. He feels regret, wants to do teshuvah, and may do a lot of good. Sometimes the evil wins, sometimes the good. <b>This is what you described in the interview as a beinoni.</b> Tanya calls it a type of rasha.</li>
<li><b>Rasha v'ra lo</b> ("a rasha who has evil"): the evil has taken over so fully that he has no regret, and the G-dly soul has almost no voice.</li>
</ul>
<p><b>Don't panic.</b> "Rasha" in Tanya is a technical category, not an insult or a verdict on your worth. The oath of chapter 1 says: consider yourself a rasha. Tanya's point is that most people, most of the time, move between these levels. The G-dly soul is never gone. It's "a part of G-d above", and teshuvah is always possible. Teshuvah immediately changes a person's status (Rambam, Hilchos Teshuvah 7).</p>
<p><b>The practical message.</b> One sin doesn't define you, but it matters. The goal is to stop the actual sinning in thought, speech, and action. That's the beinoni, chapter 12.</p>`,
    terms: [
      { t: "Rasha v'tov lo", h: "רשע וטוב לו", m: "A rasha in whom good still has a voice" },
      { t: "Rasha v'ra lo", h: "רשע ורע לו", m: "A rasha dominated by evil" },
      { t: "Charatah", h: "חרטה", m: "Regret" },
      { t: "Teshuvah", h: "תשובה", m: "Return to Hashem" }
    ],
    source: "Tanya ch. 11; Rambam, Hilchos Teshuvah ch. 7",
    doToday: "Identify one aveirah you tend to repeat (in speech, like lashon hara, or in action). Set one practical guardrail for it today.",
    quiz: [
      { id: "m8-7-q1", t: "mc", q: "Someone who sins sometimes and then regrets it is, in Tanya's terms:", o: ["A rasha v'tov lo", "A beinoni", "A tzaddik v'ra lo", "Neither"], a: 0, x: "The definition you gave in the interview." },
      { id: "m8-7-q2", t: "mc", q: "A rasha v'ra lo:", o: ["Has no regret; evil dominates", "Sins rarely", "Is a beinoni", "Is a tzaddik"], a: 0, x: "The G-dly soul has almost no voice." },
      { id: "m8-7-q3", t: "tf", q: "In Tanya, \"rasha\" is a final judgment of a person's worth.", a: false, x: "False. It's a technical category, and teshuvah changes it." },
      { id: "m8-7-q4", t: "mc", q: "Where does the Rambam discuss the power of teshuvah to change a person's status?", o: ["Hilchos Teshuvah ch. 7", "Hilchos Deos ch. 4", "Hilchos Shabbos ch. 1", "Hilchos Melachim ch. 11"], a: 0, x: "Rambam, Hilchos Teshuvah ch. 7." },
      { id: "m8-7-q5", t: "recall", q: "What's the practical goal after learning ch. 11?", model: "Stop actual sinning in thought, speech, and action: reach the level of beinoni.", x: "Leading into ch. 12." }
    ],
    deeper: [
      { id: "m8-7-d1", t: "recall", q: "Why doesn't calling oneself a rasha lead to depression, according to Tanya?", model: "Because it's paired with knowing your G-dly soul is part of Hashem, that teshuvah is always available, and with serving Hashem with joy. The humility is about the animal soul, not your essence. (Ch. 29 to 31 develop this.)", x: "Joy and humility coexist." }
    ],
    reflect: "Where are you a \"rasha v'tov lo\" right now? What's one area to move to beinoni?",
    sayIt: { phrase: "In Tanya terms, that's a rasha v'tov lo, not a beinoni.", h: "רשע וטוב לו", meaning: "Correcting the common misunderstanding of \"beinoni\".", when: "When someone casually says \"I'm a beinoni, I sin and do teshuvah\". Say it kindly." }
  },
  {
    id: "m8-8", title: "Tanya ch. 12: the beinoni", minutes: 5, intro: false,
    teach: `
<p><b>The definition.</b> A beinoni <b>never sins</b>: not in action, not in speech, and not in thought (meaning he never deliberately dwells on forbidden thoughts). He never has, and never will. Yet the evil in his animal soul is still fully alive. It still desires. He just never lets it act.</p>
<p><b>How.</b> The mind rules the heart by its nature: "moach shalit al halev". The beinoni's G-dly soul uses this at every moment. When a forbidden thought arises, he pushes it away immediately. He doesn't entertain it. The thought arising isn't a sin. Dwelling on it would be.</p>
<p><b>Ch. 13 and 14.</b> The beinoni is judged by both inclinations: his heart still has desires, but his actions are all governed by the good. Crucially, ch. 14 says: <b>the level of beinoni is attainable by every person, at every moment.</b> You can't choose to be a tzaddik, but you can choose to be a beinoni right now, in this hour.</p>
<p><b>Why Rabbah called himself a beinoni.</b> He didn't sin, but he still felt the pull. That's the beinoni.</p>
<p><b>For you.</b> The goal isn't to stop feeling the pull of the phone, of anger at a customer, or of lashon hara. The goal is that the pull never becomes a decision. Hour by hour. That's a realistic, daily avodah, and exactly what Tanya was written for.</p>`,
    terms: [
      { t: "Beinoni", h: "בינוני", m: "One who never sins, though his evil still desires" },
      { t: "Moach shalit al halev", h: "מוח שליט על הלב", m: "The mind rules the heart" },
      { t: "Hirhur", h: "הרהור", m: "A passing thought" },
      { t: "Kol adam", h: "כל אדם", m: "\"Every person\": the beinoni level is open to all" }
    ],
    source: "Tanya ch. 12 to 14",
    doToday: "Pick one hour today and be a beinoni for that hour: every forbidden thought pushed away immediately, no forbidden speech, no forbidden action.",
    quiz: [
      { id: "m8-8-q1", t: "mc", q: "A beinoni:", o: ["Never sins in action, speech, or thought, though the evil still desires", "Sins and repents", "Has no desires", "Has half mitzvos, half aveiros"], a: 0, x: "Tanya ch. 12." },
      { id: "m8-8-q2", t: "tf", q: "A forbidden thought arising in the mind is a sin for the beinoni.", a: false, x: "False. Dwelling on it would be. Pushing it away is the avodah." },
      { id: "m8-8-q3", t: "mc", q: "According to Tanya ch. 14, the beinoni level is:", o: ["Attainable by every person at every moment", "Only for tzaddikim", "Impossible", "Only for rabbis"], a: 0, x: "You can choose it right now." },
      { id: "m8-8-q4", t: "recall", q: "What makes it possible for the beinoni to control his heart?", model: "The mind naturally rules the heart (moach shalit al halev). The G-dly soul in the mind governs the thought, speech, and action, even while the heart desires.", x: "Tanya ch. 12." },
      { id: "m8-8-q5", t: "mc", q: "Why did Rabbah call himself a beinoni?", o: ["He never sinned but still felt the pull", "He sinned occasionally", "Out of false modesty", "He was joking"], a: 0, x: "Tanya's resolution of the question in ch. 1." }
    ],
    deeper: [
      { id: "m8-8-d1", t: "recall", q: "Why is the beinoni level choosable while the tzaddik level isn't?", model: "The beinoni's achievement is control of thought, speech, and action, which the mind can always govern. The tzaddik's is a change in the heart's desires themselves, which depends on factors beyond choice (and partly a gift from Above).", x: "Tanya ch. 14." }
    ],
    reflect: "In the interview you got this wrong. Now: what does being a beinoni look like in your specific day, hour by hour?",
    sayIt: { phrase: "Be a beinoni for the next hour.", h: "", meaning: "Tanya's practical avodah: control action, speech, and thought, now.", when: "At a farbrengen, or with a friend who's overwhelmed by big goals." }
  },
  {
    id: "m8-9", title: "Bittul", minutes: 5, intro: false,
    teach: `
<p><b>What it is.</b> <i>Bittul</i> is self-nullification. It isn't low self-esteem. It's the recognition that your existence, talents, and success come from Hashem and exist for Him.</p>
<p><b>Two levels.</b></p>
<ul>
<li><b>Bittul hayesh:</b> nullifying the ego. You still feel you exist, but you don't put yourself at the center, and you submit your will to Hashem's.</li>
<li><b>Bittul b'metzius:</b> total self-nullification. Feeling that, before Hashem, you don't exist as a separate thing at all.</li>
</ul>
<p><b>Why it matters.</b> Chassidus teaches that Hashem's presence can rest only where there's bittul. The Gemara says of the arrogant person, "I and he cannot dwell together" (Sotah 5a). Humility makes room for Hashem.</p>
<p><b>Moshe.</b> The Torah calls Moshe the humblest man (Bamidbar 12:3), yet he was the greatest leader. He knew his greatness, and knew it was a gift. Chassidus explains that true humility isn't denying your strengths. It's knowing that they're given to you, and that if someone else had them, he might use them better.</p>
<p><b>For you.</b> You co-own a business, you train hard, you're smart. Bittul doesn't mean downplaying any of that. It means holding it as a trust: success isn't your own achievement alone, and it exists for a purpose beyond you.</p>`,
    terms: [
      { t: "Bittul", h: "ביטול", m: "Self-nullification" },
      { t: "Bittul hayesh", h: "ביטול היש", m: "Nullifying the ego" },
      { t: "Bittul b'metzius", h: "ביטול במציאות", m: "Total self-nullification" },
      { t: "Yeshus", h: "ישות", m: "Ego, self-importance" },
      { t: "Anavah", h: "ענוה", m: "Humility" }
    ],
    source: "Sotah 5a; Bamidbar 12:3; Tanya ch. 6 (holiness as bittul, kelipah as yeshus); Shaar HaYichud VehaEmunah",
    doToday: "When you get credit for something today (business, the gym, a good answer in shiur), think silently: \"This is a gift.\"",
    quiz: [
      { id: "m8-9-q1", t: "mc", q: "Bittul means:", o: ["Recognizing everything you have comes from and is for Hashem", "Low self-esteem", "Doing nothing", "Being quiet"], a: 0, x: "Not self-deprecation." },
      { id: "m8-9-q2", t: "recall", q: "Distinguish bittul hayesh and bittul b'metzius.", model: "Bittul hayesh: nullifying the ego while still feeling you exist. Bittul b'metzius: feeling you don't exist as a separate thing before Hashem.", x: "Two levels." },
      { id: "m8-9-q3", t: "mc", q: "Hashem says of the arrogant person:", o: ["\"I and he cannot dwell together\"", "\"I will reward him\"", "\"He is like Moshe\"", "Nothing"], a: 0, x: "Sotah 5a." },
      { id: "m8-9-q4", t: "tf", q: "True humility means denying your talents.", a: false, x: "False. It means knowing they're a gift." },
      { id: "m8-9-q5", t: "mc", q: "Moshe was:", o: ["The humblest and the greatest", "Humble because he lacked talent", "Arrogant", "Not a leader"], a: 0, x: "Bamidbar 12:3." }
    ],
    deeper: [
      { id: "m8-9-d1", t: "recall", q: "How can Moshe be humble if he knew he was the greatest prophet?", model: "He recognized his gifts as given by Hashem, and felt that anyone else with the same gifts might have achieved more. His humility was about the source and the responsibility, not about the facts.", x: "A common Chassidic explanation." }
    ],
    reflect: "Where is your yeshus loudest: the business, the gym, your intellect? What would bittul look like there without losing your drive?",
    sayIt: { phrase: "It's a matter of bittul.", h: "ביטול", meaning: "The issue is ego.", when: "At a farbrengen, when discussing why someone can't take advice. Aim it at yourself first." }
  },
  {
    id: "m8-10", title: "Dirah b'tachtonim", minutes: 5, intro: false,
    teach: `
<p><b>Why did Hashem create the world?</b> The Midrash (Tanchuma, Naso 16) answers: "Hashem desired a dwelling place in the lower realms" (<i>dirah b'tachtonim</i>). Tanya ch. 36 builds on this. The purpose isn't the high spiritual worlds, where G-dliness is obvious. It's this physical world, the lowest, where G-dliness is most hidden. Hashem wants to be at home precisely here.</p>
<p><b>What "home" means.</b> In your own home, you're fully yourself: no masks, no formality. Making the world a home for Hashem means making the physical world a place where His essence is revealed. That happens through Torah and mitzvos done with physical things: tefillin of leather, tzedakah with money, Shabbos with food.</p>
<p><b>Why the lowest.</b> The lower the place, the greater the "light from darkness" when it's transformed. That's why Chassidus doesn't escape the world. It engages it.</p>
<p><b>Your life.</b></p>
<ul>
<li><b>The business:</b> honesty, Shabbos, maaser.</li>
<li><b>The gym:</b> strength for avodah.</li>
<li><b>Friendships:</b> ahavas Yisrael.</li>
<li><b>Future home:</b> a mikdash me'at.</li>
</ul>
<p>These are all the "lower realms". They aren't distractions from the purpose. They <i>are</i> the purpose, when done right.</p>
<p><b>Moshiach</b> is the completion: when the whole world is openly Hashem's home.</p>`,
    terms: [
      { t: "Dirah b'tachtonim", h: "דירה בתחתונים", m: "A dwelling in the lower realms" },
      { t: "Tachtonim", h: "תחתונים", m: "The lower realms" },
      { t: "Elyonim", h: "עליונים", m: "The higher realms" },
      { t: "Or mitoch choshech", h: "אור מתוך חושך", m: "Light from within darkness" }
    ],
    source: "Midrash Tanchuma, Naso 16; Tanya ch. 36 to 37",
    doToday: "Do one physical act today with dirah b'tachtonim in mind: give tzedakah from business income, or eat a meal with intention.",
    quiz: [
      { id: "m8-10-q1", t: "mc", q: "According to the Midrash, why did Hashem create the world?", o: ["He desired a dwelling in the lower realms", "For the angels", "For the Torah alone", "No reason given"], a: 0, x: "Tanchuma, Naso 16." },
      { id: "m8-10-q2", t: "mc", q: "Which Tanya chapter develops dirah b'tachtonim?", o: ["Ch. 36", "Ch. 1", "Ch. 12", "Ch. 50"], a: 0, x: "Ch. 36 to 37." },
      { id: "m8-10-q3", t: "recall", q: "Why the lowest world, not the higher ones?", model: "Because G-dliness is most hidden here, so revealing it here is the greatest transformation: light from within darkness. And Hashem desires it.", x: "Tanya ch. 36." },
      { id: "m8-10-q4", t: "tf", q: "Chassidus sees business and physical life as distractions from spiritual purpose.", a: false, x: "False. They're the arena of the purpose." },
      { id: "m8-10-q5", t: "mc", q: "How is the dwelling built?", o: ["Through Torah and mitzvos in the physical world", "Through meditation alone", "By leaving the world", "Through fasting"], a: 0, x: "Physical mitzvos." }
    ],
    deeper: [
      { id: "m8-10-d1", t: "recall", q: "What does \"home\" add beyond \"presence\"?", model: "In a home, a person is present with his essence, not just in a partial or formal way. Hashem wants His essence revealed here, not just some spiritual light.", x: "The Rebbe's frequent explanation." }
    ],
    reflect: "Which part of your life still feels \"outside\" the dirah: not yet connected to your Yiddishkeit?",
    sayIt: { phrase: "Dirah b'tachtonim.", h: "דירה בתחתונים", meaning: "Making the physical world a home for Hashem.", when: "When explaining why a chassid runs a business, trains, or goes on shlichus." }
  },
  {
    id: "m8-11", title: "Hashgacha pratis", minutes: 5, intro: false,
    teach: `
<p><b>The Baal Shem Tov's teaching.</b> Hashem's providence extends to every detail of creation. Not only people, but every leaf turning in the wind and every blade of grass is directed by Hashem for a purpose within the whole of creation. This is <i>hashgacha pratis</i>, individual providence.</p>
<p><b>The Rambam's view.</b> The Rambam (Moreh Nevuchim 3:17 to 18) held that individual providence applies to human beings, while other species are governed at the level of the species. The Baal Shem Tov's broader view is the Chassidic position, and Chabad follows it.</p>
<p><b>The consequence.</b> If everything is directed, then everything you see or hear has a message for you. The Baal Shem Tov taught that a person should learn a lesson in serving Hashem from everything he sees or hears. The Rebbe constantly drew lessons from events: news, technology, anything.</p>
<p><b>Practical.</b></p>
<ul>
<li><b>A lost customer, a delay, a random conversation:</b> not random. Ask what the lesson is, without becoming anxious or superstitious.</li>
<li><b>Meeting someone "by chance":</b> maybe you're meant to help him.</li>
<li><b>Hardship:</b> hashgacha pratis doesn't mean you'll understand why. It means it isn't meaningless.</li>
</ul>
<p><b>Balance.</b> It doesn't replace effort. Hashgacha pratis works through your hishtadlus, not instead of it.</p>`,
    terms: [
      { t: "Hashgacha pratis", h: "השגחה פרטית", m: "Individual Divine providence" },
      { t: "Hashgacha klalis", h: "השגחה כללית", m: "General providence, at the level of species" },
      { t: "Hishtadlus", h: "השתדלות", m: "Personal effort" },
      { t: "Horaah", h: "הוראה", m: "A lesson, an instruction" }
    ],
    source: "Teachings of the Baal Shem Tov (as recorded in Chassidic works and cited by the Rebbeim); Rambam, Moreh Nevuchim 3:17 to 18",
    doToday: "Pick one \"random\" event today and ask: what's the lesson for me? Write it in one line.",
    quiz: [
      { id: "m8-11-q1", t: "mc", q: "The Baal Shem Tov taught that Divine providence extends to:", o: ["Every detail, even a leaf in the wind", "Only humans", "Only Jews", "Only major events"], a: 0, x: "The Chassidic view." },
      { id: "m8-11-q2", t: "mc", q: "The Rambam's view:", o: ["Individual providence for humans; species-level for others", "The same as the Baal Shem Tov", "No providence", "Only for tzaddikim"], a: 0, x: "Moreh Nevuchim 3:17 to 18." },
      { id: "m8-11-q3", t: "recall", q: "What practical consequence follows from hashgacha pratis?", model: "Everything you see or hear has a lesson for your avodah; nothing is meaningless.", x: "The Baal Shem Tov's teaching." },
      { id: "m8-11-q4", t: "tf", q: "Hashgacha pratis means you don't need to make an effort.", a: false, x: "False. It works through hishtadlus." },
      { id: "m8-11-q5", t: "mc", q: "Which view does Chabad follow?", o: ["The Baal Shem Tov's", "The Rambam's", "Neither", "Both equally"], a: 0, x: "Chassidic position." }
    ],
    deeper: [
      { id: "m8-11-d1", t: "recall", q: "How is hashgacha pratis different from fatalism?", model: "Fatalism says your actions don't matter. Hashgacha pratis says every detail is directed with purpose, including your choices and effort, which remain free and meaningful.", x: "Free choice coexists with providence." }
    ],
    reflect: "What happened this week that you called \"random\"? What would it mean if it wasn't?",
    sayIt: { phrase: "Hashgacha pratis.", h: "השגחה פרטית", meaning: "It wasn't random: Divine providence.", when: "When you \"happen\" to meet exactly the person you needed." }
  },
  {
    id: "m8-12", title: "Iskafya vs. is'hapcha", minutes: 5, intro: false,
    teach: `
<p><b>Two modes of avodah.</b></p>
<ul>
<li><b>Iskafya</b> (Aramaic: subduing): the animal soul still wants something, and you override it. You don't act on the desire. This is the beinoni's avodah.</li>
<li><b>Is'hapcha</b> (Aramaic: transformation): the desire itself is transformed. The animal soul now wants the good. This is the tzaddik's avodah: turning darkness itself into light.</li>
</ul>
<p><b>The power of iskafya.</b> Tanya ch. 27 quotes the Zohar: "When the sitra achra is subdued, the glory of Hashem rises in all the worlds." Every single act of self-restraint, even small, causes great <i>nachas ruach</i> (satisfaction) Above, like a king enjoying a victory. Tanya says this even applies to permitted things: holding back from a permitted pleasure for a moment, for Hashem's sake, is iskafya.</p>
<p><b>Small iskafya.</b> Examples chassidim practice:</p>
<ul>
<li>Waiting a few minutes before eating when hungry.</li>
<li>Not saying the clever cutting remark.</li>
<li>Not checking the phone right away.</li>
<li>Pausing before answering an angry customer.</li>
</ul>
<p>Each one is a victory.</p>
<p><b>Why this is good news.</b> You don't need to feel holy to do something holy. Every time you push back the animal soul, even while still wanting what it wants, that's a win with cosmic significance.</p>`,
    terms: [
      { t: "Iskafya", h: "אתכפיא", m: "Subduing the animal soul" },
      { t: "Is'hapcha", h: "אתהפכא", m: "Transforming evil into good" },
      { t: "Nachas ruach", h: "נחת רוח", m: "Satisfaction, pleasure (Above)" },
      { t: "Sitra achra", h: "סטרא אחרא", m: "The \"other side\"" }
    ],
    source: "Tanya ch. 27; Zohar II, 128b (as quoted in Tanya)",
    doToday: "Do three small iskafya acts today (a delay before eating, not checking the phone, holding back a remark). Count them.",
    quiz: [
      { id: "m8-12-q1", t: "mc", q: "Iskafya means:", o: ["Subduing the animal soul", "Transforming evil", "Self-nullification", "Joy"], a: 0, x: "You still want it; you override it." },
      { id: "m8-12-q2", t: "mc", q: "Is'hapcha is the avodah of:", o: ["The tzaddik", "The beinoni", "The rasha", "Everyone equally"], a: 0, x: "Transformation." },
      { id: "m8-12-q3", t: "recall", q: "What does Tanya ch. 27 say about iskafya?", model: "Quoting the Zohar: when the sitra achra is subdued, Hashem's glory rises in all worlds. Every act of restraint causes great satisfaction Above, even with permitted things.", x: "Tanya ch. 27." },
      { id: "m8-12-q4", t: "tf", q: "Iskafya only counts if you don't feel the desire anymore.", a: false, x: "False. That would be is'hapcha. Iskafya is overriding it while you still want it." },
      { id: "m8-12-q5", t: "scenario", q: "You're hungry and wait 10 minutes before eating, for Hashem's sake. This is:", o: ["Iskafya", "Is'hapcha", "Pointless", "Forbidden"], a: 0, x: "Holding back even from a permitted thing." }
    ],
    deeper: [
      { id: "m8-12-d1", t: "recall", q: "Why does iskafya bring such satisfaction Above, if the person still desires?", model: "Because there's a real struggle and a real victory: the sitra achra, which has power, is subdued by choice. A victory over a real opponent is more precious than no opposition at all.", x: "The king's joy in victory (Tanya ch. 27)." }
    ],
    reflect: "Where would one daily iskafya make the biggest difference in your life?",
    sayIt: { phrase: "That's an iskafya.", h: "אתכפיא", meaning: "A small act of self-restraint, for Hashem.", when: "When a friend skips dessert or puts his phone away. Chassidim say it with a smile." }
  },
  {
    id: "m8-13", title: "Simcha", minutes: 5, intro: false,
    teach: `
<p><b>Why joy is essential.</b> Tanya ch. 26 says that to win the battle against the animal soul you need joy. The analogy: two people wrestling. If one is lazy and heavy, he'll lose, even if he's stronger. Sadness (<i>atzvus</i>) makes you sluggish and heavy. Joy makes you quick and strong.</p>
<p><b>Merirus vs. atzvus.</b> Tanya distinguishes between two feelings:</p>
<ul>
<li><b>Merirus</b> (bitterness): honest pain over a spiritual failing. It's active, it leads to change, and it's done at set times, like during a cheshbon hanefesh.</li>
<li><b>Atzvus</b> (sadness, depression): heavy and passive, leading nowhere. It comes from the animal soul, even when it looks religious.</li>
</ul>
<p>After the merirus, move to joy (Tanya ch. 31).</p>
<p><b>Sources of joy</b> (Tanya ch. 31 to 34):</p>
<ul>
<li>Your G-dly soul is part of Hashem.</li>
<li>Each mitzvah connects you to Him.</li>
<li>Hashem is truly everywhere. For a thinking person, that is itself deep joy (ch. 33).</li>
</ul>
<p><b>"Simcha poretz geder."</b> A well-known Chassidic saying: joy breaks through barriers. Obstacles that seem impossible when you're down can be broken through with joy.</p>
<p><b>For you.</b> You said: "No motivational filler." Tanya agrees. Simcha isn't hype. It's a disciplined state you build through thought, and it's what makes the discipline sustainable.</p>`,
    terms: [
      { t: "Simcha", h: "שמחה", m: "Joy" },
      { t: "Atzvus", h: "עצבות", m: "Sadness, depression" },
      { t: "Merirus", h: "מרירות", m: "Constructive bitterness over failings" },
      { t: "Simcha poretz geder", h: "שמחה פורץ גדר", m: "\"Joy breaks through barriers\"" }
    ],
    source: "Tanya ch. 26, 31 to 34",
    doToday: "Before Shacharis, 60 seconds: think of one real reason for joy from Tanya ch. 31 to 33, and daven from there.",
    quiz: [
      { id: "m8-13-q1", t: "mc", q: "Tanya ch. 26's analogy for why joy is needed:", o: ["Two wrestlers: the lazy, heavy one loses even if stronger", "A king and a servant", "A ladder", "A candle"], a: 0, x: "Sadness makes you sluggish." },
      { id: "m8-13-q2", t: "recall", q: "Distinguish merirus from atzvus.", model: "Merirus: active, constructive pain over failings that leads to change, done at set times. Atzvus: heavy, passive sadness that leads nowhere.", x: "Tanya ch. 26 and 31." },
      { id: "m8-13-q3", t: "tf", q: "Feeling sad about your spiritual state all day is a sign of piety.", a: false, x: "False. Atzvus comes from the animal soul." },
      { id: "m8-13-q4", t: "mc", q: "\"Simcha poretz geder\" means:", o: ["Joy breaks through barriers", "Joy is a fence", "Sadness protects", "Be careful with joy"], a: 0, x: "A well-known Chassidic saying." },
      { id: "m8-13-q5", t: "mc", q: "After merirus, Tanya says to:", o: ["Move to joy", "Stay sad", "Fast", "Stop davening"], a: 0, x: "Ch. 31." }
    ],
    deeper: [
      { id: "m8-13-d1", t: "recall", q: "Why is atzvus considered a tool of the animal soul even when it's about spiritual failure?", model: "It paralyzes: it makes you heavy, passive, and unable to fight, which serves the animal soul's goal. Genuine concern over failure (merirus) leads to action; atzvus doesn't.", x: "Tanya ch. 26 to 27." }
    ],
    reflect: "When you fail (a missed Mincha, a bad day in business), is your reaction merirus or atzvus?",
    sayIt: { phrase: "Simcha poretz geder.", h: "שמחה פורץ גדר", meaning: "Joy breaks through barriers.", when: "When a friend is stuck and down. Say it with real warmth." }
  },
  {
    id: "m8-14", title: "Emunah and bitachon", minutes: 5, intro: false,
    teach: `
<p><b>Emunah</b> is belief: knowing that Hashem exists, runs the world, and is good. It's innate in every Jew; Chassidus calls it the soul's inheritance.</p>
<p><b>Bitachon</b> is trust: relying on Hashem in a specific situation, with calm confidence that it will be good. The classic source is <i>Chovos HaLevavos</i>, Shaar HaBitachon. The Rebbe explained (in sichos, drawing on the Tzemach Tzedek's "Tracht gut vet zain gut") that bitachon means trusting that Hashem will do good in a visible, understandable way, even if you don't feel you deserve it. That trust is itself what draws the good.</p>
<p><b>Bitachon and effort.</b> Chassidus teaches that a person must make an effort (<i>hishtadlus</i>), because Hashem's blessing comes through a "vessel". "Hashem your G-d will bless you in all that you do" (Devarim 15:18): you do, and He blesses. But the effort is a vessel, not the source. Excess effort driven by anxiety shows a lack of bitachon.</p>
<p><b>For your business.</b></p>
<ul>
<li>Do the work honestly and well.</li>
<li>Keep Shabbos even when it costs something.</li>
<li>Give maaser.</li>
<li>Then trust. Don't check the booking dashboard 30 times a day.</li>
</ul>
<p>The Gemara (Beitzah 16a) says a person's income is set on Rosh Hashanah, except for what he spends on Shabbos, Yom Tov, and Torah for his children, which is added back.</p>`,
    terms: [
      { t: "Emunah", h: "אמונה", m: "Belief" },
      { t: "Bitachon", h: "ביטחון", m: "Trust" },
      { t: "Hishtadlus", h: "השתדלות", m: "Personal effort" },
      { t: "Keli", h: "כלי", m: "A vessel: the effort through which blessing comes" },
      { t: "Chovos HaLevavos", h: "חובות הלבבות", m: "\"Duties of the Heart\": a classic of Jewish ethics" }
    ],
    source: "Chovos HaLevavos, Shaar HaBitachon; Devarim 15:18; Beitzah 16a; the Rebbe's sichos on bitachon (Likkutei Sichos)",
    doToday: "Choose one business worry. Do the one practical step it needs, then say \"Tracht gut vet zain gut\" and don't revisit it today.",
    quiz: [
      { id: "m8-14-q1", t: "recall", q: "Distinguish emunah from bitachon.", model: "Emunah: belief that Hashem exists, runs the world, and is good. Bitachon: trust in a specific situation, with calm confidence that it will turn out visibly good.", x: "Belief vs. applied trust." },
      { id: "m8-14-q2", t: "mc", q: "The classic source on bitachon is:", o: ["Chovos HaLevavos, Shaar HaBitachon", "Tanya ch. 1", "Hayom Yom", "Mishnah Berurah"], a: 0, x: "By Rabbeinu Bachya." },
      { id: "m8-14-q3", t: "mc", q: "What's the role of hishtadlus?", o: ["A vessel for Hashem's blessing, not its source", "The source of success", "Unnecessary", "A lack of faith"], a: 0, x: "Devarim 15:18." },
      { id: "m8-14-q4", t: "mc", q: "According to Beitzah 16a, which expenses are \"added back\"?", o: ["Shabbos, Yom Tov, and children's Torah education", "Business expenses", "Taxes", "Vacations"], a: 0, x: "So Shabbos doesn't reduce your income." },
      { id: "m8-14-q5", t: "tf", q: "Checking the business dashboard anxiously all day shows strong bitachon.", a: false, x: "False. Anxious over-effort reflects a lack of bitachon." }
    ],
    deeper: [
      { id: "m8-14-d1", t: "recall", q: "How is bitachon itself a cause of good, per the Rebbe's explanation?", model: "Relying on Hashem completely, with calm confidence, is itself a spiritual act that draws down His kindness, even beyond what one might deserve (\"measure for measure\": trusting Him brings His trust-worthy response).", x: "Linked to \"Tracht gut vet zain gut\"." }
    ],
    reflect: "What's your real relationship to business worry? What would bitachon look like tomorrow morning when you open messages?",
    sayIt: { phrase: "I did my hishtadlus. Now it's bitachon.", h: "", meaning: "I made the effort; now I trust.", when: "With Ari, or a friend in business, when there's nothing more to do." }
  }
]);
