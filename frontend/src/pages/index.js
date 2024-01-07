import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Autocomplete, Box, Container, Unstable_Grid2 as Grid, TextField } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { useContext, useEffect, useState } from 'react';
import { useAuthContext } from 'src/contexts/auth-context';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MqttContext } from 'src/contexts/mqtt-context';


async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
}

const Page = () => {
  // auth
  const { user } = useAuthContext();
  console.log(user);
  // time
  const [now, setNow] = useState(new Date());
  // data
  const [data, setData] = useState([]);
  const [currHour, setCurrHour] = useState(0);
  const [prevHour, setPrevHour] = useState(0);
  // address
  const [address, setAddress] = useState(user?.addresses[0])
  // addresses
  const options = user?.addresses;
  // date
  const [selectedDate, setSelectedDate] = useState(new Date());
  // api
  const [apiUrl, setApiUrl] = useState(`http://localhost:8000/api/user/address/date?year=${selectedDate.getFullYear()}&month=${selectedDate.getMonth() + 1}&date=${selectedDate.getDate()}&address=${user?.addresses[0]}`);
  // message mqtt
  // const message = useContext(MqttContext);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchData(apiUrl);
        console.log(currHour, prevHour, result.data);
        const values = [];
        result.data.map((data) => {
          values.push(data.value);
        });
        setData(values);
        setCurrHour(result.currHour);
        setPrevHour(result.prevHour);
      } catch (error) {
        // Handle error if needed
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAsync();
  }, [now.getHours(), apiUrl]);

  return (
    <>
      <Head>
        <title>
          Overview | Giám sát mực nước
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewBudget // budget
                difference={currHour > prevHour ? (currHour - prevHour) : (prevHour - currHour)}
                positive={currHour >= prevHour}
                sx={{ height: '100%' }}
                value={currHour}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTotalCustomers // 
                difference={currHour > 50 ? (currHour - 50) : (50 - currHour)}
                positive={currHour > 50}
                sx={{ height: '100%' }}
                value="3M"
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              {/* <OverviewTasksProgress
                sx={{ height: '100%' }}
                value={75.5}
              /> */}
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setApiUrl(`http://localhost:8000/api/user/address/date?year=${date.getFullYear()}&month=${date.getMonth() + 1}&date=${date.getDate()}&address=${address}`)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              {/* <OverviewTotalProfit
                sx={{ height: '100%' }}
                value="$15k"
              /> */}
              <Autocomplete
                defaultValue={user?.addresses[0]}
                onChange={(event, newValue) => {
                  setAddress(newValue);
                  console.log(address);
                  setApiUrl(`http://localhost:8000/api/user/address/date?year=${selectedDate.getFullYear()}&month=${selectedDate.getMonth() + 1}&date=${selectedDate.getDate()}&address=${newValue}`)
                  console.log(apiUrl);
                }}
                id="controllable-states-demo"
                options={options}
                sx={{ height: '100%' }}
                renderInput={(params) => <TextField {...params} label="Khu vực" />}
              />
            </Grid>
            <Grid
              xs={12}
              lg={8}
            >
              <OverviewSales
                chartSeries={[
                  {
                    name: 'This day',
                    data: data
                  },
                ]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
              lg={4}
            >
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={['Desktop', 'Tablet', 'Phone']}
                sx={{ height: '100%' }}
              />
            </Grid>
            {/* <Grid
              xs={12}
              md={6}
              lg={4}
            >
              <OverviewLatestProducts
                products={[
                  {
                    id: '5ece2c077e39da27658aa8a9',
                    image: '/assets/products/product-1.png',
                    name: 'Healthcare Erbology',
                    updatedAt: subHours(now, 6).getTime()
                  },
                  {
                    id: '5ece2c0d16f70bff2cf86cd8',
                    image: '/assets/products/product-2.png',
                    name: 'Makeup Lancome Rouge',
                    updatedAt: subDays(subHours(now, 8), 2).getTime()
                  },
                  {
                    id: 'b393ce1b09c1254c3a92c827',
                    image: '/assets/products/product-5.png',
                    name: 'Skincare Soja CO',
                    updatedAt: subDays(subHours(now, 1), 1).getTime()
                  },
                  {
                    id: 'a6ede15670da63f49f752c89',
                    image: '/assets/products/product-6.png',
                    name: 'Makeup Lipstick',
                    updatedAt: subDays(subHours(now, 3), 3).getTime()
                  },
                  {
                    id: 'bcad5524fe3a2f8f8620ceda',
                    image: '/assets/products/product-7.png',
                    name: 'Healthcare Ritual',
                    updatedAt: subDays(subHours(now, 5), 6).getTime()
                  }
                ]}
                sx={{ height: '100%' }}
              />
            </Grid> */}
            {/* <Grid
              xs={12}
              md={12}
              lg={8}
            >
              <OverviewLatestOrders
                orders={[
                  {
                    id: 'f69f88012978187a6c12897f',
                    ref: 'DEV1049',
                    amount: 30.5,
                    customer: {
                      name: 'Ekaterina Tankova'
                    },
                    createdAt: 1555016400000,
                    status: 'pending'
                  },
                  {
                    id: '9eaa1c7dd4433f413c308ce2',
                    ref: 'DEV1048',
                    amount: 25.1,
                    customer: {
                      name: 'Cao Yu'
                    },
                    createdAt: 1555016400000,
                    status: 'delivered'
                  },
                  {
                    id: '01a5230c811bd04996ce7c13',
                    ref: 'DEV1047',
                    amount: 10.99,
                    customer: {
                      name: 'Alexa Richardson'
                    },
                    createdAt: 1554930000000,
                    status: 'refunded'
                  },
                  {
                    id: '1f4e1bd0a87cea23cdb83d18',
                    ref: 'DEV1046',
                    amount: 96.43,
                    customer: {
                      name: 'Anje Keizer'
                    },
                    createdAt: 1554757200000,
                    status: 'pending'
                  },
                  {
                    id: '9f974f239d29ede969367103',
                    ref: 'DEV1045',
                    amount: 32.54,
                    customer: {
                      name: 'Clarke Gillebert'
                    },
                    createdAt: 1554670800000,
                    status: 'delivered'
                  },
                  {
                    id: 'ffc83c1560ec2f66a1c05596',
                    ref: 'DEV1044',
                    amount: 16.76,
                    customer: {
                      name: 'Adam Denisov'
                    },
                    createdAt: 1554670800000,
                    status: 'delivered'
                  }
                ]}
                sx={{ height: '100%' }}
              />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
