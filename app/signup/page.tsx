'use client';

import { useState } from "react";
import  Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string|null>(null);
    const [isPending, setIsPending] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        setIsPending(true);
        const { error } = await signup(email, password);

        if (error) {
            setError(error.message);
            setIsPending(false);
        } else {
            router.push('/login'); // redirect to login after signup
        }
    };

    return (
        <div className="signup">
            <h2>Sign Up</h2>
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Creating account...' : 'Sign Up'}
                </button>
            </form>
            <p>Already have an account? <Link href="/login">Login</Link></p>
        </div>
    );
};

export default Signup;