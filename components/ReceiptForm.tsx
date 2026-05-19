'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';

interface ReceiptProps {
    id?: string;
    title: string;
    category: string;
    date: string;
    price: number; 
    user_id: string;
}
interface ReceiptFormProps {
    initialData: null|ReceiptProps;
    onSubmit:(receipt: Omit<ReceiptProps, 'id'>) => Promise<void>;
    buttonText: string;
}

const ReceiptForm = ({initialData, onSubmit, buttonText}:ReceiptFormProps) => {
    const [title,setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState(initialData?.category ||'');
    const [date, setDate] = useState<string>(initialData?.date ||'');
    const [price,setPrice] = useState(initialData?.price ||'');
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);
    const { user } = useAuth();
    if (!user)return null; 

    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d*(\.\d{0,2})?$/.test(value)){
            setPrice(value);
            setError("");
        }else{
            setError('Price must be a valid number (up to 2 decimals)')
        }
    }

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) =>{
        
        event.preventDefault();
        const numeric = Number(price);
        setIsPending(true);
        await onSubmit({title, category, date, price:numeric, user_id: user.id});

        setIsPending(false);
    }

    return ( <div className="create">
            <h2>Add new receipt</h2>
            <form onSubmit={handleSubmit}>
                <label>Receipt Title: </label>
                <input
                type = "text"
                required
                value = {title}
                onChange = {(e) => setTitle(e.target.value)}
                />

                <label>Category</label>
                <select
                value = {category}
                onChange = {(e)=> setCategory(e.target.value)}>
                required
                    <option value = '' disabled>Select a category</option>
                    <option value = 'Food and Beverage'>Food and Beverage</option>
                    <option value = 'Transport'>Transport</option>
                    <option value = 'Online Shopping'>Online Shopping</option>
                    <option value = 'Activity'>Activity</option>
                    <option value = 'Others'>Others</option>
                </select>

                <label>Date</label>
                <input 
                type = "date"
                value = {date}
                onChange = {(e) => setDate(e.target.value)}
                required
                />

                <label>Price</label>
                <input 
                type = "text"
                value = {price}
                onChange = {handleChange}
                />

                {buttonText === 'Edit'&& <button onClick={()=>{router.back()}}>cancel</button>}
                {error && <p style = {{color:"red"}}>{error} </p>}
                {!isPending && error === '' &&<button>{buttonText}</button>}
                {isPending && <button disabled> {buttonText}ing Receipt...</button>}
                {!(error === '') && <button disabled>Add</button>}
            </form>
        </div>
     );
}
 
export default ReceiptForm;