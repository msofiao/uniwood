import React from "react";
import MailIcon from '@mui/icons-material/Mail';
export default function Test2() {

    return (
    
      <div className="position absolute left-[50%] top-[50%] flex h-[300px] w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center rounded-xl bg-white px-5 py-8 shadow-lg">
        {<MailIcon className="mb-4 size-16 rounded-full bg-red-200 p-2 text-red-400"/>}
        <p className="mb-7 text-center text-slate-600">
        Please wait for your verification code. It may take a few minutes to arrive.
        </p>
        <input type="text" placeholder="Put code here" className="border-2 mb-4 p-2 w-full" />

        <button className="w-full rounded-lg bg-red-400  py-2 font-bold text-white hover:bg-red-500 ">
          Add OTP Code
        </button>
      </div>
    
  );
}



 


