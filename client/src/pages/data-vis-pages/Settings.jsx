import React from "react";
import { useState, useEffect } from "react";
import AccountDetails from "../../sections/data-vis-sections/settings/AccountDetails";
import BillingInformation from "../../sections/data-vis-sections/settings/BillingInformation";
import { useFetchUserData } from "../../../src/api/hooks/useFetchUserData";
import DeleteAccount from "../../sections/data-vis-sections/DeleteAccount/DeleteAccount";

const Settings = () => {
  // Object to keep track of open sections
  const [openSections, setOpenSections] = useState({
    accountDetails: true,
    billingInformation: true,
    deleteAccount: true,
  });

  // Function to toggle the section
  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // Fetch user profile data
  const {
    data,
    loading,
    error: fetchError,
  } = useFetchUserData("/users/profile");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  return (
    <>
      <div className="ml-10">
        <h1 className="text-3xl font-bold text-primary-content pl-4 pb-4">
          Settings
        </h1>
        <div
          className={`collapse ${openSections.accountDetails ? "collapse-open" : "collapse-close"
            } bg-base-200 collapse-arrow lg:w-[900px] sm:w-full`}
        >
          {/* Title - Toggles the Collapse */}
          <div
            className="collapse-title text-xl font-medium cursor-pointer text-primary-content"
            onClick={() => toggleSection("accountDetails")}
          >
            Account Details
            <div className="bg-black h-[1px] mt-2 mb-0 bg-primary-content"></div>
          </div>

          <AccountDetails data={data} />
        </div>
      </div>
      <div className="ml-10">
        <div
          className={`collapse ${openSections.billingInformation ? "collapse-open" : "collapse-close"
            } bg-base-200 collapse-arrow lg:w-[900px] sm:w-full`}
        >
          <div
            className="collapse-title text-xl font-medium cursor-pointer text-primary-content"
            onClick={() => toggleSection("billingInformation")}
          >
            Research projects
            <div className="bg-black h-[1px] mt-2 mb-0 bg-primary-content"></div>
          </div>

          <BillingInformation data={data} />
        </div>
      </div>
      <div className="ml-10">
        <div
          className={`collapse ${openSections.deleteAccount ? "collapse-open" : "collapse-close"
            } bg-base-200 collapse-arrow lg:w-[900px] sm:w-full`}
        >
          <div
            className="collapse-title text-xl font-medium cursor-pointer text-primary-content"
            onClick={() => toggleSection("deleteAccount")}
          >
            Delete Account
            <div className="bg-black h-[1.5px] mt-2 mb-0 bg-primary-content"></div>
          </div>

          <div className="collapse-content">
            <DeleteAccount />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
