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
    v-shortkey="popoverListBusinessParnet ? {close: ['esc']} : {}"
    @shortkey.native="actionList"
  >
    <el-collapse v-model="activeAccordion" accordion>
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}
          <template v-if="!isEmptyValue(parentMetadata.name)">
            ({{ parentMetadata.name }})
          </template>
          <!-- <i class="el-icon-circle-plus" /> -->
        </template>
        <el-form
          label-position="top"
          size="small"
        >
          <el-row>
            <field
              v-for="(field) in metadataList"
              :key="field.columnName"
              :metadata-field="field"
            />
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-table
      ref="businesPartnerTable"
      v-loading="isLoadedList"
      :data="businessPartnersList"
      highlight-current-row
      border
      fit
      height="350"
      @current-change="handleCurrentChange"
    >
      <p slot="empty" style="width: 100%;">
        {{ $t('businessPartner.emptyBusinessPartner') }}
      </p>
      <el-table-column
        :label="$t('form.productInfo.code')"
        prop="value"
        width="100"
      />
      <el-table-column
        prop="name"
        :label="$t('form.productInfo.name')"
      />
      <el-table-column
        :label="$t('form.productInfo.lastName')"
        prop="lastName"
      />
      <el-table-column
        :label="$t('form.pos.order.BusinessPartnerCreate.taxId')"
        prop="taxId"
        align="right"
      />
    </el-table>
    <custom-pagination
      :total="businessParners.recordCount"
      :current-page="1"
      :handle-change-page="handleChangePage"
    />
    <el-row :gutter="24">
      <el-col :span="24">
        <samp style="float: right; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-create-bp"
            icon="el-icon-close"
            @click="closeListCustomer"
          />
          <el-button
            type="primary"
            class="custom-button-create-bp"
            icon="el-icon-check"
            :disabled="isDisabled"
            @click="changeCustomer"
          />
        </samp>
      </el-col>
    </el-row>
    <!-- -->
  </el-main>
</template>

<script>
import CustomPagination from '@/components/ADempiere/Pagination'
import {
  // createFieldFromDefinition,
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import fieldsList from './fieldsListSearch.js'
import BParterMixin from './mixinBusinessPartner.js'
import Field from '@/components/ADempiere/Field'

export default {
  name: 'BusinessPartnersList',
  components: {
    CustomPagination,
    Field
  },
  mixins: [
    // formMixin,
    BParterMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Business-Partner-List',
          containerUuid: 'Business-Partner-List'
        }
      }
    },
    showsPopovers: {
      type: Object,
      default: () => {
        return {
          isShowCreate: false,
          isShowList: false
        }
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    showField: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoadedRecords: false,
      activeAccordion: 'query-criteria',
      fieldsList,
      selectCustomer: {},
      metadataList: [],
      isLoadedList: false,
      unsubscribe: () => {}
    }
  },
  computed: {
    businessParners() {
      return this.$store.getters.getBusinessPartner
    },
    businessPartnersList() {
      return this.$store.getters.getBusinessPartnersList
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.businessParners
      return (!isLoaded || isReload) && this.showsPopovers.isShowList
    },
    popoverListBusinessParnet() {
      return this.$store.getters.getPopoverListBusinessParnet
    }
  },
  watch: {
    isReadyFromGetData(isToLoad) {
      if (isToLoad) {
        this.searchBPartnerList({})
      }
    },
    showField(value) {
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()

    if (this.isReadyFromGetData) {
      this.searchBPartnerList({})
    }
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    createFieldFromDictionary,
    actionList(event) {
      this.$store.dispatch('changePopoverListBusinessPartner', false)
    },
    handleCurrentChange(row) {
      this.selectCustomer = row
    },
    changeCustomer() {
      if (!this.isEmptyValue(this.selectCustomer)) {
        this.setBusinessPartner(this.selectCustomer)
        this.closeListCustomer()
      }
    },
    closeListCustomer() {
      this.$store.dispatch('changePopoverListBusinessPartner', false)
    },
    handleChangePage(newPage) {
      this.$store.dispatch('setBPartnerPageNumber', newPage)
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField' &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          const values = this.$store.getters.getValuesView({
            containerUuid: mutation.payload.containerUuid,
            format: 'object'
          })
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.searchBPartnerList(values)
          }, 1000)
        }
      })
    },
    searchBPartnerList(values, isConvert = true) {
      if (isConvert && !this.isEmptyValue(values)) {
        values = this.convertValuesToSend(values)
      }
      this.isLoadedList = true
      return this.$store.dispatch('listBPartnerFromServer', values)
        .then(response => {
          if (this.isEmptyValue(response)) {
            this.$message({
              type: 'warning',
              showClose: true,
              message: this.$t('businessPartner.notFound')
            })
          }
          return response
        })
        .finally(() => {
          this.isLoadedList = false
          this.isLoadedRecords = true
        })
    },
    setFieldsList() {
      const list = []
      // Product Code
      this.fieldsList.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(response => {
            const data = response
            list.push({
              ...data,
              containerUuid: 'Business-Partner-List'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = list
    }
  }
}
</script>
<style>
.el-table__empty-text {
  line-height: 60px;
  width: 100%;
  color: #909399;
}
</style>
