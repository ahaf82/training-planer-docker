import React, { useState, useContext, useEffect } from 'react';
import MemberContext from '../../context/member/memberContext';
import M from 'materialize-css/dist/js/materialize.min.js';

const MemberForm = () => {    
    const memberContext = useContext(MemberContext);
    const { updateMember, clearCurrent, current } = memberContext;

    const [member, setMember] = useState({
        name: "",
        email: "",
        role: "",
        trainingGroup: [],
        trainingSessions: []
    });
    
    const { name, email, role } = member;
    
    const [checked, setChecked] = useState(true);
    const [checkedTrainer, setCheckedTrainer] = useState(false);
    
    const [mail, setMail] = useState(false);
    
    useEffect(() => {
        if (current !== null) {
            if (current.role === "none") setMail(true);
            setMember(current);
            if (current.role === 'trainer') {
                setCheckedTrainer(true);
            }
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
    
    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
            M.toast({ html: 'Bitte eine gültige E-Mail Adresse eingeben', classes: 'red darken-1', displayLength: 1500 });
        } else {
            checked === true ? current.role = "none" : current.role = "member";
            checkedTrainer === true ? current.role = "trainer" : current.role = "member";
            
            const updMember = {
                _id: current._id,
                name,
                email,
                role: current.role,
                trainingGroup: current.trainingGroup,
                date: new Date()
            }
            
            if ((current.role === "member" || current.role === "trainer") && mail === true) updMember.sendMail = true;
            console.log("uopdme", updMember);
            console.log("roole", current.role);
            console.log("mail", mail);
            
            updateMember(updMember);
            setMail(false);
        }
    }

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-dark large">Mitglied ändern</h2>
            <h2 className="text-dark large">{name}</h2>
            {role === "none" && 
                <div className="switch">
                    Berechtigung
                <label>
                        :  kein Mitglied
                    <input type="checkbox" name="role" value={checked} onClick={() => setChecked(!checked)} />
                        <span class="lever"></span>
                    Mitglied
                </label>
                </div>}
            <br />        
            {(role === "member" || role === "trainer") &&  !!member.email &&   
            <div class='switch'>
                <label>
                    Mitglied 
                    <input type="checkbox" name="role" value={checkedTrainer} onClick={() => setCheckedTrainer(!checkedTrainer)} />
                    <span class="lever"></span>
                    Trainer
                </label>
            </div>}
            <br />
            {(role === "member" || role === "trainer") &&
            <div>
                <a href="#trainingGroup-list-modal" className="btn btn-dark btn-block modal-trigger">
                    Trainingsgruppen
                </a>
            </div>}
            {current && <div>
                {(role === "none" || role === "member" || role === "trainer") && <div>
                    <br/>
                    <a href="#clear-modal-member" className="btn btn-danger btn-block modal-trigger">
                        Löschen
                    </a>
                    <input type="submit" value={'Mitglied aktualisieren'} className="btn btn-primary btn-block"/>
                </div>}
                <br/>
                <div>
                    <button className="btn btn-light btn-block" onClick={clearAll}>Formular leeren</button>
                </div>
            </div>}
        </form>
    )
}

export default MemberForm;