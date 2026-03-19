# FamousPunjabi.com — Mega Prompt

## Brand Identity

- **Name:** FamousPunjabi
- **Domain:** famouspunjabi.com
- **Tagline:** "The home of Punjabi entertainment"
- **What it is:** The IMDb + video hub for Punjabi movies, songs, and artists — video-first, community-driven, SEO-dominant
- **Mission:** Become the single authoritative destination for Punjabi entertainment discovery worldwide
- **Audience:** Punjabi diaspora (Canada, UK, US, Australia) + Punjab (India) — ages 16-45
- **Language:** English primary, Gurmukhi script for titles/names alongside English

## Brand Voice & Design

- Modern, bold, dark theme (black/dark gray background, amber/gold accents)
- Video-first — every page leads with embedded video content
- Mobile-first — 70%+ users will be on mobile
- Fast, clean, minimal — no clutter, no ad-infested blog feel
- Tone: Proud, celebratory, culturally authentic — not academic or formal
- "FamousPunjabi" always written as one word with capital F and capital P

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** Prisma 5 + PostgreSQL (Supabase)
- **Auth:** NextAuth 4 (Google OAuth + credentials, JWT strategy)
- **Styling:** Tailwind CSS 3.4 + shadcn/ui components
- **AI:** Claude API via @anthropic-ai/sdk (recommendations, summaries, lyric explanations)
- **Embeds:** YouTube iFrame API, Spotify oEmbed, Instagram oEmbed
- **Images:** Supabase Storage (posters, artist photos, user avatars)
- **Search:** Client-side fuzzy search (MVP), Algolia (later)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel
- **Package Manager:** bun (always use bun, never npm/npx)

## Data Architecture

### Core Models

```prisma
// ============================================
// USER & COMMUNITY
// ============================================

model User {
  id              String    @id @default(cuid())
  name            String
  email           String    @unique
  emailVerified   DateTime?
  hashedPassword  String?
  image           String?
  role            Role      @default(USER)
  bio             String?   @db.Text

  // Community stats
  reputation      Int       @default(0)
  contributorLevel ContributorLevel @default(NEWCOMER)

  // Relations
  ratings         Rating[]
  reviews         Review[]
  lists           UserList[]
  watchlist       WatchlistItem[]
  playlist        PlaylistItem[]
  submissions     Submission[]
  edits           Edit[]
  votes           Vote[]
  comments        Comment[]
  followers       Follow[]  @relation("following")
  following       Follow[]  @relation("followers")

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum Role {
  USER
  CONTRIBUTOR    // Earned: 50+ approved edits
  MODERATOR      // Appointed by admin
  ADMIN
}

enum ContributorLevel {
  NEWCOMER       // 0-9 contributions
  CONTRIBUTOR    // 10-49 approved contributions
  TRUSTED        // 50-199 approved contributions
  EXPERT         // 200+ approved contributions
  LEGEND         // 500+ approved contributions — top badge
}

// ============================================
// MOVIES
// ============================================

model Movie {
  id              String    @id @default(cuid())
  title           String
  titleGurmukhi   String?
  slug            String    @unique
  year            Int
  releaseDate     DateTime?
  runtime         Int?      // minutes
  synopsis        String?   @db.Text
  synopsisAI      String?   @db.Text  // AI-generated summary
  posterUrl       String?
  backdropUrl     String?
  trailerUrl      String?   // YouTube URL

  // Ratings
  averageRating   Float     @default(0)
  ratingCount     Int       @default(0)

  // Box office
  boxOfficeIndia  String?   // e.g., "₹45 Cr"
  boxOfficeWorldwide String?

  // Metadata
  language        MovieLanguage @default(PUNJABI)
  certification   String?   // e.g., "U/A", "A"
  status          MovieStatus @default(RELEASED)

  // External IDs
  tmdbId          Int?      @unique
  imdbId          String?   @unique

  // Where to watch
  streamingOn     StreamingLink[]

  // Relations
  credits         Credit[]
  genres          MovieGenre[]
  videos          Video[]
  ratings         Rating[]
  reviews         Review[]
  watchlistItems  WatchlistItem[]
  listItems       ListItem[]

  // Community
  submissions     Submission[]
  edits           Edit[]
  comments        Comment[]

  // SEO
  metaDescription String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  addedBy         String?   // userId of contributor who added it
}

enum MovieLanguage {
  PUNJABI
  HINDI_PUNJABI
  ENGLISH_PUNJABI
}

enum MovieStatus {
  ANNOUNCED
  PRE_PRODUCTION
  FILMING
  POST_PRODUCTION
  RELEASED
}

// ============================================
// SONGS
// ============================================

model Song {
  id              String    @id @default(cuid())
  title           String
  titleGurmukhi   String?
  slug            String    @unique
  year            Int
  releaseDate     DateTime?
  duration        Int?      // seconds
  album           String?

  // URLs
  musicVideoUrl   String?   // YouTube URL
  spotifyUrl      String?
  appleMusicUrl   String?

  // Ratings
  averageRating   Float     @default(0)
  ratingCount     Int       @default(0)

  // Metadata
  label           String?   // e.g., "Speed Records", "Jass Records"
  genre           SongGenre @default(POP)

  // AI content
  lyricMeaning    String?   @db.Text  // AI-generated lyric explanation

  // Relations
  credits         SongCredit[]
  videos          Video[]
  ratings         Rating[]
  reviews         Review[]
  playlistItems   PlaylistItem[]
  listItems       ListItem[]

  // Community
  submissions     Submission[]
  edits           Edit[]
  comments        Comment[]

  // SEO
  metaDescription String?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  addedBy         String?   // userId of contributor who added it
}

enum SongGenre {
  POP
  HIPHOP
  FOLK
  BHANGRA
  SAD
  ROMANTIC
  DEVOTIONAL
  PARTY
  RAP
  RNB
  ROCK
  SUFI
}

// ============================================
// ARTISTS
// ============================================

model Artist {
  id              String    @id @default(cuid())
  name            String
  nameGurmukhi    String?
  slug            String    @unique
  bio             String?   @db.Text
  photoUrl        String?
  bannerUrl       String?

  // Info
  birthDate       DateTime?
  birthPlace      String?
  deathDate       DateTime?

  // Stats
  totalMovies     Int       @default(0)
  totalSongs      Int       @default(0)
  averageRating   Float     @default(0)
  followerCount   Int       @default(0)  // on FamousPunjabi

  // Social links
  socialAccounts  SocialAccount[]

  // Flags
  verified        Boolean   @default(false)
  featured        Boolean   @default(false)

  // Type
  type            ArtistType @default(MULTI)

  // Relations
  movieCredits    Credit[]
  songCredits     SongCredit[]
  videos          Video[]
  ratings         Rating[]
  comments        Comment[]

  // Community
  submissions     Submission[]
  edits           Edit[]

  // SEO
  metaDescription String?

  // External
  tmdbId          Int?      @unique
  imdbId          String?   @unique
  spotifyId       String?   @unique

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  addedBy         String?
}

enum ArtistType {
  ACTOR
  SINGER
  DIRECTOR
  LYRICIST
  MUSIC_DIRECTOR
  PRODUCER
  COMEDIAN
  MULTI
}

// ============================================
// RELATIONSHIPS
// ============================================

model Credit {
  id        String     @id @default(cuid())
  movie     Movie      @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId   String
  artist    Artist     @relation(fields: [artistId], references: [id], onDelete: Cascade)
  artistId  String
  role      CreditRole
  character String?    // character name for actors
  order     Int        @default(0)  // billing order

  @@unique([movieId, artistId, role])
}

enum CreditRole {
  LEAD_ACTOR
  SUPPORTING_ACTOR
  DIRECTOR
  PRODUCER
  WRITER
  MUSIC_DIRECTOR
  CINEMATOGRAPHER
  EDITOR
}

model SongCredit {
  id        String         @id @default(cuid())
  song      Song           @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId    String
  artist    Artist         @relation(fields: [artistId], references: [id], onDelete: Cascade)
  artistId  String
  role      SongCreditRole

  @@unique([songId, artistId, role])
}

enum SongCreditRole {
  SINGER
  FEATURED
  LYRICIST
  MUSIC_DIRECTOR
  PRODUCER
  VIDEO_DIRECTOR
}

model SocialAccount {
  id        String   @id @default(cuid())
  platform  Platform
  url       String
  followers Int?
  artist    Artist   @relation(fields: [artistId], references: [id], onDelete: Cascade)
  artistId  String

  @@unique([artistId, platform])
}

enum Platform {
  YOUTUBE
  INSTAGRAM
  FACEBOOK
  SPOTIFY
  TWITTER
}

// ============================================
// VIDEOS (YouTube embeds)
// ============================================

model Video {
  id          String    @id @default(cuid())
  title       String
  youtubeId   String
  type        VideoType
  thumbnail   String?
  duration    Int?      // seconds
  viewCount   Int?
  order       Int       @default(0)
  featured    Boolean   @default(false)

  // Relations (polymorphic — one of these will be set)
  movie       Movie?    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId     String?
  song        Song?     @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId      String?
  artist      Artist?   @relation(fields: [artistId], references: [id], onDelete: Cascade)
  artistId    String?

  // Community
  addedBy     String?   // userId

  createdAt   DateTime  @default(now())
}

enum VideoType {
  OFFICIAL_TRAILER
  TEASER
  MUSIC_VIDEO
  LYRIC_VIDEO
  BEHIND_THE_SCENES
  INTERVIEW
  REACTION
  REVIEW
  LIVE_PERFORMANCE
  COMEDY_SKIT
  SHORT_FILM
  FAN_MADE
  OTHER
}

// ============================================
// STREAMING LINKS
// ============================================

model StreamingLink {
  id          String   @id @default(cuid())
  platform    StreamingPlatform
  url         String
  movie       Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId     String

  @@unique([movieId, platform])
}

enum StreamingPlatform {
  NETFLIX
  AMAZON_PRIME
  JIO_CINEMA
  ZEE5
  DISNEY_HOTSTAR
  YOUTUBE_PREMIUM
  CHAUPAL
  APPLE_TV
}

// ============================================
// GENRES (many-to-many for movies)
// ============================================

model MovieGenre {
  id      String @id @default(cuid())
  genre   Genre
  movie   Movie  @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId String

  @@unique([movieId, genre])
}

enum Genre {
  COMEDY
  ROMANCE
  ACTION
  DRAMA
  THRILLER
  FAMILY
  DEVOTIONAL
  HISTORICAL
  BIOGRAPHICAL
  HORROR
  MUSICAL
  DOCUMENTARY
}

// ============================================
// COMMUNITY: RATINGS & REVIEWS
// ============================================

model Rating {
  id        String   @id @default(cuid())
  score     Int      // 1-10
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String

  // Polymorphic (one of these set)
  movie     Movie?   @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId   String?
  song      Song?    @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId    String?
  artist    Artist?  @relation(fields: [artistId], references: [id], onDelete: Cascade)
  artistId  String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, movieId])
  @@unique([userId, songId])
  @@unique([userId, artistId])
}

model Review {
  id        String   @id @default(cuid())
  text      String   @db.VarChar(500)  // Short reviews — 500 char max
  videoUrl  String?  // Optional: link to video review on YouTube

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String

  // Polymorphic
  movie     Movie?   @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId   String?
  song      Song?    @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId    String?

  // Voting
  upvotes   Int      @default(0)
  downvotes Int      @default(0)
  votes     Vote[]

  // Moderation
  approved  Boolean  @default(true)
  flagged   Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Vote {
  id        String   @id @default(cuid())
  type      VoteType
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  reviewId  String

  createdAt DateTime @default(now())

  @@unique([userId, reviewId])
}

enum VoteType {
  UPVOTE
  DOWNVOTE
}

// ============================================
// COMMUNITY: COMMENTS
// ============================================

model Comment {
  id        String   @id @default(cuid())
  text      String   @db.VarChar(500)

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String

  // Polymorphic — comment on any entity
  movie     Movie?   @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId   String?
  song      Song?    @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId    String?
  artist    Artist?  @relation(fields: [artistId], references: [id], onDelete: Cascade)
  artistId  String?

  // Threading
  parentId  String?
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")

  // Moderation
  approved  Boolean  @default(true)
  flagged   Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ============================================
// COMMUNITY: USER LISTS
// ============================================

model UserList {
  id          String     @id @default(cuid())
  title       String
  slug        String
  description String?    @db.Text
  isPublic    Boolean    @default(true)
  coverUrl    String?

  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  items       ListItem[]

  // Stats
  likeCount   Int        @default(0)
  viewCount   Int        @default(0)

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@unique([userId, slug])
}

model ListItem {
  id        String    @id @default(cuid())
  order     Int       @default(0)
  note      String?   @db.VarChar(280)  // Why this is on the list

  list      UserList  @relation(fields: [listId], references: [id], onDelete: Cascade)
  listId    String

  // Polymorphic
  movie     Movie?    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId   String?
  song      Song?     @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId    String?

  createdAt DateTime  @default(now())

  @@unique([listId, movieId])
  @@unique([listId, songId])
}

// ============================================
// COMMUNITY: WATCHLIST & PLAYLIST
// ============================================

model WatchlistItem {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  movie     Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  movieId   String
  watched   Boolean  @default(false)

  createdAt DateTime @default(now())

  @@unique([userId, movieId])
}

model PlaylistItem {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  song      Song     @relation(fields: [songId], references: [id], onDelete: Cascade)
  songId    String

  createdAt DateTime @default(now())

  @@unique([userId, songId])
}

// ============================================
// COMMUNITY: USER FOLLOWS
// ============================================

model Follow {
  id          String   @id @default(cuid())
  follower    User     @relation("followers", fields: [followerId], references: [id], onDelete: Cascade)
  followerId  String
  following   User     @relation("following", fields: [followingId], references: [id], onDelete: Cascade)
  followingId String

  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
}

// ============================================
// COMMUNITY: SUBMISSIONS & EDITS (wiki-style)
// ============================================

model Submission {
  id          String           @id @default(cuid())
  type        SubmissionType
  status      SubmissionStatus @default(PENDING)

  // What they're submitting
  data        Json             // Full data payload for the new entry

  // Linked entity (if editing existing)
  movie       Movie?           @relation(fields: [movieId], references: [id])
  movieId     String?
  song        Song?            @relation(fields: [songId], references: [id])
  songId      String?
  artist      Artist?          @relation(fields: [artistId], references: [id])
  artistId    String?

  // Who submitted
  user        User             @relation(fields: [userId], references: [id])
  userId      String

  // Review
  reviewNote  String?          // Admin/mod note on why approved/rejected
  reviewedBy  String?          // Admin/mod userId
  reviewedAt  DateTime?

  createdAt   DateTime         @default(now())
}

enum SubmissionType {
  NEW_MOVIE
  NEW_SONG
  NEW_ARTIST
  ADD_VIDEO       // Add a YouTube video to a movie/song/artist
  ADD_STREAMING   // Add a streaming link
  CORRECTION      // Fix incorrect data
}

enum SubmissionStatus {
  PENDING
  APPROVED
  REJECTED
}

model Edit {
  id          String       @id @default(cuid())
  field       String       // Which field was edited
  oldValue    String?      @db.Text
  newValue    String       @db.Text
  reason      String?      // Why the edit was made
  status      SubmissionStatus @default(PENDING)

  // What was edited
  movie       Movie?       @relation(fields: [movieId], references: [id])
  movieId     String?
  song        Song?        @relation(fields: [songId], references: [id])
  songId      String?
  artist      Artist?      @relation(fields: [artistId], references: [id])
  artistId    String?

  // Who edited
  user        User         @relation(fields: [userId], references: [id])
  userId      String

  // Review
  reviewedBy  String?
  reviewedAt  DateTime?

  createdAt   DateTime     @default(now())
}

// ============================================
// RELEASE CALENDAR
// ============================================

model Release {
  id          String      @id @default(cuid())
  title       String
  type        ReleaseType
  releaseDate DateTime
  description String?
  imageUrl    String?

  // Linked entities
  movieId     String?
  songId      String?
  artistName  String?

  // Source
  sourceUrl   String?     // Where we got the info
  confirmed   Boolean     @default(false)

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum ReleaseType {
  MOVIE
  SONG
  ALBUM
  MUSIC_VIDEO
}
```

### Summary of Models: 24 models, 17 enums

| Category | Models |
|----------|--------|
| Core entities | Movie, Song, Artist |
| Relationships | Credit, SongCredit, SocialAccount, MovieGenre, StreamingLink |
| Media | Video |
| User system | User, Follow |
| Community ratings | Rating, Review, Vote |
| Community content | Comment, UserList, ListItem |
| Personal collections | WatchlistItem, PlaylistItem |
| Community contributions | Submission, Edit |
| Calendar | Release |

## Page Architecture

### Public Pages

```
/ (Homepage)
├── Hero: Featured video embed (auto-rotating)
├── Trending This Week (video cards)
├── New Releases (movie trailers + song videos)
├── Top Rated Movies (horizontal scroll)
├── Top Rated Songs (horizontal scroll)
├── Popular Lists (community-created)
├── Recently Added (latest contributions)
└── "What should I watch?" CTA → AI chatbot

/movies
├── Filter: Year, Genre, Rating, Language, Status
├── Sort: Rating, Year, Recently Added, Most Rated
├── Grid of movie cards (poster, title, year, rating)
└── Pagination

/movies/[slug]
├── Hero: Trailer embed (YouTube) — full width
├── Title (English + Gurmukhi) + Year + Runtime + Certification
├── Community Rating (avg + count) + Rate button
├── Synopsis (with AI-generated summary toggle)
├── Cast & Crew (linked artist cards, sorted by billing)
├── Where to Watch (streaming links with affiliate)
├── Videos section (trailers, behind-the-scenes, reactions — all embeds)
├── Community Reviews (text + video reviews, sortable by votes)
├── Comments section (threaded)
├── Related Movies (AI-recommended)
├── "Add to Watchlist" button
├── "Add to List" button
├── "Suggest an Edit" button
├── Share (WhatsApp, Instagram, copy link)
└── SEO: og:image = poster, structured data (Movie schema)

/songs
├── Filter: Year, Genre, Label, Rating
├── Sort: Rating, Year, Recently Added, Most Rated
├── Grid/list of song cards (thumbnail, title, artist, rating)
└── Pagination

/songs/[slug]
├── Hero: Music video embed (YouTube) — full width
├── Spotify player embed
├── Title (English + Gurmukhi)
├── Artist(s), Lyricist, Music Director (linked)
├── Album, Label, Year
├── Community Rating + Rate button
├── Lyric Meaning / Breakdown (AI-generated, expandable)
├── More videos (lyric video, live performances)
├── Community Reviews
├── Comments section
├── More from this Artist
├── "Add to Playlist" button
├── Share buttons
└── SEO: structured data (MusicRecording schema)

/artists
├── Filter: Type (Actor, Singer, Director, etc.)
├── Sort: Rating, Name, Most Movies, Most Songs
├── Grid of artist cards (photo, name, type, stats)
└── Pagination

/artists/[slug]
├── Hero: Banner image or highlight video embed
├── Photo + Name (English + Gurmukhi)
├── Bio
├── Stats bar: X movies, Y songs, avg rating
├── Social links (YouTube, Instagram, Spotify, etc.)
├── Filmography (sortable table — year, movie, role, rating)
├── Discography (sortable table — year, song, role, rating)
├── Videos (interviews, performances, behind-the-scenes)
├── Community Comments
├── Follow button (follow on FamousPunjabi)
├── "Suggest an Edit" button
└── SEO: structured data (Person schema)

/trending
├── Trending Movies (most rated/reviewed this week)
├── Trending Songs
├── Trending Artists (most viewed profiles)
├── Trending Lists
├── Trending Reviews
└── Rising Contributors (top community members this week)

/releases
├── Calendar view (week/month toggle)
├── Upcoming movies with trailers
├── Upcoming songs/albums
├── Filter by type (Movie, Song, Album)
├── "Remind Me" button (email notification)
└── Past releases archive

/search
├── Universal search (movies, songs, artists — all in one)
├── Real-time results with type indicators
├── Search suggestions / autocomplete
└── Filter results by type

/lists
├── Popular community lists (most liked)
├── Staff picks / editor's curated lists
├── Browse by category ("Best Comedies", "Moosewala Essentials")
└── "Create a List" CTA

/lists/[userId]/[slug]
├── List title, description, cover image
├── Creator profile card
├── Ordered items with notes
├── Like button + share
├── Comments
└── "Copy this list" / "Create similar"

/discover (AI-powered)
├── "What should I watch?" chatbot
├── "What should I listen to?" chatbot
├── Mood-based recommendations ("I'm feeling nostalgic")
├── "Because you liked X" recommendations
└── Weekly AI-curated picks
```

### Community / User Pages

```
/submit
├── Tabs: Add Movie | Add Song | Add Artist | Add Video | Report Error
├── Structured forms per type
├── Guidelines + quality standards
├── Submission history (your past submissions + status)
└── Logged-in users only

/submit/movie
├── Title (English + Gurmukhi)
├── Year, Runtime, Genre(s), Language
├── Synopsis
├── Trailer URL (YouTube)
├── Poster upload
├── Cast & Crew (searchable artist picker)
├── Streaming links
├── Source URL (where you found this info)
└── Submit for review

/submit/song
├── Title (English + Gurmukhi)
├── Artist(s), Lyricist, Music Director (searchable)
├── Year, Album, Label, Genre
├── Music video URL (YouTube)
├── Spotify URL
└── Submit for review

/submit/artist
├── Name (English + Gurmukhi)
├── Type (Actor, Singer, Director, etc.)
├── Bio
├── Photo upload
├── Birth date, birth place
├── Social media links
└── Submit for review

/submit/video
├── YouTube URL
├── Video type (reaction, review, behind-the-scenes, etc.)
├── Link to movie/song/artist it belongs to
└── Submit for review

/edit/[type]/[slug]
├── Pre-filled form with current data
├── Field-level edit with "reason for change"
├── Diff preview before submitting
└── Edit history visible

/profile/[userId]
├── Avatar, name, bio
├── Contributor level badge + reputation score
├── Stats: X ratings, Y reviews, Z contributions
├── Recent ratings (with scores)
├── Recent reviews
├── Published lists
├── Contribution history (approved submissions/edits)
├── Watchlist (if public)
├── Playlist (if public)
├── Follow / Unfollow button
└── Followers / Following counts

/profile/edit
├── Edit name, bio, avatar
├── Privacy settings (public/private watchlist, playlist)
├── Notification preferences
└── Delete account

/activity
├── Feed of recent community activity
├── New ratings, reviews, lists from people you follow
├── Recently approved submissions
├── New movies/songs added to database
└── Filter by type
```

### Admin / Moderation Pages

```
/admin
├── Dashboard stats (total movies, songs, artists, users, submissions)
├── Quick links to pending submissions

/admin/submissions
├── Pending submissions queue
├── Filter by type (movie, song, artist, video, correction)
├── Approve / Reject with note
├── Bulk actions

/admin/edits
├── Pending edits queue
├── Diff view (old vs new)
├── Approve / Reject
├── Editor reputation visible

/admin/moderation
├── Flagged reviews and comments
├── User reports
├── Ban / warn users

/admin/movies/add
├── Full movie entry form (admin version — no review needed)

/admin/songs/add
├── Full song entry form

/admin/artists/add
├── Full artist entry form

/admin/releases
├── Manage release calendar entries

/admin/seed
├── Bulk import from TMDb API
├── Bulk import from Spotify API
├── CSV upload
```

### API Routes

```
/api/auth/[...nextauth]     — Auth endpoints

// Movies
GET    /api/movies           — List movies (paginated, filterable)
GET    /api/movies/[slug]    — Single movie with relations
GET    /api/movies/trending  — Trending movies this week

// Songs
GET    /api/songs            — List songs (paginated, filterable)
GET    /api/songs/[slug]     — Single song with relations
GET    /api/songs/trending   — Trending songs this week

// Artists
GET    /api/artists          — List artists (paginated, filterable)
GET    /api/artists/[slug]   — Single artist with filmography/discography

// Search
GET    /api/search           — Universal search across all entities

// Ratings
POST   /api/ratings          — Create/update rating (auth required)
DELETE /api/ratings/[id]     — Remove rating

// Reviews
POST   /api/reviews          — Create review (auth required)
PUT    /api/reviews/[id]     — Edit review
DELETE /api/reviews/[id]     — Delete review
POST   /api/reviews/[id]/vote — Upvote/downvote

// Comments
POST   /api/comments         — Create comment (auth required)
PUT    /api/comments/[id]    — Edit comment
DELETE /api/comments/[id]    — Delete comment
POST   /api/comments/[id]/flag — Flag comment

// Lists
GET    /api/lists             — Popular/recent lists
POST   /api/lists             — Create list (auth required)
PUT    /api/lists/[id]        — Update list
DELETE /api/lists/[id]        — Delete list
POST   /api/lists/[id]/like   — Like a list

// Watchlist & Playlist
GET    /api/watchlist         — Get user's watchlist (auth required)
POST   /api/watchlist         — Add to watchlist
DELETE /api/watchlist/[id]    — Remove from watchlist

GET    /api/playlist          — Get user's playlist (auth required)
POST   /api/playlist          — Add to playlist
DELETE /api/playlist/[id]     — Remove from playlist

// Submissions
POST   /api/submissions       — Submit new entry (auth required)
GET    /api/submissions/mine  — My submissions

// Edits
POST   /api/edits             — Submit an edit (auth required)
GET    /api/edits/mine        — My edits

// User
GET    /api/users/[id]        — Public profile
PUT    /api/users/profile     — Update own profile (auth required)
POST   /api/users/[id]/follow — Follow user
DELETE /api/users/[id]/follow — Unfollow user
GET    /api/users/[id]/activity — User's activity feed

// Admin
GET    /api/admin/submissions — Pending submissions (admin/mod only)
PUT    /api/admin/submissions/[id] — Approve/reject
GET    /api/admin/edits       — Pending edits
PUT    /api/admin/edits/[id]  — Approve/reject
GET    /api/admin/stats       — Dashboard stats

// AI
POST   /api/ai/recommend      — AI recommendations (auth required)
POST   /api/ai/summarize      — AI movie summary
POST   /api/ai/lyrics         — AI lyric explanation

// Releases
GET    /api/releases          — Upcoming releases
GET    /api/releases/week     — This week's releases

// Public API (for third-party developers)
GET    /api/v1/movies         — Public API
GET    /api/v1/songs          — Public API
GET    /api/v1/artists        — Public API
GET    /api/v1/search         — Public API
```

## Community & Contribution System

### Contribution Philosophy

FamousPunjabi is **community-powered like Wikipedia, structured like IMDb.** Users don't just consume — they build the database.

### How Users Contribute

| Action | Auth required | Review needed | Reputation earned |
|--------|---------------|---------------|-------------------|
| Rate a movie/song | Yes | No | +1 |
| Write a review | Yes | No (auto-approved, flaggable) | +2 |
| Create a list | Yes | No | +3 |
| Submit a new movie | Yes | Yes (admin/mod review) | +10 on approval |
| Submit a new song | Yes | Yes | +10 on approval |
| Submit a new artist | Yes | Yes | +10 on approval |
| Add a video to a page | Yes | Yes | +5 on approval |
| Suggest an edit/correction | Yes | Yes | +3 on approval |
| Comment | Yes | No (auto-approved, flaggable) | +1 |
| Upvote/downvote reviews | Yes | No | 0 |
| Flag inappropriate content | Yes | No | 0 |

### Contributor Levels

| Level | Reputation | Badge | Perks |
|-------|-----------|-------|-------|
| Newcomer | 0-49 | — | Basic actions |
| Contributor | 50-199 | Bronze | Submissions need fewer approvals |
| Trusted | 200-499 | Silver | Can approve others' video additions |
| Expert | 500-999 | Gold | Can approve edits, featured on leaderboard |
| Legend | 1000+ | Platinum | Full mod powers on edits, profile badge |

### Gamification

- **Weekly leaderboard** — top contributors of the week
- **Streaks** — rate or review something every day
- **Badges** — "First Review", "100 Ratings", "List Master", "Fact Checker" (10 approved edits)
- **Profile showcase** — contributor level visible on all reviews/comments

### Moderation

- Auto-moderation: profanity filter on reviews/comments
- Community flagging: any user can flag content
- Mod queue: flagged items + pending submissions reviewed by mods/admins
- Trusted users (200+ rep) can approve certain low-risk submissions
- Admin can ban/warn users

## SEO Strategy

### Page-Level SEO

Every page must have:
- Unique `<title>` tag following pattern: `{Entity Name} — FamousPunjabi`
- Meta description (AI-generated if not manually set)
- Open Graph tags (og:title, og:description, og:image)
- Twitter card tags
- JSON-LD structured data (Movie, MusicRecording, Person schemas)
- Canonical URL
- Breadcrumbs

### URL Structure (SEO-friendly)

```
/movies/jatt-and-juliet-3
/songs/295-sidhu-moosewala
/artists/diljit-dosanjh
/lists/best-punjabi-comedies
/releases/march-2026
```

### Target Keywords (examples)

- "best punjabi movies [year]"
- "new punjabi songs this week"
- "[artist name] movies" / "[artist name] songs"
- "[movie name] rating" / "[movie name] cast"
- "punjabi movies on netflix"
- "top punjabi songs [year]"
- "upcoming punjabi movies"
- "[song name] lyrics meaning"

### Auto-Generated SEO Pages

- `/movies/year/[year]` — all movies from a year
- `/movies/genre/[genre]` — all movies in a genre
- `/songs/year/[year]` — all songs from a year
- `/songs/genre/[genre]` — all songs in a genre
- `/artists/type/[type]` — all actors, all singers, etc.
- `/best/punjabi-movies-[year]` — auto-generated "best of" from ratings

### Sitemap

- Dynamic XML sitemap at `/sitemap.xml`
- Includes all movies, songs, artists, lists
- Updated daily
- Submitted to Google Search Console

## AI Features (Claude API)

### 1. Recommendation Engine (`/discover`)
```
System prompt: You are FamousPunjabi's recommendation engine. You know every
Punjabi movie and song in our database. Based on user preferences, mood, or
past ratings, recommend the best matches. Be conversational, enthusiastic,
and culturally knowledgeable. Always recommend from our database (provided
as context).
```

### 2. Movie Summaries
- Auto-generate synopsis for movies that don't have one
- Generated from title, cast, genre, year, and any available trailer descriptions
- Stored in `synopsisAI` field, editable by community

### 3. Lyric Explanations
- Explain Punjabi slang, cultural references, and wordplay in songs
- Especially valuable for diaspora kids who understand conversational Punjabi but not poetic Punjabi
- Stored in `lyricMeaning` field

### 4. Weekly Digest
- AI-curated "This Week in Punjabi Entertainment"
- New releases, trending content, notable community activity
- Can be repurposed as email newsletter

## Data Seeding Strategy

### Phase 1 Seed (MVP Launch)

| Entity | Count | Source |
|--------|-------|--------|
| Movies | 200 | TMDb API + manual curation |
| Songs | 500 | Spotify API + manual |
| Artists | 150 | Cross-referenced from movies/songs |
| Videos | 300 | YouTube search per movie/song |
| Categories | Auto-derived from genres + artist types |

### Priority Movies to Seed
- All Diljit Dosanjh films
- All Gippy Grewal films
- All Ammy Virk films
- Jatt & Juliet series
- Carry On Jatta series
- Angrej, Punjab 1984, Qismat series
- Sidhu Moosewala documentary
- All 2024-2026 releases
- Classic Punjabi films (Chann Pardesi, Marhi Da Deeva, Long Da Lishkara)
- Top 50 highest-grossing Pollywood films of all time

### Priority Songs to Seed
- All Sidhu Moosewala songs
- All AP Dhillon songs
- All Diljit Dosanjh hit songs
- Karan Aujla discography
- Shubh discography
- Classic: Gurdas Maan, Hans Raj Hans, Kuldeep Manak
- All songs with 100M+ YouTube views
- Weekly new releases from major labels

### Priority Artists to Seed
- Actors: Diljit Dosanjh, Gippy Grewal, Ammy Virk, Neeru Bajwa, Sonam Bajwa, Amrinder Gill, Binnu Dhillon, Jaswinder Bhalla, Gurpreet Ghuggi, Sargun Mehta, Tarsem Jassar, Ninja, Jassie Gill, Harrdy Sandhu, Himanshi Khurana, Rubina Bajwa
- Singers: Sidhu Moosewala, AP Dhillon, Karan Aujla, Shubh, Diljit Dosanjh, Babbu Maan, Amrinder Gill, Gurdas Maan, Jazzy B, Yo Yo Honey Singh, Garry Sandhu, Parmish Verma, Kuldeep Manak, Chamkila, Hans Raj Hans, Surjit Bindrakhia, Mankirt Aulakh, Singga, Jass Manak
- Directors: Jagdeep Sidhu, Smeep Kang, Anurag Singh, Amberdeep Singh
- Music Directors: Intense, The Kidd, Ikky, Snappy, Desi Crew, Dr. Zeus

## Monetization

### Revenue Streams

| Stream | Implementation | When |
|--------|---------------|------|
| Google AdSense | Display ads on pages (non-intrusive) | Day 1 |
| Streaming affiliate links | JustWatch / direct affiliate programs | Day 1 |
| Sponsored placements | Featured movies/songs (marked as "Promoted") | 50K users |
| Music label partnerships | Labels pay to feature new releases | 50K users |
| Premium tier ($3-5/mo) | No ads, early reviews, advanced lists, AI unlimited | 6 months |
| Public API | Free tier (100 req/day) + paid tier ($29/mo unlimited) | 6 months |
| Ticket affiliate | BookMyShow affiliate for Pollywood releases | Day 1 |

### Affiliate Strategy
- Every "Where to Watch" link is an affiliate link
- Spotify links use affiliate program
- BookMyShow movie links use affiliate
- Amazon Prime, Netflix links where available

## Build Phases

### Phase 1 — MVP (Sprint 1-2, ~2 weeks)
**Goal: Launchable product with seeded content**
- [ ] Redesign Prisma schema (movies, songs, artists, credits, videos)
- [ ] Seed 200 movies, 500 songs, 150 artists with YouTube embeds
- [ ] Movie detail page (trailer embed, cast, rating widget)
- [ ] Song detail page (music video embed, Spotify player, rating widget)
- [ ] Artist detail page (filmography, discography, videos)
- [ ] Homepage (trending feed, new releases, top rated)
- [ ] Search (universal across movies, songs, artists)
- [ ] Browse pages with filters (movies, songs, artists)
- [ ] Basic rating system (1-10, no auth required for MVP)
- [ ] Mobile responsive, video-first layout
- [ ] SEO: meta tags, structured data, sitemap
- [ ] Deploy to Vercel

### Phase 2 — Community (Sprint 3-4, ~2 weeks)
**Goal: Users can participate and contribute**
- [ ] Google OAuth + credentials auth
- [ ] User profiles with activity history
- [ ] Authenticated ratings with averages
- [ ] Reviews (text + video link, upvote/downvote)
- [ ] Comments (threaded, on movies/songs/artists)
- [ ] Watchlist and playlist
- [ ] User-created lists (public/private)
- [ ] Share buttons (WhatsApp priority, Instagram, copy link)
- [ ] Basic activity feed
- [ ] Community guidelines page

### Phase 3 — Contributions (Sprint 5-6, ~2 weeks)
**Goal: Community builds the database**
- [ ] Submit new movie/song/artist forms
- [ ] "Suggest an edit" on every page
- [ ] Add video to any page
- [ ] Submission review queue (admin)
- [ ] Edit review queue with diff view
- [ ] Reputation system + contributor levels
- [ ] Contributor leaderboard
- [ ] Badges
- [ ] Moderation tools (flag, ban, warn)

### Phase 4 — AI & Growth (Sprint 7-8, ~2 weeks)
**Goal: AI-powered discovery + growth loops**
- [ ] AI recommendation chatbot (/discover)
- [ ] AI-generated movie summaries
- [ ] AI lyric explanations for songs
- [ ] Release calendar with upcoming dates
- [ ] Email digest (weekly, AI-curated)
- [ ] Auto-generated "Best of [Year]" pages from ratings
- [ ] SEO category/year/genre pages
- [ ] Public API v1

### Phase 5 — Monetization (Sprint 9-10, ~2 weeks)
**Goal: Revenue**
- [ ] AdSense integration (non-intrusive placement)
- [ ] Affiliate links on streaming/ticket links
- [ ] Sponsored placement system for labels
- [ ] Premium tier (Stripe subscription)
- [ ] API rate limiting + paid tier
- [ ] Analytics dashboard for sponsors

## Credentials

### Admin Account (Seed)
- Email: admin@famouspunjabi.com
- Password: admin123456

### Sample Users (Seed)
- user1@example.com / password123
- user2@example.com / password123

## Key Decisions

- **Video-first:** Every page leads with embedded video. Text is secondary.
- **YouTube embeds only:** No self-hosted video. YouTube/Spotify/Instagram embeds.
- **Community-driven data:** Wikipedia model — users submit, mods approve.
- **No streaming:** We don't host content. We help you discover it and link to where it streams.
- **Mobile-first:** Design for phone screens. 70%+ traffic will be mobile.
- **Punjabi entertainment only:** Movies, songs, artists. No news, no gossip, no politics.
- **English + Gurmukhi:** All titles shown in both. Interface in English.
- **WhatsApp sharing priority:** WhatsApp is #1 sharing channel for Punjabi audience. Share buttons should prioritize WhatsApp.
- **No TikTok embeds:** TikTok banned in India. YouTube and Instagram only.
- **Package manager:** Always use `bun`, never `npm` or `npx`.

## Component Library

Use shadcn/ui components styled with the dark theme (black/dark gray + amber/gold accents):
- Cards for movies, songs, artists
- Dialogs for rating, review, submission forms
- Tabs for filmography/discography on artist pages
- Select/combobox for filters
- Skeleton loaders for all data-dependent sections
- Toast notifications for user actions

## File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Homepage
│   ├── movies/
│   │   ├── page.tsx                # Browse movies
│   │   └── [slug]/page.tsx         # Movie detail
│   ├── songs/
│   │   ├── page.tsx                # Browse songs
│   │   └── [slug]/page.tsx         # Song detail
│   ├── artists/
│   │   ├── page.tsx                # Browse artists
│   │   └── [slug]/page.tsx         # Artist detail
│   ├── trending/page.tsx
│   ├── releases/page.tsx
│   ├── search/page.tsx
│   ├── discover/page.tsx           # AI recommendations
│   ├── lists/
│   │   ├── page.tsx                # Browse lists
│   │   └── [userId]/[slug]/page.tsx
│   ├── submit/
│   │   ├── page.tsx                # Submission hub
│   │   ├── movie/page.tsx
│   │   ├── song/page.tsx
│   │   ├── artist/page.tsx
│   │   └── video/page.tsx
│   ├── edit/[type]/[slug]/page.tsx
│   ├── profile/
│   │   ├── [userId]/page.tsx       # Public profile
│   │   └── edit/page.tsx           # Edit own profile
│   ├── activity/page.tsx
│   ├── admin/
│   │   ├── page.tsx                # Dashboard
│   │   ├── submissions/page.tsx
│   │   ├── edits/page.tsx
│   │   ├── moderation/page.tsx
│   │   ├── movies/add/page.tsx
│   │   ├── songs/add/page.tsx
│   │   ├── artists/add/page.tsx
│   │   └── releases/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── movies/route.ts
│       ├── movies/[slug]/route.ts
│       ├── movies/trending/route.ts
│       ├── songs/route.ts
│       ├── songs/[slug]/route.ts
│       ├── songs/trending/route.ts
│       ├── artists/route.ts
│       ├── artists/[slug]/route.ts
│       ├── search/route.ts
│       ├── ratings/route.ts
│       ├── reviews/route.ts
│       ├── reviews/[id]/vote/route.ts
│       ├── comments/route.ts
│       ├── comments/[id]/flag/route.ts
│       ├── lists/route.ts
│       ├── lists/[id]/route.ts
│       ├── lists/[id]/like/route.ts
│       ├── watchlist/route.ts
│       ├── playlist/route.ts
│       ├── submissions/route.ts
│       ├── edits/route.ts
│       ├── users/[id]/route.ts
│       ├── users/[id]/follow/route.ts
│       ├── users/profile/route.ts
│       ├── admin/submissions/route.ts
│       ├── admin/edits/route.ts
│       ├── admin/stats/route.ts
│       ├── ai/recommend/route.ts
│       ├── ai/summarize/route.ts
│       ├── ai/lyrics/route.ts
│       ├── releases/route.ts
│       └── v1/                     # Public API
│           ├── movies/route.ts
│           ├── songs/route.ts
│           ├── artists/route.ts
│           └── search/route.ts
├── components/
│   ├── ui/                         # shadcn/ui base components
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   └── mobile-nav.tsx
│   ├── movies/
│   │   ├── movie-card.tsx
│   │   ├── movie-hero.tsx
│   │   ├── movie-cast.tsx
│   │   ├── movie-videos.tsx
│   │   └── movie-filters.tsx
│   ├── songs/
│   │   ├── song-card.tsx
│   │   ├── song-hero.tsx
│   │   ├── song-credits.tsx
│   │   └── song-filters.tsx
│   ├── artists/
│   │   ├── artist-card.tsx
│   │   ├── artist-hero.tsx
│   │   ├── filmography-table.tsx
│   │   └── discography-table.tsx
│   ├── community/
│   │   ├── rating-widget.tsx
│   │   ├── review-card.tsx
│   │   ├── review-form.tsx
│   │   ├── comment-thread.tsx
│   │   ├── comment-form.tsx
│   │   ├── user-list-card.tsx
│   │   ├── submission-form.tsx
│   │   ├── edit-form.tsx
│   │   ├── contributor-badge.tsx
│   │   └── leaderboard.tsx
│   ├── shared/
│   │   ├── video-embed.tsx
│   │   ├── spotify-embed.tsx
│   │   ├── share-buttons.tsx
│   │   ├── search-bar.tsx
│   │   ├── pagination.tsx
│   │   └── empty-state.tsx
│   └── discover/
│       └── ai-chat.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   ├── ai.ts                       # Claude API client
│   ├── youtube.ts                   # YouTube Data API helpers
│   ├── spotify.ts                   # Spotify API helpers
│   ├── tmdb.ts                      # TMDb API helpers (seeding)
│   ├── seo.ts                       # Structured data generators
│   └── reputation.ts               # Reputation calculation
└── types/
    └── index.ts                     # Shared TypeScript types
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="https://famouspunjabi.com"
NEXTAUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# AI
ANTHROPIC_API_KEY="..."

# APIs (for seeding/enrichment)
TMDB_API_KEY="..."
YOUTUBE_API_KEY="..."
SPOTIFY_CLIENT_ID="..."
SPOTIFY_CLIENT_SECRET="..."

# Storage
NEXT_PUBLIC_SUPABASE_URL="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS="true"
```

## Success Metrics

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Monthly visitors | 10K-30K | 50K-100K | 200K-500K |
| Registered users | 500 | 3,000 | 15,000 |
| Movies in database | 300 | 600 | 1,500+ |
| Songs in database | 1,000 | 3,000 | 10,000+ |
| Artists in database | 200 | 500 | 1,000+ |
| Community reviews | 200 | 2,000 | 15,000 |
| User-created lists | 50 | 500 | 3,000 |
| Monthly revenue | $100-500 | $1K-3K | $5K-15K |
| Google indexed pages | 1,000 | 5,000 | 15,000+ |

## Competitive Positioning

| Feature | FamousPunjabi | IMDb | Letterboxd | Wikipedia |
|---------|--------------|------|------------|-----------|
| Punjabi-specific | ✅ 100% | ❌ Generic | ❌ Generic | ❌ Generic |
| Video-first | ✅ | ❌ Text-heavy | ❌ Text-heavy | ❌ Text |
| Songs database | ✅ | ❌ Movies only | ❌ Movies only | Partial |
| Community lists | ✅ | ✅ Basic | ✅ | ❌ |
| AI recommendations | ✅ | ❌ | ❌ | ❌ |
| Gurmukhi script | ✅ | ❌ | ❌ | ✅ |
| Streaming links | ✅ | ✅ | ✅ JustWatch | ❌ |
| Community contributions | ✅ Wiki-style | ❌ Closed | ❌ | ✅ |
| Lyric explanations | ✅ AI-powered | ❌ | ❌ | ❌ |
| Punjabi artist social stats | ✅ | ❌ | ❌ | ❌ |

---

*FamousPunjabi.com — The home of Punjabi entertainment.*
