import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { generateMonthOptions } from '@/lib/date';
import useFetch from '@/lib/useFetch';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
    maintainAspectRatio: false,
    aspectRatio: 1.5,
  responsive: true,
  plugins: {
    legend: {
                display: true,
                position: 'bottom' as const,       // 'top' | 'bottom' | 'left' | 'right'
                align: 'center' as const,
                labels: {
                    color: '#333',
                    font: {
                        size: 16,
                        family: 'Quicksand',
                    },
                    padding: 20,
                    //usePointStyle: true,  // circles instead of squares
                    pointStyleWidth: 1,
                },
            },
    title: {
      color: '#0o0',
      display: true,
      text: 'Expense by Month',
      font:{size:20, family:'quicksand'},
    },
  },
};

const LineChart = () => {
  const {data: rawData} = useFetch('receipts');
  const {data: incomeData} = useFetch('income');

  const labels = generateMonthOptions(6).map(date => date.label);
  const expenseByMonth = generateMonthOptions(6).map(({month, year}) => {
    if (!rawData) return 0;
      return rawData
          .filter(receipt => {
              const d = new Date(receipt.date);
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return d.getMonth() === months.indexOf(month) && d.getFullYear() === year;
          })
          .reduce((sum, receipt) => sum + Number(receipt.price), 0);
  })
  const incomeByMonth = generateMonthOptions(6).map(({month, year}) => {
    if (!incomeData) return 0;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currDate = months.indexOf(month)
    const formatMonth = `${year}-${String(currDate + 1).padStart(2, '0')}`;
    const entry = incomeData.find(item => item.month === formatMonth);
    return entry ? Number(entry.income) : 0;
      
          
  })

  const data = {
  labels: labels.reverse(),
  datasets: [
    {
      label: 'Expense',
      data: expenseByMonth.reverse() ,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Income',
      data:incomeByMonth.reverse(),
      borderColor: 'rgb(0, 248, 124)',
      backgroundColor: 'rgba(0, 116, 50, 0.5)',
    },
  ],
  };

    return ( 
        <Line options = {options} data = {data} />
     );
}
 
export default LineChart;