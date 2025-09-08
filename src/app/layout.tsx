import './globals.css'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import { MultiThemeProvider } from '@/components/MultiThemeProvider'

const geist = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <MultiThemeProvider>
            {children}
          </MultiThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}