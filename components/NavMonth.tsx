'use client';

import { generateMonthOptions } from "@/lib/date";

interface month{
  selectedMonth:string|null;
  onMonthChange: any
}

const MonthFilter = ({ selectedMonth, onMonthChange }:month) => {
  const monthOptions = generateMonthOptions(12);      
  return (
    <nav className="navMonth">
      <div className="months">
        {monthOptions.map(({label,value}) => (
          <button
            key={value}
            className={selectedMonth === value ? "active" : ""}
            onClick={() => {
                onMonthChange((prev: string|null) => prev === value ? null : value)
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MonthFilter;