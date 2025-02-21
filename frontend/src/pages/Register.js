import { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Card, Toast, ToastContainer } from "react-bootstrap";

// Use backend URL from environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showToast, setShowToast] = useState(false);  // ✅ Track toast visibility
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, formData);
      setShowToast(true); // ✅ Show success toast
      
      // ✅ Clear form fields after successful registration
      setFormData({ name: "", email: "", password: "" });

    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center">Register</h2>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              placeholder="Enter name" 
              value={formData.name}  // ✅ Clear input fields
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              placeholder="Enter email" 
              value={formData.email}  // ✅ Clear input fields
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}  // ✅ Clear input fields
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">Register</Button>
        </Form>
      </Card>

      {/* ✅ Success Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast bg="success" show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
          <Toast.Body className="text-white">User registered successfully! 🎉</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Register;