import { STORE_REFERENCES, TOGGLE_REFS_VIEW, FETCHING_REFS } from './types';

export const storeRefs = refs => {
  return {
    type: STORE_REFERENCES,
    payload: refs
  }
}

export const fetchingRefs = () => {
  return {
    type: FETCHING_REFS
  }
}

export const changeRefsView = val => {
  return {
    type: TOGGLE_REFS_VIEW,
    payload: val
  }
}