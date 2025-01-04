/**
 * A function that returns a string with the template string and its elements concatenated.
 * @param template - A template string.
 * @param templateElements - The template elements.
 * @returns A string with the template string and its elements concatenated.
 */
export function cntl(template: TemplateStringsArray, ...templateElements: string[]) {
  return template
    .reduce((sum, n, index) => {
      const templateElement = templateElements[index]
      if (typeof templateElement === 'string') {
        return `${sum}${n}${templateElement}`
      }
      return `${sum}${n}`
    }, '')
    .trim()
    .replace(/\s{2,}/g, ' ')
}
