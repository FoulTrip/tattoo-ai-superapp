import Link from "next/link";

function LogoNavbar() {
    return (
        <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-semibold text-gray-900 dark:text-white">
                Tattoo Innova
            </Link>
        </div>
    )
}

export default LogoNavbar