import React from 'react'
import { useState, useEffect } from 'react';
import cuvette from '../assets/cuvette.png';
import m_image from '../assets/m_image.png';
import styles from './Login.module.css';


const Login = () => {
    return (
        <>
        <div className={styles.container}>
            <div>
                <img src={cuvette} alt="cuvette" />
                <img src={m_image} alt="m_image" className={styles.mimg} />
            </div>
        </div>
        </>
    )
}

export default Login