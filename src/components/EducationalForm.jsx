import React, { useEffect, useState } from "react";
import "./EducationalForm.css";
import apiRequest from "../lib/apiRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditPopUp from "./EditPopUp";
import sty from "./formatedStyle.module.css";

function EducationalForm() {
  const [qualData, setQualData] = useState([]);
  const [discipline, setdiscipline] = useState([]);
  const [selQual, setSelQual] = useState("");
  const [save, setSave] = useState();
  const [prevList, setPrevList] = useState([]);
  const [required, setRequired] = useState(true);
  const [isFilled, setIsFilled] = useState(false);
  const [isDisciplineFilled, setIsDisciplineFilled] = useState(false);
  const [isYoPFilled, setYoPFilled] = useState(false);
  const [currentEdit,setCurrentEdit] = useState(null);
  const [formdata, setformdata] = useState({
    qualification: "",
    decipline: "",
    university: "",
    yearOfPassing: null,
    cgpa: null,
    percentage: null,
    userid: 7,
  });
  useEffect(() => {
    if (formdata.cgpa == null && formdata.percentage == null) {
      setRequired(true);
      console.log("none is filled");
    } else {
      console.log("one is fillind");
      setRequired(false);
    }
  }, [formdata.cgpa, formdata.percentage]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name == "qualification") {
      setIsFilled(e.target.value !== "");
      setSelQual(value);
    } else if (name == "decipline") {
      setIsDisciplineFilled(e.target.value !== "");
    } else if (name == "yearOfPassing") {
      setYoPFilled(e.target.value !== "");
    }
    if ((name == "percentage" || name == "cgpa") && value == "") {
      setformdata({ ...formdata, [name]: null });
    } else {
      setformdata({ ...formdata, [name]: value });
    }
  }
  useEffect(() => {
    const fetchInitial = async () => {
      const data = await apiRequest("/qualdetail");
      setQualData(data.data);
    };
    fetchInitial();
    getEduData();
  }, []);

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
    e.preventDefault();
    postEduData();
  };

  const postEduData = async () => {
    const response = await apiRequest("/EducationalDetails", "POST", formdata);
    if (response) {
      toast(response?.message);
    }
    getEduData();
  };
  const getEduData = async () => {
    const response = await apiRequest("/EducationalDetails/7");
    setPrevList(response?.data || []);
    console.log(response);
  };
  const year = new Date().getFullYear();
  const years = Array.from(new Array(40), (val, index) => year - index);
  const showRequired = () => {
    if (
      (formdata.cgpa == null && formdata.percentage == null) ||
      (formdata.cgpa == "" && formdata.percentage == "")
    ) {
      return "required";
    } else {
      return "";
    }
  };
  const editEntry = (id) => {
    console.log("edited", id);
    setCurrentEdit(id);
  };
  const closeEditDialog = () => {
    setCurrentEdit(null);
  }

  return (
    <div className="tota">
      {currentEdit!=null && <EditPopUp initialDetails={currentEdit} close={closeEditDialog}/>}
      <form className="details" onSubmit={handleSubmit}>
        <div className="row">
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
              required
            >
              <option value=""></option>
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
              <span className="star">*</span>Qualifiction
            </label>
          </div>
          <div
            className={`${
              isDisciplineFilled ? `${sty.select_filled}` : `${sty.form_group}`
            }`}
          >
            <select
              className="item quali sel"
              name="decipline"
              onChange={handleChange}
              value={formdata.decipline}
              required
            >
              <option value=""></option>
              {discipline.map((val, index) => (
                <>
                  <option value={val} key={index}>
                    {val}
                  </option>
                </>
              ))}
            </select>
            <label
              htmlFor="decipline"
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
              title="Please select either one of CGPA or Percentage"
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
              title="Please select either one of CGPA or Percentage"
            />
            <label htmlFor="percentage">Percentage %</label>
          </div>
          <button type="submit" className="submitbtn">
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
        {prevList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Qualification</th>
                <th>Discipline</th>
                <th>University</th>
                <th>Year of Passing</th>
                <th>CGPA</th>
                <th>Percentage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prevList.reverse().map((val, index) => (
                <tr key={index}>
                  <td>{val.qualification}</td>
                  <td>{val.decipline}</td>
                  <td>{val.university}</td>
                  <td>{val.yearOfPassing}</td>
                  <td>{val.cgpa}</td>
                  <td>{val.percentage}</td>
                  <td>
                    <button type="button"
                      className={sty.save}
                      onClick={() => {
                        editEntry(val);
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 44 49"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M32.7058 0L27.2965 6.125L38.1152 18.375L43.5245 12.25L32.7058 0ZM21.8872 12.25L0.25 36.75V49H11.0686L32.7058 24.5L21.8872 12.25Z"
                          fill="black"
                        />
                      </svg>
                    </button>

                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 43 49"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.00793 49C6.53984 49 5.2835 48.4674 4.23892 47.4021C3.19435 46.3368 2.67117 45.0546 2.66939 43.5556V8.16667H0.00012207V2.72222H13.3465V0H29.3621V2.72222H42.7085V8.16667H40.0392V43.5556C40.0392 45.0528 39.5169 46.3349 38.4723 47.4021C37.4277 48.4692 36.1705 49.0018 34.7006 49H8.00793ZM34.7006 8.16667H8.00793V43.5556H34.7006V8.16667ZM13.3465 38.1111H18.685V13.6111H13.3465V38.1111ZM24.0236 38.1111H29.3621V13.6111H24.0236V38.1111Z"
                        fill="black"
                      />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="centertext">No previous educational details added</p>
        )}
      </form>
    </div>
  );
}
export default EducationalForm;
