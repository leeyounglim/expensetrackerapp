import { MdOutlineSavings } from "react-icons/md";
import { FaArrowTrendUp,FaArrowTrendDown } from "react-icons/fa6";
import useFetch from "@/lib/useFetch";
import { getCurrentMonthName, getCurrentMonthIndex } from "@/lib/date";
import { getMonthTotal } from "@/lib/getMonthTotal";


const Savings = () => {
    const { data: incomeData } = useFetch('income');
    const { data: expenseData } = useFetch('receipts');

    const currMonth = getCurrentMonthName();
    const currDate = new Date();
    const formatMonth = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, '0')}`;
    const currMonthIndex = getCurrentMonthIndex();

    if (!incomeData || !expenseData) return <div>Loading...</div>;

    const incomeEntry = incomeData.find(entry => entry.month === formatMonth);
    const incomeAmount = incomeEntry ? Number(incomeEntry.income) : 0;
    const expenseAmount = Number(getMonthTotal(currMonthIndex, currDate.getFullYear(), expenseData));

    const savingsrate = incomeAmount > 0 
        ? (((incomeAmount - expenseAmount) / incomeAmount) * 100).toFixed(1) 
        : 0;

    const delta = 0; // implement later with previous month comparison

    return ( 
        <div className="Expense">
            <MdOutlineSavings size = {30} style = {{fill: '#ffd606'}}/>
            <div className="month">{currMonth.toUpperCase()}</div>
            <div className="label">SAVINGS/INVESTING RATE</div>
            <div className="amount">{savingsrate}%</div>
            <div className="amountchange">
            {delta>=0 && <FaArrowTrendUp style = {{fill: '#19e107'}} className = 'arrow'/>} 
            {delta<0 && <FaArrowTrendDown style = {{fill:'#ff0000'}} className="arrow"/>}    
            {delta}%
            </div>
        </div>
     );
}
 
export default Savings;