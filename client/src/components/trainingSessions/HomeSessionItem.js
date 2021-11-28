import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import 'moment/locale/de';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';

Moment.globalLocale = 'de';

const HomeSessionItem = ({ session }) => {
    const authContext = useContext(AuthContext);
    const { role, loading } = authContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { trainingGroup } = trainingGroupContext;

    const memberContext = useContext(MemberContext);

    const { description, maxMembers, memberCount, members, time, timeTo, date } = session;

    let group = [];
    if (!!trainingGroup) {
        group = trainingGroup.filter(item => item._id === session.trainingGroup);
    }

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (session.members.find(element => element === authContext.member._id) !== undefined) {
            setChecked(true);
        }
    }, [session.members, authContext.member._id, members]);

    // Convert Object Id to Name
    let sessionMembers;
    if (memberContext.members) {
        // console.log("context", memberContext.members);
        let subMembers = [...memberContext.members.filter(element => element.familyMember.length > 0).map(element => element.familyMember).flat(1)];
        // console.log("subs", subMembers);
        let sessionSubMembers = subMembers.filter(obj => session.members.includes(obj._id));
        // console.log("groupsubs", sessionSubMembers);
        sessionMembers = [...memberContext.members.filter(element => session.members.includes(element._id)), ...sessionSubMembers];
        // sessionMembers = [...new Set(memberContext.members.filter(element => session.members.includes(element._id)))];
        // sessionMembers = [...new Set(sessionMembers)];
    }

    // Convert ObjectTrainer Id to Name
    let trainerName;
    if (memberContext.members && session.trainer) {
        trainerName = memberContext.members.filter(element => element._id === session.trainer);
    }

    return (
        <div className='column'>

            <div className={checked === true ? 'card bg-primary' : 'card bg-light card-content'}>
                <h3 className={checked === true ? 'text- text-left large' : 'text-primary text-left large'}>

                    {description}{' '}
                </h3>
                <ul className="list">
                    {!!trainingGroup && group[0].trainingGroup && !loading && <li>
                        <i></i> Trainingsgruppe: {group[0].trainingGroup
                        }
                    </li>}
                    {memberContext.members && trainerName && !loading && <li>
                        <i></i> Trainer: {trainerName[0].name}
                    </li>}
                    {time && <li>
                        <i></i> Zeit: <time format='h:mm:ss'>{time}</time>{timeTo && <time format='h:mm:ss'>{` - ${timeTo}`}</time>}
                    </li>}
                    {date && <li>
                        <i></i> Datum: <Moment format='Do MMMM YYYY'>{date}</Moment>
                    </li>}
                    {maxMembers && <li>
                        <i></i> Maximale Teilnehmer: {maxMembers}
                    </li>}
                    {memberCount && <li>
                        <i></i> Angemeldete Teilnehmer: {memberCount}
                    </li>}
                    {(role === 'admin' || role === 'superUser') && sessionMembers && <div>
                        <i className="fa fa-user"></i> <strong>Teilnehmer:</strong> <br />
                        {sessionMembers.map(member => member.name).join(', ')}
                    </div>}
                </ul>
            </div>
        </div>
    )
}

HomeSessionItem.propTypes = {
    session: PropTypes.object.isRequired
}

export default HomeSessionItem;