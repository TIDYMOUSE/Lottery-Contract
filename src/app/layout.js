import { Inter } from 'next/font/google'

//css
import styles from './global.css'

//components
import Navbar from '@/app/components/Navbar'
import Providers from './Context/Providers'



const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fair Lottery?',
  description: 'Blockchain based lottery',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${inter.className} ${styles}`}>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
