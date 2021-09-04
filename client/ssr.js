import { Meteor } from 'meteor/meteor'
import { FastRender } from 'meteor/communitypackages:fast-render'

FastRender.onPageLoad(async sink => {
  import { preloadLoadables } from 'meteor/npdev:react-loadable'
  import { hydrate } from 'react-dom'
  import { BrowserRouter } from 'react-router-dom'
  import { HelmetProvider } from 'react-helmet-async'
  import { StylesProvider } from '@material-ui/styles'
  import { DataHydrationProvider, hydrateData } from 'meteor/npdev:collections'
  import { GTag } from './GTag'
  import App from '/imports/App'

  await preloadLoadables()

  // The data should come after the loadables are loaded, because they'll
  // contain whatever collections we need for hydration.
  hydrateData()

  const hydrationHandle = { isHydrating: !Meteor.userId() }
  const app = <HelmetProvider>
    <StylesProvider injectFirst>
      <DataHydrationProvider handle={hydrationHandle}>
        <BrowserRouter>
          <GTag measurementId={Meteor.settings.public.GTAG}>
            <App />
          </GTag>
        </BrowserRouter>
      </DataHydrationProvider>
    </StylesProvider>
  </HelmetProvider>

  hydrate(app, document.getElementById('root'), () => {
    hydrationHandle.isHydrating = false
    const ssrStyles = document.getElementById('jss-server-side')
    if (ssrStyles) ssrStyles.parentNode.removeChild(ssrStyles)
  })
})
