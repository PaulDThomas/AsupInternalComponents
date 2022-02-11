// Set default options, name, label & available choices
// const defaultOptions = [
//     { name: "tableType", label: "Type of table", availableChoices: [ 
//       {"value": "Amazeballs", "label": "Amazing table"},
//       {"value": "Summary", "label": "Summary table"},
//       {"value": "TTE", "label": "Time to event table"},
//     ] }
//   ];
  
  export const processOptions = (initialOptions, defaultOptions) => {
    var newOptions = defaultOptions.map(a => {return {...a}})
  
    // Get each value, or add blank
    for(let o of newOptions) {
      o.value = ((initialOptions ?? []).find((i) => { return i.name === o.name; }) !== undefined) ? initialOptions.find((i) => { return i.name === o.name; }).value : o.value;
    }
    return newOptions;
    //return initialOptions ?? [];
  };