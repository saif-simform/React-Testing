import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import { TOKEN_KEY } from "../../configs/constant";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthService } from "../../services/api.service";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const login = async (values) => {
    setShowLoader(true);
    setValues(values);
    try {
      const { user, token } = await AuthService.login(values);

      // store token to localStorage
      localStorage.setItem(TOKEN_KEY, token.token);

      dispatch({ type: "SET_AUTH", payload: user });
      user.isSuperUser ? navigate("/logs") : navigate("/projects");

      toast.success("Login Successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="bg-authentication login-card">
        <div className="text-center">
          <h3 data-testid='login-text'>Login</h3>
          <p data-testid='heading-text'>Welcome back, please login to your account.</p>
        </div>

        <Formik
          initialValues={values}
          onSubmit={async (values) => {
            login(values);
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .required("Enter email")
              .email("Enter valid email"),
            password: Yup.string().required("Enter Password"),
          })}
        >
          {(props) => {
            const {
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            } = props;
            return (
              <>
                <Form onSubmit={handleSubmit}>
                  <Label>Email</Label>
                  <FormGroup className="position-relative has-icon-left">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`form-control ${touched.email && errors.email ? "is-invalid" : ""
                        }`}
                    />
                    {touched.email && errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </FormGroup>
                  <Label>Password</Label>
                  <FormGroup className="has-icon-left position-relative">
                    <Input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`${touched.password && errors.password ? "is-invalid" : ""
                        }`}
                    />
                    {touched.password && errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </FormGroup>
                  <div className="d-flex justify-content-center">
                    <Button
                      block
                      color="primary"
                      type="submit"
                      disabled={showLoader}
                    >
                      {showLoader ? (
                        <>
                          <Spinner color="white" size="sm" type="grow" />
                          <span className="ml-50">Loading...</span>
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
};
export default Login;
