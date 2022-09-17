import React from "react";
import { Table } from 'reactstrap';


const RealTimeStock = props => {

    const getTotals=(name)=>{
        
        if(props.data.length>0){
            return props.data.reduce(calcTotal,0);
            
        } 
        function calcTotal(total,dat){
            if(dat[name])
                return total+(parseInt(dat[name]));
            else
               return total+0;    

        }   
    }

    const getPercentage=(name)=>{
        const total=getTotals("distShare")+getTotals("dsmShare")+getTotals("dealerShare")
        const per=(getTotals(name)/total)*100;
        return isNaN(per)?0:per.toFixed(2)
    }

    const getDistPercentage=(distri, distDsm)=>{
        const total=getTotals("distShare")+getTotals("dsmShare")+getTotals("dealerShare")
        const shareOfDist = getTotals(distri);
        const shareOfDsm = getTotals(distDsm);
        const totalShare = shareOfDist+shareOfDsm;

        const per=(totalShare/total)*100;

        return isNaN(per)?0:per.toFixed(2)
    }

    return <div>
            <Table size="sm" className="custom-table-sm border mt-2">
            <thead>
                <tr>
                    <th style={{width:'28%'}}>Distributor Name</th>
                    <th style={{width:'17.33%'}}>Distributor Share</th>
                    <th style={{width:'13.33%'}}>DSM Share</th>
                    <th style={{width:'13.33%'}}>Dealer Share</th>
                    <th style={{width:'13.33%'}}>Distributor %</th>
                    <th style={{width:'13.33%'}}>Dealer %</th>
                    <th style={{width:'11.33%'}}>Total</th>
                </tr>
            </thead>
            <tbody>
             {

               props.data&&props.data.map((dts,key)=>
                   <tr key={key}>
                       <td>{dts.distributorName}</td>
                       <td style={{textAlign:'justify'}}>{dts.distShare?dts.distShare:0}</td>
                       <td style={{textAlign:'justify'}}>{dts.dsmShare?dts.dsmShare:0}</td>
                       <td style={{textAlign:'justify'}}>{dts.dealerShare?dts.dealerShare:0}</td>
                       <td style={{textAlign:'justify'}}>{dts.distPercentage?dts.distPercentage:0}</td>
                       <td style={{textAlign:'justify'}}>{dts.dealerPercentage?dts.dealerPercentage:0}</td>
                       <td style={{textAlign:'justify'}}>{dts.total?dts.total:0}</td>
                   </tr>
                )  
             }   
               
            </tbody>
        </Table>
        <Table size="sm" className="custom-table-sm border mt-2">
            <thead>
                <tr>
                    <th style={{width:'28%'}}>{props.product&&props.product.label}</th>
                    <th style={{width:'17.33%', textAlign:'justify'}}>{getTotals("distShare")}</th>
                    <th style={{width:'13.33%', textAlign:'justify'}}>{getTotals("dsmShare")}</th>
                    <th style={{width:'13.33%', textAlign:'justify'}}>{getTotals("dealerShare")}</th>
                    <th style={{width:'13.33%', textAlign:'justify'}}>{getDistPercentage("distShare","dsmShare")} %</th>
                    <th style={{width:'13.33%', textAlign:'justify'}}>{getPercentage("dealerShare")} %</th>
                    <th style={{width:'11.33%', textAlign:'justify'}}>{getTotals("total")}</th>
               </tr>
            </thead>
        </Table>
    </div>


    
}

export default RealTimeStock;