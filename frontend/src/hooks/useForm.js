import { useState, useEffect } from 'react';

export default (callback, validate) => {

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  useEffect(() => {
      setErrors(validate(values,touched));
  }, [values,touched]);

  const handleSubmit = (event) => {
    event.persist();
    event.preventDefault(); 
    setIsSubmitting(true);
    for(let i=0;i<event.target.length;i++){
      setTouched(touched=>({...touched,[event.target[i].name]:true}));
    }
  };
  const clearValues = (event) => {
    setValues({});
    setTouched({});
    setIsSubmitting(false);
  };
  const markTouched = (controlName) => {
      setTouched(touched=>({...touched,[controlName]:true}));
  };
  const handleChange = (event) => {
    event.persist();
    setIsSubmitting(false);
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
    setTouched(touched=>({...touched,[event.target.name]:true}));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    markTouched,
    clearValues,
    setValues
  }
};
