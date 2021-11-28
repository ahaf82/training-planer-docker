import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Logo from '../../Logo.png';
import AuthContext from '../../context/auth/authContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const Navbar = ({ title, icon }) => {
    const authContext = useContext(AuthContext);
    const trainingGroupContext = useContext(TrainingGroupContext);
    const trainingSessionContext = useContext(TrainingSessionContext);

    const { isAuthenticated, logout, member, role } = authContext;
    const { clearTrainingGroups } = trainingGroupContext;
    const { clearTrainingSessions } = trainingSessionContext;

    const onLogout = () => {
        logout();
        clearTrainingGroups();
        clearTrainingSessions();
    };

    const authLinks = (
        <Fragment>
            <li>
                <Link to='/'><i className="fa fa-list-alt" aria-hidden="true"></i><span className="hide-sm" id="overview"> Übersicht</span></Link>
            </li>
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/sessions'><i className="fa fa-calendar" aria-hidden="true"></i><span className="hide-sm" id="training-sessions"> Trainingseinheiten</span></Link>
                </li>}
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/groups'><i className="fa fa-users" aria-hidden="true"></i><span className="hide-sm" id="training-groups"> Trainingsgruppen</span></Link>
                </li>}
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/messages'><i className="fa fa-envelope-open-text" aria-hidden="true"></i><span className="hide-sm" id="messages"> Nachrichten</span></Link>
                </li>}
            {/* {(role === 'admin' || role === 'superUser') &&
            <li>
                <Link to='/memberPage'><i className="fa fa-user-circle" aria-hidden="true"></i><span className="hide-sm"> Mitglieder</span></Link>
            </li>} */}
            <li>
                <Link to='/memberPage'><i className="fa fa-user-circle" aria-hidden="true"></i><span className="hide-sm" id="members"> Mitglieder</span></Link>
            </li>
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/oldSess'><i className="fa fa-reply-all" aria-hidden="true"></i><span className="hide-sm" id="old-sessions"> Alte Einträge</span></Link>
                </li>}

            {role === 'member' &&
                <li>
                    Hallo {member && member.name}
                </li>}
            <li>
                <a onClick={onLogout} href="#!">
                    <i className="fas fa-sign-out-alt"></i><span className="hide-sm" id="logout"> Logout</span>
                </a>
            </li>
        </Fragment>
    )

    const guestLinks = (
        <Fragment>
            {/* {<li>
                <Link to='/policy'>DSGVO</Link>
            </li> */}
            <li>
                <Link to='/register'>Registrierung</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </Fragment>
    )

    return (
        <div className="navbar bg-primary middle">
            <h1 className="text-light-color x-large">
                <img src={Logo} className='kentai-logo' /> {title}
            </h1>
            <ul>
                {isAuthenticated ? authLinks : guestLinks}
            </ul>
        </div>
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
}

Navbar.defaultProps = {
    title: 'Training Planer'
    // icon: 'fa fa-calendar'
}

export default Navbar;