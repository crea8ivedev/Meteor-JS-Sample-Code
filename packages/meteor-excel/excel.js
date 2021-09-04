import XLSX from 'xlsx'
import { ExcelUtils } from './lib/utils'
import { Workbook } from './lib/workbook'
import { Worksheet } from './lib/worksheet'

class Excel {
  fileType = 'xlsx'
  utils = new ExcelUtils(this.fileType)

  readFile (fileName, read_opts) {
    return XLSX.readFile(fileName, read_opts)
  }

  read (file, read_opts) {
    return XLSX.read(file, read_opts)
  }

  createWorkbook () {
    return new Workbook(this.fileType)
  }

  createWorksheet () {
    return new Worksheet(this.fileType)
  }
}

export { Excel, Workbook, Worksheet, ExcelUtils }
