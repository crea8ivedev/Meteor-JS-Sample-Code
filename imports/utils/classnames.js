export default (...classnames) => (
  classnames.filter(c => !!c).join(' ')
)
