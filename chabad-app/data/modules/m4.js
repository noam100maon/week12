/* Module 4: Shabbos */
CP_LESSONS("m4", [
  {
    id: "m4-1", title: "Why Shabbos: melacha and the Mishkan", minutes: 5, intro: true,
    teach: `
<p><b>Not "work" in the English sense.</b> Shabbos doesn't forbid effort. Carrying a heavy table across your room is fine, while flicking a light switch is not. The Torah forbids <i>melacha</i>: creative, constructive acts that show human mastery over the world. On Shabbos we stop creating and acknowledge that Hashem is the Creator.</p>
<p><b>The Mishkan.</b> The Torah places the command of Shabbos right next to the building of the Mishkan (Shemos 31 and 35). The Gemara (Shabbos 49b) derives that the categories of forbidden work are exactly the kinds of work used to build the Mishkan. The Mishnah (Shabbos 7:2) counts them: 39 <i>avos melacha</i> (main categories).</p>
<p><b>Key terms you'll need for every case.</b></p>
<ul>
<li><b>Av and toladah:</b> the main category, and derivative acts that share its purpose. Both are Torah prohibitions.</li>
<li><b>Meleches machsheves:</b> the Torah prohibition applies to purposeful, intended, constructive work.</li>
<li><b>Shevus:</b> rabbinic prohibitions, which protect the Shabbos atmosphere and prevent Torah violations.</li>
<li><b>Pesik reisha:</b> an unintended melacha that inevitably results from your act is still forbidden.</li>
</ul>
<p><b>Why it matters.</b> Shabbos is called an <i>os</i>, a sign between Hashem and the Jewish people (Shemos 31:17). Chassidus explains that during the week we elevate the world through work. On Shabbos the world rises by itself and we rise with it, which is why Shabbos is for Torah, davening, and delight (oneg), not just for resting.</p>
<p class="flag">This module teaches principles and common cases. For real questions, ask Zalmy or a rav.</p>`,
    terms: [
      { t: "Melacha", h: "מלאכה", m: "Creative work forbidden on Shabbos" },
      { t: "Av melacha", h: "אב מלאכה", m: "One of the 39 main categories" },
      { t: "Toladah", h: "תולדה", m: "A derivative act with the same purpose as an av" },
      { t: "Shevus", h: "שבות", m: "A rabbinic Shabbos prohibition" },
      { t: "Pesik reisha", h: "פסיק רישא", m: "An act whose forbidden result is inevitable" },
      { t: "Oneg Shabbos", h: "עונג שבת", m: "The mitzvah of delighting in Shabbos" }
    ],
    source: "Shemos 31:12 to 17, 35:1 to 3; Mishnah Shabbos 7:2; Shabbos 49b; Shulchan Aruch HaRav, Hilchos Shabbos",
    doToday: "This Shabbos, catch yourself once before an act and ask: is this melacha, or just effort?",
    quiz: [
      { id: "m4-1-q1", t: "tf", q: "Moving a heavy table inside your room on Shabbos is melacha because it's exhausting.", a: false, x: "False. Melacha is creative work, not effort. (The table isn't muktzeh either.)" },
      { id: "m4-1-q2", t: "mc", q: "The 39 melachos are derived from:", o: ["The work used to build the Mishkan", "The Ten Commandments", "The six days of creation", "The Rambam's list"], a: 0, x: "Shabbos 49b, from the juxtaposition in Shemos." },
      { id: "m4-1-q3", t: "mc", q: "A toladah is:", o: ["A rabbinic prohibition", "A derivative act sharing the purpose of an av; forbidden by the Torah", "A permitted act", "A Chabad custom"], a: 1, x: "Toldos are Torah-level prohibitions." },
      { id: "m4-1-q4", t: "recall", q: "Explain pesik reisha with an example.", model: "An act whose forbidden result is inevitable, even if unintended, is forbidden. E.g., opening a fridge door where the light will definitely go on.", x: "The classic Gemara example: cutting off a chicken's head \"without intending it to die\"." },
      { id: "m4-1-q5", t: "mc", q: "Shevus refers to:", o: ["Rabbinic Shabbos prohibitions", "The Shabbos meal", "Torah-level melacha", "Muktzeh only"], a: 0, x: "Rabbinic safeguards." },
      { id: "m4-1-q6", t: "mc", q: "Where does the Mishnah list the 39 melachos?", o: ["Shabbos 7:2", "Berachos 1:1", "Pesachim 10:1", "Avos 1:1"], a: 0, x: "Mishnah Shabbos 7:2." }
    ],
    deeper: [
      { id: "m4-1-d1", t: "recall", q: "Why does \"meleches machsheves\" matter?", model: "The Torah prohibition applies to purposeful, intended, constructive acts done in the normal way. Destructive acts, acts done with an unusual method, and unintended non-inevitable results are generally not Torah-level (though often rabbinically forbidden).", x: "This is why many cases are \"only\" rabbinic, but still forbidden." }
    ],
    reflect: "For you, the hardest part of Shabbos is probably not melacha but the pull of the business. What does it mean that Shabbos is a sign that Hashem, not you, runs the world?",
    sayIt: { phrase: "It's not about effort, it's about melacha.", h: "מלאכה", meaning: "Shabbos forbids creative work, not exertion.", when: "When a non-religious friend asks why you can't flip a switch but can carry chairs." }
  },
  {
    id: "m4-2", title: "The 39 melachos in groups", minutes: 5, intro: true,
    teach: `
<p>The Mishnah lists the 39 in a logical order, by the process they belong to in the Mishkan.</p>
<p><b>1. Growing and preparing food (11).</b> In the Mishkan these were used to grow and prepare plant dyes. The Mishnah lists them in bread-making order:</p>
<ul>
<li>Zorea (planting)</li>
<li>Choresh (plowing)</li>
<li>Kotzer (reaping)</li>
<li>Me'amer (gathering)</li>
<li>Dash (threshing)</li>
<li>Zoreh (winnowing)</li>
<li>Borer (selecting)</li>
<li>Tochen (grinding)</li>
<li>Merakeid (sifting)</li>
<li>Lash (kneading)</li>
<li>Ofeh (baking), which includes all cooking</li>
</ul>
<p><b>2. Making cloth (13).</b> The curtains of the Mishkan:</p>
<ul>
<li>Gozez (shearing)</li>
<li>Melabein (whitening, laundering)</li>
<li>Menapetz (combing)</li>
<li>Tzovea (dyeing)</li>
<li>Toveh (spinning)</li>
<li>Meisach (setting the warp)</li>
<li>Oseh shtei batei nirin (making loops)</li>
<li>Oreg (weaving)</li>
<li>Potzea (separating threads)</li>
<li>Kosher (tying)</li>
<li>Matir (untying)</li>
<li>Tofer (sewing)</li>
<li>Kore'a (tearing)</li>
</ul>
<p><b>3. Making leather (7).</b> The hide coverings:</p>
<ul>
<li>Tzad (trapping)</li>
<li>Shochet (slaughtering)</li>
<li>Mafshit (skinning)</li>
<li>Me'abeid (tanning)</li>
<li>Memachek (smoothing)</li>
<li>Mesartet (scoring lines)</li>
<li>Mechatech (cutting to shape)</li>
</ul>
<p><b>4. Writing (2).</b> Koseiv (writing) and Mochek (erasing). The Mishkan's beams were marked with letters.</p>
<p><b>5. Building (2).</b> Boneh (building) and Soser (demolishing).</p>
<p><b>6. Fire (2).</b> Mechabeh (extinguishing) and Mav'ir (kindling).</p>
<p><b>7. Finishing (1).</b> Makeh B'patish: the final hammer blow that completes an object.</p>
<p><b>8. Carrying (1).</b> Hotza'ah: carrying between domains.</p>
<p>That makes 11 + 13 + 7 + 2 + 2 + 2 + 1 + 1 = 39. Learn the groups first, then the names inside each group. The Reference tab has the full list with examples.</p>`,
    terms: [
      { t: "Borer", h: "בורר", m: "Selecting" },
      { t: "Bishul / Ofeh", h: "בישול / אופה", m: "Cooking / baking" },
      { t: "Kore'a", h: "קורע", m: "Tearing" },
      { t: "Koseiv", h: "כותב", m: "Writing" },
      { t: "Makeh B'patish", h: "מכה בפטיש", m: "The final hammer blow: completing an object" },
      { t: "Hotza'ah", h: "הוצאה", m: "Carrying between domains" }
    ],
    source: "Mishnah Shabbos 7:2; Shabbos 73a to 75b",
    doToday: "Say the 7 groups plus carrying from memory, with the count of each. Then name all 11 of the first group in order.",
    quiz: [
      { id: "m4-2-q1", t: "recall", q: "Name the groups of melachos, with how many are in each.", model: "Growing and preparing food 11, making cloth 13, leather 7, writing 2, building 2, fire 2, finishing 1, carrying 1.", x: "Total 39." },
      { id: "m4-2-q2", t: "mc", q: "Which group does Borer belong to?", o: ["Growing and preparing food", "Making cloth", "Building", "Writing"], a: 0, x: "It's the seventh in the food sequence." },
      { id: "m4-2-q3", t: "mc", q: "Cutting your nails on Shabbos falls under:", o: ["Gozez (shearing)", "Kore'a", "Mechatech", "Dash"], a: 0, x: "Removing hair or nails from the body is Gozez." },
      { id: "m4-2-q4", t: "mc", q: "Laundering clothes falls under:", o: ["Melabein", "Tzovea", "Oreg", "Tofer"], a: 0, x: "Whitening or cleaning fabric." },
      { id: "m4-2-q5", t: "mc", q: "Why is the first group listed in bread-making order even though the Mishkan used them for dyes?", o: ["The Mishnah uses the familiar sequence of making bread to organize them", "The Mishkan baked bread for the Lechem HaPanim", "It's random", "It was a Chabad addition"], a: 0, x: "Shabbos 74b: the Tanna followed the order of bread making (\"sidura d'pas\")." },
      { id: "m4-2-q6", t: "mc", q: "Spreading cream smooth on skin falls under:", o: ["Memachek", "Lash", "Tzovea", "Boneh"], a: 0, x: "Smoothing." }
    ],
    deeper: [
      { id: "m4-2-d1", t: "mc", q: "Squeezing juice out of fruit is a toladah of:", o: ["Dash (threshing)", "Borer", "Tochen", "Merakeid"], a: 0, x: "Sechitah, extracting from a natural container, is a toladah of Dash." }
    ],
    reflect: "Which of the 39 groups touches your day most on Shabbos (food, clothes, phone and fire, carrying)? That's where to be most careful.",
    sayIt: { phrase: "Is that Borer or Tochen?", h: "", meaning: "Identifying which melacha an act might fall under.", when: "At the Shabbos table in yeshiva, when someone does something borderline. It's how bochurim talk." }
  },
  {
    id: "m4-3", title: "Borer", minutes: 5, intro: false,
    teach: `
<p><b>What it is.</b> Separating a mixture, even of foods, is Borer. The Torah-level case is removing the unwanted (<i>pesoles</i>) from the wanted (<i>ochel</i>).</p>
<p><b>When selecting is permitted.</b> Three conditions, all required:</p>
<ol>
<li><b>Take the good from the bad</b>, not the bad from the good. Pick the meat off the fish bones; don't pick out the bones.</li>
<li><b>By hand</b>, or with a utensil you'd use to eat anyway, like a fork or spoon. Not with a tool designed for separating, like a sieve or a strainer.</li>
<li><b>For immediate use</b> (<i>l'altar</i>): for the meal you're about to eat, not to prepare for later.</li>
</ol>
<p><b>Common cases.</b></p>
<ul>
<li><b>Fish:</b> take pieces of fish off the bones, or lift a bone out together with some fish attached. Many poskim rule this way; ask for details.</li>
<li><b>Mixed fruit bowl:</b> choosing the apple you want to eat now is fine.</li>
<li><b>Peeling fruit</b> for immediate eating is permitted.</li>
<li><b>Salad:</b> picking out a burnt or wilted piece is Borer. Take the good pieces instead, or eat the bad piece with some good.</li>
<li><b>Pouring off liquid</b> (for example, the oil from a can of tuna): poskim discuss this. Many allow pouring as long as you stop before the last drops that separate out. Ask.</li>
</ul>
<p><b>Why it's so strict.</b> Borer reflects refining something so that it's ready to use: taking control of what's mixed. That is the creative act Shabbos stops.</p>
<p><b>Source.</b> The Alter Rebbe discusses Borer at length in Shulchan Aruch HaRav, Orach Chaim 319.</p>`,
    terms: [
      { t: "Borer", h: "בורר", m: "Selecting: separating a mixture" },
      { t: "Ochel", h: "אוכל", m: "The wanted food" },
      { t: "Pesoles", h: "פסולת", m: "The unwanted part" },
      { t: "L'altar", h: "לאלתר", m: "Immediately: for use right away" }
    ],
    source: "Shabbos 74a; Shulchan Aruch, Orach Chaim 319; Shulchan Aruch HaRav, Orach Chaim 319",
    doToday: "At the next meal (Shabbos or not), notice every time you'd be \"selecting\": bones, peels, picking out onions. Mentally apply the three conditions.",
    quiz: [
      { id: "m4-3-q1", t: "recall", q: "What are the three conditions for permitted selecting on Shabbos?", model: "1) Take the good from the bad. 2) By hand (not a separating tool). 3) For immediate use.", x: "All three are needed." },
      { id: "m4-3-q2", t: "scenario", q: "Friday night: you pick all the olives out of your salad because you don't like them.", o: ["Allowed", "Not allowed: that's taking the bad from the good", "Allowed if you eat right away"], a: 1, x: "Removing the unwanted is Borer even for immediate use. Take the salad away from the olives, or eat around them." },
      { id: "m4-3-q3", t: "scenario", q: "Shabbos lunch: you choose a peach from the fruit bowl to eat now.", o: ["Allowed", "Not allowed", "Only with a fork"], a: 0, x: "Taking what you want, by hand, for now." },
      { id: "m4-3-q4", t: "scenario", q: "Shabbos morning, 9 a.m.: you separate the good grapes from the bad for the kiddush at noon.", o: ["Allowed", "Not allowed: not for immediate use", "Allowed with a spoon"], a: 1, x: "Preparing for a meal hours later isn't l'altar." },
      { id: "m4-3-q5", t: "tf", q: "Straining pasta in a colander on Shabbos is Borer.", a: true, x: "True. A colander is a separating tool (and separates water, the unwanted, from the pasta)." },
      { id: "m4-3-q6", t: "mc", q: "Where does the Alter Rebbe discuss Borer in detail?", o: ["Shulchan Aruch HaRav, Orach Chaim 319", "Tanya ch. 1", "Seder Birchos HaNehenin", "Hilchos Talmud Torah"], a: 0, x: "OC 319." }
    ],
    deeper: [
      { id: "m4-3-d1", t: "recall", q: "Why is taking out a bone \"with some fish attached\" considered by many poskim to be permitted?", model: "Then you're not removing pure pesoles from ochel; you're removing a piece that includes food, which isn't the act of refining.", x: "Details differ; ask Zalmy how Mayanot rules." }
    ],
    reflect: "Borer is about not refining and sorting on Shabbos. Is there a \"Borer\" of the mind you do on Shabbos, like sorting through business problems in your head?",
    sayIt: { phrase: "Take the ochel from the pesoles.", h: "אוכל מתוך פסולת", meaning: "Take the good from the bad: the core rule for selecting on Shabbos.", when: "At the table when someone starts picking out the bones." }
  },
  {
    id: "m4-4", title: "Bishul: hot water, cholent, kli rishon and sheni", minutes: 5, intro: false,
    teach: `
<p><b>The basic rule.</b> Cooking raw or uncooked food is forbidden. Heat can cook in different ways, and the halacha tracks each one.</p>
<p><b>Kli rishon, sheni, shlishi.</b></p>
<ul>
<li><b>Kli rishon:</b> the pot that was on the fire, even after you take it off. It cooks.</li>
<li><b>Kli sheni:</b> a vessel the hot food was poured into. It generally doesn't cook, except for "easily cooked" items (kalei habishul).</li>
<li><b>Kli shlishi:</b> a third vessel. Most poskim treat it as not cooking.</li>
<li><b>Pouring:</b> pouring straight from a kli rishon onto raw food (<i>irui kli rishon</i>) cooks at least its surface.</li>
</ul>
<p><b>Already cooked food.</b> Solid food that is fully cooked can be reheated without direct fire (for example, on a hot plate, in the permitted way): "ein bishul achar bishul b'yavesh". Liquid that has cooled is cooked again by heating it. Ashkenazi poskim, including the Alter Rebbe, are strict about this.</p>
<p><b>Leaving food on the fire (shehiyah).</b> A pot must be fully cooked before Shabbos, or at least substantially cooked, depending on the case, and left on a covered flame (a blech) or on a hot plate so no one is tempted to adjust the flame.</p>
<p><b>Returning a pot (chazarah).</b> Conditions include:</p>
<ul>
<li>It's fully cooked and still hot.</li>
<li>The fire is covered.</li>
<li>You intended to return it and didn't put it down on the floor.</li>
</ul>
<p>The details matter, so ask.</p>
<p><b>Practical.</b></p>
<ul>
<li><b>Hot water:</b> comes from an urn left on from before Shabbos.</li>
<li><b>Tea:</b> many prepare tea essence before Shabbos and add hot water from a kli sheni. Ask Zalmy what Mayanot does.</li>
<li><b>Cholent:</b> cooked and left on from before Shabbos.</li>
</ul>`,
    terms: [
      { t: "Bishul", h: "בישול", m: "Cooking" },
      { t: "Kli rishon / sheni / shlishi", h: "כלי ראשון / שני / שלישי", m: "The first, second, and third vessel the heat passes through" },
      { t: "Blech", h: "בלעך", m: "Yiddish: a metal sheet covering the flame" },
      { t: "Shehiyah", h: "שהייה", m: "Leaving food on the fire into Shabbos" },
      { t: "Chazarah", h: "חזרה", m: "Returning food to the fire on Shabbos" },
      { t: "Ein bishul achar bishul", h: "אין בישול אחר בישול", m: "No cooking after cooking (for dry, fully cooked food)" }
    ],
    source: "Shabbos 36b to 48a; Shulchan Aruch, Orach Chaim 253, 318; Shulchan Aruch HaRav, Orach Chaim 253, 318",
    doToday: "Next time you're in the Mayanot kitchen on Shabbos, find the urn, the blech or hot plate, and ask someone how they make tea there.",
    quiz: [
      { id: "m4-4-q1", t: "mc", q: "A pot just taken off the fire is a:", o: ["Kli rishon", "Kli sheni", "Kli shlishi", "Not a kli"], a: 0, x: "It keeps its status after removal from the fire." },
      { id: "m4-4-q2", t: "scenario", q: "Shabbos: you pour hot water from the urn directly onto a tea bag in a cup.", o: ["Allowed", "Not allowed: irui kli rishon cooks the tea", "Allowed if the cup is cold"], a: 1, x: "Pouring from a kli rishon cooks. Use essence prepared before Shabbos, or ask how Mayanot handles tea." },
      { id: "m4-4-q3", t: "tf", q: "Fully cooked dry kugel can be warmed on a hot plate in the permitted way.", a: true, x: "True: no cooking after cooking for dry, fully cooked food. The method (e.g., on top of a pot, or on a designated hot plate) matters." },
      { id: "m4-4-q4", t: "scenario", q: "You take cooled chicken soup and put it on the hot plate to heat.", o: ["Allowed, it was cooked", "Not allowed: re-heating cooled liquid is cooking (Ashkenazi ruling)", "Allowed if under 5 minutes"], a: 1, x: "The Alter Rebbe, like the Rema, is strict on cooled liquid." },
      { id: "m4-4-q5", t: "mc", q: "Why is food left on a blech or covered flame?", o: ["So no one adjusts the flame (a rabbinic safeguard)", "To cook it faster", "It's a Chabad custom", "To keep it kosher"], a: 0, x: "The Gemara's concern: shema yechateh, lest he stoke the coals." },
      { id: "m4-4-q6", t: "recall", q: "What's the difference between a kli rishon and a kli sheni?", model: "A kli rishon is the vessel heated on the fire (it cooks). A kli sheni is what the food was poured into (it generally doesn't cook, except easily cooked items).", x: "The walls of a kli sheni are cooler and don't sustain cooking heat." }
    ],
    deeper: [
      { id: "m4-4-d1", t: "recall", q: "List conditions for chazarah (returning a pot to the fire on Shabbos).", model: "Fully cooked; still hot; covered fire; intention to return it; you didn't put it down on the floor (many say keep holding it).", x: "Ask a rav for the exact conditions." }
    ],
    reflect: "At home in Palo Alto, did your family have a Shabbos cooking setup? What would you need to set up in your own place one day?",
    sayIt: { phrase: "Is that a kli rishon or a kli sheni?", h: "", meaning: "The key question in Shabbos cooking.", when: "In the kitchen on Shabbos, when someone is about to pour hot water on something." }
  },
  {
    id: "m4-5", title: "Tochen, Lash, and food prep", minutes: 5, intro: false,
    teach: `
<p><b>Tochen (grinding).</b> Breaking something that grew from the ground into small pieces. Two points:</p>
<ul>
<li><b>Already-ground food:</b> it doesn't apply to things already ground or processed ("ein tochen achar tochen"). Meat and bread aren't from the ground in the relevant way.</li>
<li><b>Fresh vegetables:</b> chopping them into very small pieces is a concern. Many poskim allow it right before the meal, sometimes with a change (<i>shinui</i>) such as larger pieces. Ask Zalmy for the Mayanot practice on salads.</li>
</ul>
<p><b>Lash (kneading).</b> Combining a solid and a liquid into a single mass (dough, batter, a thick mixture). When a mixture is permitted at all, poskim require changes, such as:</p>
<ul>
<li>Adding the liquid first and then the solid.</li>
<li>Mixing in a way that isn't normal.</li>
</ul>
<p>The Alter Rebbe discusses this in Shulchan Aruch HaRav 321.</p>
<p><b>Sechitah (squeezing).</b> A toladah of Dash. Squeezing grapes or olives for their juice is a Torah prohibition. The halacha distinguishes where the juice goes:</p>
<ul>
<li><b>Onto solid food</b> (lemon onto fish or salad): permitted, because the juice is part of the food.</li>
<li><b>Into a drink</b> (lemon into water): the Shulchan Aruch (320) forbids it.</li>
</ul>
<p>Don't squeeze a wet cloth or sponge either. That's both sechitah and laundering.</p>
<p><b>Why these laws are detailed.</b> They sit close to everyday eating. The point isn't to make food prep impossible. It's to make you aware that on Shabbos you're not the processor of the world.</p>`,
    terms: [
      { t: "Tochen", h: "טוחן", m: "Grinding" },
      { t: "Lash", h: "לש", m: "Kneading" },
      { t: "Sechitah", h: "סחיטה", m: "Squeezing liquid out" },
      { t: "Shinui", h: "שינוי", m: "Doing an act in an unusual way" },
      { t: "Ein tochen achar tochen", h: "אין טוחן אחר טוחן", m: "No grinding after grinding" }
    ],
    source: "Shulchan Aruch, Orach Chaim 320, 321; Shulchan Aruch HaRav, Orach Chaim 320, 321",
    doToday: "Ask Zalmy or a friend: how does Mayanot make salad on Shabbos, and how do they handle lemons?",
    quiz: [
      { id: "m4-5-q1", t: "scenario", q: "Shabbos lunch: squeezing a lemon onto your fish.", o: ["Allowed", "Not allowed", "Only with a shinui"], a: 0, x: "Juice onto solid food is permitted (SA 320:6)." },
      { id: "m4-5-q2", t: "scenario", q: "Squeezing a lemon into a glass of water.", o: ["Allowed", "Not allowed per the Shulchan Aruch", "Allowed if drunk immediately"], a: 1, x: "Juice into liquid is sechitah." },
      { id: "m4-5-q3", t: "mc", q: "Grinding bread into crumbs on Shabbos:", o: ["Not Tochen: bread is already processed", "Tochen, Torah level", "Borer", "Lash"], a: 0, x: "Ein tochen achar tochen." },
      { id: "m4-5-q4", t: "mc", q: "Mixing flour and water into a dough is:", o: ["Lash", "Tochen", "Borer", "Bishul"], a: 0, x: "Kneading." },
      { id: "m4-5-q5", t: "tf", q: "Wringing out a wet dish towel on Shabbos is fine since you're not drinking the water.", a: false, x: "False. Wringing fabric is forbidden (sechitah, and a form of laundering)." },
      { id: "m4-5-q6", t: "mc", q: "Sechitah is a toladah of:", o: ["Dash", "Borer", "Lash", "Tochen"], a: 0, x: "Extracting from a \"container\", like threshing grain from husks." }
    ],
    deeper: [
      { id: "m4-5-d1", t: "recall", q: "Why is squeezing lemon onto food permitted while squeezing it into water isn't?", model: "When the juice goes onto solid food, it's considered part of the food: like separating food from food, not extracting a liquid. Into a drink, you're producing a beverage, which is sechitah.", x: "SA 320:6." }
    ],
    reflect: "These laws make you slow down around food. How does slowing down at the Shabbos table change the meal?",
    sayIt: { phrase: "Lemon on the fish, not in the water.", h: "", meaning: "A shorthand for the sechitah rule.", when: "When someone reaches for the lemon on Shabbos." }
  },
  {
    id: "m4-6", title: "Fire and electricity", minutes: 5, intro: false,
    teach: `
<p><b>Mav'ir and Mechabeh.</b> Kindling and extinguishing fire are Torah prohibitions. Lowering or raising a flame is included.</p>
<p><b>Electricity.</b> Poskim agree that operating electrical devices is forbidden on Shabbos, but give different reasons:</p>
<ul>
<li>An incandescent bulb is actual fire.</li>
<li>Closing a circuit is a form of Boneh (building) or Makeh B'patish.</li>
<li>It is <i>molid</i> (creating something new).</li>
</ul>
<p>The practical result is the same: no switches, no screens, no phone.</p>
<p><b>Timers.</b> A Shabbos timer set before Shabbos is widely accepted: the device runs on its own. Adjusting it on Shabbos raises its own questions. Ask.</p>
<p><b>The fridge.</b> Remove or tape the light switch before Shabbos. Whether you may open it when the motor is off, or any time, is discussed by poskim. Ask what Mayanot holds.</p>
<p><b>Your phone.</b> It's forbidden to use (electricity) and muktzeh. There is no "just checking" and no "just the time". This is the single biggest Shabbos issue for someone running a business. Lesson m4-16 covers what you can set up in advance.</p>
<p><b>Candle lighting.</b> Shabbos starts with candle lighting before sunset. The common time is 18 minutes before sunset. <b>In Jerusalem the custom is 40 minutes before sunset.</b> Ask what Mayanot follows. Before candle lighting, turn the phone off and put it away.</p>
<p><b>Havdalah</b> on Motzei Shabbos includes the bracha on fire, <i>borei me'orei ha'eish</i>: the first fire after Shabbos, recalling Adam discovering fire on the first Motzei Shabbos.</p>`,
    terms: [
      { t: "Mav'ir", h: "מבעיר", m: "Kindling" },
      { t: "Mechabeh", h: "מכבה", m: "Extinguishing" },
      { t: "Molid", h: "מוליד", m: "Creating something new: one reason given for the prohibition on electricity" },
      { t: "Shabbos clock", h: "שעון שבת", m: "A timer set before Shabbos" },
      { t: "Havdalah", h: "הבדלה", m: "The ceremony separating Shabbos from the week" }
    ],
    source: "Shemos 35:3; Shulchan Aruch, Orach Chaim 261, 263, 334; the modern poskim on electricity (general)",
    doToday: "Find out Mayanot's candle-lighting time this Friday and set an alarm 30 minutes before it: \"Phone off and away\".",
    quiz: [
      { id: "m4-6-q1", t: "tf", q: "Checking the time on your phone on Shabbos is fine if you don't open any apps.", a: false, x: "False. Using the phone is forbidden, and the phone is muktzeh." },
      { id: "m4-6-q2", t: "mc", q: "A timer set before Shabbos turns the lights off at 11 p.m. This is:", o: ["Widely accepted", "Forbidden", "Allowed only in Israel"], a: 0, x: "The device acts on its own." },
      { id: "m4-6-q3", t: "mc", q: "In Jerusalem, the common custom is to light Shabbos candles:", o: ["18 minutes before sunset", "40 minutes before sunset", "At sunset", "After nightfall"], a: 1, x: "A long-standing Jerusalem custom. Ask what Mayanot follows." },
      { id: "m4-6-q4", t: "recall", q: "Give two reasons poskim give for the prohibition on electricity.", model: "Any two: incandescent filament is fire (Mav'ir); closing a circuit is Boneh or Makeh B'patish; molid (creating something new).", x: "The result is the same: forbidden." },
      { id: "m4-6-q5", t: "mc", q: "Lowering a gas flame on Shabbos is:", o: ["Mechabeh", "Permitted", "Only rabbinic", "Boneh"], a: 0, x: "Reducing a flame is extinguishing part of it." },
      { id: "m4-6-q6", t: "mc", q: "The bracha on fire at Havdalah is:", o: ["Borei me'orei ha'eish", "Borei minei besamim", "Shehecheyanu", "Oseh maaseh bereishis"], a: 0, x: "Recalling fire's discovery on the first Motzei Shabbos (Pesachim 54a)." }
    ],
    deeper: [
      { id: "m4-6-d1", t: "scenario", q: "Your fridge light is still connected on Shabbos. You want a drink.", o: ["Open it: the light is a pesik reisha, so you may not", "Open it: you don't intend the light", "Ask a non-Jew to open it"], a: 0, x: "The light turning on is inevitable, so it's pesik reisha. Opening it is forbidden. (Asking a non-Jew needs its own psak.) Tape it before Shabbos next time." }
    ],
    reflect: "What happens to you in the first hour without your phone on Shabbos? What would it take to feel that as freedom instead of withdrawal?",
    sayIt: { phrase: "Did you tape the fridge light?", h: "", meaning: "The classic Erev Shabbos checklist question.", when: "Friday afternoon in the apartment or the dorm kitchen." }
  },
  {
    id: "m4-7", title: "Writing, erasing, tearing packages", minutes: 5, intro: false,
    teach: `
<p><b>Koseiv (writing).</b> Writing two letters that last is a Torah prohibition. Temporary writing is rabbinically forbidden. That includes typing, and according to many poskim, also drawing shapes, doodling in condensation, or forming letters from objects on purpose.</p>
<p><b>Mochek (erasing).</b> Erasing in order to write again. Breaking through letters, for example when tearing packaging, is discussed under Mochek or Kore'a.</p>
<p><b>Kore'a (tearing).</b> Tearing for a constructive purpose. Tearing off toilet paper along a perforation is a concern, so pre-cut tissues are used.</p>
<p><b>Opening packages.</b> This comes up at every Shabbos table. Issues include:</p>
<ul>
<li><b>Tearing through letters or pictures:</b> Mochek or Kore'a.</li>
<li><b>Creating a usable container:</b> Boneh or Makeh B'patish. For example, opening a bottle cap for the first time, when the cap becomes a usable closure.</li>
<li><b>Tearing a sealed wrapper</b> in a way that ruins it (<i>derech kilkul</i>): often allowed.</li>
</ul>
<p>The Chabad and general best practice: <b>open all packages, bottles, and wrappers before Shabbos.</b> If you forgot, ask. Many poskim permit tearing a bag in a destructive way that avoids letters, but not every case is the same.</p>
<p><b>Business angle.</b> Writing notes to remember something for Motzei Shabbos is forbidden. Train yourself to let business thoughts go until after Havdalah. The Rabbis also forbid planning business on Shabbos (<i>daber davar</i>).</p>`,
    terms: [
      { t: "Koseiv", h: "כותב", m: "Writing" },
      { t: "Mochek", h: "מוחק", m: "Erasing" },
      { t: "Kore'a", h: "קורע", m: "Tearing" },
      { t: "Derech kilkul", h: "דרך קלקול", m: "Destructively: in a way that ruins the object" },
      { t: "Daber davar", h: "דבר דבר", m: "Speaking of weekday matters (Yeshayahu 58:13)" }
    ],
    source: "Shulchan Aruch, Orach Chaim 314, 340; Yeshayahu 58:13; Shulchan Aruch HaRav, Orach Chaim 306, 314, 340",
    doToday: "Before this Shabbos: open every bottle, snack bag, and wrapper you'll want, and pre-tear the tissues. Make it an Erev Shabbos routine.",
    quiz: [
      { id: "m4-7-q1", t: "tf", q: "Writing a single short word on a Post-it for Motzei Shabbos is fine because it's temporary.", a: false, x: "False. Writing two letters is Koseiv. Temporary writing is still rabbinically forbidden." },
      { id: "m4-7-q2", t: "mc", q: "The best practice for snack bags and new bottles is:", o: ["Open them before Shabbos", "Open them carefully on Shabbos", "Only open with teeth", "Ask a friend to open them"], a: 0, x: "It avoids the whole question." },
      { id: "m4-7-q3", t: "mc", q: "Tearing through letters on a wrapper raises:", o: ["Mochek / Kore'a", "Borer", "Bishul", "Hotza'ah"], a: 0, x: "Breaking letters is discussed as erasing." },
      { id: "m4-7-q4", t: "scenario", q: "Shabbos, you think of a pricing idea for the business and want to make a note.", o: ["Write it down quickly", "Don't write; let it go until Havdalah", "Type it on your phone"], a: 1, x: "No writing, and the Rabbis also forbid planning weekday matters on Shabbos (daber davar)." },
      { id: "m4-7-q5", t: "mc", q: "Why might opening a new bottle cap be a problem?", o: ["It creates a usable closure (Boneh or Makeh B'patish)", "It's Borer", "It's cooking", "It isn't a problem"], a: 0, x: "Poskim debate it; the easy solution is opening it before Shabbos." }
    ],
    deeper: [
      { id: "m4-7-d1", t: "recall", q: "What is \"daber davar\" and where does it come from?", model: "The prohibition of speaking about weekday matters (business plans, what you'll buy) on Shabbos, derived from Yeshayahu 58:13: \"v'daber davar\".", x: "This is exactly where the business stays off-limits even in conversation." }
    ],
    reflect: "What business thoughts come up on Shabbos for you? What could you do Friday afternoon so that they don't hang over you?",
    sayIt: { phrase: "Did you open everything before Shabbos?", h: "", meaning: "The Erev Shabbos package check.", when: "Friday before candle lighting, in the apartment or kitchen." }
  },
  {
    id: "m4-8", title: "Building, demolishing, Makeh B'patish", minutes: 5, intro: false,
    teach: `
<p><b>Boneh (building).</b> Building or improving a structure, including attached to the ground. Related concerns include:</p>
<ul>
<li><b>Ohel:</b> making a temporary roof or tent. Opening an umbrella is forbidden for this reason.</li>
<li><b>Assembling:</b> putting an item together with parts that fit tightly.</li>
<li><b>Hardening a substance</b> into a mass, which some poskim include.</li>
</ul>
<p><b>Soser (demolishing).</b> Taking apart a structure in order to build.</p>
<p><b>Makeh B'patish (the final hammer blow).</b> Any act that completes an object or makes it usable. Examples:</p>
<ul>
<li>Fixing something broken so it works again.</li>
<li>Removing threads left over from sewing a new garment (the basting threads).</li>
<li>Tightening a loose handle.</li>
<li>Setting a watch that stopped, according to many poskim.</li>
</ul>
<p><b>Practical cases.</b></p>
<ul>
<li><b>Umbrella:</b> no. Use a hat or hood.</li>
<li><b>Folding chair:</b> generally permitted, since it's made to be opened and closed.</li>
<li><b>A shirt button that fell off:</b> don't sew it (Tofer), and don't "fix" it.</li>
<li><b>Removing a new clothing tag</b> or the plastic tag fastener: may be Kore'a or Makeh B'patish. Do it before Shabbos.</li>
<li><b>Lego or model assembly:</b> poskim differ on toys that snap together loosely. Ask.</li>
</ul>
<p><b>The idea.</b> Shabbos celebrates that Hashem completed the world. On Shabbos we don't "complete" things; we enjoy a completed world.</p>`,
    terms: [
      { t: "Boneh", h: "בונה", m: "Building" },
      { t: "Soser", h: "סותר", m: "Demolishing" },
      { t: "Ohel", h: "אוהל", m: "A tent or roof: making one is a form of Boneh" },
      { t: "Makeh B'patish", h: "מכה בפטיש", m: "The final hammer blow: completing an object" }
    ],
    source: "Shulchan Aruch, Orach Chaim 313 to 315; Shulchan Aruch HaRav, Orach Chaim 313 to 315",
    doToday: "Check your Shabbos clothes before Friday: new tags removed, buttons secure, basting threads cut.",
    quiz: [
      { id: "m4-8-q1", t: "scenario", q: "It's raining on Shabbos. You open an umbrella.", o: ["Allowed", "Not allowed: making an ohel", "Allowed within an eruv"], a: 1, x: "An eruv only addresses carrying, not the ohel issue." },
      { id: "m4-8-q2", t: "scenario", q: "Shabbos morning: you cut the tag off a new shirt to wear it.", o: ["Allowed", "Not allowed: Kore'a / Makeh B'patish", "Allowed with scissors"], a: 1, x: "Do it before Shabbos." },
      { id: "m4-8-q3", t: "mc", q: "Makeh B'patish includes:", o: ["Finishing or fixing an object to make it usable", "Only hammering", "Carrying", "Cooking"], a: 0, x: "Completion of an object." },
      { id: "m4-8-q4", t: "tf", q: "Opening a folding chair on Shabbos is generally permitted.", a: true, x: "True: it's made to be opened and closed. It isn't building." },
      { id: "m4-8-q5", t: "mc", q: "Boneh can include:", o: ["Making a temporary roof", "Squeezing fruit", "Writing", "Carrying"], a: 0, x: "Ohel is related to Boneh." }
    ],
    deeper: [
      { id: "m4-8-d1", t: "recall", q: "Connect Makeh B'patish to the meaning of Shabbos.", model: "Shabbos marks Hashem's completion of creation. On Shabbos, we refrain from completing things and instead enjoy a world that is already complete.", x: "This is a common Chassidic and general reading." }
    ],
    reflect: "You're a builder: a business, a body, a new life. What would it mean to spend one day a week not building anything, just being?",
    sayIt: { phrase: "That's Makeh B'patish.", h: "מכה בפטיש", meaning: "An act that completes or fixes an object: forbidden on Shabbos.", when: "When someone tries to fix a broken item on Shabbos." }
  },
  {
    id: "m4-9", title: "Clothing and hair", minutes: 5, intro: false,
    teach: `
<p><b>Laundering (Melabein).</b> Soaking or rubbing fabric to clean it is laundering. On Shabbos:</p>
<ul>
<li>Don't soak a stain or rub it out. Gently wiping off surface dirt without water is often allowed.</li>
<li>Don't use a wet cloth to scrub fabric.</li>
<li>Don't wring anything out.</li>
</ul>
<p>If wine spills on your shirt, leave it for after Shabbos.</p>
<p><b>Hair and nails (Gozez).</b> Cutting or pulling out hair or nails is forbidden. Brushing hair is problematic because it inevitably pulls hairs out. Many avoid combing entirely or use a very soft brush set aside for Shabbos. Ask Zalmy.</p>
<p><b>Tying (Kosher) and untying (Matir).</b> Permanent knots are forbidden. A double knot meant to last is a concern. A bow, or a knot made to be untied the same day, is permitted. For shoelaces: tie a bow, not a double knot.</p>
<p><b>Folding.</b> Folding clothes along their creases, to prepare them for the week, is discussed as a form of Makeh B'patish or preparation. Don't fold a tallis on its original creases on Shabbos.</p>
<p><b>Dressing for Shabbos.</b> This one is positive: special Shabbos clothes are part of <i>kavod Shabbos</i> (Shabbos 113a: "your Shabbos clothes should not be like your weekday clothes"). In Chabad, many wear a hat and jacket for davening, and married men wear a gartel and a kapote on Shabbos.</p>`,
    terms: [
      { t: "Melabein", h: "מלבן", m: "Whitening, laundering" },
      { t: "Gozez", h: "גוזז", m: "Shearing: cutting hair or nails" },
      { t: "Kosher / Matir", h: "קושר / מתיר", m: "Tying / untying a permanent knot" },
      { t: "Kavod Shabbos", h: "כבוד שבת", m: "Honoring Shabbos: dress, preparation, cleanliness" },
      { t: "Kapote", h: "קאפטע", m: "Yiddish: a long black coat worn by married Chassidim on Shabbos" },
      { t: "Gartel", h: "גארטל", m: "Yiddish: a prayer belt" }
    ],
    source: "Shabbos 113a; Shulchan Aruch, Orach Chaim 302, 303, 317, 340; Shulchan Aruch HaRav on those sections",
    doToday: "Set aside a specific Shabbos outfit you don't wear during the week, even if it's just a shirt.",
    quiz: [
      { id: "m4-9-q1", t: "scenario", q: "Friday night, wine spills on your white shirt. You rub it with a wet napkin.", o: ["Allowed", "Not allowed: laundering", "Allowed without soap"], a: 1, x: "Water on fabric to clean it is Melabein." },
      { id: "m4-9-q2", t: "mc", q: "Tying shoelaces on Shabbos:", o: ["A bow is fine; avoid a permanent double knot", "Any knot is forbidden", "Any knot is fine"], a: 0, x: "The concern is permanent knots." },
      { id: "m4-9-q3", t: "tf", q: "Brushing hair with a hard brush on Shabbos is fine because you don't intend to pull hairs out.", a: false, x: "False. Pulling hairs is inevitable (pesik reisha)." },
      { id: "m4-9-q4", t: "mc", q: "Special Shabbos clothes are part of:", o: ["Kavod Shabbos", "Oneg only", "A Chabad-only custom", "Not required"], a: 0, x: "Shabbos 113a." },
      { id: "m4-9-q5", t: "mc", q: "Cutting nails on Shabbos is:", o: ["Gozez", "Kore'a", "Mechatech", "Permitted"], a: 0, x: "Removing from the body falls under shearing." }
    ],
    deeper: [
      { id: "m4-9-d1", t: "recall", q: "Why is folding a tallis on its original creases a problem on Shabbos?", model: "It prepares the garment (restoring its creases) and is compared to finishing an item (Makeh B'patish), and it prepares for a weekday.", x: "Folding it loosely, not on the creases, is generally fine." }
    ],
    reflect: "What you wear shapes how you act. Does your Shabbos look different from your Tuesday? Should it?",
    sayIt: { phrase: "Bigdei Shabbos.", h: "בגדי שבת", meaning: "Shabbos clothes.", when: "When friends ask why you change before Shabbos even though you're staying in." }
  },
  {
    id: "m4-10", title: "Hotza'ah: the four domains", minutes: 5, intro: false,
    teach: `
<p><b>Carrying is a melacha.</b> Unlike the other 38, it doesn't change the object; it changes its location. The source is the Levites carrying the Mishkan's parts, and Moshe's announcement that the people stop bringing materials (Shabbos 96b).</p>
<p><b>The four domains.</b></p>
<ul>
<li><b>Reshus hayachid:</b> a private domain. An area enclosed by walls at least 10 tefachim high, at least 4 by 4 tefachim. Carrying within it is permitted.</li>
<li><b>Reshus harabim:</b> a public domain. A wide public street (at least 16 amos), open at both ends. Many poskim require 600,000 people passing. Carrying from domain to domain, or 4 amos within it, is a Torah prohibition.</li>
<li><b>Karmelis:</b> an area that isn't fully private or fully public, like a field, a narrower street, or most streets today. The Rabbis forbid carrying there.</li>
<li><b>Makom patur:</b> a small exempt area.</li>
</ul>
<p><b>Wearing is not carrying.</b> Clothing and normal accessories that you wear are not carried: tzitzis, a tie, a watch according to many (some are strict with watches), a hat. The key belt (next lesson) works this way. Items in your pockets are carried.</p>
<p><b>Practical.</b> Without an eruv, you can't take keys, tissues, a siddur, or a water bottle outside, or carry a baby or push a stroller. Your house is fine. From your house to a shared courtyard needs an eruv chatzeiros.</p>
<p>Chabad follows the Alter Rebbe's detailed rulings in Hilchos Shabbos (345 onward).</p>`,
    terms: [
      { t: "Hotza'ah", h: "הוצאה", m: "Carrying between domains" },
      { t: "Reshus hayachid", h: "רשות היחיד", m: "Private domain" },
      { t: "Reshus harabim", h: "רשות הרבים", m: "Public domain" },
      { t: "Karmelis", h: "כרמלית", m: "An intermediate domain where the Rabbis forbade carrying" },
      { t: "Daled amos", h: "ד׳ אמות", m: "Four cubits (about 2 meters)" }
    ],
    source: "Shabbos 2a, 6a, 96b; Shulchan Aruch, Orach Chaim 345 to 349; Shulchan Aruch HaRav, Orach Chaim 345",
    doToday: "Before Shabbos, empty your pockets and decide what you actually need to take outside. Ask Zalmy about the eruv question in the next lesson.",
    quiz: [
      { id: "m4-10-q1", t: "recall", q: "Name the four domains.", model: "Reshus hayachid (private), reshus harabim (public), karmelis (intermediate), makom patur (exempt).", x: "Carrying rules depend on which one you're in." },
      { id: "m4-10-q2", t: "tf", q: "Wearing a tie outside without an eruv is carrying.", a: false, x: "False. Clothing you wear isn't carried." },
      { id: "m4-10-q3", t: "scenario", q: "No eruv. You walk to shul with tissues in your pocket.", o: ["Allowed", "Not allowed: carrying", "Allowed if under 4 amos"], a: 1, x: "Pockets = carrying." },
      { id: "m4-10-q4", t: "mc", q: "Most city streets today are, according to many poskim:", o: ["Karmelis", "Reshus harabim d'oraisa", "Reshus hayachid", "Makom patur"], a: 0, x: "Because they lack one of the conditions of a Torah public domain." },
      { id: "m4-10-q5", t: "mc", q: "Why is carrying a melacha if the object doesn't change?", o: ["It was a Mishkan activity: moving materials between domains", "It's only rabbinic", "It's a type of Boneh", "It's Borer"], a: 0, x: "Shabbos 96b." }
    ],
    deeper: [
      { id: "m4-10-d1", t: "recall", q: "Why is carrying called a \"weak\" melacha (melacha gru'ah) by Tosafos?", model: "Because the object itself isn't changed; only its location is. Yet it's still a full Torah-level melacha.", x: "Tosafos on Shabbos 2a." }
    ],
    reflect: "Walking outside on Shabbos without keys or a phone is a physical feeling of being \"unplugged\". How does it feel to you?",
    sayIt: { phrase: "Is there an eruv here?", h: "עירוב", meaning: "The first question when you arrive somewhere for Shabbos.", when: "When staying with a host family for Shabbos." }
  },
  {
    id: "m4-11", title: "Eruv and the key belt", minutes: 5, intro: false,
    teach: `
<p><b>What an eruv does.</b> An eruv chatzeiros (with shittufei mevo'os) turns a shared area into a single private domain. It works only if the area is enclosed, by walls or by a <i>tzuras hapesach</i> ("doorway" structures made of poles with a wire on top), and the residents are joined through a shared food item.</p>
<p><b>City eruvin.</b> Many cities have one, including Jerusalem, which has a municipal eruv. The question is whether to rely on it. Poskim discuss whether a large city might be a Torah-level public domain, which an eruv can't fix. <b>Chabad practice varies. Many Chabad chassidim are strict and don't carry even with a city eruv.</b> The Rebbe opposed making an eruv in Crown Heights. Ask Zalmy what Mayanot holds for Jerusalem. Don't assume either way.</p>
<p><b>The key belt.</b> A belt whose clasp includes your key as a structural, working part. You're wearing the key, not carrying it. Many poskim permit it when the key is truly part of the belt, and a belt is something you'd wear anyway. <b>Ask a rav before relying on it.</b> In the interview, you said you'd never carry a key. That's stricter than needed, but it's a safe default until you ask.</p>
<p><b>Without either one.</b> Options include:</p>
<ul>
<li>Leaving the door unlocked (often not realistic).</li>
<li>Hiding a key in a private enclosed area.</li>
<li>A combination lock set up before Shabbos. Poskim discuss whether turning its dials on Shabbos is permitted.</li>
</ul>
<p>Ask.</p>`,
    terms: [
      { t: "Eruv chatzeiros", h: "עירובי חצירות", m: "The eruv that joins shared domains into one private domain" },
      { t: "Tzuras hapesach", h: "צורת הפתח", m: "\"Form of a doorway\": poles and a wire that enclose an area" },
      { t: "Key belt", h: "", m: "A belt with a key built into its clasp, worn rather than carried" },
      { t: "Hotza'ah", h: "הוצאה", m: "Carrying" }
    ],
    source: "Eruvin; Shulchan Aruch, Orach Chaim 301 (wearing), 363 to 395 (eruvin); Shulchan Aruch HaRav, Orach Chaim 301",
    doToday: "Ask Zalmy two things: Does Mayanot hold by the Jerusalem eruv? Is a key belt OK for me?",
    quiz: [
      { id: "m4-11-q1", t: "mc", q: "What does an eruv chatzeiros do?", o: ["Turns a shared enclosed area into one private domain", "Makes carrying permitted anywhere", "Allows cooking", "Replaces Havdalah"], a: 0, x: "Enclosure plus the joining of residents." },
      { id: "m4-11-q2", t: "tf", q: "All Chabad chassidim carry in any city eruv.", a: false, x: "False. Many are strict. Ask what Mayanot holds." },
      { id: "m4-11-q3", t: "mc", q: "Why does a key belt work (according to those who permit it)?", o: ["The key is part of a worn garment", "Keys aren't muktzeh", "Small items don't count", "Belts are exempt from Shabbos"], a: 0, x: "Wearing, not carrying." },
      { id: "m4-11-q4", t: "recall", q: "What is a tzuras hapesach?", model: "A \"form of a doorway\": two poles with a horizontal wire or rod on top, which halachically counts as a wall for an eruv.", x: "Those wires on poles you see around neighborhoods." },
      { id: "m4-11-q5", t: "scenario", q: "No eruv. You hang your house key on a string around your neck, as jewelry.", o: ["Allowed", "Not allowed: it's carried, not a garment", "Allowed if silver"], a: 1, x: "It must be a genuine functional part of clothing. A key on a string is carrying." }
    ],
    deeper: [
      { id: "m4-11-d1", t: "recall", q: "Why might a big city eruv not work according to some poskim?", model: "If the area qualifies as a Torah-level reshus harabim (wide streets, open through, and by some opinions 600,000 people), a tzuras hapesach can't make it private.", x: "This is the core dispute over city eruvin." }
    ],
    reflect: "You said you'd never carry a key. That's a strict default. What's your approach to halachic questions: default to strict, or ask and know?",
    sayIt: { phrase: "Do you hold by the eruv?", h: "", meaning: "Do you rely on the local eruv for carrying?", when: "When a host or friend offers to carry something for you, or asks you to carry." }
  },
  {
    id: "m4-12", title: "Muktzeh", minutes: 5, intro: false,
    teach: `
<p><b>What it is.</b> A rabbinic prohibition on moving certain objects on Shabbos. It protects the Shabbos atmosphere and keeps you from weekday activity.</p>
<p><b>The categories.</b></p>
<ul>
<li><b>Kli shemelachto l'issur:</b> a tool whose main use is forbidden on Shabbos (a hammer, a pen, <b>your phone</b> according to most). It may be moved if you need it for a permitted use (<i>l'tzorech gufo</i>) or you need its place (<i>l'tzorech mekomo</i>). For example, use a hammer to crack nuts, or move a pen off a chair you want to sit on.</li>
<li><b>Muktzeh machmas gufo:</b> an object with no use at all on Shabbos: stones, money, raw inedible food, candlesticks with a flame. It can't be moved at all.</li>
<li><b>Muktzeh machmas chisaron kis:</b> a valuable item you'd never use for anything else (an expensive camera or tool). It can't be moved even for a permitted use.</li>
<li><b>Basis l'davar ha'asur:</b> an object serving as a base for muktzeh during bein hashmashos, like a tray holding candlesticks when Shabbos began. It becomes muktzeh.</li>
</ul>
<p><b>Permitted ways.</b> Moving muktzeh indirectly (<i>tiltul min hatzad</i>) for a permitted item's sake, or with your body rather than your hands, is often allowed. For example, shaking a tablecloth that has crumbs and a coin on it, or brushing an item away with your elbow.</p>
<p><b>Your phone.</b> If it's lying on your bed and you want to sleep: move it l'tzorech mekomo, or move it with your body. Don't pick it up to look at it.</p>`,
    terms: [
      { t: "Muktzeh", h: "מוקצה", m: "\"Set aside\": an object that may not be moved on Shabbos" },
      { t: "Kli shemelachto l'issur", h: "כלי שמלאכתו לאיסור", m: "A tool mainly used for forbidden work" },
      { t: "L'tzorech gufo / mekomo", h: "לצורך גופו / מקומו", m: "For using the item / for using its place" },
      { t: "Chisaron kis", h: "חסרון כיס", m: "Financial loss: valuable items set aside" },
      { t: "Basis l'davar ha'asur", h: "בסיס לדבר האסור", m: "A base for a muktzeh item" },
      { t: "Tiltul min hatzad", h: "טלטול מן הצד", m: "Indirect moving" }
    ],
    source: "Shabbos 123a to 125b, 142b; Shulchan Aruch, Orach Chaim 308 to 311; Shulchan Aruch HaRav, Orach Chaim 308 to 311",
    doToday: "Before Shabbos: put your phone and wallet somewhere you won't need to move them, not on your bed, table, or chair.",
    quiz: [
      { id: "m4-12-q1", t: "mc", q: "Money on Shabbos is:", o: ["Muktzeh machmas gufo", "Kli shemelachto l'issur", "Not muktzeh", "Basis"], a: 0, x: "It has no permitted Shabbos use." },
      { id: "m4-12-q2", t: "scenario", q: "Your phone is on your chair and you want to sit.", o: ["Move it for its place (l'tzorech mekomo), or roll it off without using your hands", "Can't touch it; don't sit", "Pick it up and check it"], a: 0, x: "A kli shemelachto l'issur may be moved for its place." },
      { id: "m4-12-q3", t: "scenario", q: "You use a hammer to crack walnuts on Shabbos.", o: ["Allowed: l'tzorech gufo", "Not allowed", "Only with a shinui"], a: 0, x: "A kli shemelachto l'issur for a permitted use." },
      { id: "m4-12-q4", t: "tf", q: "Muktzeh is a Torah prohibition.", a: false, x: "False. It's rabbinic." },
      { id: "m4-12-q5", t: "mc", q: "A tray holding lit candlesticks at the start of Shabbos becomes:", o: ["A basis l'davar ha'asur", "Permitted", "Chisaron kis", "Kli shemelachto l'heter"], a: 0, x: "A base for muktzeh during bein hashmashos." },
      { id: "m4-12-q6", t: "recall", q: "Why did the Rabbis institute muktzeh?", model: "To protect the Shabbos atmosphere and prevent people from treating Shabbos as a weekday (and from coming to do melacha), e.g., handling tools and money.", x: "Rambam, Hilchos Shabbos 24:12 to 13." }
    ],
    deeper: [
      { id: "m4-12-d1", t: "mc", q: "An expensive professional camera on Shabbos is:", o: ["Muktzeh machmas chisaron kis: not movable even for a permitted use", "Kli shemelachto l'issur: movable for its place", "Not muktzeh"], a: 0, x: "Valuable items you'd never use otherwise." }
    ],
    reflect: "Your phone is your business. Muktzeh makes it untouchable for 25 hours. How do you feel about that, honestly?",
    sayIt: { phrase: "It's muktzeh.", h: "מוקצה", meaning: "It can't be moved on Shabbos.", when: "When someone on Shabbos reaches for a phone, money, or a pen." }
  },
  {
    id: "m4-13", title: "Asking others to do melacha", minutes: 5, intro: false,
    teach: `
<p><b>Amirah l'akum.</b> Asking a non-Jew to do melacha for you on Shabbos is rabbinically forbidden (Shabbos 150a). That includes asking before Shabbos for something to be done on Shabbos, and hinting in a direct way. Benefiting from melacha a non-Jew did for you on Shabbos is also restricted.</p>
<p><b>Exceptions</b> (limited, and a rav should guide):</p>
<ul>
<li>For someone who is ill.</li>
<li>For a great need or a mitzvah, when the act itself is only rabbinically forbidden (<i>shevus d'shevus b'makom mitzvah</i>).</li>
<li>For a great financial loss, in some cases.</li>
</ul>
<p><b>Asking a Jew.</b> Asking another Jew to do melacha on his Shabbos is far worse. It causes him to sin (<i>lifnei iver</i>, Vayikra 19:14), and it doesn't matter if he isn't religious.</p>
<p><b>Time zones.</b> This is where your life gets complicated. When it's your Shabbos in Jerusalem, it may still be Friday in California. Asking Ari, if he's Jewish, to do something at 9 a.m. Friday Pacific time isn't asking him to break <i>his</i> Shabbos. But speaking about business on your Shabbos is itself forbidden (daber davar), and profiting from work on your Shabbos raises more questions. The best practice is to hand over tasks before your Shabbos starts. Lessons m4-15 to m4-17 go through the business in detail.</p>
<p class="flag">Anything involving the business on Shabbos: confirm with a rav.</p>`,
    terms: [
      { t: "Amirah l'akum", h: "אמירה לעכו״ם", m: "Asking a non-Jew to do melacha" },
      { t: "Lifnei iver", h: "לפני עור", m: "Causing someone to sin (\"before the blind\")" },
      { t: "Shevus d'shevus b'makom mitzvah", h: "שבות דשבות במקום מצוה", m: "A double rabbinic prohibition, permitted for a mitzvah" },
      { t: "Choleh", h: "חולה", m: "A sick person" }
    ],
    source: "Shabbos 150a; Vayikra 19:14; Shulchan Aruch, Orach Chaim 307; Shulchan Aruch HaRav, Orach Chaim 307",
    doToday: "Write a short Friday handover template for the business: what's done, what's pending, and what's allowed to wait. Send it before candle lighting every week.",
    quiz: [
      { id: "m4-13-q1", t: "tf", q: "Asking a non-Jew on Thursday to turn on your AC on Shabbos is fine because you asked before Shabbos.", a: false, x: "False. Asking before Shabbos for Shabbos melacha is still amirah l'akum." },
      { id: "m4-13-q2", t: "mc", q: "Asking a non-observant Jew to do melacha on his Shabbos is:", o: ["Forbidden: lifnei iver, worse than asking a non-Jew", "Fine since he doesn't keep Shabbos", "Permitted in an emergency only", "Rabbinic only"], a: 0, x: "Causing a Jew to sin is a serious prohibition." },
      { id: "m4-13-q3", t: "scenario", q: "Your Shabbos, 10 a.m. Jerusalem (Saturday 12 a.m. California). You call Ari to discuss a customer.", o: ["Fine: different time zone", "Forbidden: phone use and business talk on your Shabbos (and it's already Shabbos in California too)", "Fine if short"], a: 1, x: "Using a phone on your Shabbos is forbidden. And at that hour it's already Shabbos in California." },
      { id: "m4-13-q4", t: "mc", q: "Which is a recognized exception for asking a non-Jew?", o: ["For a sick person", "For convenience", "To finish work faster", "To answer customers"], a: 0, x: "Illness is a key exception." },
      { id: "m4-13-q5", t: "recall", q: "Why doesn't a time zone difference solve the business problem entirely?", model: "Because your own Shabbos obligations still apply: no phone, no writing, no business talk or planning (daber davar), and profiting from work on your Shabbos raises issues.", x: "Setting everything up before Shabbos is the clean solution." }
    ],
    deeper: [
      { id: "m4-13-d1", t: "recall", q: "Why did the Rabbis forbid amirah l'akum if the non-Jew isn't obligated in Shabbos?", model: "The Rabbis were concerned that treating melacha as something you can \"outsource\" would erode Shabbos, and a person's agent (even informally) is like himself. Rashi and Rambam give different reasons (shelichus vs. protecting Shabbos).", x: "Shabbos 150a; Rambam, Hilchos Shabbos 6:1." }
    ],
    reflect: "If Ari is Jewish, have you ever talked to him about Shabbos? What would a respectful conversation look like?",
    sayIt: { phrase: "I'll hand it over before Shabbos.", h: "", meaning: "Handing off tasks before your Shabbos starts avoids the problems.", when: "With Ari every Friday. Make it a routine phrase." }
  },
  {
    id: "m4-14", title: "Chabad Shabbos customs", minutes: 5, intro: false,
    teach: `
<p><b>Preparation.</b> Chazal say "whoever toils on Erev Shabbos eats on Shabbos" (Avodah Zarah 3a). Chabad customs for Friday include:</p>
<ul>
<li><b>Shnayim mikra v'echad targum:</b> reading the week's parsha twice in Hebrew and once in Targum Onkelos, a halacha the Alter Rebbe emphasizes.</li>
<li><b>Mikvah on Erev Shabbos:</b> a strong Chabad practice for men.</li>
<li><b>Tzedakah:</b> giving before Shabbos, including before lighting candles.</li>
</ul>
<p><b>Shabbos is for Chassidus and davening.</b> The Rebbeim said many of their maamarim on Shabbos. Chabad chassidim daven longer on Shabbos (<i>b'arichus</i>), with more contemplation, and learn Chassidus. Weekday matters are pushed out of mind and speech.</p>
<p><b>Shabbos Mevarchim.</b> On the Shabbos before Rosh Chodesh, the Frierdiker Rebbe instituted saying the entire Tehillim before Shacharis. Chabad shuls say it together early in the morning. A farbrengen usually follows davening.</p>
<p><b>Nigunim and farbrengens.</b> Shabbos afternoons are prime farbrengen time, especially Shabbos Mevarchim and special dates.</p>
<p><b>Chitas on Shabbos.</b> Daily shiurim continue: the seventh aliyah of the parsha, the Tehillim for the day of the month, and the Tanya portion.</p>
<p><b>Other things you'll see.</b> Chabad follows the Alter Rebbe's siddur for Kabbalas Shabbos, Kiddush, and zemiros. The details are best learned by watching at Mayanot and asking. Don't invent your own minhagim from the internet.</p>`,
    terms: [
      { t: "Shnayim mikra v'echad targum", h: "שנים מקרא ואחד תרגום", m: "Reading the parsha twice plus once in Targum" },
      { t: "Shabbos Mevarchim", h: "שבת מברכים", m: "The Shabbos before Rosh Chodesh, when the new month is blessed" },
      { t: "B'arichus", h: "באריכות", m: "At length: slow, contemplative davening" },
      { t: "Erev Shabbos", h: "ערב שבת", m: "Friday: the preparation day" },
      { t: "Mikvah", h: "מקוה", m: "A ritual pool" }
    ],
    source: "Avodah Zarah 3a; Shulchan Aruch HaRav, Orach Chaim 285 (shnayim mikra); Sefer HaMinhagim (Shabbos); Hayom Yom (on Shabbos Mevarchim Tehillim)",
    doToday: "This Friday, do one Chabad Erev Shabbos practice you haven't done before: mikvah, shnayim mikra for one aliyah, or tzedakah before candle lighting.",
    quiz: [
      { id: "m4-14-q1", t: "mc", q: "On Shabbos Mevarchim, Chabad says:", o: ["The whole Tehillim before Shacharis", "Only the chapter of the day", "Selichos", "Nothing extra"], a: 0, x: "Instituted by the Frierdiker Rebbe." },
      { id: "m4-14-q2", t: "recall", q: "What is shnayim mikra v'echad targum?", model: "Reading the weekly parsha twice in the original and once in Targum Onkelos, before the Shabbos reading.", x: "Berachos 8a; codified by the Alter Rebbe (OC 285)." },
      { id: "m4-14-q3", t: "mc", q: "A strong Chabad Erev Shabbos practice for men is:", o: ["Going to the mikvah", "Fasting", "Reading Megillah", "Selichos"], a: 0, x: "Mikvah on Erev Shabbos." },
      { id: "m4-14-q4", t: "tf", q: "Chitas continues on Shabbos.", a: true, x: "True. Shabbos's Chumash portion is the seventh aliyah." },
      { id: "m4-14-q5", t: "mc", q: "\"Whoever toils on Erev Shabbos eats on Shabbos\" is from:", o: ["Avodah Zarah 3a", "Tanya", "Hayom Yom", "The Rambam"], a: 0, x: "It's also a parable about this world and the next." }
    ],
    deeper: [
      { id: "m4-14-d1", t: "recall", q: "Why is Shabbos especially suited to Chassidus and longer davening?", model: "On Shabbos the world is elevated on its own, and a person is free from weekday concerns, so the mind and heart are more open to contemplation (hisbonenus) and deeper connection.", x: "This is why the Rebbeim said maamarim on Shabbos." }
    ],
    reflect: "Which Erev Shabbos habit would make the biggest difference for you: mikvah, a business shutdown routine, or Shabbos prep?",
    sayIt: { phrase: "Did you do shnayim mikra yet?", h: "", meaning: "Have you read the parsha twice with Targum?", when: "Thursday night or Friday in yeshiva." }
  },
  {
    id: "m4-15", title: "Business: time zones and when Shabbos ends", minutes: 5, intro: false,
    teach: `
<p><b>The halacha follows where you are.</b> Your Shabbos runs by Jerusalem time. The Bay Area's Shabbos doesn't change yours.</p>
<p><b>The math.</b> The Bay Area is usually <b>10 hours behind Israel</b>. It's briefly 9 or 11 hours when the countries switch clocks on different dates.</p>
<ul>
<li><b>Your Shabbos starts</b> at candle lighting Friday (about 5 to 6:30 p.m. in Jerusalem, depending on the season). That's about <b>7 to 8:30 a.m. Friday in California</b>.</li>
<li><b>Your Shabbos ends</b> at nightfall Saturday (about 6 to 8 p.m. in Jerusalem). That's about <b>8 to 10 a.m. Saturday in California</b>.</li>
</ul>
<p>So your business "blackout" window is essentially <b>Friday morning to Saturday morning, Pacific time</b>. Friday is often a busy day for a detailing business, which is why this matters.</p>
<p><b>Planning.</b></p>
<ul>
<li>Schedule customer-facing work so nothing requires you between Friday 7 a.m. and Saturday 10 a.m. PT.</li>
<li>Close out Friday bookings on Thursday night, Israel time.</li>
<li>Tell customers clearly (in auto-replies, on the website) when you're unavailable, without needing to explain.</li>
</ul>
<p><b>Yom Tov.</b> The same applies to Yom Tov, including Yom Tov Sheni if you keep two days. Map out the whole year's Yamim Tovim with Ari in advance.</p>
<p class="flag">How your business may operate during your Shabbos is covered in the next two lessons. Confirm with a rav.</p>`,
    terms: [
      { t: "Zman", h: "זמן", m: "A halachic time (candle lighting, nightfall, etc.)" },
      { t: "Tzeis hakochavim", h: "צאת הכוכבים", m: "Nightfall: when Shabbos ends" },
      { t: "Hadlakas neiros", h: "הדלקת נרות", m: "Candle lighting" },
      { t: "Luach", h: "לוח", m: "A Jewish calendar with zmanim" }
    ],
    source: "Shulchan Aruch, Orach Chaim 261 (start and end of Shabbos); halachic practice that zmanim follow one's location",
    doToday: "Put your Shabbos window into your business calendar in Pacific time, recurring weekly: Friday 7 a.m. to Saturday 10 a.m. PT (adjust by season). Share it with Ari.",
    quiz: [
      { id: "m4-15-q1", t: "mc", q: "Your Shabbos is determined by:", o: ["Jerusalem time (where you are)", "California time (where the business is)", "Whichever ends later", "Whichever starts earlier"], a: 0, x: "You follow the zmanim of your location." },
      { id: "m4-15-q2", t: "mc", q: "When your Shabbos ends Saturday night in Jerusalem, it's roughly what time in California?", o: ["Saturday morning", "Saturday night", "Friday night", "Sunday morning"], a: 0, x: "About 10 hours behind: roughly 8 to 10 a.m. Saturday." },
      { id: "m4-15-q3", t: "tf", q: "Since it's still Friday in California when your Shabbos starts, you can answer customers until their Shabbos starts.", a: false, x: "False. Your Shabbos applies to you, wherever the customers are." },
      { id: "m4-15-q4", t: "recall", q: "What is your weekly business blackout window, in Pacific time?", model: "Roughly Friday 7 to 8:30 a.m. through Saturday 8 to 10 a.m., depending on the season.", x: "Check exact times weekly." },
      { id: "m4-15-q5", t: "mc", q: "Best practice for Friday bookings:", o: ["Close them out Thursday night Israel time", "Handle them on Shabbos quickly", "Let Ari figure it out on Shabbos", "Ignore them"], a: 0, x: "Prepare before, so Shabbos is clean." }
    ],
    deeper: [
      { id: "m4-15-d1", t: "recall", q: "If you keep two days of Yom Tov, what extra planning does the business need?", model: "Map every Yom Tov and Yom Tov Sheni in the year into Pacific time, and set blackout windows and handovers for each, including two-day and three-day stretches (Yom Tov next to Shabbos).", x: "Do this with Ari at the start of each season." }
    ],
    reflect: "How do you feel about telling customers you're unavailable Friday to Saturday? What's the actual cost, and what's the gain?",
    sayIt: { phrase: "I'm offline from Friday morning to Saturday morning, Pacific.", h: "", meaning: "Your practical Shabbos window, in business terms.", when: "To customers and Ari. No need to explain further." }
  },
  {
    id: "m4-16", title: "Business: messages, auto-replies, automated booking", minutes: 5, intro: false,
    teach: `
<p><b>What you can set up before Shabbos.</b></p>
<ul>
<li><b>Auto-replies</b> on email, SMS, and messaging, set before Shabbos. The system runs on its own. This is widely considered fine, similar to a timer.</li>
<li><b>Website messaging</b> that says you're unavailable and will respond after the weekend.</li>
</ul>
<p><b>What you can't do on Shabbos.</b></p>
<ul>
<li>Read, answer, or check messages, even without replying.</li>
<li>Look at dashboards.</li>
<li>Think through business plans on purpose. The Rabbis forbid planning weekday matters, <i>hirhur</i> in business, according to many; speaking about it is clearly forbidden (daber davar).</li>
</ul>
<p><b>Automated booking and payments.</b> This is where poskim differ, so here are the questions to bring to a rav:</p>
<ul>
<li>A fully automated website that takes bookings and charges cards on your Shabbos. Many poskim are lenient when the system runs by itself and no Jew does anything on Shabbos. Others are stricter because a sale (<i>mekach u'memkar</i>) is happening in your name, or because of <i>maris ayin</i> (how it looks). Some suggest structuring it so payment isn't processed until after Shabbos, or closing the booking system during your Shabbos window.</li>
<li>Friday California customers book while it's your Shabbos. How does that change the case?</li>
<li>Does it matter whether the booking is for a job done on a weekday?</li>
</ul>
<p><b>Customers messaging you.</b> Receiving a message isn't an act on your part. Reading it is.</p>
<p class="flag">Bring this exact list to a rav and get a psak for your setup. Confirm with a rav.</p>`,
    terms: [
      { t: "Mekach u'memkar", h: "מקח וממכר", m: "Buying and selling: rabbinically forbidden on Shabbos" },
      { t: "Maris ayin", h: "מראית עין", m: "How an action appears to others" },
      { t: "Hirhur", h: "הרהור", m: "Thinking; here, planning business in your mind" },
      { t: "Daber davar", h: "דבר דבר", m: "Speaking of weekday matters on Shabbos" }
    ],
    source: "Yeshayahu 58:13; Shulchan Aruch, Orach Chaim 306, 307; contemporary poskim on automated commerce (general: ask a rav)",
    doToday: "Write the exact questions in your notebook for a rav: (1) auto-replies, (2) automated booking on my Shabbos, (3) automated payments, (4) Friday California customers.",
    quiz: [
      { id: "m4-16-q1", t: "mc", q: "An email auto-reply set before Shabbos is:", o: ["Widely considered fine: it runs on its own", "Forbidden", "Allowed only on Yom Tov", "Only allowed if Ari set it"], a: 0, x: "Like a timer." },
      { id: "m4-16-q2", t: "tf", q: "Reading a customer message on Shabbos without replying is fine.", a: false, x: "False. Using the phone is forbidden, and it's business activity." },
      { id: "m4-16-q3", t: "mc", q: "Automated online sales on Shabbos:", o: ["Poskim differ; get a psak for your setup", "Always forbidden", "Always permitted", "Only a Chabad issue"], a: 0, x: "Many are lenient when fully automated; others are stricter." },
      { id: "m4-16-q4", t: "mc", q: "\"Daber davar\" means:", o: ["Not speaking about weekday matters on Shabbos", "Speaking Torah on Shabbos", "Speaking softly", "Answering messages"], a: 0, x: "Yeshayahu 58:13." },
      { id: "m4-16-q5", t: "recall", q: "Name two ways poskim sometimes suggest structuring automated sales to reduce the problem.", model: "Deferring payment processing until after Shabbos; closing the booking system during your Shabbos window; bookings only for weekday jobs.", x: "Your rav will decide which is needed." }
    ],
    deeper: [
      { id: "m4-16-d1", t: "recall", q: "Why might automated sales still be a concern even if no one acts on Shabbos?", model: "A transaction (mekach u'memkar) is being completed in your name on Shabbos, which some poskim consider problematic, and there may be maris ayin, as it looks like the business is open.", x: "Others are lenient because the system is like a timer." }
    ],
    reflect: "What part of Shabbos and the business makes you most anxious: losing customers, Ari's workload, or something else? Say it honestly.",
    sayIt: { phrase: "I set up auto-replies before Shabbos.", h: "", meaning: "You prepared in advance, the standard permitted approach.", when: "To Ari, or friends running businesses who ask how you manage." }
  },
  {
    id: "m4-17", title: "Business: your partner on Shabbos, and sechar Shabbos", minutes: 5, intro: false,
    teach: `
<p><b>Two questions.</b> Can the business operate on Shabbos while you keep it? And can you profit from what happens on Shabbos?</p>
<p><b>Sechar Shabbos.</b> Earning wages specifically for Shabbos work is rabbinically forbidden, even for permitted work. When Shabbos is included in a larger unit (weekly, monthly), it's permitted (<i>havla'ah</i>, Shulchan Aruch 306:4).</p>
<p><b>A partner who is not Jewish.</b> The Shulchan Aruch (Orach Chaim 245:1) describes a standard arrangement. If agreed at the start of the partnership, the non-Jewish partner takes the profits of Shabbos and the Jew takes the profits of another day. The non-Jew is then working for himself on Shabbos. Without such an arrangement, profits from Shabbos are problematic. This is often called a "Shabbos partnership".</p>
<p><b>A partner who is Jewish.</b> This is more complicated.</p>
<ul>
<li>You can't be a party to a Jew doing melacha on his Shabbos (lifnei iver, mesayea).</li>
<li>If the business runs on Saturday in California with Ari working, poskim discuss whether you can own part of it, and what arrangements (like a sale of your share for Shabbos, or restructuring) are needed.</li>
<li>If jobs happen only on weekdays, much of the problem falls away, though your Shabbos window (Friday morning PT) still matters.</li>
</ul>
<p><b>What Ari can do on your behalf.</b> Anything he does as your agent on Shabbos is a question. A clean handover before your Shabbos, with Ari acting for himself during it, is part of most solutions.</p>
<p class="flag">This is a real financial halacha question with serious stakes. Don't self-rule. Bring it to a rav who knows business halacha. Confirm with a rav.</p>`,
    terms: [
      { t: "Sechar Shabbos", h: "שכר שבת", m: "Wages earned for Shabbos" },
      { t: "Havla'ah", h: "הבלעה", m: "Absorption: Shabbos pay included in a larger period" },
      { t: "Shutfus", h: "שותפות", m: "Partnership" },
      { t: "Mesayea", h: "מסייע", m: "Assisting someone in a transgression" },
      { t: "Heter iska / Shabbos partnership", h: "", m: "Contractual arrangements poskim use to resolve business issues" }
    ],
    source: "Shulchan Aruch, Orach Chaim 245:1, 306:4; Shulchan Aruch HaRav, Orach Chaim 245, 306",
    doToday: "Write down the facts a rav will need: Is Ari Jewish? Do jobs happen on Saturdays in California? How are profits split? How do payments flow? Ask Zalmy who to bring it to.",
    quiz: [
      { id: "m4-17-q1", t: "mc", q: "Sechar Shabbos is permitted when:", o: ["Shabbos is included in a larger paid period (havla'ah)", "The work is easy", "Paid in cash", "Never"], a: 0, x: "SA 306:4." },
      { id: "m4-17-q2", t: "mc", q: "The Shulchan Aruch's arrangement for a Jew with a non-Jewish partner is:", o: ["The non-Jew takes Shabbos profits; the Jew takes another day's, agreed at the start", "The Jew closes the business", "Profits are given to tzedakah", "No solution exists"], a: 0, x: "OC 245:1." },
      { id: "m4-17-q3", t: "tf", q: "If Ari is Jewish and not observant, it doesn't matter halachically if he works on Saturday.", a: false, x: "False. You can't be a party to a Jew's melacha on Shabbos, and poskim discuss your ownership." },
      { id: "m4-17-q4", t: "mc", q: "Who should decide your business arrangement?", o: ["A rav who knows business halacha", "Ari", "An online forum", "You, by comparing opinions"], a: 0, x: "Confirm with a rav." },
      { id: "m4-17-q5", t: "recall", q: "List three facts a rav needs about your business to rule.", model: "Any three: whether Ari is Jewish; whether jobs are done on Saturdays; how profits are split; how bookings and payments work; whether employees work on Shabbos.", x: "The ruling depends on these." }
    ],
    deeper: [
      { id: "m4-17-d1", t: "recall", q: "Why must a Shabbos partnership be agreed at the start?", model: "If it's set up in advance, the non-Jew's Shabbos work is on his own account from the beginning. Retroactively splitting profits later looks like taking Shabbos profits and re-labeling them.", x: "SA 245:1 discusses cases where it wasn't stipulated." }
    ],
    reflect: "What would it mean for the business if you had to restructure for Shabbos? What would you gain, beyond the halacha?",
    sayIt: { phrase: "Let's ask a rav for a Shabbos arrangement.", h: "", meaning: "Setting the business up correctly with halachic guidance.", when: "When you raise the topic with Ari. It's calm and practical, not preachy." }
  }
]);
