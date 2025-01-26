import React, { useState } from 'react'
import styles from './Navbar.module.css';
import Frame from '../assets/Frame.svg';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [islogout, setIsLogout] = useState(false);
    const initials = (name) => {
        const words = name.split(" ");
        if (words.length === 1) {
          return words[0].slice(0, 2).toUpperCase();
        } else {
          return words
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
        }
    };
    const date = new Date(Date.now());
    const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);

  return (
    <>
        <div className={styles.main}>
            <div className={styles.greet}>
                <div>
                    <span className={styles.sun}>🌤️
                    </span>
                </div>
                <div className={styles.gm}>
                    <span>Good morning, {"Mayank"}</span>
                    <br/>
                    <span className={styles.fDate}>{formattedDate}</span>
                </div>
            </div>
            <div className={styles.searchdiv}>
                <div className={styles.createBtn}>
                    <button><span className={styles.plusbtn}>+</span>Create new</button>
                </div>
                <div className={styles.search}>
                    <img src={Frame} alt='search icon' />
                    <input type='search' placeholder='Search by remarks'/>
                </div>
            </div>
            <div className={styles.logout}>
                <button onClick={()=>setIsLogout(!islogout)}>
                    {initials("Mayank")}
                </button>
            </div>
            {islogout && (
                <button className={styles.logoutBtn} onClick={()=>navigate('/')}>Logout</button>
            )}
        </div>
   </> 
  )
}

export default Navbar