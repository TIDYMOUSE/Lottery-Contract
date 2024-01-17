import Link from 'next/link'
import styles from '@/app/styles/navbar.module.css'

export default function Navbar() {
    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbar__container}>
                    <ul className={styles.navbar__links}>
                        <li>
                            <Link href="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/session">
                                Session
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}