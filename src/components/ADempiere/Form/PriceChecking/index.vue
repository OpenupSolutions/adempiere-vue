<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
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
  <div
    v-if="isLoaded"
    style="height: 100% !important;"
    @click="focusProductValue"
  >

    <img
      fit="contain"
      :src="backgroundForm"
      class="background-price-checking"
      style="z-index: 5;"
    >
    <el-container style="height: 100% !important;">
      <el-main>
        <el-form
          key="form-loaded"
          class="inquiry-form"
          label-position="top"
          label-width="10px"
          style="z-index: -1;"
          @submit.native.prevent="notSubmitForm"
        >
          <field
            v-for="(field) in fieldsList"
            id="ProductValue"
            ref="ProductValue"
            :key="field.columnName"
            :metadata-field="field"
            :v-model="field.value"
            class="product-value"
          />
        </el-form>

        <div v-if="!isEmptyValue(productPrice)" class="inquiry-product" style="z-index: 4;">
          <div class="product-description">
            <b> {{ productPrice.product.value }} {{ productPrice.productName }}</b>
            <br> {{ productPrice.productDescription }}
          </div>
          <el-row v-if="!isEmptyValue(productPrice)" :gutter="20">
            <el-col :span="24" style="padding-left: 0px; padding-right: 0%;">
              <div class="product-price-base">
                {{ $t('form.priceChecking.basePrice') }}
                <span class="amount">
                  {{ formatPrice(productPrice.priceBase, productPrice.currency.iSOCode) }}
                </span>
              </div>
              <br><br><br>

              <div class="product-tax">
                {{ productPrice.taxName }}
                <span class="amount">
                  {{ formatPrice(productPrice.taxAmt, productPrice.currency.iSOCode) }}
                </span>
              </div>
              <br><br><br>
              <div class="product-price amount">
                <span style="float: right;"> {{ formatPrice(productPrice.grandTotal, productPrice.currency.iSOCode) }} </span> <br>
                <span v-if="!isEmptyValue(currentPointOfSales.displayCurrency) && !isEmptyValue(convertionsList)"> {{ formatPrice(productPrice.grandTotal / converted, currentPointOfSales.displayCurrency.iso_code) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="inquiry-product" style="z-index: 4;">
          <el-row v-if="!messageError" :gutter="20">
            <el-col style="padding-left: 0px; padding-right: 0%;">
              <div class="product-price amount">
                {{ $t('form.priceChecking.productNotFound') }}
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="!isEmptyValue(productPrice) && !isEmptyValue(currentPointOfSales.displayCurrency) && !isEmptyValue(convertionsList)" class="inquiry-product" style="z-index: 4;">
          <el-row>
            <el-col>
              <div v-if="!isEmptyValue(currentConvertion)" class="rate-date">
                {{ $t('form.pos.collect.dayRate') }}: {{ formatConversionCurrenty(currentConvertion.divideRate) }} ~ ({{ formatPrice(1, productPrice.currency.iSOCode) }} = {{ formatPrice(currentConvertion.divideRate) }} {{ currentPointOfSales.displayCurrency.iso_code }})
              </div>
              <div v-else class="rate-date">
                {{ $t('form.pos.collect.noDayRate') }} {{ currentPointOfSales.displayCurrency.description }}
              </div>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="loading-panel"
  />
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldsList.js'
import { getProductPrice } from '@/api/ADempiere/form/price-checking.js'
import { formatPercent, formatPrice, formatDateToSend, formatQuantity } from '@/utils/ADempiere/valueFormat.js'
import { getImagePath } from '@/utils/ADempiere/resource.js'

export default {
  name: 'PriceChecking',
  mixins: [
    formMixin
  ],
  data() {
    return {
      messageError: true,
      fieldsList,
      productPrice: {},
      organizationBackground: '',
      currentImageOfProduct: '',
      search: 'sad',
      resul: '',
      backgroundForm: '',
      unsubscribe: () => {}
    }
  },
  computed: {
    organizationImagePath() {
      return this.$store.getters.corporateBrandingImage
    },
    defaultImage() {
      return require('@/image/ADempiere/priceChecking/no-image.jpg')
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    pointOfSalesList() {
      return this.$store.getters.posAttributes.pointOfSalesList
    },
    convertionsList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    currentConvertion() {
      if (this.isEmptyValue(this.currentPointOfSales.displayCurrency)) {
        return {}
      }
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(convert.currencyTo) && !this.isEmptyValue(this.currentPointOfSales.displayCurrency) && convert.currencyTo.id === this.currentPointOfSales.displayCurrency.id) {
          return convert
        }
      })
      if (convert) {
        return convert
      }
      return {}
    },
    converted() {
      if (!this.isEmptyValue(this.convertionsList)) {
        const convertion = this.convertionsList.find(convert => {
          if (!this.isEmptyValue(convert.currencyTo) && !this.isEmptyValue(this.currentPointOfSales.displayCurrency) && convert.currencyTo.id === this.currentPointOfSales.displayCurrency.id) {
            return convert
          }
        })
        if (!this.isEmptyValue(convertion)) {
          return convertion.divideRate
        }
      }
      return 1
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
  },
  mounted() {
    this.backgroundForm = this.defaultImage
    this.getImageFromSource(this.organizationImagePath)
    if (this.isEmptyValue(this.pointOfSalesList)) {
      this.$store.dispatch('listPointOfSalesFromServer')
    }
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatPercent,
    formatDateToSend,
    formatPrice,
    formatQuantity,
    focusProductValue() {
      if (!this.isEmptyValue(this.$refs.ProductValue[0])) {
        this.$refs.ProductValue[0].$children[0].$children[0].$children[1].$children[0].focus()
      }
    },
    getImageFromSource(fileName) {
      if (this.isEmptyValue(fileName)) {
        return this.defaultImage
      }
      const image = getImagePath({
        file: fileName,
        width: 900,
        height: 900
      })
      this.backgroundForm = image.uri
    },
    amountConvert() {
      if (!this.isEmptyValue(this.currentPointOfSales) && this.isEmptyValue(this.currentConvertion) && !this.isEmptyValue(this.currentPointOfSales.displayCurrency)) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: this.currentPointOfSales.displayCurrency.uuid,
          conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
        })
      }
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if ((mutation.type === 'currentPointOfSales') || (mutation.type === 'setListProductPrice') || (mutation.type === 'addFocusLost')) {
          this.focusProductValue()
        }
        if ((mutation.type === 'addActionKeyPerformed') && mutation.payload.columnName === 'ProductValue' && (this.productPrice.upc !== mutation.payload.value)) {
          // cleans all values except column name 'ProductValue'
          this.search = mutation.payload.value
          if (!this.isEmptyValue(this.search) && this.search.length >= 4) {
            getProductPrice({
              searchValue: mutation.payload.value,
              posUuid: this.currentPointOfSales.uuid,
              priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
              warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
            })
              .then(productPrice => {
                this.messageError = true
                const { product, taxRate, priceStandard: priceBase } = productPrice
                const { rate } = taxRate
                const { imageURL: image } = product

                this.productPrice = {
                  currency: productPrice.currency,
                  image,
                  grandTotal: this.getGrandTotal(priceBase, rate),
                  productName: product.name,
                  productDescription: product.help,
                  priceBase,
                  product,
                  priceStandard: productPrice.priceStandard,
                  priceList: productPrice.priceList,
                  priceLimit: productPrice.priceLimit,
                  taxRate: rate,
                  taxName: taxRate.name,
                  taxIndicator: taxRate.taxIndicator,
                  taxAmt: this.getTaxAmount(priceBase, rate),
                  upc: product.upc
                }
              })
              .catch(() => {
                this.messageError = false
                this.timeMessage()
                this.productPrice = {}
              })
              .finally(() => {
                this.amountConvert()
                this.$store.commit('updateValueOfField', {
                  containerUuid: this.containerUuid,
                  columnName: 'ProductValue',
                  value: ''
                })
                this.search = ''
                this.currentImageOfProduct = ''
                if (this.isEmptyValue(this.productPrice.image)) {
                  this.getImageFromSource(this.productPrice.image)
                }
              })
          }
        } else if ((mutation.type === 'updateValueOfField') && (mutation.payload.columnName === 'ProductValue') && !this.isEmptyValue(mutation.payload.value) && (this.productPrice.upc !== mutation.payload.value)) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            let value = mutation.payload.value
            if (typeof value[value.length - 1] === 'string') {
              value = mutation.payload.value.slice(0, -1)
            }
            getProductPrice({
              searchValue: mutation.payload.value,
              posUuid: this.currentPointOfSales.uuid,
              priceListUuid: this.currentPointOfSales.currentPriceList.uuid,
              warehouseUuid: this.currentPointOfSales.currentWarehouse.uuid
            })
              .then(productPrice => {
                this.messageError = true
                const { product, taxRate, priceStandard: priceBase } = productPrice
                const { rate } = taxRate
                const { imageURL: image } = product
                this.productPrice = {
                  currency: productPrice.currency,
                  image,
                  grandTotal: this.getGrandTotal(priceBase, rate),
                  productName: product.name,
                  productDescription: product.description,
                  priceBase,
                  product,
                  priceStandard: productPrice.priceStandard,
                  priceList: productPrice.priceList,
                  priceLimit: productPrice.priceLimit,
                  schemaCurrency: productPrice.schemaCurrency,
                  schemaPriceStandard: productPrice.schemaPriceStandard,
                  schemaPriceList: productPrice.schemaPriceList,
                  schemaPriceLimit: productPrice.schemaPriceLimit,
                  taxRate: rate,
                  taxName: taxRate.name,
                  taxIndicator: taxRate.taxIndicator,
                  taxAmt: this.getTaxAmount(priceBase, rate)
                }
              })
              .catch(() => {
                this.messageError = false
                this.timeMessage()
                this.productPrice = {}
              })
              .finally(() => {
                this.amountConvert()
                this.$store.commit('updateValueOfField', {
                  containerUuid: this.containerUuid,
                  columnName: 'ProductValue',
                  value: ''
                })
                this.search = ''
                this.currentImageOfProduct = ''
                if (this.isEmptyValue(this.productPrice.image)) {
                  this.getImageFromSource(this.productPrice.image)
                }
              })
          }, 500)
        }
        if (mutation.type === 'changeFormAttribute') {
          this.focusProductValue()
        }
      })
    },
    timeMessage() {
      setTimeout(() => {
        this.messageError = true
      }, 2000)
    },
    getTaxAmount(basePrice, taxRate) {
      if (this.isEmptyValue(basePrice) || this.isEmptyValue(taxRate)) {
        return 0
      }
      return (basePrice * taxRate) / 100
    },
    getGrandTotal(basePrice, taxRate) {
      if (this.isEmptyValue(basePrice)) {
        return 0
      }
      return basePrice + this.getTaxAmount(basePrice, taxRate)
    }
  }
}
</script>

<style lang="scss" scoped>
  .background-price-checking {
    width: 100%;
    height: 100%;
    float: inherit;
    background: white;
    // color: white;
    // opacity: 0.5;
  }

  .product-description {
    color: #32363a;
    font-size: 30px;
    float: right;
    padding-bottom: 1%;
    text-align: end;

  }
  .product-price-base, .product-tax {
    font-size: 30px;
    float: right;
  }
  .product-price {
    padding-top: 15px;
    font-size: 50px;
    float: right;
  }
  .rate-date {
    padding-top: 30%;
    font-size: 50px;
    float: right;
    color: black;
    font-weight: bold;
    text-align: end;
  }
  .inquiry-form {
    position: absolute;
    right: 5%;
    width: 100%;
    top: 10%;
    z-index: 0;
  }
  .inquiry-product {
    position: absolute;
    right: 10%;
    top: 33%;
    .amount {
      color: black;
      font-weight: bold;
    }
  }
</style>
<style lang="scss">
  .price-inquiry {
    input {
      color: #606266 !important;
      font-size: 100% !important;
    }
  }
  .product-value {
    float: right;
    padding-right: 0% !important;
    z-index: 0;
    .el-form-item__label {
      font-size: 15px !important;
      color: #000 !important;
    }
  }

  .el-aside {
    background: white;
    width: 60%;
    overflow: hidden;
  }

  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 0px !important;
  }
</style>
