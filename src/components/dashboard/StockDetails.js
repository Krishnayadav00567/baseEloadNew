import React from "react";
import { Table } from 'reactstrap';

const StockDetails = props => {

    const stockList =props.stockData ;

    return <Table size="sm" className="custom-table-sm border mt-2">
            <thead>
                <tr>
                    <th >ITEM</th>
                    <th>Total Count </th>
                </tr>
            </thead>
            <tbody>
                {
                  ( stockList && stockList.length>0) ? stockList.map(
                        stock => <tr>
                            <td><span>{stock.productName}</span> </td>
                            <td><span>{stock.assetCount}</span></td>
                        </tr>
                    ):
                    <tr>
                        <td colSpan="5" className="text-danger text-center">
                        <span>No Details</span>
                        </td>
                    </tr>
                }
            </tbody>
        </Table>



    
}

export default StockDetails;