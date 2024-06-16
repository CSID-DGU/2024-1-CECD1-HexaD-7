import { atom } from 'recoil';

export const responseState = atom({
  key: 'mainResponseState',
  default: null,
});

export const loadingState = atom({
  key: 'mainLoadingState',
  default: false,
});

