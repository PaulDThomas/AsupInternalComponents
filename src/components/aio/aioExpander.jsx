import { useState } from "react"

export const AioExpander = ({
  inputObject,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!inputObject) {
    return ("Not defined");
  }

  if (!isExpanded) {
    return (
      <span className="aiox closed">
        <div className="aiox-button" onClick={(e) => setIsExpanded(true)} />
        <span className="aiox-value">{Object.values(inputObject).join(', ')}</span>
      </span>
    );
  }
  else {
    return (
      <span className="aiox open">
        <div className="aiox-button" onClick={(e) => setIsExpanded(false)} />
        <table className='aiox-table'>
          <tbody>
            {Object.keys(inputObject).map((k) => {
              return (
                <tr key={k}>
                  <td className='aiox-label'>{k}</td>
                  <td className='aiox-value'>{inputObject[k]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </span>
    );
  }
}