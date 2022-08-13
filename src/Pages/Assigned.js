import {useState, useEffect} from "react";
import {Button, Container, Form, Table, FormControl, Modal} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import {getEdit, SearchAssignedTask} from "../services/api";
import {css} from "@emotion/react";
import {fetchallAssignedTasks, allAssignedTasksOnSearch} from "../features/assignedTasks/assignedTaskSlice";
import {useSelector, useDispatch} from "react-redux";
import NewTaskForm from "../mycomponents/myTask-ass/NewTaskForm";
import TaskEditForm from "../mycomponents/myTask-ass/TaskEditForm";

const initialCreateValue = {
  taskName: "",
  discription: "",
  subTask: [],
  assignto: "",
  // assignedBy: "private",
};

const initialEditValue = {
  task_name: "",
  task: "",
  sub_tasks: [],
  assignto: "",
  // assignedBy: "",
};

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
`;

const Assigned = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const allAssignedTasks = useSelector((state) => state.assignedTask.allAssignedTasks);
  // const allAssignedTasksFetched = useSelector((state) => state.assignedTask.allAssignedTasksFetched);

  const [taskAssignModalShow, setTaskAssignModalShow] = useState(false); // modal asign task hide/show
  const [show, setShow] = useState(false); // Edit model hide/show
  const [editID, setEditID] = useState(""); // setting task id to edit
  const [Etask, setETask] = useState(initialEditValue); // edit task form values
  const [EtaskEditIndex, setEtaskEditIndex] = useState();
  const [SearchField, setSearchField] = useState(false);

  // loader
  const [viewEditLoader, setViewEditLoader] = useState(false);
  const [viewEditLoaderID, setViewEditLoaderID] = useState();
  // loader

  useEffect(() => {
    // if (!allAssignedTasksFetched) {
    dispatch(fetchallAssignedTasks({managerId: user.result._id}));
    //   dispatch(setAllAssignedTasksFetched());
    // }
    window.scrollTo({top: 0, left: 0});
  }, []);

  const handleShow = async (Task, index) => {
    setViewEditLoaderID(index);
    setViewEditLoader(true);
    setEtaskEditIndex(index);
    setEditID(Task._id);
    await getEdit(Task._id).then((res) => {
      setETask(res.data);
      setShow(true);
      setViewEditLoaderID();
      setViewEditLoader(false);
    });
  };

  const handleClose = () => {
    setEtaskEditIndex();
    setShow(false);
  };

  const onAssignedTaskSearchChange = async (e) => {
    const searchValue = e.target.value;
    searchValue.length > 0 ? setSearchField(true) : setSearchField(false);
    const {data} = await SearchAssignedTask(searchValue);
    dispatch(allAssignedTasksOnSearch(data));
  };

  const RestoreSearchResults = async () => {
    let SearchField = document.getElementById("SearchField");
    SearchField.value = "";
    setSearchField(false);
    const {data} = await SearchAssignedTask("");
    dispatch(allAssignedTasksOnSearch(data));
  };

  return (
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white"}}>Assigned Tasks</h4>

      <Container fluid style={{marginBottom: "170px", paddingLeft: "65px", paddingRight: "65px", flex: "1 0 auto"}}>
        <Form inline style={{display: "inline-flex", paddingBottom: "12px"}}>
          <FormControl
            onChange={(e) => onAssignedTaskSearchChange(e)}
            id="SearchField"
            name="assignedTask"
            type="text"
            placeholder="Search by Task, Assigned to or Status"
            style={{
              width: "400px",
              borderRadius: "20px",
              backgroundColor: "#343a40",
              borderStyle: "hidden",
              color: "white",
            }}
            className="mr-sm-2"
            autoComplete="off"
          />
          {SearchField && (
            <span
              id="clearSearch"
              style={{color: "grey", cursor: "pointer", marginLeft: "-36px"}}
              onClick={() => RestoreSearchResults()}
            >
              <b>X</b>
            </span>
          )}
        </Form>
        <Button
          onClick={() => setTaskAssignModalShow(true)}
          className="float-right"
          variant="light"
          style={{
            borderRadius: "20px",
            borderStyle: "hidden",
          }}
        >
          Assign new task
        </Button>
        <Table bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Task Name</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allAssignedTasks.map((assTask, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{assTask.task_name}</td>
                <td>{`${assTask.userID.firstName} ${assTask.userID.lastName}`}</td>
                <td style={{color: assTask.status === "pending" ? "yellow" : "green"}}>
                  <b>
                    {assTask.status}
                    {assTask.status === "done" && (
                      <i style={{color: "green", marginLeft: "8px"}} className="far fa-check-circle mr-2"></i>
                    )}
                  </b>
                </td>
                <td style={{display: "flex", justifyContent: "center"}}>
                  <Button
                    variant="light"
                    style={{
                      marginRight: "0.8rem",
                      float: "right",
                      display: "flex",
                      justifyContent: "center",
                      width: "130px",
                      alignItems: "center",
                      borderRadius: "20px",
                    }}
                    onClick={() => handleShow(assTask, i)}
                  >
                    {viewEditLoaderID === i && viewEditLoader && (
                      <ClipLoader
                        loading={viewEditLoader}
                        speedMultiplier={2}
                        color={"black"}
                        css={btnoverride}
                        size={17}
                      />
                    )}
                    View/Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* creat task to assign modal */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        variant="dark"
        style={{borderRadius: "20px"}}
        show={taskAssignModalShow}
        onHide={() => setTaskAssignModalShow(false)}
      >
        <Modal.Header
          style={{backgroundColor: "rgb(36 41 45)", color: "white", borderBottom: "1px solid black"}}
          closeButton
        >
          <Modal.Title>Assign Task</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: "rgb(36 41 45)"}}>
          <NewTaskForm initialCreateValue={initialCreateValue} />
          <Button
            style={{
              borderRadius: "20px",
              borderStyle: "hidden",
              float: "right",
              marginLeft: "0.8rem",
              marginRight: "10px",
              color: "red",
            }}
            variant="secondary"
            onClick={() => setTaskAssignModalShow(false)}
          >
            <b>Close</b>
          </Button>
        </Modal.Body>
      </Modal>

      {/* edit modal start */}
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
      {/* edit modal end */}
    </>
  );
};

export default Assigned;
