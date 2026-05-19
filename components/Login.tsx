'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/providers";
import  Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string|null>(null);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const { error } = await login(email, password);
        if (error) setError(error.message);
        else router.push('/');
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