export function mapActionsToReducers(actions) {
  return (state, payload) => {
    const returnDefaultState = () => state;
    const reducer = actions[payload.type] || returnDefaultState;
    reducer(state, payload);
  }
}
