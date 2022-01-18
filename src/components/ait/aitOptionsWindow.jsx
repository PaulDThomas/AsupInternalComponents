import './ait.css';
import { AitOption} from './aitOption';

export const AitOptionsWindow = ({ 
  initialData,
  returnData,
}) => {
  var options = [];
  for (var o of initialData) {
    options.push(
      <AitOption
        key={o}
        label={o.label}
        value={o.value}
        type={o.type}
      />
    );
  }
  return options;
}

