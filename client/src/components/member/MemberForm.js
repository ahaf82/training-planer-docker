import React, { useState, useContext, useEffect } from 'react'
import AlertContext from '../../context/alert/alertContext';
import MemberContext from '../../context/member/memberContext';

const MemberForm = () => {
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;
    
    const memberContext = useContext(MemberContext);
    const { updateMember, clearCurrent, current } = memberContext;
    
    useEffect(() => {
        if (current !== null) {
            setMember(current);
        } else {
            setMember({
              name: "",
              email: "",
              role: "",
              trainingGroup: [],
              trainingSessions: []
            });
        }
    }, [memberContext, current]);

    const [member, setMember] = useState({
        name: "",
        email: "",
        role: "",
        trainingGroup: [],
        trainingSessions: []
    });

    const { name, email, role, trainingGroup } = member;

    const onChange = e => setMember({ ...member, [e.target.name]: e.target.value });

    const [checked, setChecked] = useState(true);


    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
            setAlert('Bitte eine gültige E-Mail Adresse eingeben', 'danger');
        } else {
            checked === true ? current.role = "none" : current.role = "member";
            
            const updMember = {
                _id: current._id,
                name,
                email,
                role: current.role,
                trainingGroup: current.trainingGroup,
                date: new Date()
            }
            
            updateMember(updMember);
        }
        setMember({
            name: "",
            email: "",
            role: "",
            trainingGroup: [],
            trainingSessions: []
        })
    }

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary large">Mitglied ändern</h2>
            <h2 className="text-primary large">{name}</h2>
            {role === "none" && 
            <div class="switch">
                Berechtigung     
                <label>
                    :  kein Mitglied
                    <input type="checkbox" name="role" value={checked} onClick={() => setChecked(!checked)} />
                    <span class="lever"></span>
                    Mitglied
                </label>
            </div>}
            <br/>
            <div>
                <a href="#trainingGroup-list-modal" className="btn btn-primary btn-block modal-trigger">
                    Trainingsgruppen
                </a>
            </div>
            {current && <div>
                {role === "none" && <div>
                    <input type="submit" value={'Mitglied aktualisieren'} className="btn btn-primary btn-block"/>
                </div>}
                <div>
                    <button className="btn btn-light btn-block" onClick={clearAll}>Löschen</button>
                </div>
            </div>}
        </form>
    )
}

export default MemberForm;