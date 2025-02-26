import Vue from 'vue'

const initStateUtils = {
  width: 0,
  height: 0,
  splitHeight: 50,
  splitHeightTop: 0,
  widthLayout: 0,
  tempShareLink: '',
  oldAction: undefined,
  reportType: '',
  isShowedTable: false,
  isShowedTabChildren: false,
  recordTable: 0,
  selectionProcess: [],
  isContainerInfo: false,
  documentAction: [],
  openRoute: {
    path: '',
    name: '',
    route: {},
    params: {},
    definedParameters: {},
    query: {},
    isReaded: false,
    isLoaded: false
  },
  splitWidthRight: 3,
  splitWidthLeft: 3,
  parametersProcessPos: [],
  updateOrder: false,
  updatePayment: false,
  createBusinessPartner: false,
  listBusinessPartner: false,
  copyShippingAddress: true,
  step: 0,
  updateCustomer: false,
  overdrawnInvoice: {
    visible: false
  },
  searchCompleteOrders: false,
  isNewOrder: false,
  showProductList: false,
  confirmDelivery: false,
  showConfirmDelivery: false,
  showFastConfirmDelivery: false,
  showAddNewAddress: false,
  showAddressUpdate: false
}

export default {
  state: initStateUtils,
  mutations: {
    setWidth(state, width) {
      state.width = width
    },
    setWidthLayout(state, width) {
      state.widthLayout = width
    },
    setHeigth(state, height) {
      state.height = height
    },
    setSplitHeight(state, splitHeight) {
      state.splitHeight = splitHeight
    },
    showMenuTable(state, isShowedTable) {
      state.isShowedTable = isShowedTable
    },
    showContainerInfo(state, isContainerInfo) {
      state.isContainerInfo = isContainerInfo
    },
    showMenuTabChildren(state, isShowedTabChildren) {
      state.isShowedTabChildren = isShowedTabChildren
    },
    setSplitHeightTop(state, splitHeightTop) {
      state.splitHeightTop = splitHeightTop
    },
    setProcessTable(state, recordTable) {
      state.recordTable = recordTable
    },
    setOrder(state, payload) {
      state.documentAction = payload
    },
    setProcessSelecetion(state, selectionProcess) {
      state.selectionProcess = selectionProcess
    },
    setTempShareLink(state, payload) {
      state.tempShareLink = payload
    },
    setReportTypeToShareLink(state, payload) {
      state.reportType = payload
    },
    setOpenRoute(state, payload) {
      state.openRoute = {
        ...state.openRoute,
        ...payload
      }
    },
    setReadRoute(state, payload) {
      Vue.set(state.openRoute, 'definedParameters', payload.parameters)
      Vue.set(state.openRoute, 'isLoaded', true)
    },
    resetStateUtils(state) {
      state = initStateUtils
    },
    setSplitWidthRight(state, splitWidthRight) {
      state.splitWidthRight = splitWidthRight
    },
    setSplitWidthLeft(state, splitWidthLeft) {
      state.splitWidthLeft = splitWidthLeft
    },
    parametersProcessPos(state, params) {
      state.parametersProcessPos = params
    },
    setUpdateOrder(state, order) {
      state.updateOrder = order
    },
    setUpdatePayment(state, payment) {
      state.updatePayment = payment
    },
    setStepCurrent(state, step) {
      state.step = step
    },
    popoverCreateBusinessPartner(state, createBusinessPartner) {
      state.createBusinessPartner = createBusinessPartner
    },
    popoverListBusinessPartner(state, payload) {
      state.listBusinessPartner = payload
    },
    popoverOverdrawnInvoice(state, payload) {
      state.overdrawnInvoice = payload
    },
    showUpdateCustomer(state, show) {
      state.updateCustomer = show
    },
    setShowFastCompleteOrders(state, show) {
      state.searchCompleteOrders = show
    },
    focusNewOrder(state, payload) {
      state.isNewOrder = payload
    },
    setCopyShippingAddress(state, payload) {
      state.copyShippingAddress = payload
    },
    setShowProductList(state, payload) {
      state.showProductList = payload
    },
    setConfirmDelivery(state, payload) {
      state.confirmDelivery = payload
    },
    setShowConfirmDelivery(state, payload) {
      state.showConfirmDelivery = payload
    },
    setShowFastConfirmDelivery(state, payload) {
      state.showFastConfirmDelivery = payload
    },
    setShowAddNewAddress(state, payload) {
      state.showAddNewAddress = payload
    },
    setShowAddressUpdate(state, payload) {
      state.showAddressUpdate = payload
    }
  },
  actions: {
    setWidth({ commit }, width) {
      commit('setWidth', width)
    },
    setWidthLayout({ commit }, width) {
      commit('setWidthLayout', width)
    },
    setHeight({ commit }, height) {
      commit('setHeigth', height)
    },
    showMenuTable({ commit }, isShowedTable) {
      commit('showMenuTable', isShowedTable)
    },
    showContainerInfo({ commit, state }, isContainerInfo) {
      commit('showContainerInfo', isContainerInfo)
    },
    showMenuTabChildren({ commit }, isShowedTabChildren) {
      commit('showMenuTabChildren', isShowedTabChildren)
    },
    setSplitHeight({ commit }, splitHeight) {
      commit('setSplitHeight', splitHeight)
    },
    setSplitHeightTop({ commit }, splitHeightTop) {
      commit('setSplitHeightTop', splitHeightTop)
    },
    setProcessTable({ commit }, recordTable) {
      commit('setProcessTable', recordTable)
    },
    setProcessSelect({ commit }, params) {
      commit('setProcessSelecetion', params)
    },
    setOpenRoute({ commit }, routeParameters) {
      commit('setOpenRoute', {
        ...routeParameters
      })
    },
    setReadRoute({ commit }, parameters) {
      commit('setReadRoute', parameters)
    },
    setTempShareLink({ commit }, parameters) {
      if (!parameters.href.includes(String(parameters.processId))) {
        commit('setTempShareLink', parameters.href)
      }
    },
    setReportTypeToShareLink({ commit }, value) {
      commit('setReportTypeToShareLink', value)
    },
    setOrder({ commit }, params) {
      commit('setOrder', params)
    },
    changeWidthRight({ commit }, newWidthRight) {
      commit('setSplitWidthRight', newWidthRight)
    },
    changeWidthLeft({ commit }, newWidthLeft) {
      commit('setSplitWidthLeft', newWidthLeft)
    },
    addParametersProcessPos({ commit }, params) {
      commit('parametersProcessPos', params)
    },
    updateOrderPos({ commit }, params) {
      commit('setUpdateOrder', params)
    },
    updatePaymentPos({ commit }, params) {
      commit('setUpdatePayment', params)
    },
    changePopover({ commit }, params) {
      commit('popoverCreateBusinessPartner', params)
    },
    changePopoverListBusinessPartner({ commit }, params) {
      commit('popoverListBusinessPartner', params)
    },
    changePopoverOverdrawnInvoice({ commit }, { attributePin, visible }) {
      const overdrawn = {
        attributePin,
        visible
      }
      commit('popoverOverdrawnInvoice', overdrawn)
    },
    changeShowUpdateCustomer({ commit }, show) {
      commit('showUpdateCustomer', show)
    },
    changeFocusNewOrder({ commit }, params) {
      commit('focusNewOrder', params)
    },
    changeCopyShippingAddress({ commit }, params) {
      commit('setCopyShippingAddress', params)
    }
  },
  getters: {
    getWidth: (state) => {
      return state.width
    },
    getProcessSelect: (state) => {
      return state.selectionProcess
    },
    getWidthLayout: (state, rootGetters) => {
      if (rootGetters.toggleSideBar) {
        return state.width - 250
      }
      return state.width - 54
    },
    getHeigth: (state) => {
      return state.height
    },
    getSplitHeightTop: (state) => {
      return state.getSplitHeightTop
    },
    getRecordUuidMenu: (state) => {
      return state.recordTable
    },
    getShowContextMenuTable: (state) => {
      const menu = state.isShowedTable.isShowedTable
      return menu
    },
    getShowContainerInfo: (state) => {
      const showInfo = state.isContainerInfo
      return showInfo
    },
    getShowContextMenuTabChildren: (state) => {
      const menu = state.isShowedTabChildren.isShowedTabChildren
      return menu
    },
    getSplitHeight: (state) => {
      const split = state.splitHeight
      if (split !== 50) {
        return split.splitHeight
      }
      return 50
    },
    getTempShareLink: (state) => {
      return state.tempShareLink
    },
    getReportType: (state) => {
      return state.reportType
    },
    getIsLoadedOpenRoute: (state) => {
      return state.openRoute.isLoaded
    },
    getIsReadedOpenRoute: (state) => {
      return state.openRoute.isReaded
    },
    getOrders: (state) => {
      return state.documentAction
    },
    getWidthRight: (state) => {
      return state.splitWidthRight
    },
    getWidthLeft: (state) => {
      return state.splitWidthLeft
    },
    getPosParameters: (state) => {
      return state.parametersProcessPos
    },
    getUpdateOrderPos: (state) => {
      return state.updateOrder
    },
    getUpdatePaymentPos: (state) => {
      return state.updatePayment
    },
    getPopoverCreateBusinessParnet: (state) => {
      return state.createBusinessPartner
    },
    getPopoverListBusinessParnet: (state) => {
      return state.listBusinessPartner
    },
    getCopyShippingAddress: (state) => {
      return state.copyShippingAddress
    },
    getStepCurrent: (state) => {
      return state.step
    },
    getOverdrawnInvoice: (state) => {
      return state.overdrawnInvoice
    },
    getShowUpdateCustomer: (state) => {
      return state.updateCustomer
    },
    getFocusNewOrder: (state) => {
      return state.isNewOrder
    },
    getShowProductList: (state) => {
      return state.showProductList
    },
    getConfirmDelivery: (state) => {
      return state.confirmDelivery
    },
    getShowConfirmDelivery: (state) => {
      return state.showConfirmDelivery
    },
    showConfirmDelivery: (state) => {
      return state.showFastConfirmDelivery
    },
    getSearchCompleteOrderss: (state) => {
      return state.searchCompleteOrders
    },
    getShowAddNewAddress: (state) => {
      return state.showAddNewAddress
    },
    getShowAddressUpdate: (state) => {
      return state.showAddressUpdate
    }
  }
}
