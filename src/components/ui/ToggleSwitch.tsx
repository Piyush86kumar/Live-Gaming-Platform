interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`toggle-switch ${checked ? 'toggle-switch--on' : 'toggle-switch--off'} ${disabled ? 'toggle-switch--disabled' : ''}`}
    >
      <span className={`toggle-label ${checked ? 'toggle-label--on' : 'toggle-label--off'}`}>
        {checked ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}