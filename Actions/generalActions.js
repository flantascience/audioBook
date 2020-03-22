import {
  UPDATE_PURCHASING,
  UPDATE_SHOW_PURCHASE_OVERVIEW
} from './types';

export const updateShowPurchaseOverview = value => {
  return {
    type: UPDATE_SHOW_PURCHASE_OVERVIEW,
    payload: value
  }
}

export const updatePurchasing = value => {
  return {
    type: UPDATE_PURCHASING,
    payload: value
  }
}