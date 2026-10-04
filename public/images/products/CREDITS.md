# Product photography

Photographs served by the storefront. Every product sets `photo`, `photoAlt`
and `photoTone` in `src/data/products.ts`; `Flacon` renders the photograph in
place of the drawn bottle. Files are named after the product slug and served
from `/images/products/<slug>.<ext>`. All twenty-seven fragrances now use
photography, and the `art` recipe survives as the vector fallback and as the
tint of the plate a white-studio shot multiplies into.

## The house look

Every file here was measured for this build (downsampled to 160 px, border ring
sampled as the backdrop). The set resolves to one look:

- **High-key white sweep.** Backdrop luma across the light shots sits in a
  narrow **L208–L255** band, and `#FFFFFF` is the single most common dominant
  colour, often at 50–79% coverage.
- **Low saturation.** Mean saturation runs 0.02–0.28 — muted and editorial, not
  poster-bright.
- **Straight on and centred,** with generous white margin around the bottle.
- **Two recurring accents:** a near-black cap (`#21242B`, `#121115`, `#161622`,
  `#010102`) and warm gold hardware — which is why `hardware` is `#B99A52` on
  every recipe and `cap` sits in the noir family.
- **Warm-neutral.** The whites lean very slightly warm rather than clinical
  blue, matching the storefront's `#FAF7F1` ivory.

`STUDIO_PLATES` in `src/data/products.ts` reproduces the L243–L248,
sub-0.05-saturation band in vector form so a drawn flacon sits on the same
sweep as a photograph beside it.

`photoTone` records what each individual frame actually is, so a photograph is
never falsely flattened onto the white plate: `light` (23 products) is a
white-studio shot multiplied into the house plate; `dark` (4 products) fills the
frame because the shot itself carries a dark or mid backdrop —
`chanel-no-5.jpg`, `versace-eros.jpg`, `glossier-you.jpg` and
`le-labo-bergamote-22.jpg`.

## Files

| File | Product | Source | Licence |
| --- | --- | --- | --- |
| `chanel-coco-mademoiselle.jpg` | Chanel Coco Mademoiselle EDP | Retail product photograph | none — prototype reference |
| `dior-jadore.jpg` | Dior J'adore EDP | Retail product photograph | none — prototype reference |
| `giorgio-armani-si.jpg` | Giorgio Armani Sì EDP | Retail product photograph | none — prototype reference |
| `gucci-bloom.jpg` | Gucci Bloom EDT | Retail product photograph | none — prototype reference |
| `parfums-de-marly-delina.jpg` | Parfums de Marly Delina EDP | Retail product photograph | none — prototype reference |
| `viktor-rolf-flowerbomb.jpg` | Viktor&Rolf Flowerbomb EDP | Retail product photograph | none — prototype reference |
| `ysl-mon-paris.jpg` | YSL Mon Paris EDP | Retail product photograph | none — prototype reference |
| `lancome-la-vie-est-belle.jpg` | Lancôme La Vie Est Belle EDP | Flickr `15162072805` | CC BY-NC-ND |
| `tom-ford-ombre-leather.jpg` | Tom Ford Ombré Leather EDP | tomfordbeauty.com, `tf_sku_T5Y201` | brand press asset, reference only |
| `versace-eros.jpg` | Versace Eros EDP | Wikimedia Commons, `VersaceEros121.jpg` | CC BY-SA, attribution required |
| `chanel-no-5.jpg` | Chanel N°5 Eau de Parfum | Flickr, CC BY 2.0 | CC BY 2.0, attribution required |

### The studio set

The remaining sixteen files come from one shoot supplied with the project in
`src/images` — a uniform 474 px-wide, white-sweep set. They replaced earlier
mixed-tone files wherever the studio version matched the house look, and filled
the nine fragrances that previously fell back to drawn artwork.

| File | Product | Replaced |
| --- | --- | --- |
| `carolina-herrera-good-girl.jpg` | Carolina Herrera Good Girl | — (new) |
| `jean-paul-gaultier-scandal.jpg` | Jean Paul Gaultier Scandal | — (new) |
| `ysl-y-edp.jpg` | YSL Y Eau de Parfum | — (new) |
| `bvlgari-bzero1.jpg` | Bvlgari B.zero1 | — (new) |
| `montblanc-explorer.jpg` | Montblanc Explorer | — (new) |
| `narciso-rodriguez-pour-homme.jpg` | Narciso Rodriguez Pour Homme | — (new) |
| `tom-ford-neroli-portofino.jpg` | Tom Ford Neroli Portofino | — (new) |
| `jo-malone-lime-basil-neroli.jpg` | Jo Malone Lime Basil & Neroli | — (new) |
| `glossier-you.jpg` | Glossier You | — (new) |
| `dior-sauvage.jpg` | Dior Sauvage EDP | Wikimedia `Dior_Sauvage_Verpackung.jpg` (warm tan sweep, L161) |
| `chanel-cristalle.jpg` | Chanel Cristalle EDP | Flickr `14031911540` (olive mid-tone, L99) |
| `prada-luna-rossa.jpg` | Prada Luna Rossa EDP | Flickr `15392637827` (dark navy, L34) |
| `giorgio-armani-acqua-di-gio.jpg` | Giorgio Armani Acqua di Gio | Wikimedia `Acqua_di_gio.jpg` (warm tan, L185) |
| `narciso-rodriguez-for-her.jpg` | Narciso Rodriguez For Her EDP | Wikimedia `Narciso_Rodriguez_for_Her_Eau_de_Parfum.jpg` (warm, L197) |
| `paco-rabanne-invictus.jpg` | Paco Rabanne Invictus EDP | Flickr `14975406580` (270 px, L237) |
| `le-labo-bergamote-22.jpg` | Le Labo Bergamote 22 EDP | lelabofragrances.com `050PB22100` (near-black, L95) |

Swapping the studio set in removed the attribution obligation that came with
four of the CC BY-SA / CC BY files — but the studio files' own licence is
**unconfirmed**. Treat all sixteen as prototype reference until you clear them.

## Before going live

Every file here is prototype reference imagery. Bottle shapes, packaging and
logos are trademarks of their respective houses, and no file is licensed for
reselling the photograph itself.

- Commercial use with attribution only: `chanel-no-5.jpg` (CC BY 2.0) and
  `versace-eros.jpg` (Wikimedia, CC BY-SA).
- Non-commercial licences, unusable on a live store: `lancome-la-vie-est-belle.jpg`
  (CC BY-NC-ND).
- Brand press assets, reference only: `tom-ford-ombre-leather.jpg`.
- No licence at all: the seven retail photographs.
- Licence unconfirmed: the sixteen studio-set files in `src/images`.

To ship, replace each file with imagery you can sell — official press assets
from each house's trade portal, your distributor's product feed, or
commissioned photography on a plain backdrop. Replacement is drop-in: keep the
filename and the product keeps rendering. Match the replacement's backdrop to
the `photoTone` already set for that product, and re-run the measurement
described above if you want the grid to stay inside one tonal band.

Fragrance names, houses and note pyramids are factual descriptions of real
products. Prices are indicative and in DT. This is a front-end demonstration
with no checkout backend — no orders are processed and no goods are sold.