export const getCurrentMonthIndex = () => {
    return new Date().getMonth();
};

export const getCurrentMonthName = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return months[new Date().getMonth()];
};

export const generateMonthOptions = (number:number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const options = [];

    for (let i = 0; i < number; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      options.push({
        label: `${month} ${year}`,   // display: "Jan 2026"
        value: `${month}-${year}`,   // unique key: "Jan-2026"
        month,
        year,
      });
    }
    return options;
}; 