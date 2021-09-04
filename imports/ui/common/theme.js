import { createTheme } from '@material-ui/core/styles'

const familyStack = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"'
]
const nunitoSans = [
  '"Nunito Sans"',
  ...familyStack
].join(',')
const barlow = [
  'Barlow',
  ...familyStack
].join(',')

const theme = createTheme({
  typography: {
    useNextVariants: true,
    // Use Nunito Sans with system font fallback instead of the default Roboto font.
    fontFamily: nunitoSans,
    // For headlines and titles, use Barlow
    h6: {
      fontFamily: barlow,
      fontWeight: 700
    },
    h5: {
      fontFamily: barlow,
      fontWeight: 700
    },
    h4: {
      fontFamily: barlow,
      fontWeight: 700
    },
    h3: {
      fontFamily: barlow,
      fontWeight: 700
    },
    h2: {
      fontFamily: barlow,
      fontWeight: 700
    },
    h1: {
      fontFamily: barlow,
      fontWeight: 700
    }
  },
  // https://in-your-saas.github.io/material-ui-theme-editor/
  palette: {
    common: {
      black: '#000',
      white: '#fff'
    },
    background: {
      paper: '#fff',
      default: '#fafafa'
    },
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(252, 105, 76, 1)',
      main: 'rgba(252, 42, 0, 1)',
      dark: 'rgba(201, 33, 0, 1)',
      contrastText: '#fff'
    },
    error: {
      light: 'rgba(252, 105, 76, 1)',
      main: 'rgba(252, 42, 0, 1)',
      dark: 'rgba(201, 33, 0, 1)',
      contrastText: '#fff'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)'
    }
  }
})

export default theme
