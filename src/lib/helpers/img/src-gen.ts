export const CLOUDINARY_CONFIG = Object.freeze({
  host: '',
  defaultQuality: 'q_auto:good,f_auto,fl_lossy,dpr_1.1',
  customQuality: 'q_auto:good,fl_lossy,dpr_1.1,f_',
  greybackgroundQuality: 'e_brightness:-3',
  folder: '',
  srcFallback: '1920',
  defaultSrcFallBack: '960',
  assetPath: '/assets/media/product_default.png',
  assetSrcset: '788w',
  mobileAssetPath: '/assets/media/product_mobile_default.png',
  mobileAssetSrcset: '314w',
  srcset: '100,200',
})

export const getSrcset = (
  filename: string = '',
  baseUrl: string = CLOUDINARY_CONFIG.host,
  srcSet: string = '',
  transformations: string = '',
  transformationsPlain: string = '',
  assetFormat: string = '',
  withGreyBg?: boolean
) => {
  const { defaultQuality, customQuality, greybackgroundQuality } = CLOUDINARY_CONFIG
  const greyBgPrefix = !withGreyBg ? '' : `${greybackgroundQuality},`
  let selectedQuality = `${greyBgPrefix}${customQuality}${assetFormat}`
  let namedTransformations = [] as string[]
  let srcSetSplitted = [] as string[]
  let cloudinaryUrl = ''
  let finalSrcSet = ''

  if (srcSet && srcSet !== '') {
    srcSetSplitted = srcSet.split(',')
  }
  if (transformations && transformations !== '') {
    namedTransformations = transformations.split(',')
  }

  if (!transformationsPlain) transformationsPlain = ''

  if (assetFormat !== 'jpg' && assetFormat !== 'png' && assetFormat !== 'gif') {
    selectedQuality = `${greyBgPrefix}${defaultQuality}`
  }

  srcSetSplitted.forEach((val, ind) => {
    cloudinaryUrl = ''
    if (namedTransformations.length) {
      namedTransformations.forEach((value, index) => {
        if (value !== '') {
          cloudinaryUrl += `t_${value}`
          if (index < namedTransformations.length - 1) {
            cloudinaryUrl += ','
          }
        }
      })
    }

    finalSrcSet += `${baseUrl}/${cloudinaryUrl}/${transformationsPlain}/${selectedQuality}/w_${val}/${filename} ${val}w`

    if (ind < srcSetSplitted.length - 1) {
      finalSrcSet += ','
    }
  })

  return finalSrcSet
}

export const getSrc = (
  filename: string = '',
  size: string = 'false',
  baseUrl: string = CLOUDINARY_CONFIG.host,
  transformations: string = '',
  transformationsPlain: string = '',
  assetFormat: string = '',
  withGreyBg?: boolean
) => {
  const { defaultQuality, customQuality, greybackgroundQuality } = CLOUDINARY_CONFIG
  const greyBgPrefix = !withGreyBg ? '' : `${greybackgroundQuality},`
  let selectedQuality = `${greyBgPrefix}${customQuality}${assetFormat}`
  let namedTransformations = [] as string[]
  let cloudinaryUrl = ''
  let finalSrc

  if (transformations && transformations !== '') {
    namedTransformations = transformations.split(',')
  }

  if (!transformationsPlain) transformationsPlain = ''

  if (assetFormat !== 'jpg' && assetFormat !== 'png' && assetFormat !== 'gif') {
    selectedQuality = `${greyBgPrefix}${defaultQuality}`
  }

  if (namedTransformations.length) {
    namedTransformations.forEach((value, index) => {
      if (value !== '') {
        cloudinaryUrl += `t_${value}`
        if (index < namedTransformations.length - 1) {
          cloudinaryUrl += ','
        }
      }
    })
  }

  finalSrc = `${baseUrl}/${cloudinaryUrl}/${transformationsPlain}/${selectedQuality}/w_${size}/${filename}`
  if (assetFormat === 'gif' || size === 'false') {
    finalSrc = `${baseUrl}/${cloudinaryUrl}/${transformationsPlain}/${selectedQuality}/${filename}`
  }

  return finalSrc
}

interface ImageSourceParams {
  filename: string
  baseUrl: string
  srcSet?: string
  transformations?: string
  transformationsPlain?: string
  withGreyBg?: boolean
  isNewSearchGrid?: boolean
  preloadedUrl?: string
}

export const generateImageSources = ({
  filename,
  baseUrl,
  srcSet,
  transformations = '',
  transformationsPlain = '',
  withGreyBg = false,
  isNewSearchGrid = false,
  preloadedUrl,
}: ImageSourceParams) => {
  const { srcFallback } = CLOUDINARY_CONFIG

  // Generate srcSet
  const srcSetTag =
    filename === '' ? '' : getSrcset(filename, baseUrl, srcSet, transformations, transformationsPlain, '', withGreyBg)

  // Generate src
  const srcTag = isNewSearchGrid
    ? getSrc(filename, srcFallback, baseUrl, transformations, transformationsPlain, '', withGreyBg)
    : null

  const src = preloadedUrl || (filename ? srcTag || `` : '')

  return {
    src,
    srcSet: srcSetTag,
  }
}
