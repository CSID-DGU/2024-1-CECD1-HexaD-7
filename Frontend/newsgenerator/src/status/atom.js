import { atom, selector } from "recoil";

export const surveyState = atom({
  key: "surveyState",
  default: [],
});

export const surveyCntState = atom({
  key: "surveyCntState",
  default: 0,
});
// scores 배열의 길이가 3이 된 시점에서 return.
export const isSurveyCompleteState = selector({
  key: "isSurveryCompleteState",
  get: ({ get }) => {
    const scores = get(surveyState);
    return scores.length === 3;
  },
});
