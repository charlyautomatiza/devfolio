'use server'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const contentRoot = path.join(process.cwd(), 'src', 'content')
// Resolved once at module load; reused across all calls to avoid redundant I/O.
const realContentRootPromise = fs.realpath(contentRoot)

export async function getMarkdownContent(filename: string) {
  // Reject anything that isn't a plain basename (no directory separators or
  // path-traversal sequences).  path.basename strips leading directory
  // components, so if the result differs from the input the caller tried to
  // escape the content root.
  if (!filename || filename !== path.basename(filename) || filename === '.' || filename === '..') {
    throw new Error('Invalid filename')
  }

  // Use the cached, symlink-resolved content root.
  const realContentRoot = await realContentRootPromise

  // Enumerate the actual files present in the content directory and look for
  // an exact match.  `match` is an element of the on-disk listing — it is
  // NOT derived from user input — so the path built from it carries no taint.
  const entries = await fs.readdir(realContentRoot)
  const match = entries.find(entry => entry === filename)
  if (!match) {
    throw new Error('Invalid filename')
  }

  // Both `realContentRoot` and `match` come from trusted filesystem sources,
  // so this path is free of user-controlled components.
  const safeFilePath = path.join(realContentRoot, match)
  const fileContents = await fs.readFile(safeFilePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { data, content }
}
