//ОСНОВНАЯ ФОРМА
import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table"; // Material ui table for usual form
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import { Grid } from "@mui/material";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@mui/material/Alert";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
// Form components
import { RiFileExcel2Fill } from "react-icons/ri";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import Checkbox from "@material-ui/core/Checkbox";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
// Libraries
import swal from "sweetalert"; // https://sweetalert.js.org/guides/
// import Tooltip from "@material-ui/core/Tooltip";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import XLSX from "xlsx";
var moment = require('moment'); // require

// Colors
var crSnow = "#FFFAFA";
var crBlack = "#000000";
var crGreen = "#30aebc"; //контрастный оттенок светло-зеленого цвета.
var crBlue = "#304892"; //средний темный оттенок синего.
var crSnowBlue = "#2d838d"; //содержит в основном СИНИЙ цвет
var crSnowGrey = "#dfe0e1"; //светло серый
var TableToExcel = require("table-to-excel");
var tableToExcel = new TableToExcel();
var generator = require("generate-password");
var request = require("request-promise");

function FloatFormat(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      decimalSeparator={"."}
      thousandSeparator={" "}
      isNumericString
    />
  );
}
FloatFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
function IntegerFormat(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      // thousandSeparator={" "}
      isNumericString
    />
  );
}
IntegerFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 400,
    height: 300,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  inputFile: {
    display: "none",
  },
  btnStyle: {
    height: 25,
    margin: "8px 8px 8px 0",
    padding: 6,
    fontSize: 13,
    fontFamily: "Courier",
    color: crSnow,
    border: "1px solid #3a666c",
    backgroundColor: crSnowBlue,
  },
  paginationStyle: {
    fontSize: 14,
    color: crSnowBlue,
    fontFamily: "Courier",
  },
}));
export default (props) => {
  //This.state
  const classes = useStyles();
  const [userProfile] = useState(props.userProfile);
  const [session_id] = useState(props.userTask.session_id);
  const [process_id] = useState(props.userTask.process_id);
  const [taskID] = useState(props.userTask.taskID);
  const [Form, setForm] = useState(props.userTask.Form);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [subDocuments, setSubDocuments] = useState({});
  const [subDocList, setSubDocList] = useState({});
  const [docId, setDocId] = useState(props.userTask.docId);
  const [formType] = useState(props.userTask.formType);
  const [docList, setDocList] = useState(null);
  const [filteredDocList, setFilteredDocList] = useState(null);
  const [initialDocList, setInitialDocList] = useState(null);

  const [gridForm] = useState(props.userTask.gridForm);
  const [gridFormEnumData] = useState(props.userTask.gridFormEnumData);
  const [gridFormButtons] = useState(props.userTask.gridFormButtons);
  const [tableFormButtons, setTableFormButtons] = useState([]);
  const [enumData] = useState(props.userTask.enumData);
  const [enumOptions, setEnumOptions] = useState({});
  const [fieldValue, setFieldValue] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [buttons] = useState(props.userTask.buttons);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(null);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [updateState, setUpdateState] = useState(false);
  const [taskType] = useState(props.userTask.taskType);
  const [gridTableId, setGridTableId] = useState(null);
  const [buttonFilesId, setbuttonFilesId] = useState(null);
  const [subDocListPages, setSubDocListPages] = useState(null);

  // Set data from props to state of component
  useEffect(() => {
    console.log("MAINFORM PROPS", props.userTask);
    setbuttonFilesId(getUUID());
    if (props.userTask.docList !== "null" && props.userTask.docList !== null) {
      let parsedData = JSON.parse(props.userTask.docList);
      console.log("DOCL", parsedData);
      setDocList(parsedData);
      setSize(parseInt(props.userTask.size));
      setPage(parseInt(props.userTask.page));
      setTotalCount(parseInt(props.userTask.totalCount));
      setGridTableId(getUUID());

      // setFilteredDocList(parsedData)
      // setInitialDocList(parsedData)
      // filterDocList(0, parseInt(props.userTask.size)-1, parsedData)
    }
    if (
      props.userTask.selectedDoc !== "null" &&
      props.userTask.selectedDoc !== undefined &&
      props.userTask.selectedDoc !== null &&
      props.userTask.selectedDoc !== "{}"
    ) {
      let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc);
      let fields = {};
      if (Form !== null) {
        for (let s = 0; s < Form.sections.length; s++) {
          if (Form.sections[s].type === "Section") {
            for (let c = 0; c < Form.sections[s].contents.length; c++) {
              if (Form.sections[s].contents[c].edit === true) {
                let fieldName = Form.sections[s].contents[c].name;
                for (let s = 0; s < parsedSelectedDoc.attributes.length; s++) {
                  if (fieldName === parsedSelectedDoc.attributes[s].name) {
                    fields[fieldName] = parsedSelectedDoc.attributes[s].value;
                  }
                }
              }
            }
          }
          else if (Form.sections[s].type === "Doc") {
            for (let atr = 0; atr < parsedSelectedDoc.attributes.length; atr++) {
              if (Form.sections[s].name === parsedSelectedDoc.attributes[atr].name) {
                // console.log("Sub Doc", Form.sections[s].name)
                fields[Form.sections[s].name] = parsedSelectedDoc.attributes[atr].value;
              }
            }
            for (let s2 = 0; s2 < Form.sections[s].sections.length; s2++) {
              if (Form.sections[s].sections[s2].type === "Section") {
                // console.log(Form.sections[s].name)
                for (let c = 0; c < Form.sections[s].sections[s2].contents.length; c++) {
                  if (Form.sections[s].sections[s2].contents[c].edit === true) {
                    let fieldName = Form.sections[s].sections[s2].contents[c].name;
                    let sName = Form.sections[s].name
                    // console.log("Sub Doc", sName, fieldName)
                    for (let a = 0; a < props.userTask.subDocuments[sName].attributes.length; a++) {
                      if (fieldName === props.userTask.subDocuments[sName].attributes[a].name) {
                        fields[fieldName] = props.userTask.subDocuments[sName].attributes[a].value;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // for (let s = 0; s < parsedSelectedDoc.attributes.length; s++) {
      //   let fieldName = parsedSelectedDoc.attributes[s].name;
      //   fields[fieldName] = parsedSelectedDoc.attributes[s].value;
      // }
      console.log("SDOC", parsedSelectedDoc);
      console.log("FIELDVAL", fields);
      setSelectedDoc(parsedSelectedDoc);
      setFieldValue(fields);
    }
    if (
      props.userTask.subDocuments !== "null" &&
      props.userTask.subDocuments !== undefined &&
      props.userTask.subDocuments !== null
    ) {
      setSubDocuments(props.userTask.subDocuments);
    }
    if (
      props.userTask.subDocList !== "null" &&
      props.userTask.subDocList !== undefined &&
      props.userTask.subDocList !== null
    ) {
      setSubDocList(props.userTask.subDocList);
      let pages = {};
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].type === "DocList") {
          pages[Form.sections[s].name] = 1
        }
        else if (Form.sections[s].type === "Doc") {
          for (let s2 = 0; s2 < Form.sections[s].sections.length; s2++) {
            if (Form.sections[s].sections[s2].type === "DocList") {
              pages[Form.sections[s].sections[s2].name] = 1
            }
          }
        }
      }
      setSubDocListPages(pages)
      console.log("PG:", pages)
    }
    if (
      props.userTask.tableFormButtons !== "null" &&
      props.userTask.tableFormButtons !== undefined &&
      props.userTask.tableFormButtons !== null
    ) {
      setTableFormButtons(props.userTask.tableFormButtons);
    }
    if (
      props.userTask.enumData !== null &&
      props.userTask.enumData !== undefined &&
      props.userTask.enumData !== "null"
    ) {
      let newEnumOptions = {};
      for (let i = 0; i < props.userTask.enumData.length; i++) {
        let options = [
          {
            value: "",
            label: "Пусто",
            name: props.userTask.enumData[i].name,
          },
        ];
        for (let d = 0; d < props.userTask.enumData[i].data.length; d++) {
          options.push({
            value: props.userTask.enumData[i].data[d].id,
            label: props.userTask.enumData[i].data[d].label,
            name: props.userTask.enumData[i].name,
          });
        }
        newEnumOptions[props.userTask.enumData[i].name] = options;
      }
      setEnumOptions(newEnumOptions);
    }
    if (
      props.userTask.size !== undefined &&
      props.userTask.size !== "null" &&
      props.userTask.size !== null
    ) {
      setSize(parseInt(props.userTask.size));
      setPage(parseInt(props.userTask.page));
    }
    setUpdateState(getUUID());
  }, []);

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  const handleCheckboxChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked });
    console.log("BOOL CH", event.target.name, event.target.checked)
    console.log("FVAL", fieldValue)
  };
  // Integer input handler
  const handleIntChange = (event) => {
    console.log("EVENT", event.target.name, event.target.value);
    let stringNum = event.target.value.toString().replace(/ /g, "");
    let int = parseInt(stringNum);
    setFieldValue({ ...fieldValue, [event.target.name]: int });
  };
  // Float input handler
  const handleFloatChange = (event) => {
    let stringNum = event.target.value.toString().replace(/ /g, "");
    let float = parseFloat(stringNum);
    setFieldValue({ ...fieldValue, [event.target.name]: float });
    console.log("FLOAT CHANGE", event.target.name, fieldValue);
  };
  // Text input handler
  function handleAttachFile(files) {
    let selectedFile = files.target.files[0];
    setFieldValue({ ...fieldValue, ["LoadedFile"]: selectedFile.name });
    console.log("НАЗ-Е ФАЙЛА", selectedFile.name, fieldValue);

    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      var data = event.target.result;
      var workbook = XLSX.read(data, {
        type: "binary",
        cellText: false,
        cellDates: true,
      });
      var wsname = workbook.SheetNames[0];
      var ws = workbook.Sheets[wsname];
      var data2 = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        raw: false,
        dateNF: "dd-mm-yyyy",
      });
      console.log("data2", data2);
      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );

        let header = data2[7];
        console.log("HEAD", header);

        let attrsNames = {
          0: "LineNo",
          1: "PersonName",
          2: "AccountNo",
          3: "123test",
          4: "OpenDate",
          5: "ItemId",
        };
        let arrDocList = [];
        for (let i = 7; i < data2.length; i++) {
          let arrItems = [];
          for (let key in data2[i]) {
            let newItem = {
              name: attrsNames[key],
              value: data2[i][key],
            };
            arrItems.push(newItem);
            //console.log("ddd", dt)
          }
          arrDocList.push({ attributes: arrItems });
        }
        console.log("DOCL", arrDocList);
        setDocList(arrDocList);
      });
    };
    fileReader.readAsBinaryString(selectedFile);
  }
  function handleChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value;
    setFieldValue(fieldValue);
    console.log("FIELDVALUE", fieldValue);
  }
  async function handleSelectChange(option) {
    fieldValue[option.name] = option.value;
    console.log("OPT", option.name, option.value);
    var updateSelectedOptions = selectedOptions.slice();
    let noSuchOption = true;
    for (let i = 0; i < updateSelectedOptions.length; i++) {
      if (option.name === updateSelectedOptions[i].name) {
        updateSelectedOptions[i] = option;
        noSuchOption = false;
        setSelectedOptions(updateSelectedOptions);
        break;
      } else {
        noSuchOption = true;
      }
    }
    if (noSuchOption === true) {
      updateSelectedOptions.push(option);
      setSelectedOptions(updateSelectedOptions);
    }
    if (option.name === "RegionId") {
      for (let i = 0; i < updateSelectedOptions.length; i++) {
        if (updateSelectedOptions[i].name === "DistrictId") {
          updateSelectedOptions[i] = {
            value: "",
            label: "Пусто",
            name: "DistrictId",
          };
          console.log("ENUM SPR", updateSelectedOptions)
          setSelectedOptions(updateSelectedOptions);
          break;
        }
      }
      let filtered = await filterEnumDataByValue(
        "DistrictId",
        "regionId",
        option.value
      );
      setEnumOptions({
        ...enumOptions,
        ["DistrictId"]: filtered,
      });
    }
    else if (option.name === "DistrictId") {
      for (let i = 0; i < updateSelectedOptions.length; i++) {
        if (updateSelectedOptions[i].name === "DjamoatId") {
          updateSelectedOptions[i] = {
            value: "",
            label: "Пусто",
            name: "DjamoatId",
          };
          setSelectedOptions(updateSelectedOptions);
          break;
        }
      }
      let filtered = await filterEnumDataByValue(
        "DjamoatId",
        "districtId",
        option.value
      );
      setEnumOptions({
        ...enumOptions,
        ["DjamoatId"]: filtered,
      });
    }
    else if (option.name === "DjamoatId") {
      // Clear Village Option
      for (let i = 0; i < updateSelectedOptions.length; i++) {
        if (updateSelectedOptions[i].name === "VillageId") {
          updateSelectedOptions[i] = {
            value: "",
            label: "Пусто",
            name: "VillageId",
          };
          setSelectedOptions(updateSelectedOptions);
          break;
        }
      }
      let filtered = await filterEnumDataByValue(
        "VillageId",
        "settlementId",
        option.value
      );
      setEnumOptions({
        ...enumOptions,
        ["VillageId"]: filtered,
      });
    }
    // console.log("FVAL", fieldValue)
  }
  function filterEnumDataByValue(child, parent, value) {
    let filtered = [
      {
        value: "",
        label: "Пусто",
        name: child,
      },
    ];
    for (let i = 0; i < enumData.length; i++) {
      if (enumData[i].name === child) {
        for (let d = 0; d < enumData[i].data.length; d++) {
          if (enumData[i].data[d][parent] === value) {
            filtered.push({
              value: enumData[i].data[d].id,
              label: enumData[i].data[d].label,
              name: child,
            });
          }
        }
      }
    }
    return filtered;
  }
  function handleDateTimeChange(event) {
    // let convertedDate = getCurrentFullDateTime(event.target.value);
    // let convertedDate = moment(event.target.value).format("YYYY-MM-DD")
    let convertedDate = moment(event.target.value).format("DD-MM-YYYY HH:MM:SS")
    fieldValue[event.target.name] = convertedDate;
    setFieldValue(fieldValue);
    // console.log("DATE CHANGE", event.target.value)
  }
  function getCurrentFullDateTime(incDate) {
    var fullDate = parseDate(incDate);
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var seconds = new Date().getSeconds();
    var offsetInHours = new Date().getTimezoneOffset() / -60;
    // console.log("OFFSET", offsetInHours)
    if (offsetInHours > 0) {
      if (offsetInHours < 10) {
        offsetInHours = "+0" + offsetInHours;
      } else {
        offsetInHours = "+" + offsetInHours;
      }
    } else {
      if (offsetInHours > -10) {
        offsetInHours = "-0" + Math.abs(offsetInHours);
      }
    }
    var convertedDate =
      fullDate + " " + hours + ":" + minutes + ":" + seconds + offsetInHours;
    return convertedDate;
  }
  // Functions from props
  function sendFieldValues(commandJson) {
    props.sendFieldValues(commandJson);
  }
  function clearTabData(process_id) {
    props.clearTabData(process_id);
  }
  /****************************************************************************************************************************************************/
  //DocList Переход на первую страницу/Pagination functions
  function DocListKeyboardArrowFirstClick() {
    if (page !== 1) {
      setPage(1);
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "paginationClick" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page - page + 1 },
        },
      };
      console.log("paginationClick:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else {
      setSnackBarMessage("Вы на первой странице!");
      setShowSnackBar(true);
    }
  }
  //DocList Переход налево
  function DocListKeyboardArrowLeftClick(name) {
    if (subDocListPages[name] === 1) {
      setSnackBarMessage("Вы на первой странице!");
      setShowSnackBar(true);
    }
    else {
      setSubDocListPages({ ...subDocListPages, [name]: subDocListPages[name] - 1 })
      console.log("NEW PAGE", subDocListPages[name] - 1)
    }
  }
  //DocList Переход направо
  function DocListKeyboardArrowRightClick(name) {
    if (subDocList.length < subDocListPages[name] + 1) {
      setSnackBarMessage("Больше нет данных!");
      setShowSnackBar(true);
    }
    else {
      setSubDocListPages({ ...subDocListPages, [name]: subDocListPages[name] + 1 })
      console.log("NEW PAGE", subDocListPages[name] + 1)
    }
  }
  //Переход на первую страницу/Pagination functions
  function KeyboardArrowFirstClick() {
    if (page !== 1) {
      setPage(1);
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "paginationClick" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page - page + 1 },
        },
      };
      console.log("paginationClick:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else {
      setSnackBarMessage("Вы на первой странице!");
      setShowSnackBar(true);
    }
  }
  //Переход налево
  function KeyboardArrowLeftClick() {
    if (page === 1) {
      setSnackBarMessage("Вы на первой странице!");
      setShowSnackBar(true);
    } else {
      setPage(page - 1);
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "paginationClick" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page - 1 },
        },
      };
      console.log("paginationClick:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
  }
  //Переход направо
  function KeyboardArrowRightClick() {
    if (docList.length < size) {
      setSnackBarMessage("Больше нет данных!");
      setShowSnackBar(true);
    } else {
      setPage(page + 1);
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "paginationClick" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page + 1 },
        },
      };
      console.log("paginationClick:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
  }
  //Количество страниц
  function getPageAmount() {
    let pagesFloat = totalCount / size;
    let mathRoundOfPages = Math.round(pagesFloat);
    if (pagesFloat > mathRoundOfPages) {
      return mathRoundOfPages + 1;
    } else {
      return mathRoundOfPages;
    }
  }
  function handlePageChange(event) {
    setPage(event.target.value);
  }
  /**********************************************************************************************************************************************************/
  function handleCloseSnackBar() {
    setShowSnackBar(false);
  }
  // random UUID generator
  function getUUID() {
    const uuidv1 = require("uuid/v1");
    return uuidv1();
  }
  function swAllert(text, icon) {
    return swal({
      text: text,
      icon: icon,
      buttons: { ok: "Ок" },
    });
    // .then((click) => {
    //   if(click === "ok"){
    //     console.log("CLICK OK", click)
    //   }
    // })
  }
  // Collect data to save doc
  function getFieldValuesSaveDocument() {
    let attrs = {
      attributes: [],
    };
    if (Form !== null && Form !== "null") {
      for (let s = 0; s < Form.sections.length; s++) {
        // 1 Level
        if (Form.sections[s].type === "Section") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            if (Form.sections[s].contents[c].edit === true) {
              let name = Form.sections[s].contents[c].name;
              if (fieldValue[name] !== undefined) {
                attrs.attributes.push({
                  name: name,
                  value: fieldValue[name],
                  type: Form.sections[s].contents[c].type
                });
              }
            }
          }
        }
        // 2 Level
        else if (Form.sections[s].type === "Doc") {
          if (Form.sections[s].addToAttributes === true) {
            let name = Form.sections[s].name;
            if (fieldValue[name] !== undefined) {
              attrs.attributes.push({
                name: name,
                value: fieldValue[name],
                type: "Doc",
                subDocument: null
              });
            }
          }
          else {
            for (let s2 = 0; s2 < Form.sections[s].sections.length; s2++) {
              if (Form.sections[s].sections[s2].type === "Section") {
                for (let c2 = 0; c2 < Form.sections[s].sections[s2].contents.length; c2++) {
                  if (Form.sections[s].sections[s2].contents[c2].edit === true) {
                    let name = Form.sections[s].sections[s2].contents[c2].name;
                    if (fieldValue[name] !== undefined) {
                      attrs.attributes.push({
                        name: name,
                        value: fieldValue[name],
                        type: Form.sections[s].sections[s2].contents[c2].type
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // if (Form !== null && Form !== "null") {
    //   for (let s = 0; s < Form.sections.length; s++) {
    //     if (Form.sections[s].type === "Doc") {
    //       attrs.attributes.push({
    //         name: Form.sections[s].name,
    //         value: fieldValue[Form.sections[s].name],
    //         type: "Doc",
    //       });
    //     }
    //     else {
    //       if (Form.sections[s].type !== "DocList") {
    //         for (let c = 0; c < Form.sections[s].contents.length; c++) {
    //           let name = Form.sections[s].contents[c].name;
    //           if (fieldValue[name] !== undefined) {
    //             let val = fieldValue[name]
    //             // if (Form.sections[s].contents[c].type === "DateTime") {
    //             //   val = moment(val).format("DD-MM-YYYY HH:MM:SS")
    //             // }
    //             attrs.attributes.push({
    //               name: name,
    //               value: fieldValue[name],
    //               type: Form.sections[s].contents[c].type
    //             });
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    if (attrs.attributes.length === 0) {
      return {};
    } else {
      return attrs;
    }
  }
  // Collect data to update doc
  function getFieldValuesUpdateDocument() { //Нужно переделать на структуру ФЕЕКШИГЕУЫ
    let docToUpdate = {};
    docToUpdate["created_at"] = selectedDoc.created_at;
    docToUpdate["id"] = parseInt(docId);
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name;
        if (Form.sections[s].contents[c].type === "Bool" && (fieldValue[fieldName] === undefined || fieldValue[fieldName] === null)
        ) {
          docToUpdate[fieldName] = false;
        } else {
          docToUpdate[fieldName] = fieldValue[fieldName];
        }
      }
    }
    return docToUpdate;
  }
  function checkForRequieredFields() {
    let checkedSuccessfuly = false;
    for (let s = 0; s < Form.sections.length; s++) {
      if (Form.sections[s].type === "Section") {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          let fieldName = Form.sections[s].contents[c].name;
          if (
            Form.sections[s].contents[c].required === true &&
            (fieldValue[fieldName] === undefined ||
              fieldValue[fieldName] === null ||
              fieldValue[fieldName] === "NaN.NaN.NaN" ||
              fieldValue[fieldName].length === 0)
          ) {
            checkedSuccessfuly = false;
            props.callErrorToast('Внимание заполните поле "' + Form.sections[s].contents[c].label + '"', 4000
            );
            break;
          } else {
            checkedSuccessfuly = true;
          }
        }
      }
    }
    return checkedSuccessfuly;
  }
  //(для фильтрации)Сбор данных с полей интерфейса и формирования структуры для API
  function getFieldValuesFilterDocuments() {
    let attrs = {
      attributes: [],
    };
    if (Form !== null && Form !== "null") {
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          if (Form.sections[s].contents[c].searchable === true) {
            let name = Form.sections[s].contents[c].name;
            if (
              fieldValue[name] !== undefined &&
              fieldValue[name] !== null &&
              fieldValue[name] !== "" &&
              fieldValue[name] !== "NaN.NaN.NaN" &&
              fieldValue[name] !== "Invalid date"
            ) {
              let val = fieldValue[name]
              if (Form.sections[s].contents[c].type === "DateTime") {
                val = val.substring(0, 10)// moment(val).format("DD-MM-YYYY")
              }
              attrs.attributes.push({
                name: name,
                value: val,
                type: Form.sections[s].contents[c].type
              });
            }
          }
        }
      }
    }
    if (attrs.attributes.length === 0) {
      return {};
    } else {
      return attrs;
    }
  }
  /***USER_ACTION - действие пользователя***********************************************************************************************/
  async function buttonClick(name, item) {
    // console.log("BTN:", item.id, selectedDoc.id, userId)
    if (name === "findDocument") {
      let filterDoc = getFieldValuesFilterDocuments();

      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "findDocument" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page },
          selectedDoc: { value: JSON.stringify(filterDoc) },
        },
      };
      console.log("findDocument:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openPerson") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openPerson" },
          docId: { value: item.id },
        },
      };
      console.log("openPerson:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "select") {
      let attrs = {
        attributes: [{ name: "Person", type: "Doc", value: item.id }],
      };
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "select" },
          selectedDoc: { value: JSON.stringify(attrs) },
          docId: { value: item.id },
          emptyDoc: { value: JSON.stringify({ attributes: [] }) },
        },
      };
      console.log("select:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "saveFamMemDoc") {
      let docToSave = getFieldValuesSaveDocument();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "saveFamMemDoc" },
          document: { value: JSON.stringify(docToSave) },
        },
      };
      console.log("saveFamMemDoc:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "deleteFM") {
      let appStateId = null
      for (let i = 0; i < selectedDoc.attributes.length; i++) {
        if (selectedDoc.attributes[i].name === "Application_State") {
          appStateId = selectedDoc.attributes[i].value
        }
      }
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "deleteFM" },
          appStateId: { value: appStateId },
          familyMemberId: { value: item.id }
        }
      }
      swal({
        text: "Вы точно хотите удалить эту запись?",
        icon: "warning",
        buttons: { yes: "Да", no: "Нет" },
        dangerMode: true,
      })
        .then((click) => {
          if (click === "yes") {
            sendFieldValues(commandJson)
            swAllert("Член семьи удален!", "success")
            clearTabData(process_id)
            console.log("button deleteFM:", commandJson, item)
          }
          else {
            console.log("CLICK_deleteFM", click)
          }
        })
    }
    else if (name === "createLandPlotDoc") {
      let appStateId = null
      for (let i = 0; i < selectedDoc.attributes.length; i++) {
        if (selectedDoc.attributes[i].name === "Application_State") {
          appStateId = selectedDoc.attributes[i].value
        }
      }
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createLandPlotDoc" },
          appStateId: { value: appStateId },
        },
      };
      console.log("createLandPlotDoc:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "selectPersonLandPlot") {
      let attrs = {
        attributes: [{ name: "Person", type: "Doc", value: item.id }],
      };
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "selectPersonLandPlot" },
          selectedDoc: { value: JSON.stringify(attrs) },
          docId: { value: item.id },
          emptyDoc: { value: JSON.stringify({ attributes: [] }) },
        },
      };
      console.log("selectPersonLandPlot:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "saveLandPlotDoc") {
      let docToSave = getFieldValuesSaveDocument();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "saveLandPlotDoc" },
          document: { value: JSON.stringify(docToSave) },
        },
      };
      console.log("saveLandPlotDoc:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "deleteLP") {
      let appStateId = null
      for (let i = 0; i < selectedDoc.attributes.length; i++) {
        if (selectedDoc.attributes[i].name === "Application_State") {
          appStateId = selectedDoc.attributes[i].value
        }
      }
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "deleteLP" },
          appStateId: { value: appStateId },
          landAndPlotId: { value: item.id }
        }
      }
      // console.log("button deleteLP: ", commandJson)
      swal({
        text: "Вы точно хотите удалить эту запись?",
        icon: "warning",
        buttons: { yes: "Да", no: "Нет" },
        dangerMode: true,
      })
        .then((click) => {
          if (click === "yes") {
            sendFieldValues(commandJson)
            swAllert("Земельный участок удален!", "success")
            clearTabData(process_id)
            console.log("button deleteLP:", commandJson, item)
          }
          else {
            console.log("CLICK_deleteLP", click)
          }
        })
    }
    else if (name === "createIncomeDoc") {
      let appStateId = null
      for (let i = 0; i < selectedDoc.attributes.length; i++) {
        if (selectedDoc.attributes[i].name === "Application_State") {
          appStateId = selectedDoc.attributes[i].value
        }
      }
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createIncomeDoc" },
          appStateId: { value: appStateId },
        },
      };
      console.log("createIncomeDoc:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "selectPersonIncome") {
      let attrs = {
        attributes: [{ name: "Person", type: "Doc", value: item.id }],
      };
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "selectPersonIncome" },
          selectedDoc: { value: JSON.stringify(attrs) },
          docId: { value: item.id },
          emptyDoc: { value: JSON.stringify({ attributes: [] }) },
        },
      };
      console.log("selectPersonIncome:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "saveIncomeDoc") {
      let docToSave = getFieldValuesSaveDocument();

      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "saveIncomeDoc" },
          document: { value: JSON.stringify(docToSave) },
        },
      };
      console.log("saveIncomeDoc:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "deleteIncome") {
      let appStateId = null
      for (let i = 0; i < selectedDoc.attributes.length; i++) {
        if (selectedDoc.attributes[i].name === "Application_State") {
          appStateId = selectedDoc.attributes[i].value
        }
      }
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "deleteIncome" },
          appStateId: { value: appStateId },
          incomeId: { value: item.id }
        }
      }
      swal({
        text: "Вы точно хотите удалить эту запись?",
        icon: "warning",
        buttons: { yes: "Да", no: "Нет" },
        dangerMode: true,
      })
        .then((click) => {
          if (click === "yes") {
            sendFieldValues(commandJson)
            swAllert("Доход удален!", "success")
            clearTabData(process_id)
            console.log("button deleteIncome:", commandJson, item)
          }
          else {
            console.log("CLICK_deleteIncome", click)
          }
        })
    }
    else if (name === "createTrusteePerson") {
      let appStateId = null
      for (let i = 0; i < selectedDoc.attributes.length; i++) {
        if (selectedDoc.attributes[i].name === "Application_State") {
          appStateId = selectedDoc.attributes[i].value
        }
      }
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createTrusteePerson" },
          appStateId: { value: appStateId },
        },
      };
      console.log("createTrusteePerson:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "saveTrusteePerson") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "saveTrusteePerson" },
        },
      };
      console.log("saveTrusteePerson:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "registerState") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "registerState" },
          docId: { value: selectedDoc.id },
        },
      };
      console.log("registerState:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "calcKON") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "calcKON" },
          docId: { value: selectedDoc.id },
        },
      };
      console.log("calcKON:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "next") {
      let selDoc = getFieldValuesSaveDocument()
      let saveApp = {
        Application: selDoc,
        ApplicationState: null
      }
      selDoc.attributes.push({ name: "Application_State", type: "Doc", value: null })
      let personId = null;
      for (let i = 0; i < selDoc.attributes.length; i++) {
        if (selDoc.attributes[i].name === "Person") {
          personId = selDoc.attributes[i].value;
          break;
        }
      }
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "next" },
          personId: { value: personId },
          regDateRef: { value: moment(fieldValue.Date).format("YYYY-MM-DD") },
          application: { value: JSON.stringify(selDoc) },
          saveApp: { value: JSON.stringify(saveApp) },
          selectedDoc: { value: JSON.stringify(selDoc) }
        },
      };
      console.log("next:", commandJson.variables);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "saveAppStateDoc") {
      let docToSave = getFieldValuesSaveDocument();
      let appState = {
        attributes: [],
      };
      for (let i = 0; i < docToSave.attributes.length; i++) {
        if (docToSave.attributes[i].name !== "Application_State") {
          appState.attributes.push(docToSave.attributes[i])
        }
      }
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "saveAppStateDoc" },
          appState: { value: JSON.stringify(appState) },
          selectedDoc: { value: JSON.stringify(docToSave) }
        },
      };
      console.log("saveAppStateDoc:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "createFamMemDoc") {
      let appStateId = null
      for (let i = 0; i < selectedDoc.attributes.length; i++) {
        if (selectedDoc.attributes[i].name === "Application_State") {
          appStateId = selectedDoc.attributes[i].value
        }
      }
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createFamMemDoc" },
          appStateId: { value: appStateId },
        },
      };
      console.log("createFamMemDoc:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "refusState") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "refusState" },
          docId: { value: selectedDoc.id },
        },
      };
      console.log("SetStateRefuse:", docId);
      sendFieldValues(commandJson);
      clearTabData(process_id);

    }
    else if (name === "dataMSE") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "dataMSE" },
          docId: { value: selectedDoc.id },
        },
      };
      console.log("dataMSE:", docId);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "printKON") {
      console.log(docId);
      let url = "/api/Document/DownloadKON?appId=" + selectedDoc.id + "&userId=" + userProfile.userId;
      await fetch(
        url,
        {
          mode: 'no-cors',
          method: 'GET',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        }
      )
        .then(response => response.blob())
        .then(blob => {
          // console.log("RESP", blob)
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = `Печать таблицы КОН.xls`;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove();  //afterwards we remove the element again         
        })
        .catch(error => console.error(error));
    }
    else if (name === "filterClMonthDocList") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "filterClMonthDocList" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page },
          selectedDoc: { value: JSON.stringify(fieldValue) },
        },
      };
      console.log("filterClMonthDocList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "createClosedMonthList") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createClosedMonthList" },
          searchBody: { value: JSON.stringify(filterDoc) },
          year: { value: fieldValue["Year"] },
          month: { value: fieldValue["Month"] },
        },
      };
      console.log("createClosedMonthList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "completeCloseMonth") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "completeCloseMonth" },
          searchBody: { value: JSON.stringify(filterDoc) },
        },
      };
      console.log("completeCloseMonth:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openClMonthDocList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openClMonthDocList" },
          docId: { value: item.id },
        },
      };
      console.log("openClMonthDocList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openBankAccountGetList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openBankAccountGetList" },
          docId: { value: item.id },
        },
      };
      console.log("openBankAccountGetList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openBankAccountGetList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openBankAccountGetList" },
          docId: { value: item.id },
        },
      };
      console.log("openBankAccountGetList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "downloadAccToExcel") {
      console.log(docId);
      let url =
        "http://192.168.0.54/ASIST-MODERN-API/api/OpenBankAccount/DistrictRegistryToExcel?docId=" +
        docId;
      await fetch(url, {
        mode: "no-cors",
        method: "GET",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/vnd.ms-excel",
        },
      })
        .then(async function (response) {
          let docUrl = URL.createObjectURL(response);
          fetch(docUrl)
            .then((res) => res.blob())
            .then((blob) => {
              blob.name = "dfnbdfxndfn";
              var blobToBase64 = function (f, cb) {
                let reader = new FileReader();
                reader.onload = function () {
                  // converts blob to base64
                  var dataUrl = reader.result;
                  var base64 = dataUrl.split(",")[1];
                  cb(base64);
                };
                reader.readAsDataURL(f);
              };
              blobToBase64(response, async function (base64) {
                // encode blobs to send to socket
                let newBlob = {
                  name: "sgseg",
                  blob: base64,
                  size: response.size,
                };
                // console.log("RESP", response)
                // let blob = new Blob([response], {type: "octet/stream"})
                var url = window.URL.createObjectURL(newBlob);
                var a = document.createElement("a");
                a.href = url;
                a.download = `cfhdfh.xlsx`;
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();
                a.remove();
              });
            });
          //afterwards we remove the element again
        })
        // .then(response => response.blob())
        // .then(blob => {
        //   console.log("RESP", blob)
        //   var url = window.URL.createObjectURL(blob)
        //   var a = document.createElement('a')
        //   a.href = url
        //   a.download = `cfhdfh.xlsx`
        //   document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
        //   a.click()
        //   a.remove()  //afterwards we remove the element again
        // })
        .catch((error) => console.error(error));

      // let commandJson = {
      //   commandType: "downloadAccToExcel",
      //   session_id: session_id,
      //   process_id: process_id,
      //   userId: userProfile.userId,
      //   userRole: userProfile.userRole,
      //   docId: docId
      // }
      // console.log("downloadAccToExcel:", commandJson)
      // sendFieldValues(commandJson)
    }
    else if (name === "openBankAccountGetGrid") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openBankAccountGetGrid" },
          docId: { value: item.id },
        },
      };
      console.log("openBankAccountGetGrid:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openBankAccDistrRegister") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openBankAccDistrRegister" },
          docId: { value: item.id },
        },
      };
      console.log("openBankAccDistrRegister:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "completeBankAccount") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "completeBankAccount" },
        },
      };
      console.log("completeBankAccount:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openUploadGetList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openUploadGetList" },
          docId: { value: item.id },
        },
      };
      console.log("openUploadGetList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openPayRegisterGetList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openPayRegisterGetList" },
          docId: { value: item.id },
        },
      };
      console.log("openPayRegisterGetList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openRegDistrDetailForm") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openRegDistrDetailForm" },
          docId: { value: item.id },
        },
      };
      console.log("openRegDistrDetailForm:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "createPayRegPreview") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createPayRegPreview" },
          searchBody: { value: JSON.stringify(filterDoc) },
          year: { value: fieldValue["Year"] },
          month: { value: fieldValue["Month"] },
        },
      };
      console.log("createPayRegPreview:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openPreviewDocList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          selectedDoc: { value: JSON.stringify(item) },
          userAction: { value: "openPreviewDocList" },
          docId: { value: item.id },
        },
      };
      console.log("button openPreviewDocList: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "completePreviewDocList") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "completePreviewDocList" },
        },
      };
      console.log("completePreviewDocList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "downloadToExcel") {
      tableToExcel.render(gridTableId);
    }
    else if (name === "sendFile") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "sendFile" },
          body: { value: JSON.stringify(docList) },
          selectedDoc: { value: JSON.stringify(fieldValue) },
        },
      };
      console.log("sendFile:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "createDocument") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createDocument" },
        },
      };
      console.log(":", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "cancel") {
      const commandJson = {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "cancel" },
        },
      };
      console.log("button cancel: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openDocument") {
      // console.log("ITEM", item)
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          selectedDoc: { value: JSON.stringify(item) },
          userAction: { value: "openDocument" },
          docId: { value: item.id },
        },
      };
      console.log("button openDocument: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "openReferenceDocument") {
      // console.log("ITEM", item)
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          apiName: { value: item.controller },
          userAction: { value: "openReferenceDocument" },
          gridFormDefId: { value: item.grid_form },
          creatingFormDefId: { value: item.creating_form },
          editFormDefId: { value: item.edit_form },
        },
      };
      console.log("button openReferenceDocument: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else if (name === "updateDocument") {
      let updateBody = getFieldValuesUpdateDocument();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "updateDocument" },
          document: { value: JSON.stringify(updateBody) },
        },
      };
      console.log("updateDocument:", commandJson);
      // sendFieldValues(commandJson);
      // // swAllert("Данные успешно обновлены!", "success")
      // clearTabData(process_id);
    }
    else if (name === "saveDocument") {
      let result = checkForRequieredFields()
      if (result === true) {
        let docToSave = getFieldValuesSaveDocument();

        let commandJson = {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "saveDocument" },
            document: { value: JSON.stringify(docToSave) },
            emptyDoc: { value: JSON.stringify({ attributes: [] }) },
          },
        };
        console.log("saveDocument:", commandJson);
        sendFieldValues(commandJson);
        clearTabData(process_id);
      }

    }
    else if (name === "back") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "back" },
        },
      };
      console.log("button back:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
    else {
      console.log("UNKNOWN Button ", name);
    }
  }
  // Convert date to approptiate format
  function parseDate(date) {

    let newDate = moment(date, 'DD-MM-YYYY').format("YYYY-MM-DD")
    // let newDate = moment(new Date(date)).format("YYYY-MM-DD")

    // let newDate = date.substring(0, 10);
    // console.log("CDATE", date, newDate)
    return newDate
  }
  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section) {
    return (
      <table>
        <thead>
          <tr>
            <td
              style={{
                width: "100%",
                color: crSnow,
                fontSize: 16,
                textAlign: "center",
                textShadow: "1px 1px black",
                fontFamily: "Courier",
                backgroundColor: crGreen,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                // wordWrap: "break-word",
              }}
            >
              {section.label}
            </td>
          </tr>
        </thead>
        {bodyBuilder(section)}
      </table>
    );
  }
  // Create body of each section and call contentBuilder function
  function bodyBuilder(section) {
    return (
      <table>
        <tbody>
          {/* 1 Level */}
          {section.type === "Section" &&
            section.contents.map((contentItem) =>
              contentItem.show === true && (
                <tr>
                  <td
                    style={{
                      width: "40%",
                      color: crBlue,
                      fontSize: 14,
                      fontFamily: "Courier",
                    }}
                  >
                    {contentItem.label}
                  </td>
                  <td style={{ width: "60%" }}>
                    {contentBuilder(contentItem, section, 1)}
                  </td>
                </tr>
              )
            )
          }
          {section.type === "Doc" &&
            section.sections.map(section2 => {
              if (section2.type === "Section") {
                return (
                  <>
                    <table width="100%">
                      <thead>
                        <tr>
                          <td
                            style={{
                              width: "100%",
                              color: crSnow,
                              fontSize: 16,
                              textAlign: "center",
                              textShadow: "1px 1px black",
                              fontFamily: "Courier",
                              backgroundColor: crGreen,
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                              // wordWrap: "break-word",
                            }}
                          >
                            {section2.label}
                          </td>
                        </tr>
                      </thead>
                    </table>
                    <table width="100%">
                      {
                        section2.contents.map(cItem => {
                          let sItem = section
                          sItem.type = "Doc"
                          sItem.name = section.name
                          if (cItem.show === true) {
                            return (
                              <tr>
                                <td
                                  style={{
                                    width: "40%",
                                    color: crBlue,
                                    fontSize: 14,
                                    fontFamily: "Courier",
                                  }}
                                >
                                  {cItem.label}
                                </td>
                                <td style={{ width: "60%" }}>
                                  {contentBuilder(cItem, sItem, 2)}
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                    </table>
                  </>
                )
              }
              else if (section2.type === "DocList") {
                return (
                  <Grid>
                    <table
                      size="auto"
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead size="auto" style={{ backgroundColor: crGreen }}>
                        <tr>
                          {subDocList[section2.name].buttons !== null && subDocList[section2.name].buttons !== "null" &&
                            <td
                              rowSpan="2"
                              key={"action"}
                              style={{
                                color: crSnow,
                                padding: 7,
                                minWidth: 70,
                                fontSize: 14,
                                textAlign: "center",
                                fontFamily: "Courier",
                                border: "0.5px solid #3a666c",
                              }}
                            >
                              Действие
                            </td>
                          }
                          {section2.sections.map((section3) => {
                            return (
                              <td
                                colSpan={section3.contents.length}
                                style={{
                                  fontSize: 16,
                                  color: crSnow,
                                  textAlign: "center",
                                  fontFamily: "Courier",
                                  border: "0.5px solid #3a666c",
                                }}
                              >
                                {section3.label}
                              </td>
                            )
                          })}
                        </tr>
                        <tr>
                          {section2.sections.map((section3) =>
                            section3.contents.map((contentItem) => {
                              return (
                                <td
                                  rowSpan="2"
                                  style={{
                                    color: crSnow,
                                    padding: 7,
                                    fontSize: 14,
                                    textAlign: "center",
                                    fontFamily: "Courier",
                                    border: "0.5px solid #3a666c",
                                  }}
                                >
                                  {contentItem.label}
                                </td>
                              );
                            })
                          )}
                        </tr>
                      </thead>
                      {subDocList !== null && subDocList !== undefined && (
                        <TableBody>
                          {Object.keys(subDocList).length !== 0 &&
                            fetchSubDocListBySize(section2.name, subDocList[section2.name].documents).map((dataItem, index) => (

                              index < subDocListPages[section2.name] * 10 &&
                              <tr style={{ height: 35 }}>
                                {subDocList[section2.name].buttons !== null && subDocList[section2.name].buttons !== "null" &&
                                  subDocList[section2.name].buttons.length > 0 && (
                                    <td
                                      style={{
                                        maxWidth: 34,
                                        textAlign: "center",
                                      }}
                                    >
                                      {subDocList[section2.name].buttons.map((button) => (
                                        <Button
                                          onClick={() =>
                                            buttonClick(button.name, dataItem)
                                          }
                                          style={{
                                            height: 20,
                                            fontSize: 10,
                                            maxWidth: 36,
                                            marginTop: 4,
                                            marginBottom: 4,
                                            fontWeight: "bold",
                                            fontFamily: "Courier",
                                            color: crSnowBlue,
                                            backgroundColor: crSnow,
                                            border: "1px solid #2d838d", //crSnowBlue
                                          }}
                                        >
                                          {button.label}
                                        </Button>
                                      ))}
                                    </td>
                                  )}
                                {section2.sections.map((section3) => {
                                  return section3.contents.map((contentItem) => {
                                    for (let a = 0; a < dataItem.attributes.length; a++) {
                                      if (dataItem.attributes[a].name === contentItem.name) {
                                        return (
                                          <td
                                            style={{
                                              fontSize: 12,
                                              color: crGreen,
                                              minWidth: "70px",
                                              textAlign: "left",
                                              fontFamily: "Courier",
                                              borderTop: "0.5px solid #a6a6a6",
                                            }}
                                          >
                                            {/* {dataItem.attributes[a].name} */}
                                            {getGridFormItems(dataItem.attributes[a], contentItem)}
                                          </td>
                                        )
                                      }
                                    }
                                  })
                                })}
                              </tr>
                            ))}
                        </TableBody>
                      )}
                    </table>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      style={{
                        backgroundColor: crSnowGrey,
                        borderTop: "0.5px solid #a6a6a6",
                        borderBottom: "0.5px solid grey",
                      }}
                    >
                      <tr>
                        <td>
                          <LightTooltip title="Переход на первую страницу">
                            <IconButton onClick={() => DocListKeyboardArrowFirstClick()}>
                              <FirstPageIcon
                                style={{ fontSize: 18, color: crSnowBlue }}
                              />
                            </IconButton>
                          </LightTooltip>
                        </td>
                        <td>
                          <LightTooltip title="Переход на предыдущую страницу">
                            <IconButton
                              onClick={() => DocListKeyboardArrowLeftClick(section2.name)}
                            >
                              <ArrowBackIosIcon
                                className={classes.paginationStyle}
                              />
                            </IconButton>
                          </LightTooltip>
                        </td>
                        <td className={classes.paginationStyle}>
                          <input
                            style={{
                              maxWidth: 18,
                              color: crSnow,
                              textAlign: "center",
                              border: "0.5px solid snow",
                              backgroundColor: crSnowBlue,
                            }}
                            value={subDocListPages[section2.name]}
                          // onChange={handlePageChange}
                          ></input>
                        </td>
                        <td>
                          <LightTooltip title="Переход на следующую страницу">
                            <IconButton
                              onClick={() => DocListKeyboardArrowRightClick(section2.name)}
                            >
                              <ArrowForwardIosIcon
                                className={classes.paginationStyle}
                              />
                            </IconButton>
                          </LightTooltip>
                        </td>
                        <td className={classes.paginationStyle}>
                          Кол-во строк: {subDocList[section2.name].totalCount}
                        </td>
                      </tr>
                    </Grid>
                  </Grid>
                )
              }
            })
          }
          {section.type === "DocList" &&
            <Grid>
              <table
                size="auto"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead size="auto" style={{ backgroundColor: crGreen }}>
                  <tr>
                    {subDocList[section.name].buttons !== null && subDocList[section.name].buttons !== "null" &&
                      <td
                        rowSpan="2"
                        key={"action"}
                        style={{
                          color: crSnow,
                          padding: 7,
                          minWidth: 70,
                          fontSize: 14,
                          textAlign: "center",
                          fontFamily: "Courier",
                          border: "0.5px solid #3a666c",
                        }}
                      >
                        Действие
                      </td>
                    }
                    {section.sections.map((section2) => {
                      return (
                        <td
                          colSpan={section2.contents.length}
                          style={{
                            fontSize: 16,
                            color: crSnow,
                            textAlign: "center",
                            fontFamily: "Courier",
                            border: "0.5px solid #3a666c",
                          }}
                        >
                          {section2.label}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    {section.sections.map((section) =>
                      section.contents.map((contentItem) => {
                        return (
                          <td
                            rowSpan="2"
                            style={{
                              color: crSnow,
                              padding: 7,
                              fontSize: 14,
                              textAlign: "center",
                              fontFamily: "Courier",
                              border: "0.5px solid #3a666c",
                            }}
                          >
                            {contentItem.label}
                          </td>
                        );
                      })
                    )}
                  </tr>
                </thead>
                {subDocList !== null && subDocList !== undefined && (
                  <TableBody>
                    {Object.keys(subDocList).length !== 0 &&
                      fetchSubDocListBySize(section.name, subDocList[section.name].documents).map((dataItem, index) => (

                        index < subDocListPages[section.name] * 10 &&
                        <tr style={{ height: 35 }}>
                          {subDocList[section.name].buttons !== "null" && subDocList[section.name].buttons !== null &&
                            subDocList[section.name].buttons.length > 0 && (
                              <td
                                style={{
                                  maxWidth: 34,
                                  textAlign: "center",
                                }}
                              >
                                {subDocList[section.name].buttons.map((button) => (
                                  <Button
                                    onClick={() =>
                                      buttonClick(button.name, dataItem)
                                    }
                                    style={{
                                      height: 20,
                                      fontSize: 10,
                                      maxWidth: 36,
                                      marginTop: 4,
                                      marginBottom: 4,
                                      fontWeight: "bold",
                                      fontFamily: "Courier",
                                      color: crSnowBlue,
                                      backgroundColor: crSnow,
                                      border: "1px solid #2d838d", //crSnowBlue
                                    }}
                                  >
                                    {button.label}
                                  </Button>
                                ))}
                              </td>
                            )}
                          {section.sections.map((section2) => {
                            return section2.contents.map((contentItem) => {
                              for (let a = 0; a < dataItem.attributes.length; a++) {
                                if (dataItem.attributes[a].name === contentItem.name) {
                                  return (
                                    <td
                                      style={{
                                        fontSize: 12,
                                        color: crGreen,
                                        minWidth: "70px",
                                        textAlign: "left",
                                        fontFamily: "Courier",
                                        borderTop: "0.5px solid #a6a6a6",
                                      }}
                                    >
                                      {/* {dataItem.attributes[a].name} */}
                                      {getGridFormItems(dataItem.attributes[a], contentItem)}
                                    </td>
                                  )
                                }
                              }
                            })
                          })}
                        </tr>
                      ))}
                  </TableBody>
                )}
              </table>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                style={{
                  backgroundColor: crSnowGrey,
                  borderTop: "0.5px solid #a6a6a6",
                  borderBottom: "0.5px solid grey",
                }}
              >
                <tr>
                  <td>
                    <LightTooltip title="Переход на первую страницу">
                      <IconButton onClick={() => DocListKeyboardArrowFirstClick()}>
                        <FirstPageIcon
                          style={{ fontSize: 18, color: crSnowBlue }}
                        />
                      </IconButton>
                    </LightTooltip>
                  </td>
                  <td>
                    <LightTooltip title="Переход на предыдущую страницу">
                      <IconButton
                        onClick={() => DocListKeyboardArrowLeftClick(section.name)}
                      >
                        <ArrowBackIosIcon
                          className={classes.paginationStyle}
                        />
                      </IconButton>
                    </LightTooltip>
                  </td>
                  <td className={classes.paginationStyle}>
                    <input
                      style={{
                        maxWidth: 18,
                        color: crSnow,
                        textAlign: "center",
                        border: "0.5px solid snow",
                        backgroundColor: crSnowBlue,
                      }}
                      value={subDocListPages[section.name]}
                    // onChange={handlePageChange}
                    ></input>
                  </td>
                  <td>
                    <LightTooltip title="Переход на следующую страницу">
                      <IconButton
                        onClick={() => DocListKeyboardArrowRightClick(section.name)}
                      >
                        <ArrowForwardIosIcon
                          className={classes.paginationStyle}
                        />
                      </IconButton>
                    </LightTooltip>
                  </td>
                  <td className={classes.paginationStyle}>
                    Кол-во строк: {subDocList[section.name].totalCount}
                  </td>
                </tr>
              </Grid>
            </Grid>
          }
        </tbody>
      </table>
    );
  }
  // Creating components by it's type
  function contentBuilder(contentItem, section, level) {
    // console.log("contentItem", contentItem, section.name)
    if (contentItem.type === "Text") {
      return (
        <TextField
          name={contentItem.name}
          style={{ width: "100%", height: 10 }}
          disabled={formType === "view" || contentItem.edit === false ? true : false}
          onBlur={handleChange}
          defaultValue={getValue(contentItem, section, level)}
        />
      );
    }
    else if (contentItem.type === "Enum") {
      let selectedOption = {
        value: "",
        label: "Пусто",
        name: contentItem.name,
      };
      let fieldVal = null

      if (section.type === "Doc" && contentItem.edit === false) {
        // console.log("EN DOC", section.name, contentItem)
        fieldVal = getSubDocFieldValue(section.name, contentItem.name)
      }
      else { fieldVal = fieldValue[contentItem.name] }

      if (fieldVal !== undefined) {
        for (let i = 0; i < enumOptions[contentItem.name].length; i++) {
          if (fieldVal === enumOptions[contentItem.name][i].value) {
            selectedOption = enumOptions[contentItem.name][i];
            break;
          }
        }
      }
      return (
        <Select
          name={contentItem.name}
          value={selectedOption}
          onChange={handleSelectChange}
          options={enumOptions[contentItem.name]}
          isDisabled={formType === "view" || contentItem.edit === false ? true : false}
        />
      );
    }
    else if (contentItem.type === "Bool") {
      return (
        <Checkbox
          style={{
            maxWidth: 20,
            height: 10,
            color: formType === "view" || contentItem.edit === false ? "#37474f" : "grey",
          }}
          name={contentItem.name}
          onChange={handleCheckboxChange}
          disabled={formType === "view" || contentItem.edit === false ? true : false}
          checked={getValue(contentItem, section, level)}
        />
      );
    }
    else if (contentItem.type === "Int") {
      return (
        <TextField
          disabled={formType === "view" || contentItem.edit === false ? true : false}
          style={{ width: "100%", height: 10 }}
          defaultValue={getValue(contentItem, section, level)}
          // value = {(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name]: ""}
          onBlur={handleIntChange}
          name={contentItem.name}
          InputProps={{ inputComponent: IntegerFormat }}
        />
      );
    }
    else if (contentItem.type === "Float") {
      // console.log("FLOAT VAL", fieldValue[contentItem.name]);
      return (
        <TextField
          name={contentItem.name}
          onBlur={handleFloatChange}
          value={getValue(contentItem, section, level)}
          style={{ width: "100%", height: 10 }}
          disabled={formType === "view" || contentItem.edit === false ? true : false}
          InputProps={{ inputComponent: FloatFormat }}
        />
      );
    }
    else if (contentItem.type === "DateTime") {
      return (
        <TextField
          type="date"
          name={contentItem.name}
          onBlur={handleDateTimeChange} // YYYY-MM-DD
          style={{ width: "100%", height: 10 }}
          defaultValue={getValue(contentItem, section, level)} // YYYY-DD-MM
          disabled={formType === "view" || contentItem.edit === false ? true : false}
          InputLabelProps={{ shrink: true }}
        />
      );
    }
  }
  function getValue(cItem, section, level) {
    let value = null
    if (section.type === "Doc" && cItem.edit === false) {
      value = getSubDocFieldValue(section.name, cItem.name)
    }
    else {
      if (cItem.edit === true) { // level === 1 && 
        value = fieldValue[cItem.name]
      }
      else {
        for (let i = 0; i < selectedDoc.attributes.length; i++) {
          if (cItem.name === selectedDoc.attributes[i].name) {
            value = selectedDoc.attributes[i].value
            // console.log("VAL", selectedDoc.attributes[i].value)
          }
        }
      }
    }
    if (cItem.type === "Text" || cItem.type === "Int" || cItem.type === "Float") {
      if (value === undefined || value === null) {
        value = ""
      }
    }
    else if (cItem.type === "Bool") {
      if (value === false || value === null || value === undefined || value === "False") {
        value = false
        // console.log("BOOL VAL", cItem.name, value)
      }
      else {
        value = true
      }
    }
    else if (cItem.type === "DateTime") {
      if (value === null || value === "" || value === undefined) {
        value = ""
      }
      else {
        // if (section.cItem.type === "Doc") {
        value = parseDate(value)
        // }
        // console.log("DD", value, cItem.name)
      }
    }
    return value
  }
  function getSubDocFieldValue(subDocName, contentItemName) {
    try {
      for (let i = 0; i < subDocuments[subDocName].attributes.length; i++) {
        // console.log("getSubDocFieldValue:", subDocuments[subDocName].attributes.length)
        if (subDocuments[subDocName].attributes[i].name === contentItemName) {
          return subDocuments[subDocName].attributes[i].value
        }
      }
    }
    catch (er) { return null }
  }
  // Create grid form components
  function getGridFormItems(attribute, formItem) {
    // console.log("ITEM", attribute, formItem)
    if (formItem.type === "Text") {
      if (attribute.value === null || attribute.value === "" || attribute.value === undefined) {
        return (
          <td
            align="center" style={{ color: crBlack, fontSize: 13, fontFamily: "Courier" }}
          >
            -
          </td>
        );
      }
      else {
        return <td>{attribute.value}</td>;
      }
    }
    else if (formItem.type === "Enum") {
      if (attribute.value === null || attribute.value === "" || attribute.value === undefined) {
        return (
          <td
            align="center" style={{ color: crBlack, fontSize: 13, fontFamily: "Courier" }}
          >
            -
          </td>
        );
      }
      else {
        // console.log("ENUM", attribute.name, attribute.value, attribute.type)
        for (let i = 0; i < gridFormEnumData.length; i++) {
          if (attribute.name === gridFormEnumData[i].name) {
            for (let l = 0; l < gridFormEnumData[i].data.length; l++) {
              if (gridFormEnumData[i].data[l].id === attribute.value) {
                return gridFormEnumData[i].data[l].label
              }
            }
          }
        }
      }
    }
    else if (formItem.type === "DateTime") {
      if (attribute.value === null || attribute.value === "" || attribute.value === undefined) {
        return (
          <td
            align="center" style={{ color: crBlack, fontSize: 13, fontFamily: "Courier" }}
          >
            -
          </td>
        );
      }
      else {
        let dateRev = attribute.value.substring(0, 10);
        return dateRev;
      }
    }
    else if (formItem.type === "Float") {
      if (attribute.value === null || attribute.value === "" || attribute.value === undefined) {
        return (
          <td
            align="center"
            style={{ color: crBlack, fontSize: 13, fontFamily: "Courier" }}
          ></td>
        );
      } else {
        return <td>{parseFloat(attribute.value).toFixed(2)}</td>;
      }
    }
    else if (formItem.type === "Int") {
      if (attribute.value === null || attribute.value === "" || attribute.value === undefined) {
        return (
          <td
            align="center"
            style={{ color: crBlack, fontSize: 13, fontFamily: "Courier" }}
          ></td>
        );
      }
      else {
        return <td>{attribute.value}</td>;
      }
    }
    else if (formItem.type === "Bool") {
      // return <td>{attribute.value}</td>;
      let val = true
      if (attribute.value === false || attribute.value === null || attribute.value === undefined || attribute.value === "False") {
        val = false
      }
      return (
        <Checkbox
          style={{ maxWidth: 20, height: 15, color: val === false ? "#37474f" : "grey" }}
          name={formItem.name}
          checked={val}
        />
      );
    }
  }
  function fetchSubDocListBySize(name, documents) {
    let s = 10
    let docs = []
    let from = (subDocListPages[name] * s) - s
    let to = (subDocListPages[name] * s) - 1
    for (let i = 0; i < documents.length; i++) {
      if (i >= from && i <= to) {
        docs.push(documents[i])
      }
    }
    return docs
  }
  // console.log("FIELDS", fieldValue)
  // console.log("SOP", selectedOptions)
  if (updateState !== null) {
    try {
      return (
        <Grid>
          {/* Create main search table */}
          {Form !== null && Form !== "null" && (
            <Grid container style={{ margin: "20px 0 17 0" }} key={updateState}>
              <Paper
                style={{
                  borderRadius: 10,
                  boxShadow: "0 2px 15px 0 #919191",
                }}
              >
                <Table
                  bordered
                  size="small"
                  style={{
                    borderRadius: 10,
                    borderCollapse: "collapse",
                  }}
                >
                  {Form.sections.map((section) => {
                    return sectionBuilder(section);
                  })}
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    style={{
                      padding: 6,
                      backgroundColor: crSnowGrey,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}
                  >
                    {buttons.map((button, index) =>
                      button.name === "selectFile" ? (
                        <div>
                          <input
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            className={classes.inputFile}
                            id={buttonFilesId}
                            multiple
                            type="file"
                            onChange={handleAttachFile}
                          />
                          <label htmlFor={buttonFilesId}>
                            <Button
                              component="span"
                              key={index}
                              variant="outlined"
                              className={classes.btnStyle}
                              endIcon={<AttachFileIcon />}
                            >
                              Прикрепить файл
                            </Button>
                          </label>
                        </div>
                      ) : (
                        <Button
                          key={index}
                          name={button.name}
                          variant="outlined"
                          onClick={() => buttonClick(button.name, null)}
                          className={classes.btnStyle}
                        >
                          {button.label}
                        </Button>
                      )
                    )}
                  </Grid>
                </Table>
              </Paper>
            </Grid>
          )}
          <br></br>
          <Grid>
            {tableFormButtons.map((button) => (
              <Button
                className={classes.btnStyle}
                key={button.name}
                name={button.name}
                variant="outlined"
                // id={dataItem.id}
                value={button.name}
                onClick={() => buttonClick(button.name, null)}
              >
                {button.label}
              </Button>
            ))}
          </Grid>
          {/* Create grid table with data from doclist */}
          {gridForm !== null && (
            <Grid container direction="row" justify="flex-start" spacing={0}>
              <Paper style={{ boxShadow: "0 1px 15px 0 #919191" }}>
                <table
                  id={gridTableId}
                  size="auto"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead size="auto" style={{ backgroundColor: crGreen }}>
                    <tr>
                      {gridFormButtons !== null && (
                        <td
                          colSpan="1"
                          style={{
                            color: crBlack,
                            fontSize: 18,
                            textAlign: "center",
                            border: "0.5px solid #3a666c",
                          }}
                        ></td>
                      )}
                      {gridForm.sections.map((section) => {
                        return (
                          <td
                            colSpan={section.contents.length}
                            style={{
                              fontSize: 16,
                              color: crSnow,
                              textAlign: "center",
                              fontFamily: "Courier",
                              border: "0.5px solid #3a666c",
                            }}
                          >
                            {section.label}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      {gridFormButtons !== null &&
                        gridFormButtons.length > 0 && (
                          <td
                            rowSpan="2"
                            key={"action"}
                            style={{
                              color: crSnow,
                              padding: 7,
                              minWidth: 70,
                              fontSize: 14,
                              textAlign: "center",
                              fontFamily: "Courier",
                              border: "0.5px solid #3a666c",
                            }}
                          >
                            Действие
                          </td>
                        )}
                      {gridForm.sections.map((section) =>
                        section.contents.map((contentItem) => {
                          return (
                            <td
                              rowSpan="2"
                              style={{
                                color: crSnow,
                                padding: 7,
                                fontSize: 14,
                                textAlign: "center",
                                fontFamily: "Courier",
                                border: "0.5px solid #3a666c",
                              }}
                            >
                              {contentItem.label}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  </thead>
                  {/* ВНУТРЕННЯ ЧАСТЬ ТАБЛИЦЫ */}
                  {docList !== null && (
                    <TableBody>
                      {Object.keys(docList).length !== 0 &&
                        docList.map((dataItem) => (
                          <tr style={{ height: 35 }}>
                            {gridFormButtons !== null &&
                              gridFormButtons.length > 0 && (
                                <td
                                  style={{
                                    maxWidth: 34,
                                    textAlign: "center",
                                  }}
                                >
                                  {gridFormButtons !== "null" &&
                                    gridFormButtons.map((button) => (
                                      <Button
                                        key={button.name}
                                        name={button.name}
                                        value={button.name}
                                        onClick={() =>
                                          buttonClick(button.name, dataItem)
                                        }
                                        style={{
                                          height: 20,
                                          fontSize: 10,
                                          maxWidth: 36,
                                          marginTop: 4,
                                          marginBottom: 4,
                                          fontWeight: "bold",
                                          fontFamily: "Courier",
                                          color: crSnowBlue,
                                          backgroundColor: crSnow,
                                          border: "1px solid #2d838d", //crSnowBlue
                                        }}
                                      >
                                        {button.label}
                                      </Button>
                                    ))}
                                </td>
                              )}
                            {gridForm.sections.map((section) => {
                              return section.contents.map((contentItem) => {
                                for (let a = 0; a < dataItem.attributes.length; a++) {
                                  // console.log("ITEM AZA", dataItem.attributes[a].name, "ITEM KGS", contentItem.name)
                                  //dataItem.attributes[a].name - название поля из API
                                  //contentItem.name - название поля из JSON
                                  if (dataItem.attributes[a].name === contentItem.name) {
                                    return (
                                      <td
                                        style={{
                                          fontSize: 12,
                                          color: crBlack,
                                          minWidth: "70px",
                                          textAlign: "left",
                                          fontFamily: "Courier",
                                          borderTop: "0.5px solid #a6a6a6",
                                          // строка в таблице и borderTop (сверху)
                                        }}
                                      >
                                        {getGridFormItems(dataItem.attributes[a], contentItem)}
                                      </td>
                                    );
                                  }
                                }
                              });
                            })}
                          </tr>
                        ))}
                    </TableBody>
                  )}
                </table>

                {/* НИЖНИЙ КОЛОНТИТУЛ */}
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  style={{
                    backgroundColor: crSnowGrey,
                    borderTop: "0.5px solid #a6a6a6",
                    borderBottom: "0.5px solid grey",
                  }}
                >
                  <tr>
                    <td>
                      <LightTooltip title="Переход на первую страницу">
                        <IconButton onClick={() => KeyboardArrowFirstClick()}>
                          <FirstPageIcon
                            style={{ fontSize: 18, color: crSnowBlue }}
                          />
                        </IconButton>
                      </LightTooltip>
                    </td>
                    <td>
                      <LightTooltip title="Переход на предыдущую страницу">
                        <IconButton
                          onClick={() => KeyboardArrowLeftClick(page)}
                        >
                          <ArrowBackIosIcon
                            className={classes.paginationStyle}
                          />
                        </IconButton>
                      </LightTooltip>
                    </td>
                    <td className={classes.paginationStyle}>
                      <input
                        style={{
                          maxWidth: 18,
                          color: crSnow,
                          textAlign: "center",
                          border: "0.5px solid snow",
                          backgroundColor: crSnowBlue,
                        }}
                        value={page}
                        onChange={handlePageChange}
                      ></input>
                    </td>
                    <td>
                      <LightTooltip title="Переход на следующую страницу">
                        <IconButton
                          onClick={() => KeyboardArrowRightClick(page)}
                        >
                          <ArrowForwardIosIcon
                            className={classes.paginationStyle}
                          />
                        </IconButton>
                      </LightTooltip>
                    </td>
                    <td className={classes.paginationStyle}>
                      Кол-во строк: {totalCount}
                    </td>
                  </tr>
                </Grid>
              </Paper>
              {/* </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={0}
            > */}
              {/* <Paper
                style={{
                  backgroundColor: crSnowGrey,
                  width: 380,
                }}
              >
                <table id={gridTableId} size="auto">
                  <thead size="auto"></thead>
                </table>
                <tfoot>
                  <tr>
                    <td>
                      <LightTooltip title="Переход на первую страницу">
                        <IconButton onClick={() => KeyboardArrowFirstClick()}>
                          <FirstPageIcon
                            style={{ fontSize: 18, color: crSnowBlue }}
                          />
                        </IconButton>
                      </LightTooltip>
                    </td>
                    <td>
                      <LightTooltip title="Переход на предыдущую страницу">
                        <IconButton
                          onClick={() => KeyboardArrowLeftClick(page)}
                        >
                          <ArrowBackIosIcon
                            className={classes.paginationStyle}
                          />
                        </IconButton>
                      </LightTooltip>
                    </td>
                    <td className={classes.paginationStyle}>
                      <input
                        style={{
                          maxWidth: 18,
                          color: crSnow,
                          textAlign: "center",
                          border: "0.5px solid snow",
                          backgroundColor: crSnowBlue,
                        }}
                        value={page}
                        onChange={handlePageChange}
                      ></input>
                    </td>
                    <td>
                      <LightTooltip title="Переход на следующую страницу">
                        <IconButton
                          onClick={() => KeyboardArrowRightClick(page)}
                        >
                          <ArrowForwardIosIcon
                            className={classes.paginationStyle}
                          />
                        </IconButton>
                      </LightTooltip>
                    </td>
                    <td className={classes.paginationStyle}>
                      Кол-во строк: {totalCount}
                    </td>
                  </tr>
                </tfoot>
              </Paper> */}
            </Grid>
          )}
          <Snackbar
            open={showSnackBar}
            autoHideDuration={1200}
            onClose={() => handleCloseSnackBar()}
          >
            <Alert severity="error">
              <strong>{snackBarMessage}</strong>
            </Alert>
          </Snackbar>
        </Grid>
      );
    } catch (er) {
      console.log("ERROR", er);
      return <CircularProgress color="secondary" />;
    }
  }
};
