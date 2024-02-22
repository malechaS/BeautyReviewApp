export const loginReducer = (state = {isLoggedIn: false}, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {...state, isLoggedIn: true};
    case 'LOG_OUT':
      return {...state, isLoggedIn: false};
    default:
      return state;
  }
};

export const permissionReducer = (state = {permission: 'user'}, action) => {
  switch (action.type) {
    case 'admin':
      return {...state, permission: 'admin'};
    case 'mod':
      return {...state, permission: 'mod'};
    case 'user':
      return {...state, permission: 'user'};
    default:
      return state;
  }
};
