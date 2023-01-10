export default {
  setCollapsed (state, data) {
    state.collapsed = data
  },
  setUserInfo (state, data) {
    state.userInfo = Object.assign({}, { ...state.userInfo }, { ...data })
  },
  setProjectId (state, data) {
    state.project_id = data
  },
  setProjectName (state, data) {
    state.project_name = data
  },
  authId (state, data) {
    state.authId = data
  },
  setNavigation (state, data) {
    state.navigation = data
  },
  setHeaderNavigation (state, data) {
    state.headerNavigation = data
  },
  firstId (state, data) {
    state.firstId = data
  },
  secondId (state, data) {
    state.secondId = data
  }
}
