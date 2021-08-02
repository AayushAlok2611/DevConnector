import React from 'react';
import PropTypes from 'prop-types'
import {connect} from "react-redux";


const Alert = ({ alerts }) =>
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));
  
Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({ // we get state from redux and we added a prop called "alerts" with the value state.alert
    alerts:state.alert
})

export default connect(mapStateToProps)(Alert);
