'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import  Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string|null>(null);
    const router = useRouter();
    const { login, user, isPending } = useAuth()

    if (isPending) return null  // or a spinner

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const { error } = await login(email, password);

        if (error) {
            setError(error.message)
            return;
        }
        console.log('api run');
    
        try {
            const res = await fetch("/api/syncemail", { method: "POST" });
            console.log("status:", res.status);
            
            const data = await res.json();
            console.log(data);

            // Only redirect AFTER the fetch completes
            router.push('/');
        } catch (err) {
            console.error("fetch error:", err);
        }
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