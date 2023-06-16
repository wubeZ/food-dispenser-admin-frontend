import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import QRCodeGenerator from '../QRcodeGenerator/QRGenrator';
import localforage from 'localforage';
import './dashboard.css'
import { Container, Row, Col, Form, Button, Table, Spinner } from 'react-bootstrap';
import StatisticCard from '../card/StaticCard';

const Dashboard = () => {
  const [totalDevices, setTotalDevices] = useState(0.0);
  const [totalUsers, setTotalUsers] = useState(0.0);
  const [currentDeviceCount, setCurrentDeviceCount] = useState(0.0);
  const [creating, setCreating] = useState(false);
  const [recentDevices, setRecentDevices] = useState(null);


  useEffect(() => {
    // Fetch initial dashboard data
    fetchDashboardData();

    // Fetch dashboard data every minutes
    const interval = setInterval(fetchDashboardData, 1 * 60 * 1000);
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  
  const fetchDashboardData = async () => {
    try {
        const token = await localforage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          responseType: 'json',
        };
        const response = await axios.get('https://food-dispenser-api.onrender.com/v1/device/dashboard', { headers });

        if (response.data.message === 'Unauthorized') {
          window.location.href = '/login';
          await localforage.removeItem('token');
          return;
        }
        
        const totalDevicesdata = response.data.response.totalDevices;
        const totalUsersdata = response.data.response.totalUsers;
        const currentDeviceCountdata = totalDevicesdata - totalUsersdata;
        const data = response.data.response.recentDevices;
        const reverseData = data.reverse();
        if (totalDevices !== totalDevicesdata){
          setTotalDevices(totalDevicesdata);
        }
        if (totalUsers !== totalUsersdata){
          setTotalUsers(totalUsersdata);
        }
        if (currentDeviceCount !== currentDeviceCountdata){
          setCurrentDeviceCount(currentDeviceCountdata);
        }
        
        if (recentDevices !== reverseData){
          setRecentDevices(reverseData);
        }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };


  const handleCreateDevice = async (deviceName, capacity) => {
    const token = await localforage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      responseType: 'json',
    };

    try {
      const response = await axios.post(
        'https://food-dispenser-api.onrender.com/v1/device',
        {
          deviceName,
          capacity,
        },
        { headers }
      );

      if (response.data.message === 'Unauthorized') {
        window.location.href = '/login';
        await localforage.removeItem('token');
        return;
      }

      // const { deviceId } = response.data.response;
      fetchDashboardData();
      setCreating(false);
    } catch (error) {
      console.error('Error creating device:', error);
    }
  };


  const handleDeleteDevice = async (deviceId) => {
    const token = await localforage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      responseType: 'json',
    };

    try {
      const response = await axios.delete(`https://food-dispenser-api.onrender.com/v1/device/${deviceId}`, { headers });
      if (response.data.message === 'Unauthorized') {
        window.location.href = '/login';
        await localforage.removeItem('token');
        return;
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };


  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'60px' }}>
              <StatisticCard title="Total Devices" value={totalDevices} />
              <StatisticCard title="Total Users" value={totalUsers} />
              <StatisticCard title="Offline Devices" value={currentDeviceCount} />
      </div>

      <Container fluid className='mt-5'>

        <Row className="mt-5">
            <h2 className="vertical-form">Create Device</h2>

            <Form onSubmit={(e) => {
              e.preventDefault();
              setCreating(true);
              const deviceName = e.target.elements.deviceName.value;
              const capacity = e.target.elements.capacity.value;
              handleCreateDevice(deviceName, capacity);
              e.target.reset();
            }} style={{ display: 'flex', flexDirection: 'row',justifyContent: 'center', alignItems: 'center', margin: '30px' }} >
                <Form.Group controlId="deviceName" style={{ display: 'flex', flexDirection: 'row' ,justifyContent: 'center', alignItems: 'center', margin:"0 10px", fontSize:"large", fontWeight:"bold" }}>
                  <Form.Label>Device Name:</Form.Label>
                  <Form.Control style={{fontSize:"large"}} type="text" placeholder="" required />
                </Form.Group>

                <Form.Group controlId="capacity" style={{ display: 'flex', flexDirection: 'row',justifyContent: 'center', alignItems: 'center', margin: "0 10px", fontSize:"large", fontWeight:"bold" }}>
                  <Form.Label>Capacity:</Form.Label>
                  <Form.Control style={{fontSize:"large"}} type="number" placeholder="" required />
                </Form.Group>

                <Button style={{backgroundColor:"teal" }} variant="primary" type="submit"> 
                  {!creating ? "Create Device ": "creating..."}
                </Button>
            </Form>


          
        </Row>

        <Row className="mt-5">
          <Col className="tablecenter" md={{ span: 8, offset: 2 }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                <th>Created Date and Time</th>
                <th>ID</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>QR Code</th>
                <th> Delete </th>
                </tr>
              </thead>
              <tbody>
                {recentDevices ? (
                  recentDevices.map((device) => (
                    <tr key={device.deviceId}>
                      <td>
                      {new Date(device.createdAt).toLocaleDateString()}{" "}
                      {new Date(device.createdAt).toLocaleTimeString()}
                    </td>
                      <td>{device.deviceId}</td>
                      <td>{device.name}</td>
                      <td>{device.feedingCapacity}</td>
                      <td>
                        <QRCodeGenerator deviceId={device.deviceId} />
                      </td>
                      <td>
                        <Button variant="danger" onClick={() => handleDeleteDevice(device.deviceId)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );

};

export default Dashboard;
