/** Splits text around the given terms and wraps each occurrence in an accent span. */
export function highlightTerms(text: string, terms: ReadonlyArray<string>): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliest = remaining.length;
    let matched = '';
    terms.forEach((term) => {
      const index = remaining.indexOf(term);
      if (index !== -1 && index < earliest) {
        earliest = index;
        matched = term;
      }
    });

    if (!matched) {
      parts.push(remaining);
      break;
    }
    if (earliest > 0) parts.push(remaining.slice(0, earliest));
    parts.push(
      <b key={parts.length} className="font-semibold text-hive-cyan">
        {matched}
      </b>,
    );
    remaining = remaining.slice(earliest + matched.length);
  }

  return parts;
}
