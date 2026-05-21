# Settings Design Spec

## 1. Layout
- **Structure:** GameBackground (bg-stadium) > GameHeader (showSettings=false) > .settings-page (flex column, flex: 1)
- **Sections:** .settings-title → .settings-layout (flex row) → .settings-actions
- **Left sidebar:** .settings-sidebar (width: 200px, flex-shrink: 0) > .settings-tabs (flex column, gap: 4px)
- **Right panel:** .settings-panel (flex: 1, overflow-y: auto) > .settings-panel__title + .settings-panel__content
- **Content max-width:** 700px
- **Actions row:** .settings-actions (flex row, justify center, gap: 16px, mt: 24px, pt: 16px)
- **Settings page padding:** 0 16px 16px

## 2. Colors
| Token | Hex/RGBA | Usage |
|-------|----------|-------|
| .settings-title__text | #ffffff | White heading |
| .settings-sidebar bg | --color-bg-secondary (#0a1628) | Tab sidebar bg |
| .settings-sidebar border | rgba(0,212,255,0.2) | Cyan border |
| .settings-tab default | --color-text-secondary (#8b9dc3) | Inactive tab text |
| .settings-tab--active bg | #00d4ff | Active tab fill |
| .settings-tab--active color | --color-bg-primary (#050a1a) | Active tab text |
| .settings-tab--active:hover | filter: brightness(1.1) | Active hover |
| .settings-panel bg | --color-bg-secondary (#0a1628) | Panel bg |
| .settings-panel border | rgba(0,212,255,0.2) | Cyan border |
| .settings-panel__title border-bottom | rgba(0,212,255,0.2) | Cyan divider |
| .settings-row bg | --color-bg-card (#0d1f3c) | Row surface |
| .settings-row:hover bg | --color-bg-card-hover (#112447) | Row hover |
| .settings-row__icon | #00d4ff | Cyan icon |
| .settings-danger-zone bg | rgba(255,23,68,0.05) | Red-tinted bg |
| .settings-danger-zone border | rgba(255,23,68,0.2) | Red border |

### Slider Colors
| Token | Hex/RGBA | Usage |
|-------|----------|-------|
| .slider-track | rgba(255,255,255,0.15) | Track bg |
| .slider-fill | #00d4ff | Cyan fill |
| .slider-thumb bg | white | Thumb circle |
| .slider-thumb shadow | 0 0 6px rgba(0,212,255,0.6) | Thumb glow |
| .slider-value | #00d4ff | Readout text |

### Dropdown Colors
| .dropdown-trigger border | rgba(0,212,255,0.3) | Default border |
| .dropdown-trigger--open | #00d4ff | Open border |
| .dropdown-trigger__arrow | #00d4ff | Chevron color |
| .dropdown-menu shadow | 0 8px 24px rgba(0,0,0,0.4) | Menu shadow |
| .dropdown-option--selected | #00d4ff | Selected text |
| .dropdown-option:hover bg | --color-bg-card-hover (#112447) | Option hover |

### Toggle Colors
| .toggle-switch--off | rgba(255,255,255,0.15) | Off bg |
| .toggle-switch--on | #00d4ff | On bg |
| .toggle-switch--on shadow | 0 0 10px rgba(0,212,255,0.5) | On glow |
| .toggle-label--off | --color-text-secondary | OFF text |
| .toggle-label--on | --color-bg-primary | ON text (dark on cyan) |
| .toggle-switch--disabled | opacity: 0.5 | Disabled state |

## 3. Typography
| Element | Font | Size | Weight | Letter-spacing | Color |
|---------|------|------|--------|----------------|-------|
| .settings-title__text | Barlow Condensed | clamp(1.8rem,3.5vw,3rem) | 700 | 0.15em | #ffffff |
| .settings-panel__title | Barlow Condensed | clamp(1.25rem,2vw,1.5rem) | 700 | 0.1em | #ffffff |
| .settings-tab__label | Barlow Condensed | 14px | 600 | 0.05em | currentColor |
| .settings-row__title | Barlow Condensed | clamp(0.8rem,1.2vw,1rem) | 700 | normal | #ffffff |
| .settings-row__subtitle | Barlow Condensed | clamp(0.65rem,1vw,0.8rem) | 400 | normal | --color-text-secondary |
| .slider-value | Barlow Condensed | 14px | 700 | normal | #00d4ff |
| .dropdown-trigger__label | Barlow Condensed | 14px | 600 | normal | #ffffff |
| .dropdown-option | Barlow Condensed | 14px | 600 | normal | --color-text-secondary |
| .toggle-label | Barlow Condensed | 10px | 700 | 0.05em | var(--color-text-secondary) / var(--color-bg-primary) |

## 4. Spacing
- **Settings page padding:** 0 16px 16px
- **Title padding:** 16px 0
- **Layout gap:** 16px
- **Sidebar padding:** 8px
- **Sidebar width:** 200px
- **Tab padding:** 12px 16px, gap: 12px, border-radius: 8px
- **Panel padding:** 20px 24px, border-radius: 12px
- **Panel title margin-bottom:** 24px, padding-bottom: 12px
- **Row padding:** 16px, gap: 16px, border-radius: 10px
- **Row content gap:** 4px (title↔subtitle)
- **Icon box:** 40px x 40px
- **Actions gap:** 16px, margin-top: 24px, padding-top: 16px
- **Settings content gap:** 16px

## 5. Components

### Slider (custom range)
- **Container:** display: flex, align-items: center, gap: 12px, width: 100%
- **Track:** flex: 1, height: 4px, bg: rgba(255,255,255,0.15), border-radius: 2px, position: relative
- **Fill:** position: absolute, top/left: 0, height: 100%, bg: #00d4ff, border-radius: 2px, pointer-events: none
- **Input:** position: absolute, top: -8px, left: 0, width: 100%, height: 20px, opacity: 0, cursor: pointer
- **Thumb:** position: absolute, top: 50%, width: 16px, height: 16px, bg: white, border-radius: 50%, transform: translate(-50%,-50%), box-shadow: 0 0 6px rgba(0,212,255,0.6), pointer-events: none
- **Value readout:** min-width: 32px, text-align: right

### Dropdown
- **Container:** position: relative, min-width: 120px
- **Trigger:** width: 100%, display: flex, align-items: center, justify-content: space-between, gap: 8px, padding: 8px 12px, bg: #0d1f3c, border: 1px solid rgba(0,212,255,0.3), border-radius: 6px, cursor: pointer
- **Arrow:** ChevronDown from lucide-react, 16x16px, color: #00d4ff, transition: transform 0.2s ease
- **Arrow (open):** transform: rotate(180deg)
- **Menu:** position: absolute, top: calc(100% + 4px), left/right: 0, bg: #0d1f3c, border: 1px solid rgba(0,212,255,0.3), border-radius: 6px, overflow: hidden, z-index: 50, box-shadow: 0 8px 24px rgba(0,0,0,0.4)
- **Option:** width: 100%, padding: 10px 12px, text-align: left, bg: none, cursor: pointer
- **Option:hover:** bg: #112447, color: #ffffff
- **Option selected:** color: #00d4ff

### Toggle Switch
- **Box:** position: relative, width: 44px, height: 24px, border-radius: 12px, border: none, cursor: pointer, flex center, overflow: hidden
- **State:on:** bg: #00d4ff, box-shadow: 0 0 10px rgba(0,212,255,0.5)
- **State:off:** bg: rgba(255,255,255,0.15)
- **State:disabled:** opacity: 0.5, cursor: not-allowed
- **Label:** "ON" or "OFF" text, 10px, 700 weight

### NeonButton
- **Box:** inline-flex, items-center, justify-center, rounded-[8px], font-heading, font-semibold, tracking-wide, transition-all 0.2s duration-200, cursor-pointer, disabled:opacity-50 disabled:cursor-not-allowed
- **Sizes:** sm: px-3 py-1.5 text-sm gap-1.5, md: px-5 py-2.5 text-base gap-2, lg: px-8 py-3 text-lg gap-3
- **Variant:primary:** bg #22c55e, text white, border #16a34a, shadow 0 0 12px rgba(34,197,94,0.4), hover shadow 0 0 20px rgba(34,197,94,0.6), hover bg #16a34a, active scale-[0.98]
- **Variant:danger:** bg #dc2626, text white, border #b91c1c, shadow 0 0 12px rgba(220,38,38,0.4), hover shadow 0 0 20px rgba(220,38,38,0.6)
- **Variant:secondary:** bg rgba(0,212,255,0.15), text #00d4ff, border rgba(0,212,255,0.3), hover bg rgba(0,212,255,0.25)
- **Variant:ghost:** bg transparent, text #8b9dc3, hover text white, hover bg rgba(255,255,255,0.05)
- **Icon:** flex-shrink-0 span wrapping the icon element

### Settings Tab
- **Box:** display: flex, align-items: center, gap: 12px, padding: 12px 16px, border-radius: 8px, bg: transparent, border: none, cursor: pointer, text-align: left
- **State:inactive:** color: #8b9dc3
- **State:hover:** bg: rgba(255,255,255,0.05), color: #ffffff
- **State:active:** bg: #00d4ff, color: #050a1a
- **State:active:hover:** filter: brightness(1.1)
- **Icon:** lucide-react (depends on tab), w-5 h-5

### Settings Danger Zone
- **Box:** bg: rgba(255,23,68,0.05), border: 1px solid rgba(255,23,68,0.2), border-radius: 10px

## 6. Effects & Motion
- **Tab transition:** all 0.2s ease
- **Tab active:hover:** filter: brightness(1.1)
- **Settings row hover:** background-color 0.2s ease
- **NeonButton:** transition-all 0.2s, active: scale-[0.98], hover: brighten + enhanced shadow
- **Dropdown arrow:** transform 0.2s ease (rotate 180°)
- **Dropdown option:** all 0.15s ease
- **Toggle:** all 0.2s ease, label opacity 0.2s ease

## 7. Assets
- **Icons:** lucide-react — Volume2, Music, AudioWaveform, Monitor, Flag, Timer, Users, Globe, PartyPopper, Trophy, Save, RotateCcw, X, Settings, Eye, MousePointer
- **Icon size:** w-5 h-5 (all tab and row icons)

## 8. Shared Elements
- **Header:** Same as Lobby (GameHeader with showSettings=false)
- **Background:** Same as Leaderboard (GameBackground variant="stadium")
- **NeonButton:** Same as Leaderboard (shared component)
- **Countdown options:** 30, 45, 60, 90 seconds
- **Max players options:** 2, 4, 6, 8

## 9. Flow
- **Route path:** /settings
- **Entry:** navigated from any page via GameHeader settings button
- **Store reads:** settings (all values), updateSettings, resetSettings
- **Tabs:** General, Audio, Display, Gameplay, Voting, Countries, Advanced
- **Actions:** SAVE CHANGES → navigate('/lobby'), RESET TO DEFAULTS → resetSettings(), CANCEL → navigate('/lobby')
- **Data sources:** COUNTRIES from mockData (country dropdown), hardcoded OPTIONS arrays
