import { Meteor } from 'meteor/meteor'

Meteor.startup(async sink => {
  import { render } from 'react-dom'
  import { BrowserRouter } from 'react-router-dom'
  import { HelmetProvider } from 'react-helmet-async'
  import { StylesProvider } from '@material-ui/styles'
  import { DataHydrationProvider } from 'meteor/npdev:collections'
  import App from '/imports/App'

  const hydrationHandle = { isHydrating: false } // not in use
  const app = <HelmetProvider>
    <StylesProvider injectFirst>
      <DataHydrationProvider handle={hydrationHandle}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </DataHydrationProvider>
    </StylesProvider>
  </HelmetProvider>

  render(app, document.getElementById('root'))
})
