import {
  BANNERS_FAIL,
  BANNERS_REQUEST,
  BANNERS_SUCCESS,
  CLEAR_ERRORS,
} from '../constants/BannerConstants';

export const getBannersReducer = (state = {banners: []}, action) => {
  switch (action.type) {
    case BANNERS_REQUEST:
      return {
        loading: true,
      };
    case BANNERS_SUCCESS:
      return {
        loading: false,
        banners: action.payload,
      };
    case BANNERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
