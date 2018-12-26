import React from "react";
import { render } from "react-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import AsyncSelect from "react-select/lib/Async";
import "bootstrap/dist/css/bootstrap.css";

const flavourOptionsPromise = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      const flavourOptions = [
        { value: "vanilla", label: "Vanilla", rating: "safe" },
        { value: "chocolate", label: "Chocolate", rating: "good" },
        { value: "strawberry", label: "Strawberry", rating: "wild" },
        { value: "salted-caramel", label: "Salted Caramel", rating: "crazy" }
      ];
      resolve(flavourOptions);
    }, 1000);
  });

const promiseOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      const colourOptions = [
        { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
        { value: "blue", label: "Blue", color: "#0052CC", disabled: true },
        { value: "purple", label: "Purple", color: "#5243AA" },
        { value: "red", label: "Red", color: "#FF5630", isFixed: true }
      ];
      resolve(colourOptions);
    }, 1000);
  });

export default class AsyncMulti extends React.Component {
  handleChange = value => {
    this.props.onChange(this.props.field.name, value);
  };
  handleBlur = () => {
    this.props.onBlur(this.props.field.name, true);
  };

  render() {
    console.log("~~~~~~~~~ ", this.props);
    return (
      <div className="mt-1">
        <AsyncSelect
          isMulti
          cacheOptions
          defaultOptions
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          loadOptions={this.props.loadOptions}
        />
      </div>
    );
  }
}

const App = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  setFieldTouched
}) => {
  return (
    <Form>
      <div className="container">
        <div className="d-flex flex-column">
          <div className="mt-1">
            {touched.email && errors.email && <p>{errors.email}</p>}
            <Field
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="mt-1">
            {touched.password && errors.password && <p>{errors.password}</p>}
            <Field
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <Field component="select" className="form-control mt-1" name="plan">
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </Field>
          <Field
            value={values.audience}
            name="audience"
            component={AsyncMulti}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            loadOptions={promiseOptions}
          />
          <Field
            value={values.flavours}
            name="flavours"
            component={AsyncMulti}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
            loadOptions={flavourOptionsPromise}
          />
        </div>
        <button className="btn btn-primary mt-2">Submit</button>
      </div>
    </Form>
  );
};
const FormikApp = withFormik({
  mapPropsToValues({ email, password, newsletter, plan, audience, flavours }) {
    return {
      email: email || "",
      password: password || "",
      newsletter: newsletter || true,
      plan: plan || "free",
      audience: audience || [],
      flavours: flavours || []
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email()
      .required("email is required field"),
    password: Yup.string()
      .min(5, "minimum 5 characters for password")
      .required("password is required field")
  }),
  handleSubmit(values) {
    console.log(values);
  }
})(App);

render(<FormikApp />, document.getElementById("root"));
