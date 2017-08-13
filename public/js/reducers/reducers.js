import { combineReducers } from 'redux';
import drawReducer from './drawReducer';
import musicReducer from './musicReducer';

const reducer = combineReducers({
	draw: drawReducer,
	music: musicReducer
});

export default reducer
