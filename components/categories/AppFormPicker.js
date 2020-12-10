import React from "react";
import { Formik, useFormikContext } from "formik";

import AppPicker from "../categories/AppPicker";
import ErrorMessage from "../categories/ErrorMessage";

function AppFormPicker({ items, name, placeholder }) {
  
  return (
    const { errors, setFieldValue, touched, values } = useFormikContext();
    <>
      <AppPicker
        items={items}
        onSelectItem={(item) => setFieldValue(name, item)}
        placeholder={placeholder}
        selectedItem={values[name]}
        />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
