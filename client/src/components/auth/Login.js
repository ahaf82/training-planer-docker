import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';
// import ResetPassword from './ResetPassword';

const Login = (props) => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const { setAlert } = alertContext;
    const { login, error, clearErrors, isAuthenticated } = authContext;

    useEffect(() => {
        if (isAuthenticated) {
            props.history.push('/');
        }

        if (error) {
            setAlert(error, 'danger');
            clearErrors();
        }

        //eslint-disable-next-line
    }, [error, isAuthenticated, props.history])

    const [member, setMember] = useState({
        email: '',
        password: ''
    });

    const { email, password } = member;

    const onChange = e => setMember({ ...member, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (email === '' || password === '') {
            setAlert('Bitte E-Mail Adresse und Passwort eingeben', 'danger');
        } else {
            login({
                email,
                password
            });
        }
    }

    return (
        <div className='form-container'>
            <h1>
                <span className='text-dark large'>Login</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='email'>E-Mail Adresse</label>
                    <input className="email-input" type='email' name='email' value={email} onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Passwort</label>
                    <input className="password-input" type='password' name='password' value={password} onChange={onChange} />
                </div>
                <input type="submit" value="Login" className="btn btn-dark btn-block" />
            </form>
            <li>
                <Link to='/resetPassword'><span className='text-dark small'>Passwort zurücksetzen</span></Link>
            </li>
        </div>

    )
}

export default Login;