const PREVIEW_BASE_TAG = '<base href="about:srcdoc">'

export function preparePreviewHtml(html: string) {
  if (html.includes(PREVIEW_BASE_TAG)) {
    return html
  }

  if (/<head(\s[^>]*)?>/i.test(html)) {
    return html.replace(/<head(\s[^>]*)?>/i, (match) => `${match}${PREVIEW_BASE_TAG}`)
  }

  if (/<html(\s[^>]*)?>/i.test(html)) {
    return html.replace(
      /<html(\s[^>]*)?>/i,
      (match) => `${match}<head>${PREVIEW_BASE_TAG}</head>`
    )
  }

  return `${PREVIEW_BASE_TAG}${html}`
}
