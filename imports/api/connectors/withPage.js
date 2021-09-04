import { usePage } from './pages'

export const withPage = (Component) => (props) => {
  const [page] = usePage({ pageSlug: props.pageSlug })
  return <Component {...props} page={page} />
}
