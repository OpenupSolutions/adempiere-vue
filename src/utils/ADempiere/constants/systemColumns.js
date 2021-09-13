// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

export const CLIENT = 'AD_Client_ID'

export const ORGANIZATION = 'AD_Org_ID'

export const ACTIVE = 'IsActive'

export const PROCESSING = 'Processing'

export const PROCESSED = 'Processed'

/**
 * Log columns list into table
 * Manages with user session
 */
export const LOG_COLUMNS_NAME_LIST = [
  'Created',
  'CreatedBy',
  'Updated',
  'UpdatedBy'
]

/**
 * Columns list into standard table
 */
export const STANDARD_COLUMNS_NAME_LIST = [
  ...LOG_COLUMNS_NAME_LIST,
  // Table Name '_ID'
  CLIENT,
  ORGANIZATION,
  ACTIVE,
  'UUID'
]

/**
 * Columns list into document table
 */
export const DOCUMENT_COLUMNS_NAME_LIST = [
  ...STANDARD_COLUMNS_NAME_LIST,
  'C_DocType_ID',
  'DateDoc',
  'Description',
  'DocAction',
  'DocStatus',
  'DocumentNo',
  'IsApproved',
  PROCESSED,
  PROCESSING
]

export const ACCOUNTING_COLUMNS = [
  'C_AcctSchema_ID',
  'C_Currency_ID',
  'C_Convertion_Type_ID'
]
