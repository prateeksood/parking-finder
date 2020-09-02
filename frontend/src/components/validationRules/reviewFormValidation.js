export default (values,touched)=> {
    let errors = {};
    if(touched.reviewHead){
      if (!values.reviewHead) {
        errors.reviewHead = 'Review heading is required';
      } 
      else if (/^\s+$/.test(values.reviewHead)) {
        errors.reviewHead = 'Review heading should be a valid sentence.';
      }
      else if (values.reviewHead.length>30||values.reviewHead.length<5) {
        errors.reviewHead = 'Review heading should be 5 to 30 characters long';
      }
    }
    if(touched.reviewBody){
      if (!values.reviewBody) {
        errors.reviewBody = 'Review body is required';
      } 
      else if (/^\s+$/.test(values.reviewBody)) {
        errors.reviewBody= 'Review body should be a valid sentence.';
      }
      else if (values.reviewBody.length>100||values.reviewBody.length<5) {
        errors.reviewBody = 'Review should be 5 to 100 characters long';
      }
    }
    return errors;
  };