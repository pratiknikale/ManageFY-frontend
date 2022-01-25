import {useEffect, useState, createContext, useContext} from "react";
import {getList, deleteItem, insertItem, getEdit, editItem, updateStatus, getManagerList} from "../services/api";
import {Card, Button, Container, Row, Col, Form, Modal, InputGroup, FormControl} from "react-bootstrap";
import {css} from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";
import ClipLoader from "react-spinners/ClipLoader";
import TaskCards from "../mycomponents/TaskCards";
import {AppContext} from "../App";

// import { Scrollbar } from "react-scrollbars-custom";

export const TaskCardsContext = createContext(null);

const initialCreateValue = {
  taskName: "",
  discription: "",
  subTask: [],
  assignedBy: "private",
};

const initialEditValue = {
  task_name: "",
  task: "",
  sub_tasks: [{}],
  assignedBy: "",
};

const override = css`
  display: block;
  margin: 110px auto;
`;

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
`;

const Todo = () => {
  // const {isUser} = useContext(AppContext);
  const [lists, setList] = useState([]);
  const [editID, setEditID] = useState("");
  const [task, setTask] = useState(initialCreateValue);
  const [Etask, setETask] = useState(initialEditValue);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState([]);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [delTaskLoading, setDelTaskLoading] = useState([]);
  const [saveEditTaskLoading, setSaveEditTaskLoading] = useState(false);
  const [managerList, setManagerList] = useState([]);

  useEffect(() => {
    getAllList().then(() => {
      setLoading(false);
    });
    getAllManagerList();
  }, []);

  const handleClose = () => setShow(false);

  const handleShow = async (id) => {
    const response = await getEdit(id);
    setEditID(response.data._id);

    setETask(response.data);
    // console.log(Etask);
    setShow(true);
    console.log(managerList);
  };

  const getAllList = async () => {
    const response = await getList();
    // console.log(response.data);
    // const revData = response.data.reverse();
    setList(response.data);
  };

  const getAllManagerList = async () => {
    const response = await getManagerList();
    // const revData = response.data.reverse();
    setManagerList(response.data);
    // console.log(managerList);
  };

  const deleteitem = async (id, i) => {
    let isDelloading = delTaskLoading.slice();
    isDelloading[i] = true;
    setDelTaskLoading(isDelloading);
    await deleteItem(id).then(async (result) => {
      getAllList().then(() => {
        let isDelloading = delTaskLoading.slice();
        isDelloading[i] = false;
        setDelTaskLoading(isDelloading);
      });
    });
  };

  const onValueChange = (e) => {
    e.preventDefault();

    if (["status", "stask"].includes(e.target.name)) {
      let subTask = [...task.subTask];
      subTask[e.target.id][e.target.name] = e.target.value;
      setTask({...task, subTask});
    } else {
      setTask({...task, [e.target.name]: e.target.value});
    }

    // console.log(task);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (task.taskName === "" || task.discription === "") {
      alert("Enter valid Task and Task Name");
    } else {
      setCreateTaskLoading(true);
      insertItem(task).then(() => {
        getAllList().then(() => {
          setTask({...task, taskName: "", discription: "", subTask: []});
          setCreateTaskLoading(false);
          document.getElementById("discription").value = "";
          document.getElementById("taskName").value = "";
          document.getElementById("assignedBy").value = "";
        });
      });
    }
  };

  const onEditChange = (e) => {
    e.preventDefault();

    if (["stask"].includes(e.target.name)) {
      let sub_tasks = [...Etask.sub_tasks];
      sub_tasks[e.target.id][e.target.name] = e.target.value;
      setETask({...Etask, sub_tasks});
    } else {
      setETask({...Etask, [e.target.name]: e.target.value});
    }
    console.log(Etask);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSaveEditTaskLoading(true);
    editItem(editID, Etask).then(() => {
      getAllList().then(() => {
        handleClose();
        setSaveEditTaskLoading(false);
        setETask({...Etask, taskName: "", discription: ""});
      });
    });
  };

  const addSubTask = (event) => {
    event.preventDefault();
    setTask({...task, subTask: [...task.subTask, {status: "pending", stask: ""}]});
  };

  const delSubTask = (e, i) => {
    e.preventDefault();
    task.subTask.splice(i, 1);
    setTask({subTask: task.subTask});
  };

  const addNewEditFormSubTask = (event) => {
    event.preventDefault();
    setETask({...Etask, sub_tasks: [...Etask.sub_tasks, {status: "pending", stask: ""}]});
  };

  const delEditFormSubTask = (e, i) => {
    e.preventDefault();
    Etask.sub_tasks.splice(i, 1);
    setETask({sub_tasks: Etask.sub_tasks});
  };

  const toggleStatus = async (e, id, sTsk, i) => {
    //REVISIT .......can be better

    // console.log(i);
    let isloading = btnLoading.slice();
    isloading[id + i] = true;
    setBtnLoading(isloading);

    let StatusNew = sTsk[e.target.id].status === "pending" ? "done" : "pending";
    let STaskNew = sTsk[e.target.id].stask;

    updateStatus(id, StatusNew, STaskNew, i)
      .then(() => getAllList())
      .then(() => {
        let isloading = btnLoading.slice();
        isloading[id + i] = false;
        setBtnLoading(isloading);
      });
  };
  return (
    // <Scrollbar style={{ width: "100%", height: "100%" }}>
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white"}}>Tasks</h4>

      {/* <hr
style={{
backgroundColor: "white",
marginBottom: "40px",
width: "70%",
border: "0",
height: "1px",
backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))",
}}
/> */}
      <Container fluid style={{marginBottom: "100px", height: "100%", maxWidth: "94%"}}>
        {loading ? (
          <ClockLoader loading={loading} speedMultiplier={5} color={"white"} css={override} size={130} />
        ) : (
          <Row>
            <TaskCardsContext.Provider
              value={{
                lists,
                btnLoading,
                delTaskLoading,
                btnoverride,
                deleteitem,
                toggleStatus,
                handleShow,
              }}
            >
              <TaskCards />
            </TaskCardsContext.Provider>

            <Col xs={12} sm={12} md={12} lg={6} style={{marginBottom: "30px"}}>
              <Card style={{borderStyle: "solid", borderWidth: "2px", borderRadius: "20px"}}>
                <Card.Body>
                  <Card.Title
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "0.6rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Add New Task
                  </Card.Title>
                  <Card.Text as={Col}>
                    <Form onSubmit={(e) => handleCreateSubmit(e)} onChange={(e) => onValueChange(e)}>
                      <Form.Row>
                        <Form.Group as={Col} md="12">
                          <Form.Control id="taskName" name="taskName" required type="text" placeholder="Task Name" />
                        </Form.Group>
                        <Form.Group as={Col} md="12">
                          <Form.Control
                            id="discription"
                            name="discription"
                            required
                            type="text"
                            placeholder="Discription"
                            as="textarea"
                          />
                        </Form.Group>
                        <Form.Group as={Col} md="12">
                          <Form.Label>Add sub tasks:</Form.Label>
                          {/* <p style={{width: "100%"}}>Add sub tasks:</p> */}

                          {task.subTask.map((subtask, i) => {
                            return (
                              <InputGroup className="my-2" as={Col} md="12" key={i}>
                                <FormControl
                                  id={`${i}`}
                                  name="stask"
                                  type="text"
                                  placeholder="Task Name"
                                  aria-label="Recipient's username"
                                  aria-describedby="basic-addon2"
                                  required
                                />
                                <Button
                                  onClick={(e) => delSubTask(e, i)}
                                  variant="outline-secondary"
                                  id="button-addon2"
                                >
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </InputGroup>
                            );
                          })}
                          <br />
                          <Button variant="light" onClick={addSubTask}>
                            <i className="far fa-plus-square mr-2"></i>Add
                          </Button>
                        </Form.Group>
                        <br />
                        <Form.Group as={Col} md="12">
                          <Form.Label>Assigned By:</Form.Label>
                          <Form.Control
                            as="select"
                            name="assignedBy"
                            id="assignedBy"
                            placeholder="Assigned by"
                            required
                          >
                            <option disabled>Select Assignee</option>
                            <option value="private">Private</option>
                            {managerList.map((mlist, i) => (
                              <option value={mlist._id} key={mlist._id}>
                                {mlist.firstName} {mlist.lastName}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      {createTaskLoading ? (
                        <Button
                          style={{marginBottom: "15px", float: "right", display: "flex", alignItems: "center"}}
                          variant="success"
                          type="submit"
                          disabled
                        >
                          <ClipLoader
                            loading={createTaskLoading}
                            speedMultiplier={2}
                            color={"white"}
                            css={btnoverride}
                            size={17}
                          />
                          Creating...
                        </Button>
                      ) : (
                        <Button style={{marginBottom: "15px", float: "right"}} variant="success" type="submit">
                          Create
                        </Button>
                      )}
                    </Form>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Modal size="lg" variant="dark" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => handleEditSubmit(e)} onChange={(e) => onEditChange(e)}>
              <Form.Row>
                <Form.Group as={Col} md="12">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control
                    name="task_name"
                    defaultValue={Etask.task_name}
                    required
                    type="text"
                    placeholder="Task Name"
                  />
                </Form.Group>
                <Form.Group as={Col} md="12">
                  <Form.Label>Discription</Form.Label>
                  <Form.Control
                    name="task"
                    defaultValue={Etask.task}
                    required
                    type="text"
                    placeholder="Discription"
                    as="textarea"
                  />
                </Form.Group>

                <Form.Group as={Col} md="12">
                  <Form.Label>Sub tasks:</Form.Label>

                  {Etask.sub_tasks.map((subtask, i) => {
                    return (
                      <InputGroup className="my-2" key={i}>
                        <FormControl
                          id={`${i}`}
                          name="stask"
                          type="text"
                          defaultValue={subtask.stask}
                          required
                          placeholder="Task Name"
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                        />
                        <Button
                          onClick={(e) => delEditFormSubTask(e, i)}
                          variant="outline-secondary"
                          id="button-addon2"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </InputGroup>
                    );
                  })}
                  <br />
                  <Button variant="light" onClick={addNewEditFormSubTask}>
                    <i className="far fa-plus-square mr-2"></i>Add new
                  </Button>
                </Form.Group>
                <br />
                <Form.Group as={Col} md="12">
                  <Form.Label>Assigned By:</Form.Label>
                  <Form.Control as="select" name="assignedBy" placeholder="Assigned by" required>
                    <option></option>
                    <option value="private">Private</option>
                    {managerList.map((mlist, i) => (
                      <option value={mlist._id} key={mlist._id}>
                        {mlist.firstName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              {saveEditTaskLoading ? (
                <Button
                  style={{float: "right", marginLeft: "0.8rem", display: "flex", alignItems: "center"}}
                  disabled
                  variant="success"
                >
                  <ClipLoader
                    loading={saveEditTaskLoading}
                    speedMultiplier={2}
                    color={"white"}
                    css={btnoverride}
                    size={17}
                  />
                  <i className="fas fa-save mr-2"></i>
                  Saving...
                </Button>
              ) : (
                <Button style={{float: "right", marginLeft: "0.8rem"}} variant="success" type="submit">
                  <i className="fas fa-save mr-2"></i>
                  Save Changes
                </Button>
              )}
              <Button style={{float: "right", marginLeft: "0.8rem"}} variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
    // </Scrollbar>
  );
};

export default Todo;
