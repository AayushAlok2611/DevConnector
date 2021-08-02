import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile';

const Education = ({education,deleteEducation}) => { //experience props passed from parent
    const educations = education.map(edu => (
        <tr key={edu._id}>
            <td className="hide-sm"> {edu.school}</td>
            <td className="hide-sm"> {edu.degree}</td>
            <td>
                <Moment format="YYYY/DD/MM">{edu.from}</Moment> - {
                    edu.to==null?('Now'):(<Moment format="YYYY/DD/MM">{edu.to}</Moment>)
                }
            </td>
            <td>
                <button onClick={()=>deleteEducation(edu._id)} className="btn btn-danger">Delete</button>
            </td>
        </tr>
    ))
    return (
        <>
           <h2 className="my-2">Education Credentials</h2> 
            <table className='table'>
                <thead>
                    <tr>
                        <th>School</th>
                        <th className='hide-sm'>Degree</th>
                        <th className='hide-sm'>Years</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {educations}
                </tbody>
            </table>
        </>
    )
}

Education.propTypes = {
    education:PropTypes.array.isRequired,
    deleteEducation:PropTypes.func.isRequired,
}

export default connect(null,{deleteEducation})(Education)
