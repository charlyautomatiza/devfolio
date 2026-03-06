'use server'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export async function getMarkdownContent(filename: string) {
  const contentRoot = path.join(process.cwd(), 'src', 'content')
  const filePath = path.resolve(contentRoot, filename)

  if (!filePath.startsWith(contentRoot + path.sep)) {
    throw new Error('Invalid filename')
  }

  const [realContentRoot, realFilePath] = await Promise.all([
    fs.realpath(contentRoot),
    fs.realpath(filePath),
  ])

  if (!realFilePath.startsWith(realContentRoot + path.sep)) {
    throw new Error('Invalid filename')
  }

  const fileContents = await fs.readFile(realFilePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { data, content }
}
