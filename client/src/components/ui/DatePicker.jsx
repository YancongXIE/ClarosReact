import Datepicker from "react-tailwindcss-datepicker";


export default function DatePicker({value, setSelectedDateRange}) {

    return (
            <Datepicker 
                value={value} 
                onChange={newValue => setSelectedDateRange(newValue)}
            /> 
        );
}

