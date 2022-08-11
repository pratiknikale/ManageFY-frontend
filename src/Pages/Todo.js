import {useEffect, useState, createContext} from "react";
import "../styles/todoTask.css";
import {deleteItem, updateSubTaskStatus, getManagerList, getEdit} from "../services/api";
import {Card, Container, Row, Col, Modal} from "react-bootstrap";
import {css} from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";
import TaskCards from "../mycomponents/TaskCards";
import {useSelector, useDispatch} from "react-redux";
import {setAllTasksFetched, fetchAsyncMyAllTasks} from "../features/todoTasks/tasksSlice";
import NewTaskForm from "../mycomponents/myTask-ass/NewTaskForm";
import TaskEditForm from "../mycomponents/myTask-ass/TaskEditForm";

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
  sub_tasks: [],
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
  const dispatch = useDispatch();

  //  useSelectors start
  const allTasksFetched = useSelector((state) => state.todoTask.allTasksFetched);
  //  useSelectors end

  // useStates start
  const [editID, setEditID] = useState(""); // setting task id to edit
  const [Etask, setETask] = useState(initialEditValue); // edit task form values
  const [EtaskEditIndex, setEtaskEditIndex] = useState();
  const [managerList, setManagerList] = useState([]);
  const [show, setShow] = useState(false); // model hide/show
  // useStates End

  // loaders start
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState([]);
  const [delTaskLoading, setDelTaskLoading] = useState([]);
  const [EditLoader, setEditLoader] = useState(false);
  const [EditLoaderID, setEditLoaderID] = useState();
  // loaders end

  useEffect(() => {
    if (!allTasksFetched) {
      dispatch(fetchAsyncMyAllTasks()).then(() => {
        setLoading(false);
      });
      dispatch(setAllTasksFetched());
    } else {
      setLoading(false);
    }
    getAllManagerList();

    window.scrollTo({top: 0, left: 0});
  }, []);

  const getAllManagerList = async () => {
    const response = await getManagerList();
    setManagerList(response.data);
  };

  const handleClose = () => {
    setEtaskEditIndex();
    setShow(false);
  };

  const handleShow = async (Task, index) => {
    setEditLoaderID(index);
    setEditLoader(true);
    setEtaskEditIndex(index);
    setEditID(Task._id);
    await getEdit(Task._id).then((res) => {
      setETask(res.data);
      setShow(true);
      setEditLoaderID();
      setEditLoader(false);
    });
  };

  // task deleting
  const deleteitem = async (id, i) => {
    let isDelloading = delTaskLoading.slice();
    isDelloading[i] = true;
    setDelTaskLoading(isDelloading);
    await deleteItem(id).then(async (result) => {
      console.log(result);
      dispatch(fetchAsyncMyAllTasks()).then(() => {
        let isDelloading = delTaskLoading.slice();
        isDelloading[i] = false;
        setDelTaskLoading(isDelloading);
      });
    });
  };

  const toggleStatus = async (e, id, sTsk, i) => {
    //REVISIT .......can be better

    // console.log(i);
    let isloading = btnLoading.slice();
    isloading[id + i] = true;
    setBtnLoading(isloading);

    let StatusNew = sTsk[e.target.id].status === "pending" ? "done" : "pending";
    let STaskNew = sTsk[e.target.id].stask;

    updateSubTaskStatus(id, StatusNew, STaskNew, i)
      .then(() => dispatch(fetchAsyncMyAllTasks()))
      .then(() => {
        let isloading = btnLoading.slice();
        isloading[id + i] = false;
        setBtnLoading(isloading);
      });
  };

  return (
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white"}}>Tasks</h4>

      <Container fluid style={{marginBottom: "50px", maxWidth: "94%", flex: "1 0 auto"}}>
        {loading ? (
          <ClockLoader loading={loading} speedMultiplier={5} color={"white"} css={override} size={130} />
        ) : (
          <Row>
            <TaskCardsContext.Provider
              value={{
                EditLoaderID,
                EditLoader,
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
              <Card style={{backgroundColor: "#1d2124", borderRadius: "20px"}}>
                <Card.Body>
                  <Card.Title
                    style={{
                      backgroundColor: "#181818",
                      color: "white",
                      padding: "0.6rem",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "20px",
                    }}
                  >
                    Add New Task
                  </Card.Title>
                  <Card.Text as={Col}>
                    <NewTaskForm initialCreateValue={initialCreateValue} />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Modal size="lg" variant="dark" show={show} onHide={handleClose} centered>
          <Modal.Header
            style={{display: "block", backgroundColor: "#1d2124", color: "white", borderBottom: "1px solid black"}}
          >
            <Modal.Title>Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{backgroundColor: "#1d2124", color: "white"}}>
            <TaskEditForm
              editID={editID}
              Etask={Etask}
              setETask={setETask}
              EtaskEditIndex={EtaskEditIndex}
              handleClose={handleClose}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Todo;
