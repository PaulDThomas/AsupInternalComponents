import { AioExternalSingle } from '../aio';
import { v4 as uuidv4 } from 'uuid';

export const newExternalSingle = (): AioExternalSingle => {
  return {
    airid: uuidv4(),
    oldText: '',
    newText: '',
  };
};
