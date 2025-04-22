import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { Home, LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
    await checkUser();

    return (
        <div className='fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-main'>
            <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
                <Link href="/">
                    <Image src={"/logo.png"} alt='FinSync logo' height={0} width={0} sizes='100vw' className='h-12 w-auto object-contain rounded-sm' />

                </Link>
                <div className='flex items-center space-x-4'>
                    <Link href="/">
                        <Button variant="outline" className="text-main border-util_color hover:bg-main hover:text-background hover:border-background">
                            <Home size={18} />
                            <span className='hidden md:inline'>Home</span>
                        </Button>
                    </Link>
                    <SignedIn>
                        <Link href={"/dashboard"} className='text-gray-600 hover:text-blue-600 flex items-center gap-2'>
                            <Button variant="outline" className="text-main border-util_color hover:bg-main hover:text-background hover:border-background">
                                <LayoutDashboard size={18} />
                                <span className='hidden md:inline'>Dashboard</span>
                            </Button>
                        </Link>
                        <Link href={"/transaction/create"}>
                            <Button variant="outline" className="flex items-center gap-2 text-main bg-background border-util_color  hover:bg-main hover:text-background hover:border-background">
                                <PenBox size={18} />
                                <span className='hidden md:inline'>Add Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton forceRedirectUrl='/dashboard'>
                            <Button variant="outline" className="text-main border-util_color hover:bg-main hover:text-background hover:border-background">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10",
                                userButtonAvatarBox: {
                                    border: '2px solid #66FCF1',
                                    borderRadius: '50%',
                                    padding: '2px',
                                }
                            }
                        }} />
                    </SignedIn>
                </div>
            </nav>
        </div>
    )
}

export default Header