/* Module 1: Foundations */
CP_LESSONS("m1", [
  {
    id: "m1-1", title: "What Chabad is", minutes: 5, intro: true,
    teach: `
<p><b>The Chassidic movement.</b> The Baal Shem Tov (Rabbi Yisrael ben Eliezer, 1698 to 1760) revealed Chassidus in the 18th century: Hashem's presence is in everything, every Jew is precious, and serving Hashem with joy and sincerity counts as much as scholarship. His successor was the Maggid of Mezritch (died 1772), who trained a circle of students who became the leaders of the movement.</p>
<p><b>The Alter Rebbe and Chabad.</b> Among the Maggid's youngest students was Rabbi Shneur Zalman of Liadi, the Alter Rebbe. He founded the branch of Chassidus called <i>Chabad</i>, an acronym for Chochmah, Binah, Daas: wisdom, understanding, and knowledge. Chabad's defining claim is that the mind should lead. You come to love and fear Hashem by understanding G-dliness deeply, not by relying on emotion or on a Rebbe alone. <span class="diff">Difference: many Polish Chassidic groups put the emphasis on emotion and on the tzaddik's role; the Chabad approach is sometimes contrasted with them as "Chabad vs. Chagas" (Chesed, Gevurah, Tiferes: the emotions).</span></p>
<p><b>Lubavitch.</b> The second Rebbe moved the court to the town of Lubavitch in Belarus, where it stayed for over a century. That is why Chabad is also called Lubavitch. In 1915, during World War I, the Rebbe Rashab left for Rostov. The Frierdiker Rebbe moved to New York in 1940, and 770 Eastern Parkway in Brooklyn became the headquarters.</p>
<p><b>What makes Chabad distinct today.</b></p>
<ul>
<li>Learning Chassidus in depth, not only as inspiration.</li>
<li>Daily Chitas and Rambam.</li>
<li>Davening with hisbonenus (contemplation).</li>
<li>Shlichus and mivtzoyim: reaching every Jew.</li>
<li>A strong focus on Moshiach.</li>
</ul>
<p>All of it rests on one idea: the goal of creation is to make this physical world a home for Hashem.</p>`,
    terms: [
      { t: "Chassidus", h: "חסידות", m: "The teachings and movement founded by the Baal Shem Tov" },
      { t: "Baal Shem Tov", h: "בעל שם טוב", m: "\"Master of the Good Name\": founder of Chassidus (1698 to 1760)" },
      { t: "Maggid of Mezritch", h: "המגיד ממעזריטש", m: "Rabbi DovBer, the Baal Shem Tov's successor and the Alter Rebbe's teacher" },
      { t: "Lubavitch", h: "ליובאוויטש", m: "The town in Belarus where Chabad's court was based for over a century" },
      { t: "Chagas", h: "חג״ת", m: "Chesed, Gevurah, Tiferes: shorthand for an emotion-centered approach" }
    ],
    source: "Tanya (introduction and ch. 3); history as recorded in the Frierdiker Rebbe's memoirs (Sefer HaZichronos) and chabad.org",
    doToday: "Explain to a friend in two sentences what \"Chabad\" stands for and why the mind leads. If you can't, reread this lesson.",
    quiz: [
      { id: "m1-1-q1", t: "mc", q: "Who founded the Chassidic movement as a whole?", o: ["The Alter Rebbe", "The Baal Shem Tov", "The Maggid of Mezritch", "The Vilna Gaon"], a: 1, x: "The Baal Shem Tov. The Alter Rebbe founded the Chabad branch, as a student of the Maggid." },
      { id: "m1-1-q2", t: "recall", q: "What does ChaBaD stand for?", model: "Chochmah, Binah, Daas: wisdom, understanding, knowledge.", x: "The three intellectual faculties of the soul." },
      { id: "m1-1-q3", t: "mc", q: "Why is Chabad also called Lubavitch?", o: ["It was founded in Lubavitch", "The Rebbeim lived in the town of Lubavitch for over a century", "It's the Alter Rebbe's family name", "It means \"mind\" in Yiddish"], a: 1, x: "The Mitteler Rebbe moved there; the court stayed until 1915." },
      { id: "m1-1-q4", t: "tf", q: "In Chabad, emotion is the starting point, and understanding follows.", a: false, x: "False. Chabad's claim is the reverse: deep understanding produces real emotion (love and fear of Hashem)." },
      { id: "m1-1-q5", t: "mc", q: "Who was the Alter Rebbe's teacher?", o: ["The Baal Shem Tov", "The Maggid of Mezritch", "The Tzemach Tzedek", "The Vilna Gaon"], a: 1, x: "The Maggid. The Alter Rebbe was one of his youngest students." },
      { id: "m1-1-q6", t: "mc", q: "When did 770 Eastern Parkway become Chabad's center?", o: ["1797", "1915", "1940", "1994"], a: 2, x: "The Frierdiker Rebbe arrived in New York in 1940." }
    ],
    deeper: [
      { id: "m1-1-d1", t: "recall", q: "Explain \"Chabad vs. Chagas\" in your own words.", model: "Chabad: service of Hashem that starts from the mind (Chochmah, Binah, Daas), producing emotion through understanding. Chagas: an approach centered on the emotions (Chesed, Gevurah, Tiferes) and faith in the tzaddik.", x: "Both are Chassidus. The difference is where the avodah starts." }
    ],
    reflect: "Your davening right now: does it run on mood or on understanding? When you feel nothing, what do you do?",
    sayIt: { phrase: "Chabad is about the mind leading the heart.", h: "מוח שליט על הלב", meaning: "The core claim of Chabad Chassidus. The Hebrew phrase \"moach shalit al halev\" (the mind rules the heart) is from Tanya.", when: "When someone asks you what makes Chabad different from other Chassidim." }
  },
  {
    id: "m1-2", title: "Chochmah, Binah, Daas", minutes: 5, intro: true,
    teach: `
<p><b>The ten powers of the soul.</b> Tanya (ch. 3) explains that the soul has ten powers, parallel to the ten sefiros: three intellectual and seven emotional.</p>
<ul>
<li><b>Chochmah (wisdom):</b> the first flash of an idea, before it's developed. The Zohar reads the word as <i>koach mah</i>, "the potential of what is": raw, undefined insight.</li>
<li><b>Binah (understanding):</b> developing that flash into a full structure, with details, implications, and depth.</li>
<li><b>Daas (knowledge):</b> binding yourself to the idea so that it is real to you, deep enough to move your emotions and behavior. Without Daas you can "understand" something and remain completely unaffected.</li>
</ul>
<p><b>Why Daas is the key.</b> Tanya ch. 3: the emotions of love and fear of Hashem are born from contemplating His greatness with Chochmah and Binah, and Daas is what makes the connection hold. Example: you know that Hashem is everywhere (Chochmah), you think it through (Binah), and then you actually live as if He's watching you in the office or the gym (Daas).</p>
<p><b>The seven emotions (middos).</b></p>
<ul>
<li>Chesed: kindness, love</li>
<li>Gevurah: restraint, fear</li>
<li>Tiferes: harmony, compassion</li>
<li>Netzach: victory, persistence</li>
<li>Hod: acknowledgment, humility</li>
<li>Yesod: connection</li>
<li>Malchus: expression, leadership</li>
</ul>
<p><b>Mind over heart.</b> Tanya ch. 12 says the mind naturally rules the heart: "moach shalit al halev". You can't always choose what you feel, but you can choose what you think about, what you say, and what you do. That is the Chabad path to changing what you feel.</p>`,
    terms: [
      { t: "Chochmah", h: "חכמה", m: "Wisdom: the initial flash of insight" },
      { t: "Binah", h: "בינה", m: "Understanding: developing the idea" },
      { t: "Daas", h: "דעת", m: "Knowledge: bonding with the idea so it drives emotion" },
      { t: "Middos", h: "מדות", m: "The seven emotional powers; also character traits" },
      { t: "Sefiros", h: "ספירות", m: "The ten Divine attributes the soul's powers parallel" },
      { t: "Moach shalit al halev", h: "מוח שליט על הלב", m: "\"The mind rules the heart\" (Tanya ch. 12)" }
    ],
    source: "Tanya ch. 3 and ch. 12",
    doToday: "Before Shacharis, take one fact (Hashem creates the world anew every moment) and spend 60 seconds thinking it through. Notice whether it changes how you say Baruch She'amar.",
    quiz: [
      { id: "m1-2-q1", t: "mc", q: "Which power is the first undeveloped flash of an idea?", o: ["Chochmah", "Binah", "Daas", "Chesed"], a: 0, x: "Chochmah: \"koach mah\", the potential of what is." },
      { id: "m1-2-q2", t: "mc", q: "You fully understand that lashon hara is destructive, but it doesn't affect how you talk. What is missing?", o: ["Chochmah", "Binah", "Daas", "Gevurah"], a: 2, x: "Daas is the bond that makes understanding real enough to change behavior." },
      { id: "m1-2-q3", t: "recall", q: "How many powers does the soul have, and how are they split?", model: "Ten: three intellectual (Chochmah, Binah, Daas) and seven emotional (the middos).", x: "Tanya ch. 3." },
      { id: "m1-2-q4", t: "tf", q: "According to Tanya, love and fear of Hashem are generated by contemplation.", a: true, x: "True. Contemplating Hashem's greatness produces them (Tanya ch. 3)." },
      { id: "m1-2-q5", t: "mc", q: "\"Moach shalit al halev\" means:", o: ["The heart rules the mind", "The mind rules the heart", "The mind and heart are equal", "Follow your heart"], a: 1, x: "Tanya ch. 12: the mind has a natural capacity to rule the heart." },
      { id: "m1-2-q6", t: "mc", q: "Gevurah corresponds to:", o: ["Kindness", "Restraint and fear", "Persistence", "Leadership"], a: 1, x: "Chesed is expansion; Gevurah is restraint." }
    ],
    deeper: [
      { id: "m1-2-d1", t: "recall", q: "Give an example from your own life of Binah without Daas.", model: "Any case where you understood something thoroughly but it didn't change how you act: knowing the value of davening slowly, for example, and still rushing.", x: "The fix is to spend time dwelling on it until it's real to you." }
    ],
    reflect: "Pick one thing you know is true but that doesn't affect your behavior yet (in business, friendships, or davening). What would it take to add the Daas?",
    sayIt: { phrase: "I understand it, but I don't have the Daas yet.", h: "דעת", meaning: "I get it intellectually, but it hasn't sunk in enough to change me.", when: "At a farbrengen, when being honest about the gap between knowing and living. Chassidim will know exactly what you mean." }
  },
  {
    id: "m1-3", title: "The Alter Rebbe", minutes: 5, intro: false,
    teach: `
<p><b>Rabbi Shneur Zalman of Liadi</b> (18 Elul 5505, 1745, to 24 Teves 5573, 1812). A prodigy in Gemara, he went to the Maggid of Mezritch as a young man and became one of his closest students. At the Maggid's request he wrote a new code of halacha: the <i>Shulchan Aruch HaRav</i>, still the halachic foundation of Chabad.</p>
<p><b>His works.</b></p>
<ul>
<li><b>Tanya</b> (first printed 1796): the "Written Torah of Chassidus" and a practical guide for the average Jew, the beinoni.</li>
<li><b>Shulchan Aruch HaRav</b> and the <b>Siddur</b> (Nusach Ari), with the laws of brachos in <i>Seder Birchos HaNehenin</i>.</li>
<li><b>Torah Or</b> and <b>Likkutei Torah</b>: his maamarim on the parsha.</li>
</ul>
<p><b>Arrest and release.</b> Opponents of Chassidus (misnagdim) informed on him to the Russian government, and in 1798 he was arrested and held in St. Petersburg. He was freed on 19 Kislev. He saw the release as Heaven's verdict that Chassidus should be spread more widely, and from then on he taught it more openly and in greater depth. That day became Yud Tes Kislev, the "Rosh Hashanah of Chassidus".</p>
<p><b>"Ayeka?"</b> While he was in prison, a government official asked him: "If Hashem knows everything, why did He ask Adam 'Ayeka, where are you?'" The Alter Rebbe answered that Hashem asks every person, in every generation: where are you in your world? Of the years allotted to you, how many have passed, and what have you accomplished?</p>
<p><b>Napoleon.</b> In 1812 he opposed Napoleon. He said that if Napoleon won, Jews would prosper materially but grow distant from Hashem. He fled ahead of the French army and passed away on the way, in Piena, on 24 Teves.</p>`,
    terms: [
      { t: "Alter Rebbe", h: "אדמו״ר הזקן", m: "\"The Old Rebbe\": Rabbi Shneur Zalman of Liadi, founder of Chabad" },
      { t: "Likkutei Amarim", h: "ליקוטי אמרים", m: "The formal title of the Tanya's main section" },
      { t: "Misnagdim", h: "מתנגדים", m: "\"Opponents\": those who opposed the Chassidic movement" },
      { t: "Ayeka", h: "איכה", m: "\"Where are you?\" (Bereishis 3:9)" },
      { t: "Nusach Ari", h: "נוסח האר״י", m: "The prayer rite of the Arizal, as arranged in the Alter Rebbe's siddur" }
    ],
    source: "Tanya; the Ayeka story as told by the Frierdiker Rebbe (Likkutei Dibburim and elsewhere); Bereishis 3:9",
    doToday: "Answer \"Ayeka\" for yourself: write one line on where you are this year and what you want done by Pesach.",
    quiz: [
      { id: "m1-3-q1", t: "mc", q: "The Alter Rebbe's code of halacha is called:", o: ["Mishneh Torah", "Shulchan Aruch HaRav", "Kitzur Shulchan Aruch", "Mishnah Berurah"], a: 1, x: "Written at the Maggid's request." },
      { id: "m1-3-q2", t: "mc", q: "What happened on 19 Kislev 1798?", o: ["The Tanya was printed", "The Alter Rebbe was freed from prison", "The Alter Rebbe passed away", "Lubavitch was founded"], a: 1, x: "Yud Tes Kislev." },
      { id: "m1-3-q3", t: "recall", q: "What was the Alter Rebbe's answer about \"Ayeka\"?", model: "Hashem asks every person in every era: where are you in your world? Your years are counted; what have you done with them?", x: "The question is addressed to you, not only to Adam." },
      { id: "m1-3-q4", t: "mc", q: "Why did the Alter Rebbe oppose Napoleon?", o: ["Napoleon was anti-Semitic", "Under Napoleon Jews would prosper materially but drift spiritually", "He supported the Czar's policies toward Jews", "Napoleon closed yeshivos"], a: 1, x: "That was his stated reasoning." },
      { id: "m1-3-q5", t: "tf", q: "The Alter Rebbe's siddur follows Nusach Ari.", a: true, x: "True." },
      { id: "m1-3-q6", t: "mc", q: "The Alter Rebbe's yahrzeit is:", o: ["19 Kislev", "24 Teves", "18 Elul", "10 Shvat"], a: 1, x: "Chof Daled Teves. 18 Elul (Chai Elul) is his birthday." }
    ],
    deeper: [
      { id: "m1-3-d1", t: "mc", q: "Why is Tanya called the \"Written Torah of Chassidus\"?", o: ["It's written in Hebrew", "It's the foundational, systematic text, and later Chassidus explains it", "It includes verses of Torah", "It was written on parchment"], a: 1, x: "Later Chabad works are, in a sense, its \"Oral Torah\"." }
    ],
    reflect: "The Alter Rebbe wrote Tanya for the average person, not the tzaddik. Does that change how you see your own spiritual expectations this year?",
    sayIt: { phrase: "Ayeka: where are you in your world?", h: "איכה", meaning: "The Alter Rebbe's reading of Bereishis 3:9: a question to every person, every day.", when: "At a farbrengen or in a cheshbon hanefesh conversation with a friend." }
  },
  {
    id: "m1-4", title: "The Mitteler Rebbe", minutes: 5, intro: false,
    teach: `
<p><b>Rabbi DovBer Schneuri</b> (9 Kislev 5534, 1773, to 9 Kislev 5588, 1827), the Alter Rebbe's eldest son. He is called "Mitteler", meaning middle, because he came between the Alter Rebbe and the Tzemach Tzedek. He moved the court to Lubavitch.</p>
<p><b>Rivers of Chassidus.</b> His explanations are long, detailed, and deep. Chassidim describe the Alter Rebbe's teaching as concentrated and the Mitteler Rebbe's as "broad as a river". His works include <i>Shaar HaYichud</i> (on contemplation), <i>Imrei Binah</i>, and <i>Toras Chaim</i>.</p>
<p><b>Kuntres HaHispaalus.</b> His "Tract on Ecstasy" distinguishes real spiritual emotion, which comes from genuine contemplation and self-nullification, from fake emotion that is really self-centered excitement. His test: does your feeling serve Hashem, or does it serve your self-image? That is a useful question at an intense farbrengen or during a spiritual high.</p>
<p><b>Caring for Jews.</b> He worked to settle Jews in agricultural colonies in southern Russia so they could earn a living.</p>
<p><b>The cradle.</b> Once, he was so absorbed in learning that he didn't hear his baby fall from its cradle and cry. The Alter Rebbe, learning upstairs, heard it, came down, and picked the baby up. Afterward he told his son: however high your learning is, you must never be so absorbed that you fail to hear a child cry.</p>
<p><b>Arrest.</b> In 1826 he was arrested on false charges. He was freed on 10 Kislev. He passed away on his birthday, 9 Kislev, at 54.</p>`,
    terms: [
      { t: "Mitteler Rebbe", h: "אדמו״ר האמצעי", m: "\"The Middle Rebbe\": Rabbi DovBer, the second Rebbe" },
      { t: "Kuntres HaHispaalus", h: "קונטרס ההתפעלות", m: "\"Tract on Ecstasy\": on genuine vs. self-centered spiritual emotion" },
      { t: "Shaar HaYichud", h: "שער היחוד", m: "\"Gate of Unity\": the Mitteler Rebbe's work on hisbonenus" },
      { t: "Yud Kislev", h: "י׳ כסלו", m: "10 Kislev: the Mitteler Rebbe's release" }
    ],
    source: "The cradle story as told by the Frierdiker Rebbe; Kuntres HaHispaalus; chabad.org biographies",
    doToday: "Today, when you're absorbed in learning or in work, notice one \"crying child\": a friend who needs you, or a message that matters more than your task. Stop for it.",
    quiz: [
      { id: "m1-4-q1", t: "mc", q: "The Mitteler Rebbe was the Alter Rebbe's:", o: ["Grandson", "Son", "Student only", "Son-in-law"], a: 1, x: "Eldest son." },
      { id: "m1-4-q2", t: "mc", q: "Where did the Mitteler Rebbe move the Chabad court?", o: ["Liadi", "Lubavitch", "Rostov", "Vilna"], a: 1, x: "Lubavitch, where it stayed until 1915." },
      { id: "m1-4-q3", t: "recall", q: "What was the lesson of the cradle story?", model: "However high your spiritual work, you must never be so absorbed that you don't hear a child (or anyone in need) cry.", x: "Spirituality that ignores people in need isn't the goal." },
      { id: "m1-4-q4", t: "mc", q: "Kuntres HaHispaalus is about:", o: ["Business ethics", "Genuine vs. self-centered spiritual emotion", "Laws of Shabbos", "The history of Chabad"], a: 1, x: "\"Tract on Ecstasy\"." },
      { id: "m1-4-q5", t: "tf", q: "The Mitteler Rebbe passed away on his birthday.", a: true, x: "True: 9 Kislev." },
      { id: "m1-4-q6", t: "mc", q: "10 Kislev marks:", o: ["The Mitteler Rebbe's release from prison", "The Alter Rebbe's release", "The Rebbe's wedding", "Chanukah"], a: 0, x: "In 1826." }
    ],
    deeper: [
      { id: "m1-4-d1", t: "scenario", q: "At a farbrengen you feel huge inspiration, but afterward you mostly remember how inspired you looked. By the Mitteler Rebbe's test, this was:", o: ["Genuine hispaalus", "Likely self-centered excitement", "Irrelevant"], a: 1, x: "Genuine emotion is about Hashem, not self-image. The test is whether it changes behavior quietly." }
    ],
    reflect: "Who in your life is a \"crying child\" you might be missing while you're busy: Ari, a friend back home, your parents?",
    sayIt: { phrase: "Don't be so busy learning that you don't hear the baby cry.", h: "", meaning: "The Alter Rebbe's rebuke to the Mitteler Rebbe.", when: "When someone is so focused on their growth that they neglect people. Say it gently." }
  },
  {
    id: "m1-5", title: "The Tzemach Tzedek", minutes: 5, intro: false,
    teach: `
<p><b>Rabbi Menachem Mendel Schneersohn</b> (29 Elul 5549, 1789, to 13 Nissan 5626, 1866). His mother, Devorah Leah, the Alter Rebbe's daughter, passed away when he was a small child. Chassidic tradition says she gave her life for her father. The Alter Rebbe raised him. He married the Mitteler Rebbe's daughter.</p>
<p><b>A giant in both worlds.</b> He is called "Tzemach Tzedek" after his halachic responsa, which are still cited by poskim of every community. In Chassidus he wrote <i>Or HaTorah</i> and <i>Derech Mitzvosecha</i>, the explanation of the mitzvos. He showed that Chassidus and deep halacha are one system.</p>
<p><b>Fighting for Jewish education.</b> In 1843 the Russian government called a rabbinical conference in St. Petersburg to push "enlightened" changes to Jewish education. The Tzemach Tzedek refused to give in, despite pressure and arrests. He also worked against the Cantonist decrees, under which Jewish boys were forcibly drafted.</p>
<p><b>"Tracht gut vet zain gut."</b> A chassid came to him distraught over his seriously ill son. The Tzemach Tzedek told him: "Tracht gut vet zain gut": think good and it will be good. The son recovered. The Rebbe later explained that this is not wishful thinking. Real bitachon, trusting that Hashem will do good in a visible way, is itself a channel that brings the good.</p>`,
    terms: [
      { t: "Tzemach Tzedek", h: "צמח צדק", m: "The third Rebbe, named after his halachic responsa" },
      { t: "Tracht gut vet zain gut", h: "טראַכט גוט וועט זיין גוט", m: "Yiddish: \"Think good and it will be good\"" },
      { t: "Derech Mitzvosecha", h: "דרך מצוותיך", m: "The Tzemach Tzedek's Chassidic explanation of the mitzvos" },
      { t: "Bitachon", h: "ביטחון", m: "Trust in Hashem" },
      { t: "Cantonists", h: "קנטוניסטים", m: "Jewish boys forcibly drafted into the Russian army in the 19th century" }
    ],
    source: "Tzemach Tzedek responsa; the \"Tracht gut\" story and its explanation in the Rebbe's sichos (Likkutei Sichos)",
    doToday: "Pick one worry, whether business, family, or your year here. Do your part (hishtadlus), then say out loud: \"Tracht gut vet zain gut\", and stop replaying it.",
    quiz: [
      { id: "m1-5-q1", t: "mc", q: "\"Tzemach Tzedek\" is the name of his:", o: ["Hometown", "Halachic responsa", "Siddur", "Yeshiva"], a: 1, x: "Rebbeim are often called by their main work." },
      { id: "m1-5-q2", t: "recall", q: "What does \"Tracht gut vet zain gut\" mean, and what's the deeper idea?", model: "Think good and it will be good. Real bitachon, trusting Hashem for visible good, is itself a channel for the good.", x: "It's not positive thinking; it's trust." },
      { id: "m1-5-q3", t: "mc", q: "The Tzemach Tzedek was the Alter Rebbe's:", o: ["Son", "Grandson", "Nephew", "Student only"], a: 1, x: "Grandson, raised by him, and son-in-law of the Mitteler Rebbe." },
      { id: "m1-5-q4", t: "mc", q: "At the 1843 St. Petersburg conference he:", o: ["Agreed to government education reforms", "Refused to compromise on Jewish education", "Didn't attend", "Founded a university"], a: 1, x: "Despite heavy pressure." },
      { id: "m1-5-q5", t: "tf", q: "The Tzemach Tzedek's halachic works are cited only by Chabad.", a: false, x: "False. Poskim of all communities cite his responsa." },
      { id: "m1-5-q6", t: "mc", q: "His yahrzeit is:", o: ["13 Nissan", "13 Tishrei", "24 Teves", "2 Nissan"], a: 0, x: "13 Tishrei is the Rebbe Maharash; 2 Nissan the Rebbe Rashab." }
    ],
    deeper: [
      { id: "m1-5-d1", t: "recall", q: "How is \"Tracht gut\" different from secular positive thinking?", model: "Positive thinking says your mind creates reality. Bitachon says Hashem is good and in control, and trusting Him so fully that you're calm is the vessel for His good to be revealed. It still requires hishtadlus.", x: "The Rebbe explained this in several sichos." }
    ],
    reflect: "Where in the business do you \"tracht shlecht\" (think bad): pricing, customers, Ari? What would bitachon look like there, alongside real effort?",
    sayIt: { phrase: "Tracht gut vet zain gut.", h: "טראַכט גוט וועט זיין גוט", meaning: "Think good and it will be good.", when: "When a friend is anxious about something out of his control. It's the classic Chabad response." }
  },
  {
    id: "m1-6", title: "The Rebbe Maharash", minutes: 5, intro: false,
    teach: `
<p><b>Rabbi Shmuel Schneersohn</b> (2 Iyar 5594, 1834, to 13 Tishrei 5643, 1882), the youngest son of the Tzemach Tzedek. He became Rebbe at 32 and led for only 16 years. The name "Maharash" is an acronym of <i>Moreinu HaRav Shmuel</i>.</p>
<p><b>Activist.</b> He traveled across Europe to lobby government officials against persecution of Jews and pogroms. He had a strong, commanding presence and was known for great generosity. His maamarim are collected in <i>Likkutei Torah Toras Shmuel</i>.</p>
<p><b>Lechatchila ariber.</b> His most famous line: "The world says: if you can't go under an obstacle, try to go over it. I say: <i>lechatchila ariber</i>, go over from the start." Don't start by looking for the way around. Aim straight over the top.</p>
<p><b>How it's used today.</b> Chassidim say "lechatchila ariber" when facing something hard: a goal that seems too big, or an obstacle in Yiddishkeit or life. Applied correctly, it's about spiritual courage, not recklessness. You still consult, plan, and ask a rav. What changes is that you don't start from a place of fear.</p>
<p><b>Why it matters to you.</b> You're 18, a year into a serious Jewish life, running a business across a 10-hour time difference. There will be many "under or over" decisions this year, like keeping Shabbos boundaries with the business, or committing to Chitas. The Maharash's approach: don't negotiate with the obstacle.</p>`,
    terms: [
      { t: "Maharash", h: "מהר״ש", m: "Acronym of Moreinu HaRav Shmuel: the fourth Rebbe" },
      { t: "Lechatchila ariber", h: "לכתחילה אריבער", m: "\"From the outset, go over\"" },
      { t: "Toras Shmuel", h: "תורת שמואל", m: "The Rebbe Maharash's collected maamarim" }
    ],
    source: "The \"lechatchila ariber\" saying as transmitted by the later Rebbeim (see Igros Kodesh and sichos of the Frierdiker Rebbe and the Rebbe)",
    doToday: "Identify one thing you've been approaching \"from under\" (compromising before trying). Take one step straight at it today.",
    quiz: [
      { id: "m1-6-q1", t: "recall", q: "Complete the saying: \"The world says if you can't go under, go over. I say...\"", model: "\"Lechatchila ariber\": go over from the start.", x: "The Rebbe Maharash." },
      { id: "m1-6-q2", t: "mc", q: "The Rebbe Maharash was the Tzemach Tzedek's:", o: ["Eldest son", "Youngest son", "Grandson", "Son-in-law"], a: 1, x: "Youngest son." },
      { id: "m1-6-q3", t: "mc", q: "His yahrzeit is:", o: ["13 Tishrei", "13 Nissan", "2 Iyar", "20 Cheshvan"], a: 0, x: "13 Tishrei. 2 Iyar is his birthday." },
      { id: "m1-6-q4", t: "tf", q: "\"Lechatchila ariber\" means ignoring halacha and advice when there's an obstacle.", a: false, x: "False. It's about courage and approach, not recklessness. You still ask a rav." },
      { id: "m1-6-q5", t: "mc", q: "What was one of his public activities?", o: ["Founding Tomchei Temimim", "Lobbying European officials against persecution of Jews", "Moving to America", "Printing the Tanya"], a: 1, x: "Tomchei Temimim was the Rebbe Rashab; America was the Frierdiker Rebbe." }
    ],
    deeper: [
      { id: "m1-6-d1", t: "scenario", q: "A friend wants to start Chitas but says he'll \"ease in\" by skipping it on busy days. What would lechatchila ariber suggest?", o: ["Make it daily from day one, even if the portion is small", "Wait until yeshiva is less busy", "Do it only on Shabbos"], a: 0, x: "Go straight over: daily and non-negotiable. Adjust the size, not the commitment." }
    ],
    reflect: "What's your biggest \"under or over\" decision this year? Write what going over would look like.",
    sayIt: { phrase: "Lechatchila ariber.", h: "לכתחילה אריבער", meaning: "From the start, go over.", when: "When friends are hesitating before a real goal. Said with energy." }
  },
  {
    id: "m1-7", title: "The Rebbe Rashab", minutes: 5, intro: false,
    teach: `
<p><b>Rabbi Sholom DovBer Schneersohn</b> (20 Cheshvan 5621, 1860, to 2 Nissan 5680, 1920), the second son of the Rebbe Maharash. "Rashab" is an acronym of Rabbi Sholom DovBer.</p>
<p><b>Tomchei Temimim.</b> In 1897 (15 Elul 5657) he founded the yeshiva Tomchei Temimim in Lubavitch, the first yeshiva to teach Chassidus systematically alongside Gemara. He described its students as soldiers of the House of Dovid who would go out to strengthen Yiddishkeit and prepare for Moshiach. Mayanot, and every Chabad yeshiva, descends from this model.</p>
<p><b>The Rambam of Chassidus.</b> His series of maamarim known as <i>Hemshech 5666</i> ("Samach Vov") is so systematic that he's called the "Rambam of Chassidus". He also wrote <i>Kuntres HaTefillah</i>, on how to daven with contemplation, and <i>Kuntres Etz HaChaim</i>, a guide for yeshiva students.</p>
<p><b>A child's question.</b> At about age four he came crying to his grandfather, the Tzemach Tzedek: why did Hashem appear to Avraham and not to me? The answer: when a 99-year-old tzaddik decides he must do Hashem's will and circumcise himself, he deserves that Hashem appear to him.</p>
<p><b>Last words.</b> During World War I he left Lubavitch (1915) for Rostov, where he passed away. His last words to his chassidim are often quoted: "Ich gei in himmel, di kesavim loz ich aych": I'm going to heaven, and I leave you the writings. His Torah remains accessible.</p>`,
    terms: [
      { t: "Rashab", h: "רש״ב", m: "Acronym of Rabbi Sholom DovBer: the fifth Rebbe" },
      { t: "Tomchei Temimim", h: "תומכי תמימים", m: "\"Supporters of the wholehearted\": the Chabad yeshiva network" },
      { t: "Tamim (pl. temimim)", h: "תמים", m: "A student of Tomchei Temimim" },
      { t: "Hemshech", h: "המשך", m: "A series of connected maamarim" },
      { t: "Kuntres HaTefillah", h: "קונטרס התפילה", m: "The Rebbe Rashab's tract on davening" }
    ],
    source: "Kuntres HaTefillah; Hemshech 5666; the stories as told by the Frierdiker Rebbe",
    doToday: "You're a tamim at a Chabad yeshiva: a direct heir of 1897. Today, in one seder, learn with that seriousness: phone away, full focus.",
    quiz: [
      { id: "m1-7-q1", t: "mc", q: "The Rebbe Rashab founded:", o: ["770", "Tomchei Temimim", "Merkos", "Kfar Chabad"], a: 1, x: "In 1897." },
      { id: "m1-7-q2", t: "mc", q: "He's called \"the Rambam of Chassidus\" because:", o: ["He wrote halacha", "His maamarim are systematic and ordered", "He was a doctor", "He lived in Egypt"], a: 1, x: "Especially Hemshech 5666." },
      { id: "m1-7-q3", t: "recall", q: "What did the Tzemach Tzedek answer the young Rebbe Rashab about Hashem appearing to Avraham?", model: "When a 99-year-old tzaddik decides he must circumcise himself, he deserves that Hashem appear to him.", x: "Revelation follows real self-sacrifice." },
      { id: "m1-7-q4", t: "mc", q: "Chof Cheshvan (20 Cheshvan) is:", o: ["The Rebbe Rashab's birthday", "His yahrzeit", "The founding of Tomchei Temimim", "The Rebbe's wedding"], a: 0, x: "His yahrzeit is 2 Nissan." },
      { id: "m1-7-q5", t: "tf", q: "Kuntres HaTefillah is a guide to davening with contemplation.", a: true, x: "True." },
      { id: "m1-7-q6", t: "mc", q: "Why did he leave Lubavitch in 1915?", o: ["World War I", "The Russian Revolution", "To move to America", "A fire"], a: 0, x: "He moved to Rostov." }
    ],
    deeper: [
      { id: "m1-7-d1", t: "recall", q: "What did the Rebbe Rashab mean by calling Tomchei Temimim students \"soldiers\"?", model: "Their learning and avodah isn't only personal growth; it's a mission to strengthen Yiddishkeit in the world and prepare for Moshiach. Soldiers have discipline, a mission, and responsibility beyond themselves.", x: "This idea underlies shlichus." }
    ],
    reflect: "How does it feel to be part of something that started in 1897? Does being a \"soldier\" rather than just a student change how you treat seder?",
    sayIt: { phrase: "Ich gei in himmel, di kesavim loz ich aych.", h: "", meaning: "\"I'm going to heaven; I leave you the writings.\" The Rebbe Rashab's last words.", when: "When talking about how the Rebbeim are still accessible through their Torah." }
  },
  {
    id: "m1-8", title: "The Frierdiker Rebbe", minutes: 5, intro: false,
    teach: `
<p><b>Rabbi Yosef Yitzchak Schneersohn</b> (12 Tammuz 5640, 1880, to 10 Shvat 5710, 1950), the only son of the Rebbe Rashab. "Frierdiker" means "previous". He is also called the Rebbe Rayatz.</p>
<p><b>Underground Judaism.</b> After the Communist revolution, the Soviet regime set out to destroy Jewish life. He built an underground network of chadarim, mikvaos, shochtim, and rabbis. Chassidim risked prison and death to keep it running.</p>
<p><b>1927.</b> He was arrested on 15 Sivan 1927 and sentenced to death. After international pressure, the sentence was commuted to exile, and news of his release came on 12 Tammuz, his birthday. That's Yud Beis Tammuz, the "Chag HaGeulah". During interrogation, an agent pointed a pistol at him. He answered: "Toys like that frighten a man who has many gods and one world. I have one G-d and two worlds."</p>
<p><b>America.</b> After escaping Warsaw during World War II, he arrived in New York in 1940 and set up at 770 Eastern Parkway. At the time, people said traditional Judaism couldn't survive in America. He declared: <i>"America iz nit anders"</i>, America is not different. He founded Machne Israel, Merkos L'Inyonei Chinuch, and Kehot, and campaigned under the slogan <i>"L'altar l'teshuvah, l'altar l'geulah"</i>: immediate teshuvah, immediate redemption.</p>
<p><b>His writings.</b> His memoirs and talks preserve the history, stories, and inner life of the earlier Rebbeim. Much of what you know about them comes through him. He also arranged the daily Chitas.</p>`,
    terms: [
      { t: "Frierdiker Rebbe", h: "פריערדיקער רבי", m: "Yiddish: \"the previous Rebbe\": Rabbi Yosef Yitzchak, the sixth Rebbe" },
      { t: "Rayatz", h: "ריי״צ", m: "Acronym of Rabbi Yosef Yitzchak" },
      { t: "America iz nit anders", h: "", m: "Yiddish: \"America is not different\"" },
      { t: "Chag HaGeulah", h: "חג הגאולה", m: "\"Festival of Redemption\": 12 to 13 Tammuz" },
      { t: "L'altar l'teshuvah, l'altar l'geulah", h: "לאלתר לתשובה לאלתר לגאולה", m: "\"Immediate teshuvah, immediate redemption\"" }
    ],
    source: "The Frierdiker Rebbe's memoirs and prison diary; Igros Kodesh of the Frierdiker Rebbe",
    doToday: "Say the pistol line from memory to one friend and explain what \"one G-d and two worlds\" means.",
    quiz: [
      { id: "m1-8-q1", t: "recall", q: "Complete: \"Toys like that frighten a man who has many gods and one world. I have...\"", model: "\"...one G-d and two worlds.\"", x: "Said to a Soviet interrogator holding a pistol." },
      { id: "m1-8-q2", t: "mc", q: "\"America iz nit anders\" means:", o: ["America is not different: Torah Judaism can thrive there", "America is dangerous", "Leave America", "America is a new start"], a: 0, x: "It was a rejection of the idea that America required compromise." },
      { id: "m1-8-q3", t: "mc", q: "Yud Beis Tammuz marks:", o: ["The Frierdiker Rebbe's birthday and release from Soviet imprisonment", "His passing", "His arrival in America", "The founding of 770"], a: 0, x: "Both, on the same date." },
      { id: "m1-8-q4", t: "mc", q: "He passed away on:", o: ["10 Shvat 1950", "3 Tammuz 1994", "12 Tammuz 1927", "2 Nissan 1920"], a: 0, x: "Yud Shvat." },
      { id: "m1-8-q5", t: "tf", q: "The Frierdiker Rebbe ran an underground network of Jewish education and services in the Soviet Union.", a: true, x: "True, at great personal risk." },
      { id: "m1-8-q6", t: "mc", q: "\"Frierdiker\" means:", o: ["Previous", "Beloved", "Elder", "Holy"], a: 0, x: "Yiddish for previous." }
    ],
    deeper: [
      { id: "m1-8-d1", t: "recall", q: "Why were the Frierdiker Rebbe's memoirs so important for Chabad?", model: "They preserved the history, stories, customs, and inner life of the earlier Rebbeim and chassidim, most of which would otherwise have been lost after the destruction in Russia.", x: "Most famous Chabad stories reach us through him." }
    ],
    reflect: "\"America iz nit anders.\" Where in your life do you tell yourself \"my situation is different\" (the business, home, Palo Alto) as a reason for less?",
    sayIt: { phrase: "America iz nit anders.", h: "", meaning: "America is not different: no location or situation excuses Yiddishkeit.", when: "When someone says \"that won't work back home\". Swap in the place: \"Palo Alto iz nit anders.\"" }
  },
  {
    id: "m1-9", title: "The Rebbe", minutes: 5, intro: false,
    teach: `
<p><b>Rabbi Menachem Mendel Schneerson</b> (11 Nissan 5662, 1902, to 3 Tammuz 5754, 1994). He was born in Nikolaev, Ukraine. His father, Rabbi Levi Yitzchak, was a great Kabbalist and the rav of Yekaterinoslav. He married the Frierdiker Rebbe's daughter, Rebbetzin Chaya Mushka, on 14 Kislev 1928, and studied at universities in Berlin and Paris. He escaped Nazi-occupied France and arrived in New York on 28 Sivan 1941.</p>
<p><b>Leadership.</b> After the Frierdiker Rebbe's passing he was reluctant to accept the role. On 10 Shvat 1951 he formally accepted it by saying the maamar <i>Basi L'Gani</i>. In it he declared that the task of this generation, the seventh, is to complete the process of drawing the Shechinah into this world and bringing Moshiach.</p>
<p><b>What he built.</b></p>
<ul>
<li>Thousands of shluchim across the world.</li>
<li>The mivtzoyim: campaigns for tefillin, Shabbos candles, mezuzah, and more.</li>
<li>The daily Rambam cycle (1984).</li>
<li>Hundreds of volumes of sichos and letters.</li>
<li>Farbrengens lasting many hours.</li>
</ul>
<p>He was personally involved with an enormous number of individuals, from heads of state to children. Every individual Jew mattered to him.</p>
<p><b>Dollars.</b> From 1986, every Sunday he stood for hours while thousands passed by, giving each person a dollar to give to tzedakah. That turned every visitor into a giver. When asked how he didn't tire, the answer commonly told is: "When you're counting diamonds, you don't get tired."</p>
<p><b>Gimmel Tammuz.</b> He passed away on 3 Tammuz 1994. His resting place, the Ohel in Queens, is visited by tens of thousands. His teachings continue to guide Chabad's daily life.</p>`,
    terms: [
      { t: "The Rebbe", h: "הרבי", m: "Among chassidim, the Lubavitcher Rebbe, Rabbi Menachem Mendel Schneerson" },
      { t: "Basi L'Gani", h: "באתי לגני", m: "\"I have come into My garden\": the maamar with which the Rebbe accepted leadership" },
      { t: "Dor hashvi'i", h: "דור השביעי", m: "\"The seventh generation\": the Rebbe's term for this generation's mission" },
      { t: "Ohel", h: "אוהל", m: "The Rebbe's resting place in Queens, New York" },
      { t: "Likkutei Sichos", h: "לקוטי שיחות", m: "The edited collection of the Rebbe's talks (39 volumes)" }
    ],
    source: "Basi L'Gani 5711; Likkutei Sichos; Igros Kodesh; chabad.org biography",
    doToday: "Give a dollar to tzedakah today and think of yourself as a giver, not just someone making a donation. Then read one short letter or sicha of the Rebbe (chabad.org has many in English).",
    quiz: [
      { id: "m1-9-q1", t: "mc", q: "When did the Rebbe formally accept leadership?", o: ["10 Shvat 1951", "10 Shvat 1950", "11 Nissan 1902", "3 Tammuz 1994"], a: 0, x: "Exactly one year after the Frierdiker Rebbe's passing." },
      { id: "m1-9-q2", t: "recall", q: "What is Basi L'Gani, and what was its central message?", model: "The maamar the Rebbe said on accepting leadership (10 Shvat 1951). Message: the seventh generation's task is to complete drawing the Shechinah into this world, bringing Moshiach.", x: "The title means \"I have come into My garden\" (Shir HaShirim 5:1)." },
      { id: "m1-9-q3", t: "mc", q: "The Rebbe's wife was:", o: ["Rebbetzin Chana", "Rebbetzin Chaya Mushka", "Rebbetzin Devorah Leah", "Rebbetzin Shterna Sarah"], a: 1, x: "Daughter of the Frierdiker Rebbe. Rebbetzin Chana was his mother." },
      { id: "m1-9-q4", t: "mc", q: "Why did the Rebbe give out dollars?", o: ["As charity to visitors", "To make each visitor a giver of tzedakah", "As souvenirs", "To fund 770"], a: 1, x: "The point was that people would give it on to tzedakah." },
      { id: "m1-9-q5", t: "tf", q: "The Rebbe's birthday is 11 Nissan.", a: true, x: "True: Yud Aleph Nissan." },
      { id: "m1-9-q6", t: "mc", q: "The Rebbe was born in:", o: ["Lubavitch", "Nikolaev", "Rostov", "Brooklyn"], a: 1, x: "Nikolaev, Ukraine, in 1902." }
    ],
    deeper: [
      { id: "m1-9-d1", t: "mc", q: "\"The seventh generation\" is counted from:", o: ["The Baal Shem Tov", "The Alter Rebbe (Avraham was seventh from Adam; \"all sevenths are beloved\")", "The Rebbe Rashab"], a: 1, x: "The Rebbe counted from the Alter Rebbe, citing the Midrash that \"all sevenths are beloved\", like Moshe, seventh from Avraham." }
    ],
    reflect: "The Rebbe treated every individual as a diamond. Who do you treat as ordinary: a customer, a guy on mivtzoyim, someone at Mayanot? What changes if they're diamonds?",
    sayIt: { phrase: "When you're counting diamonds, you don't get tired.", h: "", meaning: "Commonly told as the Rebbe's answer about standing for hours giving dollars.", when: "When someone asks why you'd spend time on one more person. Say it as \"the Rebbe is quoted as saying\"." }
  },
  {
    id: "m1-10", title: "The Rebbe's vision: shlichus and Moshiach", minutes: 5, intro: false,
    teach: `
<p><b>The purpose of creation.</b> The Midrash (Tanchuma, Naso 16) says Hashem desired a <i>dirah b'tachtonim</i>, a dwelling place in the lowest realms. Tanya ch. 36 builds on this: this physical world, not the higher spiritual worlds, is where Hashem wants to be at home. We build that home through Torah and mitzvos done in physical life. The Rebbe made this the driving idea of everything.</p>
<p><b>Shlichus.</b> If every Jew and every corner of the world matter, someone has to go there. The Rebbe sent young couples as shluchim to cities, campuses, and remote places, to live there permanently and serve every Jew. By now there are thousands. The Chabad house near you in Palo Alto, or at Stanford, exists because of this. The Rebbe also taught that every Jew is a shliach in his own environment: at work, with friends, anywhere.</p>
<p><b>Mivtzoyim.</b> Practical campaigns, like tefillin, candles, and mezuzah, based on the idea that one mitzvah, even by someone who keeps nothing else, has infinite value.</p>
<p><b>Moshiach.</b> The belief in Moshiach is one of the Rambam's 13 principles, and the Rambam gives the laws in Hilchos Melachim ch. 11 to 12. The Rebbe made the anticipation of Moshiach urgent and practical: add in acts of goodness and kindness, learn about Moshiach and the redemption, and live now in a way that anticipates it. In 1991 (28 Nissan 5751) he told his chassidim that he had done all he could, and that they must now do all they can to bring Moshiach.</p>
<p><b>A note.</b> Chabad chassidim differ in how they speak about the Rebbe and Moshiach. You'll hear different views at farbrengens. Talk it through with Zalmy or your mashpia rather than picking up slogans you don't understand.</p>`,
    terms: [
      { t: "Dirah b'tachtonim", h: "דירה בתחתונים", m: "\"A dwelling in the lowest realms\": the purpose of creation" },
      { t: "Shliach (pl. shluchim)", h: "שליח", m: "An emissary of the Rebbe" },
      { t: "Shlichus", h: "שליחות", m: "The mission of an emissary" },
      { t: "Mivtzoyim", h: "מבצעים", m: "Mitzvah campaigns" },
      { t: "Geulah", h: "גאולה", m: "Redemption" },
      { t: "Moshiach", h: "משיח", m: "The anointed Jewish king who will bring the final redemption" }
    ],
    source: "Midrash Tanchuma, Naso 16; Tanya ch. 36; Rambam, Hilchos Melachim ch. 11 to 12; sicha of 28 Nissan 5751",
    doToday: "Find the Chabad house nearest your home in Palo Alto, and your business's area, on chabad.org. Save the shliach's name. That's your future contact back home.",
    quiz: [
      { id: "m1-10-q1", t: "mc", q: "\"Dirah b'tachtonim\" is sourced in:", o: ["Midrash Tanchuma, and explained in Tanya ch. 36", "The Rambam", "The Zohar only", "The Rebbe's sichos only"], a: 0, x: "Tanchuma, Naso 16; Tanya ch. 36." },
      { id: "m1-10-q2", t: "recall", q: "What is the purpose of creation according to Chassidus?", model: "Hashem desired a dwelling place in the lowest realm: this physical world, made His home through Torah and mitzvos.", x: "Not escape from the physical, but transformation of it." },
      { id: "m1-10-q3", t: "mc", q: "Where does the Rambam give the laws of Moshiach?", o: ["Hilchos Melachim ch. 11 to 12", "Hilchos Deos", "Hilchos Teshuvah ch. 1", "Hilchos Tefillah"], a: 0, x: "Hilchos Melachim, the end of Mishneh Torah." },
      { id: "m1-10-q4", t: "tf", q: "According to the Rebbe, only official shluchim have a shlichus.", a: false, x: "False. Every Jew is a shliach in his own environment." },
      { id: "m1-10-q5", t: "mc", q: "What did the Rebbe say on 28 Nissan 5751 (1991)?", o: ["That he'd done all he could, and chassidim must now do all they can to bring Moshiach", "That Moshiach had arrived", "That shlichus was complete", "That he was retiring"], a: 0, x: "A pivotal sicha." }
    ],
    deeper: [
      { id: "m1-10-d1", t: "recall", q: "How does dirah b'tachtonim apply to running a car detailing business?", model: "The business is part of the lower realm. Running it with honesty, keeping Shabbos boundaries, giving maaser, and treating customers and Ari decently make it part of Hashem's home rather than neutral ground.", x: "Chassidus doesn't separate \"religious life\" from \"work life\"." }
    ],
    reflect: "Who is in your environment that only you can reach: friends from Palo Alto, customers, Ari? What would being a shliach to them look like, without being preachy?",
    sayIt: { phrase: "It's all about a dirah b'tachtonim.", h: "דירה בתחתונים", meaning: "Making the physical world a home for Hashem.", when: "When someone asks why a Chassid cares about business, the gym, or eating well." }
  }
]);
