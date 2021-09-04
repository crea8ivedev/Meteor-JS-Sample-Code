import NameAndSlug from './NameAndSlug'
import { BaseField } from 'uniforms'

const NameAndSlugField = (props, { uniforms: { model, onChange } }) =>
  <NameAndSlug
    {...props}
    name={model.name || ''}
    slug={model.slug || ''}
    onChange={data => {
      onChange('name', data.name)
      onChange('slug', data.slug)
    }}
  />

NameAndSlugField.contextTypes = BaseField.contextTypes

export default NameAndSlugField
