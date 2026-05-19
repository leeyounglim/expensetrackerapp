'use client';

import NavMonth from './NavMonth'
import {useState } from "react";
import { useRouter } from 'next/navigation';

interface receiptlist {
    receipts: ReceiptProps[];
    handleClick: (id:string|undefined) => void;
}
interface ReceiptProps {
    id?: string;
    title: string;
    category: string;
    date: Date;
    price: number; 
    user_id: string;
}

const ReceiptList = ({receipts, handleClick}:receiptlist) => {

    const [selectedMonth, setSelectedMonth] = useState <string|null>(null);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];  
    const router = useRouter();
    const filteredReceipts = receipts.filter(receipt => {
        if (!selectedMonth){
            return true;
        }
        const [month,year] = selectedMonth.split('-');
        const itemDate = new Date(receipt.date);
        return (itemDate.getMonth() === (months.indexOf(month)) && itemDate.getFullYear() === Number(year));
    });
    


    return ( 
        <div className="receiptlist">
            <h2>Receipts</h2>
            <button onClick = {() => router.push('/create')}>Add Receipt</button>
            
            
            <NavMonth
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}/>

            {filteredReceipts.map(receipt =>(
                <div className="receiptpreview" key = {receipt.id}>
                    <h2>{receipt.title}</h2>
                    <p> Category: {receipt.category}<br />
                        Date: {new Date(receipt.date).toLocaleDateString()} <br /> 
                    Price: {receipt.price}</p>
                    <button onClick={() => router.push('/edit/'+ receipt.id)}> Edit </button> 

                    <button onClick = {() => handleClick(receipt.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}
 
export default ReceiptList;