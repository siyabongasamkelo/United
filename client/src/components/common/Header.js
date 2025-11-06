import React from "react";
import { HeaderWrapper, Links } from "./Header.styled";
import { Link } from "react-router-dom";
import Button from "./Button";
import { List } from "react-bootstrap-icons";

const Header = () => {
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
            <Link>Our Mission</Link>
          </li>
          <li>
            <Link>Reviews</Link>
          </li>
        </ul>
      </Links>

      <Button>Contact Us</Button>
      <List />
    </HeaderWrapper>
  );
};

export default Header;
