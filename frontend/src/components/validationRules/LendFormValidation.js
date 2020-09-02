export default (values,touched)=> {
    let errors = {};
    if(touched.parkingName){
      if (!values.parkingName) {
        errors.parkingName = 'Parking name is required';
      }else if (values.parkingName.length<5||values.parkingName.length>30) {
        errors.parkingName = 'Parking name should be 5 to 30 characters long';
      } else if (!/^([a-z0-9]+( )?)+$/i.test(values.parkingName)) {
        errors.parkingName = 'Parking Name can only contain alphanumeric values and space';
      }
    }
    if(touched.totalSpots){
      if ((!values.totalSpots) || values.totalSpots<=0) {
        errors.totalSpots = 'Total spots are required';
      }else if (values.totalSpots>10000) {
        errors.totalSpots = 'You can lend a maximum of 10000 spots';
      } else if (!/^([0-9]+)$/.test(values.totalSpots)) {
        errors.totalSpots = 'Total spots can only contain numbers';
      }
    }
    if(touched.cost){
      if ((!values.cost) || values.cost<=0) {
        errors.cost = 'Cost is required';
      }else if (values.cost>10) {
        errors.cost= 'You can not charge more than Rs.10/h';
      } else if (!/^([0-9]+)$/.test(values.cost)) {
        errors.cost = 'Cost can only contain numbers';
      }
    }
    return errors;
  };
  