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

  const fileContents = await fs.readFile(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { data, content }
}
