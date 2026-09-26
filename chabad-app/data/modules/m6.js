/* Module 6: The Jewish Calendar */
CP_LESSONS("m6", [
  {
    id: "m6-1", title: "How the calendar works", minutes: 5, intro: true,
    teach: `
<p><b>Lunar months, solar years.</b> Each month starts with the new moon (the <i>molad</i>). A lunar month is about 29.5 days, so months are 29 or 30 days, and 12 of them make about 354 days, roughly 11 days short of a solar year. But the Torah requires Pesach in the spring (Devarim 16:1). So a leap month (Adar I) is added <b>7 times in 19 years</b>: years 3, 6, 8, 11, 14, 17, and 19 of the cycle.</p>
<p><b>This year.</b> 5787 is year 11 of its cycle, so <b>it's a leap year</b>. There are two Adars, and Purim is in Adar II.</p>
<p><b>History.</b> Originally the Sanhedrin declared each month based on witnesses, and decided leap years. Around 359 CE, as persecution threatened the Sanhedrin, Hillel II fixed the calculated calendar we use today. That's why chutz la'aretz keeps Yom Tov Sheni (Module 0).</p>
<p><b>Postponements.</b> Rosh Hashanah never falls on Sunday, Wednesday, or Friday ("lo ADU Rosh"). Among other things, this prevents Yom Kippur from falling next to Shabbos, and Hoshana Rabbah from falling on Shabbos.</p>
<p><b>The months.</b> Nissan is the first month for counting festivals (Shemos 12:2), but the year number changes on Rosh Hashanah, 1 Tishrei. The months are Tishrei, Cheshvan, Kislev, Teves, Shvat, Adar, Nissan, Iyar, Sivan, Tammuz, Av, Elul.</p>
<p><b>Days start at night.</b> "And it was evening and it was morning" (Bereishis 1:5).</p>`,
    terms: [
      { t: "Molad", h: "מולד", m: "The calculated moment of the new moon" },
      { t: "Shanah me'uberes", h: "שנה מעוברת", m: "A leap year" },
      { t: "Adar Rishon / Sheni", h: "אדר ראשון / שני", m: "Adar I / Adar II" },
      { t: "Lo ADU Rosh", h: "לא אד״ו ראש", m: "Rosh Hashanah is never on Sunday, Wednesday, or Friday" },
      { t: "Machzor", h: "מחזור", m: "A 19-year cycle" }
    ],
    source: "Shemos 12:2; Devarim 16:1; Rosh Hashanah 20a to 25b; Rambam, Hilchos Kiddush HaChodesh",
    doToday: "Look up today's Hebrew date and say it out loud at breakfast. The home screen shows it.",
    quiz: [
      { id: "m6-1-q1", t: "mc", q: "How many leap years are in a 19-year cycle?", o: ["7", "12", "3", "19"], a: 0, x: "Years 3, 6, 8, 11, 14, 17, 19." },
      { id: "m6-1-q2", t: "tf", q: "5787 is a leap year.", a: true, x: "True: it's year 11 of the cycle, so Purim is in Adar II." },
      { id: "m6-1-q3", t: "mc", q: "Why add leap months?", o: ["To keep Pesach in the spring", "For extra Purim", "Kabbalistic reasons", "Tradition only"], a: 0, x: "Devarim 16:1." },
      { id: "m6-1-q4", t: "mc", q: "Rosh Hashanah never falls on:", o: ["Sunday, Wednesday, or Friday", "Monday, Tuesday, or Thursday", "Shabbos", "Any day is possible"], a: 0, x: "\"Lo ADU Rosh\"." },
      { id: "m6-1-q5", t: "recall", q: "Who fixed the calculated calendar, and roughly when?", model: "Hillel II, around 359 CE.", x: "Replacing declaration by witnesses." },
      { id: "m6-1-q6", t: "mc", q: "The first month for counting the festivals is:", o: ["Nissan", "Tishrei", "Adar", "Elul"], a: 0, x: "Shemos 12:2." }
    ],
    deeper: [
      { id: "m6-1-d1", t: "recall", q: "Why can't Yom Kippur fall on a Friday or Sunday?", model: "It would create two consecutive days of Shabbos-level restrictions (no cooking, no burial of the dead), which the calendar rules avoid by postponing Rosh Hashanah.", x: "Rosh Hashanah 20a." }
    ],
    reflect: "Living by the Jewish calendar means your year has a different rhythm from the business's. How does that feel?",
    sayIt: { phrase: "It's a shanah me'uberes this year.", h: "שנה מעוברת", meaning: "A leap year: two Adars.", when: "When someone wonders why Purim is so late this year." }
  },
  {
    id: "m6-2", title: "Rosh Chodesh", minutes: 5, intro: false,
    teach: `
<p><b>What it is.</b> The first day of each month (or two days, when the previous month had 30 days: the 30th of the old month plus the 1st of the new). It's a minor festival.</p>
<p><b>Davening changes.</b></p>
<ul>
<li><b>Ya'aleh v'yavo</b> in the Amidah and in Birkas Hamazon.</li>
<li><b>Half Hallel</b> (some paragraphs are skipped).</li>
<li><b>A Torah reading</b> and <b>Musaf</b>.</li>
<li><b>No Tachanun.</b></li>
</ul>
<p>If you forget ya'aleh v'yavo at Shacharis or Mincha, you go back. At Maariv, you don't, since the month isn't sanctified at night (Shulchan Aruch 422:1).</p>
<p><b>Shabbos Mevarchim.</b> On the Shabbos before, the coming Rosh Chodesh is announced and blessed. Chabad says the whole Tehillim that morning (lesson m4-14).</p>
<p><b>Kiddush Levana.</b> The blessing on the renewing moon, said outside at night when the moon is visible, in the first half of the month after it has grown for some days. The Chabad custom is to say it on Motzei Shabbos when possible, in nice clothing, joyfully. Ask Zalmy for the exact window Chabad uses.</p>
<p><b>The idea.</b> The Jewish people are compared to the moon. It wanes and seems to disappear, then renews. Rosh Chodesh is a monthly reminder that renewal is always possible.</p>`,
    terms: [
      { t: "Rosh Chodesh", h: "ראש חודש", m: "The beginning of the month" },
      { t: "Ya'aleh v'yavo", h: "יעלה ויבא", m: "The prayer added on Rosh Chodesh and festivals" },
      { t: "Half Hallel", h: "חצי הלל", m: "Hallel with some paragraphs skipped" },
      { t: "Kiddush Levana", h: "קידוש לבנה", m: "The blessing on the new moon" },
      { t: "Shabbos Mevarchim", h: "שבת מברכים", m: "The Shabbos when the new month is blessed" }
    ],
    source: "Bamidbar 28:11 to 15; Sanhedrin 42a (Kiddush Levana); Shulchan Aruch, Orach Chaim 422 to 426",
    doToday: "Find the next Rosh Chodesh (Cheshvan) on a calendar, and set a reminder for ya'aleh v'yavo.",
    quiz: [
      { id: "m6-2-q1", t: "mc", q: "Forgot ya'aleh v'yavo at Maariv on Rosh Chodesh:", o: ["You don't repeat", "You repeat the Amidah", "Say it after Aleinu", "Say it in Shema"], a: 0, x: "SA 422:1." },
      { id: "m6-2-q2", t: "mc", q: "Forgot ya'aleh v'yavo at Shacharis on Rosh Chodesh:", o: ["Go back", "Don't go back", "Say it at Mincha only", "Nothing"], a: 0, x: "At Shacharis and Mincha you go back." },
      { id: "m6-2-q3", t: "recall", q: "What's added to davening on Rosh Chodesh?", model: "Ya'aleh v'yavo, half Hallel, a Torah reading, Musaf; Tachanun is omitted.", x: "Plus ya'aleh v'yavo in bentching." },
      { id: "m6-2-q4", t: "tf", q: "Chabad prefers saying Kiddush Levana on Motzei Shabbos when possible.", a: true, x: "True." },
      { id: "m6-2-q5", t: "mc", q: "The Jewish people are compared to:", o: ["The moon", "The sun", "The stars only", "The sea"], a: 0, x: "Renewing after waning." }
    ],
    deeper: [
      { id: "m6-2-d1", t: "recall", q: "Why is Rosh Chodesh sometimes two days?", model: "When the previous month has 30 days, the 30th day is observed as the first day of Rosh Chodesh, together with the 1st of the new month.", x: "The months alternate 29 and 30 days (with adjustments)." }
    ],
    reflect: "The moon renews every month. What would a monthly personal \"reset\" look like for you?",
    sayIt: { phrase: "Gut chodesh!", h: "א גוטן חודש", meaning: "\"A good month\": the Rosh Chodesh greeting.", when: "On Rosh Chodesh, to everyone." }
  },
  {
    id: "m6-3", title: "Chanukah", minutes: 5, intro: false,
    teach: `
<p><b>The story.</b> In the 2nd century BCE, the Greek-Syrian rulers tried to force Hellenism on the Jews, outlawing Shabbos, bris milah, and Rosh Chodesh. The Chashmonaim (Maccabees) revolted and retook the Beis HaMikdash. They found only one sealed jar of pure oil, enough for one day. It lasted eight (Shabbos 21b).</p>
<p><b>The mitzvah.</b> Light the menorah each night, adding one light each night, with brachos. The first night also has Shehecheyanu. The shamash is set apart, and higher.</p>
<p><b>Chabad customs.</b></p>
<ul>
<li><b>Placement:</b> Chabad places the menorah in the doorway, opposite the mezuzah, so you are surrounded by mitzvos. <span class="diff">Difference: many place it in a window facing the street.</span></li>
<li><b>Lighting time:</b> the Chabad custom is around sunset. Check the Chabad luach.</li>
<li><b>Staying near:</b> you sit near the lights for the first half hour.</li>
<li><b>Who lights:</b> in yeshiva, bochurim generally light their own. Ask Zalmy about the Mayanot arrangement.</li>
</ul>
<p><b>Davening.</b> Al HaNissim in the Amidah and Birkas Hamazon, full Hallel all eight days, and no Tachanun.</p>
<p><b>Mivtza Chanukah.</b> The Rebbe launched public menorah lightings in the 1970s, to "publicize the miracle" (<i>pirsumei nisa</i>) in public squares. Today there are huge menorahs around the world, and Chabad bochurim do mivtzoyim with menorahs on the street.</p>
<p><b>The idea.</b> Add light each night: never be satisfied with yesterday's level. Beis Hillel's ruling, adding a light each night (Shabbos 21b), is a Chassidic motto for growth.</p>`,
    terms: [
      { t: "Menorah", h: "מנורה", m: "The Chanukah lamp" },
      { t: "Shamash", h: "שמש", m: "The helper candle" },
      { t: "Al HaNissim", h: "על הנסים", m: "The prayer for the miracles" },
      { t: "Pirsumei nisa", h: "פרסומי ניסא", m: "Publicizing the miracle" },
      { t: "Mosif v'holech", h: "מוסיף והולך", m: "Increasing step by step" }
    ],
    source: "Shabbos 21b to 23b; Shulchan Aruch, Orach Chaim 670 to 677; Sefer HaMinhagim (Chanukah)",
    doToday: "Plan now: will you have your own menorah in Jerusalem? Where will you light it? Ask Zalmy.",
    quiz: [
      { id: "m6-3-q1", t: "mc", q: "Where does Chabad place the menorah?", o: ["In the doorway, opposite the mezuzah", "In the window", "On the table", "Outside only"], a: 0, x: "Surrounded by mitzvos." },
      { id: "m6-3-q2", t: "recall", q: "What was the miracle of the oil?", model: "One jar of pure oil, enough for one day, burned for eight days (Shabbos 21b).", x: "Plus the military victory." },
      { id: "m6-3-q3", t: "mc", q: "On Chanukah, Hallel is:", o: ["Full, all eight days", "Half", "Not said", "Only on Shabbos"], a: 0, x: "Full Hallel." },
      { id: "m6-3-q4", t: "mc", q: "The Rebbe launched public menorah lightings to:", o: ["Publicize the miracle", "Raise funds", "Replace home lighting", "Mark his birthday"], a: 0, x: "Pirsumei nisa." },
      { id: "m6-3-q5", t: "tf", q: "The number of lights decreases each night according to the halacha.", a: false, x: "False. That was Beis Shammai's view. We follow Beis Hillel: add one each night." }
    ],
    deeper: [
      { id: "m6-3-d1", t: "recall", q: "Why do we follow Beis Hillel and add a light each night?", model: "\"Maalin bakodesh v'ein moridin\": in holiness we increase, not decrease (Shabbos 21b). Chassidus draws the lesson: keep growing, don't settle for yesterday's level.", x: "Beis Shammai's reason was the decreasing bulls of Sukkos." }
    ],
    reflect: "\"Mosif v'holech\": one more light each night. What's one thing you could add each week this winter?",
    sayIt: { phrase: "Maalin bakodesh.", h: "מעלין בקודש", meaning: "In holiness we go up: always add.", when: "When lighting the menorah, or encouraging someone to take one more step." }
  },
  {
    id: "m6-4", title: "Asarah B'Teves and the fast days", minutes: 5, intro: false,
    teach: `
<p><b>The four fasts</b> mentioned by the prophet Zechariah (8:19), connected to the destruction of the first Beis HaMikdash:</p>
<ul>
<li><b>10 Teves:</b> the siege of Yerushalayim by Nevuchadnezzar began.</li>
<li><b>17 Tammuz:</b> the walls were breached (for the second Temple). It begins the Three Weeks.</li>
<li><b>9 Av:</b> the destruction of both Batei Mikdash (lesson m6-10).</li>
<li><b>3 Tishrei (Tzom Gedaliah):</b> the assassination of Gedaliah, which ended Jewish self-rule after the first destruction.</li>
</ul>
<p>Also <b>Taanis Esther</b>, the day before Purim, which is a custom rather than an ancient fast.</p>
<p><b>The rules.</b> The minor fasts (all except 9 Av and Yom Kippur) run from dawn to nightfall; eating the night before is allowed. People who are ill, and pregnant or nursing women, are generally exempt; ask. There's an extra Torah reading and prayers (Aneinu, Selichos). A fast that falls on Shabbos is postponed (except Yom Kippur).</p>
<p><b>Asarah B'Teves is special.</b> Some Rishonim say that if it fell on Shabbos, it would be observed anyway, because the verse says "b'etzem hayom hazeh", "on this very day" (Yechezkel 24:2). It never falls on Shabbos in our calendar, but it can fall on Friday, and then we fast until nightfall Friday.</p>
<p><b>The Chassidic approach.</b> The Rebbe taught that a fast day is a day of goodwill (eis ratzon). Add tzedakah and Torah learning, and focus on the future: Zechariah prophesied that these fasts will become days of joy.</p>`,
    terms: [
      { t: "Taanis tzibbur", h: "תענית ציבור", m: "A public fast" },
      { t: "Asarah B'Teves", h: "עשרה בטבת", m: "10 Teves" },
      { t: "Tzom Gedaliah", h: "צום גדליה", m: "The fast of Gedaliah (3 Tishrei)" },
      { t: "Aneinu", h: "עננו", m: "The fast-day prayer" },
      { t: "Alos hashachar", h: "עלות השחר", m: "Dawn" }
    ],
    source: "Zechariah 8:19; Yechezkel 24:2; Shulchan Aruch, Orach Chaim 549 to 550",
    doToday: "Find the date of Asarah B'Teves this year and check whether it falls on a Friday.",
    quiz: [
      { id: "m6-4-q1", t: "recall", q: "What event does Asarah B'Teves mark?", model: "The start of Nevuchadnezzar's siege of Yerushalayim.", x: "Leading to the first destruction." },
      { id: "m6-4-q2", t: "mc", q: "Minor fasts run from:", o: ["Dawn to nightfall", "Sunset to sunset", "Midnight to noon", "Sunrise to sunset"], a: 0, x: "Only 9 Av and Yom Kippur are full 25-hour fasts." },
      { id: "m6-4-q3", t: "mc", q: "Which prophet lists the four fasts?", o: ["Zechariah", "Yeshayahu", "Yirmiyahu", "Daniel"], a: 0, x: "Zechariah 8:19." },
      { id: "m6-4-q4", t: "tf", q: "Asarah B'Teves can fall on a Friday, and then we fast into Shabbos's start.", a: true, x: "True: until nightfall Friday." },
      { id: "m6-4-q5", t: "mc", q: "What did Zechariah prophesy about the fasts?", o: ["They will become days of joy", "They will be doubled", "They will end without change", "Nothing"], a: 0, x: "Zechariah 8:19." }
    ],
    deeper: [
      { id: "m6-4-d1", t: "recall", q: "Why is Asarah B'Teves considered unusually strict?", model: "Because Yechezkel says \"b'etzem hayom hazeh\" (on this very day), some Rishonim (the Abudraham) hold it would be observed even on Shabbos.", x: "In practice it never falls on Shabbos." }
    ],
    reflect: "Training and fasting: how will you handle a fast day physically? Plan your hydration the night before.",
    sayIt: { phrase: "Have an easy fast.", h: "", meaning: "The standard fast-day greeting. Some prefer \"a meaningful fast\".", when: "The day before or during a fast." }
  },
  {
    id: "m6-5", title: "Tu B'Shvat", minutes: 5, intro: false,
    teach: `
<p><b>What it is.</b> "Rosh Hashanah for the trees" (Mishnah Rosh Hashanah 1:1). According to Beis Hillel it's the 15th of Shvat. It matters halachically for:</p>
<ul>
<li><b>Orlah:</b> counting a tree's years.</li>
<li><b>Maaser:</b> fruit that blossoms before and after Tu B'Shvat belongs to different years for tithing.</li>
</ul>
<p>In Israel, this is practical: produce's tithing year depends on it.</p>
<p><b>Customs.</b></p>
<ul>
<li>Eating fruits, especially fruits of Eretz Yisrael's seven species.</li>
<li>Saying Shehecheyanu on a new fruit.</li>
<li>No Tachanun.</li>
</ul>
<p>Choose fruits carefully and follow the order of precedence of brachos (lesson m3-6).</p>
<p><b>The Chassidic idea.</b> "A person is a tree of the field" (Devarim 20:19). The Rebbe often explained the parallels:</p>
<ul>
<li><b>Roots:</b> emunah, which you can't see but everything depends on.</li>
<li><b>Trunk and branches:</b> Torah and mitzvos.</li>
<li><b>Fruit:</b> the good you produce in others, which in turn has seeds for new trees.</li>
</ul>
<p>A tree's growth is slow and can't be rushed.</p>
<p><b>Timing.</b> Tu B'Shvat comes shortly after Yud Shvat. In Chabad the two are often felt together, a season of new growth.</p>`,
    terms: [
      { t: "Tu B'Shvat", h: "ט״ו בשבט", m: "15 Shvat: new year for trees" },
      { t: "Rosh Hashanah la'ilanos", h: "ראש השנה לאילנות", m: "New year of the trees" },
      { t: "Shivas haminim", h: "שבעת המינים", m: "The seven species" },
      { t: "Ki ha'adam etz hasadeh", h: "כי האדם עץ השדה", m: "\"A person is a tree of the field\" (Devarim 20:19)" }
    ],
    source: "Mishnah Rosh Hashanah 1:1; Devarim 20:19; Shulchan Aruch, Orach Chaim 131:6",
    doToday: "Pick one \"root\" you're working on this year (emunah, Chitas, a middah) and one \"fruit\" you want to produce in someone else.",
    quiz: [
      { id: "m6-5-q1", t: "mc", q: "Tu B'Shvat is the new year for:", o: ["Trees", "Kings", "Animals", "Festivals"], a: 0, x: "Mishnah Rosh Hashanah 1:1." },
      { id: "m6-5-q2", t: "mc", q: "Whose view sets it on the 15th?", o: ["Beis Hillel", "Beis Shammai", "The Rambam", "Rabbi Akiva"], a: 0, x: "Beis Shammai said the 1st." },
      { id: "m6-5-q3", t: "recall", q: "Why does Tu B'Shvat matter halachically?", model: "It determines tree years for orlah and the tithing year for fruit (maaser).", x: "Especially in Eretz Yisrael." },
      { id: "m6-5-q4", t: "tf", q: "Tachanun is said on Tu B'Shvat.", a: false, x: "False." },
      { id: "m6-5-q5", t: "mc", q: "\"A person is a tree of the field\" is from:", o: ["Devarim 20:19", "Tehillim 1", "Bereishis 2", "Tanya ch. 1"], a: 0, x: "Devarim 20:19." }
    ],
    deeper: [
      { id: "m6-5-d1", t: "recall", q: "What's the Chassidic lesson of a tree's roots?", model: "Roots are hidden but everything depends on them, like emunah and kabbalas ol. A tree's strength and fruit come from what's unseen.", x: "A common theme in the Rebbe's sichos." }
    ],
    reflect: "What \"fruit\" do you produce in other people: friends, Ari, customers?",
    sayIt: { phrase: "Ha'adam etz hasadeh.", h: "האדם עץ השדה", meaning: "A person is a tree of the field.", when: "At a Tu B'Shvat table, when discussing growth." }
  },
  {
    id: "m6-6", title: "Purim", minutes: 5, intro: false,
    teach: `
<p><b>The story.</b> In Persia, Haman plotted to destroy all the Jews on 13 Adar. Through Esther and Mordechai, and a hidden chain of Divine providence, the decree was overturned. Hashem's name isn't mentioned in the Megillah, which teaches that He acts through hidden events.</p>
<p><b>Four mitzvos</b> (Esther 9:22; Shulchan Aruch 687 to 695):</p>
<ul>
<li><b>Megillah:</b> hear it twice, at night and in the day.</li>
<li><b>Mishloach manos:</b> at least two ready-to-eat foods to at least one person.</li>
<li><b>Matanos l'evyonim:</b> gifts to at least two poor people.</li>
<li><b>Seudah:</b> a festive meal in the daytime.</li>
</ul>
<p>Add Al HaNissim, and no Tachanun.</p>
<p><b>Jerusalem: Shushan Purim.</b> Walled cities from the time of Yehoshua keep Purim on the 15th, like Shushan. <b>Jerusalem keeps the 15th.</b> As a resident of Jerusalem this year, you keep Purim on 15 Adar (Adar II, since this is a leap year). The rules for visitors and travel are detailed; if you'll be elsewhere around Purim, ask Zalmy.</p>
<p><b>Chabad.</b></p>
<ul>
<li><b>Mivtza Purim:</b> bringing Megillah readings and mishloach manos to Jews everywhere.</li>
<li><b>Farbrengens:</b> drink within the Rebbe's guidelines, as with any farbrengen.</li>
</ul>
<p>Chassidus says Purim reveals a level beyond reason ("ad d'lo yada"), even higher than Yom Kippur (Yom haKippurim = "a day like Purim", in the Arizal's reading).</p>`,
    terms: [
      { t: "Megillah", h: "מגילה", m: "The scroll of Esther" },
      { t: "Mishloach manos", h: "משלוח מנות", m: "Food gifts to a friend" },
      { t: "Matanos l'evyonim", h: "מתנות לאביונים", m: "Gifts to the poor" },
      { t: "Shushan Purim", h: "שושן פורים", m: "Purim on the 15th, in walled cities" },
      { t: "Ad d'lo yada", h: "עד דלא ידע", m: "\"Until one doesn't know\": the level beyond reason" }
    ],
    source: "Megillas Esther 9; Megillah 7b; Shulchan Aruch, Orach Chaim 687 to 695; Tikkunei Zohar (Yom haKippurim as \"k'Purim\")",
    doToday: "Write down the four mitzvos of Purim and your Purim date in Jerusalem (15 Adar II).",
    quiz: [
      { id: "m6-6-q1", t: "recall", q: "Name the four mitzvos of Purim.", model: "Hearing the Megillah (twice), mishloach manos, matanos l'evyonim, and the seudah.", x: "Esther 9:22." },
      { id: "m6-6-q2", t: "mc", q: "In Jerusalem, Purim is on:", o: ["15 Adar", "14 Adar", "13 Adar", "16 Adar"], a: 0, x: "Shushan Purim." },
      { id: "m6-6-q3", t: "mc", q: "Mishloach manos requires at least:", o: ["Two foods to one person", "One food to two people", "Money to a friend", "Wine only"], a: 0, x: "Ready-to-eat foods." },
      { id: "m6-6-q4", t: "mc", q: "Matanos l'evyonim requires gifts to at least:", o: ["Two poor people", "One poor person", "Ten poor people", "A shul"], a: 0, x: "SA 694." },
      { id: "m6-6-q5", t: "tf", q: "This year Purim is in Adar I.", a: false, x: "False. In a leap year Purim is in Adar II." },
      { id: "m6-6-q6", t: "mc", q: "Why isn't Hashem's name in the Megillah?", o: ["He acts through hidden events", "It was lost", "It's forbidden in Persian", "No reason"], a: 0, x: "Hester panim: hiddenness." }
    ],
    deeper: [
      { id: "m6-6-d1", t: "recall", q: "Why is Purim said to be higher than Yom Kippur?", model: "The Tikkunei Zohar reads \"Yom haKippurim\" as \"a day like Purim\". Purim reveals the Jews' bond with Hashem beyond reason and beyond the service of the day, through joy and unity.", x: "A classic Chassidic theme." }
    ],
    reflect: "Purim shows hidden providence. Where has Hashem been hiding in your year so far?",
    sayIt: { phrase: "A freilichen Purim!", h: "א פרייליכן פורים", meaning: "\"A happy Purim\".", when: "On Purim, to everyone." }
  },
  {
    id: "m6-7", title: "Pesach, deeper", minutes: 5, intro: false,
    teach: `
<p><b>You know Pesach.</b> Here's what's specifically Chabad, and what applies in Israel.</p>
<p><b>Chametz.</b></p>
<ul>
<li><b>Bedikas chametz:</b> the search the night before Pesach. The Chabad custom is 10 pieces of bread, wrapped, searched for with a candle, a feather, and a wooden spoon.</li>
<li><b>Bittul:</b> nullifying any chametz you didn't find.</li>
<li><b>Mechiras chametz:</b> selling chametz through a rav.</li>
<li><b>Burning:</b> the chametz is burned the next morning.</li>
</ul>
<p><b>Chabad customs.</b></p>
<ul>
<li><b>No gebrokts.</b> Chabad doesn't eat matzah that has come into contact with water (no matzah balls, no matzah brei). Matzah is kept covered at the table, away from liquids, as a stringency against any trace of chametz. <span class="diff">Difference: many Ashkenazim and Sephardim do eat gebrokts.</span></li>
<li><b>Hand-baked shmurah matzah</b> for the seder, and many use it all Pesach.</li>
<li><b>The seder</b> follows the Alter Rebbe's Haggadah, and the ke'arah (seder plate) is arranged according to the Arizal.</li>
</ul>
<p><b>Moshiach's Seudah.</b> On the last day of Pesach, in the afternoon, a festive meal with matzah and four cups of wine. It was the Baal Shem Tov's custom; the Rebbe Rashab added the four cups in 1906. The Haftarah that day is about Moshiach (Yeshayahu 11).</p>
<p><b>In Israel.</b> Pesach is seven days, with one day of Yom Tov at each end. If you keep two days (Module 0), you'll have an extra day at each end, and a second seder. Ask Zalmy.</p>
<p><b>Pesach Sheni</b> (14 Iyar): a second chance. The Rebbe emphasized its lesson: it's never too late.</p>`,
    terms: [
      { t: "Gebrokts", h: "געבראקטס", m: "Yiddish: matzah that has touched water" },
      { t: "Shmurah matzah", h: "מצה שמורה", m: "Matzah guarded from the harvest" },
      { t: "Bedikas chametz", h: "בדיקת חמץ", m: "The search for chametz" },
      { t: "Mechiras chametz", h: "מכירת חמץ", m: "The sale of chametz" },
      { t: "Moshiach's Seudah", h: "סעודת משיח", m: "The Meal of Moshiach on the last day of Pesach" },
      { t: "Pesach Sheni", h: "פסח שני", m: "The second Pesach, 14 Iyar" }
    ],
    source: "Shulchan Aruch HaRav, Orach Chaim 431 to 494; Sefer HaMinhagim (Pesach); Haggadah shel Pesach with the Rebbe's commentary",
    doToday: "Put Moshiach's Seudah (the last day of Pesach, afternoon) in your calendar, and ask Zalmy where Mayanot holds it.",
    quiz: [
      { id: "m6-7-q1", t: "mc", q: "Chabad on gebrokts:", o: ["Doesn't eat it", "Eats it", "Only on the last day", "Only in Israel"], a: 0, x: "Many communities do eat it." },
      { id: "m6-7-q2", t: "recall", q: "What is Moshiach's Seudah?", model: "A festive meal on the afternoon of the last day of Pesach, with matzah and four cups of wine; the Baal Shem Tov's custom, with the four cups added by the Rebbe Rashab.", x: "The Haftarah is about Moshiach." },
      { id: "m6-7-q3", t: "mc", q: "How many pieces of bread does Chabad hide for bedikas chametz?", o: ["10", "7", "1", "None"], a: 0, x: "Wrapped." },
      { id: "m6-7-q4", t: "mc", q: "Pesach Sheni's lesson, as the Rebbe emphasized:", o: ["It's never too late", "Eat matzah twice", "Rest", "Fast"], a: 0, x: "A second chance." },
      { id: "m6-7-q5", t: "tf", q: "In Israel, Pesach has two Yom Tov days at the start.", a: false, x: "False. One day at each end (for Israelis)." }
    ],
    deeper: [
      { id: "m6-7-d1", t: "recall", q: "Why does Chabad avoid gebrokts?", model: "As a stringency: there might be traces of flour in the matzah that never fully baked, which could become chametz when wet. The Alter Rebbe's household practiced this.", x: "Discussed in the Alter Rebbe's responsa and Sefer HaMinhagim." }
    ],
    reflect: "Pesach is freedom. What are you enslaved to right now, in a small way, that you'd want to leave behind by Nissan?",
    sayIt: { phrase: "We don't eat gebrokts.", h: "געבראקטס", meaning: "Chabad doesn't eat matzah that touched liquid on Pesach.", when: "When a host offers matzah balls on Pesach. Politely." }
  },
  {
    id: "m6-8", title: "Sefiras HaOmer and Lag BaOmer", minutes: 5, intro: false,
    teach: `
<p><b>Counting.</b> "You shall count for yourselves... seven complete weeks" (Vayikra 23:15). From the second night of Pesach we count 49 days to Shavuos, each night after nightfall, with a bracha.</p>
<ul>
<li>If you forget at night, count during the day <b>without</b> a bracha, then continue with brachos.</li>
<li>If you missed an entire day, continue counting without a bracha for the rest (Shulchan Aruch 489:8).</li>
</ul>
<p>Chabad counts after Maariv.</p>
<p><b>Counting middos.</b> Following the Kabbalah, each of the seven weeks corresponds to one of the seven middos, and each day to a combination: day 1 is Chesed sheb'Chesed, and so on. Sefirah is a 49-day program of refining your character.</p>
<p><b>Mourning.</b> Rabbi Akiva's 24,000 students died in this period for not showing respect to each other (Yevamos 62b). Customs of mourning include no weddings and no haircuts.</p>
<ul>
<li><b>Chabad:</b> no haircuts through the whole Sefirah until Erev Shavuos, including Lag BaOmer, following the Arizal.</li>
<li><b>Weddings:</b> Chabad holds weddings from Lag BaOmer on.</li>
</ul>
<p><b>Lag BaOmer</b> (18 Iyar): the hilula of Rabbi Shimon bar Yochai, author of the Zohar, and the day the plague on Rabbi Akiva's students stopped. It's celebrated with bonfires, a pilgrimage to Meron, and Chabad's <b>Lag BaOmer parades</b> for children, which the Rebbe promoted as a show of Jewish pride and unity.</p>`,
    terms: [
      { t: "Sefiras HaOmer", h: "ספירת העומר", m: "Counting the Omer" },
      { t: "Lag BaOmer", h: "ל״ג בעומר", m: "The 33rd day of the Omer" },
      { t: "Rashbi", h: "רשב״י", m: "Rabbi Shimon bar Yochai" },
      { t: "Hilula", h: "הילולא", m: "Celebration of a tzaddik's passing" },
      { t: "Chesed sheb'Chesed", h: "חסד שבחסד", m: "The middah of the first day of the Omer" }
    ],
    source: "Vayikra 23:15 to 16; Yevamos 62b; Shulchan Aruch, Orach Chaim 489 to 493; Sefer HaMinhagim (Sefirah)",
    doToday: "Set a recurring nightly alarm reminder \"Sefirah\" for next Pesach now, so it's ready.",
    quiz: [
      { id: "m6-8-q1", t: "mc", q: "Forgot to count at night; remembered next day:", o: ["Count without a bracha, then continue with brachos", "Stop counting", "Count with a bracha", "Double next night"], a: 0, x: "SA 489." },
      { id: "m6-8-q2", t: "mc", q: "Chabad and haircuts during Sefirah:", o: ["None until Erev Shavuos, including Lag BaOmer", "Allowed on Lag BaOmer", "No restrictions", "Only on Rosh Chodesh"], a: 0, x: "Following the Arizal." },
      { id: "m6-8-q3", t: "recall", q: "Why is Sefirah a period of mourning?", model: "Rabbi Akiva's 24,000 students died during it, for not showing respect to one another (Yevamos 62b).", x: "A lesson in ahavas Yisrael." },
      { id: "m6-8-q4", t: "mc", q: "Lag BaOmer is the hilula of:", o: ["Rabbi Shimon bar Yochai", "Rabbi Akiva", "The Baal Shem Tov", "Moshe"], a: 0, x: "Author of the Zohar." },
      { id: "m6-8-q5", t: "mc", q: "The Rebbe promoted on Lag BaOmer:", o: ["Children's parades", "Fasting", "Silence", "Selichos"], a: 0, x: "Jewish pride and unity." }
    ],
    deeper: [
      { id: "m6-8-d1", t: "recall", q: "What's the idea behind counting middos during Sefirah?", model: "Each of the 49 days corresponds to a combination of the seven middos (e.g., Chesed sheb'Gevurah). Working on each gives a structured refinement of character leading to Matan Torah.", x: "From the Kabbalah and Chassidus." }
    ],
    reflect: "Rabbi Akiva's students lacked respect for each other. Is there a friend you've been dismissive of?",
    sayIt: { phrase: "Did you count Sefirah?", h: "ספירה", meaning: "Have you counted the Omer tonight?", when: "After Maariv during the 49 days." }
  },
  {
    id: "m6-9", title: "Shavuos", minutes: 5, intro: false,
    teach: `
<p><b>What it is.</b> 6 Sivan: the giving of the Torah at Sinai (Matan Torah). It has no fixed date in the Torah; it's the day after counting 49 days. In Israel it's one day; in chutz la'aretz, two.</p>
<p><b>Customs.</b></p>
<ul>
<li><b>Staying up the night learning.</b> The <i>Tikkun Leil Shavuos</i> is the text Chabad says. The reason given: to rectify the Jews' having overslept on the morning of Matan Torah.</li>
<li><b>Dairy foods.</b></li>
<li><b>Reading Megillas Rus.</b></li>
<li><b>Everyone hearing the Aseres HaDibros.</b> The Rebbe especially emphasized bringing children, even babies, to shul to hear the Ten Commandments, as at Sinai.</li>
</ul>
<p><b>The Baal Shem Tov.</b> He passed away on Shavuos, 1760. It's also traditionally the yahrzeit of King Dovid.</p>
<p><b>The idea.</b> At Sinai, the Midrash says, the separation between "upper" and "lower" worlds was broken. Hashem came down, and people could reach up. From then on, physical things used for mitzvos become holy. That's the start of dirah b'tachtonim. That's why Shavuos is also celebrated physically, with food and joy.</p>
<p><b>Preparation.</b> The three days before Shavuos are the <i>Shloshes Yemei Hagbalah</i>, days of preparation, parallel to the three days of preparation at Sinai.</p>`,
    terms: [
      { t: "Matan Torah", h: "מתן תורה", m: "The giving of the Torah" },
      { t: "Tikkun Leil Shavuos", h: "תיקון ליל שבועות", m: "The text learned on Shavuos night" },
      { t: "Aseres HaDibros", h: "עשרת הדברות", m: "The Ten Commandments" },
      { t: "Shloshes Yemei Hagbalah", h: "שלשת ימי הגבלה", m: "The three days of preparation" },
      { t: "Megillas Rus", h: "מגילת רות", m: "The Book of Ruth" }
    ],
    source: "Shemos 19 to 20; Shabbos 86b to 88a; Shemos Rabbah 12:3; Shulchan Aruch, Orach Chaim 494; Sefer HaMinhagim (Shavuos)",
    doToday: "Write in your notebook: on Shavuos, learn through the night and hear the Aseres HaDibros.",
    quiz: [
      { id: "m6-9-q1", t: "mc", q: "Shavuos commemorates:", o: ["Matan Torah", "The Exodus", "The harvest only", "The Beis HaMikdash"], a: 0, x: "6 Sivan." },
      { id: "m6-9-q2", t: "mc", q: "Why stay up on Shavuos night?", o: ["To rectify the Jews' oversleeping on the morning of Matan Torah", "Kabbalistic tradition only", "To eat more", "No reason"], a: 0, x: "The common explanation." },
      { id: "m6-9-q3", t: "mc", q: "Who passed away on Shavuos 1760?", o: ["The Baal Shem Tov", "The Alter Rebbe", "The Maggid", "The Tzemach Tzedek"], a: 0, x: "Also King Dovid, traditionally." },
      { id: "m6-9-q4", t: "recall", q: "What did the Rebbe emphasize about the Aseres HaDibros?", model: "Bringing everyone, including children and babies, to shul to hear them, as the whole nation stood at Sinai.", x: "A Chabad campaign." },
      { id: "m6-9-q5", t: "tf", q: "In Israel, Shavuos is two days.", a: false, x: "False. One day in Israel." }
    ],
    deeper: [
      { id: "m6-9-d1", t: "recall", q: "What changed at Matan Torah, according to the Midrash?", model: "The decree separating the upper and lower worlds was annulled: from then on, physical things used for mitzvos become holy, and G-dliness can be drawn into the physical.", x: "Shemos Rabbah 12:3." }
    ],
    reflect: "If you were standing at Sinai tomorrow, what would you commit to?",
    sayIt: { phrase: "Kabbalas HaTorah b'simcha uv'pnimiyus.", h: "קבלת התורה בשמחה ובפנימיות", meaning: "\"Receive the Torah with joy and inwardness\": the Rebbeim's Shavuos blessing.", when: "Before Shavuos, to friends." }
  },
  {
    id: "m6-10", title: "The Three Weeks and Tishah B'Av", minutes: 5, intro: false,
    teach: `
<p><b>The Three Weeks.</b> From 17 Tammuz (the walls breached) to 9 Av (both Batei Mikdash destroyed). Mourning customs increase over the period.</p>
<ul>
<li><b>Throughout:</b> no weddings, no haircuts, no music.</li>
<li><b>From Rosh Chodesh Av, the Nine Days:</b> no meat or wine (except on Shabbos and at a seudas mitzvah), no laundry, no new clothes.</li>
</ul>
<p><b>Chabad emphasis.</b> The Rebbe encouraged:</p>
<ul>
<li><b>Learning the laws of the Beis HaMikdash</b> during the Three Weeks: Hilchos Beis HaBechirah in the Rambam, and tractate Middos. Learning about it is in some sense like building it.</li>
<li><b>Siyumim</b> (completing a tractate) each day of the Nine Days. They bring joy, and the meat meal of a siyum.</li>
<li><b>Extra tzedakah.</b></li>
</ul>
<p><b>Tishah B'Av.</b> A full fast of about 25 hours, from sunset to nightfall. There's no eating, drinking, washing, leather shoes, or marital relations, and learning is limited to sad topics. Eichah and Kinos are read, sitting on the floor. Tallis and tefillin are worn at Mincha, not Shacharis.</p>
<p><b>Why it happened.</b> The second Beis HaMikdash was destroyed because of baseless hatred (<i>sinas chinam</i>), Yoma 9b. The Rebbe, quoting earlier sources, taught: the fix is baseless love, <i>ahavas chinam</i>.</p>
<p><b>After.</b> Tu B'Av (15 Av) is a day of joy, and the seven weeks of consolation lead into Rosh Hashanah.</p>`,
    terms: [
      { t: "Bein hametzarim", h: "בין המצרים", m: "\"Between the straits\": the Three Weeks" },
      { t: "Tishah B'Av", h: "תשעה באב", m: "9 Av" },
      { t: "Sinas chinam / ahavas chinam", h: "שנאת חנם / אהבת חנם", m: "Baseless hatred / baseless love" },
      { t: "Kinos", h: "קינות", m: "Elegies" },
      { t: "Hilchos Beis HaBechirah", h: "הלכות בית הבחירה", m: "The Rambam's laws of the Beis HaMikdash" }
    ],
    source: "Taanis 26b, 29a; Yoma 9b; Shulchan Aruch, Orach Chaim 549 to 559; the Rebbe's sichos on the Three Weeks",
    doToday: "Note in your calendar: next summer, learn Hilchos Beis HaBechirah during the Three Weeks.",
    quiz: [
      { id: "m6-10-q1", t: "mc", q: "The Three Weeks run from:", o: ["17 Tammuz to 9 Av", "1 Av to 9 Av", "9 Av to Rosh Hashanah", "Pesach to Shavuos"], a: 0, x: "The walls breached to the destruction." },
      { id: "m6-10-q2", t: "mc", q: "Why was the second Beis HaMikdash destroyed?", o: ["Baseless hatred", "Idolatry", "Shabbos violation", "Kashrus"], a: 0, x: "Yoma 9b." },
      { id: "m6-10-q3", t: "recall", q: "What did the Rebbe encourage learning during the Three Weeks?", model: "The laws of the Beis HaMikdash: Rambam's Hilchos Beis HaBechirah and tractate Middos.", x: "Learning about it is like building it." },
      { id: "m6-10-q4", t: "mc", q: "On Tishah B'Av, tefillin are worn at:", o: ["Mincha", "Shacharis", "Maariv", "Not at all"], a: 0, x: "Mourning in the morning." },
      { id: "m6-10-q5", t: "tf", q: "Meat is permitted at a siyum during the Nine Days.", a: true, x: "True: a seudas mitzvah." }
    ],
    deeper: [
      { id: "m6-10-d1", t: "recall", q: "How does ahavas chinam fix sinas chinam?", model: "The destruction came from hating without reason; the repair is loving without reason: unconditional ahavas Yisrael, even when the other person gives you no reason.", x: "A central Chabad teaching." }
    ],
    reflect: "Who's someone you dislike for no good reason? What's one act of ahavas chinam toward him?",
    sayIt: { phrase: "Ahavas chinam.", h: "אהבת חנם", meaning: "Baseless love: the repair for the destruction.", when: "During the Three Weeks, or when a conflict is petty." }
  },
  {
    id: "m6-11", title: "Elul", minutes: 5, intro: false,
    teach: `
<p><b>The month of preparation.</b> Elul is the month before Rosh Hashanah, dedicated to teshuvah and reflection. The name is read as an acronym of "Ani l'dodi v'dodi li" (Shir HaShirim 6:3), "I am my Beloved's and my Beloved is mine".</p>
<p><b>The king in the field.</b> The Alter Rebbe's famous parable (Likkutei Torah, Re'eh): during the year, the king sits in his palace, and approaching him takes appointments and ceremony. In Elul the king comes out to the field. Anyone can approach him, and he receives everyone with a smile. Elul is when Hashem is most accessible.</p>
<p><b>Customs.</b></p>
<ul>
<li><b>Shofar</b> is blown each weekday after Shacharis, from Rosh Chodesh Elul.</li>
<li><b>Tehillim 27</b> ("L'Dovid Hashem ori") is added twice daily.</li>
<li><b>Chabad (the Baal Shem Tov's custom):</b> saying three extra chapters of Tehillim every day from Rosh Chodesh Elul until Yom Kippur. On Yom Kippur, the remaining 36 chapters complete the book.</li>
<li><b>Checking tefillin and mezuzos.</b></li>
<li><b>Letters and greetings:</b> "Kesiva v'chasima tova".</li>
</ul>
<p><b>Chai Elul</b> (lesson m7-9) marks the final 12 days.</p>
<p><b>The idea.</b> Elul isn't gloomy. It's the most personal, accessible month. You're in yeshiva for this coming Elul (5787), which is a great opportunity.</p>`,
    terms: [
      { t: "Elul", h: "אלול", m: "The month before Rosh Hashanah" },
      { t: "Ani l'dodi v'dodi li", h: "אני לדודי ודודי לי", m: "\"I am my Beloved's and my Beloved is mine\"" },
      { t: "Melech bassadeh", h: "מלך בשדה", m: "\"The king in the field\"" },
      { t: "Kesiva v'chasima tova", h: "כתיבה וחתימה טובה", m: "\"A good writing and sealing\": the Elul greeting" }
    ],
    source: "Shir HaShirim 6:3; Likkutei Torah, Parshas Re'eh; Shulchan Aruch, Orach Chaim 581; Sefer HaMinhagim (Elul)",
    doToday: "Put Rosh Chodesh Elul 5787 in your calendar with a note: \"3 extra Tehillim daily until Yom Kippur.\"",
    quiz: [
      { id: "m6-11-q1", t: "recall", q: "What's the Alter Rebbe's parable for Elul?", model: "The king in the field: during Elul the king leaves his palace and anyone can approach him; he receives everyone warmly.", x: "Likkutei Torah, Re'eh." },
      { id: "m6-11-q2", t: "mc", q: "Which chapter of Tehillim is added in Elul?", o: ["27", "23", "145", "20"], a: 0, x: "L'Dovid Hashem ori." },
      { id: "m6-11-q3", t: "mc", q: "The Baal Shem Tov's Elul custom:", o: ["Three extra chapters of Tehillim daily until Yom Kippur", "Fasting daily", "Selichos from Rosh Chodesh", "No meat"], a: 0, x: "Completing the book on Yom Kippur." },
      { id: "m6-11-q4", t: "mc", q: "\"Elul\" is an acronym of:", o: ["Ani l'dodi v'dodi li", "Aseres yemei teshuvah", "Ahavas Yisrael", "Nothing"], a: 0, x: "Shir HaShirim 6:3." },
      { id: "m6-11-q5", t: "tf", q: "Elul is meant to be a gloomy month.", a: false, x: "False. The king receives everyone with a smile." }
    ],
    deeper: [
      { id: "m6-11-d1", t: "recall", q: "Why does the king in the field receive people \"with a smile\"?", model: "In the field he meets people as they are, in their ordinary clothes and places, and shows goodwill to all, not only those with access to the palace. Elul's closeness doesn't depend on your level.", x: "The core of the parable." }
    ],
    reflect: "If you knew Hashem was \"in the field\" and accessible, what would you want to say?",
    sayIt: { phrase: "The King is in the field.", h: "המלך בשדה", meaning: "In Elul, Hashem is most accessible.", when: "In Elul, when encouraging a friend who feels far." }
  },
  {
    id: "m6-12", title: "Rosh Hashanah and Yom Kippur", minutes: 5, intro: false,
    teach: `
<p><b>Rosh Hashanah.</b> The day Adam was created, and the anniversary of the world's purpose. Chassidus explains that the core of the day is the coronation of Hashem as King: we "rebuild" His desire for the world (Likkutei Torah on Rosh Hashanah).</p>
<ul>
<li><b>The shofar</b> is the coronation trumpet and the soul's simple cry.</li>
<li><b>100 blasts</b> are sounded.</li>
<li><b>Simanim:</b> symbolic foods like apple in honey.</li>
<li><b>Tashlich:</b> at a body of water. Chabad says it on the first day, unless it's Shabbos.</li>
</ul>
<p>Chabad custom is to spend the day in prayer and Tehillim, avoiding idle talk and daytime napping.</p>
<p><b>The Ten Days of Teshuvah.</b> A time of extra care: for example, pas Yisrael for everyone (lesson m5-3).</p>
<p><b>Erev Yom Kippur.</b></p>
<ul>
<li><b>Kapparos:</b> Chabad does it with chickens.</li>
<li><b>Lekach:</b> asking for and receiving honey cake. The Rebbe used to give it out, as a symbol of receiving a sweet year from a person rather than needing to ask Heaven.</li>
<li><b>Two festive meals.</b></li>
<li><b>Asking forgiveness</b> from people you've wronged. Yom Kippur doesn't atone for sins between people until you've appeased them (Yoma 85b).</li>
</ul>
<p><b>Yom Kippur.</b> Five afflictions: no eating or drinking, washing, anointing, leather shoes, or marital relations. Five prayers, ending with Neilah. It's a day of atonement from Hashem Himself. The essence of the day atones (Yoma 85b), with teshuvah.</p>
<p><b>Chabad after Neilah.</b> The shofar, "L'shanah haba'ah b'Yerushalayim", and then chassidim sing the joyous <b>"Napoleon's March"</b>, a niggun associated with the Alter Rebbe, as a triumphant close.</p>`,
    terms: [
      { t: "Tekias shofar", h: "תקיעת שופר", m: "The shofar blowing" },
      { t: "Tashlich", h: "תשליך", m: "The prayer at a body of water" },
      { t: "Kapparos", h: "כפרות", m: "The Erev Yom Kippur atonement custom" },
      { t: "Lekach", h: "לעקאך", m: "Yiddish: honey cake, given out on Erev Yom Kippur" },
      { t: "Neilah", h: "נעילה", m: "The closing prayer of Yom Kippur" },
      { t: "Hamlachah", h: "המלכה", m: "Coronation of Hashem as King" }
    ],
    source: "Rosh Hashanah 16a, 34a; Yoma 85b; Shulchan Aruch, Orach Chaim 581 to 624; Likkutei Torah (Rosh Hashanah); Sefer HaMinhagim",
    doToday: "Write one hachlatah you made this past Tishrei, and check: are you still keeping it?",
    quiz: [
      { id: "m6-12-q1", t: "mc", q: "The core of Rosh Hashanah, per Chassidus:", o: ["Crowning Hashem as King", "Eating simanim", "Tashlich", "Resting"], a: 0, x: "Hamlachah." },
      { id: "m6-12-q2", t: "mc", q: "Yom Kippur atones for sins between people:", o: ["Only after appeasing the person wronged", "Automatically", "Never", "Only with a fast"], a: 0, x: "Yoma 85b." },
      { id: "m6-12-q3", t: "recall", q: "Name the five afflictions of Yom Kippur.", model: "No eating or drinking, washing, anointing, leather shoes, or marital relations.", x: "SA 611." },
      { id: "m6-12-q4", t: "mc", q: "What do Chabad chassidim sing after Neilah?", o: ["Napoleon's March", "Hatikvah", "Lecha Dodi", "Adon Olam"], a: 0, x: "A joyous close." },
      { id: "m6-12-q5", t: "mc", q: "Chabad does kapparos with:", o: ["Chickens", "Money only", "Fish", "Nothing"], a: 0, x: "Many others use money." },
      { id: "m6-12-q6", t: "mc", q: "Lekach on Erev Yom Kippur is:", o: ["Honey cake, asked for and given", "A prayer", "A fast", "A Torah reading"], a: 0, x: "A sweet year received from a fellow Jew." }
    ],
    deeper: [
      { id: "m6-12-d1", t: "recall", q: "Why ask a person for lekach rather than only asking Heaven?", model: "The custom (explained by the Rebbeim) is that if it's been decreed that a person will need to ask others for bread, this small asking fulfills that decree in a sweet way.", x: "Sefer HaMinhagim and sichos." }
    ],
    reflect: "You just went through Tishrei 5787. What's one thing from it you want to carry through the winter?",
    sayIt: { phrase: "Gmar chasima tova.", h: "גמר חתימה טובה", meaning: "\"A good final sealing\": the greeting from Rosh Hashanah through Hoshana Rabbah.", when: "Between Yom Kippur and Hoshana Rabbah, and on Yom Kippur itself." }
  }
]);
