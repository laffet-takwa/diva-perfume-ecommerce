# Product photography

Photographs served by the storefront. Each product that has one sets `photo`,
`photoAlt` and `photoTone` in `src/data/products.ts`; `Flacon` renders the
photograph in place of the drawn bottle. Files are named after the product slug
and served from `/images/products/<slug>.<ext>`. Eighteen of the twenty-seven
fragrances use photography; the rest render generated artwork from their `art`
recipe.

| File | Product | Source | Licence |
| --- | --- | --- | --- |
| `chanel-coco-mademoiselle.jpg` | Chanel Coco Mademoiselle EDP | Retail product photograph | none — prototype reference |
| `chanel-no-5.jpg` | Chanel N°5 Eau de Parfum | Flickr, CC BY 2.0 | CC BY 2.0, attribution required |
| `dior-jadore.jpg` | Dior J'adore EDP | Retail product photograph | none — prototype reference |
| `dior-sauvage.jpg` | Dior Sauvage EDP | Wikimedia Commons, `Dior_Sauvage_Verpackung.jpg` | CC BY-SA, attribution required |
| `giorgio-armani-si.jpg` | Giorgio Armani Sì EDP | Retail product photograph | none — prototype reference |
| `giorgio-armani-acqua-di-gio.jpg` | Giorgio Armani Acqua di Gio Pour Homme | Wikimedia Commons, `Acqua_di_gio.jpg` | CC BY-SA, attribution required |
| `gucci-bloom.jpg` | Gucci Bloom EDT | Retail product photograph | none — prototype reference |
| `parfums-de-marly-delina.jpg` | Parfums de Marly Delina EDP | Retail product photograph | none — prototype reference |
| `viktor-rolf-flowerbomb.jpg` | Viktor&Rolf Flowerbomb EDP | Retail product photograph | none — prototype reference |
| `ysl-mon-paris.jpg` | YSL Mon Paris EDP | Retail product photograph | none — prototype reference |
| `lancome-la-vie-est-belle.jpg` | Lancôme La Vie Est Belle EDP | Flickr `15162072805` | CC BY-NC-ND |
| `paco-rabanne-invictus.jpg` | Paco Rabanne Invictus EDP | Flickr `14975406580` | CC BY-NC-ND |
| `chanel-cristalle.jpg` | Chanel Cristalle EDP | Flickr `14031911540` | CC BY-NC-SA |
| `prada-luna-rossa.jpg` | Prada Luna Rossa EDP | Flickr `15392637827` | CC BY-NC |
| `narciso-rodriguez-for-her.jpg` | Narciso Rodriguez For Her EDP | Wikimedia Commons, `Narciso_Rodriguez_for_Her_Eau_de_Parfum.jpg` | CC BY-SA, attribution required |
| `versace-eros.jpg` | Versace Eros EDP | Wikimedia Commons, `VersaceEros121.jpg` | CC BY-SA, attribution required |
| `tom-ford-ombre-leather.png` | Tom Ford Ombré Leather EDP | tomfordbeauty.com, `tf_sku_T5Y201` | brand press asset, reference only |
| `le-labo-bergamote-22.jpg` | Le Labo Bergamote 22 EDP | lelabofragrances.com, `050PB22100` | brand press asset, reference only |

## Before going live

Every file here is prototype reference imagery. Bottle shapes, packaging and
logos are trademarks of their respective houses, and no file is licensed for
reselling the photograph itself.

- Commercial use with attribution only: the four Wikimedia Commons files
  (CC BY-SA) and `chanel-no-5.jpg` (CC BY 2.0).
- Non-commercial licences, unusable on a live store: the CC BY-NC, BY-NC-ND
  and BY-NC-SA Flickr files.
- No licence at all: the six retail photographs and the two brand press assets.

To ship, replace each file with imagery you can sell — official press assets
from each house's trade portal, your distributor's product feed, or
commissioned photography on a plain backdrop. Replacement is drop-in: keep the
filename and the product keeps rendering. Framing is set by `photoTone`
(`light` multiplies a white-studio shot onto the house plate, `dark` fills the
frame), so match the replacement to the tone already set for that product.

Fragrance names, houses and note pyramids are factual descriptions of real
products. Prices are indicative and in DT. This is a front-end demonstration
with no checkout backend — no orders are processed and no goods are sold.