export const AitOptions = ({ initialData, returnData }) => {

  if (!initialData) return ("");

  return (
    <>
      {initialData.map((k, i) => {
        return (
          <div key={i}>
            <span className={"ait-option-label"}>{k.label ?? k.name}: </span>
            {k.value}
          </div>
        );
      })}
    </>
  );
}