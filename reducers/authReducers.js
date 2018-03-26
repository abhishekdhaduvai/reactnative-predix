const initialState = {
  loading: true,
  username: null
}

export function auth(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { 
        ...state,
        loading: false,
        username: action.payload.name
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        loading: false
      }
    default:
      return state;
  }
}