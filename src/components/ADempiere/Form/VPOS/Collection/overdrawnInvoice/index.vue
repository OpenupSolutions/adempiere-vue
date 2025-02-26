<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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
  <div>
    <el-dialog
      v-shortkey="showDialogo ? {close: ['esc']} : {}"
      :title="$t('form.pos.collect.overdrawnInvoice.title')"
      :visible.sync="showDialogo"
      :before-close="close"
      width="85%"
      @shortkey.native="actionOverdrawnInvoice"
      @close="close"
    >
      <div v-if="caseOrder === 1">
        <el-form>
          <el-form-item>
            <el-radio v-model="option" :label="1"> {{ $t('form.pos.collect.overdrawnInvoice.returned') }} {{ formatPrice(change, currency.iSOCode) }} </el-radio>
            <el-radio v-model="option" :label="3"> {{ $t('form.pos.collect.overdrawnInvoice.returnMoney') }}</el-radio>
            <el-radio v-model="option" :label="4"> {{ $t('form.pos.collect.overdrawnInvoice.adjustDocument') }}</el-radio>
          </el-form-item>
        </el-form>
        <el-card v-if="option === 1" class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="isEmptyValue(selectionTypeRefund)">{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
            <template v-else>
              <span>
                {{ selectionTypeRefund.name }}
              </span>
              <span style="float: right;text-align: end">
                <b>
                  {{ $t('form.pos.collect.overdrawnInvoice.dailyLimit') }}: {{ formatPrice(maximumDailyRefundAllowed, refundReferenceCurrency) }}
                  {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice(maximumRefundAllowed, refundReferenceCurrency) }}
                </b>
              </span>
            </template>
          </div>
          <div class="text item">
            <span v-if="isEmptyValue(paymentTypeListRefund)">
              <el-empty :image-size="200">
                <template slot="description">
                  <p style="text-align: center;font-size: 20px;"> {{ $t('form.pos.collect.overdrawnInvoice.emptyListPayment') }} </p>
                </template>
              </el-empty>
            </span>
            <el-row v-else :gutter="24">
              <el-col v-for="(payment, index) in paymentTypeListRefund" :key="index" :span="6">
                <div @click="selectPayment(payment)">
                  <el-card
                    v-if="isEmptyValue(selectionTypeRefund) || selectionTypeRefund.tender_type === 'X'"
                    shadow="never"
                    class="custom-card"
                    :body-style="{ padding: '10px' }"
                    :style="selectionTypeRefund.name == payment.name ? 'background-color: #eaf5fe;border: 1px solid #36a3f7;' : ''"
                  >
                    <div slot="header" class="clearfix" style="text-align: center;">
                      <span>
                        <b>{{ payment.name }}</b> <br>
                      </span>
                    </div>
                    <div class="text item">
                      <el-image
                        :src="imageCard(payment.tender_type)"
                        tyle="width: 100px; height: 100px"
                        fit="contain"
                      />
                    </div>
                    <div v-if="selectionTypeRefund.uuid === payment.uuid" class="text item">
                      <p class="total" style="padding-left: 2%;">
                        <b class="order-info">
                          {{ $t('form.pos.collect.change') }} : {{ formatPrice(change / dayRate.divideRate, refundReferenceCurrency) }}
                        </b>
                        <b class="order-info" style="float: right;padding-right: 2%;">
                          {{ $t('form.pos.collect.Currency') }}  : {{ refundReferenceCurrency }}
                        </b>
                      </p>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="!isEmptyValue(selectionTypeRefund)" class="text item">
            <component
              :is="componentRender"
              :change="change"
              :type-refund="selectionTypeRefund"
              :default-currency="defaultReferenceCurrency"
            />
          </div>
        </el-card>
      </div>
      <div>
        <el-card v-if="option === 2" class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
          </div>
          <div class="text item">
            <el-form
              label-position="top"
              label-width="10px"
            >
              <el-row>
                <el-col
                  v-for="field in primaryFieldsList"
                  :key="field.sequence"
                  :span="8"
                >
                  <field-definition
                    v-if="field.sequence < 3"
                    :key="field.columnName"
                    :metadata-field="field"
                  />
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
        <el-card v-if="option === 3" class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="isEmptyValue(selectionTypeRefund)">{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
            <template v-else>
              <span>
                {{ selectionTypeRefund.name }}
              </span>
              <span style="float: right;text-align: end">
                <b>
                  {{ $t('form.pos.collect.overdrawnInvoice.dailyLimit') }}: {{ formatPrice(maximumDailyRefundAllowed, refundReferenceCurrency) }}
                  {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice(maximumRefundAllowed, refundReferenceCurrency) }}
                </b>
              </span>
            </template>
          </div>
          <div class="text item">
            <span v-if="isEmptyValue(paymentTypeList)">
              <el-empty :image-size="200">
                <template slot="description">
                  <p style="text-align: center;font-size: 20px;"> {{ $t('form.pos.collect.overdrawnInvoice.emptyListPayment') }} </p>
                </template>
              </el-empty>
            </span>
            <el-row v-else :gutter="24">
              <el-col v-for="(payment, index) in paymentTypeList" :key="index" :span="6">
                <div @click="selectPayment(payment)">
                  <el-card
                    v-if="isEmptyValue(selectionTypeRefund) || selectionTypeRefund.tender_type === 'X'"
                    shadow="never"
                    class="custom-card"
                    :style="selectionTypeRefund.name == payment.name ? 'background-color: #eaf5fe;border: 1px solid #36a3f7;' : ''"
                    :body-style="{ padding: '10px' }"
                  >
                    <div slot="header" class="clearfix" style="text-align: center;">
                      <span>
                        <b>{{ payment.name }}</b> <br>
                      </span>
                    </div>
                    <div class="text item">
                      <el-image
                        :src="imageCard(payment.tender_type)"
                        tyle="width: 100px; height: 100px"
                        fit="contain"
                      />
                    </div>
                    <div v-if="selectionTypeRefund.uuid === payment.uuid" class="text item">
                      <p class="total" style="padding-left: 2%;">
                        <b class="order-info">
                          {{ $t('form.pos.collect.change') }} : {{ formatPrice(change / dayRate.divideRate, refundReferenceCurrency) }}
                        </b>
                        <b class="order-info" style="float: right;padding-right: 2%;">
                          {{ $t('form.pos.collect.Currency') }}  : {{ refundReferenceCurrency }}
                        </b>
                      </p>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="!isEmptyValue(selectionTypeRefund)" class="text item">
            <component
              :is="componentRender"
              :change="change"
              :type-refund="selectionTypeRefund"
              :default-currency="defaultReferenceCurrency"
            />
          </div>
        </el-card>
      </div>
      <div v-if="caseOrder === 2">
        <el-card>
          <div slot="header" class="clearfix">
            <span> {{ $t('form.pos.collect.overdrawnInvoice.below') }} </span>
          </div>
          <el-form label-width="120px">
            <el-form-item>
              <p>
                <b> {{ $t('form.pos.collect.orderTotal') }} </b> {{ formatPrice(totalOrder, currency.iSOCode) }}
                <el-divider direction="vertical" />
                <b> {{ $t('form.pos.collect.totalInvoiced') }} </b> {{ formatPrice(pay, currency.iSOCode) }}
                <el-divider direction="vertical" />
                <b> {{ $t('form.pos.collect.pending') }} </b> {{ formatPrice(pending, currency.iSOCode) }}
              </p>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="caseOrder === 1"
          type="info"
          class="custom-button-create-bp"
          icon="el-icon-back"
          @click="selectionTypeRefund = {}"
        />
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
          @click="addRefund"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatPrice, formatDateToSend } from '@/utils/ADempiere/valueFormat.js'
import formMixin from '@/components/ADempiere/Form/formMixin'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import fieldsListOverdrawnInvoice from './fieldsListOverdrawnInvoice.js'
import { overdrawnInvoice } from '@/api/ADempiere/form/point-of-sales.js'
import { processOrder } from '@/api/ADempiere/form/point-of-sales.js'
import typeRefund from './typeRefund/index.vue'

export default {
  name: 'OverdrawnInvoice',
  components: {
    typeRefund
  },
  mixins: [
    formMixin,
    posMixin
  ],
  props: {
    change: {
      type: Number,
      default: 0
    },
    pay: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    totalOrder: {
      type: Number,
      default: 0
    },
    currency: {
      type: Object,
      default: undefined
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'OverdrawnInvoice',
          containerUuid: 'OverdrawnInvoice'
        }
      }
    }
  },
  data() {
    return {
      option: 1,
      optionTypePay: 0,
      selectionTypeRefund: {},
      fieldsList: fieldsListOverdrawnInvoice,
      currentFieldCurrency: '',
      currentPaymentType: ''
    }
  },
  computed: {
    componentRender() {
      let typePay
      switch (this.selectionTypeRefund.tender_type) {
        case 'P':
          typePay = () => import('./paymentTypeChange/MobilePayment/index')
          break
        case 'X':
          typePay = () => import('./paymentTypeChange/Cash/index.vue')
          break
        case 'A':
        case 'D':
          typePay = () => import('./paymentTypeChange/ACH/index')
          break
        case 'M':
          typePay = () => import('./paymentTypeChange/GiftCards/index.vue')
          break
        case 'Z':
          typePay = () => import('./paymentTypeChange/Zelle/index.vue')
          break
      }
      return typePay
    },
    renderComponentContainer() {
      let container
      switch (this.selectionTypeRefund.tender_type) {
        case 'P':
          container = 'MobilePayment'
          break
        case 'A':
        case 'D':
          container = 'ACH'
          break
        case 'X':
          container = 'Cash'
          break
        case 'M':
          container = 'GiftCards'
          break
        case 'Z':
          container = 'Zelle'
          break
      }
      return container
    },
    showDialogo() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.show
    },
    caseOrder() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.type
    },
    maximumRefundAllowed() {
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.maximum_refund_allowed) && this.selectionTypeRefund.maximum_refund_allowed > 0) {
        return this.selectionTypeRefund.maximum_refund_allowed
      }
      return this.$store.getters.posAttributes.currentPointOfSales.maximumRefundAllowed
    },
    maximumDailyRefundAllowed() {
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.maximum_daily_refund_allowed) && this.selectionTypeRefund.maximum_daily_refund_allowed > 0) {
        return this.selectionTypeRefund.maximum_daily_refund_allowed
      }
      return this.$store.getters.posAttributes.currentPointOfSales.maximumDailyRefundAllowed
    },
    refundReferenceCurrency() {
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.refund_reference_currency)) {
        return this.selectionTypeRefund.refund_reference_currency.iso_code
      }
      if (this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency)) {
        return ''
      }
      return this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency.iso_code
    },
    defaultReferenceCurrency() {
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.refund_reference_currency)) {
        return this.selectionTypeRefund.refund_reference_currency
      }
      if (this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency)) {
        return {}
      }
      return this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency
    },
    isoCode() {
      return this.$store.getters.posAttributes.currentPointOfSales.displayCurrency.iso_code
    },
    displayeCurrency() {
      const tenderType = this.$store.getters.getValueOfField({
        containerUuid: 'OverdrawnInvoice',
        columnName: 'TenderType'
      })
      if (tenderType === 'D') {
        return true
      }
      return false
    },
    primaryFieldsList() {
      return this.fieldsList.filter(field => field.sequence <= 2)
    },
    hiddenFieldsList() {
      return this.fieldsList.filter(field => field.sequence >= 3)
    },
    listCurrency() {
      return this.$store.getters.getCurrenciesList
    },
    emptyFieldGiftCard() {
      const empty = this.fieldsList.filter(field => {
        if (field.sequence < 3 && this.isEmptyValue(
          this.$store.getters.getValueOfField({
            containerUuid: 'OverdrawnInvoice',
            columnName: field.columnName
          })
        )) {
          return field
        }
      })
      return empty.map(empty => empty.name)
    },
    emptyMandatoryFields() {
      return this.$store.getters.getFieldsListEmptyMandatory({ containerUuid: 'OverdrawnInvoice', formatReturn: 'name' })
    },
    paymentTypeList() {
      return this.$store.getters.getPaymentTypeList.filter(type => type.is_allowed_to_refund_open)
    },
    paymentTypeListRefund() {
      return this.$store.getters.getPaymentTypeList.filter(type => {
        if (type.is_allowed_to_refund) {
          return type
        }
      })
    },
    searchRefundCurrency() {
      if (this.isEmptyValue(this.selectionTypeRefund.refund_reference_currency)) {
        return {}
      }
      const currency = this.convertionsList.filter(type => {
        if (!this.isEmptyValue(type.currencyTo) && type.currencyTo.id === this.selectionTypeRefund.refund_reference_currency.id || this.selectionTypeRefund.refund_reference_currency.id === this.currentPointOfSales.priceList.currency.id) {
          return type
        }
      })
      if (!this.isEmptyValue(currency)) {
        return currency
      }
      return {}
    },
    convertionsList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
    refundLoaded() {
      return this.$store.getters.getRefundLoaded
    },
    dayRate() {
      const currency = this.listCurrency.find(currency => currency.iso_code === this.defaultReferenceCurrency.iso_code)
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(currency) && !this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
          return convert
        }
      })
      if (!this.isEmptyValue(convert)) {
        return convert
      }
      return {
        currencyTo: this.currentPointOfSales.currentPriceList.currency,
        divideRate: 1,
        iSOCode: this.currentPointOfSales.currentPriceList.currency.iSOCode
      }
    }
  },
  watch: {
    searchRefundCurrency(value) {
      if (this.isEmptyValue(value) && this.showDialogo) {
        this.findRefundCurrencyConversion(this.selectionTypeRefund.refund_reference_currency)
      }
    },
    option(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.renderComponentContainer,
        columnName: 'PayAmt',
        value: this.change
      })
      this.selectionTypeRefund = {}
      if (value === 1 && !this.isEmptyValue(this.paymentTypeListRefund)) {
        this.selectPayment(this.paymentTypeListRefund[0])
      }
      if (value === 3 && !this.isEmptyValue(this.paymentTypeList)) {
        this.selectPayment(this.paymentTypeList[0])
      }
    },
    showDialogo(value) {
      if (value) {
        if (this.option === 1 && !this.isEmptyValue(this.paymentTypeListRefund)) {
          this.selectPayment(this.paymentTypeListRefund[0])
        }
      }
    },
    selectionTypeRefund(value) {
      if (value.tender_type === 'D') {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'ACH',
          columnName: 'IsACH', // this.parentMetadata.columnName,
          value: true
        })
      }
    }
  },
  mounted() {
    this.selectionTypeRefund = {}
    if (this.option === 1 && !this.isEmptyValue(this.paymentTypeListRefund)) {
      this.selectPayment(this.paymentTypeListRefund[0])
    }
  },
  methods: {
    formatPrice,
    formatDateToSend,
    actionOverdrawnInvoice(commands) {
      if (commands.srcKey === 'close') {
        this.close()
      }
    },
    imageCard(typeRefund) {
      let image
      switch (typeRefund) {
        case 'D':
          image = 'MobilePayment.jpg'
          break
        case 'P':
          image = 'Mobile.jpg'
          break
        case 'X':
          image = 'Cash.jpg'
          break
        case 'A':
          image = 'ACH.jpg'
          break
        case 'M':
          image = 'GiftCard.jpg'
          break
        case 'Z':
          image = 'Zelle.jpg'
          break
        default:
          image = 'Default.jpg'
          break
      }
      return require('@/image/ADempiere/pos/typePayment/' + image)
    },
    selectPayment(payment) {
      this.selectionTypeRefund = payment
      this.$store.commit('updateValueOfField', {
        containerUuid: this.renderComponentContainer,
        columnName: 'PayAmt',
        value: this.change
      })
    },
    addRefund() {
      const values = this.$store.getters.getValuesView({
        containerUuid: this.renderComponentContainer,
        format: 'object'
      })
      const customer = {
        customerAccount: values,
        currencyUuid: this.$store.getters.getCurrencyRedund.uuid,
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        tenderTypeCode: this.selectionTypeRefund.tender_type
      }
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.currentOrder.uuid
      const payments = this.currentOrder.listPayments.payments
      const emptyMandatoryFields = this.$store.getters.getFieldsListEmptyMandatory({ containerUuid: this.renderComponentContainer, formatReturn: 'name' })
      if (this.caseOrder === 1 && (!this.isEmptyValue(emptyMandatoryFields) || this.isEmptyValue(this.defaultReferenceCurrency.uuid))) {
        this.isEmptyValue(this.$store.getters.getCurrencyRedund.uuid) ? emptyMandatoryFields.push(this.$t('form.pos.collect.Currency')) : emptyMandatoryFields
        if (this.option !== 4) {
          this.$message({
            type: 'warning',
            message: this.$t('notifications.mandatoryFieldMissing') + emptyMandatoryFields,
            duration: 1500,
            showClose: true
          })
          return
        }
      }
      Object.keys(values).forEach(element => {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.renderComponentContainer,
          columnName: element,
          value: undefined
        })
      })
      if (this.option === 4) {
        this.completePreparedOrder(posUuid, orderUuid, payments)
        this.$store.commit('dialogoInvoce', { show: false, success: true })
        return
      }
      this.$store.dispatch('addRefundLoaded', values)
      if (this.caseOrder === 2) {
        this.success()
        return
      }
      this.$store.dispatch('addCreateCustomerAccount', {
        posUuid,
        customer,
        orderUuid,
        bankUuid: customer.C_Bank_ID_UUID,
        amount: this.round(this.change / this.dayRate.divideRate, this.defaultReferenceCurrency.standard_precision),
        tenderTypeCode: this.selectionTypeRefund.tender_type,
        paymentMethodUuid: this.selectionTypeRefund.uuid,
        currencyUuid: this.defaultReferenceCurrency.uuid
      })
        .then(response => {
          this.success()
        })
    },
    success() {
      const customerDetails = []
      this.fieldsList.forEach(element => {
        const value = this.$store.getters.getValueOfField({
          containerUuid: 'OverdrawnInvoice',
          columnName: element.columnName
        })
        customerDetails.push({
          label: element.columnName,
          value
        })
      })
      this.optionSelected({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        customerDetails,
        payments: this.currentOrder.listPayments.payments
      })
    },
    close() {
      this.selectionTypeRefund = {}
      this.$store.commit('dialogoInvoce', { show: false })
    },
    changeCurrency(value) {
      this.currentFieldCurrency = value
    },
    changePaymentType(value) {
      this.$store.commit('currentTenderChange', value)
      this.currentPaymentType = value
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'TenderType',
        value: value
      })
    },
    optionSelected({ posUuid, orderUuid, customerDetails, payments }) {
      switch (this.option) {
        case 1:
          this.completePreparedOrder(posUuid, orderUuid, payments)
          this.$store.commit('dialogoInvoce', { show: false, success: true })
          break
        case 2:
          this.completePreparedOrder(posUuid, orderUuid, payments)
          this.$store.commit('dialogoInvoce', { show: false, success: true })
          break
        case 3:
          if (!this.isEmptyValue(this.refundLoaded)) {
            const values = this.$store.getters.getValuesView({
              containerUuid: this.renderComponentContainer,
              format: 'object'
            })
            const customer = {
              customerAccount: values,
              currencyUuid: this.$store.getters.getCurrencyRedund.uuid,
              orderUuid: this.currentOrder.uuid,
              posUuid: this.currentPointOfSales.uuid,
              tenderTypeCode: this.selectionTypeRefund.tender_type
            }
            this.$store.dispatch('sendCreateCustomerAccount', this.$store.getters.getAddRefund)
            if (this.selectionTypeRefund.is_pos_required_pin || this.maximumRefundAllowed <= (this.change / this.dayRate.divideRate)) {
              const attributePin = {
                posUuid,
                orderUuid,
                customer,
                payments,
                typeRefund: this.option,
                action: 'openBalanceInvoice',
                type: 'actionPos',
                label: this.$t('form.pos.pinMessage.invoiceOpen')
              }
              this.visible = true
              this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
            } else {
              this.$store.dispatch('sendCreateCustomerAccount', this.$store.getters.getAddRefund)
                .then(response => {
                  if (response.type === 'success') {
                    // this.completePreparedOrder(posUuid, orderUuid, payments)
                    overdrawnInvoice({
                      posUuid,
                      orderUuid,
                      createPayments: !this.isEmptyValue(this.currentOrder.listPayments.payments),
                      payments: this.currentOrder.listPayments.payments,
                      customerDetails,
                      option: this.option
                    })
                      .then(response => {
                        if (response.type === 'success') {
                          this.completePreparedOrder(posUuid, orderUuid, payments)
                        }
                        this.$store.dispatch('reloadOrder', response.uuid)
                        this.$message({
                          type: 'success',
                          message: this.$t('notifications.completed'),
                          showClose: true
                        })
                      })
                    this.$store.commit('dialogoInvoce', { show: false, success: true })
                  }
                })
            }
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('form.pos.collect.overdrawnInvoice.addPayment'),
              showClose: true
            })
            return
          }
          break
        case 4:
          this.completePreparedOrder(posUuid, orderUuid, payments)
          this.$store.commit('dialogoInvoce', { show: false, success: true })
          break
        default:
          if (this.selectionTypeRefund.is_pos_required_pin || this.maximumRefundAllowed <= (this.change / this.dayRate.divideRate)) {
            const attributePin = {
              posUuid,
              orderUuid,
              payments,
              typeRefund: this.option,
              action: 'openBalanceInvoice',
              type: 'actionPos',
              label: this.$t('form.pos.pinMessage.invoiceOpen')
            }
            this.visible = true
            this.$store.dispatch('sendCreateCustomerAccount', this.$store.getters.getAddRefund)
            this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          } else {
            this.$store.dispatch('sendCreateCustomerAccount', this.$store.getters.getAddRefund)
              .then(response => {
                if (response.type === 'success') {
                  this.completePreparedOrder(posUuid, orderUuid, payments)
                }
              })
            this.$store.commit('dialogoInvoce', { show: false, success: true })
          }
          break
      }
      this.selectionTypeRefund = {}
    },
    completePreparedOrder(posUuid, orderUuid, payments) {
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      processOrder({
        posUuid,
        orderUuid,
        createPayments: !this.isEmptyValue(payments),
        payments: payments
      })
        .then(response => {
          this.$store.dispatch('reloadOrder', response.uuid)
          this.$message({
            type: 'success',
            message: this.$t('notifications.completed'),
            showClose: true
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$store.dispatch('updateOrderPos', false)
          this.$store.dispatch('updatePaymentPos', false)
        })
    },
    findRefundCurrencyConversion(currency) {
      if (!this.isEmptyValue(currency)) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: currency.uuid,
          conversionDate: this.formatDateToSend(this.currentPointOfSales.currentOrder.dateOrdered)
        })
      }
    }
  }
}
</script>

<style scoped>
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
    background: #dae6f32e;
  }
  .el-image {
    display: inline-block;
    overflow: hidden;
  }
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgb(245, 247, 250);
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  .bottom {
    margin-top: 0px!important;
    line-height: 1px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
    height: 9vh;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-header {
    background: 'white';
    color: #333;
    line-height: 10px;
  }
  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
</style>
