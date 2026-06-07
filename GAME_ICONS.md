# Game Icons Category Stack

This theme includes a curated subset of SVGs from Game Icons for future category and subcategory icon work.

Source: https://game-icons.net and https://github.com/game-icons/icons

License: Creative Commons Attribution 3.0 Unported, https://creativecommons.org/licenses/by/3.0/

The SVGs in `public/game-icons/` were sanitized for theme use by removing the default black square background and changing the foreground fill to `currentColor`. They are used as monochrome/tintable assets, preferably in an engraved faded-gold or dark-steel treatment. Category-specific colors still come from the NodeBB ACP category color fields.

## Recommended Mapping

| Category                  | Recommended icon    | ACP custom class              | Asset                                       |
| ------------------------- | ------------------- | ----------------------------- | ------------------------------------------- |
| INFORMATION               | Scroll unfurled     | `wg-icon-scroll-unfurled`     | `public/game-icons/scroll-unfurled.svg`     |
| Player Guide              | Compass             | `wg-icon-compass`             | `public/game-icons/compass.svg`             |
| Announcements             | Trumpet flag        | `wg-icon-trumpet-flag`        | `public/game-icons/trumpet-flag.svg`        |
| Patch Notes               | Spinning wheel      | `wg-icon-spinning-wheel`      | `public/game-icons/spinning-wheel.svg`      |
| COMMUNITY                 | Tavern sign         | `wg-icon-tavern-sign`         | `public/game-icons/tavern-sign.svg`         |
| General Discussion        | Beer stein          | `wg-icon-beer-stein`          | `public/game-icons/beer-stein.svg`          |
| Introductions             | Shaking hands       | `wg-icon-shaking-hands`       | `public/game-icons/shaking-hands.svg`       |
| Screenshots               | Wood frame          | `wg-icon-wood-frame`          | `public/game-icons/wood-frame.svg`          |
| Creations                 | Harp                | `wg-icon-harp`                | `public/game-icons/harp.svg`                |
| ROLEPLAY                  | Duality mask        | `wg-icon-duality-mask`        | `public/game-icons/duality-mask.svg`        |
| Notices                   | Stabbed note        | `wg-icon-stabbed-note`        | `public/game-icons/stabbed-note.svg`        |
| Rumors & Gossip           | Mute                | `wg-icon-mute`                | `public/game-icons/mute.svg`                |
| Journals & Biographies    | Sword altar         | `wg-icon-sword-altar`         | `public/game-icons/sword-altar.svg`         |
| Factions & Guilds         | Cowled              | `wg-icon-cowled`              | `public/game-icons/cowled.svg`              |
| Organization Registry     | Wax seal            | `wg-icon-wax-seal`            | `public/game-icons/wax-seal.svg`            |
| SUPPORT                   | Candle flame        | `wg-icon-candle-flame`        | `public/game-icons/candle-flame.svg`        |
| Common Issues & Questions | Key lock            | `wg-icon-key-lock`            | `public/game-icons/key-lock.svg`            |
| Technical Help            | Round potion        | `wg-icon-round-potion`        | `public/game-icons/round-potion.svg`        |
| Bug Reports               | Long antennae bug   | `wg-icon-long-antennae-bug`   | `public/game-icons/long-antennae-bug.svg`   |
| Feedback                  | Envelope            | `wg-icon-envelope`            | `public/game-icons/envelope.svg`            |
| DEVELOPMENT               | Anvil               | `wg-icon-anvil`               | `public/game-icons/anvil.svg`               |
| Tools & References        | Spanner             | `wg-icon-spanner`             | `public/game-icons/spanner.svg`             |
| General                   | Wax tablet          | `wg-icon-wax-tablet`          | `public/game-icons/wax-tablet.svg`          |
| Lore                      | Classical knowledge | `wg-icon-classical-knowledge` | `public/game-icons/classical-knowledge.svg` |
| Designs                   | Pencil ruler        | `wg-icon-pencil-ruler`        | `public/game-icons/pencil-ruler.svg`        |
| Programming               | Gears               | `wg-icon-gears`               | `public/game-icons/gears.svg`               |
| Area Building             | Castle ruins        | `wg-icon-castle-ruins`        | `public/game-icons/castle-ruins.svg`        |
| Applications & Reports    | Ticket              | `wg-icon-ticket`              | `public/game-icons/ticket.svg`              |

The stylesheet still defines earlier classes such as `wg-icon-scroll-quill`, `wg-icon-rule-book`, `wg-icon-ringing-bell`, `wg-icon-saloon`, `wg-icon-large-paint-brush`, `wg-icon-flute`, `wg-icon-drama-masks`, `wg-icon-target-poster`, `wg-icon-chat-bubble`, `wg-icon-notebook`, `wg-icon-glowing-hands`, `wg-icon-question`, `wg-icon-monkey-wrench`, `wg-icon-idea`, `wg-icon-toolbox`, `wg-icon-open-book`, and `wg-icon-processor` as legacy fallbacks. Prefer the table above for new ACP configuration.

## Setup

1. In the NodeBB ACP, open `Manage > Categories`, choose a category, and put the matching `wg-icon-*` value in the category's custom class field. Do not re-add old layout classes such as `col-md-3 col-6`; the theme layout no longer uses them.
2. Keep the regular ACP icon configured as a Font Awesome fallback. The theme hides it only when a matching `wg-icon-*` class is present.
3. Use the ACP text/icon color for category-specific glyph tinting. Prefer muted gold, green, blue, red, or violet accents over bright saturated colors.
4. After theme file changes, rebuild NodeBB assets and restart if the running process does not pick up `plugin.json` static directory changes.

## Attribution

The following Game Icons authors are represented in this curated set:

- Badges: `question.svg`
- Caro Asercion: `round-potion.svg`, `spinning-wheel.svg`
- Delapouite: `castle-ruins.svg`, `chat-bubble.svg`, `classical-knowledge.svg`, `flute.svg`, `harp.svg`, `idea.svg`, `key-lock.svg`, `large-paint-brush.svg`, `monkey-wrench.svg`, `mute.svg`, `notebook.svg`, `pencil-ruler.svg`, `rule-book.svg`, `saloon.svg`, `scroll-quill.svg`, `shaking-hands.svg`, `stabbed-note.svg`, `sword-altar.svg`, `target-poster.svg`, `tavern-sign.svg`, `toolbox.svg`, `trumpet-flag.svg`, `wax-tablet.svg`, `wood-frame.svg`
- Lorc: `anvil.svg`, `beer-stein.svg`, `candle-flame.svg`, `compass.svg`, `cowled.svg`, `drama-masks.svg`, `duality-mask.svg`, `envelope.svg`, `gears.svg`, `glowing-hands.svg`, `long-antennae-bug.svg`, `open-book.svg`, `processor.svg`, `ringing-bell.svg`, `scroll-unfurled.svg`, `spanner.svg`, `wax-seal.svg`
