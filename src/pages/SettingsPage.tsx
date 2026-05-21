/* ================================================================
   FILE: SettingsPage.tsx
   ================================================================ */
/* Summary: Full settings page with a vertical tab sidebar
   (General, Audio, Display, Gameplay, Voting, Countries, Advanced)
   and per-tab configuration rows using Slider, ToggleSwitch, Dropdown,
   and NeonButton components. */

import { useState } from 'react';                        /* React hook for tracking the active tab */
import { useNavigate } from 'react-router-dom';          /* Hook for programmatic page navigation */
import {                                                          /* Icon components grouped by import line */
  Volume2, Music, AudioWaveform, Monitor, Flag, Timer, Users, Globe,
  PartyPopper, Trophy, Save, RotateCcw, X, Settings as SettingsIcon,
  Eye, MousePointer
} from 'lucide-react';
import { GameBackground } from '@/components/layout/GameBackground'; /* Full-page gradient background wrapper */
import { GameHeader } from '@/components/layout/GameHeader';         /* Shared game header with nav links */
import { NeonButton } from '@/components/ui/NeonButton';             /* Neon-styled button component */
import { Slider } from '@/components/ui/Slider';                     /* Range slider for volume/values */
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';         /* On/off toggle switch */
import { Dropdown } from '@/components/ui/Dropdown';                 /* Dropdown selector */
import { useGameStore } from '@/hooks/useGameStore';    /* Zustand store for all game state */
import { COUNTRIES } from '@/data/mockData';            /* Static list of available countries */

/* ===== TYPE DEFINITIONS ===== */
/* Summary: Types for tab identification and tab configuration shape. */

/* SettingsTab: Union of all valid tab identifiers */
type SettingsTab = 'general' | 'audio' | 'display' | 'gameplay' | 'voting' | 'countries' | 'advanced';

/* TabConfig: Shape of a single tab entry in the sidebar */
interface TabConfig {
  id: SettingsTab;        /* Unique tab identifier matching the union type */
  label: string;          /* Human-readable tab label shown in the sidebar */
  icon: React.ReactNode;  /* Icon component (lucide-react) to display next to the label */
}

/* ===== CONSTANTS ===== */
/* Summary: Static configuration for tabs and dropdown options. */

/* TABS: Array of all sidebar tab definitions */
const TABS: TabConfig[] = [
  { id: 'general',   label: 'General',   icon: <SettingsIcon className="w-5 h-5" /> },
  { id: 'audio',     label: 'Audio',     icon: <Volume2 className="w-5 h-5" /> },
  { id: 'display',   label: 'Display',   icon: <Monitor className="w-5 h-5" /> },
  { id: 'gameplay',  label: 'Gameplay',  icon: <Users className="w-5 h-5" /> },
  { id: 'voting',    label: 'Voting',    icon: <Trophy className="w-5 h-5" /> },
  { id: 'countries', label: 'Countries', icon: <Globe className="w-5 h-5" /> },
  { id: 'advanced',  label: 'Advanced',  icon: <AudioWaveform className="w-5 h-5" /> },
];

const COUNTDOWN_OPTIONS = [30, 45, 60, 90];           /* Available race countdown durations in seconds */
const MAX_PLAYERS_OPTIONS = [2, 4, 6, 8];            /* Available max player counts */

/* ===== SETTINGS PAGE COMPONENT ===== */
/* Summary: Renders the settings page with a tabbed sidebar, dynamic content panel, and bottom action bar. */
export default function SettingsPage() {
  const navigate = useNavigate();                                                      /* Navigation helper for route changes */
  const { settings, updateSettings, resetSettings } = useGameStore();                  /* Destructure store: current settings, updater, and reset */
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');                  /* Local state for the currently active tab */

  /* Derived dropdown options from constants and mock data */
  const countryOptions = COUNTRIES.map(c => ({ value: c.code, label: `${c.name} (${c.code})` })); /* Map countries to {value, label} for Dropdown */
  const countdownOptions = COUNTDOWN_OPTIONS.map(v => ({ value: v, label: `${v} Seconds` }));      /* Map numbers to dropdown options with "Seconds" suffix */
  const maxPlayersOptions = MAX_PLAYERS_OPTIONS.map(v => ({ value: v, label: `${v} Players` }));   /* Map numbers to dropdown options with "Players" suffix */

  /* ===== TAB CONTENT RENDERER ===== */
  /* Summary: Switch on the active tab ID and return the appropriate settings rows. */
  const renderTabContent = () => {
    switch (activeTab) {

      /* ----- GENERAL TAB ----- */
      /* Summary: Master volume, music volume, sound effects, fullscreen toggle, show flags toggle. */
      case 'general':
        return (
          <div className="settings-content">
            <SettingsRow                               /* Master Volume slider */
              icon={<Volume2 className="w-5 h-5" />}
              title="Master Volume"
              subtitle="Control overall audio level"
              control={
                <Slider
                  value={settings.masterVolume}
                  onChange={(v) => updateSettings({ masterVolume: v })}
                  className="w-48"
                />
              }
            />
            <SettingsRow                               /* Music Volume slider */
              icon={<Music className="w-5 h-5" />}
              title="Music Volume"
              subtitle="Background music level"
              control={
                <Slider
                  value={settings.musicVolume}
                  onChange={(v) => updateSettings({ musicVolume: v })}
                  className="w-48"
                />
              }
            />
            <SettingsRow                               /* Sound Effects slider */
              icon={<AudioWaveform className="w-5 h-5" />}
              title="Sound Effects"
              subtitle="Game sound effects volume"
              control={
                <Slider
                  value={settings.soundEffects}
                  onChange={(v) => updateSettings({ soundEffects: v })}
                  className="w-48"
                />
              }
            />
            <SettingsRow                               /* Fullscreen Mode toggle */
              icon={<Monitor className="w-5 h-5" />}
              title="Fullscreen Mode"
              subtitle="Toggle fullscreen display"
              control={
                <ToggleSwitch
                  checked={settings.fullscreenMode}
                  onChange={(v) => updateSettings({ fullscreenMode: v })}
                />
              }
            />
            <SettingsRow                               /* Show Country Flags toggle */
              icon={<Flag className="w-5 h-5" />}
              title="Show Country Flags"
              subtitle="Display flags next to player names"
              control={
                <ToggleSwitch
                  checked={settings.showCountryFlags}
                  onChange={(v) => updateSettings({ showCountryFlags: v })}
                />
              }
            />
          </div>
        );

      /* ----- AUDIO TAB ----- */
      /* Summary: Subset of General — just the three volume sliders. */
      case 'audio':
        return (
          <div className="settings-content">
            <SettingsRow                               /* Master Volume slider (duplicated from General for convenience) */
              icon={<Volume2 className="w-5 h-5" />}
              title="Master Volume"
              subtitle="Control overall audio level"
              control={
                <Slider
                  value={settings.masterVolume}
                  onChange={(v) => updateSettings({ masterVolume: v })}
                  className="w-48"
                />
              }
            />
            <SettingsRow                               /* Music Volume slider */
              icon={<Music className="w-5 h-5" />}
              title="Music Volume"
              subtitle="Background music level"
              control={
                <Slider
                  value={settings.musicVolume}
                  onChange={(v) => updateSettings({ musicVolume: v })}
                  className="w-48"
                />
              }
            />
            <SettingsRow                               /* Sound Effects slider */
              icon={<AudioWaveform className="w-5 h-5" />}
              title="Sound Effects"
              subtitle="Game sound effects volume"
              control={
                <Slider
                  value={settings.soundEffects}
                  onChange={(v) => updateSettings({ soundEffects: v })}
                  className="w-48"
                />
              }
            />
          </div>
        );

      /* ----- DISPLAY TAB ----- */
      /* Summary: Fullscreen toggle and show country flags toggle. */
      case 'display':
        return (
          <div className="settings-content">
            <SettingsRow                               /* Fullscreen Mode toggle */
              icon={<Monitor className="w-5 h-5" />}
              title="Fullscreen Mode"
              subtitle="Toggle fullscreen display"
              control={
                <ToggleSwitch
                  checked={settings.fullscreenMode}
                  onChange={(v) => updateSettings({ fullscreenMode: v })}
                />
              }
            />
            <SettingsRow                               /* Show Country Flags toggle */
              icon={<Flag className="w-5 h-5" />}
              title="Show Country Flags"
              subtitle="Display flags next to player names"
              control={
                <ToggleSwitch
                  checked={settings.showCountryFlags}
                  onChange={(v) => updateSettings({ showCountryFlags: v })}
                />
              }
            />
          </div>
        );

      /* ----- GAMEPLAY TAB ----- */
      /* Summary: Race countdown duration, max players, default country dropdowns. */
      case 'gameplay':
        return (
          <div className="settings-content">
            <SettingsRow                               /* Race Countdown Duration dropdown */
              icon={<Timer className="w-5 h-5" />}
              title="Race Countdown Duration"
              subtitle="Set the countdown time before race starts"
              control={
                <Dropdown
                  value={settings.raceCountdownDuration}
                  options={countdownOptions}
                  onChange={(v) => updateSettings({ raceCountdownDuration: v as number })}
                  className="w-40"
                />
              }
            />
            <SettingsRow                               /* Maximum Players dropdown */
              icon={<Users className="w-5 h-5" />}
              title="Maximum Players"
              subtitle="Set the maximum number of players per race"
              control={
                <Dropdown
                  value={settings.maxPlayers}
                  options={maxPlayersOptions}
                  onChange={(v) => updateSettings({ maxPlayers: v as number })}
                  className="w-40"
                />
              }
            />
            <SettingsRow                               /* Default Country dropdown */
              icon={<Globe className="w-5 h-5" />}
              title="Default Country"
              subtitle="Select your default country"
              control={
                <Dropdown
                  value={settings.defaultCountry}
                  options={countryOptions}
                  onChange={(v) => updateSettings({ defaultCountry: v as string })}
                  className="w-48"
                />
              }
            />
          </div>
        );

      /* ----- VOTING TAB ----- */
      /* Summary: Confetti effects toggle and show vote count toggle. */
      case 'voting':
        return (
          <div className="settings-content">
            <SettingsRow                               /* Enable Confetti Effects toggle */
              icon={<PartyPopper className="w-5 h-5" />}
              title="Enable Confetti Effects"
              subtitle="Show confetti at the end of races"
              control={
                <ToggleSwitch
                  checked={settings.enableConfetti}
                  onChange={(v) => updateSettings({ enableConfetti: v })}
                />
              }
            />
            <SettingsRow                               /* Show Vote Count toggle (stub — no store binding yet) */
              icon={<MousePointer className="w-5 h-5" />}
              title="Show Vote Count"
              subtitle="Display real-time vote counts during race"
              control={
                <ToggleSwitch checked={true} onChange={() => {}} /> /* Hardcoded on, no-op onChange */
              }
            />
          </div>
        );

      /* ----- COUNTRIES TAB ----- */
      /* Summary: Default country dropdown, show flags, show country codes toggles. */
      case 'countries':
        return (
          <div className="settings-content">
            <SettingsRow                               /* Default Country dropdown */
              icon={<Globe className="w-5 h-5" />}
              title="Default Country"
              subtitle="Select your default country"
              control={
                <Dropdown
                  value={settings.defaultCountry}
                  options={countryOptions}
                  onChange={(v) => updateSettings({ defaultCountry: v as string })}
                  className="w-48"
                />
              }
            />
            <SettingsRow                               /* Show Country Flags toggle */
              icon={<Flag className="w-5 h-5" />}
              title="Show Country Flags"
              subtitle="Display flags next to player names"
              control={
                <ToggleSwitch
                  checked={settings.showCountryFlags}
                  onChange={(v) => updateSettings({ showCountryFlags: v })}
                />
              }
            />
            <SettingsRow                               /* Show Country Codes toggle (stub — no store binding yet) */
              icon={<Eye className="w-5 h-5" />}
              title="Show Country Codes"
              subtitle="Display country codes on flags"
              control={
                <ToggleSwitch checked={true} onChange={() => {}} /> /* Hardcoded on, no-op onChange */
              }
            />
          </div>
        );

      /* ----- ADVANCED TAB ----- */
      /* Summary: Danger zone with leaderboard reset button. */
      case 'advanced':
        return (
          <div className="settings-content">
            <div className="settings-danger-zone">     /* Wrapper for dangerous/destructive actions */
              <SettingsRow                               /* Reset Daily Leaderboard button */
                icon={<Trophy className="w-5 h-5" />}
                title="Reset Daily Leaderboard"
                subtitle="This will clear today's leaderboard for all players"
                control={
                  <NeonButton
                    variant="danger"
                    size="sm"
                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => {
                      if (confirm('Are you sure you want to reset the leaderboard?')) { /* Confirm dialog before destructive action */
                        // Reset logic — placeholder for future backend integration
                      }
                    }}
                  >
                    RESET
                  </NeonButton>
                }
              />
            </div>
          </div>
        );

      /* ----- DEFAULT ----- */
      /* Summary: Fallback for unknown tab IDs — renders nothing. */
      default:
        return null;
    }
  };

  /* ===== RENDER: SETTINGS PAGE LAYOUT ===== */
  /* Summary: Full page structure — background, header, title, tabbed sidebar/panel, and bottom action buttons. */
  return (
    <GameBackground>                                        /* Full-page gradient background wrapper */

      <GameHeader showSettings={false} />                   /* Shared header (settings icon hidden since we are already on settings) */

      {/* ----- PAGE CONTENT ----- */}
      <div className="settings-page">                       /* Root container for the settings layout */

        {/* Title */}
        <div className="settings-title">
          <span className="settings-title__text">SETTINGS</span> /* Page heading */
        </div>

        {/* ----- SETTINGS LAYOUT (SIDEBAR + PANEL) ----- */}
        {/* Summary: Horizontal split — left sidebar with tabs, right panel with content. */}
        <div className="settings-layout">

          {/* Sidebar tabs */}
          <div className="settings-sidebar">
            <div className="settings-tabs">
              {TABS.map((tab) => (                          /* Render each tab as a button in the sidebar */
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}      /* Switch the active tab on click */
                  className={`settings-tab ${activeTab === tab.id ? 'settings-tab--active' : ''}`} /* Highlight the active tab */
                >
                  <span className="settings-tab__icon">{tab.icon}</span>   /* Tab icon */
                  <span className="settings-tab__label">{tab.label}</span> /* Tab label text */
                </button>
              ))}
            </div>
          </div>

          {/* Content panel */}
          <div className="settings-panel">
            <h2 className="settings-panel__title">{TABS.find(t => t.id === activeTab)?.label}</h2> /* Panel heading — name of active tab */
            <div className="settings-panel__content">
              {renderTabContent()}                           /* Render the settings rows for the active tab */
            </div>
          </div>

        </div>

        {/* ----- BOTTOM ACTIONS ----- */}
        {/* Summary: Row of Save, Reset, and Cancel buttons. */}
        <div className="settings-actions">
          <NeonButton                                       /* SAVE CHANGES — navigates back to lobby */
            variant="primary"
            size="lg"
            icon={<Save className="w-5 h-5" />}
            onClick={() => navigate('/lobby')}
          >
            SAVE CHANGES
          </NeonButton>
          <NeonButton                                       /* RESET TO DEFAULTS — restores store's default settings */
            variant="danger"
            size="lg"
            icon={<RotateCcw className="w-5 h-5" />}
            onClick={resetSettings}
          >
            RESET TO DEFAULTS
          </NeonButton>
          <NeonButton                                       /* CANCEL — navigates back to lobby without saving */
            variant="secondary"
            size="lg"
            icon={<X className="w-5 h-5" />}
            onClick={() => navigate('/lobby')}
          >
            CANCEL
          </NeonButton>
        </div>

      </div>
    </GameBackground>
  );
}

/* ===== SETTINGS ROW HELPER COMPONENT ===== */
/* Summary: A reusable single-row layout with an icon, title, subtitle, and a control element (Slider, ToggleSwitch, Dropdown, etc.). */

/* SettingsRowProps: Shape of props accepted by the SettingsRow component */
interface SettingsRowProps {
  icon: React.ReactNode;      /* Icon element displayed on the left of the row */
  title: string;              /* Bold title text */
  subtitle: string;           /* Dimmed subtitle text beneath the title */
  control: React.ReactNode;   /* The interactive control (Slider, ToggleSwitch, Dropdown, Button) placed on the right */
}

/* SettingsRow: Renders a single configuration row with icon, info, and control */
function SettingsRow({ icon, title, subtitle, control }: SettingsRowProps) {
  return (
    <div className="settings-row">
      <div className="settings-row__icon">{icon}</div>              /* Icon column */
      <div className="settings-row__info">
        <span className="settings-row__title">{title}</span>        /* Setting name */
        <span className="settings-row__subtitle">{subtitle}</span>  /* Setting description */
      </div>
      <div className="settings-row__control">{control}</div>        /* The control element (slider, toggle, dropdown, etc.) */
    </div>
  );
}
