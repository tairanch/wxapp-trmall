import create from './create.js'
import store from '../index.js'

const createPage = (opts) => {
  return create(store, opts)
}
export default createPage