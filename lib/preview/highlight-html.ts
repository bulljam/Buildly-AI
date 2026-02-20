function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

export function highlightHtml(value: string) {
  const escaped = escapeHtml(value)

  return escaped.replace(
    /(&lt;\/?)([a-zA-Z0-9-]+)((?:\s+[a-zA-Z-:@]+=(?:&quot;.*?&quot;))*)(\s*\/?&gt;)/g,
    (_, open, tagName, attributes, close) => {
      const highlightedAttributes = attributes.replace(
        /([a-zA-Z-:@]+)=(&quot;.*?&quot;)/g,
        '<span class="text-[#A64D79]">$1</span>=<span class="text-[#EEEEEE]">$2</span>'
      )

      return [
        '<span class="text-white/35">',
        open,
        "</span>",
        `<span class="text-[#EEEEEE]">${tagName}</span>`,
        highlightedAttributes,
        `<span class="text-white/35">${close}</span>`,
      ].join("")
    }
  )
}
