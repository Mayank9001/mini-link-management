import React, { useEffect, useState } from 'react';
import styles from './CreateModal.module.css';
import { FaStarOfLife } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoCalendarOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateModal = ({onClose}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const [errors, setErrors] = useState({
        originalUrl:false,
        remarks:false,
    })
  return (
    <>
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h4 className={styles.title}>New Link</h4>
                    <div className={styles.crsicon} onClick={onClose}>
                        <RxCross2 color="white" size={25} />             
                    </div>
                </div>
                <div className={styles.destination}>
                    <h5>Destination Url
                        <span>
                            <FaStarOfLife color="red" size={5} />
                        </span>
                    </h5>
                    <input type='text' placeholder='https://web.whatsapp.com/' 
                        style={errors.originalUrl ? { border: "1px solid red" } : {}} />
                    <p style={{ visibility : errors.originalUrl ? "visible" : "hidden" }}>
                        {errors.originalUrl && "This field is mandatory" }
                    </p>
                </div>
                <div className={styles.remarks}>
                    <h5>Remarks
                        <span>
                            <FaStarOfLife color="red" size={5} />
                        </span>
                    </h5>
                    <textarea type='text' placeholder='Add remarks' style={errors.remarks ? { border: "1px solid red" } : {}}></textarea>
                    <p style={{ visibility : errors.remarks ? "visible" : "hidden" }}>
                        {errors.remarks && "This field is mandatory" }
                    </p>
                </div>
                <div className={styles.expiration}>
                    <div className={styles.exptitle}>
                        <h5>Expiration Date</h5>
                        <span className={styles.toggle}>
                            <input type='checkbox' id='toggle' name='checkbox'/>
                            <label htmlFor='toggle'></label>
                        </span>
                    </div>
                    <div className={styles.date}>
                        <DatePicker
                            className={styles.datepicker}
                            id="date-input"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            showTimeInput
                            dateFormat="MMM d, yyyy, hh:mm aa"
                            placeholder={selectedDate}
                            style={{width: "100%"}}
                        />
                        <span>
                            <IoCalendarOutline color="#000000"/>
                        </span>
                    </div>
                </div>
                <div className={styles.footer}>
                    <button className={styles.clear}>Clear</button>
                    <button className={styles.createbtn}>Create new</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default CreateModal