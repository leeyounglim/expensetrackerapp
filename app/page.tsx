'use client'

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import  Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string|null>(null);
    const { user, login } = useAuth();
    const router = useRouter();

    useEffect(()=>{
        if (user){
            router.push('/home')
        }
    }, [user, router])

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        console.log('before login');
        const result = await login(email, password);
        console.log('after login');
        if (result.error) setError(result.error.message);
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Don't have an account? <Link href="/signup">Sign Up</Link></p>

        </div>
    );
};

export default Login;