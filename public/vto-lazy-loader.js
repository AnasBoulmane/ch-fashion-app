;(() => {
  'use strict'

  // -------------------------------
  // Constants and Utility Functions
  // -------------------------------

  const VTO_BUTTON_SELECTOR = '.js-vto-button'
  const HEADER_LEVEL_ONE_SELECTOR = '.js-header-level-one'

  /**
   * Handles the fetch response.
   * @param {Response} response - The fetch response object.
   * @returns {Promise<Response>} - Resolves with response if ok, otherwise rejects.
   */
  const handleFetchResponse = (response) => (response.ok ? response : Promise.reject(response))

  /**
   * Checks if a variable is a plain object.
   * @param {any} obj - The variable to check.
   * @returns {boolean} - True if obj is a plain object, false otherwise.
   */
  const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]'

  /**
   * Creates a DOM element with specified attributes.
   * @param {Object} options - Configuration options for the element.
   * @param {string} options.tag - The tag name of the element.
   * @param {string} [options.id] - The id attribute.
   * @param {string[]} [options.classes] - Array of class names.
   * @param {Object} [options.style] - Inline styles.
   * @param {Object} [options.attributes] - Other attributes.
   * @returns {HTMLElement} - The created DOM element.
   * @throws {Error} - If the tag is not a string.
   */
  const createElement = ({ tag, id, classes = [], style = {}, attributes = {} } = {}) => {
    if (typeof tag !== 'string') {
      throw new Error('Could not create element! Tag must be a string.')
    }

    const element = document.createElement(tag)

    if (typeof id === 'string') {
      element.id = id
    }

    if (Array.isArray(classes)) {
      classes.forEach((className) => element.classList.add(className))
    }

    if (isObject(style)) {
      Object.assign(element.style, style)
    }

    if (isObject(attributes)) {
      Object.keys(attributes).forEach((attr) => element.setAttribute(attr, attributes[attr]))
    }

    return element
  }

  /**
   * Dispatches a custom event with provided details.
   * @param {string} eventName - The name of the event.
   * @param {Object} [detail={}] - Additional data to pass with the event.
   */
  const dispatchVTOEvent = (eventName, detail = {}) => {
    window.__FS = window.__FS || {}
    window.__FS.vto = window.__FS.vto || {}
    window.__FS.vto.event = eventName
    window.__FS.vto.detail = detail

    window.dispatchEvent(new CustomEvent(eventName, { detail }))
  }

  // -------------------------------
  // Fetch Wrapper Class
  // -------------------------------

  class FetchWrapper {
    /**
     * Performs a fetch request with given URL and options.
     * @param {string} url - The URL to fetch.
     * @param {Object} [options={ cache: "no-cache" }] - Fetch options.
     * @returns {Promise<Response>} - Resolves with fetch response.
     */
    static get(url, options = { cache: 'no-cache' }) {
      return new Promise((resolve, reject) => {
        fetch(url, options)
          .then(handleFetchResponse)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    }
  }

  // -------------------------------
  // Script Loading Handlers
  // -------------------------------

  let scriptSrc, scriptElement

  /**
   * Handles successful script load.
   */
  const onScriptLoad = () => {
    scriptElement.removeEventListener('error', onScriptError)
    dispatchVTOEvent('vto.event', {
      type: 'vto.script.load',
      message: `VTO script loaded at ${scriptSrc}`,
    })
  }

  /**
   * Handles script load error.
   */
  const onScriptError = () => {
    scriptElement.removeEventListener('load', onScriptLoad)
    dispatchVTOEvent('vto.event', {
      type: 'vto.script.error',
      message: `VTO script could not load at ${scriptSrc}`,
    })
  }

  // -------------------------------
  // Main Execution
  // -------------------------------

  window.__FS = window.__FS || {}

  // Retrieve BASE_URL from the global scope
  const BASE_URL = window.BASE_URL || 'https://www.chanel.com'

  FetchWrapper.get(`${BASE_URL}/asset/frontstage/manifest.vto.json`, { cache: 'no-store' })
    .then((response) => response.json())
    .then((manifest) => {
      const listenerScript = manifest['vto.listener.js']

      if (listenerScript) {
        scriptSrc = `${BASE_URL}${listenerScript}`
        scriptElement = createElement({
          tag: 'script',
          attributes: { src: scriptSrc, async: true },
        })

        scriptElement.addEventListener('load', onScriptLoad, { once: true })
        scriptElement.addEventListener('error', onScriptError, { once: true })

        document.head.appendChild(scriptElement)
      }

      /**
       * Preloads the VTO core script if the VTO button is present.
       */
      const preloadVTOCoreScript = () => {
        /**
         * Appends the VTO core script as a preload link.
         */
        const appendVTOCorePreload = () => {
          if (manifest['vto.core.js']) {
            const preloadLink = createElement({
              tag: 'link',
              attributes: {
                href: `${BASE_URL}${manifest['vto.core.js']}`,
                rel: 'preload',
                as: 'script',
              },
            })
            document.head.appendChild(preloadLink)
          }
        }

        const mainElement = document.getElementById('main')
        const vtoButtonExists = mainElement ? !!mainElement.querySelector(VTO_BUTTON_SELECTOR) : false

        if (vtoButtonExists) {
          appendVTOCorePreload()
        } else {
          const headerElement = document.querySelector(HEADER_LEVEL_ONE_SELECTOR)

          if (headerElement) {
            const observer = new MutationObserver((mutations) => {
              for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
                  appendVTOCorePreload()
                  observer.disconnect()
                  break
                }
              }
            })

            observer.observe(headerElement, { attributes: true })
          }
        }
      }

      if (document.readyState === 'complete') {
        preloadVTOCoreScript()
      } else {
        window.addEventListener('load', preloadVTOCoreScript, { once: true })
      }

      dispatchVTOEvent('vto.event', {
        type: 'vto.manifest.load',
        message: 'VTO manifest loaded',
      })
    })
    .catch((error) => {
      dispatchVTOEvent('vto.event', {
        type: 'vto.manifest.error',
        error: error || {},
      })
    })
})()
