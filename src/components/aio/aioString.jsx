export const AioString = (
  {
    Label,
    Value,
    SetValue,
  }
) => {

  return (
    <div>
      <div className={"aio-label"}>{Label}: </div>
      <div className={"aio-input-holder"}>
        <input
          className={"aio-input"}
          value={Value}
          onChange={(e) => SetValue(e.target.value)}
        />
      </div>
    </div>
  )
}