import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AlertDismissible({title,text, show, setShow}) {

  return (
    <>
      <Alert show={show} variant="success">
        <Alert.Heading>{title}</Alert.Heading>
        <p>
          {text}
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close me
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default AlertDismissible;