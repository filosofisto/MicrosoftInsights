import {
  CUSTOM_TRACE,
  CUSTOM_TRACE_FAILED,
  CUSTOM_TRACE_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  message: '',
  insightsResult: null,
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  console.warn('reducer => ' + JSON.stringify(state));
  switch (action.type) {
    case CUSTOM_TRACE:
      return {
        ...state,
        ...INITIAL_STATE,
        loading: true,
      };
    case CUSTOM_TRACE_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        message: action.payload.message,
        insightsResult: action.payload.insightsResult,
      };
    case CUSTOM_TRACE_FAILED:
      return {
        ...state,
        ...INITIAL_STATE,
        message: 'Error to send custom trace to Insights',
      };
    default:
      return state;
  }
};
