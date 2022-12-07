import React, { useState, useEffect, useContext } from 'react';

import Draggable from 'react-draggable';

import styles from './Note.module.scss';
import { FaTimes } from 'react-icons/fa';

import Api from '../../services/Api';

const Note = ({ noteOpen, setNoteOpen }) => {
    
    const api = new Api();

    const [hasNote, setHasNote] = useState(false);
    const [note, setNote] = useState({ text: '' });

    useEffect(() => {
        api.request('/api/note_by_user', 'GET')
            .then(res => {
                switch (res.status){
                    case 200:
                    case 201:
                        setHasNote(true);
                        setNote(res.data.data);
                        break;
                    default:
                        setHasNote(false);
                        setNote({ text: '' });
                        break;
                }
            })
    }, []);

    const handleSaveNote = () => {
        if (hasNote){ // update
            api.request('/api/note/'+note['uuid'], 'PUT', note)
                .then(res => {
                    switch (res.status){
                        case 200:
                        case 201:
                            setHasNote(true);
                            setNote(res.data.data);
                            break;
                    }
                });
        }else{ // create
            api.request('/api/note', 'POST', note)
                .then(res => {
                    switch (res.status){
                        case 200:
                        case 201:
                            setHasNote(true);
                            setNote(res.data.data);
                            break;
                    }
                });
        }
    } 

    return (
        <Draggable handle={`.nh-dragable`}>
            <div className={`${styles['note']} ${ noteOpen?styles['note-active']:''}`}>
                <div className={`${styles['note-head']} nh-dragable d-flex`}>
                    <div className={`mr-auto`}>Quick Note</div>
                    <div className={styles['btn']} onClick={ () => { setNoteOpen(!noteOpen) } }>
                        <FaTimes />
                    </div>
                </div>
                <div className={styles['note-body']}>
                    <textarea className={styles['note-text']} 
                                onChange={ (e) => { setNote({ ...note, 'text': e.target.value }); } } 
                                onBlur={ (e) => { handleSaveNote(); } }
                                value={note['text']}
                    >
                    </textarea>
                </div>
            </div>
        </Draggable>
    );
}

export default Note;