import apiRequest from "../lib/apiRequest";
import sty from "./formatedStyle.module.css";
import edb from "./EditPopUp.module.css";
import { useEffect, useState } from "react";
import Model from "./Model"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function EditPopUp({initialDetails,close,notify,empId,name}) {
  const [isFilled, setIsFilled] = useState(false);
  const [isDisciplineFilled, setIsDisciplineFilled] = useState(false);
  const [isYoPFilled, setYoPFilled] = useState(false);
  const [qualData, setQualData] = useState([]);
  const [discipline, setdiscipline] = useState([]);
  const [required, setRequired] = useState(true);
  const [selQual, setSelQual] = useState("");
  const [showDialog,setShowDialog] = useState(false);
  const [formdata, setformdata] = useState({
    qualification: "",
    discipline: "",
    university: "",
    yearOfPassing: null,
    cgpa: null,
    percentage: null,
    userid: empId,
  });
  useEffect(() => {
    if (formdata.cgpa === null && formdata.percentage === null) {
      setRequired(true);
      console.log("none is filled");
    } else {
      console.log("one is fillind");
      setRequired(false);
    }
  }, [formdata.cgpa, formdata.percentage]);
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "qualification") {
      setIsFilled(e.target.value !== "");
      setSelQual(value);
    } else if (name === "discipline") {
      setIsDisciplineFilled(e.target.value !== "");
    } else if (name === "yearOfPassing") {
      setYoPFilled(e.target.value !== "");
    }
    if ((name === "percentage" || name === "cgpa") && value === "") {
      setformdata({ ...formdata, [name]: null });
    } else {
      setformdata({ ...formdata, [name]: value });
    }
    
  }
  useEffect(() => {
    if(initialDetails.qualification !== ""){
    setIsFilled(initialDetails.qualification !== "");
    setSelQual(initialDetails.qualification);
    setformdata({...formdata,"qualification":initialDetails.qualification});
    }
    if(initialDetails.discipline !== ""){
      if(discipline.length > 0 && discipline.includes(initialDetails.discipline)){
        setIsDisciplineFilled(initialDetails.discipline !== "");
        setformdata({...formdata,"discipline":initialDetails.discipline});
      }else{
        setIsDisciplineFilled(initialDetails.discipline !== "");
        setformdata({...formdata,"discipline":discipline[0]});
      }
    }
    setYoPFilled(initialDetails.yearOfPassing !== "");
    const fetchInitial = async () => {
      const data = await apiRequest("/qualdetail");
      setQualData(data.data);
    };
    fetchInitial();
    if(initialDetails.qualification == "10th "){
      setformdata({...initialDetails,"discipline":"10th "});
    }else if(initialDetails.qualification == "12th "){
      setformdata({...initialDetails,"discipline":"12th "});
    }else if(initialDetails.qualification == "VHSE "){
      setformdata({...initialDetails,"discipline":"VHSE "});
    }else{
    setformdata(initialDetails);
    }
    console.log(initialDetails,formdata);
  }, [initialDetails]);


  useEffect(() => {
    const fetchDisp = async () => {
      const data = await apiRequest("/listdeciplines", "POST", {
        Qualification: selQual,
      });
      setdiscipline(data.data);
    };
    if (selQual != "") {
      fetchDisp();
    }
  }, [selQual]);
  const handleSubmit = (e) => {
    const myFormData = new FormData(e.target);

    const formDataObj = {};
    myFormData.forEach((value, key) => (formDataObj[key] = value));
    console.log(formDataObj);
    setformdata({...formdata,"qualification":formDataObj.qualification,"discipline":formDataObj.discipline});
    e.preventDefault();
    setShowDialog(true);
   
  }
  const confirmSubmit = async () => {
    try{
      console.log(formdata,"values sent")
      let response = await apiRequest('/EducationalDetails','PUT',formdata);
   
    if(response.qualificationDetails){
      notify(response.message);
      setShowDialog(false);
      close();
    }
    console.log(response);
  }catch(error){
    console.log(error)
  }
}




  const year = new Date().getFullYear();
  const years = Array.from(new Array(125), (val, index) => year - index);
  const closeMessage = () => {
    setShowDialog(false);
  }
 
  return (
    <>
    {/* <ToastContainer/> */}
    <form onSubmit={(e)=>handleSubmit(e)}>
      <div className={edb.largebox}>
        <div className={edb.top_bar}>
          <h5>{name}</h5>
          <button className={edb.close} type="button" onClick={()=>{close()}}><span>X</span></button>
        </div>
        <div className={edb.smallbox}>
          <div className={edb.rows}>
            <div
              className={`${
                isFilled ? `${sty.select_filled}` : `${sty.form_group}`
              }`}
            >
              <select
                className="item quali sel"
                onChange={handleChange}
                value={formdata.qualification}
                name="qualification"
                title="Please select a qualification from the dropdown list"
                required
              >
                {qualData.map((val, index) => (
                  <>
                    <option value={val} key={index}>
                      {val}
                    </option>
                  </>
                ))}
              </select>
              <label
                htmlFor="qualification"
                className={`${isFilled ? `${sty.sel_label}` : ""}`}
              >
                <span className="star">*</span>Qualification
              </label>
            </div>
            <div
              className={`${
                isDisciplineFilled
                  ? `${sty.select_filled}`
                  : `${sty.form_group}`
              }`}
            >
              <select
                className="item quali sel"
                name="discipline"
                title="Please select a discipline from the dropdown list"
                onChange={handleChange}
                value={formdata.discipline}
                required
              >
                {discipline.map((val, index) => (
                  <>
                    <option value={val} key={index}>
                      {val}
                    </option>
                  </>
                ))}
              </select>
              <label
                htmlFor="discipline"
                className={`${isDisciplineFilled ? `${sty.sel_label}` : ""}`}
              >
                <span className="star">*</span>Discipline
              </label>
            </div>
            <div className={sty.form_group}>
              <input
                type="text"
                placeholder=""
                className="quali"
                name="university"
                title="Please enter a University( Alphabets only )"
                pattern="[A-Za-z ]+"
                onChange={handleChange}
                value={formdata.university}
                required
              ></input>
              <label htmlFor="university">
                <span className="star">*</span>University Name
              </label>
            </div>
            <div
              className={`${
                isYoPFilled ? `${sty.select_filled}` : `${sty.form_group}`
              }`}
            >
              <select
                className="item quali sel"
                name="yearOfPassing"
                onChange={handleChange}
                value={formdata.yearOfPassing}
                title="Please select a year from the dropdown list"
                required
              >
                <option value=""></option>
                {years.map((year, index) => {
                  return (
                    <option key={`year${index}`} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
              <label
                htmlFor="yearOfPassing"
                className={`${isYoPFilled ? `${sty.sel_label}` : ""}`}
              >
                <span className="star">*</span>Year of Passing
              </label>
            </div>
            <div className={sty.form_group}>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder=""
                className="quali"
                name="cgpa"
                onChange={handleChange}
                value={formdata.cgpa}
                title="Please select either one of CGPA or Percentage in decimal values"
                required={required}
              ></input>
              <label htmlFor="cgpa">CGPA</label>
            </div>
            <div className={sty.form_group}>
              <input
                type="number"
                min="0"
                max="100"
                placeholder=""
                className="quali"
                name="percentage"
                onChange={handleChange}
                value={formdata.percentage}
                required={required}
                title="Please select either one of Percentage or CGPA in decimal values"
                />
              <label htmlFor="percentage">Percentage </label>
            </div>
            <button type="submit" className="submitbtn" title="Update">
              <svg
                width="30"
                height="30"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="imag"
              >
                <path
                  d="M30 38V22H10V38M10 2V12H26M34 38H6C4.93913 38 3.92172 37.5786 3.17157 36.8284C2.42143 36.0783 2 35.0609 2 34V6C2 4.93913 2.42143 3.92172 3.17157 3.17157C3.92172 2.42143 4.93913 2 6 2H28L38 12V34C38 35.0609 37.5786
                  36.0783 36.8284 36.8284C36.0783 37.5786 35.0609 38 34 38Z"
                  stroke="#1E1E1E"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showDialog &&
      <div className={edb.Message}>
      <Model message="Are you sure, you want to update Educational Details." confirmHandler={confirmSubmit} cancelHandler={closeMessage}/>
      </div>
      }
      </form>
    </>
  );
}