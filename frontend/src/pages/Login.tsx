import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useCheckresetotpMutation, useLoginMutation, useNewpassMutation, useRegisterMutation, useSendresetotpMutation } from "../services/Userapi";
import toast from "react-hot-toast";
import { IoArrowBackOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../utils/Hooks";
import { setuser } from "../services/Userslice";

interface IError{
  success:boolean,
  message:string
}

interface ILogin {
  email: string;
  password: string;
  fullName: string;
  role: string;
  confirmpass:string,
  otp:string,
  newpass:string;
  profilepic: File | null;
}

const Login = () => {
  const [isnew, setisnew] = useState(false)

  const [isregister, setIsregister] = useState(false)
  const [Forget, setForget] = useState(false)
  const user= useAppSelector(state=>state.user)


  const dispatch = useAppDispatch()


  const[checkotp,{data:cd,error:ce,isError:cie,isSuccess:cis,isLoading:cil}]= useCheckresetotpMutation()

  const[newpass,{data:nd,error:ne,isError:nie,isSuccess:nis,isLoading:nil}]= useNewpassMutation()



 
  

  const[sendotp,{data:sd,error:se,isError:sie,isSuccess:sis,isLoading:sil}]= useSendresetotpMutation()
 
  const[login,{data:ld,error:le,isError:lie,isSuccess:lis,isLoading:lil}]= useLoginMutation()

   const[register,{data:rd,error:re,isError:rie,isSuccess:ris,isLoading:ril}]= useRegisterMutation()
  const [form, setform] = useState<ILogin>({
    email: "",
    password: "",
    fullName: "",
    newpass:"",
    confirmpass:"",

    otp:"",
    role: "",
    profilepic: null,
  });

  console.log(form)

  const handleform = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.target;
    setform((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] : value,
    }));
  };

  const handleclick = async()=>{
    if(!isregister && !Forget &&!isnew){
      const a=await login({
        email:form.email,
        password:form.password
      }).unwrap()
      if(a.success){
        setform({
          email: "",
  confirmpass:"",

    password: "",
    fullName: "",
    role: "",
    newpass:"",
    otp:"",
    profilepic: null,
        })
        return
      }
    }

    

if(isregister && !Forget &&!isnew){

  const formData = new FormData();
  
  formData.append("fullName", form.fullName);
  formData.append("password", form.password);
  formData.append("email", form.email);
  formData.append("role", form.role);
  if (form.profilepic) {
    formData.append("profilepic", form.profilepic);
  }
  
  
  
  
  const a=await register(formData).unwrap()
  if(a.success){
    setform({
      email: "",
      password: "",
      fullName: "",
      otp:"",
      role: "",
      newpass:"",
  confirmpass:"",

      profilepic: null,
    })
    return
  }
  }

  

if(Forget && !isnew){
  const a= await checkotp({otp:form.otp,email:user.email}).unwrap()
  if(a.success){
    setform({
      email: "",
password: "",
fullName: "",
role: "",
newpass:"",
otp:"",
confirmpass:"",

profilepic: null,
    })
    setForget(false)
    setisnew(true)

  }
}

if(isnew){
  const a=await newpass({email:user.email,newpassword:form.password,confirmpass:form.newpass}).unwrap()
  if(a.success)
    {
      setform({
        email: "",
  password: "",
  fullName: "",
  role: "",
  newpass:"",
  otp:"",
  confirmpass:"",
  
  profilepic: null,
      })
  }
}


  

  }

  const handleright=()=>{
    setform({ email: "",
      password: "",
      fullName: "",
      role: "",
  confirmpass:"",

      newpass:"",
      otp:"",
      profilepic: null,})
    setIsregister(prev=>!prev)
  }

  const handleleft=async()=>{
    if(!isregister && !Forget && !isnew ){

      const a= await sendotp({email:user.email}).unwrap()
      if(a.success){
        
        setForget(true)}
      }

      if(Forget){
        setForget(false)
        setIsregister(false)
      }

      if(!Forget && isnew){
        setisnew(false)
        setForget(false)
        setIsregister(false)
      }


    


  }

  useEffect(() => {
    let id:string| undefined;

    if(sis){
      toast.success(sd.message)

      
    }
    if(sil){
      id=toast.loading("Loading")
    }
    if(sie && se && "data" in se){
      const err=se.data as IError
      toast.error(err.message)
    }
  
    return () => {
      if(id)toast.dismiss(id)
    }
  }, [sd,sis,sie,se,sil])





  useEffect(() => {
    let id:string| undefined;

    if(nis){
      toast.success(nd.message)

      
    }
    if(nil){
      id=toast.loading("Loading")
    }
    if(nie && ne && "data" in ne){
      const err=ne.data as IError
      toast.error(err.message)
    }
  
    return () => {
      if(id)toast.dismiss(id)
    }
  }, [nd,nis,nie,ne,nil])






  useEffect(() => {
    let id:string| undefined;

    if(cis){
      toast.success(cd.message)

      
    }
    if(cil){
      id=toast.loading("Loading")
    }
    if(cie && ce && "data" in ce){
      const err=ce.data as IError
      toast.error(err.message)
    }
  
    return () => {
      if(id)toast.dismiss(id)
    }
  }, [cd,cis,cie,ce,cil])




  useEffect(() => {
    let id:string|undefined;

    if(ris){
      toast.success(rd.message)
      dispatch(setuser(rd.payload))
      
    }
    if(ril){
      id=toast.loading("Loading")
    }
    if(rie && re && "data" in re){
      const err=re.data as IError
      toast.error(err.message)
    }
  
    return () => {
      if(id)toast.dismiss(id)
    }
  }, [rd,ris,rie,re,ril,dispatch])

  useEffect(() => {
    let id:string|undefined;

    if(lis){
      toast.success(ld.message)
      dispatch(setuser(ld.payload))
    }
    if(lil){
      id=toast.loading("Loading")
    }
    if(lie && le && "data" in le){
      const err=le.data as IError
      toast.error(err.message)
    }
  
    return () => {
      if(id)toast.dismiss(id)
    }
  }, [ld,le,lie,lil,lis,dispatch])



  

  console.log(rd)
  return (
    <div className="login h-screen w-screen flex justify-center items-center">
      <div className="   rounded-xl h-120 w-100 flex  items-center flex-col gap-3">
        <h2 className="text-4xl  font-bold">{isregister && !Forget &&!isnew?"   SIGN UP":!isregister&&!Forget&&!isnew ?"SIGN IN":Forget && !isnew ? "OTP":isnew&&"NEW PASSWORD"  }</h2>
        <div className="flex flex-col gap-4 w-full h-full">
          {!Forget && !isnew &&<input
            className="in h-10 border border-black rounded"
            type="email"
            placeholder="Enter your email"
            name="email"
            onChange={handleform}
            value={form.email}
          />}
          {isregister &&!Forget && <input
            type="text"
            placeholder="Enter your fullname"
            name="fullName"
            value={form.fullName}
            onChange={handleform}
            className="in h-10 border border-black rounded"
          />}
          

          {!Forget &&<input
            type="password"
            placeholder={` ${!isnew ? "Enter your password":"Enter new password"}`}
            name="password"
            value={form.password}
            onChange={handleform}
            className="in h-10 border border-black rounded"
          />}



{ isnew &&<input
            type="password"
            placeholder="Confirm password"
            name="newpass"
            value={form.newpass}
            onChange={handleform}
            className="in h-10 border border-black rounded"
          />}

          {isregister&& !Forget &&  <div className="flex gap-5 ">
            Role:
            <div className="flex gap-1">
              <input
                onChange={handleform}
                value={"user"}
                type="radio"
                checked={form.role =="user"}

                className="accent-orange-600"
                name="role"
                id="1"
              />

              <span>User</span>
            </div>
            <div className="flex gap-1">
              <input
                onChange={handleform}
                value={"rider"}
                type="radio"
                checked={form.role =="rider"}

                className="accent-orange-600"
                name="role"
                id="1"
              />
              <span>Rider</span>
            </div>
            <div className="flex gap-1">
              <input
                onChange={handleform}
                value={"resturant"}
                type="radio"
                checked={form.role =="resturant"}

                className="accent-orange-600"
                name="role"
                id="1"
              />
              <span>Resturant</span>
            </div>
          </div>}
         

{isregister && !Forget && <div className="flex items-center gap-2 ">
            <div className="">Profilepic:</div>
            <label
              htmlFor="file"
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg  cursor-pointer  border  h-30 w-30"
            >
              {!form.profilepic && (
                <FaUpload size={40} color="black" className="h-full" w-full />
              )}

              {form.profilepic && (
                <img
                  className="h-full w-full rounded"
                  src={URL.createObjectURL(form.profilepic)}
                  alt=""
                />
              )}
            </label>

            <input
              type="file"
              id="file"
              className="hidden"
              name="profilepic"
              onChange={handleform}
            />
          </div>}
          {Forget && <input type="text" placeholder="Enter the otp" value={form.otp} onChange={handleform} name="otp"  className="in h-10 border border-black rounded" />}
          

          
          <div className="flex justify-between">
            <div onClick={handleleft} className={`${!isregister&&"hover:text-blue-700 cursor-pointer"} `}> {!isregister && !Forget &&!isnew ? "Forget password":isregister && !Forget &&!isnew ? "Already have account":<IoArrowBackOutline size={20} />}</div>
            <div onClick={handleright} className="cursor-pointer hover:text-blue-700 ">{!isregister && !Forget && !isnew?"Create account":isregister&&!isnew && !Forget&&"Log in"}</div>
          </div>

          
          
          <div className="w-full flex justify-center  ">
            <button onClick={handleclick} className="outline-none px-2 cursor-pointer  rounded text-[2.5vh] bg-black text-white">
           {isregister && !Forget &&!isnew?"   Sign up":!isregister && !Forget &&!isnew?"Sign in":"Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
