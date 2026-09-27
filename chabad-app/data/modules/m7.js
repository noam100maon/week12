/* Module 7: The Chabad Calendar */
CP_LESSONS("m7", [
  {
    id: "m7-1", title: "Chof Cheshvan", minutes: 5, intro: false,
    teach: `
<p><b>What.</b> 20 Cheshvan is the birthday of the Rebbe Rashab (1860), the fifth Rebbe and the founder of Tomchei Temimim. It's the first Chabad date after Tishrei. This year it's in about three weeks.</p>
<p><b>Why it matters to you.</b> You're a student in a yeshiva that exists because of the Rebbe Rashab's vision. He founded Tomchei Temimim in 1897 to produce bochurim who combine serious Gemara with serious Chassidus and avodah, and who carry responsibility for the Jewish people. Chof Cheshvan is traditionally a day when yeshiva students take stock of how seriously they're taking that.</p>
<p><b>How it's marked.</b></p>
<ul>
<li>Farbrengens, especially in yeshivos.</li>
<li>Learning the Rebbe Rashab's teachings: Kuntres HaTefillah, Kuntres Etz HaChaim, or a maamar from Hemshech 5666.</li>
<li>Good resolutions (<i>hachlatos</i>) in learning and davening.</li>
</ul>
<p><b>A birthday in Chabad.</b> The Rebbe encouraged every Jew to mark his own Jewish birthday: give extra tzedakah, spend time in reflection, add in learning, say the Tehillim chapter matching your new year of life, and hold a gathering with friends. The Rebbeim's birthdays are marked by all chassidim.</p>`,
    terms: [
      { t: "Chof Cheshvan", h: "כ׳ חשון", m: "20 Cheshvan: the Rebbe Rashab's birthday" },
      { t: "Hachlatah (pl. hachlatos)", h: "החלטה", m: "A practical resolution" },
      { t: "Yom huledes", h: "יום הולדת", m: "Birthday" },
      { t: "Temimim", h: "תמימים", m: "Students of Tomchei Temimim" }
    ],
    source: "Sefer HaMinhagim; the Rebbe's sichos on birthdays (5748); chabad.org",
    doToday: "Find your Jewish birthday (use a Hebrew date converter) and put it in your calendar. Note which Tehillim chapter matches your age this year (your age plus one).",
    quiz: [
      { id: "m7-1-q1", t: "mc", q: "Chof Cheshvan is:", o: ["The Rebbe Rashab's birthday", "His yahrzeit", "The Alter Rebbe's release", "The Rebbe's wedding"], a: 0, x: "20 Cheshvan 1860." },
      { id: "m7-1-q2", t: "mc", q: "The Rebbe Rashab founded:", o: ["Tomchei Temimim", "Merkos", "Kehot", "Machne Israel"], a: 0, x: "In 1897." },
      { id: "m7-1-q3", t: "recall", q: "Name three ways the Rebbe suggested marking your own Jewish birthday.", model: "Any three: extra tzedakah, reflection, adding in learning, saying your Tehillim chapter, a gathering with friends, a new hachlatah.", x: "From the Rebbe's 5748 campaign." },
      { id: "m7-1-q4", t: "tf", q: "The Tehillim chapter for your birthday year is your age plus one.", a: true, x: "True: turning 19 means starting chapter 20." },
      { id: "m7-1-q5", t: "mc", q: "A hachlatah is:", o: ["A practical resolution", "A niggun", "A type of maamar", "A blessing"], a: 0, x: "Farbrengens end with them." }
    ],
    deeper: [
      { id: "m7-1-d1", t: "recall", q: "Why is Chof Cheshvan especially relevant to yeshiva students?", model: "The Rebbe Rashab founded Tomchei Temimim and defined the tamim's mission: learning and avodah with responsibility for the Jewish people. His birthday is a natural day to recommit to that.", x: "Chabad yeshivos hold farbrengens that day." }
    ],
    reflect: "What's one hachlatah for your yeshiva year you could make on Chof Cheshvan?",
    sayIt: { phrase: "Chof Cheshvan farbrengen tonight?", h: "", meaning: "Asking about the Chof Cheshvan gathering.", when: "Around 20 Cheshvan in yeshiva." }
  },
  {
    id: "m7-2", title: "Yud Tes Kislev", minutes: 5, intro: false,
    teach: `
<p><b>What happened.</b> In 1798, opponents of Chassidus informed on the Alter Rebbe to the Czar's government, accusing him of treason. He was arrested and held in St. Petersburg. Chassidic tradition explains the arrest as reflecting a heavenly accusation against spreading Chassidus so widely. His release on 19 Kislev (5559) was the verdict that Chassidus should spread even more.</p>
<p><b>After the release.</b> The Alter Rebbe wrote a letter (Iggeres HaKodesh, letter 2) urging his chassidim not to gloat over their opponents, citing "katonti mikol hachasadim", "I have become small from all the kindnesses" (Bereishis 32:11). Kindness from Hashem should make you humbler.</p>
<p><b>Also on 19 Kislev:</b> the yahrzeit of the Maggid of Mezritch (1772), the Alter Rebbe's teacher.</p>
<p><b>The Rosh Hashanah of Chassidus.</b> It's called this because it marks the birth of Chassidus's open, widespread phase. Chassidim greet each other with: "L'shanah tovah b'limud haChassidus uv'darkei haChassidus tikaseivu v'seichaseimu": may you be inscribed for a good year in the study and ways of Chassidus.</p>
<p><b>How it's marked.</b></p>
<ul>
<li>Big farbrengens, often lasting through the night.</li>
<li><i>Chalukas HaShas</i>: dividing the whole Talmud among participants to learn during the year.</li>
<li>Resolutions in learning Chassidus.</li>
<li>No Tachanun.</li>
</ul>`,
    terms: [
      { t: "Yud Tes Kislev", h: "י״ט כסלו", m: "19 Kislev: the Alter Rebbe's release" },
      { t: "Rosh Hashanah l'Chassidus", h: "ראש השנה לחסידות", m: "The New Year of Chassidus" },
      { t: "Chalukas HaShas", h: "חלוקת הש״ס", m: "Dividing the Talmud for learning" },
      { t: "Katonti", h: "קטנתי", m: "\"I have become small\" (Bereishis 32:11)" },
      { t: "Iggeres HaKodesh", h: "אגרת הקודש", m: "The Alter Rebbe's letters, part of the Tanya" }
    ],
    source: "Tanya, Iggeres HaKodesh 2; Bereishis 32:11; Sefer HaMinhagim (19 Kislev)",
    doToday: "Memorize the Yud Tes Kislev greeting (at least \"L'shanah tovah b'limud haChassidus\") so you're ready in Kislev.",
    quiz: [
      { id: "m7-2-q1", t: "mc", q: "Yud Tes Kislev marks:", o: ["The Alter Rebbe's release from prison in 1798", "His birth", "His passing", "The Tanya's printing"], a: 0, x: "19 Kislev 5559." },
      { id: "m7-2-q2", t: "mc", q: "Whose yahrzeit is also on 19 Kislev?", o: ["The Maggid of Mezritch", "The Baal Shem Tov", "The Mitteler Rebbe", "The Tzemach Tzedek"], a: 0, x: "1772." },
      { id: "m7-2-q3", t: "recall", q: "What was the message of the Alter Rebbe's \"katonti\" letter?", model: "Don't gloat over opponents. Kindness from Hashem should make you humbler (\"I have become small from all the kindnesses\").", x: "Iggeres HaKodesh 2." },
      { id: "m7-2-q4", t: "mc", q: "Chalukas HaShas is:", o: ["Dividing the Talmud among participants to learn", "A charity drive", "A niggun", "A Shabbos custom"], a: 0, x: "Done at Yud Tes Kislev farbrengens." },
      { id: "m7-2-q5", t: "tf", q: "Chabad says Tachanun on Yud Tes Kislev.", a: false, x: "False." }
    ],
    deeper: [
      { id: "m7-2-d1", t: "recall", q: "Why is it called the \"Rosh Hashanah\" of Chassidus?", model: "Like Rosh Hashanah is the start of a new year and a day of judgment, 19 Kislev marked the heavenly verdict for Chassidus and the start of its new, open phase of spreading.", x: "Hence the Rosh Hashanah-style greeting." }
    ],
    reflect: "The Alter Rebbe's reaction to victory was humility. When the business wins, what's your reaction?",
    sayIt: { phrase: "L'shanah tovah b'limud haChassidus uv'darkei haChassidus tikaseivu v'seichaseimu.", h: "לשנה טובה בלימוד החסידות ובדרכי החסידות תכתבו ותחתמו", meaning: "May you be inscribed for a good year in the study and ways of Chassidus.", when: "On 19 Kislev, to every chassid you meet." }
  },
  {
    id: "m7-3", title: "Chof Daled Teves", minutes: 5, intro: false,
    teach: `
<p><b>What.</b> 24 Teves is the yahrzeit of the Alter Rebbe (1812).</p>
<p><b>The circumstances.</b> When Napoleon invaded Russia in 1812, the Alter Rebbe opposed him. He held that Napoleon's victory would bring Jews material freedom but spiritual decline. He fled eastward ahead of the French army with his family, in a harsh winter, and passed away on the road in the village of Piena. He is buried in Haditch, Ukraine, which chassidim still visit.</p>
<p><b>His legacy</b> is the entire system you're learning:</p>
<ul>
<li>The Tanya, a practical guide for the average Jew.</li>
<li>The Shulchan Aruch HaRav, the halachic foundation of Chabad.</li>
<li>The Siddur.</li>
<li>Chabad Chassidus itself: the mind leading the heart.</li>
</ul>
<p><b>How it's marked.</b></p>
<ul>
<li>Learning the Alter Rebbe's teachings, especially Tanya and his Shulchan Aruch.</li>
<li>Saying Tehillim and learning Mishnayos whose letters spell his name.</li>
<li>Giving tzedakah.</li>
<li>Farbrengens.</li>
</ul>
<p>Many chassidim finish a section of Tanya or a set of halachos from the Shulchan Aruch HaRav that day.</p>
<p><b>Yahrzeit vs. hilula.</b> The day a tzaddik passes is called a <i>hilula</i> (a celebration, in the language of the Zohar), because all his life's work is revealed and shines on that day. It's marked with seriousness, but also as a day of connection and growth, not only mourning.</p>`,
    terms: [
      { t: "Chof Daled Teves", h: "כ״ד טבת", m: "24 Teves: the Alter Rebbe's yahrzeit" },
      { t: "Hilula", h: "הילולא", m: "\"Celebration\": the Zohar's term for a tzaddik's passing day" },
      { t: "Haditch", h: "האדיטש", m: "The town where the Alter Rebbe is buried" },
      { t: "Yahrzeit", h: "יארצייט", m: "Yiddish: anniversary of a passing" }
    ],
    source: "Zohar (on the hilula of a tzaddik); the Rebbe's sichos on 24 Teves; chabad.org biography of the Alter Rebbe",
    doToday: "Pick a Tanya chapter to finish by Chof Daled Teves (early January) and write it in your notebook.",
    quiz: [
      { id: "m7-3-q1", t: "mc", q: "Chof Daled Teves is:", o: ["The Alter Rebbe's yahrzeit", "His release", "His birthday", "The Tanya's printing"], a: 0, x: "24 Teves 1812." },
      { id: "m7-3-q2", t: "mc", q: "Where is the Alter Rebbe buried?", o: ["Haditch", "Lubavitch", "Liadi", "Queens"], a: 0, x: "In Ukraine." },
      { id: "m7-3-q3", t: "recall", q: "What does \"hilula\" mean and why is it used?", model: "Celebration. On a tzaddik's passing day, all his life's work is revealed and shines (Zohar), so it's a day of connection and elevation, not only mourning.", x: "Zohar terminology." },
      { id: "m7-3-q4", t: "mc", q: "Why was the Alter Rebbe fleeing when he passed away?", o: ["He opposed Napoleon and fled ahead of the French army", "Government arrest", "A pogrom", "A fire in Liadi"], a: 0, x: "In the winter of 1812." },
      { id: "m7-3-q5", t: "tf", q: "Learning Tanya is a fitting way to mark Chof Daled Teves.", a: true, x: "True: the Alter Rebbe's main work." }
    ],
    deeper: [
      { id: "m7-3-d1", t: "recall", q: "Why did the Alter Rebbe prefer the Czar's victory over Napoleon's, despite the Czar's harsh treatment of Jews?", model: "He held that under Napoleon, Jews would gain material freedom but lose their spiritual commitment (assimilation), while under the Czar, material hardship would come with spiritual strength.", x: "A historical judgment with lasting relevance." }
    ],
    reflect: "The Alter Rebbe chose spiritual strength over material comfort. Where is that trade-off in your own life?",
    sayIt: { phrase: "It's a hilula, not just a yahrzeit.", h: "הילולא", meaning: "A tzaddik's passing day is a day his work shines.", when: "When someone asks why a farbrengen on a yahrzeit has singing and l'chaim." }
  },
  {
    id: "m7-4", title: "Yud Shvat", minutes: 5, intro: false,
    teach: `
<p><b>Two events.</b></p>
<ul>
<li><b>10 Shvat 5710 (1950):</b> the Frierdiker Rebbe passed away in New York.</li>
<li><b>10 Shvat 5711 (1951):</b> exactly one year later, at a farbrengen, the Rebbe formally accepted the leadership by saying a maamar.</li>
</ul>
<p><b>Basi L'Gani.</b> For Yud Shvat 1950, the Frierdiker Rebbe had prepared a series of maamarim (discourses) beginning <i>"Basi L'Gani"</i>, "I have come into My garden" (Shir HaShirim 5:1). The Midrash reads this as Hashem returning to His original home in this world: the Shechinah was originally at home in the lower world, withdrew because of sin, and is drawn back down by tzaddikim, from Avraham to Moshe, the seventh. The Rebbe's first maamar built on this: our generation, the seventh from the Alter Rebbe, has the task of completing that return, bringing Moshiach.</p>
<p><b>The yearly cycle.</b> The Frierdiker Rebbe's Basi L'Gani has 20 chapters. Each year on Yud Shvat the Rebbe explained the next chapter in turn, in a 20-year cycle.</p>
<p><b>How it's marked.</b></p>
<ul>
<li>Learning Basi L'Gani.</li>
<li>Farbrengens, often with a focus on shlichus.</li>
<li>Hachlatos to take on a new mission.</li>
<li>Many travel to the Ohel.</li>
</ul>
<p>It's one of the most important days of the Chabad year.</p>`,
    terms: [
      { t: "Yud Shvat", h: "י׳ שבט", m: "10 Shvat" },
      { t: "Basi L'Gani", h: "באתי לגני", m: "\"I have come into My garden\"" },
      { t: "Nesius", h: "נשיאות", m: "Leadership of the generation" },
      { t: "Shechinah", h: "שכינה", m: "The Divine Presence" },
      { t: "Dor hashvi'i", h: "דור השביעי", m: "The seventh generation" }
    ],
    source: "Shir HaShirim 5:1; Midrash Shir HaShirim Rabbah 5:1; Basi L'Gani 5710 and 5711",
    doToday: "Read an English summary of Basi L'Gani 5711 (chabad.org) before Yud Shvat.",
    quiz: [
      { id: "m7-4-q1", t: "recall", q: "What two events happened on Yud Shvat?", model: "The Frierdiker Rebbe's passing (1950) and, one year later, the Rebbe's acceptance of leadership (1951).", x: "10 Shvat 5710 and 5711." },
      { id: "m7-4-q2", t: "mc", q: "Basi L'Gani means:", o: ["I have come into My garden", "I will build My house", "Go out to the field", "Return to Me"], a: 0, x: "Shir HaShirim 5:1." },
      { id: "m7-4-q3", t: "mc", q: "According to the Midrash, the Shechinah was originally at home in:", o: ["The lower, physical world", "The heavens", "The Mishkan only", "Nowhere"], a: 0, x: "It withdrew because of sin and is drawn back by tzaddikim." },
      { id: "m7-4-q4", t: "mc", q: "How many chapters does the Frierdiker Rebbe's Basi L'Gani have?", o: ["20", "7", "10", "13"], a: 0, x: "The Rebbe explained one each year." },
      { id: "m7-4-q5", t: "tf", q: "Moshe was the seventh generation from Avraham in the Midrash's count, and he brought the Shechinah back down.", a: true, x: "True: \"all sevenths are beloved\"." }
    ],
    deeper: [
      { id: "m7-4-d1", t: "recall", q: "How does Basi L'Gani connect to dirah b'tachtonim?", model: "Both say the goal is for Hashem to dwell in this lower world. Basi L'Gani frames history as the Shechinah's return to its original home here, which our generation must complete.", x: "The theme of the Rebbe's entire leadership." }
    ],
    reflect: "The Rebbe's first act as leader was to give every chassid a mission. What's yours this year?",
    sayIt: { phrase: "Basi L'Gani: Hashem wants to be at home here.", h: "באתי לגני", meaning: "The core of the Rebbe's first maamar.", when: "At a Yud Shvat farbrengen, or when explaining what drives Chabad." }
  },
  {
    id: "m7-5", title: "Yud Aleph Nissan", minutes: 5, intro: false,
    teach: `
<p><b>What.</b> 11 Nissan is the Rebbe's birthday (1902).</p>
<p><b>How it's marked.</b></p>
<ul>
<li><b>The Rebbe's chapter of Tehillim.</b> Chassidim say the chapter matching the Rebbe's new year of life, alongside their own chapter, every day of the year. In 5787 (2027) it's the Rebbe's 125th birthday, so the chapter is 126.</li>
<li><b>Farbrengens</b> and new commitments, especially in the Rebbe's campaigns.</li>
<li><b>Education and Sharing Day, USA.</b> Since 1978, U.S. presidents have proclaimed a national day around the Rebbe's birthday, highlighting education and moral values. That shows the Rebbe's influence beyond the Jewish world.</li>
</ul>
<p><b>The Rebbe on birthdays.</b> The Rebbe taught that on your birthday your mazal is strong, so it's a day for spiritual growth and resolutions. He launched a birthday campaign in 5748 (1988) encouraging every Jew, including children, to mark theirs.</p>
<p><b>Nissan.</b> The date falls in the month of redemption, days before Pesach. The themes connect: personal and national freedom, and Moshiach.</p>`,
    terms: [
      { t: "Yud Aleph Nissan", h: "י״א ניסן", m: "11 Nissan: the Rebbe's birthday" },
      { t: "Kapitel", h: "קאפיטל", m: "Yiddish: a chapter (of Tehillim)" },
      { t: "Mazal", h: "מזל", m: "A spiritual source of influence, strong on one's birthday" },
      { t: "Education Day USA", h: "", m: "A presidential proclamation honoring the Rebbe's birthday" }
    ],
    source: "Sichos of the Rebbe on birthdays (5748); Talmud Yerushalmi, Rosh Hashanah 3:8 (on one's mazal being strong); U.S. presidential proclamations since 1978",
    doToday: "Find the Rebbe's current kapitel (chapter 126 from 11 Nissan 5787, and 125 until then) and add it to your daily Tehillim for a week.",
    quiz: [
      { id: "m7-5-q1", t: "mc", q: "Yud Aleph Nissan is:", o: ["The Rebbe's birthday", "His passing", "His wedding", "The Frierdiker Rebbe's birthday"], a: 0, x: "1902." },
      { id: "m7-5-q2", t: "mc", q: "Education and Sharing Day USA is proclaimed:", o: ["By U.S. presidents around the Rebbe's birthday", "By Chabad only", "In Israel", "On Gimmel Tammuz"], a: 0, x: "Since 1978." },
      { id: "m7-5-q3", t: "recall", q: "What is the \"Rebbe's kapitel\"?", model: "The chapter of Tehillim matching the Rebbe's new year of life, said daily by chassidim.", x: "Changes each 11 Nissan." },
      { id: "m7-5-q4", t: "tf", q: "The Rebbe encouraged everyone to mark their own Jewish birthday.", a: true, x: "True: the 5748 campaign." },
      { id: "m7-5-q5", t: "mc", q: "Why is a birthday a day for growth according to the Rebbe?", o: ["One's mazal is strong that day", "It's a holiday", "Tachanun is skipped", "It's in Nissan"], a: 0, x: "Yerushalmi, Rosh Hashanah." }
    ],
    deeper: [
      { id: "m7-5-d1", t: "recall", q: "What does Education Day USA show about the Rebbe's approach?", model: "His concern extended to all people: he promoted universal moral education (the Seven Noahide Laws) and values for society at large, not only Jewish observance.", x: "The Rebbe's Noahide campaign." }
    ],
    reflect: "Your own Jewish birthday: what would you want to mark on it?",
    sayIt: { phrase: "Which kapitel are you on?", h: "קאפיטל", meaning: "Which Tehillim chapter are you saying for your birthday year?", when: "In conversation about birthdays. It's a very Chabad question." }
  },
  {
    id: "m7-6", title: "Gimmel Tammuz", minutes: 5, intro: false,
    teach: `
<p><b>What.</b> 3 Tammuz 5754 (1994) is the day the Rebbe passed away. He is buried in the Ohel at the Old Montefiore Cemetery in Queens, New York, next to the Frierdiker Rebbe.</p>
<p><b>How it's marked.</b></p>
<ul>
<li><b>Visiting the Ohel.</b> Tens of thousands visit around Gimmel Tammuz, and many throughout the year.</li>
<li><b>Writing a letter</b> (a <i>pan</i>, or <i>tzetl</i>) with your name, your mother's name, and requests or resolutions. It's brought or sent to the Ohel to be read there. The Ohel accepts letters by fax and email too.</li>
<li><b>Learning the Rebbe's teachings.</b></li>
<li><b>Hachlatos:</b> taking on a new mitzvah or strengthening one.</li>
<li><b>Farbrengens.</b></li>
</ul>
<p><b>The connection.</b> Chassidus teaches that a tzaddik's influence continues, and even grows, after his passing (Tanya, Iggeres HaKodesh 27, on the tzaddik's life being spiritual and continuing). Chassidim continue to learn the Rebbe's teachings, follow his directives, and see themselves as his chassidim.</p>
<p><b>Differences you'll encounter.</b> Chabad chassidim speak about Gimmel Tammuz in different ways. Some speak of it as a passing and yahrzeit; others avoid that language. Listen, learn, and discuss it with Zalmy or your mashpia rather than adopting slogans you don't understand.</p>`,
    terms: [
      { t: "Gimmel Tammuz", h: "ג׳ תמוז", m: "3 Tammuz: the Rebbe's passing (1994)" },
      { t: "Ohel", h: "אוהל", m: "The Rebbe's resting place in Queens" },
      { t: "Pan / tzetl", h: "פ״נ / צעטל", m: "A letter of request brought to the Rebbe or the Ohel" },
      { t: "Hiskashrus", h: "התקשרות", m: "Connection to the Rebbe" }
    ],
    source: "Tanya, Iggeres HaKodesh 27; Sefer HaMinhagim; chabad.org (Ohel)",
    doToday: "Write a short pan: your name and your mother's Hebrew name, and one hachlatah for this year. Ask Zalmy how to send it to the Ohel.",
    quiz: [
      { id: "m7-6-q1", t: "mc", q: "Gimmel Tammuz is:", o: ["The Rebbe's passing (1994)", "His birthday", "His leadership", "The Frierdiker Rebbe's release"], a: 0, x: "3 Tammuz 5754." },
      { id: "m7-6-q2", t: "mc", q: "The Ohel is in:", o: ["Queens, New York", "Crown Heights", "Lubavitch", "Kfar Chabad"], a: 0, x: "Old Montefiore Cemetery." },
      { id: "m7-6-q3", t: "recall", q: "What does a pan contain?", model: "Your Hebrew name and your mother's Hebrew name, plus requests and/or resolutions.", x: "Brought or sent to the Ohel." },
      { id: "m7-6-q4", t: "mc", q: "Which Tanya letter discusses a tzaddik's continued influence after passing?", o: ["Iggeres HaKodesh 27", "Chapter 1", "Shaar HaYichud ch. 1", "Iggeres HaTeshuvah 1"], a: 0, x: "Iggeres HaKodesh 27." },
      { id: "m7-6-q5", t: "tf", q: "All Chabad chassidim speak about Gimmel Tammuz the same way.", a: false, x: "False. Discuss it with your mashpia." }
    ],
    deeper: [
      { id: "m7-6-d1", t: "recall", q: "Why use your mother's name in a pan?", model: "Requests for mercy and blessing traditionally use the mother's name (e.g., based on Tehillim 116:16, \"ben amasecha\"). It's the standard for prayers and blessings.", x: "The Zohar and later sources discuss it." }
    ],
    reflect: "Hiskashrus to the Rebbe: what does it mean to you right now? What would you want it to mean?",
    sayIt: { phrase: "I wrote a pan.", h: "פ״נ", meaning: "A letter to the Rebbe, brought to the Ohel.", when: "When friends talk about Gimmel Tammuz or visiting the Ohel." }
  },
  {
    id: "m7-7", title: "Yud Beis Tammuz", minutes: 5, intro: false,
    teach: `
<p><b>What.</b> 12 Tammuz is both the birthday of the Frierdiker Rebbe (1880) and the day news came of his release from Soviet exile (1927). The official release was on 13 Tammuz.</p>
<p><b>The story.</b> On 15 Sivan 1927 the Frierdiker Rebbe was arrested by the Soviet secret police for spreading Judaism. He was held in Spalerno prison in Leningrad and sentenced to death. After international pressure, the sentence was changed to exile in Kostroma, and then he was freed.</p>
<p><b>His letter.</b> After his release he wrote: "It was not me alone that Hashem redeemed on 12 Tammuz, but all who cherish our holy Torah, keep its mitzvos, and even all who are called by the name Israel." The redemption belongs to every Jew.</p>
<p><b>How it's marked.</b></p>
<ul>
<li>It's called <i>Chag HaGeulah</i>, the Festival of Redemption.</li>
<li>Farbrengens.</li>
<li>No Tachanun.</li>
<li>Resolutions to strengthen Jewish education, which was his life's work: he risked his life for chadarim in the USSR.</li>
</ul>
<p><b>The lesson.</b> In prison he refused to be intimidated: "one G-d and two worlds". Chassidim draw from this day the strength not to be cowed by pressure, whether governments, social pressure, or the voice that says "you can't keep that here".</p>`,
    terms: [
      { t: "Yud Beis Tammuz", h: "י״ב תמוז", m: "12 Tammuz" },
      { t: "Chag HaGeulah", h: "חג הגאולה", m: "Festival of Redemption" },
      { t: "Spalerno", h: "", m: "The Leningrad prison where the Frierdiker Rebbe was held" },
      { t: "Mesiras nefesh", h: "מסירות נפש", m: "Self-sacrifice" }
    ],
    source: "The Frierdiker Rebbe's letter on the redemption (Igros Kodesh of the Frierdiker Rebbe); his prison diary; Sefer HaMinhagim",
    doToday: "Read the Frierdiker Rebbe's 12 Tammuz letter in English (chabad.org) and underline one line.",
    quiz: [
      { id: "m7-7-q1", t: "recall", q: "What two things happened on 12 Tammuz?", model: "The Frierdiker Rebbe's birthday (1880) and the news of his release from Soviet exile (1927).", x: "Official release on 13 Tammuz." },
      { id: "m7-7-q2", t: "mc", q: "When was the Frierdiker Rebbe arrested?", o: ["15 Sivan 1927", "12 Tammuz 1927", "10 Shvat 1950", "19 Kislev 1798"], a: 0, x: "He was held in Spalerno prison." },
      { id: "m7-7-q3", t: "mc", q: "According to his letter, whom did Hashem redeem on 12 Tammuz?", o: ["Not only him, but all who cherish Torah, and all Jews", "Only him", "Only chassidim", "Only his family"], a: 0, x: "The redemption belongs to everyone." },
      { id: "m7-7-q4", t: "mc", q: "Yud Beis Tammuz is called:", o: ["Chag HaGeulah", "Rosh Hashanah l'Chassidus", "Hilula", "Yom Tov Sheni"], a: 0, x: "Festival of Redemption." },
      { id: "m7-7-q5", t: "tf", q: "Tachanun is said on Yud Beis Tammuz.", a: false, x: "False." }
    ],
    deeper: [
      { id: "m7-7-d1", t: "recall", q: "Why did the Soviets arrest him?", model: "For running an underground network of Jewish education and religious life (chadarim, mikvaos, rabbis) against the regime's campaign to eradicate religion.", x: "His mesiras nefesh for chinuch." }
    ],
    reflect: "What pressure makes you back down: social, business, or family? What would \"one G-d, two worlds\" look like there?",
    sayIt: { phrase: "Not me alone did Hashem redeem.", h: "", meaning: "From the Frierdiker Rebbe's letter: the redemption is everyone's.", when: "At a Yud Beis Tammuz farbrengen." }
  },
  {
    id: "m7-8", title: "Chof Av", minutes: 5, intro: false,
    teach: `
<p><b>What.</b> 20 Av is the yahrzeit of <b>Rabbi Levi Yitzchak Schneerson</b> (1878 to 1944), the Rebbe's father.</p>
<p><b>Who he was.</b> A great Torah scholar and Kabbalist, and the chief rabbi of Yekaterinoslav (today Dnipro, Ukraine). Under Soviet rule he fought to keep Jewish life going: kosher matzah for Pesach, mikvaos, and marriages according to halacha.</p>
<p><b>Exile.</b> In 1939 he was arrested for his Jewish activity and exiled to a remote village in Kazakhstan, Chi'ili. His wife, Rebbetzin Chana, joined him. There was no ink, so she made ink from herbs she gathered, so he could write his Torah insights. They were later published as <i>Likkutei Levi Yitzchak</i>. He passed away in Almaty in 1944, weakened by the hardships.</p>
<p><b>How it's marked.</b></p>
<ul>
<li>Learning his teachings.</li>
<li>Farbrengens.</li>
<li>Recalling his and Rebbetzin Chana's mesiras nefesh.</li>
</ul>
<p>The Rebbe held farbrengens on Chof Av every year and often explained his father's teachings.</p>
<p><b>Why it matters.</b> The Rebbe's own commitment to every Jew grew in a home where the father risked everything for Jewish life, and the mother made ink out of plants so Torah could be written.</p>`,
    terms: [
      { t: "Chof Av", h: "כ׳ אב", m: "20 Av" },
      { t: "Likkutei Levi Yitzchak", h: "לקוטי לוי יצחק", m: "The collected writings of Rabbi Levi Yitzchak" },
      { t: "Rebbetzin Chana", h: "הרבנית חנה", m: "The Rebbe's mother (passed 6 Tishrei 1964)" },
      { t: "Galus", h: "גלות", m: "Exile" }
    ],
    source: "Likkutei Levi Yitzchak; Rebbetzin Chana's memoirs; the Rebbe's sichos of Chof Av",
    doToday: "Read Rebbetzin Chana's account of the ink (chabad.org) and tell someone the story.",
    quiz: [
      { id: "m7-8-q1", t: "mc", q: "Chof Av is the yahrzeit of:", o: ["The Rebbe's father, Rabbi Levi Yitzchak", "The Rebbe's mother", "The Rebbe Rashab", "The Tzemach Tzedek"], a: 0, x: "20 Av 1944." },
      { id: "m7-8-q2", t: "mc", q: "Where was Rabbi Levi Yitzchak the chief rabbi?", o: ["Yekaterinoslav", "Lubavitch", "Moscow", "Nikolaev"], a: 0, x: "Today Dnipro." },
      { id: "m7-8-q3", t: "recall", q: "What did Rebbetzin Chana do in exile?", model: "She made ink from herbs she gathered so her husband could write his Torah insights.", x: "Later published as Likkutei Levi Yitzchak." },
      { id: "m7-8-q4", t: "mc", q: "He was exiled to:", o: ["Kazakhstan", "Siberia", "Kostroma", "Poland"], a: 0, x: "The village of Chi'ili." },
      { id: "m7-8-q5", t: "tf", q: "The Rebbe held farbrengens on Chof Av.", a: true, x: "True, every year." }
    ],
    deeper: [
      { id: "m7-8-d1", t: "recall", q: "What did Rabbi Levi Yitzchak fight for under Soviet rule?", model: "Kosher matzah for Pesach, mikvaos, Jewish marriages according to halacha, and Torah life generally, despite the regime's repression.", x: "Leading to his arrest in 1939." }
    ],
    reflect: "Rebbetzin Chana made ink from herbs. What resource are you \"short\" on that you'd find a way around, if you cared enough?",
    sayIt: { phrase: "She made ink from herbs.", h: "", meaning: "Rebbetzin Chana's mesiras nefesh in exile.", when: "At a Chof Av farbrengen, or when talking about sacrifice for Torah." }
  },
  {
    id: "m7-9", title: "Chai Elul", minutes: 5, intro: false,
    teach: `
<p><b>What.</b> 18 Elul is the birthday of two founders:</p>
<ul>
<li><b>The Baal Shem Tov</b> (1698), founder of Chassidus. Tradition says he also began revealing himself publicly on his 36th birthday, 18 Elul 1734.</li>
<li><b>The Alter Rebbe</b> (1745), founder of Chabad.</li>
</ul>
<p><b>Chai means life.</b> The Frierdiker Rebbe explained that Chai Elul brings <i>chayus</i>, life, into the avodah of Elul. Elul is a month of teshuvah and preparation for Rosh Hashanah, and Chai Elul adds warmth and vitality to it. It marks the final 12 days of the year: each day corresponds to a month of the past year, a chance to repair it.</p>
<p><b>How it's marked.</b></p>
<ul>
<li>Farbrengens.</li>
<li>Resolutions for the coming year.</li>
<li>A deeper cheshbon hanefesh.</li>
</ul>
<p>This is the right time to get your Rosh Hashanah preparation serious.</p>
<p><b>You missed it this year.</b> It was 18 Elul 5786, a few weeks ago. Next year it's the date to use for planning your 5788 goals.</p>`,
    terms: [
      { t: "Chai Elul", h: "ח״י אלול", m: "18 Elul" },
      { t: "Chayus", h: "חיות", m: "Vitality, life-energy" },
      { t: "Elul", h: "אלול", m: "The month of teshuvah before Rosh Hashanah" },
      { t: "Teshuvah", h: "תשובה", m: "Return to Hashem" }
    ],
    source: "Sefer HaMinhagim; sichos of the Frierdiker Rebbe and the Rebbe on Chai Elul",
    doToday: "Put Chai Elul 5787 in your calendar with a note: \"Plan 5788 goals.\"",
    quiz: [
      { id: "m7-9-q1", t: "recall", q: "Whose birthdays fall on 18 Elul?", model: "The Baal Shem Tov (1698) and the Alter Rebbe (1745).", x: "Both founders." },
      { id: "m7-9-q2", t: "mc", q: "What does \"Chai\" add to Elul?", o: ["Life and vitality to the avodah", "A fast", "A second Rosh Hashanah", "Nothing"], a: 0, x: "The Frierdiker Rebbe's explanation." },
      { id: "m7-9-q3", t: "mc", q: "The last 12 days of the year correspond to:", o: ["The 12 months of the past year", "The 12 tribes", "The 12 stars", "Nothing"], a: 0, x: "A chance to repair each month." },
      { id: "m7-9-q4", t: "tf", q: "The Baal Shem Tov began revealing himself on his 36th birthday, according to tradition.", a: true, x: "18 Elul 1734." },
      { id: "m7-9-q5", t: "mc", q: "Chai Elul is a good time for:", o: ["Serious Rosh Hashanah preparation and resolutions", "Relaxing before the holidays", "Vacation", "Fasting"], a: 0, x: "The final stretch." }
    ],
    deeper: [
      { id: "m7-9-d1", t: "recall", q: "How would you use the \"12 days for 12 months\" idea practically?", model: "Each day from Chai Elul to Rosh Hashanah, review one month of the past year: what went well, what went wrong, and what to fix.", x: "A structured cheshbon hanefesh." }
    ],
    reflect: "Looking back on 5786: which month would you most want to redo?",
    sayIt: { phrase: "Chai Elul brings chayus into Elul.", h: "", meaning: "18 Elul adds vitality to the month of teshuvah.", when: "At a Chai Elul farbrengen." }
  },
  {
    id: "m7-10", title: "How a Chabad date is marked", minutes: 5, intro: false,
    teach: `
<p><b>The general pattern.</b> Most Chabad dates are marked the same way:</p>
<ul>
<li><b>A farbrengen</b>, the central event. There are stories and teachings about that Rebbe or that event, niggunim (especially that Rebbe's niggunim), and l'chaim.</li>
<li><b>Learning</b> the teachings of that Rebbe, or about that event.</li>
<li><b>Hachlatos:</b> concrete resolutions.</li>
<li><b>Tzedakah</b>, often in amounts connected to the date.</li>
<li><b>No Tachanun</b> on days of redemption (geulah).</li>
</ul>
<p><b>Types of days.</b></p>
<ul>
<li><b>Geulah days:</b> releases from prison, like Yud Tes Kislev and Yud Beis Tammuz. Joyous, festival-like.</li>
<li><b>Hilula days:</b> passings. Serious and connected; still with farbrengens and growth.</li>
<li><b>Birthdays:</b> growth and commitment.</li>
<li><b>Other milestones:</b> Yud Shvat (leadership), 28 Sivan (the Rebbe's arrival in America), 15 Elul (the founding of Tomchei Temimim).</li>
</ul>
<p><b>Personal dates.</b> The Rebbe encouraged personal dates too: your birthday, your yahrzeits, and even the date you started keeping something (a "yom tov" of your own).</p>
<p><b>The Chabad luach.</b> A Chabad calendar lists all these dates, the daily zmanim, and the daily Chitas. Get one, or use the chabad.org calendar. The Chabad calendar reference page in this app lists them.</p>
<p><b>Your year.</b> Upcoming this year: Chof Cheshvan, Yud Kislev, Yud Tes Kislev, Chof Daled Teves, Yud Shvat, Chof Beis Shvat, Yud Aleph Nissan, Gimmel Tammuz, Yud Beis Tammuz, Chof Av, Chai Elul.</p>`,
    terms: [
      { t: "Luach", h: "לוח", m: "Calendar" },
      { t: "Yemei geulah", h: "ימי גאולה", m: "Days of redemption" },
      { t: "Yom hilula", h: "יום הילולא", m: "A tzaddik's day of passing" },
      { t: "Farbrengen", h: "פארבריינגען", m: "A Chassidic gathering" }
    ],
    source: "Sefer HaMinhagim; Hayom Yom; the Chabad luach",
    doToday: "Put every upcoming Chabad date from the Reference page into your phone's calendar.",
    quiz: [
      { id: "m7-10-q1", t: "recall", q: "Name four standard ways a Chabad date is marked.", model: "Farbrengen, learning, hachlatos, tzedakah (and no Tachanun on geulah days).", x: "The general pattern." },
      { id: "m7-10-q2", t: "mc", q: "Which is a geulah day?", o: ["Yud Tes Kislev", "Chof Daled Teves", "Gimmel Tammuz", "Chof Av"], a: 0, x: "The Alter Rebbe's release." },
      { id: "m7-10-q3", t: "mc", q: "28 Sivan marks:", o: ["The Rebbe's arrival in America (1941)", "The Rebbe's birthday", "Shavuos", "The founding of 770"], a: 0, x: "With Rebbetzin Chaya Mushka." },
      { id: "m7-10-q4", t: "mc", q: "15 Elul marks:", o: ["The founding of Tomchei Temimim", "Chai Elul", "The Alter Rebbe's birth", "Rosh Hashanah"], a: 0, x: "1897." },
      { id: "m7-10-q5", t: "tf", q: "The Rebbe encouraged marking personal dates too.", a: true, x: "Birthdays, yahrzeits, and personal milestones." }
    ],
    deeper: [
      { id: "m7-10-d1", t: "recall", q: "Why does Chabad mark so many dates?", model: "Each date carries the energy of what happened then (\"the days are remembered and done\", Esther 9:28, as explained in Chassidus), so marking it with farbrengens and resolutions draws on that energy for growth.", x: "A Chassidic reading of time." }
    ],
    reflect: "What date in your own life deserves to be marked each year?",
    sayIt: { phrase: "What's the date today on the Chabad calendar?", h: "", meaning: "Checking for special days.", when: "Any morning. You'll start noticing dates everywhere." }
  }
]);
