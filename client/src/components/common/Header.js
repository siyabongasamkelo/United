import React from "react";
import { HeaderWrapper, Links } from "./Header.styled";
import { Link } from "react-router-dom";
import Button from "./Button";
import { List } from "react-bootstrap-icons";
import { useState } from "react";
import HeaderSlider from "./HeaderSlider";

const Header = () => {
  const [closeMenu, setCloseMenu] = useState(true);
  const [display, setDisplay] = useState("block");
  return (
    <HeaderWrapper>
      <h3>United</h3>
      <Links>
        <ul>
          <li>
            <Link>Home</Link>
          </li>
          <li>
            <Link>About Us</Link>
          </li>
          <li>
            <Link>Our Services</Link>
          </li>
          <li>
            <Link>Client Sectors</Link>
          </li>
          <li>
            <Link>Contact Us</Link>
          </li>
        </ul>
      </Links>

      <Button>Contact Us</Button>

      <List
        onClick={() => {
          closeMenu ? setDisplay("none") : setDisplay("block");
          setCloseMenu(false);
        }}
      />

      <HeaderSlider
        setCloseMenu={() => {
          setCloseMenu(true);
        }}
        closeMenu={closeMenu}
        display={display}
      ></HeaderSlider>
    </HeaderWrapper>
  );
};

export default Header;
