import './home.css';
import SideNavbar from '../component/side-bar';
import {
BarChart, Bar, XAxis, YAxis, CartesianGrid, 
Tooltip, Legend} from 'recharts';
import { DatePicker, Button } from 'rsuite';
import axios from 'axios';
import URL from '../config';
import { useState, useEffect } from 'react';

const Home = () => {

  const [allData, setAllData] = useState([]);
  const [years, setYears] = useState(2023);
  const [months, setMonths] = useState(1);
  const [state, setstate] = useState(true);
  const [refreshKey, setrefreshKey] = useState(0);
  const token = JSON?.parse(localStorage?.getItem('user'));

  const determiner = () => {
    setstate(false)
    setrefreshKey(refreshKey + 1);
  }

  const fetchingData = async () => {
    try {
      const reports = await axios.get(`${URL}/reports/byMonth`,
        {headers: {Authorization: token}}
      );
      setAllData(reports?.data);
    } catch (err) {alert(err?.response?.data?.message);}
  }

  const fetchingData1 = async () => {
    try {
      const reports = await axios.get(`${URL}/reports/byMonth`, {
        headers: {Authorization: token},
        params: {year: years, month: months}
      });
      setAllData(reports?.data);
    } catch (err) {alert(err?.response?.data?.message);}
  }

  useEffect(() => {
    if (state) {
      fetchingData();
    } else {
      fetchingData1();
    }
  }, [state, refreshKey]);

  const data = allData?.map(item => ({
    name: item?.title,
    amt: item?.income,
    type: item?.type,
    date: item?.date
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
        <p className="label">
          {`${label} -`}
        </p>
        <p className="label">
          {`income: ${payload[0].value} $`}
        </p>
        <p className="desc">{`type: ${payload[0]?.payload?.type}`}</p>
        <p className="desc">{`date: ${payload[0]?.payload?.date}`}</p>
      </div>
      );
    }
  
    return '';
  };

  const changeHandle = (e) => {
    setMonths(e?.getMonth() + 1)
    setYears(e?.getFullYear());
  }

    return (
        <div className='home_wrapper'>
            <div className="row home_wropper">
                <div className="col-md-2 navbar_general">
                    <SideNavbar />
                </div>
                <div className="col-md-10 work_place">
                  <div className="rechart_bar_wrapper">
                    <div className="rechart_title_place">

                    </div>
                    <div className="chart_body">
                      <div className="chart_body_left">
                        <div className="date_place">
                          <h4 className='date_title'>Submit any date</h4>
                        </div>
                          <DatePicker onChange={changeHandle} size='lg' format="yyyy-MM" ranges={[]} />
                          <Button onClick={() => determiner()} className='submitter' size='md' appearance='default'>submit</Button>
                      </div>
                      <div className="chart_body_right">
                      <div className="report_title_place">
                        <h2 className='report_title'>Monthly reports</h2>
                      </div>
                        <BarChart
                          width={500}
                          height={300}
                          data={data}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis dataKey='amt' />
                          <Tooltip contentStyle={{backgroundColor: 'darkblue'}} itemStyle={{ color: 'darkblue' }} content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="amt" barSize={20} fill="#8884d8" />
                        </BarChart>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    );
}
 
export default Home;