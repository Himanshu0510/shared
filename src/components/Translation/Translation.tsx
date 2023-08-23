import React, { useEffect, useState } from "react";
import axios from "axios";

const Translate = (prop: any) => {
  const [selectLanguage, setSelectLanguage] = useState(
    JSON.stringify(sessionStorage.getItem("Language"))
  );
  const [languageAPIData, setLanguageAPIData] = useState<any>();
  const [isMandatory, setIsMandatory] = useState<any>([]);
  const [languageData, setLanguageData] = useState<any>();
  const [finalValue, setFinalValue] = useState<any>();
  const [menuItemId, setMenuItemId] = useState(
    sessionStorage.getItem("menuItemId")
  );
  const screenConfigration = async () => {
    const languageDataLocal = JSON.parse(
      JSON.stringify(sessionStorage.getItem("LanguageData"))
    );

    if (
      languageDataLocal != null &&
      sessionStorage.getItem("updateSessionStorage") === "N"
    ) {
      // languageDataLocal.translations.forEach(element => {
      //   setLanguageData(null);
      //   if (element.languageCode === selectLanguage && element.texts.length > 0) {
      //     element.texts.forEach(e => {
      //       languageData.push(e);
      //     });
      //   } else {
      //     languageData.push(languageDataLocal.translations[0]);
      //   }
      // });

      fetchData();
    } else {
      const getDataSC = await axios.get(
        `/api/screen-configurations/getAllScreenConfigurationsAndScreenControlValidations/${menuItemId}/${
          sessionStorage.getItem("lastSyncTime")
            ? sessionStorage.getItem("lastSyncTime")
            : 0
        }`
      );

      setLanguageAPIData(getDataSC.data.languageDetails);
      sessionStorage.setItem("lastSyncTime", getDataSC.data.lastSyncTime);
      sessionStorage.setItem("LanguageData", JSON.stringify(getDataSC.data));

      // getDataSC.data.languageDetails.translations.forEach(element => {
      //   setLanguageData(null);
      //   if (element.languageCode === selectLanguage && element.texts.length > 0) {
      //     element.texts.forEach(e => {
      //       languageData.push(e);
      //     });
      //   } else {
      //     languageData.push(getDataSC.data.languageDetails.translations[0]);
      //   }
      // });

      fetchData();
    }
  };
  useEffect(() => {
    fetchData();
  }, [""]);
  const astrick = "*";
  const fetchData = () => {
    const languageDataLocal = JSON.parse(
      JSON.stringify(sessionStorage.getItem("LanguageData"))
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

    // languageData.map(e => {
    //   if (e.key === prop.contentKey) {
    //     setFinalValue(e.value);
    //   }
    // });console.log(finalValue + element);
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
