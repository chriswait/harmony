import { Timing } from './types';

export const sortByTiming = (
  thing1: { timing?: Timing },
  thing2: { timing?: Timing },
) => {
  if (thing1.timing!.section > thing2.timing!.section) return 1;
  if (thing1.timing!.section < thing2.timing!.section) return -1;
  if (thing1.timing!.section === thing2.timing!.section) {
    if (thing1.timing!.measure > thing2.timing!.measure) return 1;
    if (thing1.timing!.measure < thing2.timing!.measure) return -1;
    if (thing1.timing!.measure === thing2.timing!.measure) {
      if ((thing1.timing?.beat ?? 0) > (thing2.timing?.beat ?? 0)) return 1;
      if ((thing1.timing?.beat ?? 0) < (thing2.timing?.beat ?? 0)) return -1;
      return 0;
    }
  }
  return 0;
};
