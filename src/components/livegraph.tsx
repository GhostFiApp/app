import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GraphData {
    date: string;
    ghostPrice: number;
}

interface GraphComponentProps {
    data: GraphData[];
}

const GraphComponent: React.FC<GraphComponentProps> = ({ data }) => {
    return (
        <ResponsiveContainer width={350} height={350}>
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 50,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid stroke="#12fb16" strokeDasharray="2 2" />
                <XAxis dataKey="date" stroke="#12fb16" />
                <YAxis dataKey="ghostPrice" stroke="#12fb16" />
                <Area type="monotone" dataKey="ghostPrice" stroke="#12fb16" fill="#12fb16" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default GraphComponent;
