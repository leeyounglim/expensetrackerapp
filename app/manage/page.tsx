'use client';

import Receipts from '@/components/Receiptlist';
import useFetch from '@/lib/useFetch';
import { useState, useEffect } from 'react';
import {createClient} from '@/lib/supabase/client';
import { useAuth } from '@/app/providers';

interface Receipt {
    id?:string;
    title: string;
    category: string;
    date: Date;
    price: number; 
    user_id: string;
}

const Manage = () => {
    const [receipts,setReceipts] = useState<Receipt[]>([]);
    const {data, isPending, error} = useFetch('receipts');
    const {user} = useAuth();
    

    const supabase = createClient();

    useEffect(() =>{
        if (data) setReceipts(data);
    }, [data])
    if (!user) return null;

    const handleClick = async(id:string|undefined) => {
        const {error} = await supabase
            .from('receipts')
            .delete()
            .eq('id',id)
            .eq('user_id',user.id)
        if (error) console.log(error.message)
        else{
            setReceipts(prev => prev.filter(r=> r.id !== id))
        } 
    };

    return (
        <div className="manage">
            
            {error && <div>{error}</div> }
            {isPending && <div>Loading Receipts...</div>}
            {receipts && <Receipts receipts = {receipts} handleClick = {handleClick} />}
            
        </div> 
     );
}
 
export default Manage;