/* Module 5: Kashrus */
CP_LESSONS("m5", [
  {
    id: "m5-1", title: "Meat and milk in depth", minutes: 5, intro: true,
    teach: `
<p><b>The Torah source.</b> "Do not cook a kid in its mother's milk" appears three times (Shemos 23:19, 34:26; Devarim 14:21). The Gemara (Chullin 115b) derives three prohibitions: cooking meat and milk together, eating the mixture, and benefiting from it. Poultry with milk is rabbinic, but just as binding.</p>
<p><b>Waiting.</b></p>
<ul>
<li><b>After meat before dairy:</b> Chabad waits <b>six hours</b>, following the Rambam and the Shulchan Aruch (Yoreh De'ah 89:1). <span class="diff">Difference: some Ashkenazi communities wait three hours, and Dutch Jews wait one.</span></li>
<li><b>After dairy before meat:</b> the basic halacha is to rinse your mouth, eat something pareve, and wash your hands. Chabad custom, based on the Zohar, adds a wait of <b>one hour</b>. <span class="diff">Difference: many others wait only for the rinse and a bite.</span></li>
<li><b>Hard aged cheese:</b> Chabad waits six hours after it before meat. Ask Zalmy which cheeses count as hard.</li>
</ul>
<p><b>Separation in the kitchen.</b> Separate dishes, pots, and utensils for meat and dairy; many also keep separate sinks or basins, sponges, and towels. Pareve items cooked in a meat pot take on meat status in some ways (<i>nat bar nat</i>). The rules are detailed.</p>
<p><b>Meat and fish.</b> They aren't eaten together, for health reasons cited in the Gemara (Pesachim 76b). In between, rinse your mouth and eat or drink something.</p>
<p><b>Mistakes.</b> If a dairy spoon went into a meat pot, <b>ask a rav</b> before using the pot or the food. The answer depends on temperature, amounts, and timing, and often nothing is lost.</p>`,
    terms: [
      { t: "Basar b'chalav", h: "בשר בחלב", m: "Meat and milk" },
      { t: "Fleishig / milchig / pareve", h: "", m: "Yiddish: meat / dairy / neutral" },
      { t: "Nat bar nat", h: "נ״ט בר נ״ט", m: "A secondary transferred flavor" },
      { t: "Kashering", h: "הכשר", m: "Making a utensil kosher again" },
      { t: "Kli", h: "כלי", m: "Utensil" }
    ],
    source: "Shemos 23:19; Chullin 104b to 105a, 115b; Shulchan Aruch, Yoreh De'ah 87 to 89",
    doToday: "Look at the time after your next meat meal and note when six hours ends. Don't guess.",
    quiz: [
      { id: "m5-1-q1", t: "mc", q: "Chabad waiting time after meat before dairy:", o: ["1 hour", "3 hours", "6 hours", "No wait"], a: 2, x: "Six hours." },
      { id: "m5-1-q2", t: "recall", q: "What three prohibitions derive from the triple verse?", model: "Cooking meat and milk together, eating the mixture, and benefiting from it.", x: "Chullin 115b." },
      { id: "m5-1-q3", t: "scenario", q: "You accidentally stir a meat soup with a dairy spoon.", o: ["Ask a rav before using the pot or food", "Throw everything out", "Ignore it"], a: 0, x: "Often nothing is lost, but it depends on details." },
      { id: "m5-1-q4", t: "tf", q: "Chicken with cheese is permitted because the Torah only forbids meat.", a: false, x: "False. Poultry with milk is rabbinically forbidden." },
      { id: "m5-1-q5", t: "mc", q: "After a milk shake (not hard cheese), before meat:", o: ["Rinse, eat something pareve, wash hands, and wait an hour", "Wait 6 hours", "Nothing needed", "Wait 3 hours"], a: 0, x: "The hour is the Chabad custom, based on the Zohar." },
      { id: "m5-1-q6", t: "mc", q: "Why are meat and fish not eaten together?", o: ["A health concern cited in the Gemara", "Basar b'chalav", "Chabad custom only", "Taste"], a: 0, x: "Pesachim 76b." }
    ],
    deeper: [
      { id: "m5-1-d1", t: "recall", q: "Why is hard cheese treated like meat for waiting, according to many?", model: "Aged hard cheese lingers in the mouth and leaves a strong taste, similar to meat stuck in the teeth, which is one of the reasons for waiting after meat.", x: "Rema and Shach on YD 89." }
    ],
    reflect: "You keep kosher already. Is there a place (a restaurant, a friend's house, travel) where you've been loose? What would tightening it look like?",
    sayIt: { phrase: "I'm fleishig.", h: "", meaning: "I ate meat and can't have dairy yet.", when: "When someone offers you ice cream after lunch." }
  },
  {
    id: "m5-2", title: "Chalav Yisrael", minutes: 5, intro: false,
    teach: `
<p><b>The law.</b> The Sages decreed that milk milked by a non-Jew without a Jew watching is forbidden (Avodah Zarah 35b), out of concern that milk from a non-kosher animal was mixed in. Milk supervised by a Jew is <i>chalav Yisrael</i>.</p>
<p><b>The leniency.</b> Some poskim, most famously Rav Moshe Feinstein (Igros Moshe), permitted government-regulated milk (<i>chalav hacompanies</i>): since the law prevents mixing in non-kosher milk, the concern is addressed. Many observant Jews in America rely on this.</p>
<p><b>Chabad practice.</b> Chabad is careful to use only chalav Yisrael. The Rebbe strongly encouraged this for everyone, including where others are lenient. He emphasized that food affects the soul, and that chalav Yisrael is part of a Jew's spiritual sensitivity. He spoke about this especially for children.</p>
<p><b>In Israel.</b> Most dairy is produced under Jewish supervision, but check the hechsher. Imported products and certain powdered-milk ingredients (<i>avkat chalav</i>) can raise questions.</p>
<p><b>Back home.</b> In the Bay Area, chalav Yisrael is available but takes effort. Look for "CY" on packaging or ask local Chabad for sources. Worth planning before you go home.</p>`,
    terms: [
      { t: "Chalav Yisrael", h: "חלב ישראל", m: "Milk supervised by a Jew from milking" },
      { t: "Chalav akum", h: "חלב עכו״ם", m: "Milk milked without Jewish supervision" },
      { t: "Chalav hacompanies", h: "", m: "Government-regulated milk, relied on by some poskim" },
      { t: "Avkat chalav", h: "אבקת חלב", m: "Milk powder" }
    ],
    source: "Avodah Zarah 35b; Shulchan Aruch, Yoreh De'ah 115; Igros Moshe, Yoreh De'ah (on chalav hacompanies); the Rebbe's sichos and letters encouraging chalav Yisrael",
    doToday: "Check the hechsher on one dairy product you use here and confirm it's chalav Yisrael.",
    quiz: [
      { id: "m5-2-q1", t: "mc", q: "Chalav Yisrael means:", o: ["Milk supervised by a Jew from milking", "Milk from Israel", "Milk with any hechsher", "Milk from a Jewish-owned farm"], a: 0, x: "Supervision of the milking." },
      { id: "m5-2-q2", t: "mc", q: "The original concern behind the decree:", o: ["Non-kosher animal milk being mixed in", "Dirt", "Idolatry", "Meat mixtures"], a: 0, x: "Avodah Zarah 35b." },
      { id: "m5-2-q3", t: "tf", q: "Chabad relies on chalav hacompanies.", a: false, x: "False. Chabad uses chalav Yisrael only." },
      { id: "m5-2-q4", t: "mc", q: "The best-known posek who permitted chalav hacompanies:", o: ["Rav Moshe Feinstein", "The Alter Rebbe", "The Chazon Ish", "The Rambam"], a: 0, x: "Igros Moshe." },
      { id: "m5-2-q5", t: "recall", q: "Why did the Rebbe emphasize chalav Yisrael even where others are lenient?", model: "Food affects the soul; chalav Yisrael supports spiritual sensitivity. He encouraged it for everyone, and especially for children.", x: "The Rebbe's sichos and letters." }
    ],
    deeper: [
      { id: "m5-2-d1", t: "recall", q: "Why is the leniency of chalav hacompanies based on the reason for the decree, and why might someone still be strict?", model: "The leniency argues the concern (mixing non-kosher milk) is prevented by regulation. Those who are strict hold that a rabbinic decree, once made, stands even if its reason seems absent, and that actual Jewish supervision was required.", x: "A classic halachic debate on decrees." }
    ],
    reflect: "What changes in your life when you go home: keeping chalav Yisrael in Palo Alto, eating out with friends? Plan it now.",
    sayIt: { phrase: "Is it CY?", h: "", meaning: "Is it chalav Yisrael?", when: "When someone offers dairy, especially back in America." }
  },
  {
    id: "m5-3", title: "Pas Yisrael", minutes: 5, intro: false,
    teach: `
<p><b>The decree.</b> The Sages forbade bread baked by a non-Jew (<i>pas akum</i>), to prevent social closeness leading to intermarriage (Avodah Zarah 35b; Shulchan Aruch, Yoreh De'ah 112).</p>
<p><b>The leniency.</b> Bread from a commercial non-Jewish bakery (<i>pas palter</i>) is permitted by many, especially when Jewish bread isn't easily available. Many Ashkenazim rely on this.</p>
<p><b>Chabad practice.</b> Chabad eats only <b>pas Yisrael</b>, meaning bread and baked goods where a Jew participated in the baking, at least by lighting the oven. The Rebbe encouraged it for everyone. <span class="diff">Everyone, even those who normally rely on pas palter, is strict about pas Yisrael during the Ten Days of Teshuvah (Shulchan Aruch, Orach Chaim 603).</span></p>
<p><b>What it includes.</b> Bread, and Mezonos baked goods like cake, crackers, and cookies, according to many poskim. Many imported snack crackers and cookies aren't pas Yisrael, so check the label.</p>
<p><b>In Israel.</b> Most bakeries are Jewish-run, so this is easy here. In America, look for "pas Yisrael" on the hechsher, or buy from Jewish bakeries.</p>`,
    terms: [
      { t: "Pas Yisrael", h: "פת ישראל", m: "Bread baked with a Jew's participation" },
      { t: "Pas akum", h: "פת עכו״ם", m: "Bread baked by a non-Jew" },
      { t: "Pas palter", h: "פת פלטר", m: "Bread from a commercial non-Jewish bakery" },
      { t: "Aseres Yemei Teshuvah", h: "עשרת ימי תשובה", m: "The Ten Days of Teshuvah, Rosh Hashanah to Yom Kippur" }
    ],
    source: "Avodah Zarah 35b; Shulchan Aruch, Yoreh De'ah 112; Shulchan Aruch, Orach Chaim 603",
    doToday: "Check whether one imported cracker or cookie product you eat is pas Yisrael.",
    quiz: [
      { id: "m5-3-q1", t: "mc", q: "The reason for the decree on pas akum:", o: ["To prevent social closeness leading to intermarriage", "Kashrus of ingredients", "Hygiene", "Shabbos"], a: 0, x: "Avodah Zarah 35b." },
      { id: "m5-3-q2", t: "tf", q: "Chabad relies on pas palter.", a: false, x: "False. Chabad eats pas Yisrael only." },
      { id: "m5-3-q3", t: "mc", q: "When is everyone strict on pas Yisrael?", o: ["During the Ten Days of Teshuvah", "On Pesach", "On Shabbos", "Never"], a: 0, x: "OC 603." },
      { id: "m5-3-q4", t: "mc", q: "A minimal way a Jew \"participates\" in baking for pas Yisrael:", o: ["Lighting the oven", "Buying the flour", "Eating the bread", "Owning the store"], a: 0, x: "Per Ashkenazi practice." },
      { id: "m5-3-q5", t: "tf", q: "Pas Yisrael applies to cake and crackers too, according to many poskim.", a: true, x: "True." }
    ],
    deeper: [
      { id: "m5-3-d1", t: "recall", q: "Why would a decree about social closeness still apply today, when there's no bread-sharing social dynamic?", model: "A rabbinic decree stays in force once enacted, unless a greater court annuls it; the specific social circumstances needn't be present for it to apply.", x: "The same principle as chalav Yisrael." }
    ],
    reflect: "These decrees are about keeping a Jewish identity strong. Where do you feel the pull of blending in most?",
    sayIt: { phrase: "Is it pas Yisrael?", h: "פת ישראל", meaning: "Was it baked with a Jew's participation?", when: "When looking at crackers or cake from an unknown source." }
  },
  {
    id: "m5-4", title: "Bishul Yisrael", minutes: 5, intro: false,
    teach: `
<p><b>The decree.</b> Food cooked by a non-Jew is rabbinically forbidden if two conditions are met (Avodah Zarah 38a; Shulchan Aruch, Yoreh De'ah 113):</p>
<ul>
<li>It isn't normally eaten raw (e.g., meat, eggs, potatoes, rice).</li>
<li>It's fit for a king's table (<i>oleh al shulchan melachim</i>): important enough to serve at a formal meal.</li>
</ul>
<p>Food that's eaten raw (most fruit) or isn't "important" (like potato chips, according to many) isn't included.</p>
<p><b>What counts as Jewish participation.</b></p>
<ul>
<li><b>Ashkenazi practice</b>, following the Rema: a Jew lighting the fire (or even the pilot light) is enough.</li>
<li><b>Sephardi practice</b>, following the Mechaber: a Jew must place the food on the fire or take part in the cooking itself.</li>
</ul>
<p><b>Why it matters to you.</b></p>
<ul>
<li><b>Restaurants:</b> places with non-Jewish cooks need a mashgiach who handles the fire. That's part of what a good hechsher checks.</li>
<li><b>Cooking at home or in a dorm with non-Jewish staff:</b> light the fire yourself.</li>
<li><b>Canned or processed foods</b>, like canned tuna: poskim discuss them, and some hechsherim require bishul Yisrael for them. Ask Zalmy what Chabad practice is.</li>
</ul>`,
    terms: [
      { t: "Bishul Yisrael", h: "בישול ישראל", m: "Cooking with a Jew's participation" },
      { t: "Bishul akum", h: "בישול עכו״ם", m: "Food cooked by a non-Jew" },
      { t: "Oleh al shulchan melachim", h: "עולה על שולחן מלכים", m: "Fit for a king's table" },
      { t: "Mashgiach", h: "משגיח", m: "Kashrus supervisor" }
    ],
    source: "Avodah Zarah 38a; Shulchan Aruch, Yoreh De'ah 113 with the Rema",
    doToday: "Next time you eat at a restaurant, ask (politely) who lights the fire or how bishul Yisrael is handled.",
    quiz: [
      { id: "m5-4-q1", t: "recall", q: "What two conditions make food subject to bishul akum?", model: "Not normally eaten raw, and fit for a king's table.", x: "SA YD 113." },
      { id: "m5-4-q2", t: "mc", q: "According to Ashkenazi practice, which is enough for bishul Yisrael?", o: ["A Jew lighting the fire", "A Jew owning the restaurant", "A Jew eating it", "Nothing needed"], a: 0, x: "The Rema." },
      { id: "m5-4-q3", t: "tf", q: "Fresh fruit cut by a non-Jew is a bishul akum problem.", a: false, x: "False. Fruit is eaten raw, and it's not cooked." },
      { id: "m5-4-q4", t: "mc", q: "Why do restaurants need a mashgiach even with kosher ingredients?", o: ["Among other things, for bishul Yisrael", "Only for decoration", "For taxes", "Not needed"], a: 0, x: "Also checking produce, meat sources, and more." },
      { id: "m5-4-q5", t: "mc", q: "Potato chips cooked by a non-Jew, according to many:", o: ["Not bishul akum: not fit for a king's table", "Forbidden", "Only a Sephardi issue"], a: 0, x: "A snack, not a formal dish." }
    ],
    deeper: [
      { id: "m5-4-d1", t: "recall", q: "Why did the Sages include \"fit for a king's table\" as a condition?", model: "The decree targeted social closeness, like inviting someone to a meal. Food that's too minor to serve guests doesn't carry that social weight.", x: "Avodah Zarah 38a." }
    ],
    reflect: "Kashrus is about who you eat with and how. How do you handle eating with non-kosher friends back home?",
    sayIt: { phrase: "Who lights the fire here?", h: "", meaning: "Asking how bishul Yisrael is handled.", when: "At a kosher restaurant, respectfully." }
  },
  {
    id: "m5-5", title: "Hechsherim in Israel", minutes: 5, intro: false,
    teach: `
<p><b>Levels.</b></p>
<ul>
<li><b>Rabbanut (local rabbinate):</b> the baseline, government-supervised hechsher. It certifies the basics, but may rely on leniencies that many observant Jews avoid, such as the heter mechira during shmitta, or lower standards for produce checking and meat.</li>
<li><b>Rabbanut mehadrin:</b> a stricter level from the rabbinate.</li>
<li><b>Private mehadrin hechsherim:</b> for example the Badatz of the Eida Chareidis, and the hechsherim of well-known rabbanim in Bnei Brak and elsewhere. There are also Chabad-run hechsherim.</li>
</ul>
<p><b>What differs.</b></p>
<ul>
<li>Shmitta produce.</li>
<li>Terumos and maasros.</li>
<li>Checking produce for insects (a real issue in Israel: many leafy greens need checking, or are grown under insect-control methods).</li>
<li>Meat standards (e.g., glatt, or "chalak Beis Yosef").</li>
<li>Chalav Yisrael, pas Yisrael, and bishul Yisrael.</li>
</ul>
<p><b>Chabad practice.</b> Most Chabad chassidim eat only mehadrin-level hechsherim. <b>Ask Zalmy which hechsherim Mayanot relies on</b> and write them in your notebook. That's more reliable than any list, since hechsherim change.</p>
<p><b>Restaurants.</b> Check that the certificate is current (it has a date) and matches the location. "Kosher-style" or "no pork" means nothing.</p>
<p><b>Bugs.</b> Eating an insect violates several Torah prohibitions. Leafy vegetables, herbs, strawberries, and some grains need checking or a trusted bug-free brand.</p>`,
    terms: [
      { t: "Hechsher", h: "הכשר", m: "Kosher certification" },
      { t: "Mehadrin", h: "מהדרין", m: "A stricter kosher standard" },
      { t: "Badatz", h: "בד״ץ", m: "Beis Din Tzedek: a rabbinical court, often a mehadrin certifier" },
      { t: "Te'udat kashrut", h: "תעודת כשרות", m: "A restaurant's kosher certificate" },
      { t: "Tola'im", h: "תולעים", m: "Insects/worms in food" }
    ],
    source: "Vayikra 11:41 to 44 (insects); general kashrus practice in Israel",
    doToday: "Ask Zalmy: \"Which hechsherim do you rely on?\" Save the list in your notebook.",
    quiz: [
      { id: "m5-5-q1", t: "tf", q: "A regular Rabbanut hechsher is identical in standard to all mehadrin hechsherim.", a: false, x: "False. It can rely on leniencies many observant Jews avoid." },
      { id: "m5-5-q2", t: "mc", q: "Which is the most reliable way to know Mayanot's standards?", o: ["Ask Zalmy", "Online forums", "The store clerk", "Assume all hechsherim are equal"], a: 0, x: "Hechsherim change, and standards vary." },
      { id: "m5-5-q3", t: "mc", q: "Why must leafy greens in Israel be checked?", o: ["Insects are common, and eating them is a Torah prohibition", "Pesticides", "Shmitta", "Terumos"], a: 0, x: "Vayikra 11." },
      { id: "m5-5-q4", t: "mc", q: "At a restaurant, you should check:", o: ["That the certificate is current and for this location", "The logo only", "The menu", "The owner's name"], a: 0, x: "Certificates have dates." },
      { id: "m5-5-q5", t: "tf", q: "\"Kosher-style\" means kosher.", a: false, x: "False. It means nothing halachically." }
    ],
    deeper: [
      { id: "m5-5-d1", t: "recall", q: "List three areas where hechsherim in Israel commonly differ in standard.", model: "Any three: shmitta produce (heter mechira), terumos and maasros, insect checking, meat standards, chalav/pas/bishul Yisrael.", x: "This is why you ask what your community relies on." }
    ],
    reflect: "Kashrus in Israel is new territory. What's one assumption from America that doesn't hold here?",
    sayIt: { phrase: "What's the hechsher?", h: "הכשר", meaning: "Who certifies this?", when: "Any time food is offered. Normal and polite." }
  },
  {
    id: "m5-6", title: "Terumos and maasros", minutes: 5, intro: false,
    teach: `
<p><b>The mitzvah.</b> Produce grown in Eretz Yisrael can't be eaten until tithes are separated. Before that it's <i>tevel</i>, which is forbidden.</p>
<p><b>What's separated</b> (in order):</p>
<ol>
<li><b>Terumah gedolah:</b> today, a small amount, customarily a little more than 1/100. It's holy and given to a kohen in Temple times; today it's wrapped and disposed of respectfully.</li>
<li><b>Maaser rishon:</b> 1/10 of what's left, for a Levi.</li>
<li><b>Terumas maaser:</b> 1/10 of the maaser rishon. It has the holiness of terumah and is also disposed of.</li>
<li><b>Maaser sheni or maaser ani:</b> 1/10 of the remainder. In years 1, 2, 4, and 5 of the shmitta cycle it's maaser sheni, which is redeemed on a coin. In years 3 and 6 it's maaser ani, for the poor.</li>
</ol>
<p><b>This year.</b> 5787 is the <b>fifth year</b> of the shmitta cycle (the last shmitta was 5782), so it's a maaser sheni year for most produce. Which year a crop belongs to depends on when it grew, so the details get technical.</p>
<p><b>Practically.</b></p>
<ul>
<li>Produce with a reliable hechsher has already been tithed.</li>
<li>Produce from a market without a hechsher, from a friend's tree, or from a field needs separation. There's a formula, printed in many siddurim and available from Israeli rabbinical sources. Ask Zalmy for the text used in Chabad.</li>
<li>For produce that's probably already tithed (<i>demai</i>), you separate without a bracha.</li>
</ul>
<p><b>Hafrashas challah.</b> The same idea applies to dough everywhere, not just in Israel.</p>`,
    terms: [
      { t: "Terumah", h: "תרומה", m: "The portion given to a kohen" },
      { t: "Maaser", h: "מעשר", m: "A tithe" },
      { t: "Tevel", h: "טבל", m: "Untithed produce: forbidden to eat" },
      { t: "Demai", h: "דמאי", m: "Produce of doubtful tithing status" },
      { t: "Maaser sheni / maaser ani", h: "מעשר שני / מעשר עני", m: "The second tithe / the tithe for the poor" }
    ],
    source: "Bamidbar 18; Devarim 14:22 to 29; Rambam, Hilchos Terumos and Hilchos Maaser; Mishnah Demai",
    doToday: "Save the terumos and maasros text (ask Zalmy which version) on paper in your wallet or siddur, for fruit from a market or a tree.",
    quiz: [
      { id: "m5-6-q1", t: "mc", q: "Untithed produce is called:", o: ["Tevel", "Demai", "Orlah", "Terumah"], a: 0, x: "Forbidden until tithed." },
      { id: "m5-6-q2", t: "mc", q: "5787 is which year of the shmitta cycle?", o: ["5th: maaser sheni", "3rd: maaser ani", "7th: shmitta", "1st"], a: 0, x: "The last shmitta was 5782." },
      { id: "m5-6-q3", t: "tf", q: "Terumos and maasros apply to produce grown in America.", a: false, x: "False. They apply to produce of Eretz Yisrael." },
      { id: "m5-6-q4", t: "recall", q: "List the separations in order.", model: "Terumah gedolah, maaser rishon, terumas maaser, maaser sheni or maaser ani.", x: "The order matters." },
      { id: "m5-6-q5", t: "scenario", q: "You pick an orange from a tree in a friend's Jerusalem yard.", o: ["Eat it: it's his", "Separate terumos and maasros first (and check orlah)", "Only make a bracha"], a: 1, x: "Produce grown here needs tithing." },
      { id: "m5-6-q6", t: "mc", q: "Demai is separated:", o: ["Without a bracha", "With a bracha", "Not at all", "Only by kohanim"], a: 0, x: "It's a doubt." }
    ],
    deeper: [
      { id: "m5-6-d1", t: "recall", q: "What happens to maaser sheni today, when there's no Beis HaMikdash?", model: "It's redeemed onto a coin (worth at least a perutah), and the coin is then disposed of or its sanctity transferred as instructed, since we can't bring the produce to Yerushalayim to eat in purity.", x: "Details: ask for the practical method." }
    ],
    reflect: "Living in Israel means mitzvos that don't exist in Palo Alto. How does it feel to encounter them this year?",
    sayIt: { phrase: "Was this tithed?", h: "", meaning: "Have terumos and maasros been taken?", when: "When offered produce from a market or garden in Israel." }
  },
  {
    id: "m5-7", title: "Shmitta and orlah", minutes: 5, intro: false,
    teach: `
<p><b>Shmitta.</b> Every seventh year the land of Israel rests (Vayikra 25). Fields aren't worked, and produce that grows has <i>kedushas shvi'is</i>: it's ownerless, may not be sold in the usual way, must not be wasted, and has further rules. The last shmitta was 5782; the next is <b>5789</b> (starting fall 2028). You're not here for it this year, but you should know it.</p>
<p><b>The heter mechira.</b> A controversial arrangement that sells Israel's land to a non-Jew for the shmitta year so it can be farmed normally. Many poskim reject it. Mehadrin hechsherim avoid it, and many chareidi communities, including Chabad in general, don't rely on it. Ask Zalmy.</p>
<p><b>Orlah.</b> Fruit from a tree's first three years is forbidden to eat or benefit from (Vayikra 19:23). In the fourth year it's <i>neta revai</i>, which is redeemed.</p>
<ul>
<li><b>In Israel:</b> orlah applies, and even doubtful orlah is forbidden.</li>
<li><b>Outside Israel:</b> it also applies (halacha l'Moshe miSinai), but only definite orlah is forbidden.</li>
</ul>
<p>This is part of why hechsherim check produce sources.</p>
<p><b>Kilayim.</b> Mixing species (grafting trees, planting certain seeds together) is also forbidden. It's relevant if you ever garden.</p>
<p><b>The idea.</b> The land belongs to Hashem. Shmitta is the agricultural Shabbos, and orlah teaches patience and first-fruits thinking.</p>`,
    terms: [
      { t: "Shmitta", h: "שמיטה", m: "The sabbatical year" },
      { t: "Kedushas shvi'is", h: "קדושת שביעית", m: "The holiness of seventh-year produce" },
      { t: "Heter mechira", h: "היתר מכירה", m: "Sale of land to permit farming in shmitta" },
      { t: "Orlah", h: "ערלה", m: "Fruit of a tree's first three years" },
      { t: "Neta revai", h: "נטע רבעי", m: "Fourth-year fruit" },
      { t: "Kilayim", h: "כלאים", m: "Forbidden mixtures of species" }
    ],
    source: "Vayikra 19:19, 19:23 to 25, 25:1 to 7; Rambam, Hilchos Shmitta v'Yovel and Hilchos Maachalos Asuros (orlah); Shulchan Aruch, Yoreh De'ah 294",
    doToday: "Notice where the produce you eat comes from this week, and look for an orlah or shmitta note on a hechsher.",
    quiz: [
      { id: "m5-7-q1", t: "mc", q: "The next shmitta year is:", o: ["5789", "5787", "5790", "5782"], a: 0, x: "Starting fall 2028." },
      { id: "m5-7-q2", t: "mc", q: "Orlah is fruit from a tree's first:", o: ["Three years", "Seven years", "One year", "Four years"], a: 0, x: "Vayikra 19:23." },
      { id: "m5-7-q3", t: "tf", q: "Orlah applies outside Israel too.", a: true, x: "True, though only definite orlah is forbidden there." },
      { id: "m5-7-q4", t: "mc", q: "The heter mechira is:", o: ["A controversial sale of land so it can be farmed in shmitta", "A tithing formula", "A kind of hechsher", "Universally accepted"], a: 0, x: "Many poskim reject it." },
      { id: "m5-7-q5", t: "recall", q: "Name two rules of produce with kedushas shvi'is.", model: "Any two: it's ownerless (hefker); not sold in the normal commercial way; not wasted or destroyed; used only for normal purposes; removal (biur) rules.", x: "Details in Rambam, Hilchos Shmitta v'Yovel." }
    ],
    deeper: [
      { id: "m5-7-d1", t: "recall", q: "Connect shmitta to Shabbos.", model: "Shabbos is a weekly rest for a person; shmitta is a seven-year rest for the land. Both declare that the world, and the land, belong to Hashem.", x: "Vayikra 25:2: \"the land shall rest, a Shabbos to Hashem\"." }
    ],
    reflect: "Orlah is about waiting three years for fruit. Where in your business or growth are you trying to harvest too early?",
    sayIt: { phrase: "Is it Otzar Beis Din or heter mechira?", h: "", meaning: "Asking how shmitta produce was handled: through an Otzar Beis Din (a rabbinical court distributes the produce) or the heter mechira.", when: "During shmitta, at a store or someone's home." }
  }
]);
