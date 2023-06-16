
import React from "react";
import { useNavigate } from "react-router-dom";
import SubCityCountChart from "../subCityCount/subCityCount";
import Navbar from "../navbar/navbar";

const UserDashboard = () => {
    
    return (
        <div>
            <Navbar />
            <SubCityCountChart />
        </div>
    );
}

export default UserDashboard;