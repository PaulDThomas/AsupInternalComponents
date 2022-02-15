import { AioString } from "./aioString";

export const getOptionType = (option, updateOption) => {
    switch (option.type) {
      case ("string"):
      default:
        return (
          <AioString
            Label={option.label ?? option.name}
            Value={option.value}
            SetValue={updateOption}
          />
        )
    }
  }