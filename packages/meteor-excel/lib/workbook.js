import XLSX from 'xlsx'

export class Workbook {
  constructor (fileType = 'xslx') {
    this.fileType = fileType

    this.SheetNames = []
    this.Sheets = {}
  }

  addSheet = (sheetName, sheet) => {
    this.SheetNames.push(sheetName)
    this.Sheets[sheetName] = sheet
  }

  writeToFile = (filePath) => XLSX.writeFile(this, filePath)

  write = (wopts) => XLSX.write(this, wopts)
}
