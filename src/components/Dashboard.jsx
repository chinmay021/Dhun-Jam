import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ADMIN_DETAILS_URL } from "../constants";
import Graph from "./Graph";

function Dashboard() {
  const [chargeForSong, setChargeForSong] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [customRequestAmount, setCustomRequestAmount] = useState(0);
  const [regularRequestAmount, setRegularRequestAmount] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let location = useLocation();
  const navigate = useNavigate();
  // console.log(location.state.id);
  const id = location?.state?.id;
  // console.log(id);
  const url = `${ADMIN_DETAILS_URL}/${id}`;

  if (id === undefined) {
    navigate("/");
  }

  function checkDisabledStatus() {
    let disabled = false;
    if (
      chargeForSong === "no" ||
      customRequestAmount < 99 ||
      regularRequestAmount[0] < 79 ||
      regularRequestAmount[1] < 59 ||
      regularRequestAmount[2] < 39 ||
      regularRequestAmount[3] < 19 ||
      loading
    ) {
      disabled = true;
    }
    return disabled;
  }

  function formGraphData() {
    let graphData = [];

    graphData.push({ name: "Custom", value: customRequestAmount });
    graphData.push({ name: "Category1", value: regularRequestAmount[0] });
    graphData.push({ name: "Category2", value: regularRequestAmount[1] });
    graphData.push({ name: "Category3", value: regularRequestAmount[2] });
    graphData.push({ name: "Category4", value: regularRequestAmount[3] });
    return graphData;
  }

  async function handleDashboardSubmit(e) {
    e.preventDefault();
    if (checkDisabledStatus()) {
      return;
    }
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        charge_customers: chargeForSong === "yes" ? true : false,
        amount: {
          category_6: customRequestAmount,
          category_7: regularRequestAmount[0],
          category_8: regularRequestAmount[1],
          category_9: regularRequestAmount[2],
          category_10: regularRequestAmount[3],
        },
      }),
    });
    const json = await response.json();
    if (response.status === 200) {
      setSubmitted(true);
    } else {
      setError(json.ui_err_msg);
    }
  }

  useEffect(() => {
    async function getAdminDetails() {
      const res = await fetch(url);
      const json = await res.json();
      setAdminData(json.data);
 
      setChargeForSong(json.data.charge_customers ? "yes" : "no");
      setCustomRequestAmount(Number(json.data.amount.category_6));
      setRegularRequestAmount([
        Number(json.data.amount.category_7),
        Number(json.data.amount.category_8),
        Number(json.data.amount.category_9),
        Number(json.data.amount.category_10),
      ]);
      setLoading(false);
    }
    setLoading(true);
    getAdminDetails();
  }, [url, submitted]);

  return (
    <>
      {adminData && (
        <div className=" bg-[#030303] text-white w-screen min-h-screen  py-10 text-[16px] ">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[32px] w-[600px] text-center font-bold pb-8">
              {adminData.name}, {adminData.location} on Dhun Jam
            </h1>
            <form onSubmit={handleDashboardSubmit} className="w-[600px]">
              <div className="flex justify-between mb-8 ">
                <label htmlFor="charge" className="w-1/2">
                  Do you want to charge your customers for requesting songs?
                </label>
                <div className="flex items-center w-[300px] justify-center">
                  <input
                    className="h-4 w-4 checked:bg-[#6741D9]"
                    type="radio"
                    id="charge-yes"
                    name="charge"
                    required={true}
                    value="yes"
                    disabled={loading ? true : false}
                    checked={chargeForSong === "yes"}
                    onChange={(event) => {
                      setChargeForSong(event.target.value);
                    }}
                  />
                  <label htmlFor="charge-yes" className="pr-8 pl-2">
                    Yes
                  </label>
                  <input
                    className="checked:bg-[#6741D9] h-4 w-4"
                    type="radio"
                    id="charge-no"
                    name="charge"
                    required={true}
                    disabled={loading ? true : false}
                    value="no"
                    checked={chargeForSong === "no"}
                    onChange={(event) => {
                      setChargeForSong(event.target.value);
                    }}
                  />
                  <label htmlFor="charge-yes " className="pr-8 pl-2">
                    No
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between mb-8">
                <label htmlFor="custom-request" className="">
                  Custom Song request amount-
                </label>
                <input
                  className="bg-[#030303] border rounded-2xl p-2 w-[300px] focus:outline-none text-center disabled:border-[#c2c2c2] 2] disabled:text-[#c2c2c2]"
                  disabled={chargeForSong === "no" || loading ? true : false}
                  type="number"
                  min={99}
                  value={customRequestAmount}
                  onChange={(event) => {
                    setCustomRequestAmount(event.target.value);
                  }}
                  id="custom-request"
                  required={chargeForSong === "yes" ? true : false}
                />
              </div>
              <div className="flex items-center justify-between gap-8 ">
                <label htmlFor="regular-request" className="w-1/2">
                  Regular song request amounts, from high to low-
                </label>
                <div className="flex justify-between gap-2 items-center w-[300px] ">
                  <input
                    className="bg-[#030303] w-[70px] border rounded-xl p-2 focus:outline-none text-center disabled:border-[#c2c2c2] 2] disabled:text-[#c2c2c2] "
                    disabled={chargeForSong === "no" || loading ? true : false}
                    type="number"
                    id="regular-request"
                    value={regularRequestAmount[0]}
                    min={79}
                    onChange={(event) => {
                      setRegularRequestAmount([
                        event.target.value,
                        regularRequestAmount[1],
                        regularRequestAmount[2],
                        regularRequestAmount[3],
                      ]);
                    }}
                    required={chargeForSong === "yes" ? true : false}
                  />
                  <input
                    className="bg-[#030303] w-[70px] border rounded-2xl p-2 focus:outline-none text-center disabled:border-[#c2c2c2] 2] disabled:text-[#c2c2c2]"
                    disabled={chargeForSong === "no" || loading ? true : false}
                    type="number"
                    id="regular-request"
                    min={59}
                    value={regularRequestAmount[1]}
                    onChange={(event) => {
                      setRegularRequestAmount([
                        regularRequestAmount[0],
                        event.target.value,
                        regularRequestAmount[2],
                        regularRequestAmount[3],
                      ]);
                    }}
                    required={chargeForSong === "yes" ? true : false}
                  />
                  <input
                    className="bg-[#030303] w-[70px] border rounded-2xl p-2 focus:outline-none text-center disabled:border-[#c2c2c2] 2] disabled:text-[#c2c2c2]"
                    disabled={chargeForSong === "no" || loading ? true : false}
                    type="number"
                    min={39}
                    id="regular-request"
                    value={regularRequestAmount[2]}
                    onChange={(event) => {
                      setRegularRequestAmount([
                        regularRequestAmount[0],
                        regularRequestAmount[1],
                        event.target.value,
                        regularRequestAmount[3],
                      ]);
                    }}
                    required={chargeForSong === "yes" ? true : false}
                  />
                  <input
                    className="bg-[#030303] w-[70px] border rounded-2xl p-2 focus:outline-none text-center disabled:border-[#c2c2c2] 2] disabled:text-[#c2c2c2]"
                    disabled={chargeForSong === "no" || loading ? true : false}
                    type="number"
                    min={19}
                    id="regular-request"
                    value={regularRequestAmount[3]}
                    onChange={(event) => {
                      setRegularRequestAmount([
                        regularRequestAmount[0],
                        regularRequestAmount[1],
                        regularRequestAmount[2],
                        event.target.value,
                      ]);
                    }}
                    required={chargeForSong === "yes" || loading ? true : false}
                  />
                </div>
              </div>
              {chargeForSong === "yes" && (
                <div className="w-full mt-10">
                  <Graph
                    data={formGraphData()}
                    className="w-[600px] h-[400px] bg-green-400"
                  />
                </div>
              )}
              <button
                className="bg-[#6741D9] font-bold  hover:border-[#F0C3F1] rounded-2xl p-3 mt-6 border border-black ease-in-out duration-300 w-full disabled:text-[#c2c2c2] disabled:pointer-events-none "
                disabled={checkDisabledStatus() ? true : false}
              >
                Save
              </button>
            </form>
            <span className="text-red-600 mt-2">{error}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
