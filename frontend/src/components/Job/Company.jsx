import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { Context } from "../../main";

function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/company/getCompany', { withCredentials: true });
        setCompanies(response.data.jobs);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      console.log('Cleanup function called');
      // Code for cleanup (if needed)
    };
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
    }
  }, [isAuthorized, navigateTo]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/company/${id}`, { withCredentials: true });
        setCompanies(companies.filter(company => company._id !== id));
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  return (
    <div className="my_applications page">
      <div className="container">
        <Link to="/job/add-company">
          <FontAwesomeIcon icon={faPlus} />
        </Link>

        <table id="customers">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          {companies.length > 0 ? (
            <tbody>
              {companies.map(company => (
                <tr key={company._id}>
                  <td>{company.title}</td>
                  <td>{company.email}</td>
                  <td>{company.city}</td>
                  <td>
                    <Link to={`/job/edit-company/${company._id}`}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <FontAwesomeIcon icon={faEye} />
                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(company._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="4">Not available</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default CompanyTable;
