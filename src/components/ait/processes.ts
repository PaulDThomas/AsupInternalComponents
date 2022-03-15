import { AioOptionGroup } from "../aio/aioInterface";

/**
 * Update options with another set of options
 * @param incomingOptions 
 * @param previousOptions 
 * @returns Updated option group
 */
export const processOptions = (incomingOptions: AioOptionGroup, previousOptions: AioOptionGroup) => {
  // Return updated options if there is nothing to process against  
  if (previousOptions === undefined) {
    return incomingOptions;
  }

  // Create new options to update
  var newOptions = previousOptions.map(a => { return { ...a } });

  // Get each value, or add blank
  for (let uo of incomingOptions) {
    let i = newOptions.findIndex(no => no.optionName === uo.optionName);
    if (i >= 0) {
      newOptions[i].type = uo.type;
      newOptions[i].value = uo.value;
      newOptions[i].label = uo.label ?? newOptions[i].label;
      newOptions[i].availableValues = uo.availableValues ?? newOptions[i].availableValues;
      newOptions[i].readOnly = uo.readOnly ?? newOptions[i].readOnly;
    }
    else {
      newOptions.push({ ...uo });
    }
    uo.value = incomingOptions?.find((i) => { return i.optionName === uo.optionName; })?.value ?? uo.value;
  }
  return newOptions;
};