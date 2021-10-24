import React, { useContext } from "react";
import NoteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  return (
    <div className=" col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{props.note.title}</h5>
            <i
              className="fas fa-trash-alt mx-2"
              onClick={() => {
                deleteNote(props.note._id);
                props.showAlert("Deleted Successfully", "success");
              }}
            ></i>
            <i
              className="fas fa-edit mx-2"
              onClick={() => {
                props.updateNote(props.note);
              }}
            ></i>
          </div>
          <p className="card-text">{props.note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
