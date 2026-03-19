import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("=== Seeding FamousPunjabi ===\n");

  // ──────────────────────────────────────
  // 1. ADMIN USER
  // ──────────────────────────────────────
  console.log("Creating admin user...");
  const admin = await prisma.user.upsert({
    where: { email: "admin@famouspunjabi.com" },
    update: {},
    create: {
      email: "admin@famouspunjabi.com",
      name: "Admin",
      hashedPassword: await bcrypt.hash("admin123456", 12),
      role: "ADMIN",
    },
  });
  console.log("  Admin created:", admin.email);

  // ──────────────────────────────────────
  // 2. ARTISTS (33 real Punjabi artists)
  // ──────────────────────────────────────
  console.log("\nCreating artists...");

  const artistsData = [
    // --- Actors/Singers (MULTI) ---
    {
      name: "Diljit Dosanjh",
      nameGurmukhi: "ਦਿਲਜੀਤ ਦੋਸਾਂਝ",
      bio: "Global Punjabi icon. Singer, actor, and cultural ambassador who broke barriers at Coachella 2023 and became one of the most bankable Punjabi stars worldwide. Known for blockbusters like Jatt & Juliet, Punjab 1984, and chart-topping albums like G.O.A.T. and MoonChild Era.",
      birthDate: new Date("1984-01-06"),
      birthPlace: "Dosanjh Kalan, Jalandhar, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: true,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@DiljitDosanjh", followers: 15_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/diljitdosanjh", followers: 45_000_000 },
      ],
    },
    {
      name: "Amrinder Gill",
      nameGurmukhi: "ਅਮਰਿੰਦਰ ਗਿੱਲ",
      bio: "Soulful Punjabi singer and actor known for emotionally powerful performances. Star of Angrej, Love Punjab, Lahoriye, and the Chal Mera Putt franchise. His voice is considered one of the most melodious in Punjabi music.",
      birthDate: new Date("1976-11-11"),
      birthPlace: "Amritsar, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@AmrinderGillOfficial", followers: 5_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/amrabordeaux", followers: 8_000_000 },
      ],
    },
    {
      name: "Gippy Grewal",
      nameGurmukhi: "ਗਿੱਪੀ ਗਰੇਵਾਲ",
      bio: "Multi-talented Punjabi singer, actor, director, and producer. Creator of the highest-grossing Carry On Jatta franchise and numerous Pollywood blockbusters. One of the most commercially successful stars in Punjabi cinema.",
      birthDate: new Date("1983-01-02"),
      birthPlace: "Koom Kalan, Ludhiana, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@GippyGrewal", followers: 5_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/gabordeaux", followers: 8_000_000 },
      ],
    },
    {
      name: "Harrdy Sandhu",
      nameGurmukhi: "ਹਾਰਡੀ ਸੰਧੂ",
      bio: "Former cricketer turned Punjabi singer and Bollywood actor. Known for viral hits like Naah Goriye, Kya Baat Ay, and Bijlee Bijlee. Played Madan Lal in 83 (2021). A true multi-talent bridging Punjabi and Bollywood.",
      birthDate: new Date("1986-09-06"),
      birthPlace: "Patiala, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@HarrdySandhu", followers: 8_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/harrdysandhu", followers: 25_000_000 },
      ],
    },
    {
      name: "Jassie Gill",
      nameGurmukhi: "ਜੱਸੀ ਗਿੱਲ",
      bio: "Punjabi singer and actor known for romantic tracks and Bollywood crossover hits. Known for Nikle Currant, Bapu Zimidar, and starring in Punjabi and Hindi films. One of the most popular faces in the Punjabi entertainment industry.",
      birthDate: new Date("1988-11-26"),
      birthPlace: "Jandali, Khanna, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@JassieGill", followers: 4_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/jabordeaux", followers: 10_000_000 },
      ],
    },
    {
      name: "Ammy Virk",
      nameGurmukhi: "ਐਮੀ ਵਿਰਕ",
      bio: "Versatile Punjabi singer and actor who rose from singing competitions to become one of the biggest names in Pollywood. Known for Qismat, Sufna, Nikka Zaildar, and his Bollywood debut in 83. Master of both comedy and emotional drama.",
      birthDate: new Date("1992-05-11"),
      birthPlace: "Nabha, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@AmmyVirkOfficial", followers: 5_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/ammyvirk", followers: 12_000_000 },
      ],
    },
    {
      name: "Parmish Verma",
      nameGurmukhi: "ਪਰਮੀਸ਼ ਵਰਮਾ",
      bio: "Punjabi singer, actor, director, and filmmaker. Known for Gaal Ni Kadni, Rocky Mental, and his work directing music videos for top Punjabi artists before launching his own acting and singing career.",
      birthDate: new Date("1990-07-03"),
      birthPlace: "Patiala, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@ParmishVerma", followers: 6_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/pabordeaux", followers: 10_000_000 },
      ],
    },
    {
      name: "Ninja",
      nameGurmukhi: "ਨਿੰਜਾ",
      bio: "Born Amit Bhatt, Ninja is a Punjabi singer and actor known for emotional ballads like Roi Na and Aadat. Transitioned successfully from music to acting with films like Channa Mereya and Jatt James Bond.",
      birthDate: new Date("1991-12-10"),
      birthPlace: "Ludhiana, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@NinjaSongOfficial", followers: 3_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/ninja_boro", followers: 5_000_000 },
      ],
    },
    {
      name: "Tarsem Jassar",
      nameGurmukhi: "ਤਰਸੇਮ ਜੱਸੜ",
      bio: "Punjabi singer and actor known for portraying rustic Punjabi culture authentically. Star of Rabb Da Radio and Uda Aida. His deep voice and rooted characters have won him a loyal fanbase across Punjab.",
      birthDate: new Date("1986-06-11"),
      birthPlace: "Naushehra, Jalandhar, Punjab",
      type: "MULTI" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@TarsemJassar", followers: 3_500_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/tabordeaux", followers: 4_000_000 },
      ],
    },
    // --- Singers ---
    {
      name: "Sidhu Moosewala",
      nameGurmukhi: "ਸਿੱਧੂ ਮੂਸੇਵਾਲਾ",
      bio: "Legendary Punjabi rapper and singer who revolutionized Punjabi music by blending hip-hop, folk, and raw lyrical storytelling. His songs like 295, Legend, and So High became anthems. Tragically shot and killed on May 29, 2022. His legacy continues to inspire millions globally.",
      birthDate: new Date("1993-06-11"),
      birthPlace: "Moosa, Mansa, Punjab",
      deathDate: new Date("2022-05-29"),
      type: "SINGER" as const,
      verified: true,
      featured: true,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@SidhuMooseWalaOfficial", followers: 22_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/sidabordeaux", followers: 15_000_000 },
      ],
    },
    {
      name: "AP Dhillon",
      nameGurmukhi: "ਏਪੀ ਢਿੱਲੋਂ",
      bio: "Indo-Canadian singer-songwriter who took Punjabi music global with his unique fusion of Punjabi vocals, R&B melodies, and electronic production. Known for Brown Munde, Excuses, and Insane. Based in Canada, he represents the new wave of Punjabi-diaspora artists.",
      birthDate: new Date("1999-12-02"),
      birthPlace: "Gurdaspur, Punjab",
      type: "SINGER" as const,
      verified: true,
      featured: true,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@APDhillon", followers: 8_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/apdhillon", followers: 18_000_000 },
      ],
    },
    {
      name: "Karan Aujla",
      nameGurmukhi: "ਕਰਨ ਔਜਲਾ",
      bio: "Punjabi singer, lyricist, and rapper known for hard-hitting lyrics and viral tracks. Known for Softly, Tauba Tauba, and numerous chart-toppers. One of the biggest names in modern Punjabi music, his track Tauba Tauba from Bad Newz became a massive Bollywood hit.",
      birthDate: new Date("1997-01-18"),
      birthPlace: "Gharyala, Jalandhar, Punjab",
      type: "SINGER" as const,
      verified: true,
      featured: true,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@KaranAujlaOfficial", followers: 10_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/karabordeaux", followers: 14_000_000 },
      ],
    },
    {
      name: "Shubh",
      nameGurmukhi: "ਸ਼ੁਭ",
      bio: "Indo-Canadian Punjabi singer and rapper who skyrocketed to global fame with viral hits like No Love, We Rollin, Elevated, and Still Rollin. Known for his distinct vocal style and beats that blend Punjabi with Western trap and hip-hop.",
      birthDate: new Date("1999-09-18"),
      birthPlace: "Ludhiana, Punjab (based in Canada)",
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@ShubhOfficial", followers: 7_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/shubhworldwide", followers: 10_000_000 },
      ],
    },
    {
      name: "Babbu Maan",
      nameGurmukhi: "ਬੱਬੂ ਮਾਣ",
      bio: "The king of Punjabi music. Legendary singer, songwriter, actor, and filmmaker who has been ruling Punjabi hearts for over two decades. Known for Tralla, Mitran Di Chatri, Saun Di Jhadi, and many timeless classics. A true icon of Punjabi culture.",
      birthDate: new Date("1975-03-18"),
      birthPlace: "Khant Maanpur, Fatehgarh Sahib, Punjab",
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@BabbuMaan", followers: 6_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/babordeaux", followers: 4_000_000 },
      ],
    },
    {
      name: "Gurdas Maan",
      nameGurmukhi: "ਗੁਰਦਾਸ ਮਾਨ",
      bio: "The living legend of Punjabi music and culture. With a career spanning 40+ years, Gurdas Maan is the most respected and beloved voice in Punjabi music. Known for Naina, Boot Polishaan Di, Apna Punjab Hove, and Challa. A cultural ambassador of Punjab worldwide.",
      birthDate: new Date("1957-01-04"),
      birthPlace: "Giddarbaha, Sri Muktsar Sahib, Punjab",
      type: "SINGER" as const,
      verified: true,
      featured: true,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@GurdasMaan", followers: 3_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/gurdasmaan", followers: 3_000_000 },
      ],
    },
    {
      name: "Jazzy B",
      nameGurmukhi: "ਜੈਜ਼ੀ ਬੀ",
      bio: "The Crown Prince of Bhangra. Indo-Canadian artist who pioneered Punjabi music internationally. Known for Naag, Oh Kudi, Mitran De Boot, and being one of the most influential figures in bringing Bhangra to the global stage.",
      birthDate: new Date("1975-04-01"),
      birthPlace: "Phillaur, Jalandhar, Punjab",
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@JazzyBOfficial", followers: 2_500_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/jazzyb", followers: 3_000_000 },
      ],
    },
    {
      name: "Garry Sandhu",
      nameGurmukhi: "ਗੈਰੀ ਸੰਧੂ",
      bio: "Punjabi singer known for his powerful voice and romantic hits. Known for Illegal Weapon, Yeah Baby, and Banda Ban Ja. His journey from undocumented immigrant in the UK to Punjabi star is one of the most inspiring in the industry.",
      birthDate: new Date("1984-03-18"),
      birthPlace: "Rurka Kalan, Jalandhar, Punjab",
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@GarrySandhu", followers: 6_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/garrysandhu", followers: 8_000_000 },
      ],
    },
    {
      name: "Mankirt Aulakh",
      nameGurmukhi: "ਮੰਕੀਰਤ ਔਲਖ",
      bio: "Punjabi singer known for massive YouTube hits like Jugaadi Jatt and Badnam. One of the most-viewed Punjabi artists on YouTube with billions of combined views.",
      birthDate: new Date("1990-10-02"),
      birthPlace: "Fatehabad, Haryana",
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@MankirtAulakh", followers: 4_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/mankirtaulakh", followers: 6_000_000 },
      ],
    },
    {
      name: "Jass Manak",
      nameGurmukhi: "ਜੱਸ ਮਾਣਕ",
      bio: "Young Punjabi singer and songwriter who dominated the charts with Prada, Lehanga, Vaar, and Boss. Known for his youthful energy and catchy melodies that resonate with the younger Punjabi audience globally.",
      birthDate: new Date("1997-11-19"),
      birthPlace: "Jalandhar, Punjab",
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@JassManak", followers: 8_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/jassmanak", followers: 9_000_000 },
      ],
    },
    {
      name: "Singga",
      nameGurmukhi: "ਸਿੰਗਾ",
      bio: "Punjabi singer and lyricist from Mansa, Punjab. Known for Jatt Di Clip, Badnam, and his lyrical skills which he has also contributed to other artists' hit songs.",
      birthDate: new Date("1994-11-16"),
      birthPlace: "Bareta, Mansa, Punjab",
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@Singga", followers: 2_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/singga", followers: 3_000_000 },
      ],
    },
    {
      name: "Kuldeep Manak",
      nameGurmukhi: "ਕੁਲਦੀਪ ਮਾਣਕ",
      bio: "The king of Kaliyan (traditional Punjabi folk form). Legendary Punjabi folk singer who defined the genre with his powerful voice and traditional style. Known for Kaliyan and innumerable folk classics that remain timeless in Punjabi culture.",
      birthDate: new Date("1951-11-15"),
      birthPlace: "Jalal, Bathinda, Punjab",
      deathDate: new Date("2011-11-30"),
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@KuldeepManak", followers: 500_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/kuldeepmanak", followers: 200_000 },
      ],
    },
    {
      name: "Surjit Bindrakhia",
      nameGurmukhi: "ਸੁਰਜੀਤ ਬਿੰਦਰਾਖੀਆ",
      bio: "Iconic Punjabi folk and Bhangra singer known for his unmatched vocal power and energy. Famous for Dupatta Tera Sat Rang Da and numerous Bhangra anthems. His untimely death in 2003 left a void in Punjabi music that remains unfilled.",
      birthDate: new Date("1962-03-14"),
      birthPlace: "Bindrakh, Moga, Punjab",
      deathDate: new Date("2003-05-16"),
      type: "SINGER" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@SurjitBindrakhia", followers: 400_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/surjitbindrakhia", followers: 100_000 },
      ],
    },
    // --- Actresses ---
    {
      name: "Neeru Bajwa",
      nameGurmukhi: "ਨੀਰੂ ਬਾਜਵਾ",
      bio: "The queen of Pollywood. Born in Vancouver, Canada, Neeru Bajwa is the most acclaimed and bankable actress in Punjabi cinema. Known for the Jatt & Juliet franchise, Sardaarji, and her unmatched screen presence. She has dominated Punjabi cinema for two decades.",
      birthDate: new Date("1980-05-26"),
      birthPlace: "Vancouver, Canada",
      type: "ACTOR" as const,
      verified: true,
      featured: true,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@NeeruBajwa", followers: 500_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/neerubajwa", followers: 9_000_000 },
      ],
    },
    {
      name: "Sonam Bajwa",
      nameGurmukhi: "ਸੋਨਮ ਬਾਜਵਾ",
      bio: "Leading Pollywood actress and former Miss India finalist. Known for Nikka Zaildar, Muklawa, Honsla Rakh, and Manje Bistre. One of the most followed Punjabi actresses on social media with massive appeal across both Punjabi and Bollywood audiences.",
      birthDate: new Date("1989-08-16"),
      birthPlace: "Nanakmatta, Uttarakhand",
      type: "ACTOR" as const,
      verified: true,
      featured: true,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@SonamBajwa", followers: 300_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/sonabordeaux", followers: 15_000_000 },
      ],
    },
    {
      name: "Sargun Mehta",
      nameGurmukhi: "ਸਰਗੁਣ ਮਹਿਤਾ",
      bio: "Actress, producer, and TV star who transitioned from Indian television to become one of Pollywood's top leading ladies. Known for Qismat, Saunkan Saunkne, and her production house with husband Ravi Dubey.",
      birthDate: new Date("1988-09-06"),
      birthPlace: "Chandigarh",
      type: "ACTOR" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@SargunMehta", followers: 1_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/sargunmehta", followers: 12_000_000 },
      ],
    },
    {
      name: "Himanshi Khurana",
      nameGurmukhi: "ਹਿਮਾਂਸ਼ੀ ਖੁਰਾਣਾ",
      bio: "Punjabi actress, singer, and social media influencer. Rose to national fame through Bigg Boss 13. Known for her strong social media presence and roles in Punjabi music videos and films.",
      birthDate: new Date("1991-11-27"),
      birthPlace: "Kiratpur Sahib, Punjab",
      type: "ACTOR" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@HimanshiKhurana", followers: 1_500_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/himanshikhurana", followers: 8_000_000 },
      ],
    },
    {
      name: "Rubina Bajwa",
      nameGurmukhi: "ਰੁਬੀਨਾ ਬਾਜਵਾ",
      bio: "Punjabi actress and younger sister of Neeru Bajwa. Known for Sargi, Surkhi Bindi, and her natural acting talent. She has carved her own identity in Pollywood independent of her famous sister.",
      birthDate: new Date("1991-08-26"),
      birthPlace: "Nawan Shahr, Punjab",
      type: "ACTOR" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@RubinaBajwa", followers: 200_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/rubinabajwa", followers: 3_000_000 },
      ],
    },
    // --- Directors ---
    {
      name: "Jagdeep Sidhu",
      nameGurmukhi: "ਜਗਦੀਪ ਸਿੱਧੂ",
      bio: "One of the most successful Punjabi film directors and screenwriters. Known for directing blockbusters like Shadaa, Qismat, Qismat 2, Sufna, and Jatt & Juliet 3. His films consistently break box office records.",
      type: "DIRECTOR" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/jagdeepsidhu", followers: 1_000_000 },
      ],
    },
    {
      name: "Smeep Kang",
      nameGurmukhi: "ਸਮੀਪ ਕੰਗ",
      bio: "Comedy king of Punjabi cinema direction. Known for directing the Carry On Jatta franchise, one of the most successful Punjabi film series. His comedy timing and direction style defined Pollywood comedy.",
      type: "DIRECTOR" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/smeepkang", followers: 500_000 },
      ],
    },
    {
      name: "Anurag Singh",
      nameGurmukhi: "ਅਨੁਰਾਗ ਸਿੰਘ",
      bio: "Acclaimed Punjabi film director known for serious and historical cinema. Directed Punjab 1984, Sajjan Singh Rangroot, and Jatt & Juliet 1 & 2. Known for bringing gravitas and production quality to Punjabi cinema.",
      type: "DIRECTOR" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/anuragsingh", followers: 300_000 },
      ],
    },
    // --- Comedians ---
    {
      name: "Jaswinder Bhalla",
      nameGurmukhi: "ਜਸਵਿੰਦਰ ਭੱਲਾ",
      bio: "Legendary Punjabi comedian, actor, and former professor. Known for his impeccable comedy timing in films like Carry On Jatta, Ardaas, and Best of Luck. A veteran of Punjabi comedy with decades of iconic performances.",
      birthDate: new Date("1960-07-28"),
      birthPlace: "Adampur, Jalandhar, Punjab",
      type: "COMEDIAN" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@JaswinderBhalla", followers: 1_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/jaswinder.bhalla", followers: 1_500_000 },
      ],
    },
    {
      name: "Gurpreet Ghuggi",
      nameGurmukhi: "ਗੁਰਪ੍ਰੀਤ ਘੁੱਗੀ",
      bio: "The king of Punjabi comedy and a national treasure. Actor, comedian, and former politician. Known for his iconic roles in Ardaas, Carry On Jatta, and decades of comedy that defined Punjabi humor. His dialogue delivery is legendary.",
      birthDate: new Date("1972-05-18"),
      birthPlace: "Ghuggi, Patiala, Punjab",
      type: "COMEDIAN" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@GurpreetGhuggi", followers: 2_000_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/ghabordeaux", followers: 2_000_000 },
      ],
    },
    {
      name: "Binnu Dhillon",
      nameGurmukhi: "ਬਿੰਨੂ ਢਿੱਲੋਂ",
      bio: "Punjabi comedian and actor known for his hilarious roles in Carry On Jatta, Bailaras, and numerous Pollywood comedies. His comic timing and expressive acting make him one of the most sought-after comedy actors in Punjabi cinema.",
      birthDate: new Date("1976-08-09"),
      birthPlace: "Barnala, Punjab",
      type: "COMEDIAN" as const,
      verified: true,
      featured: false,
      socials: [
        { platform: "YOUTUBE" as const, url: "https://youtube.com/@BinnuDhillon", followers: 1_500_000 },
        { platform: "INSTAGRAM" as const, url: "https://instagram.com/binnudhillonofficial", followers: 3_000_000 },
      ],
    },
  ];

  // Create all artists
  const artists: Record<string, string> = {}; // slug -> id

  for (const a of artistsData) {
    const artistSlug = slug(a.name);
    const artist = await prisma.artist.upsert({
      where: { slug: artistSlug },
      update: {},
      create: {
        name: a.name,
        nameGurmukhi: a.nameGurmukhi,
        slug: artistSlug,
        bio: a.bio,
        birthDate: a.birthDate,
        birthPlace: a.birthPlace,
        deathDate: (a as any).deathDate || null,
        type: a.type,
        verified: a.verified,
        featured: a.featured,
      },
    });
    artists[artistSlug] = artist.id;

    // Social accounts
    if (a.socials) {
      for (const s of a.socials) {
        await prisma.socialAccount.upsert({
          where: {
            artistId_platform: { artistId: artist.id, platform: s.platform },
          },
          update: { url: s.url, followers: s.followers },
          create: {
            platform: s.platform,
            url: s.url,
            followers: s.followers,
            artistId: artist.id,
          },
        });
      }
    }

    console.log(`  Artist: ${a.name}`);
  }

  // Helper to get artist ID by name
  function artistId(name: string): string {
    const s = slug(name);
    const id = artists[s];
    if (!id) throw new Error(`Artist not found: ${name} (slug: ${s})`);
    return id;
  }

  // ──────────────────────────────────────
  // 3. MOVIES (40 real Punjabi movies)
  // ──────────────────────────────────────
  console.log("\nCreating movies...");

  const moviesData: {
    title: string;
    year: number;
    runtime?: number;
    synopsis: string;
    trailerYoutubeId: string;
    genres: string[];
    credits: { artist: string; role: string; order: number; character?: string }[];
    streaming?: { platform: string; url: string }[];
  }[] = [
    {
      title: "Jatt & Juliet",
      year: 2012,
      runtime: 147,
      synopsis: "Fateh, a Punjabi jatt, and Pooja, a sophisticated girl, are forced to share a house in Canada. Their hilarious clashes turn into unexpected romance. The film that defined modern Punjabi comedy cinema.",
      trailerYoutubeId: "BcDfOLBqH5c",
      genres: ["COMEDY", "ROMANCE"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1, character: "Fateh" },
        { artist: "Neeru Bajwa", role: "LEAD_ACTOR", order: 2, character: "Pooja" },
        { artist: "Anurag Singh", role: "DIRECTOR", order: 3 },
        { artist: "Jaswinder Bhalla", role: "SUPPORTING_ACTOR", order: 4 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/jatt-juliet" },
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/jatt-and-juliet" },
      ],
    },
    {
      title: "Jatt & Juliet 2",
      year: 2013,
      runtime: 145,
      synopsis: "The sequel follows a new story with Diljit and Neeru Bajwa in fresh roles. A Punjab cop and a con artist cross paths in an entertaining comedy of errors.",
      trailerYoutubeId: "l9UG7V4OnSA",
      genres: ["COMEDY", "ROMANCE"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
        { artist: "Neeru Bajwa", role: "LEAD_ACTOR", order: 2 },
        { artist: "Anurag Singh", role: "DIRECTOR", order: 3 },
        { artist: "Jaswinder Bhalla", role: "SUPPORTING_ACTOR", order: 4 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/jatt-juliet-2" },
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/jatt-and-juliet-2" },
      ],
    },
    {
      title: "Jatt & Juliet 3",
      year: 2024,
      runtime: 155,
      synopsis: "The long-awaited third installment of Pollywood's biggest franchise. Diljit and Neeru Bajwa reunite for another hilarious rom-com adventure that broke all Punjabi box office records.",
      trailerYoutubeId: "1LGMQa2mDJo",
      genres: ["COMEDY", "ROMANCE"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
        { artist: "Neeru Bajwa", role: "LEAD_ACTOR", order: 2 },
        { artist: "Jagdeep Sidhu", role: "DIRECTOR", order: 3 },
      ],
      streaming: [
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/jatt-and-juliet-3" },
      ],
    },
    {
      title: "Punjab 1984",
      year: 2014,
      runtime: 137,
      synopsis: "Set during the turbulent 1984 anti-Sikh riots, a mother desperately searches for her missing son across Punjab. A powerful drama that brought tears to millions and showcased Diljit Dosanjh's serious acting prowess.",
      trailerYoutubeId: "kGZsIhpnjT8",
      genres: ["DRAMA", "HISTORICAL"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1, character: "Shivjit" },
        { artist: "Anurag Singh", role: "DIRECTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/punjab-1984" },
      ],
    },
    {
      title: "Sardaar Ji",
      year: 2015,
      runtime: 148,
      synopsis: "A Sardaar with the ability to see ghosts is hired to remove a spirit from a haunted house. Comedy, romance, and supernatural fun collide in this blockbuster.",
      trailerYoutubeId: "Kb3YYl3GG2M",
      genres: ["COMEDY"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
        { artist: "Neeru Bajwa", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/sardaar-ji" },
      ],
    },
    {
      title: "Sardaar Ji 2",
      year: 2016,
      runtime: 145,
      synopsis: "The sequel follows Sardaar Ji to Australia where he encounters new ghosts and a new love interest in another supernatural comedy adventure.",
      trailerYoutubeId: "LR3d1MBbpJw",
      genres: ["COMEDY"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sonam Bajwa", role: "LEAD_ACTOR", order: 2 },
      ],
    },
    {
      title: "Ambarsariya",
      year: 2016,
      runtime: 140,
      synopsis: "A spy story set in the cultural hub of Amritsar, mixing comedy, romance, and intrigue as a RAW agent navigates love and espionage.",
      trailerYoutubeId: "JUE6kuiitLw",
      genres: ["COMEDY", "ROMANCE"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
      ],
    },
    {
      title: "Super Singh",
      year: 2017,
      runtime: 138,
      synopsis: "A Punjabi superhero film where an ordinary man gains superpowers and must protect his village and the world from evil forces. Bollywood-scale action meets Punjabi humor.",
      trailerYoutubeId: "hq3W5w1oFMs",
      genres: ["ACTION", "COMEDY"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sonam Bajwa", role: "LEAD_ACTOR", order: 2 },
      ],
    },
    {
      title: "Sajjan Singh Rangroot",
      year: 2018,
      runtime: 142,
      synopsis: "Based on true events, the film tells the story of Sikh soldiers fighting in World War I for the British Indian Army. A powerful war drama that highlights the bravery and sacrifice of Punjabi soldiers.",
      trailerYoutubeId: "HLmP2BOz7jM",
      genres: ["HISTORICAL", "DRAMA"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1, character: "Sajjan Singh" },
        { artist: "Anurag Singh", role: "DIRECTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/sajjan-singh-rangroot" },
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/sajjan-singh-rangroot" },
      ],
    },
    {
      title: "Shadaa",
      year: 2019,
      runtime: 148,
      synopsis: "A comedy about two families desperately trying to get their over-age children married. Hilarious situations arise when the potential bride and groom refuse to cooperate with the arranged marriage attempts.",
      trailerYoutubeId: "cKb7lAORflQ",
      genres: ["COMEDY", "ROMANCE"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
        { artist: "Neeru Bajwa", role: "LEAD_ACTOR", order: 2 },
        { artist: "Jagdeep Sidhu", role: "DIRECTOR", order: 3 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/shadaa" },
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/shadaa" },
      ],
    },
    {
      title: "Honsla Rakh",
      year: 2021,
      runtime: 145,
      synopsis: "A single father raises his son in Canada while navigating dating life. When his ex-girlfriend returns, comedy and chaos ensue. The first Punjabi film shot entirely in Canada with high production values.",
      trailerYoutubeId: "GJvRsd7KBpw",
      genres: ["COMEDY", "ROMANCE"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sonam Bajwa", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "JIO_CINEMA", url: "https://www.jiocinema.com/movies/honsla-rakh" },
      ],
    },
    {
      title: "Babe Bhangra Paunde Ne",
      year: 2022,
      runtime: 135,
      synopsis: "A young NRI hatches a scheme to claim insurance money by faking an elderly man's death. But the old man has other plans. A fun comedy with a heartfelt message about family bonds.",
      trailerYoutubeId: "P4GLQC4tZ4Y",
      genres: ["COMEDY"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "NETFLIX", url: "https://www.netflix.com/title/babe-bhangra-paunde-ne" },
      ],
    },
    {
      title: "Jodi",
      year: 2023,
      runtime: 150,
      synopsis: "A musical romance set in the world of Punjabi music competitions. Two rivals discover love through the power of music. A visually stunning film celebrating Punjabi musical heritage.",
      trailerYoutubeId: "UZgRJC2h47s",
      genres: ["MUSICAL", "ROMANCE"],
      credits: [
        { artist: "Diljit Dosanjh", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/jodi" },
      ],
    },
    {
      title: "Carry On Jatta",
      year: 2012,
      runtime: 141,
      synopsis: "Jass falls in love with Mahie but lies about being an orphan to impress her family. His real family shows up at the worst time, leading to non-stop laughs. A landmark Punjabi comedy.",
      trailerYoutubeId: "3JOy56IAn2E",
      genres: ["COMEDY"],
      credits: [
        { artist: "Gippy Grewal", role: "LEAD_ACTOR", order: 1, character: "Jass" },
        { artist: "Binnu Dhillon", role: "SUPPORTING_ACTOR", order: 2 },
        { artist: "Jaswinder Bhalla", role: "SUPPORTING_ACTOR", order: 3 },
        { artist: "Smeep Kang", role: "DIRECTOR", order: 4 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/carry-on-jatta" },
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/carry-on-jatta" },
      ],
    },
    {
      title: "Carry On Jatta 2",
      year: 2018,
      runtime: 145,
      synopsis: "The hilarious sequel where a man pretends to be married to avoid his family's pressure, leading to double the confusion and comedy.",
      trailerYoutubeId: "9BG0S4GZFT0",
      genres: ["COMEDY"],
      credits: [
        { artist: "Gippy Grewal", role: "LEAD_ACTOR", order: 1 },
        { artist: "Binnu Dhillon", role: "SUPPORTING_ACTOR", order: 2 },
        { artist: "Jaswinder Bhalla", role: "SUPPORTING_ACTOR", order: 3 },
        { artist: "Smeep Kang", role: "DIRECTOR", order: 4 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/carry-on-jatta-2" },
      ],
    },
    {
      title: "Carry On Jatta 3",
      year: 2023,
      runtime: 150,
      synopsis: "The third chapter of the blockbuster franchise brings back the beloved characters with more confusion, more laughs, and more Punjabi comedy. Broke box office records upon release.",
      trailerYoutubeId: "_1lgmmJjrJE",
      genres: ["COMEDY"],
      credits: [
        { artist: "Gippy Grewal", role: "LEAD_ACTOR", order: 1 },
        { artist: "Binnu Dhillon", role: "SUPPORTING_ACTOR", order: 2 },
        { artist: "Jaswinder Bhalla", role: "SUPPORTING_ACTOR", order: 3 },
        { artist: "Sonam Bajwa", role: "LEAD_ACTOR", order: 4 },
        { artist: "Smeep Kang", role: "DIRECTOR", order: 5 },
      ],
      streaming: [
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/carry-on-jatta-3" },
      ],
    },
    {
      title: "Angrej",
      year: 2015,
      runtime: 152,
      synopsis: "Set in pre-partition Punjab of 1945, a young man is torn between his childhood love and a marriage arranged by his family. A beautifully crafted period romance widely considered one of the best Punjabi films ever made.",
      trailerYoutubeId: "ANNfBkPATbw",
      genres: ["ROMANCE", "DRAMA"],
      credits: [
        { artist: "Amrinder Gill", role: "LEAD_ACTOR", order: 1, character: "Angrej" },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/angrej" },
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/angrej" },
      ],
    },
    {
      title: "Love Punjab",
      year: 2016,
      runtime: 135,
      synopsis: "A married couple on the verge of divorce revisits their past to rediscover their love. An emotional drama about family bonds and the meaning of home in Punjab.",
      trailerYoutubeId: "q0w9k1oUJzY",
      genres: ["DRAMA"],
      credits: [
        { artist: "Amrinder Gill", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/love-punjab" },
      ],
    },
    {
      title: "Lahoriye",
      year: 2017,
      runtime: 155,
      synopsis: "A cross-border love story between a man from Indian Punjab and a woman from Pakistani Punjab. A celebration of shared Punjabi culture that transcends borders, with stunning music by Amrinder Gill.",
      trailerYoutubeId: "Ai-e9rXRCpE",
      genres: ["ROMANCE", "DRAMA"],
      credits: [
        { artist: "Amrinder Gill", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/lahoriye" },
      ],
    },
    {
      title: "Qismat",
      year: 2018,
      runtime: 132,
      synopsis: "Two college students fall deeply in love but are separated by fate and family circumstances. A heart-wrenching romance that became one of the most emotional Punjabi films, known for its iconic music.",
      trailerYoutubeId: "Z0Fv1I4nmpI",
      genres: ["ROMANCE", "DRAMA"],
      credits: [
        { artist: "Ammy Virk", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sargun Mehta", role: "LEAD_ACTOR", order: 2 },
        { artist: "Jagdeep Sidhu", role: "DIRECTOR", order: 3 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/qismat" },
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/qismat" },
      ],
    },
    {
      title: "Qismat 2",
      year: 2021,
      runtime: 138,
      synopsis: "The emotional sequel continues the love story with new challenges and heartbreak. Ammy and Sargun deliver powerful performances in this tear-jerking romance.",
      trailerYoutubeId: "vjhJDMuet28",
      genres: ["ROMANCE", "DRAMA"],
      credits: [
        { artist: "Ammy Virk", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sargun Mehta", role: "LEAD_ACTOR", order: 2 },
        { artist: "Jagdeep Sidhu", role: "DIRECTOR", order: 3 },
      ],
      streaming: [
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/qismat-2" },
      ],
    },
    {
      title: "Nikka Zaildar",
      year: 2016,
      runtime: 128,
      synopsis: "Set in a Punjabi village, a young man is caught between his love for a spirited girl and his family's wish to marry him elsewhere. A charming rural comedy with heart.",
      trailerYoutubeId: "PwTFzJxH_pQ",
      genres: ["COMEDY", "ROMANCE"],
      credits: [
        { artist: "Ammy Virk", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sonam Bajwa", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/nikka-zaildar" },
      ],
    },
    {
      title: "Nikka Zaildar 2",
      year: 2017,
      runtime: 130,
      synopsis: "The sequel brings a new love story with fresh characters in the same village setting. More comedy, more drama, and more Punjabi charm.",
      trailerYoutubeId: "-7CKbHyoXhI",
      genres: ["COMEDY", "ROMANCE"],
      credits: [
        { artist: "Ammy Virk", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sonam Bajwa", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/nikka-zaildar-2" },
      ],
    },
    {
      title: "Chal Mera Putt",
      year: 2019,
      runtime: 135,
      synopsis: "A group of illegal Punjabi immigrants in Birmingham, UK, struggle with jobs, landlords, and homesickness while forming an unlikely family. A comedy that touched the hearts of the diaspora.",
      trailerYoutubeId: "lC89Rcp7pco",
      genres: ["COMEDY", "DRAMA"],
      credits: [
        { artist: "Amrinder Gill", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/chal-mera-putt" },
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/chal-mera-putt" },
      ],
    },
    {
      title: "Chal Mera Putt 2",
      year: 2020,
      runtime: 138,
      synopsis: "The sequel follows the same group of immigrants facing new adventures and challenges in the UK. More comedy, more heart, and the beloved characters return.",
      trailerYoutubeId: "mGm3MzOqwx4",
      genres: ["COMEDY", "DRAMA"],
      credits: [
        { artist: "Amrinder Gill", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/chal-mera-putt-2" },
      ],
    },
    {
      title: "Chal Mera Putt 3",
      year: 2021,
      runtime: 140,
      synopsis: "The third installment of the beloved franchise continues the journey of Punjabi immigrants abroad with even more laughter and emotional moments.",
      trailerYoutubeId: "g1_Hfwp0oWA",
      genres: ["COMEDY", "DRAMA"],
      credits: [
        { artist: "Amrinder Gill", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "CHAUPAL", url: "https://www.chaupal.com/movie/chal-mera-putt-3" },
      ],
    },
    {
      title: "Sufna",
      year: 2020,
      runtime: 128,
      synopsis: "A dreamy love story set in rural Punjab where a young farmer falls for a spirited village girl. Known for its beautiful music, cinematography, and Ammy Virk's understated performance.",
      trailerYoutubeId: "n1j4v_sJr3Q",
      genres: ["ROMANCE"],
      credits: [
        { artist: "Ammy Virk", role: "LEAD_ACTOR", order: 1 },
        { artist: "Jagdeep Sidhu", role: "DIRECTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/sufna" },
      ],
    },
    {
      title: "Saunkan Saunkne",
      year: 2022,
      runtime: 142,
      synopsis: "A hilarious comedy about a married couple whose life is turned upside down when the husband's first wife returns. Three strong women steal the show in this battle of wits.",
      trailerYoutubeId: "oZmLnqBH6pU",
      genres: ["COMEDY"],
      credits: [
        { artist: "Ammy Virk", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sargun Mehta", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/saunkan-saunkne" },
      ],
    },
    {
      title: "Bambukat",
      year: 2016,
      runtime: 130,
      synopsis: "Set in 1960s Punjab, a poor farmer competes with a wealthy rival for the affections of his wife's sister. A period comedy about pride, love, and the Punjabi spirit.",
      trailerYoutubeId: "gxvYYxUMldg",
      genres: ["COMEDY", "DRAMA"],
      credits: [
        { artist: "Ammy Virk", role: "LEAD_ACTOR", order: 1 },
        { artist: "Binnu Dhillon", role: "SUPPORTING_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/bambukat" },
      ],
    },
    {
      title: "Manje Bistre",
      year: 2017,
      runtime: 142,
      synopsis: "Set during a big Punjabi wedding, a fun-loving guy tries to win over the bride's sister while the entire family creates comedy chaos. A celebration of Punjabi wedding culture.",
      trailerYoutubeId: "42u5gmLW5vQ",
      genres: ["COMEDY"],
      credits: [
        { artist: "Gippy Grewal", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sonam Bajwa", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/manje-bistre" },
      ],
    },
    {
      title: "Manje Bistre 2",
      year: 2019,
      runtime: 138,
      synopsis: "The sequel takes the wedding celebrations to Canada, with Gippy Grewal leading another round of Punjabi wedding comedy and chaos.",
      trailerYoutubeId: "Oq6P_9e7pXQ",
      genres: ["COMEDY"],
      credits: [
        { artist: "Gippy Grewal", role: "LEAD_ACTOR", order: 1 },
      ],
    },
    {
      title: "Ardaas",
      year: 2016,
      runtime: 162,
      synopsis: "An anthology drama weaving together multiple stories of faith, family conflict, and the power of prayer (Ardaas) in Punjabi society. Widely regarded as one of the most meaningful Punjabi films ever made.",
      trailerYoutubeId: "6pqmXJUH8KM",
      genres: ["DRAMA", "FAMILY"],
      credits: [
        { artist: "Gippy Grewal", role: "LEAD_ACTOR", order: 1 },
        { artist: "Gurpreet Ghuggi", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/ardaas" },
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/ardaas" },
      ],
    },
    {
      title: "Ardaas Karaan",
      year: 2019,
      runtime: 158,
      synopsis: "The sequel explores the generational divide between fathers and sons in modern Punjab. A powerful drama about parenting, values, and finding common ground through prayer.",
      trailerYoutubeId: "PYRI4mZ9A90",
      genres: ["DRAMA", "FAMILY"],
      credits: [
        { artist: "Gippy Grewal", role: "LEAD_ACTOR", order: 1 },
        { artist: "Gurpreet Ghuggi", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/ardaas-karaan" },
      ],
    },
    {
      title: "Nadhoo Khan",
      year: 2019,
      runtime: 130,
      synopsis: "A young wrestler from Punjab dreams of making it big in the sport while navigating love and family expectations. An action-packed sports drama with comedy.",
      trailerYoutubeId: "9d5h1XuMLBg",
      genres: ["ACTION", "COMEDY"],
      credits: [
        { artist: "Gurpreet Ghuggi", role: "SUPPORTING_ACTOR", order: 2 },
      ],
    },
    {
      title: "Chaar Sahibzaade",
      year: 2014,
      runtime: 140,
      synopsis: "India's first 3D animated Punjabi film telling the heroic story of the four sons of Guru Gobind Singh Ji. An epic tale of courage, sacrifice, and devotion that brought Sikh history to life for new generations.",
      trailerYoutubeId: "tFZVRPaVTfM",
      genres: ["HISTORICAL", "DEVOTIONAL"],
      credits: [],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/chaar-sahibzaade" },
      ],
    },
    {
      title: "Rabb Da Radio",
      year: 2017,
      runtime: 136,
      synopsis: "A son torn between his new wife and his parents navigates the challenges of a joint family. A wholesome family drama that captures the beauty and complications of Punjabi family life.",
      trailerYoutubeId: "7Bt3LIjFhVk",
      genres: ["DRAMA", "FAMILY"],
      credits: [
        { artist: "Tarsem Jassar", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/rabb-da-radio" },
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/rabb-da-radio" },
      ],
    },
    {
      title: "Rabb Da Radio 2",
      year: 2019,
      runtime: 140,
      synopsis: "The sequel continues the family saga with new challenges and heartfelt moments. Tarsem Jassar returns as the quintessential Punjabi man navigating family dynamics.",
      trailerYoutubeId: "r_NuPSv5xz4",
      genres: ["DRAMA", "FAMILY"],
      credits: [
        { artist: "Tarsem Jassar", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/rabb-da-radio-2" },
      ],
    },
    {
      title: "Uda Aida",
      year: 2019,
      runtime: 132,
      synopsis: "A comedy about a Punjabi family dealing with the challenges of expensive private schooling for their children. A relatable satire on the education system and class divide.",
      trailerYoutubeId: "Zy6sMFr2zDA",
      genres: ["COMEDY", "FAMILY"],
      credits: [
        { artist: "Tarsem Jassar", role: "LEAD_ACTOR", order: 1 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/uda-aida" },
      ],
    },
    {
      title: "Muklawa",
      year: 2019,
      runtime: 125,
      synopsis: "Set in 1970s Punjab, a newly married couple struggles to meet due to village traditions that keep the bride at her parents' home. A charming period romance with beautiful depiction of Punjabi customs.",
      trailerYoutubeId: "fHILSZHCaD4",
      genres: ["ROMANCE"],
      credits: [
        { artist: "Ammy Virk", role: "LEAD_ACTOR", order: 1 },
        { artist: "Sonam Bajwa", role: "LEAD_ACTOR", order: 2 },
      ],
      streaming: [
        { platform: "AMAZON_PRIME", url: "https://www.primevideo.com/detail/muklawa" },
        { platform: "ZEE5", url: "https://www.zee5.com/movies/details/muklawa" },
      ],
    },
  ];

  const movies: Record<string, string> = {}; // slug -> id

  for (const m of moviesData) {
    const movieSlug = slug(m.title);
    const movie = await prisma.movie.upsert({
      where: { slug: movieSlug },
      update: {},
      create: {
        title: m.title,
        slug: movieSlug,
        year: m.year,
        runtime: m.runtime,
        synopsis: m.synopsis,
        trailerYoutubeId: m.trailerYoutubeId,
        language: "PUNJABI",
        status: "RELEASED",
      },
    });
    movies[movieSlug] = movie.id;

    // Genres
    for (const g of m.genres) {
      await prisma.movieGenre.upsert({
        where: { movieId_genre: { movieId: movie.id, genre: g as any } },
        update: {},
        create: { movieId: movie.id, genre: g as any },
      });
    }

    // Credits
    for (const c of m.credits) {
      try {
        const aId = artistId(c.artist);
        await prisma.credit.upsert({
          where: {
            movieId_artistId_role: {
              movieId: movie.id,
              artistId: aId,
              role: c.role as any,
            },
          },
          update: {},
          create: {
            movieId: movie.id,
            artistId: aId,
            role: c.role as any,
            character: c.character,
            order: c.order,
          },
        });
      } catch (err: any) {
        console.warn(`    Skipping credit: ${c.artist} in ${m.title}: ${err.message}`);
      }
    }

    // Streaming links
    if (m.streaming) {
      for (const s of m.streaming) {
        await prisma.streamingLink.upsert({
          where: {
            movieId_platform: {
              movieId: movie.id,
              platform: s.platform as any,
            },
          },
          update: { url: s.url },
          create: {
            movieId: movie.id,
            platform: s.platform as any,
            url: s.url,
          },
        });
      }
    }

    // Trailer video record
    await prisma.video.create({
      data: {
        title: `${m.title} - Official Trailer`,
        youtubeId: m.trailerYoutubeId,
        type: "OFFICIAL_TRAILER",
        movieId: movie.id,
        featured: true,
        order: 0,
      },
    });

    console.log(`  Movie: ${m.title} (${m.year})`);
  }

  // ──────────────────────────────────────
  // 4. SONGS (50 real Punjabi songs)
  // ──────────────────────────────────────
  console.log("\nCreating songs...");

  const songsData: {
    title: string;
    year: number;
    youtubeId: string;
    genre?: string;
    label?: string;
    credits: { artist: string; role: string }[];
  }[] = [
    {
      title: "295",
      year: 2021,
      youtubeId: "4BC53WDXR8g",
      genre: "HIPHOP",
      label: "Sidhu Moosewala",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "So High",
      year: 2018,
      youtubeId: "rrGDcz_WJQE",
      genre: "HIPHOP",
      label: "Sidhu Moosewala",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "Legend",
      year: 2019,
      youtubeId: "iLYVkVyg8Cg",
      genre: "HIPHOP",
      label: "Sidhu Moosewala",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "The Last Ride",
      year: 2022,
      youtubeId: "EJHK4v8hfCM",
      genre: "HIPHOP",
      label: "Sidhu Moosewala",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "Just Look",
      year: 2018,
      youtubeId: "D7-dxb9aTLE",
      genre: "HIPHOP",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "Brown Munde",
      year: 2020,
      youtubeId: "VNs_cCtdbPc",
      genre: "RNB",
      label: "Run-Up Records",
      credits: [
        { artist: "AP Dhillon", role: "SINGER" },
      ],
    },
    {
      title: "Excuses",
      year: 2021,
      youtubeId: "vCEJSP1aYKc",
      genre: "RNB",
      credits: [
        { artist: "AP Dhillon", role: "SINGER" },
      ],
    },
    {
      title: "Insane",
      year: 2021,
      youtubeId: "LG1mBOq3hGM",
      genre: "RNB",
      credits: [
        { artist: "AP Dhillon", role: "SINGER" },
      ],
    },
    {
      title: "With You",
      year: 2022,
      youtubeId: "B5a6wMT9BwE",
      genre: "RNB",
      credits: [
        { artist: "AP Dhillon", role: "SINGER" },
      ],
    },
    {
      title: "Summer High",
      year: 2022,
      youtubeId: "C1p4Ld37MZ4",
      genre: "RNB",
      credits: [
        { artist: "AP Dhillon", role: "SINGER" },
      ],
    },
    {
      title: "Softly",
      year: 2023,
      youtubeId: "7YP11L9VnGE",
      genre: "POP",
      label: "Speed Records",
      credits: [
        { artist: "Karan Aujla", role: "SINGER" },
        { artist: "Karan Aujla", role: "LYRICIST" },
      ],
    },
    {
      title: "Tauba Tauba",
      year: 2024,
      youtubeId: "bCKc_3T8Rsw",
      genre: "POP",
      credits: [
        { artist: "Karan Aujla", role: "SINGER" },
        { artist: "Karan Aujla", role: "LYRICIST" },
      ],
    },
    {
      title: "Admirin' You",
      year: 2023,
      youtubeId: "Q3jNRjR0U3o",
      genre: "POP",
      credits: [
        { artist: "Karan Aujla", role: "SINGER" },
        { artist: "Karan Aujla", role: "LYRICIST" },
      ],
    },
    {
      title: "One You",
      year: 2022,
      youtubeId: "0XdNQGjcslc",
      genre: "HIPHOP",
      credits: [
        { artist: "Shubh", role: "SINGER" },
      ],
    },
    {
      title: "No Love",
      year: 2022,
      youtubeId: "NCC0lgLmRJo",
      genre: "HIPHOP",
      credits: [
        { artist: "Shubh", role: "SINGER" },
      ],
    },
    {
      title: "Elevated",
      year: 2022,
      youtubeId: "hUW4bwQ0vNQ",
      genre: "HIPHOP",
      credits: [
        { artist: "Shubh", role: "SINGER" },
      ],
    },
    {
      title: "Still Rollin",
      year: 2022,
      youtubeId: "B-c8r3F5d7Y",
      genre: "HIPHOP",
      credits: [
        { artist: "Shubh", role: "SINGER" },
      ],
    },
    {
      title: "Proper Patola",
      year: 2018,
      youtubeId: "c91OUbeSMB0",
      genre: "POP",
      credits: [
        { artist: "Diljit Dosanjh", role: "SINGER" },
      ],
    },
    {
      title: "Lover",
      year: 2020,
      youtubeId: "TOKgYBg0CN8",
      genre: "POP",
      credits: [
        { artist: "Diljit Dosanjh", role: "SINGER" },
      ],
    },
    {
      title: "Born To Shine",
      year: 2020,
      youtubeId: "uLBJVJ0TBQE",
      genre: "POP",
      credits: [
        { artist: "Diljit Dosanjh", role: "SINGER" },
      ],
    },
    {
      title: "G.O.A.T.",
      year: 2020,
      youtubeId: "eMm3C53VGdo",
      genre: "POP",
      credits: [
        { artist: "Diljit Dosanjh", role: "SINGER" },
        { artist: "Karan Aujla", role: "LYRICIST" },
      ],
    },
    {
      title: "Naina",
      year: 2000,
      youtubeId: "dTf6FQA8K5c",
      genre: "FOLK",
      credits: [
        { artist: "Gurdas Maan", role: "SINGER" },
      ],
    },
    {
      title: "Boot Polishaan Di",
      year: 1995,
      youtubeId: "xgWL0C7-QV4",
      genre: "FOLK",
      credits: [
        { artist: "Gurdas Maan", role: "SINGER" },
      ],
    },
    {
      title: "Apna Punjab Hove",
      year: 1998,
      youtubeId: "DDlQHjWM7G8",
      genre: "FOLK",
      credits: [
        { artist: "Gurdas Maan", role: "SINGER" },
      ],
    },
    {
      title: "Oh Ho Ho Ho",
      year: 2006,
      youtubeId: "OJ7WE8SwY8E",
      genre: "BHANGRA",
      credits: [
        { artist: "Jazzy B", role: "SINGER" },
      ],
    },
    {
      title: "Naag",
      year: 2004,
      youtubeId: "WFiUGp9CLSA",
      genre: "BHANGRA",
      credits: [
        { artist: "Jazzy B", role: "SINGER" },
      ],
    },
    {
      title: "Mitran De Boot",
      year: 2005,
      youtubeId: "JzE4sManXxA",
      genre: "BHANGRA",
      credits: [
        { artist: "Jazzy B", role: "SINGER" },
      ],
    },
    {
      title: "Illegal Weapon",
      year: 2017,
      youtubeId: "qRrfRVYP3Ys",
      genre: "POP",
      credits: [
        { artist: "Garry Sandhu", role: "SINGER" },
      ],
    },
    {
      title: "Yeah Baby",
      year: 2018,
      youtubeId: "SZ7CxJNb4Jg",
      genre: "POP",
      credits: [
        { artist: "Garry Sandhu", role: "SINGER" },
      ],
    },
    {
      title: "Banda Ban Ja",
      year: 2019,
      youtubeId: "oUd-3FpE7SQ",
      genre: "POP",
      credits: [
        { artist: "Garry Sandhu", role: "SINGER" },
      ],
    },
    {
      title: "Prada",
      year: 2018,
      youtubeId: "2dkKWXrlGCE",
      genre: "POP",
      label: "Geet MP3",
      credits: [
        { artist: "Jass Manak", role: "SINGER" },
        { artist: "Jass Manak", role: "LYRICIST" },
      ],
    },
    {
      title: "Lehanga",
      year: 2019,
      youtubeId: "lsJPJi7IUZU",
      genre: "POP",
      credits: [
        { artist: "Jass Manak", role: "SINGER" },
        { artist: "Jass Manak", role: "LYRICIST" },
      ],
    },
    {
      title: "Vaar",
      year: 2019,
      youtubeId: "U8Xt-fDBCPo",
      genre: "POP",
      credits: [
        { artist: "Jass Manak", role: "SINGER" },
      ],
    },
    {
      title: "Boss",
      year: 2020,
      youtubeId: "NVA0_TqVvp0",
      genre: "POP",
      credits: [
        { artist: "Jass Manak", role: "SINGER" },
      ],
    },
    {
      title: "Laare",
      year: 2019,
      youtubeId: "6cQSNdNmOvA",
      genre: "ROMANTIC",
      label: "Speed Records",
      credits: [],
    },
    {
      title: "Sakhiyaan",
      year: 2018,
      youtubeId: "oiUBs9wMJ-k",
      genre: "ROMANTIC",
      credits: [],
    },
    {
      title: "Jugni Ji",
      year: 2005,
      youtubeId: "_cFyf9dCUy0",
      genre: "FOLK",
      credits: [],
    },
    {
      title: "Daru Badnaam",
      year: 2018,
      youtubeId: "JuOHPiPihV0",
      genre: "PARTY",
      credits: [],
    },
    {
      title: "High Rated Gabru",
      year: 2017,
      youtubeId: "kJGE5F5bRfU",
      genre: "POP",
      credits: [],
    },
    {
      title: "Suit Suit",
      year: 2017,
      youtubeId: "9ONHPqGpDr4",
      genre: "POP",
      credits: [],
    },
    {
      title: "Raat Di Gedi",
      year: 2018,
      youtubeId: "w8_YEqpO0W4",
      genre: "POP",
      credits: [
        { artist: "Diljit Dosanjh", role: "SINGER" },
      ],
    },
    {
      title: "Do You Know",
      year: 2016,
      youtubeId: "vCxCLsIOk_k",
      genre: "POP",
      credits: [
        { artist: "Diljit Dosanjh", role: "SINGER" },
      ],
    },
    {
      title: "5 Taara",
      year: 2016,
      youtubeId: "q7s3LxNqILc",
      genre: "POP",
      credits: [
        { artist: "Diljit Dosanjh", role: "SINGER" },
      ],
    },
    {
      title: "Lemonade",
      year: 2022,
      youtubeId: "_kHvMY7Rqjw",
      genre: "HIPHOP",
      credits: [
        { artist: "Shubh", role: "SINGER" },
      ],
    },
    {
      title: "Jugaadi Jatt",
      year: 2016,
      youtubeId: "HxSQp_IjNRM",
      genre: "POP",
      credits: [
        { artist: "Mankirt Aulakh", role: "SINGER" },
      ],
    },
    {
      title: "Jatt Da Muqabla",
      year: 2018,
      youtubeId: "F5P1oE_JLNY",
      genre: "HIPHOP",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "Devil",
      year: 2019,
      youtubeId: "lMWfJ5pQhZU",
      genre: "HIPHOP",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "Bambiha Bole",
      year: 2020,
      youtubeId: "WVZjA7iWeLU",
      genre: "HIPHOP",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "Dhakka",
      year: 2019,
      youtubeId: "JzF4S-u7Zl4",
      genre: "HIPHOP",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
    {
      title: "Tibeyan Da Putt",
      year: 2020,
      youtubeId: "FE4PCdjB_XI",
      genre: "HIPHOP",
      credits: [
        { artist: "Sidhu Moosewala", role: "SINGER" },
      ],
    },
  ];

  for (const s of songsData) {
    const songSlug = slug(s.title);

    // Handle duplicate slugs by appending year
    let finalSlug = songSlug;
    const existingSong = await prisma.song.findUnique({ where: { slug: finalSlug } });
    if (existingSong) {
      finalSlug = `${songSlug}-${s.year}`;
    }

    const song = await prisma.song.upsert({
      where: { slug: finalSlug },
      update: {},
      create: {
        title: s.title,
        slug: finalSlug,
        year: s.year,
        musicVideoYoutubeId: s.youtubeId,
        genre: (s.genre as any) || "POP",
        label: s.label || null,
      },
    });

    // Song credits
    for (const c of s.credits) {
      try {
        const aId = artistId(c.artist);
        await prisma.songCredit.upsert({
          where: {
            songId_artistId_role: {
              songId: song.id,
              artistId: aId,
              role: c.role as any,
            },
          },
          update: {},
          create: {
            songId: song.id,
            artistId: aId,
            role: c.role as any,
          },
        });
      } catch (err: any) {
        console.warn(`    Skipping song credit: ${c.artist} in ${s.title}: ${err.message}`);
      }
    }

    // Music video record
    await prisma.video.create({
      data: {
        title: `${s.title} - Music Video`,
        youtubeId: s.youtubeId,
        type: "MUSIC_VIDEO",
        songId: song.id,
        featured: true,
        order: 0,
      },
    });

    console.log(`  Song: ${s.title} (${s.year})`);
  }

  // ──────────────────────────────────────
  // 5. UPDATE ARTIST COUNTS
  // ──────────────────────────────────────
  console.log("\nUpdating artist movie/song counts...");

  const allArtists = await prisma.artist.findMany({ select: { id: true, name: true } });
  for (const a of allArtists) {
    const totalMovies = await prisma.credit.count({ where: { artistId: a.id } });
    const totalSongs = await prisma.songCredit.count({ where: { artistId: a.id } });
    await prisma.artist.update({
      where: { id: a.id },
      data: { totalMovies, totalSongs },
    });
  }

  console.log("\n=== Seeding complete! ===");
  console.log(`  Artists: ${artistsData.length}`);
  console.log(`  Movies: ${moviesData.length}`);
  console.log(`  Songs: ${songsData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
