// import {useState, useEffect} from "react";
import {Button, Form, Col, Modal} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
// import {css} from "@emotion/react";

// const btnoverride = css`
//   display: inline-block;
//   margin-right: 6px;
// `;

const UserEdit = (props) => {
  //   useEffect(() => {
  //     getAllManagerList().then(() => {
  //       setIsNewManagerLoadingList(false);
  //     });
  //   }, []);

  return (
    <Modal size="lg" variant="dark" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => props.handleUserEditSubmit(e)} onChange={(e) => props.onUserEditChange(e)}>
          <Form.Row>
            <Form.Group as={Col} md="12">
              <Form.Label>
                <b>First Name</b>
              </Form.Label>
              <Form.Control
                name="firstName"
                defaultValue={props.editUser.firstName}
                required
                type="text"
                placeholder="First Name"
              />
            </Form.Group>
            <Form.Group as={Col} md="12">
              <Form.Label>
                <b>Last Name</b>
              </Form.Label>
              <Form.Control
                name="lastName"
                defaultValue={props.editUser.lastName}
                required
                type="text"
                placeholder="Last Name"
              />
            </Form.Group>

            <Form.Group as={Col} md="12">
              <Form.Label>
                <b>Role</b>
              </Form.Label>
              <Form.Control as="select" name="role" defaultValue={props.editUser.role} placeholder="Role" required>
                <option>manager</option>
                <option>employee</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>
          {props.saveEditUserLoading ? (
            <Button
              style={{float: "right", marginLeft: "0.8rem", display: "flex", alignItems: "center"}}
              disabled
              variant="success"
            >
              <ClipLoader
                loading={props.saveEditUserLoading}
                speedMultiplier={2}
                color={"white"}
                css={props.btnoverride}
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
          <Button style={{float: "right", marginLeft: "0.8rem"}} variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserEdit;
