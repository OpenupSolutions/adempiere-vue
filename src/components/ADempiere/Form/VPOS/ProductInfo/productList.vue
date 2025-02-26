<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <el-main
    v-shortkey="shortsKey"
    style="padding-top: 0px;"
    @shortkey.native="keyAction"
  >
    <el-form
      v-shortkey="shortsKey"
      label-position="top"
      label-width="10px"
      @shortkey.native="keyAction"
      @submit.native.prevent="notSubmitForm"
    >
      <el-form-item label="Código Producto">
        <el-input v-model="input" :placeholder="$t('quickAccess.searchWithEnter')" @input="searchProduct" />
      </el-form-item>
    </el-form>
    <el-table
      ref="listProducto"
      v-shortkey="shortsKey"
      v-loading="isLoadedServer"
      :data="localTableSearch(listWithPrice)"
      :empty-text="$t('quickAccess.searchWithEnter')"
      border
      fit
      height="450"
      highlight-current-row
      @row-click="selectProduct"
      @shortkey.native="keyAction"
    >
      <el-table-column
        prop="product.value"
        :label="$t('form.productInfo.code')"
      />
      <el-table-column
        prop="product.name"
        :label="$t('form.productInfo.name')"
      />
      <el-table-column
        prop="quantityOnHand"
        :label="$t('form.productInfo.quantityOnHand')"
        align="right"
      />
      <el-table-column
        :label="$t('form.productInfo.price')"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.pos.collect.convertedAmount')"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice(scope.row.schemaPriceStandard, scope.row.schemaCurrency.iSOCode) }}
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="productPrice.recordCount"
      :current-page="productPrice.pageNumber"
      :handle-change-page="handleChangePage"
    />
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-create-bp"
            icon="el-icon-close"
            @click="close"
          />
          <el-button
            type="primary"
            class="custom-button-create-bp"
            icon="el-icon-check"
            @click="addProductFromList"
          />
        </samp>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import CustomPagination from '@/components/ADempiere/Pagination'
import fieldsListProductPrice from './fieldsList.js'
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'ProductList',
  components: {
    CustomPagination
  },
  mixins: [
    formMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Products-Price-List',
          containerUuid: 'Products-Price-List'
        }
      }
    },
    isSelectable: {
      type: Boolean,
      default: true
    },
    popoverName: {
      type: String,
      default: 'isShowPopoverField'
    }
  },
  data() {
    return {
      defaultMaxPagination: 50,
      fieldsList: fieldsListProductPrice,
      isLoadedServer: false,
      isCustomForm: true,
      currentProduct: {},
      isSearchProduct: false,
      input: '',
      timeOut: null
    }
  },
  computed: {
    isShowProductsPriceList() {
      return this.$store.state['pointOfSales/listProductPrice'].productPrice[this.attribute]
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    productPrice() {
      return this.$store.getters.getProductPrice
    },
    listWithPrice() {
      const { productPricesList } = this.productPrice
      if (!this.isEmptyValue(productPricesList)) {
        return productPricesList
      }
      return []
    },
    shortsKey() {
      return {
        closeProductList: ['esc'],
        refreshList: ['f5']
      }
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.productPrice
      return (!isLoaded || isReload) // && this.isShowProductsPriceList
    },
    searchValue() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'ProductValue'
      })
    }
  },
  created() {
    this.$store.commit('setListProductPrice', {
      isLoaded: false
    })
    this.timeOut = setTimeout(() => {
      this.validatePos(this.currentPointOfSales)
    }, 3000)
  },
  methods: {
    formatPrice,
    localTableSearch(listWithPrice) {
      let filtersProduct = []
      if (!this.isEmptyValue(this.searchValue) && this.isSearchProduct) {
        filtersProduct = listWithPrice.filter(data => data.product.name.toLowerCase().includes(this.searchValue.toLowerCase()) || data.product.value.toLowerCase().includes(this.searchValue.toLowerCase()))
        if (!this.isEmptyValue(filtersProduct)) {
          this.isSearchProduct = true
          return filtersProduct
        }
        this.isLoadedServer = true
        if (this.isSearchProduct) {
          this.timeOut = setTimeout(() => {
            this.$store.dispatch('listProductPriceFromServer', {
              containerUuid: 'Products-Price-List',
              pageNumber: 1,
              searchValue: this.searchValue
            })
              .then(() => {
                const recordsList = this.listWithPrice

                if (this.isEmptyValue(recordsList)) {
                  this.$message({
                    message: this.$t('notifications.searchWithOutRecords'),
                    type: 'info',
                    showClose: true
                  })
                  this.isSearchProduct = false
                  this.isLoadedServer = false
                  return recordsList
                }
                this.isSearchProduct = false
                this.isLoadedServer = false
                return recordsList
              })
          }, 2000)
        }
      }
      return listWithPrice
    },
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          this.loadProductsPricesList()
          break

        case 'closeProductList':
          this.$store.commit('showListProductPrice', {
            attribute: this.popoverName,
            isShowed: false
          })
          break
      }
    },
    loadProductsPricesList() {
      this.$store.dispatch('listProductPriceFromServer', {})
    },
    /**
     * @param {number} newPage
     */
    handleChangePage(newPage) {
      this.$store.dispatch('setProductPicePageNumber', newPage)
      this.$store.dispatch('listProductPriceFromServer', {})
    },
    selectProduct(row) {
      this.currentProduct = row
    },
    close() {
      this.$store.commit('setShowProductList', false)
    },
    addProductFromList() {
      if (!this.isSelectable) {
        return
      }
      // TODO: Change this dispatch for set values with local methods, to delete subscripton
      this.$store.dispatch('notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: this.currentProduct.product.name
      })

      // close popover of list product price
      this.close()
      this.$store.commit('showListProductPrice', {
        attribute: this.popoverName,
        isShowed: false
      })
    },
    searchProduct(value) {
      clearTimeout(this.timeOut)
      this.timeOut = setTimeout(() => {
        this.isSearchProduct = true
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Products-Price-List',
          columnName: 'ProductValue',
          value: value
        })
      }, 500)
    },
    /**
     * @param {object} PointOfSales
     */
    validatePos(PointOfSales) {
      if (this.isEmptyValue(PointOfSales)) {
        const message = this.$t('notifications.errorPointOfSale')
        this.$store.commit('setListProductPrice', {
          isLoaded: true,
          productPricesList: []
        })
        this.$message({
          type: 'info',
          message,
          duration: 1500,
          showClose: true
        })
      }
    }
  }
}
</script>
