import { combineReducers } from 'redux';
import InsightsReducer from './InsightsReducer';

export default combineReducers({
  insights: InsightsReducer,
});
