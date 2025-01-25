const Login = () => {
//     const [isLogin, setIsLogin] = useState(false);
//   const [activeBtn,setActiveBtn]=useState(1);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirm_password: "",
//   });
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };
//   const handleSubmit = async (e) => {
//     const baseUrl = import.meta.env.VITE_API_BASE_URL;
//     e.preventDefault();
//     if (!isLogin && formData.password !== formData.confirm_password) {
//       alert("Passwords do not match");
//       return;
//     }
//     try {
//       const endpoints = isLogin
//         ? `${baseUrl}/api/user/login`
//         : `${baseUrl}/api/user/signUp`;

//       const res = await axios.post(endpoints, formData, {
//         headers: {
//           "Content-Type": "application/json"
//         },
//       });
//       if (res.status === 200 || res.status === 201) {
//         console.log("Success:", res.data);
//         localStorage.setItem("token",res.data.token);
//         alert(res.data.message);
//       }
//       else if (res.status === 400) {
//         alert(res.data.message);
//       }
//       setFormData({
//         name: "",
//         email: "",
//         mobile: "",
//         password: "",
//         confirm_password: "",
//       })
      
//     } catch (error) {
//       console.log(error);
//       alert(error.response?.data?.message || "An error occurred");
//     }
//   };
 
//   const handleButtonClick=(button)=>{
//     setActiveBtn(button);
//     if(button===1){
//       setIsLogin(false)
//     }
//     else{
//       setIsLogin(true);
//     }
//   }
  return (
    <>
     <div className={styles.buttons}>
          <button onClick={()=>handleButtonClick(1)} style={{backgroundColor:activeBtn===1?"blue":"transparent", color: activeBtn === 1 ? "white" : "black"}}>Signup</button>
          <button onClick={()=>handleButtonClick(2)} style={{backgroundColor:activeBtn===2?"blue":"transparent", color: activeBtn === 2 ? "white" : "black"}}>Login</button>
        </div>
    <div className={styles.main}>
      <div className={styles.image}>
        <img src={m_image} alt='' />
      </div>
      <div className={styles.formContainer}>
        {isLogin ? (
          <p className={styles.header}>Login</p>
        ) : (
          <p className={styles.header}>Join us Today!</p>
        )}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <div>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email id'
                  required
                />
              </div>
              <div>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Password'
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Name'
                  required
                />
              </div>
              <div>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email id'
                  required
                />
              </div>
              <div>
                <input
                  type='text'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder='Mobile no'
                  required
                />
              </div>
              <div>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Password'
                  required
                />
              </div>
              <div>
                <input
                  type='password'
                  name='confirm_password'
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder='Confirm Password'
                  required
                />
              </div>
            </>
          )}
          <input type='submit' value={isLogin ? "Login" : "Register"} />
          {isLogin ? (
            <p>
              Dont have an account?{" "}
              <span className={styles.link} onClick={() => setIsLogin(false)}>
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span className={styles.link} onClick={() => setIsLogin(true)}>
                Login
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
    </>
  )
}