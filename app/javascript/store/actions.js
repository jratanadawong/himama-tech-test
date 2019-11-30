export const actions = {
  toggleOverlay({commit}) {
    commit('toggleOverlay')
  },
  closeOverlay({commit}) {
    commit('closeOverlay')
  },
  openOverlay({commit}) {
    commit('openOverlay')
  },
  selectEntry({commit}, entry) {
    commit('selectEntry', entry)
  },
  setAuthToken({commit}, token) {
    commit('setAuthToken', token)
  },
  setFlashMessage({commit}, message) {
    commit('setFlashMessage', message)
  },
  dismissFlashMessage({commit}) {
    commit('dismissFlashMessage')
  },
  setUser({commit}, user) {
    commit('setUser', user)
  },
  logout({commit}) {
    commit('logout')
  },
  getEntries({commit}) {
    commit('getEntries')
  }
}
