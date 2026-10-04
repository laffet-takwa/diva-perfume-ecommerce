import type { DecantSize, Product, ProductArt, ProductSize } from '@/types'

/* ==========================================================================
   DIVA STORE — Catalogue
   A decants house: we decant Chanel, Dior, Gucci, YSL, Tom Ford and the rest of
   the great houses into 3 ml, 5 ml and 10 ml travel sprays. Fragrance names,
   houses and note pyramids are factual descriptions of real products; prices
   are indicative and in DT.

   Each entry is authored once as a `ProductSeed`, where `retail` is the price
   of the original full bottle. The 3/5/10 ml price ladder, the hero price and
   the full-bottle reference are all derived from it in `toProduct`, so a price
   is only ever written down once.

   Products that have real photography set `photo` + `photoAlt` (+ optional
   `photoTone`) and Flacon renders the photograph in place of the drawn bottle.
   `photoTone: 'light'` is a white-studio shot multiplied into the house plate;
   `'dark'` fills the frame instead. Everything else is drawn from the product's
   `art` recipe. File naming follows the slug: /images/products/<slug>.<ext>.
   Every photograph is listed in public/images/products/CREDITS.md.
   ========================================================================== */

/** Volume of the original bottle every fragrance is decanted from. */
export const FULL_BOTTLE_ML = 100

/** The volume we lead with on cards and in search. */
export const HERO_DECANT: DecantSize = 5

/** Every volume we decant, smallest first — drives the size pickers. */
export const DECANT_SIZES: readonly DecantSize[] = [3, 5, 10]

/** Copy per volume, used by the size pickers and the shop-by-size shelf. */
export const DECANT_SIZE_COPY: Record<
  DecantSize,
  { label: string; kicker: string; blurb: string; sprays: string }
> = {
  3: {
    label: '3 ml',
    kicker: 'The sampler',
    blurb: 'Three to five wears. The right way to meet a fragrance for the first time.',
    sprays: '≈ 40 sprays',
  },
  5: {
    label: '5 ml',
    kicker: 'The signature',
    blurb: 'Our most-loved decant. Long enough to live in your bag for a season.',
    sprays: '≈ 70 sprays',
  },
  10: {
    label: '10 ml',
    kicker: 'The commitment',
    blurb: 'The best value per millilitre, for a scent you already know you love.',
    sprays: '≈ 140 sprays',
  },
}

/**
 * Derives the decant ladder from the retail price of the full bottle.
 * The curve is gently sub-linear — bigger decants cost less per millilitre, the
 * way they do in every decant house — with a floor so entry-level fragrances
 * never decants down to an unviable ticket.
 */
function decants(retail: number): ProductSize[] {
  const price = (ratio: number, floor: number) => Math.max(floor, Math.round((retail * ratio) / 5) * 5)
  return [
    { ml: 3, price: price(0.12, 25) },
    { ml: 5, price: price(0.18, 35) },
    { ml: 10, price: price(0.3, 55) },
  ]
}

/** A catalogue entry as authored: `retail` is the price of the full bottle. */
type ProductSeed = Omit<Product, 'price' | 'sizes' | 'fullBottle'> & { retail: number }

const SEED: ProductSeed[] = [
  /* ---------------------------------------------------------------- WOMEN */
  {
    id: 'p-coco-mademoiselle',
    slug: 'chanel-coco-mademoiselle',
    name: 'Coco Mademoiselle',
    brand: 'Chanel',
    retail: 389,
    category: 'Floral',
    categoryLabel: 'Floral Eau de Parfum',
    gender: 'women',
    rating: 4.8,
    reviews: 1284,
    badge: 'BESTSELLER',
    notes: {
      top: ['Bergamot', 'Lemon', 'Orange Blossom'],
      heart: ['Rose', 'Jasmine', 'Lily of the Valley'],
      base: ['Patchouli', 'Vanilla', 'Sandalwood', 'White Musk'],
    },
    description: 'The modern Chanel girl: bright, square-shouldered, impossible to ignore.',
    longDescription:
      'Coco Mademoiselle opens on a sparkling bergamot and lemon, then turns decisively floral with rose, jasmine and a cool lily of the valley. Patchouli and sandalwood give it the depth of a Chanel, while clean white musk keeps it light on skin. Composed by Jacques Polge, it has been the reference modern chypre since 2001.',
    photo: '/images/products/chanel-coco-mademoiselle.jpg',
    photoAlt: 'Chanel Coco Mademoiselle Eau de Parfum bottle',
    photoTone: 'light',
    art: { juice: '#EFC3B0', glass: '#F8E4DC', cap: '#F2EFEA', hardware: '#B99A52', backdrop: '#F6E9E3', silhouette: 'rect' },
    moods: ['Elegant', 'Confident'],
    noteTags: ['Jasmine', 'Musk', 'Vanilla', 'Woody', 'Rose'],
    releasedAt: '2024-11-04',
    popularity: 98,
  },
  {
    id: 'p-jadore',
    slug: 'dior-jadore',
    name: "J'adore",
    brand: 'Dior',
    retail: 349,
    category: 'Floral',
    categoryLabel: 'Floral Eau de Parfum',
    gender: 'women',
    rating: 4.7,
    reviews: 962,
    badge: 'BESTSELLER',
    notes: {
      top: ['Pear', 'Melon', 'Magnolia', 'Peach'],
      heart: ['Rose', 'Jasmine', 'Lily of the Valley'],
      base: ['Musk', 'Vanilla', 'Patchouli', 'Violet Leaf'],
    },
    description: 'A gold-threaded floral, polished to a mirror shine.',
    longDescription:
      "J'adore is sunlight through glass. Pear, melon and magnolia arrive bright and golden, then rose and jasmine unfurl at the heart. It dries down to musk, vanilla and a whisper of violet leaf — polished, never sweet for the sake of it. The bottle's gold collar is as famous as the scent inside it.",
    photo: '/images/products/dior-jadore.jpg',
    photoAlt: 'Dior J’adore Eau de Parfum bottle',
    photoTone: 'light',
    art: { juice: '#F0C563', glass: '#FBEBC6', cap: '#B99A52', hardware: '#8E6B2E', backdrop: '#F7EFDC', silhouette: 'oval' },
    moods: ['Elegant', 'Romantic'],
    noteTags: ['Rose', 'Jasmine', 'Musk', 'Vanilla'],
    releasedAt: '2024-06-18',
    popularity: 94,
  },
  {
    id: 'p-delina',
    slug: 'parfums-de-marly-delina',
    name: 'Delina',
    brand: 'Parfums de Marly',
    retail: 520,
    category: 'Floral',
    categoryLabel: 'Floral Eau de Parfum',
    gender: 'women',
    rating: 4.9,
    reviews: 741,
    badge: 'EXCLUSIVE',
    notes: {
      top: ['Bergamot', 'Pear', 'Raspberry'],
      heart: ['Turkish Rose', 'Rose de Mai', 'Jasmine', 'Pink Pepper'],
      base: ['Amber', 'Vanilla', 'Musk', 'Patchouli'],
    },
    description: 'Turkish rose over a warm, spiced base — loud on purpose.',
    longDescription:
      'Delina is the fragrance people buy for weddings. Bergamot, pear and raspberry open it up, then Turkish rose, Rose de Mai and jasmine take over completely. The base is unapologetic: amber, vanilla, patchouli and musk, warmed by pink pepper. Wear one drop too much. That is the point.',
    photo: '/images/products/parfums-de-marly-delina.jpg',
    photoAlt: 'Parfums de Marly Delina Eau de Parfum bottle and box',
    photoTone: 'light',
    art: { juice: '#E8A9B4', glass: '#F7DCE2', cap: '#D8A7B4', hardware: '#B99A52', backdrop: '#F6E4E6', silhouette: 'faceted' },
    moods: ['Romantic', 'Confident'],
    noteTags: ['Rose', 'Jasmine', 'Amber', 'Vanilla', 'Musk'],
    releasedAt: '2025-09-02',
    popularity: 99,
  },
  {
    id: 'p-flowerbomb',
    slug: 'viktor-rolf-flowerbomb',
    name: 'Flowerbomb',
    brand: 'Viktor&Rolf',
    retail: 389,
    category: 'Floral',
    categoryLabel: 'Floral Eau de Parfum',
    gender: 'women',
    rating: 4.8,
    reviews: 1120,
    badge: 'BESTSELLER',
    notes: {
      top: ['Bergamot', 'Peach', 'Passion Fruit'],
      heart: ['Jasmine', 'Rose', 'Orange Blossom', 'Peony'],
      base: ['Patchouli', 'Vanilla', 'Musk', 'Sandalwood'],
    },
    description: 'A candy-floral bouquet with a patchouli backbone.',
    longDescription:
      'Flowerbomb opens like a snapped sweet: passion fruit and peach, then jasmine, rose and orange blossom in full bloom. Underneath the sugar sits a serious patchouli, sandalwood and musk base that keeps it from turning cloying. Viktor&Rolf made it in 2010 as the anti-chic alternative to a floriental cliché.',
    photo: '/images/products/viktor-rolf-flowerbomb.jpg',
    photoAlt: 'Viktor and Rolf Flowerbomb Eau de Parfum bottle',
    photoTone: 'light',
    art: { juice: '#F2C0CB', glass: '#FADFE5', cap: '#D9A9B6', hardware: '#B99A52', backdrop: '#F7E6E8', silhouette: 'faceted' },
    moods: ['Romantic', 'Elegant'],
    noteTags: ['Jasmine', 'Rose', 'Vanilla', 'Musk'],
    releasedAt: '2024-12-12',
    popularity: 95,
  },
  {
    id: 'p-bloom',
    slug: 'gucci-bloom',
    name: 'Bloom',
    brand: 'Gucci',
    retail: 249,
    category: 'Floral',
    categoryLabel: 'Floral Eau de Toilette',
    gender: 'women',
    rating: 4.6,
    reviews: 1503,
    badge: 'BESTSELLER',
    notes: {
      top: ['Tangerine', 'Green Notes', 'Bergamot'],
      heart: ['Rose', 'Jasmine', 'Honeysuckle'],
      base: ['Sandalwood', 'Musk', 'Vanilla'],
    },
    description: 'A white-flower garden, edit-free and endlessly re-spritzed.',
    longDescription:
      'Bloom is deliberately simple, which is why it sells by the bottle. Tangerine and leafy greens lift a heart of rose, jasmine and honeysuckle, over a soft sandalwood-musk base. It is an eau de toilette, so it lives closer to the skin — re-apply, and again.',
    photo: '/images/products/gucci-bloom.jpg',
    photoAlt: 'Gucci Bloom Eau de Toilette bottle',
    photoTone: 'light',
    art: { juice: '#F4DCE0', glass: '#FAEBEE', cap: '#E3BFC7', hardware: '#B99A52', backdrop: '#F7EAEC', silhouette: 'rect' },
    moods: ['Fresh', 'Romantic'],
    noteTags: ['Rose', 'Jasmine', 'Musk', 'Vanilla', 'Citrus'],
    releasedAt: '2024-04-22',
    popularity: 93,
  },
  {
    id: 'p-mon-paris',
    slug: 'ysl-mon-paris',
    name: 'Mon Paris',
    brand: 'YSL',
    retail: 329,
    category: 'Floral',
    categoryLabel: 'Floral Fruity Eau de Parfum',
    gender: 'women',
    rating: 4.5,
    reviews: 688,
    notes: {
      top: ['Pear', 'Bergamot', 'Strawberry'],
      heart: ['Peony', 'Jasmine', 'Rose', 'Mimosa'],
      base: ['White Musk', 'Vanilla', 'Patchouli'],
    },
    description: 'A candy-floral with a YSL chain around its neck.',
    longDescription:
      'Mon Paris is built around juicy fruit — pear, strawberry and bergamot — over a peony and jasmine heart brightened with mimosa. White musk and patchouli give it a soft, powdery trail. The black cassandre chain is the giveaway: this one announces itself before you do.',
    photo: '/images/products/ysl-mon-paris.jpg',
    photoAlt: 'YSL Mon Paris Eau de Parfum bottle',
    photoTone: 'light',
    art: { juice: '#F0C9D2', glass: '#FAE3E8', cap: '#B99A52', hardware: '#0E0E10', backdrop: '#F6E7EA', silhouette: 'rect' },
    moods: ['Romantic', 'Energetic'],
    noteTags: ['Rose', 'Jasmine', 'Musk', 'Vanilla', 'Citrus'],
    releasedAt: '2025-01-16',
    popularity: 88,
  },
  {
    id: 'p-si',
    slug: 'giorgio-armani-si',
    name: 'Sì',
    brand: 'Giorgio Armani',
    retail: 289,
    category: 'Oriental',
    categoryLabel: 'Floral Oriental Eau de Parfum',
    gender: 'women',
    rating: 4.6,
    reviews: 534,
    notes: {
      top: ['Bergamot', 'Mandarin', 'Peach'],
      heart: ['Rose', 'Jasmine', 'Neroli', 'Lily of the Valley'],
      base: ['Amber', 'Musk', 'Sandalwood', 'Cedar'],
    },
    description: 'Yes, absolutely — a modern white floral with amber footing.',
    longDescription:
      'Armani Sì pairs mandarin and peach with rose, jasmine and neroli, then grounds the whole thing in amber, musk and sandalwood. It reads feminine without being sweet, which is exactly why it holds up in an office. The hammered amber cap is one of the most reproduced details in modern perfumery.',
    photo: '/images/products/giorgio-armani-si.jpg',
    photoAlt: 'Giorgio Armani Si Eau de Parfum bottle with box',
    photoTone: 'light',
    art: { juice: '#EED9BC', glass: '#F7EBDA', cap: '#2B2426', hardware: '#B99A52', backdrop: '#F6EDE0', silhouette: 'rect' },
    moods: ['Elegant', 'Confident'],
    noteTags: ['Rose', 'Jasmine', 'Amber', 'Musk', 'Citrus'],
    releasedAt: '2024-08-30',
    popularity: 90,
  },
  {
    id: 'p-no-5',
    slug: 'chanel-no-5',
    name: 'N°5 Eau de Parfum',
    brand: 'Chanel',
    retail: 419,
    category: 'Floral',
    categoryLabel: 'Floral Aldehyde Eau de Parfum',
    gender: 'women',
    rating: 4.9,
    reviews: 2107,
    badge: 'EXCLUSIVE',
    notes: {
      top: ['Lemon', 'Bergamot', 'Neroli'],
      heart: ['Jasmine', 'Rose', 'Lily of the Valley'],
      base: ['Sandalwood', 'Amber', 'Vanilla', 'Musk'],
    },
    description: 'The reference point. Everything after it is a response.',
    longDescription:
      'Ernest Beaux built N°5 in 1921 around a single idea: a perfume for a woman, not for a man. Aldehydes give it that metallic lift, ylang-ylang and jasmine keep it radiant, and sandalwood gives it a spine. A hundred years on, it is still the most recognisable bottle in the world.',
    photo: '/images/products/chanel-no-5.jpg',
    photoAlt: 'Chanel N5 Eau de Parfum bottle',
    photoTone: 'dark',
    art: { juice: '#F6EAD8', glass: '#FBF6EC', cap: '#EFEAE0', hardware: '#B99A52', backdrop: '#F4EDE2', silhouette: 'rect' },
    moods: ['Elegant', 'Mysterious'],
    noteTags: ['Jasmine', 'Rose', 'Vanilla', 'Amber', 'Musk', 'Woody'],
    releasedAt: '2025-03-08',
    popularity: 97,
  },
  {
    id: 'p-good-girl',
    slug: 'carolina-herrera-good-girl',
    name: 'Good Girl',
    brand: 'Carolina Herrera',
    retail: 369,
    category: 'Floral',
    categoryLabel: 'Floral Amber Eau de Parfum',
    gender: 'women',
    rating: 4.6,
    reviews: 921,
    notes: {
      top: ['Mandarin', 'Bergamot', 'Pear'],
      heart: ['Rose', 'Jasmine', 'Iris', 'Orange Blossom'],
      base: ['Amber', 'Patchouli', 'Vanilla', 'Musk'],
    },
    description: 'A couture white floral that refuses to whisper.',
    longDescription:
      'Good Girl opens with mandarin and bergamot, then rose, jasmine and iris at full volume. The base is amber, patchouli and vanilla — a warm, plush landing that makes it last well past midnight. The stiletto cap is the joke; the scent inside is entirely serious.',
    art: { juice: '#F3DCC8', glass: '#F9EDE2', cap: '#0E0E10', hardware: '#B99A52', backdrop: '#F5EBE2', silhouette: 'rect' },
    moods: ['Confident', 'Romantic'],
    noteTags: ['Rose', 'Jasmine', 'Amber', 'Vanilla', 'Musk'],
    releasedAt: '2025-02-27',
    popularity: 92,
  },
  {
    id: 'p-la-vie-est-belle',
    slug: 'lancome-la-vie-est-belle',
    name: 'La Vie Est Belle',
    brand: 'Lancôme',
    retail: 259,
    category: 'Gourmand',
    categoryLabel: 'Floral Gourmand Eau de Parfum',
    gender: 'women',
    rating: 4.5,
    reviews: 774,
    notes: {
      top: ['Pear', 'Black Currant', 'Orange Blossom'],
      heart: ['Jasmine', 'Iris', 'Orange Blossom'],
      base: ['Patchouli', 'Vanilla', 'White Musk'],
    },
    description: 'The vanilla that taught an entire generation what sweet meant.',
    longDescription:
      'Black currant and pear open La Vie Est Belle with a tart edge, and iris keeps the heart elegant rather than syrupy. Then patchouli, vanilla and white musk build the soft, edible base everyone remembers. It is still the reference gourmand in most wardrobes.',
    photo: '/images/products/lancome-la-vie-est-belle.jpg',
    photoAlt: 'Lancome La Vie Est Belle Eau de Parfum bottle and box',
    photoTone: 'light',
    art: { juice: '#F1D3C0', glass: '#F9E8DD', cap: '#E0A88F', hardware: '#B99A52', backdrop: '#F6EAE2', silhouette: 'oval' },
    moods: ['Romantic', 'Elegant'],
    noteTags: ['Vanilla', 'Jasmine', 'Musk'],
    releasedAt: '2024-03-14',
    popularity: 87,
  },
  {
    id: 'p-scandal',
    slug: 'jean-paul-gaultier-scandal',
    name: 'Scandal',
    brand: 'Jean Paul Gaultier',
    retail: 299,
    category: 'Oriental',
    categoryLabel: 'Oriental Gourmand Eau de Parfum',
    gender: 'women',
    rating: 4.4,
    reviews: 486,
    notes: {
      top: ['Blood Orange', 'Bergamot', 'Pear'],
      heart: ['Coffee', 'Jasmine', 'Tuberose'],
      base: ['Amber', 'Musk', 'Benzoin', 'Vanilla'],
    },
    description: 'Coffee, blood orange and a scandalously sweet amber base.',
    longDescription:
      'Scandal pairs blood orange and bergamot with a coffee-tinged heart of jasmine and tuberose. The base is pure indulgence: amber, benzoin, musk and vanilla. It reads leather-and-cigar from a distance and caramel up close — Gaultier at his most theatrical without the joke.',
    art: { juice: '#B8483F', glass: '#D97A6C', cap: '#0E0E10', hardware: '#B99A52', backdrop: '#F3E0DC', silhouette: 'oval' },
    moods: ['Mysterious', 'Confident'],
    noteTags: ['Amber', 'Musk', 'Vanilla', 'Jasmine', 'Woody'],
    releasedAt: '2025-05-20',
    popularity: 86,
  },
  {
    id: 'p-for-her',
    slug: 'narciso-rodriguez-for-her',
    name: 'For Her',
    brand: 'Narciso Rodriguez',
    retail: 239,
    category: 'Musk',
    categoryLabel: 'Musk Eau de Toilette',
    gender: 'women',
    rating: 4.6,
    reviews: 612,
    notes: {
      top: ['Bergamot', 'Peony', 'Pear'],
      heart: ['Jasmine', 'Rose', 'Musk'],
      base: ['Musk', 'Amber', 'Cashmeran', 'Vanilla'],
    },
    description: 'Skin musk with a peach-petal softness.',
    longDescription:
      'Narciso Rodriguez built For Her around the idea that musk should feel like clean skin. Bergamot and peony lighten the opening, rose and jasmine keep it floral, and cashmeran plus vanilla give it that powder-soft base. The pink bottle is deliberately unremarkable; the scent is not.',
    photo: '/images/products/narciso-rodriguez-for-her.jpg',
    photoAlt: 'Narciso Rodriguez For Her Eau de Parfum bottle',
    photoTone: 'light',
    art: { juice: '#F4DCE4', glass: '#FAE9EE', cap: '#E7C2CF', hardware: '#B99A52', backdrop: '#F6E7EC', silhouette: 'rect' },
    moods: ['Fresh', 'Elegant'],
    noteTags: ['Musk', 'Rose', 'Jasmine', 'Vanilla'],
    releasedAt: '2024-10-09',
    popularity: 85,
  },

  /* ----------------------------------------------------------------- MEN */
  {
    id: 'p-sauvage',
    slug: 'dior-sauvage',
    name: 'Sauvage',
    brand: 'Dior',
    retail: 359,
    category: 'Fresh',
    categoryLabel: 'Fresh Woody Eau de Parfum',
    gender: 'men',
    rating: 4.9,
    reviews: 3188,
    badge: 'BESTSELLER',
    notes: {
      top: ['Bergamot', 'Peppermint', 'Pink Pepper'],
      heart: ['Lavender', 'Sichuan Pepper', 'Geranium', 'Elemi'],
      base: ['Ambroxan', 'Vetiver', 'Cedar', 'Patchouli'],
    },
    description: 'The benchmark modern masculine. Sharp, warm, unshakeable.',
    longDescription:
      'Sauvage opens on a blast of bergamot and peppers, calms to lavender and Sichuan pepper, and dries down to ambroxan and vetiver. It is the most worn masculine of the last decade because it adapts to everyone — office at nine, evening at eleven. The blue bottle is instantly recognisable across a room.',
    photo: '/images/products/dior-sauvage.jpg',
    photoAlt: 'Dior Sauvage Eau de Parfum box',
    photoTone: 'dark',
    art: { juice: '#DCE4E8', glass: '#EEF3F6', cap: '#2B3238', hardware: '#B99A52', backdrop: '#E9EEF2', silhouette: 'rect' },
    moods: ['Confident', 'Fresh'],
    noteTags: ['Citrus', 'Woody', 'Amber', 'Musk'],
    releasedAt: '2025-06-11',
    popularity: 99,
  },
  {
    id: 'p-ombre-leather',
    slug: 'tom-ford-ombre-leather',
    name: 'Ombré Leather',
    brand: 'Tom Ford',
    retail: 690,
    category: 'Woody',
    categoryLabel: 'Woody Leather Parfum',
    gender: 'men',
    rating: 4.8,
    reviews: 843,
    badge: 'EXCLUSIVE',
    notes: {
      top: ['Cardamom', 'Saffron', 'Artemisia'],
      heart: ['Leather', 'Jasmine', 'Orris', 'Thyme'],
      base: ['Amber', 'Benzoin', 'Sandalwood', 'Cedar'],
    },
    description: 'High leather, high stitch — the expensive one.',
    longDescription:
      'Cardamom, saffron and artemisia flare up front before leather takes over the middle. Jasmine and orris soften it just enough, and amber, benzoin, sandalwood and cedar give it a long, glossy trail. This is the fragrance people buy when they have something to prove.',
    photo: '/images/products/tom-ford-ombre-leather.png',
    photoAlt: 'Tom Ford Ombre Leather Eau de Parfum bottle',
    photoTone: 'light',
    art: { juice: '#8E4A2E', glass: '#A8663F', cap: '#2E2320', hardware: '#B99A52', backdrop: '#EFE2D6', silhouette: 'rect' },
    moods: ['Confident', 'Mysterious'],
    noteTags: ['Woody', 'Amber', 'Oud', 'Jasmine'],
    releasedAt: '2025-07-30',
    popularity: 96,
  },
  {
    id: 'p-y-edp',
    slug: 'ysl-y-edp',
    name: 'Y Eau de Parfum',
    brand: 'YSL',
    retail: 309,
    category: 'Fresh',
    categoryLabel: 'Fresh Woody Eau de Parfum',
    gender: 'men',
    rating: 4.5,
    reviews: 429,
    notes: {
      top: ['Bergamot', 'Apple', 'Ginger'],
      heart: ['Sage', 'Juniper', 'Geranium'],
      base: ['Sandalwood', 'Amber', 'Musk', 'Cedarwood'],
    },
    description: 'Cold, clean and quietly expensive.',
    longDescription:
      'Y opens with bergamot, crisp apple and a lift of ginger, then sage and juniper for a herbal, almost outdoorsy middle. Sandalwood, amber and cedarwood keep it composed and quietly expensive. It is the YSL man who does not need to raise his voice.',
    art: { juice: '#DDE6E2', glass: '#EDF3F0', cap: '#2B3238', hardware: '#B99A52', backdrop: '#E8EFEC', silhouette: 'rect' },
    moods: ['Fresh', 'Elegant'],
    noteTags: ['Citrus', 'Woody', 'Amber', 'Musk'],
    releasedAt: '2024-09-26',
    popularity: 84,
  },
  {
    id: 'p-luna-rossa',
    slug: 'prada-luna-rossa',
    name: 'Luna Rossa',
    brand: 'Prada',
    retail: 259,
    category: 'Woody',
    categoryLabel: 'Aromatic Fresh Eau de Toilette',
    gender: 'men',
    rating: 4.6,
    reviews: 704,
    notes: {
      top: ['Lemon', 'Mandarin', 'Lavender'],
      heart: ['Basil', 'Coriander', 'Peppermint'],
      base: ['Amber', 'Sandalwood', 'Musk', 'Cedar'],
    },
    description: 'A sports-fresh lavender that still smells expensive.',
    longDescription:
      'Luna Rossa combines lemon, mandarin and lavender with basil and coriander for a sharp, athletic opening. Amber, sandalwood and musk give it a dry, woody base that outlives its sporty reputation. The silver-blue bottle has barely changed since 2017.',
    photo: '/images/products/prada-luna-rossa.jpg',
    photoAlt: 'Prada Luna Rossa Eau de Parfum box with bottle',
    photoTone: 'dark',
    art: { juice: '#D7E4EC', glass: '#EAF2F7', cap: '#9FB6C6', hardware: '#B99A52', backdrop: '#E9F0F5', silhouette: 'rect' },
    moods: ['Fresh', 'Energetic'],
    noteTags: ['Citrus', 'Woody', 'Musk'],
    releasedAt: '2024-05-19',
    popularity: 88,
  },
  {
    id: 'p-eros',
    slug: 'versace-eros',
    name: 'Eros',
    brand: 'Versace',
    retail: 239,
    category: 'Fresh',
    categoryLabel: 'Fresh Vanilla Eau de Parfum',
    gender: 'men',
    rating: 4.4,
    reviews: 1188,
    notes: {
      top: ['Mint', 'Lemon', 'Apple'],
      heart: ['Tonka', 'Violet', 'Cypress'],
      base: ['Amber', 'Sandalwood', 'Cedar', 'Vanilla'],
    },
    description: 'Mint, tonka and vanilla — the sweet spot of the blue bottle.',
    longDescription:
      'Eros opens cold with mint, lemon and apple, then tonka bean and violet warm it up. The base is amber, sandalwood, cedar and just enough vanilla to soften the citrus. Loud packaging aside, it is genuinely easy to wear and consistently the first one a customer buys.',
    photo: '/images/products/versace-eros.jpg',
    photoAlt: 'Versace Eros Eau de Parfum bottle',
    photoTone: 'light',
    art: { juice: '#CFE0E8', glass: '#E3EFF4', cap: '#2E6E8E', hardware: '#B99A52', backdrop: '#E4EFF4', silhouette: 'oval' },
    moods: ['Fresh', 'Energetic'],
    noteTags: ['Citrus', 'Vanilla', 'Woody', 'Amber', 'Musk'],
    releasedAt: '2024-02-08',
    popularity: 89,
  },
  {
    id: 'p-acqua-di-gio',
    slug: 'giorgio-armani-acqua-di-gio',
    name: 'Acqua di Gio',
    brand: 'Giorgio Armani',
    retail: 259,
    category: 'Fresh',
    categoryLabel: 'Aquatic Fresh Eau de Toilette',
    gender: 'men',
    rating: 4.7,
    reviews: 1436,
    notes: {
      top: ['Lemon', 'Bergamot', 'Grapefruit'],
      heart: ['Lavender', 'Sage', 'Sea Notes'],
      base: ['Musk', 'Cedar', 'Amber', 'Tonka'],
    },
    description: 'The Mediterranean in a bottle, since 1996.',
    longDescription:
      'Acqua di Gio opens on lemon, bergamot and grapefruit over a heart of lavender and sage, with sea notes doing what the name promises. Musk, cedar and amber give it a dry, mineral base. It is the reason so many men started wearing cologne at all.',
    photo: '/images/products/giorgio-armani-acqua-di-gio.jpg',
    photoAlt: 'Giorgio Armani Acqua di Gio Pour Homme bottle',
    photoTone: 'light',
    art: { juice: '#CFE3E4', glass: '#E5F0F0', cap: '#8FA9AC', hardware: '#B99A52', backdrop: '#E6F0F0', silhouette: 'rect' },
    moods: ['Fresh', 'Elegant'],
    noteTags: ['Citrus', 'Musk', 'Woody', 'Amber'],
    releasedAt: '2024-01-24',
    popularity: 91,
  },
  {
    id: 'p-bzero1',
    slug: 'bvlgari-bzero1',
    name: 'B.zero1',
    brand: 'Bvlgari',
    retail: 289,
    category: 'Woody',
    categoryLabel: 'Woody Aromatic Eau de Toilette',
    gender: 'men',
    rating: 4.5,
    reviews: 512,
    notes: {
      top: ['Lemon', 'Basil', 'Mandarin'],
      heart: ['Juniper', 'Iris', 'Rose'],
      base: ['Amber', 'Cedar', 'Sandalwood', 'Patchouli'],
    },
    description: 'A spiral-capped woody that hides its sweetness well.',
    longDescription:
      'B.zero1 opens with lemon, basil and mandarin, moves through juniper, iris and a touch of rose, then settles on amber, cedar, sandalwood and patchouli. The gold spiral cap is a design object in its own right. Built for the man who likes his woodwork turned up slightly.',
    art: { juice: '#D8C08A', glass: '#EBDCBC', cap: '#B99A52', hardware: '#8E6B2E', backdrop: '#F1E7D2', silhouette: 'rect' },
    moods: ['Elegant', 'Confident'],
    noteTags: ['Woody', 'Amber', 'Citrus', 'Rose'],
    releasedAt: '2024-07-15',
    popularity: 83,
  },
  {
    id: 'p-explorer',
    slug: 'montblanc-explorer',
    name: 'Explorer',
    brand: 'Montblanc',
    retail: 259,
    category: 'Woody',
    categoryLabel: 'Woody Fresh Eau de Parfum',
    gender: 'men',
    rating: 4.4,
    reviews: 397,
    notes: {
      top: ['Grapefruit', 'Lemon', 'Bergamot'],
      heart: ['Clary Sage', 'Cedar', 'Violet Leaf'],
      base: ['Amber', 'Cedarwood', 'Benzoin', 'Musk'],
    },
    description: 'A citrus-wood trail built for open air.',
    longDescription:
      'Explorer opens sharp with grapefruit, lemon and bergamot, settles into clary sage and cedar with a violet leaf edge, then lands on amber, cedarwood and benzoin. It reads as confident rather than casual, which is a neat trick for something this easy to wear.',
    art: { juice: '#CBD8C8', glass: '#E1EADF', cap: '#3A4A3E', hardware: '#B99A52', backdrop: '#E6EDE4', silhouette: 'faceted' },
    moods: ['Fresh', 'Energetic'],
    noteTags: ['Woody', 'Citrus', 'Amber', 'Musk'],
    releasedAt: '2025-04-02',
    popularity: 80,
  },
  {
    id: 'p-invictus',
    slug: 'paco-rabanne-invictus',
    name: 'Invictus',
    brand: 'Paco Rabanne',
    retail: 219,
    category: 'Fresh',
    categoryLabel: 'Fresh Amber Eau de Toilette',
    gender: 'men',
    rating: 4.3,
    reviews: 967,
    notes: {
      top: ['Grapefruit', 'Bergamot', 'Mandarin'],
      heart: ['Coriander', 'Laurel', 'Neroli'],
      base: ['Amber', 'Musk', 'Sandalwood', 'Benzoin'],
    },
    description: 'Marine and citrus, priced for the school run.',
    longDescription:
      'Invictus leads with grapefruit, bergamot and mandarin, adds a coriander and laurel middle, and closes on amber, musk and sandalwood. It is marine without the marine cliché, and it is the most affordable bottle on this shelf by a distance.',
    photo: '/images/products/paco-rabanne-invictus.jpg',
    photoAlt: 'Paco Rabanne Invictus Eau de Parfum bottle and box',
    photoTone: 'light',
    art: { juice: '#BBD6DC', glass: '#DCE9EC', cap: '#2E6E8E', hardware: '#B99A52', backdrop: '#E1EDF0', silhouette: 'oval' },
    moods: ['Fresh', 'Energetic'],
    noteTags: ['Citrus', 'Amber', 'Musk', 'Woody'],
    releasedAt: '2024-06-05',
    popularity: 82,
  },
  {
    id: 'p-pour-homme',
    slug: 'narciso-rodriguez-pour-homme',
    name: 'Pour Homme',
    brand: 'Narciso Rodriguez',
    retail: 229,
    category: 'Musk',
    categoryLabel: 'Musk Eau de Toilette',
    gender: 'men',
    rating: 4.5,
    reviews: 358,
    notes: {
      top: ['Bergamot', 'Ginger', 'Maté'],
      heart: ['Musk', 'Rose', 'Cinnamon'],
      base: ['Musk', 'Amber', 'Sandalwood', 'Vanilla'],
    },
    description: 'The softest musk on the floor, and the least expected.',
    longDescription:
      'Pour Homme starts on bergamot, ginger and maté, then folds into rose and cinnamon over a musk base that feels closer to a shirt than a perfume. Sandalwood and vanilla keep it warm. Narciso Rodriguez proved a man could wear a musk before anyone else dared.',
    art: { juice: '#D6D9C8', glass: '#E7E9DE', cap: '#3A4046', hardware: '#B99A52', backdrop: '#E9EBE2', silhouette: 'rect' },
    moods: ['Fresh', 'Elegant'],
    noteTags: ['Musk', 'Rose', 'Vanilla', 'Woody', 'Citrus'],
    releasedAt: '2024-11-20',
    popularity: 79,
  },

  /* -------------------------------------------------------------- UNISEX */
  {
    id: 'p-you',
    slug: 'glossier-you',
    name: 'You',
    brand: 'Glossier',
    retail: 289,
    category: 'Musk',
    categoryLabel: 'Amber Musk Eau de Parfum',
    gender: 'unisex',
    rating: 4.6,
    reviews: 1043,
    notes: {
      top: ['Ambrette', 'Citrus Peel', 'Pear'],
      heart: ['Iris', 'Rose', 'Orris'],
      base: ['Amber', 'Musk', 'Sandalwood', 'Patchouli'],
    },
    description: 'Skin, warmed. The anti-perfume that became a favourite.',
    longDescription:
      'You is built on ambrette, iris and rose over amber, musk and patchouli — no fruit, no fireworks. It reads as clean skin with a little heat under it, and it genuinely works on everyone. The pink cylinder is deliberately plain; the formula is the whole argument.',
    art: { juice: '#E9C8C0', glass: '#F6E2DE', cap: '#B08579', hardware: '#B99A52', backdrop: '#F5E5E2', silhouette: 'rect' },
    moods: ['Romantic', 'Energetic'],
    noteTags: ['Musk', 'Amber', 'Rose', 'Vanilla'],
    releasedAt: '2025-08-14',
    popularity: 94,
  },
  {
    id: 'p-cristalle',
    slug: 'chanel-cristalle',
    name: 'Cristalle',
    brand: 'Chanel',
    retail: 419,
    category: 'Floral',
    categoryLabel: 'Citrus Floral Eau de Parfum',
    gender: 'unisex',
    rating: 4.7,
    reviews: 291,
    badge: 'EXCLUSIVE',
    notes: {
      top: ['Citrus', 'Bergamot', 'Lemon'],
      heart: ['Lily of the Valley', 'Jasmine', 'Rose'],
      base: ['Sandalwood', 'Cedar', 'Amber', 'Musk'],
    },
    description: 'Chanel decided citrus could be couture. It could.',
    longDescription:
      'Cristalle opens on a bright, slightly bitter citrus and holds it with lily of the valley and jasmine, refusing to turn sweet. Sandalwood, cedar and amber give it real weight. Wear it in summer and watch people ask what it is.',
    photo: '/images/products/chanel-cristalle.jpg',
    photoAlt: 'Chanel Cristalle Eau de Parfum bottle',
    photoTone: 'dark',
    art: { juice: '#DCE8DC', glass: '#EBF2EB', cap: '#E6E2DA', hardware: '#B99A52', backdrop: '#EAF0EA', silhouette: 'faceted' },
    moods: ['Fresh', 'Elegant'],
    noteTags: ['Citrus', 'Jasmine', 'Woody', 'Amber', 'Musk'],
    releasedAt: '2025-01-09',
    popularity: 87,
  },
  {
    id: 'p-neroli-portofino',
    slug: 'tom-ford-neroli-portofino',
    name: 'Neroli Portofino',
    brand: 'Tom Ford',
    retail: 640,
    category: 'Woody',
    categoryLabel: 'Citrus Woody Eau de Parfum',
    gender: 'unisex',
    rating: 4.8,
    reviews: 566,
    badge: 'EXCLUSIVE',
    notes: {
      top: ['Calabrian Bergamot', 'Orange Blossom', 'Lemon'],
      heart: ['Neroli', 'Orange Blossom Absolute', 'Rosemary'],
      base: ['Cedar', 'Amber', 'White Musk', 'Benzoin'],
    },
    description: 'The Amalfi coast, bottled. Best seller of the Private Collection.',
    longDescription:
      'Neroli Portofino is sunlight: Calabrian bergamot and orange blossom over a neroli heart that lasts for hours. Rosemary gives it a herbal edge, and cedar, amber and benzoin settle it into something warm and expensive. If it were a place, you would never want to leave.',
    art: { juice: '#F4E2B8', glass: '#FAF0D8', cap: '#B99A52', hardware: '#8E6B2E', backdrop: '#F5EEDC', silhouette: 'oval' },
    moods: ['Elegant', 'Romantic'],
    noteTags: ['Citrus', 'Musk', 'Amber', 'Woody'],
    releasedAt: '2025-09-18',
    popularity: 92,
  },
  {
    id: 'p-lime-basil-neroli',
    slug: 'jo-malone-lime-basil-neroli',
    name: 'Lime Basil & Neroli',
    brand: 'Jo Malone',
    retail: 299,
    category: 'Citrus',
    categoryLabel: 'Citrus Cologne Intense',
    gender: 'unisex',
    rating: 4.7,
    reviews: 448,
    notes: {
      top: ['Lime', 'Bergamot', 'Lemon Verbena'],
      heart: ['Basil', 'Neroli', 'Lavender'],
      base: ['White Musk', 'Cedar', 'Amber', 'Tonka'],
    },
    description: 'A cologne sharp enough to wake the room up.',
    longDescription:
      'Lime Basil & Neroli is a cologne with an edge: lime and bergamot over basil and neroli, with lavender cooling it down. White musk and tonka leave a clean, slightly powdery trail. The bottle is unlabelled and the price is unapologetic.',
    art: { juice: '#DCE8C8', glass: '#ECF2E2', cap: '#B99A52', hardware: '#B99A52', backdrop: '#EAF0E4', silhouette: 'rect' },
    moods: ['Fresh', 'Energetic'],
    noteTags: ['Citrus', 'Musk', 'Woody'],
    releasedAt: '2025-04-24',
    popularity: 85,
  },
  {
    id: 'p-bergamote-22',
    slug: 'le-labo-bergamote-22',
    name: 'Bergamote 22',
    brand: 'Le Labo',
    retail: 390,
    category: 'Citrus',
    categoryLabel: 'Citrus Woody Eau de Parfum',
    gender: 'unisex',
    rating: 4.8,
    reviews: 377,
    badge: 'LIMITED',
    notes: {
      top: ['Bergamot', 'Lime', 'Lemon'],
      heart: ['Neroli', 'Lavender', 'Violet Leaf'],
      base: ['Sandalwood', 'Cedar', 'Amber', 'Musk'],
    },
    description: 'Bergamot at laboratory concentration, hand-labelled.',
    longDescription:
      'Bergamote 22 is one of Le Labo\'s numbered experiments: a bergamot so dense it reads almost solid, cut with neroli and lavender and left to dry into sandalwood and cedar. Each bottle is hand-labelled in the laboratory with the wearer\'s name and the date. It is the most collected thing we shelve.',
    photo: '/images/products/le-labo-bergamote-22.jpg',
    photoAlt: 'Le Labo Bergamote 22 Eau de Parfum bottle',
    photoTone: 'dark',
    art: { juice: '#E8E2B8', glass: '#F2EEDC', cap: '#2E2320', hardware: '#B99A52', backdrop: '#EFEDDF', silhouette: 'tall' },
    moods: ['Elegant', 'Mysterious'],
    noteTags: ['Citrus', 'Woody', 'Musk', 'Amber'],
    releasedAt: '2025-10-02',
    popularity: 90,
  },
]

/* ==========================================================================
   Derivation — one authored price in, a fully priced decant product out
   ========================================================================== */

function toProduct(seed: ProductSeed): Product {
  const { retail, ...rest } = seed
  const sizes = decants(retail)
  return {
    ...rest,
    sizes,
    /** Cards lead with the hero volume, so that is the product's headline price */
    price: getSize(sizes, HERO_DECANT).price,
    fullBottle: { ml: FULL_BOTTLE_ML, price: retail },
  }
}

export const products: Product[] = SEED.map(toProduct)

export const productById = new Map(products.map((p) => [p.id, p]))
export const productBySlug = new Map(products.map((p) => [p.slug, p]))

export function getProductBySlug(slug: string): Product | undefined {
  return productBySlug.get(slug)
}

export function getProductById(id: string): Product | undefined {
  return productById.get(id)
}

/** The ladder always carries every volume, so this never misses. */
export function getSize(sizes: ProductSize[], ml: number): ProductSize {
  return sizes.find((s) => s.ml === ml) ?? sizes.find((s) => s.ml === HERO_DECANT) ?? sizes[0]
}

export function getPriceForSize(product: Product, ml: number): number {
  return getSize(product.sizes, ml).price
}

/** What the same volume costs inside the original bottle — the savings story. */
export function pricePerMl(product: Product, ml: number): number {
  return getPriceForSize(product, ml) / ml
}

export function fullBottlePricePerMl(product: Product): number {
  return product.fullBottle.price / product.fullBottle.ml
}

/** Whole percent saved against the full bottle, e.g. 88. */
export function savingsPercent(product: Product, ml: number): number {
  return Math.round((1 - pricePerMl(product, ml) / fullBottlePricePerMl(product)) * 100)
}

export const NEWEST_PRODUCTS = [...products].sort(
  (a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt),
)

export const BESTSELLERS = [...products]
  .filter((p) => p.badge === 'BESTSELLER' || p.badge === 'EXCLUSIVE')
  .sort((a, b) => b.popularity - a.popularity)

/** The "For Him / For Her" shelves, most-loved first in each. */
export const FOR_HER = [...products]
  .filter((p) => p.gender === 'women')
  .sort((a, b) => b.popularity - a.popularity)

export const FOR_HIM = [...products]
  .filter((p) => p.gender === 'men')
  .sort((a, b) => b.popularity - a.popularity)

export const FOR_EVERYONE = [...products]
  .filter((p) => p.gender === 'unisex')
  .sort((a, b) => b.popularity - a.popularity)

/** Cheapest 3 ml across the house — the price the hero promises. */
export const ENTRY_DECANT = Math.min(...products.map((p) => getPriceForSize(p, 3)))

/** Everything is decanted from a 100 ml bottle, so this is the headline saving. */
export const AVERAGE_SAVINGS = Math.round(
  products.reduce((sum, p) => sum + savingsPercent(p, HERO_DECANT), 0) / products.length,
)

export const DEFAULT_ART: ProductArt = {
  juice: '#E7B7C0',
  glass: '#F6DDE2',
  cap: '#0E0E10',
  hardware: '#B99A52',
  backdrop: '#F3E3E1',
  silhouette: 'rect',
}

export const ALL_BRANDS = [...new Set(products.map((p) => p.brand))]

export const ALL_NOTES = [...new Set(products.flatMap((p) => p.noteTags))].sort()

export const ALL_FAMILIES = [
  'Floral',
  'Oriental',
  'Woody',
  'Fresh',
  'Citrus',
  'Gourmand',
  'Musk',
] as const