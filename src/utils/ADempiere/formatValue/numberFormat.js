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

import { charInText, isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

/**
 * zero pad
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @param {number|string} number
 * @param {number} pad
 * @returns {string}
 */
export function zeroPad(number, pad = 2) {
  const zero = Number(pad) - number.toString().length + 1
  return Array(+(zero > 0 && zero)).join('0') + number
}

/**
 * Round decimal numbers
 * @param {number} number
 * @returns {number}
 */
export function round(number, standardPrecision = 2) {
  const amount = number.toFixed(standardPrecision)
  return Number(amount)
}

export const OPERATION_PATTERN = /[\d\/.()%\*\+-]/

export const INPUT_NUMBER_PATTERN = /[^\d\/.()%\*\+-=]/g

/**
 * Solve an arithmetic operation (+, -, /, * and %)
 * @author Edwin Betancourt <EdwinBetanc0urt@oulook.com>
 * @param {string} mathExpression, mathematical expression to be solved or numerical value
 */
function solveMathOperation(mathExpression) {
  let expressionIndex = Math.max(mathExpression.lastIndexOf('-'), mathExpression.lastIndexOf('+'))
  if (expressionIndex === -1) {
    expressionIndex = Math.max(mathExpression.lastIndexOf('*'), mathExpression.lastIndexOf('/'))
  }
  if (expressionIndex === -1) {
    const num = Number.parseInt(mathExpression.trim())
    if (isNaN(num)) {
      return null
    }
    return num
  }

  const leftVal = solveMathOperation(mathExpression.substring(0, expressionIndex).trim())
  const rightVal = solveMathOperation(mathExpression.substring(expressionIndex + 1).trim())

  switch (mathExpression[expressionIndex]) {
    case '+':
      return leftVal + rightVal
    case '-':
      return leftVal - rightVal
    case '*':
      return leftVal * rightVal
    case '/':
      return leftVal / rightVal
    case '%':
      return leftVal % rightVal
  }
}

export function calculationValue(value, event) {
  const evalOperation = (value) => {
    try {
      return solveMathOperation(value) + ''
    } catch (error) {
      return null
    }
  }

  const isDeleteKey = ['Backspace', 'Delete'].includes(event.key)

  if (event.type === 'keydown') {
    const { selectionStart, selectionEnd } = event.target
    const operation = charInText({
      value: event.target.value,
      char: event.key,
      selectionStart,
      selectionEnd
    })
    // if (isDeleteKey) {
    //   operation = event.target.value
    // }
    if (!isEmptyValue(operation)) {
      const val = evalOperation(operation)
      console.log('operation', operation, val)
      return val
    }
  } else if (event.type === 'click') {
    if (!isEmptyValue(value)) {
      return evalOperation(value)
    }
  } else {
    if (isDeleteKey && !isEmptyValue(value)) {
      return evalOperation(value)
    }
    return null
  }
}
