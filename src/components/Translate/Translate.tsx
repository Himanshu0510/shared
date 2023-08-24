import React from "react";
import axios from "axios";
import { isFieldMandatory } from "./validationMethod";

const Translate = (prop: any) => {
  const [selectLanguage, setSelectLanguage] = React.useState(
    sessionStorage.getItem("Language")
  );
  const [languageAPIData, setLanguageAPIData] = React.useState<any>();
  const [isMandatory, setIsMandatory] = React.useState<any>([]);
  const [languageData, setLanguageData] = React.useState<any>();
  const [finalValue, setFinalValue] = React.useState<any>();
  const [menuItemId, setMenuItemId] = React.useState(
    sessionStorage.getItem("menuItemId")
  );
  React.useEffect(() => {
    fetchData();
  }, [""]);
  const astrick = "*";
  const fetchData = () => {
    const languageDataLocal = JSON.parse(
      sessionStorage.getItem("LanguageData")
    );
    if (languageDataLocal["translations"][selectLanguage][prop.contentKey])
      setFinalValue(
        languageDataLocal["translations"][selectLanguage][prop.contentKey][
          "text"
        ]
      );
    setIsMandatory(
      languageDataLocal["translations"][selectLanguage][prop.contentKey]
    );
  };

  return (
    <>
      {isMandatory != undefined ? <span>{isMandatory.text} </span> : ""}
      {isMandatory != undefined ? (
        isMandatory.mandatory === true ? (
          <span className="reqsign">*</span>
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </>
  );
};

export default Translate;
