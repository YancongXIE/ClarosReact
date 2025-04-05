export function DropdownMonth() {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        Month
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <a>January</a>
        </li>
        <li>
          <a>February</a>
        </li>
        <li>
          <a>March</a>
        </li>
        <li>
          <a>April</a>
        </li>
        <li>
          <a>May</a>
        </li>
        <li>
          <a>June</a>
        </li>
        <li>
          <a>July</a>
        </li>
        <li>
          <a>August</a>
        </li>
        <li>
          <a>September</a>
        </li>
        <li>
          <a>October</a>
        </li>
        <li>
          <a>November</a>
        </li>
        <li>
          <a>December</a>
        </li>
      </ul>
    </div>
  );
}

export function DropdownSeason() {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        Season
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <a>Summer</a>
        </li>
        <li>
          <a>Autumn</a>
        </li>
        <li>
          <a>Winter</a>
        </li>
        <li>
          <a>Spring</a>
        </li>
      </ul>
    </div>
  );
}

export function DropdownYear() {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        Year
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <a>2024</a>
        </li>
        <li>
          <a>2023</a>
        </li>
        <li>
          <a>2022</a>
        </li>
        <li>
          <a>2021</a>
        </li>
        <li>
          <a>2020</a>
        </li>
        <li>
          <a>2019</a>
        </li>
      </ul>
    </div>
  );
}

// others available: https://daisyui.com/components/dropdown/
