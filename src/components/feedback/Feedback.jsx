import react from 'react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import './feedback.css';


const Feedback = () => {
    const [feedbackData, setFeedbackData] = useState(null);
    const [showfeedback, setShowFeedback] = useState(0);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // Fetch initial dashboard data
        fetchfeedbackData();
    
        // Fetch feedback data every minutes
        const interval = setInterval(fetchfeedbackData, 1 * 60 * 1000);
        // Clean up the interval on component unmount
        return () => clearInterval(interval);
      }, []);


    const fetchfeedbackData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
              window.location.href = '/';
              return;
            }
            const headers = {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              responseType: 'json',
            };
            const response = await axios.get('https://food-dispenser-api.onrender.com/v1/feedback', { headers });
    
            if (response.data.message === 'Unauthorized') {
              localStorage.removeItem('token');
              window.location.href = '/';
              return;
            }
            
            const feedbacks = response.data.response;
            console.log(feedbacks);
            
            if (feedbacks !== feedbackData){
                setFeedbackData(feedbacks);
            }
    
        } catch (error) {
          console.error('Error fetching Feedback data:', error);
        }
      };
    

    const handleUpdate = async (id, status) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/';
                return;
            }
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                responseType: 'json',
            };

            const body = {
                status: status,
            };

            const response = await axios.put(`https://food-dispenser-api.onrender.com/v1/feedback/${id}`, body, { headers });
            if (response.data.message === 'Unauthorized') {
                localStorage.removeItem('token');
                window.location.href = '/';
                return;
            }
            fetchfeedbackData();
            setLoading(false);
        } catch (error) {
            console.error('Error updating feedback:', error);
            setLoading(false);
        }
    };


    function getStarRating(rating) {
        rating = Number(rating);
        console.log("rating is ", rating);
        const filledStar = '<span class="star-filled">&#9733;</span>';
        const emptyStar = '<span class="star-empty">&#9733;</span>';
      
        let stars = "";
        for (let i = 0; i < rating; i++) {
          stars += filledStar; // add a filled star
        }
        for (let i = rating; i < 5; i++) {
          stars += emptyStar; // add an empty star
        }
      
        return `<div class="star-rating">
                  <style>
                    .star-rating {
                      display: inline-block;
                      font-size: 1.5rem;
                      color: #f5c518;
                      text-shadow: 1px 1px #444;
                    }
                    .star-filled {
                      color: #f5c518;
                    }
                    .star-empty {
                      color: #ccc;
                    }
                  </style>
                  ${stars}
                </div>`;
      }



    const pendingfeedback = !feedbackData ? {} : feedbackData.filter(feedback => feedback.status === 'pending');
    const approvedfeedback = !feedbackData ? {} : feedbackData.filter(feedback => feedback.status === 'approved');

    return (
        <div>
            <Navbar />
            <br />
            <br />
            <br />
            <h1>Feedback</h1>
            
            <div className="navButton">
                <Button variant="outline-primary" className= {showfeedback === 0 ? 'active' : ''} onClick={() => setShowFeedback(0)}>All</Button>
                <Button variant="outline-primary" className={showfeedback === 1 ? 'active' : ''} onClick={() => setShowFeedback(1)}>Pending</Button>
                <Button variant="outline-primary" className={showfeedback === 2 ? 'active' : ''} onClick={() => setShowFeedback(2)}>Approved</Button>
            </div>
            
            <Container fluid className='mt-5'>
            <Row className="mt-5">
                <Col className="tablecenter" md={{ span: 8, offset: 2 }}>
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Created Date and Time</th>
                        <th>User</th>
                        <th>Device</th>
                        <th>Feedback</th>
                        <th>Rating</th>
                        <th> Status </th>
                        {showfeedback === 1 && <th>Update</th>}
                        </tr>
                    </thead>
                    <tbody>

                        { (showfeedback === 0) ? (
                            feedbackData &&
                                feedbackData.map((feedback) => (
                                    <tr key={feedback._id}>
                                    <td>
                                    {new Date(feedback.date).toLocaleDateString()}{" "}
                                    {new Date(feedback.date).toLocaleTimeString()}
                                    </td>
                                    <td>{feedback.user.full_name}</td>
                                    <td>{feedback.device._id}</td>
                                    <td>{feedback.feedback}</td>
                                    <td> <div dangerouslySetInnerHTML={{ __html: getStarRating(feedback.rating) }}></div> </td>
                                    <td> {feedback.status} </td>
                                    </tr>
                                )) ) :

                            (showfeedback === 1) ? (
                                    pendingfeedback &&
                                    pendingfeedback.map((feedback) => (
                                        <tr key={feedback._id}>
                                        <td>
                                        {new Date(feedback.date).toLocaleDateString()}{" "}
                                        {new Date(feedback.date).toLocaleTimeString()}
                                        </td>
                                        <td>{feedback.user.full_name}</td>
                                        <td>{feedback.device._id}</td>
                                        <td>{feedback.feedback}</td>
                                        <td> <div dangerouslySetInnerHTML={{ __html: getStarRating(feedback.rating) }}></div> </td>
                                        <td> {feedback.status} </td>
                                        <td>
                                            {loading ? <Button variant="outline-primary" disabled> Approving... </Button> : <Button variant="outline-primary" onClick={() => {handleUpdate(feedback._id, 'approved')}}> Approve </Button> } </td> 
                                        </tr>
                                    )))  : 
                            
                                    (approvedfeedback &&
                                        approvedfeedback.map((feedback) => (
                                            <tr key={feedback._id}>
                                            <td>
                                            {new Date(feedback.date).toLocaleDateString()}{" "}
                                            {new Date(feedback.date).toLocaleTimeString()}
                                            </td>
                                            <td>{feedback.user.full_name}</td>
                                            <td>{feedback.device._id}</td>
                                            <td>{feedback.feedback}</td>
                                            <td> <div dangerouslySetInnerHTML={{ __html: getStarRating(feedback.rating) }}></div> </td>
                                            <td> {feedback.status} </td>
                                            </tr>
                                        ))   
                                    )
                        
                        }
                        
                    </tbody>
                    </Table>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Feedback;