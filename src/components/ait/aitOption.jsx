export const AitOption = ({ name, label, type, value, setValue, availableValues }) => {

  const renderSwitch = (type) => {
    switch (type) {
      default:
        return (
          <input className={"ait-option-input"} value={value} onChange={(e) => { setValue(e.currentTarget.value) }} />
        );
    }
  }

  return (
    <div>
      <span className={"ait-option-label"}>{label}</span>
      {renderSwitch}
    </div>
  );
}