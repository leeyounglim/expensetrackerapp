'use client';

import ReceiptForm from "@/components/ReceiptForm";
import {createClient} from '@/lib/supabase/client';
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';

interface ReceiptProps {
    title: string;
    category: string;
    date: string;
    price: number; 
    user_id: string;
}

const Create = () => {
    const { user } = useAuth();
    const router = useRouter();
    const supabase = createClient();
    if (!user) {
        return
    };

    const handleCreate = async(receipt: ReceiptProps) =>{
        const {error} = await supabase
            .from('receipts')
            .insert({ ...receipt, user_id: user.id});
        if (error) console.log(error.message);
        else router.back()
    }


    return ( 
        <ReceiptForm initialData =  {null}
        onSubmit={handleCreate}
        buttonText = 'Add'  />
        
     );
}
 
export default Create;