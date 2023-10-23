import { ErrorMessage, Field } from "formik";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import InputErrorMessage from "../kyc/InputErrorMessage";
import FieldInfo from "./FieldInfo";

function FormControl(props) {
  const {
    info,
    label,
    type,
    name,
    breakFieldToNewLine,
    className,
    onChange,
    isLoading,
    reff,
    labelColClass,
    fieldColClass,
    ...rest
  } = props;

  return (
    <Form.Group
      className={`my-2 my-md-1 row align-items-center ${
        className ? className : ""
      }`}
      style={{ position: "relative" }}
    >
      <Form.Label
        htmlFor={name}
        className={`px-0 pe-md-3 ${
          labelColClass
            ? labelColClass
            : "col-10 col-md-4 justify-content-md-end"
        } d-flex justify-content-start align-items-center text-md-end`}
      >
        {label}
      </Form.Label>

      {info && (
        <FieldInfo
          info={info}
          classes="d-inline d-md-none m-0 p-0 w-auto"
          // style={{ position: "absolute", right: "-50px", width: "auto" }}
        />
      )}

      {breakFieldToNewLine && <br />}

      {type !== "file" ? (
        <>
          {type === "tel" && (
            <input
              value="+91"
              disabled
              className="col-2 text-center"
              style={{ borderRight: "none" }}
            />
          )}

          <Field
            id={name}
            type={type}
            name={name}
            // className="col-12 col-md-8"
            className={`${
              type === "tel"
                ? "col-10 col-md-6"
                : fieldColClass
                ? fieldColClass
                : "col-12 col-md-8"
            }`}
            innerRef={reff}
            {...rest}
          />
        </>
      ) : (
        <div className={`file-ip-div col-12 col-md-8 p-0`}>
          <Field>
            {fieldProps => {
              return (
                <>
                  <input
                    disabled={isLoading || rest.disabled}
                    id={name}
                    type="file"
                    name={name}
                    onChange={
                      onChange
                        ? event => onChange(event, fieldProps)
                        : event => {
                            fieldProps.form.setFieldValue(
                              name,
                              event.currentTarget.files[0]
                            );
                          }
                    }
                    ref={reff}
                    {...rest}
                  />

                  {!isLoading ? (
                    <span className="upload-icon">
                      <FileUploadOutlinedIcon fontSize="large" />
                    </span>
                  ) : (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                </>
              );
            }}
          </Field>
        </div>
      )}

      {info && (
        <FieldInfo
          info={info}
          classes="d-none d-md-inline-flex align-items-center m-0 p-0 h-100"
          styles={{ position: "absolute", right: "-50px", width: "auto" }}
        />
      )}

      <ErrorMessage component={InputErrorMessage} name={name} />
    </Form.Group>
  );
}

export default FormControl;
