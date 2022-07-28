import {useState, useEffect} from "react";
import {managerSignup, getManagerList, getEditUser, EditUser, DeleteUser, SearchUser} from "../services/api";
import {Button, Container, Form, Table, FormControl, Row, Col, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";
import UserEdit from "../mycomponents/UserEdit";

const defaultFormFields = {
  FirstName: "",
  LastName: "",
  Email: "",
  Password: "",
  Role: "manager",
};

const initialUserEditValue = {
  id: "",
  firstName: "",
  lastName: "",
  role: "",
};

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
`;

const ManageManager = () => {
  const navigate = useNavigate();
  const [MFormData, setMFormData] = useState(defaultFormFields);
  // const [search, setSearch] = useState("");
  const [isNewManagerLoadingBtn, setIsNewManagerLoadingBtn] = useState(false);
  const [isNewManagerLoadingList, setIsNewManagerLoadingList] = useState(true);
  const [managerList, setManagerList] = useState([]);
  const [show, setShow] = useState(false);
  const [editUser, setEditUser] = useState(initialUserEditValue);
  const [saveEditUserLoading, setSaveEditUserLoading] = useState(false);

  useEffect(() => {
    getAllManagerList().then(() => {
      setIsNewManagerLoadingList(false);
    });

    window.scrollTo({top: 0, left: 0});
  }, []);

  const getAllManagerList = async () => {
    const {data} = await getManagerList();
    // const revData = response.data.reverse();
    setManagerList(data);
    // console.log(response.status);
  };

  const onFieldChange = (e) => {
    setMFormData({...MFormData, [e.target.name]: e.target.value});
    // console.log(MFormData);
  };

  const onSearchChange = async (e) => {
    const search = e.target.value;
    const SearchRole = e.target.name;
    // setSearch(e.target.value);
    const {data} = await SearchUser(search, SearchRole);
    setManagerList(data);
    // console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(MFormData);
    setIsNewManagerLoadingBtn(true);
    managerSignup(MFormData).then(() => {
      setIsNewManagerLoadingBtn(false);

      getAllManagerList().then(() => {
        const Form = document.getElementsByClassName("resetForm");
        Form[0].value = "";
        Form[1].value = "";
        Form[2].value = "";
        Form[3].value = "";
      });
    });
  };

  const handleClose = () => setShow(false);

  const handleShow = async (id) => {
    const response = await getEditUser(id);

    setEditUser(response.data);
    // console.log(response.data);
    setShow(true);
  };

  const onUserEditChange = (e) => {
    e.preventDefault();

    setEditUser({...editUser, [e.target.name]: e.target.value});
  };

  const handleUserEditSubmit = (e) => {
    e.preventDefault();
    setSaveEditUserLoading(true);
    EditUser(editUser).then(() => {
      getAllManagerList().then(() => {
        handleClose();
        setSaveEditUserLoading(false);
      });
    });
  };

  const deleteUser = async (id, i) => {
    var answer = window.confirm("Are you sure? All the data for selected user will be deleted");
    if (answer) {
      // let isDelloading = delTaskLoading.slice();
      // isDelloading[i] = true;
      // setDelTaskLoading(isDelloading);
      await DeleteUser(id).then(async (result) => {
        getAllManagerList().then(() => {
          getAllManagerList();
          //   let isDelloading = delTaskLoading.slice();
          //   isDelloading[i] = false;
          //   setDelTaskLoading(isDelloading);
        });
      });
    }
  };
  return (
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white", flex: "1 0 auto"}}>
        Managers Section
      </h4>

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
      <Container style={{marginBottom: "170px"}}>
        <div className="my-2">
          <Form inline style={{display: "inline-flex"}}>
            <FormControl
              onChange={(e) => onSearchChange(e)}
              type="text"
              placeholder="Search"
              style={{width: "400px"}}
              className="mr-sm-2"
              name="manager"
              autoComplete="off"
            />
            {/* <Button variant="outline-success">Search</Button> */}
          </Form>
          <Button className="float-right" variant="outline-light">
            Create new manager profile
          </Button>{" "}
        </div>
        <Table bordered hover variant="dark">
          <thead>
            <tr>
              <th style={{width: "12%"}}>#</th>
              <th style={{width: "58%"}}>Manager Name</th>
              <th style={{width: "32%"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isNewManagerLoadingList ? (
              <tr>
                <td colSpan="3" style={{textAlign: "center"}}>
                  <ClipLoader
                    loading={isNewManagerLoadingList}
                    speedMultiplier={2}
                    color={"white"}
                    css={btnoverride}
                    size={25}
                  />
                </td>
              </tr>
            ) : (
              <>
                {managerList.map((MList, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      {MList.firstName} {MList.lastName}
                    </td>
                    <td>
                      <Button
                        className="float-right mx-2"
                        variant="outline-danger"
                        onClick={() => deleteUser(MList._id, i)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                      <Button className="float-right mx-2" variant="primary" onClick={() => handleShow(MList._id)}>
                        <i className="far fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>

        <h4 style={{marginTop: "50px", textAlign: "center", color: "white"}}>Create New Manager Account</h4>

        <Form className="signinupForm" style={{marginTop: "50px"}} onSubmit={(e) => handleSubmit(e)}>
          <Row>
            <Col sm={6}>
              <Form.Group controlId="formBasicFirstName">
                <Form.Label className="authFormLabels">First Name</Form.Label>
                <Form.Control
                  onChange={(e) => onFieldChange(e)}
                  className="resetForm"
                  name="FirstName"
                  type="text"
                  defaultValue=""
                  placeholder="Enter First Name"
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group controlId="formBasicLastName">
                <Form.Label className="authFormLabels">Last Name</Form.Label>
                <Form.Control
                  onChange={(e) => onFieldChange(e)}
                  className="resetForm"
                  name="LastName"
                  type="text"
                  defaultValue=""
                  placeholder="Enter Last Name"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formBasicEmail">
            <Form.Label className="authFormLabels">Email address</Form.Label>
            <Form.Control
              onChange={(e) => onFieldChange(e)}
              className="resetForm"
              name="Email"
              type="email"
              defaultValue=""
              placeholder="Enter email"
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label className="authFormLabels">Password</Form.Label>
            <Form.Control
              onChange={(e) => onFieldChange(e)}
              className="resetForm"
              name="Password"
              type="password"
              defaultValue=""
              placeholder="Password"
              required
            />
          </Form.Group>
          <hr className="authDivider" />

          <Button className="authFormBtns2" variant="primary" type="submit" disabled={isNewManagerLoadingBtn}>
            {isNewManagerLoadingBtn && (
              <ClipLoader
                loading={isNewManagerLoadingBtn}
                speedMultiplier={2}
                color={"white"}
                css={btnoverride}
                size={17}
              />
            )}
            {isNewManagerLoadingBtn ? "Submiting..." : "Submit"}
          </Button>
        </Form>

        <UserEdit
          show={show}
          handleClose={handleClose}
          btnoverride={btnoverride}
          handleUserEditSubmit={handleUserEditSubmit}
          onUserEditChange={onUserEditChange}
          editUser={editUser}
          saveEditUserLoading={saveEditUserLoading}
        />
      </Container>
    </>
  );
};

export default ManageManager;
