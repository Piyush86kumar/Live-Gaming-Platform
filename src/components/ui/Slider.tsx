/* ===== FILE: Slider.tsx ===== */
/* Summary: A custom range slider with a visual fill bar, draggable thumb, and current value label. */

/* ===== PROPS INTERFACE ===== */
/* Summary: value/onChange = controlled state; min/max/step = range constraints. */
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/* ===== COMPONENT ===== */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className
}: SliderProps) {
  /* Convert current value to percentage for fill/thumb positioning */
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`slider-container ${className || ''}`}>
      <div className="slider-track">
        {/*
          Fill bar: width tracks the percentage.
          Native range input sits on top for accessibility and gesture handling.
          Thumb element mirrors the input position visually so we can style it beyond native limits.
        */}
        <div
          className="slider-fill"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}    /* Emit numeric value on change */
          className="slider-input"
        />
        <div
          className="slider-thumb"
          style={{ left: `${percentage}%` }}    /* Position custom thumb at current value */
        />
      </div>
      <span className="slider-value">{value}</span>    /* Display current numeric value */
    </div>
  );
}
