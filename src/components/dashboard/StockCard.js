import React from "react";
import ResponsiveContainer from "../util/ResponsiveContainer";
import { Container, Col, Card, Row } from "reactstrap";

const StockCard = props => {

    const stockList = props.stockData;

    return (
        <ResponsiveContainer>
            <Row>
                {stockList.length>0?stockList.map(prd=>
                <Col lg="3" className="mt-1" key={prd.productId}> 
                    <Card  className="h-40" >
                        <div className="text-ellipsis" >
                            <div sm={8} className="py-3 px-2" >
                                <div className="pb-1 w-100 text-ellipsis textName"  >
                                    {prd.productName}
                                </div>
                                <div className="textVal">
                                    {prd.assetCount}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                ):
                <div className="container-fluid"><div className="dataTable_notFound text-center">Not Found !!</div></div>
                }
            </Row>   
        </ResponsiveContainer>
    )



}

export default StockCard;