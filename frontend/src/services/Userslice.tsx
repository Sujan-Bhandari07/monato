import { createSlice,type  PayloadAction } from '@reduxjs/toolkit';


interface usertype{
  _id:string
  fullName:string,
  email:string,



  role:string,
  profilepic:string
}

const initialState:usertype= {

_id:'',
role:"",
profilepic:"",
  email:"",
  fullName:"",


};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  setuser(state,action:PayloadAction<usertype>){
const {_id,fullName,email,role,profilepic}=action.payload
state._id=_id;
state.email=email;
state.fullName=fullName;
state.role=role;
state.profilepic=profilepic;
  },
  },
});

export const {setuser  } = userSlice.actions;
export default userSlice.reducer;
