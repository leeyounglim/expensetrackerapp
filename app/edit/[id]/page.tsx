// FIX USE PARAMS
'use client';

import { useEffect, useState } from "react";
import ReceiptForm from "@/components/ReceiptForm";
import { useRouter, useParams } from 'next/navigation'; 
import {createClient} from '@/lib/supabase/client';

interface ReceiptProps {
    title: string;
    category: string;
    date: string;
    price: number; 
    user_id: string;
}
const Edit = () => {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const supabase = createClient();

    const [receipt, setReceipt] = useState<ReceiptProps|null>(null);

    useEffect(() =>{
        const fetchReceipt = async() =>{
            const {data, error} = await supabase
                .from('receipts')
                .select('*')
                .eq('id',id)
                .single()
            if (error) console.log(error.message);
            else setReceipt(data)
        };
        fetchReceipt();
    }, [id])

    const handleEdit = async(receipt:ReceiptProps) => {
        const {error} = await supabase
            .from('receipts')
            .update(receipt)
            .eq('id',id)
        if (error) console.log(error.message);
        else router.push('/manage')
    }

    if (!receipt) {return <div>Loading...</div>}

    return ( 
        <div>
        <ReceiptForm 
        initialData = {receipt}
        onSubmit={handleEdit}
        buttonText='Edit'
        />
        
        </div>
        
     );
}
 
export default Edit;