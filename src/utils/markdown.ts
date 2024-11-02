'use server'

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export async function getMarkdownContent(filename: string) {
  const filePath = path.join(process.cwd(), 'src', 'content', filename)
  const fileContents = await fs.readFile(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { data, content }
}
