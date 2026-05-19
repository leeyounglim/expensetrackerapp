'use client';

import  Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { IoSettingsSharp } from "react-icons/io5";
import { AiOutlineInbox } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoReceiptOutline } from "react-icons/io5";
import { usePendingCount } from '@/hooks/usePendingCount';


const Navbar = () => {
    const {user, logout} = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const pendingCount = usePendingCount();
    const hasNewEmails = pendingCount > 0;

    const handleLogout = async () => {
        await logout();
        router.push('/login');
        router.refresh()
    }
    return (  
        <nav className="navbar">
            
            <h1>Expense Tracker</h1>
            <div className = 'links'>
                <Link href='/home'><IoHomeOutline/></Link>
                <div 
                className="dropdown-container" 
                onMouseEnter={() => setIsOpen(true)} 
                onMouseLeave={() => setIsOpen(false)}
                style={{ position: 'relative', display: 'inline-block' }} // Add this to your CSS class instead if preferred
                >
                <label>
                    <IoMdAddCircleOutline />
                </label>

                {isOpen && (
                    <div className="dropdown-content">
                    <Link href='/create'>Receipt</Link>
                    <Link href='/income'>Income Entry</Link>
                    </div>
                )}
                </div>
                <Link href='/manage'><IoReceiptOutline/></Link>
                <Link 
                    href='/inbox' 
                    style={{ position: 'relative' }} // This acts as the anchor for the dot
                >
                    <AiOutlineInbox 
                        size={24} 
                        style={{ color: hasNewEmails ? '#2563eb' : 'inherit' }} 
                    />
                    
                    {hasNewEmails && (
                        <span className="notification-dot"></span>
                    )}
                </Link>
                <Link href='/emailsetting'><IoSettingsSharp/></Link>
                {user && <button onClick={handleLogout}>Logout</button> }
            </div>
            
        </nav>
    );
}
 
export default Navbar;