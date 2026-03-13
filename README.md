<p align="center">
    <img src="https://raw.githubusercontent.com/oxechicao/turnstyle/refs/heads/main/turnstyle.png" width="89" />
    <h2 align="center">Turnstyle Theme</h2>
</p>

# Turnstyle README

> The colors came from Turnstile Never Enough tour.
> From a big fan, thank you.

This theme was entirely based on [Rosepine](https://rosepinetheme.com/) for vscode.
Thank you for the amazing theme, I've used it quite a bit.

## Colors

### Color usage

| Role                | Hex     | Darker  |
| ------------------- | ------- | ------- |
| Base                | #1d263a | #0f1524 |
| Surface             | #223244 | #172436 |
| Overlay             | #2c4259 | #182b3e |
| Muted               | #687a87 |
| Mistery (subtle)    | #a3cbd2 |
| Text                | #e0f0f0 |
| Tlc (gold)          | #da81aa |
| Sunshower (foam)    | #dfdf90 |
| Sole (rose)         | #d7a275 |
| Birds (iris)        | #4fa190 |
| Never Enough (love) | #a3cbd2 |
| Gravity (pine)      | #75a6eb |
| Generator (leaf)    | #da8881 |
| Light Design low    | #222b44 | #192034 |
| Light Design Med    | #3c465d | #222c44 |
| Light Design High   | #545b6d | #363f53 |

### Category mapping

#### Base
- Hex: #1d263a
- Role: Primary background (application base, editors, main frames)
- Example usages: `activityBar.background`, `editor.background`, `sideBar.background`, `statusBar.background`, `panel.background`

#### Surface
- Hex: #223244
- Role: Secondary background (panels, cards, inputs, secondary panels)
- Example usages: `banner.background`, `editorWidget.background`, `quickInput.background`, `checkbox.background`, `notebook.cellEditorBackground`

#### Overlay
- Hex: #2c4259
- Role: Tertiary / overlay surfaces and borders (popovers, borders, dialogs)
- Example usages: `activityBar.dropBorder`, `editorWidget.border`, `diffEditor.border`, `peekView.border`, `panel.dropBorder`

#### Muted
- Hex: #687a87
- Role: Low-contrast foreground (disabled, subdued text)
- Example usages: `breadcrumb.foreground`, `editorCursor.foreground`, `git.blame.editorDecorationForeground`

#### Mistery
- Hex: #a3cbd2
- Role: Secondary readable foreground (subtle UI text, icons, suggestions)
- Example usages: `symbolIcon.*` (many), `editorSuggestWidget.foreground`, `icon.foreground`, `editorHint.foreground`

#### Text
- Hex: #e0f0f0
- Role: Primary content (main text, file text, active content)
- Example usages: `editor.foreground`, `activityBar.foreground`, `terminal.foreground`, `panelTitle.activeForeground`

#### TLC
- Hex: #da81aa
- Role: Errors / highlights (diagnostics, deleted lines, accents)
- Example usages: `editorWarning.foreground`, `list.warningForeground`, `merge.currentContentBackground` (semi-transparent), `terminal.ansiYellow` (accent mapping in diffs)

#### Sunshower
- Hex: #dfdf90
- Role: Informational accents (added lines, info highlights)
- Example usages: `editorOverviewRuler.addedForeground`, `editorGutter.addedBackground`, `tab.activeModifiedBorder`

#### Sole
- Hex (orange): #d7a275
- Role: Interactive accents (buttons, badges, highlights)
- Example usages: `badge.background`, `button.background`, `list.highlightForeground`, `progressBar.background`

#### Birds
- Hex: #4fa190
- Role: Success/remote accents (renamed, remote badges, inlay hints)
- Example usages: `editorGutter.foldingControlForeground`, `pickerGroup.foreground`, `extensionBadge.remoteBackground`

#### Never Enough / Gravity
- Hex (light): #a3cbd2 (used as subtle/light blue)
- Hex (bright): #75a6eb
- Role: Keywords / info actions and light accents
- Example usages: `keyword`/`storage` scopes in token colors, `editorLightBulb.foreground`, `terminal.ansiBrightGreen/Blue`

#### Bird
- Hex: #4fa190 (Turnstyle uses this green-tinted value in some spots; Rose Pine maps differ)
- Role: Secondary accents and emphasis (folding controls, some bracket guides)
- Example usages: `editorBracketPairGuide.activeBackground3`, `editorInlayHint.parameterForeground`

#### Light Design (Low / Med / High)
- README suggests:
  - Highlight Low: #222b44 (use for very subtle focus)
  - Highlight Med: #3c465d (selection/hover)
  - Highlight High: #545b6d (strong dividers / borders)
- In Turnstyle these are implemented often via semi-transparent values (e.g., `#817c9c26`) used for selections, bracket highlights and rulers. Use the explicit highlight hexes from README where a solid role is needed; use the semitransparent `#817c9c26` family for subtle overlays.

#### Notes & recommendations
- Many Turnstyle tokens use the same foreground `#a3cbd2` for icons and UI text — keep that as the canonical subtle/subtle-text color.
- The role names map cleanly to the Turnstyle hexes shown above; when adding or editing tokens, pick the role first (Base/Surface/Overlay/Text) and then choose the matching hex.
- For diff/merge and diagnostic colors prefer the accent mapping shown in diif_colors_table.md: Turnstyle uses `#d7a275` (orange) and `#dfdf90` (yellow) for positive/add accents; `#a3cbd2` / `#eb6f92` are used for deletions/errors depending on contrast needs.

```sh
# Easy parser
sed -i '' \
    -e 's/subtle/mistery/gi' \
    -e 's/love/never_enough/gi' \
    -e 's/gold/tlc/gi' \
    -e 's/rose/sole/gi' \
    -e 's/pine/gravity/gi' \
    -e 's/foam/sunshower/gi' \
    -e 's/iris/birds/gi' \
    -e 's/leaf/generator/gi' \
    -e 's/highlight_low/light_design_low/gi' \
    -e 's/highlight_med/light_design_med/gi' \
    -e 's/highlight_high/light_design_high/gi' \
```