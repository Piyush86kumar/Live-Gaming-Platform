interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`slider-container ${className || ''}`}>
      <div className="slider-track">
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
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input"
        />
        <div
          className="slider-thumb"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <span className="slider-value">{value}</span>
    </div>
  );
}