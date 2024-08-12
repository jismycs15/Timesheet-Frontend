import PersonalForm from "./PersonalForm";
import Wrapper from "./Wrapper";
import ExperianceForm from "./ExperianceForm";
import MainHeading from "./MainHeading";
import './Model.css';
import EducationalForm from "./EducationalForm";
import PreviousExperiance from "./PreviousExperiance";
import { useEffect, useState } from "react";

function Register(){
    //master values so they're states are retained
    
    const [formdata, setformdata] = useState({
        qualification: "",
        decipline: "",
        university: "",
        yearOfPassing: null,
        cgpa: null,
        percentage: null,
        userid: 7,
      });
      const setterFunc = (data) => {
        console.log(data);
        setformdata(data);
    }
    useEffect(()=>{
        console.log(formdata);
    },[formdata]);
    const [currentOpen, setCurrentOpen] = useState("Personal");

    const handleToggle = (section) => {
        // Toggle the visibility of the section
        setCurrentOpen((prev) => (prev === section ? null : section));
    };
    return(
        <div className="wrapperdis">
            <div>
                    {<MainHeading />}
                </div >   
                <Wrapper name="Personal" formComponent={<PersonalForm/>} isOpen={currentOpen === "Personal"}
                onToggle={() => handleToggle("Personal")} />
                <Wrapper name="Educational Details" formComponent={<EducationalForm initialDetails={formdata} setInitialDetails={setterFunc}/>}  isOpen={currentOpen === "Educational Details"}
                onToggle={() => handleToggle("Educational Details")} />
                <Wrapper name="Previous Experience" formComponent={<ExperianceForm/> }  isOpen={currentOpen === "Previous Experience"}
                onToggle={() => handleToggle("Previous Experience")}/>

        </div>

    )
}
export default Register;