interface ReceiptProps {
    id?: string;
    title: string;
    category: string;
    date: Date;
    price: number; 
    user_id: string;
}

export const getMonthTotal = (month:number, year:number, data:ReceiptProps[]|null) =>{
    let total = 0;
    if (data){for (const receipt of data){
        const itemDate = new Date(receipt.date);
        if (itemDate.getMonth() === month && itemDate.getFullYear() === year){
            total += Number(receipt.price)
        };
    };}
    return total.toFixed(2);
}

export const calcMonthChange = (curr:number, prev:number) =>{
    return parseFloat((((curr-prev)/prev)*100).toString()).toFixed(2);
}