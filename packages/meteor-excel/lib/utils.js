import XLSX from 'xlsx'

export class ExcelUtils {
  constructor (fileType = 'xlsx') {
    this.fileType = fileType
  }

  sheet_to_json = (worksheet, options = {}) =>
    XLSX.utils.sheet_to_json(worksheet, opts)

  sheet_to_csv = (worksheet, options = {}) =>
    XLSX.utils.sheet_to_csv(worksheet, opts)

  encode_cell = (cellAddress, options) =>
    XLSX.utils.encode_cell(cellAddress)

  encode_range = (range) =>
    XLSX.utils.encode_range(range)
}
