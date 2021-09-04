import dompurify from 'dompurify'
import { JSDOM } from 'jsdom'
const { window } = new JSDOM('<!DOCTYPE html>')
export const DOMPurify = dompurify(window)
