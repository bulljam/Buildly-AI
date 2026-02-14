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
        '<span class="text-sky-300">$1</span>=<span class="text-amber-300">$2</span>'
      )

      return [
        '<span class="text-zinc-500">',
        open,
        "</span>",
        `<span class="text-cyan-300">${tagName}</span>`,
        highlightedAttributes,
        `<span class="text-zinc-500">${close}</span>`,
      ].join("")
    }
  )
}
