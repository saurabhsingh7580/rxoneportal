import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form as FormikForm, Formik } from "formik";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import CloseIcon from "@mui/icons-material/Close";

import FormNav from "./FormNav";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { Col, Row } from "react-bootstrap";

const Form = props => {
  const {
    startItemNumber,
    type,
    formNavItems,
    setFormNavItems,
    initialValues,
    validationSchema,
    onSaveBtnClick,
    onSubmit,
    isLoading,
    areDocsSubmitted,
    redirectUrl,
    formPadding,
    changeStep,
    setChangeStep,
    jumpToStep,
    onHide,
  } = props;

  const [currentItemNumber, setCurrentItemNumber] = useState(
    startItemNumber || 1
  );
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaveAndNextLoading, setIsSaveAndNextLoading] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isMainDataSaved, setIsMainDataSaved] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const navigate = useNavigate();

  const wrapperClassName =
    formNavItems[currentItemNumber - 1].elementWrapperClassName;

  const eleFormClass = formNavItems[currentItemNumber - 1].eleFormClass;

  const Element = formNavItems[currentItemNumber - 1].element;

  const elementProps = formNavItems[currentItemNumber - 1].elementProps;

  useEffect(() => {
    if (changeStep && jumpToStep) {
      setFormNavItems(prevItems => {
        const arr = [...prevItems];
        arr[jumpToStep - 1].isActive = true;
        return arr;
      });
      setCurrentItemNumber(jumpToStep);
    }
  }, [changeStep, jumpToStep]);

  useEffect(() => {
    if (isFormSubmitted && !showToast) {
      navigate(redirectUrl + "?refresh=true", { replace: true });
    }
  }, [isFormSubmitted, showToast]);

  const handleSaveBtnClick = async formikProps => {
    setIsSaveLoading(true);

    const fieldIdentifier = formNavItems[currentItemNumber - 1].identifier;

    const values = formikProps.values[fieldIdentifier];
    let errorsCounter = 0;

    try {
      for (const value in values) {
        const errors = await formikProps.setFieldTouched(
          `${fieldIdentifier}.${value}`
        );

        if (
          // values[value] === "" ||
          (Array.isArray(values[value]) && values[value].length === 0) ||
          typeof values[value] === "undefined"
        ) {
          throw new Error("Please fill out all the fields before proceeding.");
        }

        if (typeof errors[fieldIdentifier] !== "undefined") {
          errorsCounter++;
          // formikProps.setFieldError(`${fieldIdentifier}.${value}`);
          // throw new Error(
          //   "Validation fail at " + `${fieldIdentifier}.${value}`
          // );
        }
      }

      if (errorsCounter === 0) {
        const res = await onSaveBtnClick(
          values,
          currentItemNumber,
          formikProps.setFieldError
        );

        if (res?.logout) {
          return null;
        }

        if (res.success) {
          if (currentItemNumber === 1) {
            setIsMainDataSaved(true);
          }

          setToastType("success");
          setShowToast(true);
          setToastMessage(res.message);

          return res;
        } else {
          throw new Error(res.message);
        }
      }
    } catch (error) {
      setToastType("error");
      setShowToast(true);
      setToastMessage(error.message);

      return null;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleSaveAndNextBtnClick = async formikProps => {
    setIsSaveAndNextLoading(true);

    const res = await handleSaveBtnClick(formikProps);

    if (res) {
      setFormNavItems(prevItems => {
        const arr = [...prevItems];
        arr[currentItemNumber].isActive = true;
        return arr;
      });
      setCurrentItemNumber(prevItemNumber => prevItemNumber + 1);
    }

    setIsSaveAndNextLoading(false);
  };

  const handleNavItem = itemNumber => {
    if (formNavItems[itemNumber - 1].isActive) {
      setFormNavItems(prevItems => {
        const arr = [...prevItems];

        for (let i = itemNumber + 1; i <= arr.length; i++) {
          arr[i - 1].isActive = false;
        }
        return arr;
      });
      setCurrentItemNumber(itemNumber);
    }
  };

  const handleCancelClick = () => {
    navigate(redirectUrl + "?refresh=true", { replace: true });
  };

  const handleSubmit = async values => {
    setIsFormSubmitting(true);

    try {
      const res = await onSubmit(values);

      if (res?.success) {
        setToastType("success");
        setShowToast(true);
        setToastMessage(res.message);
        setIsFormSubmitted(true);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      setToastType("error");
      setShowToast(true);
      setToastMessage(error.message);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleNextClick = () => {
    setFormNavItems(prevItems => {
      const arr = [...prevItems];
      arr[currentItemNumber].isActive = true;
      return arr;
    });
    setCurrentItemNumber(prevItemNumber => prevItemNumber + 1);
  };

  return (
    <>
      <div className="px-0 mx-0 mt-2 w-100 container-fluid">
        <Row className="mx-0 align-items-center">
          {type !== "Patient Form" && (
            <Col
              xs={12}
              md={type === "Book Appointment" ? 12 : 3}
              className="p-0"
            >
              <h1
                className={`h3 ${
                  type === "Book Appointment"
                    ? "d-flex align-items-center justify-content-between px-2"
                    : "text-center"
                }`}
                // style={{ borderBottom: "2px solid #00b0f0" }}
              >
                {type !== "Book Appointment" && type !== "Patient Form" && (
                  <span>{type}</span>
                )}

                {type === "Book Appointment" &&
                  (currentItemNumber === 1 ? (
                    type
                  ) : (
                    <span
                      className="fs-5"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        handleNavItem(currentItemNumber - 1);
                        setChangeStep(false);
                      }}
                    >
                      {"< Back"}
                    </span>
                  ))}

                {(type === "Book Appointment" || type === "Patient Form") && (
                  <span
                    onClick={onHide}
                    className="fs-3 h-100"
                    style={{ cursor: "pointer" }}
                  >
                    <CloseIcon />
                  </span>
                )}
              </h1>
            </Col>
          )}

          <Col
            xs={
              type !== "Book Appointment" && type !== "Patient Form" ? 11 : 12
            }
            md={type !== "Book Appointment" && type !== "Patient Form" ? 8 : 12}
            className="px-0"
          >
            <header
              className="py-3 px-2 mx-0 w-100"
              style={{ backgroundColor: "#00b0f0" }}
            >
              <h2 className="fs-5 text-white fw-normal">
                {formNavItems[currentItemNumber - 1].formHeading ||
                  "Fill all the required details before proceeding."}
              </h2>
            </header>
          </Col>

          {type !== "Book Appointment" && type !== "Patient Form" && (
            <Col xs={1} className="h-100">
              <div
                className="fs-3 h-100 text-center"
                onClick={handleCancelClick}
                style={{ cursor: "pointer" }}
              >
                <CloseIcon />
              </div>
            </Col>
          )}
        </Row>
      </div>

      <Container
        fluid
        className="pt-4"
        style={{ backgroundColor: "#f2f2f2", minHeight: "72vh" }}
      >
        {type !== "Book Appointment" && (
          <FormNav formNavItems={formNavItems} onNavItem={handleNavItem} />
        )}

        {!isLoading ? (
          <>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {formikProps => (
                // h-75
                <FormikForm
                  className={`d-flex flex-column align-items-center px-0 justify-content-between custom-form ${
                    eleFormClass ? eleFormClass : ""
                  }`}
                >
                  <div
                    className={`mt-2 ${
                      wrapperClassName ? wrapperClassName : ""
                    }`}
                  >
                    {/* {formNavItems[currentItemNumber - 1].element} */}

                    <Element
                      {...(elementProps ? elementProps : {})}
                      isMainDataSaved={isMainDataSaved}
                      areDocsSubmitted={areDocsSubmitted}
                    />
                  </div>

                  {type !== "Book Appointment" && type !== "Patient Form" && (
                    <div className="d-flex justify-content-center justify-content-md-end align-items-center w-100 my-3">
                      <Button
                        // disabled={isFormSubmitting}
                        disabled={
                          isSaveAndNextLoading ||
                          isSaveLoading ||
                          isFormSubmitting
                        }
                        // className="mx-3"
                        onClick={handleCancelClick}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid primary",
                          color: "black",
                        }}
                      >
                        Cancel
                      </Button>

                      {type !== "KYC" &&
                        (currentItemNumber === 1 &&
                        (isMainDataSaved || areDocsSubmitted) ? (
                          <Button
                            disabled={isSaveAndNextLoading || isSaveLoading}
                            className="mx-3"
                            onClick={handleNextClick}
                          >
                            Next
                          </Button>
                        ) : (
                          currentItemNumber !== formNavItems.length && (
                            <>
                              <Button
                                disabled={isSaveLoading}
                                className="mx-3"
                                onClick={() => {
                                  handleSaveBtnClick(formikProps);
                                }}
                                style={{
                                  backgroundColor: "white",
                                  border: "1px solid primary",
                                  color: "black",
                                }}
                              >
                                {isSaveLoading && !isSaveAndNextLoading ? (
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="mx-3"
                                  />
                                ) : (
                                  "Save"
                                )}
                              </Button>
                              <Button
                                disabled={isSaveAndNextLoading || isSaveLoading}
                                onClick={() => {
                                  handleSaveAndNextBtnClick(formikProps);
                                }}
                              >
                                {isSaveAndNextLoading ? (
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="mx-3"
                                  />
                                ) : (
                                  "Save & Next"
                                )}
                              </Button>
                            </>
                          )
                        ))}

                      {type === "KYC" &&
                        currentItemNumber !== formNavItems.length &&
                        (areDocsSubmitted ? (
                          <Button
                            disabled={isSaveAndNextLoading || isSaveLoading}
                            className="mx-3"
                            onClick={handleNextClick}
                          >
                            Next
                          </Button>
                        ) : (
                          <>
                            <Button
                              disabled={isSaveLoading}
                              className="mx-3"
                              onClick={() => {
                                handleSaveBtnClick(formikProps);
                              }}
                              style={{
                                backgroundColor: "white",
                                border: "1px solid primary",
                                color: "black",
                              }}
                            >
                              {isSaveLoading && !isSaveAndNextLoading ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="mx-3"
                                />
                              ) : (
                                "Save"
                              )}
                            </Button>
                            <Button
                              disabled={isSaveAndNextLoading || isSaveLoading}
                              onClick={() => {
                                handleSaveAndNextBtnClick(formikProps);
                              }}
                            >
                              {isSaveAndNextLoading ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="mx-3"
                                />
                              ) : (
                                "Save & Next"
                              )}
                            </Button>
                          </>
                        ))}

                      {currentItemNumber === formNavItems.length &&
                        type !== "KYC" && (
                          <Button
                            disabled={
                              isFormSubmitting ||
                              (type === "KYC" && areDocsSubmitted)
                            }
                            type="submit"
                            className="mx-3"
                          >
                            {isFormSubmitting ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="mx-3"
                              />
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        )}

                      {currentItemNumber === formNavItems.length &&
                        type === "KYC" &&
                        !areDocsSubmitted && (
                          <Button
                            disabled={
                              isFormSubmitting ||
                              (type === "KYC" && areDocsSubmitted)
                            }
                            type="submit"
                            className="mx-3"
                          >
                            {isFormSubmitting ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="mx-3"
                              />
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        )}
                    </div>
                  )}
                </FormikForm>
              )}
            </Formik>
          </>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "70vh" }}
          >
            <Spinner
              as="span"
              animation="border"
              // size=""
              role="status"
              aria-hidden="true"
              className="mx-3"
            />
          </div>
        )}
      </Container>

      {currentItemNumber === formNavItems.length && type === "KYC" && (
        <div
          className="fs-4 text-center text-white w-100 mt-0 py-2"
          style={{ backgroundColor: "#00b0f0" }}
        >
          By Submitting the form you agree to{" "}
          <a href="https://rxone.app/terms" style={{ color: "white" }}>
            Terms {"&"} Conditions
          </a>
          .
        </div>
      )}

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}
    </>
  );
};

export default Form;
