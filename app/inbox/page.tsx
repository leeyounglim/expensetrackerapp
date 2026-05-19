'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import useFetch from '@/lib/useFetch';
import { useAuth } from '@/app/providers';
import {createClient} from '@/lib/supabase/client';

interface Receipt {
    id?:string;
    title: string;
    category: string;
    date: Date;
    price: number; 
    user_id: string;
}

const inbox = () => {
    const [pendingReceipts,setReceipts] = useState<Receipt[]>([]);
    const router = useRouter();
    const {data, isPending, error} = useFetch('pendingReceipts');
    const {user} = useAuth();
    

    const supabase = createClient();

    useEffect(() =>{
        if (data) setReceipts(data);
    }, [data])
    if (!user) return null;

    const handleDismiss = async(id:string| undefined) => {
        setReceipts(prev => prev.filter(r => r.id !== id));

        const { error } = await supabase
            .from('pendingReceipts')
            .delete()
            .eq('id', id);

        if (error) console.error("Failed to dismiss:", error);
    }

    return ( 
        <div className="pendingReceipts">
            <h2>Pending Receipts</h2>
            {pendingReceipts.length === 0 && !isPending && (
                <p>No new receipts to review.</p>
            )}
            {pendingReceipts.map(receipt =>(
            <div className="pendingreceiptpreview" key={receipt.id}>
                <h2>{receipt.title}</h2>
                <div>
                            <p>Category: {receipt.category || <span>Needs Category</span>}</p>
                            <p>Date: {new Date(receipt.date).toLocaleDateString()}</p>
                            <p>Price: <span>{receipt.price || "$0.00"}</span></p>
                        </div>
                <div>
                    <button onClick={() => router.push('/review/'+ receipt.id)}> Review and Save </button> 

                    <button onClick = {() => handleDismiss(receipt.id)}>Dismiss</button>
                </div>
            </div>
            ))}
        </div>
     );
}
 
export default inbox;