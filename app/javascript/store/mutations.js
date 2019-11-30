import axios from 'axios'

export const mutations = {
  toggleOverlay(state) {
    state.overlay = !state.overlay
  },
  closeOverlay(state) {
    state.overlay = false
    state.selectedEntry = null
  },
  openOverlay(state) {
    state.overlay = true
  },
  selectEntry(state, entry) {
    state.selectedEntry = entry
  },
  setAuthToken(state, token) {
    state.user.authToken = token
  },
  setFlashMessage(state, message) {
    state.flashMessage = {
      message: message.message,
      error: message.error || false,
      show: true
    }
  },
  dismissFlashMessage(state) {
    state.flashMessage.show = false
  },
  setUser(state, userData) {
    state.user = {
      ...userData.user,
      entries: userData.entries || [],
      authToken: userData.auth_token
    }
  },
  logout(state) {
    state.user.authToken = null
  },
  getEntries(state) {
    axios({
      method: 'post',
      url:'/api/v1/entries/all',
      headers: { Authorization: state.user.authToken },
      data: {
        user_id: state.user.id
      }
    })
    .then(response => {
      state.user.entries = response.data.entries
    })
    .catch(e => {
      setFlashMessage({ message: `Error fetching entries: ${e}`, error: true })
    })
    
  }
}
