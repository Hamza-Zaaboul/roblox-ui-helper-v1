# Prompt — Reproduire `parametres.html` en Roblox (Luau)

## 1. Mission

Tu reçois un fichier `parametres.html` qui contient un **modal de paramètres** (style "Settings — Roblox") avec design dark navy + accent cyan. Ta mission est de **porter ce modal en Roblox Luau (ScreenGui)** avec une fidélité visuelle et comportementale de **~99 %**.

Référence absolue : **`parametres.html` est la source de vérité**. Si une chose n'est pas dans le HTML, ne l'invente pas. Si une chose est dans le HTML, ne l'omets pas.

Plateforme cible : **Roblox Studio (date de référence : mai 2026)**. Tu peux donc utiliser les nouveautés UI 2025-2026 (voir §6).

---

## 2. Inventaire de ce qu'il faut reproduire

Lis le HTML en entier avant de commencer. En résumé, tu dois reproduire :

**Structure**
- Un bouton **trigger** (gradient cyan, glow, icône engrenage) qui ouvre le modal
- Un **modal** centré (verre sombre, coins arrondis 28 px, ombres multi-couches)
- Une **divider** sous le titre
- Un **bouton close** en haut à droite (style embossed)
- Un **body scrollable** (max 60vh)
- 4 **sections** : Graphiques / Jouabilité / Caméra / Effets
- Chaque section : un label (`color-text-muted` + petite barre verticale `#3a7bd3` à gauche)
- Chaque section contient des **cards** (`.setting-card`) avec : titre, sous-titre, bouton undo, et un contrôle (toggle ou slider)

**Contrôles**
- **Toggle pill** : largeur 2.9rem, hauteur 1.65rem, padding 0.2rem
  - OFF : fond `#1a2638`
  - ON : gradient `linear-gradient(180deg, #4be0ec, #1fc8d4 55%, #178995)` + bordure cyan + glow extérieur
  - Knob blanc qui glisse avec **spring** (overshoot) au changement
  - Knob s'étire de **1.15×** sur `:active`
- **Slider horizontal** :
  - Track `#1a2638`, hauteur 0.32rem
  - Fill gradient `linear-gradient(90deg, #178995, #1fc8d4)` + glow cyan
  - Handle blanc rond 1.1rem
  - Scale **1.12** sur hover, **1.18** sur drag
  - Valeur numérique à droite (tabular-nums, bold, blanc)
- **Bouton undo** (icône flèche circulaire) :
  - Caché par défaut (`opacity: 0`, translateX 6px, scale 0.85)
  - Apparaît dès que la valeur ≠ `defaultValue`
  - Animation spring (overshoot) à l'apparition
  - Au clic : reset à la valeur par défaut

**Comportements**
- Si une valeur change : la card a une **bordure cyan permanente** (`is-modified`) ET un **flash cyan** ponctuel (`is-flashing`, 420 ms)
- Échap ferme le modal
- Modal s'ouvre avec animation : `scale(0.96) translateY(8px)` → `scale(1) translateY(0)` + fade, sur 320 ms

**Schéma des données**
Recopie **exactement** le tableau `SECTIONS` du HTML (lignes ~576-652). Mêmes IDs, mêmes titres, mêmes descriptions, mêmes `defaultValue`, mêmes `min`/`max`/`step`. Garde le français.

---

## 3. Mapping CSS → Roblox (référence rapide)

| CSS / HTML | Roblox |
|---|---|
| `border-radius` | `UICorner.CornerRadius` |
| `background: linear-gradient(...)` | `Frame.BackgroundColor3` + `UIGradient` (Rotation + ColorSequence) |
| `border: 1px solid X` | `UIStroke` (`Thickness=1`, `Color`, `Transparency`) |
| `box-shadow` (chaque couche) | **`UIShadow`** (un par couche, empilables) — voir §6 |
| `backdrop-filter: blur(20px)` | `Lighting.BlurEffect` global ou fond pré-blurré (voir §6 limitations) |
| `padding` | `UIPadding` |
| `gap` (flex/grid) | `UIListLayout.Padding` |
| `font-family: Geist` | Custom Font asset Geist (importer en Studio) |
| `font-weight` | `Font.Weight` (Bold/SemiBold/ExtraBold) |
| `cubic-bezier(0.22, 1, 0.36, 1)` "out-soft" | `TweenInfo.new(d, Enum.EasingStyle.Quart, Enum.EasingDirection.Out)` |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` "spring" | `TweenInfo.new(d, Enum.EasingStyle.Back, Enum.EasingDirection.Out)` |
| `transition: ... 220ms` | `TweenInfo.new(0.22, ...)` |
| `:hover` | `MouseEnter` / `MouseLeave` events |
| `:active` | `InputBegan` / `InputEnded` (MouseButton1) |
| `:focus-visible` | `GuiObject.SelectionImageObject` (gamepad) ou un UIStroke conditionnel |
| `@keyframes setting-flash` | Chaîne de tweens (UIStroke.Transparency aller-retour + UIShadow optionnel) |
| `ScrollingFrame` du body | `ScrollingFrame` avec `ScrollBarThickness=6`, `ScrollBarImageColor3=#1c2a3e`, `AutomaticCanvasSize=Y` |

### Couleurs (recopier des tokens CSS, lignes 27-67)

```lua
local Colors = {
    bg            = Color3.fromRGB(5, 11, 21),    -- #050b15
    modal         = Color3.fromRGB(11, 22, 38),   -- #0b1626
    cardTop       = Color3.fromRGB(20, 34, 53),   -- #142235
    cardBot       = Color3.fromRGB(15, 26, 42),   -- #0f1a2a
    cardHover1    = Color3.fromRGB(24, 42, 64),   -- #182a40
    cardHover2    = Color3.fromRGB(18, 30, 48),   -- #121e30
    accent        = Color3.fromRGB(31, 200, 212), -- #1fc8d4
    accentHi      = Color3.fromRGB(75, 224, 236), -- #4be0ec
    accentLo      = Color3.fromRGB(23, 137, 149), -- #178995
    sectionBar    = Color3.fromRGB(58, 123, 211), -- #3a7bd3
    text          = Color3.fromRGB(255, 255, 255),
    textSoft      = Color3.fromRGB(138, 163, 189),-- #8aa3bd
    textMuted     = Color3.fromRGB(94, 122, 149), -- #5e7a95
    toggleOff     = Color3.fromRGB(26, 38, 56),   -- #1a2638
    knob          = Color3.fromRGB(255, 255, 255),
}
```

### Rayons

| Token | Valeur | Roblox |
|---|---|---|
| `--radius-modal` | 1.75rem = 28 px | `UICorner.CornerRadius = UDim.new(0, 28)` |
| `--radius-card` | 1rem = 16 px | `UDim.new(0, 16)` |
| `--radius-pill` | 999 px | `UDim.new(1, 0)` (capsule) |
| `--radius-btn` | 0.6rem = ~10 px | `UDim.new(0, 10)` |

---

## 4. Détails par composant (à respecter scrupuleusement)

### 4.1 Modal
- Largeur : `min(34rem, 92vw)` → en Roblox `UDim2.new(0.92, 0, 0, ?)` avec `UISizeConstraint{MaxSize=Vector2.new(544, math.huge)}`
- Padding intérieur : 1.75rem (28 px) en desktop, 1.5rem (24 px) sinon → `UIPadding`
- 3 `UIShadow` empilés (recopier les 3 couches du CSS lignes 167-170) :
  1. `0 0 0 1px rgba(0,0,0,0.4)` → spread 1, transparency 0.6
  2. `0 32px 80px -16px rgba(0,0,0,0.7)` → offset Y 32, blur 80, spread -16, transparency 0.3
  3. `inset 0 1px 0 rgba(255,255,255,0.05)` → **pas reproductible nativement** — fake avec une ligne horizontale en haut (Frame 1px blanc translucide)
- Background : `Color3.fromRGB(11,22,38)` + `UIGradient` léger top→bottom (blanc 2.5 % → transparent à 30 %)
- Animation d'apparition : `Position` + `Size` via `UIScale` (de 0.96 à 1) + `GroupTransparency` (CanvasGroup) sur 0.32 s, `Quart.Out`

### 4.2 Section label
- Layout horizontal : barre verticale 3×15 px `#3a7bd3` + texte
- `Frame` 3×15 px + `TextLabel` à côté, alignés via `UIListLayout`

### 4.3 Setting card
- 2 états à gérer : `is-modified` (border cyan permanente) et `is-flashing` (flash ponctuel)
- Background : **`UIGradient`** vertical 2 couleurs (`cardTop` → `cardBot`)
- Hover : tween le `UIGradient.Color` vers (`cardHover1` → `cardHover2`) en 220 ms
- `UIStroke` thickness 1, transparency 0.95 par défaut (`rgba(255,255,255,0.05)`), passe à transparency ~0.75 sur hover, et `Color = accent` + transparency 0.82 si `is-modified`
- Flash : tween la `Transparency` du UIStroke vers 0.6 puis retour, 420 ms

### 4.4 Toggle (le détail le plus subtil)
- Hauteur 26 px (1.65rem × 16), largeur 46 px (2.9rem × 16), padding 3 px (0.2rem × 16)
- Knob : diamètre = hauteur − 2×padding = 20 px
- OFF → ON : knob glisse de `Position.X = padding` à `Position.X = parent.Width - padding - knob.Width`
- Easing : **`Back.Out`** sur 0.28 s (le spring du CSS)
- `:active` : knob s'élargit à 1.15× (largeur seulement, pas hauteur) → tween parallèle
- Background OFF : couleur unie `toggleOff`
- Background ON : `UIGradient` 3 stops vertical (`accentHi` 0 → `accent` 0.55 → `accentLo` 1)
- Glow ON : un `UIShadow` avec `Color=accent`, `BlurRadius=18`, `Transparency=0.65`, pas d'offset

### 4.5 Slider
- Track : Frame hauteur 5 px, BackgroundColor3 `toggleOff`, `UICorner` pill
- Fill : Frame enfant, hauteur 100 %, largeur = pct, `UIGradient` horizontal (`accentLo` → `accent`)
- Handle : Frame 18×18 (1.1rem) blanc, `UICorner` pill, `AnchorPoint=Vector2.new(0.5, 0.5)`, position X = pct
- Drag : `InputBegan` sur MouseButton1/Touch → écoute `InputChanged`, calcule pct depuis `(input.Position.X - track.AbsolutePosition.X) / track.AbsoluteSize.X`, clamp 0-1, snap au `step`
- Clavier : équivalent flèches/Home/End/PageUp/PageDown — utiliser `ContextActionService` ou `UserInputService.InputBegan` quand le slider a le focus (`GuiService.SelectedObject`)
- Valeur affichée à droite : `TextLabel`, `Font = Geist Bold`, `TextSize = 16`, `RichText` désactivé. Min width via `UISizeConstraint` pour stabilité (tabular-nums)

### 4.6 Undo button
- `ImageButton` (ou `TextButton`) 26×26 px circulaire (`UICorner` pill)
- État caché : `ImageTransparency=1` + `Position` translatée de +6 px en X + `UIScale=0.85`
- Animation d'apparition : tween en `Back.Out` 0.22 s vers transparency 0.3, position 0, scale 1
- Hover : background `rgba(255,255,255,0.06)`
- Icône : SVG du HTML (lignes 705-718) → recréer comme `ImageLabel` (asset à uploader) ou utiliser une icône Roblox équivalente (`rbxassetid://...` flèche undo)

### 4.7 Close button & trigger button
- Recopie les gradients exactement (CSS lignes 234-239 pour close, 113-119 pour trigger)
- Trigger : 3 `UIShadow` empilés pour reproduire les 4 box-shadow CSS (lignes 126-130). Le inset shadow (1) se fake avec un `Frame` 1px tout en haut, BackgroundTransparency 0.65.
- Hover trigger : `UIScale` 1.03 + translation -2 px Y, en 160 ms `Quart.Out`

---

## 5. Animations — TweenInfo cheat sheet

```lua
local EASE_SOFT   = Enum.EasingStyle.Quart   -- pour cubic-bezier(0.22,1,0.36,1)
local EASE_SPRING = Enum.EasingStyle.Back    -- pour cubic-bezier(0.34,1.56,0.64,1)
local OUT         = Enum.EasingDirection.Out

local T = {
    modalIn   = TweenInfo.new(0.32, EASE_SOFT,   OUT),
    cardHover = TweenInfo.new(0.22, EASE_SOFT,   OUT),
    toggle    = TweenInfo.new(0.28, EASE_SPRING, OUT),
    knobPress = TweenInfo.new(0.14, EASE_SOFT,   OUT),
    sliderHandle = TweenInfo.new(0.14, EASE_SOFT, OUT),
    undoIn    = TweenInfo.new(0.22, EASE_SPRING, OUT),
    flash     = TweenInfo.new(0.21, EASE_SOFT,   OUT), -- aller-retour, total 420 ms
    triggerHover = TweenInfo.new(0.16, EASE_SOFT, OUT),
}
```

---

## 6. ⚠️ Limitations Roblox & workarounds (LIRE)

### ✅ Disponible (utilise-le)
- **`UIShadow`** (Studio Beta, annoncé 14 mai 2026) → reproduit les `box-shadow` CSS multi-couches. Propriétés : `BlurRadius` (≤1000), `Color`, `Transparency`, `Offset` (UDim2), `Spread`, `ZIndex` (peut être négatif). Empilable.
  - **Caveat** : Studio Beta, "publication en direct non autorisée" début mai 2026. **Vérifier le statut au moment de coder**. Si pas encore GA, fallback : `ImageLabel` 9-slice shadow asset.
- **`UICorner` avec coins individuels** (même release) : `TopLeftRadius` / `TopRightRadius` / `BottomLeftRadius` / `BottomRightRadius`. Pas utilisé dans ce modal mais bon à savoir.
- **Custom Fonts** : importer **Geist** comme Font asset. Si refusé par modération, fallback : `Font.fromEnum(Enum.Font.GothamBold)` (proche visuellement).

### ❌ Pas (encore) disponible
- **`backdrop-filter: blur(20px)`** par-élément → **n'existe pas**.
  - Workaround 1 : `BlurEffect` dans `Lighting` activé pendant l'ouverture du modal (floute **tout** l'écran derrière le GUI — acceptable si le modal couvre l'attention).
  - Workaround 2 : `ImageLabel` plein écran avec un asset pré-blurré du fond.
  - **Choix recommandé** : workaround 1, plus simple, désactiver le `BlurEffect` quand le modal se ferme.
- **`inset box-shadow`** → fake avec un `Frame` 1px en bord supérieur (BackgroundTransparency ~0.65 pour le highlight, ~0.8 pour le lip sombre en bas).
- **`::selection`** → pas de sélection de texte dans un menu, à ignorer.
- **Cubic-bezier custom** → approximation par `Quart.Out` et `Back.Out`. Indiscernable à l'œil.

### Gotchas
- `UIShadow` ne fonctionne que sur les `GuiObject` avec un `UICorner` ou un Image avec alpha — vérifier en cas de bug d'affichage
- Les `UIGradient` ne supportent pas les gradients radiaux ; tout est linéaire (avec `Rotation`)
- `CanvasGroup` est nécessaire pour faire fade-out tout le modal d'un coup (sinon tween chaque enfant)
- `ScrollingFrame` : penser à `AutomaticCanvasSize = Enum.AutomaticSize.Y` + `CanvasSize = UDim2.new()`

---

## 7. Hiérarchie d'instances suggérée

```
ScreenGui (IgnoreGuiInset = true, ZIndexBehavior = Sibling)
├── TriggerButton (TextButton, capsule, gradient cyan)
│   ├── UICorner
│   ├── UIGradient (gradient cyan vertical)
│   ├── UIStroke (cyan transparent)
│   ├── UIShadow ×3 (glow + shadow + inset fake)
│   ├── UIPadding
│   ├── UIListLayout (horizontal, gap 9 px)
│   ├── GearIcon (ImageLabel)
│   └── Label (TextLabel "Ouvrir les paramètres")
│
└── Modal (CanvasGroup, ancré centre)
    ├── UICorner (28 px)
    ├── UIStroke (white 6 %)
    ├── UIGradient (top fade subtil)
    ├── UIShadow ×3 (les 3 box-shadow du CSS)
    ├── UIScale (pour anim d'entrée 0.96 → 1)
    ├── UIPadding (28 px)
    ├── Head (Frame horizontal)
    │   ├── Title (TextLabel "Paramètres", Geist ExtraBold 28 px)
    │   └── CloseButton (style embossed gradient, voir 4.7)
    ├── Divider (Frame 1px white 8 %)
    └── Body (ScrollingFrame, MaxHeight = 60 % screen)
        ├── UIListLayout (vertical, gap 24 px)
        └── Section ×4
            ├── SectionLabel (Frame + barre verticale + TextLabel)
            └── SectionList (Frame)
                ├── UIListLayout (vertical, gap 10 px)
                └── SettingCard ×N
                    ├── UICorner (16 px)
                    ├── UIStroke
                    ├── UIGradient (card top→bot)
                    ├── UIPadding
                    ├── UIListLayout (horizontal, gap ~14 px)
                    ├── SettingText (titre + sous-titre)
                    ├── UndoButton (caché par défaut)
                    └── Control (Toggle ou Slider)
```

---

## 8. État final attendu

À la fin, je veux pouvoir :
1. Cliquer sur le trigger → le modal s'anime à l'écran exactement comme dans le HTML
2. Changer n'importe quel toggle/slider → flash cyan, undo apparaît avec spring, border cyan reste
3. Cliquer undo → la valeur revient au défaut, le flash repart, l'undo disparaît avec spring inverse
4. Appuyer Échap → modal se ferme, trigger revient
5. Resize l'écran : layout reste propre (responsive via `UDim2` scale + `UISizeConstraint`)
6. Jouer sur console : navigation au gamepad fonctionne (selection cycling sur cards/toggles/sliders)

Bonus si tu peux : persister les valeurs avec `DataStoreService` (mais ce n'est pas obligatoire pour ce ticket).

---

## 9. Ce que tu **ne dois pas** faire

- Ne change pas les IDs, titres, descriptions ou defaults du schéma `SECTIONS`
- N'ajoute pas de paramètres non présents dans le HTML
- Ne change pas les couleurs (utilise les tokens RGB ci-dessus)
- N'utilise pas des assets externes pour ce qui peut être fait avec des Frames + UIGradient + UIShadow + UICorner
- Ne te repose pas sur `BlurEffect` global pour autre chose que le `backdrop-filter` du modal
- N'utilise pas `Wait()` pour des animations — toujours `TweenService`

---

## 10. Livrable

Un seul `ModuleScript` (ou un dossier propre dans `StarterPlayerScripts` + `ReplicatedStorage`) avec :
- Un fichier `SettingsModal.lua` qui exporte une API simple : `SettingsModal.open()`, `SettingsModal.close()`, `SettingsModal.getValue(id)`, `SettingsModal:onChange(callback)`
- Le schéma `SECTIONS` recopié du HTML
- Pas de dépendances externes (ni Roact, ni Fusion sauf si tu juges que ça simplifie ; dans ce cas justifie en commentaire)
- Code Luau **typé** (`--!strict`)

Lis attentivement `parametres.html` (notamment le JS lignes 570-989 qui décrit toute la logique d'état + le tableau `SECTIONS`) et **respecte exactement** les comportements décrits. Bonne implémentation.
