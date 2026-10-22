import type { Lang } from '../lib/i18n';

type Localized = Record<Lang, string>;
type Shelf = 'software' | 'travel' | 'notebook';
export interface CatalogPost {
  id: string;
  shelf: Shelf;
  title: Localized;
  description: Localized;
  art: 'interface' | 'landscape' | 'book' | 'orbit';
  tone: 'blue' | 'amber' | 'violet' | 'green';
}

/** Design samples only: these are not published articles and never enter RSS. */
export const catalogPosts: CatalogPost[] = [
  {
    id: 'quiet-interfaces',
    shelf: 'software',
    art: 'interface',
    tone: 'green',
    title: { tr: 'Sessiz arayüzler', en: 'Quiet interfaces' },
    description: {
      tr: 'Daha az öğeyle daha çok şey anlatmak. İyi bir arayüzün nerede geri çekildiğine dair notlar.',
      en: 'Saying more with fewer elements. Notes on knowing when an interface should step back.',
    },
  },
  {
    id: 'starting-small',
    shelf: 'software',
    art: 'orbit',
    tone: 'amber',
    title: { tr: 'Bir fikri küçük başlatmak', en: 'Starting an idea small' },
    description: {
      tr: 'Yan projeler, ilk adımlar ve her şeyi ilk günden çözmeye çalışmamak üzerine.',
      en: 'Side projects, first steps, and leaving room to figure things out along the way.',
    },
  },
  {
    id: 'behind-the-interface',
    shelf: 'software',
    art: 'interface',
    tone: 'blue',
    title: { tr: 'Bir arayüzün arkasında', en: 'Behind the interface' },
    description: {
      tr: 'Ekranda görünenin arkasındaki küçük kararlar: yapı, davranış ve detay.',
      en: 'The small decisions behind what appears on screen: structure, behaviour and detail.',
    },
  },
  {
    id: 'lighter-web',
    shelf: 'software',
    art: 'orbit',
    tone: 'violet',
    title: { tr: 'Daha hafif bir web', en: 'A lighter web' },
    description: {
      tr: 'Hızlı açılan, az şey isteyen ve uzun süre yaşayabilen küçük web siteleri.',
      en: 'Small websites that load quickly, ask for little, and have room to last.',
    },
  },
  {
    id: 'city-on-foot',
    shelf: 'travel',
    art: 'landscape',
    tone: 'amber',
    title: { tr: 'Bir şehri yürüyerek okumak', en: 'Reading a city on foot' },
    description: {
      tr: 'Ara sokaklar, küçük duraklar ve bir yere acele etmeden bakmanın yolları.',
      en: 'Side streets, small stops, and ways of looking at a place without rushing through it.',
    },
  },
  {
    id: 'museum-afternoon',
    shelf: 'travel',
    art: 'landscape',
    tone: 'violet',
    title: { tr: 'Müzede kaybolmak', en: 'An afternoon at the museum' },
    description: {
      tr: 'Bir eser, bir oda, beklenmedik bir ayrıntı. Müzeler için açık bir not defteri.',
      en: 'An object, a room, an unexpected detail. An open notebook for museum visits.',
    },
  },
  {
    id: 'around-a-table',
    shelf: 'travel',
    art: 'orbit',
    tone: 'green',
    title: { tr: 'Bir masanın etrafında', en: 'Around a table' },
    description: {
      tr: 'Bir yeri yemek üzerinden tanımak; restoranlar, tatlar ve akılda kalan küçük şeyler.',
      en: 'Getting to know a place through food: restaurants, flavours, and the little things that stay.',
    },
  },
  {
    id: 'unplanned-day',
    shelf: 'travel',
    art: 'landscape',
    tone: 'blue',
    title: { tr: 'Plansız bir günün rotası', en: 'A day without a plan' },
    description: {
      tr: 'Bazen en iyi rota biraz boşluk bırakır. Yol notları için bir başlangıç.',
      en: 'Sometimes the best route leaves a little space. A starting point for travel notes.',
    },
  },
  {
    id: 'unwritten-story',
    shelf: 'notebook',
    art: 'book',
    tone: 'violet',
    title: {
      tr: 'Hikâyenin henüz yazılmamış kısmı',
      en: 'The unwritten part of a story',
    },
    description: {
      tr: 'Bir dünyanın ilk izleri, karakterlerin sesi ve yazma sürecinin arada kalan anları.',
      en: 'The first traces of a world, the voices of its characters, and the moments between writing.',
    },
  },
  {
    id: 'in-the-margins',
    shelf: 'notebook',
    art: 'book',
    tone: 'amber',
    title: { tr: 'Kenarına not düştüklerim', en: 'Notes in the margins' },
    description: {
      tr: 'Okurken durup düşündüren cümleler ve onların açtığı küçük kapılar.',
      en: 'Sentences that make you pause while reading, and the small doors they open.',
    },
  },
  {
    id: 'following-curiosity',
    shelf: 'notebook',
    art: 'orbit',
    tone: 'blue',
    title: { tr: 'Merakın peşinde', en: 'Following curiosity' },
    description: {
      tr: 'Bir sorudan diğerine. Konusu henüz belli olmayan fikirler için biraz alan.',
      en: 'From one question to the next. A little room for ideas that do not have a category yet.',
    },
  },
  {
    id: 'room-for-making',
    shelf: 'notebook',
    art: 'interface',
    tone: 'green',
    title: { tr: 'Üretmeye yer açmak', en: 'Making room to make' },
    description: {
      tr: 'Hobiler, yarım kalan denemeler ve bir şeyi yalnızca merak ettiğin için yapmak.',
      en: 'Hobbies, unfinished experiments, and making something simply because you are curious.',
    },
  },
];

export const catalogShelves: {
  id: Shelf;
  title: Localized;
  subtitle: Localized;
}[] = [
  {
    id: 'software',
    title: { tr: 'Yazılım & üretim', en: 'Code & making' },
    subtitle: {
      tr: 'Kodun içinden ve etrafından.',
      en: 'Inside the code, and around it.',
    },
  },
  {
    id: 'travel',
    title: { tr: 'Yol notları', en: 'Out in the world' },
    subtitle: {
      tr: 'Şehirler, müzeler, sofralar.',
      en: 'Cities, museums, and tables.',
    },
  },
  {
    id: 'notebook',
    title: { tr: 'Hikâyeler & fikirler', en: 'Stories & ideas' },
    subtitle: {
      tr: 'Sayfaların arasında kalanlar.',
      en: 'What lives between the pages.',
    },
  },
];

// Fixed selection for the prototype. Change these IDs to curate the banner.
export const featuredPostIds = [
  'quiet-interfaces',
  'city-on-foot',
  'unwritten-story',
  'following-curiosity',
];
