import SideBar from '../component/side-bar';
import { Table } from 'rsuite';
import { Column, HeaderCell, Cell,
} from 'rsuite-table';
import { useState, useEffect } from 'react';
import axios from 'axios';
import URL from '../config';

const Transaction = () => {

    const [transactions, setTransactions] = useState([]);
    const token = JSON?.parse(localStorage?.getItem('user'));

    const fetchData = async () => {
        try {
            const success = await axios.get(`${URL}/journals`,
                {headers: {Authorization: token}}
            );
            setTransactions(success?.data);
        } catch (err) {alert(err?.response?.data?.message);}
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='transaction_wrapper'>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div className="col-md-10 work_place">
                    <div className="header_txt_place">
                        <h2>Transactions</h2>
                    </div>
                    <Table
                        height={400}
                        data={transactions}
                        onRowClick={rowData => {
                            console.log(rowData);
                        }}
                    >
                        <Column width={60} align="center" fixed>
                            <HeaderCell>Id</HeaderCell>
                            <Cell dataKey="id" />
                        </Column>

                        <Column width={150}>
                            <HeaderCell>title</HeaderCell>
                            <Cell dataKey="title" />
                        </Column>

                        <Column width={150}>
                            <HeaderCell>fullName</HeaderCell>
                            <Cell dataKey="fullname" />
                        </Column>

                        <Column width={100}>
                            <HeaderCell>operation</HeaderCell>
                            <Cell dataKey="operation" />
                        </Column>

                        <Column width={100}>
                            <HeaderCell>amount $</HeaderCell>
                            <Cell dataKey="amount" />
                        </Column>

                        <Column width={300}>
                            <HeaderCell>accountNumber</HeaderCell>
                            <Cell dataKey="accountNumber" />
                        </Column>
                    </Table>
                </div>
            </div>
        </div>
    );
}
 
export default Transaction;