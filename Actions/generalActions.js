import {
  UPDATE_PURCHASING,
  UPDATE_SHOW_PURCHASE_OVERVIEW,
  UPDATE_IS_PURCHASING
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

export const updateIsPurchasing = payload => {
    return {
        type: UPDATE_IS_PURCHASING,
        payload
    }
}