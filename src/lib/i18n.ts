import { href } from './urls';

export type Lang = 'en' | 'tr';
export const languages: Lang[] = ['en', 'tr'];
export const localPath = (path = '', lang: Lang = 'en') =>
  href(`${lang === 'tr' ? 'tr/' : ''}${path}`);
export const locale = (lang: Lang) => (lang === 'tr' ? 'tr-TR' : 'en-GB');
export const categoryLabel = (category: string, lang: Lang) =>
  lang === 'tr'
    ? {
        Notes: 'Notlar',
        Software: 'Yazılım',
        Personal: 'Kişisel',
        Atlantis: 'Atlantis',
      }[category] || category
    : category;

export const copy = {
  en: {
    description:
      'Software, stories, and things worth exploring. The personal website of Mehmet Berk Gürçay.',
    subtitle: 'Software & stories',
    nav: ['About', 'Writing', 'Atlantis'],
    skip: 'Skip to content',
    navigation: 'Main navigation',
    home: 'home',
    corner: 'A personal corner of the internet.',
    about: 'About me',
    hero: ['Software.', 'Stories.', 'And the space', 'in between.'],
    intro:
      "I'm a software developer, writing a book called Atlantis, and making room for the things that spark my curiosity.",
    aboutLink: 'A little about me',
    interests: 'Code · Words · Curiosity',
    explore: 'Explore below',
    orbit: 'A little order. A little exploration.',
    ways: 'A few ways in',
    threadsTitle: ['Different threads.', 'One curious mind.'],
    threads: [
      {
        index: '01 / Build',
        title: 'Software & work',
        description: 'Code, projects, and the problems worth figuring out.',
      },
      {
        index: '02 / Think',
        title: 'Notes & writing',
        description: 'A place for ideas, discoveries, and longer thoughts.',
      },
      {
        index: '03 / Imagine',
        title: 'Atlantis',
        description: 'A book in progress. Follow the story behind the writing.',
      },
    ],
    bookStatus: 'A work in progress',
    beyond: 'Beyond the code',
    bookTitle: ['Some ideas', 'become stories.'],
    bookDescription:
      "Atlantis is the book I'm writing. This is where I'll share pieces of the process, things I discover along the way, and the occasional glimpse inside.",
    bookLink: 'Step into Atlantis',
    notebook: 'From the notebook',
    words: 'Words, collected.',
    allWriting: 'All writing',
    aboutEyebrow: 'The person behind the pages',
    hello: "Hi, I'm",
    aboutLead:
      'A software developer with a place for stories, side projects, and curiosity.',
    shortIntro: 'A short introduction',
    bio: 'I build software and enjoy exploring ideas through code. This website brings that work together with the things I write and the interests I follow.',
    bioBookStart: "I'm also writing",
    bioBookEnd:
      '. It has its own corner here, alongside a growing collection of notes.',
    workTitle: ['Software', '& work.'],
    workText: 'For code and projects, you can find me on GitHub.',
    githubLink: 'Explore my GitHub',
    offTitle: ['Off the', 'keyboard.'],
    offText:
      "Writing, hobbies, and the things I make along the way belong here too. I'll share them in the notebook as this space grows.",
    notebookLink: 'Read the notebook',
    writingEyebrow: 'The notebook',
    writingTitle: ['Thinking', 'out loud.'],
    writingLead:
      'Notes on software, writing, and whatever catches my attention.',
    follow: 'Follow new writing with',
    published: 'Published writing',
    byline: 'A book by Mehmet Berk Gürçay',
    story: 'A story in the making.',
    writingStatus: 'Writing in progress',
    behind: ['Behind', 'the pages.'],
    atlantisIntro:
      "Atlantis is a book I'm writing. This page is its home: a place for updates, notes from the process, and pieces I choose to share.",
    atlantisMore:
      'For now, the story is taking shape. More will find its way here as I write.',
    journal: 'The writing journal',
    along: 'Along the way.',
    noUpdates:
      'The first journal entry is still ahead. Future updates will appear here.',
    notFoundEyebrow: '404 / A small detour',
    notFound: ['Off the', 'map.'],
    notFoundText: "This page couldn't be found.",
    backHome: 'Back to familiar ground',
    pageNotFound: 'Page not found',
  },
  tr: {
    description:
      'Yazılım, hikâyeler ve keşfetmeye değer şeyler. Mehmet Berk Gürçay’ın kişisel sitesi.',
    subtitle: 'Yazılım ve hikâyeler',
    nav: ['Hakkımda', 'Yazılar', 'Atlantis'],
    skip: 'İçeriğe geç',
    navigation: 'Ana menü',
    home: 'ana sayfa',
    corner: 'İnternette kişisel bir köşe.',
    about: 'Hakkımda',
    hero: ['Yazılım.', 'Hikâyeler.', 'Ve aralarında', 'kalan her şey.'],
    intro:
      'Yazılım geliştiriyorum, Atlantis adında bir kitap yazıyorum. Bir yandan da merakımı uyandıran şeylere alan açıyorum.',
    aboutLink: 'Biraz kendimden',
    interests: 'Kod · Kelimeler · Merak',
    explore: 'Keşfetmeye devam',
    orbit: 'Biraz düzen. Biraz keşif.',
    ways: 'Birkaç başlangıç noktası',
    threadsTitle: ['Farklı uğraşlar.', 'Aynı merak.'],
    threads: [
      {
        index: '01 / Üret',
        title: 'Yazılım ve çalışmalar',
        description: 'Kod, projeler ve çözmeye değer problemler.',
      },
      {
        index: '02 / Düşün',
        title: 'Notlar ve yazılar',
        description: 'Fikirler, keşifler ve uzun düşünceler için bir yer.',
      },
      {
        index: '03 / Hayal et',
        title: 'Atlantis',
        description: 'Yazmakta olduğum kitap ve yazının arkasındaki süreç.',
      },
    ],
    bookStatus: 'Yazım aşamasında',
    beyond: 'Kodun ötesinde',
    bookTitle: ['Bazı fikirler', 'hikâyeye dönüşür.'],
    bookDescription:
      'Atlantis, yazmakta olduğum kitap. Süreçten notları, yol boyunca keşfettiklerimi ve zaman zaman hikâyeden parçaları burada paylaşacağım.',
    bookLink: 'Atlantis’e bir adım',
    notebook: 'Defterden',
    words: 'Kelimeler biriktikçe.',
    allWriting: 'Bütün yazılar',
    aboutEyebrow: 'Sayfaların arkasındaki kişi',
    hello: 'Merhaba, ben',
    aboutLead:
      'Yazılım geliştiriyorum; hikâyelere, yan projelere ve meraka da yer açıyorum.',
    shortIntro: 'Kısa bir tanışma',
    bio: 'Yazılım geliştiriyorum ve fikirleri kodla keşfetmekten hoşlanıyorum. Bu site çalışmalarımı, yazılarımı ve ilgi alanlarımı bir araya getiriyor.',
    bioBookStart: 'Bir de',
    bioBookEnd:
      ' adında bir kitap yazıyorum. Büyüyen not defterinin yanında, onun da burada kendine ait bir köşesi var.',
    workTitle: ['Yazılım ve', 'çalışmalar.'],
    workText: 'Kod ve projeler için beni GitHub’da bulabilirsin.',
    githubLink: 'GitHub’ıma göz at',
    offTitle: ['Klavyenin', 'ötesinde.'],
    offText:
      'Yazılarım, hobilerim ve yol boyunca ürettiklerim de burada yer bulacak. Bu alan büyüdükçe onları da defterde paylaşacağım.',
    notebookLink: 'Deftere göz at',
    writingEyebrow: 'Not defteri',
    writingTitle: ['Sesli', 'düşünceler.'],
    writingLead: 'Yazılım, yazmak ve dikkatimi çeken şeyler üzerine notlar.',
    follow: 'Yeni yazıları takip etmek için',
    published: 'Yayımlanan yazılar',
    byline: 'Mehmet Berk Gürçay’ın kitabı',
    story: 'Şekillenmekte olan bir hikâye.',
    writingStatus: 'Yazım devam ediyor',
    behind: ['Sayfaların', 'arkasında.'],
    atlantisIntro:
      'Atlantis, yazmakta olduğum kitap. Bu sayfa onun evi: güncellemeler, süreçten notlar ve paylaşmayı seçtiğim parçalar için bir yer.',
    atlantisMore:
      'Şimdilik hikâye şekilleniyor. Ben yazdıkça burada da yeni şeyler birikecek.',
    journal: 'Yazım günlüğü',
    along: 'Yol boyunca.',
    noUpdates:
      'İlk günlük yazısı henüz yolda. Yeni güncellemeler burada yer alacak.',
    notFoundEyebrow: '404 / Küçük bir sapak',
    notFound: ['Haritanın', 'dışında.'],
    notFoundText: 'Bu sayfa bulunamadı.',
    backHome: 'Ana sayfaya dön',
    pageNotFound: 'Sayfa bulunamadı',
  },
};
