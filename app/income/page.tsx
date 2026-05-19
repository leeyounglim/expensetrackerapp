'use client';

import useFetch from "@/lib/useFetch";
import { useState } from "react";
import { useAuth } from '@/app/providers';
import { useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";

interface incomeProps {
    month: string ;
    income: number|string;
    id?: string|null ; 
}
interface existsProps {
    exists: incomeProps;
}

const Income = () => {
    const [month, setMonth] = useState('');
    const [income, setIncome] = useState<number|string>("");
    const [isPending, setIsPending]  = useState(false);
    const router = useRouter();
    const { user } = useAuth();
    if (!user)return null;
    const supabase = createClient();

    const enterIncome = async({month, income}:incomeProps) => {
        const {error} = await supabase
            .from('income')
            .insert({month,income, user_id: user.id})
        if (error) console.log(error.message);
        else {
            setIsPending(false)
            router.back()}
    }
    const updateIncome = async({month,income}:incomeProps, {exists}:existsProps) => {
        const {error} = await supabase
            .from('income')
            .update({month, income})
            .eq('id',exists.id)
            .eq('user_id',user.id)
        if (error) console.log(error.message)
        else {
            setIsPending(false)
            router.back()
        }
    }
    
    const {data: incomeData} = useFetch('income');
    const handleSubmit = async(event: React.SubmitEvent<HTMLFormElement>) =>{
        const finalIncome = Number(income)
        event.preventDefault();
        setIsPending(true);
        // check if receipt exists
        const exists = Array.isArray(incomeData) && incomeData.find(entry => entry.month === month)

        if (!exists){enterIncome({month, income})}
        else {updateIncome({month,income}, exists)}
    }
    return ( 
        <div className="IncomeForm">
            <form onSubmit={handleSubmit}>
                <label>
                <input 
                required
                type = 'month'
                value = {month}
                onChange={(e) => {setMonth(e.target.value)}} />
                </label>
                <br />

                <label className="inputIncome">S$
                <input 
                required
                type = 'number'
                 value={income} 
                 placeholder="0.00" 
                 onChange={(e) => 
                 {const val = e.target.value;
                 {setIncome(val === ""?"": Number(val))}}}/>
                 </label>
                 <br/>

                 {!isPending && <button>Enter</button>}
                 {isPending && <button disabled>Adding...</button>}
            </form>
        </div>
     );
}
 
export default Income;