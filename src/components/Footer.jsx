import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";


export default function Footer() {

    const currentYear = new Date().getFullYear()

    return (
        <>
            <footer className="bg-black/30 border-t border-white/30 text-gray-300 text-sm py-6 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-center">
                        © {currentYear} GlassyBlog. Built by <Link href="https://www.linkedin.com/in/muhammad-hassanraza/" target="_blank" rel="noopener noreferrer"><span className="text-emerald-400 font-medium">Muhammad Hassan Raza</span></Link>.
                    </p>
                     <div className="flex space-x-4 items-center">
                    <Link
                        href="https://github.com/MuhammadHassanRaza25"
                        target="_blank"
                        title="GitHub"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-emerald-400 transition"
                    >
                        <FaGithub className="w-4 h-4" />
                    </Link>
                    <Link
                        href="https://www.linkedin.com/in/muhammad-hassanraza/"
                        target="_blank"
                        title="LinkedIn"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-emerald-400 transition"
                    >
                        <FaLinkedin className="w-4 h-4" />
                    </Link>
                </div>
                </div>
            </footer>
        </>
    )
}