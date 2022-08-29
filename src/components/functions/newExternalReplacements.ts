import { AioExternalReplacements } from '../aio';
import { newReplacementValues } from './newReplacementValues';

export const newExternalReplacements = (): AioExternalReplacements => {
  return {
    givenName: '',
    newTexts: [newReplacementValues()],
  };
};
