import React, { Component } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar
} from 'recharts'

export default function SalesTrend(props) {

    const data=props.data||[];
    const barDetails=props.barDetails||[];
    return (
        <div style={{ height: '230px' }}>
            <ResponsiveContainer height='100%' width='100%'>
                <BarChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid stroke="#26A1FD" vertical={false} />
                    <XAxis dataKey="name" unit="" stroke="#26A1FD" fontSize={8} tick={{ stroke: '#929292', strokeWidth: 0.5 }} />
                    <YAxis stroke="#26A1FD" unit={props.unit} fontSize={8} tick={{ stroke: '#929292', strokeWidth: 0.5 }} />
                    <Tooltip />
                    <Legend />
                    {barDetails && barDetails.map(b =>
                        <Bar barSize={b.size || 10} dataKey={b.key} stackId="a" name={b.name} fill={b.color}  />
                    )}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )

}
