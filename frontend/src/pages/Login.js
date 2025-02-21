import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

// Use the backend URL from the environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/users/login`, formData);
      localStorage.setItem("token", data.token); // Store token in local storage
      setUser(data); // Store user in context
      navigate("/profile"); // Redirect to Profile page
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">Login</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
