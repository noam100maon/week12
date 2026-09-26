/*
  CHABAD PATH: course content
  ---------------------------------------------------------------
  Edit this file to add or change lessons. No build step needed.

  Module:  { id, title, subtitle, built, lessons: [ lesson | stub ] }
  Stub:    { id, title }                       (shows as "coming soon")
  Lesson:  {
    id, title, minutes, intro (true = can be skipped if placement is high),
    teach: "HTML string",
    terms: [ { t: "transliteration", h: "Hebrew", m: "meaning" } ],
    source: "text",
    doToday: "text",
    quiz:   [ question, ... ]   (minimum 5)
    deeper: [ question, ... ]   (shown only after a perfect quiz)
    reflect: "text",
    sayIt: { phrase, h, meaning, when }
  }

  Question types (field "t"):
    mc        multiple choice      { q, o: [..], a: index, x: explanation }
    scenario  scenario choice      { q, o: [..], a: index, x }
    bracha    which bracha         { q, a: index into BRACHOS, x }   (o optional)
    tf        true / false         { q, a: true|false, x }
    recall    open recall          { q, model: "model answer", x }
  Every question needs a unique "id".
*/

/* Module files in data/modules/ call this to replace a module's stub lessons. */
window.CP_LESSONS = function (moduleId, lessons) {
  const m = window.CONTENT.modules.find(x => x.id === moduleId);
  if (m) { m.lessons = lessons; m.built = true; }
};

window.BRACHOS = ["Hamotzi", "Mezonos", "Hagafen", "Ha'etz", "Ha'adama", "Shehakol"];

window.CONTENT = {
  modules: [
    /* ============================================================ */
    {
      id: "m0",
      title: "Right Now: Sukkos to Simchas Torah",
      subtitle: "Tishrei 5787. What you need this week.",
      built: true,
      lessons: [
        /* ---------------------------------------------------------- */
        {
          id: "m0-1",
          title: "Yom Tov Sheni: one day or two?",
          minutes: 5,
          intro: false,
          teach: `
<p><b>Why two days exist.</b> In the time of the Sanhedrin, the new month was declared by testimony about the new moon. Messengers then carried the date out. Communities too far to hear in time kept two days of Yom Tov out of doubt. After the calendar was fixed (attributed to Hillel II, 4th century CE), the Sages still told the communities of chutz la'aretz: <i>"Be careful with the custom of your fathers in your hands"</i> (Beitzah 4b). So chutz la'aretz keeps two days. Eretz Yisrael keeps one (except Rosh Hashanah, which is two everywhere).</p>
<p><b>So what about you?</b> The rule follows where you are <i>from</i>, not where you are standing. The Shulchan Aruch (Orach Chaim 496:3) rules that a visitor from chutz la'aretz who intends to return keeps two days even in Israel. Someone who has settled in Israel keeps one. The Alter Rebbe rules the same way in Shulchan Aruch HaRav (Orach Chaim 496). Some poskim follow the Chacham Tzvi, who held a visitor keeps one day, but that is not the Chabad approach.</p>
<p><b>A yeshiva bochur for one year.</b> The deciding factor is your intention. A bochur who plans to go home after the year keeps two days according to most poskim, and this is the position generally cited in the name of the Rebbe. If you are genuinely undecided, considering aliyah, or your situation is unusual, poskim differ. In the interview you said you are keeping one day. That may be wrong for you. This is exactly a question for Zalmy or a rav at Mayanot.</p>
<p><b>What two days looks like in Israel.</b> On your second day you daven the Yom Tov davening (Mayanot and most yeshivos with chutznikim have a minyan for this), make Kiddush and eat Yom Tov meals, and do no melacha: no phone, no business, no messages. You still take the lulav on 16 Tishrei, because that obligation continues every day of Sukkos except Shabbos.</p>
<p><b>This year's dates.</b> 15 Tishrei (Sat 26 Sept) was Shabbos and the first day. For a two-day person, 16 Tishrei (Sun 27 Sept) is Yom Tov. Shemini Atzeres and Simchas Torah in Israel fall together on 22 Tishrei (Sat 3 Oct). A two-day person also keeps 23 Tishrei (Sun 4 Oct) as Simchas Torah.</p>
<p class="flag">Your status is a personal psak. Confirm with a rav.</p>`,
          terms: [
            { t: "Yom Tov Sheni shel Galuyos", h: "יום טוב שני של גליות", m: "The second festival day kept in the Diaspora" },
            { t: "Chutz la'aretz", h: "חוץ לארץ", m: "Outside the Land of Israel" },
            { t: "Ben chutz la'aretz", h: "בן חוץ לארץ", m: "A person whose home is outside Israel" },
            { t: "Hizharu b'minhag avoseichem", h: "הזהרו במנהג אבותיכם", m: "\"Be careful with the custom of your fathers\" (Beitzah 4b)" },
            { t: "Isru Chag", h: "אסרו חג", m: "The day after a festival" },
            { t: "Psak", h: "פסק", m: "A halachic ruling given by a rav for a specific case" }
          ],
          source: "Beitzah 4b; Shulchan Aruch, Orach Chaim 496:3; Shulchan Aruch HaRav, Orach Chaim 496",
          doToday: "Ask Zalmy or a rav at Mayanot: \"I'm here for this year and I plan to go back to the US. Do I keep one day or two?\" Do it before 22 Tishrei. Log the answer in your Questions notebook.",
          quiz: [
            { id: "m0-1-q1", t: "mc", q: "Why did communities outside Israel originally keep two days of Yom Tov?",
              o: ["Doubt about the date, since messengers could not reach them in time", "To give the exile a longer celebration", "A Kabbalistic tikkun for the exile", "Because they used the Babylonian calendar"],
              a: 0, x: "The date depended on the Sanhedrin declaring the new month from witnesses. Distant communities could not know in time, so they kept two days out of doubt." },
            { id: "m0-1-q2", t: "tf", q: "Once the calendar was fixed and there was no more doubt, chutz la'aretz stopped keeping two days.",
              a: false, x: "False. The Gemara (Beitzah 4b) says the Sages instructed: keep the custom of your fathers. Two days remained binding in chutz la'aretz." },
            { id: "m0-1-q3", t: "mc", q: "According to Shulchan Aruch 496:3, a visitor from chutz la'aretz in Israel who intends to go home keeps:",
              o: ["One day, like the locals", "Two days", "One day, but no melacha in public on the second", "Whatever his host does"],
              a: 1, x: "Two days. The rule follows your home. The Alter Rebbe rules the same way." },
            { id: "m0-1-q4", t: "scenario", q: "Suppose you keep two days. On 16 Tishrei an Israeli friend invites you on a Chol HaMoed trip by bus. What do you do?",
              o: ["Go. It's Chol HaMoed in Israel", "Don't go. For you it is Yom Tov", "Go, as long as someone else pays the fare"],
              a: 1, x: "If you keep two days, 16 Tishrei is Yom Tov for you. Riding a bus, paying, using a phone, and travel beyond the techum are all problems. Go on 17 Tishrei instead." },
            { id: "m0-1-q5", t: "recall", q: "Name three things a two-day person in Israel does differently on the second day.",
              model: "1) Davens the Yom Tov davening (not Chol HaMoed). 2) Makes Kiddush and eats Yom Tov meals. 3) Does no melacha: no phone, no business, no travel.",
              x: "Also note what does NOT change: the lulav is still taken on 16 Tishrei." },
            { id: "m0-1-q6", t: "mc", q: "This year (5787), a two-day person in Israel keeps Simchas Torah on:",
              o: ["22 Tishrei (Sat 3 Oct)", "23 Tishrei (Sun 4 Oct)", "21 Tishrei (Fri 2 Oct)"],
              a: 1, x: "Israel keeps Shemini Atzeres and Simchas Torah together on 22 Tishrei. A two-day person keeps 22 as Shemini Atzeres and 23 as Simchas Torah." },
            { id: "m0-1-q7", t: "tf", q: "If you keep two days, you skip the lulav on 16 Tishrei because it is Yom Tov for you.",
              a: false, x: "False. The lulav is taken every day of Sukkos except Shabbos. Yom Tov does not cancel it; the first day of Sukkos is Yom Tov and it is the main day of the mitzvah." }
          ],
          deeper: [
            { id: "m0-1-d1", t: "mc", q: "The Chacham Tzvi held that a visitor to Israel keeps one day. What does Chabad follow?",
              o: ["The Chacham Tzvi", "The Shulchan Aruch and the Alter Rebbe: two days for one who intends to return", "One day for bochurim, two for adults"],
              a: 1, x: "Chabad follows the Shulchan Aruch and Shulchan Aruch HaRav. Personal circumstances (intention, age, dependence on parents) still matter, which is why you ask a rav." },
            { id: "m0-1-d2", t: "recall", q: "Why does your intention to return matter halachically, rather than just your physical location?",
              model: "Yom Tov Sheni is a communal custom of chutz la'aretz. You carry the obligation of your home community with you as long as you remain part of it, which depends on whether you intend to return.",
              x: "This is why the same bochur could keep one day if he decided to settle in Israel." }
          ],
          reflect: "What are your real plans for next year? Have you told Zalmy? If you keep two days, how will you set up the business (auto-replies, Ari's expectations) for the second days?",
          sayIt: { phrase: "I'm a ben chutz la'aretz, so I'm keeping two days.", h: "בן חוץ לארץ", meaning: "Someone whose home is outside Israel.", when: "When Israelis ask why you're still in Yom Tov mode on their Chol HaMoed. Say it only once you've confirmed your psak." }
        },

        /* ---------------------------------------------------------- */
        {
          id: "m0-2",
          title: "The sukkah",
          minutes: 5,
          intro: true,
          teach: `
<p><b>Why.</b> "You shall dwell in sukkos for seven days... so that your generations will know that I made the Children of Israel dwell in sukkos when I took them out of Egypt" (Vayikra 23:42 to 43). In the Gemara (Sukkah 11b), Rabbi Eliezer says these were the Clouds of Glory. Rabbi Akiva says they were actual huts.</p>
<p><b>What makes it kosher.</b></p>
<ul>
<li><b>Walls:</b> at least three. Technically two full walls plus a small part of a third are enough.</li>
<li><b>Height:</b> at least 10 tefachim (roughly 80 to 100 cm) and no more than 20 amos.</li>
<li><b>Schach:</b> material that grew from the ground, is now detached, and is not a processed utensil or food. It must give more shade than sun.</li>
<li><b>Open sky:</b> the schach must be directly under the sky, not under a tree or a roof.</li>
</ul>
<p><b>The mitzvah.</b> "Teishvu k'ein taduru": live in the sukkah the way you live in your home. Meals must be eaten there. When you eat bread, or a meal-sized amount of mezonos, you say the bracha <i>leishev basukkah</i>. On the first night there is a specific obligation to eat a k'zayis of bread in the sukkah after nightfall.</p>
<p><b>Chabad customs.</b></p>
<ul>
<li><b>Nothing outside the sukkah.</b> Chabad chassidim eat and drink nothing outside the sukkah, not even water, although halacha only requires meals there.</li>
<li><b>No sleeping in it.</b> Chabad chassidim do not sleep in the sukkah. <span class="diff">Difference: in general halacha (Shulchan Aruch 639), sleeping in the sukkah is part of the mitzvah, and most Ashkenazim and Sephardim do. A commonly cited reason for the Chabad custom is the intense holiness of the sukkah.</span></li>
<li><b>No decorations.</b> Chabad custom is generally not to decorate the sukkah.</li>
</ul>
<p><b>Chassidishe ushpizin.</b> Each night there is a guest from the Zohar's list (Avraham, Yitzchak, Yaakov, Moshe, Aharon, Yosef, Dovid). The Frierdiker Rebbe taught a parallel list of Chassidishe guests: the Baal Shem Tov, the Maggid, the Alter Rebbe, the Mitteler Rebbe, the Tzemach Tzedek, the Rebbe Maharash, and the Rebbe Rashab.</p>
<p><b>The Chassidus.</b> The sukkah is a <i>makif</i>, a mitzvah that surrounds you. A well-known Chassidic line: it is the one mitzvah you walk into with your whole body, boots and all.</p>`,
          terms: [
            { t: "Sukkah", h: "סוכה", m: "The temporary booth we live in during the festival" },
            { t: "Schach", h: "סכך", m: "The roof covering of plant material" },
            { t: "Leishev basukkah", h: "לישב בסוכה", m: "\"To dwell in the sukkah\": the bracha said when eating a meal there" },
            { t: "Ushpizin", h: "אושפיזין", m: "Aramaic: \"guests\". The spiritual guests who visit the sukkah each night" },
            { t: "Makif", h: "מקיף", m: "\"Surrounding\": a spiritual influence that encompasses a person rather than being absorbed inwardly" },
            { t: "K'zayis", h: "כזית", m: "An olive's volume: the minimum amount for many food mitzvos" }
          ],
          source: "Vayikra 23:42 to 43; Sukkah 11b; Shulchan Aruch, Orach Chaim 625 to 640; Sefer HaMinhagim (Sukkos)",
          doToday: "Eat and drink only in a sukkah today, including water and coffee. Tonight, identify the Chassidishe ushpiz of the night.",
          quiz: [
            { id: "m0-2-q1", t: "mc", q: "Minimum walls for a kosher sukkah?",
              o: ["Four full walls", "Three full walls", "Two full walls plus part of a third", "One wall if the schach is good"],
              a: 2, x: "Halachically, two full walls plus a small section of a third are enough. In practice most sukkos have three or four." },
            { id: "m0-2-q2", t: "tf", q: "A sukkah built under a tree is kosher as long as the schach itself is kosher.",
              a: false, x: "False. The schach must be under the open sky. A tree or roof above it disqualifies the part it covers." },
            { id: "m0-2-q3", t: "scenario", q: "It's Chol HaMoed. You're thirsty in the beis midrash, which is not a sukkah. You drink a cup of water there. Which is accurate?",
              o: ["Fine by basic halacha, but Chabad custom is to drink only in the sukkah", "Forbidden by basic halacha", "Fine by halacha and by Chabad custom"],
              a: 0, x: "Basic halacha does not require water in the sukkah. The Chabad custom is to eat and drink nothing outside it." },
            { id: "m0-2-q4", t: "mc", q: "When is the bracha leishev basukkah said?",
              o: ["Every time you enter the sukkah", "When eating a meal of bread, or a meal-sized amount of mezonos", "Only on the first night", "When eating fruit in the sukkah"],
              a: 1, x: "It is tied to a meal (bread, or a meal-sized amount of mezonos), not to fruit, drinks, or just entering. Ask Zalmy to show you the exact point in the meal where Chabad says it." },
            { id: "m0-2-q5", t: "tf", q: "Chabad chassidim sleep in the sukkah.",
              a: false, x: "False. Chabad custom is not to sleep in the sukkah, even though general halacha counts sleeping as part of the mitzvah." },
            { id: "m0-2-q6", t: "recall", q: "What are the two opinions in the Gemara about what the sukkos in the desert were?",
              model: "Rabbi Eliezer: the Clouds of Glory. Rabbi Akiva: real huts (Sukkah 11b).",
              x: "Both opinions fit the verse. The Shulchan Aruch (625) mentions the Clouds of Glory." },
            { id: "m0-2-q7", t: "mc", q: "Which of these is NOT one of the Chassidishe ushpizin?",
              o: ["The Baal Shem Tov", "The Maggid of Mezritch", "The Vilna Gaon", "The Tzemach Tzedek"],
              a: 2, x: "The Chassidishe ushpizin are the Baal Shem Tov, the Maggid, and the first five Chabad Rebbeim (through the Rebbe Rashab). The Vilna Gaon was the leading opponent of the Chassidic movement." }
          ],
          deeper: [
            { id: "m0-2-d1", t: "recall", q: "Explain \"teishvu k'ein taduru\" and give one practical consequence.",
              model: "\"Dwell as you would live\" at home. Consequences: meals are eaten in the sukkah, you treat it respectfully like your home, and you are exempt when staying there causes real discomfort (mitztaer), as you would leave a home that leaked.",
              x: "Many Chabad chassidim continue to eat in the sukkah even in rain. Ask Zalmy what the practice at Mayanot is." },
            { id: "m0-2-d2", t: "mc", q: "Why can't schach be made from a wooden bed frame or an old ladder?",
              o: ["It's too heavy", "It's a processed utensil (kli) that can become tamei", "It isn't green"],
              a: 1, x: "Schach must not be something that can receive tumah, which rules out utensils and food." }
          ],
          reflect: "A sukkah is a temporary home where you rely on Hashem, not on the walls. This whole year is temporary housing for you: away from home, with the business run remotely. What is actually giving you stability this year?",
          sayIt: { phrase: "Who's the Chassidishe ushpiz tonight?", h: "אושפיזא", meaning: "The Chassidic guest of the night, from the Frierdiker Rebbe's list.", when: "Around the sukkah table. Night 1: the Baal Shem Tov, 2: the Maggid, 3: the Alter Rebbe, 4: the Mitteler Rebbe, 5: the Tzemach Tzedek, 6: the Rebbe Maharash, 7: the Rebbe Rashab." }
        },

        /* ---------------------------------------------------------- */
        {
          id: "m0-3",
          title: "The four minim",
          minutes: 5,
          intro: true,
          teach: `
<p><b>The verse.</b> "You shall take for yourselves on the first day the fruit of a beautiful tree, branches of date palms, a branch of a thick-leafed tree, and willows of the brook" (Vayikra 23:40).</p>
<p><b>The four.</b></p>
<ul>
<li><b>Esrog:</b> 1.</li>
<li><b>Lulav:</b> 1.</li>
<li><b>Hadasim:</b> 3. The leaves grow in threes from each point on the stem.</li>
<li><b>Aravos:</b> 2. Long, narrow, smooth-edged leaves.</li>
</ul>
<p><b>What they mean.</b> The Midrash (Vayikra Rabbah 30:12) compares the four minim to four kinds of Jews. The esrog has taste and smell: Torah and good deeds. The lulav's date has taste without smell: Torah without deeds. The hadas has smell without taste: deeds without Torah. The aravah has neither. Hashem says: bind them together, and each one atones for the others. The mitzvah only works when all four are held together.</p>
<p><b>Basic kashrus.</b></p>
<ul>
<li><b>Lulav:</b> the middle leaf (the tiyomes) must not be split, and it must be fresh, not dried out.</li>
<li><b>Esrog:</b> the top section especially must be clean.</li>
<li><b>Hadasim:</b> the leaves must be in threes along most of the stem.</li>
<li><b>Aravos:</b> fresh, with the leaves intact.</li>
</ul>
<p>Buy from a reliable seller, and have someone experienced check your set.</p>
<p><b>Chabad binding.</b> Chabad binds the hadasim and aravos to the lulav with rings woven from lulav leaves, called <i>koishiklach</i>, not with a plastic holder. There is a specific Chabad arrangement for where each hadas and aravah sits around the lulav. Have Zalmy show you on a real set rather than learning it from text.</p>
<p><b>Ownership.</b> On the first day, "you shall take <i>for yourselves</i>" means the set should be yours. If you use someone else's, it must be given to you as a gift on condition that you give it back (matanah al m'nas l'hachzir). Ask how Mayanot handles shared sets.</p>
<p><b>Shabbos.</b> The minim are not taken on Shabbos. This is a rabbinic decree: someone might carry the lulav four amos in a public domain on the way to learn how to shake it (Sukkah 42b to 43a). This year the first day fell on Shabbos, so nobody anywhere took the lulav on 15 Tishrei.</p>`,
          terms: [
            { t: "Arba minim", h: "ארבעה מינים", m: "The four species" },
            { t: "Esrog", h: "אתרוג", m: "Citron: \"the fruit of a beautiful tree\"" },
            { t: "Lulav", h: "לולב", m: "Closed date-palm frond" },
            { t: "Hadas (pl. hadasim)", h: "הדס", m: "Myrtle" },
            { t: "Aravah (pl. aravos)", h: "ערבה", m: "Willow" },
            { t: "Koishiklach", h: "קוישיקלעך", m: "Yiddish: rings woven from lulav leaves, used by Chabad to bind the set" },
            { t: "Matanah al m'nas l'hachzir", h: "מתנה על מנת להחזיר", m: "A gift given on condition that it is returned" }
          ],
          source: "Vayikra 23:40; Vayikra Rabbah 30:12; Sukkah 42b to 43a; Sefer HaMinhagim (Sukkos)",
          doToday: "Hold a set (yours or borrowed properly). Name each min out loud, find the koishiklach, and ask Zalmy or a friend to show you the Chabad arrangement.",
          quiz: [
            { id: "m0-3-q1", t: "recall", q: "Name the four minim and how many of each are taken.",
              model: "1 esrog, 1 lulav, 3 hadasim, 2 aravos.",
              x: "The numbers of hadasim and aravos are the standard minimum and the Chabad practice." },
            { id: "m0-3-q2", t: "mc", q: "In the Midrash, the aravah (no taste, no smell) represents a Jew who has:",
              o: ["Torah but no good deeds", "Good deeds but no Torah", "Neither Torah nor good deeds", "Both"],
              a: 2, x: "The aravah has neither. The point of the Midrash is that it is still bound into the set, and the mitzvah needs it." },
            { id: "m0-3-q3", t: "tf", q: "This year, nobody took the lulav on 15 Tishrei.",
              a: true, x: "True. 15 Tishrei 5787 was Shabbos, and the minim are not taken on Shabbos, in Israel or anywhere else." },
            { id: "m0-3-q4", t: "mc", q: "Why aren't the minim taken on Shabbos?",
              o: ["Holding them is muktzeh", "A rabbinic decree: someone might carry them four amos in public to learn how to shake", "Shaking is a melacha", "Shabbos makes the mitzvah unnecessary"],
              a: 1, x: "It is Rabbah's decree in Sukkah 42b to 43a, the same reasoning as for shofar on Shabbos." },
            { id: "m0-3-q5", t: "scenario", q: "First day of Sukkos (not Shabbos). You have no set, and your chavrusa lends you his. What does it need to be, halachically?",
              o: ["Just borrowing is fine", "A gift to you on condition you give it back", "You must pay him for it"],
              a: 1, x: "On the first day the set should be your own (\"lachem\"). A matanah al m'nas l'hachzir makes it yours for the mitzvah." },
            { id: "m0-3-q6", t: "mc", q: "A kosher hadas has leaves that grow:",
              o: ["In pairs", "In threes from each point along the stem", "Singly, alternating"],
              a: 1, x: "Meshulash: three leaves from one point, along at least most of the stem." },
            { id: "m0-3-q7", t: "bracha", q: "After Sukkos you eat your esrog as jam. Which bracha rishona?",
              a: 3, x: "Ha'etz. The esrog is a tree fruit. Many people make esrog jam, and there is a custom that a woman eats it when she is expecting." }
          ],
          deeper: [
            { id: "m0-3-d1", t: "recall", q: "What part of the lulav is the tiyomes, and why does it matter?",
              model: "The middle leaf at the top of the spine, which is made of two leaves joined together. If it is split down the middle for most of its length, the lulav is invalid.",
              x: "This is the first thing to check on a lulav." },
            { id: "m0-3-d2", t: "tf", q: "The Torah-level obligation of the four minim outside the Beis HaMikdash is only the first day. The other days are rabbinic, in memory of the Mikdash.",
              a: true, x: "True. In the Mikdash they were taken all seven days. After the destruction, Rabban Yochanan ben Zakkai instituted seven days everywhere as a zecher l'Mikdash (Sukkah 41a)." }
          ],
          reflect: "Four types of Jews bound together. Think of someone at Mayanot, or a friend back home, whom you privately rate as an \"aravah\". What changes if you treat him as essential to the set, the way the mitzvah does?",
          sayIt: { phrase: "Are those koishiklach? Who bound it for you?", h: "קוישיקלעך", meaning: "Yiddish for the lulav-leaf rings Chabad uses to bind the set.", when: "While looking at someone's set on Chol HaMoed. It shows you know the Chabad way without showing off." }
        },

        /* ---------------------------------------------------------- */
        {
          id: "m0-4",
          title: "Na'anuim: shaking the Chabad way",
          minutes: 5,
          intro: false,
          teach: `
<p><b>When.</b> Every day of Sukkos except Shabbos, in the daytime. The widespread Chabad practice is to bentch lulav in the sukkah in the morning before davening, and then shake again during Hallel.</p>
<p><b>The bracha, Chabad order.</b></p>
<ol>
<li>Take the lulav (with the hadasim and aravos attached) in your right hand.</li>
<li>Say <i>al netilas lulav</i>. The first time each year, also say Shehecheyanu.</li>
<li><b>After</b> the bracha, pick up the esrog in your left hand and bring it next to the lulav so they touch.</li>
</ol>
<p><span class="diff">Difference: a common Ashkenazi practice is to hold the esrog upside down during the bracha and then turn it upright. Chabad does not pick up the esrog until after the bracha.</span> If you are left-handed, ask Zalmy which hand to use.</p>
<p><b>The directions.</b> Chabad follows the Arizal order. Facing east: <b>right (south), left (north), front (east), up, down, back (west)</b>. In each direction you stretch the minim out and bring them back three times. Each time you bring them back, they touch your chest at your heart. For "back", watch an experienced chassid do it; don't improvise. <span class="diff">Difference: many Ashkenazim follow the Rema's clockwise order: east, south, west, north, up, down.</span></p>
<p><b>In Hallel.</b> You shake at "Hodu laShem ki tov" and at "Ana Hashem hoshia na". In "Hodu", the six directions fall on the six words except Hashem's name: Hodu (right), ki (left), tov (front), ki (up), l'olam (down), chasdo (back). Follow the chazzan and the people around you for the timing.</p>
<p><b>Why.</b> The Gemara (Sukkah 37b): we move them out and back to the One to whom the four directions belong, and up and down to the One who owns heaven and earth. They also hold back harmful winds and dews. The Chassidic reading: you draw every direction of the world back to your heart.</p>
<p><b>Mivtza lulav.</b> The Rebbe pushed for every Jew to be given the chance to shake. Chabad bochurim spend Chol HaMoed offering the lulav in the street. A Jew who keeps nothing still says the bracha.</p>`,
          terms: [
            { t: "Na'anuim", h: "נענועים", m: "The shakings of the lulav" },
            { t: "Al netilas lulav", h: "על נטילת לולב", m: "The bracha on taking the lulav" },
            { t: "Bentch lulav", h: "בענטשן לולב", m: "Yiddish: to make the bracha and shake the lulav" },
            { t: "Hodu", h: "הודו", m: "\"Give thanks\": opening of Tehillim 118 in Hallel" },
            { t: "Ana Hashem hoshia na", h: "אנא ה׳ הושיעה נא", m: "\"Please Hashem, save us\" (Tehillim 118:25)" },
            { t: "Mivtza lulav", h: "מבצע לולב", m: "The campaign of offering the lulav to other Jews" }
          ],
          source: "Sukkah 37b; Siddur Admor HaZaken; Sefer HaMinhagim (Sukkos); the Arizal's order as adopted by Chabad",
          doToday: "Bentch lulav in the sukkah before Shacharis in the Chabad order, with the esrog picked up after the bracha. Then offer the lulav to one Jew who hasn't shaken today.",
          quiz: [
            { id: "m0-4-q1", t: "recall", q: "Give the Chabad order of the six directions, facing east.",
              model: "Right (south), left (north), front (east), up, down, back (west).",
              x: "This is the Arizal's order. You answered it correctly in the interview. Make sure you can do it with the chest-touching motion too." },
            { id: "m0-4-q2", t: "mc", q: "The common Ashkenazi (Rema) order is:",
              o: ["East, south, west, north, up, down", "South, north, east, up, down, west", "Up, down, east, west, north, south"],
              a: 0, x: "Clockwise starting east, then up and down. Chabad (and Sephardim) follow the Arizal: south, north, east, up, down, west." },
            { id: "m0-4-q3", t: "tf", q: "Chabad custom: hold the esrog upside down during the bracha.",
              a: false, x: "False. Chabad takes the lulav in the right hand, says the bracha, and only then picks up the esrog." },
            { id: "m0-4-q4", t: "mc", q: "According to Sukkah 37b, why do we shake out and back, and up and down?",
              o: ["To wake up the congregation", "To the One who owns the four directions, and heaven and earth; and to hold back harmful winds and dews", "To check the set is kosher", "To imitate the Leviim"],
              a: 1, x: "Both reasons are in the Gemara." },
            { id: "m0-4-q5", t: "mc", q: "How many times do you extend and bring back in each direction?",
              o: ["Once", "Twice", "Three times", "Seven times"],
              a: 2, x: "Three times per direction." },
            { id: "m0-4-q6", t: "scenario", q: "A Jewish tourist on Ben Yehuda who keeps nothing asks if he can shake your lulav. The right move:",
              o: ["Help him say the bracha and shake", "Let him shake without a bracha", "Politely refuse: it's for observant Jews"],
              a: 0, x: "Every Jew is obligated in the mitzvah and says the bracha. This is exactly what mivtza lulav is for. (On the first day, remember the ownership rule.)" },
            { id: "m0-4-q7", t: "tf", q: "In \"Hodu laShem ki tov\", you shake on the word \"Hashem\".",
              a: false, x: "False. You don't shake on the Divine name. The six directions fall on the other six words." }
          ],
          deeper: [
            { id: "m0-4-d1", t: "recall", q: "Why does Chabad pick up the esrog only after the bracha?",
              model: "A bracha is said over a mitzvah before you complete it (over l'asiyasan). If you held all four minim properly before the bracha, you would already have done the mitzvah. Holding only the lulav, and adding the esrog after, keeps the bracha before the mitzvah's completion.",
              x: "Upside-down esrog is another solution to the same problem, used by other communities." },
            { id: "m0-4-d2", t: "mc", q: "Why is the bracha \"al netilas lulav\" and not \"al netilas arba minim\"?",
              o: ["The lulav is the tallest and most prominent of the set", "Only the lulav is Torah-level", "It's an error in the siddur"],
              a: 0, x: "The Gemara (Sukkah 37b) says the bracha names the lulav since it is the tallest and most prominent. All four are needed." }
          ],
          reflect: "The motion brings every direction back to your heart. Right now your parnassah pulls you toward California time, prices, and customers. What would it look like to bring that direction back to your heart instead of letting it pull you away?",
          sayIt: { phrase: "Did you bentch lulav yet today?", h: "בענטשן לולב", meaning: "\"Bentch\" is Yiddish for making a bracha. \"Bentch lulav\" means doing the mitzvah.", when: "On Chol HaMoed, to a friend or to a stranger on mivtzoyim. This is exactly how Chabad bochurim ask." }
        },

        /* ---------------------------------------------------------- */
        {
          id: "m0-5",
          title: "Chol HaMoed and Simchas Beis HaShoeva",
          minutes: 5,
          intro: false,
          teach: `
<p><b>What Chol HaMoed is.</b> The intermediate days are still festival days. Many kinds of melacha are restricted, though not everything forbidden on Yom Tov. What is generally permitted:</p>
<ul>
<li>Food preparation for the festival.</li>
<li>Things needed for the festival itself.</li>
<li><i>Davar ha'aved</i>: work needed to prevent a real loss.</li>
</ul>
<p>Buying and selling and other routine business are restricted except to prevent a loss (Shulchan Aruch, Orach Chaim 539). Laundry and haircuts are generally forbidden.</p>
<p><b>Your business.</b> The following is general guidance; you need a rav for your actual policy.</p>
<ul>
<li><b>Real loss:</b> a customer who will book a competitor if you don't reply, or a problem that will cost money if left, is the kind of case many poskim permit you to handle.</li>
<li><b>Routine work:</b> bookkeeping, marketing, and price updates should wait until after Yom Tov.</li>
</ul>
<p class="flag">Set a standing Chol HaMoed policy with a rav: confirm with a rav.</p>
<p><b>Tefillin.</b> Chabad does not put on tefillin on Chol HaMoed. This follows the Zohar and the Arizal. <span class="diff">Difference: many Ashkenazim in chutz la'aretz do wear tefillin on Chol HaMoed. In Israel nearly everyone follows the no-tefillin practice.</span></p>
<p><b>Davening.</b> Full Hallel every day of Sukkos, plus Musaf and Hoshanos.</p>
<p><b>Simchas Beis HaShoeva.</b> In the Beis HaMikdash, water was poured on the mizbeach every day of Sukkos (<i>nisuch hamayim</i>). The celebration around drawing that water went on all night. There were torches, music, and great sages juggling. The Mishnah says: "Whoever did not see the Simchas Beis HaShoeva never saw joy in his life" (Sukkah 5:1). Water has no taste, unlike wine. The Chassidic point is that this is joy beyond understanding, from accepting the mitzvah simply.</p>
<p><b>The Rebbe's push.</b> In the 1980s the Rebbe called for public Simchas Beis HaShoeva celebrations every night of Sukkos, dancing in the streets. That is why Crown Heights, and Chabad houses worldwide, dance outside every night. On Yom Tov and Shabbos nights it's singing and dancing without instruments.</p>
<p><b>Zman simchaseinu.</b> Sukkos is specifically "the time of our joy". The Torah commands joy on it outright: "v'samachta b'chagecha" (Devarim 16:14).</p>`,
          terms: [
            { t: "Chol HaMoed", h: "חול המועד", m: "The intermediate days of Pesach and Sukkos" },
            { t: "Davar ha'aved", h: "דבר האבד", m: "A matter that will cause a loss if not done: the main heter for work on Chol HaMoed" },
            { t: "Simchas Beis HaShoeva", h: "שמחת בית השואבה", m: "The celebration of the water-drawing" },
            { t: "Nisuch hamayim", h: "ניסוך המים", m: "The water libation on the mizbeach during Sukkos" },
            { t: "Zman simchaseinu", h: "זמן שמחתנו", m: "\"The time of our joy\": the name of Sukkos in davening" }
          ],
          source: "Mishnah Sukkah 5:1; Devarim 16:14; Shulchan Aruch, Orach Chaim 530 to 548 (Chol HaMoed); Sefer HaMinhagim (tefillin on Chol HaMoed)",
          doToday: "Go to a Simchas Beis HaShoeva tonight and dance through at least one full niggun without checking your phone. Separately, write down what counts as real loss for the business, to bring to a rav.",
          quiz: [
            { id: "m0-5-q1", t: "tf", q: "Chabad puts on tefillin on Chol HaMoed without a bracha.",
              a: false, x: "False. Chabad does not put on tefillin at all on Chol HaMoed, following the Zohar and the Arizal." },
            { id: "m0-5-q2", t: "mc", q: "Simchas Beis HaShoeva celebrated:",
              o: ["The water libation in the Beis HaMikdash", "The end of the harvest", "The giving of the second luchos", "Rain falling"],
              a: 0, x: "Nisuch hamayim: water poured on the mizbeach each day of Sukkos." },
            { id: "m0-5-q3", t: "recall", q: "Quote (in English or Hebrew) the Mishnah about Simchas Beis HaShoeva.",
              model: "\"Whoever did not see the Simchas Beis HaShoeva never saw joy in his life.\" (Sukkah 5:1)",
              x: "Hebrew: מי שלא ראה שמחת בית השואבה לא ראה שמחה מימיו." },
            { id: "m0-5-q4", t: "scenario", q: "Chol HaMoed. A new customer texts to book next week and will go elsewhere if you don't answer today. Best answer?",
              o: ["Must wait until after Yom Tov, no exceptions", "Likely permitted as davar ha'aved; get a rav's standing policy", "Anything goes on Chol HaMoed"],
              a: 1, x: "Preventing a real loss is the classic Chol HaMoed heter. How far that stretches for your business needs a rav's ruling. Confirm with a rav." },
            { id: "m0-5-q5", t: "scenario", q: "You have free time on Chol HaMoed, so you do the monthly bookkeeping. OK?",
              o: ["Yes, it's not Yom Tov", "No: routine work with no loss involved should wait", "Only if Ari asks"],
              a: 1, x: "Nothing is lost by waiting, so there's no heter. Chol HaMoed is for the festival and for learning." },
            { id: "m0-5-q6", t: "mc", q: "Why is Sukkos called zman simchaseinu?",
              o: ["The Torah explicitly commands joy on it (Devarim 16:14)", "Because it comes after Yom Kippur", "Because of the harvest only"],
              a: 0, x: "\"V'samachta b'chagecha\" appears regarding Sukkos. The harvest and Yom Kippur add to it, but the command is the core." }
          ],
          deeper: [
            { id: "m0-5-d1", t: "recall", q: "Why is the joy connected to water rather than wine? Give the Chassidic idea.",
              model: "Wine has taste, so it represents understanding. Water has none, so it represents kabbalas ol: accepting Hashem's will simply. The greatest joy comes from that simple acceptance, which is beyond understanding.",
              x: "This theme recurs in Chassidus: simcha from bittul, not from comprehension." },
            { id: "m0-5-d2", t: "mc", q: "Which is generally permitted on Chol HaMoed?",
              o: ["Getting a haircut", "Doing laundry for next week", "Cooking for the festival meals", "Starting a new renovation"],
              a: 2, x: "Food preparation for the festival is permitted. Haircuts and laundry are specifically restricted." }
          ],
          reflect: "Draw the line for your business now: which three things would count as a real loss, and which are just things you feel you should keep up with? Put this question in your notebook for a rav.",
          sayIt: { phrase: "Mi shelo ra'ah simchas beis hashoeva lo ra'ah simcha miyamav.", h: "מי שלא ראה שמחת בית השואבה לא ראה שמחה מימיו", meaning: "Whoever did not see the Simchas Beis HaShoeva never saw joy in his life.", when: "When getting a friend to come out dancing on a Sukkos night. It's said with a smile." }
        },

        /* ---------------------------------------------------------- */
        {
          id: "m0-6",
          title: "Hoshana Rabbah",
          minutes: 5,
          intro: false,
          teach: `
<p><b>What it is.</b> The seventh day of Sukkos, 21 Tishrei. This year it is Friday 2 October, and Shemini Atzeres (Shabbos) begins that evening. It's still Chol HaMoed, but in tone it is a serious day. The Zohar describes it as the day when the judgment of Yom Kippur is finalized and "sent out". So the greeting is <i>piska tava</i> (Aramaic) or <i>a gut kvitel</i> (Yiddish): "a good note".</p>
<p><b>Hakafos with the lulav.</b> Every day of Sukkos we circle the bimah once with the lulav while saying Hoshanos. On Hoshana Rabbah we circle seven times.</p>
<p><b>The aravos.</b> After Hoshanos, each person takes a bundle of five aravos and beats it on the ground. The Gemara (Sukkah 44a) calls this a <i>minhag nevi'im</i>, a practice from the prophets. It is separate from the aravos in your lulav set, so buy a bundle in advance.</p>
<p><b>The night before.</b> The custom is to stay up learning. The Chabad custom is to say the entire Tehillim during the night, and afterward to eat an apple dipped in honey (Sefer HaMinhagim). It's the last "sweet year" moment of Tishrei.</p>
<p><b>This year's timing.</b> Hoshana Rabbah is Friday, so the day runs straight into Shabbos and Shemini Atzeres. Get your Shabbos preparations done early. In Israel, that Shabbos is also Simchas Torah.</p>
<p><b>The Chassidus.</b> The aravah is the simplest of the four minim: no taste, no smell. Yet on Hoshana Rabbah it gets a mitzvah of its own. The simple Jew, and the simple act, are the climax of the season.</p>`,
          terms: [
            { t: "Hoshana Rabbah", h: "הושענא רבה", m: "\"The great Hoshana\": the seventh day of Sukkos" },
            { t: "Hoshanos", h: "הושענות", m: "Prayers said while circling the bimah on Sukkos" },
            { t: "Hakafos", h: "הקפות", m: "Circuits around the bimah" },
            { t: "A gut kvitel", h: "א גוט קוויטל", m: "Yiddish: \"a good note\", the Hoshana Rabbah greeting" },
            { t: "Piska tava", h: "פתקא טבא", m: "Aramaic: \"a good note\", the same greeting" },
            { t: "Minhag nevi'im", h: "מנהג נביאים", m: "A practice instituted by the prophets" }
          ],
          source: "Sukkah 43b to 44a; Zohar (on Hoshana Rabbah as the day judgment is sent out); Sefer HaMinhagim (Hoshana Rabbah)",
          doToday: "Buy a bundle of five aravos for Hoshana Rabbah now. Find out when Mayanot's Tehillim starts on Hoshana Rabbah night (Thursday night, 1 Oct) and plan to be there.",
          quiz: [
            { id: "m0-6-q1", t: "mc", q: "Hoshana Rabbah is which day of Sukkos?",
              o: ["First", "Sixth", "Seventh", "Eighth"],
              a: 2, x: "The seventh, 21 Tishrei. The eighth day is Shemini Atzeres, a separate festival." },
            { id: "m0-6-q2", t: "recall", q: "What is the Yiddish Hoshana Rabbah greeting, and what does it mean?",
              model: "\"A gut kvitel\": a good note, meaning a good final verdict for the year.",
              x: "The Aramaic equivalent is \"piska tava\"." },
            { id: "m0-6-q3", t: "mc", q: "What is the halachic status of beating the aravos?",
              o: ["Torah commandment", "Minhag nevi'im (practice of the prophets)", "Kabbalistic custom from the Arizal", "Chabad custom only"],
              a: 1, x: "Sukkah 44a: a minhag (or yesod) nevi'im. It is universal, not only Chabad." },
            { id: "m0-6-q4", t: "tf", q: "Chabad custom: after saying Tehillim on Hoshana Rabbah night, eat an apple dipped in honey.",
              a: true, x: "True, per Sefer HaMinhagim." },
            { id: "m0-6-q5", t: "mc", q: "How many times do we circle the bimah on Hoshana Rabbah?",
              o: ["Once", "Three times", "Seven times", "Thirteen times"],
              a: 2, x: "Seven, compared with once on each of the other days." },
            { id: "m0-6-q6", t: "bracha", q: "The apple on Hoshana Rabbah night. Bracha rishona?",
              a: 3, x: "Ha'etz. Apples grow on trees. The honey is secondary (tafel), so it needs no separate bracha." },
            { id: "m0-6-q7", t: "mc", q: "How does the Zohar describe Hoshana Rabbah in terms of judgment?",
              o: ["A second Rosh Hashanah where judgment starts again", "The day the judgment sealed on Yom Kippur is finalized and sent out", "A day with no judgment at all"],
              a: 1, x: "Hence \"a gut kvitel\": may the note that goes out be good." }
          ],
          deeper: [
            { id: "m0-6-d1", t: "recall", q: "Why is it the aravah, the simplest min, that gets its own mitzvah on Hoshana Rabbah? Give a Chassidic answer.",
              model: "The aravah represents the simple Jew, and simple kabbalas ol, which reaches beyond intellect. At the climax of the season, that simple quality, not sophistication, is highlighted.",
              x: "The same theme appears with the water of Simchas Beis HaShoeva." },
            { id: "m0-6-d2", t: "tf", q: "The aravos used for beating on Hoshana Rabbah are the same two aravos bound in your lulav.",
              a: false, x: "False. It's a separate bundle, customarily five." }
          ],
          reflect: "Judgment has been sealed. What's one commitment you made on Yom Kippur that you've already slipped on? What's the concrete fix before the note goes out?",
          sayIt: { phrase: "A gut kvitel!", h: "א גוט קוויטל", meaning: "A good note: may your year's verdict be good.", when: "On Hoshana Rabbah night and day, to anyone. The standard greeting in Chabad." }
        },

        /* ---------------------------------------------------------- */
        {
          id: "m0-7",
          title: "Shemini Atzeres",
          minutes: 5,
          intro: false,
          teach: `
<p><b>A festival of its own.</b> Shemini Atzeres (22 Tishrei) is not just the "eighth day of Sukkos". The Gemara calls it a <i>regel bifnei atzmo</i>, a festival in its own right (Sukkah 48a). There is no lulav and no bracha of leishev basukkah, and it gets its own Shehecheyanu.</p>
<p><b>Why it exists.</b> Rashi (Vayikra 23:36) gives the parable of a king who invited his children to a feast for several days. When it was time to go, he said: "Your parting is difficult for me. Stay one more day." During Sukkos, 70 bulls are offered, corresponding to the 70 nations (Sukkah 55b). On Shemini Atzeres, only one: a private day between Hashem and the Jewish people.</p>
<p><b>Geshem.</b> In Musaf we begin <i>mashiv haruach umorid hageshem</i>, praising Hashem for rain. <span class="diff">Nusach Ari (Chabad) says <i>morid hatal</i> in the summer. Many Ashkenazim say nothing in its place.</span> The request for rain (<i>v'sein tal umatar</i>) is a separate thing. In Israel it starts on 7 Cheshvan; in chutz la'aretz, in early December. <b>When a ben chutz la'aretz in Israel should start it is disputed. Ask Zalmy.</b></p>
<p><b>Israel vs. chutz la'aretz.</b></p>
<ul>
<li><b>In Israel:</b> Shemini Atzeres and Simchas Torah are one day (this year Shabbos, 3 Oct), with hakafos at night and in the day. Hakafos shniyos on the night after are a widespread Israeli custom.</li>
<li><b>In chutz la'aretz:</b> Shemini Atzeres is 22 Tishrei and Simchas Torah is 23 Tishrei. The Chabad custom there is to eat in the sukkah on Shemini Atzeres, without the bracha of leishev basukkah, and not on Simchas Torah. Chabad in chutz la'aretz also holds hakafos on the night of Shemini Atzeres, following the Arizal.</li>
<li><b>If you keep two days in Israel:</b> how you handle the sukkah and the davening on 22 Tishrei needs a rav. Ask Zalmy how Mayanot runs it.</li>
</ul>`,
          terms: [
            { t: "Shemini Atzeres", h: "שמיני עצרת", m: "\"The eighth day of assembly\"" },
            { t: "Regel bifnei atzmo", h: "רגל בפני עצמו", m: "A festival in its own right" },
            { t: "Mashiv haruach umorid hageshem", h: "משיב הרוח ומוריד הגשם", m: "\"Who makes the wind blow and the rain fall\": the winter praise in the Amidah" },
            { t: "Morid hatal", h: "מוריד הטל", m: "\"Who makes the dew fall\": the summer phrase in Nusach Ari" },
            { t: "V'sein tal umatar", h: "ותן טל ומטר", m: "\"Give dew and rain\": the winter request in Barech Aleinu" },
            { t: "Kasheh alai preidaschem", h: "קשה עלי פרידתכם", m: "\"Your parting is difficult for Me\" (Rashi, Vayikra 23:36)" }
          ],
          source: "Vayikra 23:36 with Rashi; Sukkah 48a, 55b; Siddur Admor HaZaken; Sefer HaMinhagim (Shemini Atzeres)",
          doToday: "Put a sticky note in your siddur at \"Atah gibor\" in the Amidah: \"MASHIV HARUACH from Shemini Atzeres Musaf\". Add a question to your notebook: \"When do I start v'sein tal umatar?\"",
          quiz: [
            { id: "m0-7-q1", t: "mc", q: "What is Rashi's parable for Shemini Atzeres?",
              o: ["A king who asks his children to stay one more day because their parting is hard for him", "A farmer finishing his harvest", "A wedding's final meal", "A soldier returning home"],
              a: 0, x: "Rashi on Vayikra 23:36: \"kasheh alai preidaschem\"." },
            { id: "m0-7-q2", t: "tf", q: "The lulav is taken on Shemini Atzeres since it's the eighth day of Sukkos.",
              a: false, x: "False. It's a separate festival: no lulav, and no leishev basukkah." },
            { id: "m0-7-q3", t: "mc", q: "The 70 bulls of Sukkos correspond to:",
              o: ["The 70 elders", "The 70 nations of the world", "The 70 years of exile", "The 70 members of the Sanhedrin"],
              a: 1, x: "Sukkah 55b. On Shemini Atzeres, a single bull: Israel alone with Hashem." },
            { id: "m0-7-q4", t: "mc", q: "\"Mashiv haruach umorid hageshem\" begins at:",
              o: ["Maariv of Shemini Atzeres", "Musaf of Shemini Atzeres", "7 Cheshvan", "Simchas Torah night"],
              a: 1, x: "In Musaf of Shemini Atzeres, announced before the silent Amidah." },
            { id: "m0-7-q5", t: "scenario", q: "Chabad in chutz la'aretz, Shemini Atzeres (22 Tishrei) lunch. Where do they eat?",
              o: ["In the sukkah, without leishev basukkah", "In the sukkah, with leishev basukkah", "Indoors"],
              a: 0, x: "Chabad custom in chutz la'aretz: sukkah on Shemini Atzeres without the bracha; not on Simchas Torah." },
            { id: "m0-7-q6", t: "tf", q: "In Israel, Shemini Atzeres and Simchas Torah are the same day.",
              a: true, x: "True. This year it's Shabbos, 22 Tishrei (3 Oct)." }
          ],
          deeper: [
            { id: "m0-7-d1", t: "recall", q: "Explain the difference between \"mashiv haruach umorid hageshem\" and \"v'sein tal umatar\".",
              model: "Mashiv haruach is praise of Hashem's power to bring rain, said in the second bracha of the Amidah from Shemini Atzeres. V'sein tal umatar is a request for rain in Barech Aleinu, starting later (7 Cheshvan in Israel, early December in chutz la'aretz).",
              x: "Praise starts before request. The request waits so pilgrims could get home from Yerushalayim before the rains." },
            { id: "m0-7-d2", t: "scenario", q: "In the winter you mistakenly say \"morid hatal\" instead of \"mashiv haruach umorid hageshem\". Do you repeat the Amidah?",
              o: ["Yes, always", "No: having mentioned tal, you do not go back", "Only at Shacharis"],
              a: 1, x: "Shulchan Aruch 114: if you said tal in winter instead of geshem, you don't go back. If you said neither, you do. Nusach Ari says tal in the summer, so this rarely comes up for you." }
          ],
          reflect: "Hashem wants one more day that is just private. Where in your week is there time that is only yours and Hashem's, with no chavrusa, no audience, and no phone? If the answer is nowhere, where could it go?",
          sayIt: { phrase: "Kasheh alai preidaschem.", h: "קשה עלי פרידתכם", meaning: "\"Your parting is difficult for Me.\"", when: "At a Shemini Atzeres meal or farbrengen, or when saying goodbye to good friends at the end of a zman." }
        },

        /* ---------------------------------------------------------- */
        {
          id: "m0-8",
          title: "Simchas Torah and V'Yaakov halach l'darko",
          minutes: 5,
          intro: false,
          teach: `
<p><b>What happens.</b> We finish reading the Torah (V'zos HaBracha) and immediately start again from Bereishis, so there's no moment when we are "done" with Torah.</p>
<ul>
<li><b>Chasan Torah</b> is called up for the end of Devarim.</li>
<li><b>Chasan Bereishis</b> is called up for the beginning.</li>
<li><b>Aliyos:</b> everyone gets an aliyah.</li>
<li><b>Kol HaNe'arim:</b> all the children are called up together under a tallis.</li>
</ul>
<p><b>Hakafos.</b> Before hakafos we say the verses of <i>Atah Hareisa</i>, starting with "Atah hareisa lada'as ki Hashem hu haElokim, ein od milvado" (Devarim 4:35). Then there are seven circuits with the Sifrei Torah, and each hakafah is dancing, not a quick walk. Chabad holds hakafos at night and in the day. The Rebbe's hakafos were long and intense, and Chabad shuls follow that spirit.</p>
<p><b>Dancing with a closed Torah.</b> On Simchas Torah we don't learn the Torah; we dance with it closed. A well-known Chassidic teaching: the closed Torah makes the scholar and the simple Jew equal. On this day the Torah "rejoices" with its Jews, and we become its feet.</p>
<p><b>Tahalucha.</b> In Crown Heights and elsewhere, Chabad chassidim walk to other shuls on the festival to add to their joy. The same idea is done in Israel on Simchas Torah.</p>
<p><b>L'chaim.</b> There's a lot of l'chaim. The Rebbe gave a clear directive that anyone under 40 should limit himself to four small cups at a farbrengen. At 18, you're well under 40. Many chassidim drink less.</p>
<p><b>V'Yaakov halach l'darko.</b> After Tishrei ends, chassidim announce "V'Yaakov halach l'darko": "And Yaakov went on his way" (Bereishis 32:2). This is a well-known Chabad saying. Tishrei's inspiration now has to be "unpacked" into the regular winter: seder, davening, work. The Frierdiker Rebbe spoke of this at length.</p>`,
          terms: [
            { t: "Simchas Torah", h: "שמחת תורה", m: "The festival of completing the Torah reading" },
            { t: "Atah Hareisa", h: "אתה הראת", m: "Verses said before hakafos, opening with Devarim 4:35" },
            { t: "Chasan Torah / Chasan Bereishis", h: "חתן תורה / חתן בראשית", m: "Those honored with the final and first aliyos" },
            { t: "Kol HaNe'arim", h: "כל הנערים", m: "The aliyah for all the children together" },
            { t: "Tahalucha", h: "תהלוכה", m: "A procession: walking to other shuls to bring joy" },
            { t: "V'Yaakov halach l'darko", h: "ויעקב הלך לדרכו", m: "\"And Yaakov went on his way\": back to routine after Tishrei" },
            { t: "L'chaim", h: "לחיים", m: "\"To life\": the toast at a farbrengen" }
          ],
          source: "Devarim 4:35; Bereishis 32:2; Shulchan Aruch, Orach Chaim 669; Sefer HaMinhagim (Simchas Torah)",
          doToday: "Learn the first verse of Atah Hareisa by heart before hakafos. At hakafos, dance through every one of the seven.",
          quiz: [
            { id: "m0-8-q1", t: "mc", q: "Why do we start Bereishis immediately after finishing Devarim?",
              o: ["To show that Torah learning never stops", "To finish shul earlier", "Because Bereishis is the most important book", "To honor the Chasan Bereishis"],
              a: 0, x: "There's no gap in which we are \"done\" with Torah." },
            { id: "m0-8-q2", t: "recall", q: "What does \"V'Yaakov halach l'darko\" mean, and when do chassidim say it?",
              model: "\"And Yaakov went on his way\" (Bereishis 32:2). Said after Tishrei ends, meaning: now take Tishrei's inspiration into the regular routine of the year.",
              x: "Know it before you hear it at a farbrengen." },
            { id: "m0-8-q3", t: "mc", q: "Chasan Bereishis is:",
              o: ["The groom at a Simchas Torah wedding", "The person called up for the first section of Bereishis", "The youngest boy in shul", "The gabbai"],
              a: 1, x: "Chasan Torah finishes Devarim; Chasan Bereishis begins Bereishis." },
            { id: "m0-8-q4", t: "tf", q: "Chabad only holds hakafos at night.",
              a: false, x: "False. Chabad holds hakafos at night and in the day." },
            { id: "m0-8-q5", t: "mc", q: "Kol HaNe'arim means:",
              o: ["All the children are called up together under a tallis", "The children dance first", "The children read the haftarah", "Only boys over 13 get aliyos"],
              a: 0, x: "The whole congregation's children go up together." },
            { id: "m0-8-q6", t: "scenario", q: "Simchas Torah farbrengen, and someone keeps refilling your cup. Per the Rebbe's directive for someone your age:",
              o: ["Keep up with the room; it's Simchas Torah", "At most four small cups (the Rebbe's limit for under 40)", "Alcohol is forbidden to you"],
              a: 1, x: "The Rebbe directed that people under 40 limit themselves to four small cups at a farbrengen. Plenty of chassidim drink less." },
            { id: "m0-8-q7", t: "recall", q: "Say the first verse of Atah Hareisa and translate it.",
              model: "\"Atah hareisa lada'as ki Hashem hu haElokim, ein od milvado\": You have been shown, to know that Hashem is G-d; there is nothing else besides Him (Devarim 4:35).",
              x: "\"Ein od milvado\" is also a core Chassidic idea: nothing truly exists apart from Hashem." }
          ],
          deeper: [
            { id: "m0-8-d1", t: "recall", q: "Why do we dance with the Torah closed on Simchas Torah? Give the Chassidic idea.",
              model: "Closed, the Torah is not being learned, so the scholar has no advantage over the simple Jew. The joy comes from the essential connection every Jew has to the Torah, which is beyond understanding. Everyone is equal.",
              x: "This is the same theme again: beyond intellect, the essence." },
            { id: "m0-8-d2", t: "tf", q: "In Israel this year, Simchas Torah falls on Shabbos (22 Tishrei, 3 Oct).",
              a: true, x: "True. In Israel, hakafos shniyos on Motzei Simchas Torah are a widespread custom." }
          ],
          reflect: "\"V'Yaakov halach l'darko\": what is your derech for this winter? Write three concrete commitments: one for your learning seder, one for Chitas, and one for a business boundary (for example, no customer messages during night seder).",
          sayIt: { phrase: "V'Yaakov halach l'darko.", h: "ויעקב הלך לדרכו", meaning: "\"And Yaakov went on his way\": Tishrei is over; now the real work starts.", when: "Motzei Simchas Torah or on Shabbos Bereishis, when the routine resumes. Chassidim say it to each other with a knowing look." }
        }
      ]
    },

    /* ============================================================ */
    { id: "m1", title: "Foundations", subtitle: "What Chabad is, and the seven Rebbeim", built: false, lessons: [
      { id: "m1-1", title: "What Chabad is" },
      { id: "m1-2", title: "Chochmah, Binah, Daas" },
      { id: "m1-3", title: "The Alter Rebbe" },
      { id: "m1-4", title: "The Mitteler Rebbe" },
      { id: "m1-5", title: "The Tzemach Tzedek" },
      { id: "m1-6", title: "The Rebbe Maharash" },
      { id: "m1-7", title: "The Rebbe Rashab" },
      { id: "m1-8", title: "The Frierdiker Rebbe" },
      { id: "m1-9", title: "The Rebbe" },
      { id: "m1-10", title: "The Rebbe's vision: shlichus and Moshiach" }
    ]},
    { id: "m4", title: "Shabbos", subtitle: "The 39 melachos, muktzeh, eruv, and your business", built: false, lessons: [
      { id: "m4-1", title: "Why Shabbos: melacha and the Mishkan" },
      { id: "m4-2", title: "The 39 melachos in groups" },
      { id: "m4-3", title: "Borer" },
      { id: "m4-4", title: "Bishul: hot water, cholent, kli rishon and sheni" },
      { id: "m4-5", title: "Tochen, Lash, and food prep" },
      { id: "m4-6", title: "Fire and electricity" },
      { id: "m4-7", title: "Writing, erasing, tearing packages" },
      { id: "m4-8", title: "Building, demolishing, Makeh B'patish" },
      { id: "m4-9", title: "Clothing and hair" },
      { id: "m4-10", title: "Hotza'ah: the four domains" },
      { id: "m4-11", title: "Eruv and the key belt" },
      { id: "m4-12", title: "Muktzeh" },
      { id: "m4-13", title: "Asking others to do melacha" },
      { id: "m4-14", title: "Chabad Shabbos customs" },
      { id: "m4-15", title: "Business: time zones and when Shabbos ends" },
      { id: "m4-16", title: "Business: messages, auto-replies, automated booking" },
      { id: "m4-17", title: "Business: your partner on Shabbos, and sechar Shabbos" }
    ]},
    { id: "m3", title: "Brachos", subtitle: "Categories, precedence, ikar and tafel", built: false, lessons: [
      { id: "m3-1", title: "Why brachos, and the six brachos rishonos" },
      { id: "m3-2", title: "Brachos acharonos" },
      { id: "m3-3", title: "Mezonos in depth (including rice)" },
      { id: "m3-4", title: "Ha'etz vs. Ha'adama" },
      { id: "m3-5", title: "Ikar and tafel" },
      { id: "m3-6", title: "Order of precedence" },
      { id: "m3-7", title: "Mixtures and tricky foods" },
      { id: "m3-8", title: "Drinks, and when to make a new bracha" },
      { id: "m3-9", title: "Kvias seudah and pas haba'ah b'kisnin" },
      { id: "m3-10", title: "Brachos on smells and sights" }
    ]},
    { id: "m5", title: "Kashrus", subtitle: "Chabad standards and Israel-specific mitzvos", built: false, lessons: [
      { id: "m5-1", title: "Meat and milk in depth" },
      { id: "m5-2", title: "Chalav Yisrael" },
      { id: "m5-3", title: "Pas Yisrael" },
      { id: "m5-4", title: "Bishul Yisrael" },
      { id: "m5-5", title: "Hechsherim in Israel" },
      { id: "m5-6", title: "Terumos and maasros" },
      { id: "m5-7", title: "Shmitta and orlah" }
    ]},
    { id: "m9", title: "Daily Learning", subtitle: "Chitas and Rambam, starting small", built: false, lessons: [
      { id: "m9-1", title: "What Chitas and Rambam are" },
      { id: "m9-2", title: "Stage 1: Tanya and Tehillim" },
      { id: "m9-3", title: "Stage 2: Chumash with Rashi" },
      { id: "m9-4", title: "Stage 3: Rambam or Sefer HaMitzvos" }
    ]},
    { id: "m2", title: "Daily Routine and Davening", subtitle: "From Modeh Ani to Kriyas Shema al HaMitah", built: false, lessons: [
      { id: "m2-1", title: "Modeh Ani and negel vasser" },
      { id: "m2-2", title: "Tefillin: Chabad details" },
      { id: "m2-3", title: "Rabbeinu Tam tefillin" },
      { id: "m2-4", title: "Birchos HaShachar" },
      { id: "m2-5", title: "Karbanos" },
      { id: "m2-6", title: "Pesukei D'zimra" },
      { id: "m2-7", title: "Shema and its brachos" },
      { id: "m2-8", title: "Shemoneh Esrei" },
      { id: "m2-9", title: "Tachanun to Aleinu" },
      { id: "m2-10", title: "Mincha and Maariv" },
      { id: "m2-11", title: "Kriyas Shema al HaMitah and hisbonenus" }
    ]},
    { id: "m7", title: "The Chabad Calendar", subtitle: "What happened, and how it's marked", built: false, lessons: [
      { id: "m7-1", title: "Chof Cheshvan" },
      { id: "m7-2", title: "Yud Tes Kislev" },
      { id: "m7-3", title: "Chof Daled Teves" },
      { id: "m7-4", title: "Yud Shvat" },
      { id: "m7-5", title: "Yud Aleph Nissan" },
      { id: "m7-6", title: "Gimmel Tammuz" },
      { id: "m7-7", title: "Yud Beis Tammuz" },
      { id: "m7-8", title: "Chof Av" },
      { id: "m7-9", title: "Chai Elul" },
      { id: "m7-10", title: "How a Chabad date is marked" }
    ]},
    { id: "m8", title: "Tanya and Chassidus", subtitle: "The early chapters and the core ideas", built: false, lessons: [
      { id: "m8-1", title: "Tanya ch. 1: tzaddik, rasha, beinoni" },
      { id: "m8-2", title: "Tanya ch. 2: the G-dly soul" },
      { id: "m8-3", title: "Tanya ch. 3 to 5: the soul's powers and garments" },
      { id: "m8-4", title: "Tanya ch. 6 to 8: kelipah and the animal soul" },
      { id: "m8-5", title: "Tanya ch. 9: the battle for the body" },
      { id: "m8-6", title: "Tanya ch. 10: the tzaddik" },
      { id: "m8-7", title: "Tanya ch. 11: the rasha" },
      { id: "m8-8", title: "Tanya ch. 12: the beinoni" },
      { id: "m8-9", title: "Bittul" },
      { id: "m8-10", title: "Dirah b'tachtonim" },
      { id: "m8-11", title: "Hashgacha pratis" },
      { id: "m8-12", title: "Iskafya vs. is'hapcha" },
      { id: "m8-13", title: "Simcha" },
      { id: "m8-14", title: "Emunah and bitachon" }
    ]},
    { id: "m6", title: "The Jewish Calendar", subtitle: "How it works, and every holiday", built: false, lessons: [
      { id: "m6-1", title: "How the calendar works" },
      { id: "m6-2", title: "Rosh Chodesh" },
      { id: "m6-3", title: "Chanukah" },
      { id: "m6-4", title: "Asarah B'Teves and the fast days" },
      { id: "m6-5", title: "Tu B'Shvat" },
      { id: "m6-6", title: "Purim" },
      { id: "m6-7", title: "Pesach, deeper" },
      { id: "m6-8", title: "Sefiras HaOmer and Lag BaOmer" },
      { id: "m6-9", title: "Shavuos" },
      { id: "m6-10", title: "The Three Weeks and Tishah B'Av" },
      { id: "m6-11", title: "Elul" },
      { id: "m6-12", title: "Rosh Hashanah and Yom Kippur" }
    ]},
    { id: "m11", title: "Chabad Life and Culture", subtitle: "Farbrengens, mivtzoyim, niggunim, Yiddish", built: false, lessons: [
      { id: "m11-1", title: "What a farbrengen is" },
      { id: "m11-2", title: "Farbrengen etiquette" },
      { id: "m11-3", title: "The mashpia" },
      { id: "m11-4", title: "L'chaim culture" },
      { id: "m11-5", title: "Mivtzoyim" },
      { id: "m11-6", title: "The Rebbe's ten mivtzoyim" },
      { id: "m11-7", title: "Niggunim" },
      { id: "m11-8", title: "Chassidic Yiddish vocabulary" }
    ]},
    { id: "m10", title: "Chassidus in Real Life", subtitle: "Business, body, friendship, middos", built: false, lessons: [
      { id: "m10-1", title: "Honesty in business" },
      { id: "m10-2", title: "Maaser" },
      { id: "m10-3", title: "Bitachon and parnassah" },
      { id: "m10-4", title: "The body: the Rambam and the Rebbe on health" },
      { id: "m10-5", title: "Ahavas Yisrael" },
      { id: "m10-6", title: "Chassidishe friendship" },
      { id: "m10-7", title: "Working on middos" },
      { id: "m10-8", title: "Cheshbon hanefesh" }
    ]},
    { id: "m13", title: "Speak Like You Know It", subtitle: "Phrases, references, and what they mean", built: false, lessons: [
      { id: "m13-1", title: "Everyday Chabad phrases" },
      { id: "m13-2", title: "Farbrengen phrases" },
      { id: "m13-3", title: "The Rebbeim's famous sayings" },
      { id: "m13-4", title: "The Rebbe's famous lines" },
      { id: "m13-5", title: "Hayom Yom lines worth knowing" },
      { id: "m13-6", title: "Yeshiva vocabulary" },
      { id: "m13-7", title: "References and in-jokes" },
      { id: "m13-8", title: "When not to use them" }
    ]},
    { id: "m12", title: "Building a Jewish Home", subtitle: "For later, but worth knowing early", built: false, lessons: [
      { id: "m12-1", title: "The Chabad view of marriage" },
      { id: "m12-2", title: "Mezuzah" },
      { id: "m12-3", title: "Shalom bayis" },
      { id: "m12-4", title: "What to know long before dating" },
      { id: "m12-5", title: "Talking to your mashpia about it" }
    ]}
  ],

  /* ============================================================
     PLACEMENT: 3 questions per module. Same question format.
     Score 3/3 = "Advanced" (intro lessons can be tested out),
     2/3 = "Review", 0 to 1 = "Foundation" (extra review added).
     ============================================================ */
  placement: {
    m0: [
      { id: "p-m0-1", t: "mc", q: "Hoshana Rabbah is:", o: ["The 7th day of Sukkos", "The 8th day", "The 1st day of Chol HaMoed", "The day after Simchas Torah"], a: 0, x: "The 7th day, 21 Tishrei." },
      { id: "p-m0-2", t: "tf", q: "Chabad puts on tefillin on Chol HaMoed.", a: false, x: "False. Chabad does not wear tefillin on Chol HaMoed." },
      { id: "p-m0-3", t: "mc", q: "Chabad order of na'anuim, facing east:", o: ["Right, left, front, up, down, back", "Front, right, back, left, up, down", "Up, down, front, back, right, left"], a: 0, x: "The Arizal's order: south, north, east, up, down, west." }
    ],
    m1: [
      { id: "p-m1-1", t: "mc", q: "Who was the Mitteler Rebbe?", o: ["R' DovBer, the second Rebbe, son of the Alter Rebbe", "R' Menachem Mendel, the third Rebbe", "R' Shmuel, the fourth Rebbe"], a: 0, x: "R' DovBer (1773 to 1827)." },
      { id: "p-m1-2", t: "mc", q: "ChaBaD is an acronym for:", o: ["Chochmah, Binah, Daas", "Chesed, Binah, Deveikus", "Chassidus, Bittul, Daas"], a: 0, x: "Wisdom, understanding, knowledge: the intellectual faculties." },
      { id: "p-m1-3", t: "mc", q: "Who wrote the Tanya?", o: ["The Baal Shem Tov", "The Alter Rebbe", "The Rebbe"], a: 1, x: "Rabbi Shneur Zalman of Liadi, the Alter Rebbe. First printed in 1796." }
    ],
    m4: [
      { id: "p-m4-1", t: "mc", q: "Picking bones out of fish on Shabbos (leaving the meat) involves:", o: ["Borer", "Dash", "Tochen", "No problem"], a: 0, x: "Removing the unwanted from the wanted is Borer." },
      { id: "p-m4-2", t: "mc", q: "No eruv. Carrying a house key outside on Shabbos:", o: ["Fine in a pocket", "Forbidden, but there's a known heter for a key built into a working belt clasp", "Always fine if it's small"], a: 1, x: "A key-belt makes the key part of what you wear. Ask a rav before relying on it." },
      { id: "p-m4-3", t: "mc", q: "The 39 melachos are derived from:", o: ["The work done to build the Mishkan", "The ten commandments", "The days of creation"], a: 0, x: "Shabbos 49b: the categories of work used in building the Mishkan." }
    ],
    m3: [
      { id: "p-m3-1", t: "bracha", q: "Bracha rishona on plain cooked rice?", a: 1, x: "Mezonos. The bracha after it is Borei Nefashos." },
      { id: "p-m3-2", t: "mc", q: "Bracha acharona after a banana?", o: ["Borei Nefashos", "Al Ha'etz", "None"], a: 0, x: "A banana is Ha'adama, so Borei Nefashos." },
      { id: "p-m3-3", t: "mc", q: "Cereal with milk:", o: ["Bracha on the cereal only", "Bracha on each", "Shehakol only"], a: 0, x: "The milk is tafel to the cereal." }
    ],
    m5: [
      { id: "p-m5-1", t: "mc", q: "Chabad waiting time between meat and dairy:", o: ["1 hour", "3 hours", "6 hours"], a: 2, x: "Six hours." },
      { id: "p-m5-2", t: "mc", q: "Chalav Yisrael means:", o: ["Milk from a Jewish-owned farm", "Milk whose milking was watched by a Jew", "Any milk with a hechsher"], a: 1, x: "Supervised milking. Chabad is careful about it." },
      { id: "p-m5-3", t: "tf", q: "Terumos and maasros apply to produce grown in Eretz Yisrael.", a: true, x: "True, which is why hechsherim in Israel matter." }
    ],
    m9: [
      { id: "p-m9-1", t: "mc", q: "Chitas stands for:", o: ["Chumash, Tehillim, Tanya", "Chumash, Tefillah, Shulchan Aruch", "Chassidus, Tanya, Sichos"], a: 0, x: "Chumash, Tehillim, Tanya." },
      { id: "p-m9-2", t: "mc", q: "The daily Rambam cycle was instituted by:", o: ["The Rambam himself", "The Rebbe, in 1984", "The Alter Rebbe"], a: 1, x: "The Rebbe instituted it in 5744 (1984)." },
      { id: "p-m9-3", t: "mc", q: "Hayom Yom is:", o: ["A daily calendar of Chassidic teachings and customs compiled by the Rebbe", "A siddur", "A Yom Kippur machzor"], a: 0, x: "Compiled by the Rebbe at the Frierdiker Rebbe's request, 5703 (1943)." }
    ],
    m2: [
      { id: "p-m2-1", t: "mc", q: "Weekday Shacharis order:", o: ["Birchos HaShachar, Pesukei D'zimra, Shema and its brachos, Shemoneh Esrei", "Pesukei D'zimra, Birchos HaShachar, Shemoneh Esrei, Shema", "Shema, Pesukei D'zimra, Birchos HaShachar, Shemoneh Esrei"], a: 0, x: "Morning brachos, praises, Shema, then the Amidah." },
      { id: "p-m2-2", t: "mc", q: "Rabbeinu Tam tefillin differ from Rashi tefillin in:", o: ["The order of the parshiyos inside", "The color of the straps", "Which arm they're worn on"], a: 0, x: "The order of the four parshiyos." },
      { id: "p-m2-3", t: "mc", q: "Kriyas Shema al HaMitah is said:", o: ["Before going to sleep", "At sunrise", "Only on Shabbos"], a: 0, x: "Before going to sleep at night." }
    ],
    m7: [
      { id: "p-m7-1", t: "mc", q: "What happened on Yud Tes Kislev?", o: ["The Alter Rebbe was freed from prison", "The Rebbe accepted leadership", "The Frierdiker Rebbe was freed"], a: 0, x: "19 Kislev 5559 (1798)." },
      { id: "p-m7-2", t: "mc", q: "Gimmel Tammuz is:", o: ["The Rebbe's passing (1994)", "The Rebbe's birthday", "The founding of Tomchei Temimim"], a: 0, x: "3 Tammuz 5754." },
      { id: "p-m7-3", t: "mc", q: "Yud Shvat marks:", o: ["The Frierdiker Rebbe's passing, and a year later the Rebbe's acceptance of leadership", "The Alter Rebbe's birthday", "Tu B'Shvat"], a: 0, x: "10 Shvat 5710 (1950) and 10 Shvat 5711 (1951)." }
    ],
    m8: [
      { id: "p-m8-1", t: "mc", q: "In Tanya, a beinoni is someone who:", o: ["Never actually sins in deed, speech, or thought, but his evil inclination is still active", "Sins and then does teshuva", "Has half mitzvos and half aveiros"], a: 0, x: "Tanya ch. 12." },
      { id: "p-m8-2", t: "mc", q: "Iskafya means:", o: ["Subduing the animal soul", "Transforming evil into good", "Total self-nullification"], a: 0, x: "Transforming is is'hapcha." },
      { id: "p-m8-3", t: "mc", q: "Tanya's two souls are:", o: ["The G-dly soul and the animal soul", "The body and the soul", "The intellect and the emotions"], a: 0, x: "Nefesh Elokis and nefesh habehamis (Tanya ch. 1 to 2)." }
    ],
    m6: [
      { id: "p-m6-1", t: "mc", q: "The Jewish calendar is:", o: ["Lunar, adjusted to the sun with a leap month 7 times in 19 years", "Purely lunar", "Purely solar"], a: 0, x: "Lunisolar. The leap year adds Adar II." },
      { id: "p-m6-2", t: "mc", q: "Tu B'Shvat is:", o: ["The new year for trees", "The new year for kings", "A fast day"], a: 0, x: "Mishnah Rosh Hashanah 1:1." },
      { id: "p-m6-3", t: "mc", q: "Shavuos commemorates:", o: ["Matan Torah", "The Exodus", "The Temple's dedication"], a: 0, x: "The giving of the Torah at Sinai." }
    ],
    m11: [
      { id: "p-m11-1", t: "mc", q: "What is a mashpia?", o: ["A spiritual mentor", "A rosh yeshiva", "The farbrengen host who pours"], a: 0, x: "A mentor in avodas Hashem." },
      { id: "p-m11-2", t: "mc", q: "A farbrengen is:", o: ["A Chassidic gathering with words of Torah, stories, niggunim, l'chaim, and practical resolutions", "A lecture", "A wedding meal"], a: 0, x: "The goal is real change, not just inspiration." },
      { id: "p-m11-3", t: "mc", q: "\"Mivtzoyim\" means:", o: ["The Rebbe's mitzvah campaigns, like helping Jews put on tefillin", "Chassidic melodies", "Yeshiva exams"], a: 0, x: "Campaigns: tefillin, Shabbos candles, and more." }
    ],
    m10: [
      { id: "p-m10-1", t: "mc", q: "Maaser is:", o: ["Giving 10% of income to tzedakah", "A tax to the yeshiva", "A Shabbos meal"], a: 0, x: "A tenth. A fifth (chomesh) is a higher level." },
      { id: "p-m10-2", t: "mc", q: "Where does the Rambam give detailed health guidance?", o: ["Hilchos Deos, ch. 4", "Hilchos Shabbos", "Hilchos Tefillin"], a: 0, x: "Hilchos Deos ch. 4: exercise, eating, sleep." },
      { id: "p-m10-3", t: "mc", q: "Which Tanya chapter is famous for ahavas Yisrael?", o: ["Ch. 32", "Ch. 1", "Ch. 50"], a: 0, x: "Tanya ch. 32." }
    ],
    m13: [
      { id: "p-m13-1", t: "mc", q: "\"Tracht gut vet zain gut\" means:", o: ["Think good and it will be good", "Try hard and succeed", "Learn well and daven well"], a: 0, x: "The Tzemach Tzedek's famous line." },
      { id: "p-m13-2", t: "mc", q: "\"Lechatchila ariber\" is associated with:", o: ["The Rebbe Maharash", "The Alter Rebbe", "The Rebbe"], a: 0, x: "\"From the outset, go over\": don't bother trying to go under an obstacle." },
      { id: "p-m13-3", t: "mc", q: "\"Ufaratzta\" comes from a verse meaning:", o: ["You shall spread out (west, east, north, south)", "You shall rest", "You shall be holy"], a: 0, x: "Bereishis 28:14, a Chabad slogan for spreading Yiddishkeit." }
    ],
    m12: [
      { id: "p-m12-1", t: "mc", q: "A mezuzah goes on which side of the doorway?", o: ["The right side as you walk in", "The left side as you walk in", "Either side"], a: 0, x: "The right side, in the upper third." },
      { id: "p-m12-2", t: "mc", q: "Inside a mezuzah:", o: ["Shema and V'haya im shamoa, handwritten on parchment", "The Ten Commandments", "A printed prayer"], a: 0, x: "Two parshiyos, written by a sofer." },
      { id: "p-m12-3", t: "mc", q: "Shalom bayis means:", o: ["Peace and harmony in the home", "A housewarming party", "A home blessing ceremony"], a: 0, x: "A central value in the Jewish home." }
    ]
  },

  /* Extra glossary entries not tied to a specific lesson */
  glossaryExtra: [
    { t: "Chabad", h: "חב״ד", m: "Acronym of Chochmah, Binah, Daas: the Chassidic movement founded by the Alter Rebbe" },
    { t: "Chochmah", h: "חכמה", m: "Wisdom: the flash of insight" },
    { t: "Binah", h: "בינה", m: "Understanding: developing the idea in detail" },
    { t: "Daas", h: "דעת", m: "Knowledge: internalizing the idea so it drives emotion and action" },
    { t: "Chitas", h: "חת״ת", m: "Chumash, Tehillim, Tanya: the daily Chabad learning portion" },
    { t: "Hayom Yom", h: "היום יום", m: "A daily book of Chassidic teachings and customs compiled by the Rebbe (1943)" },
    { t: "Sefer HaMinhagim", h: "ספר המנהגים", m: "The book of Chabad customs" },
    { t: "Shulchan Aruch HaRav", h: "שולחן ערוך הרב", m: "The Alter Rebbe's code of halacha" },
    { t: "Tanya", h: "תניא", m: "The Alter Rebbe's foundational work of Chabad Chassidus (1796)" },
    { t: "Igros Kodesh", h: "אגרות קודש", m: "The published letters of the Rebbeim" },
    { t: "Sichah (pl. sichos)", h: "שיחה", m: "A talk given by the Rebbe" },
    { t: "Maamar", h: "מאמר", m: "A formal Chassidic discourse" },
    { t: "Farbrengen", h: "פארבריינגען", m: "Yiddish: a Chassidic gathering for growth, with stories, niggunim, and l'chaim" },
    { t: "Mashpia", h: "משפיע", m: "A spiritual mentor" },
    { t: "Bochur", h: "בחור", m: "A young unmarried yeshiva student" },
    { t: "Beinoni", h: "בינוני", m: "\"Intermediate\": one who never sins in deed, speech, or thought, though his evil inclination is still active (Tanya ch. 12)" },
    { t: "Nefesh Elokis", h: "נפש אלקית", m: "The G-dly soul" },
    { t: "Nefesh habehamis", h: "נפש הבהמית", m: "The animal soul" },
    { t: "Iskafya", h: "אתכפיא", m: "Subduing the animal soul" },
    { t: "Is'hapcha", h: "אתהפכא", m: "Transforming the animal soul's drives into good" },
    { t: "Bittul", h: "ביטול", m: "Self-nullification before Hashem" },
    { t: "Dirah b'tachtonim", h: "דירה בתחתונים", m: "\"A dwelling in the lowest realms\": the purpose of creation" },
    { t: "Hashgacha pratis", h: "השגחה פרטית", m: "Divine providence over every detail" },
    { t: "Hisbonenus", h: "התבוננות", m: "Contemplative meditation on a Chassidic idea, especially before and during davening" },
    { t: "Mivtzoyim", h: "מבצעים", m: "The Rebbe's mitzvah campaigns" },
    { t: "Shliach (pl. shluchim)", h: "שליח", m: "An emissary of the Rebbe" },
    { t: "Niggun", h: "ניגון", m: "A Chassidic melody" },
    { t: "Tomchei Temimim", h: "תומכי תמימים", m: "The Chabad yeshiva system founded by the Rebbe Rashab in 1897" },
    { t: "770", h: "", m: "770 Eastern Parkway, Brooklyn: Chabad headquarters and the Rebbe's shul" },
    { t: "Ohel", h: "אוהל", m: "The resting place of the Rebbe and the Frierdiker Rebbe in Queens, NY" },
    { t: "Daven", h: "דאווענען", m: "Yiddish: to pray" },
    { t: "Bentch", h: "בענטשן", m: "Yiddish: to bless; also to say Birkas Hamazon" },
    { t: "Gashmiyus / Ruchniyus", h: "גשמיות / רוחניות", m: "Physicality / spirituality" },
    { t: "Avodah", h: "עבודה", m: "Service of Hashem; inner work" },
    { t: "Moshiach", h: "משיח", m: "The anointed king who will bring the final redemption" },
    { t: "Geulah", h: "גאולה", m: "Redemption" },
    { t: "Chavrusa", h: "חברותא", m: "A learning partner" },
    { t: "Seder", h: "סדר", m: "A scheduled learning session in yeshiva" }
  ]
};
