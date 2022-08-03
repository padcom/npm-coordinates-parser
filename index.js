/**
 * Class encapsulating extraction of parts from NPM coordinates
 */
class NPMCoordinates {
  constructor(coordinates) {
    this.coordinates = coordinates
  }

  get #parts() {
    return this.coordinates.split('/').filter(x => x)
  }

  get isScoped() {
    return this.#parts[0][0] === '@'
  }

  get scope() {
    if (this.isScoped) return this.#parts[0]
    else return ''
  }

  set scope(value) {
    const name = value ? `${value}/${this.name}` : this.name
    const version = this.version ? `@${this.version}` : ''
    const main = this.main ? `/${this.main}` : ''

    this.coordinates = `${name}${version}${main}`
  }

  get name() {
    return this.#nameParts[0]
  }

  set name(value) {
    const name = this.isScoped ? `${this.scope}/${value}` : value
    const version = this.version ? `@${this.version}` : ''
    const main = this.main ? `${this.main}` : ''

    this.coordinates = `${name}${version}${main}`
  }

  get fullname() {
    return this.isScoped ? `${this.scope}/${this.name}` : this.name
  }

  get #nameParts() {
    return (this.isScoped ? this.#parts[1] : this.#parts[0]).split('@')
  }

  get version() {
    return this.#nameParts.length > 1 ? this.#nameParts[1] : ''
  }

  set version(value) {
    const fullname = this.fullname
    const version = value ? `@${value}` : ''
    const main = this.main ? `${this.main}` : ''

    this.coordinates = `${fullname}${version}${main}`
  }

  get main() {
    const result = (this.isScoped ? this.#parts.slice(2): this.#parts.slice(1)).join('/')
    return result ? `/${result}` : ''
  }

  set main(value) {
    this.coordinates = value ? `${this.fullname}/${value}` : fullname
  }

  get root() {
    return `${this.fullname}@${this.version}${this.main}`
  }
}

/**
 * Parse the given coordinates to NPMCoordinates instance
 *
 * @param {String} coordinates NPM coordinates to parse
 */
export function parse(coordinates) {
  return new NPMCoordinates(coordinates)
}
