export default (values,touched)=> {
    let errors = {};
    if(touched.fullName){
      if (!values.fullName) {
        errors.fullName = 'name is required';
      } else if (!/^([a-z']+( )?)+$/i.test(values.fullName)) {
        errors.fullName = 'Name can only contain alphabets and space';
      }
    }
    if(touched.email){
      if (!values.email && touched.email) {
        errors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/i.test(values.email)) {
        errors.email = 'Email address is invalid';
      }
    }
    if(touched.contactNumber){
      if (!values.contactNumber) {
        errors.contactNumber = 'contact number is required';
      } else if (!/^[1-9]\d{9}$/.test(values.contactNumber)) {
        errors.contactNumber = 'contact number is invalid';
      }
    }
    if(touched.password){
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 8) {
        errors.password = 'Password must be 8 or more characters';
      }
    }
    if(touched.confirmPassword){
      if (!values.confirmPassword) {
        errors.confirmPassword = 'kindly confirm your password';
      }
       else if (values.confirmPassword!==values.password) {
        errors.confirmPassword = 'Passwords didnt match';
      }
    }
    
    return errors;
  };
  