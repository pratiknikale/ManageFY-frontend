import {useContext} from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import {TaskCardsContext} from "../Pages/Todo";
// import { Scrollbar } from "react-scrollbars-custom";

const TaskCards = () => {
  const {lists, btnLoading, delTaskLoading, btnoverride, deleteitem, toggleStatus, handleShow} =
    useContext(TaskCardsContext);

  return (
    <>
      {lists.map((list, i) => (
        <Col key={i} xs={12} sm={12} md={12} lg={6} style={{marginBottom: "30px"}}>
          <Card key={i} style={{borderStyle: "solid", borderWidth: "2px", borderRadius: "20px"}}>
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body key={i}>
              <Card.Title
                style={{
                  backgroundColor: "#80808017",
                  padding: "0.6rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {list.task_name}
                <span className="text-muted" style={{fontSize: "14px"}}>
                  <strong style={{marginRight: "10px"}}>Created at:</strong>
                  {moment(list.updated_at).fromNow()}
                </span>
              </Card.Title>
              <Card.Text as={Col}>
                <p>
                  <b>Discription:</b>
                </p>
                <p>{list.task}</p>

                <p>
                  <b>Status:</b>
                </p>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Sub Task</th>
                      <th>Status</th>
                      <th colSpan="2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.sub_tasks && list.sub_tasks.length > [0] ? (
                      list.sub_tasks.map((subTask, i) => (
                        <tr key={i}>
                          <td>{subTask.stask}</td>
                          <td className={`text-${subTask.status === "done" ? "success" : "warning"}`}>
                            {subTask.status === "done" ? (
                              <i className="far fa-check-circle mr-2"></i>
                            ) : (
                              <i className="fas fa-exclamation-circle mr-2"></i>
                            )}
                            {subTask.status}
                          </td>
                          <td>
                            {btnLoading[list._id + i] ? (
                              <Button
                                style={{
                                  width: "180px",
                                  float: "right",
                                  display: "flex",
                                  alignItems: "center",
                                  inlineSize: "max-content",
                                }}
                                variant={`${subTask.status === "done" ? "success" : "warning"}`}
                                disabled
                              >
                                <ClipLoader
                                  loading={btnLoading}
                                  speedMultiplier={2}
                                  color={"white"}
                                  css={btnoverride}
                                  size={17}
                                />
                                Mark as {subTask.status === "done" ? "pending" : "done"}
                              </Button>
                            ) : (
                              <Button
                                id={`${i}`}
                                name="status"
                                style={{width: "180px", float: "right", inlineSize: "max-content"}}
                                onClick={(e) => toggleStatus(e, list._id, list.sub_tasks, i)}
                                variant={`${subTask.status === "done" ? "success" : "warning"}`}
                              >
                                Mark as {subTask.status === "done" ? "pending" : "done"}
                              </Button>
                            )}
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
                  <b>Assigned By: </b>
                  {list.assigneeName}
                </p>
              </Card.Text>

              {delTaskLoading[i] ? (
                <Button style={{marginRight: "0.8rem", float: "right"}} variant="danger" disabled>
                  <ClipLoader
                    loading={delTaskLoading}
                    speedMultiplier={2}
                    color={"white"}
                    css={btnoverride}
                    size={17}
                  />
                  <i className="fas fa-trash"></i>
                </Button>
              ) : (
                <Button
                  style={{marginRight: "0.8rem", float: "right"}}
                  variant="danger"
                  onClick={() => deleteitem(list._id, i)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              )}
              <Button
                style={{marginRight: "0.8rem", float: "right"}}
                variant="primary"
                onClick={() => handleShow(list._id)}
              >
                <i className="far fa-edit"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default TaskCards;
