import {useContext, useRef, useEffect, useState} from "react";
import "../styles/todoTask.css";
import {updateFullTaskStatus} from "../services/api";
import {Card, Button, Col, Table} from "react-bootstrap";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import {TaskCardsContext} from "../Pages/Todo";
import {useSelector, useDispatch} from "react-redux";
import lottie from "lottie-web";
import {setFullTaskStatus} from "../features/todoTasks/tasksSlice";

const TaskCards = () => {
  const dispatch = useDispatch();

  // useSelector start
  const allTasks = useSelector((state) => state.todoTask.allTasks);
  // useSelector end
  const {EditLoaderID, EditLoader, btnLoading, delTaskLoading, btnoverride, deleteitem, toggleStatus, handleShow} =
    useContext(TaskCardsContext);

  const AnimatedTaskImage = useRef(null);

  const [fullTaskStatusToggle, setFullTaskStatusToggle] = useState("pending");
  const [fullTaskStatusBtnLoading, setfullTaskStatusBtnLoading] = useState([]);

  useEffect(() => {
    lottie.loadAnimation({
      container: AnimatedTaskImage.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../config/lottieMyTask.json"),
    });
  }, []);

  const toggleTaskStatus = async (task, index) => {
    let status = task.status === "pending" ? "done" : "pending";
    console.log(status);
    let isTaskStatusToggle = fullTaskStatusBtnLoading.slice();
    isTaskStatusToggle[index] = true;
    setfullTaskStatusBtnLoading(isTaskStatusToggle);
    await updateFullTaskStatus(task._id, status).then(async (result) => {
      dispatch(setFullTaskStatus(result.data));
      let isTaskStatusToggle = fullTaskStatusBtnLoading.slice();
      isTaskStatusToggle[index] = false;
      setfullTaskStatusBtnLoading(isTaskStatusToggle);
    });
  };

  return (
    <>
      {allTasks.length < 1 ? (
        <Col xs={12} sm={12} md={12} lg={6} style={{marginBottom: "30px"}}>
          <Card
            style={{
              backgroundColor: "#495057",
              borderRadius: "20px",
              color: "grey",
              minHeight: "450px",
            }}
          >
            <Card.Body>
              <Card.Text
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div className="AnimatedTaskImage" ref={AnimatedTaskImage}></div>
                <p>
                  <b>You don't have any tasks.</b>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ) : (
        allTasks.map((task, i) => (
          <Col key={i} xs={12} sm={12} md={12} lg={6} style={{marginBottom: "30px"}}>
            <Card key={i} style={{borderRadius: "20px", backgroundColor: "#495057", color: "#c2c0c0"}}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
              <Card.Body key={i}>
                <Card.Title
                  style={{
                    backgroundColor: "#181818",
                    padding: "0.6rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "white",
                    borderRadius: "20px",
                  }}
                >
                  <span>
                    {task.task_name}
                    {task.status === "done" && (
                      <i style={{color: "green", marginLeft: "8px"}} className="far fa-check-circle mr-2"></i>
                    )}
                  </span>
                  <span className="text-muted" style={{fontSize: "14px"}}>
                    <strong style={{marginRight: "10px"}}>Created at:</strong>
                    {moment(task.updated_at).fromNow()}
                  </span>
                </Card.Title>
                <Card.Text as={Col}>
                  <p style={{color: "white"}}>
                    <b>Discription:</b>
                  </p>
                  <p style={{padding: "6px 6px 6px 20px", backgroundColor: "#343a40", borderRadius: "20px"}}>
                    {task.task}
                  </p>

                  <p style={{color: "white"}}>
                    <b>Status:</b>
                  </p>
                  <Table bordered hover variant="dark" style={{borderRadius: "20px", borderStyle: "hidden"}}>
                    <thead>
                      <tr>
                        <th>Sub Task</th>
                        <th>Status</th>
                        <th colSpan="2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {task.sub_tasks && task.sub_tasks.length > [0] ? (
                        task.sub_tasks.map((subTask, i) => (
                          <tr key={i}>
                            <td style={{color: "#d2d2d2"}}>{subTask.stask}</td>
                            <td className={`text-${subTask.status === "done" ? "success" : "warning"}`}>
                              {subTask.status === "done" ? (
                                <i className="far fa-check-circle mr-2"></i>
                              ) : (
                                <i className="fas fa-exclamation-circle mr-2"></i>
                              )}
                              {subTask.sttus}
                            </td>
                            <td>
                              <Button
                                id={`${i}`}
                                name="status"
                                style={{
                                  marginRight: "0.8rem",
                                  width: "180px",
                                  float: "right",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "20px",
                                }}
                                onClick={(e) => toggleStatus(e, task._id, task.sub_tasks, i)}
                                variant={`${subTask.status === "done" ? "success" : "warning"}`}
                              >
                                {btnLoading[task._id + i] && (
                                  <ClipLoader
                                    loading={btnLoading}
                                    speedMultiplier={2}
                                    color={"white"}
                                    css={btnoverride}
                                    size={17}
                                  />
                                )}
                                Mark as {subTask.status === "done" ? "pending" : "done"}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td colSpan="3" style={{textAlign: "center"}}>
                              No Subtask Available
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </Table>
                  <p>
                    <b style={{color: "white"}}>Assigned By : </b>
                    {task.assigneeName}
                  </p>
                </Card.Text>

                {/* toggle full task status btn start */}

                <Button
                  className="StatusToggleButtons"
                  variant={`${task.status === "done" ? "success" : "warning"}`}
                  onClick={() => toggleTaskStatus(task, i)}
                >
                  {fullTaskStatusBtnLoading[i] && (
                    <ClipLoader
                      loading={fullTaskStatusBtnLoading}
                      speedMultiplier={2}
                      color={"white"}
                      css={btnoverride}
                      size={17}
                    />
                  )}
                  <span>{task.status === "pending" ? "Set as done" : "Set as pending"}</span>
                </Button>

                {/*  toggle full task status btn end */}

                <Button // delete button
                  className="EditDeleteButtons"
                  variant="danger"
                  onClick={() => deleteitem(task._id, i)}
                >
                  {delTaskLoading[i] && (
                    <ClipLoader
                      loading={delTaskLoading}
                      speedMultiplier={2}
                      color={"white"}
                      css={btnoverride}
                      size={17}
                    />
                  )}
                  <i className="fas fa-trash"></i>
                </Button>
                <Button //edit button
                  className="EditDeleteButtons"
                  variant="primary"
                  onClick={() => handleShow(task, i)}
                >
                  {EditLoaderID === i && EditLoader && (
                    <ClipLoader loading={EditLoader} speedMultiplier={2} color={"black"} css={btnoverride} size={17} />
                  )}
                  <i className="far fa-edit"></i>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))
      )}
    </>
  );
};

export default TaskCards;
