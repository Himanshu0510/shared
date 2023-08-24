import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "reactstrap";
import Translate from "../Translate";
import { InputTextarea } from "primereact/inputtextarea";
const AskReason = (prop: any) => {
  const [dataForm, setData] = useState(prop.data);
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(prop.visible);
  const [action, setAction] = useState(prop.action);
  const closeModal = () => {
    setVisible(false);
    prop.onClose();
  };

  useEffect(() => {
    console.log(prop);
  });
  const defaultValues = {
    ...dataForm,
    reasonForChange: "",
  };
  const getFormErrorMessage = (name: any) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const onSubmit = (data: any) => {
    data.reasonForChange = data.reasonForChange;
    const entity = {
      ...data,
      reasonForChange: data.reasonForChange,
    };

    prop.saveWithReason(entity, prop.deleteObject);
    prop.onClose();
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm({ defaultValues });
  return (
    <>
      <Dialog
        header={<Translate contentKey="reason"></Translate>}
        id={prop.id}
        visible={visible}
        onHide={closeModal}
        style={{ width: "30vw" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className="modal-content"
            style={{ overflow: "auto !important" }}
          >
            <Controller
              name="reasonForChange"
              control={control}
              rules={{ required: "Reason is required." }}
              render={({ field, fieldState }) => (
                <>
                  <label>
                    <Translate contentKey="reasonForConfirmation"></Translate> :{" "}
                    <span className="reqsign">*</span>
                  </label>

                  <InputTextarea
                    id={field.name}
                    value={field.value}
                    className={classNames("form-control", {
                      "p-invalid": fieldState.error,
                    })}
                    onChange={(e: any) => field.onChange(e.target.value)}
                    rows={3}
                    cols={30}
                  />

                  {/* <InputText
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error })}
                      onChange={e => field.onChange(e.target.value)}
                    /> */}
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
          </div>
          <div className="p-dialog-footer ">
            <Button
              label="Submit"
              id="askReason"
              type="submit"
              color={action == "delete" ? "danger" : "primary"}
              className="btnStyle"
              icon="pi pi-check"
            >
              {action == "delete" ? (
                <FontAwesomeIcon icon="times" />
              ) : (
                <FontAwesomeIcon icon="save" />
              )}
              {action == "delete" ? (
                <Translate contentKey="delete"></Translate>
              ) : (
                <Translate contentKey="home.save"></Translate>
              )}
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default AskReason;
