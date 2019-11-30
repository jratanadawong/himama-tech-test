export const getters = {
  overlay(state) {
    return state.overlay
  },
  user(state) {
    return state.user
  },
  selectedEntry(state) {
    return state.selectedEntry
  },
  entries(state) {
    return state.user.entries
  },
}
