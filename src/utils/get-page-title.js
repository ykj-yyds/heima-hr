import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

// 设置网页标题方法
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
