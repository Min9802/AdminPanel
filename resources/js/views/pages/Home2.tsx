import { Card, CardContent, DateTimePicker, DatePickerRange } from "@/min";
import React from "react";
// import { TimePicker, DateTimePicker } from "@/min";

const Home2 = () => {
    const [date, setDate] = React.useState(null);
    const setData = (data: any) => {
        setDate(data);
    };
    React.useEffect(() => {
        console.log(date);
    }, [date]);
    return (
        <Card>
            <CardContent>
                <DateTimePicker date={new Date()} setDate={setData} />
                <DatePickerRange setDate={setData} />
                {/* <DateTimePicker /> */}
            </CardContent>
        </Card>
    );
};

export default Home2;
