/* ===== FILE: ToggleSwitch.tsx ===== */
/* Summary: A boolean toggle button that displays ON/OFF label and cycles state on click. */

/* ===== PROPS INTERFACE ===== */
/* Summary: checked = current boolean state; onChange = toggle handler; disabled = prevents interaction. */
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/* ===== COMPONENT ===== */
export function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}    /* Toggle to opposite state unless disabled */
      disabled={disabled}
      className={`toggle-switch ${checked ? 'toggle-switch--on' : 'toggle-switch--off'} ${disabled ? 'toggle-switch--disabled' : ''}`}
    >
      {/*
        Label shows "ON" or "OFF" depending on checked state.
        --on/--off modifier classes control visual styling (colour, border).
      */}
      <span className={`toggle-label ${checked ? 'toggle-label--on' : 'toggle-label--off'}`}>
        {checked ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}
