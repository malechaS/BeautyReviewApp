import {createStore, combineReducers} from 'redux';

import {loginReducer, permissionReducer} from './reducers';

const rootReducer = combineReducers({
  login: loginReducer,
  perm: permissionReducer,
});

const store = createStore(rootReducer);

export default store;
