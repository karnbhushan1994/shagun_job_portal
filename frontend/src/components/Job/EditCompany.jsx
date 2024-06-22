import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const EditCompany = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [tag, setTag] = useState("");

    const { isAuthorized, user } = useContext(Context);
    const navigate = useNavigate();
    const { id } = useParams();  // Get the company ID from URL parameters

    useEffect(() => {
        if (!isAuthorized || (user && user.role !== "Employer")) {
            navigate("/");
        }
    }, [isAuthorized, user, navigate]);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/v1/company/getCompany/${id}`, {
                    withCredentials: true,
                });
                setTitle(data.company.title);
                setDescription(data.company.description);
                setUrl(data.company.url);
                setCountry(data.company.country);
                setCity(data.company.city);
                setLocation(data.company.location);
                setEmail(data.company.email);
                setTag(data.company.tag);
            } catch (error) {
                toast.error("Failed to load company data");
            }
        };

        fetchCompany();
    }, [id]);

    const handleJobUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("url", url);
        formData.append("country", country);
        formData.append("city", city);
        formData.append("location", location);
        formData.append("email", email);
        formData.append("tag", tag);

        await axios
            .put(
                `http://localhost:5000/api/v1/company/company/${id}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((res) => {
                toast.success(res.data.message);
                navigate("/job/company");
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    return (
        <div className="job_post page">
            <div className="container">
                <h3>EDIT COMPANY</h3>
                <form onSubmit={handleJobUpdate}>
                    <div className="wrapper">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Company Name"
                        />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Company Url"
                        />
                    </div>
                    <div className="wrapper">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div className="wrapper">
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                        />
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                        />
                    </div>
                    <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="Tag"
                    />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                    />
                    <textarea
                        rows="10"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Company Description"
                    />
                    <button type="submit">Update Company</button>
                </form>
            </div>
        </div>
    );
};

export default EditCompany;
