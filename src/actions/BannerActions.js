import {
  BANNERS_FAIL,
  BANNERS_REQUEST,
  BANNERS_SUCCESS,
  CLEAR_ERRORS,
} from '../constants/BannerConstants';
import axiosInstance, {BASE_URL} from '../utils/Axios';

// get all banners
export const getAllBanners = () => async dispatch => {
  try {
    dispatch({type: BANNERS_REQUEST});
    const {data} = await axiosInstance.get(
      `${BASE_URL}/api/v1/constants/banners`,
    );

    dispatch({type: BANNERS_SUCCESS, payload: data.banners || []});
  } catch (error) {
    dispatch({
      type: BANNERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Used to clear all the errors
export const clearErrors = () => async dispatch => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
