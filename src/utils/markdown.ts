'use server'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const contentRoot = path.join(process.cwd(), 'src', 'content')
const realContentRootPromise = fs.realpath(contentRoot)

function isInsideRoot(root: string, candidate: string): boolean {
  const rel = path.relative(root, candidate)
  return rel.length > 0 && !rel.startsWith('..') && !path.isAbsolute(rel)
}

export async function getMarkdownContent(filename: string) {
  const filePath = path.resolve(contentRoot, filename)

  if (!isInsideRoot(contentRoot, filePath)) {
    throw new Error('Invalid filename')
  }

  const [realContentRoot, realFilePath] = await Promise.all([
    realContentRootPromise,
    fs.realpath(filePath),
  ])

  if (!isInsideRoot(realContentRoot, realFilePath)) {
    throw new Error('Invalid filename')
  }

  const fileContents = await fs.readFile(realFilePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { data, content }
}
