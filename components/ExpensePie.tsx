import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import useFetch from '@/lib/useFetch';
import { getCurrentMonthName } from '@/lib/date';
import type { TooltipItem, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataByCat{
    "Food and Beverage":number;
    "Activity":number;
    "Transport":number;
    "Online Shopping":number;
    "Other":number;
}

const ExpensePieChart = () => {
    const currMonth = getCurrentMonthName();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; 
    let {data:rawData} = useFetch('receipts');
    if (!rawData){
        return <div>Loading...</div>
    }
    const filteredData = rawData.filter(receipt => {
        
        if (!currMonth){
            return true;
        }
        const itemDate = new Date(receipt.date);
        return itemDate.getMonth() === (months.indexOf(currMonth));
        }
    );
    const dataByCat:DataByCat = {"Food and Beverage":0,"Activity":0,"Transport":0,"Online Shopping":0, "Other":0}
    for (const receipt of filteredData){
        const currCat = receipt.category as keyof DataByCat;
        if (dataByCat[currCat] !== undefined){dataByCat[currCat] += Number(receipt.price);}
    }
    const labels =Object.keys(dataByCat);
    const values = Object.values(dataByCat);

    const data = {
        labels: labels,
        datasets: [
            {
            label: '# of Votes',
            data: values,
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            hoverOffset: 20
            },
        ],
    }; 
    const options = {
        // Chart size - control via the wrapper div, not options
        // But you can set aspect ratio:
        maintainAspectRatio: false,
        aspectRatio: 1, // width:height ratio

        // Hover effects
        hover: {
            mode: 'nearest' as const,
            animateScale: true,   // slices grow on hover
        },

        // Animation
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 800,
        },

        // Cutout size (how thick the ring is)
        cutout: '60%', // bigger % = thinner ring
        layout:{padding: 15},
        // Custom Tooltip
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context: TooltipItem<'doughnut'>) => {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return ` ${label}: $${value.toFixed(2)} (${percentage}%)`;
                    },
                    title: (context:TooltipItem<'doughnut'>[]) => `Category: ${context[0].label}`,
                },
                backgroundColor: 'rgba(94, 16, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                padding: 10,
                cornerRadius: 8,
            },

            // Legend customization
            legend: {
                display: true,
                position: 'bottom' as const,       // 'top' | 'bottom' | 'left' | 'right'
                align: 'center' as const,
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 13,
                        family: 'Quicksand',
                    },
                    padding: 20,
                    //usePointStyle: true,  // circles instead of squares
                    pointStyleWidth: 1,
                },
            },

            // Center text (requires a custom plugin)
            centerText: {
                display: true,
                text: 'Expenses',
            },
        },
    };


    return ( 
        <div className="pie" style = {{ width: '250px', height: '400px' }}>
            <h3>Overview</h3>
            <Doughnut data={data} options={options} />
        </div>
        
     );
}
 
export default ExpensePieChart;

