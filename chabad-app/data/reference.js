/*
  CHABAD PATH: reference data
  Rebbeim, Chabad calendar, brachos lookup, 39 melachos.
  Edit freely. Dates are Hebrew dates with the civil year.
*/

window.REFERENCE = {
  rebbeim: [
    {
      n: 1, name: "The Alter Rebbe", full: "Rabbi Shneur Zalman of Liadi", h: "אדמו״ר הזקן",
      born: "18 Elul 5505 (1745), Liozna", passed: "24 Teves 5573 (1812), Piena; buried in Haditch",
      contribution: "Founded Chabad Chassidus. Wrote the Tanya, the Shulchan Aruch HaRav, and the Siddur; his maamarim are collected in Torah Or and Likkutei Torah.",
      story: "In 1798, after his opponents informed on him, he was arrested and held in the Peter and Paul Fortress in St. Petersburg. He was freed on 19 Kislev. Chassidim understand the release as Heaven's approval to spread Chassidus even more widely. 19 Kislev became the \"Rosh Hashanah of Chassidus\"."
    },
    {
      n: 2, name: "The Mitteler Rebbe", full: "Rabbi DovBer Schneuri", h: "אדמו״ר האמצעי",
      born: "9 Kislev 5534 (1773), Liozna", passed: "9 Kislev 5588 (1827), Nizhyn",
      contribution: "Moved the court to the town of Lubavitch. Explained Chassidus at great length and depth: Shaar HaYichud, Imrei Binah, Kuntres HaHispaalus.",
      story: "He was once so absorbed in learning that he didn't hear his baby crying when it fell from its cradle. The Alter Rebbe, learning upstairs, heard it, came down, and rocked the baby. Afterward he told his son that no matter how high your learning, you must never fail to hear a child cry. He was arrested in 1826 and freed on 10 Kislev."
    },
    {
      n: 3, name: "The Tzemach Tzedek", full: "Rabbi Menachem Mendel Schneersohn", h: "אדמו״ר הצמח צדק",
      born: "29 Elul 5549 (1789), Liozna", passed: "13 Nissan 5626 (1866), Lubavitch",
      contribution: "Grandson of the Alter Rebbe and son-in-law of the Mitteler Rebbe. A giant in both halacha (the Tzemach Tzedek responsa, after which he is named) and Chassidus (Or HaTorah, Derech Mitzvosecha). At the government's 1843 rabbinical conference in St. Petersburg, he fought plans to change Jewish education.",
      story: "A chassid came to him distressed about his seriously ill son. The Tzemach Tzedek told him: \"Tracht gut vet zain gut\": think good and it will be good. The son recovered. The line became a cornerstone of Chabad thinking on bitachon."
    },
    {
      n: 4, name: "The Rebbe Maharash", full: "Rabbi Shmuel Schneersohn", h: "אדמו״ר מהר״ש",
      born: "2 Iyar 5594 (1834), Lubavitch", passed: "13 Tishrei 5643 (1882), Lubavitch",
      contribution: "The youngest son of the Tzemach Tzedek. He traveled widely and lobbied government officials to protect Jews from persecution. His maamarim are collected in Likkutei Torah Toras Shmuel.",
      story: "His famous approach: \"The world says that if you can't go under an obstacle, try to go over it. I say: lechatchila ariber, go over from the start.\""
    },
    {
      n: 5, name: "The Rebbe Rashab", full: "Rabbi Sholom DovBer Schneersohn", h: "אדמו״ר הרש״ב",
      born: "20 Cheshvan 5621 (1860), Lubavitch", passed: "2 Nissan 5680 (1920), Rostov",
      contribution: "Founded the yeshiva Tomchei Temimim in 1897 and called its students soldiers of the House of Dovid. His systematic series of maamarim, Hemshech 5666 (Samach Vov), earned him the title \"the Rambam of Chassidus\".",
      story: "At about age four he came to his grandfather, the Tzemach Tzedek, crying: why did Hashem appear to Avraham and not to me? The answer: when a Jew of 99 decides he must circumcise himself, he deserves that Hashem appear to him."
    },
    {
      n: 6, name: "The Frierdiker Rebbe", full: "Rabbi Yosef Yitzchak Schneersohn (the Rebbe Rayatz)", h: "אדמו״ר הריי״צ",
      born: "12 Tammuz 5640 (1880), Lubavitch", passed: "10 Shvat 5710 (1950), New York",
      contribution: "He kept Judaism alive underground in Soviet Russia, then rebuilt Chabad in America from 1940, founding Merkos L'Inyonei Chinuch, Machne Israel, and Kehot at 770 Eastern Parkway.",
      story: "Arrested by the Soviets in 1927, he was threatened with a pistol during interrogation. He answered: \"Toys like that frighten a man who has many gods and one world. I have one G-d and two worlds.\" His death sentence was commuted, and news of his release came on 12 Tammuz, his birthday."
    },
    {
      n: 7, name: "The Rebbe", full: "Rabbi Menachem Mendel Schneerson", h: "כ״ק אדמו״ר",
      born: "11 Nissan 5662 (1902), Nikolaev", passed: "3 Tammuz 5754 (1994), New York; the Ohel is in Queens",
      contribution: "Accepted leadership on 10 Shvat 5711 (1951). Sent shluchim across the world, launched the mivtzoyim, instituted the daily Rambam cycle, and made bringing Moshiach through acts of goodness and kindness the central mission.",
      story: "From 1986, every Sunday the Rebbe stood for hours giving each visitor a dollar to give to tzedakah, making every person a giver. When asked how he didn't tire, the answer commonly told is: \"When you're counting diamonds, you don't get tired.\""
    }
  ],

  /* Chabad calendar: sorted by Hebrew month, starting with Tishrei */
  calendar: [
    { d: "6 Tishrei", name: "Yahrzeit of Rebbetzin Chana", what: "The Rebbe's mother (passed 1964).", marked: "Learning and tzedakah in her memory." },
    { d: "13 Tishrei", name: "Yahrzeit of the Rebbe Maharash", what: "The fourth Rebbe (passed 1882).", marked: "Farbrengens, learning his maamarim, and \"lechatchila ariber\"." },
    { d: "20 Cheshvan", name: "Chof Cheshvan", what: "Birthday of the Rebbe Rashab (1860).", marked: "Farbrengens; a special day for Tomchei Temimim students." },
    { d: "9 to 10 Kislev", name: "Yud Kislev", what: "Birth and passing of the Mitteler Rebbe (9th), and his release from prison (10th).", marked: "Farbrengens." },
    { d: "14 Kislev", name: "Yud Daled Kislev", what: "The Rebbe and Rebbetzin's wedding (1928).", marked: "Farbrengens." },
    { d: "19 Kislev", name: "Yud Tes Kislev", what: "The Alter Rebbe freed from prison (1798); also the yahrzeit of the Maggid of Mezritch. \"Rosh Hashanah of Chassidus\".", marked: "Farbrengens, dividing up the Shas for learning, and greeting: \"L'shanah tovah b'limud haChassidus uv'darkei haChassidus tikaseivu v'seichaseimu\"." },
    { d: "24 Teves", name: "Chof Daled Teves", what: "Yahrzeit of the Alter Rebbe (1812).", marked: "Learning Tanya and Shulchan Aruch HaRav; farbrengens." },
    { d: "10 Shvat", name: "Yud Shvat", what: "Passing of the Frierdiker Rebbe (1950), and one year later the Rebbe's acceptance of leadership (1951), with the maamar Basi L'Gani.", marked: "Farbrengens, learning Basi L'Gani, and hachlatos for shlichus." },
    { d: "22 Shvat", name: "Chof Beis Shvat", what: "Yahrzeit of Rebbetzin Chaya Mushka, the Rebbe's wife (1988).", marked: "Emphasis on women's and girls' activities." },
    { d: "25 Adar", name: "Chof Hei Adar", what: "Birthday of Rebbetzin Chaya Mushka (1901).", marked: "Farbrengens, especially by women." },
    { d: "2 Nissan", name: "Beis Nissan", what: "Yahrzeit of the Rebbe Rashab (1920), and the Frierdiker Rebbe's acceptance of leadership.", marked: "Farbrengens." },
    { d: "11 Nissan", name: "Yud Aleph Nissan", what: "The Rebbe's birthday (1902).", marked: "Starting the new chapter of Tehillim matching the Rebbe's new year of life, and farbrengens." },
    { d: "13 Nissan", name: "Yud Gimmel Nissan", what: "Yahrzeit of the Tzemach Tzedek (1866).", marked: "Farbrengens." },
    { d: "2 Iyar", name: "Beis Iyar", what: "Birthday of the Rebbe Maharash (1834).", marked: "Farbrengens." },
    { d: "28 Sivan", name: "Chof Ches Sivan", what: "The Rebbe and Rebbetzin arrived in the US (1941).", marked: "Farbrengens." },
    { d: "3 Tammuz", name: "Gimmel Tammuz", what: "The Rebbe's passing (1994).", marked: "Visiting the Ohel, learning, hachlatos, and strengthening the connection to the Rebbe." },
    { d: "12 to 13 Tammuz", name: "Yud Beis Tammuz", what: "Birthday of the Frierdiker Rebbe (1880), and his release from Soviet exile (1927).", marked: "Farbrengens; \"Chag HaGeulah\"." },
    { d: "20 Av", name: "Chof Av", what: "Yahrzeit of Rabbi Levi Yitzchak Schneerson, the Rebbe's father, who died in Soviet exile (1944).", marked: "Farbrengens and learning his writings." },
    { d: "15 Elul", name: "Tes Vov Elul", what: "Founding of Tomchei Temimim (1897).", marked: "Farbrengens in yeshivos." },
    { d: "18 Elul", name: "Chai Elul", what: "Birthday of the Baal Shem Tov (1698) and the Alter Rebbe (1745).", marked: "Farbrengens; the start of the final 12 days of the year." },
    { d: "29 Elul", name: "Chof Tes Elul", what: "Birthday of the Tzemach Tzedek (1789).", marked: "Noted on Erev Rosh Hashanah." }
  ],

  /* Brachos lookup: common foods. r = rishona, a = acharona, note = caveats */
  brachos: [
    { f: "Bread, pita, bagel, challah", r: "Hamotzi", a: "Birkas Hamazon", note: "Wash (netilas yadayim) first." },
    { f: "Cake, cookies, crackers, pretzels", r: "Mezonos", a: "Al HaMichya", note: "If you eat a meal-sized amount, it becomes Hamotzi and bentching. Ask about your exact case." },
    { f: "Pasta, noodles", r: "Mezonos", a: "Al HaMichya", note: "" },
    { f: "Oatmeal, Cheerios", r: "Mezonos", a: "Al HaMichya", note: "Oats are one of the five grains." },
    { f: "Rice (plain, cooked)", r: "Mezonos", a: "Borei Nefashos", note: "Rice is not one of the five grains, so the bracha after is Borei Nefashos." },
    { f: "Rice Krispies", r: "Mezonos", a: "Borei Nefashos", note: "" },
    { f: "Pizza", r: "Depends", a: "Depends", note: "Poskim debate whether pizza is ever mezonos. Ask Zalmy what Chabad poskim hold." },
    { f: "Wine, grape juice", r: "Hagafen", a: "Al HaGefen", note: "" },
    { f: "Grapes, dates, figs, olives, pomegranates", r: "Ha'etz", a: "Al Ha'etz", note: "Fruits of the seven species of Eretz Yisrael." },
    { f: "Apple, orange, pear, peach, plum", r: "Ha'etz", a: "Borei Nefashos", note: "" },
    { f: "Avocado", r: "Ha'etz", a: "Borei Nefashos", note: "" },
    { f: "Blueberries", r: "Ha'etz", a: "Borei Nefashos", note: "They grow on bushes whose branches last year to year." },
    { f: "Almonds, walnuts, pecans, cashews", r: "Ha'etz", a: "Borei Nefashos", note: "" },
    { f: "Banana", r: "Ha'adama", a: "Borei Nefashos", note: "The banana plant regrows from the ground each time, so it's not a halachic tree." },
    { f: "Strawberries", r: "Ha'adama", a: "Borei Nefashos", note: "" },
    { f: "Pineapple, watermelon, melon", r: "Ha'adama", a: "Borei Nefashos", note: "" },
    { f: "Potatoes, fries, potato chips", r: "Ha'adama", a: "Borei Nefashos", note: "" },
    { f: "Tomato, cucumber, carrot, lettuce", r: "Ha'adama", a: "Borei Nefashos", note: "" },
    { f: "Corn on the cob, popcorn", r: "Ha'adama", a: "Borei Nefashos", note: "" },
    { f: "Peanuts", r: "Ha'adama", a: "Borei Nefashos", note: "Peanuts grow in the ground." },
    { f: "Mushrooms", r: "Shehakol", a: "Borei Nefashos", note: "They don't draw nourishment from the ground in the normal way." },
    { f: "Meat, chicken, fish, eggs", r: "Shehakol", a: "Borei Nefashos", note: "" },
    { f: "Milk, cheese, yogurt", r: "Shehakol", a: "Borei Nefashos", note: "" },
    { f: "Water, soda, coffee, tea, beer", r: "Shehakol", a: "Borei Nefashos", note: "The bracha after a drink requires a revi'is drunk without a break." },
    { f: "Orange juice, apple juice", r: "Shehakol", a: "Borei Nefashos", note: "" },
    { f: "Chocolate, candy", r: "Shehakol", a: "Borei Nefashos", note: "" },
    { f: "Protein shake", r: "Shehakol", a: "Borei Nefashos", note: "Unless it's mainly grain, such as oats: then ask." },
    { f: "Cereal with milk", r: "Cereal's bracha", a: "Cereal's bracha acharona", note: "The milk is tafel to the cereal. Drinking the leftover milk on its own can be different; ask." }
  ],
  brachosNote: "The bracha acharona needs a k'zayis of food eaten within a short time, or a revi'is of drink. The Chabad rulings come from the Alter Rebbe's Seder Birchos HaNehenin. For anything not listed or unclear, ask Zalmy.",

  /* 39 melachos, in the standard groups (Mishnah Shabbos 7:2) */
  melachosIntro: "The Torah juxtaposes Shabbos with building the Mishkan. The Gemara (Shabbos 49b) derives that the forbidden categories of work are the kinds of work used to build it. Grouping follows the Mishnah's order (Shabbos 7:2).",
  melachos: [
    { g: "Growing and preparing food", why: "Growing and preparing plant dyes for the Mishkan's curtains. The Mishnah lists them in bread-making order.", items: [
      { n: "Zorea", h: "זורע", m: "Planting", ex: "Watering plants or a lawn" },
      { n: "Choresh", h: "חורש", m: "Plowing", ex: "Dragging a heavy bench that digs a furrow in the soil" },
      { n: "Kotzer", h: "קוצר", m: "Reaping", ex: "Picking a fruit or leaf off a plant" },
      { n: "Me'amer", h: "מעמר", m: "Gathering", ex: "Collecting fallen fruit into a pile where it grew" },
      { n: "Dash", h: "דש", m: "Threshing", ex: "Squeezing juice out of fruit (sechitah)" },
      { n: "Zoreh", h: "זורה", m: "Winnowing", ex: "Separating chaff by wind" },
      { n: "Borer", h: "בורר", m: "Selecting", ex: "Picking the bones out of fish, leaving the meat" },
      { n: "Tochen", h: "טוחן", m: "Grinding", ex: "Grinding spices; chopping vegetables very fine" },
      { n: "Merakeid", h: "מרקד", m: "Sifting", ex: "Using a sieve or strainer" },
      { n: "Lash", h: "לש", m: "Kneading", ex: "Mixing a thick batter or mash" },
      { n: "Ofeh / Bishul", h: "אופה / בישול", m: "Baking / cooking", ex: "Cooking raw food; pouring from a kli rishon onto raw food" }
    ]},
    { g: "Making cloth", why: "Producing the wool and linen curtains of the Mishkan.", items: [
      { n: "Gozez", h: "גוזז", m: "Shearing", ex: "Cutting hair or nails" },
      { n: "Melabein", h: "מלבן", m: "Whitening", ex: "Laundering; soaking a stain out" },
      { n: "Menapetz", h: "מנפץ", m: "Combing raw fibers", ex: "Combing wool" },
      { n: "Tzovea", h: "צובע", m: "Dyeing", ex: "Coloring fabric" },
      { n: "Toveh", h: "טווה", m: "Spinning", ex: "Spinning thread" },
      { n: "Meisach", h: "מיסך", m: "Setting the warp", ex: "Mounting threads on a loom" },
      { n: "Oseh shtei batei nirin", h: "עושה שתי בתי נירין", m: "Making loops (heddles)", ex: "Preparing the loom" },
      { n: "Oreg", h: "אורג", m: "Weaving", ex: "Weaving; braiding" },
      { n: "Potzea", h: "פוצע", m: "Separating threads", ex: "Unraveling woven threads" },
      { n: "Kosher", h: "קושר", m: "Tying", ex: "Tying a permanent knot" },
      { n: "Matir", h: "מתיר", m: "Untying", ex: "Untying a permanent knot" },
      { n: "Tofer", h: "תופר", m: "Sewing", ex: "Sewing; stapling papers together" },
      { n: "Kore'a", h: "קורע", m: "Tearing", ex: "Tearing in order to sew; some ways of opening packages" }
    ]},
    { g: "Making leather", why: "Preparing the animal hides that covered the Mishkan.", items: [
      { n: "Tzad", h: "צד", m: "Trapping", ex: "Catching an animal or insect" },
      { n: "Shochet", h: "שוחט", m: "Slaughtering", ex: "Killing; causing bleeding under the skin" },
      { n: "Mafshit", h: "מפשיט", m: "Skinning", ex: "Removing a hide" },
      { n: "Me'abeid", h: "מעבד", m: "Tanning", ex: "Processing hide" },
      { n: "Memachek", h: "ממחק", m: "Smoothing", ex: "Smearing cream or ointment smooth" },
      { n: "Mesartet", h: "משרטט", m: "Scoring lines", ex: "Marking lines to cut along" },
      { n: "Mechatech", h: "מחתך", m: "Cutting to size", ex: "Cutting paper or material to a precise shape" }
    ]},
    { g: "Writing", why: "Letters were written on the Mishkan's beams to match them up.", items: [
      { n: "Koseiv", h: "כותב", m: "Writing", ex: "Writing two letters; typing" },
      { n: "Mochek", h: "מוחק", m: "Erasing", ex: "Erasing in order to write" }
    ]},
    { g: "Building", why: "Erecting and taking down the Mishkan.", items: [
      { n: "Boneh", h: "בונה", m: "Building", ex: "Building; assembling a structure" },
      { n: "Soser", h: "סותר", m: "Demolishing", ex: "Taking apart a structure" }
    ]},
    { g: "Fire", why: "Fire was used for cooking dyes and working metal.", items: [
      { n: "Mechabeh", h: "מכבה", m: "Extinguishing", ex: "Putting out a flame" },
      { n: "Mav'ir", h: "מבעיר", m: "Kindling", ex: "Lighting a fire" }
    ]},
    { g: "Finishing", why: "The final blow that completed each part.", items: [
      { n: "Makeh B'patish", h: "מכה בפטיש", m: "The final hammer blow", ex: "Completing or fixing an object so it's usable" }
    ]},
    { g: "Carrying", why: "Carrying materials between domains in the camp.", items: [
      { n: "Hotza'ah", h: "הוצאה", m: "Carrying", ex: "Carrying between a private and public domain, or four amos in a public domain" }
    ]}
  ]
};
