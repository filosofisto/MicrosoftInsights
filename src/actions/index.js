import {
  CUSTOM_TRACE,
  CUSTOM_TRACE_SUCCESS,
  CUSTOM_TRACE_FAILED,
} from './types';

export const customTraceAction = traceText => {
  return (dispatch) => {
    // Start communication (can reflect on component
    dispatch({ type: CUSTOM_TRACE });

    // TODO: real call to insights

    const insightsResult = { textSent: traceText };
    customTraceSuccess(dispatch, insightsResult);
  };
};

const customTraceFailed = (dispatch) => {
  dispatch({ type: CUSTOM_TRACE_FAILED });
};

const customTraceSuccess = (dispatch, insightsResult) => {
  dispatch({
    type: CUSTOM_TRACE_SUCCESS,
    payload: {
      message: 'Custom trace registrado com sucesso',
      insightsResult,
    },
  });
};

