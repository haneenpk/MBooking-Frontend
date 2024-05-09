import React, { useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from "../../api/shared/instance";
import { useDispatch } from 'react-redux';
import { resetTheaterState } from '../../redux/slices/theaterSlice';

const MovieTicketBooking = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const seatId = queryParams.get("seatId");
  const role = queryParams.get("role");
  const theaterId = queryParams.get("theaterId");

  const [error, setError] = useState(null);

  // State for diamond category seats
  const [diamondRows, setDiamondRows] = useState({});

  // State for gold category seats
  const [goldRows, setGoldRows] = useState({});

  // State for silver category seats
  const [silverRows, setSilverRows] = useState({});

  const [screenData, setScreenData] = useState({})

  const [updated, setUpdated] = useState('')

  const applyChange = async () => {
    console.log("fir: ", screenData);
    try {
      if(role === "theater"){
        const responseScreen = await Axios.put(`/api/theater/screens/seat/update/${seatId}`, { screenData });
        console.log(responseScreen);
        setUpdated('Updated Successfully')
        setTimeout(() => {
          navigate('/theater/screens')
        },1000)
      }else{
        const responseScreen = await Axios.put(`/api/admin/screens/seat/update/${seatId}`, { screenData });
        console.log(responseScreen);
        setUpdated('Updated Successfully')
        setTimeout(() => {
          navigate(`/admin/theater-screens?theaterId=${theaterId}`)
        },1000)
      }

    } catch (error) {
      console.log(error);
    }

  }
  // Function to handle seat selection
  const handleSeatSelection = (row, seatNum, index, category) => {

    let updatedRows;
    if (category === "diamond") {
      updatedRows = { ...diamondRows };
    } else if (category === "gold") {
      updatedRows = { ...goldRows };
    } else {
      updatedRows = { ...silverRows };
    }

    console.log("Ind: ", index, row);
    if (index !== -1 && seatNum !== 0) {
      updatedRows[row][index] = 0; // Change the clicked seat number to 0
      for (let i = index + 1; i < updatedRows[row].length; i++) {
        if (updatedRows[row][i] !== 0) {
          updatedRows[row][i] -= 1; // Shift subsequent seat numbers
        }
      }
    } else if (seatNum === 0) {
      let prevValue = 0;
      for (let i = 0; i < updatedRows[row].length; i++) {
        console.log("Start: ", prevValue);
        if (updatedRows[row][i] !== 0 && i < index) {
          prevValue = updatedRows[row][i]
          updatedRows[row][i] = prevValue;
        }
        if (updatedRows[row][i] !== 0 && i > index) {
          updatedRows[row][i] = ++prevValue;
        }
        if (i === index) {
          updatedRows[row][i] = ++prevValue;
        }
        console.log("End: ", prevValue);
      }
    }

    if (category === "diamond") {
      setDiamondRows(updatedRows);
    } else if (category === "gold") {
      setGoldRows(updatedRows);
    } else {
      setSilverRows(updatedRows);
    }
  };

  const addRow = (category) => {
    console.log(Object.entries(diamondRows)[0][1].length);
    let updatedRows;
    let newRow;
    let alphaLeng;
    let updatedGoldRows = { ...goldRows };
    let updatedSilverRows = { ...silverRows };
    let silverKeys
    let updateScreenData = { ...screenData };

    switch (category) {
      case 'diamond':
        newRow = String.fromCharCode(65 + Object.keys(diamondRows).length); // Get the next alphabet
        updatedRows = { ...diamondRows, [newRow]: Array.from({ length: Object.entries(diamondRows)[0][1].length }, (_, i) => i + 1) };
        setDiamondRows(updatedRows);

        updateScreenData.diamond.seats = updatedRows

        alphaLeng = 65 + Object.keys(diamondRows).length + 1;

        // Removing the first object in goldRows
        const goldKeys = Object.keys(updatedGoldRows);
        if (goldKeys.length > 0) {
          delete updatedGoldRows[goldKeys[0]];
        }

        // Removing the first object in silverRows
        silverKeys = Object.keys(updatedSilverRows);
        if (silverKeys.length > 0) {
          delete updatedSilverRows[silverKeys[0]];
        }

        for (let key in goldRows) {
          let alpha = String.fromCharCode(alphaLeng);
          updatedGoldRows[alpha] = goldRows[key];
          alphaLeng += 1;
        }

        for (let key in silverRows) {
          let alpha = String.fromCharCode(alphaLeng);
          updatedSilverRows[alpha] = silverRows[key];
          alphaLeng += 1;
        }

        setGoldRows(updatedGoldRows);
        setSilverRows(updatedSilverRows);

        updateScreenData.gold.seats = updatedGoldRows
        updateScreenData.silver.seats = updatedSilverRows

        setScreenData(updateScreenData)

        break;
      case 'gold':
        newRow = String.fromCharCode(65 + Object.keys(diamondRows).length + Object.keys(goldRows).length); // Get the next alphabet
        updatedRows = { ...goldRows, [newRow]: Array.from({ length: Object.entries(diamondRows)[0][1].length }, (_, i) => i + 1) };
        setGoldRows(updatedRows);

        updateScreenData.gold.seats = updatedRows

        alphaLeng = 65 + Object.keys(diamondRows).length + 1 + Object.keys(goldRows).length;
        updatedSilverRows = { ...silverRows };

        // Removing the first object in silverRows
        silverKeys = Object.keys(updatedSilverRows);
        if (silverKeys.length > 0) {
          delete updatedSilverRows[silverKeys[0]];
        }

        for (let key in silverRows) {
          let alpha = String.fromCharCode(alphaLeng);
          updatedSilverRows[alpha] = silverRows[key];
          alphaLeng += 1;
        }

        setSilverRows(updatedSilverRows);

        updateScreenData.silver.seats = updatedSilverRows

        setScreenData(updateScreenData)

        break;
      case 'silver':
        newRow = String.fromCharCode(65 + Object.keys(diamondRows).length + Object.keys(goldRows).length + Object.keys(silverRows).length); // Get the next alphabet
        updatedRows = { ...silverRows, [newRow]: Array.from({ length: Object.entries(diamondRows)[0][1].length }, (_, i) => i + 1) };
        setSilverRows(updatedRows);

        updateScreenData.silver.seats = updatedRows

        setScreenData(updateScreenData)

        break;
      default:
        break;
    }

  };

  const deleteRow = (category) => {
    let updatedRows;
    if (category === "diamond") {
      updatedRows = { ...diamondRows };
    } else if (category === "gold") {
      updatedRows = { ...goldRows };
    } else {
      updatedRows = { ...silverRows };
    }

    let lastKey = Object.keys(updatedRows)[Object.keys(updatedRows).length - 1].charCodeAt(0)

    delete updatedRows[Object.keys(updatedRows)[Object.keys(updatedRows).length - 1]];

    let updatedGoldRows = { ...goldRows };
    let updatedSilverRows = { ...silverRows };
    let updateScreenData = { ...screenData };

    let alphaLeng;

    if (category === "diamond") {

      setDiamondRows(updatedRows);

      updateScreenData.diamond.seats = updatedRows

      alphaLeng = lastKey;

      for (let key in goldRows) {
        let alpha = String.fromCharCode(alphaLeng);
        updatedGoldRows[alpha] = goldRows[key];
        delete updatedGoldRows[key];
        alphaLeng += 1;
      }

      for (let key in silverRows) {
        let alpha = String.fromCharCode(alphaLeng);
        updatedSilverRows[alpha] = silverRows[key];
        delete updatedSilverRows[key];
        alphaLeng += 1;
      }

      setGoldRows(updatedGoldRows);
      setSilverRows(updatedSilverRows);

      console.log(updatedGoldRows);
      console.log(updatedSilverRows);

      updateScreenData.gold.seats = updatedGoldRows
      updateScreenData.silver.seats = updatedSilverRows

      setScreenData(updateScreenData)

    } else if (category === "gold") {

      setGoldRows(updatedRows);

      updateScreenData.gold.seats = updatedRows

      alphaLeng = lastKey;

      for (let key in silverRows) {
        let alpha = String.fromCharCode(alphaLeng);
        updatedSilverRows[alpha] = silverRows[key];
        delete updatedSilverRows[key];
        alphaLeng += 1;
      }

      setSilverRows(updatedSilverRows);

      updateScreenData.silver.seats = updatedSilverRows

      setScreenData(updateScreenData)

    } else {
      setSilverRows(updatedRows);

      updateScreenData.silver.seats = updatedRows

      setScreenData(updateScreenData)
    }
  };

  useLayoutEffect(() => {

    const fetchTheaterScreenData = async () => {
      try {

        let responseScreen;
        if(role === "theater"){
          responseScreen = await Axios.get(`/api/theater/screens/seat/${seatId}`);
        }else{
          responseScreen = await Axios.get(`/api/admin/screens/seat/${seatId}`);
        }

        setDiamondRows(responseScreen.data.data.diamond.seats)
        setGoldRows(responseScreen.data.data.gold.seats)
        setSilverRows(responseScreen.data.data.silver.seats)
        setScreenData(responseScreen.data.data)

      } catch (error) {
        setError(error);
      }
    };

    fetchTheaterScreenData();

  }, [])

  if (error) {
    if (error.response && error.response.data.message === "You are blocked") {
      localStorage.removeItem('theaterData');
      localStorage.removeItem('theaterAccessToken');
      dispatch(resetTheaterState());
      console.log("Your account is blocked");
      navigate("/theater/login")
    }
  }

  const renderSeats = (row, category) => {
    const seats = [];
    for (let i = 0; i < row[1].length; i++) {
      const seatId = `${row[0]}${row[1][i]}`; // Concatenate row and seat number
      seats.push(
        <div className="inline-block mx-auto">
          <button
            onClick={() => handleSeatSelection(row[0], row[1][i], i, category)}
            className={`w-7 h-7 border rounded-md flex items-center justify-center ${row[1][i] === 0 ? 'bg-blue-500 text-white' : 'border-gray-300'
              }`}
          >
            <span className='text-xl text-center mb-1'>{row[1][i] === 0 ? '+' : '-'}</span>
          </button>
          <label htmlFor={seatId} className="text-xs ml-1 text-center ">
            {row[1][i]}
          </label>
        </div>
      );
    }
    return seats;
  };

  return (
    <div className="container mx-auto mt-8 px-10">
      <button onClick={applyChange} className="px-2 py-1 mb-4 bg-blue-500 text-white rounded hover:bg-blue-400">Apply Changes</button>
      <span className='text-green-500 font-semibold ml-2'>{updated}</span>
      <div className="mb-4 bg-white rounded-lg shadow-md p-3">
        <h2 className="text-lg font-bold text-center mb-2">Diamond</h2>

        {Object.entries(diamondRows).map(row => (
          <div key={row[0]} className="flex items-center mb-4">
            <span className="text-base ml-1 font-bold mb-4 w-4">{row[0]}</span>
            {renderSeats(row, 'diamond')}
          </div>
        ))}
        <div className='ml-4 mt-4'>
          <button onClick={() => deleteRow('diamond')} className="mr-2 px-1 py-1 bg-red-500 text-white rounded">
            Delete Row
          </button>
          <button onClick={() => addRow('diamond')} className="px-2 py-1 bg-green-500 text-white rounded">
            Add Row
          </button>
        </div>
      </div>
      <div className="mb-4 bg-white rounded-lg shadow-md p-3">
        <h2 className="text-lg font-bold mb-2 text-center">Gold</h2>
        {Object.entries(goldRows).map(row => (
          <div key={row[0]} className="flex items-center mb-4">

            <span className="text-base ml-1 font-bold mb-4 w-4">{row[0]}</span>
            {renderSeats(row, 'gold')}
          </div>
        ))}
        <button onClick={() => deleteRow('gold')} className="mr-2 px-1 py-1 bg-red-500 text-white rounded">
          Delete Row
        </button>
        <button onClick={() => addRow('gold')} className="px-2 py-1 bg-green-500 text-white rounded">
          Add Row
        </button>
      </div>
      <div className="mb-4 bg-white rounded-lg shadow-md p-3">
        <h2 className="text-lg font-bold mb-2 text-center">Silver</h2>
        {Object.entries(silverRows).map(row => (
          <div key={row[0]} className="flex items-center mb-4">

            <span className="text-base ml-1 font-bold mb-4 w-4">{row[0]}</span>
            {renderSeats(row, 'silver')}
          </div>
        ))}
        <button onClick={() => deleteRow('silver')} className="mr-2 px-1 py-1 bg-red-500 text-white rounded">
          Delete Row
        </button>
        <button onClick={() => addRow('silver')} className="px-2 py-1 bg-green-500 text-white rounded">
          Add Row
        </button>
      </div>
      <div className="mb-4 text-center pt-4">
        <div className=" p-4 mx-auto" style={{ maxWidth: '408px' }}>
          <svg width="376" height="44" viewBox="0 0 376 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="376" height="44" />
            <path d="M334.718 2.00062C228 10.0004 148 10.0004 39.6559 2.00062L16 30.9996C148 38.9999 228 38.9999 360 30.9996L334.718 2.00062Z" fill="white" />
            <path d="M16 30.9996L39.6559 2.00062C148 10.0004 228 10.0004 334.718 2.00062L360 30.9996M16 30.9996L19.0003 35.9999C148 44 228 44 357 35.9999L360 30.9996M16 30.9996C148 38.9999 228 38.9999 360 30.9996" stroke="#101010" stroke-opacity="0.22" />
            <path d="M332 5.49907C229 13.0005 145.5 13.0005 42.5 5.5009L23 28.5009C143 36.5005 232 36.501 351.923 28.4991L332 5.49907Z" fill="#E0F6FA" />
            <path d="M138.715 26.6758C140.525 26.6758 141.645 25.8145 141.645 24.4434V24.4375C141.645 23.3652 140.977 22.7734 139.424 22.4688L138.645 22.3105C137.766 22.1348 137.402 21.8418 137.402 21.3672C137.402 20.7988 137.93 20.4531 138.709 20.4531C139.506 20.4473 140.021 20.8164 140.115 21.3379L140.127 21.3965H141.504L141.498 21.332C141.404 20.1895 140.396 19.334 138.709 19.334C137.098 19.334 135.943 20.1895 135.943 21.4551V21.4609C135.943 22.5156 136.594 23.1895 138.111 23.4824L138.891 23.6406C139.816 23.8223 140.18 24.1094 140.18 24.5898C140.18 25.1641 139.6 25.5625 138.756 25.5625C137.877 25.5625 137.256 25.1875 137.203 24.6309L137.197 24.584H135.785L135.791 24.6543C135.879 25.8789 136.98 26.6758 138.715 26.6758ZM146.727 26.6758C148.467 26.6758 149.715 25.709 149.885 24.2852V24.2383H148.461L148.449 24.2676C148.279 25.0293 147.623 25.5156 146.727 25.5156C145.537 25.5156 144.799 24.5547 144.799 23.0078V22.9961C144.799 21.4551 145.537 20.4941 146.721 20.4941C147.617 20.4941 148.285 21.0332 148.455 21.8418L148.461 21.8652H149.879L149.885 21.8125C149.727 20.3652 148.443 19.334 146.721 19.334C144.605 19.334 143.305 20.7344 143.305 23.002V23.0137C143.305 25.2754 144.611 26.6758 146.727 26.6758ZM151.844 26.5H153.303V23.9043H154.627L156.016 26.5H157.674L156.109 23.6992C156.959 23.3945 157.457 22.627 157.457 21.7188V21.707C157.457 20.3594 156.508 19.5098 154.861 19.5098H151.844V26.5ZM153.303 22.8965V20.5879H154.686C155.477 20.5879 155.963 21.0332 155.963 21.7363V21.748C155.963 22.4688 155.494 22.8965 154.709 22.8965H153.303ZM159.551 26.5H164.373V25.375H161.01V23.4883H164.186V22.4277H161.01V20.6348H164.373V19.5098H159.551V26.5ZM166.508 26.5H171.33V25.375H167.967V23.4883H171.143V22.4277H167.967V20.6348H171.33V19.5098H166.508V26.5ZM173.465 26.5H174.865V21.8535H174.93L178.41 26.5H179.641V19.5098H178.234V24.1504H178.17L174.695 19.5098H173.465V26.5ZM187.438 26.5H188.902V20.6348H191.123V19.5098H185.217V20.6348H187.438V26.5ZM193.012 26.5H194.471V23.5117H197.863V26.5H199.322V19.5098H197.863V22.3809H194.471V19.5098H193.012V26.5ZM201.645 26.5H203.104V19.5098H201.645V26.5ZM208.016 26.6758C209.826 26.6758 210.945 25.8145 210.945 24.4434V24.4375C210.945 23.3652 210.277 22.7734 208.725 22.4688L207.945 22.3105C207.066 22.1348 206.703 21.8418 206.703 21.3672C206.703 20.7988 207.23 20.4531 208.01 20.4531C208.807 20.4473 209.322 20.8164 209.416 21.3379L209.428 21.3965H210.805L210.799 21.332C210.705 20.1895 209.697 19.334 208.01 19.334C206.398 19.334 205.244 20.1895 205.244 21.4551V21.4609C205.244 22.5156 205.895 23.1895 207.412 23.4824L208.191 23.6406C209.117 23.8223 209.48 24.1094 209.48 24.5898C209.48 25.1641 208.9 25.5625 208.057 25.5625C207.178 25.5625 206.557 25.1875 206.504 24.6309L206.498 24.584H205.086L205.092 24.6543C205.18 25.8789 206.281 26.6758 208.016 26.6758ZM218.115 26.5H219.492L220.904 21.6426H220.986L222.404 26.5H223.775L225.727 19.5098H224.221L223.049 24.6367H222.967L221.572 19.5098H220.318L218.941 24.6367H218.865L217.682 19.5098H216.164L218.115 26.5ZM226.514 26.5H228.043L228.617 24.748H231.236L231.811 26.5H233.346L230.773 19.5098H229.08L226.514 26.5ZM229.883 20.8574H229.971L230.902 23.7168H228.951L229.883 20.8574ZM236.4 26.5H237.865V23.8105L240.426 19.5098H238.844L237.186 22.4805H237.092L235.428 19.5098H233.846L236.4 23.8105V26.5Z" fill="#101010" fill-opacity="0.54" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MovieTicketBooking;