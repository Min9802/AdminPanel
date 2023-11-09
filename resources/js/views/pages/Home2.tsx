import { Card, CardContent, DateTimePicker, DatePickerRange } from "@min98/ui";
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
        <>
            <DateTimePicker date={new Date()} setDate={setData} />
            <DatePickerRange setDate={setData} />
            <Card>
                <CardContent>
                    <h4>aaa</h4>
                </CardContent>
            </Card>
        </>
    );
};

export default Home2;
