/* Module 2: Daily Routine and Davening */
CP_LESSONS("m2", [
  {
    id: "m2-1", title: "Modeh Ani and negel vasser", minutes: 5, intro: true,
    teach: `
<p><b>Modeh Ani.</b> The first words of the day, said the moment you wake up, even before washing: "Modeh ani lefanecha, Melech chai v'kayam, shehechezarta bi nishmasi b'chemla, rabbah emunasecha." (I thank You, living and eternal King, for returning my soul to me with compassion; great is Your faithfulness.) It contains no name of Hashem, so it may be said before washing.</p>
<p><b>Why first.</b> The Frierdiker Rebbe (Hayom Yom) explains that Modeh Ani comes before any understanding: it's a thank-you from the essence of the soul, even before the mind wakes up. It sets the day's tone as kabbalas ol, accepting Hashem, before anything else.</p>
<p><b>Negel vasser</b> (Yiddish: "nail water"). On waking, you wash your hands from a cup: <b>right, left, right, left, right, left</b>, three times each, alternating. Chabad keeps a cup and basin next to the bed so you wash before walking four amos. The reasons (Shulchan Aruch, Orach Chaim 4):</p>
<ul>
<li>To remove the <i>ruach ra'ah</i> (impurity) that rests on the hands after sleep.</li>
<li>To prepare for davening, like a kohen washing before his service.</li>
</ul>
<p>Don't touch your eyes, mouth, or food before washing.</p>
<p><b>The bracha.</b> The bracha <i>al netilas yadayim</i> is part of the morning brachos. The common Chabad practice is to say it after using the washroom and washing again, together with asher yatzar. Ask Zalmy to show you the order in the Siddur.</p>`,
    terms: [
      { t: "Modeh Ani", h: "מודה אני", m: "\"I thank\": the first words on waking" },
      { t: "Negel vasser", h: "נעגל וואסער", m: "Yiddish: the morning hand-washing" },
      { t: "Ruach ra'ah", h: "רוח רעה", m: "Spiritual impurity resting on the hands after sleep" },
      { t: "Kabbalas ol", h: "קבלת עול", m: "Accepting the yoke of Heaven" },
      { t: "Daled amos", h: "ד׳ אמות", m: "Four cubits" }
    ],
    source: "Shulchan Aruch, Orach Chaim 1, 4; Shulchan Aruch HaRav, Orach Chaim 1, 4; Hayom Yom (on Modeh Ani)",
    doToday: "Tonight, set a cup and basin next to your bed. Tomorrow: Modeh Ani, then wash before your feet hit the floor.",
    quiz: [
      { id: "m2-1-q1", t: "mc", q: "Why can Modeh Ani be said before washing your hands?", o: ["It has no name of Hashem", "It's not a prayer", "It's a Chabad custom", "It's said in bed"], a: 0, x: "No Divine name." },
      { id: "m2-1-q2", t: "recall", q: "Give the order of negel vasser.", model: "Right, left, alternating, three times each (six pours in total).", x: "With a cup, next to the bed." },
      { id: "m2-1-q3", t: "mc", q: "One reason for negel vasser:", o: ["To remove the ruach ra'ah on the hands after sleep", "Hygiene only", "For Kiddush", "To prepare for eating bread"], a: 0, x: "Also to prepare for davening like a kohen." },
      { id: "m2-1-q4", t: "tf", q: "Chabad keeps negel vasser next to the bed.", a: true, x: "True, so you wash before walking four amos." },
      { id: "m2-1-q5", t: "mc", q: "Modeh Ani thanks Hashem for:", o: ["Returning your soul", "Food", "Shabbos", "The Torah"], a: 0, x: "\"Shehechezarta bi nishmasi.\"" },
      { id: "m2-1-q6", t: "tf", q: "It's fine to touch your eyes before negel vasser.", a: false, x: "False. Avoid touching eyes, mouth, and food before washing." }
    ],
    deeper: [
      { id: "m2-1-d1", t: "recall", q: "Why does Modeh Ani come before any understanding, according to Hayom Yom?", model: "It comes from the soul's essence, which is awake even before the intellect. It expresses kabbalas ol and thanks that don't depend on understanding.", x: "This is why it's said immediately, even half-asleep." }
    ],
    reflect: "What's the first thing you do on waking now? Your phone? What would changing the first 30 seconds of your day do?",
    sayIt: { phrase: "Negel vasser.", h: "נעגל וואסער", meaning: "The morning hand-washing.", when: "In a dorm when someone asks what the cup by your bed is for." }
  },
  {
    id: "m2-2", title: "Tefillin: Chabad details", minutes: 5, intro: false,
    teach: `
<p><b>The mitzvah.</b> "Bind them as a sign on your arm, and as totafos between your eyes" (Devarim 6:8). The shel yad goes on the arm, facing the heart; the shel rosh on the head, above the hairline. Together they bind your mind and heart to Hashem.</p>
<p><b>Order.</b></p>
<ol>
<li>Tzitzis on first. (A married man puts on the tallis gadol before tefillin. Chabad bochurim don't wear a tallis gadol until marriage.)</li>
<li>Then the shel yad on the <b>weaker</b> arm (the left for a righty), on the biceps muscle, tilted toward the heart.</li>
<li>Say the bracha, then tighten the knot, and wrap seven times around the forearm.</li>
<li>Then put on the shel rosh without speaking in between.</li>
<li>Then finish the wraps on the hand.</li>
</ol>
<p><b>Chabad specifics.</b></p>
<ul>
<li><b>One bracha</b>, <i>l'haniach tefillin</i>, on the shel yad, covering both. <span class="diff">Difference: Ashkenazim who follow the Rema say a second bracha, "al mitzvas tefillin", on the shel rosh.</span> If you did interrupt between them (for example, by talking), Chabad practice is to say "al mitzvas tefillin" on the shel rosh. Ask Zalmy.</li>
<li><b>Wrapping:</b> customs differ on the direction of the wraps. Have Zalmy show you the Chabad way in person.</li>
<li><b>Knot and script:</b> Chabad tefillin have a specific knot, and are written in <i>Ksav Admor HaZaken</i>, the Alter Rebbe's script.</li>
<li><b>Covering:</b> the shel yad is covered by your sleeve.</li>
</ul>
<p><b>Checking.</b> Tefillin should be checked by a sofer periodically. Chabad practice is at least once a year, commonly in Elul, and immediately if they get wet or damaged. Keep the straps black side out.</p>
<p><b>Mivtza tefillin.</b> The Rebbe launched the tefillin campaign in 1967, right before the Six Day War, citing the Gemara that tefillin inspire fear in enemies (Menachos 35b, on Devarim 28:10).</p>`,
    terms: [
      { t: "Shel yad / shel rosh", h: "של יד / של ראש", m: "The arm tefillin / the head tefillin" },
      { t: "L'haniach tefillin", h: "להניח תפילין", m: "The bracha on putting on tefillin" },
      { t: "Ksav Admor HaZaken", h: "כתב אדמו״ר הזקן", m: "The Alter Rebbe's script used by Chabad sofrim" },
      { t: "Sofer", h: "סופר", m: "A scribe" },
      { t: "Retzuos", h: "רצועות", m: "The leather straps" },
      { t: "Mivtza tefillin", h: "מבצע תפילין", m: "The tefillin campaign" }
    ],
    source: "Devarim 6:8; Menachos 35b to 36a; Shulchan Aruch, Orach Chaim 25 to 27; Shulchan Aruch HaRav, Orach Chaim 25; Siddur Admor HaZaken",
    doToday: "Tomorrow, put on tefillin paying attention to three details: one bracha, tighten after the bracha, no talking between shel yad and shel rosh. Ask Zalmy to check your wrapping.",
    quiz: [
      { id: "m2-2-q1", t: "mc", q: "How many brachos does Chabad say on tefillin?", o: ["One: l'haniach tefillin", "Two", "None", "Three"], a: 0, x: "Per the Alter Rebbe's siddur." },
      { id: "m2-2-q2", t: "mc", q: "You talked between the shel yad and the shel rosh. Chabad practice on the shel rosh:", o: ["Say \"al mitzvas tefillin\"", "Take off the shel yad and start over", "No bracha at all", "Say l'haniach again"], a: 0, x: "Normally no bracha on the shel rosh; after an interruption, al mitzvas tefillin. Confirm with Zalmy." },
      { id: "m2-2-q3", t: "mc", q: "The shel yad goes on:", o: ["The weaker arm, on the biceps, toward the heart", "The stronger arm", "The wrist", "Either arm"], a: 0, x: "For a righty, the left arm." },
      { id: "m2-2-q4", t: "tf", q: "You may talk between putting on the shel yad and the shel rosh if it's quick.", a: false, x: "False. No interruption between them." },
      { id: "m2-2-q5", t: "mc", q: "When did the Rebbe launch mivtza tefillin?", o: ["1967, before the Six Day War", "1951", "1994", "1940"], a: 0, x: "Citing Menachos 35b." },
      { id: "m2-2-q6", t: "mc", q: "Chabad commonly checks tefillin:", o: ["At least once a year, commonly in Elul", "Never", "Every 10 years", "Only at bar mitzvah"], a: 0, x: "And if they get wet or damaged." }
    ],
    deeper: [
      { id: "m2-2-d1", t: "recall", q: "Why is the shel yad put on before the shel rosh, and removed after it?", model: "The verse mentions the arm first (\"bind them on your arm... and between your eyes\"), so it goes on first. It's removed last so the shel rosh is never worn without the shel yad, and the verse's order is honored.", x: "Menachos 36a; SA 25, 28." }
    ],
    reflect: "You put on tefillin every day. What do you think about during those few minutes? What could you think about?",
    sayIt: { phrase: "Did you put on tefillin today?", h: "", meaning: "The classic mivtzoyim question.", when: "On mivtzoyim, or with a friend back home. Friendly, never pushy." }
  },
  {
    id: "m2-3", title: "Rabbeinu Tam tefillin", minutes: 5, intro: false,
    teach: `
<p><b>The dispute.</b> Tefillin contain four Torah passages (parshiyos): Kadesh, V'haya ki yeviacha, Shema, and V'haya im shamoa. Rashi and his grandson Rabbeinu Tam disagree about the order they're placed in:</p>
<ul>
<li><b>Rashi:</b> in Torah order, so the last two are Shema, then V'haya im shamoa.</li>
<li><b>Rabbeinu Tam:</b> switches the last two, so V'haya im shamoa comes before Shema.</li>
</ul>
<p>The halacha follows Rashi, and that's the tefillin you wear with the bracha.</p>
<p><b>Why wear both.</b> The Shulchan Aruch (34:2) says that a person known for piety should also put on Rabbeinu Tam tefillin, to fulfill both opinions. The Arizal explains that both are true in Kabbalistic terms, corresponding to different spiritual levels.</p>
<p><b>Chabad practice.</b> Chabad chassidim wear Rabbeinu Tam tefillin every weekday from bar mitzvah, after Rashi tefillin, toward the end of Shacharis, without a bracha. While wearing them, it's customary to say Shema and the passages of Kadesh and V'haya ki yeviacha. The Rebbe encouraged every bochur to wear them.</p>
<p><b>If you don't have them yet.</b> This is a good conversation for Zalmy. Rabbeinu Tam tefillin are a real expense, and Mayanot may have a pair to lend while you arrange your own.</p>`,
    terms: [
      { t: "Rabbeinu Tam", h: "רבינו תם", m: "Rashi's grandson (12th century), a leading Tosafist" },
      { t: "Parshiyos", h: "פרשיות", m: "The Torah passages inside tefillin" },
      { t: "Kadesh", h: "קדש", m: "The passage from Shemos 13:1 to 10" },
      { t: "Tefillin d'Rabbeinu Tam", h: "תפילין דרבינו תם", m: "Tefillin with Rabbeinu Tam's order" }
    ],
    source: "Menachos 34b with Rashi and Tosafos; Shulchan Aruch, Orach Chaim 34; Shulchan Aruch HaRav, Orach Chaim 34; Sefer HaMinhagim",
    doToday: "Ask Zalmy: \"Should I be wearing Rabbeinu Tam? Can I borrow a pair?\"",
    quiz: [
      { id: "m2-3-q1", t: "mc", q: "Rashi and Rabbeinu Tam disagree about:", o: ["The order of the parshiyos inside tefillin", "The color of the straps", "The size of the boxes", "Which arm"], a: 0, x: "The order of the last two parshiyos." },
      { id: "m2-3-q2", t: "tf", q: "Chabad makes a bracha on Rabbeinu Tam tefillin.", a: false, x: "False. No bracha." },
      { id: "m2-3-q3", t: "mc", q: "From what age does Chabad wear Rabbeinu Tam?", o: ["Bar mitzvah", "Marriage", "Age 40", "Only rabbis"], a: 0, x: "The Rebbe encouraged it for every bochur." },
      { id: "m2-3-q4", t: "recall", q: "How many parshiyos are in tefillin, and what are they?", model: "Four: Kadesh, V'haya ki yeviacha, Shema, V'haya im shamoa.", x: "Shemos 13 and Devarim 6, 11." },
      { id: "m2-3-q5", t: "mc", q: "Which is the halachically primary tefillin?", o: ["Rashi", "Rabbeinu Tam", "Both equally", "Neither"], a: 0, x: "The bracha is on Rashi tefillin." }
    ],
    deeper: [
      { id: "m2-3-d1", t: "recall", q: "Why can't you just wear both pairs at the same time?", model: "Poskim discuss this: there's only room for one pair in the proper place, and the Shulchan Aruch describes wearing them consecutively. (Some do wear both simultaneously; Chabad wears them one after the other.)", x: "SA 34:2 to 3." }
    ],
    reflect: "Taking on Rabbeinu Tam is a concrete step deeper into Chabad practice. What's your gut reaction?",
    sayIt: { phrase: "Did you put on Rabbeinu Tam?", h: "רבינו תם", meaning: "Have you worn your Rabbeinu Tam tefillin today?", when: "At the end of Shacharis in yeshiva. Very normal." }
  },
  {
    id: "m2-4", title: "Birchos HaShachar", minutes: 5, intro: false,
    teach: `
<p><b>What they are.</b> A series of brachos thanking Hashem for the basics of waking up (Berachos 60b). Originally, each was said as you experienced it:</p>
<ul>
<li>Opening your eyes: <i>pokei'ach ivrim</i>.</li>
<li>Standing up: <i>zokeif kefufim</i>.</li>
<li>Getting dressed: <i>malbish arumim</i>.</li>
</ul>
<p>Today we say them together at the start of davening.</p>
<p><b>What's included.</b></p>
<ul>
<li><b>Al netilas yadayim</b> and <b>asher yatzar</b>.</li>
<li><b>Elokai neshama:</b> the soul Hashem gave you is pure.</li>
<li><b>Birchos HaTorah:</b> the brachos on learning Torah. These must be said before any Torah learning in the morning, even thinking in words of Torah.</li>
<li>The series of morning thanks, including the three identity brachos: "shelo asani goy", "shelo asani aved", "shelo asani isha".</li>
</ul>
<p><b>Chabad.</b> In the Alter Rebbe's siddur they follow a specific order. Bochurim at Mayanot typically say them in shul, or before coming, and answer amen to each other. Answering amen to someone else's Birchos HaShachar is a practice many encourage.</p>
<p><b>Tallis katan.</b> Chabad bochurim don't wear a tallis gadol until marriage, so you say the bracha on your tallis katan (tzitzis) in the morning. A married man says it on the tallis gadol and has the tallis katan in mind. Ask Zalmy for the exact wording and timing.</p>`,
    terms: [
      { t: "Birchos HaShachar", h: "ברכות השחר", m: "The morning brachos" },
      { t: "Birchos HaTorah", h: "ברכות התורה", m: "The brachos on Torah learning" },
      { t: "Elokai neshama", h: "אלקי נשמה", m: "\"My G-d, the soul...\": the bracha on the soul's purity" },
      { t: "Tallis katan", h: "טלית קטן", m: "The small tzitzis garment" }
    ],
    source: "Berachos 60b; Shulchan Aruch, Orach Chaim 46, 47; Siddur Admor HaZaken",
    doToday: "Tomorrow, say Birchos HaShachar slowly, translating the meaning of each in your head. Notice which ones you've never thought about.",
    quiz: [
      { id: "m2-4-q1", t: "mc", q: "Birchos HaShachar were originally said:", o: ["Each at the moment you experienced it", "All at night", "Only in shul", "Only on Shabbos"], a: 0, x: "Berachos 60b." },
      { id: "m2-4-q2", t: "tf", q: "You may learn Torah in the morning before saying Birchos HaTorah.", a: false, x: "False. Birchos HaTorah come first." },
      { id: "m2-4-q3", t: "mc", q: "\"Pokei'ach ivrim\" thanks Hashem for:", o: ["Opening the eyes", "Standing up", "Clothing", "Food"], a: 0, x: "\"Who opens the eyes of the blind.\"" },
      { id: "m2-4-q4", t: "recall", q: "What is Elokai neshama about?", model: "Thanks that the soul Hashem gave us is pure, that He created it, breathed it into us, guards it, and will return it.", x: "Said right after asher yatzar." },
      { id: "m2-4-q5", t: "mc", q: "Asher yatzar is said:", o: ["After using the bathroom", "Before eating", "At night only", "On Shabbos"], a: 0, x: "And in Birchos HaShachar." }
    ],
    deeper: [
      { id: "m2-4-d1", t: "recall", q: "Why do Birchos HaTorah cover learning for the whole day?", model: "They're said once in the morning on the mitzvah of Torah study, which is ongoing. Since a Jew is always \"in\" learning (you intend to return to it), there's no break until sleep.", x: "SA 47." }
    ],
    reflect: "Birchos HaShachar thank Hashem for things you take for granted. What in your body or life do you never thank anyone for?",
    sayIt: { phrase: "Did you say Birchos HaTorah?", h: "ברכות התורה", meaning: "A reminder before learning in the morning.", when: "When a friend starts learning in the morning before davening." }
  },
  {
    id: "m2-5", title: "Karbanos", minutes: 5, intro: false,
    teach: `
<p><b>"Hareini mekabel."</b> Chabad begins Shacharis with: "Hareini mekabel alai mitzvas asei shel v'ahavta l'reiacha kamocha": I accept upon myself the mitzvah of loving your fellow as yourself. This follows the Arizal. You start davening by joining yourself to every Jew.</p>
<p><b>Tzedakah.</b> Chabad custom is to give tzedakah before Shacharis on weekdays, following Rabbi Elazar, who gave a coin to a poor person and then davened (Bava Basra 10a).</p>
<p><b>Karbanos.</b> Passages about the Temple offerings:</p>
<ul>
<li><b>The Tamid:</b> the daily offering.</li>
<li><b>The Ketores:</b> the incense.</li>
<li><b>Eizehu mekoman:</b> the Mishnah on where each korban was offered.</li>
<li><b>Rabbi Yishmael's 13 principles</b> of interpreting Torah.</li>
</ul>
<p>Why? The Gemara (Menachos 110a) says that one who studies the laws of the offerings is considered as if he brought them. Our tefillos were established in place of the korbanos (Berachos 26b).</p>
<p><b>The Chassidic idea.</b> <i>Korban</i> comes from <i>karov</i>, closeness. The real korban is the animal soul: bringing your drives and energy close to Hashem. That's the Alter Rebbe's reading of "adam ki yakriv mikem korban" (Vayikra 1:2): a person who brings himself close offers "from you", from within.</p>
<p><b>Time.</b> If you're short on time, there are parts you can skip and parts you must not. Ask Zalmy for the priorities.</p>`,
    terms: [
      { t: "Karbanos", h: "קרבנות", m: "Offerings" },
      { t: "Hareini mekabel", h: "הריני מקבל", m: "\"I hereby accept\": the declaration of ahavas Yisrael before davening" },
      { t: "Korban Tamid", h: "קרבן תמיד", m: "The daily offering" },
      { t: "Ketores", h: "קטורת", m: "Incense" },
      { t: "Karov", h: "קרוב", m: "Close" }
    ],
    source: "Berachos 26b; Menachos 110a; Bava Basra 10a; Vayikra 1:2; Siddur Admor HaZaken; Likkutei Torah on Vayikra",
    doToday: "Say \"Hareini mekabel\" tomorrow and think of one specific Jew you find hard to love as you say it. Give a coin to tzedakah before Shacharis.",
    quiz: [
      { id: "m2-5-q1", t: "recall", q: "What do Chabad chassidim say at the very start of Shacharis?", model: "\"Hareini mekabel alai mitzvas asei shel v'ahavta l'reiacha kamocha\": accepting the mitzvah of loving your fellow as yourself.", x: "Following the Arizal." },
      { id: "m2-5-q2", t: "mc", q: "Why give tzedakah before davening?", o: ["Rabbi Elazar did so (Bava Basra 10a)", "To pay for the shul", "It's a Shabbos rule", "No reason"], a: 0, x: "Chabad weekday custom." },
      { id: "m2-5-q3", t: "mc", q: "Why say karbanos?", o: ["Learning about them is considered as if we brought them", "They're Chabad-only", "For the kohanim only", "Tradition without reason"], a: 0, x: "Menachos 110a." },
      { id: "m2-5-q4", t: "mc", q: "The word korban comes from:", o: ["Karov: close", "Keren: horn", "Kerev: battle", "Kar: cold"], a: 0, x: "Drawing close." },
      { id: "m2-5-q5", t: "tf", q: "Our tefillos were instituted in place of the korbanos.", a: true, x: "True, one of the views in Berachos 26b." }
    ],
    deeper: [
      { id: "m2-5-d1", t: "recall", q: "Explain the Alter Rebbe's reading of \"adam ki yakriv mikem korban\".", model: "The verse literally says \"a man who brings from you an offering\". Chassidus reads it: to become close, bring the offering from yourself, meaning your animal soul and its energies, dedicated to Hashem.", x: "Likkutei Torah, Vayikra." }
    ],
    reflect: "Ahavas Yisrael before davening. Who's the hardest person for you to love right now? What would one small kindness to him look like?",
    sayIt: { phrase: "Hareini mekabel.", h: "הריני מקבל", meaning: "The declaration of loving every Jew, said before davening.", when: "When explaining how Chabad starts the day. It's a beautiful answer." }
  },
  {
    id: "m2-6", title: "Pesukei D'zimra", minutes: 5, intro: false,
    teach: `
<p><b>What it is.</b> "Verses of praise": the section from Hodu and Baruch She'amar through Yishtabach. The Gemara teaches that a person should first praise Hashem and then pray for his needs (Berachos 32a). Pesukei D'zimra is that praise.</p>
<p><b>The structure.</b></p>
<ol>
<li><b>Hodu:</b> from Divrei HaYamim, the song when the Aron was brought to Yerushalayim. <span class="diff">In Nusach Ari (Chabad) and Nusach Sefard, Hodu comes before Baruch She'amar. In Nusach Ashkenaz it comes after.</span></li>
<li><b>Baruch She'amar:</b> the opening bracha.</li>
<li><b>Ashrei</b> (Tehillim 145) and the five "Halleluyah" chapters (Tehillim 146 to 150).</li>
<li><b>Vayevarech David</b>, and <b>Az Yashir</b>, the Song at the Sea.</li>
<li><b>Yishtabach:</b> the closing bracha.</li>
</ol>
<p><b>No talking</b> from Baruch She'amar until after the Amidah, apart from certain responses. This section is a unit.</p>
<p><b>Ashrei.</b> The Gemara says one who says Tehillim 145 three times daily is assured of the World to Come (Berachos 4b), because it's an alphabetical praise that includes "poseach es yadecha", Hashem providing for all. Concentrate on that verse. The Shulchan Aruch (51:7) says that if you didn't concentrate on it, you should repeat it.</p>
<p><b>Why praise first.</b> Chassidus explains that praise builds awareness of Hashem's greatness. That's the hisbonenus that makes the Shema and the Amidah real.</p>`,
    terms: [
      { t: "Pesukei D'zimra", h: "פסוקי דזמרה", m: "Verses of praise" },
      { t: "Baruch She'amar", h: "ברוך שאמר", m: "The opening bracha of Pesukei D'zimra" },
      { t: "Yishtabach", h: "ישתבח", m: "The closing bracha of Pesukei D'zimra" },
      { t: "Ashrei", h: "אשרי", m: "Tehillim 145 (with an opening verse)" },
      { t: "Az Yashir", h: "אז ישיר", m: "The Song at the Sea (Shemos 15)" },
      { t: "Poseach es yadecha", h: "פותח את ידך", m: "\"You open Your hand\": the key verse of Ashrei" }
    ],
    source: "Berachos 4b, 32a; Shulchan Aruch, Orach Chaim 51, 53; Siddur Admor HaZaken",
    doToday: "Tomorrow in Ashrei, stop at \"poseach es yadecha\" and think for one second that your parnassah is from Hashem.",
    quiz: [
      { id: "m2-6-q1", t: "mc", q: "Why do we praise before we pray?", o: ["The Gemara teaches praise first, then requests (Berachos 32a)", "To fill time", "Chabad custom only", "For the chazzan"], a: 0, x: "Like approaching a king." },
      { id: "m2-6-q2", t: "mc", q: "In Nusach Ari, Hodu is said:", o: ["Before Baruch She'amar", "After Baruch She'amar", "At Mincha only", "Not at all"], a: 0, x: "Ashkenaz has it after." },
      { id: "m2-6-q3", t: "tf", q: "You may chat between Baruch She'amar and Yishtabach if it's brief.", a: false, x: "False. No talking in Pesukei D'zimra." },
      { id: "m2-6-q4", t: "mc", q: "The key verse to concentrate on in Ashrei:", o: ["Poseach es yadecha", "Ashrei yoshvei veisecha", "Tehilas Hashem", "Karov Hashem"], a: 0, x: "SA 51:7." },
      { id: "m2-6-q5", t: "recall", q: "What are the opening and closing brachos of Pesukei D'zimra?", model: "Baruch She'amar and Yishtabach.", x: "They frame the section." },
      { id: "m2-6-q6", t: "mc", q: "Az Yashir is:", o: ["The Song at the Sea", "Tehillim 145", "A Chabad niggun", "Kaddish"], a: 0, x: "Shemos 15." }
    ],
    deeper: [
      { id: "m2-6-d1", t: "recall", q: "Why is Ashrei singled out (Berachos 4b)?", model: "It's alphabetical (a complete praise) and it contains \"poseach es yadecha\", praising Hashem's provision for every living being.", x: "Both qualities together." }
    ],
    reflect: "You worry about parnassah as a business owner. Poseach es yadecha is said three times a day. How would it feel to actually mean it?",
    sayIt: { phrase: "Pesukei D'zimra is the warmup.", h: "", meaning: "Praise first builds the awareness for the main prayer.", when: "When someone asks why davening is so long before the Amidah." }
  },
  {
    id: "m2-7", title: "Shema and its brachos", minutes: 5, intro: false,
    teach: `
<p><b>Barchu</b> is the call to prayer with a minyan. After it come the brachos of Shema.</p>
<p><b>Before Shema (two brachos).</b></p>
<ul>
<li><b>Yotzer Or:</b> Hashem renews creation daily. It includes the angels' praise, "Kadosh, kadosh, kadosh".</li>
<li><b>Ahavah Rabbah:</b> Hashem's love for Israel, shown in giving the Torah. We ask to understand it.</li>
</ul>
<p><b>Shema (three paragraphs).</b></p>
<ul>
<li><b>Shema Yisrael and V'ahavta:</b> accepting Hashem's kingship (kabbalas ol malchus shamayim) and loving Him.</li>
<li><b>V'haya im shamoa:</b> accepting the mitzvos.</li>
<li><b>Vayomer:</b> tzitzis, and remembering the Exodus.</li>
</ul>
<p>Cover your eyes with your right hand for the first verse. Say "Baruch shem kevod malchuso l'olam va'ed" quietly.</p>
<p><b>After Shema.</b> <b>Emes v'yatziv</b>, ending with "Ga'al Yisrael". There's no interruption between "Ga'al Yisrael" and the Amidah (<i>semichas geulah l'tefillah</i>).</p>
<p><b>The time.</b> Shema must be said by the end of the third halachic hour of the day. Chabad calendars list the time according to the Alter Rebbe's ruling. Check a Chabad luach, since in some seasons this deadline is early.</p>
<p><b>The Chassidus.</b> "Hashem echad": not just that there's one G-d, but that nothing exists apart from Him. That's the hisbonenus of Shema.</p>`,
    terms: [
      { t: "Barchu", h: "ברכו", m: "The call to prayer" },
      { t: "Kabbalas ol malchus shamayim", h: "קבלת עול מלכות שמים", m: "Accepting the yoke of Heaven's kingship" },
      { t: "Semichas geulah l'tefillah", h: "סמיכת גאולה לתפלה", m: "Joining \"Ga'al Yisrael\" directly to the Amidah" },
      { t: "Sof zman kriyas Shema", h: "סוף זמן קריאת שמע", m: "The deadline for morning Shema" },
      { t: "Baruch shem", h: "ברוך שם", m: "The line said quietly after the first verse of Shema" }
    ],
    source: "Devarim 6:4 to 9, 11:13 to 21; Bamidbar 15:37 to 41; Berachos 11b to 14b; Shulchan Aruch, Orach Chaim 58 to 66; Tanya, Shaar HaYichud VehaEmunah",
    doToday: "Look up today's \"sof zman kriyas Shema\" on a Chabad luach (chabad.org has one) and note it. Are you making it?",
    quiz: [
      { id: "m2-7-q1", t: "recall", q: "Name the two brachos before the morning Shema.", model: "Yotzer Or and Ahavah Rabbah.", x: "Emes v'yatziv follows." },
      { id: "m2-7-q2", t: "mc", q: "What must not be interrupted?", o: ["Between Ga'al Yisrael and the Amidah", "Between Barchu and Yotzer Or", "Between Ashrei and Kaddish", "Between Hodu and Baruch She'amar"], a: 0, x: "Semichas geulah l'tefillah." },
      { id: "m2-7-q3", t: "mc", q: "Baruch shem is said:", o: ["Quietly", "Aloud", "Aloud every day", "Not at all"], a: 0, x: "Quietly all year; aloud on Yom Kippur." },
      { id: "m2-7-q4", t: "mc", q: "The first paragraph of Shema is about:", o: ["Accepting Hashem's kingship and loving Him", "Tzitzis", "Rain", "The Exodus"], a: 0, x: "Kabbalas ol malchus shamayim." },
      { id: "m2-7-q5", t: "tf", q: "Morning Shema can be said any time before noon.", a: false, x: "False. By the end of the third halachic hour. Check a Chabad luach." },
      { id: "m2-7-q6", t: "mc", q: "Why cover the eyes for the first verse?", o: ["To concentrate without distraction", "Chabad-only custom", "For the kohanim", "It's optional decoration"], a: 0, x: "SA 61:5." }
    ],
    deeper: [
      { id: "m2-7-d1", t: "recall", q: "What does \"Hashem echad\" mean according to Chassidus (Shaar HaYichud VehaEmunah)?", model: "Not merely that there's one G-d, but that there is nothing besides Him: all existence is continuously created by Him and is nullified within Him.", x: "Tanya, Shaar HaYichud VehaEmunah ch. 1 to 7." }
    ],
    reflect: "Do you make the Shema deadline every day? If not, what in your morning would need to change?",
    sayIt: { phrase: "Did you make zman Shema?", h: "זמן קריאת שמע", meaning: "Did you say Shema by its deadline?", when: "On a late morning in yeshiva." }
  },
  {
    id: "m2-8", title: "Shemoneh Esrei", minutes: 5, intro: false,
    teach: `
<p><b>The core of davening.</b> The Amidah (standing prayer) was composed by the Men of the Great Assembly. Originally it had 18 brachos, hence "Shemoneh Esrei"; a 19th, against heretics and informers, was added later (Berachos 28b).</p>
<p><b>The structure.</b></p>
<ul>
<li><b>3 of praise:</b> Avos, Gevuros, Kedushas Hashem.</li>
<li><b>13 of requests:</b> understanding, teshuvah, forgiveness, redemption, healing, prosperity (Barech Aleinu), gathering of exiles, justice, against heretics, for the righteous, rebuilding Yerushalayim, Moshiach, and accepting our prayer.</li>
<li><b>3 of thanks:</b> Retzeh, Modim, and Sim Shalom.</li>
</ul>
<p><b>How to stand.</b></p>
<ul>
<li>Feet together, like angels.</li>
<li>Face toward Yerushalayim. In Jerusalem that means toward the Beis HaMikdash.</li>
<li>Take three steps forward before you start, and three steps back at the end.</li>
<li>Bow at the beginning and end of Avos and Modim.</li>
<li>Say it quietly, but move your lips so you hear yourself.</li>
</ul>
<p><b>Additions.</b> Mashiv haruach (winter), v'sein tal umatar (the rainy season), ya'aleh v'yavo (Rosh Chodesh and festivals), al hanissim (Chanukah and Purim). Know what to do if you forget one: some you go back for, and some you don't. Check a halacha summary or ask.</p>
<p><b>Personal requests.</b> You can add your own words in the relevant bracha. For example, in Barech Aleinu, ask for the business's success in your own words.</p>`,
    terms: [
      { t: "Amidah", h: "עמידה", m: "The standing prayer" },
      { t: "Shemoneh Esrei", h: "שמונה עשרה", m: "\"Eighteen\": the Amidah's name" },
      { t: "Chazaras hashatz", h: "חזרת הש״ץ", m: "The chazzan's repetition" },
      { t: "Anshei Knesses HaGedolah", h: "אנשי כנסת הגדולה", m: "The Men of the Great Assembly" },
      { t: "Barech Aleinu", h: "ברך עלינו", m: "The bracha for prosperity" }
    ],
    source: "Berachos 26b, 28b, 31a to 34b; Shulchan Aruch, Orach Chaim 95 to 123; Siddur Admor HaZaken",
    doToday: "Tomorrow, in Barech Aleinu, add one sentence in your own words for the business.",
    quiz: [
      { id: "m2-8-q1", t: "recall", q: "How is the Amidah structured?", model: "3 brachos of praise, 13 of requests, 3 of thanks (19 total).", x: "Originally 18." },
      { id: "m2-8-q2", t: "mc", q: "The bracha for prosperity is:", o: ["Barech Aleinu", "Refa'einu", "Modim", "Atah Chonen"], a: 0, x: "Add your business request there." },
      { id: "m2-8-q3", t: "mc", q: "In Jerusalem, you face:", o: ["Toward the Beis HaMikdash", "East always", "Any direction", "Toward the Kotel only if visible"], a: 0, x: "SA 94." },
      { id: "m2-8-q4", t: "tf", q: "The Amidah should be said loudly so others hear.", a: false, x: "False. Quietly, but audible to yourself (like Chana, Berachos 31a)." },
      { id: "m2-8-q5", t: "mc", q: "Who composed the Amidah?", o: ["The Men of the Great Assembly", "Moshe", "The Rambam", "The Alter Rebbe"], a: 0, x: "Berachos 33a." },
      { id: "m2-8-q6", t: "mc", q: "Why stand with feet together?", o: ["To resemble the angels", "Balance", "Chabad custom only", "No reason"], a: 0, x: "Berachos 10b." }
    ],
    deeper: [
      { id: "m2-8-d1", t: "recall", q: "Why does praise come before requests and thanks after?", model: "Like approaching a king: first you praise him, then you present your requests, and then you thank him as you leave (Berachos 34a).", x: "A servant before his master." }
    ],
    reflect: "The Amidah is a private conversation. How often do you say anything personal in it?",
    sayIt: { phrase: "I'm still in Shemoneh Esrei.", h: "", meaning: "Said by gesture, not words: you can't talk. Friends learn to wait.", when: "Just know it: don't interrupt someone standing still with feet together." }
  },
  {
    id: "m2-9", title: "Tachanun to Aleinu", minutes: 5, intro: false,
    teach: `
<p><b>Tachanun.</b> After the Amidah on most weekdays comes <i>nefilas apayim</i>: resting your head on your arm while saying a psalm of Dovid: Tehillim 25 in Nusach Ari (Nusach Ashkenaz uses Tehillim 6). You sit, and rest your head on the arm without tefillin (on your right arm while wearing tefillin on the left). On Monday and Thursday there's a longer Tachanun (V'hu Rachum) and a Torah reading.</p>
<p><b>No Tachanun</b> on: Rosh Chodesh, all of Nissan, Chanukah, Purim and Purim Katan, Tu B'Shvat, Pesach Sheni, Lag BaOmer, from Rosh Chodesh Sivan through 12 Sivan, Tishah B'Av, Tu B'Av, from Erev Yom Kippur through the end of Tishrei, when a chosson is present, and <b>on Chabad days of redemption</b> such as Yud Tes Kislev and Yud Beis to Yud Gimmel Tammuz. Check a Chabad luach.</p>
<p><b>After Tachanun.</b></p>
<ul>
<li><b>Ashrei</b> again.</li>
<li><b>Uva L'Tzion:</b> Kedusha with translation.</li>
<li><b>Shir shel Yom:</b> the psalm the Levites sang that day of the week.</li>
<li><b>Aleinu:</b> "it is our duty to praise". It was originally composed for Rosh Hashanah, and is now said at the end of every service.</li>
</ul>
<p><b>Chabad after davening.</b> The day's Tehillim (Chitas) is customarily said after Shacharis. Many learn a short portion of Chassidus right after.</p>
<p><b>Kaddish.</b> It's said several times, by the chazzan and by mourners. Answer "Amen, yehei shmei rabbah..." with full concentration. The Gemara (Shabbos 119b) says answering it with all your strength tears up harsh decrees.</p>`,
    terms: [
      { t: "Tachanun", h: "תחנון", m: "Supplication after the Amidah" },
      { t: "Nefilas apayim", h: "נפילת אפים", m: "\"Falling on the face\": resting the head on the arm" },
      { t: "Shir shel Yom", h: "שיר של יום", m: "The psalm of the day" },
      { t: "Aleinu", h: "עלינו", m: "The closing prayer" },
      { t: "Yehei shmei rabbah", h: "יהא שמיה רבא", m: "The central response in Kaddish" }
    ],
    source: "Shabbos 119b; Shulchan Aruch, Orach Chaim 131 to 133; Siddur Admor HaZaken; Sefer HaMinhagim",
    doToday: "Answer every \"yehei shmei rabbah\" tomorrow with full attention.",
    quiz: [
      { id: "m2-9-q1", t: "mc", q: "While wearing tefillin (left arm), Tachanun is said leaning on:", o: ["The right arm", "The left arm", "No arm", "The table"], a: 0, x: "Not on the arm with tefillin." },
      { id: "m2-9-q2", t: "tf", q: "Tachanun is said on Yud Tes Kislev in Chabad.", a: false, x: "False. It's a Chabad yom tov; no Tachanun." },
      { id: "m2-9-q3", t: "mc", q: "Aleinu was originally composed for:", o: ["Rosh Hashanah", "Pesach", "Shabbos", "Weddings"], a: 0, x: "The Malchuyos section." },
      { id: "m2-9-q4", t: "mc", q: "What does answering yehei shmei rabbah with full strength do, according to the Gemara?", o: ["Tears up harsh decrees", "Ends the davening", "Honors the chazzan", "Nothing special"], a: 0, x: "Shabbos 119b." },
      { id: "m2-9-q5", t: "mc", q: "Long Tachanun (V'hu Rachum) is said on:", o: ["Monday and Thursday", "Every day", "Shabbos", "Friday"], a: 0, x: "With the Torah reading." }
    ],
    deeper: [
      { id: "m2-9-d1", t: "recall", q: "Why is Tachanun skipped when a chosson is present?", model: "The chosson's joy (his \"yom tov\") makes it inappropriate to say mournful supplication in his presence.", x: "SA 131:4." }
    ],
    reflect: "Tachanun is the most personal, humble moment of Shacharis. Do you usually rush it?",
    sayIt: { phrase: "No Tachanun today.", h: "", meaning: "The gabbai's announcement on special days.", when: "When you notice a special date on the Chabad calendar." }
  },
  {
    id: "m2-10", title: "Mincha and Maariv", minutes: 5, intro: false,
    teach: `
<p><b>Mincha.</b> The afternoon prayer, corresponding to the afternoon Tamid. The Gemara (Berachos 6b) says a person should be especially careful with Mincha, since Eliyahu was answered at Mincha. It interrupts the busy day, which is exactly the point.</p>
<ul>
<li><b>Time:</b> from half an hour after midday (<i>mincha gedolah</i>) until sunset. Chabad calendars follow the Alter Rebbe's times.</li>
<li><b>Structure:</b> Ashrei, half Kaddish, the Amidah (repeated with a minyan), Tachanun on most days, and Aleinu.</li>
</ul>
<p><b>Your business.</b> Mincha in Israel falls in the Bay Area's early morning, when messages start coming in. Guard it: phone face down, and daven first.</p>
<p><b>Maariv.</b> The evening prayer, corresponding to the burning of the parts of the korbanos at night. Its structure:</p>
<ul>
<li>Barchu.</li>
<li>Two brachos before Shema: Hashem brings evening, and Hashem's eternal love.</li>
<li>Shema.</li>
<li>Two brachos after: redemption, and Hashkiveinu, protection at night.</li>
<li>The Amidah (not repeated), then Aleinu.</li>
</ul>
<p>Maariv is said after nightfall. It was originally optional, but it has become obligatory by universal acceptance (Berachos 27b).</p>
<p><b>The three tefillos</b> correspond to the Avos (Berachos 26b): Avraham, Shacharis; Yitzchak, Mincha; Yaakov, Maariv.</p>`,
    terms: [
      { t: "Mincha", h: "מנחה", m: "The afternoon prayer" },
      { t: "Maariv / Arvis", h: "מעריב / ערבית", m: "The evening prayer" },
      { t: "Mincha gedolah", h: "מנחה גדולה", m: "The earliest time for Mincha" },
      { t: "Shkiah", h: "שקיעה", m: "Sunset" },
      { t: "Hashkiveinu", h: "השכיבנו", m: "The Maariv bracha for protection at night" }
    ],
    source: "Berachos 6b, 26b, 27b; Shulchan Aruch, Orach Chaim 232 to 237; Siddur Admor HaZaken",
    doToday: "Tomorrow, before Mincha, put your phone face down and don't check it until after Aleinu.",
    quiz: [
      { id: "m2-10-q1", t: "mc", q: "Mincha corresponds to which of the Avos?", o: ["Yitzchak", "Avraham", "Yaakov", "Moshe"], a: 0, x: "Berachos 26b." },
      { id: "m2-10-q2", t: "mc", q: "Why be especially careful with Mincha?", o: ["Eliyahu was answered at Mincha", "It's short", "It's Chabad custom", "It's at night"], a: 0, x: "Berachos 6b." },
      { id: "m2-10-q3", t: "tf", q: "The Maariv Amidah is repeated by the chazzan.", a: false, x: "False. Maariv has no repetition." },
      { id: "m2-10-q4", t: "recall", q: "Name the two brachos after Shema at Maariv.", model: "Emes v'emunah (ending Ga'al Yisrael) and Hashkiveinu.", x: "Two before and two after." },
      { id: "m2-10-q5", t: "mc", q: "Mincha must be said before:", o: ["Sunset (per the Alter Rebbe's times)", "Midnight", "Noon", "Nightfall always"], a: 0, x: "Check a Chabad luach." }
    ],
    deeper: [
      { id: "m2-10-d1", t: "recall", q: "Why is Mincha considered spiritually difficult, and therefore valuable?", model: "It falls in the middle of the working day, when a person is busiest and most absorbed in worldly matters. Stopping then to daven is harder, and so it's more significant.", x: "The Tur and others explain Berachos 6b this way." }
    ],
    reflect: "Mincha is when Palo Alto wakes up for you. What would protecting it look like concretely?",
    sayIt: { phrase: "Let me daven Mincha first.", h: "", meaning: "Putting Mincha before the business.", when: "When Ari calls around Mincha time. Call back in 15 minutes." }
  },
  {
    id: "m2-11", title: "Kriyas Shema al HaMitah and hisbonenus", minutes: 5, intro: false,
    teach: `
<p><b>Kriyas Shema al HaMitah</b> ("Shema at bedtime"). It contains:</p>
<ul>
<li><b>Forgiveness:</b> "Ribono shel olam, hareini mochel...": forgiving anyone who wronged you that day.</li>
<li><b>The first paragraph of Shema</b>, and other passages.</li>
<li><b>Hamapil:</b> the bracha on sleep.</li>
</ul>
<p>Chabad sources recommend a short nightly cheshbon hanefesh at this time: review the day honestly, regret what went wrong, and resolve to do better. Then let it go and sleep in peace.</p>
<p><b>Hisbonenus: davening with the mind.</b> Chabad's distinct approach to davening. Before and during prayer, you contemplate a Chassidic concept until it moves you. For example, "Hashem creates the world anew each moment" (Shaar HaYichud VehaEmunah ch. 1). The Rebbe Rashab's <i>Kuntres HaTefillah</i> explains how. "Avodah shebalev" (service of the heart, Taanis 2a) is reached through the mind.</p>
<p><b>How to start.</b></p>
<ol>
<li>Before Shacharis, take 2 minutes. Pick one idea from Tanya or a maamar you learned.</li>
<li>Think it through in detail (Binah), then connect it to yourself (Daas).</li>
<li>Then daven with that in mind, especially Pesukei D'zimra and Shema.</li>
</ol>
<p><b>Davening b'arichus.</b> On Shabbos especially, chassidim daven slowly and at length. It's not about length for its own sake; the time is filled with contemplation.</p>
<p><b>Be honest.</b> Most people don't feel much most days. The avodah is showing up and thinking anyway. Ask Zalmy or a mashpia for a hisbonenus to start with.</p>`,
    terms: [
      { t: "Kriyas Shema al HaMitah", h: "קריאת שמע על המטה", m: "The bedtime Shema" },
      { t: "Hamapil", h: "המפיל", m: "The bracha before sleep" },
      { t: "Hisbonenus", h: "התבוננות", m: "Contemplative meditation" },
      { t: "Avodah shebalev", h: "עבודה שבלב", m: "Service of the heart: prayer" },
      { t: "Kuntres HaTefillah", h: "קונטרס התפלה", m: "The Rebbe Rashab's work on davening" },
      { t: "Cheshbon hanefesh", h: "חשבון הנפש", m: "A spiritual self-accounting" }
    ],
    source: "Berachos 60b; Taanis 2a; Shulchan Aruch, Orach Chaim 239; Tanya, Shaar HaYichud VehaEmunah ch. 1; Kuntres HaTefillah",
    doToday: "Tonight, say Kriyas Shema al HaMitah including \"hareini mochel\". Tomorrow, 2 minutes before Shacharis on: \"Hashem is creating me and the world right now.\"",
    quiz: [
      { id: "m2-11-q1", t: "recall", q: "What are three components of Kriyas Shema al HaMitah?", model: "Forgiving others (hareini mochel), Shema, and the bracha Hamapil. Often also a cheshbon hanefesh.", x: "Plus other passages in the siddur." },
      { id: "m2-11-q2", t: "mc", q: "Hisbonenus is:", o: ["Contemplating a Chassidic idea until it moves you", "Singing loudly", "Fast davening", "Silent meditation with no content"], a: 0, x: "Chabad's approach to davening." },
      { id: "m2-11-q3", t: "mc", q: "Which work explains how to daven with hisbonenus?", o: ["Kuntres HaTefillah", "Shulchan Aruch", "Hayom Yom only", "Mishnah Berurah"], a: 0, x: "By the Rebbe Rashab." },
      { id: "m2-11-q4", t: "mc", q: "\"Avodah shebalev\" refers to:", o: ["Prayer", "Charity", "Torah study", "Fasting"], a: 0, x: "Taanis 2a." },
      { id: "m2-11-q5", t: "tf", q: "If you don't feel inspired during davening, the hisbonenus failed and you should stop.", a: false, x: "False. The avodah is to show up and think anyway." }
    ],
    deeper: [
      { id: "m2-11-d1", t: "recall", q: "Why forgive everyone before sleep?", model: "So that no one is punished on your account, and so you go to sleep with a clean heart. It's also an act of ahavas Yisrael and of humility.", x: "Found in the siddur's text." }
    ],
    reflect: "What's the last thought in your head before sleep now? What would a 2-minute cheshbon hanefesh change?",
    sayIt: { phrase: "What's your hisbonenus for davening?", h: "התבוננות", meaning: "What are you contemplating before prayer?", when: "With a friend or mashpia, when working on davening. A serious question." }
  }
]);
