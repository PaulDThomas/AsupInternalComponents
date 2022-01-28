export const AioString = (
  {
    Label,
    Value,
    SetValue,
  }
) => {

  return (
  <div>
    <span className={"ait-option-label"}>{Label}: </span>
    <input
      className={"aio-input"}
      value={Value}
      onChange={(e) => SetValue(e.target.value)}
    />
  </div>
  )
}