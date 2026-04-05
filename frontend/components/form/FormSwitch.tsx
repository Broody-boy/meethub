interface FormSwitchProps {
    checked: boolean,
    onCheckedChange: (checked: boolean) => void
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
  checked,
  onCheckedChange,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex items-center
        w-11 h-6 rounded-full
        transition-colors duration-200
        ${checked ? "bg-app-primary" : "bg-[#e5e5e5]"}
      `}
    >
      <span
        className={`
          inline-block w-4 h-4 bg-white rounded-full
          transform transition-transform duration-200
          ${checked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
};