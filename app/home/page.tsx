'use client';

import ViewExpense from "@/components/ViewExpense";
import ExpensePieChart from '@/components/ExpensePie';
import LineChart from '@/components/MonthlyTrendline';
import Savings from "@/components/Savings";
import { useAuth } from '@/app/providers';

const Home = () => {
    const { user, isPending } = useAuth()

    if (isPending) return <div>Loading...</div>
    if (!user) return null
    return ( 
        <div className="dashboard">
            <h2 className="Greeting"><span>Hello, </span> <span className = "Name"> {user.email}</span></h2> 

            <div className="homecontent">
            
                <div className="MonthlyReport">
                    <h3>This Month's Reports</h3>
                
                <div>
                    <ViewExpense />
                </div>
                <div className="savings">
                    <Savings />
                </div>
                <div className = "pieChart">
                    <ExpensePieChart />
                </div>
                </div>

                <div className = "linechart">
                    < LineChart/>
                </div> 
                
            </div>
        </div>
     );
}
 
export default Home;