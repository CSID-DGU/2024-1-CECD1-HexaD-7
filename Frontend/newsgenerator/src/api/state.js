import { atom } from 'recoil';

export const responseState = atom({
  key: 'mainResponseState',
  default: null,
});

export const loadingState = atom({
  key: 'mainLoadingState',
  default: false,
});

export const categoryState = atom({
  key: 'categoryState',
  default: {first_category: '', second_category: '', options2:[]},
});