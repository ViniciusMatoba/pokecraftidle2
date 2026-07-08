export const getSlotDocId = (uid, slot = 1) => (Number(slot) > 1 ? `${uid}_s${Number(slot)}` : uid);
