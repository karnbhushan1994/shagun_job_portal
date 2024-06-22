import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const AddCompany = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState("");
    const [logo, setLogo] = useState(null);
    const [email, setEmail] = useState("");
    const [tag, setTag] = useState("");

    const { isAuthorized, user } = useContext(Context);
    const navigateTo = useNavigate();

    useEffect(() => {
        if (!isAuthorized || (user && user.role !== "Employer")) {
            navigateTo("/");
        }
    }, [isAuthorized, user, navigateTo]);

    const handleJobPost = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("url", url);
        formData.append("country", country);
        formData.append("city", city);
        formData.append("location", location);
        formData.append("logo", logo);
        formData.append("email", email);
        formData.append("tag", tag);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/v1/company/post",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success(res.data.message);
            navigateTo("/job/company");  // Redirect to company page
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    return (
        <>
            <Toaster />
            <div className="job_post page">
                <div className="container">
                    <h3>POST NEW COMPANY</h3>
                    <form onSubmit={handleJobPost}>
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
                             <div className="wrapper"><input
                                type="file"
                                onChange={(e) => setLogo(e.target.files[0])}
                                placeholder="Company Logo"
                            /></div>
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
                        <button type="submit">Create Company</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddCompany;
