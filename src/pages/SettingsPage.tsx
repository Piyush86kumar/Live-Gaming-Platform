/* ================================================================
   FILE: SettingsPage.tsx
   ================================================================ */
/* Summary: Full settings page with a vertical tab sidebar
   (General, Audio, Display, Gameplay, Voting, Countries, Advanced)
   and per-tab configuration rows using Slider, ToggleSwitch, Dropdown,
   and NeonButton components. */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2, Music, AudioWaveform, Monitor, Flag, Timer, Users, Globe,
  PartyPopper, Trophy, Save, RotateCcw, X, Settings as SettingsIcon,
  Eye, MousePointer
} from 'lucide-react';
import { GameBackground } from '@/components/layout/GameBackground';
import { GameHeader } from '@/components/layout/GameHeader';
import { NeonButton } from '@/components/ui/NeonButton';
import { Slider } from '@/components/ui/Slider';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { Dropdown } from '@/components/ui/Dropdown';
import { useGameStore } from '@/hooks/useGameStore';
import { COUNTRIES } from '@/data/mockData';

type SettingsTab = 'general' | 'audio' | 'display' | 'gameplay' | 'voting' | 'countries' | 'advanced';

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { id: 'general',   label: 'General',   icon: <SettingsIcon className="w-5 h-5" /> },
  { id: 'audio',     label: 'Audio',     icon: <Volume2 className="w-5 h-5" /> },
  { id: 'display',   label: 'Display',   icon: <Monitor className="w-5 h-5" /> },
  { id: 'gameplay',  label: 'Gameplay',  icon: <Users className="w-5 h-5" /> },
  { id: 'voting',    label: 'Voting',    icon: <Trophy className="w-5 h-5" /> },
  { id: 'countries', label: 'Countries', icon: <Globe className="w-5 h-5" /> },
  { id: 'advanced',  label: 'Advanced',  icon: <AudioWaveform className="w-5 h-5" /> },
];

const COUNTDOWN_OPTIONS = [30, 45, 60, 90];
const MAX_PLAYERS_OPTIONS = [2, 4, 6, 8];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings } = useGameStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const countryOptions = COUNTRIES.map(c => ({ value: c.code, label: `${c.name} (${c.code})` }));
  const countdownOptions = COUNTDOWN_OPTIONS.map(v => ({ value: v, label: `${v} Seconds` }));
  const maxPlayersOptions = MAX_PLAYERS_OPTIONS.map(v => ({ value: v, label: `${v} Players` }));

  const renderTabContent = () => {
    switch (activeTab) {

      case 'general':
        return (
          <div className="settings-content">
            <SettingsRow
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
            <SettingsRow
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
            <SettingsRow
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
            <SettingsRow
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
            <SettingsRow
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

      case 'audio':
        return (
          <div className="settings-content">
            <SettingsRow
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
            <SettingsRow
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
            <SettingsRow
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

      case 'display':
        return (
          <div className="settings-content">
            <SettingsRow
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
            <SettingsRow
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

      case 'gameplay':
        return (
          <div className="settings-content">
            <SettingsRow
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
            <SettingsRow
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
            <SettingsRow
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

      case 'voting':
        return (
          <div className="settings-content">
            <SettingsRow
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
            <SettingsRow
              icon={<MousePointer className="w-5 h-5" />}
              title="Show Vote Count"
              subtitle="Display real-time vote counts during race"
              control={
                <ToggleSwitch checked={true} onChange={() => {}} />
              }
            />
          </div>
        );

      case 'countries':
        return (
          <div className="settings-content">
            <SettingsRow
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
            <SettingsRow
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
            <SettingsRow
              icon={<Eye className="w-5 h-5" />}
              title="Show Country Codes"
              subtitle="Display country codes on flags"
              control={
                <ToggleSwitch checked={true} onChange={() => {}} />
              }
            />
          </div>
        );

      case 'advanced':
        return (
          <div className="settings-content">
            <div className="settings-danger-zone">
              <SettingsRow
                icon={<Trophy className="w-5 h-5" />}
                title="Reset Daily Leaderboard"
                subtitle="This will clear today's leaderboard for all players"
                control={
                  <NeonButton
                    variant="danger"
                    size="sm"
                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => {
                      if (confirm('Are you sure you want to reset the leaderboard?')) {
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

      default:
        return null;
    }
  };

  return (
    <GameBackground>

      <GameHeader />

      {/* ----- PAGE CONTENT ----- */}
      <div className="settings-page">

        {/* Title */}
        <div className="settings-title">
          <span className="settings-title__text">SETTINGS</span>
        </div>

        {/* ----- SETTINGS LAYOUT (SIDEBAR + PANEL) ----- */}
        <div className="settings-layout">

          {/* Sidebar tabs */}
          <div className="settings-sidebar">
            <div className="settings-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-tab ${activeTab === tab.id ? 'settings-tab--active' : ''}`}
                >
                  <span className="settings-tab__icon">{tab.icon}</span>
                  <span className="settings-tab__label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content panel */}
          <div className="settings-panel">
            <h2 className="settings-panel__title">{TABS.find(t => t.id === activeTab)?.label}</h2>
            <div className="settings-panel__content">
              {renderTabContent()}
            </div>
          </div>

        </div>

        {/* ----- BOTTOM ACTIONS ----- */}
        <div className="settings-actions">
          <NeonButton
            variant="primary"
            size="lg"
            icon={<Save className="w-5 h-5" />}
            onClick={() => navigate('/lobby')}
          >
            SAVE CHANGES
          </NeonButton>
          <NeonButton
            variant="danger"
            size="lg"
            icon={<RotateCcw className="w-5 h-5" />}
            onClick={resetSettings}
          >
            RESET TO DEFAULTS
          </NeonButton>
          <NeonButton
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

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  control: React.ReactNode;
}

function SettingsRow({ icon, title, subtitle, control }: SettingsRowProps) {
  return (
    <div className="settings-row">
      <div className="settings-row__icon">{icon}</div>
      <div className="settings-row__info">
        <span className="settings-row__title">{title}</span>
        <span className="settings-row__subtitle">{subtitle}</span>
      </div>
      <div className="settings-row__control">{control}</div>
    </div>
  );
}
