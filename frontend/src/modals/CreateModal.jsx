import React, { useRef, useState } from 'react';
import styles from './CreateModal.module.css';
import { FaStarOfLife } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoCalendarOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLink } from '../services/link.services';
const CreateModal = ({onClose}) => {
    const modalRef = useRef();
    const closeModal = (e) => {
        if(modalRef.current === e.target){
            onClose();
        }
    };
    const [linkData, setLinkData] = useState({
        originalLink:"",
        remarks:"",
        expirationDate:"",
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isToggle, setIsToggle] = useState(false);
    const [errors, setErrors] = useState({
        originalLink:false,
        remarks:false,
    });
    const handleCreateLink = async (e) => {
        e.preventDefault();
        console.log("Toggle : ", isToggle);
        if(isToggle){
            setLinkData({...linkData, expirationDate:selectedDate});
        }
        if(!linkData.originalLink)
        {
            return setErrors({originalLink:true});
        }
        if(!linkData.remarks)
        {
            return setErrors({remarks:true});
        }
        try {
            console.log(linkData);
            const res = await createLink(linkData);
            const data = await res.json();
            if(res.status === 200)
            {
                alert("Link Created Successfully!!")
                console.log(data);
            }
            onClose();
        } catch (error) {
            console.log(error);
        }
    };
    const handleToggleChange =() => {
        setIsToggle((prev) => !prev);
        console.log("toggle : ", !isToggle ? "true" : "false");
    };
  return (
    <>
        <div className={styles.main} ref={modalRef}>
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
                    <input type='text' 
                        onChange={(e)=>setLinkData({...linkData, originalLink:e.target.value})} placeholder='https://web.whatsapp.com/' 
                        style={errors.originalLink ? { border: "1px solid red" } : {}} />
                    <p style={{ visibility : errors.originalLink ? "visible" : "hidden" }}>
                        {errors.originalLink && "This field is mandatory" }
                    </p>
                </div>
                <div className={styles.remarks}>
                    <h5>Remarks
                        <span>
                            <FaStarOfLife color="red" size={5} />
                        </span>
                    </h5>
                    <textarea type='text' onChange={(e)=>setLinkData({...linkData, remarks:e.target.value})} placeholder='Add remarks' style={errors.remarks ? { border: "1px solid red" } : {}}></textarea>
                    <p style={{ visibility : errors.remarks ? "visible" : "hidden" }}>
                        {errors.remarks && "This field is mandatory" }
                    </p>
                </div>
                <div className={styles.expiration}>
                    <div className={styles.exptitle}>
                        <h5>Expiration Date</h5>
                        <span className={styles.toggle}>
                            <input type='checkbox' id='toggle' checked={isToggle} name='checkbox'onChange={handleToggleChange}/>
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
                    <button className={styles.createbtn} onClick={handleCreateLink}>Create new</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default CreateModal