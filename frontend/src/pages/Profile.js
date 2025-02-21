import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, ListGroup, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Use backend URL from environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(`${API_BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTasks();
  }, [user, navigate]);

  // ✅ Handle Task Completion
  const completeTask = async (taskId) => {
    const confirm = window.confirm("Mark this task as completed?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Remove the completed task from the list
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  // ✅ Handle Create New Task
  const createTask = async (e) => {
    e.preventDefault();
    setShowModal(false);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE_URL}/api/tasks`,
        { ...newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks([...tasks, data]); // ✅ Add new task to the list
      setNewTask({ title: "", description: "" }); // ✅ Reset form fields
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <Container className="mt-5 d-flex flex-column align-items-center">
      <Card className="shadow-lg p-4" style={{ width: "500px" }}>
        <h2 className="text-center">Welcome, {user?.name}</h2>
        <p className="text-center">Email: {user?.email}</p>
        
        <h4 className="mt-4">Your Tasks:</h4>
        {loading ? (
          <Spinner animation="border" />
        ) : tasks.length > 0 ? (
          <ListGroup>
            {tasks.map((task) => (
              <ListGroup.Item 
                key={task._id} 
                action 
                onClick={() => completeTask(task._id)} // ✅ Clickable task
                className="d-flex justify-content-between align-items-center"
              >
                <strong>{task.title}</strong>
                <span className="text-muted">{task.description}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No tasks found</p>
        )}

        {/* ✅ Create Task Button */}
        <Button variant="primary" className="mt-3 w-100" onClick={() => setShowModal(true)}>
          + Create Task
        </Button>

        {/* ✅ Logout Button */}
        <Button 
          variant="danger" 
          className="mt-3" 
          onClick={handleLogout} 
          style={{ width: "150px", alignSelf: "center" }} 
        >
          Logout
        </Button>
      </Card>

      {/* ✅ Create Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createTask}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Task title" 
                value={newTask.title} 
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Task description" 
                value={newTask.description} 
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                required 
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Add Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;
